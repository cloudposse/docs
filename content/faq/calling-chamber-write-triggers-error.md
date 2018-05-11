---
title: "Calling `chamber write` triggers `Error: InvalidKeyId: ... parameter_store_key is not found.`"
description: "Chamber expects to find a KMS key with alias `parameter_store_key`"
---

# Question

```
Error: InvalidKeyId: Alias arn:aws:kms:us-west-2:671362398325:alias/parameter_store_key is not found. (Service: AWSKMS; Status Code: 400; Error Code: NotFoundException; Request ID: bf9b3240-39f5-11e8-921d-e9dc98bd5b1a)
```

# Answer

Per the [documentation](https://github.com/segmentio/chamber/blob/master/README.md#setting-up-kms), Chamber expects to find a KMS key with alias `parameter_store_key` in the account that you are writing/reading secrets.

You can follow the [AWS KMS documentation](http://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html) to create your key, and follow this guide to [set up your alias](http://docs.aws.amazon.com/kms/latest/developerguide/programming-aliases.html).

We recommend using Terraform:
```
resource "aws_kms_key" "parameter_store" {
  description             = "Parameter store kms master key"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

resource "aws_kms_alias" "parameter_store_alias" {
  name          = "alias/parameter_store_key"
  target_key_id = "${aws_kms_key.parameter_store.id}"
}
```

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
Define `CHAMBER_KMS_KEY_ALIAS` environment variable to override the default of `alias/parameter_store_key`
{{% /dialog %}}


Also, we now have a Terraform Module to manage KMS keys: <https://github.com/cloudposse/terraform-aws-kms-key>

```
module "kms_key" {
  source                  = "git::https://github.com/cloudposse/terraform-aws-kms-key.git?ref=master"
  namespace               = "cp"
  stage                   = "prod"
  name                    = "app"
  description             = "KMS key for chamber"
  deletion_window_in_days = 10
  enable_key_rotation     = "true"
}
```

Then tell chamber to use this new key:

```
export CHAMBER_KMS_KEY_ALIAS="alias/cp-prod-app"
```
