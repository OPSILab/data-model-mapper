module.exports = {//NOTE: 3. BikeHireDockingStationMap.json has a BOM char in LOCALITÀ DI INTERVENTO
    body: {
        "sourceDataIn": "3. BikeHireDockingStationSource.csv",
        "mapPathIn": "3. BikeHireDockingStationMap.json",
        "dataModelIn": "BikeHireDockingStation",

        "config": { "NGSI_entity": true, "delimiter": ";", "rowEnd": 1 }
    },
    response: [
        {
            "address": {
                "streetAddress": "Agnello Via – cv 20"
            },
            "areaServed": "VariGiusto per il test",
            "totalSlotNumber": 10,
            "name": "20/09/2016Agnello Via – cv 20",
            "id": "urn:ngsi-ld:BikeHireDockingStation:gabriele.percoco@demetrix.it:ds377-1",
            "type": "BikeHireDockingStation",
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 579,
                "Mapped_and_Validated_Objects": "1-579",
                "Mapped_and_NOT_Validated_Objects": "578-579"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "1/1",
                "Object NOT written to Orion Context Broker": "0/1",
                "Object SKIPPED": "0/1"
            }
        }
    ]
}