module.exports = {
    body: {
        "sourceDataIn": "ExampleSource.json",
        "mapPathIn": "ExampleMap2.json",
        "dataModelIn": "ExampleDataModel",
        "config": { "writers": ["minioWriter", "fileWriter"] }
    },
    response: [
        {
            "Field 1": "Value 1",
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
                ],
                "Field 4e": 5,
                "Field 4f": 5
            },
            "Field 5": 5,
            "Field 6": 6,
            "Field 7": "4a value not from root but now is in root",
            "Field concatenated": "Value 1 to concatenateValue 2 to concatenate",
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