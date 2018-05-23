---
title: "Development Secrets"
---

Inevitably, developers working with external APIs will need access to some number of secrets.


# Docker Compose

Since we prescribe using `docker-compose` for local development environments, externalizing all parameters and secrets is possible by using environment variables. Combined with [`chamber`]({{< relref "tools/chamber.md" >}}), there's an easy way to secure as much as possible secrets for local consumption and rotate them as necessary.

For example, development environments will frequently need access to shared secrets like Mailgun API keys, Google Analytics `UA` code, Sentry API endpoints, Datadog API key for APM, etc. To satsify these requirements, we ensure first that all docker containers accept environment variables for these parameters. Then we manage the secrets themselves with [`chamber`]({{< relref "tools/chamber.md" >}}).

To execute `docker-compose` with chamber, it's pretty straight foward. Usually, you'll need to combine this strategy with something like [`aws-vault`]({{< relref "tools/aws-vault.md" >}}) for assuming AWS roles on your workstation.

```
aws-vault exec eg-dev-admin -- chamber exec app -- docker-compose up
```

In this example, we call [`aws-vault`]({{< relref "tools/aws-vault.md" >}}) and assume a role of `eg-dev-admin` so we can access AWS SSM in the "dev" account. From there, we execute `chamber` and export all environment variables from the `app` service namespace before running the `docker-compose up`. Obviously, that's a mouthful, so what we do in practice is to stick this in a [`Makefile`](/tools/make) target.

```
## Bring up docker-compose environment
compose/up:
  @aws-vault exec eg-dev-admin -- \
    chamber exec app -- \
    docker-compose up
```



# Shared Services

While using shared logins is one of the defacto anti-patterns, it's sometimes unavoidable. Some servies do not support multiple logins, SAML integration is not supported, or simply the company cannot justify spending the added cost for multiple licenses/seats.

For shared services or organizational secrets, we recommend using a robust password manager. Our favorite tool for this is ["1Password for Teams"]({{< relref "tools/1password.md" >}}) together with [Duo for MFA](https://duo.com/docs/1password) and [Slack Integration](https://support.1password.com/slack/) for real-time notifications to a shared, monitored channel.
