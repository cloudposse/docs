---
title: api-gateway-rest-api
sidebar_label: api-gateway-rest-api
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/api-gateway-rest-api/README.md
tags: [terraform, aws, api-gateway-rest-api]
---

# Component: `api-gateway-rest-api`

This component is responsible for deploying an API Gateway REST API.

## Usage

**Stack Level**: Regional

The following is a snippet for how to use this component:

```yaml
components:
  terraform:
    api-gateway-rest-api:
      vars:
        enabled: true
        name: api
        openapi_config:
          openapi: 3.0.1
          info:
            title: Example API Gateway
            version: 1.0.0
          paths:
            "/":
              get:
                x-amazon-apigateway-integration:
                  httpMethod: GET
                  payloadFormatVersion: 1.0
                  type: HTTP_PROXY
                  uri: https://api.ipify.org
            "/{proxy+}":
              get:
                x-amazon-apigateway-integration:
                  httpMethod: GET
                  payloadFormatVersion: 1.0
                  type: HTTP_PROXY
                  uri: https://api.ipify.org
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/TODO) -
  Cloud Posse's upstream component



