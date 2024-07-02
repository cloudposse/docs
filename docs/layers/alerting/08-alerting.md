# Alerting

## Quick Start

You will need a OpsGenie account!

Please follow the sign up steps in
[How to Sign Up for OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/integrations/opsgenie/how-to-sign-up-for-opsgenie/)

## How To

### Vendor

Like most other components we need to vendor in the component. This can be done with

`atmos workflow vendor -f alerting` or `atmos vendor pull --component opsgenie-team`.

### Deploy

#### Setting up OpsGenie Teams

Teams are the foundation of our OpsGenie implementation. Each team has schedules, rotations, integrations, and more.

We need teams to be able to be easily spun up, but also be fully customizable. To accomplish this we have setup a
reference team YAML file with many options written out but left disabled. You can find it here
`stacks/catalog/opsgenie-team/_defaults.yaml`.

Please read
[How to Create New Teams in OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/integrations/opsgenie/how-to-create-new-teams-in-opsgenie/)
and
[How to Implement Incident Management with OpsGenie](https://docs.cloudposse.com/reference-architecture/how-to-guides/integrations/opsgenie/).

Once your company defaults have been setup and your teams customized, simply deploy the `opsgenie-team` component.

`atmos terraform deploy opsgenie-team/<team-name> -s core-gbl-auto`. we have provided 2 sample teams `opsgenie-team/sre`
and `opsgenie-team/app-team-1`. Their definitions can be found `stacks/catalog/opsgenie-team`
