---
title: "Decide on Teams for Escalations"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171947816/REFARCH-468+-+Decide+on+Teams+for+Escalations
sidebar_position: 100
refarch_id: REFARCH-468
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-incident-management/decide-on-teams-for-escalations.md
---

# Decide on Teams for Escalations

## Problem
Teams need to be notified of incidents tied to services that affect them.

## Solution
Come up with a table of services and the teams or business units responsible for them.

Services are associated with incidents

Incidents are escalated to teams

## Other Considerations
- Should the teams map to products, services or business units?

- Should we map the teams to existing teams in IdP or directly associate users to teams in OpsGenie?

#### **Here’s how we think about teams:**

:::note
NOTE: members can also be handled by the IdP integration, but the teams still need to be defined in OpsGenie)

:::

```
teams:
  - name: cloudplatform
    description: "Cloud Platform Team"
    members:
      - username: user@ourcompany.com
        role: admin
      - username: user@ourcompany.com
        role: admin

  - name: security
    description: "Security Team"
    members:
      - username: user@ourcompany.com
        role: admin
      - username: user@ourcompany.com
        role: admin

  - name: compliance-engineering
    description: "Compliance Engineering Team"
    members:
      - username: user@ourcompany.com
        role: admin
      - username: user@ourcompany.com
        role: admin
```

