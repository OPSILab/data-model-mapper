module.exports = { //NOTE: since it's not NGSI, the object will not be written to CB and it's expected to fail
    body: {
        "sourceDataIn": "arrayofObjectTestSource.csv",
        "mapPathIn": "arrayofObjectTestMap.json",
        "dataModelIn": "arrayofObjectTest",
        "csvDelimiter": ";",
        "config": { "NGSI_entity": false }
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
                "Object written to Orion Context Broker": "0/1",
                "Object NOT written to Orion Context Broker": "1/1",
                "Object SKIPPED": "0/1",
                "details": [
                    {
                        "count": "1",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "FieldArray": [
                                {
                                    "Field": "Value"
                                }
                            ]
                        }
                    },
                    {
                        "count": "1",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "FieldArray": [
                                    {
                                        "Field": "Value"
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        }
    ]
}