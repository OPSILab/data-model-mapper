const utils = require("../utils/utils.js")
module.exports = () => {
  utils.init().then(() => {
    console.log("Starting server...")
    const routes = require("./api/routes/router.js")
    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require('cors');
    const config = require('../../config')
    const swaggerUi = require('swagger-ui-express');
    let swaggerDocument = require('./swagger/swagger.json');
    let minioDocument = require('./swagger/minio.json');
    const log = require('../utils/logger')//.app(module);
    const { type } = require('os');
    const { Logger } = log
    const logger = require('percocologger')
    const dmmServer = express();

    swaggerDocument.host = (config.host == "host.docker.internal" ? "localhost" : config.host) + (config.externalPort ? ":" + (config.externalPort || 5500) : "")
    if (config.basePath)
      swaggerDocument.basePath = config.basePath
    /*
      for (let path in minioDocument.paths)
        swaggerDocument.paths[path] = minioDocument.paths[path]
    */
    let path = "/minio/getObject/{bucketName}/{objectName}" //TODO why?
    swaggerDocument.paths[path] = minioDocument.paths[path]
    dmmServer.use(express.json({ limit: '50mb' }));
    dmmServer.use(express.urlencoded({ limit: '50mb', extended: false }));
    dmmServer.use(cors());
    dmmServer.use(express.json());
    //dmmServer.use(service.resetConfig)
    dmmServer.use(config.basePath || "/api", routes);
    dmmServer.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    function init() {

      mongoose
        //.connect((currentDirectory == "/app" ? config.mongo.replace(/localhost/g, 'host.docker.internal') : config.mongo), { useNewUrlParser: true })
        .connect(config.mongo, {})
        .then(() => {
          dmmServer.listen(config.httpPort || 5500, () => {
            logger.info("Server has started!");
            logger.info("listening on port: " + config.httpPort || 5500);
            //config.backup = JSON.parse(JSON.stringify(config))
            logger.info({
              logLevel: config.logLevel,
              activeWriters: config.writers
            })
            utils.checkMaximumSpaceOverflow().then(() => {
              logger.info("Finished checking MongoDB and filesystem storage size on startup.")
              if(config.debug.sdmxCache || config.debug.cacheDownloadedData)
                logger.warn("IMPORTANT WARNING: Cache for downloaded data and SDMX is enabled. This can led dmm use obsolete data!")
            }).catch(err => {
              logger.error("Error checking MongoDB storage size on startup:", err);
            })
          });
        })
    }

    init()
  })
}
