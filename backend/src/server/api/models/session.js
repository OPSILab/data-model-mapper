const mongoose = require("mongoose");

const session = mongoose.Schema({
  sessionId : String
}, { versionKey: false, strict : false });

module.exports = mongoose.model("session", session);