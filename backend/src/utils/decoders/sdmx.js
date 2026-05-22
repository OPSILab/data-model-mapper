const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");
const { SaxesParser } = require("saxes");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  removeNSPrefix: true
});
const config = require("../../../config");
const defaultTimeLabel = "TIME_PERIOD"
const axios = require("axios");
const Output = require('../../server/api/models/output');
const log = require('../logger')//.app(module);
const { Logger } = log
const logger = new Logger(__filename)

const nuts = {
  "NUTS-2024": JSON.parse(fs.readFileSync('./src/utils/decoders/lighterGeojson/lighter-NUTS_RG_60M_2024_3035.geojson', 'utf-8')),
  "NUTS-2021": JSON.parse(fs.readFileSync('./src/utils/decoders/lighterGeojson/lighter-NUTS_RG_60M_2021_3035.geojson', 'utf-8')),
  "NUTS-2016": JSON.parse(fs.readFileSync('./src/utils/decoders/lighterGeojson/lighter-NUTS_RG_60M_2016_3035.geojson', 'utf-8')),
  "NUTS-2013": JSON.parse(fs.readFileSync('./src/utils/decoders/lighterGeojson/lighter-NUTS_RG_60M_2013_3035.geojson', 'utf-8')),
  "NUTS-2010": JSON.parse(fs.readFileSync('./src/utils/decoders/lighterGeojson/lighter-NUTS_RG_60M_2010_3035.geojson', 'utf-8')),
  "NUTS-2006": JSON.parse(fs.readFileSync('./src/utils/decoders/lighterGeojson/lighter-NUTS_RG_60M_2006_3035.geojson', 'utf-8')),
  "NUTS-2003": JSON.parse(fs.readFileSync('./src/utils/decoders/lighterGeojson/lighter-NUTS_RG_20M_2003_3035.geojson', 'utf-8'))
};

if (global.test?.writeParsedSdmx)
  config.debug.writeParsedSdmx = true;
if (global.test?.sdmxCache)
  config.debug.sdmxCache = true;
if (global.test?.writeParsedXml)
  config.debug.writeParsedXml = true;

function getNuts(row) {
  const values = Object.values(row);
  const keys = Object.keys(nuts).sort().reverse();
  let year = ""

  for (const key of keys) {
    for (const value of values) {
      const match = nuts[key].filter(feature => feature.NUTS_ID === value);
      if (match) {
        if (match.length == 1) {
          if (match[0].LEVL_CODE && match[0].LEVL_CODE != '')
            return "NUTS" + match[0].LEVL_CODE + (year ? "(" + year + ")" : "");
          else
            return "NUTS" + match.map(m => m.LEVL_CODE).join("? or ") + (year ? "(" + year + ")" : "");
        }
      }
    }
    year = key.split("-")[1];
  }
  return "NON_NUTS?";
}

function clean(url) {
  for (let i = 0; i < url.length; i++) {
    const char = url[i];
    if (char === "/")
      url = url.substring(0, i) + "_slash_" + url.substring(i + 1);
    else if (char === ":")
      url = url.substring(0, i) + "_colon_" + url.substring(i + 1);
    else if (char === "?")
      url = url.substring(0, i) + "_question_" + url.substring(i + 1);
    else if (char === "&")
      url = url.substring(0, i) + "_amp_" + url.substring(i + 1);
    else if (char === "=")
      url = url.substring(0, i) + "_eq_" + url.substring(i + 1);
  }
  return url;
}

function recoverUrlFromCleaned(cleaned) {
  return cleaned
    .replace(/_slash_/g, "/")
    .replace(/_colon_/g, ":")
    .replace(/_question_/g, "?")
    .replace(/_amp_/g, "&")
    .replace(/_eq_/g, "=");
}

async function fetchText(url) {
  try {
    if (config.debug.sdmxCache && fs.existsSync(`./cachedData/${clean(url)}`)) {
      const cached = fs.readFileSync(`./cachedData/${clean(url)}`, "utf8");
      logger.info(`Using cached data for ${url}`);
      try {
        let json = JSON.parse(cached);
        return json
      }
      catch {
        return cached;
      }
    }
    logger.info(`Fetching ${url}`);
    const res = await axios.get(url, {
      responseType: "text"
    });
    if (config.debug.sdmxCache)
      fs.writeFileSync(`./cachedData/${clean(url)}`, res.data, "utf8");
    return res.data;

  }
  catch (err) {
    if (err.response)
      throw new Error(`Errore HTTP ${err.response.status}: ${url}`)
    throw err;
  }
}

