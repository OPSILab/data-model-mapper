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

const config = require('../../config');
const base64 = require('./encoders/base64');
const path = require('path');
const pathParse = require('parse-filepath');
const isValidPath = require("is-valid-path");
const isFileStream = require('is-file-stream');
const extensionPattern = /\.[0-9a-z]+$/i;
const httpPattern = /http:\/\//g;
const filenameFromPathPattern = /^(.:)?\\(.+\\)*(.+)\.(.+)$/;
const { isMinioWriterActive, sleep, createRandId, finish } = require('./common')
const minioWriter = isMinioWriterActive() ? require("../writers/minioWriter") : null
const log = require('./logger')
const { Logger } = log
const logger = new Logger(__filename)
const fs = require("fs");
const Session = require('../server/api/models/session');
const Output = require('../server/api/models/output.js')
const mongoose = require("mongoose");
const { JsonStreamStringify } = require('json-stream-stringify').default || require('json-stream-stringify');

function readDirRecursive(dir) {
    let results = [];
    let entries
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    }
    catch (error) {
        logger.error(`Error reading directory ${dir}:`, error)
        fs.mkdirSync(dir, { recursive: true });
        return results
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        logger.debug(entry.name)
        if (entry.isDirectory()) {
            results.push({ folder: fullPath });
            results = results.concat(readDirRecursive(fullPath));
        } else {
            results.push(fullPath);
        }
    }

    return results;
}

function pathIsOutput(path) {
    logger.debug(`Checking if path ${path} is an output path...`)
    logger.debug(
        path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".")),
        parseInt(path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))),
        isNaN(parseInt(path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))))
    )
    return !isNaN(parseInt(path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))))
}
function pathIsSession(path) {
    return isNaN(parseInt(path.substring(path.lastIndexOf("/"), path.lastIndexOf("."))))
}
function getFolderFromOutputPath(path) {
    if (pathIsOutput(path))
        return path.substring(0, path.lastIndexOf("/"))
    else
        throw new Error("Path is not an output path")
}
function getSessionFromOutputPath(path) {
    if (pathIsOutput(path)) {
        let folder = getFolderFromOutputPath(path)
        return getSessionFromOutputFolderPath(folder)
    }
    else
        throw new Error("Path is not an output path")
}

function getFolderFromSession(path) {
    if (pathIsSession(path)) {
        let folder = path.replace("./output/output", "./output/").replace(".json", "")
        return folder
    }
    else
        throw new Error("Path is not a session path")
}

function getSessionFromOutputFolderPath(path) {
    return "./output/" + path.substring(2).split("/").join("") + ".json"
}

function dropOutput(id) {
    const { execSync } = require("child_process");
    const os = require('os')
    let command
    if (os.platform() == "win32")
        command = `"C:\\Program Files\\mongosh\\mongosh.exe" ${config.mongo} --eval "db.output${id}.drop()"`
    else
        command = `mongosh ${config.mongo} --eval "db.output${id}.drop()"`

    logger.debug(`Dropping collection output${id} with command: ${command}`)
    execSync(command, { stdio: 'inherit' });
    logger.debug(`Collection output${id} dropped successfully.`)
}

