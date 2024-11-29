---
title: Train list
description: Train list
basePath: api.railwayindia.in
---

# GET /trains

Base path: {basePath}

## Summary

Get list of trains for given query string

## URL

`/v1/trains?q={queryStiring}&trainNumber={trainNumber}&limit={limit}`

## Request Query Parameters:

| Parameters  | Required?                           | Description                                          |
| ----------- | ----------------------------------- | :--------------------------------------------------- |
| q           | partial required                    | query string to find like train number or train name |
| trainNumber | partial required                    | query string to find like train number               |
| limit       | optional, default=10, min=1, max=50 | limit number of trains                               |

::: warning
If both `q` and `trainNumber` is provided, `q` will take precedence.
:::

::: warning

- [Limit Out Of Range](./errorcodes#LimitOutOfRange) error response will be given if limit is not in range
- [Bad Request](./errorcodes#BadRequest) error response will be given if limit is not a **positive integer**
  :::

## Usage Example:

- {basePath}/v1/trains?q=taj
- {basePath}/v1/trains?q=126
- {basePath}/v1/trains?q=12&limit=15
- {basePath}/v1/trains?trainNumber=126

## Possible errors

- [Not Found](./errorcodes#NotFound) : No trains found for given query
- [Bad Request](./errorcodes#BadRequest) : Query parameter is invalid string or is not specified

## Response HTTP codes

    On success, 200
    On not found, 404
    On bad request, 400

## Response Body

List of trains

## Response Body Structure

```typescript
Array<{
  id: i32;
  train_number: String;
  train_name: String;
  train_type_code: String;
}>;
```

## Sample response

```json
[
  {
    "id": 931,
    "trainNumber": "12601",
    "trainName": "MAS MAQ MAIL",
    "trainTypeCode": "SF"
  },
  {
    "id": 932,
    "trainNumber": "12602",
    "trainName": "MAQ CHENNAIMAIL",
    "trainTypeCode": "SF"
  },
  {
    "id": 933,
    "trainNumber": "12603",
    "trainName": "MAS HYB EXPRESS",
    "trainTypeCode": "SF"
  }
]
```
