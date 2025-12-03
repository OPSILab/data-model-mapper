module.exports = {
    body: {
        "sourceDataType": "json",
        "sourceData": [
            {
                "a": "a1",
                "b": 2,
                "c": {
                    "d": "1",
                    "e": "2"
                }
            }
        ],
        "mapData": {
            "a": "a",
            "a1": [
                "c.e",
                "c.d"
            ],
            "c1": {
                "d1": "static:cd",
                "e": {
                    "e1": "c.e",
                    "e2": "b"
                }
            },
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
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "Example"
                            ],
                            "description": "Example Data Model"
                        },
                        "a": {
                            "type": "string"
                        },
                        "a1": {
                            "type": "string"
                        },
                        "c1": {
                            "type": "object",
                            "properties": {
                                "d1": {
                                    "type": "string"
                                },
                                "e": {
                                    "type": "object",
                                    "properties": {
                                        "e1": {
                                            "type": "string"
                                        },
                                        "e2": {
                                            "type": "integer"
                                        }
                                    },
                                    "required": [
                                        "e1",
                                        "e2"
                                    ]
                                }
                            },
                            "required": [
                                "d1",
                                "e"
                            ]
                        }
                    }
                }
            ]
        },
        "config": { "NGSI_entity": false, writers: [] }
    },
    response: [
        {
            "a": "a1",
            "a1": "21",
            "c1": {
                "d1": "cd",
                "e": {
                    "e1": "2",
                    "e2": 2
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