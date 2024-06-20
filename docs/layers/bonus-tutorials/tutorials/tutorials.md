---
title: "Tutorials"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1197015041/Tutorials
sidebar_position: 10
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/tutorials.md
---

# Tutorials

Tutorials in AWS documentation are step-by-step guides designed to help users understand and implement specific tasks or workflows using AWS services. These tutorials are crafted to provide a hands-on and practical learning experience, allowing users to follow clear instructions and gain proficiency in using AWS tools.

### Concepts
Read the [Concepts](/fundamentals/concepts) document

### Toolchain

#### How to set up the environment
1. Clone the infra repo and run `make all`

2. Install Leapp [Leapp](/fundamentals/leapp)

3. Install Docker Desktop

#### How to use Atmos
[How to use Atmos](/reference-architecture/how-to-guides/tutorials/how-to-use-atmos)

### Account Management

#### How to perform a Cold Start on an AWS Organization
[Implement AWS Cold Start](/reference-architecture/setup/cold-start)

#### How to add a new Account
[How to Create and Setup AWS Accounts](/reference-architecture/how-to-guides/tutorials/how-to-create-and-setup-aws-accounts)

#### How to delete an Account
[How to Delete AWS Accounts](/reference-architecture/how-to-guides/tutorials/how-to-delete-aws-accounts)

#### How to add a new Organizational Unit
[How to add a new Organizational Unit](/reference-architecture/how-to-guides/tutorials/how-to-add-a-new-organizational-unit)

#### How to change Account Settings
[How to manage Account Settings](/reference-architecture/how-to-guides/tutorials/how-to-manage-account-settings)

#### How to set budgets
[How to manage Account Settings](/reference-architecture/how-to-guides/tutorials/how-to-manage-account-settings)

#### Reference
- [account](/components/library/aws/account/)

- [account-settings](/components/library/aws/account-settings/)

- [account-map](/components/library/aws/account-map/)

### IAM / Audit

#### How to implement `aws teams` and `aws roles`
Provision the [aws-teams](/components/library/aws/aws-teams/) and [aws-team-roles](/components/library/aws/aws-team-roles/) components

#### How to manage Cloudtrails (retention policy and viewing them)
Provision the [cloudtrail](/components/library/aws/cloudtrail/) and [cloudtrail-bucket](/components/library/aws/cloudtrail-bucket/) components

#### How to create a new team
Add a new team to both `stacks/catalog/aws-teams.yaml` and `stacks/catalog/aws-teams.yaml`

```
          example:
            <<: *user-template
            role_description: "Team with permission to XYZ"
            role_policy_arns:
            - "arn:aws:iam::aws:policy/job-function/ViewOnlyAccess"
            - "example_policy"
            aws_saml_login_enabled: true
            trusted_teams: ["admin", "poweruser", "reader"]
```

:::note
TODO: Create a page for “How to create a new Policy”

:::
Any new policies, such as `example_policy` above, will need to be added to both components.

For this example, create `components/terraform/aws-teams/policy-example.tf` and `components/terraform/aws-team-roles/policy-example.tf`

```
data "aws_iam_policy_document" "example_policy_document" {
  statement {
    sid    = "FullEc2AccessExample"
    effect = "Allow"
    actions = [
      "ec2:*"
    ]
    resources = [
      "*",
    ]
  }
}

resource "aws_iam_policy" "example_policy" {
  name        = format("%s-ExampleTeamAccess", module.this.id)
  description = "IAM permission to use AssumeRole"
  policy      = data.aws_iam_policy_document.example_policy_document.json
  tags        = module.this.tags
}
```
Then reapply `aws-teams` in the identity account and `aws-team-roles` in all other accounts

```
# Deploy once
assume-role SuperAdmin atmos terraform apply aws-teams -s core-gbl-identity

# Deploy to all other accounts
assume-role SuperAdmin atmos terraform apply aws-team-roles -s core-gbl-example
```

#### How to alter roles for a team
New roles or policies are added for teams by the `aws-teams` in the identity account and `aws-team-roles` in all other accounts.

