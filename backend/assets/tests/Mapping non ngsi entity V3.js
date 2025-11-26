module.exports = {//NOTE: since it's not NGSI, the object will not be written to CB and it's expected to fail
    body: {
        "sourceDataType": "csv",
        "sourceData": "Field 1;Field 2;Field 3;Field 4 1;Field 4 2;Field 4 3\r\nValue 1;2;[1,2,3];Value 1;2;[1,2,3]",
        "mapData": {
            "Field 1": "Field 1",
            "Field 2": "Field 2",
            "Field 3": "Field 3",
            "Field 4": {
                "Field 1": "Field 4 1",
                "Field 2": "Field 4 2",
                "Field 3": "Field 4 3"
            }
        },
        "dataModel": {
            "$schema": "http://json-schema.org/schema#",
            "type": "object",
            "properties": {
                "Field 1": {
                    "type": "string"
                },
                "Field 2": {
                    "type": "integer"
                },
                "Field 3": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "Field 4": {
                    "type": "object",
                    "properties": {
                        "Field 1": {
                            "type": "string"
                        },
                        "Field 2": {
                            "type": "integer"
                        },
                        "Field 3": {
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        }
                    },
                    "required": [
                        "Field 1",
                        "Field 2",
                        "Field 3"
                    ]
                }
            },
            "required": [
                "Field 1",
                "Field 2",
                "Field 3",
                "Field 4"
            ]
        },
        "csvDelimiter": ";",
        "config": {
            "NGSI_entity": false
        }
    },
    response: [
        {
            "Field 1": "Value 1",
            "Field 2": 2,
            "Field 3": [
                1,
                2,
                3
            ],
            "Field 4": {
                "Field 1": "Value 1",
                "Field 2": 2,
                "Field 3": [
                    1,
                    2,
                    3
                ]
            }
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
                        "status": 400
                    },
                    {
                        "count": "1",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400
                        }
                    }
                ]
            }
        }
    ]
}