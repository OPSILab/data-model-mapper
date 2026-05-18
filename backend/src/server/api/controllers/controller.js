const service = require("../services/service.js")
const utils = require("../../../utils/utils.js")
const common = require("../../../utils/common.js")
const { waiting } = utils
const log = require('../../../utils/logger')//.app(module);
const { Logger } = log
const logger = new Logger(__filename)
const fs = require("fs");
const EventEmitter = require('events');
const globalConfig = require("../../../../config.js")
const Session = require("../models/session.js");

module.exports = {

    checkMaximumSpaceOverflow: async (req, res) => {
        if (!globalConfig.manualCheckMaximumSpaceOverflow) {
            await utils.checkMaximumSpaceOverflow()
            res.send({ message: "Maximum space overflow checked" })
        }
        else
            res.status(400).send("Manual check of maximum space overflow is not enabled, so this endpoint cannot be used")
    },

    getSessions: (req, res) => {
        let sessions = []
        for (let key in this)
            if (this[key]?.res)
                sessions.push(key)
        res.send(sessions)
    },

    getOutput: async (req, res) => {
        logger.debug("getOutput called with query: ", req.query)
        req.query.index = req.query.index * 1
        try {
            if (req.query.id === "undefined" && req.query.lastId === "undefined" || !req.query.id)
                return res.status(400).send("id and lastId query parameters are required")
            logger.debug("Fetching output for session ", req.query.id, " with lastId ", req.query.lastId)
            if (req.query.lastId != "undefined" || req.query.index === 0 || !globalConfig.sessionLocation.mongo)
                if (globalConfig.sessionLocation.mongo)
                    return res.send(await service.getOutput(req.query.id, req.query.lastId, parseInt(req.query.index)))
                else if (globalConfig.sessionLocation.filesystem)
                    if (fs.existsSync("./output/" + req.query.id + "/")) {
                        logger.debug("Output directory exists for session ", req.query.id, ", checking for files...")
                        const files = fs.readdirSync("./output/" + req.query.id + "/");
                        logger.debug("Files found: ", files)
                        logger.debug("Looking for file with index ", req.query.index + 1)
                        if (files.length > 0 && files.includes((req.query.index + 1) + ".json")) {
                            logger.debug("Output file found for session ", req.query.id, " with index ", req.query.index + 1, ", reading file...")
                            output = fs.readFileSync("./output/" + req.query.id + "/" + (req.query.index + 1) + ".json", 'utf-8')
                            jsonOutput = JSON.parse(output)//);
                            return res.send(jsonOutput)
                        }
                        else
                            return res.send([])
                    }
                    else
                        return res.send([])
                else
                    return res.send([])
            else
                return res.send([])
        }
        catch (error) {
            logger.error(error)
            return res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    getSession: async (req, res) => {
        if (req.query.id === "undefined" || !req.query.id)
            return res.status(400).send("id is required")
        let session = this[req.query.id]?.res.dmm
        if (!session) {
            //    res.send({ data: "No data" })
            //else
            let output, jsonOutput //JSON.parse(await new Promise(function (resolve, reject) {
            if (globalConfig.sessionLocation.mongo)
                return res.send(await service.getSession(req.query.id))
            else if (globalConfig.sessionLocation.filesystem)
                try {
                    //resolve(
                    if (fs.existsSync("./output/output" + req.query.id + ".json")) {
                        output = fs.readFileSync("./output/output" + req.query.id + ".json", 'utf-8')
                        jsonOutput = JSON.parse(output)//);
                    }
                }
                catch (error) {
                    logger.error(error)
                    //    reject(error)
                }
            else
                return res.send([])
            //}))
            logger.info(output)
            if (jsonOutput || output)
                res.send(jsonOutput || output)
            else
                res.send([])
            //res.send({ data: "No data" }) 
        }
        else
            res.send(session)
    },

    getReportSync: async (req, res) => {
        let config = this[req.query.id]?.res.dmm.config
        if (!config)
            res.send({ data: "No data" })
        else
            res.send({
                MAPPING_REPORT: {
                    Processed_objects: config.rowNumber,
                    Mapped_and_Validated_Objects: config.validCount + '-' + config.rowNumber,
                    Mapped_and_NOT_Validated_Objects: config.unvalidCount + '-' + config.rowNumber,
                },
                ORION_REPORT: utils.isOrionWriterActive() ? {
                    "Object written to Orion Context Broker": config.orionWrittenCount.toString() + '/' + config.validCount.toString(),
                    "Object NOT written to Orion Context Broker": config.orionUnWrittenCount.toString() + '/' + config.validCount.toString(),
                    "Object SKIPPED": config.orionSkippedCount.toString() + '/' + config.validCount.toString(),
                    details: config.orionWriter.details
                } : "Orion writer not enabled"
            }) //[this[req.query.id].res.dmm.outputFile.length -1]})
        //res.send({id:this[req.query.id].res.dmm.outputFile}) //[this[req.query.id].res.dmm.outputFile.length -1]})
    },

    getReport: async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        let end = false
        while (!end) {
            await common.sleep(1000, "Report")
            //const intervalId = setInterval(() => {

            if (!this[req.query.id]) {
                let output, jsonOutput //JSON.parse(await new Promise(function (resolve, reject) {
                try {
                    //resolve(
                    output = fs.readFileSync("./output/output" + req.query.id + ".json", 'utf-8')
                    jsonOutput = JSON.parse(output)//);
                }
                catch (error) {
                    logger.error(error)
                    //    reject(error)
                }
                //}))
                logger.trace(output)
                //if (jsonOutput || output)
                res.write(`data: ${JSON.stringify({ message: (jsonOutput.outputFile || output || "Strange, no data") })}\n\n`)
                res.write(`data: ${JSON.stringify({ close: "now closing" })}\n\n`)
                //res.write(JSON.stringify(jsonOutput.outputFile) || output)
                //else
                //    res.write(JSON.stringify({ data: "Strange, no data" }))
                res.end()
                end = true
                logger.info("res end")
                //clearInterval(intervalId);
            }
            else {
                let config = this[req.query.id]?.res.dmm.config
                if (!config)
                    res.write(JSON.stringify({ data: "No data" }))
                else {
                    let message = {
                        MAPPING_REPORT: {
                            Processed_objects: config.rowNumber,
                            Mapped_and_Validated_Objects: config.validCount + '-' + config.rowNumber,
                            Mapped_and_NOT_Validated_Objects: config.unvalidCount + '-' + config.rowNumber,
                        },
                        ORION_REPORT: utils.isOrionWriterActive() ? {
                            "Object written to Orion Context Broker": config.orionWrittenCount.toString() + '/' + config.validCount.toString(),
                            "Object NOT written to Orion Context Broker": config.orionUnWrittenCount.toString() + '/' + config.validCount.toString(),
                            "Object SKIPPED": config.orionSkippedCount.toString() + '/' + config.validCount.toString(),
                            details: config.orionWriter.details
                        } : "Orion writer not enabled"
                    }
                    res.write(`data: ${JSON.stringify({ message })}\n\n`)
                }
            }
        }
        //}, 1000); // Eseguito ogni 1 secondo
    },

    mapData: async (req, res) => {

        while (process.dataModelMapper?.lockMapping)
            await common.sleep(100, "mapData waiting for lock")

        if (globalConfig.forceInitAfterMapping) {
            await waiting("map")
            process.dataModelMapper.map = "busy"
        }
        let { sourceData, map, decodeOptions, dataModel } = utils.bodyMapper(req.body, req.query)
        const emitter = new EventEmitter();
        emitter.on('message', (message) => {
            if (message == "delete") {
                logger.info("Deleting session ", id)
                //this[id] = null
                if (!req.query.streamMode) {
                    let outputFile = ((req.body.config.mappingReport !== false && globalConfig.mappingReport) || !res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"]) ? res.dmm.outputFile : res.dmm.outputFile.slice(0, res.dmm.outputFile.length - 1)
                    res.send(outputFile);
                }
                /*Session.insertMany({ sessionId: id }).then(result => {
                    logger.log('session inserted');
                }).catch(err => {
                    logger.error(err);
                });*/
                delete this[id]
                logger.info(message, " ", id)
            }
            else if (message.toString().startsWith("error")) {
                logger.info("error")
                delete this[id]
                res.status(500).send(message.toString().substring(5))
                logger.info(message, " ", id)
            }
            else {
                logger.info("Not recognized message for session ", id, ": ", message)
                //this[id] = null
                if (!req.query.streamMode) {
                    let outputFile = ((req.body.config.mappingReport !== false && globalConfig.mappingReport) || !res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"]) ? res.dmm.outputFile : res.dmm.outputFile.slice(0, res.dmm.outputFile.length - 1)
                    res.send(outputFile);
                }
                delete this[id]
                res.status(500).send(message)
                logger.info(message, " ", id)
            }
        });
        emitter.on('error', (error) => {
            logger.error("Error in mapping process for session ", id, ": ", error)
            logger.error(error)
            if (error.response) {
                logger.error(error.response.data)
                logger.error(error.request)
                res.status(error.response.status).send(error.response.data)
            }
            else
                res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        })
        let id
        try {
            function deleteSession(error) {
                logger.info("Emitting delete for session ", id)
                process.dataModelMapper.map = undefined
                process.dataModelMapper.resetConfig = undefined
                if (error)
                    emitter.emit('message', "error" + error.toString())
                else
                    emitter.emit('message', "delete");
            }
            id = req.body.config.group +
                (req.body.reqId || common.createRandId())
            this[
                id
            ] = { res }//TODO .push instead?
            res.dmm = { outputID: id }
            res.dmm.deleteSession = deleteSession
            if (req.query.streamMode)
                res.send({ id })
            //res.send(id)
            let result = await service.mapData(sourceData, map, decodeOptions, dataModel, req.body.config, res, id)
            if (process.dataModelMapper.setupError) res.status(404).send(process.dataModelMapper.setupError + ".\nMaybe the files name you specified are not correct.")
        }
        catch (error) {
            //TODO here should be catched errors from process.js too. Actually there is a workaround in process.js with res.status(500) but it should be fixed properly. The error was genereted from mapHandler
            logger.error(error)
            if (error.response) {
                logger.error(error.response.data)
                logger.error(error.request)
                res.status(error.response.status).send(error.response.data)
            }
            else
                res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.setupError = null
        logger.info("controller.mapData end");
    },

    getSources: async (req, res) => {

        logger.info("Get sources")
        try {
            res.send(await service.getAllSources(req.query.bucketName || req.body.bucketName, req.body.prefix, req.query.format))
        }
        catch (error) {
            logger.error(error)
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getSourcesFromDB: async (req, res) => {

        try {
            res.send(await service.getSourcesFromDB(req.body.prefix))
        }
        catch (error) {
            logger.error(error)
            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    version: async (req, res) => {
        try {
            res.send(await service.getVersion())
        }
        catch (error) {
            logger.error(error)

            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getSourcesFromMinio: async (req, res) => {

        try {
            res.send(await service.getMinioObjects(req.params.bucketName || req.query.bucketName, req.body.prefix, req.query.format, []))
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getMaps: async (req, res) => {

        try {
            res.send(await service.getMaps(req.body.prefix))
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getDataModels: async (req, res) => {

        try {
            res.send(await service.getDataModels(req.body.prefix))
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getSource: async (req, res) => {
        const { id, name, mapRef } = req.query

        try {
            res.send(await service.getSource(id, name, mapRef, req.body.prefix))
        }
        catch (error) {
            logger.error(error)

            res.status(error.code || 400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getMap: async (req, res) => {
        const { id, name } = req.query

        try {
            res.send(await service.getMap(id, name, req.body.prefix))
        }
        catch (error) {
            logger.error(error)

            res.status(error.code || 400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getConfig: async (req, res) => {

        try {
            res.send(await service.getConfig())
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getDataModel: async (req, res) => {
        const { id, name, mapRef } = req.query

        try {
            res.send(await service.getDataModel(id, name, mapRef, req.body.prefix))
        }
        catch (error) {
            logger.error(error)

            res.status(error.code || 400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    insertSource: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"

        try {
            res.send(await service.insertSource(req.body.name, req.body.id, req.body.source, req.body.path, req.body.mapRef, req.body.bucketName, req.body.prefix))
            logger.info("Source inserted");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    insertMap: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.insertMap(req.body.name, req.body.id, req.body.map, req.body.dataModel, req.body.status, req.body.description,
                req.body.sourceData, req.body.sourceDataMinio, req.body.sourceDataID, req.body.sourceDataIn, req.body.sourceDataURL, req.body.dataModelIn, req.body.dataModelID, req.body.dataModelURL,
                req.body.config, req.body.sourceDataType, req.body.path, req.body.bucketName, req.body.prefix))
            logger.info("Map inserted");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    insertDataModel: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.insertDataModel(req.body.name, req.body.id, req.body.dataModel, req.body.mapRef, req.body.bucketName, req.body.prefix))
            logger.info("Model inserted");
        }
        catch (error) {
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
            logger.error(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    modifySource: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.modifySource(req.body.name, req.body.id, req.body.source, req.body.path, req.body.mapRef, req.body.bucketName, req.body.prefix))
            logger.info("Source modified");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    assignSource: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.assignSource(req.body.sourceDataID, req.body.mapRef))
            logger.info("Source assigned");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    assignSchema: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.assignSchema(req.body.dataModelID, req.body.mapRef))
            logger.info("Schema assigned");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    deAssignSource: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.deAssignSource(req.body.sourceDataID, req.body.mapRef))
            logger.info("Source deassigned");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    deAssignSchema: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.deAssignSchema(req.body.dataModelID, req.body.mapRef))
            logger.info("Schema deassigned");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    modifyMap: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.modifyMap(req.body.name, req.body.id, req.body.map, req.body.dataModel, req.body.status, req.body.description,
                req.body.sourceData, req.body.sourceDataMinio, req.body.sourceDataID, req.body.sourceDataIn, req.body.sourceDataURL, req.body.dataModelIn, req.body.dataModelID, req.body.dataModelURL,
                req.body.config, req.body.sourceDataType, req.body.path, req.body.bucketName, req.body.prefix))
            logger.info("Map modified");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    modifyDataModel: async (req, res) => {

        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.modifyDataModel(req.body.name, req.body.id, req.body.dataModel, req.body.mapRef, req.body.bucketName, req.body.prefix))
            logger.info("Schema modified");
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    deleteSource: async (req, res) => {
        const { id, name } = req.query
        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try { res.send(await service.deleteSource(id, name, req.body.prefix)) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    deleteMap: async (req, res) => {
        const { id, name } = req.query
        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.deleteMap(id || req.params.id, name, req.body.prefix, req.body.bucketName))
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    deleteDataModel: async (req, res) => {
        const { id, name } = req.query
        await waiting("crud")

        process.dataModelMapper.crud = "busy"
        try {
            res.send(await service.deleteDataModel(id, name, req.body.prefix))
        }
        catch (error) {
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        process.dataModelMapper.crud =
            process.dataModelMapper.resetConfig = undefined
    },

    dereferenceSchema: async (req, res) => {


        if (req.body.bucketName) req.body.bucketName = undefined
        if (req.body.prefix) req.body.prefix = undefined

        try {
            res.send(await service.dereferenceSchema(req.body))
        }
        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    cleanSchema: async (req, res) => {


        if (req.body.bucketName) req.body.bucketName = undefined
        if (req.body.prefix) req.body.prefix = undefined

        try {
            res.send(await service.dataModelDeClean(req.body))
        }

        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    buildGeoJson: async (req, res) => {


        if (req.body.bucketName) req.body.bucketName = undefined
        if (req.body.prefix) req.body.prefix = undefined

        try {
            res.send(await service.buildGeoJson(req.body))
        }

        catch (error) {
            logger.error(error)

            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },


    minioCreateBucket: async (req, res) => {

        try {
            res.send(await service.minioCreateBucket(req.params.bucketName))
        }
        catch (error) {
            let errorStatusCode
            logger.error(error)

            if (error.code == "BucketAlreadyOwnedByYou" || error.name == "InvalidBucketNameError")
                errorStatusCode = 400
            else
                errorStatusCode = 500
            if (error.name == "InvalidBucketNameError")
                error.details = "Use lower a case bucket name"
            res.status(errorStatusCode).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    minioGetObject: async (req, res) => {

        try {
            res.send(await service.minioGetObject(req.params.bucketName, req.params.objectName, req.query.format))
        }
        catch (error) {
            let errorStatusCode
            logger.error(error)

            if (error.code == "NoSuchKey")
                errorStatusCode = 400
            else
                errorStatusCode = 500
            res.status(errorStatusCode).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    minioListObjects: async (req, res) => {

        try {
            res.send(await service.minioListObjects(req.params.bucketName || req.query.bucketName))
        }
        catch (error) {
            logger.error(error)

            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    minioGetBuckets: async (req, res) => {

        try {
            res.send(await service.minioGetBuckets())
        }
        catch (error) {
            logger.error(error)

            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    minioSubscribe: async (req, res) => {

        try {
            res.send(await service.minioSubscribe(req.params.bucketName))
        }
        catch (error) {
            logger.error(error)

            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    minioInsertObject: async (req, res) => {
        logger.info("Insert object in minio")

        try {
            let result = await service.minioInsertObject(req.body.pilot.toLowerCase(), req.query.email + "/PRIVATE GENERIC Data/" + req.query.fileName, req.file || req.body.file, req.query.scope)
            logger.debug(result)
            res.send({ id: req.query.email, fileName: req.query.fileName, etag: result.etag, path: result.objectName, bucketName: result.bucketName })
            //res.send(await service.minioInsertObject(req.body.pilot.toLowerCase(), req.query.email + "/PRIVATE GENERIC Data/" + req.query.fileName, req.body.file))
            //res.send(await service.minioInsertObject(req.body.pilot, req.params.objectName, req.body))
            //res.send(await service.minioInsertObject(req.params.bucketName, req.params.objectName, req.body))
        }
        catch (error) {
            let errorStatusCode
            logger.error(error)

            if (error.message == 'third argument should be of type "stream.Readable" or "Buffer" or "string"')
                errorStatusCode = 400
            else
                errorStatusCode = 500
            res.status(errorStatusCode).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getToken: async (req, res) => {
        try {
            res.send(req.headers.authorization.split(' ')[1])
        }
        catch (error) {
            logger.error(error)

            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    },

    getLogs: async (req, res) => {
        try {
            res.send(await service.getLogs(req.query.from, req.query.to))
        }
        catch (error) {
            logger.error(error)

            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        //process.dataModelMapper.resetConfig = undefined
    }
};