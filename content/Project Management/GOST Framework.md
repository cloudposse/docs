---
title: "GOST Framework"
excerpt: ""
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3feff88-ghost.png",
        "ghost.png",
        739,
        800,
        "#bbbbc1"
      ],
      "sizing": "80"
    }
  ]
}
[/block]

[block:html]
{
  "html": "<div></div>\n\n<style>\n  .content-body .magic-block-image .block-display-image-size-80 {\nwidth: 25%;\n  }</style>"
}
[/block]

The GOST Framework is a method of clearly articulating a process for achieving a goal. It does this by decomposing it into it's various parts. It helps distinguish between the objectives, strategies and tactics so that relevant stakeholders can focus on what's relevant to them. 


# Goals

A goal defines a broad primary outcome. This is the business driver and should relate to some specific benefit to the business. Strongly recommend defining a single goal.

**Example**: "Improve user productivity for most popular pages across our site"
[block:callout]
{
  "type": "info",
  "title": "HINT",
  "body": "The goal should not include any objectives, strategies or tactics. It's very high-level and should be easily understood by anyone in the business."
}
[/block]
# Objectives

List of measurable outcomes that will be achieved by executing the strategies. Objectives describe *what* will be achieved by the goal. This is the barometer for success. It's how we will know we've achieved our goal.

**Example**: "Reduce page load times by 25%"
[block:callout]
{
  "type": "info",
  "title": "HINT",
  "body": "Typlically, these objectives are described using the following terms: \"minimize\", \"increase\", \"reduce\", \"eliminate\"."
}
[/block]
# Strategies

The specific approach that will be taken to achieve a goal and objectives. They describe *why* the objectives will be met, therefore try to map all the strategies to the objectives.

**Example**: "Use caching to reduce page load times"
[block:callout]
{
  "type": "info",
  "title": "HINT",
  "body": "Strategies should not encompass any tactics. That is, there might be multiple tacts that can be executed to fulfill the strategy. This is geared towards the CIO/CTO audience that might not be well versed on the tactics. For example, \"Use Caching to reduce page load times\""
}
[/block]
# Tactics

Tactics describe *how* specific tools will be used to implement the strategies. Try to map the tools to the strategies.

**Example**: "Use Memcache to cache API responses"
[block:callout]
{
  "type": "info",
  "title": "HINT",
  "body": "Tactics describe the exact solution that will be implemented by the engineering team. Typically, this is a list of technologies (E.g. MySQL, Memcache, Kubernetes, Helm, Docker, etc)"
}
[/block]