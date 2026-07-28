module.exports = {
    body: {
        "dataModelIn": "Spotted",
        "mapData": {
            "dataset": "static:cycle_paths",
            "entitySourceId": [
                "static:bike644001489880d4d150286f56"
            ],
            "fields": {
                "address": {
                    "addressCountry": "static:",
                    "addressLocality": "static:",
                    "streetAddress": "anagrafica"
                },
                "location": "Location",
                "name": "static:",
                "targetDataModel": "Spotted"
            }
        },
        "sourceDataURL": "https://dati.comune.milano.it/dataset/ceda0264-24f3-4869-9a2d-411906f0abab/resource/18b0480e-5e7d-4a7d-902f-30cc76ad4f9f/download/bike_ciclabili.csv",
        "sourceDataType": "csv",
        "csvDelimiter": ";",
        "config": {
            "rowEnd": 2,
            "ignoreValidation": true,
            regexCleanDest: "id",
            writers: []
        }
    },
    response: [
        {
            "dataset": "cycle_paths",
            "fields": {
                "address": {
                    "addressCountry": "",
                    "addressLocality": "",
                    "streetAddress": "PIAZZA VENTICINQUE APRILE"
                },
                "location": "(45.48098764714976, 9.187030518678496)",
                "name": ""
            },
            "id": "urn:ngsi-ld:Spotted:gabriele.percoco@demetrix.it:bike644001489880d4d150286f56-1",
            "type": "Spotted"
        },
        {
            "dataset": "cycle_paths",
            "fields": {
                "address": {
                    "addressCountry": "",
                    "addressLocality": "",
                    "streetAddress": "VIA GIACOMO MEDICI DEL VASCELLO"
                },
                "location": "(45.43927155468637, 9.241944649071282)",
                "name": ""
            },
            "id": "urn:ngsi-ld:Spotted:gabriele.percoco@demetrix.it:bike644001489880d4d150286f56-2",
            "type": "Spotted"
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 4154,
                "Mapped_and_Validated_Objects": "2-4154",
                "Mapped_and_NOT_Validated_Objects": "4152-4154"
            },
            "ORION_REPORT": "Orion writer not enabled"
        }
    ]
}