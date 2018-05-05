---
title: "CodeFresh"
excerpt: ""
---
# Quick Start

## Docker Login to CodeFresh Registry

In order to push/pull images from the CodeFresh docker registry, you'll need to login via the command line API. This is a one-time operation, so you won't need to do this very often.

First, obtain your API key by logging into CodeFresh.

To get it, login into Codefresh and navigate to User Settings in the bottom left corner.
![](/images/7f3a5da-Screen_Shot_2018-04-16_at_4.40.57_PM.png)
Then click the "generate" button next to the "Codefresh Registry" section. Make sure you click "copy token to clipboard" from there and save it in your password manager because you cannot retrieve it again.
![](/images/85e5ee4-codefresh.png)
Your `CF_USER_NAME` is probably your GitHub username, depending on how you login to CodeFresh. The `CFCR_LOGIN_TOKEN` is the one you just generated.

```
docker login r.cfcr.io -u $CF_USER_NAME -p $CFCR_LOGIN_TOKEN
```

##### :information_source: READ MORE
> https://codefresh.io/docs/docs/docker-registries/codefresh-registry/
