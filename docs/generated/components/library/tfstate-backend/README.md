---
title: tfstate-backend
sidebar_label: tfstate-backend
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/tfstate-backend/README.md
tags: [terraform, aws, tfstate-backend]
---

# Component: `tfstate-backend`

This component is responsible for provisioning an S3 Bucket and DynamoDB table that follow security best practices for
usage as a Terraform backend. It also creates IAM roles for access to the Terraform backend.

Once the initial S3 backend is configured, this component can create additional backends, allowing you to segregate them
and control access to each backend separately. This may be desirable because any secret or sensitive information (such
as generated passwords) that Terraform has access to gets stored in the Terraform state backend S3 bucket, so you may
wish to restrict who can read the production Terraform state backend S3 bucket. However, perhaps counter-intuitively,
all Terraform users require read access to the most sensitive accounts, such as `root` and `audit`, in order to read
security configuration information, so careful planning is required when architecting backend splits.

:::info

Part of cold start, so it has to initially be run with `SuperAdmin`, multiple
times: to create the S3 bucket and then to move the state into it. Follow
the guide **[here](https://docs.cloudposse.com/reference-architecture/how-to-guides/implementation/enterprise/implement-aws-cold-start/#provision-tfstate-backend-component)**
to get started.

:::

### Access Control

For each backend, this module will create an IAM role with read/write access and, optionally, an IAM role with read-only
access. You can configure who is allowed to assume these roles.

- While read/write access is required for `terraform apply`, the created role only grants read/write access to the
  Terraform state, it does not grant permission to create/modify/destroy AWS resources.

- Similarly, while the read-only role prohibits making changes to the Terraform state, it does not prevent anyone from
  making changes to AWS resources using a different role.

- Many Cloud Posse components store information about resources they create in the Terraform state via their outputs,
  and many other components read this information from the Terraform state backend via the CloudPosse `remote-state`
  module and use it as part of their configuration. For example, the `account-map` component exists solely for the
  purpose of organizing information about the created AWS accounts and storing it in its Terraform state, making it
  available via `remote-state`. This means that you if you are going to restrict access to some backends, you need to
  carefully orchestrate what is stored there and ensure that you are not storing information a component needs in a
  backend it will not have access to. Typically, information in the most sensitive accounts, such as `root`, `audit`,
  and `security`, is nevertheless needed by every account, for example to know where to send audit logs, so it is not
  obvious and can be counter-intuitive which accounts need access to which backends. Plan carefully.

- Atmos provides separate configuration for Terraform state access via the `backend` and `remote_state_backend`
  settings. Always configure the `backend` setting with a role that has read/write access (and override that setting to
  be `null` for components deployed by SuperAdmin). If a read-only role is available (only helpful if you have more than
  one backend), use that role in `remote_state_backend.s3.role_arn`. Otherwise, use the read/write role in
  `remote_state_backend.s3.role_arn`, to ensure that all components can read the Terraform state, even if
  `backend.s3.role_arn` is set to `null`, as it is with a few critical components meant to be deployed by SuperAdmin.

- Note that the "read-only" in the "read-only role" refers solely to the S3 bucket that stores the backend data. That
  role still has read/write access to the DynamoDB table, which is desirable so that users restricted to the read-only
  role can still perform drift detection by running `terraform plan`. The DynamoDB table only stores checksums and
  mutual-exclusion lock information, so it is not considered sensitive. The worst a malicious user could do would be to
  corrupt the table and cause a denial-of-service (DoS) for Terraform, but such DoS would only affect making changes to
  the infrastructure, it would not affect the operation of the existing infrastructure, so it is an ineffective and
  therefore unlikely vector of attack. (Also note that the entire DynamoDB table is optional and can be deleted
  entirely; Terraform will repopulate it as new activity takes place.)

- For convenience, the component automatically grants access to the backend to the user deploying it. This is helpful
  because it allows that user, presumably SuperAdmin, to deploy the normal components that expect the user does not have
  direct access to Terraform state, without requiring custom configuration. However, you may want to explicitly
  grant SuperAdmin access to the backend in the `allowed_principal_arns` configuration, to ensure that SuperAdmin
  can always access the backend, even if the component is later updated by the `root-admin` role.

### Quotas

When allowing access to both SAML and AWS SSO users, the trust policy for the IAM roles created by this component can
exceed the default 2048 character limit. If you encounter this error, you can increase the limit by requesting a quota
increase [here](https://us-east-1.console.aws.amazon.com/servicequotas/home/services/iam/quotas/L-C07B4B0D). Note that
this is the IAM limit on "The maximum number of characters in an IAM role trust policy" and it must be configured in the
`us-east-1` region, regardless of what region you are deploying to. Normally 3072 characters is sufficient, and is
recommended so that you still have room to expand the trust policy in the future while perhaps considering how to reduce
its size.

## Usage

**Stack Level**: Regional (because DynamoDB is region-specific), but deploy only in a single region and only in the
`root` account **Deployment**: Must be deployed by SuperAdmin using `atmos` CLI

This component configures the shared Terraform backend, and as such is the first component that must be deployed, since
all other components depend on it. In fact, this component even depends on itself, so special deployment procedures are
needed for the initial deployment (documented in the "Cold Start" procedures).

Here's an example snippet for how to use this component.

```yaml
terraform:
  tfstate-backend:
    backend:
      s3:
        role_arn: null
    settings:
      spacelift:
        workspace_enabled: false
    vars:
      enable_server_side_encryption: true
      enabled: true
      force_destroy: false
      name: tfstate
      prevent_unencrypted_uploads: true
      access_roles:
        default: &tfstate-access-template
          write_enabled: true
          allowed_roles:
            core-identity: ["devops", "developers", "managers", "spacelift"]
            core-root: ["admin"]
          denied_roles: {}
          allowed_permission_sets:
            core-identity: ["AdministratorAccess"]
          denied_permission_sets: {}
          allowed_principal_arns: []
          denied_principal_arns: []
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/tfstate-backend) -
  Cloud Posse's upstream component


