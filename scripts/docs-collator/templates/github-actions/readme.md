{{- defineDatasource "config" .Env.README_YAML -}}
{{- defineDatasource "includes" (env.Getenv "README_INCLUDES" | default "./") -}}
{{- $deprecated := has (ds "config") "deprecated" -}}
{{- $fullName := (ds "config").name -}}
{{- $shortName := (index ((ds "config").github_repo | strings.SplitN "-" 3) 2) -}}
{{/* Inspired https://github.com/Dirrk/action-docs/blob/master/src/default_template.tpl */}}
{{- define "escape_chars" }}{{ . | strings.ReplaceAll "_" "\\_" | strings.ReplaceAll "|" "\\|" | strings.ReplaceAll "*" "\\*" }}{{- end }}
{{- define "sanitize_string" }}{{ . | strings.ReplaceAll "\n\n" "<br><br>" | strings.ReplaceAll "  \n" "<br>" | strings.ReplaceAll "\n" "<br>" | tmpl.Exec "escape_chars" }}{{ end -}}
---
title: {{ $shortName }}
sidebar_label: {{ $shortName }}
sidebar_class_name: command
{{- if has (ds "config") "description" }}
description: |-
{{ (ds "config").description | strings.Indent 2 }}
{{- end }}
{{- if has (ds "config") "tags" }}
tags:
{{ (ds "config").tags | data.ToYAML | strings.Indent 2 -}}
{{- end }}
custom_edit_url: https://github.com/cloudposse/{{ $fullName }}/edit/main/README.md
---

# GitHub Action: `{{ $shortName }}`

{{- if $deprecated }}
## Deprecated

{{ if has (ds "config").deprecated "notice" }}
  {{- (ds "config").deprecated.notice }}
{{- else }}
  This module is no longer actively maintained
{{- end }}

{{ if has (ds "config") "description" }}
### Historical Description

{{(ds "config").description }}
{{- end }}
{{- else }}
{{- if has (ds "config") "description" }}
{{ (ds "config").description }}

{{- end }}
{{- end }}

{{ if has (ds "config") "screenshots" }}
## Screenshots

{{ range $screenshot := (ds "config").screenshots }}
{{ printf "![%s](%s)\n*%s*" $screenshot.name $screenshot.url $screenshot.description }}{{ end }}
{{- end }}

{{ if has (ds "config") "introduction" }}
## Introduction

{{ (ds "config").introduction }}
{{ end }}

{{ if has (ds "config") "usage" }}
## Usage

{{ (ds "config").usage -}}
{{ end }}

{{ if not $deprecated -}}
{{ if has (ds "config") "quickstart" -}}
## Quick Start

{{ (ds "config").quickstart -}}
{{ end }}

{{ if has (ds "config") "examples" }}
## Examples

{{(ds "config").examples }}
{{ end }}

{{- $action := (datasource "config") -}}
{{ if has $action "inputs" }}
## Inputs
<!-- markdownlint-disable -->
| Name | Description | Default | Required |
|------|-------------|---------|----------|
{{- range $key, $input := $action.inputs }}
| {{ tmpl.Exec "escape_chars" $key }} | {{ if (has $input "description") }}{{ tmpl.Exec "sanitize_string" $input.description }}{{ else }}{{ tmpl.Exec "escape_chars" $key }}{{ end }} | {{ if (has $input "default") }}{{ tmpl.Exec "sanitize_string" $input.default }}{{ else }}N/A{{ end }} | {{ if (has $input "required") }}{{ $input.required }}{{ else }}false{{ end }} |
{{- end }}
<!-- markdownlint-restore -->
{{- end }}

{{ if has $action "outputs" }}
## Outputs
<!-- markdownlint-disable -->
| Name | Description |
|------|-------------|
{{- range $key, $output := $action.outputs }}
| {{ tmpl.Exec "escape_chars" $key }} | {{ if (has $output "description") }}{{ tmpl.Exec "sanitize_string" $output.description }}{{ else }}{{ tmpl.Exec "escape_chars" $key }}{{ end }} |
{{- end }}
<!-- markdownlint-restore -->
{{- end }}

{{ if has (ds "config") "include" }}
{{ range $file := (datasource "config").include -}}
{{ (include "includes" ($file)) }}
{{- end }}
{{- end }}
{{- end }}