Find the appropriate team in both `stacks/catalog/aws-teams.yaml` and `stacks/catalog/aws-teams.yaml`

(Option 1) Add any existing role by ARN to `role_policy_arns`

(Option 2) Create a new policy in the component and list the policy name under `role_policy_arns`

Then reapply `aws-teams` in the identity account and `aws-team-roles` in all other accounts

#### How to manage SAML integration for the identity account
Provision the [aws-saml](/components/library/aws/aws-saml/) component in the identity account

#### How to manage AWS SSO permission set
[aws-sso](/components/library/aws/aws-sso/)

#### Reference
- [aws-team-roles](/components/library/aws/aws-team-roles/)

- [aws-teams](/components/library/aws/aws-teams/)

- [aws-sso](/components/library/aws/aws-sso/)

### Network Architecture
As part of the cold start decisions it’s good to come up with a plan for the AWS Organization CIDRs. Organizing the entire org into 1 continuous block, broken down further by region, platform, and then finally account.

We recommend a layout like the following.

This example provides 8 regions of support. This can be adjusted to any number of regions by increasing or decreasing the size of each region accordingly (from `/14` to something covering more IPs if using less regions).

```
AWS Organization: 10.96.0.0/11 (2mm IPs) # - 10.127.255.255
  primary-region (e.g. us-west-2): 10.96.0.0/14 (262k IPs)
    core: 10.96.0.0/16 (65k IPs)
      root: n/a
      audit: n/a
      auto: 10.96.0.0/19 (8k IPs)
      corp: 10.96.32.0/19 (8k IPs)
      security: n/a
      identity: n/a
      network: 10.96.64.0/19 (8k IPs)
      dns: n/a
      artifacts: n/a
      ec2-client-vpn: 10.96.224.0/19 (8k IPs)
      reserved for future: 4 * /19s (32k IPs)

    platform: 10.97.0.0/16 (65k IPs)
      prod: 10.97.0.0/19 (8k IPs)
        az1-priv: 10.97.0.0/22 (1k IPs)
        az2-priv: 10.97.0.0/22 (1k IPs)
        az3-priv: 10.97.0.0/22 (1k IPs)
        az1-pub:  10.97.0.0/22 (1k IPs)
        az2-pub:  10.97.0.0/22 (1k IPs)
        az3-pub:  10.97.0.0/22 (1k IPs)
      dev: 10.97.32.0/19 (8k IPs)
      staging: 10.97.64.0/19 (8k IPs)
      sandbox: 10.97.96.0/19 (8k IPs)
      reserved for future: 4 * /19s (32k IPs)
    reserved for future tenants: 2 * /16 (130k IPs)

  Secondary Region (e.g. us-east-1): 10.100.0.0/14 (262k IPs)
    core: 10.100.0.0/16 (65k IPs)
      auto: 10.100.0.0/19 (8k IPs)
      corp: 10.100.32.0/19 (8k IPs)
      network: 10.100.64.0/19 (8k IPs)
      reserved for future: 5 * /19s (~41k IPs)

    platform: 10.101.0.0/16 (65k IPs)
      prod: 10.101.0.0/19 (8k IPs)
      dev: 10.101.32.0/19     (8k IPs)
      staging: 10.101.64.0/19 (8k IPs)
      sandbox: 10.101.96.0/19 (8k IPs)
      reserved for future: 4 * /19s (32k IPs)
    reserved for future tenants: 2 * /16 (130k IPs)

  reserved for future regions: 6 * /14s (1m IPs)
```

#### How to delete default VPCs

