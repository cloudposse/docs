---
title: AWS Cli
description: 'The AWS Command Line Interface (CLI) is a command line tool to manage multiple AWS services and is useful for shell automation using scripts.'
tags:
- tools
---

# Tips & Tricks

Delete all versions of objects in an S3 bucket

```
export BUCKET=foobar
aws s3api delete-objects --bucket $BUCKET \
  --delete "$(aws s3api list-object-versions --bucket $BUCKET | \
  jq -M '{Objects: [.["Versions","DeleteMarkers"][]|select(.Key == "key-value")| {Key:.Key, VersionId:.VersionId}], Quiet: false}')"
```

via: [stackoverflow](https://stackoverflow.com/a/36604650/1237191)
