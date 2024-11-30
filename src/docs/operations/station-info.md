---
title: Station info
description: Station info
basePath: api.railwayindia.in
---

# GET /stations/&#x2039;stationCodes&#x203A;

Base path: {basePath}

## Summary

Get station info for given station code(s)

## URL

`/v1/stations/<stationCode>`

## Request URL Parameters:

| Parameters  | Required? | Description  |
| ----------- | --------- | ------------ |
| stationCode | required  | station code |

## Usage Example:

- {basePath}/v1/stations/KIR

## Possible errors

- [NotFound](./errorcodes#NotFound) : No station found for given `stationCode`

## Response HTTP code

    On success, 200
    On not found, 404

## Response Body

List of station info

## Response Body Structure

```typescript
type T = {
  id: Number;
  stationCode: String;
  stationName: String;
  stateName: String;
  zoneCode: String;
  stationAlternateText: String;
  stationType: String;
  numberOfPlatforms: Number;
  hindiStationName: String;
  latitude: String | null;
  longitude: String | null;
  updatedAt: String;
};
```

## Sample response

```json
{
  "id": 550,
  "stationCode": "KIR",
  "stationName": "Katihar Junction",
  "stateName": "Bihar",
  "zoneCode": "NFR",
  "stationAlternateText": "کٹیہار جنکشن     कटिहार जंक्शन",
  "stationType": "junction",
  "numberOfPlatforms": 9,
  "hindiStationName": "कटिहार जंक्शन",
  "latitude": "25.5479300550115000",
  "longitude": "87.5655949115753000",
  "updatedAt": "2024-08-04T12:06:52.807Z"
}
```
