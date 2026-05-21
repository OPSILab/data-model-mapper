const xlsx = require("xlsx");
const fs = require("fs");
const NUTS_XLSX = process.test ? "./nuts.xlsx" : "./src/utils/decoders/nuts.xlsx";
const config = require("../../../config");
const log = require('../logger')
const { Logger } = log
const logger = new Logger(__filename)
const Datapoints = require('./Datapoint');
const Output = require('../../server/api/models/output');
const translations = load8thPage()
const nutsMap = loadNutsMap();
//const firstPageMap = require("./nutsMap.js");
const idx = buildIndexes(nutsMap);
console.log("built indexes")

function buildIndexes(map) {
  const exact = new Map();
  const lower = new Map();
  const parts = new Map();

  for (const key in map) {
    const name = map[key].name;
    const level = map[key].level;
    const nuts = "NUTS" + level;

    const lowerName = name.toLowerCase();

    exact.set(name, nuts);
    lower.set(lowerName, nuts);

    const splitParts = name.split("/");

    for (let i = 0; i < splitParts.length; i++) {
      const part = splitParts[i];
      parts.set(part, nuts);
      parts.set(part.toLowerCase(), nuts);
    }
  }

  return { exact, lower, parts };
}

const stats = {
  total: 0,
  cacheHit: 0,
  cacheMiss: 0,
  originalHit: 0,
  translationHit: 0,
  notFound: 0
};

const codeFoundCache = new Map();

function dimensionsCacheKey(dimensions) {
  let key = "";

  for (const k in dimensions) {
    const value = dimensions[k];
    if (value == null) continue;
    key += k + "=" + value + "|";
  }

  return key;
}

function codeFoundCached(dimensions, idx, translations) {
  stats.total++;

  const cacheKey = dimensionsCacheKey(dimensions);

  const cached = codeFoundCache.get(cacheKey);
  if (cached !== undefined) {
    stats.cacheHit++;
    return cached;
  }

  stats.cacheMiss++;

  const result = codeFound(dimensions, idx, translations);
  codeFoundCache.set(cacheKey, result);

  return result;
}

function codeFound(dimensions, idx, translations) {
  for (const key in dimensions) {
    const value = dimensions[key];
    if (!value) continue;

    const lower = value.toLowerCase();

    const res =
      idx.exact.get(value) ||
      idx.lower.get(lower) ||
      idx.parts.get(value) ||
      idx.parts.get(lower);

    if (res) {
      stats.originalHit++;
      return res;
    }
  }

  for (const key in dimensions) {
    const value = dimensions[key];
    if (!value) continue;

    const translated = translations[value];
    if (!translated) continue;

    const lower = translated.toLowerCase();

    const res =
      idx.exact.get(translated) ||
      idx.lower.get(lower) ||
      idx.parts.get(translated) ||
      idx.parts.get(lower);

    if (res) {
      stats.translationHit++;
      return res;
    }
  }

  stats.notFound++;
  return "NUTS0 ?";
}

function loadNutsMap() {
  const workbook = xlsx.readFile(NUTS_XLSX);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const header = rows[0];
  const geoIndex = header.indexOf("NUTS Code");
  const labelIndex = header.indexOf("NUTS label");
  const levelIndex = header.indexOf("NUTS level");

  const map = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const code = row[geoIndex];
    if (code) {
      map[code] = { name: row[labelIndex], level: row[levelIndex] };
    }
  }
  return map;
}

function loadAllMap() {
  const map = {};
  const workbook = xlsx.readFile(NUTS_XLSX);
  for (let i = 0; i < workbook.SheetNames.length; i++) {
    let page = map
    const sheet = workbook.Sheets[workbook.SheetNames[i]];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const header = rows[0];


    for (let row of rows.slice(1)) {
      for (let value of row) {
        if (!page[value])
          page[value] = { page: { [i]: true } }
        else
          page[value].page[i] = true
        for (let label of header)
          if (!page[value][label])
            page[value][label] = row[header.indexOf(label)]
          else {
            Array.isArray(page[value][label]) ? page[value][label].push(row[header.indexOf(label)]) : (page[value][label] = [page[value][label], row[header.indexOf(label)]])
          }
      }
    }
  }
  return map;
}

function load8thPage() {
  const workbook = xlsx.readFile(NUTS_XLSX);
  const sheet = workbook.Sheets[workbook.SheetNames[8]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const header = rows[0];
  const labelIndex = header.indexOf("Label");
  const transliterationToLatinIndex = header.indexOf("NUTS label");

  const map = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const translated = row[transliterationToLatinIndex];
    if (translated) {
      map[translated] = row[labelIndex];
    }
  }
  return map;
}

