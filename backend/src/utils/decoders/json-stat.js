const axios = require("axios");
const xlsx = require("xlsx");
const fs = require("fs");
const NUTS_XLSX = "./src/utils/decoders/nuts.xlsx";
//const NUTS_XLSX = "./nuts.xlsx";
const log = require('../logger')
const { Logger } = log
const logger = new Logger(__filename)

function loadNutsMap() {
  const workbook = xlsx.readFile(NUTS_XLSX);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // array di array
  const header = rows[0];

  const geoIndex = header.indexOf("NUTS Code");
  const labelIndex = header.indexOf("NUTS label");
  const levelIndex = header.indexOf("NUTS level");

  const map = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const code = row[geoIndex];
    const name = row[labelIndex];
    const level = row[levelIndex];
    if (code) {
      map[code] = { name, level };
    }
  }

  return map;
}

module.exports = async function decode(source) {
  const nutsMap = loadNutsMap();
  //const res = await axios.get(url);
  //const js = res.data;
  const js = source
  const dims = js.dimension;
  const ids = js.id;
  const sizes = js.size;
  const values = js.value;
  //logger.debug(Object.keys(source));

  const geoDimName = js.role?.geo ||
    Object.keys(dims).find(dim =>
      dim.toLowerCase() === "geo" ||
      dim.toLowerCase().includes("region") ||
      dim.toLowerCase().includes("area") ||
      dim.toLowerCase().includes("country")
    );

  const labels = {};
  for (const dim of ids) {
    labels[dim] = dims[dim].category.label;
  }

  function walk(indices, dimIndex, output, dims, ids, sizes, nutsMap, geoDimName, timestamp) {
    if (dimIndex === ids.length) {
      const flat = indices.reduce((acc, curr, i) => {
        const prod = sizes.slice(i + 1).reduce((a, b) => a * b, 1);
        return acc + curr * prod;
      }, 0);

      const val = js.value[flat];
      if (val !== null && val !== undefined) {
        let regionLevel = "unknown";
        let regionName = null;

        const humanDims = indices.map((idx, i) => {
          const dim = ids[i];
          const code = Object.entries(dims[dim].category.index)
            .find(([c, pos]) => pos === idx)[0];
          const lab = dims[dim].category.label[code];
          const nonRegionalCodes = ["EU27_2020", "EA19", "TOTAL", "WORLD"];
          const isRegional = !nonRegionalCodes.includes(code)

          if (dim === geoDimName) {
            //if (nonRegionalCodes.includes(code))
            //  console.log(code)
            regionLevel = nutsMap[code]?.level ? "NUTS" + nutsMap[code].level :
              isRegional && code.length === 3 ? regionLevel = "NUTS1" :
                isRegional && code.length === 4 ? regionLevel = "NUTS2" :
                  isRegional && code.length === 5 ? regionLevel = "NUTS3" :
                    "NON_NUTS";

            regionName = lab;
          }

          return lab;
        });

        output.push({
          source: "ESTAT",
          survey: "nama_10r_3gdp",
          region: regionLevel,
          dimensions: humanDims,
          value: val,
          timestamp: timestamp
        });
      }
      return;
    }

    for (let i = 0; i < sizes[dimIndex]; i++) {
      walk([...indices, i], dimIndex + 1, output, dims, ids, sizes, nutsMap, geoDimName, timestamp);
    }
  }

  const output = [];
  const timestamp = js.updated; // o js.date se c'è
  walk([], 0, output, dims, ids, sizes, nutsMap, geoDimName, timestamp);


  //console.log("Tot record:", output.length);
  fs.writeFileSync("out_human_nuts.json", JSON.stringify(output, null, 2), "utf-8");
  console.log("File salvato: out_human_nuts.json");
  //return "ok"
  return output;
}

/*const test = require("./json-stat");
test(0, "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/NAMA_10R_3GDP").then(res => {
  console.log("ok");
  process.exit(0);
})*/
