module.exports = {
    body: {
        "sourceDataIn": "5. ServiceModel.csv",
        "mapPathIn": "5. ServiceModelMap.json",
        "dataModelIn": "ServiceModel",
        "config": {
            "delimiter": ";",
            "rowEnd": 1
        }
    },
    response: [
        {
            "identifier": "ID1",
            "title": "serviceTitle1",
            "issued": "12",
            "createdByUserId": "service.manager1",
            "versionInfo": "1.0",
            "serviceIconUrl": "http://www.example1.com",
            "status": "Completed",
            "isPublicService": true,
            "hasInfo": {
                "identifier": "ID1",
                "title": "serviceTitle1",
                "status": "Completed",
                "keyword": ["key","key0","key1"],
                "description": {
                    "locale": "alb1",
                    "description": "albania1"
                },
                "hasCost": [{identifier: "e", code: "EUR", hasCost: 3, description: [{locale: "af", description: 3}], ifAccessedThrough: "RESTService"}],
                "processingTime": "P1Y1W1D",
                "hasCompetentAuthority": {
                    "identifier": "identifier1",
                    "title": "title1",
                    "hasAddress": "hasAddress1",
                    "prefLabel": "prefLabel1",
                    "spatial": "spatial1"
                },
                "spatial": "spatial1",
                "hasContactPoint": {
                    "email": "email@email.com",
                    "faxNumber": "faxNumber",
                    "telephone": "+01 123456789",
                    "identifier": "identifier1",
                    "openingHours": "08:00-20:01",
                    "hoursAvailable": 12,
                    "url": "http://www.example2.com"
                }
            },
            "hasServiceInstance": {
                "serviceProvider": {
                    "businessId": "businessId1",
                    "name": "hasServiceInstanceserviceProvidername",
                    "hasAddress": "name",
                    "postalcode": "90015",
                    "city": "city",
                    "state": "state",
                    "country": "country",
                    "email": "email@email.com",
                    "telephone": "+01 123456789",
                    "jurisdiction": "jurisdiction"
                },
                "endpointConnector": {
                    "endpoint": {
                        "accessURL": "http://www.connector.com",
                        "endpointInformation": "information",
                        "endpointDocumentation": "documentation",
                        "path": "path"
                    },
                    "connectorId": "connectorID"
                },
                "serviceUrls": {
                    "libraryDomain": "libraryDomain",
                    "loginUri": "http://www.login.com",
                    "linkingRedirectUri": "http://www.logged.com",
                    "objectionUri": "http://www.objectionUri.com",
                    "notificationUri": "http://www.notificationUri.com"
                },
                "dataController": {
                    "piiController": "piiController",
                    "organizationName": "organizationName",
                    "hasContact": "hasContact",
                    "hasAddress": "hasAddress",
                    "email": "email@email.com",
                    "telephone": "+01 123456789",
                    "operatorName": "operator"
                }
            },
            "hasUsageRule": ["usageId", "usageName", "usageType"],
            "isPersonalDataHandling": ["isPersonalDataHandling0","isPersonalDataHandling1"]
        },

        {
            "MAPPING_REPORT": {
                "Processed_objects": 3,
                "Mapped_and_Validated_Objects": "3-3",
                "Mapped_and_NOT_Validated_Objects": "0-3"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "3/3",
                "Object NOT written to Orion Context Broker": "0/3",
                "Object SKIPPED": "0/3"
            }
        }
    ]

}