```
NAMESPACE=FOO
regions=(us-west-2 region-a region-b) # For every region you want to delete
# The following is a list of profiles for AWS to assume when deleting, this should consist of every account you want to delete the default vpcs of.
profiles=(${NAMESPACE}-platform-gbl-dev-admin ${NAMESPACE}-platform-gbl-staging-admin ${NAMESPACE}-platform-gbl-sandbox-admin ${NAMESPACE}-platform-gbl-prod-admin ${NAMESPACE}-core-gbl-corp-admin ${NAMESPACE}-core-gbl-network-admin ${NAMESPACE}-core-gbl-auto-admin)
for profile in "${profiles[@]}"; do
  for region in "${regions[@]}"; do
    vpc=$(AWS_PROFILE=${profile} aws --region ${region} ec2 describe-vpcs | jq -r '.Vpcs[]|select(.CidrBlock | startswith("172")) | .VpcId')
    if [[ -z $vpc ]]; then
      echo "No default VPC found for $profile ${region}"
      echo "-------------------------------"
      continue;
    fi
    echo "Trying to delete VPC ${vpc} in ${profile} ${region}"

     # kill igws
        for igw in `AWS_PROFILE=${profile} aws --region ${region} ec2 describe-internet-gateways | jq -r ".InternetGateways[] | {id: .InternetGatewayId, vpc: .Attachments[0].VpcId} | select(.vpc == \"$vpc\") | .id"` ; do
            echo "Killing igw $region $vpc $igw"
            AWS_PROFILE=${profile} aws --region ${region} ec2 detach-internet-gateway --internet-gateway-id=$igw --vpc-id=$vpc
            AWS_PROFILE=${profile} aws --region ${region} ec2 delete-internet-gateway --internet-gateway-id=$igw
        done

        # kill subnets
        for sub in `AWS_PROFILE=${profile} aws --region ${region} ec2 describe-subnets | jq -r ".Subnets[] | {id: .SubnetId, vpc: .VpcId} | select(.vpc == \"$vpc\") | .id"` ; do
            echo "Killing subnet $region $vpc $sub"
            AWS_PROFILE=${profile} aws --region ${region} ec2 delete-subnet --subnet-id=$sub
        done
    AWS_PROFILE=${profile} aws --region ${region} ec2 delete-vpc --vpc-id $vpc
    echo
    echo "-------------------------------"
  done;
done

```

#### How to provision a new VPC, which includes the CIDR strategy
In order to provision a vpc, first ensure that the VPC component is ready for deployment, and a catalog entry with default values is imported into the account and region you wish to deploy to.

Then add the vpc component with customization for what CIDR block is assigned to this VPC, such as:

```
import:
  - orgs/NAMESPACE/platform/dev/_defaults
  - mixins/region/us-west-2
  - catalog/vpc

components:
  terraform:
    vpc:
      vars:
        ipv4_primary_cidr_block: 10.97.32.0/19
```
Then we deploy the component with either [Spacelift](/reference-architecture/reference/adrs/use-spacelift-for-gitops-with-terraform) , or via [Geodesic](/fundamentals/geodesic) and [Atmos](/fundamentals/atmos)

```
atmos terraform deploy vpc -s platform-usw2-dev # in this case the stack example is platform dev in the us-west-2 region
```

#### How to provision multiple VPCs in the same account
Provisioning multiple VPCs in the same account is done in the same manner as deploying a component multiple times as different instances.

First we import the base component, then we add multiple instances of it, for example:

```
# stacks/catalog/vpc.yaml
components:
  terraform:
    vpc/defaults:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        ...

---
# stacks/org/NAMESPACE/platform/dev/us-west-2.yaml
import:
  - orgs/NAMESPACE/platform/dev/_defaults
  - mixins/region/us-west-2
  - catalog/vpc

components:
  terraform:
    vpc-a:
      metadata:
        component: vpc
        inherits:
          - vpc/defaults
      vars:
        ipv4_primary_cidr_block: 10.97.32.0/19

    vpc-b:
      metadata:
        component: vpc
        inherits:
          - vpc/defaults
      vars:
        ipv4_primary_cidr_block: 10.97.64.0/19
```

#### How to add/ remove subnets to an existing VPC
To add subnets to an existing VPC simply add Update the `max_subnet_count` variable to however many subnets you want in that account. Subnets will auto determine their IPs based on the VPCs CIDR Block range determined by the `ipv4_primary_cidr_block` variable.

If you need to override specific IPs you can use the following format:

```
        ipv4_cidrs:
          - private:
              - 10.128.88.0/25
              - 10.128.88.128/25
              - 10.128.89.0/25
            public:
              - 10.128.89.128/25
              - 10.128.90.0/25
              - 10.128.90.128/25
```
If you need a new subnet entirely for each vpc, you can add a customization to the VPC component including an additional module for example:

