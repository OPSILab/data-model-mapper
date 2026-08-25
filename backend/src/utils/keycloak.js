const axios = require("axios");
const config = require("../../config.js")
const keycloakBaseUrl = "http://localhost:8080/realms/smartera";
const { clientId, username, password } = config.authConfig;
const fs = require('fs');
const nodePath = require('path');
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
    // token.js is a module, so anyone who already required it holds the OLD string in
    // require.cache: rewriting the file does not reach them. Drop the cache entry here, where the
    // file changes, so the next require() rereads from disk.
    // Note the asymmetry: writeFileSync resolves './token.js' against the process cwd, while
    // require.resolve would resolve it against THIS file's directory. Going through an absolute
    // path makes both point at the same file, otherwise the delete silently misses its target.
    try {
        delete require.cache[require.resolve(nodePath.resolve(path))];
    } catch (error) {
        console.log("Could not invalidate the require cache for " + path + ", a stale token may survive in memory: " + error.message);
    }
    return response.data.access_token;
}

module.exports = { updateJWT };
//getJWT().then(token => console.log("Token saved to " + path)).catch(error => console.error(error.response?.data || error));

//getJWT().then(token => console.log(token)).catch(error => console.error(error.response?.data || error));
