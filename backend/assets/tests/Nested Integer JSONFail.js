module.exports = {
    body: {
        "sourceDataIn": "test//NestedIntegerCSVFail//source.json",
        "mapPathIn": "test//NestedIntegerCSVFail//map.json",
        "dataModelIn": "Test",
        "config" : {writers : []}
    },
    response: [
        {
            "Field 1": 1,
            "Field 2": {
                "Field 2_1": 4,
                "Field 2_2": "Field static 1",
                "Field 2_3": ["1", "2", "3"],
                "Field 2_4": {
                    "Field 2_4_1": 7,
                    "Field 2_4_2": "Field static 1",
                    "Field 2_4_3": {
                        "Field 2_4_3_1": {
                            "Field 2_4_3_1_1": {
                                "Field 2_4_3_1_1_1": 123,
                                "Field 2_4_3_1_1_2": "static and concat with : 1",
                                "Field 2_4_3_1_1_3": [1, 2, 3, 4, 5]
                            }
                        }
                    }
                }
            },
            "id": "urn:ngsi-ld:Test:gabriele.percoco@demetrix.it:test",
            "type": "Test"
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