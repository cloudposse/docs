---
title: "Add or mirror a new region"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1262419969/How+to+add+or+mirror+a+new+region
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-add-or-mirror-a-new-region.md
---

# How to add or mirror a new region
**DRAFT**

## Problem

## Solution

The current primary region is `us-west-2` and the new desired region is `us-east-2`

### Additional region

1. Create root stacks of the new region e.g. `ue2*.yaml`

2. Update VPC CIDR documentation

3. Create minimal components in the yaml such as `vpc`, `transit-gateway`, and perhaps `compliance` (or others) if applicable

4. Deploy minimal components

5. Optionally deploy `dns-delegated` if a new HZ is required per region

1. This is no longer used going forward as we can use a single HZ for `<stage>.example.com` and create multi domain records within it such as `postgres-example.ue2` without having to create a `ue2.<stage>.example.com` HZ.

6. Optionally deploy `transit-gateway-cross-region` component to peer both regions

```
TBD
```

7. Optionally deploy new github runners (if applicable)

1. Retrieve the new github runner IAM role arn

2. Update `iam-primary-roles` to include the new IAM role and deploy it to update `identity-cicd` role

8. Optionally deploy new `spacelift-worker-pool` (if applicable)

1. Set a worker pool id map in the `spacelift` component

2. Set a `worker_pool_name` global variable in the new region

3. Update `iam-primary-roles` to include the new IAM role and deploy it to update `identity-ops` role

### If new region needs to be a mirror of the primary region

1. Same steps as above, except instead of minimal components, we want to copy and paste all of the primary region into the new desired region. We will not reprovision anything from `gbl*`.

2. Mirror the SSM parameters by exporting them from the primary region and importing them into the new region

```
stage=sandbox
CURRENT_REGION=us-west-2
NEW_REGION=us-east-2
# get services
services=$(AWS_PROFILE=$NAMESPACE-gbl-$stage-admin AWS_REGION=$CURRENT_REGION aws ssm describe-parameters --query 'Parameters[].Name' | grep / | cut -d'/' -f2 | sort | uniq | tr '\n' ' ')
# export
AWS_PROFILE=$NAMESPACE-gbl-$stage-admin AWS_REGION=$CURRENT_REGION chamber export -o chamber-$stage.json $services
# import
for service in $services; do
  AWS_PROFILE=$NAMESPACE-gbl-$stage-admin AWS_REGION=$NEW_REGION chamber import $service chamber-$stage.json;
done
```

3. Ensure all hostnames use the correct regional endpoints (either by HZ or by record)

4. Optionally, it’s not recommended, but if the tfstate bucket needs to be migrated

1. Make sure everything in Spacelift is confirmed/discarded/failed so nothing is left in an unconfirmed state.

2. Schedule a date with the customer so no applies go through

3. Set desired count on the spacelift worker pool to 0 with a max and min count of 0

4. Manually copy from old tfstate bucket to new tfstate bucket

5. PR to change all the `backend.tf.json` files over to the new bucket and set new bucket in the global vars

6. Check locally to see that new bucket is used and stacks show no changes

7. Merge PR

8. revert spacelift worker pool

9. Ensure everything is working in Spacelift

### If an old region needs to be destroyed

The following can be destroyed in Spacelift using a run task with `terraform destroy -auto-approve`

The following should be destroyed locally with `atmos`