async function fetchXml(url) {
  const xml = await fetchText(url);
  return parser.parse(xml);
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function findDataStructures(parsed) {
  const root = parsed.Structure;

  const dataStructures =
    root?.Structures?.DataStructures?.DataStructure;

  return asArray(dataStructures);
}

function extractDimensionsFromDataStructure(dataStructure) {
  const dimensionList = dataStructure?.DataStructureComponents?.DimensionList;

  if (!dimensionList) return [];

  const dimensions = asArray(dimensionList.Dimension).map(d => ({
    ...d,
    isTimeDimension: false
  }));

  const timeDimensions = asArray(dimensionList.TimeDimension).map(d => ({
    ...d,
    isTimeDimension: true
  }));

  return [
    ...dimensions,
    ...timeDimensions
  ];
}

function extractCodelistRefFromDimension(dimension) {
  const enumeration = dimension?.LocalRepresentation?.Enumeration;
  const ref = enumeration?.Ref;

  if (!ref) return null;

  const codelistId = ref.id || ref.maintainableParentID;

  if (!codelistId) return null;

  return {
    agencyID: ref.agencyID || "ESTAT?",
    codelistId,
    version: ref.version
  };
}

function buildCodelistUrl(BASE, { agencyID, codelistId, version }) {
  const versionPart = version ? `/${version}` : "";
  return `${BASE}/codelist/${agencyID}/${codelistId}${versionPart}?format=TSV`;
}

function getDictionaryKey(info) {
  return `${info.agencyID}:${info.codelistId}:${info.version || ""}`;
}

async function getDatasetStructureInfo(datastructureUrl, BASE) {

  if (!datastructureUrl)
    return null;

  const parsed = await fetchXml(datastructureUrl);
  const dataStructures = findDataStructures(parsed);

  const dimensionMap = {};
  let timeDimensionId = null;

  for (const dataStructure of dataStructures) {
    const dimensions = extractDimensionsFromDataStructure(dataStructure);

    for (const dimension of dimensions) {
      const dimensionId = dimension.id;

      if (!dimensionId) continue;

      if (dimension.isTimeDimension) {
        timeDimensionId = dimensionId;
      }

      const ref = extractCodelistRefFromDimension(dimension);

      if (!ref?.codelistId) continue;

      const info = {
        dimensionId,
        agencyID: ref.agencyID,
        codelistId: ref.codelistId,
        version: ref.version,
        url: buildCodelistUrl(BASE, ref)
      };

      dimensionMap[dimensionId.toLowerCase()] = info;
    }
  }

  return {
    dimensionMap,
    timeDimensionId
  };
}

function parseCodelistTsv(tsv) {
  const map = {};
  const lines = tsv.split(/\r?\n/).filter(line => line.trim());

  for (const line of lines) {
    const parts = line.split("\t").map(x => x.trim());

    if (parts.length < 2) continue;

    const code = parts[0];

    const lowerCode = code.toLowerCase();
    if (
      lowerCode === "code" ||
      lowerCode === "id" ||
      lowerCode.includes("codelist")
    ) {
      continue;
    }

    const label = parts.find((part, index) => index > 0 && part);

    if (!code || !label) continue;

    map[code] = label;
  }

  return map;
}

async function loadDictionariesFromDimensionMap(dimensionMap) {
  if (!dimensionMap)
    return null
  const dictionaries = {};
  const uniqueCodelists = new Map();

  for (const item of Object.values(dimensionMap)) {
    uniqueCodelists.set(getDictionaryKey(item), item);
  }

  for (const [key, item] of uniqueCodelists.entries()) {
    const tsv = await fetchText(item.url);
    dictionaries[key] = parseCodelistTsv(tsv);
  }

  return dictionaries;
}

function resolveCodelistForDimension(dimension, dimensionMap) {
  if (!dimensionMap)
    return null;
  return dimensionMap[dimension.toLowerCase()] || null;
}

function translateRow(row, dictionaries, dimensionMap) {
  const translated = { ...row };

  for (const [dimension, code] of Object.entries(row)) {
    const codelistInfo = resolveCodelistForDimension(dimension, dimensionMap);

    if (!codelistInfo) continue;

    const dictionaryKey = getDictionaryKey(codelistInfo);
    const label = dictionaries[dictionaryKey]?.[code];

    if (!label) continue;

    translated[dimension] = label;
  }

  return translated;
}

let writeLog = false

function enrichRow(row, dictionaries, dimensionMap, datasetInfo) {
  const enriched = { dimensions: [], obs: { ...row }, obsHR: {}, rawDimensions: [] };
  let logToWrite = ""

  for (const [dimension, code] of Object.entries(row)) {
    const codelistInfo = resolveCodelistForDimension(dimension, dimensionMap);
    let label;

    if (codelistInfo) {
      if (writeLog)
        logToWrite += `Dimension: ${dimension}, Code: ${code}\n`;
      const dictionaryKey = getDictionaryKey(codelistInfo);
      label = dictionaries[dictionaryKey]?.[code];
      if (!label)
        enriched.rawDimensions.push(dimension);
    }
    else if (dimension.toLowerCase() !== "value")
      enriched.rawDimensions.push(dimension);

    enriched.obsHR[dimension] = label || code;
    if (dimension.toLowerCase() !== "value")
      enriched.dimensions.push(label || code);
  }

  let value = row.value;
  delete enriched.obsHR.value;
  delete enriched.obs.value;
  if (writeLog)
    fs.writeFileSync("./out_sdmx/enrichmentLog.txt", logToWrite, "utf8");
  writeLog = false;
  return { region: getNuts(row), ...datasetInfo, ...enriched, value };
}

function findDataSets(parsed) {
  const root = parsed.GenericData || parsed.StructureSpecificData || parsed.Message;

  const dataSet =
    root?.DataSet ||
    parsed?.GenericData?.DataSet ||
    parsed?.StructureSpecificData?.DataSet;

  return asArray(dataSet);
}

function parseDataflowRef(value) {
  if (!value) return {};

  const match = String(value).match(/^([^:]+):([^(]+)(?:\(([^)]+)\))?$/);

  if (!match) {
    return {
      //dataflow: String(value)
    };
  }

  return {
    //dataflow: String(value),
    source: match[1],
    survey: match[2],
    dataflowVersion: match[3]
  };
}

function extractDatasetInfo(parsed, fallbackDatasetCode) {
  const root =
    parsed.GenericData ||
    parsed.StructureSpecificData ||
    parsed.Message ||
    parsed;

  const header = root?.Header;
  const dataSet = asArray(root?.DataSet)[0];

  const structureRef =
    dataSet?.structureRef ||
    dataSet?.dataflow ||
    dataSet?.Dataflow ||
    dataSet?.id;

  let info = parseDataflowRef(structureRef);

  if (!info.source) {
    info.source = header?.Sender?.id || "ESTAT?";
  }

  if (!info.survey) {
    info.survey =
      fallbackDatasetCode?.toUpperCase() ||
      header?.Structure?.StructureUsage?.Ref?.id ||
      header?.DataSetID ||
      "Unknown dataset";
  }

  /*if (!info.name && info.survey) {
    info.name = info.survey || header?.DataSetID || "Unknown dataset";
  }*/

  info.timestamp = header?.Prepared || "Unknown timestamp";

  return info;
}



const SKIP_DATASET_ATTRS = new Set(['structureRef', 'dataScope', 'type']);
const localName = name => name.includes(':') ? name.split(':')[1] : name;
const CHUNK_SIZE = 64 * 1024; 

function extractDatasetInfoFromHeader(headerFields, datasetAttrs) {
  const structureRef = datasetAttrs?.dataflow || datasetAttrs?.Dataflow || datasetAttrs?.id;
  let info = parseDataflowRef(structureRef);

  if (!info.source)
    info.source = headerFields?.Sender_id || "ESTAT?";

  if (!info.survey) {
    
    info.survey =
      headerFields?.Structure_StructureUsage_Ref_id ||
      headerFields?.DataSetID ||
      "Unknown dataset";
  }

  info.timestamp = headerFields?.Prepared || "Unknown timestamp";
  return info;
}

async function flushRows(rows, collectedOutput, id, part) {
  
  const snapshot = rows.splice(0, config.batch);
  if (config.sessionLocation.mongo) {
    if (!collectedOutput)
      logger.warn("No collectedOutput available, cannot save batch of rows to MongoDB");
    else
      await collectedOutput.insertMany(snapshot);
  }
  if (config.sessionLocation.filesystem) {
    if (!fs.existsSync('./output/' + id + '/'))
      fs.mkdirSync('./output/' + id + '/', { recursive: true });
    fs.writeFileSync('./output/' + id + '/' + part + '.json', JSON.stringify(snapshot), 'utf8');
  }
  logger.debug(snapshot.length + " Datapoints salvati nel database.");
}

async function parseGenericSdmxRows(buffer, enrichRowFn, timeDimensionId, collectedOutput, id) {
  return new Promise(async (resolve, reject) => {
    const saxParser = new SaxesParser({ xmlns: false });
    let rows = [], part = 1;
    let inSeriesKey = false, currentSeriesKey = {};
    let inObs = false, currentObs = {};
    let inHeader = false, headerPath = [], headerFields = {};
    let datasetAttrs = {};
    let datasetInfo = null;
    let inSender = false;

    saxParser.on('opentag', node => {
      const n = localName(node.name);

      if (n === 'Header') { inHeader = true; return; }
      if (inHeader) {
        headerPath.push(n);
        for (const [k, v] of Object.entries(node.attributes))
          headerFields[n + '_' + k] = v;
        return;
      }
      if (n === 'DataSet') { datasetAttrs = node.attributes; return; }
      if (n === 'SeriesKey') { inSeriesKey = true; currentSeriesKey = {}; return; }
      if (n === 'Value' && inSeriesKey) {
        if (node.attributes.id)
          currentSeriesKey[node.attributes.id.toLowerCase()] = node.attributes.value ?? node.attributes.value;
        return;
      }
      if (n === 'Obs') { inObs = true; currentObs = { ...currentSeriesKey }; return; }
      if (inObs) {
        if (n === 'ObsDimension') {
          const key = (node.attributes.id || timeDimensionId || 'time_period').toLowerCase();
          currentObs[key] = node.attributes.value;
        } else if (n === 'ObsValue') {
          const v = node.attributes.value;
          currentObs.value = isNaN(Number(v)) ? v : Number(v);
        } else if (n === 'Attributes') {
        } else {
          const attrs = node.attributes;
          if (attrs.id && attrs.value !== undefined)
            currentObs[attrs.id.toLowerCase()] = attrs.value;
        }
      }
    });

    saxParser.on('closetag', node => {
      const n = localName(node.name);
      if (n === 'Header') {
        inHeader = false;
        headerPath = [];
        datasetInfo = extractDatasetInfoFromHeader(headerFields, datasetAttrs);
        return;
      }
      if (inHeader) { headerPath.pop(); return; }
      if (n === 'SeriesKey') { inSeriesKey = false; return; }
      if (n === 'Series') { currentSeriesKey = {}; return; }
      if (n === 'Obs') {
        if (datasetInfo) rows.push(enrichRowFn({ ...currentObs }, datasetInfo));
        inObs = false; currentObs = {};
      }
    });

    saxParser.on('text', text => {
      const t = text.trim();
      if (!t || !inHeader || !headerPath.length) return;
      headerFields[headerPath[headerPath.length - 1]] = t;
    });

    saxParser.on('error', reject);

    try {
      const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
      for (let i = 0; i < buf.length; i += CHUNK_SIZE) {
        saxParser.write(buf.slice(i, i + CHUNK_SIZE).toString('utf8'));
        if (rows.length > config.batch) {
          await flushRows(rows, collectedOutput, id, part++);
        }
      }
      saxParser.close();
      if (rows.length > 0) await flushRows(rows, collectedOutput, id, part++);
      resolve();
    } catch (err) { reject(err); }
  });
}

async function parseStructureSpecificRows(buffer, enrichRowFn, timeDimensionId, collectedOutput, id) {
  return new Promise(async (resolve, reject) => {
    const saxParser = new SaxesParser({ xmlns: false });
    let rows = [], part = 1;
    let currentSeriesAttrs = null;
    let inHeader = false, headerPath = [], headerFields = {};
    let datasetAttrs = {};
    let datasetInfo = null;

    saxParser.on('opentag', node => {
      const n = localName(node.name);

      if (n === 'Header') { inHeader = true; return; }
      if (inHeader) {
        headerPath.push(n);
        for (const [k, v] of Object.entries(node.attributes))
          headerFields[n + '_' + k] = v;
        return;
      }
      if (n === 'DataSet') { datasetAttrs = node.attributes; return; }

      if (n === 'Series') {
        currentSeriesAttrs = {};
        for (const [k, v] of Object.entries(node.attributes)) {
          if (!SKIP_DATASET_ATTRS.has(k))
            currentSeriesAttrs[k.toLowerCase()] = v;
        }
        return;
      }

      if (n === 'Obs' && currentSeriesAttrs) {
        const row = { ...currentSeriesAttrs };
        for (const [k, v] of Object.entries(node.attributes)) {
          if (SKIP_DATASET_ATTRS.has(k)) continue;
          if (k === 'OBS_VALUE') row.value = isNaN(Number(v)) ? v : Number(v);
          else row[k.toLowerCase()] = v;
        }
        if (datasetInfo) rows.push(enrichRowFn(row, datasetInfo));
      }
    });

    saxParser.on('closetag', node => {
      const n = localName(node.name);
      if (n === 'Header') {
        inHeader = false;
        headerPath = [];
        datasetInfo = extractDatasetInfoFromHeader(headerFields, datasetAttrs);
        return;
      }
      if (inHeader) { headerPath.pop(); return; }
      if (n === 'Series') currentSeriesAttrs = null;
    });

    saxParser.on('text', text => {
      const t = text.trim();
      if (!t || !inHeader || !headerPath.length) return;
      headerFields[headerPath[headerPath.length - 1]] = t;
    });

    saxParser.on('error', reject);

    try {
      const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
      for (let i = 0; i < buf.length; i += CHUNK_SIZE) {
        saxParser.write(buf.slice(i, i + CHUNK_SIZE).toString('utf8'));
        if (rows.length > config.batch) {
          await flushRows(rows, collectedOutput, id, part++);
        }
      }
      saxParser.close();
      if (rows.length > 0) await flushRows(rows, collectedOutput, id, part++);
      resolve();
    } catch (err) { reject(err); }
  });
}

async function fetchDatasetRows(dataset, filters = {}, enrichRow, timeDimensionId, collectedOutput, id) {
  const buf = Buffer.isBuffer(dataset) ? dataset : Buffer.from(dataset);
  const sniff = buf.slice(0, 512).toString('utf8');
  const isStructureSpecific = sniff.includes('StructureSpecificData');

  if (isStructureSpecific) {
    await parseStructureSpecificRows(buf, enrichRow, timeDimensionId, collectedOutput, id);
  } else {
    await parseGenericSdmxRows(buf, enrichRow, timeDimensionId, collectedOutput, id);
  }
}

function buildEurostatFilterPath(filters) {
  //TODO temporary placeholder: implements if needed

  return "";
}

async function buildEurostatTranslator(datastructure, BASE) {
  let structureInfo, dictionaries;
  try {
    structureInfo = await getDatasetStructureInfo(datastructure, BASE);
    dictionaries = await loadDictionariesFromDimensionMap(structureInfo?.dimensionMap);
  }
  catch (err) {
    logger.error("Errore durante la costruzione del traduttore Eurostat:", err);
    structureInfo = null;
    dictionaries = null;
  }

  return {
    timeDimensionId: structureInfo?.timeDimensionId,
    dictionaries,
    enrichRow(row, datasetInfo) {
      return enrichRow(row, dictionaries, structureInfo?.dimensionMap, datasetInfo);
    }
  };
}

async function tryEurostatFlow(dataset, BASE, fromUrl) {
  const survey = fromUrl.split("data/")[1].split("?")[0];
  if (!BASE)
    BASE = fromUrl.split("/data/")[0]
  const dataStructureUrl = `${BASE}/dataflow/ESTAT/${survey}/1.0?detail=referencepartial&references=descendants`;
  logger.debug({ BASE, dataStructureUrl })
  return { BASE, dataStructureUrl }
}


async function sdmxDecoder(dataset, datastructure, codelists, BASE, fromUrl, id) {
  const collectedOutput = config.sessionLocation.mongo ? Output(id) : null;
  try {
    if (!datastructure && config.decodeOptions.sdmxTryEurostatFlow) {
      const info = await tryEurostatFlow(dataset, BASE, fromUrl);
      if (info) {
        datastructure = info.dataStructureUrl;
        if (!BASE)
          BASE = info.BASE;
      }
      else 
        logger.info("Impossible to retrieve dataflow info from Eurostat. Proceeding without it");
    }
    const translator = await buildEurostatTranslator(datastructure, BASE);
    await fetchDatasetRows(
      dataset,
      null,
      translator.enrichRow,
      translator.timeDimensionId,
      collectedOutput,
      id
    );

    return [{ id }];
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

module.exports = sdmxDecoder 