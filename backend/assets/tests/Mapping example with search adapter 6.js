module.exports = {
    body: {
        "sourceDataType": "json",
        "sourceData": [
            {
                "id": 3,
                "federalStateId": 2,
                "name": "Biotechnologie BA (major subject)",
                "semester": "Winter Semester 2022",
                "institution": "Hamburg University of Applied Sciences",
                "degree": "Bachelor",
                "applicationPeriodFrom": "2022-06-01T10:48:33.821Z",
                "applicationPeriodTo": "2022-07-15T10:48:33.821Z"
            }
        ],
        "adapterID": "adapter apache camel"
    },
    response: [

        {
            "outputId": "Hamburg University of Applied SciencesBiotechnologie BA (major subject)",
            "title": "Search output",
            "type": "string",
            "language": "English",
            "description": "Search output element",
            "content": "SGFtYnVyZyBVbml2ZXJzaXR5IG9mIEFwcGxpZWQgU2NpZW5jZXMtQmlvdGVjaG5vbG9naWUgQkEgKG1ham9yIHN1YmplY3QpLUJhY2hlbG9yLVdpbnRlciBTZW1lc3RlciAyMDIyLTIwMjItMDYtMDFUMTA6NDg6MzMuODIxWi0yMDIyLTA3LTE1VDEwOjQ4OjMzLjgyMVo=",
            "contentType": "text/plain"
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