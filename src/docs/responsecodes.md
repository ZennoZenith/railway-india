---
title: Response Codes
description: Response Codes
---

We use standard HTTP codes to denote successful execution or indicate when
errors occur. For some errors, the response will include additional information
about the error, including an application error code and human readable error
description.

As of now there is not authentication required to use our API

## Successful execution

Operations that execute successfully will return 2xx codes, and, where
appropriate, will return the information requested directly in the response
body. The table below shows the typical response codes, entities and headers
used for the various HTTP verbs supported by the API:

| Operation Verb | HTTP Response code | Response body              |
| -------------- | ------------------ | -------------------------- |
| GET            | 200                | The requested data as JSON |

## Error Handling

Operations that result in an error due to a problem on the client's part (eg
invalid input) will standard 4xx codes. Operations that result in an error due
to a problem in the Rev server will return 5xx codes.

Appropriate HTTP response code will be used, example: 401 (Not Authorized) or
404 (Not Found), the response body will include an error entity that gives
further details about the error, including an application error code and a human
readable error description. The format of this error entity is below:

```json
{
  "httpCode": 400,
  "errorCode": 4,
  "title": "Limit Out of Range",
  "error": "Limit value passed: 100",
  "href": "https://railwayindia.in/docs/errorcodes#LimitOutOfRange"
}
```

The table below shows the HTTP response codes and entities used for some common
error conditions:

| HTTP Response code | Error Condition                                               |
| ------------------ | :------------------------------------------------------------ |
| 400                | The submitted data or query parameter was invalid in some way |
| 401                | The user API keys were not specified, or were not valid       |
| 404                | Requested item (eg order, document) does not exist            |
| 429                | Requested item (eg order, document) does not exist            |
| 500                | There was an unexpected error in the RailwayAPI code          |
| 503                | The RailwayAPI is down for maintenance                        |

For more detailed information about error visit [Error codes](./errorcodes)
