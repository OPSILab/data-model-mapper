module.exports = {
    body: {
        "sourceDataIn": "test//NestedIntegerCSVFail//source.csv",
        "mapPathIn": "test//NestedIntegerCSVFail//map.json",
        "dataModelIn": "Test",
        "config": { "delimiter": ";", "NGSI_entity": false, "writers": [] }
    },
    response: [
        {
            "Field 1": 1,
            "Field 2": {
                "Field 2_1": 4,
                "Field 2_2": "Field static 1",
                "Field 2_3": [
                    "1",
                    "2",
                    "3"
                ],
                "Field 2_4": {
                    "Field 2_4_1": 7,
                    "Field 2_4_2": "Field static 1",
                    "Field 2_4_3": {
                        "Field 2_4_3_1": {
                            "Field 2_4_3_1_1": {
                                "Field 2_4_3_1_1_1": 100,
                                "Field 2_4_3_1_1_2": "static and concat with : 1",
                                "Field 2_4_3_1_1_3": [
                                    1,
                                    2,
                                    3
                                ]
                            }
                        }
                    }
                }
            },
            "entitySourceId": "test1"
        },
        {
            "Field 1": 2,
            "Field 2": {
                "Field 2_1": 5,
                "Field 2_2": "Field static 2",
                "Field 2_3": [
                    "11",
                    "12",
                    "13"
                ],
                "Field 2_4": {
                    "Field 2_4_1": 8,
                    "Field 2_4_2": "Field static 2",
                    "Field 2_4_3": {
                        "Field 2_4_3_1": {
                            "Field 2_4_3_1_1": {
                                "Field 2_4_3_1_1_1": 101,
                                "Field 2_4_3_1_1_2": "static and concat with : 2",
                                "Field 2_4_3_1_1_3": [
                                    1,
                                    2,
                                    3
                                ]
                            }
                        }
                    }
                }
            },
            "entitySourceId": "test2"
        },
        {
            "Field 1": 3,
            "Field 2": {
                "Field 2_1": 6,
                "Field 2_2": "Field static 3",
                "Field 2_3": [
                    "21",
                    "22",
                    "23"
                ],
                "Field 2_4": {
                    "Field 2_4_1": 9,
                    "Field 2_4_2": "Field static 3",
                    "Field 2_4_3": {
                        "Field 2_4_3_1": {
                            "Field 2_4_3_1_1": {
                                "Field 2_4_3_1_1_1": 102,
                                "Field 2_4_3_1_1_2": "static and concat with : 3",
                                "Field 2_4_3_1_1_3": [
                                    1,
                                    2,
                                    3
                                ]
                            }
                        }
                    }
                }
            },
            "entitySourceId": "test3"
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 3,
                "Mapped_and_Validated_Objects": "3-3",
                "Mapped_and_NOT_Validated_Objects": "0-3"
            },
            "ORION_REPORT": "Orion writer not enabled"
        }
    ]
}