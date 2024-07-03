---
title: "Decide on ECR Strategy"
---

# Decide on ECR Strategy

This decision assumes that per the previous design decision, we’ll be using ECR to store docker images.

There are a number of ways we can do this. Here are some considerations. Many of these concepts can be combined, so
we’ll just list them out.

## Considerations

- Do you have a monorepo with multiple containers built from different `Dockerfile`. We recommend no more than one
  `Dockerfile` per repo.

- What is the naming convention for repositories? We recommend naming ECR repositories after the GitHub repo.

- Lifecycle rules to restrict the number of images and avoid hard limits

## Architecture

1. We typically deploy a single ECR in the `artifacts` (or similar account like `automation`). This is our typical
   recommendation. Each service will have one docker repository. All images are pushed to this repo with commit SHAs.
   We'll use lifecycle rules on tags to ensure critical images are not deleted. There's no promotion of images between
   ECRs and all ECRs are typically read-only from any account.

2. We can deploy multiple ECRs per service (e.g. `myservice-prod`, `myservice-dev`. Then promote images between the
   ECRs. We’ve only done this once and honestly don’t like it because it adds a lot of complexity to the pipelines
   without much profit.

3. We can deploy one ECR per account or set of accounts. For example, we can have a production ECR and another one for
   everything else. We’ll need to orchestrate image promotion between ECRs, which is the reason we don’t usually
   recommend this.

4. Docker Lambas require ECR within the same account. For this, we’ll need to provision an additional ECR repo per
   account and recommend setting up replication from a centralized repo.

## Configuration

We’ll need the repo in place before we can push docker images to it. When and how should we provision it?

1. Should each service define it’s own ECR in the microservice repository?

- How should this be implemented? For example, if we’re practicing gitops for GitHub repository creation, then we can
  also provision the ECR at the same time. If we’re not, then we’ll need to tie this into the pipelines for the GitHub
  repository itself.

2. Should we centralize this in the foundational infrastructure?

- If we centralize it, how should it be configured?

- Provide a long static-list of repos

- Use the `terraform-github-provider` to generate that list automatically for all repositories
