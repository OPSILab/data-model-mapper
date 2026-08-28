/*******************************************************************************
 * Data Model Mapper
 *  Copyright (C) 2019 Engineering Ingegneria Informatica S.p.A.
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *  
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

//'use strict';
const schemaHandler = require('../schemaHandler.js');
const mapHandler = require('../mapHandler.js');
const csvParser = require("../parsers/csvParser.js");
const geoParser = require("../parsers/geoJsonParser.js");
const jsonParser = require("../parsers/jsonParser.js");
const orionWriter = require("../writers/orionWriter");
const fileWriter = require("../writers/fileWriter");
const log = require('../utils/logger')//.app(module);
const { Logger } = log
const logger = require('percocologger')
const report = require('../utils/logger').report;
const utils = require('../utils/utils.js');
const common = require('../utils/common.js');
const config = require("../../config.js");
const { load } = require('nconf');
const sdmxDecoder = require('../parsers/sdmx.js');

//var promises = [];

const processSource = async (sourceData, sourceDataType, mapData, dataModelSchemaPath, schema, NGSI_entity, minioObj, config, res, rawSourceData, decodeOptions) => {

    logger.debug({ sourceData })

    if (!res.dmm)
        res.dmm = {}
    res.dmm.promises = []

    config.validCount = 0;
    config.unvalidCount = 0;
    config.orionWrittenCount = 0;
    config.orionUnWrittenCount = 0;
    config.orionSkippedCount = 0;
    config.fileWrittenCount = 0;
    config.fileUnWrittenCount = 0;
    config.rowNumber = 0;

    res.dmm.config = config

    //reinitializeProcessStatus();

    if (dataModelSchemaPath && mapData) {

        logger.debug("dataModelSchemaPath && mapData")

        if (sourceData || rawSourceData) {

            //logger.trace("sourceData:");
            //logger.trace(sourceData);
            //logger.debug(typeof sourceData)

            if (sourceData) {
                if (typeof sourceData === 'object') sourceData = sourceData.toString()
                //logger.trace(sourceData);

                if (typeof sourceData === 'string') {

                    sourceData = utils.parseFilePath(sourceData);

                    for (let i in sourceData)
                        if (sourceData[i][sourceData[i].length - 1] == ",")
                            sourceData[i] = sourceData[i].slice(0, sourceData[i].length - 1)

                    var extension = sourceData.ext;
                    if (!extension) {
                        // No file path provided nor dataType
                        logger.error('The provided url/file path does not have file extension');
                        return Promise.reject('The provided url / file path does not have file extension');
                    }

                } else if (!sourceDataType) {
                    // No file path provided nor dataType
                    logger.error('No file path provided nor dataType');
                    return Promise.reject('No file path provided nor dataType');
                }
            }

            if (typeof mapData === 'string' && !mapData.startsWith("{")) {
                mapData = utils.parseFilePath(mapData);
                logger.debug("typeof mapData === 'string' && !mapData.startsWith({})");
            }

            try {
                // Load Map form file/url or directly as object
                var map = await mapHandler.loadMap(mapData[1] == "mapData" ? mapData[0] : mapData); // map is the file map loaded
                logger.debug("map is the file map loaded")
            } catch (error) {
                logger.error('There was an error while loading Map: ');
                logger.error(error)
                return Promise.reject('There was an error while loading Map: ' + error);
            }


            if (map) {
                logger.info('Map loaded');
                logger.debug({ map })

                try {

                    // Load Data Model Schema from either map field "TargetDataModel", url or local file
                    let targetDataModel;
                    if ((targetDataModel = map['targetDataModel']) !== undefined) {
                        logger.debug(targetDataModel)
                        /* Check if provided TargetDataModel is valid, otherwise return error */
                        if ((dataModelSchemaPath = utils.getDataModelPath(targetDataModel)) === undefined) {
                            logger.error("Incorrect target Data Model name: " + targetDataModel);
                            res?.status(400).json({ "error": "Incorrect target Data Model name: " + targetDataModel })
                            return Promise.reject("Incorrect target Data Model name");
                        }
                    }
                    delete map['targetDataModel'];
                    var loadedSchema = await schemaHandler.parseDataModelSchema(dataModelSchemaPath); // here schema is loaded
                    logger.info('Data Model Schema loaded and dereferenced');

                } catch (error) {
                    logger.error('There was an error while processing Data Model schema: ');
                    logger.error(error)
                    if (schema)
                        loadedSchema = JSON.parse(JSON.stringify(schema))
                    else
                        return Promise.reject(error);
                }

                logger.info('Starting to Map Source Object');
                logger.debug(extension || sourceDataType.toLowerCase())

                switch (extension || sourceDataType.toLowerCase()) {

                    case '.txt':
                    case 'txt':
                        csvParser.sourceDataToRowStream(sourceData, map, loadedSchema, processRow, processMappedObject, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
                        break;
                    case '.csv':
                    case 'csv':
                        csvParser.sourceDataToRowStream(sourceData, map, loadedSchema, processRow, processMappedObject, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
                        break;
                    case '.json':
                    case 'json':
                        await jsonParser.sourceDataToRowStream(sourceData, map, loadedSchema, processRow, processMappedObject, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
                        break;
                    case '.geojson':
                    case 'geojson':
                        geoParser.sourceDataToRowStream(sourceData, map, loadedSchema, processRow, processMappedObject, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
                        break;
                    case 'sdmx-xml':
                        await await sdmxDecoder(
                            (Array.isArray(rawSourceData) && rawSourceData[0] || rawSourceData),
                            null,
                            null,
                            null,
                            decodeOptions.fromUrl,
                            decodeOptions.id,
                            config,
                            processRow,
                            processMappedObject,
                            finalizeProcess,
                            NGSI_entity,
                            minioObj,
                            res,
                            map,
                            loadedSchema
                        );
                    default:
                        break;
                }
                return await Promise.resolve("OK");

            } else {
                logger.error('There was an error while loading Map File');
                return await Promise.reject('There was an error while loading Map File');
            }

        } else {
            logger.error('The source Data is not a valid file nor a valid path/url: ');
            return await Promise.reject('The source Data is not a valid file nor a valid path/url');
        }

    } else if (!dataModelSchemaPath) {
        logger.error('Data Model Schema path not specified');
        return await Promise.reject('Data Model Schema path not specified');
    } else {
        logger.error('Map path not specified');
        return await Promise.reject('Map path not specified');
    }


};


