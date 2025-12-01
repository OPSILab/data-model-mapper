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


const mapper = require('json-mapper');
const fs = require('fs');
const config = require('../config');
const utils = require('./utils/utils.js');
const validator = require('./schemaHandler.js');
const unorm = require('unorm');
const staticPattern = /static:(.*)/;
const toArrayPattern = /toarray:(.*)/;
const forEachPattern = /foreach:(.*)/;
const dotPattern = /(.*)\.(.*)/;

const log = require('./utils/logger')//.app(module);
const { Logger } = log
const logger = new Logger(__filename)
const Debugger = require('./utils/debugger');
const { type } = require('os');
const report = require('./utils/logger').report;

const checkSingleResult = (singleResult, source) => {
    if (typeof singleResult == "object")
        for (let key in singleResult)
            if (typeof singleResult[key] == "function")
                singleResult[key] = singleResult[key](source)
            else if (typeof singleResult[key] == "object")
                singleResult[key] = checkSingleResult(singleResult[key], source)
    return singleResult
}

const loadMap = (mapData) => {

    if (typeof mapData === 'object' && mapData.absolute) {
        logger.info('Loading Map File');
        return new Promise(function (resolve, reject) {
            resolve(JSON.parse(fs.readFileSync(mapData.absolute, 'utf8')));
        });
    } else {

        return new Promise(function (resolve, reject) {
            resolve(mapData);
        });
    }

};

const fixBrokenJsonString1 = (field) => {
    let fixedField
    field = field.replaceAll('[', '["')
    field = field.replaceAll(']', '"]')
    while (field.replaceAll("{ ", '{') != field) field = field.replaceAll("{ ", '{')
    while (field.replaceAll(" {", '{') != field) field = field.replaceAll(" {", '{')
    while (field.replaceAll("} ", '}') != field) field = field.replaceAll("} ", '}')
    while (field.replaceAll(" }", '}') != field) field = field.replaceAll(" }", '}')
    while (field.replaceAll(" : ", ':') != field) field = field.replaceAll(" : ", ':')
    while (field.replaceAll(", ", ',') != field) field = field.replaceAll(", ", ',')
    field = field.replaceAll("{", '{"');
    field = field.replaceAll("}", '"}');
    field = field.replaceAll(",", '","');
    field = field.replaceAll(":", '":"');
    try {
        fixedField = JSON.parse(field)
    }
    catch (error) {
        logger.error(error.message)
        field = field.replaceAll('}","{', '},{');
        while (field.replaceAll('" ', '"') != field) field = field.replaceAll('" ', '"')
        while (field.replaceAll(' "', '"') != field) field = field.replaceAll(' "', '"')
        while (field.replaceAll('":"{', '":{') != field) field = field.replaceAll('":"{', '":{');
        while (field.replaceAll('}"', '}') != field) field = field.replaceAll('}"', '}');
        field = field.replaceAll('["{', '[{');
        //field = field.replaceAll('\"', '"');
        fixedField = JSON.parse(field)
    }

    return fixedField || field

}

const cleanValue = (value) => {
    let parsed = false
    let valueWithHeadCleaned
    for (let index = 0; (index < value.length) && !parsed; index++)
        if (value[index] == '"') {
            valueWithHeadCleaned = value.substring(index + 1)
            parsed = true
        }
        else if (value[index] == " ")
            valueWithHeadCleaned = value.substring(index + 1)
        else parsed = true
    parsed = false
    let valueWithTailCleaned = valueWithHeadCleaned
    for (let index = valueWithHeadCleaned.length - 1; (index > 0) && !parsed; index--)
        if (valueWithHeadCleaned[index] == '"') {
            valueWithTailCleaned = valueWithHeadCleaned.substring(0, index)
            parsed = true
        }
        else if (valueWithHeadCleaned[index] == " ")
            valueWithTailCleaned = valueWithHeadCleaned.substring(0, index)
        else parsed = true
    return valueWithTailCleaned;
};

