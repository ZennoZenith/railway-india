---
title: Response Codes
description: Response Codes
outline: deep
lastUpdated: true
editLink: true
lang: en-US
basePath: api.railway.zennozenith.com
prev: true
---

# Miscellaneous

## GET /states

Base path: {basePath}

### Summary

Get list of all states

### URL

`/v1/states`

### Usage Example:

- {basePath}/v1/states

### Possible errors

- [NotFound](/docs/errorcodes#NotFound) : No state found

### Response

    On success, 200
    On not found, 404

### Response Body

List of states

### Sample response

```json
[
  "Andhra Pradesh",
  "Arunachal Pradesh",
  ...
]
```

## GET /zones

Base path: {basePath}

### Summary

Get all zones

### URL

`/v1/zones`

### Usage Example:

- {basePath}/v1/zones

### Possible errors

- [NotFound](/errorcodes#NotFound) : No zone found

### Response

    On success, 200
    On not found, 404

### Response Body

List of all zones

### Sample response

```json
[
  {
    "zoneCode": "BR",
    "zoneName": "Bangladesh"
  },
  {
    "zoneCode": "CR",
    "zoneName": "Central Railway"
  },
  {
    "zoneCode": "NCR",
    "zoneName": "North Central Railway"
  },
  {
    "zoneCode": "NER",
    "zoneName": "North Eastern Railway"
  },
  ...
]
```

## GET /trainTypes

Base path: {basePath}

### Summary

Get all train types

### URL

`/v1/train_types`

### Usage Example:

- {basePath}/v1/train_types

### Possible errors

- [NotFound](/errorcodes#NotFound) : No train type found

### Response

    On success, 200
    On not found, 404

### Response Body

List of train types

### Sample response

```json
[
  {
    "trainTypeCode": "ANT",
    "trainTypeName": "Antyodaya"
  },
  {
    "trainTypeCode": "DEMU",
    "trainTypeName": "DEMU"
  },
  {
    "trainTypeCode": "DRNT",
    "trainTypeName": "Duronto"
  },
  ...
]
```
