const xlsx = require("xlsx");
const fs = require("fs");
const NUTS_XLSX = "./src/utils/decoders/nuts.xlsx";
const config = require("../../../config");
const log = require('../logger')
const { Logger } = log
const logger = new Logger(__filename)

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

  const fs = require("fs");

  const stream = fs.createWriteStream("out_human_nuts.json", {
    highWaterMark: 1024 * 1024 // 1MB buffer, opzionale
  });
  stream.write("[\n");

  let firstRecord = true;

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
      const record = JSON.stringify({
        source: source.extension.agencyId || source.extension.datastructure.agencyId,
        survey: source.extension.id || source.extension.datastructure.id,
        region: regionLevel,
        dimensions: humanDims,
        value: val,
        timestamp
      });

      if (!firstRecord) stream.write(",\n");
      else firstRecord = false;

      // Scrive su SSD direttamente, senza accumulare in RAM
      stream.write(record);
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

  stream.write("\n]");
  stream.end();



  if (config.debug?.jsonStat) {
    logger.debug("Salvataggio file di output...");
    fs.writeFileSync("out_human_nuts.json", JSON.stringify(output, null, 2));
    logger.debug("File salvato: out_human_nuts.json");
  }

  const Datapoints = require('./Datapoint');
  const stream2 = fs.createReadStream("out_human_nuts.json", { encoding: "utf-8" });
  let buffer = "";
  let depth = 0; // conta le parentesi graffe
  let inObject = false;

  logger.debug("Inizio inserimento datapoints nel database...");
  for await (const chunk of stream2) {
    logger.debug("Lettura chunk di dati...");
    for (const char of chunk) {
      logger.debug(`Elaborazione carattere: ${char}`);
      if (char === "{") {
        logger.debug("Inizio di un nuovo oggetto JSON rilevato.");
        if (!inObject) inObject = true;
        depth++;
      }

      logger.debug(`Profondità attuale delle parentesi graffe: ${depth}`);
      if (inObject) buffer += char;

      logger.debug(`Buffer attuale: ${buffer}`);
      if (char === "}") {
        logger.debug("Fine di un oggetto JSON rilevata.");
        depth--;
        if (depth === 0 && inObject) {
          logger.debug("Oggetto JSON completo rilevato, procedo con l'inserimento nel database.");
          // oggetto completo
          const obj = JSON.parse(buffer);
          logger.debug(`Oggetto JSON da inserire: ${JSON.stringify(obj)}`);
          //const DatapointModel = await Datapoints.getDatapointModel();
          //const datapoint = new DatapointModel(obj);
          await Datapoints.insertMany([obj]);
          logger.debug("Datapoint salvato nel database.");
          buffer = "";
          inObject = false;
        }
      }
    }
  }
  return [];

};