const encodingHandler = (mapSourceSubField, source) => {
    let encoding = mapSourceSubField.split(":")[1]
    let outputValue = ""
    mapSourceSubField = mapSourceSubField.split("encode:" + encoding + ":")[1]
    if (mapSourceSubField[0] == "[" && mapSourceSubField[mapSourceSubField.length - 1] == "]") {
        mapSourceSubField = mapSourceSubField.substring(1, mapSourceSubField.length - 1)
        mapSourceSubField = mapSourceSubField.split(",")
        for (let value of mapSourceSubField) {
            value = cleanValue(value);
            if (value.startsWith("static"))
                outputValue = outputValue.concat(value.split("static:")[1])
            else
                outputValue = outputValue.concat(source[value])
        }
    }
    else if (mapSourceSubField.startsWith("concat:")) {
        mapSourceSubField = mapSourceSubField.split("concat:")[1]
        for (let sourceSubField in source)
            outputValue = outputValue.concat(outputValue == "" ? "" : mapSourceSubField).concat(source[sourceSubField])
    }
    return utils.encode(encoding, outputValue)
};

/**
 *
 *
 * @param {"Analyzed Map"} parsedSourceKey This is the analyzed map that informs the external library converter on what to do (if is a new Function(...) it won't check the
 * input source but it will set the output field to the return of the function)
 * @param {"Map"} normSourceKey The map object
 * @param {"Data model"} schemaDestKey This is the schema
 * @param {"Source file"} source The input source file
 * @return {"Analyzed Map"} parsedSourceKey This is the analyzed map that informs the external library converter on what to do (if is a new Function(...) it won't check the
 * input source but it will set the output field to the return of the function)
 */

/*const check = (x) => {
    if (typeof x == "object")
        for (let subKey in x)
            x[subKey] = check(x[subKey])
    if (typeof x == "string" && x.startsWith("static:"))
        return new Function("input", "return '" + x.match(staticPattern)[1] + "'");
    return x
};*/

const objectHandler = (parsedSourceKey, normSourceKey, schemaDestKey, source) => {
    logger.debug("objectHandler")
    logger.debug({ parsedSourceKey, normSourceKey, schemaDestKey, source })
    for (let key in normSourceKey) {
        logger.debug({ key, schemaDestKey })

        if (!schemaDestKey)
            logger.debug("NO SCHEMA DEST KEY")
        else
            logger.debug("OK SCHEMA DEST KEY")

        let schemaDestSubKey
        if (schemaDestKey.properties && !schemaDestKey.oneOf)
            schemaDestSubKey = schemaDestKey.properties[key];
        if (schemaDestKey.oneOf)
            for (let oneOfElement of schemaDestKey.oneOf)
                if (oneOfElement.properties && oneOfElement.properties[key])
                    schemaDestSubKey = oneOfElement.properties[key];
        logger.debug({ schemaDestSubKey })

        if (schemaDestSubKey || schemaDestKey.type == "array") {

            let schemaFieldType = schemaDestSubKey?.type;
            let schemaFieldFormat = schemaDestSubKey?.format;
            let mapSourceSubField = normSourceKey[key];
            logger.debug({ mapSourceSubField })

            parsedSourceKey[key] = {};
            if (!schemaFieldType)
                schemaFieldType = Array.isArray(normSourceKey) && "array" || typeof normSourceKey
            logger.debug({ schemaFieldType })
            if (schemaFieldType === 'number' || schemaFieldType === 'integer' && mapSourceSubField.split('.').length == 1)
                parsedSourceKey[key] = Number(source[mapSourceSubField])
            else if (schemaFieldType === 'boolean')
                parsedSourceKey[key] = source[mapSourceSubField].toLowerCase() == 'true' || source[mapSourceSubField] == 1 || source[mapSourceSubField] == '1'
            else if (schemaFieldType === 'string' && schemaFieldFormat === 'date-time')
                parsedSourceKey[key] = new Date(source[mapSourceSubField]).toISOString();
            else if (schemaFieldType === 'string' && Array.isArray(mapSourceSubField))
                parsedSourceKey[key] = handleSourceFieldsArray(mapSourceSubField, false, source).result
            else if (schemaFieldType === 'array') {
                logger.debug("array"); parsedSourceKey[key] = handleSourceFieldsToDestArray(mapSourceSubField, source, schemaDestSubKey?.items?.type)
            }
            else if (schemaFieldType === 'string' && typeof mapSourceSubField === 'string' && (mapSourceSubField.startsWith("static:") || mapSourceSubField == "")) {
                if (mapSourceSubField == "") mapSourceSubField = "static:"
                parsedSourceKey[key] = mapSourceSubField.match(staticPattern)[1]
                if (typeof parsedSourceKey[key] != "string")
                    parsedSourceKey[key] = parsedSourceKey[key].toString()
            } else if (schemaFieldType === 'string' && typeof mapSourceSubField === 'string' && (mapSourceSubField.startsWith("encode:"))) {
                parsedSourceKey[key] = encodingHandler(mapSourceSubField, source)
                if (typeof parsedSourceKey[key] != "string")
                    parsedSourceKey[key] = parsedSourceKey[key].toString()
            }
            else if (schemaFieldType === 'object')
                parsedSourceKey[key] = objectHandler(mapSourceSubField, mapSourceSubField, schemaDestSubKey)
            else if (mapSourceSubField.includes('.'))// && dotPattern.test(key)) 
                parsedSourceKey[key] = extractFromNestedField(source, mapSourceSubField);
            else  // normal string no action required
                parsedSourceKey[key] = source[mapSourceSubField];
            logger.debug({ parsedSourceKey, key, includes: key.includes('.') })

            // Add type to the nested map field
            //parsedNorm[key]['type'] = new Function("input", "return '" + schemaFieldType + "'");
        }
    }
    return parsedSourceKey;
};

