const jsonStatDecoder = require('./utils/decoders/json-stat');

module.exports = {
    async handleDecode(source, map, dataModel, schema, NGSI_entity, minioObj, config, res, decodeOptions) {
        // Implement decoding logic based on decodeOptions
        if (decodeOptions.decodeFrom === 'json-stat') {
            return await jsonStatDecoder(source.data[0]);
        }
        else 
            throw new Error("Unsupported decodeFrom option");
    }
}