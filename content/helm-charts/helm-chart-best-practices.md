---
title: "Helm Chart Best Practices"
excerpt: ""
draft: true
---
# Use Validation

e.g.
```
{{ required "tokens.auth is required" .Values.tokens.auth }}
```
