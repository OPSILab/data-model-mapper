module.exports = {
    body: {
        "sourceDataType": "json",
        "sourceData": [{
            "institution": "University",
            "name": "UNIPA",
            "degree": "master",
            "semester": "1",
            "applicationPeriodFrom": "01/10/2022",
            "applicationPeriodTo": "01/03/2023"
        }],
        "mapData": {

            "outputId": "static:searchOutput1",
            "title": "static:Search output",
            "type": "static:string",
            "language": "static:English",
            "description": "static:Search output element",
            "content": "encode:base64:[\"institution\", \"static:-\", \"name\", \"static:-\", \"degree\", \"static:-\", \"semester\", \"static:-\", \"applicationPeriodFrom\", \"static:-\", \"applicationPeriodTo\"]",
            "contentType": "static:text/plain",
            "entitySourceId": "static:search",
            "targetDataModel": "DataModelTemp"
        },
        "dataModel": {
            "schema": "http://json-schema.org/schema#",
            "type": "object",
            "title": "DataModelTemp",
            "properties": {

                "outputId": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "language": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "content": {
                    "type": "string"
                },
                "contentType": {
                    "type": "string"
                }
            }
        },
        config: { NGSI_entity: false, writers: [] }

    },
    response: [
        {
            "output": {
                "outputId": "searchOutput1",
                "title": "Search output",
                "type": "string",
                "language": "English",
                "description": "Search output element",
                "content": "VW5pdmVyc2l0eS1VTklQQS1tYXN0ZXItMS0wMS8xMC8yMDIyLTAxLzAzLzIwMjM=",
                "contentType": "text/plain"
            },
            "search": "1"
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