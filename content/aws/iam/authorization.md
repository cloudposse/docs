---
title: AWS IAM Authorization
description: ''
---

You can access AWS by Web console or AWS CLI.

# Authorization via Web Console

# Authorization using AWS CLI

1. Install `aws-vault` if you have not done so already using the directions [here](https://github.com/99designs/aws-vault#installing)

2. Generate IAM Access Key ID/Secret on your AWS root account via IAM management page in the AWS Console.

3. Using the IAM Access Key ID/Secret generated in Step 2, add the `source_profile`:
```bash
$ aws-vault add example
```

4. Add the `source_profile` created in Step 3 to your ~/.aws/config.
```
[profile example]
region=us-west-2
```

5. Add the profiles for all your AWS accounts:
```
[profile example-staging-admin]
region=us-west-2
role_arn=arn:aws:iam::XXXXXXXXXXXX:role/OrganizationAccountAccessRole
mfa_serial=arn:aws:iam::XXXXXXXXXXXX:mfa/user@example.com
source_profile=example
```

6. Test that it is all set up properly:
```
$ aws-vault login example-staging-admin
```

This should open a browser and log you into the AWS console as the assumed role `example-staging-admin`.
