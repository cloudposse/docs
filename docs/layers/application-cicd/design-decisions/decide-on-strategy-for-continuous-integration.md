---
title: "Decide on Strategy for Continuous Integration"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171980446/REFARCH-426+-+Decide+on+Strategy+for+Continuous+Integration
sidebar_position: 100
refarch_id: REFARCH-426
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-strategy-for-continuous-integration.md
---

# Decide on Strategy for Continuous Integration

### Considerations

A strategy for Continuous Integration — i.e. container image builds, and single-page applications need to be adopted.

There are different levels of testing.

- Unit Tests

- Integration Tests

- Linting/Static Analysis Tests

- Security Tests

Centralized storage for test reports

## Options for Unit Tests

## Options for Integration Tests

The options available for integration testing will depend to some degree on the technology. For example, single-page applications that are typically deployed to S3/CloudFront, for integration testing purposes might be still tested as dockerized apps.

### Option 1: Docker Composition with Test Script

### Option 2: Deployment to Cluster with Test Script

Deploy a preview environment and then test it. Note: not all services are suitable for previews.

### Option 3: Test script

## Options for Linting/Static Analysis Tests

- Superlinter

## Options for Security Tests

