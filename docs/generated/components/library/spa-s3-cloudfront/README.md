---
title: spa-s3-cloudfront
sidebar_label: spa-s3-cloudfront
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/spa-s3-cloudfront/README.md
tags: [terraform, aws, spa-s3-cloudfront]
---

# Component: `spa-s3-cloudfront`

This component is responsible for provisioning:

- S3 bucket
- CloudFront distribution for a Single Page Application
- ACM placed in us-east-1 regardless of the stack region (requirement of CloudFront)

NOTE: The component does not use the ACM created by `dns-delegated`, because the ACM region has to be us-east-1.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

An import for all instantiations of the `spa-s3-cloudfront` component can be created at `stacks/spa/spa-defaults.yaml`:

```yaml
components:
  terraform:
    spa-s3-cloudfront:
      vars:
        # lookup GitHub Runner IAM role via remote state
        github_runners_deployment_principal_arn_enabled: true
        github_runners_component_name: github-runners
        github_runners_tenant_name: core
        github_runners_environment_name: ue2
        github_runners_stage_name: auto
        origin_force_destroy: false
        origin_versioning_enabled: true
        origin_block_public_acls: true
        origin_block_public_policy: true
        origin_ignore_public_acls: true
        origin_restrict_public_buckets: true
        origin_encryption_enabled: true
        cloudfront_index_document: index.html
        cloudfront_ipv6_enabled: false
        cloudfront_compress: true
        cloudfront_default_root_object: index.html
        cloudfront_viewer_protocol_policy: redirect-to-https
```

An import for all instantiations for a specific SPA can be created at `stacks/spa/example-spa.yaml`:

```yaml
components:
  terraform:
    example-spa:
      component: spa-s3-cloudfront
      vars:
        name: example-spa
        site_subdomain: example-spa
        cloudfront_allowed_methods:
          - GET
          - HEAD
        cloudfront_cached_methods:
          - GET
          - HEAD
        cloudfront_custom_error_response:
          - error_caching_min_ttl: 1
            error_code: 403
            response_code: 200
            response_page_path: /index.html
        cloudfront_default_ttl: 60
        cloudfront_min_ttl: 60
        cloudfront_max_ttl: 60
```

Finally, the `spa-s3-cloudfront` component can be instantiated in a stack config:

```yaml
import:
  - spa/example-spa

components:
  terraform:
    example-spa:
      component: spa-s3-cloudfront
      settings:
        spacelift:
          workspace_enabled: true
      vars: {}
```

### Failover Origins

Failover origins are supported via `var.failover_s3_origin_name` and `var.failover_s3_origin_region`.

### Preview Environments

SPA Preview environments (i.e. `subdomain.example.com` mapping to a `/subdomain` path in the S3 bucket) powered by
Lambda@Edge are supported via `var.preview_environment_enabled`. See the both the variable description and inline
documentation for an extensive explanation for how these preview environments work.

### Customizing Lambda@Edge

This component supports customizing Lambda@Edge functions for the CloudFront distribution. All Lambda@Edge function
configuration is deep merged before being passed to the `cloudposse/cloudfront-s3-cdn/aws//modules/lambda@edge` module.
You can add additional functions and overwrite existing functions as such:

```yaml
import:
  - catalog/spa-s3-cloudfront/defaults

components:
  terraform:
    refarch-docs-site-spa:
      metadata:
        component: spa-s3-cloudfront
        inherits:
          - spa-s3-cloudfront-defaults
      vars:
        enabled: true
        lambda_edge_functions:
          viewer_request: # overwrite existing function
            source: null # this overwrites the 404 viewer request source with deep merging
            source_zip: "./dist/lambda_edge_paywall_viewer_request.zip"
            runtime: "nodejs16.x"
            handler: "index.handler"
            event_type: "viewer-request"
            include_body: false
          viewer_response: # new function
            source_zip: "./dist/lambda_edge_paywall_viewer_response.zip"
            runtime: "nodejs16.x"
            handler: "index.handler"
            event_type: "viewer-response"
            include_body: false
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/master/modules/spa-s3-cloudfront) -
  Cloud Posse's upstream component
- [How do I use CloudFront to serve a static website hosted on Amazon S3?](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/)



## CHANGELOG

### Component PRs [#991](https://github.com/cloudposse/terraform-aws-components/pull/991) and [#995](https://github.com/cloudposse/terraform-aws-components/pull/995)

#### Drop `lambda_edge_redirect_404`

This PRs removes the `lambda_edge_redirect_404` functionality because it leads to significat costs. Use native
CloudFront error pages configs instead.

```yaml
cloudfront_custom_error_response:
  - error_code: 404
    response_code: 404
    response_page_path: /404.html
```

### Components PR [#978](https://github.com/cloudposse/terraform-aws-components/pull/978)

#### Lambda@Edge Submodule Refactor

This PR has significantly refactored how Lambda@Edge functions are managed by Terraform with this component. Previously,
the specific use cases for Lambda@Edge functions were handled by submodules `lambda-edge-preview` and
`lambda_edge_redirect_404`. These component submodules both called the same Terraform module,
`cloudposse/cloudfront-s3-cdn/aws//modules/lambda@edge`. These submodules have been replaced with a single Terraform
file, `lambda_edge.tf`.

The reason a single file is better than submodules is (1) simplification and (2) adding the ability to deep merge
function configuration. Cloudfront Distributions support a single Lambda@Edge function for each origin/viewer request or
response. With deep merging, we can define default values for function configuration and provide the ability to
overwrite specific values for a given deployment.

Specifically, our own use case is using an authorization Lambda@Edge viewer request only if the paywall is enabled.
Other deployments use an alternative viewer request to redirect 404.

##### Upgrading with `preview_environment_enabled: true` or `lambda_edge_redirect_404_enabled: true`

If you have `var.preview_environment_enabled` or `var.lambda_edge_redirect_404_enabled` set to `true`, Terraform `moved`
will move the previous resource by submodule to the new resource by file. Please give your next Terraform plan a sanity
check. Any existing Lambda functions _should not be destroyed_ by this change.

##### Upgrading with both `preview_environment_enabled: false` and `lambda_edge_redirect_404_enabled: false`

If you have no Lambda@Edge functions deployed and where both `var.preview_environment_enabled` and
`var.lambda_edge_redirect_404_enabled` are `false` (the default value), no change is necessary.

#### Lambda Runtime Version

The previous PR [#946](https://github.com/cloudposse/terraform-aws-components/pull/946) introduced the
`var.lambda_runtime` input. Previously, the version of node in both submodules was hard-coded to be `nodejs12.x`. This
PR renames that variable to `var.lambda_edge_runtime` and sets the default to `nodejs16.x`.

If you want to maintain the previous version of Node, set `var.lambda_edge_runtime` to `nodejs12.x`, though be aware
that AWS deprecated that version on March 31, 2023, and lambdas using that environment may no longer work. Otherwise,
this component will attempt to deploy the functions with runtime `nodejs16.x`.

- [See all available runtimes here](https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime)
- [See runtime environment deprecation dates here](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtime-support-policy)

