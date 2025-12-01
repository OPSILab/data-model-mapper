module.exports = { //NOTE: try also writing in CB
    body: {
        "sourceDataType": "json",
        "sourceData": [
            {
                "Field 1": "",
                "Field 2": [
                    "Value 2"
                ],
                "Field 4a": "Value 4a from root but now is not in root",
                "Field 4b": [
                    "Value 4b from root but now is not in root"
                ],
                "Field 4c index 0": "Field 4c index 0 value from root but now is not in root",
                "Field 4c index 1": "Field 4c index 1 value from root but now is not in root",
                "Field 4d": [
                    "Value 4d"
                ],
                "Field 3 index 0": "Field 3 index 0 Value",
                "Field 3 index 1": "Field 3 index 1 value",
                "Field 31": [
                    "Value 31"
                ],
                "Field 32": 32,
                "Field 33": 33,
                "Field 5": 5,
                "Field 6": 6,
                "Field 4": {
                    "Field 4a": "4a value not from root but now is in root"
                }
            }
        ],
        "mapData": {
            "Field 1": "Field 1",
            "Field 2": "Field 2",
            "Field 3": [
                "Field 3 index 0",
                "Field 3 index 1"
            ],
            "Field 31": "Field 31",
            "Field 32": "Field 33",
            "Field 33": "Field 33",
            "Field 4": {
                "Field 4a": "Field 4a",
                "Field 4b": "Field 4b",
                "Field 4c": [
                    "Field 4c index 0",
                    "Field 4c index 1"
                ],
                "Field 4d": "Field 4d"
            },
            "Field 5": "Field 5",
            "Field 6": "Field 6",
            "Field 7": "Field 4.Field 4a",
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
                                "Example"
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
                        "Field 31": {
                            "type": "array"
                        },
                        "Field 32": {
                            "type": "number"
                        },
                        "Field 33": {
                            "type": "integer"
                        },
                        "Field 4": {
                            "type": "object",
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": [
                                        "Field 4"
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
                                },
                                "Field 4d": {
                                    "type": "array"
                                }
                            }
                        },
                        "Field 5": {
                            "type": "number"
                        },
                        "Field 6": {
                            "type": "integer"
                        },
                        "Field 7": {
                            "type": "string"
                        }
                    }
                }
            ]
        },
        "config": { "writers": ["minioWriter", "fileWriter"] }
    },
    response: [
        {
            "Field 1": "",
            "Field 2": [
                "Value 2"
            ],
            "Field 3": [
                "Field 3 index 0 Value",
                "Field 3 index 1 value"
            ],
            "Field 31": [
                "Value 31"
            ],
            "Field 32": 33,
            "Field 33": 33,
            "Field 4": {
                "Field 4a": "Value 4a from root but now is not in root",
                "Field 4b": [
                    "Value 4b from root but now is not in root"
                ],
                "Field 4c": [
                    "Field 4c index 0 value from root but now is not in root",
                    "Field 4c index 1 value from root but now is not in root"
                ],
                "Field 4d": [
                    "Value 4d"
                ]
            },
            "Field 5": 5,
            "Field 6": 6,
            "Field 7": "4a value not from root but now is in root",
            "type": "Example",
            "id": "urn:ngsi-ld:Example:gabriele.percoco@demetrix.it:ExampleDataModel-1"
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