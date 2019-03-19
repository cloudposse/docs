---
title: "What about the Buzzfeed fork of the Bitly proxy?"
description: 'The Buzzfeed SSO proxy has been labeled a "fork" of the Bitly OAuth 2 proxy; but it technically shares very little, if anything.'
tags:
- Buzzfeed
- Bitly
- OAuth 2
---

## Question

What about the Buzzfeed fork of the Bitly proxy?

## Answer

The Buzzfeed SSO proxy has been labeled a "fork" of the Bitly OAuth 2 proxy; but it technically shares very little, if anything. At least they ripped out support for all other SSO authentication providers aside from Google. Also, it does not support WebSockets, which is needed by the Kubernetes Dashboard. If you're already leveraging Google (G Suite) SSO, then it doesn't matter, since that's the out-of-the-box support . If you’re using another SSO provider (e.g. AWS or Okta), then support is probably lacking.

We can support the Buzzfeed SSO proxy. However, depending on your SSO provider, there maybe be some R&D associated with it.
