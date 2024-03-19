const service = require("../services/service.js")
const utils = require("../../../utils/utils.js")
const log = require('../../../utils/logger').app(module);

module.exports = {

    mapData: async (req, res) => {

        process.res = res;
        let { sourceData, map, dataModel } = utils.bodyMapper(req.body)

        try {
            await service.mapData(sourceData, map, dataModel, req.body.config)
            if (service.error) res.status(404).send(service.error + ".\nMaybe the files name you specified are not correct.")
        }
        catch (error) {
            console.error(error)
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
        service.error = null
        log.debug("service.mapData end");
    },

    getSources: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.getAllSources(req.query.bucketName || req.body.bucketName, req.body.prefix, req.query.format))
        }
        catch (error) {
            console.error(error)
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    getSourcesFromDB: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.getSourcesFromDB())
        }
        catch (error) {
            console.error(error)
            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    getSourcesFromMinio: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.getMinioObjects(req.params.bucketName || req.query.bucketName, req.query.format, []))
        }
        catch (error) {
            console.error(error)
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    getMaps: async (req, res) => {
        process.res = res;
        try { res.send(await service.getMaps()) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    getDataModels: async (req, res) => {
        process.res = res;
        try { res.send(await service.getDataModels()) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    getSource: async (req, res) => {
        const { id, name } = req.query
        process.res = res;
        try { res.send(await service.getSource(id, name)) }
        catch (error) { res.status(error.code || 400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    getMap: async (req, res) => {
        const { id, name } = req.query
        process.res = res;
        try { res.send(await service.getMap(id, name)) }
        catch (error) {
            res.status(error.code || 400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    getConfig: async (req, res) => {
        process.res = res;
        try { res.send(await service.getConfig()) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    getDataModel: async (req, res) => {
        const { id, name } = req.query
        process.res = res;
        try { res.send(await service.getDataModel(id, name)) }
        catch (error) { res.status(error.code || 400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    insertSource: async (req, res) => {
       
        process.res = res;
        try {
            res.send(await service.insertSource(req.body.name, req.body.id, req.body.source, req.body.path, req.body.mapRef))
            log.debug("Source inserted");
        }
        catch (error) {
            console.error(error)
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    insertMap: async (req, res) => {

        process.res = res;
        try {
            res.send(await service.insertMap(req.body.name, req.body.id, req.body.map, req.body.dataModel, req.body.status, req.body.description,
                req.body.sourceData, req.body.sourceDataMinio, req.body.sourceDataID, req.body.sourceDataIn, req.body.sourceDataURL, req.body.dataModelIn, req.body.dataModelID, req.body.dataModelURL,
                req.body.config, req.body.sourceDataType, req.body.path, req.body.bucketName, req.body.prefix))
            log.debug("Map inserted");
        }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    insertDataModel: async (req, res) => {

        process.res = res;
        try {
            res.send(await service.insertDataModel(req.body.name, req.body.id, req.body.dataModel, req.body.mapRef))
            log.debug("Model inserted");
        }
        catch (error) {
            res.status(400).send(error.toString() == "[object Object]" ? error : error.toString())
            console.error(error.toString() == "[object Object]" ? error : error.toString())
        }

    },

    modifySource: async (req, res) => {

        process.res = res;
        try {
            res.send(await service.modifySource(req.body.name, req.body.id, req.body.source, req.body.path, req.body.mapRef))
            log.debug("Source modified");
        }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    modifyMap: async (req, res) => {

        process.res = res;
        try {
            res.send(await service.modifyMap(req.body.name, req.body.id, req.body.map, req.body.dataModel, req.body.status, req.body.description,
                req.body.sourceData, req.body.sourceDataMinio, req.body.sourceDataID, req.body.sourceDataIn, req.body.sourceDataURL, req.body.dataModelIn, req.body.dataModelID, req.body.dataModelURL,
                req.body.config, req.body.sourceDataType, req.body.path, req.body.bucketName, req.body.prefix))
            log.debug("Map modified");
        }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    modifyDataModel: async (req, res) => {
   
        process.res = res;
        try {
            res.send(await service.modifyDataModel(req.body.name, req.body.id, req.body.dataModel, req.body.mapRef))
            log.debug("Schema modified");
        }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    deleteSource: async (req, res) => {
        const { id, name } = req.query
        process.res = res;
        try { res.send(await service.deleteSource(id, name)) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    deleteMap: async (req, res) => {
        const { id, name } = req.query
        process.res = res;
        try { res.send(await service.deleteMap(id || req.params.id, name)) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    deleteDataModel: async (req, res) => {
        const { id, name } = req.query
        process.res = res;
        try { res.send(await service.deleteDataModel(id, name)) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    dereferenceSchema: async (req, res) => {

        process.res = res;
        if (req.body.bucketName) req.body.bucketName = undefined
        if (req.body.prefix) req.body.prefix = undefined

        try { res.send(await service.dereferenceSchema(req.body)) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },

    cleanSchema: async (req, res) => {

        process.res = res;
        if (req.body.bucketName) req.body.bucketName = undefined
        if (req.body.prefix) req.body.prefix = undefined

        try { res.send(await service.dataModelDeClean(req.body)) }
        catch (error) { res.status(400).send(error.toString() == "[object Object]" ? error : error.toString()) }
    },


    minioCreateBucket: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.minioCreateBucket(req.params.bucketName))
        }
        catch (error) {
            let errorStatusCode
            console.error(error)
            if (error.code == "BucketAlreadyOwnedByYou" || error.name == "InvalidBucketNameError")
                errorStatusCode = 400
            else
                errorStatusCode = 500
            if (error.name == "InvalidBucketNameError")
                error.details = "Use lower a case bucket name"
            res.status(errorStatusCode).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    minioGetObject: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.minioGetObject(req.params.bucketName, req.params.objectName, req.query.format))
        }
        catch (error) {
            let errorStatusCode
            console.error(error)
            if (error.code == "NoSuchKey")
                errorStatusCode = 400
            else
                errorStatusCode = 500
            res.status(errorStatusCode).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    minioListObjects: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.minioListObjects(req.params.bucketName || req.query.bucketName))
        }
        catch (error) {
            console.error(error)
            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    minioGetBuckets: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.minioGetBuckets())
        }
        catch (error) {
            console.error(error)
            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    minioSubscribe: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.minioSubscribe(req.params.bucketName))
        }
        catch (error) {
            console.error(error)
            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    minioInsertObject: async (req, res) => {
        process.res = res;
        try {
            res.send(await service.minioInsertObject(req.params.bucketName, req.params.objectName, req.body))
        }
        catch (error) {
            let errorStatusCode
            console.error(error)
            if (error.message == 'third argument should be of type "stream.Readable" or "Buffer" or "string"')
                errorStatusCode = 400
            else
                errorStatusCode = 500
            res.status(errorStatusCode).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    mockGetUser: async (req, res) => {
        try {
            res.send({ pilot: "cartagena", email: "test@hotmail.it" })
        }
        catch (error) {
            console.error(error)
            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },

    getToken: async (req, res) => {
        try {
            res.send(req.headers.authorization.split(' ')[1])
        }
        catch (error) {
            console.error(error)
            res.status(500).send(error.toString() == "[object Object]" ? error : error.toString())
        }
    },
};