---
title: "Codefresh Cron Triggers"
description: "Cron triggers allow you to schedule jobs to run periodically using a cron-style time specifier."
tags:
- Codefresh
- crontab
- cronjob
- pipeline
---

Codefresh supports [triggers](https://codefresh.io/docs/docs/pipeline-triggers/introduction-triggers/) which can execute a pipeline based on external webooks or cronjobs.

# Configuration

1. First setup a pipeline the way you would for any other kind of build.

2. Navigate to the "Configuration" and select "Add Trigger"
{{< img src="/assets/cron-trigger-7ac0cd4f.png" title="Pipeline Configuration" >}}

3. Select "CRON" as the type and click "Next"
{{< img src="/assets/cron-trigger-ad77ad30.png" title="Cronjob" >}})

4. Pick a schedule
{{< img src="/assets/cron-trigger-4d99f7d0.png" title="Pick Schedule" >}}

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
If rebuilding docker images, you may need to [disable docker caching](https://codefresh.io/docs/docs/troubleshooting/common-issues/disabling-codefresh-caching-mechanisms/) by adding `no_cache: true` to the `type: build` step in the pipeline.

```
build_image:
  title: Build image
  type: build
  description: Build Postgres image with dataset for local development
  image_name: dataset
  dockerfile: Dockerfile
  no_cache: true
```

{{% /dialog %}}

# References

- https://codefresh.io/docs/docs/pipeline-triggers/configure-cron-trigger/
- https://github.com/codefresh-io/cronus/blob/master/docs/expression.md
