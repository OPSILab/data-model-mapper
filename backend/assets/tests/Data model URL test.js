module.exports = {//NOTE: 3. BikeHireDockingStationMap.json has a BOM char in LOCALITÀ DI INTERVENTO
    body: {
        "sourceDataType": "json",
        "sourceData": [
            {
                "a": "av",
                "b": {
                    "c": "c"
                }
            }
        ],
        "mapData": {
            "e": "a",
            "f": "a"
        },
        "dataModelURL": "http://localhost:12345/assets/schema.json",
        "config": {
            "delimiter": ";", "NGSI_entity": false,
            "writers": []
        }
    },
    response: [
        {
            "e": "av",
            "f": "av"
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