module.exports = async function decode(source, id) {
  const collectedOutput = Output(id)
  //const nutsMap = loadNutsMap();
  const js = source;

  const dims = js.dimension;
  const ids = js.id;
  const sizes = js.size;
  const values = js.value;

  const geoDimName = js.role?.geo ||
    Object.keys(dims).find(d =>
      ["geo", "region", "area", "country"].some(k => d.toLowerCase().includes(k))
    );

  const NON_REGIONAL = new Set(["EU27_2020", "EA19", "TOTAL", "WORLD"]);

  const indexToCode = {};
  const indexToLabel = {};

  for (const dim of ids) {
    const idxMap = dims[dim].category.index;
    const labels = dims[dim].category.label;

    const arrCode = [];
    const arrLabel = [];

    for (const code in idxMap) {
      const pos = idxMap[code];
      arrCode[pos] = code;
      arrLabel[pos] = labels[code];
    }

    indexToCode[dim] = arrCode;
    indexToLabel[dim] = arrLabel;
  }

  const strides = [];
  let acc = 1;
  for (let i = sizes.length - 1; i >= 0; i--) {
    strides[i] = acc;
    acc *= sizes[i];
  }

  const output = [];
  const indices = new Array(ids.length).fill(0);
  const timestamp = js.updated;

  if (sizes.length !== ids.length) {
    throw new Error("sizes e ids non allineati");
  }

  sizes.forEach((s, i) => {
    if (!Number.isInteger(s) || s <= 0) {
      throw new Error(`Size non valida alla dimensione ${ids[i]}: ${s}`);
    }
  });

  let nameStream, stream, firstRecord
  if (config.writeJsonStatOnFile) {
    nameStream = ".out" + Date.now() + ".json";
    fs.appendFileSync(nameStream, "[\n");//slow
    //stream = fs.createWriteStream(nameStream)//, {
    //highWaterMark: 1024 * 1024
    //});
    //stream.write("[\n");
    firstRecord = true;
    /*stream.on("finish", () => {
      console.log("FINITO");
    });

    stream.on("error", (err) => {
      console.error(err);
    });*/
  }

  let purged = false
  let bufferArray = []
  let part = 1

  while (true) {
    let flat = 0;
    let regionLevel = "unknown";
    const humanDims = config.jsonStatDims == "array" ? [] : {};

    for (let i = 0; i < ids.length; i++) {
      flat += indices[i] * strides[i];

      let dim = ids[i];
      const code = indexToCode[dim][indices[i]];
      const label = indexToLabel[dim][indices[i]];

      if (dim === "time") dim = "year";
      if (config.jsonStatDims == "array")
        humanDims.push(label)
      else
        humanDims[dim] = label;

      if (dim === geoDimName) {
        const isRegional = !NON_REGIONAL.has(code);

        if (nutsMap[code]?.level != null) {
          regionLevel = "NUTS" + nutsMap[code].level;
        } /*else if (codeFound(, nutsMap)){//(isRegional) {
          if (code.length === 3) regionLevel = "NUTS1";
          else if (code.length === 4) regionLevel = "NUTS2";
          else if (code.length === 5) regionLevel = "NUTS3";
          else regionLevel = "NON_NUTS";
        } else {
          regionLevel = "NON_NUTS" + code;
        }*/
      }
    }

    const val = values[flat];
    if (val != null) {
      const record = {
        source: source.extension.agencyId || source.extension.datastructure.agencyId,
        survey: source.extension.id || source.extension.datastructure.id,
        region: regionLevel,
        dimensions: humanDims,
        value: val,
        timestamp
      };

      /*if (!purged) {
        await Datapoints.deleteMany({
          survey: source.extension.id || source.extension.datastructure.id,
        });
        purged = true;
      }*/
      if (record.region == "unknown")
        record.region = codeFound(record.dimensions, idx, translations);
      //record.dimensions = Object.values(record.dimensions)
      if (config.writeJsonStatOnFile) {
        if (!firstRecord) fs.appendFileSync(nameStream, ",\n");//stream.write(",\n");
        else firstRecord = false;
        fs.appendFileSync(nameStream, JSON.stringify(record))
        //stream.write(JSON.stringify(record));
      }
      bufferArray.push(record)
      if (bufferArray.length >= config.batch) {
        if (config.sessionLocation.mongo)
          await collectedOutput.insertMany(bufferArray);
        if (config.sessionLocation.filesystem) {
          if (!fs.existsSync('./output/' + id + '/'))
            fs.mkdirSync('./output/' + id + '/', { recursive: true });
          fs.writeFileSync('./output/' + id + '/' + (part++) + '.json', JSON.stringify(bufferArray));
        }
        //await Datapoints.insertMany(bufferArray);
        bufferArray = []
        logger.debug(config.batch + " Datapoints salvati nel database.");
      }
    }

    // incrementa gli indici
    let carry = true;
    for (let i = indices.length - 1; i >= 0 && carry; i--) {
      indices[i]++;
      if (indices[i] < sizes[i]) carry = false;
      else indices[i] = 0;
    }

    if (carry) break; // terminazione del ciclo
  }
  if (bufferArray.length > 0) {
    if (config.sessionLocation.mongo)
      await collectedOutput.insertMany(bufferArray);
    if (config.sessionLocation.filesystem) {
      if (!fs.existsSync('./output/' + id + '/'))
        fs.mkdirSync('./output/' + id + '/', { recursive: true });
      fs.writeFileSync('./output/' + id + '/' + (part++) + '.json', JSON.stringify(bufferArray));
    }
    logger.debug(bufferArray.length + " Datapoints salvati nel database.");
  }

  if (config.writeJsonStatOnFile) {
    fs.appendFileSync(nameStream, "\n]")
    //stream.write("\n]");
    /*stream.end(() => {
      console.log("File scritto");
    });*/
  }



  if (config.debug?.writeParsedjsonStat) {// || process.test) {
    logger.debug("Salvataggio file di output...");
    fs.writeFileSync("out_human_nuts.json", JSON.stringify(output, null, 2));
    logger.debug("File salvato: out_human_nuts.json");
  }

  console.log(stats);
  console.log("cache hit %:", (stats.cacheHit / stats.total * 100).toFixed(2));
  console.log("cache miss %:", (stats.cacheMiss / stats.total * 100).toFixed(2));
  console.log("cache size:", codeFoundCache.size);

  return [{ id }]; //TODO uniformare return con la struttura del in Mapping report

};
