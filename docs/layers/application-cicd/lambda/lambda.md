---
title: "Lambda with GitHub Workflows"
sidebar_position: 100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

### Overview

![Lambda Deployment Lifecycle](https://github.com/cloudposse/example-app-on-lambda-with-gha/blob/main/publish_lambda.png?raw=true)

### Build and Deployment

Application repository updates S3 with build assets, then updates SSM with the new version.
Each SSM update is basically a promotion, and requires a Terraform run to realize the change.

<details>
<summary>Build and Dev Promote</summary>

<Tabs>

<TabItem value="feature" label="Build and Dev">

```yaml
# .github/workflows/reusable-publish-lambda-zip.yaml
name: Publish Lambda Function
on:
  workflow_call:
    inputs:
      function-name:
        required: true
        type: string
      source-folder:
        required: true
        type: string
      artifacts-bucket-and-prefix:
        required: true
        type: string
      aws-region:
        required: true
        type: string
    secrets:
      cicd-role-arn:
        required: true

permissions:
  id-token: write
  contents: read

jobs:
  publish:
    runs-on: self-hosted
    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: ${{ inputs.cicd-role-arn }}
        aws-region: ${{ inputs.aws-region }}
    - name: Checkout
      uses: actions/checkout@v4
    - name: Package Lambda
      run: |
        cd ${{ inputs.source-folder }} && zip ${{ github.sha }}.zip *
    - name: Push Lambda
      run: |
        aws s3 cp ${{ inputs.source-folder }}/${{ github.sha }}.zip s3://${{ inputs.artifacts-bucket-and-prefix }}/${{ inputs.function-name }}/ --sse
    - name: Write tag to SSM
      run: |
        aws ssm put-parameter --name /lambda/${{ inputs.function-name}}/tag --type String --value ${{ github.sha }} --overwrite
```

</TabItem>

<TabItem value="promote" label="Promote Release">

```yaml
# .github/workflows/reusable-promote-lambda-zip.yaml
name: Publish Lambda Function
on:
  workflow_call:
    inputs:
      function-name:
        required: true
        type: string
      artifacts-bucket-and-prefix:
        required: true
        type: string
      aws-region:
        required: true
        type: string
    secrets:
      cicd-role-arn:
        required: true
      staging-role-arn:
        required: true
      prod-role-arn:
        required: true

permissions:
  id-token: write
  contents: read

jobs:
  publish:
    runs-on: self-hosted
    steps:
    - name: Configure AWS credentials for 'cicd' role
      uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: ${{ inputs.cicd-role-arn }}
        aws-region: ${{ inputs.aws-region }}
    - name: Configure AWS credentials for source stage
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ env.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ env.AWS_SECRET_ACCESS_KEY }}
        aws-session-token: ${{ env.AWS_SESSION_TOKEN }}
        role-duration-seconds: 3000
        role-skip-session-tagging: true
        role-to-assume: ${{ inputs.staging-role-arn }}
        aws-region: ${{ inputs.aws-region }}
    - name: Checkout
      uses: actions/checkout@v4
    - name: Get tag from SSM
      id: get-tag-from-ssm
      run: |
        TAG=`aws ssm get-parameter --name /lambda/${{ inputs.function-name }}/tag | jq -r .Parameter.Value`
        echo "tag=$TAG" >> $GITHUB_OUTPUT
    - name: Copy Lambda to local
      run: |
        aws s3 cp s3://${{ inputs.artifacts-bucket-and-prefix }}/${{ inputs.function-name }}/${{ steps.get-tag-from-ssm.outputs.tag }}.zip .
    - name: Configure AWS credentials for 'cicd' role
      uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: ${{ inputs.cicd-role-arn }}
        aws-region: ${{ inputs.aws-region }}
    - name: Configure AWS credentials for destination stage
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ env.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ env.AWS_SECRET_ACCESS_KEY }}
        aws-session-token: ${{ env.AWS_SESSION_TOKEN }}
        role-duration-seconds: 3000
        role-skip-session-tagging: true
        role-to-assume: ${{ inputs.prod-role-arn }}
        aws-region: ${{ inputs.aws-region }}
    - name: Copy Lambda to destination bucket
      run: |
        aws s3 cp ${{ steps.get-tag-from-ssm.outputs.tag }}.zip \
          s3://${{ inputs.artifacts-bucket-and-prefix }}/${{ inputs.function-name }}/ --sse
    - name: Write tag to SSM
      run: |
        aws ssm put-parameter --name /lambda/${{ inputs.function-name}}/tag --type String --value ${{ steps.get-tag-from-ssm.outputs.tag }} --overwrite
```

</TabItem>

<TabItem value="deploy" label="Optional: Deploy with Spacelift">

```yaml
# .github/workflows/reusable-promote-lambda-zip.yaml
name: Deploy Lambda via Spacelift
on:
  workflow_call:
    inputs:
      function-name:
        required: true
        type: string
      stack:
        required: true
        type: string
    secrets:
      spacelift-api-key-id:
        required: true
      spacelift-api-key-secret:
        required: true

jobs:
  deploy:
    runs-on: self-hosted
    container: 123456789012.dkr.ecr.us-east-2.amazonaws.com/acme/infra:latest
    steps:
    - name: Trigger Spacelift Stack Execution
      env:
        SPACELIFT_API_ENDPOINT: https://acme.app.spacelift.io
        SPACELIFT_API_KEY_ID: ${{ secrets.spacelift-api-key-id }}
        SPACELIFT_API_KEY_SECRET: ${{ secrets.spacelift-api-key-secret }}
      run: |
        spacectl stack deploy --id ${{ inputs.stack }}-lambda-${{ inputs.function-name}} --tail
```

</TabItem>
</Tabs>
</details>

### Implementation

- [`lambda`](/components/library/aws/lambda/): This component is responsible for creating the Lambda function.
After promotion, the Lambda function is updated with the new version.

## References
- [Lambda Setup](/reference-architecture/setup/lambda/)
- [Foundation Release Engineering](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/)
- [Decide on Pipeline Strategy](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/decide-on-pipeline-strategy/)


