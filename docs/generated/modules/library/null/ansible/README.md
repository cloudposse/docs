---
title: ansible
sidebar_label: ansible
sidebar_class_name: command
description: |-
  Terraform Module to run ansible playbooks.
custom_edit_url: https://github.com/cloudposse/terraform-null-ansible/blob/main/README.yaml
---

# Module: `ansible`
Terraform Module to run ansible playbooks.






## Usage

### Add special section to the playbook

You must add this section on the top of all playbooks that will be used for provisioning.

This will add a dynamic inventory to target the host that needs provisioning.

e.g. `../ansible/playbooks/playbook.yml`

* Create a runtime inventorty with an ip address of a host
* Wait for target host is ready for ssh connection

```yaml

---
- hosts: localhost
  gather_facts: True
  check_mode: no
  tasks:
  - name: terraform-null-ansible
    add_host:
      name: terraform-null-ansible
      groups: all

  - local_action: wait_for port=22 host="{{ host }}" search_regex=OpenSSH delay=10

- hosts: all
  gather_facts: False
  check_mode: no
  become: True
  tasks:
  - name: terraform-null-ansible
    raw: >
      test -e /usr/bin/python ||
      (
        (test -e /usr/bin/apt-get && (apt-get -y update && apt-get install -y python)) ||
        (test -e /usr/bin/yum && (yum makecache fast && yum install -y python))
      )
    args:
      creates: /usr/bin/python
```

### Create an aws instance

```hcl
resource "aws_instance" "web" {
  ami           = "ami-408c7f28"
  instance_type = "t1.micro"
  tags {
    Name        = test1
  }
}
```

### Apply the provisioner module to this resource

```hcl
module "ansible_provisioner" {
  source    = "github.com/cloudposse/tf_ansible"

  arguments = ["--user=ubuntu"]
  envs      = ["host=${aws_instance.web.public_ip}"]
  playbook  = "../ansible/playbooks/test.yml"
  dry_run   = false

}
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.12 |
| <a name="requirement_archive"></a> [archive](#requirement\_archive) | ~> 2.2.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | ~> 3.2.0 |
| <a name="requirement_random"></a> [random](#requirement\_random) | ~> 3.6.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_archive"></a> [archive](#provider\_archive) | ~> 2.2.0 |
| <a name="provider_null"></a> [null](#provider\_null) | ~> 3.2.0 |
| <a name="provider_random"></a> [random](#provider\_random) | ~> 3.6.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [null_resource.cleanup](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [null_resource.provisioner](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [random_id.default](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [archive_file.default](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_arguments"></a> [arguments](#input\_arguments) | Arguments | `list(string)` | `[]` | no |
| <a name="input_dry_run"></a> [dry\_run](#input\_dry\_run) | Do dry run | `bool` | `true` | no |
| <a name="input_envs"></a> [envs](#input\_envs) | Environment variables | `list(string)` | `[]` | no |
| <a name="input_playbook"></a> [playbook](#input\_playbook) | Playbook to run | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arguments"></a> [arguments](#output\_arguments) | Arguments |
| <a name="output_envs"></a> [envs](#output\_envs) | Environment variables |
<!-- markdownlint-restore -->

