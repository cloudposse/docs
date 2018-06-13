---
title: "Which of your methods/approaches are not subject to change? What can we change?"
description: ""
tags:
- devops
---

# Question

We want to know Which of your methods/approaches to DevOps or Cloud Architecture are not subject to change? What can we change?

# Answer

This is a hard question to answer, generally speaking. 100% of the "Cloud Posse" solution is Open Source, which means everything is subject to change by you or us, or even the community at large.

What we're really providing is the "secret sauce" for how to successfully integrate various components based on our experience, which is the hard part. We have a strategy for doing things that is “internally consistent”, which means basically, “if you do it our way, we promise it will work together”. That said, if someone wants to do something different, for example, use “Google SSO” instead of “AWS Vault”, or use "GitLab CI" instead of "Codefresh", that's entirely possible; just we (Cloud Posse) might not be the best at supporting that deviance from our recommended guidelines.

Sometimes, even small changes can have a **signficant** impact on how well things work well together.

If there's some thing you're interested in doing which you think may break compatibility, the best thing would be to reach out in our [`#community`](https://cloudposse.com/slack/) channel.
