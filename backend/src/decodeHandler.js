const jsonStatDecoder = require('./utils/decoders/json-stat');

module.exports = {
    async handleDecode(source, map, dataModel, schema, NGSI_entity, minioObj, config, res, decodeOptions, id) {
        // Implement decoding logic based on decodeOptions
        if (decodeOptions.decodeFrom === 'json-stat') {
            return await jsonStatDecoder(source.data[0], id); 
        }
        else if (decodeOptions.decodeFrom === 'sdmx') 
            throw new Error("SDMX decoding not implemented yet");
        else 
            throw new Error("Unsupported decodeFrom option");
    }
}