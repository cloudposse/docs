{{- defineDatasource "config" .Env.README_YAML -}}
{{- defineDatasource "readmeIncludesDir" .Env.README_INCLUDES -}}
{{- $deprecated := has (ds "config") "deprecated" -}}
{{- $fullModuleName := (ds "config").name -}}
{{- $shortModuleName := (index ($fullModuleName | strings.SplitN "-" 3) 2) -}}
---
title: {{ $shortModuleName }}
sidebar_label: {{ $shortModuleName }}
sidebar_class_name: command
{{- if has (ds "config") "description" }}
description: |-
{{ (ds "config").description | strings.Indent 2 }}
{{- end }}
{{- if has (ds "config") "tags" }}
tags:
{{ (ds "config").tags | data.ToYAML | strings.Indent 2 -}}
{{- end }}
custom_edit_url: https://github.com/cloudposse/{{ $fullModuleName }}/edit/master/README.md
---

env.README_YAML: {{ .Env.README_YAML }}
env.README_INCLUDES: {{ .Env.README_INCLUDES }}
Files:
{{ range $file := (datasource "config").include -}}
 - `{{ $file }}`
{{- end }}

# Module: `{{ $shortModuleName }}`

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
{{ (include "readmeIncludesDir" $file) }}
{{- end }}
{{- end }}
{{- end }}
