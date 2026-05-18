const fs = require("fs");

const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  removeNSPrefix: true
});
const config = require("../../../config");

const axios = require("axios");

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

  return [
    ...asArray(dimensionList.Dimension),
    ...asArray(dimensionList.TimeDimension)
  ];
}

function extractCodelistRefFromDimension(dimension) {
  const enumeration = dimension?.LocalRepresentation?.Enumeration;
  const ref = enumeration?.Ref;

  if (!ref) return null;

  const codelistId = ref.id || ref.maintainableParentID;

  if (!codelistId) return null;

  return {
    agencyID: ref.agencyID || "ESTAT",
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

async function getDimensionCodelistMap(dataset, BASE) {
  const url = dataset

  const parsed = await fetchXml(url);
  const dataStructures = findDataStructures(parsed);

  const result = {};

  for (const dataStructure of dataStructures) {
    const dimensions = extractDimensionsFromDataStructure(dataStructure);

    for (const dimension of dimensions) {
      const dimensionId = dimension.id;

      if (!dimensionId) continue;

      const ref = extractCodelistRefFromDimension(dimension);

      if (!ref?.codelistId) continue;

      const info = {
        dimensionId,
        agencyID: ref.agencyID,
        codelistId: ref.codelistId,
        version: ref.version,
        url: buildCodelistUrl(BASE, ref)
      };

      result[dimensionId.toLowerCase()] = info;
    }
  }

  return result;
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

function enrichRow(row, dictionaries, dimensionMap) {
  const enriched = { ...row };

  for (const [dimension, code] of Object.entries(row)) {
    const codelistInfo = resolveCodelistForDimension(dimension, dimensionMap);

    if (!codelistInfo) continue;

    const dictionaryKey = getDictionaryKey(codelistInfo);
    const label = dictionaries[dictionaryKey]?.[code];

    if (!label) continue;

    enriched[`${dimension}_label`] = label;
  }

  return enriched;
}

function findDataSets(parsed) {
  const root = parsed.GenericData || parsed.StructureSpecificData || parsed.Message;

  const dataSet =
    root?.DataSet ||
    parsed?.GenericData?.DataSet ||
    parsed?.StructureSpecificData?.DataSet;

  return asArray(dataSet);
}

function parseGenericSdmxRows(parsed) {
  const rows = [];

  const dataSets = findDataSets(parsed);

  for (const dataSet of dataSets) {
    const seriesList = asArray(dataSet.Series);

    for (const series of seriesList) {
      const baseRow = {};

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
          if (!item.id || item.value === undefined) continue;
          row[item.id.toLowerCase()] = item.value;
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

        rows.push(row);
      }
    }
  }

  return rows;
}

async function fetchDatasetRows(dataset, filters = {}) {
  const filterPath = buildEurostatFilterPath(filters);

  const url = dataset //+ "/" + filterPath + "?format=SDMX-GenericData&detail=full";

  const parsed = await fetchXml(url);

  return parseGenericSdmxRows(parsed);
}

function buildEurostatFilterPath(filters) {
  //TODO temporary placeholder: implements if needed

  return "";
}

async function buildEurostatTranslator(dataset, BASE) {
  const dimensionMap = await getDimensionCodelistMap(dataset, BASE);
  const dictionaries = await loadDictionariesFromDimensionMap(dimensionMap);

  return {
    dataset,
    dimensionMap,
    dictionaries,

    translateRow(row) {
      return translateRow(row, dictionaries, dimensionMap);
    },

    enrichRow(row) {
      return enrichRow(row, dictionaries, dimensionMap);
    }
  };
}

async function main(dataset, datastructure, codelists, BASE) {
  try {
    const datasetCode = "NAMA_10R_3GDP";
    const translator = await buildEurostatTranslator(datastructure, BASE);
    const rows = await fetchDatasetRows(dataset);
    const enrichedRows = rows.map(row => translator.enrichRow(row));
    //const translatedRows = rows.map(row => translator.translateRow(row));
    console.log("Enriched rows 1 :\n", enrichedRows[0]);

    if (config.debug.writeParsedSdmx)
      fs.writeFileSync(
        "sdmx-parsed" + Date.now() + ".json",
        JSON.stringify(enrichedRows, null, 2),
        "utf8"
      );
  } catch (err) {
    console.error(err);
  }
}

module.exports = { main }