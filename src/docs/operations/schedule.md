---
title: Schedule
description: Schedule
basePath: api.railwayindia.in
---

## `GET /schedules/<trainNumbers>`

Base path: {basePath}

### Summary

Get schedule for given train numbers(s)

### URL

`/v1/trains/<trainNumber>?fullSchedule=<true/false>`

### Request URL Parameters:

| Parameters  | Required? | Description  |
| ----------- | --------- | ------------ |
| trainNumber | required  | train number |

### Request Query Parameters:

| Parameters   | Required?                 | Description                                                                                                                |
| ------------ | ------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| fullSchedule | (optional, default=false) | include intermediate stations also. Will be applied to all train if multiple train numbers are given in request parameters |

::: warning
[Bad Request](/errorcodes#BadRequest) error response will be given if fullSchedule is any value other than `true` or `false`
:::

### Usage Example:

- {basePath}/api/v1/schedules/12650
- {basePath}/api/v1/schedules/12650?fullSchedule=true

### Possible errors

- [NotFound](/errorcodes#NotFound) : No schedule found for given trainNumber
- [BadRequest](/errorcodes#BadRequest) : query paramtere `fullSchedule` in not a boolean value

### Response

    On success, 200
    On not found, 404

### Response Body

List of schedules

### Response Body Structure

```ts
Array<{
  srNo: String;
  station: {
    id: Number;
    stationCode: String;
    stationName: String;
    stationType: String;
  };
  arrivalTime: String;
  departureTime: String;
  haltTime: String;
  platform: String;
  dayCount: Number;
  distance: Number;
  speed: Number;
  boardingDisabled: Boolean;
  updatedAt: String;
}>;
```

### Sample response

```json
[
  {
    "srNo": "1.000",
    "station": {
      "id": 745,
      "stationCode": "NZM",
      "stationName": "Hazrat Nizamuddin",
      "stationType": "regular"
    },
    "arrivalTime": "08:20:00",
    "departureTime": "08:20:00",
    "haltTime": "00:00:00",
    "platform": "7",
    "dayCount": 1,
    "distance": 0,
    "speed": 0,
    "boardingDisabled": false,
    "updatedAt": "2024-08-04T12:06:52.807Z"
  },
  {
    "srNo": "2.000",
    "station": {
      "id": 737,
      "stationCode": "GWL",
      "stationName": "Gwalior Junction",
      "stationType": "junction"
    },
    "arrivalTime": "11:43:00",
    "departureTime": "11:45:00",
    "haltTime": "00:02:00",
    "platform": "1",
    "dayCount": 1,
    "distance": 305.9,
    "speed": 90.4,
    "boardingDisabled": false,
    "updatedAt": "2024-08-04T12:06:52.807Z"
  },
  {
    "srNo": "3.000",
    "station": {
      "id": 474,
      "stationCode": "VGLB",
      "stationName": "Virangana Lakshmibai Jhansi Junction",
      "stationType": "junction"
    },
    "arrivalTime": "13:01:00",
    "departureTime": "13:09:00",
    "haltTime": "00:08:00",
    "platform": "2",
    "dayCount": 1,
    "distance": 403.4,
    "speed": 77,
    "boardingDisabled": false,
    "updatedAt": "2024-08-04T12:06:52.807Z"
  }
  ...
]
```
