---
title: "Decide on Technical Benchmark Framework"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171620109/REFARCH-470+-+Decide+on+Technical+Benchmark+Framework
sidebar_position: 100
refarch_id: REFARCH-470
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-benchmark-compliance/decide-on-technical-benchmark-framework.md
---

# Decide on Technical Benchmark Framework

## Benchmark Considerations

- SOC2 Type II

- HIPAA

- HITRUST

- PCI/DSS

- CIS

- NIST

- ISO27001

- AWS Well-Architected

## SOC2 Considerations

SOC2 defines a set of high-level expectations, but it’s up to the responsible party (e.g. Customer) to assert what controls are in place for each pillar.

1. **Logical and physical access controls**

2. **System operations**

3. **Change management**

4. **Risk mitigation**

Using a combination of one or more of the compliance standards such as CIS, HITRUST, NIST, ISO27001, etc is the typical approach. Organizationally, this is a decision that has both technical and procedural impacts.

The Technical Benchmark Framework should satisfy the vast majority of requirements for both HIPAA and SOC2, which means most likely selecting more than one.

### Questions

- Has the team already started mapping out any of SOC2 controls that would influence technical controls or configurations?

