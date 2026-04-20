let config = require("./config")
const assets = require("./assets/assets")
const chai = require("chai")
const axios = require("axios")
let keycloak = require('./src/utils/keycloak')
const jwt = require('jsonwebtoken');
let authorization = require("./token")
let email
const FormData = require('form-data');
const fs = require('fs');
const multipartTestFile = fs.readFileSync('./assets/multipartTestFile.json', 'utf8');
let n = 1;

function errorHandler(error, name) {//TODO this should go in a utils or in a errorHanlder file
  try {
    fs.writeFileSync("./tests/" + name + " - errorResponse.json", JSON.stringify(JSON.parse(error.actual), null, 2))
    fs.writeFileSync("./tests/" + name + " - expectedResponse.json", JSON.stringify(JSON.parse(error.expected), null, 2))
  } catch (e) {
    console.log("Error writing error files:", e, error.actual, error.expected)
    console.error("Nothing written to error files")
    if (error.actual == undefined)
      error.actual = "undefined"
    fs.writeFileSync("./tests/" + name + " - errorResponse.json", error.actual)
    fs.writeFileSync("./tests/" + name + " - expectedResponse.json", error.expected == undefined ? "undefined" : JSON.stringify(JSON.parse(error.expected), null, 2))
    error.actual = "trucated because it is written to a errorResponse file"
    error.expected = "truncated because it is written to a expectedResponse file"
  }
  if (config.stopsTestsOnErrors)
    process.exit(1)
  throw error
}

function resetFolderSync(folderPath) {//TODO this should go in a utils 
  fs.rmSync(folderPath, { recursive: true, force: true });
  fs.mkdirSync(folderPath, { recursive: true });
}

async function handleJwtExpired(error) {//TODO this should go in a utils or in a errorHanlder file
  console.log("Handling JWT expiration")
  console.log(error)
  authorization = await keycloak.updateJWT()
  email = jwt.verify(authorization, config.authConfig.publicKey, { algorithms: ['RS256'] }).email
  console.log(email)
}

async function init() {
  try {
    email = jwt.verify(authorization, config.authConfig.publicKey, { algorithms: ['RS256'] }).email
    console.log(email)
  }
  catch (error) {
    await handleJwtExpired(error)
  }
}

function dmmRequestWithReport(name, body, exp) {
  it(
    name, async () => {
      let res = await axios.post(
        'http://localhost:' + config.httpPort + '/api/map/transform',
        body,
        { headers: { authorization } }
      )
      let expectedReport, actualReport
      if (exp[exp.length - 1].MAPPING_REPORT)
        expectedReport = exp.pop()
      if (res.data[res.data.length - 1].MAPPING_REPORT)
        actualReport = res.data.pop()
      let expected = JSON.stringify(exp)
      let actual = JSON.stringify(res.data)
      let originalExpected = exp
      let originalActual = res.data
      if (expected !== actual) {
        let idAndtypesExpected = originalExpected.map(e => {
          return { id: e.id, type: e.type }
        })
        let idAndtypesActual = originalActual.map(e => {
          return { id: e.id, type: e.type }
        })
        let nonNGSIexpected = originalExpected.map(e => {
          delete e.id
          delete e.type
          return e
        })
        let nonNGSIactual = originalActual.map(e => {
          delete e.id
          delete e.type
          return e
        })
        try {
          chai.assert.equal(
            JSON.stringify(idAndtypesActual),
            JSON.stringify(idAndtypesExpected)
          )
        } catch (error) {
          errorHandler(error, name + " - id and type comparison")
        }
        try {
          chai.assert.equal(
            JSON.stringify(nonNGSIactual),
            JSON.stringify(nonNGSIexpected)
          )
        } catch (error) {
          errorHandler(error, name + " - non NGSI data comparison")
        }
        try {
          if (actualReport?.MAPPING_REPORT?.Details)
            delete actualReport.MAPPING_REPORT.Details
          if (actualReport?.MAPPING_REPORT?.outputId)
            delete actualReport.MAPPING_REPORT.outputId
          /*if (actualReport.MAPPING_REPORT.Details.outputId)
            if (actualReport.MAPPING_REPORT.Details.errors)
              delete actualReport.MAPPING_REPORT.Details.outputId
            else
              delete actualReport.MAPPING_REPORT.Details*/
          if (body.config && body.config.mappingReport === false) {
            if (actualReport)
              chai.assert.equal(JSON.stringify(actualReport), JSON.stringify({ "Did not expect any report and this won't be present in response": true }))
          }
          else
            chai.assert.equal(
              JSON.stringify(actualReport),
              JSON.stringify(expectedReport)
            )
        } catch (error) {
          errorHandler(error, name + " - report comparison")
        }
      }
      else
        chai.assert.equal("ok", "ok")
    }
  );
}

function test5() {
  const formData = new FormData();
  formData.append('file', multipartTestFile);
  it(
    'Multipart test', async () => {
      let res = await axios.post(
        'http://localhost:' + config.httpPort + '/api/map/transform',
        formData,
        { headers: { authorization } }
      )
      try {
        chai.assert.equal(
          JSON.stringify(res.data[0]),
          JSON.stringify(assets.testMultiPartResponse)
        )
      }
      catch (error) {
        errorHandler(error, "05 Multipart test")
      }
    }
  );
}


function test8() {
  it(
    "Get object from minio", async () => {
      let res = await axios.get(
        'http://localhost:' + config.httpPort + '/api/minio/getObject/default/' + email + '%2FData model mapper%2Fsource.json',
        { headers: { authorization } }
      )
      try {
        chai.assert.equal(
          JSON.stringify(res.data),
          JSON.stringify(assets.testGetFromMinio)
        )
      }
      catch (error) {
        errorHandler(error, "08 Get object from minio")
      }
    }
  );
}

function test9() {
  it(
    "Get bearer", async () => {
      let res = await axios.get(
        'http://localhost:' + config.httpPort + '/api/bearer',
        { headers: { authorization: "Bearer " + authorization } }
      )
      try {
        chai.assert.equal(
          res.data,
          authorization
        )
      }
      catch (error) {
        errorHandler(error, "09 Get bearer")
      }
    }
  );
}

function test10() {
  const files = fs.readdirSync("./assets/tests/"); // blocca finché non ha finito
  console.log('Contenuto di', "./assets/tests/", ':');
  files.forEach(file => {
    /*if (require("./assets/tests/" + file).pre)
      require("./assets/tests/" + file).pre.then(() => dmmRequestWithReport(file, require("./assets/tests/" + file).body, require("./assets/tests/" + file).response))
    else*/
      dmmRequestWithReport(file, require("./assets/tests/" + file).body, require("./assets/tests/" + file).response)
  });
}

function runTest() {
  describe("test", async function () {
    resetFolderSync("./tests")
    n = 1;
    before(() => console.log("Testing started"));
    after(() => console.log("Testing finished"));
    beforeEach(() => console.log("Test ", n++));
    afterEach(() => console.log("Test ", n - 1, " finished"));
    test5()
    test8()
    test9()
    test10()
  }
  );
}

init().then(() => {
  runTest()
}).catch(async (error) => {
  await handleJwtExpired(error)
  runTest()
});
