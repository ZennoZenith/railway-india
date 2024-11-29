---
title: Station list
description: Station list
basePath: api.railwayindia.in
---

# GET /stations

Base path: {basePath}

## Summary

Get list of stations for given query string

## URL

`/v1/stations?q={queryStiring}&stationCode={stationCode}&limit={limit}`

## Request Query Parameters:

| Parameters  | Required?                      | Description                            |
| ----------- | ------------------------------ | :------------------------------------- |
| q           | partial required               | query string to find like stations     |
| stationCode | partial required               | query string to find like station code |
| limit       | (optional, default=10, max=50) | limit number of stations               |

::: warning
If both `q` and `stationCode` is provided, `q` will take precedence.
:::

::: warning

- [Limit Out Of Range](./errorcodes#LimitOutOfRange) error response will be given if limit is not in range
- [Bad Request](./errorcodes#BadRequest) error response will be given if limit is not a **positive integer**
  :::

## Usage Example:

- {basePath}/v1/stations?q=kati
- {basePath}/v1/stations?q=k&limit=50
- {basePath}/v1/stations?stationCode=ki

## Possible errors

- [NotFound](./errorcodes#NotFound) : No station found for given queryString
- [Bad Request](./errorcodes#BadRequest) : Query parameter is invalid string or is not specified

## Response HTTP code

On success, 200
On not found, 404
On bad request, 400

## Response Body

List of stations

## Response Body Structure

```typescript
Array<{
  id: Number;
  stationCode: String;
  stationName: String;
  stationType: String;
}>;
```

## Sample response

```json
[
  {
    "id": 1720,
    "stationCode": "KATI",
    "stationName": "Kanthi",
    "stationType": "regular"
  },
  {
    "id": 550,
    "stationCode": "KIR",
    "stationName": "Katihar Junction",
    "stationType": "junction"
  },
  {
    "id": 8068,
    "stationCode": "KATA",
    "stationName": "Katili",
    "stationType": "regular"
  }
]
```
