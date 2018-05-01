---
title: "terraform-null-ansible"
excerpt: "Terraform Module to run ansible playbooks."
---
# Terraform Null Ansible


[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-null-ansible",
    "1-1": "terraform-null-ansible",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-null-ansible.svg)](https://github.com/cloudposse/terraform-null-ansible/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-null-ansible.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-null-ansible)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Module usage

## Add a special section to the playbook

You must add this section on the top of all playbooks that will be used for provisioning.

This will add a dynamic inventory to target the host that needs provisioning.

e.g. `../ansible/playbooks/playbook.yml`

* Create a runtime inventory with an IP address of a host
* Wait for target host is ready for ssh connection
[block:code]
{
  "codes": [
    {
      "code": "- --\n- hosts: localhost\n  gather_facts: True\n  check_mode: no\n  tasks:\n  - name: Add public ip addresses to an dynamic inventory\n    add_host:\n      name: \"{{ host }}\"\n      groups: all\n\n  - local_action: wait_for port=22 host=\"{{ host }}\" search_regex=OpenSSH delay=10\n\n- hosts: all\n  gather_facts: False\n  check_mode: no\n  become: True\n  tasks:\n  - name: Install python 2.7\n    raw: >\n      test -e /usr/bin/python ||\n      (\n        (test -e /usr/bin/apt-get && (apt-get -y update && apt-get install -y python)) ||\n        (test -e /usr/bin/yum && (yum makecache fast && yum install -y python))\n      )\n    args:\n      creates: /usr/bin/python",
      "language": "yaml",
      "name": "playbook.yml"
    }
  ]
}
[/block]

## Create an aws instance

[block:code]
{
  "codes": [
    {
      "code": "module \"ansible_provisioner\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-null-ansible.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

## Apply the provisioner module to this resource

[block:code]
{
  "codes": [
    {
      "code": "module \"ansible_provisioner\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-null-ansible.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

# Inputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "arguments",
    "1-0": "dry_run",
    "2-0": "envs",
    "3-0": "playbook",
    "3-1": "\"\"",
    "2-1": "[]",
    "1-1": "\"true\"",
    "0-1": "[]",
    "1-2": "Do dry run",
    "2-2": "Environment variables",
    "3-2": "Playbook to run",
    "0-2": "Arguments"
  },
  "cols": 3,
  "rows": 5
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "0-0": "Name",
    "0-1": "Description",
    "1-0": "arguments",
    "2-0": "envs",
    "2-1": "Environment variables",
    "1-1": "Arguments"
  },
  "cols": 2,
  "rows": 3
}
[/block]