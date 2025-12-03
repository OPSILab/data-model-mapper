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
            "mappingReport": false,
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
            "f": "a1",
            "id": "urn:ngsi-ld:Thing:SomeRZ:SomeService:CSV:a1",
            "type": "Thing"
        },
        {
            "e": "a2",
            "f": "a2",
            "id": "urn:ngsi-ld:Thing:SomeRZ:SomeService:CSV:a2",
            "type": "Thing"
        },
        {
            "e": "a3",
            "f": "a3",
            "id": "urn:ngsi-ld:Thing:SomeRZ:SomeService:CSV:a3",
            "type": "Thing"
        },
        {
            "e": "a4",
            "f": "a4",
            "id": "urn:ngsi-ld:Thing:SomeRZ:SomeService:CSV:a4",
            "type": "Thing"
        }
    ]
}