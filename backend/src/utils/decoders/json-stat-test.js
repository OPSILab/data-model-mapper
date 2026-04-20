process.test = true 
const decode = require("./json-stat");
const config = require("../../../config");
const log = require('../logger')
const { Logger } = log
const logger = new Logger(__filename)
const mock = require("../../../assets/NAMA_10R_3GDP")

const now = Date.now();
decode(mock, "nama").then(result => {
  logger.info("Decoded result in ", Date.now() - now, "ms");
  process.exit(0);
}).catch(error => {
  logger.error("Error decoding JSON-stat data:", error);
    process.exit(0);
});
