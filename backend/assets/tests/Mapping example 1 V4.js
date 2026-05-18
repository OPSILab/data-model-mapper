const axios = require("axios")
const authorization = require("../../token")
const fs = require("fs")
const bikeMap = JSON.parse(fs.readFileSync("./examples/1. BikeHireDockingStationMap.json"))
const bikeSchema = JSON.parse(fs.readFileSync("./dataModels/BikeHireDockingStation.json"))
const config = require("../../config")

module.exports = {
    pre: async () => {
        console.log("Pre test")
        async function insertFlow(response) {
            let sourceData = [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            9.1890425716699,
                            45.464725436014575
                        ]
                    },
                    "properties": {
                        "ID": 1,
                        "BIKE_SH": "001 Duomo 1",
                        "INDIRIZZO": "P.za Duomo",
                        "ANNO": 2008,
                        "STALLI": 24,
                        "LOCALIZ": "Carreggiata"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            9.197596296602454,
                            45.46647450916635
                        ]
                    },
                    "properties": {
                        "ID": 2,
                        "BIKE_SH": "002 San Babila",
                        "INDIRIZZO": "P.za S.Babila",
                        "ANNO": 2008,
                        "STALLI": 24,
                        "LOCALIZ": "Marciapiede"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            9.175674275275924,
                            45.46800482576666
                        ]
                    },
                    "properties": {
                        "ID": 3,
                        "BIKE_SH": "003 Cadorna 1",
                        "INDIRIZZO": "P.za Cadorna",
                        "ANNO": 2008,
                        "STALLI": 21,
                        "LOCALIZ": "Marciapiede"
                    }
                }
            ]
            let insertingMapBody = {
                id: "bike_1",
                name: "bike_1",
                status: "status",
                description: "description",
                map: bikeMap,
                dataModel: bikeSchema,
                sourceDataType: "json",
                config : {noSchema : false},
                path: "",
                sourceData
            }
            response = (await axios.post("http://localhost:5500/api/map/register", insertingMapBody, { headers: { authorization } })).data
            let id = response._id
            let insertingSourceBody = {
                name: "bike_1",
                id: "bike_1",
                source: sourceData,
                mapRef: id
            }
            response = (await axios.post("http://localhost:5500/api/source", insertingSourceBody, { headers: { authorization } })).data
        }

        let response

        /**
         * {
          name,
          sourceDataMinio: {
            name: minioObjName,
            bucket,
            etag,
          },
          status: status,
          path,
          description: description,
          source: sourceData,
          mapRef,
        }
         */

        try {
            response = (await axios.get("http://localhost:5500/api/source?name=bike_1")).data
            if (!response)
                await insertFlow(response)
        }
        catch (error) {
            await insertFlow(response)
        }

    },

    body: {
        "sourceDataType": "geojson",
        "sourceDataID": "bike_1",
        "mapPathIn": "1. BikeHireDockingStationMap.json",
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