module.exports = {
    body: {
        "sourceDataType": "geojson",
        "sourceData": {
            "type": "FeatureCollection",
            "features": [
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
                    }
                }
            ]
        },
        "mapData": {
            "name": "properties.BIKE_SH",
            "location": "geometry",
            "totalSlotNumber": "properties.STALLI",
            "entitySourceId": [
                "properties.BIKE_SH"
            ],
            "address": {
                "streetAddress": "properties.INDIRIZZO"
            },
            "targetDataModel": "DataModelTemp"
        },
        "dataModel": {
            "$schema": "http://json-schema.org/schema#",
            "$id": "dataModels/DataModelTemp.json",
            "title": "FIWARE - Transportation / Bike Hire Docking Station",
            "description": "Bike Hire Docking Station",
            "type": "object",
            "required": [
                "id",
                "type",
                "name"
            ],
            "anyOf": [
                {
                    "required": [
                        "location"
                    ]
                },
                {
                    "required": [
                        "address"
                    ]
                }
            ],
            "allOf": [
                {
                    "$ref": "common-schema.json#/definitions/GSMA-Commons"
                },
                {
                    "$ref": "common-schema.json#/definitions/Location-Commons"
                },
                {
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "DataModel"
                            ],
                            "description": "NGSI Entity type"
                        },
                        "totalSlotNumber": {
                            "type": "integer",
                            "minimum": 1
                        },
                        "freeSlotNumber": {
                            "type": "integer",
                            "minimum": 0
                        },
                        "availableBikeNumber": {
                            "type": "integer",
                            "minimum": 0
                        },
                        "outOfServiceSlotNumber": {
                            "type": "integer",
                            "minimum": 0
                        },
                        "openingHours": {
                            "type": "string"
                        },
                        "status": {
                            "type": "string",
                            "enum": [
                                "working",
                                "outOfService",
                                "withIncidence",
                                "full",
                                "almostFull",
                                "empty",
                                "almostEmpty"
                            ]
                        },
                        "owner": {
                            "type": "string"
                        },
                        "provider": {
                            "type": "object"
                        },
                        "contactPoint": {
                            "type": "object"
                        }
                    }
                }
            ]
        }
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
            "type": "DataModel",
            "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:001Duomo1"
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
            "type": "DataModel",
            "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:002SanBabila"
        },
        {
            "error": "Cannot read properties of undefined (reading 'BIKE_SH')",
            "tips": "Try to set disableAjv=true in config.js"
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