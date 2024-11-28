---
title: Train info
description: Train info
outline: deep
lastUpdated: true
editLink: true
lang: en-US
basePath: api.railway.zennozenith.com
prev: true
---

# GET /trains/\{trainNumber}

Base path: {{$frontmatter.basePath}}

## Summary

Get train info for given train number

## URL

`/v1/trains/{trainNumber}`

## Request URL Parameters:

| Parameters   | Required? | Description  |
| ------------ | --------- | ------------ |
| trainNumbers | required  | train number |

## Usage Example:

- {{$frontmatter.basePath}}/v1/trains/12650

## Possible errors

- [NotFound](/errorcodes#NotFound) : No trains found for given trainNumber

## Response HTTP codes

    On success, 200
    On not found, 404

## Response Body

A train info JSON object

## Response Body Structure

JSON object containing:

```typescript
type T = {
  id: Number;
  trainNumber: String;
  trainName: String;
  trainFullName: String;
  trainRunningDays: {
    sunday: Boolean;
    monday: Boolean;
    tueday: Boolean;
    wednesday: Boolean;
    thursday: Boolean;
    friday: Boolean;
    saturday: Boolean;
  };
  availableClasses: Array<String>;
  hasPantry: Boolean;
  trainTypeCode: String;
  returnTrainNumber: String;
  stationFrom: {
    id: Number;
    stationCode: String;
    stationName: String;
    stationType: String;
  };
  stationTo: {
    id: Number;
    stationCode: String;
    stationName: String;
    stationType: String;
  };
  departureTime: String;
  arrivalTime: String;
  durationSec: Number;
  distance: Number;
  avgSpeed: Number;
  numberOfStops: Number;
  isActive: Boolean;
  updatedAt: String;
};
```

## Sample response

```json
{
  "id": 980,
  "trainNumber": "12650",
  "trainName": "YPR SAMPARK KRT",
  "trainFullName": "Karnataka Sampark Kranti Express (Via Ballari) (PT)",
  "trainRunningDays": {
    "sunday": true,
    "monday": true,
    "tueday": true,
    "wednesday": false,
    "thursday": true,
    "friday": false,
    "saturday": true
  },
  "availableClasses": [
    "1A",
    "2A",
    "3A",
    "SL",
    "GN"
  ],
  "hasPantry": true,
  "trainTypeCode": "SKR",
  "returnTrainNumber": "12649",
  "stationFrom": {
    "id": 745,
    "stationCode": "NZM",
    "stationName": "Hazrat Nizamuddin",
    "stationType": "regular"
  },
  "stationTo": {
    "id": 994,
    "stationCode": "YPR",
    "stationName": "Yesvantpur Junction",
    "stationType": "junction"
  },
  "departureTime": "08:20:00",
  "arrivalTime": "04:30:00",
  "durationSec": 159000,
  "distance": 2748,
  "avgSpeed": 59,
  "numberOfStops": 19,
  "isActive": true,
  "updatedAt": "2024-08-04T12:06:52.807Z"
}
```
