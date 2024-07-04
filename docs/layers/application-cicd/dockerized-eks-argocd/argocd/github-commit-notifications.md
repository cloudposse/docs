---
title: "Synchronous Notifications"
sidebar_position: 40
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/argocd/github-commit-notifications.md
tags:
  - argocd
  - github
  - eks
---

# How to setup Synchronous Notifications for ArgoCD with GitHub Commit Statuses

Synchronous notifications are used in ArgoCD release engineering workflows to notify an application workflow of a successful deployment. The application repo deploys an updated app manifest to the ArgoCD deployment repo. Then the ArgoCD app in the EKS cluster pulls and deploys that updated application. Depending on the result of that deployment, ArgoCD triggers a notifier.

## ArgoCD Notification Structure

Our interpretation of ArgoCD breaks up notifications into "notifiers", "templates", and "triggers". You will see these keywords referenced frequently in the `eks/argocd` component.

### Notifiers and Webhook Tokens

A notifier is the top level resource for any notification. If you wish to set up any notification, you must first create a notifier to react to a given event. Furthermore, this is where we set up authorization for webhooks.

By default, we create 2 notifier webhooks: `app-repo-github-commit-status` and `argocd-repo-github-commit-status`, both of which use the `common_github-token` secret as an authorization token. That authorization token is programmatically pulled from AWS SSM using the path defined by `var.notifications_notifiers.ssm_path_prefix`, which is typically `/argocd/notifications/notifiers`. Using this prefix, the `/argocd/notifications/notifiers/common/github-token` parameter value is given to the `common_github-token` secret.

You may add additional notifiers as follows. In this use case, `var.notifications_notifiers` is deep merged with the 2 default notifiers for `app-repo-github-commit-status` and `argocd-repo-github-commit-status`. This allows us to use different authorization tokens for this given webhook than the default `$common_github-token`

```yaml
components:
  terraform:
    eks/argocd:
      vars:
        notifications_notifiers:
          webhook:
            foo-repo-github-commit:
              url: "https://api.github.com"
              headers:
                - name: "Authorization"
                  value: "Bearer $webhook_foo-repo-github-commit_github-token"
```

Similarly, authorization token is programmatically pulled from AWS SSM using the path defined by `var.notifications_notifiers.ssm_path_prefix` _for any `webhook` notifier given_. Therefore, if you add an SSM parameter such as `/argocd/notifications/notifiers/foo-repo-github-commit/github-token`, the component will create the `webhook_foo-repo-github-commit_github-token` secret.

### Templates

A template defines the event structure for a notification. This is the message and webhook. Again, by default we set up `app-repo-github-commit-status` and `argocd-repo-github-commit-status` templates.

```console
  templates:
    template.app-deploy-failed: |
      "alertmanager": null
      "message": "Application {{ .app.metadata.name }} failed deploying new version."
      "webhook":
        "app-repo-github-commit-status":
          "body": "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"error\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
          "method": "POST"
          "path": "/repos/{{call .repo.FullNameByRepoURL .app.metadata.annotations.app_repository}}/statuses/{{.app.metadata.annotations.app_commit}}"
        "argocd-repo-github-commit-status":
          "body": "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"error\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
          "method": "POST"
          "path": "/repos/{{call .repo.FullNameByRepoURL .app.spec.source.repoURL}}/statuses/{{.app.status.operationState.operation.sync.revision}}"
    template.app-deploy-started: |
      "alertmanager": null
      "message": "Application {{ .app.metadata.name }} is now running new version of deployments
        manifests."
      "webhook":
        "app-repo-github-commit-status":
          "body": "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"pending\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
          "method": "POST"
          "path": "/repos/{{call .repo.FullNameByRepoURL .app.metadata.annotations.app_repository}}/statuses/{{.app.metadata.annotations.app_commit}}"
        "argocd-repo-github-commit-status":
          "body": "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"pending\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
          "method": "POST"
          "path": "/repos/{{call .repo.FullNameByRepoURL .app.spec.source.repoURL}}/statuses/{{.app.status.operationState.operation.sync.revision}}"
    template.app-deploy-succeded: |
      "alertmanager": null
      "message": "Application {{ .app.metadata.name }} is now running new version of deployments
        manifests."
      "webhook":
        "app-repo-github-commit-status":
          "body": "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"success\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
          "method": "POST"
          "path": "/repos/{{call .repo.FullNameByRepoURL .app.metadata.annotations.app_repository}}/statuses/{{.app.metadata.annotations.app_commit}}"
        "argocd-repo-github-commit-status":
          "body": "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"success\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
          "method": "POST"
          "path": "/repos/{{call .repo.FullNameByRepoURL .app.spec.source.repoURL}}/statuses/{{.app.status.operationState.operation.sync.revision}}"
```

