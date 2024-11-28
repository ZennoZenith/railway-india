---
title: Operations
description: Operations
outline: deep
lastUpdated: true
editLink: true
lang: en-US
prev:
  text: 'Rate Limiting'
  link: '/rate-limiting'
next:
  text: 'GET /stations'
  link: '/operations/station-list'
---

# Operations

The API includes operations for uploading source files, placing orders,
retrieving information about orders and files, and downloading finished
documents (transcripts or captions) or source files for an order.

Below is a summary of each operation, along with a link to a page with detailed
specifications for it.

| Operation                                                          | HTTP Resource/verb            | Remarks                                                         |
| :----------------------------------------------------------------- | :---------------------------- | :-------------------------------------------------------------- |
| [Get list of stations](/operations/station-list)                   | GET /stations                 | Get list of stations for given query string                     |
| [Get station info](/operations/station-info)                       | GET /stations/<stationCodes>  | Get station info for given station code(s)                      |
| [Get list of trains](/operations/train-list)                       | GET /trains                   | Retruns list of trains according to query parameter             |
| [Get train info](/operations/train-info)                           | GET /trains/<trainNumbers>    | Retruns list of train info having train number = `trainNumbers` |
| [Get schedule for given train numbers](/operations/schedule)       | GET /schedules/<trainNumbers> |                                                                 |
| [Get trains between stations](/operations/trains-between-stations) | GET /trainsBtwStations        |                                                                 |
| [Get list of all states](/operations/misc)                         | GET /states                   |                                                                 |
| [Get list of all zones](/operations/)                              | GET /zones                    |                                                                 |
| [Get list of all train types](/operations/)                        | GET /train_types              |                                                                 |
