---
title: Versioning
description: Versioning
outline: deep
lastUpdated: true
editLink: true
lang: en-US
prev:
  text: 'Response Codes'
  link: '/responsecodes'
---

API releases are versioned using a two part versioning scheme:
`{major version}.{minor version}` .

We broadly follow [Semantic Versioning](https://semver.org/) principles when
versioning the API. The major version number is incremented when a
backwards-incompatible change occurs. The URLs used in the API reflect this by
incorporating the major version, using the following pattern (relative to the
base URL):

```
/v{major version number}/{operation-specific component}
```

Minor version numbers are incremented when backwards-compatible changes occur.
These do not require a separate URL.

<br>

The following changes are considered **backwards incompatible:**

- removal of a previously supported HTTP resource
- an HTTP resource no longer responding to a previously supported HTTP verb
- A new mandatory attribute or element in an input JSON document (this may be
  either an entirely new mandatory attribute/element, or a previously optional
  attribute/element that is now mandatory)
- A previously always present attribute/element in an output JSON document that
  is now either optional or not present

<br>

The following changes are considered **backwards compatible:**

- addition of new HTTP resources
- support for additional verbs on existing HTTP resources
- new optional attributes or elements in an input JSON document
- previously mandatory attributes or elements in an input JSON document being
  made optional
- new attributes or elements introduced in an output JSON document

<br>

As these lists indicate, the JSON documents produced and consumed by our API are
not based on a strict schema. Client implementations should accordingly be
flexible and capable of supporting (eg by ignoring) new elements and attributes
in the JSON beyond those specified in this document.

We anticipate supporting at least the two most recent major releases of the API
(including the current one) at any given time.