async function checkMaximumSpaceOverflow(ignoringOutputId) {

    let collections = await mongoose.connection.db.listCollections().toArray();
    const db = mongoose.connection.db;
    await mongoose.connection.db.admin().command({ fsync: 1 });
    let usedMB = 0 //stats.storageSize;

    collections = await Promise.all(
        collections
            .filter(coll => coll.name.includes("output") || coll.name.includes("session"))
            .map(async coll => {
                const stats = await db.command({ collStats: coll.name, scale: 1024 * 1024 });
                usedMB += stats.storageSize;
                return {
                    name: coll.name,
                    stats,
                    storageSize: stats.storageSize
                };

            })
    );
    logger.debug("Current MongoDB storage size for sessions and outputs: ", usedMB, " MB")
    if (usedMB > (config.mongoMaxStorageMB || 500)) {
        logger.warn(`MongoDB storage size is ${usedMB} MB, which exceeds the configured maximum of ${config.mongoMaxStorageMB || 500} MB. Cleaning up sessions...`)
        try {
            let sessions = await Session.find().lean();
            logger.debug(`Found ${sessions.length} sessions in the database.`)
            for (const session of sessions) {
                const outputId = session.data.outputFile[session.data.outputFile.length - 1]?.MAPPING_REPORT?.outputId
                const foundCollection = collections.find(coll => coll.name == "output" + outputId)
                if (outputId && foundCollection)
                    try {
                        dropOutput(outputId)
                        logger.info(`Dropped collection for session ${session.sessionId} with outputId ${session.data.outputFile[session.data.outputFile.length - 1].MAPPING_REPORT?.outputId}`)
                        usedMB -= foundCollection.storageSize
                    }
                    catch (error) {
                        logger.error(`Error dropping collection for session ${session.sessionId} with outputId ${session.data.outputFile[session.data.outputFile.length - 1].MAPPING_REPORT?.outputId}:`, error)
                    }
                const size = (Buffer.byteLength(JSON.stringify(session), "utf8")) / (1024 * 1024); // Convert to MB
                await Session.deleteOne({ sessionId: session.sessionId });
                usedMB -= size;
                if (usedMB <= (config.mongoMaxStorageMB || 500))
                    break
            }
            for (const coll of collections.filter(coll => coll.name.includes("output"))) {
                const outputId = coll.name.replace("output", "")
                if (!sessions.find(session => session.data.outputFile[session.data.outputFile.length - 1]?.MAPPING_REPORT?.outputId == outputId))
                    try {
                        dropOutput(outputId)
                        logger.info(`Dropped collection output${outputId} not linked to any session.`)
                    }
                    catch (error) {
                        logger.error(`Error dropping collection output${outputId} not linked to any session:`, error)
                    }
            }
        }
        catch (error) {
            logger.error("Error during MongoDB cleanup: ", error)
        }
    }
    usedMB = 0
    let cancel = false
    let files = readDirRecursive("./output/")
    logger.debug(files)
    files = files
        .map(file => file != "output\\result.json" ? { file: (file.folder || file), time: fs.statSync("./" + (file.folder || file)).mtime.getTime(), path: "./" + (file.folder || file).replaceAll("\\", "/"), type: (file.folder ? "folder" : "file") } : null)
        .filter(v => { return v != null })
        .sort((a, b) => {
            const aTime = a.time;
            const bTime = b.time;
            return bTime - aTime;
        });
    let sessionedOutputs = {}
    for (const file of files) {
        const filePath = "./" + file.file;
        logger.debug(`Checking file ${filePath} | ${file.path} for cleanup...`)
        if (pathIsOutput(file.path)) {
            logger.debug("Is an output file, looking for session file...")
            logger.debug({ file })
            if (sessionedOutputs[getSessionFromOutputPath(file.path)] === undefined)
                sessionedOutputs[getSessionFromOutputPath(file.path)] = {
                    searchingSessionFound: false,
                    searchingOutputFound: true,
                    folderPath: getFolderFromOutputPath(file.path)
                }
            else
                sessionedOutputs[getSessionFromOutputPath(file.path)].searchingOutputFound = true
        }
        else if (file.type === "folder") {
            logger.debug("Is a folder, looking for session file...")
            logger.debug(file.path)
            if (sessionedOutputs[getSessionFromOutputFolderPath(file.path)] === undefined)
                sessionedOutputs[getSessionFromOutputFolderPath(file.path)] = {
                    searchingSessionFound: false,
                    searchingOutputFound: false,
                    folderPath: file.path
                }
        }
        else {
            logger.debug("Is a session file, looking for session file...")
            logger.debug(filePath)
            logger.debug(file.path)
            if (sessionedOutputs[file.path] === undefined)
                sessionedOutputs[file.path] = {
                    searchingSessionFound: true,
                    searchingOutputFound: false,
                    filePath: file.path
                }
            else
                sessionedOutputs[file.path].searchingSessionFound = true
        }
        let stats
        try {
            stats = fs.statSync(file.path);
        } catch (error) {
            logger.error(`Error getting stats for file ${file.path}:`, error)
            if (cancel)
                logger.debug(`Maybe file ${file.path} was already deleted, dummy!`)
            continue
        }
        usedMB += stats?.size / (1024 * 1024) || 0;
        if (usedMB > (config.fileMaxStorageMB || 500))
            cancel = true
        if (cancel)
            try {
                let folder //file.path.substring(0, file.path.lastIndexOf("/"))//filePath.substring(0, filePath.lastIndexOf("\\"))
                if (pathIsOutput(file.path))
                    folder = getFolderFromOutputPath(file.path)
                else if (file.type === "folder")
                    folder = file.path
                else
                    folder = getFolderFromSession(file.path)
                if (!ignoringOutputId || (ignoringOutputId && !folder.includes(ignoringOutputId))) {
                    logger.debug(`Deleting file ${file.path} and folder ${folder} for cleanup...`)
                    fs.rmSync(folder, { recursive: true, force: true });
                    logger.info(`File ${file.path} and folder ${folder} deleted.`);

                    let orphanSession //"./output/" + folder.split("/").join("") + ".json"
                    if (pathIsOutput(file.path))
                        orphanSession = getSessionFromOutputPath(file.path)
                    else if (file.type === "folder")
                        orphanSession = getSessionFromOutputFolderPath(file.path)
                    else
                        orphanSession = file.path
                    logger.debug(`Checking for orphan session with id ${orphanSession} linked to deleted file...`)
                    if (fs.existsSync(orphanSession) && orphanSession !== "./output/results.json")
                        try {
                            fs.unlinkSync(orphanSession);
                        } catch (error) {
                            logger.error(`Error deleting orphan session file ${orphanSession}:`, error)
                        }
                    else
                        logger.debug(`No orphan session file ${orphanSession} found for deleted file.`)
                }
                //fs.unlinkSync(filePath);
                //logger.info(`File ${file.file} deleted.`);
            } catch (err) {
                logger.error(`Error deleting file ${filePath}:`, err);
            }
    }
    for (let key in sessionedOutputs)
        if (!sessionedOutputs[key].searchingSessionFound) {
            logger.warn(`Orphan output detected: ${key}`)
            logger.debug(`Deleting folder ${sessionedOutputs[key].folderPath} for orphan output...`)
            fs.rmSync(sessionedOutputs[key].folderPath, { recursive: true, force: true });
        }
        else if (!sessionedOutputs[key].searchingOutputFound && sessionedOutputs[key].filePath !== "./output/results.json") {
            logger.warn(`Orphan session detected: ${key}`)
            logger.debug(`Deleting file ${sessionedOutputs[key].filePath} for orphan session...`)
            fs.unlinkSync(sessionedOutputs[key].filePath)
        }
    logger.debug(sessionedOutputs)
    logger.debug("Current filesystem storage size for sessions and outputs: ", Number(usedMB.toFixed(3)), " MB")
}

