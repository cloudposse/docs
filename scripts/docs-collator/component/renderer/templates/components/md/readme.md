---
title: {{ title }}
sidebar_label: {{ label }}
sidebar_class_name: command
custom_edit_url: {{ github_edit_url }}
{%- if tags %}
tags:
{%- for tag in tags %}
  - {{ tag }}
{%- endfor %}
{%- else %}
tags: []
{%- endif %}
---

{{ content }}

{%- if change_log_content|trim != "" %}
{{ change_log_content }}
{%- endif %}
