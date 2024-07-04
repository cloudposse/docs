---
title: "Decide on SFTP Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1201438831/REFARCH-485+-+Decide+on+SFTP+Requirements
sidebar_position: 100
refarch_id: REFARCH-485
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-application-dependencies/decide-on-sftp-requirements.md
---

# Decide on SFTP Requirements

## Problem **DRAFT**

## Context

## Considered Options

- Will SFTP access the existing buckets? or do we need to create a new bucket?

- Do you need different users with different levels of access?

- Will users need to be to be restricted to different paths of the SFTP file system?

- Will the service need to be able to accept multiple logins?

- Will the service be public (0.0.0.0/0) or only available to certain CIDRs?

- What are the logging requirements?

- What are the object lifecycle requirements?

- What type of authentication is needed? e.g. Basic certificate-based or SAML?

## References

- [https://aws.amazon.com/blogs/storage/using-okta-as-an-identity-provider-with-aws-transfer-for-sftp/](https://aws.amazon.com/blogs/storage/using-okta-as-an-identity-provider-with-aws-transfer-for-sftp/)

- [https://github.com/cloudposse/terraform-aws-transfer-sftp](https://github.com/cloudposse/terraform-aws-transfer-sftp)