function ngsi(NGSI_entity, confIn) {
    const conf = confIn || config;
    return (((NGSI_entity == undefined) && conf.NGSI_entity || NGSI_entity).toString() === 'true')
}

/* The per-request config is built with JSON.parse(JSON.stringify(config)) (see auth.js),
 * a round-trip that turns RegExp literals into {} and would silently disable all cleaning.
 * Resolve the pattern defensively: use it if it is a real RegExp, rebuild it if it arrived
 * as a string (the documented "regex provided from the request in server mode"), and
 * otherwise fall back to the module-level config, which always holds real RegExp objects.
 */
const resolveCleanRegex = (conf, NGSI_entity) => {
    const key = ngsi(NGSI_entity, conf) ? "default" : "custom";
    const candidate = conf && conf.regexClean ? conf.regexClean[key] : undefined;
    if (candidate instanceof RegExp)
        return candidate;
    if (typeof candidate === 'string' && candidate.length > 0)
        try {
            return new RegExp(candidate, 'g');
        } catch (error) {
            logger.error(`Invalid regexClean.${key} provided: ${candidate}`);
        }
    return config.regexClean[key];
};

const cleanString = (string, NGSI_entity, conf) => {
    var result = '';
    if (typeof string === 'string')
        // Data values and field names are only stripped when regexCleanDest is "all".
        // With any other value the regexClean profile applies to entity ids only
        // (cleanIdString), since characters such as "(" ")" are legitimate in values.
        result = (conf || config).regexCleanDest === "all"
            ? string.replace(resolveCleanRegex(conf, NGSI_entity), ' ')
            : string;

    return result;

};

