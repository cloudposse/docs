---
title: "Decide on KMS Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1364951148/REFARCH-532+-+Decide+on+KMS+Requirements
sidebar_position: 100
refarch_id: REFARCH-532
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/decide-on-kms-requirements.md
---

# Decide on KMS Requirements
AWS Key Management Service (AWS KMS) makes it easy to create and manage cryptographic keys and control their use across various AWS services and in your applications. AWS KMS is a secure and resilient service that uses hardware security modules that have been validated under FIPS 140-2, or are in the process of being validated, to protect your keys. AWS KMS is integrated with AWS CloudTrail to provide you with logs of all key usage to help meet your regulatory and compliance needs.

## Context and Problem Statement
Best practice, security certifications, and compliance regulations require that data be “encrypted at rest.” AWS provides options for encrypting data at rest virtually anywhere AWS provides for data storage. However, there remain considerations regarding managing the encryption _keys_ for the encrypted data.

Consideration should begin with a review of governmental, industry, and corporate compliance requirements, standards, and goals regarding encryption at rest, auditability, data localization, data preservation and recovery, high availability, and disaster recovery. Cloud Posse does not provide advice on compliance requirements, it is up to the client to determine their own needs. For example, here is AWS' approach to HIPAA compliance, summarized:

:::info
There is no HIPAA certification for a cloud service provider (CSP) such as AWS. In order to meet the HIPAA requirements applicable to AWS' operating model, AWS aligns their HIPAA risk management program with FedRAMP and NIST 800-53, which are higher security standards that map to the HIPAA Security Rule. NIST supports this alignment and has issued [**SP 800-66 An Introductory Resource Guide for Implementing the HIPAA Security Rule**](http://csrc.nist.gov/publications/nistpubs/800-66-Rev1/SP-800-66-Revision1.pdf), which documents how NIST 800-53 aligns to the HIPAA Security Rule.

:::
In other words, because of the lack of specificity in the HIPAA standard, AWS has decided to follow a stricter, more detailed standard and rely on a ruling that asserts that the stricter standard is sufficient to comply with HIPAA. The client organization needs to make such determinations for itself regarding its compliance goals.

For clients operating outside of specialized regulatory environments (like PCI, HIPAA, or FedRamp), it can be helpful to keep in mind that encryption is not, in general, a required part of the access control system restricting access to data. In most cases, a malicious user who can gain access to the data via the API (by stealing or elevating credentials) will also gain access to the decryption service via the same mechanism. The primary value of encryption in the AWS environment is to enforce access via authorized APIs and prevent unauthorized or accidental access via some kind of bypass of the authorized APIs. For example, the logical model of a file stored in S3 is that there is a single file in a single place containing the data. In reality, the data is duplicated on as many as five (5) devices to provide high availability and protect against loss. If one of those devices is a standard magnetic disk that is replaced due to age or in anticipation of failure, and that device is carelessly discarded and ends up in the hands of a third party, that party would now have access to your data. If that data were, say, a CSV file of Personally Identifiable Information (PII), this would be a serious data breach because the third party could likely figure out what the data is and make use of it, despite the lack of context, just by reading the raw blocks from the drive. Encryption at rest protects against this and similar scenarios by ensuring that access such as this, which bypasses the APIs and takes advantage of the physical implementation of the logical model, will only yield encrypted and therefore useless data.

Nevertheless, because access to data is difficult to control, some certifications focus on encryption plus access controls on the encryption keys to assure and monitor access to the data. The client’s auditors and compliance officers might prefer to audit and monitor use of encryption keys versus access to encrypted data. So the client must review their requirements and preferences to inform the choices regarding KMS usage.

### KMS Keys are Locked to a Region

KMS keys reside in AWS-managed hardware security modules that are physically tied to a single region. Each key can only be used in the region in which it was created. This can, in some sense, enforce Data Localization requirements, although it remains possible to decrypt data in the region and then transport the decrypted data anywhere on the internet.

:::info
- **Data residency** refers to where a business, industry body or government specifies that their data is stored in a geographical location of their choice, usually for regulatory or policy reasons.

- **Data sovereignty** refers to who has power over data. For example, data stored in Germany is subject to the laws of both German and the European Union.

- **Data localization** is the most stringent and restrictive concept of the three, and like data sovereignty, is a version of data residency predicated on legal obligations.

It requires that data created within certain borders stay within them. For example, if an organization has personal data about Russian citizens, Russia’s “On Personal Data” (OPD) law states that such data must reside in data centers or other facilities within the Russian Federation.

:::

