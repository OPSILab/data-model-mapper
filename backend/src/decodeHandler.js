const jsonStatDecoder = require('./utils/decoders/json-stat');
const sdmxDecoder = require('./utils/decoders/sdmx')

module.exports = {
    async handleDecode(source, map, dataModel, schema, NGSI_entity, minioObj, config, res, decodeOptions, id) {
        // Implement decoding logic based on decodeOptions
        if (decodeOptions.decodeFrom === 'json-stat') {
            return await jsonStatDecoder(source.data[0], id); 
        }
        else if (decodeOptions.decodeFrom === 'sdmx-xml') 
            return await sdmxDecoder(source.data[0] || source.data, null, null, null, decodeOptions.fromUrl, id);
        else 
            throw new Error("Unsupported decodeFrom option");
    }
}