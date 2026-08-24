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

var JSONStream = require('JSONStream');
const request = require('request');
const fs = require('fs');
const utils = require('../utils/utils');
const log = require('../utils/logger')//.app(module);
const { Logger } = log
const logger = new Logger(__filename)
const report = require('../utils/logger').report;
const config = require('./../../config');



async function sourceDataToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {

    // The source Data is the file content itself
    if (sourceData && !sourceData.ext) {

        try {
            await fileToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
        }
        catch (err) {
            logger.error('There was an error while getting buffer from source data: ');
            logger.error(err)
        }

    }

    // The source Data is the file URL
    else if (sourceData && utils.httpPattern.test(sourceData.path))
        await urlToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);

    // The Source Data is the file path
    else if (sourceData && sourceData.ext)
        await fileToRowStream(fs.createReadStream(sourceData.absolute), map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
    else if (rawSourceData) {
        logger.debug("The Source Data is the raw data")
        try {
            // MUST be awaited, like the three sibling branches. Without it the call detaches:
            // mapData returns, the controller sends the response, and later the orphan
            // fileToRowStream reaches finalizeProcess -> sendOutput -> res.set(), raising
            // ERR_HTTP_HEADERS_SENT. The response was also sent before the rows were mapped.
            // Note the try/catch above is useless on a non-awaited async call: a rejection
            // would surface as an unhandled promise rejection instead.
            await fileToRowStream(null, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
        }
        catch (err) {
            logger.error('There was an error while getting buffer from source data: \n');
            logger.error(err)
        }
    }
    else
        logger.error("No valid Source Data was provided");

}

async function urlToRowStream(url, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {

    var rowNumber = Number(config.rowNumber);
    var rowStart = Number(config.rowStart);
    var rowEnd = Number(config.rowEnd);
    // rowHandler is async. Awaiting it inside .on('data') would NOT help: the stream keeps
    // emitting and 'end' fires regardless, so finalizeProcess could run while rows are still
    // being mapped. Collect the promises and await them in 'end' instead.
    const pendingRows = [];

    request(url).pipe(JSONStream.parse('.*'))
        .on('error', function (err) {
            logger.error(err);
        })
        .on('header', function (columns) {
            //  logger.info('Columns: ' + columns);
        })
        .on('data', function (row) {

            rowNumber++;
            config.rowNumber = rowNumber;
            // outputs an object containing a set of key/value pair representing a line found in the csv file.
            if (rowNumber >= rowStart && rowNumber <= rowEnd) {

                pendingRows.push(rowHandler(rowNumber, row, map, schema, mappedHandler, NGSI_entity, minioObj, config, res));

            }
        })
        .on('column', function (key, value) {
            // outputs the column name associated with the value found
            // logger.info('#' + key + ' = ' + value);
        })
        .on('end', async function () {
            try {

                await Promise.all(pendingRows); // all rows mapped before finalizing
                await finalizeProcess(minioObj, config, res);
                logger.debug("urlToRowStream: request(url).pipe(geo.parse()).on(end)");
                //await utils.printFinalReportAndSendResponse(log);
                //await utils.printFinalReportAndSendResponse(report);
            } catch (error) {
                logger.error("Error While finalizing the streaming process: ");
                logger.error(error);
            }

        });
}


async function fileToRowStream(inputData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {

    // See urlToRowStream: awaited directly in the for loop below, collected here for the
    // stream branch, where awaiting inside .on('data') would not delay 'end'.
    const pendingRows = [];
    logger.debug("fileToRowStream", rawSourceData)

    var rowNumber = Number(config.rowNumber);
    var rowStart = Number(config.rowStart);
    var rowEnd = Number(config.rowEnd);

    if (rawSourceData) {
        for (let row of rawSourceData) {
            rowNumber = Number(config.rowNumber) + 1;
            config.rowNumber = rowNumber;

            if (rowNumber >= rowStart && rowNumber <= rowEnd) {
                logger.debug("rowHandler")

                // In a plain for loop the await is enough (and keeps the rows in order).
                await rowHandler(rowNumber, row, map, schema, mappedHandler, NGSI_entity, minioObj, config, res);

            }
        }
        await finalizeProcess(minioObj, config, res);
        logger.debug("fileToRowStream: inputData.pipe(geo.parse()).on(end)");
    }
    else
        await inputData.pipe(JSONStream.parse('.*'))
            .on('error', function (err) {
                logger.error(err);
            })
            .on('data', function (row) {
                rowNumber = Number(config.rowNumber) + 1;
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
                //await utils.printFinalReportAndSendResponse(log);
                //await utils.printFinalReportAndSendResponse(report);

            });

}

module.exports = {
    sourceDataToRowStream: sourceDataToRowStream
};