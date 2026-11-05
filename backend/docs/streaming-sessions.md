# Streamed mapping sessions

How a client (the Source-Connector of the Query Engine Suite, for the Orion datasets) maps or parses a large SDMX
dataset without receiving it in one huge HTTP response: the mapper writes the result in **parts**, the client reads
them one by one and tells the mapper when each part is stored.

References are to files under `backend/src/`.

## In short

```
POST /api/map/transform?streamMode=true        (or POST /api/parse?streamMode=true)
  -> { id }                                    the session has started, the answer comes at once

loop
  GET /api/output?id=<id>&index=<n>&lastId=<last _id>   part n+1, or [] if not written yet / no more parts
  if the part has data:
      store it
      GET /api/feedback?id=<id>&part=<n+1>      the mapper may write the next part (and empty this one)
  else:
      GET /api/reportSync?id=<id>               { completed, status, error, parts, MAPPING_REPORT }
      completed and still [] at the next look -> end
```

## Starting a session

`POST /api/map/transform` (with a map) or `POST /api/parse` (no map: the dataset as it is), with `streamMode=true` in
the query string. The controller answers `{ id }` before mapping (`server/api/controllers/controller.js`, `mapData` /
`parse`); without `streamMode` the client waits for the whole output in the response, as before.

The session id is the user's group (e-mail) followed by a random id.

The options for the streaming are in `config` of the request body:

| Option | Meaning |
|---|---|
| `waitForFeedback` | after writing a part, wait for `GET /api/feedback` before writing the next one |
| `deleteAckedParts` | once a part is acknowledged, empty it (filesystem only) |
| `streamFeedbackTimeoutMs` | how long to wait for a feedback; default 30 minutes, then the session ends with an error |
| `newSdmxDecode` | SDMX decoder used by the map (the Source-Connector sends `true` for map, `false` for parse) |

From the global configuration (`config.js`):

| Key | Meaning |
|---|---|
| `batch` | rows per part (default 30000) |
| `sessionLocation.filesystem` | parts written to `./output/<id>/<n>.json` (n from 1) |
| `sessionLocation.mongo` | parts written to the output collection of the session |

**One of the two `sessionLocation` flags must be true**, otherwise `GET /api/output` always answers `[]` and the client
gets no data.

Parts are written by the SDMX pipelines: `parsers/sdmx.js` (map, `flushRows`) and `utils/decoders/sdmx.js` (parse,
`flushRows`). After each part they set `config.partsWritten`, read by `/reportSync`.

## Reading the parts

`GET /api/output?id=<id>&index=<n>`

- **Filesystem:** returns `./output/<id>/<n+1>.json`, or `[]` if that file does not exist yet.
- **MongoDB:** returns the next `batch` documents of the output collection after `lastId` (the `_id` of the last
  document read); `index=0` without `lastId` reads from the beginning.

Reading never deletes anything: a part read but not yet stored by the client (a lost response, a retry) must be found
whole again.

## Feedback

`GET /api/feedback?id=<id>&part=<n>` (`utils/streamFeedback.js`)

- Records that part `n` of session `id` has been stored. The highest part acknowledged wins, so repeating a feedback is
  harmless.
- The mapper, waiting in `waitForFeedback(id, part)`, sees the acknowledgement and writes the next part.
- With `deleteAckedParts` the acknowledged file is overwritten with `[]`: the data goes, the file stays (the cleanup of
  `checkMaximumSpaceOverflow` still finds the session, and a late read gets an empty part instead of an error). It is
  overwritten rather than deleted because on Windows re-creating a just-deleted file can fail while another process
  holds it. Parts in MongoDB are not emptied.
- Older clients: `feedback?id=<id>` without part acknowledges once; `feedback` without id acknowledges any session.

If no feedback arrives within `streamFeedbackTimeoutMs`, the mapping stops with
`Session <id>: no feedback for part <n> after …s, the client stopped reading the output`.

## Session state

`GET /api/reportSync?id=<id>`

| Answer | Meaning |
|---|---|
| `{ completed: false, status: "starting", parts: 0 }` | registered, still downloading the source |
| `{ completed: false, status: "running", parts, MAPPING_REPORT }` | mapping; the totals are `?` until the end (the source is streamed) |
| `{ completed: true, status: "done", parts, MAPPING_REPORT }` | ended; `parts` = number of parts written |
| `{ completed: true, status: "error", error, parts }` | ended with an error |
| `{ data: "No data" }` | unknown id: never existed, expired, or the mapper was restarted |

Ended sessions are remembered for **1 hour** (`endedSessions` in the controller); after that, or after a restart, the
id is unknown. A client must therefore read the last parts within that hour.

The session can end with the last part already written but not yet read: a client must look once more after seeing
`completed: true`, and stop only when that look returns `[]`.

## The client side (Source-Connector)

`Source-Connector/api/services/service.js`, `readMappingSession`:

- reads part `n` (fresh request each time), stores it, sends the feedback for part `n+1`, moves on;
- on `[]` asks `/reportSync`; ends when the session is completed and one more read is empty;
- fails if the session ended with an error, if the mapper does not know the session (or does not answer) for
  `dmmSessionLostTimeoutMs` (default 5 min), or if nothing moves for `dmmNoProgressTimeoutMs` (default 30 min);
- refreshes its token once when a request is refused (401, or 403 from mappers older than the 401 change);
- repeats a request at once when the connection is reset (no keep-alive towards the mapper).

## Other session endpoints

| Endpoint | |
|---|---|
| `GET /api/report?id=` | the same state as an event stream (SSE), for the GUI |
| `GET /api/session?id=`, `GET /api/sessions` | the stored session (needs `enableSessions`) |
| `GET /api/checkMaximumSpaceOverflow` | cleanup of old sessions beyond `mongoMaxStorageMB` / `fileMaxStorageMB` (automatic unless `manualCheckMaximumSpaceOverflow`) |
