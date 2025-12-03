module.exports = {
    body: {
        sourceDataType: "csv",
        sourceData: "Field 1;Field 2;Field 3 index 0;Field 3 index 1;Field 31;Field 32;Field 33;Field 4a;Field 4b;Field 4c index 0;Field 4c index 1;Field 4d;Field 5;Field 6;Field 7\r\n[Field 1 value 1,Field 1 value 2];[Field 2 value 1,Field 2 value 2];Field 3 value 1;Field 3 value 2;[{Field 31a : Field 31a, Field 31b : Field 31b }];32;33; [Field 4a value 1,Field 4a value 2];[Field 4b value 1,Field 4b value 2];Field 4c value 1;Field 4c value 1;[{Field 4da : Field 4da, Field 4db : Field 4db }, {Field 4da1 : Field 4da1, Field 4db1 : Field 4db1 }];5;6;7",
        mapData: {
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
            "Field 7": "Field 7",
            "entitySourceId": [
                "static:ExampleDataModel"
            ],
            "targetDataModel": "ExampleDataModel"
        },
        dataModelIn: "ExampleDataModel",
        config: {
            delimiter: ";",
            NGSI_entity: true
        }
    },
    response: [{
        "Field 1": "[Field 1 value 1,Field 1 value 2]",
        "Field 2": [
            "Field 2 value 1",
            "Field 2 value 2"
        ],
        "Field 3": [
            "Field 3 value 1",
            "Field 3 value 2"
        ],
        "Field 31": [
            {
                "Field 31a": "Field 31a",
                "Field 31b": "Field 31b"
            }
        ],
        "Field 32": 33,
        "Field 33": 33,
        "Field 4": {
            "Field 4a": "[Field 4a value 1,Field 4a value 2]",
            "Field 4b": [
                "Field 4b value 1",
                "Field 4b value 2"
            ],
            "Field 4c": [
                "Field 4c value 1",
                "Field 4c value 1"
            ],
            "Field 4d": [
                {
                    "Field 4da": "Field 4da",
                    "Field 4db": "Field 4db"
                },
                {
                    "Field 4da1": "Field 4da1",
                    "Field 4db1": "Field 4db1"
                }
            ]
        },
        "Field 5": 5,
        "Field 6": 6,
        "Field 7": "7",
        "type": "Example",
        "id": "urn:ngsi-ld:Example:gabriele.percoco@demetrix.it:ExampleDataModel-1"
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