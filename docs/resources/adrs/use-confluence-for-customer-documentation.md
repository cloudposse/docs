---
title: "Use Confluence for Customer Documentation"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176371867/Use+Confluence+for+Customer+Documentation
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/use-confluence-for-customer-documentation.md
---

# Use Confluence for Customer Documentation

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

- We are no longer using Confluence. Now all documentation is included with [docs.cloudposse.com](https://docs.cloudposse.com/) and formatted with Docusarus.

:::

## Context

Cloud Posse maintains a significant amount of documentation sprawled around our public open source repos, customer repos, and platforms (e.g. LucidChart, Google Docs, GitHub, YouTube). We struggle to write and keep the documentation up to speed, communicate changes to the documentation, and disseminate the documentation. More than any other company, we integrate dozens and dozens of tools and technologies. The landscape is also continuously changing beneath our feet, forcing us to make changes and adapt.

## Options Considered

### Confluence (Decided)

We debated for a long time whether or not to use Confluence, and for a long time were very much against the product because it felt clunky/slow and lacked the features of more modern documentation systems. Over the past couple of years, after significant investment by Atlassian into the product it is much faster, less clunky, and added essential features such as commenting on phrases and supports live editing.

#### Pros

- Extensions for most things we want (PlantUML, embeds, iframes, LucidCharts, etc)

- Tightly integrates into Jira, our Workflow Management platform and where we keep our reference architecture

- Updates to documentation can be worked on in a draft mode before publishing

- Accessible to all customers immediately (more scalable)

- Most of our customers use Atlassian products (Jira, Confluence, Service Desk)

- APIs exist for updating documentation and pulling it out

- We can archive pages without deleting them

- Zapier automation enables us to take action when things change

- Native [workflow automation coming soon](https://www.youtube.com/watch?v=N8WCeJldvFs)

- We’re already paying for the additional seats

- We can embed markdown content from anywhere, including our other repos using [Atlassian Marketplace Markdown Macro for Confluence](https://marketplace.atlassian.com/apps/1211438/markdown-macro-for-confluence?hosting=cloud&tab=overview)
([see example](/components/library/aws/account-settings/))

- Fully managed solution we do not need to host

#### Cons

- Cost per seat is not insignificant

- Does not natively export content to Markdown or GitHub (however, tools exist to facilitate this and we may write one eventually specifically for our reference architecture)

- Versions of documentation do not necessarily relate to a customer’s version of the software. For customers who are sensitive to this, we encourage vendoring relevant portions of documentation.

- Confluence does not have a native desktop client for Mac or PC

- No support for redlining or “suggest” like functionality that the author can simply accept; the workaround is to leave a comment on the section with the suggested changes

### Open Source All Documentation

We strongly considered open-sourcing all of our documentation, which would provide anyone the ability to implement and use our reference architecture.  Our plan is instead to eventually open-source portions of our documentation but to not let that hold us up and start aggregating it in one place. We decided against this because for the reasons below.

#### Pros

- One place to update the documentation for all of our customers and community

- Radically increase the adoption of our process and methodology

- Receive contributions via GitHub Pull Requests

- Use our existing documentation infrastructure (hugo)

#### Cons

- No way to easily wall off portions of our documentation based on our current documentation infrastructure with Hugo and S3.

- We already receive an overwhelming amount of contributions and requests from our community. If our documentation were all public, it would increase our support burden while decreasing the time we focus on customers

- Difficult to share more sensitive or private information with our customers (contact information, architectural diagrams). We want to be as forthcoming as possible and make it as easy as possible to prioritize the support our customers need, over worrying about what we can publish publicly.

### Use GitHub with Markdown

We started delivering documentation to all customers via Markdown in GitHub. The problem is organizing the documentation leaves a lot to be desired.

#### Pros

- Easily vendored into customer repositories

- Use GitHub Pull Request / Code Review process

- Technology neutral solution

- Distribute documentation easily and securely with Private GitHub Pages

#### Cons

- Private Github Pages are only supported by GitHub Enterprise, which most of our customers do not use

- Hosting a private documentation portal (e.g. Hugo) is even more opinionated since most customers already host documentation in some system. Plus it would require some form of authentication.

- Using markdown by itself is very limiting and incorporating screenshots, images, diagrams is very tedious - since exported images are quickly out of date.

- Opening Pull Requests is arguably much slower and a larger barrier to contribution

### Vendor All Documentation

We have always wanted to help customers by providing documentation in their systems, but trying to serve our customers this way has not scaled with our rate of growth and the number of integrations we support. This is similar to [Use GitHub with Markdown](#)

#### Pros

- Customers have a version of the documentation that closely matches exactly what is deployed

- Infrastructure code and documentation are alongside each other

- Customers control changes to documentation

#### Cons

- No practical way to syndicate documentation and changes across customers

- Customers miss out on corrections, updates, and improvements

- Cost to customers is significantly greater

### Notion

Notion is a very polarizing system. Many users using Notion came from some other system like Confluence, Evernote or Quip. We felt massive FOMO not jumping ship to Notion, but decided against it for the reasons below.

#### Pros

- It supports some very nice ways to provide documentation; it’s somewhere in-between Evernote meets Airtable

- Integrates with systems like Jira

- Nice cross-platform Desktop application

#### Cons

- It’s another vendor and would require additional cost-per-seat to share

- Until recently, it provided no API whatsoever.

- Very few of our customers use Notion compared to the alternatives

- @Erik Osterman cannot stand all the cheesy UTF-8 emojis sprinkled everywhere on every page. 🚀 😵 💩

## Decision

- Use our `REFARCH` space in Confluence to aggregate, share, and disseminate documentation

## Consequences

- Share `REFARCH` space with all customers


