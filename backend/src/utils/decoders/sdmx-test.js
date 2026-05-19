global.test = {
  writeParsedSdmx: false,
  writeParsedXml: false,
  sdmxCache: true
}
const {main} = require("./sdmx");
const datastructure = "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/dataflow/ESTAT/NAMA_10R_3GDP/1.0?detail=referencepartial&references=descendants"
const dataset = "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/NAMA_10R_3GDP"
const base = "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1"

main(dataset, datastructure, null, base).then(() => {
  console.log("Elaborazione completata con successo.");
  process.exit();
}).catch(err => {
  console.error("Errore non gestito:", err);
  process.exit(1); 
});