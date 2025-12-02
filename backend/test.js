let config = require("./config")
const assets = require("./assets/assets")
const example_1 = require("./assets/example_1")
const example_2 = require("./assets/example_2")
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
  //console.error({ status: error.response.status, data: error.response.data })
  //console.error("ERROR\nactual\n", JSON.parse(error.actual), "\nexpected\n", JSON.parse(error.expected))
  //console.error(JSON.parse(error.actual))
  fs.writeFileSync("./tests/" + name + " - errorResponse.json", JSON.stringify(JSON.parse(error.actual), null, 2))
  fs.writeFileSync("./tests/" + name + " - expectedResponse.json", JSON.stringify(JSON.parse(error.expected), null, 2))
  error.actual = "trucated because it is written to a errorResponse file"
  error.expected = "truncated because it is written to a expectedResponse file"
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

function dmmRequest(name, body, expected) {
  it(
    name, async () => {
      let res = await axios.post(
        'http://localhost:' + config.httpPort + '/api/map/transform',
        body,
        { headers: { authorization } }
      )
      try {
        res.data.pop()
        chai.assert.equal(
          JSON.stringify(res.data),
          JSON.stringify(expected)
        )
      }
      catch (error) {
        errorHandler(error, name)
      }
    }
  );
}
function dmmRequestWithReport(name, body, expected) {
  it(
    name, async () => {
      let res = await axios.post(
        'http://localhost:' + config.httpPort + '/api/map/transform',
        body,
        { headers: { authorization } }
      )
      try {
        chai.assert.equal(
          JSON.stringify(res.data),
          JSON.stringify(expected)
        )
      }
      catch (error) {
        errorHandler(error, name)
      }
    }
  );
}
function test1() {//TODO modify code to accept also the swapped id and type test values
  it(
    'Example test', async () => {
      let configTmp = config.sourceDataPath
      config.sourceDataPath = "assets/"
      let res
      try {
        res = await axios.post(
          'http://localhost:' + config.httpPort + '/api/map/transform',
          {
            sourceDataType: "csv",
            sourceData: "Field 1;Field 2;Field 3 index 0;Field 3 index 1;Field 31;Field 32;Field 33;Field 4a;Field 4b;Field 4c index 0;Field 4c index 1;Field 4d;Field 5;Field 6;Field 7\r\n[Field 1 value 1,Field 1 value 2];[Field 2 value 1,Field 2 value 2];Field 3 value 1;Field 3 value 2;[{Field 31a : Field 31a, Field 31b : Field 31b }];32;33; [Field 4a value 1,Field 4a value 2];[Field 4b value 1,Field 4b value 2];Field 4c value 1;Field 4c value 1;[{Field 4da : Field 4da, Field 4db : Field 4db }, {Field 4da1 : Field 4da1, Field 4db1 : Field 4db1 }];5;6;7",
            mapData: {
              "Field 1": "Field 1",
              "Field 2": "Field 2",
              "Field 3": [
                "Field 3 index 0",
                "Field 3 index 1"
              ],
              "Field 31": "Field 31",
              "Field 32": "Field 33",
              "Field 33": "Field 33",
              "Field 4": {
                "Field 4a": "Field 4a",
                "Field 4b": "Field 4b",
                "Field 4c": [
                  "Field 4c index 0",
                  "Field 4c index 1"
                ],
                "Field 4d": "Field 4d"
              },
              "Field 5": "Field 5",
              "Field 6": "Field 6",
              "Field 7": "Field 7",
              "entitySourceId": [
                "static:ExampleDataModel"
              ],
              "targetDataModel": "ExampleDataModel"
            },
            dataModelIn: "ExampleDataModel",
            config: {
              delimiter: ";",
              NGSI_entity: true
            }
          },
          { headers: { authorization } }
        )
      }
      catch (error) {
        console.log({ status: error.response.status, data: error.response.data })
        throw error
      }
      try {
        chai.assert.equal(
          JSON.stringify(res.data[0]),
          JSON.stringify(assets.sample(email))
        )
      }
      catch (error) {
        console.log(JSON.parse(error.actual)["Field 4"]["Field 4d"])
        console.log(JSON.parse(error.expected)["Field 4"]["Field 4d"])
        errorHandler(error, "01 Example test")
      }
      config.sourceDataPath = configTmp
    }
  );
}
function test2() {
  it(
    'Non Fiware NGSI data model test', async () => {
      //config.NGSI_entity=false;
      let res = await axios.post(
        'http://localhost:' + config.httpPort + '/api/map/transform',
        {
          sourceDataType: "csv",
          sourceData: assets.source_non_ngsi,
          mapData: assets.map_non_ngsi,
          dataModel: assets.sample_schema_non_ngsi,
          config: { NGSI_entity: false }
        },
        { headers: { authorization } }
      )
      try {
        chai.assert.equal(
          JSON.stringify(res.data[0]),
          JSON.stringify(assets.sample_non_ngsi)
        )
      }
      catch (error) {
        errorHandler(error, "02 Non Fiware NGSI data model test")
      }
    }
  );
}
function test3() {
  it(
    'Example test - geojson', async () => {
      //config.NGSI_entity=true;
      let res = await axios.post(
        'http://localhost:' + config.httpPort + '/api/map/transform',
        example_1.test,
        { headers: { authorization } }
      )
      try {
        res.data.pop() // remove last element which is the report
        chai.assert.equal(
          JSON.stringify(res.data),
          JSON.stringify(assets.example_1_full(email))
        )
      }
      catch (error) {
        errorHandler(error, "03 Example test - geojson")
      }
    }
  );
}
function test4() {
  it(
    'Example test - geojson 2', async () => {
      //config.NGSI_entity=true;
      let res = await axios.post(
        'http://localhost:' + config.httpPort + '/api/map/transform',
        example_2.test,
        { headers: { authorization } }
      )
      try {
        chai.assert.equal(
          JSON.stringify(res.data[0]),
          JSON.stringify(assets.example_2(email))
        )
      }
      catch (error) {
        errorHandler(error, "04 Example test - geojson 2")
      }
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
function test6() {
  dmmRequest('MinIO test', assets.testSourceFromMinioBody, assets.testSourceFromMinioResponse)
}
// Test with source data from MinIO and data model from db
function test7() {
  dmmRequestWithReport('Test with orionWriter disabled by request', assets.bodyTestOrionWriterDisabledByRequest, assets.responseTestOrionWriterDisabledByRequest)
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
    //console.log("Test ", n++)
    dmmRequestWithReport(file, require("./assets/tests/" + file).body, require("./assets/tests/" + file).response)
    //console.log("Test ", n - 1, " finished")
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

    test1()
    test2()
    test3()
    test4()
    test5()
    test6()
    test7()
    test8()
    test9()
    test10()
    /* 
     * Switching from v2 protocol and v1 protocol caused the print of id in response. I have to check if id can be printed without changing that value. Here
     * I can not test the correct id pattern for the moment but after all tests (also Postman's) have passed I will check also the id pattern in the tests.
    */
  }
  );
}

init().then(() => {
  runTest()
}).catch(async (error) => {
  await handleJwtExpired(error)
  runTest()
});
