module.exports = {
    body: {
        "sourceDataType": ".json",
        "sourceData": [{
            "institution": "University",
            "name": "UNIPA",
            "degree": "master",
            "semester": "1",
            "applicationPeriodFrom": "01/10/2022",
            "applicationPeriodTo": "01/03/2023"
        }],
        "adapterID": "search"
    },
    response: [
        {
            "output": {
                "outputId": "UniversityUNIPA",
                "title": "Search output",
                "type": "string",
                "language": "English",
                "description": "Search output element",
                "content": "VW5pdmVyc2l0eS1VTklQQS1tYXN0ZXItMS0wMS8xMC8yMDIyLTAxLzAzLzIwMjM=",
                "contentType": "text/plain"
            }
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