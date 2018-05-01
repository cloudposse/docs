---
title: "CodeFresh"
excerpt: ""
---
# Quick Start

## Docker Login to CodeFresh Registry

In order to push/pull images from the CodeFresh docker registry, you'll need to login via the command line API. This is a one-time operation, so you won't need to do this very often.

First, obtain your API key by logging into CodeFresh. 

To get it, login into Codefresh and navigate to User Settings in the bottom left corner.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7f3a5da-Screen_Shot_2018-04-16_at_4.40.57_PM.png",
        "Screen Shot 2018-04-16 at 4.40.57 PM.png",
        897,
        201,
        "#f7f9f9"
      ]
    }
  ]
}
[/block]
Then click the "generate" button next to the "Codefresh Registry" section. Make sure you click "copy token to clipboard" from there and save it in your password manager because you cannot retrieve it again.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/85e5ee4-codefresh.png",
        "codefresh.png",
        631,
        341,
        "#b9dad6"
      ]
    }
  ]
}
[/block]
Your `CF_USER_NAME` is probably your GitHub username, depending on how you login to CodeFresh. The `CFCR_LOGIN_TOKEN` is the one you just generated.

```
docker login r.cfcr.io -u $CF_USER_NAME -p $CFCR_LOGIN_TOKEN
```
[block:callout]
{
  "type": "info",
  "title": "READ MORE",
  "body": "https://codefresh.io/docs/docs/docker-registries/codefresh-registry/"
}
[/block]