---
title: ec2-client-vpn
sidebar_label: ec2-client-vpn
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ec2-client-vpn/README.md
tags: [terraform, aws, ec2-client-vpn]
---

# Component: `ec2-client-vpn`

This component is responsible for provisioning VPN Client Endpoints.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component. This component should only be applied once as the resources it
creates are regional. This is typically done via the corp stack (e.g. `uw2-corp.yaml`). This is because a vpc endpoint
requires a vpc and the network stack does not have a vpc.

```yaml
components:
  terraform:
    ec2-client-vpn:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        client_cidr: 10.100.0.0/10
        logging_stream_name: client_vpn
        logging_enabled: true
        retention_in_days: 7
        organization_name: acme
        split_tunnel: true
        availability_zones:
          - us-west-2a
          - us-west-2b
          - us-west-2c
        associated_security_group_ids: []
        additional_routes:
          - destination_cidr_block: 0.0.0.0/0
            description: Internet Route
        authorization_rules:
          - name: Internet Rule
            authorize_all_groups: true
            description: Allows routing to the internet"
            target_network_cidr: 0.0.0.0/0
```

## Deploying

NOTE: This module uses the `aws_ec2_client_vpn_route` resource which throws an error if too many API calls come from a
single host. Ignore this error and repeat the terraform command. It usually takes 3 deploys (or destroys) to complete.

Error on create (See issue https://github.com/hashicorp/terraform-provider-aws/issues/19750)

```
ConcurrentMutationLimitExceeded: Cannot initiate another change for this endpoint at this time. Please try again later.
```

Error on destroy (See issue https://github.com/hashicorp/terraform-provider-aws/issues/16645)

```
timeout while waiting for resource to be gone (last state: 'deleting', timeout: 1m0s)
```

## Testing

NOTE: The `GoogleIDPMetadata-cloudposse.com.xml` in this repo is equivalent to the one in the `sso` component and is
used for testing. This component can only specify a single SAML document. The customer SAML xml should be placed in this
directory side-by-side the CloudPosse SAML xml.

Prior to testing, the component needs to be deployed and the AWS client app needs to be setup by the IdP admin otherwise
the following steps will result in an error similar to `app_not_configured_for_user`.

1. Deploy the component in a regional account with a VPC like `ue2-corp`.
1. Copy the contents of `client_configuration` into a file called `client_configuration.ovpn`
1. Download AWS client VPN `brew install --cask aws-vpn-client`
1. Launch the VPN
1. File > Manage Profiles to open the Manage Profiles window
1. Click Add Profile to open the Add Profile window
1. Set the display name e.g. `<tenant>-<environment>-<stage>`
1. Click the folder icon and find the file that was saved in a previous step
1. Click Add Profile to save the profile
1. Click Done to close to Manage Profiles window
1. Under "Ready to connect.", choose the profile, and click Connect

A browser will launch and allow you to connect to the VPN.

1.  Make a note of where this component is deployed
1.  Ensure that the resource to connect to is in a VPC that is connected by the transit gateway
1.  Ensure that the resource to connect to contains a security group with a rule that allows ingress from where the
    client vpn is deployed (e.g. `ue2-corp`)
1.  Use `nmap` to test if the port is `open`. If the port is `filtered` then it's not open.

```console
nmap -p <PORT> <HOST>
```

Successful tests have been seen with MSK and RDS.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-ec2-client-vpn](https://github.com/cloudposse/terraform-aws-ec2-client-vpn) - Cloud Posse's
  upstream component
- [cloudposse/awsutils](https://github.com/cloudposse/terraform-provider-awsutils) - Cloud Posse's awsutils provider



