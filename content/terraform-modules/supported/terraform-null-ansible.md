---
title: terraform-null-ansible
description: Terraform Module to run ansible playbooks.
---

# Terraform Null Ansible

|                  |                                                                                                                                                          |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-null-ansible>                                                                                                   |
| Terraform Module | terraform-null-ansible                                                                                                                                   |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-null-ansible.svg)](https://github.com/cloudposse/terraform-null-ansible/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-null-ansible.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-null-ansible)    |

# Module usage

## Add a special section to the playbook

You must add this section on the top of all playbooks that will be used for provisioning.

This will add a dynamic inventory to target the host that needs provisioning.

e.g. `../ansible/playbooks/playbook.yml`

- Create a runtime inventory with an IP address of a host
- Wait for target host is ready for ssh connection

### playbook.yml

```yaml
- --
- hosts: localhost
  gather_facts: True
  check_mode: no
  tasks:
  - name: Add public ip addresses to an dynamic inventory
    add_host:
      name: "{{ host }}"
      groups: all

  - local_action: wait_for port=22 host="{{ host }}" search_regex=OpenSSH delay=10

- hosts: all
  gather_facts: False
  check_mode: no
  become: True
  tasks:
  - name: Install python 2.7
    raw: >
      test -e /usr/bin/python ||
      (
        (test -e /usr/bin/apt-get && (apt-get -y update && apt-get install -y python)) ||
        (test -e /usr/bin/yum && (yum makecache fast && yum install -y python))
      )
    args:
      creates: /usr/bin/python
```

## Create an aws instance

### HCL

```hcl
module "ansible_provisioner" {
  source                           = "git::https://github.com/cloudposse/terraform-null-ansible.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

## Apply the provisioner module to this resource

### HCL

```hcl
module "ansible_provisioner" {
  source                           = "git::https://github.com/cloudposse/terraform-null-ansible.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Inputs

| Name      | Default | Description           |
|:----------|:--------|:----------------------|
| arguments | []      | Arguments             |
| dry_run   | "true"  | Do dry run            |
| envs      | []      | Environment variables |
| playbook  | ""      | Playbook to run       |

# Outputs

| Name      | Description           |
|:----------|:----------------------|
| Name      | Description           |
| arguments | Arguments             |
| envs      | Environment variables |
