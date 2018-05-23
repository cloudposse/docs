---
title: "Secrets Management Anti-patterns"
---

There are a number of things that should be avoided at all costs.

# Never Share Logins

Do not let users within your organization share login credentials. If logins are shared, then secrets need to be rotated everytime someone leaves the company. Also, audit trails are ineffective as they cannot adequately attribute changes made by individuals.

# Security through Obscurity

Obfuscation is a trap that offers only a false-sense of security. Systems that rely largely on obfuscastion are dangerously insecure. Obfuscation is not easily changed and one "the cat's out of the bag", require signficant re-engineering to fix the vulnerability. Instead, we advocate [security by design]({{< relref "secrets-management/best-practices.md#security-by-design" >}}).

# Do Not Store Secrets in Source Control (e.g. git)

# Hardcode Secrets in Configurations

# Reuse Keys Across Multiple Apps

# Build Homegrown Systems

# Password Complexity Aglorithms
