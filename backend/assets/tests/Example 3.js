module.exports = {//NOTE: since it's not NGSI, the object will not be written to CB and it's expected to fail
    body: {
        "sourceDataType": "csv",
        "sourceDataURL": "https://dati.comune.milano.it/dataset/ceda0264-24f3-4869-9a2d-411906f0abab/resource/18b0480e-5e7d-4a7d-902f-30cc76ad4f9f/download/bike_ciclabili.csv",
        "mapData": {
            "e": "id_amat",
            "f": "id_via"
        },
        "dataModel": {
            "$schema": "http://json-schema.org/schema#",
            "title": "DataModelTemp",
            "description": "Bike Hire Docking Station",
            "type": "object",
            "properties": {
                "e": {
                    "type": "string"
                },
                "f": {
                    "type": "string"
                }
            }
        },
        "config": {
            "NGSI_entity": false,
            "ignoreValidation": false,
            "mappingReport": true,
            "targetDataModel": "Data Model name, according to the related Schema contained in the DataModels folder",
            "rowStart": 0,
            "rowEnd": 10,
            "delimiter": ";",
            "endLine": "\n",
            "deleteEmptySpaceAtBeginning": true,
            "site": "SomeRZ",
            "service": "SomeService",
            "group": "CSV",
            "entityNameField": "entitySourceId",
            "entityDefaultPrefix": "ds"
        }
    },
    response: [
        {
            "e": "1",
            "f": "1064"
        },
        {
            "e": "2",
            "f": "3377"
        },
        {
            "e": "3",
            "f": "3377"
        },
        {
            "e": "4",
            "f": "3377"
        },
        {
            "e": "5",
            "f": "3377"
        },
        {
            "e": "6",
            "f": "1360"
        },
        {
            "e": "9",
            "f": "4068"
        },
        {
            "e": "11",
            "f": "5144"
        },
        {
            "e": "12",
            "f": "1414"
        },
        {
            "e": "13",
            "f": "2153"
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 4093,
                "Mapped_and_Validated_Objects": "10-4093",
                "Mapped_and_NOT_Validated_Objects": "4083-4093"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "0/10",
                "Object NOT written to Orion Context Broker": "10/10",
                "Object SKIPPED": "0/10",
                "details": [
                    {
                        "count": "1",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "1",
                            "f": "1064"
                        }
                    },
                    {
                        "count": "1",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "1",
                                "f": "1064"
                            }
                        }
                    },
                    {
                        "count": "2",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "2",
                            "f": "3377"
                        }
                    },
                    {
                        "count": "2",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "2",
                                "f": "3377"
                            }
                        }
                    },
                    {
                        "count": "3",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "3",
                            "f": "3377"
                        }
                    },
                    {
                        "count": "3",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "3",
                                "f": "3377"
                            }
                        }
                    },
                    {
                        "count": "4",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "4",
                            "f": "3377"
                        }
                    },
                    {
                        "count": "4",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "4",
                                "f": "3377"
                            }
                        }
                    },
                    {
                        "count": "5",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "5",
                            "f": "3377"
                        }
                    },
                    {
                        "count": "5",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "5",
                                "f": "3377"
                            }
                        }
                    },
                    {
                        "count": "6",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "6",
                            "f": "1360"
                        }
                    },
                    {
                        "count": "6",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "6",
                                "f": "1360"
                            }
                        }
                    },
                    {
                        "count": "7",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "9",
                            "f": "4068"
                        }
                    },
                    {
                        "count": "7",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "9",
                                "f": "4068"
                            }
                        }
                    },
                    {
                        "count": "8",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "11",
                            "f": "5144"
                        }
                    },
                    {
                        "count": "8",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "11",
                                "f": "5144"
                            }
                        }
                    },
                    {
                        "count": "9",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "12",
                            "f": "1414"
                        }
                    },
                    {
                        "count": "9",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "12",
                                "f": "1414"
                            }
                        }
                    },
                    {
                        "count": "10",
                        "response": {
                            "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                            "title": "Entity id is missing",
                            "detail": "The 'id' field is mandatory"
                        },
                        "status": 400,
                        "bodyRequest": {
                            "e": "13",
                            "f": "2153"
                        }
                    },
                    {
                        "count": "10",
                        "error": {
                            "response": {
                                "type": "https://uri.etsi.org/ngsi-ld/errors/BadRequestData",
                                "title": "Entity id is missing",
                                "detail": "The 'id' field is mandatory"
                            },
                            "status": 400,
                            "bodyRequest": {
                                "e": "13",
                                "f": "2153"
                            }
                        }
                    }
                ]
            }
        }
    ]
}