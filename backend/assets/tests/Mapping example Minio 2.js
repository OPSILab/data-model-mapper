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
            "NGSI_entity": true,
            "ignoreValidation": false,
            "mappingReport": false,
            "targetDataModel": "Data Model name, according to the related Schema contained in the DataModels folder",
            "rowStart": 0,
            "rowEnd": 1000,
            "delimiter": ",",
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
        "dataModelID": "68d6b07557c0b362add9a8c9",
        "sourceDataMinio": {
            "name": "gabriele.percoco@demetrix.it/Data model mapper/source.json",
            "bucket": "default",
            "etag": "91e4b58581df45833f8f9b72db4b61c3"
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