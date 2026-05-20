const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  removeNSPrefix: true
});
const config = require("../../../config");
const defaultTimeLabel = "TIME_PERIOD"
const axios = require("axios");

const nuts = {
  "NUTS-2024": JSON.parse(fs.readFileSync('./lighterGeojson/lighter-NUTS_RG_60M_2024_3035.geojson', 'utf-8')),
  "NUTS-2021": JSON.parse(fs.readFileSync('./lighterGeojson/lighter-NUTS_RG_60M_2021_3035.geojson', 'utf-8')),
  "NUTS-2016": JSON.parse(fs.readFileSync('./lighterGeojson/lighter-NUTS_RG_60M_2016_3035.geojson', 'utf-8')),
  "NUTS-2013": JSON.parse(fs.readFileSync('./lighterGeojson/lighter-NUTS_RG_60M_2013_3035.geojson', 'utf-8')),
  "NUTS-2010": JSON.parse(fs.readFileSync('./lighterGeojson/lighter-NUTS_RG_60M_2010_3035.geojson', 'utf-8')),
  "NUTS-2006": JSON.parse(fs.readFileSync('./lighterGeojson/lighter-NUTS_RG_60M_2006_3035.geojson', 'utf-8')),
  "NUTS-2003": JSON.parse(fs.readFileSync('./lighterGeojson/lighter-NUTS_RG_20M_2003_3035.geojson', 'utf-8'))
};

if (global.test.writeParsedSdmx)
  config.debug.writeParsedSdmx = true;
if (global.test.sdmxCache)
  config.debug.sdmxCache = true;
if (global.test.writeParsedXml)
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
      console.log(`Using cached data for ${url}`);
      try {
        let json = JSON.parse(cached);
        return json
      }
      catch {
        return cached;
      }
    }
    console.log(`Fetching ${url}`);
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

