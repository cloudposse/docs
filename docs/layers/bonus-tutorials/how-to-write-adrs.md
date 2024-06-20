---
title: "Write ADRs"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171652644/How+to+write+ADRs
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-write-adrs.md
---

# How to write ADRs

Architectural Design Records (ADRs) are how we capture the decision from our customers and record it in the customer's repository.

Once a Jira issue is moved to _Pending Review_ and the decision documented in the issue, then it’s time to record the decision by opening a PR against the customer’s infrastructure repository. Once the PR is merged, then the issue is considered _Done._

## Process

1. Start a new branch for the ADR **(Open one PR per ADR)**

2. Create a new ADR (typically in the `docs/adr` folder).

1. The filename should begin with the index number (e.g. `0005` would be the 5th ADR in the directory), followed by a short description.

2. The short description is _ideally_ the decision, however, that’s frequently too long. In that case, summarize the decision title.

3. Take the decision and the consequences and map them to the corresponding fields in the ADR template

4. Commit the changes, open the PR.

5. Add a link to the PR in the Jira issue to document the work product

6. Request customer and cloud posse team to review the PR

7. Once the PR is merged, move the corresponding _Design Decision_ issue to _Done_.

8. Ensure that corresponding implementation tasks exist and are linked to the _Design Decision_ task.

:::caution
If the ADR outcome requires some work to be performed or implemented, make sure that the corresponding ticket exists. We do not always have a matching implementation task for each design decision predefined in our reference architecture.

:::

## Related Documents

- [How to Document a New Design Decision](/reference-architecture/how-to-guides/tutorials/how-to-document-a-new-design-decision)

## FAQ

### How to generate `docs/adr/README.md` index for ADRs?

We recommend using `adr-tools` to generate the `README.md`

Install `adr-tools` on OSX with Homebrew:

```
brew install adr-tools
echo "docs/adr" > .adr-dir
adr generate toc > docs/adr/README.md
```

If using `prettier` in `.pre-commit.yaml` then add the toc to the file exclusion

```
        files: ^(?!(components\/terraform|docs\/adr)\/.*README).*md$
```

### What is the overall process for making and documenting a Design Decision?

1. On our weekly calls review the [Design Decisions](/reference-architecture/design-decisions) that are in the **BACKLOG**

2. Make a decision and document it in the Jira ticket’s description. Once it’s decided, move it to **READY TO IMPLEMENT**

3. Open a Pull Request with the formalized ADR and comment on the Jira with a link to the Pull Request, then move Jira to **PENDING REVIEW**

4. Once the Pull Request for the ADR is approved and merged, move it to **DONE**

### What is the Source of Truth

The source of truth for ADRs is primarily the corresponding [Design Decisions](/reference-architecture/design-decisions) issue in Jira. We can also borrow from our ADRs to our repo [https://github.com/cloudposse/adr](https://github.com/cloudposse/adr)  and the Design Decisions context from our Reference Architecture confluence ([Design Decisions](/reference-architecture/design-decisions) ).

### Why do we use a sequential numbering system?

The sequential numbering system is to clearly depicts the order in which the ADRs were reached. Keep in mind that decisions can be reverted in subsequent ADRs.

- **NOTE**: when many people are contributing ADRs at the same time, the indexes might end up conflicting.  See RFC below.

### Why don’t we use ticket numbers as the index?

Ticket numbers do not necessarily connote the order of decisions. We generate tickets programmatically from our Reference Architecture and the ticket numbers are based on that. The order in which we decide issues has nothing to do with the order we created them, but if we used ticket numbers, the order would be of creation and not decisions.
Note, we’re proposing a change to this: [Proposed: Use ISO-8601 Date Index for ADRs](/reference-architecture/reference/adrs/proposed-use-iso-8601-date-index-for-adrs)

## RFC

Below are some comments from others on how we can improve the process.

:::caution
**IMPORTANT**: These are not yet decided. Do not incorporate these into ADRs today.

:::

#### **Suggestions**

- Create an ADR Jira ticket type with custom fields @Steven Hopkins

- **Status [Dropdown]** - A decision may be "proposed" if the project stakeholders haven't agreed with it yet, or "accepted" once it is agreed. If a later ADR changes or reverses a decision, it may be marked as "deprecated" or "superseded" with a reference to its replacement.

- **Context [Text Field]** - This section describes the forces at play, including technological, political, social, and project local. These forces are probably in tension, and should be called out as such. The language in this section is value-neutral. It is simply describing facts.

- **Decision [Text Field]** - This section describes our response to these forces. It is stated in full sentences, with active voice. "We will ..."

- **Consequences [Text Field]** - This section describes the resulting context, after applying the decision. All consequences should be listed here, not just the "positive" ones. A particular decision may have positive, negative, and neutral consequences, but all of them affect the team and project in the future.

- Create a script that will generate markdown ADR and progress the Jira ticket as necessary. @Steven Hopkins

- [Proposed: Use ISO-8601 Date Index for ADRs](/reference-architecture/reference/adrs/proposed-use-iso-8601-date-index-for-adrs)
Use date-based indexes (e.g. `2021-09-24-decided-to-use-dates-in-adrs.md`) instead of sequentially incrementing indexes. The combination of date and title should never conflict (even when creating ADR that supersede previous decisions in ADR) and it also gives a better idea of when decisions were made. @Steven Hopkins

- We should definitely not use the ADR number in the markdown title if we do decide to use numbers. It's a real pain when we need to resolve number sequencing issues when we have to update filename and title.

- We discussed opening a PR for each Design Decision during project kickoffs, I see this causing issues for others working in the same repo and wanting to add ADR, they would need to search through all open PR for ADR to find the correct number.

- Dictate how long an ADR can be subject to changes after being merged to the main branch @Yonatan Koren

- Are ADRs immutable and need to be supplanted by another ADR as soon as they’re merged to the main branch?

- Is there a period when they are still “warm” or “wet”? i.e. one month? one sprint? anytime before the technology in scope of the ADR is used in production?

-


