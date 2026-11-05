# Authentication

Middleware: `backend/src/server/api/middlewares/auth.js`, applied to every API route except `/bearer`, `/version` and
`/mockGetUser`.

## Token

The token is read from the `Authorization` header (`Bearer <JWT>`; a bare token is accepted too) or from the
`authorization` query parameter. It is verified with `authConfig.publicKey` (or each of `authConfig.publicKeys`),
or by Keycloak introspection when `authConfig.introspect` is true, and must have been issued for
`authConfig.clientId` (`azp`) and not be expired.

## Error codes (RFC 6750)

| Case | Answer |
|---|---|
| no token | **401**, `WWW-Authenticate: Bearer` |
| malformed, wrong signature, expired, not yet valid, not active (introspection), issued for another client | **401**, `WWW-Authenticate: Bearer error="invalid_token", error_description="…"` |
| valid token, but the bucket in the url is not the user's | **403** |
| verification failed for another reason (e.g. Keycloak unreachable during introspection) | 500 |

401 means "get a new token and retry", 403 that a new token would not help. Before this change the mapper answered
403 to expired tokens: the Source-Connector still treats a 403 like a 401 (refresh and retry) for older mappers.

## User, bucket and group

After the token check the middleware sets, on the request body:

| Field | Value |
|---|---|
| `bucketName`, `config.orionWriter.fiwareService` | the user's pilot (lower case) |
| `prefix` | `<email>/<minioWriter.defaultInputFolderName>` |
| `config.group` | the e-mail (or username): also the beginning of the session ids |
| `config.orionWriter.fiwareServicePath` | `/<pilot>` |

Where the pilot comes from:

1. **MinIO writer active:** `GET authConfig.userInfoEndpoint` with the user's token, answering
   `{ pilot, username, email }`.
2. If that call fails: `minioWriter.getUserData(email)` scans every bucket for an object whose name begins with the
   e-mail (the user's folder) and takes that bucket as pilot. With `minioWriter.restrictAccess` and no such bucket the
   request gets 500; otherwise it goes on with the claims of the token.
3. Fallback (and when the MinIO writer is not active): the `pilot` claim of the token, else `shared`.

## Authentication disabled

`authConfig.disableAuth: true`: no token check; bucket `shared`, group `shared`, prefix `shared/default`.

> Use a boolean. Any non-empty string counts as true: `disableAuth: "false"` (a string, as older templates had)
> **disables** authentication.

## Map configuration

Before the token check the middleware also merges the configurations: global `config.js` < the `config` stored with
the map (when the request names one) < the `config` of the request.
