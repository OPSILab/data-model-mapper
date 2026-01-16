const mongoose = require('mongoose');
const config = require('../../../config');

const MONGO_URI = config.mongoSourceConnector; // cambia "mydb" con il tuo database

// Oggetto che conterrà il modello una volta creato
let Datapoint;

mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log("Connesso a MongoDB!");

  // definizione schema
  const datapointSchema = new mongoose.Schema({
    source: String,
    survey: String,
    surveyName: String,
    region: String,
    fromUrl: String,
    timestamp: String,
    dimensions: Object,
    value: Number
  }, { strict: false });

  // creazione modello
  Datapoint = mongoose.model('Datapoint', datapointSchema);

})
.catch(err => {
  console.error("Errore di connessione a MongoDB:", err);
});

// esportiamo una funzione che ritorna il modello solo quando è pronto
module.exports.getDatapointModel = async function() {
  // aspetta che la connessione sia pronta
  if (!Datapoint) {
    await mongoose.connection.asPromise(); // Node 18+ / mongoose 7+
  }
  return Datapoint;
};
