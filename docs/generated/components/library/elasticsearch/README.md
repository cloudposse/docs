---
title: elasticsearch
sidebar_label: elasticsearch
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/elasticsearch/README.md
tags: [terraform, aws, elasticsearch]
---

# Component: `elasticsearch`

This component is responsible for provisioning an Elasticsearch cluster with built-in integrations with Kibana and
Logstash.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    elasticsearch:
      vars:
        enabled: true
        name: foobar
        instance_type: "t3.medium.elasticsearch"
        elasticsearch_version: "7.9"
        encrypt_at_rest_enabled: true
        dedicated_master_enabled: false
        elasticsearch_subdomain_name: "es"
        kibana_subdomain_name: "kibana"
        ebs_volume_size: 40
        create_iam_service_linked_role: true
        kibana_hostname_enabled: true
        domain_hostname_enabled: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/elasticsearch) -
  Cloud Posse's upstream component



