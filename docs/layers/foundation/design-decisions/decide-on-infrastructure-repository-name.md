---
title: "Decide on Infrastructure Repository Name"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175617661/REFARCH-52+-+Decide+on+Infrastructure+Repository+Name
sidebar_position: 100
refarch_id: REFARCH-52
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-infrastructure-repository-name.md
---

# Decide on Infrastructure Repository Name

We highly recommend using a mono-repo for your foundational infrastructure. This doesn’t preclude introducing other
infrastructure repositories in the future.

Suggestions:

- `infrastructure`

- `infra`

- `$namespace-infra`

- e.g. `cpco-infra`

- `cloud-infrastructure`

- `ops`

- `cloud-ops`

If you already have a repo by any of these names, we suggest you create a new one so we can start with a clean history.