const cleanIdString = (string, NGSI_entity, conf) => {
    var result = '';
    if (typeof string === 'string')
        // Ids are ALWAYS cleaned, regardless of regexCleanDest.
        result = string.replace(resolveCleanRegex(conf, NGSI_entity), ' ')
            .replace(/à/g, 'a')
            .replace(/ù/g, 'u')
            .replace(/é|è/g, 'e')
            .replace(/ò/g, 'o');

    return result;
};


const cleanNumber = (number) => {
    return number;
};

/* confIn is the PER-REQUEST config. It must be threaded all the way down to cleanString,
 * otherwise options such as regexCleanDest only work when set in config.js and are
 * silently ignored when specified in the body of a single mapping request.
 * Falls back to the module-level config when omitted, for backward compatibility.
 */
const cleanPair = (key, value, NGSI_entity, confIn) => {

    const conf = confIn || config;

    if (value instanceof Array) {
        var arrayResult = {};
        var arrayValues = [];
        for (var i = 0; i < value.length; i++) {
            var elem = value[i];

            arrayValues[i] = cleanPair(key, elem, NGSI_entity, conf).value;
        }
        arrayResult.key = cleanString(key, NGSI_entity, conf);
        arrayResult.value = arrayValues;
        return arrayResult;

    } else if (value !== null && typeof value === 'object') {
        var result = {};
        var objResult = {};
        Object.keys(value).forEach(function (objKey) {
            var aux = cleanPair(objKey, value[objKey], NGSI_entity, conf);
            objResult[aux.key] = aux.value;
        });
        result.key = cleanString(key, NGSI_entity, conf);
        result.value = objResult;
        return result;

    } else {

        var result = {};
        result.key = cleanString(key, NGSI_entity, conf);
        if (typeof value === 'string')
            result.value = cleanString(value, NGSI_entity, conf);
        else if (value !== null) {
            result.value = cleanNumber(value, NGSI_entity);
        }
        else
            result.value = '';

        return result;
    }
};

const cleanRow = (row, NGSI_entity, confIn) => {

    var result = {};

    Object.keys(row).forEach(function (key) {
        var value = row[key];
        var newPair = cleanPair(key, value, NGSI_entity, confIn || config);
        result[newPair.key] = newPair.value;
    });

    return result;
};

const uuid = () => {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
};


/* Create Final SynchroniCity id, according to defined Id Pattern
 * 
 *  If the entityName is not empty
 *     if it isIdPrefix, concatenate entityName with rowNumber
 *     else use only EntityName (should have a mapped unique value)
 *  else
 *     use as entityName the sourcefilename + rowNumber
 * 
 * 
 */
const createSynchId = (type, site, service, group, entityName, isIdPrefix, rowNumber, NGSI_entity, config) => {
    logger.debug({ service, group })
    if (type === undefined)
        type = "SomeType"
    if (entityName) {
        if (isIdPrefix)
            entityName = ('' + entityName).replace(/\s/g, "") + "-" + rowNumber;
        else
            entityName = ('' + entityName).replace(/\s/g, "");
    } else {
        entityName = extractFilenameFromPath(config.sourceDataPath.replace(/\s/g, "") + "-" + rowNumber);
    }

    // Group field is optional
    return "urn:ngsi-ld:" + type + ":" + (site ? site + ":" : "") + (service ? service + ":" : "") + (group ? group + ":" : "") + cleanIdString(entityName, NGSI_entity, config);
};


const parseFunction = (str) => {
    var fn_body_idx = str.indexOf('{'),
        fn_body = str.substring(fn_body_idx + 1, str.lastIndexOf('}')),
        fn_declare = str.substring(0, fn_body_idx),
        fn_params = fn_declare.substring(fn_declare.indexOf('(') + 1, fn_declare.lastIndexOf(')')),
        args = fn_params.split(',');

    args.push(fn_body);

    function Fn() {
        return Function.apply(this, args);
    }
    Fn.prototype = Function.prototype;

    return new Fn();
};

const extractFilenameFromPath = (string) => {

    var match = string.match(filenameFromPathPattern);
    if (match && match.length > 2)
        return match[3];
    else
        return string;

};