KMS _multi-region keys_ are actually a synchronized collection of single region keys, each one individually provisioned. The difference is that they have the same key material and same key ID, so they can be used interchangeably. Data encrypted by a multi-region key in one region can be transported to another region in encrypted form and then decrypted by the replica key in that region. This may sound attractive, but it is rarely needed in practice and comes with several issues. (See [Security considerations for multi-Region keys](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html#mrk-when-to-use).) Although a single region key cannot be converted into a multi-region key, the choice to use a multi-region key is generally one that can be deferred until a strong use case emerges for one, and even then can be used just for that specific use case

### Multiple Types of KMS Keys

Amazon documents three (3) types of AWS KMS:

- **Customer managed key** – (Also called Customer Master Key, CMK, AWS KMS key, and KMS key.) Customers create and control the lifecycle and key policies of customer managed keys. All requests made against these keys are logged as CloudTrail events.

- **AWS managed keys** – (Also referred to as Default Keys.) AWS creates and controls the lifecycle and key policies of AWS managed keys, which are resources in a customer’s AWS account. Customers can view access policies and CloudTrail events for AWS managed keys, but cannot manage any aspect of these keys. All requests made against these keys are logged as CloudTrail events.

- **AWS owned keys** – These keys are created and exclusively used by AWS for internal encryption operations across different AWS services. Customers do not have visibility into key policies or AWS owned key usage in CloudTrail.

As documented, AWS owned keys are practically invisible to customers, so your only real choice is between AWS managed keys and customer managed keys. With Customer managed keys, you also have the some control over the key type (symmetric or asymmetric), cipher, and how the key is generated, but Cloud Posse recommends using the defaults (symmetric AES-256 generated by KMS).

### Key Identifiers

KMS keys can have a few different [identifiers](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id), usually called `KeyId`. When created, they are immediately given a _Key ID_ (not what is meant by `KeyId`) which uniquely identifies a KMS key within an account and Region. That Key ID, plus account and region info, constitutes a _Key ARN_, a unique, fully qualified identifier for the KMS key. Additionally, you can create an _Alias Name_ (actually, you can create several) that provides a friendly name for the key. Furthermore, that Alias Name can be associated with different keys at different points in time. More importantly, while you cannot control the Key ID when you create a customer managed key, you can control the value of the Alias Name for the key. This allows you to have the same Alias in every account and region, which then allows you to have the same configuration (referencing the Alias rather than the Key ID or ARN) in every account and every region even though they all point to different keys.  Like a Key ID, an Alias can be used to constitute an Alias ARN, which is also a unique, fully qualified identifier for the alias, and for the KMS key, it represents.

AWS Managed keys are created automatically and are tied to a specific service, such as S3 or SSM, and are usually used by default when you specify encryption but do not specify a KMS key. They all have Alias Names beginning with `aws/` and are named according to the service or usage. For example `aws/s3` is used to encrypt S3 bucket data, while `aws/ebs` is used to encrypt EBS volumes.

### Cost of KMS

KMS is not free. Each AWS KMS key you create costs $1/month (prorated hourly). The $1/month charge is the same for symmetric keys, asymmetric keys, HMAC keys, each multi-Region key (each primary and each replica multi-region key), keys with imported key material, and keys in custom key stores. If you enable automatic key rotation, each newly generated backing key costs an additional $1/month (prorated hourly). This covers the cost to AWS KMS of retaining all versions of the key material so they can be used to decrypt older ciphertexts. Each API request to the AWS Key Management Service (outside of the free tier) costs.

[https://aws.amazon.com/kms/pricing/](https://aws.amazon.com/kms/pricing/)

:::caution
**S3 Encryption**

Every encrypted object in an S3 bucket is encrypted with a different data key. The default/legacy method of S3 encryption uses KMS to generate each data key. For buckets with a large number of objects and/or lots of traffic, this can create a burdensome amount of KMS activity. To reduce the impact on KMS (latency, cost of operations), AWS introduced the [Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html#using-bucket-key) feature. The documentation is a bit unclear on the topic, but it appears that using a bucket key allows S3 to create the data keys directly, without going to the KMS service, speeding up the creation of new objects. It is not clear if it also speeds up decryption operations. However, as long as you are comfortable with using a single KMS key to encrypt all the objects in a single S3 bucket, using a Bucket Key will at best be a significant win (99% reduction in KMS operations) and at worst be no better than not, so **<ins>we recommend using S3 Bucket Keys</ins>**.

:::

## Considered Options

### Option 1: Use AWS Managed Keys  (Recommended where applicable)

:::tip
The simplest solution is to use encryption keys as defense in depth, without attempting to leverage keys as additional access controls or monitoring opportunities.

:::

Use default keys by alias (e.g. `aws/s3`, `aws/ssm`) everywhere possible. Create a single key per account, per region, with the same alias, e.g. `default_key`, for services that do not create their own default keys, such as EKS. Transfer encrypted data across accounts and regions by decrypting in the source region and re-encrypting under new keys in the target region. Use aliases wherever possible to reduce confusion.

#### Pros

- Default keys are automatically created by AWS with appropriate key policies and are automatically managed and rotated by AWS.

- Per-region, per-account keys provide full isolation for high-availability and redundancy.

#### Cons

- Default keys are created on demand, and Terraform cannot reference them before they are created.

- Default keys can only be used by the service they were created for. You cannot alter the key policies for the default keys to allow them to be used elsewhere.

- Not every service has a default key, so, you may still need to create at least one customer managed key, and it has to be created exactly once in some component before any other component needs it.

- In some situations, a configuration may end up transferring encrypted data to a new region that will not have access to the key to decrypt it.

### Option 2: Use Customer Managed Keys

:::tip
If it is desired to use access control on encryption keys to limit access to data, use a key per category of data, identified by alias, per account and region.

:::

- Create keys for each regulation or category of protected information, such as PCI, PHI, PII, assigning aliases based on intended usage.

- Create an additional `default_key` for use for encryption of data not requiring special handling.

- Use alias in configuration wherever possible.

- Use separate keys per region and per account, but use the same alias everywhere for the same purpose.

- Use access control on the keys to keep the data from being transferred to other accounts (or regions, if necessary).

#### Pros

- Easier to audit, monitor, and manage access to protected information

- Explicit creation of keys allows explicit creation of key policies and grants, providing an easy-to-view/review/manage point of control

- Immediately and permanently revoke access to all data simply by deleting the key. See [Deleting AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html).

#### Cons

- No clear, intuitive way to handle mixed data. For example, what encryption key do you use for a database that holds both PHI and PCI data? Or do you use two (2) separate databases so you can separate the data by category/KMS key?

- Extra work to configure and deploy keys outside of components where they will be used. May end up creating keys that are never used.

- Immediately and permanently lose access to all data if the KMS key is deleted. See [Deleting AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html).

### Option 3: Use a Customer Managed Key per Workload

Key per workload

Multi-region keys

#### Pros

- Key is managed by same component as the one using it, no order-of-operations issues in Terraform

- Data encrypted in one region can be decrypted in a different region (whether this is pro or con is a matter of perspective)

#### Cons

- No clear justification for treating secrets in S3 different from secrets in a database or EKS cluster.

- No audit trail or precise control over data by regulatory or compliance category.

- Controlling access and enforcing data security policy is more complex with multi-Region keys. You must ensure that policy is audited consistently on key across multiple, isolated regions. And you need to use policy to enforce boundaries instead of relying on separate keys.

For example, you need to set policy conditions on data to prevent payroll teams in one Region from being able to read payroll data for a different Region. Also, you must use access control to prevent a scenario where a multi-Region key in one Region protects one tenant's data and a related multi-Region key in another Region protects a different tenant's data.

- Auditing keys across Regions is also more complex. With multi-Region keys, you need to examine and reconcile audit activities across multiple Regions to understand key activities on protected data.

- Compliance with data residency mandates can be more complex. With isolated Regions, you can ensure data residency and data sovereignty compliance. KMS keys in a given Region can decrypt sensitive data only in that Region. Data encrypted in one Region can remain completely protected and inaccessible in any other Region.

To verify data residency and data sovereignty with multi-Region keys, you must implement access policies and compile AWS CloudTrail events across multiple Regions.

- AWS Services that use KMS keys do not take advantage of multi-Region keys. They still decrypt data in one region, use encrypted communication to move it to another region, and re-encrypt the data in the new region, even though the keys are the same.

## References

- [AWS KMS FAQs](https://aws.amazon.com/kms/faqs/)

- [AWS Key Management Service details](https://docs.aws.amazon.com/kms/latest/cryptographic-details/intro.html)

- [Does data localization cause more problems than it solves?](https://d1.awsstatic.com/institute/AWS-Sovereignty-and-Data-Localization-2022.pdf)

- [AWS CloudHSM](https://aws.amazon.com/cloudhsm/)

- [Security considerations for multi-Region keys](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html#mrk-when-to-use)

- [KMS Key IDs](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id)

- [Reducing the cost of SSE-KMS with Amazon S3 Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html)

- [Deleting AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html)


