---
title: "Step 7: Slack Notification"
description: "Notify a slack channel upon successful deployment to cluster."
weight: 7
---

After a successful deployment to the cluster, we generally trigger a notification to a Slack channel (e.g. `#qa`) so that others can go check it out. This is especially useful with "Unlimited Staging Environments."

{{< img src="/assets/slack-notification-4f496aeb.png" title="Sample Notification to Slack Channel" >}}

# Dependencies

* [Slack Web Hook URL](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack

# Examples

{{% include-code-block title="Notify Slack with Codefresh" file="release-engineering/cicd-process/examples/slack-notification-codefresh.yaml" language="yaml" %}}
