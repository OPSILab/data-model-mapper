const xlsx = require("xlsx");
const fs = require("fs");
const NUTS_XLSX = "./src/utils/decoders/nuts.xlsx";

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

  /** 🔹 Precompute index → code */
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

  /** 🔹 Precompute flat strides */
  const strides = [];
  let acc = 1;
  for (let i = sizes.length - 1; i >= 0; i--) {
    strides[i] = acc;
    acc *= sizes[i];
  }

  const output = [];
  const indices = new Array(ids.length).fill(0);
  const timestamp = js.updated;

  function walk(dimIndex) {
    if (dimIndex === ids.length) {
      let flat = 0;
      for (let i = 0; i < indices.length; i++) {
        flat += indices[i] * strides[i];
      }

      const val = values[flat];
      if (val == null) return;

      let regionLevel = "unknown";
      let regionName = null;
      const humanDims = new Array(ids.length);

      for (let i = 0; i < ids.length; i++) {
        const dim = ids[i];
        const code = indexToCode[dim][indices[i]];
        const label = indexToLabel[dim][indices[i]];
        humanDims[i] = label;

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

          regionName = label;
        }
      }

      output.push({
        source: "ESTAT",
        survey: "nama_10r_3gdp",
        region: regionLevel,
        dimensions: humanDims,
        value: val,
        timestamp
      });
      return;
    }

    for (let i = 0; i < sizes[dimIndex]; i++) {
      indices[dimIndex] = i;
      walk(dimIndex + 1);
    }
  }

  walk(0);

  console.log("Salvataggio file di output...");
  fs.writeFileSync("out_human_nuts.json", JSON.stringify(output, null, 2));
  console.log("File salvato: out_human_nuts.json");

  return output;
};
