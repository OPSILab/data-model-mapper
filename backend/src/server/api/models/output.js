const mongoose = require("mongoose");

const output = mongoose.Schema({
  
}, { versionKey: false, strict: false });

module.exports = (id) => mongoose.model("output"+id, output);