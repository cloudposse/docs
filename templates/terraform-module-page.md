{{- defineDatasource "config" .Env.README_YAML | regexp.Replace ".*" "" -}}
{{- defineDatasource "includes" .Env.README_INCLUDES | regexp.Replace ".*" "" -}}
---
title: {{ (ds "config").name }}
{{- if has (ds "config") "description" }}
description: |-
{{ (ds "config").description }}
{{- end }}
---

# {{ (ds "config").name }}

|                  |                                                                                                                                                                      |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/{{ (ds "config").github_repo }}>                                                                                                                                    |
| Terraform Module | {{ (ds "config").name }}                                                                                                                                             |
{{- range $badge := (ds "config").badges }}
| {{ $badge.name }} | {{ printf "[![%s](%s)](%s)" $badge.name $badge.image $badge.url }}                                                                                                                                        |
{{- end }}

{{ if has (ds "config") "description" }}
{{ (ds "config").description }}
{{ end }}


{{ if has (ds "config") "screenshots" }}
## Screenshots

{{ range $screenshot := (ds "config").screenshots }}
{{ printf "![%s](%s)\n*%s*" $screenshot.name $screenshot.url $screenshot.description }}{{ end }}
{{ end }}
{{ if has (ds "config") "introduction" }}
## Introduction

{{ (ds "config").introduction -}}
{{ end }}
{{ if has (ds "config") "usage" }}
## Usage

{{ (ds "config").usage -}}
{{ end }}

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
{{ if has (ds "config") "related" }}

## Related Projects

Check out these related projects.
{{ range $related := (ds "config").related }}
{{ printf "- [%s](%s) - %s" $related.name $related.url $related.description }}{{ end }}

{{ end}}
{{ if has (ds "config") "references" }}

## References

For additional context, refer to some of these links. 
{{ range $reference := (ds "config").references }}
{{ printf "- [%s](%s) - %s" $reference.name $reference.url $reference.description }}{{ end }}

{{ end}}
