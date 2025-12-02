module.exports = {
    body: {
        "sourceDataType": "json",
        "mapData": {
            "e": "a",
            "f": "a"
        },
        "config": {
            "NGSI_entity": false,
            "ignoreValidation": true,
            "mappingReport": true,
            "targetDataModel": "Data Model name, according to the related Schema contained in the DataModels folder",
            "rowStart": 0,
            "rowEnd": 1000,
            "delimiter": ";",
            "endLine": "\n",
            "deleteEmptySpaceAtBeginning": true,
            "site": "SomeRZ",
            "service": "SomeService",
            "group": "CSV",
            "entityNameField": "entitySourceId",
            "entityDefaultPrefix": "ds",
            "writers": ["orionWriter"]
        },
        "dataModel": {
            "$schema": "http://json-schema.org/schema#",
            "$id": "dataModels/DataModelTemp.json",
            "title": "DataModelTemp",
            "description": "Bike Hire Docking Station",
            "type": "object",
            "properties": {
                "e": {
                    "type": "string"
                },
                "f": {
                    "type": "string"
                }
            }
        },
        "sourceData": [
            {
                "a": "a",
                "b": {
                    "c": "c"
                }
            }
        ]
    },
    response: [
        {
            "e": "a",
            "f": "a"
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
                            "e": "a",
                            "f": "a"
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
                                "e": "a",
                                "f": "a"
                            }
                        }
                    }
                ]
            }
        }
    ]
}