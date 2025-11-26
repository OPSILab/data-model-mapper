module.exports = {
    body: {
        "sourceDataType": "csv",
        "mapData": {
            "e": "a",
            "f": "a",
            "targetDataModel": "DataModelTemp",
            "entitySourceId": "a",
            "type": "a"
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
        "sourceData": "a;b;c\r\n1;2;3"
    },
    response: [
        {
            "e": "1",
            "f": "1"
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