const parseFilePath = (pathString) => {

    return pathParse(pathString);

};
// Utility function that prints the final report by using the input logger

/*function spaceCleaner(object) {//TODO IMPORTANT prevent stack overflow
    for (let sub in object)
        if (typeof object[sub] === "object" || typeof object[sub] === "array") object[sub] = spaceCleaner(object[sub]);
        else if (typeof object[sub] === "string" && object[sub][0] == " ") object[sub] = object[sub].substring(1, object[sub].length)
    return object
}*/

/*function spaceCleaner(object) {
    stack = [object];
 
    while (stack.length > 0) {
        let current = stack.pop();
 
        for (let sub in current) {
            if (typeof current[sub] === "object" && current[sub] !== null) {
                stack.push(current[sub]); 
            } else if (typeof current[sub] === "string" && current[sub][0] === " ") {
                current[sub] = current[sub].substring(1); 
            }
        }
    }
 
    return object; 
}*/

/*function spaceCleaner(object) {//TODO this is not done yet (it should clean just the values and not also the keys)
    object = JSON.stringify(object)
    while (field.replaceAll('" ', '"') != field) field = field.replaceAll('" ', '"')
    while (field.replaceAll(' "', '"') != field) field = field.replaceAll(' "', '"')
}*/

let stackCalls = 0
let called = false
async function spaceCleaner(object) {

    /*while (called){
        await sleep(10)
        logger.debug(stackCalls)
    }
    called = true
    let r = spaceCleaner0(object)
    called = false*/
    //return r 

    for (let o of object)
        o = spaceCleaner0(o)
    return object
}

function spaceCleaner0(object) {
    stackCalls++
    //logger.debug("Stack calls ", stackCalls)
    if (stackCalls > 3000)
        console.debug(object)
    if (Array.isArray(object)) {
        for (let sub of object)
            if (typeof sub === "object")
                sub = spaceCleaner0(sub);
            else
                if (typeof sub === "string" && sub[0] == " ") sub = sub.substring(1, sub.length)
    }
    else
        for (let sub in object)
            if (typeof object[sub] === "object")
                object[sub] = spaceCleaner0(object[sub]);
            else
                if (typeof object[sub] === "string" && object[sub][0] == " ") object[sub] = object[sub].substring(1, object[sub].length)
    stackCalls--
    return object
}

const bodyMapper = (body, query) => {

    if (body.mapperRecordID || body.adapterID || query.mapID) body.mapID = body.mapperRecordID || body.adapterID || query.mapID

    let sourceData = {
        name: body.sourceDataIn,
        minioObjName: body.sourceDataMinio?.name || body.prefix,
        minioBucketName: body.sourceDataMinio?.bucket || body.bucketName,
        //minioObjEtag: body.sourceDataMinio.etag,
        id: body.sourceDataID,
        type: body.sourceDataType,
        url: body.sourceDataURL,
        data: body.sourceData,
        path: body.path
    }

    let map
    if (body.mapPathIn) //TODO this map handle must be consistent. Only object, not string or array or object
        map = config.sourceDataPath + body.mapPathIn
    else if (body.mapID) {
        map = {
            id: body.mapID
        }
    }
    else if (body.mapData) {
        map = [
            body.mapData,
            "mapData"
        ]
    }
    else if (body.mapDescription) {
        map = {
            description: body.mapDescription
        }
    }
    let dataModel = {
        name: body.dataModelIn,
        id: body.dataModelID,
        data: body.dataModel,
        url: body.dataModelURL,
        schema_id: body.dataModel?.$id
    }

    if (body.config) {
        if (body.NGSI_entity !== undefined)
            body.config.NGSI_entity = body.NGSI_entity
        if (body.csvDelimiter !== undefined)
            body.config.csvDelimiter = body.csvDelimiter
    }
    else if (body.NGSI_entity !== undefined || body.csvDelimiter !== undefined)
        body.config = {
            NGSI_entity: body.NGSI_entity,
            csvDelimiter: body.csvDelimiter
        }

    let decodeOptions = body.decodeOptions

    return {
        sourceData,
        map,
        decodeOptions,
        dataModel
    }
};

