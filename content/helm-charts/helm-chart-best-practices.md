---
title: "Helm Chart Best Practices"
excerpt: ""
---
# Use Validation

e.g. 
```
{{ required "tokens.auth is required" .Values.tokens.auth }}
```