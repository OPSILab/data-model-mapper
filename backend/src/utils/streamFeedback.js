const fs = require("fs")
const logger = require('percocologger')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// config.waitForFeedback (sent by the Source Connector): after writing a part, wait until the client says it
// has stored it (GET /api/feedback?id=<id>), so the parts do not pile up faster than they are consumed.
// Per session; "*" is the feedback of old clients that send no id. Gives up after streamFeedbackTimeoutMs.
// With config.deleteAckedParts the acknowledged part is then emptied (see emptyAckedPart).
// Used by parsers/sdmx.js (map) and utils/decoders/sdmx.js (parse).
async function waitForFeedback(id, part, config) {
  if (!process.dmm)
    process.dmm = {}
  if (!process.dmm.feedback)
    process.dmm.feedback = {}
  const feedback = process.dmm.feedback
  const timeout = Number(config.streamFeedbackTimeoutMs) || 30 * 60 * 1000
  const start = Date.now()
  logger.debug(`Session ${id}: part ${part} written, waiting for feedback to continue processing...`)
  while (!feedback[id] && !feedback["*"]) {
    if (Date.now() - start > timeout)
      throw new Error(`Session ${id}: no feedback for part ${part} after ${timeout / 1000}s, the client stopped reading the output`)
    await sleep(500)
  }
  delete feedback[id]
  delete feedback["*"]
  if (config.deleteAckedParts)
    emptyAckedPart(id, part, config)
}

// The client has stored the part: its data can go. Done here, on the acknowledgement, and not when the part is
// read: until the feedback the client may read the same part again (a lost response, a retry) and must find it
// whole. Overwritten with "[]" (valid JSON, no unlink): the file stays, so the session keeps its outputs for the
// cleanup in utils.checkMaximumSpaceOverflow, and a late read gets an empty part instead of a parse error.
// writeFileSync on the existing file, without unlink: on Windows re-creating a just-deleted file can fail with
// EPERM while another handle (antivirus, indexer, watcher) still holds it.
// Filesystem only: with sessionLocation.mongo the parts are documents of the output collection.
function emptyAckedPart(id, part, config) {
  if (!config.sessionLocation?.filesystem)
    return
  const file = "./output/" + id + "/" + part + ".json"
  try {
    if (fs.existsSync(file))
      fs.writeFileSync(file, "[]", "utf8")
  } catch (error) {
    // the data is already stored by the client: a part left on disk is only space, not a reason to fail
    logger.warn(`Session ${id}: could not empty acknowledged part ${part}:`, error.message)
  }
}

module.exports = { waitForFeedback }
