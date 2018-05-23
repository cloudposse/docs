---
title: "Codefresh"
description: ""
---
# Quick Start

## Docker Login to Codefresh Registry

In order to push/pull images from the Codefresh docker registry, you'll need to login via the command line API. This is a one-time operation, so you won't need to do this very often.

First, obtain your API key by logging into Codefresh.

To get it, login into Codefresh and navigate to User Settings in the bottom left corner.

![Generate API Key for Codefresh Registry](/assets/7f3a5da-Screen_Shot_2018-04-16_at_4.40.57_PM.png)

Then click the "generate" button next to the "Codefresh Registry" section. Make sure you click "copy token to clipboard" from there and save it in your password manager because you cannot retrieve it again.

![Codefresh Registry Access Token](/assets/85e5ee4-codefresh.png)

Your `CF_USER_NAME` is probably your GitHub username, depending on how you login to Codefresh. The `CFCR_LOGIN_TOKEN` is the one you just generated.

```
docker login r.cfcr.io -u $CF_USER_NAME -p $CFCR_LOGIN_TOKEN
```

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
<https://codefresh.io/docs/docs/docker-registries/codefresh-registry/>
{{% /dialog %}}
