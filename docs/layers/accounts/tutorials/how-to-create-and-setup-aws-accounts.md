---
title: "Create AWS Accounts"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1237286948/How+to+Create+and+Setup+AWS+Accounts
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-create-and-setup-aws-accounts.md
---

# How to Create and Setup AWS Accounts

## Problem
New accounts can be daunting to setup

## Solution

### PR 1 - Create account

#### Stack account catalog
See the `stack/catalog/account*.yaml`

If the new account is `pca`

Under the appropriate OU

```
          organizational_units:
            - name: mgmt
              accounts:
```
Add the following

```
                - name: pca
                  stage: pca
                  tags:
                    eks: false
```

#### Root stacks
This is an example. Please see another root stack as an example.

Global
`stacks/gbl/gbl-pca.yaml`

```
import:
  - gbl/gbl-globals
  - catalog/iam-delegated-roles

vars:
  stage: pca

terraform:
  vars: {}

components:
  terraform:
    iam-delegated-roles:
      vars:
        exclude_roles: [ "helm" ]
```
Regional
`stacks/use2/use2-pca.yaml`

```
import:
  - use2/use2-globals

vars:
  stage: pca

terraform:
  vars: {}

helmfile:
  vars: {}

components:
  terraform: {}
```

#### Tenant stacks (if applicable)
This is an example. Please see another root stack as an example.

`stacks/mdev/gbl/mdg-pca.yaml`

```
import:
- mdev/gbl/mdg-globals
- gbl/gbl-pca
```
`stacks/mdev/use2/mde2-pca.yaml`

```
import:
- mdev/mdev-globals
- use2/use2-pca
- catalog/private-ca
```

#### Submit PR and merge
It's good to commit and draft PR the changes because once the component has been applied, it's difficult to reverse.

Once the PR is reviewed, approved, and merged, continue.

### Plan and Apply components
NOTE: Use `plan` and `apply` without `-auto-approve`. Please do not use `deploy` as it could be dangerous.

Components to deploy

- components/terraform/account

- components/terraform/account-map

- components/terraform/account-settings

- components/terraform/iam-delegated

- There may be additional ones that are hidden away by stack imports

Prereq

```
## temporarily assume the root admin (only necessary when deploying root level components)
assume-role $NAMESPACE-$TENANT-gbl-root-admin
```
Setup account

```
# create new account
atmos terraform apply account --stack $TENANT-gbl-root

# update account map
atmos terraform apply account-map --stack $TENANT-gbl-root

# update new account's settings
atmos terraform apply account-settings --stack $TENANT-gbl-pca

# create assumable roles from identity account to new account
atmos terraform apply iam-delegated-roles --stack $TENANT-gbl-pca
```
Exit the root role

```
# exit from root role
exit
```

### PR 2 - aws-accounts and profiles

#### aws-accounts
After the above commands are executed

`rootfs/usr/local/bin/aws-accounts`

Append each account section with its respective information

```
mdev_accounts=(
	# ...
	[pca]="snip"
	# ...
)
```

```
readonly profile_order=(
	# ...
	pca
	# ...
)
```

#### Regenerate profiles
Rebuild the container to update the script or use the `rootfs/usr/local/bin/aws-accounts` directly.

```
# regnerate cicd profiles
aws-accounts gen-cicd > rootfs/etc/aws-config/aws-config-cicd-$TENANT

# regenerate local saml profiles
aws-accounts gen-saml > /localhost/.aws/vygr/config-$TENANT
```
Commit and push files

#### Final commands
There may be additional components that are imported or hidden away by stack imports. Review the imports to see if there are more components to deploy.

## References
- [How to Delete AWS Accounts](/reference-architecture/how-to-guides/tutorials/how-to-delete-aws-accounts) (in case a mistake was made)

