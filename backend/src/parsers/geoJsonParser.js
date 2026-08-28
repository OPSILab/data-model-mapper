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

const geo = require('geojson-stream');
const request = require('request');
const fs = require('fs');
const utils = require('../utils/utils.js');
const log = require('../utils/logger')//.app(module);
const { Logger } = log
const logger = require('percocologger')
const report = require('../utils/logger').report;
const config = require('./../../config');
const { type } = require('os');

function sourceDataToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {

    // The source Data is the file content itself
    if (sourceData && !sourceData.ext) {

        try {
            fileToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
        }
        catch (err) {
            logger.error('There was an error while getting buffer from source data: ');
            logger.error(err)
        }

    }

    // The source Data is the file URL
    else if (sourceData && utils.httpPattern.test(sourceData.path))
        urlToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);

    // The Source Data is the file path
    else if (sourceData && sourceData.ext)
        fileToRowStream(fs.createReadStream(sourceData.absolute), map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
    else if (rawSourceData) {
        logger.debug("The Source Data is the raw data")
        try {
            fileToRowStream(null, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
        }
        catch (err) {
            logger.error('There was an error while getting buffer from source data: \n');
            logger.error(err)
        }
    }
    else
        logger.error("No valid Source Data was provided");

}

function urlToRowStream(url, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {
    // rowHandler is async: awaiting it inside .on('data') would not delay 'end', and these
    // functions are synchronous by design (process.js does not await them). So the promises
    // are collected and awaited right before finalizeProcess.
    const pendingRows = [];

    var rowNumber = Number(config.rowNumber);
    var rowStart = Number(config.rowStart);
    var rowEnd = Number(config.rowEnd);

    request(url).pipe(geo.parse())
        .on('error', function (err) {
            logger.error(err);
        })
        .on('data', function (row) {

            rowNumber = Number(config.rowNumber) + 1;
            config.rowNumber = rowNumber;
            // outputs an object containing a set of key/value pair representing a line found in the csv file.
            if (rowNumber >= rowStart && rowNumber <= rowEnd) {

                pendingRows.push(rowHandler(rowNumber, row, map, schema, mappedHandler, NGSI_entity, minioObj, config, res, rawSourceData));

            }
        })
        .on('end', async function () {
            try {
                await Promise.all(pendingRows); // all rows mapped before finalizing
                finalizeProcess(minioObj, config, res);
                logger.debug("urlToRowStream: request(url).pipe(geo.parse()).on(end)");
                //utils.printFinalReportAndSendResponse(log);
                //utils.printFinalReportAndSendResponse(report);
            } catch (error) {
                logger.error("Error While finalizing the streaming process: ");
                logger.error(error)
            }

        });
}


function fileToRowStream(inputData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {
    // rowHandler is async: awaiting it inside .on('data') would not delay 'end', and these
    // functions are synchronous by design (process.js does not await them). So the promises
    // are collected and awaited right before finalizeProcess.
    const pendingRows = [];

    var rowNumber = Number(config.rowNumber);
    var rowStart = Number(config.rowStart);
    var rowEnd = Number(config.rowEnd);
    logger.debug(typeof rawSourceData)
    if (Array.isArray(rawSourceData) && rawSourceData[0].features)
        rawSourceData = rawSourceData[0]
    //logger.debug(rawSourceData)
    //if(!rawSourceData.features)
    //    throw {error : "No features"}
    if (rawSourceData) {
        for (let row of (rawSourceData.features || rawSourceData)) {
            rowNumber = Number(config.rowNumber) + 1;
            config.rowNumber = rowNumber;

            if (rowNumber >= rowStart && rowNumber <= rowEnd) {

                try {
                    pendingRows.push(rowHandler(rowNumber, row, map, schema, mappedHandler, NGSI_entity, minioObj, config, res));
                }
                catch (error) {
                    logger.error("Error during row handler")
                    logger.error(error);
                }

            }
        }
        Promise.all(pendingRows).then(() => finalizeProcess(minioObj, config, res)).then(() =>
            logger.debug("fileToRowStream: inputData.pipe(geo.parse()).on(end)")
        ).catch(error => logger.error(error))
    }
    else
        inputData.pipe(geo.parse())
            .on('error', function (err) {
                logger.error(err);
            })
            .on('data', function (row) {

                rowNumber++;
                config.rowNumber = rowNumber;
                // outputs an object containing a set of key/value pair representing a line found in the csv file.
                if (rowNumber >= rowStart && rowNumber <= rowEnd) {

                    pendingRows.push(rowHandler(rowNumber, row, map, schema, mappedHandler, NGSI_entity, minioObj, config, res));

                }

            })
            .on('end', async function () {

                await Promise.all(pendingRows); // all rows mapped before finalizing
                await finalizeProcess(minioObj, config, res);
                logger.debug("fileToRowStream: inputData.pipe(geo.parse()).on(end)");
                //utils.printFinalReportAndSendResponse(log);
                //utils.printFinalReportAndSendResponse(report);

            });

}

module.exports = {
    sourceDataToRowStream: sourceDataToRowStream
};