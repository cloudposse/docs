---
title: "Tune EKS with AWS Managed Node Groups"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1249476615/How+to+Tune+EKS+with+AWS+Managed+Node+Groups
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-tune-eks-with-aws-managed-node-groups.md
---

# How to Tune EKS with AWS Managed Node Groups

## Problem
[Spot.io](http://Spot.io) is unused or the customer doesn’t want to reconfigure [spot](http://spot.io)io and wants to use managed node groups instead of spot node groups.

## Solution

:::tip
Switch out the `spotinst_oceans` yaml input with `node_groups`

:::

1. Find existing eks yaml catalog

2. Rename `spotinst_oceans` to `node_groups`

1. The interface is different (see below for more details)

3. Make sure to set `instance_types` to the list of instance types desired.

4. Create a list of sanity checks

5. Identify the eks version

6. Plan the eks component in a safe cluster

7. Apply the eks component in a safe cluster

1. It’s possible this just works but it’s possible the node groups do not get replaced and this can happen for a number of reasons.

1. One reason could be a [Disruption Budget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) set on a resource (could be fixed by deploying the latest version of the chart)

2. Could be other reasons

8. Verify sanity checks from previous steps to make sure the cluster is good

1. Verify foundational charts (cert-manager, external-dns, ingress-nginx, etc)

2. Verify CICD/codefresh (if applicable)

3. Verify pods

4. Check logs

9. Repeat for each cluster

:::note
This should not have downtime but it will recreate the EKS node groups so reviewing the checks and verifying the integrity of the cluster after the modification is important.

:::
Interface for each related input

|**spotinst_oceans** | **node_groups**|
| ----- | ----- |
|Differences from node_groups<br/><br/>- no availability zones<br/><br/><br/>- no create_before_destroy<br/><br/><br/>- no block_device_mappings<br/><br/><br/>- no cluster_autoscaler_enabled | - set `create_before_destroy=true`|
|Set `disk_size` | to set the disk size, set a `block_device_mapping`<br/><br/><br/><pre><br/>block_device_mappings:<br/>  - device_name: "/dev/xvda"<br/>    volume_size: 200<br/>    volume_type: "gp2"<br/>    encrypted: true<br/>    delete_on_termination: true<br/></pre>|
|Full interface of `spotinst_oceans`<br/><br/><br/><pre><br/>{<br/>  # Additional attributes (e.g. `1`) for the ocean<br/>  attributes         = list(string)<br/>  desired_group_size = number<br/>  # Disk size in GiB for worker nodes. Terraform will only perform drift detection if a configuration value is provided.<br/>  disk_size = number<br/>  # List of allowed instance types. Leave null to allow Spot to choose any type.<br/>  instance_types = list(string)<br/>  # Type of Amazon Machine Image (AMI) associated with the EKS Node Group<br/>  ami_type = string<br/>  # EKS AMI version to use, e.g. "1.16.13-20200821" (no "v").<br/>  ami_release_version = string<br/>  # Desired Kubernetes master version. If you do not specify a value, the cluster version is used<br/>  kubernetes_version = string # set to null to use cluster_kubernetes_version<br/>  max_group_size     = number<br/>  min_group_size     = number<br/>  tags               = map(string)<br/>}<br/></pre> | Full interface of `node_groups`<br/><br/><br/><pre><br/><br/>{<br/>  # will create 1 auto scaling group in each specified availability zone<br/>  availability_zones = list(string)<br/>  # Additional attributes (e.g. `1`) for the node group<br/>  attributes = list(string)<br/>  # True to create new node_groups before deleting old ones, avoiding a temporary outage<br/>  create_before_destroy = bool<br/>  # Desired number of worker nodes when initially provisioned<br/>  desired_group_size = number<br/>  # List of block device mappings for the launch template. Each list element is an object with a `device_name` key and any keys supported by the `ebs` block of `launch_template`.<br/>  block_device_mappings = list(any)<br/>  # Whether to enable Node Group to scale its AutoScaling Group<br/>  cluster_autoscaler_enabled = bool<br/>  # Set of instance types associated with the EKS Node Group. Terraform will only perform drift detection if a configuration value is provided.<br/>  instance_types = list(string)<br/>  # Type of Amazon Machine Image (AMI) associated with the EKS Node Group<br/>  ami_type = string<br/>  # EKS AMI version to use, e.g. "1.16.13-20200821" (no "v").<br/>  ami_release_version = string<br/>  # Key-value mapping of Kubernetes labels. Only labels that are applied with the EKS API are managed by this argument. Other Kubernetes labels applied to the EKS Node Group will not be managed<br/>  kubernetes_labels = map(string)<br/>  # List of `key`, `value`, `effect` objects representing Kubernetes taints. `effect` must be one of `NO_SCHEDULE`, `NO_EXECUTE`, or `PREFER_NO_SCHEDULE`. `key` and `effect` are required, `value` may be null.<br/>  kubernetes_taints = list(any)<br/>  # Desired Kubernetes master version. If you do not specify a value, the latest available version is used<br/>  kubernetes_version = string<br/>  # The maximum size of the AutoScaling Group<br/>  max_group_size = number<br/>  # The minimum size of the AutoScaling Group<br/>  min_group_size = number<br/>  # List of auto-launched resource types to tag<br/>  resources_to_tag = list(string)<br/>  tags             = map(string)<br/>}<br/></pre>|

## See Also

- [How to Tune SpotInst Parameters for EKS](/reference-architecture/how-to-guides/integrations/spotinst/how-to-tune-spotinst-parameters-for-eks)

