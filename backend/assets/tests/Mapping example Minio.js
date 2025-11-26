module.exports = {
    body: {
        "sourceDataType": "json",
        "path": ".root$$$",
        "mapData": {
            "e": "a",
            "f": "a",
            "entitySourceId": "a",
            "targetDataModel": "DataModelTemp"
        },
        "config": {
            "host": "localhost",
            "NGSI_entity": true,
            "ignoreValidation": true,
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
            "entityDefaultPrefix": "ds",
            "minioWriter": {
                "defaultBucketName": "data model mapper",
                "defaultOutputBucketName": "data model mapper",
                "subscribe": {
                    "all": false,
                    "buckets": []
                }
            }
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
        "sourceDataMinio": {
            "name": "gabriele.percoco@demetrix.it/Data model mapper/source.json",
            "bucket": "default",
            "etag": "58a9a7dee95c6eab0545d12fe933d83e"
        }
    },
    response: [
        {
            "e": "a1",
            "f": "a1"
        },
        {
            "e": "a2",
            "f": "a2"
        },
        {
            "e": "a3",
            "f": "a3"
        },
        {
            "e": "a4",
            "f": "a4"
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 4,
                "Mapped_and_Validated_Objects": "4-4",
                "Mapped_and_NOT_Validated_Objects": "0-4"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "4/4",
                "Object NOT written to Orion Context Broker": "0/4",
                "Object SKIPPED": "0/4"
            }
        }
    ]
}