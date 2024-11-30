---
title: Trains Btw Stations
description: Trains Btw Stations
outline: deep
lastUpdated: true
editLink: true
lang: en-US
basePath: api.railway.zennozenith.com
prev: true
---

# GET /trainsBtwStations

    Base path: {basePath}

## Summary

Get trains between stations

## URL

`/v1/trainsBtwStations?fromStation={fromStationCode}&toStation={toStationCode}&allTrains={true/false}`

## Request Query Parameters:

| Parameters  | Required?               | Description                                                     |
| ----------- | ----------------------- | --------------------------------------------------------------- |
| fromStation | required                | Train running from stationCode                                  |
| toStation   | required                | Train running to stationCode                                    |
| allTrains   | optional, default=false | include local train and some not currently running trains also. |

::: warning
[Bad Request](/errorcodes#BadRequest) error response will be given if allTrains is any value other than `true` or `false`
:::

## Usage Example:

- {basePath}/api/v1/trainsBtwStations?fromStation=GWL&toStation=HWH
- {basePath}/api/v1/trainsBtwStations?fromStation=GWL&toStation=HWH&allTrains=true

## Possible errors

- [NotFound](/errorcodes#NotFound) : No trains found between given stations
- [BadRequest](/errorcodes#BadRequest) : Some query parameters are not provided or not stations matched give query parameters

## Response

    On success, 200
    On not found, 404
    On bad request, 400

## Response Body

List of trains running between given station and list of station info

## Sample response

```json
[
  {
    "trainId": 564,
    "trainNumber": "12176",
    "trainName": "CHAMBAL EXPRESS",
    "trainFullName": "Gwalior - Howrah Chambal Express",
    "trainRunningDays": {
      "sunday": false,
      "monday": false,
      "tueday": true,
      "wednesday": false,
      "thursday": false,
      "friday": false,
      "saturday": true
    },
    "availableClasses": [
      "2A",
      "3A",
      "SL",
      "GN"
    ],
    "hasPantry": false,
    "trainTypeCode": "SF",
    "returnTrainNumber": "12175",
    "distance": 1286.2,
    "durationSec": 2700,
    "stationFrom": {
      "srNo": "1",
      "stationId": 737,
      "stationCode": "GWL",
      "stationName": "Gwalior Junction",
      "stationType": "junction",
      "arrivalTime": "07:40:00",
      "departureTime": "07:40:00",
      "haltTimeSec": 0,
      "platform": "1",
      "dayCount": 1,
      "distance": 0,
      "speed": 0,
      "boardingDisabled": false,
      "updatedAt": "2024-08-04T12:06:52.807Z"
    },
    "stationTo": {
      "srNo": "30",
      "stationId": 2,
      "stationCode": "HWH",
      "stationName": "Howrah Junction",
      "stationType": "terminus",
      "arrivalTime": "06:55:00",
      "departureTime": "06:55:00",
      "haltTimeSec": 0,
      "platform": "12,14",
      "dayCount": 2,
      "distance": 1286.2,
      "speed": 62.8,
      "boardingDisabled": false,
      "updatedAt": "2024-08-04T12:06:52.807Z"
    },
    "updatedAt": "2024-08-04T12:06:52.807Z"
  },
  {
    "trainId": 566,
    "trainNumber": "12178",
    "trainName": "CHAMBAL EXPRESS",
    "trainFullName": "Mathura - Howrah Chambal Express",
    "trainRunningDays": {
      "sunday": false,
      "monday": true,
      "tueday": false,
      "wednesday": false,
      "thursday": false,
      "friday": false,
      "saturday": false
    },
    "availableClasses": [
      "2A",
      "3A",
      "SL",
      "GN"
    ],
    "hasPantry": false,
    "trainTypeCode": "SF",
    "returnTrainNumber": "12177",
    "distance": 1286.2999,
    "durationSec": 2700,
    "stationFrom": {
      "srNo": "5",
      "stationId": 737,
      "stationCode": "GWL",
      "stationName": "Gwalior Junction",
      "stationType": "junction",
      "arrivalTime": "07:35:00",
      "departureTime": "07:40:00",
      "haltTimeSec": 300,
      "platform": "1",
      "dayCount": 1,
      "distance": 171.9,
      "speed": 50.3,
      "boardingDisabled": false,
      "updatedAt": "2024-08-04T12:06:52.807Z"
    },
    "stationTo": {
      "srNo": "34",
      "stationId": 2,
      "stationCode": "HWH",
      "stationName": "Howrah Junction",
      "stationType": "terminus",
      "arrivalTime": "06:55:00",
      "departureTime": "06:55:00",
      "haltTimeSec": 0,
      "platform": "12,14",
      "dayCount": 2,
      "distance": 1458.2,
      "speed": 62.8,
      "boardingDisabled": false,
      "updatedAt": "2024-08-04T12:06:52.807Z"
    },
    "updatedAt": "2024-08-04T12:06:52.807Z"
  }
]
```
