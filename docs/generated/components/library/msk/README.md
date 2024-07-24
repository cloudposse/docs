---
title: msk
sidebar_label: msk
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/msk/README.md
tags: [terraform, aws, msk]
---

# Component: `msk/cluster`

This component is responsible for provisioning [Amazon Managed Streaming](https://aws.amazon.com/msk/) clusters for
[Apache Kafka](https://aws.amazon.com/msk/what-is-kafka/).

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    msk:
      metadata:
        component: "msk"
      vars:
        enabled: true
        name: "msk"
        vpc_component_name: "vpc"
        dns_delegated_component_name: "dns-delegated"
        dns_delegated_environment_name: "gbl"
        # https://docs.aws.amazon.com/msk/latest/developerguide/supported-kafka-versions.html
        kafka_version: "3.4.0"
        public_access_enabled: false
        # https://aws.amazon.com/msk/pricing/
        broker_instance_type: "kafka.m5.large"
        # Number of brokers per AZ
        broker_per_zone: 1
        #  `broker_dns_records_count` specifies how many DNS records to create for the broker endpoints in the DNS zone provided in the `zone_id` variable.
        #  This corresponds to the total number of broker endpoints created by the module.
        #  Calculate this number by multiplying the `broker_per_zone` variable by the subnet count.
        broker_dns_records_count: 3
        broker_volume_size: 500
        client_broker: "TLS_PLAINTEXT"
        encryption_in_cluster: true
        encryption_at_rest_kms_key_arn: ""
        enhanced_monitoring: "DEFAULT"
        certificate_authority_arns: []

        # Authentication methods
        client_allow_unauthenticated: true
        client_sasl_scram_enabled: false
        client_sasl_scram_secret_association_enabled: false
        client_sasl_scram_secret_association_arns: []
        client_sasl_iam_enabled: false
        client_tls_auth_enabled: false

        jmx_exporter_enabled: false
        node_exporter_enabled: false
        cloudwatch_logs_enabled: false
        firehose_logs_enabled: false
        firehose_delivery_stream: ""
        s3_logs_enabled: false
        s3_logs_bucket: ""
        s3_logs_prefix: ""
        properties: {}
        autoscaling_enabled: true
        storage_autoscaling_target_value: 60
        storage_autoscaling_max_capacity: null
        storage_autoscaling_disable_scale_in: false
        create_security_group: true
        security_group_rule_description: "Allow inbound %s traffic"
        # A list of IDs of Security Groups to allow access to the cluster security group
        allowed_security_group_ids: []
        # A list of IPv4 CIDRs to allow access to the cluster security group
        allowed_cidr_blocks: []
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/msk_cluster
- https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/msk_serverless_cluster
- https://aws.amazon.com/blogs/big-data/securing-apache-kafka-is-easy-and-familiar-with-iam-access-control-for-amazon-msk/
- https://docs.aws.amazon.com/msk/latest/developerguide/security-iam.html
- https://docs.aws.amazon.com/msk/latest/developerguide/iam-access-control.html
- https://docs.aws.amazon.com/msk/latest/developerguide/kafka_apis_iam.html
- https://github.com/aws/aws-msk-iam-auth
- https://www.cloudthat.com/resources/blog/a-guide-to-create-aws-msk-cluster-with-iam-based-authentication
- https://blog.devops.dev/how-to-use-iam-auth-with-aws-msk-a-step-by-step-guide-2023-eb8291781fcb
- https://www.kai-waehner.de/blog/2022/08/30/when-not-to-choose-amazon-msk-serverless-for-apache-kafka/
- https://stackoverflow.com/questions/72508438/connect-python-to-msk-with-iam-role-based-authentication
- https://github.com/aws/aws-msk-iam-auth/issues/10
- https://aws.amazon.com/msk/faqs/
- https://aws.amazon.com/blogs/big-data/secure-connectivity-patterns-to-access-amazon-msk-across-aws-regions/
- https://docs.aws.amazon.com/msk/latest/developerguide/client-access.html
- https://repost.aws/knowledge-center/msk-broker-custom-ports



