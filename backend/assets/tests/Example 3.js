module.exports = {//NOTE: since it's not NGSI, the object will not be written to CB and it's expected to fail
    body: {
        "sourceDataType": "csv",
        "sourceDataURL": "http://localhost:12345/assets/bike_ciclabili.csv",
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
            "e": "9001",
            "f": "1064"
        },
        {
            "e": "9002",
            "f": "3377"
        },
        {
            "e": "9003",
            "f": "3377"
        },
        {
            "e": "9004",
            "f": "3377"
        },
        {
            "e": "9005",
            "f": "3377"
        },
        {
            "e": "9006",
            "f": "1360"
        },
        {
            "e": "9009",
            "f": "4068"
        },
        {
            "e": "9011",
            "f": "1"
        },
        {
            "e": "9012",
            "f": "1"
        },
        {
            "e": "9013",
            "f": "5144"
        }
    ]
}