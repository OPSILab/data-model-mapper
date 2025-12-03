module.exports = {
    body: {
        sourceDataType: "csv",
        sourceData: "Field 1;Field 2;Field 3;Field 4 1;Field 4 2;Field 4 3\r\nValue 1;2;[1,2,3];Value 1;2;[1,2,3]",
        mapData: {
            "Field 1": "Field 1",
            "Field 2": "Field 2",
            "Field 3": "Field 3",
            "Field 4": {
                "Field 1": "Field 4 1",
                "Field 2": "Field 4 2",
                "Field 3": "Field 4 3"
            }
        },
        dataModel: {
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
        config: { NGSI_entity: false }
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
            "ORION_REPORT": "Orion writer not enabled"
        }
    ]
}