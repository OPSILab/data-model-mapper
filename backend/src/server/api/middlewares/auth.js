const config = require('../../../../config')
const axios = require('axios');
const jwt = require('jsonwebtoken');
//const authConfig = (await axios.get("http://localhost:12345/data-model-mapper-gui/assets/config.json")).data
const authConfig = config.authConfig
const keycloakServerURL = authConfig.idmHost;
const realm = authConfig.authRealm;
const clientID = authConfig.clientId;
const clientSecret = authConfig.secret;
const log = require("../../../utils/logger")
const { Logger } = log
const logger = new Logger(__filename)
const common = require("../../../utils/common")
const minioWriter = common.isMinioWriterActive() ? require("../../../writers/minioWriter") : null
const mergeConfig = require("../../../utils/configHandler").mergeConfig
const mongoose = require("mongoose")

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function send(res, status, body) {
    try {
        if (!body)
            res.sendStatus(status)
        else if (status)
            res.status(status).send(body)
        else
            res.send(body)
    }
    catch (error) {
        logger.error(error)
    }
    process.dataModelMapper.resetConfig = undefined
}

module.exports = {
    auth: async (req, res, next) => {

        process.env.start = Date.now()

        if (req.body.file)
            req.body = JSON.parse(req.body.file)
        else
            if (req.file)
                if (req.body)
                    req.body.file = req.file.buffer.toString('utf8');
                else
                    req.body = { file: req.file.buffer.toString('utf8') }

        if (req.body.mapID || req.body.mapDescription || req.body.adapterID) {
            const Map = process.shared.Map
            let map
            if (req.body.mapDescription)
                map = await Map.findOne({ description: req.body.mapDescription })
            else if (config.idVersion == 1 || req.body.config?.idVersion == 1)
                map = await Map.findOne({ id: req.body.mapID || req.body.adapterID })
                    || await Map.findOne({ name: req.body.mapID || req.body.adapterID })
            else if (mongoose.Types.ObjectId.isValid(req.body.mapID || req.body.adapterID))
                map = await Map.findOne({ _id: req.body.mapID || req.body.adapterID })
            else
                map = await Map.findOne({ id: req.body.mapID || req.body.adapterID })
                    || await Map.findOne({ name: req.body.mapID || req.body.adapterID })
            // The map carries a stored config, but assigning it here DISCARDED whatever the
            // caller sent in the body: a request asking for mappingMode "light" silently ran in
            // the map's mode. Merge instead, with the request winning, so precedence reads
            // global config < map config < request config.
            // JSON round-trip first: config is a Mixed field, so map.config can arrive as a
            // Mongoose-backed object whose internal keys would leak into the spread.
            if (map?.config)
                if (Array.isArray(req.body.config))
                    req.body.config = JSON.parse(JSON.stringify(map.config))
                else
                    req.body.config = mergeConfig(JSON.parse(JSON.stringify(map.config)), req.body.config || {})
        }
        if (Array.isArray(req.body.config))
            req.body.config = JSON.parse(JSON.stringify(config))
        else
            req.body.config = mergeConfig(JSON.parse(JSON.stringify(config)), req.body.config || {})

        if (authConfig.disableAuth) {
            let pilot = "shared", username = "shared", email = "shared"
            if (!req.body.config)
                req.body.config = {
                    orionWriter: {}
                }
            req.body.config.orionWriter.fiwareService = req.body.bucketName = "shared"//+ "/" + email + "/" + config.minioWriter.defaultInputFolderName//{pilot, email}
            req.body.prefix = (email || username) + "/" + "default"
            req.body.config.group = email || username
            req.body.config.orionWriter.fiwareServicePath = "/" + pilot.toLowerCase()
            req.body.pilot = pilot
            req.body.email = email
            next()
        }

        else {
            let authHeader = req.headers.authorization || req.query.authorization;

            if (authHeader) {
                if (authHeader && !authHeader.startsWith("Bearer"))
                    authHeader = "Bearer " + authHeader

                const jwtToken = authHeader.split(' ')[1];

                //logger.debug("!" + jwtToken, "\n", Buffer.from(jwtToken.split(".")[1], 'base64').toString())

                let verifiedToken
                if (authConfig.publicKeys) {
                    let authenticated = false
                    let error
                    for (let publicKey of authConfig.publicKeys)
                        try {
                            verifiedToken = jwt.verify(jwtToken, //Buffer.from(
                                publicKey
                                //, 'base64').toString()
                                //-------//
                                , { algorithms: ['RS256'] })
                            authenticated = true
                            break
                        }
                        catch (err) {
                            if (err.message == "invalid token" || err.message == "jwt expired" || err.message == "jwt malformed")
                                return send(res, 403);
                            else {
                                logger.warn("Still trying to validate token... ", err.message)
                                error = err
                            }
                        }
                    if (!authenticated) {
                        logger.error(error)
                        if (error.message == "invalid token" || error.message == "jwt expired" || error.message == "jwt malformed")
                            return send(res, 403);
                        else
                            return send(res, 500);
                    }
                }
                else
                    try {
                        verifiedToken = jwt.verify(jwtToken, //Buffer.from(
                            authConfig.publicKey
                            //, 'base64').toString()
                            //-------//
                            , { algorithms: ['RS256'] })
                    }
                    catch (error) {

                        logger.error(error)
                        if (error.message == "invalid token" || error.message == "jwt expired" || error.message == "jwt malformed")
                            return send(res, 403);
                        else
                            return send(res, 500);
                    }


                if (authConfig.introspect) {
                    const introspectionEndpoint = `${keycloakServerURL}/realms/${realm}/protocol/openid-connect/token/introspect`;

                    const data = new URLSearchParams();
                    data.append('token', jwtToken);
                    data.append('client_id', clientID);
                    data.append('client_secret', clientSecret);

                    axios.post(introspectionEndpoint, data)
                        .then(response => {
                            if (response.data.active) {
                                logger.info('Token valid:', response.data);
                                next();
                            } else {
                                logger.error('Token not valid.');
                                send(res, 403)
                            }
                        })
                        .catch(error => {
                            logger.error(error.response.data)
                            logger.error('Errore during token verify:', error.message);
                            send(res, 500)
                        });
                }
                else {

                    const decodedToken = verifiedToken || parseJwt(jwtToken)

                    logger.debug("Token valid ", (decodedToken.azp == authConfig.clientId) && ((decodedToken.exp * 1000) > Date.now()))
                    if ((decodedToken.azp == authConfig.clientId) && ((decodedToken.exp * 1000) > Date.now())) {


                        if (common.isMinioWriterActive()) {
                            try {
                                var data = (await axios.get(config.authConfig.userInfoEndpoint, { headers: { "Authorization": authHeader } })).data
                            }
                            catch (error) {
                                logger.error(error?.toString())
                                logger.error(error?.response?.data || error?.response)
                                //req.body.prefix = decodedToken.email
                                //config.group = decodedToken.email
                                try {
                                    data = await minioWriter.getUserData(decodedToken.email)
                                }
                                catch (error) {
                                    logger.error(error)
                                    if (config.minioWriter.restrictAccess)
                                        return send(res, 500, error || error.toString())
                                }
                            }

                            let pilot = data?.pilot || decodedToken.pilot || "shared"
                            let email = data?.email || decodedToken.email || "shared"
                            let username = data?.username || decodedToken.username || "shared"

                            if (!req.body.config)
                                req.body.config = {
                                    orionWriter: {}
                                }
                            req.body.config.orionWriter.fiwareService = req.body.bucketName = pilot.toLowerCase() //+ "/" + email + "/" + config.minioWriter.defaultInputFolderName//{pilot, email}
                            req.body.prefix = (email || username) + "/" + config.minioWriter.defaultInputFolderName
                            req.body.config.group = email || username
                            req.body.config.orionWriter.fiwareServicePath = "/" + pilot.toLowerCase()
                            req.body.pilot = pilot
                            req.body.email = email
                        }
                        else {
                            let pilot = "shared", username = "shared", email = "shared"
                            if (!req.body.config)
                                req.body.config = {
                                    orionWriter: {}
                                }
                            req.body.config.orionWriter.fiwareService = req.body.bucketName = decodedToken.pilot?.toLowerCase() || "shared" //+ "/" + email + "/" + config.minioWriter.defaultInputFolderName//{pilot, email}
                            req.body.prefix = (decodedToken.email || decodedToken.username || username) + "/" + config.minioWriter.defaultInputFolderName
                            req.body.config.group = decodedToken.email || decodedToken.username || username
                            req.body.config.orionWriter.fiwareServicePath = "/" + decodedToken.pilot?.toLowerCase() || pilot
                            req.body.pilot = decodedToken.pilot || pilot
                            req.body.email = decodedToken.email || decodedToken.username || email
                        }
                        //logger.debug(req.body.prefix)



                        //logger.debug(req.body, req.params, req.query)

                        //if (req.params.bucketName && req.params.objectName)
                        //    logger.debug(req.body.bucketName , req.params.bucketName , req.body.prefix , req.params.objectName.split("/")[0] + "/" + req.params.objectName.split("/")[1])

                        if ((!req.params.bucketName || !req.params.objectName) || (req.body.bucketName == req.params.bucketName))// && req.body.prefix == req.params.objectName.split("/")[0] + "/" + req.params.objectName.split("/")[1]))
                            next()
                        else {
                            logger.debug("Available bucketname is " + req.body.bucketName + " and you tried to access " + req.params.bucketName)// + ".\nAvailable prefix is " + req.body.prefix + " and you tried to access this object " + req.params.objectName)
                            send(res, 403, "Available bucketname is " + req.body.bucketName + " and you tried to access " + req.params.bucketName)// + ".\nAvailable prefix is " + req.body.prefix + " and you tried to access this object " + req.params.objectName)
                        }
                    }
                    else {
                        logger.debug(decodedToken.azp)
                        logger.debug(authConfig.clientId)
                        logger.debug((decodedToken.exp * 1000) - Date.now())
                        send(res, 403)
                    }
                }
            }
            else
                send(res, 401)
        }
    }
};