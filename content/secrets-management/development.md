---
title: "Development Secrets"
---

Inevitably, developers working with external APIs will need access to some number of secrets.


# Docker Compose

Since we prescribe using `docker-compose` for local development environments, externalizing all parameters and secrets is possible by using environment variables. Combined with `chamber`, there's an easy way to secure as much as possible secrets for local consumption and rotate them as necessary.

# Shared Services

While using shared logins is one of the defacto anti-patterns, it's sometimes unavoidable. Some servies do not support multiple logins, SAML integration is not supported, or simply the company cannot justify spending the added cost for multiple licenses/seats.

For shared services or organizational secrets, we recommend using ["1Password for Teams"](https://1password.com/teams/) together with [Duo for MFA](https://duo.com/docs/1password) and [Slack Integration](https://support.1password.com/slack/) for real-time notifications to a shared, monitored channel.