const processRow = async (rowNumber, row, map, schema, mappedHandler, NGSI_entity, minioObj, config, res) => {//TODO this can confict with command line mode: fix

    /** If any, extract site, service and group for Id Pattern from Map and 
     * set globally for each row of this mapping, otherwise use the ones initialized in the Global Vars 
     **/

    config.idSite = map['idSite'] || config.idSite || config.site;
    config.idService = map['idService'] || config.idService || config.service;
    config.idGroup = map['idGroup'] || config.idGroup || config.group;
    delete map['idSite'];
    delete map['idService'];
    delete map['idGroup'];
    try {
        var result = mapHandler.mapObjectToDataModel(rowNumber, utils.cleanRow(row, NGSI_entity, config), map, schema, config.idSite, config.idService, config.idGroup, config.entityNameField, NGSI_entity, minioObj, config, res);
    }
    catch (error) {
        logger.error(error, "\n", error.message)
        res.dmm.outputFile ? res.dmm.outputFile.push({ error: error.message, tips: (!config.disableAjv ? "Try to set disableAjv=true in config.js" : "I don't know, try asking Dmm's developer.") }) : res.dmm.outputFile = [{ error: error.message, tips: (!config.disableAjv ? "Try to set disableAjv=true in config.js" : "I don't know, try asking Dmm's developer.") }]
    }

    logger.debug("Row: " + rowNumber + " - Object mapped correctly ");
    //logger.trace("Result: " + JSON.stringify(result))
    await mappedHandler(rowNumber, result, schema, res.dmm.promises, config);
    return result
};

const processMappedObject = async (objNumber, obj, modelSchema, promises, config) => {
    if (!promises)
        promises = []
    try {
        config.writers.forEach(async (writer) => {

            switch (writer) {

                case 'orionWriter':
                    try {
                        //logger.trace("obj : " + JSON.stringify(obj))
                        promises.push(
                            async () => await orionWriter.writeObject(objNumber, obj, modelSchema, config)
                        );
                    }
                    catch (error) {
                        logger.error(error.toString())
                        //logger.debug(JSON.stringify(error))
                    }
                    break;
                case 'fileWriter':
                    promises.push(async () => await fileWriter.writeObject(objNumber, obj, config.fileWriter.addBlankLine, config));
                    break;
                default:
                    //promises.push(await common.sleep(0));
                    break;
            }
        });
    }
    catch (error) {
        logger.error(error.toString())
        //logger.debug(JSON.stringify(error))
    }
};

const finalizeProcess = async (minioObj, config, res) => {

    let promises = res.dmm.promises
    if (!res.dmm.outputFile)
        return res.status(500).json({ "error": "No output file. Sometimes it can be caused by ajv. Try to set disableAjv=true in config.js" })
    //TODO this error is not catched by controller: throw new Error("No output file. Sometimes it can be caused by ajv. Try to set disableAjv=true in config.js"). This should be fixed because res.send should not be called here

    try {
        //await Promise.all(promises);
        for (let i = 0; i < promises.length; i++) {
            logger.debug("Promise ", i)
            try {
                await promises[i]();//TODO this fails after a certain value of i
                if (config.orionWriter.delayBetweenRequests)
                    await common.sleep(config.orionWriter.delayBetweenRequests)
            }
            catch (error) {
                logger.error(error, promises[i], promises.length)
            }
        }

        //WARNING: this indeed restore global env but brokes the orion request
        /* If server mode, restore current per request configuration to the default ones */
        //if (config.mode.toLowerCase() === 'server')
        //utils.restoreDefaultConfs();

        // Wait until all promises resolve (defined and pushed in processMappedObject handler)
        if (utils.isFileWriterActive(config)) {
            await fileWriter.finalize(config); // Finalize file in case of using fileWriter
            await fileWriter.checkAndPrintFinalReport(config);
        }

        if (utils.isOrionWriterActive()) {
            await orionWriter.checkAndPrintFinalReport(config);
        }

        await utils.printFinalReportAndSendResponse(log, minioObj, config, res);
        //await utils.printFinalReportAndSendResponse(report);

        //return await Promise.resolve();

    } catch (error) {
        logger.error(error)
        return await Promise.reject(error);
    }
};

/**
 * Reset Process variables for next iteration
 **/
const reinitializeProcessStatus = () => {

    config.validCount = 0;
    config.unvalidCount = 0;
    config.orionWrittenCount = 0;
    config.orionUnWrittenCount = 0;
    config.orionSkippedCount = 0;
    config.fileWrittenCount = 0;
    config.fileUnWrittenCount = 0;
    config.rowNumber = 0;
    promises = [];

};

module.exports = {
    processSource: processSource,
    reinitializeProcessStatus: reinitializeProcessStatus
};