---
title: Introduction
description: Introduction
outline: deep
lastUpdated: true
editLink: true
lang: en-US
---

The Railway API is a REST API for getting train , schedules, station , trains
between stations and other railway related informations. The API consists of
several resources which support standard HTTP operation for accomplishing
these tasks. Each supported resource-operation pair is documented in detail.

## Resource Representations

For all methods which accept or return structured data, uses JSON format.

## URLs

The URLs for the various resources use the following pattern:

```
https://api.railwayindia.in/v<version>/<operation-specific component>
```

The components of the URL are:

- `version` - the API [version](./versioning). Currently there is only one
  version, "0", in operation
- `operation-specific component` - this identifies the actual operation you want
  to do, eg /trains for getting a list of trains

## Libraries

We have an official wrapper for the Railway API for all operations described on
these pages.

- <a href="https://github.com/ZennoZenith/api-railway">NodeJS</a>

If you created your own library and would like it posted here,
<a href="mailto:zennozenith@gmail.com">please let us know.</a>
