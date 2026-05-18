let config = require("./config")
const assets = require("./assets/assets")
const axios = require("axios")
let keycloak = require('./src/utils/keycloak')
const jwt = require('jsonwebtoken');
let authorization = require("./token")
let email
const FormData = require('form-data');
const fs = require('fs');
const multipartTestFile = fs.readFileSync('./assets/multipartTestFile.json', 'utf8');
let n = 1;
let errors = 0;
let successes = 0;
function equal(a, b) {
  console.assert(a == b, "Expected:", b, "\nActual:", a)
  if (a !== b) {
    errors++
    throw { expected: b, actual: a, message: "Expected and actual values are different"}
  }
  successes++
  return a == b
}

function minify(str) {
  if (typeof str !== "string")
    str = JSON.stringify(str)
  if (str.length <= 200)
    return str
  return str.substring(0, 100) + "..." + str.substring(str.length - 100)
}

function errorHandler(error, name) {//TODO this should go in a utils or in a errorHanlder file
  try {
    fs.writeFileSync("./tests/" + name + " - errorResponse.json", error.actual ? JSON.stringify(JSON.parse(error.actual), null, 2) : JSON.stringify({ message: error.message }))
    fs.writeFileSync("./tests/" + name + " - expectedResponse.json", error.expected ? JSON.stringify(JSON.parse(error.expected), null, 2) : "no expected")
    console.error(minify(error.actual), minify(error.expected), error.message)
  } catch (e) {
    console.log("Error writing error files:", e, error?.actual || "no actual", error?.expected || "no expected")
    console.error("Nothing written to error files")
    if (error.actual == undefined)
      error.actual = "undefined"
    fs.writeFileSync("./tests/" + name + " - errorResponse.json", error.message ? JSON.stringify({ message: error.message }) : error.actual)
    fs.writeFileSync("./tests/" + name + " - expectedResponse.json", error.expected ? JSON.stringify(error.expected, null, 2) : "no expected")
    error.actual = "trucated because it is written to a errorResponse file"
    error.expected = "truncated because it is written to a expectedResponse file"
    console.error(minify(error.actual), minify(error.expected), error.message)
  }
  if (config.stopsTestsOnErrors)
    process.exit(1)
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

async function dmmRequestWithReport(name, body, exp) {

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
      equal(
        JSON.stringify(idAndtypesActual),
        JSON.stringify(idAndtypesExpected)
      )
    } catch (error) {
      errorHandler({ actual: error.actual || idAndtypesActual, expected: error.expected || idAndtypesExpected, message: error.message }, name + " - id and type comparison")
    }
    try {
      equal(
        JSON.stringify(nonNGSIactual),
        JSON.stringify(nonNGSIexpected)
      )
    } catch (error) {
      errorHandler({ actual: error.actual || nonNGSIactual, expected: error.expected || nonNGSIexpected, message: error.message }, name + " - non NGSI data comparison")
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
          equal(JSON.stringify(actualReport), JSON.stringify({ "Did not expect any report and this won't be present in response": true }))
      }
      else
        equal(
          JSON.stringify(actualReport),
          JSON.stringify(expectedReport)
        )
    } catch (error) {
      errorHandler({ actual: error.actual || actualReport || error.message, expected: error.expected || expectedReport, message: error.message }, name + " - report comparison")
    }
  }
  else
    equal("ok", "ok")
}

async function test5() {
  const formData = new FormData();
  formData.append('file', multipartTestFile);
  let res = await axios.post(
    'http://localhost:' + config.httpPort + '/api/map/transform',
    formData,
    { headers: { authorization } }
  )
  try {
    equal(
      JSON.stringify(res.data[0]),
      JSON.stringify(assets.testMultiPartResponse)
    )
  }
  catch (error) {
    errorHandler({ actual: error.actual || res.data[0] || error.message, expected: error.expected || assets.testMultiPartResponse, message: error.message }, "05 Multipart test")
  }
}


async function test8() {
  let res = await axios.get(
    'http://localhost:' + config.httpPort + '/api/minio/getObject/default/' + email + '%2FData model mapper%2Fsource.json',
    { headers: { authorization } }
  )
  try {
    equal(
      JSON.stringify(res.data),
      JSON.stringify(assets.testGetFromMinio)
    )
  }
  catch (error) {
    errorHandler({ actual: error.actual || res.data || error.message, expected: error.expected || assets.testGetFromMinio, message: error.message }, "08 Get object from minio")
  }
}

async function test9() {

  let res = await axios.get(
    'http://localhost:' + config.httpPort + '/api/bearer',
    { headers: { authorization: "Bearer " + authorization } }
  )
  try {
    equal(
      res.data,
      authorization
    )
  }
  catch (error) {
    errorHandler({ actual: error.actual || res.data || error.message, expected: error.expected || authorization, message: error.message }, "09 Get bearer")
  }
}

async function test10() {
  const files = fs.readdirSync("./assets/tests/"); // blocca finché non ha finito
  console.log('Contenuto di', "./assets/tests/", ':');
  for (let file of files){
    try {
      if (require("./assets/tests/" + file).pre)
        await require("./assets/tests/" + file).pre()
      await dmmRequestWithReport(file, require("./assets/tests/" + file).body, require("./assets/tests/" + file).response)
    } catch (error) {
      errors++
      errorHandler({ actual: error.actual || error.message, expected: error.expected || require("./assets/tests/" + file).response, message: error.message }, file + " - pre test")
    }
    console.log("Test 10 - ", files.indexOf(file))
  }
}

async function runTest() {
  resetFolderSync("./tests")
  n = 1;
  console.log("Testing started")
  console.log("Test ", n++)
  try {
    await test5()
  } catch (error) {
    errors++
    errorHandler(error, "05 Multipart test")
  }
  console.log("Test ", n - 1, " finished")
  console.log("Test ", n++)
  try {
    await test8()
  } catch (error) {
    errors++
    errorHandler(error, "08 Get object from minio")
  }
  console.log("Test ", n - 1, " finished")
  console.log("Test ", n++)
  try {
    await test9()
  } catch (error) {
    errors++
    errorHandler(error, "09 Get bearer")
  }
  console.log("Test ", n - 1, " finished")
  console.log("Test ", n++)
  await test10()
  console.log("Test ", n - 1, " finished")
  console.log("Testing finished")
  console.log("Total successes:", successes)
  console.log("Total errors:", errors)
}

init().then(async () => {
  await runTest()
}).catch(async (error) => {
  await handleJwtExpired(error)
  resetFolderSync("./tests")
  n = 1;
  await runTest()
});
