const xlsx = require("xlsx");
const fs = require("fs");
const NUTS_XLSX = "./src/utils/decoders/nuts.xlsx";
const config = require("../../../config");
const log = require('../logger')
const { Logger } = log
const logger = new Logger(__filename)
const Datapoints = require('./Datapoint');

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

module.exports = async function decode(source) {
  const nutsMap = loadNutsMap();
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
    stream = fs.createWriteStream(nameStream, {
      highWaterMark: 1024 * 1024
    });
    stream.write("[\n");
    firstRecord = true;
  }

  let purged = false
  let bufferArray = []

  while (true) {
    let flat = 0;
    let regionLevel = "unknown";
    const humanDims = {};

    for (let i = 0; i < ids.length; i++) {
      flat += indices[i] * strides[i];

      let dim = ids[i];
      const code = indexToCode[dim][indices[i]];
      const label = indexToLabel[dim][indices[i]];

      if (dim === "time") dim = "year";
      humanDims[dim] = label;

      if (dim === geoDimName) {
        const isRegional = !NON_REGIONAL.has(code);

        if (nutsMap[code]?.level != null) {
          regionLevel = "NUTS" + nutsMap[code].level;
        } else if (isRegional) {
          if (code.length === 3) regionLevel = "NUTS1";
          else if (code.length === 4) regionLevel = "NUTS2";
          else if (code.length === 5) regionLevel = "NUTS3";
          else regionLevel = "NON_NUTS";
        } else {
          regionLevel = "NON_NUTS";
        }
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

      if (config.writeJsonStatOnFile) {
        if (!firstRecord) stream.write(",\n");
        else firstRecord = false;
        stream.write(record);
      }

      if (!purged) {
        await Datapoints.deleteMany({
          survey: source.extension.id || source.extension.datastructure.id,
        });
        purged = true;
      }
      bufferArray.push(record)
      if (bufferArray.length >= config.batch) {
        await Datapoints.insertMany(bufferArray);
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
    await Datapoints.insertMany(bufferArray);
    logger.debug(bufferArray.length + " Datapoints salvati nel database.");
  }

  if (config.writeJsonStatOnFile) {
    stream.write("\n]");
    stream.end();
  }



  if (config.debug?.jsonStat) {
    logger.debug("Salvataggio file di output...");
    fs.writeFileSync("out_human_nuts.json", JSON.stringify(output, null, 2));
    logger.debug("File salvato: out_human_nuts.json");
  }

  return [];

};
