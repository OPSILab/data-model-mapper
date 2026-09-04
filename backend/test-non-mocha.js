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
  if (a != b) {
    if (typeof a === "string" && typeof b === "string") {
      let aJson, bJson
      try {
        aJson = JSON.parse(a)
      } catch (e) {
        aJson = null
      }
      try {
        bJson = JSON.parse(b)
      } catch (e) {
        bJson = null
      }
      if (aJson && bJson) {
        aId = aJson.id
        aType = aJson.type
        bId = bJson.id
        bType = bJson.type
        if (aId || bId) {
          console.assert(aId == bId, "Expected:", bId, "\nActual:", aId)
          errors++
          throw { expected: bId, actual: aId, message: "Expected and actual values are different" }
        }
        if (aType || bType) {
          console.assert(aType == bType, "Expected:", bType, "\nActual:", aType)
          errors++
          throw { expected: bType, actual: aType, message: "Expected and actual values are different" }
        }
      }
      if (aJson && !bJson || !aJson && bJson) {
        console.error("One of the values is not a valid JSON string", a, b)
        errors++
        throw { expected: b, actual: a, message: "One of the values is not a valid JSON string" }
      }
    }

  }
  console.assert(a == b, "Expected:", b, "\nActual:", a)
  if (a !== b) {
    errors++
    throw { expected: b, actual: a, message: "Expected and actual values are different" }
  }
  successes++
  return a == b
}

function minify(str) {
  if (typeof str !== "string")
    str = JSON.stringify(str)
  if (!str || str.length <= 200)
    return str
  return str.substring(0, 100) + "..." + str.substring(str.length - 100)
}

function stringify(obj) {
  try {
    return JSON.stringify(obj, null, 2)
  }
  catch (e) {
    return obj.toString()
  }
}

function parse(str) {
  try {
    return JSON.parse(str)
  }
  catch (e) {
    return str
  }
}

/* An axios failure carries the server's explanation in error.response.data, while
 * error.message is only "Request failed with status code NNN". Without this the
 * errorResponse files record the status code and throw away the actual cause.
 */
function serverError(error) {
  const data = error?.response?.data
  if (data === undefined || data === null || data === '')
    return undefined
  const status = error.response.status
  return { httpStatus: status, serverResponse: data, message: error.message }
}

function errorHandler(error, name) {//TODO this should go in a utils or in a errorHanlder file
  try {
    fs.writeFileSync("./tests/" + name + " - errorResponse.json", error.actual ? stringify(parse(error.actual), null, 2) : stringify({ message: error.message }))
    fs.writeFileSync("./tests/" + name + " - expectedResponse.json", error.expected ? stringify(parse(error.expected), null, 2) : "no expected")
    console.error(minify(error.actual), minify(error.expected), error.message)
  } catch (e) {
    console.log("Error writing error files:", e, error?.actual || "no actual", error?.expected || "no expected")
    console.error("Nothing written to error files")
    if (error.actual == undefined)
      error.actual = "undefined"
    fs.writeFileSync("./tests/" + name + " - errorResponse.json", error.message ? stringify({ message: error.message }) : error.actual)
    fs.writeFileSync("./tests/" + name + " - expectedResponse.json", error.expected ? stringify(error.expected, null, 2) : "no expected")
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

// A 401/403 from the backend means the token is no longer accepted, not that the mapping is wrong.
// Without telling the two apart, a token expiring mid-suite turns every remaining file into a
// failure that reads exactly like a mapping bug.
function isAuthFailure(error) {
  const status = error?.response?.status || error?.httpStatus
  return status === 401 || status === 403
}

async function handleJwtExpired(error) {//TODO this should go in a utils or in a errorHanlder file
  console.log("Handling JWT expiration")
  console.log(error)
  authorization = await keycloak.updateJWT()
  let emailUpdated = false
  //let error
  for (let key of config.authConfig.publicKeys)
    try {
      email = jwt.verify(authorization, key, { algorithms: ['RS256'] }).email
      emailUpdated = true
    }
    catch (e) {
      console.log("JWT verification failed with public key", key, ":", e.message)
      error = e
    }
  if (!emailUpdated){
    console.error("JWT verification failed with all public keys")
    console.error(error)
    console.error("now closing the test suite because the JWT is not valid")
    process.exit(1)
  }
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
      errorHandler({ actual: error.actual || serverError(error) || actualReport || error.message, expected: error.expected || expectedReport, message: error.message }, name + " - report comparison")
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
    errorHandler({ actual: error.actual || serverError(error) || res.data[0] || error.message, expected: error.expected || assets.testMultiPartResponse, message: error.message }, "05 Multipart test")
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
    errorHandler({ actual: error.actual || serverError(error) || res.data || error.message, expected: error.expected || assets.testGetFromMinio, message: error.message }, "08 Get object from minio")
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
    errorHandler({ actual: error.actual || serverError(error) || res.data || error.message, expected: error.expected || authorization, message: error.message }, "09 Get bearer")
  }
}

async function test10() {
  const files = fs.readdirSync("./assets/tests/"); // blocca finché non ha finito
  console.log('Contenuto di', "./assets/tests/", ':');
  for (let file of files) {
    // One retry per file, and only for an auth failure: the token gets refreshed and the file is
    // replayed once. Anything else, or a second auth failure in a row, is reported as before.
    // The counter is advanced ONLY by the for header. Incrementing it inside the body too made
    // `continue` skip a step, so the retry never ran and the catch below never reported anything:
    // the file vanished from the results instead of failing. Same trap as a "retried" flag.
    const maxAttempts = 2
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        let pre = require("./assets/tests/" + file).pre
        if (pre) {
          console.log("Running pre test for", file)
          // pre() is async and seeds the DB with the map/source/dataModel this test then
          // references by id. Without await the transform below races it, and a rejection
          // inside pre() never reaches the catch: it becomes an unhandled rejection, which
          // takes the whole suite down instead of failing this one file.
          await pre()
          console.log("Pre test for", file, "finished")
        }
        await dmmRequestWithReport(file, require("./assets/tests/" + file).body, require("./assets/tests/" + file).response)
        break
      } catch (error) {
        // attempt is 1-based, so this reads "there is still an attempt left". With a 0-based
        // counter it would have to be maxAttempts - 1, and getting that wrong means the last
        // auth failure exits the loop without ever reaching the errorHandler.
        if (isAuthFailure(error) && attempt < maxAttempts) {
          console.log("Auth rejected while running", file, "- refreshing the token and retrying once")
          await handleJwtExpired(error)
          // The asset modules captured the old token at require time, so drop them too: the
          // refresh rewrote token.js, but their own copy would survive in require.cache.
          for (const cached of Object.keys(require.cache))
            if (cached.includes("assets" + require("path").sep + "tests"))
              delete require.cache[cached]
          continue
        }
        errors++
        errorHandler({ actual: error.actual || serverError(error) || error.message, expected: error.expected || require("./assets/tests/" + file).response, message: error.message }, file + " - pre test")
        break
      }
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