const init = async () => {
    if (process.dataModelMapper)
        process.dataModelMapper.lockMapping = true
    let deletedCount = 0;

    const deleteTemp = (dir, keyword) => {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    logger.error("Errore durante la lettura della directory:", err);
                    return reject(err);
                }

                const deletePromises = files.map((file) => {
                    const filePath = path.join(dir, file);

                    if (file.includes(keyword)) {
                        return new Promise((res, rej) => {
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    logger.error(`Errore durante l'eliminazione del file ${filePath}:`, err);
                                    rej(err);
                                } else {
                                    logger.info(`File ${file} eliminato.`);
                                    deletedCount++;
                                    res();
                                }
                            });
                        });
                    } else {
                        return Promise.resolve();
                    }
                });

                Promise.all(deletePromises).then(resolve).catch(reject);
            });
        });
    };

    await Promise.all([
        deleteTemp("dataModels/", "DataModelTemp"),
        deleteTemp(config.sourceDataPath || "", "sourceFileTemp"),
    ]);

    logger.debug("Deleted trash files", deletedCount);
    process.dataModelMapper.lockMapping = false
};

const hasNull = (obj) => Object.values(obj).some(value => value === null);
const hasNumberKeys = (obj) => Object.keys(obj).some(key => Number.isFinite(parseInt(key)));

