{{- defineDatasource "config" .Env.README_YAML | regexp.Replace ".*" "" -}}
{{- defineDatasource "includes" .Env.README_INCLUDES | regexp.Replace ".*" "" -}}
{{- $deprecated := has (ds "config") "deprecated" -}}
{{- $fullName := (ds "config").name -}}
{{- $shortName := (index ($fullName | strings.SplitN "-" 3) 2) -}}
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

{{ if has (ds "config") "include" }}
{{ range $file := (datasource "config").include -}}
{{ (include "includes" (printf "%s/%s" $fullName $file)) }}
{{- end }}
{{- end }}
{{- end }}
