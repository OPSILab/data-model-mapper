const jsonStatDecoder = require('./utils/decoders/json-stat');
const sdmxDecoder = require('./utils/decoders/sdmx')

module.exports = {
    async handleDecode(source, map, dataModel, schema, NGSI_entity, minioObj, config, res, decodeOptions, id) {
        // source.data may be the payload itself (string / Buffer) or an ARRAY of payloads.
        // Indexing [0] blindly is not safe: on a string it takes the first CHARACTER, on a
        // Buffer the first BYTE. A lone "<" reaching the XML parser is what produces
        // "1:1: document must contain a root element" (the column tells how much was read).
        // The old `source.data[0] || source.data` could not fall back either, because "<"
        // is truthy.
        const payload = Array.isArray(source.data) ? source.data[0] : source.data;

        // Implement decoding logic based on decodeOptions
        if (decodeOptions.decodeFrom === 'json-stat') {
            return await jsonStatDecoder(payload, id);
        }
        else if (decodeOptions.decodeFrom === 'sdmx-xml')
            return await sdmxDecoder(payload, null, null, null, decodeOptions.fromUrl, id);
        else
            throw new Error("Unsupported decodeFrom option");
    }
}