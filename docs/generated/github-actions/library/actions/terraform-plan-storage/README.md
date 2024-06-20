---
title: terraform-plan-storage
sidebar_label: terraform-plan-storage
sidebar_class_name: command
description: |-
  A GitHub Action to securely store Terraform plan files in a cloud storage (S3 or Azure Blob Storage) with metadata storage in cloud document database (DynamoDB or CosmosDB).
custom_edit_url: https://github.com/cloudposse/github-action-terraform-plan-storage/blob/main/README.yaml
---

# GitHub Action: `terraform-plan-storage`
A GitHub Action to securely store Terraform plan files in a cloud storage (S3 or Azure Blob Storage) with metadata storage in cloud document database (DynamoDB or CosmosDB).




## Introduction

A Github Action to securely store Terraform plan files in a cloud storage (S3 or Azure Blob Storage)  with metadata
storage in cloud document database (DynamoDB or CosmosDB). This is useful in CI/CD pipelines where you want to store
the plan files when a feature branch is opened and applied when merged.



## Usage


## AWS (default)

Standard usage for this action is with AWS. In AWS, we store Terraform plan files in a S3 Bucket and store metadata in DynamoDB. Specify the DynamoDB table name and S3 bucket name with `tableName` and `bucketName` respectively.

The filepath in S3 and the attributes in DynamoDB will use the given `component` and `stack` values to update or create a unique target for each Terraform plan file.

The plan file itself is pulled from or writen to a local file path. Set this with `planPath`.

Finally, choose whether to store the plan file or retrieve an existing plan file. To create or update a plan file, set `action` to `storePlan`. To pull an existing plan file, set `action` to `getPlan`.

```yaml
 - name: github-action-terraform-plan-storage
    uses: cloudposse/github-action-terraform-plan-storage@v1
    id: store-plan
    with:
      action: storePlan
      planPath: my-plan.tfplan
      component: mycomponent
      stack: core-mycomponent-use1
      tablename: github-action-terraform-plan-storage
      bucketname: github-action-terraform-plan-storage

 - name: github-action-terraform-plan-storage
    uses: cloudposse/github-action-terraform-plan-storage@v1
    id: get-plan
    with:
      action: getPlan
      planPath: my-plan.tfplan
      component: mycomponent
      stack: core-mycomponent-use1
      tablename: github-action-terraform-plan-storage
      bucketname: github-action-terraform-plan-storage
```

## Azure

This action also supports Azure. In Azure, we store Terraform plan files with Blob Storage and store metadata in Cosmos DB.

To use the Azure implementation rather than the default AWS implementation, specify `planRepositoryType` as `azureblob` and `metadataRepositoryType` as `cosmos`. Then pass the Blob Account and Container names with `blobAccountName` and `blobContainerName` and the Cosmos Container name, Database name, and Endpoint with `cosmosContainerName`, `cosmosDatabaseName`, and `cosmosEndpoint`.

Again set the `component`, `stack`, `planPath`, and `action` in the same manner as AWS above.

```yaml
 - name: github-action-terraform-plan-storage
    uses: cloudposse/github-action-terraform-plan-storage@v1
    id: store-plan
    with:
      action: storePlan
      planPath: my-plan.tfplan
      component: mycomponent
      stack: core-mycomponent-use1
      planRepositoryType: azureblob
      blobAccountname: github-action-terraform-plan-storage
      blobContainername: github-action-terraform-plan-storage
      metadataRepositoryType: cosmos
      cosmosContainername: github-action-terraform-plan-storage
      cosmosDatabasename: github-action-terraform-plan-storage
      cosmosEndpoint: "https://my-cosmo-account.documents.azure.com:443/"

 - name: github-action-terraform-plan-storage
    uses: cloudposse/github-action-terraform-plan-storage@v1
    id: get-plan
    with:
      action: getPlan
      planPath: my-plan.tfplan
      component: mycomponent
      stack: core-mycomponent-use1
      planRepositoryType: azureblob
      blobAccountname: github-action-terraform-plan-storage
      blobContainername: github-action-terraform-plan-storage
      metadataRepositoryType: cosmos
      cosmosContainername: github-action-terraform-plan-storage
      cosmosDatabasename: github-action-terraform-plan-storage
      cosmosEndpoint: "https://my-cosmo-account.documents.azure.com:443/"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| action | which action to perform. Valid values are: 'storePlan', 'getPlan', 'taintPlan' | storePlan | true |
| blobAccountName | the name of the Azure Blob Storage account to store the plan file | N/A | false |
| blobContainerName | the name of the Azure Blob Storage container to store the plan file | N/A | false |
| bucketName | the name of the S3 bucket to store the plan file | terraform-plan-storage | false |
| commitSHA | Commit SHA to use for fetching plan |  | false |
| component | the name of the component corresponding to the plan file | N/A | false |
| cosmosConnectionString | the connection string to the CosmosDB account to store the metadata | N/A | false |
| cosmosContainerName | the name of the CosmosDB container to store the metadata | N/A | false |
| cosmosDatabaseName | the name of the CosmosDB database to store the metadata | N/A | false |
| cosmosEndpoint | the endpoint of the CosmosDB account to store the metadata | N/A | false |
| failOnMissingPlan | Fail if plan is missing | true | false |
| metadataRepositoryType | the type of repository where the plan file is stored. Valid values are: 'dynamo', 'cosmodb' | dynamo | false |
| planPath | path to the Terraform plan file. Required for 'storePlan' and 'getPlan' actions | N/A | false |
| planRepositoryType | the type of repository where the metadata is stored. Valid values are: 's3', 'azureblob' | s3 | false |
| stack | the name of the stack corresponding to the plan file | N/A | false |
| tableName | the name of the dynamodb table to store metadata | terraform-plan-storage | false |


## Outputs

| Name | Description |
|------|-------------|
<!-- markdownlint-restore -->

