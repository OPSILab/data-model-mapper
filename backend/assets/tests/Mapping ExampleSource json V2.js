module.exports = { //NOTE: since it's not NGSI, the object will not be written to CB and it's expected to fail
    body: {
        "sourceDataType": "csv",
        "sourceData": "Field 1;Field 2;Field 3 index 0;Field 3 index 1;Field 4a;Field 4b;Field 4c index 0;Field 4c index 1\r\n[Field 1 value 1,Field 1 value 2];[Field 2 value 1,Field 2 value 2];Field 3 value 1;Field 3 value 2; [Field 4a value 1,Field 4a value 2];[Field 4b value 1,Field 4b value 2];Field 4c value 1;Field 4c value 2",
        "mapData": {
            "Field 1": "Field 1",
            "Field 2": "Field 2",
            "Field 3": [
                "Field 3 index 0",
                "Field 3 index 1"
            ],
            "Field 4": {
                "Field 4a": "Field 4a",
                "Field 4b": "Field 4b",
                "Field 4c": [
                    "Field 4c index 0",
                    "Field 4c index 1"
                ]
            },
            "entitySourceId": [
                "static:ExampleDataModel"
            ],
            "targetDataModel": "DataModelTemp"
        },
        "dataModel": {
            "$schema": "http://json-schema.org/schema#",
            "$id": "dataModels/DataModelTemp.json",
            "title": "Example Data Model",
            "description": "Example Data Model",
            "type": "object",
            "required": [],
            "anyOf": [
                {
                    "required": []
                },
                {
                    "required": []
                }
            ],
            "allOf": [
                {
                    "$ref": "common-schema.json#/definitions/GSMA-Commons"
                },
                {
                    "$ref": "common-schema.json#/definitions/Location-Commons"
                },
                {
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "Field 1",
                                "Field 2",
                                "Field 3",
                                "Field 4"
                            ],
                            "description": "Example Data Model"
                        },
                        "Field 1": {
                            "type": "string"
                        },
                        "Field 2": {
                            "type": "array"
                        },
                        "Field 3": {
                            "type": "array"
                        },
                        "Field 4": {
                            "type": "object",
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": [
                                        "Field 4a",
                                        "Field 4b",
                                        "Field 4c"
                                    ]
                                },
                                "Field 4a": {
                                    "type": "string"
                                },
                                "Field 4b": {
                                    "type": "array"
                                },
                                "Field 4c": {
                                    "type": "array"
                                }
                            }
                        }
                    }
                }
            ]
        },
        "csvDelimiter": ";"
    },
    response: [
    {
        "Field 1": "[Field 1 value 1,Field 1 value 2]",
        "Field 2": [
            "Field 2 value 1",
            "Field 2 value 2"
        ],
        "Field 3": [
            "Field 3 value 1",
            "Field 3 value 2"
        ],
        "Field 4": {
            "Field 4a": "[Field 4a value 1,Field 4a value 2]",
            "Field 4b": [
                "Field 4b value 1",
                "Field 4b value 2"
            ],
            "Field 4c": [
                "Field 4c value 1",
                "Field 4c value 2"
            ]
        },
        "type": "Field1",
        "id": "urn:ngsi-ld:Field1:gabriele.percoco@demetrix.it:ExampleDataModel-1"
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