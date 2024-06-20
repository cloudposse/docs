---
title: "Decide on Default Schedules"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1271824449/REFARCH-520+-+Decide+on+Default+Schedules
sidebar_position: 100
refarch_id: REFARCH-520
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-incident-management/decide-on-default-schedules.md
---

# Decide on Default Schedules

## Context and Problem Statement

By default, an opsgenie team comes with its own schedule. Sometimes however we want different schedules for different timezones. A team spread across the world would have to manually keep track of the schedule to make sure individuals are only on call for particular hours.

<img src="/assets/refarch/image-20220304-204031.png" height="666" width="1209" /><br/>

## Considered Options

### Option 1  - Use one default Schedule (Recommended)

:::tip
Our Recommendation is to use Option 1 because....

:::

#### Pros

- One single pane of glass for whose on call

#### Cons

- Ensuring people in different timezones are on call at the right times is a manual process

### Option 2 - Many Schedules to follow the sun

#### Pros

- Sets default routing based on timezones to particular schedules.

#### Cons

- Slightly more complex setup

## References

- Links to any research, ADRs or related Jiras


