module.exports = {
    "body": {
        "sourceDataType": "json",
        "sourceData": [
            {
                "empty": "",
                "zero": 0,
                "one": 1,
                "off": 0,
                "nested": {
                    "empty": "",
                    "zero": 0
                }
            }
        ],
        "mapData": {
            "emptyString": "empty",
            "zeroNumber": "zero",
            "boolFromOne": "one",
            "boolFromZero": "off",
            "p": {
                "emptyString": "empty",
                "zeroNumber": "zero"
            }
        },
        "dataModel": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "emptyString": {
                    "type": "string"
                },
                "zeroNumber": {
                    "type": "number"
                },
                "boolFromOne": {
                    "type": "boolean"
                },
                "boolFromZero": {
                    "type": "boolean"
                },
                "p": {
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "emptyString": {
                            "type": "string"
                        },
                        "zeroNumber": {
                            "type": "number"
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
            "emptyString": "",
            "zeroNumber": 0,
            "boolFromOne": true,
            "boolFromZero": false,
            "p": {
                "emptyString": "",
                "zeroNumber": 0
            }
        }
    ]
}
