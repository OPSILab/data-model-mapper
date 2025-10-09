const axios = require("axios");
const config = require("../../config.js")
const keycloakBaseUrl = "http://localhost:8080/realms/master";
const { clientId, username, password } = config.authConfig;
const fs = require('fs');
const path = './token.js';

async function updateJWT() {
    const response = await axios.post(
        `${keycloakBaseUrl}/protocol/openid-connect/token`,
        new URLSearchParams({
            grant_type: "password",
            client_id: clientId,
            username,
            password,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    console.log(response.data.access_token);
    fs.writeFileSync(path, 'module.exports = "' + response.data.access_token + '"', 'utf8');
    return response.data.access_token;
}

module.exports = { updateJWT };
//getJWT().then(token => console.log("Token saved to " + path)).catch(error => console.error(error.response?.data || error));

//getJWT().then(token => console.log(token)).catch(error => console.error(error.response?.data || error));