In order to add additional templates, use `var.notifications_templates`. This value is again deep merged with `app-repo-github-commit-status` and `argocd-repo-github-commit-status`.

```yaml
components:
  terraform:
    eks/argocd:
      vars:
        notifications_templates:
          app-deploy-succeded:
            message: "Application {{ .app.metadata.name }} is now running new version of deployments"
            webhook:
              foo-repo-github-commit:
                body: "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"success\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
                method: "POST"
                path: "/repos/{{call .repo.FullNameByRepoURL .app.metadata.annotations.app_repository}}/statuses/{{.app.metadata.annotations.app_commit}}"
          app-deploy-started:
            message: "Application {{ .app.metadata.name }} is now running new version of deployments"
            webhook:
              foo-repo-github-commit:
                body: "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"pending\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
                method: "POST"
                path: "/repos/{{call .repo.FullNameByRepoURL .app.metadata.annotations.app_repository}}/statuses/{{.app.metadata.annotations.app_commit}}"
          app-deploy-failed:
            message: "Application {{ .app.metadata.name }} failed deploying new version."
            webhook:
              foo-repo-github-commit:
                body: "{\"context\":\"continuous-delivery/{{.app.metadata.name}}\",\"description\":\"ArgoCD\",\"state\":\"error\",\"target_url\":\"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}\"}"
                method: "POST"
                path: "/repos/{{call .repo.FullNameByRepoURL .app.metadata.annotations.app_repository}}/statuses/{{.app.metadata.annotations.app_commit}}"
```

### Triggers

Finally, a trigger determines when these notifications are sent. By default we set up `app-repo-github-commit-status` and `argocd-repo-github-commit-status` triggers.

```console
  triggers:
    trigger.on-deploy-failed: |
      - "oncePer": "app.status.sync.revision"
        "send":
        - "app-deploy-failed"
        "when": "app.status.operationState.phase in ['Error', 'Failed' ] or ( app.status.operationState.phase
          == 'Succeeded' and app.status.health.status == 'Degraded' )"
    trigger.on-deploy-started: |
      - "oncePer": "app.status.sync.revision"
        "send":
        - "app-deploy-started"
        "when": "app.status.operationState.phase in ['Running'] or ( app.status.operationState.phase
          == 'Succeeded' and app.status.health.status == 'Progressing' )"
    trigger.on-deploy-succeded: |
      - "oncePer": "app.status.sync.revision"
        "send":
        - "app-deploy-succeded"
        "when": "app.status.operationState.phase == 'Succeeded' and app.status.health.status
          == 'Healthy'"
```

These triggers may trigger _multiple templates_. For example `trigger.on-deploy-succeded` triggers both `template.app-deploy-succeded.webhook.app-repo-github-commit-status` and `template.app-deploy-succeded.webhook.argocd-repo-github-commit-status`.

## References
- [Setting up ArgoCD](/reference-architecture/setup/argocd/)
- [Argo CD Notifications (official)](https://argocd-notifications.readthedocs.io/en/stable/)
- [GitHub Commit statuses API](https://docs.github.com/en/rest/commits/statuses?apiVersion=2022-11-28#create-a-commit-status)