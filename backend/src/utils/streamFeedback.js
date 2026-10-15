const logger = require('percocologger')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// config.waitForFeedback (sent by the Source Connector): after writing a part, wait until the client says it
// has stored it (GET /api/feedback?id=<id>), so the parts do not pile up faster than they are consumed.
// Per session; "*" is the feedback of old clients that send no id. Gives up after streamFeedbackTimeoutMs.
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
}

module.exports = { waitForFeedback }
