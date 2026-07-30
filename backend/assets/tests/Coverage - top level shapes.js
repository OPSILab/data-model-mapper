module.exports = {
    "body": {
        "sourceDataType": "json",
        "sourceData": [
            {
                "f": "v",
                "g": "w",
                "n": {
                    "f": "nv",
                    "g": "nw"
                },
                "obj": {
                    "a": "1",
                    "b": "2"
                },
                "deep": {
                    "inner": {
                        "a": "1"
                    }
                }
            }
        ],
        "mapData": {
            "concatStatics": [
                "static:A",
                "static:B"
            ],
            "dottedArray": [
                "n.f",
                "n.g"
            ],
            "untypedStatic": "static:S",
            "untypedArray": [
                "f",
                "g"
            ],
            "wholeObject": "obj",
            "wholeObjectDotted": "deep.inner"
        },
        "dataModel": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "concatStatics": {
                    "type": "string"
                },
                "dottedArray": {
                    "type": "array"
                },
                "untypedStatic": {
                    "description": "senza type"
                },
                "untypedArray": {
                    "description": "senza type"
                },
                "wholeObject": {
                    "type": "object",
                    "additionalProperties": true
                },
                "wholeObjectDotted": {
                    "type": "object",
                    "additionalProperties": true
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
            "concatStatics": "AB",
            "dottedArray": [
                "nv",
                "nw"
            ],
            "untypedStatic": "S",
            "untypedArray": [
                "v",
                "w"
            ],
            "wholeObject": {
                "a": "1",
                "b": "2"
            },
            "wholeObjectDotted": {
                "a": "1"
            }
        }
    ]
}