const sendOutput = async (config, res) => {
    try {
        while (res?.dmm?.outputFile && !res?.dmm?.outputFile[0])
            res.dmm.outputFile.shift()
        if (config.deleteEmptySpaceAtBeginning)
            res.dmm.outputFile = await spaceCleaner(res.dmm.outputFile)
        if (config.rowStart)// && hasNull(res?.dmm?.outputFile[0] && hasNumberKeys(res?.dmm?.outputFile[0])))
            res.dmm.outputFile = res.dmm.outputFile.slice(config.rowStart - 1)
    }
    catch (error) {
        logger.error(error)
        if (config.mappingReport)
            try {
                if (!res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"].Details)
                    res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"].Details = { errors: [{ error }] }
                else if (!res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"].Details.errors)
                    res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"].Details.errors = [{ error }]
                else
                    res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"].Details.errors.push([{ error }])
            }
            catch (error) {
                logger.error(error)
            }
    }
    //if (parseInt((res.dmm.outputFile[res.dmm.outputFile.length - 1].MAPPING_REPORT.Mapped_and_NOT_Validated_Objects)[0].charAt(0))) process.res.status(400).send({ errors: res.dmm.outputFile.errors || "Validation errors", report: res.dmm.outputFile[res.dmm.outputFile.length - 1] })
    //else 
    if (!config.mappingReport && res.dmm.outputFile[res.dmm.outputFile.length - 1].MAPPING_REPORT)
        res.dmm.outputFile.pop()
    //try {
    //await res.write(res.dmm.outputFile);
    //await res.end()
    //await res.send(res.dmm.outputFile);
    try {
        fs.unlinkSync(res.dmm.schemaTempName, (err) => {
            if (err) {
                logger.error(
                    `Errore durante l'eliminazione del file ${res.dmm.schemaTempName}:`,
                    err
                );
            } else {
                logger.info(`File ${res.dmm.schemaTempName} eliminato.`);
            }
        })
    } catch (error) {
        logger.error(`Errore durante l'eliminazione del file ${res.dmm.schemaTempName}:`);
        logger.error(error)
    }
    try {
        if (fs.existsSync(res.dmm.sourceTempName))
            fs.unlinkSync(res.dmm.sourceTempName, (err) => {
                if (err) {
                    logger.error(
                        `Errore durante l'eliminazione del file ${res.dmm.sourceTempName}:`,
                        err
                    );
                } else {
                    logger.info(`File ${res.dmm.sourceTempName} eliminato.`);
                }
            })
        else if (config.dontWriteTempFiles)
            logger.debug("no files to delete")
        else 
            logger.warn("Strangely, no files to delete. Control your own to prevent memory leak")
    }
    catch (error) {
        logger.error(`Errore durante l'eliminazione del file ${res.dmm.sourceTempName}:`);
        logger.error(error)
    }
    /*}
    catch (error) {
        logger.error(error)
    }*/
    let outputDataTempWriting = {}
    let outputId = res.dmm.outputID //common.createRandId() + source.type
    res.set('outputId', outputId);
    if (config.mappingReport)
        res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"].outputId = outputId
    else
        logger.debug(res.dmm.outputFile[res.dmm.outputFile.length - 1])
    //await Session.insertMany([{ sessionId: outputId }])
    try {
        if (res.dmm.source.data && res.dmm.source.url)
            res.dmm.source.data = undefined
        if (config.sessionLocation.filesystem)
            fs.writeFileSync('./output/output' + outputId + '.json', config.enableSessions ? res.dmm : "Sessions disabled", "utf8");
        if (config.sessionLocation.mongo)
            await Session.insertMany([{ sessionId: outputId, data: res.dmm }])
    }
    catch (error) {
        logger.error(error)
        //logger.error(res.dmm)
        outputDataTempWriting.value = 'Error during output file creation.'
    }
    //if (config.sessionLocation.filesystem)
    //    await finish(outputDataTempWriting)
    if (!config.manualCheckMaximumSpaceOverflow)
        await checkMaximumSpaceOverflow(outputId)
    //const deleteSession = 
    logger.debug(res.dmm.outputFile[res.dmm.outputFile.length - 1])
    res.dmm.deleteSession()
    if (config.forceInitAfterMapping)
        await init()
    //res = null
    //res.dmm = {};
    //res.dmm.finished = true
    process.dataModelMapper.map = undefined
    process.dataModelMapper.resetConfig = undefined
    logger.debug("Processing time : ", Date.now() - process.env.start)
};

const printFinalReportAndSendResponse = async (loggerr, minioObj, config, res) => {

    await logger.info('\n--------  MAPPING REPORT ----------\n' +
        '\t Processed objects: ' + config.rowNumber + '\n' +
        '\t Mapped and Validated Objects: ' + config.validCount + '/' + config.rowNumber + '\n' +
        '\t Mapped and NOT Validated Objects: ' + config.unvalidCount + '/' + config.rowNumber + '\n' +
        '-----------------------------------------');

    if (config.validCount + config.unvalidCount < config.rowNumber)
        config.unvalidCount = config.rowNumber - config.validCount

    if (config.mode == 'server') {
        //Mapping report in output file

        while (isOrionWriterActive(config) && (config.orionWrittenCount + config.orionUnWrittenCount < config.validCount)) {
            await sleep(1000, "Orion writing progress :" + (config.orionWrittenCount + config.orionUnWrittenCount) + "/" + config.validCount)
        }

        //logger.debug(config.orionWriter)

        res.dmm.outputFile[res.dmm.outputFile.length] = {
            MAPPING_REPORT: {
                Processed_objects: config.rowNumber,
                Mapped_and_Validated_Objects: config.validCount + '-' + config.rowNumber,
                Mapped_and_NOT_Validated_Objects: config.unvalidCount + '-' + config.rowNumber,
                Details: {
                    outputId: res.dmm.outputID
                }
            },
            ORION_REPORT: isOrionWriterActive(config) ? {
                "Object written to Orion Context Broker": config.orionWrittenCount.toString() + '/' + config.validCount.toString(),
                "Object NOT written to Orion Context Broker": config.orionUnWrittenCount.toString() + '/' + config.validCount.toString(),
                "Object SKIPPED": config.orionSkippedCount.toString() + '/' + config.validCount.toString(),
                details: config.orionWriter.details
            } : "Orion writer not enabled"
        }

        if (config.report?.errorsDetails)
            res.dmm.outputFile[res.dmm.outputFile.length - 1]["MAPPING_REPORT"].Details.errors = res.dmm.errors

        try {
            /*if (isMinioWriterActive()) {
                logger.debug("minio is enabled")
                for (let obj of res.dmm.outputFile) {
                    logger.debug("minio writing")
                    try {
                        logger.debug("minioObj.name")
                        logger.debug(minioObj.name)
                        let bucketName = minioObj.bucket || config.minioWriter.defaultOutputFolderName || "output"
                        let objectName = (obj[minioObj.name]?.concat(obj[config.entityNameField] || obj.id || Date.now().toString()) || minioObj.name.concat("/output_processed_").concat(Date.now().toString()) || Date.now().toString())//.toLowerCase()
                        logger.debug("bucket name")
                        logger.debug(bucketName)
                        logger.debug("object name")
                        logger.debug(objectName)
                        if (!obj.MAPPING_REPORT && !obj.ORION_REPORT)
                            await minioWriter.stringUpload(bucketName, objectName, obj)
                    }
                    catch (error) {
                        logger.error(error)                     
                    }
                    logger.debug("minio writing done")
                }
                logger.debug("written to minio")
            }*/
            await sendOutput(config, res);
        }
        catch (error) {
            logger.error(error)
            //crash
            res.dmm.outputFile = [];
        }
    }
};

const addAuthenticationHeader = (headers) => {
    if (config.OAUTH_TOKEN) {
        headers.Authorization = ('Bearer ' + config.OAUTH_TOKEN);
    }
    if (config.PAUTH_TOKEN) {
        headers['x-auth-token'] = config.PAUTH_TOKEN;
    }
};

const getDataModelPath = (dataModelName) => {
    if (dataModelName && checkInputDataModel(config.modelSchemaFolder, dataModelName))
        return path.join(config.modelSchemaFolder, dataModelName + '.json');
    else
        return undefined;
};

const checkInputDataModel = (folderPath, dataModel) => {

    var schemaFiles = require('fs').readdirSync(folderPath);
    if (schemaFiles)
        return schemaFiles.indexOf(dataModel + '.json') > -1;
    else
        return false;

};

const getActiveWriters = () => {

    return config.writers;
};

const isFileWriterActive = (configIn) => {
    return (configIn || config).writers.includes('fileWriter');
};

const isOrionWriterActive = (configIn) => {
    return (configIn || config).writers.includes('orionWriter');
};

const isWriterActive = (writerName, configIn) => {
    return (configIn || config).writers.includes(writerName);
};

const isReadableFileStream = (obj) => {
    return isFileStream.readable(obj);
};

const isReadableStream = (obj) => {
    return obj.readable;
};

const promiseTimeout = (ms, promise) => {

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.');
        }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ]);
};

