module.exports = {
    body: {
        "sourceDataIn": "arrayofObjectTestSource.csv",
        "mapPathIn": "arrayofObjectTestMap.json",
        "dataModelIn": "arrayofObjectTest",
        "csvDelimiter": ";"
    },
    response: [
        {
            "FieldArray": [
                {
                    "Field": "Value"
                }
            ]
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