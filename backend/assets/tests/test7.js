module.exports = {
    body: {
        "sourceDataType": "json",
        "mapData": {
            "e": "a",
            "f": "a"
        },
        "config": {
            "NGSI_entity": false,
            "ignoreValidation": true,
            "mappingReport": true,
            "targetDataModel": "Data Model name, according to the related Schema contained in the DataModels folder",
            "rowStart": 0,
            "rowEnd": 1000,
            "delimiter": ";",
            "endLine": "\n",
            "deleteEmptySpaceAtBeginning": true,
            "site": "SomeRZ",
            "service": "SomeService",
            "group": "CSV",
            "entityNameField": "entitySourceId",
            "entityDefaultPrefix": "ds",
            "writers": ["fileWriter"]
        },
        "dataModel": {
            "$schema": "http://json-schema.org/schema#",
            "$id": "dataModels/DataModelTemp.json",
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
        "sourceData": [
            {
                "a": "a",
                "b": {
                    "c": "c"
                }
            }
        ]
    },
    response: [
        {
            "e": "a",
            "f": "a"
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