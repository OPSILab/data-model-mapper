module.exports = {
    body: {
        "sourceDataIn": "test//ArrayPatternCSVFail//source.csv",
        "mapPathIn": "test//ArrayPatternCSVFail//map.json",
        "dataModelIn": "schema2",
        "config": {
            "delimiter": ";", "NGSI_entity": false,
            "writers": []
        }
    },
    response: [
        {
            "array0": [1, 2, 3],
            "stringA": "a",
            "stringB": "BaBb",
            "objectC": {
                "objectE": {
                    "stringF": "Ba",
                    "arrayD": [
                        "Ba",
                        "Bb"
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
            "ORION_REPORT": "Orion writer not enabled"
        }
    ]
}