/*
 * Restore the default configurations, if any was ovverriden by the request ones
 */
const restoreDefaultConfs = () => {
    config.rowStart = config.old_rowStart;
    config.rowEnd = config.old_rowEnd;
    config.orionUrl = config.old_orionUrl;
    config.updateMode = config.old_updateMode;
    config.fiwareService = config.old_fiwareService;
    config.fiwareServicePath = config.old_fiwareServicePath;
    config.outFilePath = config.old_outFilePath;
    config.idSite = config.old_idSite;
    config.idService = config.old_idService;
    config.idGroup = config.old_idGroup;
};

const encode = (encoding, value) => {
    if (encoding == "base64")
        return base64.encode(value)
    return value
};

const waiting = async (flag) => {
    while (process.dataModelMapper[flag])
        await process.dataModelMapper.sleep(100, "Waiting " + flag)
}

module.exports = {
    cleanString: cleanString,
    cleanPair: cleanPair,
    cleanRow: cleanRow,
    uuid: uuid,
    createSynchId: createSynchId,
    extensionPattern: extensionPattern,
    httpPattern: httpPattern,
    parseFunction: parseFunction,
    printFinalReportAndSendResponse: printFinalReportAndSendResponse,
    extractFilenameFromPath: extractFilenameFromPath,
    addAuthenticationHeader: addAuthenticationHeader,
    getDataModelPath: getDataModelPath,
    checkInputDataModel: checkInputDataModel,
    parseFilePath: parseFilePath,
    isValidPath: isValidPath,
    getActiveWriters: getActiveWriters,
    isFileWriterActive: isFileWriterActive,
    isOrionWriterActive: isOrionWriterActive,
    isWriterActive: isWriterActive,
    isMinioWriterActive: isMinioWriterActive,
    isReadableFileStream: isReadableFileStream,
    isReadableStream: isReadableStream,
    promiseTimeout: promiseTimeout,
    restoreDefaultConfs: restoreDefaultConfs,
    encode: encode,
    bodyMapper: bodyMapper,
    waiting,
    createRandId,
    init,
    checkMaximumSpaceOverflow
};