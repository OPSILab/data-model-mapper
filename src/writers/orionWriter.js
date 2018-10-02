﻿/*******************************************************************************
 * Data Model Mapper
 *  Copyright (C) 2018 Engineering Ingegneria Informatica S.p.A.
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

const request = require('request');
const rp = require('promise-request-retry');

const config = require('../../config').orionWriter;
const report = require('../utils/logger').orionReport;
const log = require('../utils/logger').app;

//var queue = new Queue(config., maxQueue);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function writeObjectPromise(objNumber, obj, modelSchema, updatePromises) {

    if (obj) {
        log.debug('Sending to Orion object number: ' + objNumber + ' , id: ' + obj.id);

        var orionedObj = toOrionObject(obj, modelSchema);
        //sleep(10);

        var options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            uri: config.orionUrl + '/v2/entities',
            body: orionedObj,
            json: true,
            simple: false,
            resolveWithFullResponse: true,
            retry: config.maxRetry,
            proxy: config.proxy
        };

        return rp(options).then(function (response) {


            // Entity is new
            if (response && response.statusCode == 201) {

                report.info('Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' correctly CREATED in the Context Broker');
                log.debug('Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' correctly CREATED in the Context Broker');
                process.env.orionWrittenCount++;
                //checkAndPrintFinalReport();

            } else if (response && response.statusCode == 422 && response.body && response.body.description == 'Already Exists') {

                // UPDATE EXISTING ENTITIES
                if (!config.skipExisting) {

                    // If entity already exists, try to update it
                    var existingId = orionedObj.id;
                    delete orionedObj.id;
                    delete orionedObj.type;

                    var updateOptions = {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        uri: config.orionUrl + '/v2/entities/' + existingId + '/attrs',
                        body: orionedObj,
                        json: true,
                        simple: false,
                        resolveWithFullResponse: true,
                        retry: config.maxRetry,
                        proxy: config.proxy
                    };

                    updatePromises.push(rp(updateOptions)
                        .then(function (response) {

                            if (response && response.statusCode == 204) {

                                report.info('Entity Number: ' + objNumber + ' with Id: ' + existingId + ' already exists! Correctly UPDATED in the Context Broker');
                                log.debug('Entity Number: ' + objNumber + ' with Id: ' + existingId + ' already exists! Correctly UPDATED in the Context Broker');
                                process.env.orionWrittenCount++;
                                //checkAndPrintFinalReport();
                            } else {
                                throw new Error('Update Error');
                            }

                        }).catch((error) => {

                            report.info('----------------------------------------------------------\n' +
                                'Entity Number: ' + objNumber + ' with Id: ' + existingId + ' NOT UPDATED in the Context Broker');
                            log.debug('Entity Number: ' + objNumber + ' with Id: ' + existingId + ' NOT UPDATED in the Context Broker');

                            report.info('error: ' + error); // Print the error if one occurred
                            log.debug('error: ' + error);

                            if (error)
                                report.info('statusCode: ' + error.statusCode); // Print the response status code if a response was received
                            report.info('body: ' + JSON.stringify(error));
                            report.info('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
                            log.debug('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
                            process.env.orionUnWrittenCount++;
                            //checkAndPrintFinalReport();

                        }));

                } else {

                    // SKIP EXISTING ENTITIES
                    report.info('Entity Number: ' + objNumber + ' with Id: ' + orionedObj.id + ' SKIPPED');
                    log.debug('Entity Number: ' + objNumber + ' with Id: ' + orionedObj.id + ' SKIPPED');
                    process.env.orionSkippedCount++;
                    //checkAndPrintFinalReport();

                }

            } else {
                throw new Error('Undefined state: ' + JSON.stringify(response) + '\n');
            }

        }).catch((error) => {

            report.info('----------------------------------------------------------\n' +
                'Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' NOT CREATED in the Context Broker');
            log.debug('Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' NOT CREATED in the Context Broker');

            report.info('error: ' + error); // Print the error if one occurred
            log.debug('error: ' + error);

            if (error)
                report.info('statusCode: ' + error.statusCode);
            report.info('body: ' + JSON.stringify(error));
            report.info('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
            log.debug('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
            process.env.orionUnWrittenCount++;
            //checkAndPrintFinalReport();

        });



    } else
        return new Promise((resolve, reject) => {
            console.log('');
            log.debug("Mapped Object is undefined!, nothing to send to Orion Context Broker")
            resolve();
        });



}



function writeObject(objNumber, obj, modelSchema, retryNum = 0) {

    if (obj) {
        log.debug('Sending to Orion object number: ' + objNumber + ' , id: ' + obj.id);

        var orionedObj = undefined;
        if (retryNum == 0)
            orionedObj = toOrionObject(obj, modelSchema);
        else
            orionedObj = obj;

        sleep(5);

        // Proxy config
        if (config.proxy) {
            request = request.defaults({ 'proxy': config.proxy });
        }


        request.post({
            headers: { 'content-type': 'application/json' },
            url: config.orionUrl + '/v2/entities',
            body: orionedObj,
            json: true
        }, function (error, response, body) {

            // Entity is new
            if (response && response.statusCode == 201) {
                report.info('Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' correctly CREATED in the Context Broker');
                log.debug('Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' correctly CREATED in the Context Broker');
                process.env.orionWrittenCount++;
                checkAndPrintFinalReport();
            } else if (response && response.statusCode == 422 && response.body && response.body.description == 'Already Exists') {

                // UPDATE EXISTING ENTITIES
                if (!config.skipExisting) {

                    // If entity already exists, try to update it
                    var existingId = orionedObj.id;
                    delete orionedObj.id;
                    delete orionedObj.type;
                    request.post({
                        headers: { 'content-type': 'application/json' },
                        url: config.orionUrl + '/v2/entities/' + existingId + '/attrs',
                        body: orionedObj,
                        json: true
                    }, function (error, response, body) {
                        if (response && response.statusCode == 204) {

                            report.info('Entity Number: ' + objNumber + ' with Id: ' + existingId + ' already exists! Correctly UPDATED in the Context Broker');
                            log.debug('Entity Number: ' + objNumber + ' with Id: ' + existingId + ' already exists! Correctly UPDATED in the Context Broker');
                            process.env.orionWrittenCount++;
                            checkAndPrintFinalReport();
                        } else {

                            report.info('----------------------------------------------------------\n' +
                                'Entity Number: ' + objNumber + ' with Id: ' + existingId + ' NOT UPDATED in the Context Broker');
                            log.debug('Entity Number: ' + objNumber + ' with Id: ' + existingId + ' NOT UPDATED in the Context Broker');

                            report.info('error: ' + error); // Print the error if one occurred
                            log.debug('error: ' + error);

                            if (response)
                                report.info('statusCode: ' + response.statusCode); // Print the response status code if a response was received
                            report.info('body: ' + JSON.stringify(body));

                            if (error && (retryNum < config.maxRetry)) {
                                retryNum++;
                                report.info('Retrying num:' + retryNum + ' to send Object: ' + objNumber + ' with Id: ' + existingId);
                                log.debug('Retrying num:' + retryNum + ' to send Object: ' + objNumber + ' with Id: ' + existingId);

                                sleep(2);
                                writeObject(objNumber, obj, modelSchema, retryNum);

                            } else {

                                report.info('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
                                log.debug('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
                                process.env.orionUnWrittenCount++;
                                checkAndPrintFinalReport();

                            }

                        }

                    });

                } else {

                    // SKIP EXISTING ENTITIES
                    report.info('Entity Number: ' + objNumber + ' with Id: ' + orionedObj.id + ' SKIPPED');
                    log.debug('Entity Number: ' + objNumber + ' with Id: ' + orionedObj.id + ' SKIPPED');
                    process.env.orionSkippedCount++;
                    checkAndPrintFinalReport();

                }

            } else {
                report.info('----------------------------------------------------------\n' +
                    'Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' NOT CREATED in the Context Broker');
                log.debug('Entity Number: ' + objNumber + ' with Id: ' + obj.id + ' NOT CREATED in the Context Broker');

                report.info('error: ' + error); // Print the error if one occurred
                if (response)
                    report.info('statusCode: ' + response.statusCode);
                report.info('body: ' + JSON.stringify(body));

                //if (error && (typeof error == 'string') && (error == 'Error: read ECONNRESET' || error == 'Error: socket hang up' || error.startsWith('Error: connect ETIMEDOUT')) && (retryNum < config.maxRetry)) {

                if (error && (retryNum < config.maxRetry)) {

                    retryNum++;
                    report.info('Retrying num: ' + retryNum + ' to send Object: ' + objNumber + ' with Id: ' + orionedObj.id);
                    log.debug('Retrying num: ' + retryNum + ' to send Object: ' + objNumber + ' with Id: ' + orionedObj.id);

                    sleep(2);
                    writeObject(objNumber, obj, modelSchema, retryNum);

                } else {

                    report.info('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
                    log.debug('Mapped and unwritten object:\n' + JSON.stringify(orionedObj) + '\n ------------------------------\n');
                    log.debug("PRE ORION OBJECT:\n" + JSON.stringify(obj) + '\n ------------------------------\n');
                    process.env.orionUnWrittenCount++;
                    checkAndPrintFinalReport();
                }
            }
        });
    } else {
        log.debug("Mapped Object is undefined!, nothing to send to Orion Context Broker");
    }

}


function toOrionObject(obj, schema) {

    // log.debug("Transforming Mapped object to an Orion Entity (explicit types in attributes)");

    for (key in obj) {
        if (key != 'id' && key != 'type') {

            var modelField = schema.allOf[0].properties[key];
            var modelFieldType = modelField.type;
            var modelFieldFormat = modelField.format;
            var objField = obj[key];

            if (key == 'location') {

                var newValue = {};
                newValue = {
                    type: "geo:json",
                    value: objField
                };
                obj['location'] = newValue;

            } else if (modelFieldType === 'object') {

                //var nestedValue = {};
                //for (fieldKey in objField) {

                //    var modelSubField = modelField.properties[fieldKey];
                //    var modelSubFieldType = modelSubField.type;
                //    var modelSubFieldFormat = modelSubField.format;

                //    if (modelSubFieldFormat)
                //        nestedValue[fieldKey] = {
                //            value: objField[fieldkey],
                //            type: modelSubFieldType,
                //            format: modelSubFieldFormat
                //        }
                //    else
                //        nestedValue[fieldKey] = {
                //            value: objField[fieldKey],
                //            type: modelSubFieldType
                //        }

                //    delete objField[fieldKey];
                //}

                var nestedObject = objField;
                delete objField;
                obj[key] = {
                    type: modelFieldType,
                    value: nestedObject
                }

            } else {

                if (modelFieldFormat) {
                    if (modelFieldFormat === 'date-time')
                        obj[key] = {
                            type: 'DateTime',
                            value: objField
                        };
                    else
                        obj[key] = {
                            type: modelFieldType,
                            value: objField,
                            format: modelFieldFormat
                        };
                }
                else
                    obj[key] = {
                        type: modelFieldType,
                        value: objField
                    }
            }
        }
    }

    return obj;
}


function printOrionFinalReport(logger) {

    logger.info('\t\n--------ORION REPORT----------\n' +
        '\t Object written to Orion Context Broker: ' + process.env.orionWrittenCount + '/' + process.env.validCount + '\n' +
        '\t Object NOT written to Orion Context Broker: ' + process.env.orionUnWrittenCount + '/' + process.env.validCount + '\n' +
        '\t Object SKIPPED: ' + process.env.orionSkippedCount + '/' + process.env.validCount + '\n' +
        '\t-----------------------------------------');

}

function checkAndPrintFinalReport() {
    if ((parseInt(process.env.orionWrittenCount) + parseInt(process.env.orionSkippedCount) + parseInt(process.env.orionUnWrittenCount)) == parseInt(process.env.validCount)) {
        printOrionFinalReport(log);
        printOrionFinalReport(report);
    }
}

module.exports = {
    writeObject: writeObject,
    writeObjectPromise: writeObjectPromise,
    checkAndPrintFinalReport: checkAndPrintFinalReport
}