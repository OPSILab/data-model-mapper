module.exports = {
    "body": {
        "sourceDataType": "json",
        "sourceData": [
            {
                "f": "v",
                "g": "w",
                "num": "42",
                "flag": "true",
                "n": {
                    "f": "nv",
                    "g": "nw"
                }
            }
        ],
        "mapData": {
            "p": {
                "concatStatics": [
                    "static:A",
                    "static:B"
                ],
                "concatDotted": [
                    "n.f",
                    "n.g"
                ],
                "numberPlain": "num",
                "booleanPlain": "flag",
                "staticArray": [
                    "static:A",
                    "static:B"
                ],
                "untypedArray": [
                    "f",
                    "g"
                ],
                "notInSchemaDotted": "n.f",
                "notInSchemaEncoded": "encode:base64:[\"f\"]",
                "notInSchemaArray": [
                    "f",
                    "g"
                ],
                "notInSchemaStatics": [
                    "static:A",
                    "static:B"
                ],
                "untypedObject": {
                    "sub": "f"
                }
            }
        },
        "dataModel": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "p": {
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "concatStatics": {
                            "type": "string"
                        },
                        "concatDotted": {
                            "type": "string"
                        },
                        "numberPlain": {
                            "type": "number"
                        },
                        "booleanPlain": {
                            "type": "boolean"
                        },
                        "staticArray": {
                            "type": "array"
                        },
                        "untypedArray": {
                            "description": "senza type"
                        },
                        "untypedObject": {
                            "description": "senza type"
                        }
                    }
                }
            }
        },
        "config": {
            "NGSI_entity": false,
            "writers": [],
            "mappingReport": false,
            "disableAjv": true,
            "allowExtraFields": true
        }
    },
    "response": [
        {
            "p": {
                "concatStatics": "AB",
                "concatDotted": "nvnw",
                "numberPlain": 42,
                "booleanPlain": true,
                "staticArray": [
                    "A",
                    "B"
                ],
                "untypedArray": [
                    "v",
                    "w"
                ],
                "notInSchemaDotted": "nv",
                "notInSchemaEncoded": "dg==",
                "notInSchemaArray": [
                    "v",
                    "w"
                ],
                "notInSchemaStatics": [
                    "A",
                    "B"
                ],
                "untypedObject": {
                    "sub": "v"
                }
            }
        }
    ]
}
