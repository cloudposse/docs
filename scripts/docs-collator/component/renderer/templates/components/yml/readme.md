{{- defineDatasource "config" .Env.README_YAML | regexp.Replace ".*" "" -}}
{{- defineDatasource "includes" .Env.README_INCLUDES -}}
{{- $deprecated := has (ds "config") "deprecated" -}}
{{- $fullModuleName := (ds "config").name -}}
{{- $shortModuleName := ( conv.Default $fullModuleName (conv.Join (coll.GoSlice ($fullModuleName | strings.SplitN "-" 3) 1) "-")) -}}
---
title: {{ $fullModuleName }}
sidebar_label: {{ $fullModuleName }}
sidebar_class_name: command
{{- if has (ds "config") "description" }}
description: |-
{{ index ( (ds "config").description | strings.Split "." )  0 | strings.Indent 2 }}
{{- end }}
{{- if has (ds "config") "tags" }}
tags:
{{ (ds "config").tags | data.ToYAML | strings.Indent 2 -}}
{{- end }}
custom_edit_url: https://github.com/cloudposse-terraform-components/{{ $fullModuleName }}/edit/main/README.md
---

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
{{ (include "includes" $file) }}
{{- end }}
{{- end }}
{{- end }}