const extractFromNestedField = (source, field) => {
    logger.debug("extractFromNestedField", field)
    let layers
    try {
        layers = field.split('.')
    }
    catch (error) {
        logger.error(error.message)
    }
    let value = source
    for (let sublayer in layers) {
        value = value[layers[sublayer]]
    }
    return value
};

/**
 *
 * This function takes in input the source object, uses map object to map to a destination data Model
 * @param {"Input row index"} rowNumber The input source row index. The parser iterates in the input file and calls this mapping function for each row
 * @param {"Source file"} source The input source file
 * @param {"Map file"} map The input map file
 * @param {"Destination schema"} modelSchema The destination schema/data model 
 */
const mapObjectToDataModel = (rowNumber, source, map, modelSchema, site, service, group, entityIdField, NGSI_entity, minioObj, config, res) => {
    //TODO try throwing an error here to see if process.js error not been catched by controller.js is fixed

    logger.debug({ rowNumber, source, map, entityIdField, service, group })
    var result = {};
    // If the destKey is entityIdField and has only "static:" fields, the pair value indicates only an ID prefix
    // The resulting string will be concatenated with rowNumber
    var isIdPrefix = false;
    for (var mapDestKey in map)
        try {
            let mapSourceKey = map[mapDestKey]; // sourceField map object or key-value pair
            let singleResult = undefined;
            logger.debug(modelSchema)
            let schemaDestKey = modelSchema.allOf[0].properties[mapDestKey];
            if (schemaDestKey || mapDestKey === entityIdField || config.ignoreValidation) {//  Check if destKey is present in modelSchema ?
                if (config.ignoreValidation && source[map[mapDestKey]])
                    modelSchema.allOf[0].properties[mapDestKey] = { "type": typeof source[map[mapDestKey]] }
                var normSourceKey = JSON.parse(unorm.nfc(JSON.stringify(mapSourceKey)));// Normalize encoding, avoiding problems 
                let parsedSourceKey = normSourceKey;// Initialize with normalized Source Key, can be replaced in the specific cases below
                logger.debug({ schemaDestKey, normSourceKey })
                if (mapDestKey == "Field 31")
                    logger.debug("This might be a test. Expected choise is objec/arraytHandler")
                if (mapDestKey == entityIdField) {
                    logger.debug("entityIdField")
                    if (Array.isArray(normSourceKey) && normSourceKey.length !== 0) {
                        let resIdFields = handleSourceFieldsArray(normSourceKey, false, source);
                        parsedSourceKey = resIdFields.result;
                        isIdPrefix = resIdFields.isOnlyStatic;
                    }
                    else if (normSourceKey.startsWith("static:"))
                        parsedSourceKey = normSourceKey.match(staticPattern)[1]
                    else if (normSourceKey.startsWith("encode:"))
                        parsedSourceKey = encodingHandler(normSourceKey, source) //TODO align
                    else
                        parsedSourceKey = source[normSourceKey] // parsedSourceKey = normSourceKey before this assigmnent, so parsedSourceKey = source[normSourceKey] and parsedSourceKey = source[parsedSourceKey] is the same
                }
                else if (schemaDestKey && schemaDestKey.type === 'object' || typeof normSourceKey === 'object')
                    parsedSourceKey = objectHandler(parsedSourceKey, normSourceKey, schemaDestKey, source)
                else if (schemaDestKey && schemaDestKey.type === 'array') {
                    logger.debug("schemaDestKey && schemaDestKey.type === 'array'")
                    parsedSourceKey = handleSourceFieldsToDestArray(normSourceKey, source, schemaDestKey?.items?.type)// new Function("input", "return " + handleSourceFieldsToDestArray(normSourceKey))
                    logger.debug("parsedSourceKeySet", { parsedSourceKey })
                }
                else if (schemaDestKey && (schemaDestKey.type === 'number' || schemaDestKey.type === 'integer')) {
                    logger.debug("schemaDestKey && (schemaDestKey.type === 'number' || schemaDestKey.type === 'integer')")
                    if (Array.isArray(normSourceKey))
                        parsedSourceKey = handleSourceFieldsArray(normSourceKey, 'number', source).result;
                    else {
                        parsedSourceKey = handleDottedField(normSourceKey);
                        if (parsedSourceKey.startsWith('[')) {
                            let num = eval('source' + parsedSourceKey);
                            if (typeof num === 'string')
                                parsedSourceKey = Number(num);
                            else if (typeof num === 'number')
                                parsedSourceKey = num
                        }
                    }
                }
                else if (schemaDestKey && (schemaDestKey.type === 'boolean')) {
                    logger.debug("schemaDestKey && (schemaDestKey.type === 'boolean')")
                    parsedSourceKey = source[normSourceKey].toLowerCase() == 'true' || source[normSourceKey] == 1 || source[normSourceKey] == '1'
                }
                else if (schemaDestKey && schemaDestKey.type === 'string') {
                    logger.debug("schemaDestKey && schemaDestKey.type === 'string'")
                    if (schemaDestKey.format === 'date-time') {
                        var date = eval('source' + handleDottedField(normSourceKey));
                        if (date === undefined || date === '')
                            continue;
                        parsedSourceKey = new Date(date).toISOString()
                    }
                    else if (Array.isArray(normSourceKey))
                        parsedSourceKey = handleSourceFieldsArray(normSourceKey, false, source).result
                    else if (typeof normSourceKey === 'string' && normSourceKey.startsWith("static:"))
                        parsedSourceKey = source[normSourceKey.match(staticPattern)[1]]
                    else if (typeof normSourceKey === 'string' && normSourceKey.startsWith("encode:"))
                        parsedSourceKey = encodingHandler(normSourceKey, source)//TODO align if not yet
                    else if (normSourceKey.includes('.'))
                        parsedSourceKey = extractFromNestedField(source, normSourceKey)
                    else
                        parsedSourceKey = source[parsedSourceKey]
                }
                else {
                    logger.error("No schemaDestKey")
                    if (Array.isArray(normSourceKey)) {
                        let destFieldArray//, destFieldString
                        if (schemaDestKey.oneOf)
                            for (let oneOfElement of schemaDestKey.oneOf)
                                if (oneOfElement.type === 'array')
                                    destFieldArray = oneOfElement
                        //else if (oneOfElement.type === 'string')
                        //    destFieldString = oneOfElement
                        if (schemaDestKey.type === 'array')
                            parsedSourceKey = handleSourceFieldsToDestArray(normSourceKey, source, destFieldArray?.items?.type)
                        else {
                            let resIdFields = destFieldString ? handleSourceFieldsArray(normSourceKey, false, source) : handleSourceFieldsArray(normSourceKey, 'number', source);
                            parsedSourceKey = resIdFields.result;
                            isIdPrefix = resIdFields.isOnlyStatic;
                        }
                    }
                    else if (typeof normSourceKey === 'string' && normSourceKey.startsWith("static:"))
                        parsedSourceKey = normSourceKey.match(staticPattern)[1]
                    else if (typeof normSourceKey === 'string' && normSourceKey.startsWith("encode:"))
                        parsedSourceKey = encodingHandler(normSourceKey, source)//TODO align if not yet
                    else if (normSourceKey.includes('.'))
                        parsedSourceKey = extractFromNestedField(source, normSourceKey)
                    else if (typeof normSourceKey === 'object')
                        parsedSourceKey = objectHandler(parsedSourceKey, normSourceKey, schemaDestKey, source)
                    else
                        parsedSourceKey = source[normSourceKey]
                }
                //if (typeof parsedSourceKey == "string")
                //    parsedSourceKey = parsedSourceKey.replaceAll('"', '')
                //parsedSourceKey = check(parsedSourceKey)
                //logger.debug({ mapDestKey, parsedSourceKey: parsedSourceKey.toString(), keys: typeof parsedSourceKey == "object" ? Object.keys(parsedSourceKey) : "not an object", coordinatesIfLocation: parsedSourceKey.coordinates?.toString() })
                logger.debug({ parsedSourceKey })//, parsedSourceKey.toString())
                /*let tempObj
                if (Array.isArray(parsedSourceKey)) {
                    tempObj = {}
                    for (let i in parsedSourceKey)
                        tempObj[i] = parsedSourceKey[i]
                }*/
                //var converter = mapper.makeConverter({ [mapDestKey]: parsedSourceKey });
                try {
                    if (typeof parsedSourceKey == "function") {
                        logger.warn("FUNCTION DETECTED")
                        var converter = mapper.makeConverter({ [mapDestKey]: parsedSourceKey });
                        singleResult = converter(source);
                    }
                    else
                        singleResult = { [mapDestKey]: parsedSourceKey }
                    //singleResult = converter(source);
                    logger.debug({ singleResult })
                    //singleResult = checkSingleResult(singleResult, source)
                    /*let tempSingleResult
                    if (tempObj) {
                        tempSingleResult = []
                        for (let key in tempObj)
                            tempSingleResult.push(tempObj[key])
                        singleResult = tempSingleResult
                    }*/

                } catch (error) {
                    logger.error(`There was an error: ${error} while processing ${parsedSourceKey} field`);
                    continue;
                }

                /********************* Check if mapping result is valid ************************************************/

                let emptyObject = true;
                for (let a in singleResult) emptyObject = false
                if (emptyObject) singleResult[mapDestKey] = extractFromNestedField(source, normSourceKey)

                if (singleResult && Object.entries(singleResult).length !== 0
                    && (mapDestKey == entityIdField || checkPairWithDestModelSchema(singleResult, mapDestKey, modelSchema, rowNumber, config, res))) {

                    // Additional processing of sourceValue (e.g. filtering or concatenation with other fields)
                    // .....
                    // Add the mapped singleResult and the destination key to result object
                    result[mapDestKey] = singleResult[mapDestKey];

                }
                else if (singleResult[mapDestKey] && (singleResult[mapDestKey][0] == "[")) {
                    result[mapDestKey] = singleResult[mapDestKey].substring(1, singleResult[mapDestKey].length - 1).split(',');
                }
                else if (config.ignoreValidation)
                    result[mapDestKey] = singleResult[mapDestKey];
                else {
                    logger.debug(`Skipping source field: ${JSON.stringify(mapSourceKey)} because the value ${JSON.stringify(singleResult)} is not valid for mapped key: ${mapDestKey}`);
                }

            } else {
                logger.info(`The mapped key: ${mapDestKey} is not present in the selected Data Model Schema`);
            }
        }
        catch (error) {
            logger.error(error);
        }

    if (((NGSI_entity == undefined) && config.NGSI_entity || NGSI_entity).toString() === 'true') {

        // Append type field, according to the Data Model Schema
        try {
            //logger.debug(result)
            if (!result.type)
                result.type = modelSchema?.allOf ? modelSchema.allOf ? modelSchema.allOf[0]?.properties?.type?.enum ? modelSchema.allOf[0]?.properties?.type?.enum[0] : modelSchema?.properties?.type?.enum ? modelSchema.properties.type.enum[0] || "Thing" : "Thing" : "Thing" : "Thing";
            result.type = result.type.replaceAll(" ", "")
            // Generate unique id for the mapped object (according to Id Pattern)
            result.id = utils.createSynchId(
                result ? result.type : "",
                //"", 
                site,// || "",
                service,// || "",
                group,// || "",
                result ? result[entityIdField] : "",
                isIdPrefix || "",
                rowNumber,
                NGSI_entity,
                config
            );
            delete result[entityIdField];
            result.id = result.id.replaceAll(" ", "")
        } catch (error) {
            logger.error(error)

            logger.error("UnknownEntity")
        }
    }
    else
        if (result[entityIdField]) result[entityIdField] = result[entityIdField].concat(rowNumber)

    /** Once we added only valid mapped single entries, let's do a final validation against the whole final mapped object
    * Despite single validations, the following one is mandatory to be successful
    **/
    if (checkResultWithDestModelSchema(result, mapDestKey, modelSchema, rowNumber, config, res)) {
        logger.debug('Mapped object, number: ' + rowNumber + ' is compliant with target Data Model');
        report.info('Mapped object, number: ' + rowNumber + ' is compliant with target Data Model');
        config.validCount++;
        return result;

    } else {

        report.info('--------------------------------------------------------------------------------\n' +
            'Mapped object, number:' + rowNumber + ', id: ' + result.id + ' is not compliant with target Data Model! Skipping!\n' +
            JSON.stringify(result) +
            '\n--------------------------------------------------------------------------------\n');

        logger.debug('Mapped object, number: ' + rowNumber + ', id: ' + result.id + ' is not compliant the target Data Model! Skipping!');
        config.unvalidCount++;
        return undefined;
    }

};

