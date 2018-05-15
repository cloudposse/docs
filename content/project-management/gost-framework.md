---
title: "GOST Framework"
description: "The GOST Framework is a method of clearly articulating a process for achieving a goal."
slug: gost-framework
---
![GOST Framework](/assets/3feff88-ghost.png)

The GOST Framework is a method of clearly articulating a process for achieving a goal. It does this by decomposing it into it's various parts: [G]oals, [O]bjectives, [S]trategies, [T]actics. It helps distinguish between the objectives, strategies and tactics so that relevant stakeholders can focus on what's relevant to them.

# Goals

A goal defines a broad primary outcome. This is the business driver and should relate to some specific benefit to the business. Strongly recommend defining a single goal.

**Example**: "Improve user productivity for most popular pages across our site"

{{% dialog type="tip" icon="fa fa-info-circle" title="Tip" %}}
The goal should not include any objectives, strategies or tactics. It's very high-level and should be easily understood by anyone in the business.
{{% /dialog %}}

# Objectives

List of measurable outcomes that will be achieved by executing the strategies. Objectives describe *what* will be achieved by the goal. This is the barometer for success. It's how we will know we've achieved our goal.

**Example**: "Reduce page load times by 25%"

{{% dialog type="tip" icon="fa fa-info-circle" title="Tip" %}}
Typically, these objectives are described using the following terms: "minimize", "increase", "reduce", "eliminate".
{{% /dialog %}}

# Strategies

The specific approach that will be taken to achieve a goal and objectives. They describe *why* the objectives will be met, therefore try to map all the strategies to the objectives.

**Example**: "Use caching to reduce page load times"

{{% dialog type="tip" icon="fa fa-info-circle" title="Tip" %}}
Strategies should not encompass any tactics. That is, there might be multiple tacts that can be executed to fulfill the strategy. This is geared towards the CIO/CTO audience that might not be well versed on the tactics. For example, "Use Caching to reduce page load times"
{{% /dialog %}}

# Tactics

Tactics describe *how* specific tools will be used to implement the strategies. Try to map the tools to the strategies.

**Example**: "Use Memcache to cache API responses"

{{% dialog type="tip" icon="fa fa-info-circle" title="Tip" %}}
Tactics describe the exact solution that will be implemented by the engineering team. Typically, this is a list of technologies (E.g. MySQL, Memcache, Kubernetes, Helm, Docker, etc)
{{% /dialog %}}
