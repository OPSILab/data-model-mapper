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
const minioWriter = require("../../../writers/minioWriter")

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

module.exports = {
    auth: async (req, res, next) => {

        process.env.start = Date.now()

        if (req.body.file)
            req.body = JSON.parse(req.body.file)

        if (authConfig.disableAuth)
            next()
        else {
            let authHeader = req.headers.authorization;

            if (authHeader) {
                if (authHeader && !authHeader.startsWith("Bearer"))
                    authHeader = "Bearer " + authHeader

                const jwtToken = authHeader.split(' ')[1];

                //logger.debug("!" + jwtToken, "\n", Buffer.from(jwtToken.split(".")[1], 'base64').toString())

                let verifiedToken
                try {
                    verifiedToken = jwt.verify(jwtToken, //Buffer.from(
                        authConfig.publicKey
                        //, 'base64').toString()
                        //-------//
                        , { algorithms: ['RS256'] })
                }
                catch (error) {

                    logger.error("error at " + error.stack)
                    if (error.message == "invalid token" || error.message == "jwt expired" || error.message == "jwt malformed")
                        return res.sendStatus(403);
                    else
                        return res.sendStatus(500);
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
                                res.sendStatus(403);
                            }
                        })
                        .catch(error => {
                            logger.error(error.response.data)
                            logger.error('Errore during token verify:', error.message);
                            res.sendStatus(500);
                        });
                }
                else {

                    const decodedToken = verifiedToken || parseJwt(jwtToken)

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
                                    logger.error("error at " + error.stack)
                                    res.status(500).send(error || error.toString())
                                }
                            }
                            let { pilot, username, email } = data
                            config.orionWriter.fiwareService = req.body.bucketName = pilot.toLowerCase() //+ "/" + email + "/" + config.minioWriter.defaultInputFolderName//{pilot, email}
                            req.body.prefix = (email || username) + "/" + config.minioWriter.defaultInputFolderName
                            config.group = email || username
                            config.orionWriter.fiwareServicePath = "/" + pilot.toLowerCase()
                        }
                        else
                            req.body.prefix = decodedToken.email
                        //logger.debug(req.body.prefix)



                        //logger.debug(req.body, req.params, req.query)

                        //if (req.params.bucketName && req.params.objectName)
                        //    logger.debug(req.body.bucketName , req.params.bucketName , req.body.prefix , req.params.objectName.split("/")[0] + "/" + req.params.objectName.split("/")[1])

                        if ((!req.params.bucketName || !req.params.objectName) || (req.body.bucketName == req.params.bucketName && req.body.prefix == req.params.objectName.split("/")[0] + "/" + req.params.objectName.split("/")[1]))
                            next()
                        else
                            res.status(403).send("Available bucketname is " + req.body.bucketName + " and you tried to access " + req.params.bucketName + ".\nAvailable prefix is " + req.body.prefix + " and you tried to access this object " + req.params.objectName);
                    }
                    else
                        res.sendStatus(403);
                }
            }
            else
                res.sendStatus(401);
        }
    }
};