/* This function takes in input the source value to be mapped with a destination object, coming from the Data Model Schema
*  and checks if constraints present in the destination Model object are met by the source value
**/
const checkPairWithDestModelSchema = (mappedObject, destKey, modelSchema, rowNumber, config, res) => {

    //if (config.noSchema)
    //        return true
    var result = validator.validateSourceValue(mappedObject, modelSchema, true, rowNumber, config, res);
    logger.debug("Object number : ", rowNumber)
    logger.trace("Validator result : ", result)
    return result;

};

/* This function takes in input the final whole mapped object and validate it against the destination Data Model Schema
 **/
const checkResultWithDestModelSchema = (mappedObject, destKey, modelSchema, rowNumber, config, res) => {

    //if (config.noSchema)
    //    return true
    return validator.validateSourceValue(mappedObject, modelSchema, false, rowNumber, config, res);

};

/* Concatenates fields of the source array into a string (Source is array, dest is string)
 */
const handleSourceFieldsArray = (sourceFieldArray, sourceFieldType, source) => {

    var finalArray = [];
    var isOnlyStatic = true;
    var isNumber = (sourceFieldType && sourceFieldType === 'number');
    // If value of string array startwith "static:" it is a static string to be concatenated,
    // not the name of the source field.
    sourceFieldArray.forEach(function (value, index, array) {

        var staticMatch = value.match(staticPattern);
        if (staticMatch && staticMatch.length > 0) {
            // filter forbidden characters
            var filterMatch = undefined;
            if (!(filterMatch = staticMatch[1].match(/^([^\(]*)(\((.*)\)|\n|<|>|"|'|=|;|\(|\))(.*)$/)))
                finalArray[index] = staticMatch[1];
            else if (filterMatch.length === 1)
                finalArray[index] = ' ';
            else if (filterMatch.length === 5)
                finalArray[index] = "'" + filterMatch[1] + (filterMatch[3] ? filterMatch[3] : "") + filterMatch[4] + "'";
            else
                finalArray[index] = "'" + filterMatch[1] + filterMatch[4] + "'";
        } else {

            isOnlyStatic = false;
            var splittedDot = value.match(dotPattern);

            if (splittedDot) {

                splittedDot.shift();
                if (splittedDot.length > 0) {
                    finalArray[index] = source[splittedDot.shift()]
                    while (splittedDot.length > 0)
                        finalArray[index] = finalArray[index][splittedDot.shift()]
                    if (isNumber)
                        finalArray[index] = Number(finalArray[index])
                } //return Number(input['" + normSourceKey + "'])

            } else {
                finalArray[index] = source[value]
                if (isNumber)
                    finalArray[index] = Number(finalArray[index])
            }
        }
    });

    return {
        result: finalArray.join(config.idSeparator || ""),
        isOnlyStatic: isOnlyStatic
    };

};

/* Map fields of the source array into a stringifed Array (source and dest are both arrays)
*/
const handleSourceFieldsToDestArray = (sourceFieldArray, source, itemsType) => {
    //let foreachIndex = []
    let foreachFound = false

    logger.debug({ sourceFieldArray, itemsType })
    /*if (typeof sourceFieldArray == "string" && sourceFieldArray[0] == "[")
        try {
            let parsedSourceField = JSON.parse(sourceFieldArray)
            sourceFieldArray = parsedSourceField
        }
        catch (error) {
            logger.error("Source field could not be parsed")
            logger.error(error)
        }*/

    if (Array.isArray(sourceFieldArray)) {
        var finalArray = [];
        var resultString = undefined;
        // If value of string array startwith "static:" it is a static string to be concatenated,
        // not the name of the source field.
        sourceFieldArray.forEach(function (value, index, array) {

            var staticMatch = value.match(staticPattern);
            //let toArrayMatch = value.match(toArrayPattern);
            let forEachMatch = value.match(forEachPattern);
            if (staticMatch && staticMatch.length > 0) {

                finalArray[index] = staticMatch[1];

            }
            else if (forEachMatch && forEachMatch.length > 0) {
                if (!foreachFound) foreachFound = true
                //let arrayField = forEachMatch[1];
                //let arrayFieldCleaned = cleanValue(arrayField);
                //foreachIndex.push(index)
                let subOperator = forEachMatch[1];
                let forEachArgument = subOperator.split(',')[0];
                let forEachBody = subOperator.split(',').slice(1).join(',');
                if (forEachArgument && forEachBody) {
                    let toArrayMatch = forEachBody.match(toArrayPattern);
                    if (toArrayMatch && toArrayMatch.length > 0) {
                        //let toArray = []
                        let toArrayBodyField = toArrayMatch[1].split(",");
                        logger.debug({ toArrayMatch, toArrayBodyField })
                        finalArray = finalArray.concat(source[forEachArgument].map(o => {
                            let newArray = []
                            for (let objIndex of toArrayBodyField)
                                newArray.push(o[objIndex])
                            return newArray

                        }))
                    }
                }
                else finalArray[index] = "";
            }
            else {

                var splittedDot = value.match(dotPattern);
                if (splittedDot) {

                    splittedDot.shift();
                    if (splittedDot.length > 0)
                        finalArray[index] = eval("source[" + splittedDot.join("']['") + "']")

                } else {
                    logger.debug({ value, sourceValue: source[value], valueType: typeof source[value], source })
                    finalArray[index] = itemsType == "integer" ? Nummber(source[value]) : source[value]
                }
            }
        });

        // print Array String as output
        logger.debug({ finalArray })
        return finalArray
        /*resultString = '[';
        finalArray.forEach(function (value, index) {
            if (value.startsWith("input")) {
                resultString += value + ',';

            } else { //static
                resultString += '"' + value + '",';
            }
            //if (foreachIndex.includes(index)) resultString = resultString.substring(1, resultString.length - 1)
        });

        resultString = resultString.slice(0, resultString.length - 1) + ']';
        logger.debug({ resultString })
        if (foreachFound)
            return new Function("input", "return " + resultString.substring(1, resultString.length - 1));
        return new Function("input", "return " + resultString)//.substring(1, resultString.length - 1);*/
    }
    else {
        //let parsed = JSON.parse(JSON.stringify(sourceFieldArray))
        try {
            logger.debug({ source, sourceFieldArray })
            if (typeof source[sourceFieldArray] == "string") {
                var fixedField = fixBrokenJsonString1(source[sourceFieldArray])
                logger.debug({ fixedField, type: typeof fixedField, isArray: Array.isArray(fixedField) })
                for (let index = 0; index < fixedField.length; index++)
                    if (typeof fixedField[index] == "string" && itemsType == "integer")
                        fixedField[index] = Number(fixedField[index])
                logger.debug(fixedField)
                return fixedField
            }
            else
                return source[sourceFieldArray]
        }
        catch (error) {
            logger.error(error)
            logger.error(fixedField)
            //logger.debug(source[sourceFieldArray], source[sourceFieldArray][0], source[sourceFieldArray][1])
            return source[sourceFieldArray]
        }
    }
    //return 'input["' + sourceFieldArray + '"]'
    //return 'typeof input["' + sourceFieldArray + '"] == "string" && JSON.parse(input["' + sourceFieldArray + '"]) || input["' + sourceFieldArray + '"]';
};

/* Returns array notation from dotten notation (without input)
 */
const handleDottedField = (fieldName) => {

    var staticMatch = fieldName.match(staticPattern);
    if (staticMatch && staticMatch.length > 0) {

        return staticMatch[1];

    } else {

        var splittedDot = fieldName.match(dotPattern);

        if (splittedDot) {

            splittedDot.shift();
            if (splittedDot.length > 0)
                return "['" + splittedDot.join("']['") + "']";

        } else {
            return "['" + fieldName + "']";
        }
    }

};

module.exports = {
    loadMap: loadMap,
    mapObjectToDataModel: mapObjectToDataModel
};