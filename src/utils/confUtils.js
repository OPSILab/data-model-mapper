/*******************************************************************************
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

const nconf = require('nconf');
const config = require('../../config');
const log = require('./logger').app;
const path = require('path');
const pathPattern = /^.+(\/|\\)[^\/|\\]+$/g;
nconf.use('memory');

process.argv.forEach(function (val, index, array) {
    nconf.argv({
        'mapPath': {
            alias: 'm',
            describe: 'File path of the mapping Json',
            type: 'string',
            demand: false
        },
        'sourceDataPath': {
            alias: 's',
            describe: 'File path of source data, following file types are supported:\n' +
                'CSV: The first row defines columns, each next one represents one data row\n' +
                'GeoJson: It must be a Feature Collection, where each Feature represents a data row',
            type: 'string',
            demand: false
        },
        'targetDataModel': {
            alias: 'd',
            describe: 'The name of target Data Model in which source data will be mapped',
            type: 'string',
            demand: false
        },
        'orionUrl': {
            alias: 'u',
            describe: 'URL of the context broker where mapped entities will be written',
            type: 'string',
            demand: false
        },
        'f': {
            alias: 'outputFile',
            describe: 'Output file to printout mapped entities. If not specified, it will be printed over the standard output',
            type: 'string',
            demand: false
        },
        'mo': {
            alias: 'mapOutput',
            describe: 'Output file to printout validation results. If not specified, it will be printed over the standard output',
            type: 'string',
            demand: false
        },
        'mo': {
            alias: 'orionOutput',
            describe: 'Output file to printout Orion writing results. If not specified, it will be printed over the standard output',
            type: 'string',
            demand: false
        },

        //   'oauthTok' : {
        // alias: 'scipv:oauthTok',
        // describe: 'OAuth token. It adds an authorizatin headers with the format "Authorization : Bearer <TOKEN>"',
        // type: 'string'		   
        //}, 
        //   'wauthTok' : {
        // alias: 'scipv:oauthTok',
        // describe: 'Wilma token. It adds an authorizatin headers with the format "x-auth-token : <TOKEN>"',
        // type: 'string'		   
        //}, 
        'h': {
            alias: 'help',
            describe: 'Print the help message',
            demand: false,
        }
    }).add('file', { type: 'literal', store: config });
});

const help = () => {
    if (nconf.get('h')) {
        nconf.stores.argv.showHelp();
        process.exit(0);
    }
};

const checkConf = () => {


    var mapPath = nconf.get('mapPath');
    if (!mapPath) {
        log.error('You need to specify the mapping file path');
        return false;
    }
    if (mapPath && !mapPath.match(pathPattern)) {
        log.error('Incorrect mapping file path');
        return false;
    }

    var sourcePath = nconf.get('sourceDataPath');
    if (!sourcePath) {
        log.error('You need to specify the source file path');
        return false;
    }
    if (sourcePath && !sourcePath.match(pathPattern)) {
        log.error('Incorrect source file path');
        return false;
    }

    var dataModel = nconf.get('targetDataModel');
    if (!checkInputDataModel(config.modelSchemaFolder, dataModel)) {
        log.error('Incorrect target Data Model name');
        return false;
    } else
        nconf.set('targetDataModel', path.join(config.modelSchemaFolder, dataModel + '.json'));



    if (!nconf.get('orionUrl') && !config.orionWriter.orionUrl) {
        log.error('You need to specify the remote URL of Orion Context Broker');
        return false;
    } else {
        nconf.set('orionUrl', nconf.get('orionUrl') || config.orionWriter.orionUrl);
    }

    return true;
};

const init = () => {
    help();
    return checkConf();

};

const getParam = (par) => {
    return nconf.get(par);
};

function checkInputDataModel(folderPath, dataModel) {

    var schemaFiles = require('fs').readdirSync(folderPath);
    if (schemaFiles)
        return schemaFiles.indexOf(dataModel + '.json') > -1;
    else
        return false;

}

module.exports = {
    help: help,
    init: init,
    getParam: getParam
};