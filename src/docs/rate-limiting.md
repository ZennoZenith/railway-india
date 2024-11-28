---
title: Rate limiting
description: Rate limiting
outline: deep
lastUpdated: true
editLink: true
lang: en-US
---

Limits are placed on the number of API requests you may make using your API
key. Rate limits may vary by service, but the defaults are: Minute Limit:
100 requests per minute, these limits are applied across all
api.railway.zennozenith.com API requests. Exceeding these limits will lead to error
HTTP code 429 (Too many request) and stop you from making further requests. The block will
automatically be lifted by waiting a minute. If you need higher rate limits,
contact us.

# How Do I See My Current Usage?

Your can check your current rate limit and usage details by inspecting the RateLimit-Limit and RateLimit-Remaining HTTP headers that are returned on every API response. For example, if an API has the default hourly limit of 1,000 request, after making 2 requests, you will receive this HTTP header in the response of the second request:

`RateLimit-Remaining: 998`

The hourly counters for your API key reset on a rolling basis.

Example: If you made 500 requests at 10:15AM and 500 requests at 10:25AM, your API key would become temporarily blocked. This temporary block of your API key would cease at 11:15AM, at which point you could make 500 requests. At 11:25AM, you could then make another 500 requests. Anyone can register for an API key, which can be used to access data across federal agencies.
