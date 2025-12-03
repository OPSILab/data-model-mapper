module.exports = {
    body: {
        "sourceDataIn": "arrayofObjectTestSource.csv",
        "mapPathIn": "arrayofObjectTestMap.json",
        "dataModelIn": "arrayofObjectTest",
        "csvDelimiter": ";",
        "config": {
            "NGSI_entity": false,
            "writers": []
        }
    },
    response: [
        {
            "FieldArray": [
                {
                    "Field": "Value",
                },
            ]
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