---
title: "Can we make the infrastructure simpler with fewer tools to master and points of failure?"
description: "We think that with sufficient GitOps, the developer exposure to the underlying tools is minimized."
tags:
- infrastructure
- GitOps
- enterprise
---

## Question

This plan introduces or swaps a lot of new tools. Can we make the infrastructure simpler with fewer tools to master and points of failure?

## Answer

We hear you. We would like that too. Here's the thing: Every demo we watch and every enterprise product is going to present a simple unrealistic demo that showcases just how easy it is. “Look ma, no hands!” What happens though is when you actually try to orchestrate everything in concert, you will need tools. The UNIX philosophy is to make small, purpose-built tools that do one thing really well. We've embraced this strategy wholeheartedly. It also makes it so various tools can more easily be swapped out for others. This in stark constrast to enterprise solutions, which tend to lock you into one massive product. Our approach is totally different. We look at what exists in the community and see how to leverage it. There are pros/cons with this (like anything else). Sometimes tools go EOL (like with the Bitly OAuth2 proxy). With the enterprise solution, you get a tighter end-to-end integration because they control the entire ecosystem. However, when you want to implement something custom, then good luck. =)

We think that with sufficient GitOps, the developer exposure to the underlying tools is minimized.
