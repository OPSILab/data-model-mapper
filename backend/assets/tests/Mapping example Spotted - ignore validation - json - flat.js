module.exports = {
    body: {
        "sourceDataType": "json",
        "sourceData": [
            {
                "FieldIn": "value "
            }
        ],
        "mapData": {
            "FieldOut": "FieldIn",
            "entitySourceId": [
                "static:MongoID"
            ],
            "targetDataModel": "Spotted"
        },
        "dataModelIn": "Spotted",
        "config": {
            "ignoreValidation": true
        }
    },
    response: [
        {
            "FieldOut": "value ",
            "id": "urn:ngsi-ld:Spotted:gabriele.percoco@demetrix.it:MongoID-1",
            "type": "Spotted"
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 1,
                "Mapped_and_Validated_Objects": "1-1",
                "Mapped_and_NOT_Validated_Objects": "0-1"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "1/1",
                "Object NOT written to Orion Context Broker": "0/1",
                "Object SKIPPED": "0/1"
            }
        }
    ]
}