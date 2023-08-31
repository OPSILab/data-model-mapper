const mongoose = require("mongoose");

const map = mongoose.Schema({
  name: String,
  id: String,
  status: String,
  description: String,
  map: {},
  dataModel : {},
  mapPathIn: String,
  dataModelIn : String,
  dataModelID : String,
  dataModelURL : String,
  sourceDataType: String,
  sourceDataIn: String,
  sourceData : {} || "",
  sourceDataURL : String,
  sourceDataID : String,
  config : {}
}, { versionKey: false });

module.exports = mongoose.model("map", map);