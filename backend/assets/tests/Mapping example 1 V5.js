module.exports = {
    body: {
        "sourceDataType": "geojson",
        "sourceDataID": "bike_1",
        "mapID": "bike_1",
        "dataModelIn": "BikeHireDockingStation"
    },
    response: [
        {
            "name": "001 Duomo 1",
            "location": {
                "type": "Point",
                "coordinates": [
                    9.1890425716699,
                    45.464725436014575
                ]
            },
            "totalSlotNumber": 24,
            "address": {
                "streetAddress": "P.za Duomo"
            },
            "type": "BikeHireDockingStation",
            "id": "urn:ngsi-ld:BikeHireDockingStation:gabriele.percoco@demetrix.it:001Duomo1"
        },
        {
            "name": "002 San Babila",
            "location": {
                "type": "Point",
                "coordinates": [
                    9.197596296602454,
                    45.46647450916635
                ]
            },
            "totalSlotNumber": 24,
            "address": {
                "streetAddress": "P.za S.Babila"
            },
            "type": "BikeHireDockingStation",
            "id": "urn:ngsi-ld:BikeHireDockingStation:gabriele.percoco@demetrix.it:002SanBabila"
        },
        {
            "name": "003 Cadorna 1",
            "location": {
                "type": "Point",
                "coordinates": [
                    9.175674275275924,
                    45.46800482576666
                ]
            },
            "totalSlotNumber": 21,
            "address": {
                "streetAddress": "P.za Cadorna"
            },
            "type": "BikeHireDockingStation",
            "id": "urn:ngsi-ld:BikeHireDockingStation:gabriele.percoco@demetrix.it:003Cadorna1"
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 3,
                "Mapped_and_Validated_Objects": "3-3",
                "Mapped_and_NOT_Validated_Objects": "0-3"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "3/3",
                "Object NOT written to Orion Context Broker": "0/3",
                "Object SKIPPED": "0/3"

            }
        }
    ]
}