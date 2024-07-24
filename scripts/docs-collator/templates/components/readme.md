---
title: {{ title }}
sidebar_label: {{ label }}
sidebar_class_name: command
custom_edit_url: {{ github_edit_url }}
tags: [{{ tags|join(', ') }}]
---

{{ content }}

{% if change_log_content|trim != "" %}
## CHANGELOG

{{ change_log_content }}
{% endif %}
