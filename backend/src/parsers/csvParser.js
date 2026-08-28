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

const csv = require('csv-stream');
const request = require('request');
const fs = require('fs');
const utils = require('../utils/utils.js');
const log = require('../utils/logger')//.app(module);
const { Logger } = log
const logger = require('percocologger')
const configGlobal = require('../../config');
const { Readable } = require('stream');


// All of these arguments are optional.
var options = {
    delimiter: configGlobal.delimiter || ',', // default is ,
    endLine: configGlobal.endLine || '\n', // default is \n,
    //columns: ['columnName1', 'columnName2'], // by default read the first line and use values found as columns
    columnOffset: 0, // default is 0
    escapeChar: '', // default is an empty string
    enclosedChar: '"' // default is an empty string
};


function sourceDataToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {

    if (config.delimiter) options.delimiter = config.delimiter;

    // The Source Data is the File Stream
    if (sourceData && utils.isReadableStream(sourceData)) {

        logger.debug("The Source Data is the File Stream")

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
        try {
            urlToRowStream(sourceData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
        }
        catch (error) {
            logger.error('There was an error while getting buffer from source data: \n');
            logger.error(error)
        }

    // The Source Data is the file path
    else if (sourceData && sourceData.ext)
        try {
            fileToRowStream(fs.createReadStream(sourceData.absolute), map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData);
        }
        catch (err) {
            logger.error('There was an error while getting buffer from source data: \n');
            logger.error(err)
        }
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

    var csvStream = csv.createStream(options);
    var rowNumber = Number(config.rowNumber);
    var rowStart = Number(config.rowStart);
    var rowEnd = Number(config.rowEnd);

    request(url).pipe(csvStream)
        .on('error', function (err) {
            logger.error(err);
        })
        .on('header', function (columns) {
            //  logger.info('Columns: ' + columns);
        })
        .on('data', function (row) {

            rowNumber = Number(config.rowNumber) + 1;
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

            } catch (error) {
                logger.error("Error While finalizing the streaming process: ");
                logger.error(error)
            }
        });
}

function deleteSpaces(obj) {
    if (obj) {
        while (obj[0] == " ")
            obj = obj.substring(1)
        while (obj[obj.length - 1] == " ")
            obj = obj.substring(0, obj.length - 1)
    }
    return obj
}

function splitCSVLine(line, delimiter) {
    const fields = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else {
                field += ch;
            }
        } else {
            if (ch === '"') inQuotes = true;
            else if (ch === delimiter) { fields.push(field); field = ''; }
            else field += ch;
        }
    }
    fields.push(field);
    return fields;
}

function convertCSVtoJSON(csvData) {
    logger.debug(csvData)
    let lines = csvData.split('\r\n');
    if (lines.length === 1)
        lines = csvData.split('\n');
    const possibleHeaders = [
        lines[0].trim().split(','),
        lines[0].trim().split(';')
    ]
    const useComma = possibleHeaders[0].length > possibleHeaders[1].length;
    const delimiter = useComma ? "," : ";";
    const headers = splitCSVLine(lines[0].trim(), delimiter).map(h => deleteSpaces(h));
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        const raw = lines[i].trim();
        if (!raw) continue;
        const obj = {};
        const currentLine = splitCSVLine(raw, delimiter);
        for (let j = 0; j < headers.length; j++)
            obj[headers[j]] = deleteSpaces(currentLine[j]);
        results.push(obj);
    }
    return results;
}


function fileToRowStream(inputData, map, schema, rowHandler, mappedHandler, finalizeProcess, NGSI_entity, minioObj, config, res, rawSourceData) {
    // rowHandler is async: awaiting it inside .on('data') would not delay 'end', and these
    // functions are synchronous by design (process.js does not await them). So the promises
    // are collected and awaited right before finalizeProcess.
    const pendingRows = [];

    var csvStream = csv.createStream(options);
    var rowNumber = Number(config.rowNumber);
    var rowStart = Number(config.rowStart);
    var rowEnd = Number(config.rowEnd);

    if (inputData) {
        inputData.pipe(csvStream)
            .on('error', function (err) {
                logger.error(err);
            })
            .on('header', function (columns) {
                logger.debug(columns)
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
                //logger.info('#' + key + ' = ' + value);
            })
            .on('end', async function () {
                try {
                    await Promise.all(pendingRows); // all rows mapped before finalizing
                    await finalizeProcess(minioObj, config, res);

                } catch (error) {
                    logger.error("Error While finalizing the streaming process: ");
                    logger.error(error)
                }
            });
    }
    else if (rawSourceData) {
        if (Buffer.isBuffer(rawSourceData)) {

            const stream = Buffer.isBuffer(rawSourceData)
                ? Readable.from(rawSourceData)
                : Readable.from([rawSourceData]);

            stream
                .pipe(csvStream)
                .on('error', function (err) {
                    logger.error(err);
                })
                .on('header', function (columns) {
                    logger.debug(columns)
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
                    //logger.info('#' + key + ' = ' + value);
                })
                .on('end', async function () {
                    try {
                        await Promise.all(pendingRows); // all rows mapped before finalizing
                        await finalizeProcess(minioObj, config, res);

                    } catch (error) {
                        logger.error("Error While finalizing the streaming process: ");
                        logger.error(error)
                    }
                });
        }
        else
            try {
                rawSourceData = convertCSVtoJSON(rawSourceData);
                for (let line of rawSourceData) {
                    rowNumber++;
                    config.rowNumber = rowNumber;
                    if (rowNumber >= rowStart && rowNumber <= rowEnd) {
                        pendingRows.push(rowHandler(rowNumber, line, map, schema, mappedHandler, NGSI_entity, minioObj, config, res));
                    }
                }

                Promise.all(pendingRows).then(() => finalizeProcess(minioObj, config, res)).catch((error) => {
                    logger.error("Error While finalizing the streaming process: ");
                    logger.error(error)
                })
            }
            catch (error) {
                logger.error("Error While processing the raw source data: ");
                logger.error(error)
            }
    }

}


module.exports = {
    sourceDataToRowStream: sourceDataToRowStream
};