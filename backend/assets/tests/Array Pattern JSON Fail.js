module.exports = {
    body: {
        "sourceDataIn": "test//ArrayPatternJSONFail//source.json",
        "mapPathIn": "test//ArrayPatternJSONFail//map.json",
        "dataModelIn": "schema2"
    },
    response: [
        {
            "array0": [
                1,
                2,
                3
            ],
            "stringA": "string A",
            "stringB": "string B_a string B_b",
            "objectC": {
                "objectE": {
                    "stringF": "string B_a",
                    "arrayD": [
                        "string B_a",
                        "string B_b"
                    ]
                }
            }
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 1,
                "Mapped_and_Validated_Objects": "1-1",
                "Mapped_and_NOT_Validated_Objects": "0-1"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "1/1",
                "Object NOT written to Orion Context Broker": "0/1",
                "Object SKIPPED": "0/1"
            }
        }
    ]
}