async function getDatasetStructureInfo(dataset, BASE) {
  const url = dataset;

  const parsed = await fetchXml(url);
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

function enrichRow(row, dictionaries, dimensionMap, datasetInfo) {
  const enriched = { obs: { ...row }, dimensions: {}, translatedDimensions: [] };

  for (const [dimension, code] of Object.entries(row)) {
    const codelistInfo = resolveCodelistForDimension(dimension, dimensionMap);

    if (codelistInfo)
      enriched.translatedDimensions.push(dimension);
    else {
      enriched.dimensions[dimension] = code;
      continue;
    }

    const dictionaryKey = getDictionaryKey(codelistInfo);
    const label = dictionaries[dictionaryKey]?.[code];

    if (!label) continue;

    enriched.dimensions[dimension] = label;
  }

  let value = row.value;
  delete enriched.dimensions.value;
  delete enriched.obs.value;
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

  const dataSet = asArray(root?.DataSet)[0];

  const structureRef =
    dataSet?.structureRef ||
    dataSet?.dataflow ||
    dataSet?.Dataflow ||
    dataSet?.id;

  let info = parseDataflowRef(structureRef);

  if (!info.source) {
    info.source = parsed.GenericData?.Header.Sender.id || "ESTAT?";
  }

  if (!info.survey) {
    info.survey = fallbackDatasetCode?.toUpperCase() || parsed.GenericData?.Header.DataSetID || "Unknown dataset";
  }

  /*if (!info.name && info.survey) {
    info.name = info.survey || parsed.GenericData?.Header.DataSetID || "Unknown dataset";
  }*/

  info.timestamp = parsed.GenericData?.Header.Prepared || "Unknown timestamp";

  return info;
}

function parseGenericSdmxRows(parsed, enrichRow, timeDimensionId) {
  const rows = [];

  const datasetInfo = extractDatasetInfo(parsed);

  const dataSets = findDataSets(parsed);



  /*console.log(parsed)
  console.log(parsed.GenericData?.Header.Sender.id)
  console.log(parsed.GenericData?.Header.DataSetID)
  console.log(parsed.GenericData?.Header.Prepared)*/

  if (config.debug.writeParsedXml == true)
    fs.writeFileSync("./out_sdmx/parsedXml.json", JSON.stringify(parsed), "utf8");

  for (const dataSet of dataSets) {
    const seriesList = asArray(dataSet.Series);

    for (const series of seriesList) {
      const baseRow = {};
      //console.log({series, structure: parsed.GenericData?.Header.Structure})

      const seriesValues = asArray(series?.SeriesKey?.Value);

      for (const item of seriesValues) {
        if (!item.id || item.value === undefined) continue;
        baseRow[item.id.toLowerCase()] = item.value;
      }

      const observations = asArray(series.Obs);

      for (const obs of observations) {
        const row = { ...baseRow };

        const obsDimensions = asArray(obs?.ObsDimension);

        for (const item of obsDimensions) {
          if (item.value === undefined) continue;

          const key = (
            item.id ||
            timeDimensionId ||
            defaultTimeLabel
          ).toLowerCase();

          row[key] = item.value;
        }

        const obsValue = obs?.ObsValue?.value;

        if (obsValue !== undefined) {
          const num = Number(obsValue);
          row.value = Number.isNaN(num) ? obsValue : num;
        }

        const attributes = asArray(obs?.Attributes?.Value);

        for (const item of attributes) {
          if (!item.id || item.value === undefined) continue;
          row[item.id.toLowerCase()] = item.value;
        }

        rows.push(enrichRow(row, datasetInfo));
      }
    }
  }

  return rows;
}

async function fetchDatasetRows(dataset, filters = {}, enrichRow, timeDimensionId) {
  const url = dataset;

  const parsed = await fetchXml(url);

  return parseGenericSdmxRows(parsed, enrichRow, timeDimensionId);
}

function buildEurostatFilterPath(filters) {
  //TODO temporary placeholder: implements if needed

  return "";
}

async function buildEurostatTranslator(dataset, BASE) {
  const structureInfo = await getDatasetStructureInfo(dataset, BASE);
  const dictionaries = await loadDictionariesFromDimensionMap(structureInfo.dimensionMap);

  return {
    dataset,
    dimensionMap: structureInfo.dimensionMap,
    timeDimensionId: structureInfo.timeDimensionId,
    dictionaries,

    translateRow(row) {
      return translateRow(row, dictionaries, structureInfo.dimensionMap);
    },

    enrichRow(row, datasetInfo) {
      return enrichRow(row, dictionaries, structureInfo.dimensionMap, datasetInfo);
    }
  };
}

async function main(dataset, datastructure, codelists, BASE) {
  try {
    const datasetCode = "NAMA_10R_3GDP";
    const translator = await buildEurostatTranslator(datastructure, BASE);

    const rows = await fetchDatasetRows(
      dataset,
      null,
      translator.enrichRow,
      translator.timeDimensionId
    );
    //const enrichedRows = rows.map(row => translator.enrichRow(row));
    //const translatedRows = rows.map(row => translator.translateRow(row));
    console.log("Enriched rows 1 :\n", rows[0]);

    const example = {
      "region": "NUTS3",
      "source": "ESTAT",
      "timestamp": "2025-04-02T21:00:00.000Z",
      "survey": "DEMO_R_D3DENS",
      "dimensions": [
        "Annual",
        "Persons per square kilometre",
        "Trento",
        "2023"
      ],
      "value": 88.4
    }

    const actual = {
      geo: 'AL',
      unit: 'EUR_HAB',
      freq: 'A',
      value: 3100,
      geo_label: 'Albania',
      unit_label: 'Euro per inhabitant',
      freq_label: 'Annual'
    }
    if (config.debug.writeParsedSdmx)
      fs.writeFileSync(
        "./out_sdmx/" + rows[0].survey + ".json",
        JSON.stringify(rows, null, 2),
        "utf8"
      );

    //TODO implementare mapping verso formato coerente con db su VM
    //TODO return finalResult
  } catch (err) {
    console.error(err);
  }
}

module.exports = { main }