```
module "subnets_custom" {
  source  = "cloudposse/dynamic-subnets/aws"
  version = "2.0.2"

  count = var.data_subnet_enabled ? 1 : 0

  tags = local.tags

  availability_zones              = local.availability_zones
  ipv4_cidrs                      = local.custom_ipv4_cidrs
  igw_id                          = [module.vpc.igw_id]
  map_public_ip_on_launch         = var.map_public_ip_on_launch
  max_subnet_count                = local.max_subnet_count
  nat_gateway_enabled             = false
  nat_instance_enabled            = false
  nat_instance_type               = null
  public_subnets_additional_tags  = local.public_subnets_additional_tags
  private_subnets_additional_tags = local.private_subnets_additional_tags
  vpc_id                          = module.vpc.vpc_id
  public_subnets_enabled          = false

  context = module.this.context
}

```

#### What is the purpose of dns-primary and dns-delegated?
- `dns-primary` is used to deploy top-level domains. This includes service discovery domains and vanity domains. This component should be deployed to the _DNS_ account and any representative platform account (e.g. prod vanity domain should be deployed with dns-primary to prod account). This component also creates a cert for it’s domains in the account it is provisioned in.

- `dns-delegated` is used to deploy subdomains and create appropriate hosted zones and routes from the top level domains to the account the component is deployed to. It can also handle ACM certs with `request_acm_certificate` variable. We recommend DNS delegated does **NOT** handle ACM certs if you use a regional naming pattern (`https://echo.usw2.dev.platform.acme.com`) This is because dns-delegated does not include region in the cert.

- `acm` is used to help create ACM certs for various hosted zones and subdomains.

```
# ACM component in us-west-2 for https://echo.usw2.dev.platform.acme.com
import:
 - catalog/acm/service-discovery
components:
  terraform:
    acm/service-discovery:
      vars:
        domain_name: usw2.dev.platform.acme.com
        zone_name: dev.platform.acme.com
```

#### How are ACM certificates created?
ACM Certificates can be created through `dns-delegated` or `acm` components. Typically you want to pick one or the other, as overlapping certs can cause conflict issues.

We recommend letting the `dns-delegated` component create the Certs for service discovery, and `dns-primary` create the certs for vanity domains and top level domains. Only use `acm` for any additional certs need.

#### What is the purpose of Transit Gateway and VPC peering? When do we use one or the other?
Transit gateway is Amazon’s method of simplifying cross-account and cross-region communication between services.

In general **Transit Gateway** is used when a network mesh wants to be created, where vpc’s can communicate with many other vpcs. whereas **VPC-Peering** is used when a vpc only needs to be able to communicate with another vpc in another region.

AWS has a whitepaper on the subject [here](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/welcome.html). Note:

- If every VPC needs to be able to communicate with every other VPC we are creating a mesh. [[1](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/vpc-to-vpc-connectivity.html)]

> For example, if you have 100 VPCs and you want to setup a full mesh peering between them, it will take 4,950 peering connections [n(n-1)/2] where n=total number of VPCs. There is a maximum limit of up to 125 active peering connections per VPC.The CloudPosse Recommended approach is to use a transit gateway. Our usual approach is to connect the auto account with network, corp, and each platform account (dev/stg/prod/sbx). This means we are connecting several accounts to several other accounts bi-directionally. Furthermore, when adding additional regions you multiply the number of connections by the number of regions added. this can quickly become unmanageable.

#### When do we need a client VPN?
A Client VPN is useful when creating a private network where only internal traffic is allowed, but you also want developers or admins to be able to connect to, access, or run commands (such as kubectl) from their local machine.

Client VPN will connect the local machine to the private network allowing access to services that are not available to the internet. AWS Client VPN can be setup to use SSO, granting particular user groups access to the network.

**Note:** AWS Client VPN does not, at this time, have the ability to restrict access to resources, you either have access or you do not. Therefore, if restriction to groups of resources is important, such as dev vs prod, multiple AWS Client VPNs will need to be deployed.
