const { rowEnd } = require("../../config");

module.exports = {
    body: {
        "sourceDataType": "json",
        "path": "jams",
        "sourceData": {

            "endTimeMillis": 1759925460000,
            "startTimeMillis": 1759925400000,
            "startTime": "2025-10-08 12:10:00:000",
            "endTime": "2025-10-08 12:11:00:000",
            "jams": [{
                "country": "RO",
                "level": 3,
                "city": "Cluj-Napoca",
                "line": [
                    {
                        "x": 23.577028,
                        "y": 46.774555
                    },
                    {
                        "x": 23.577587,
                        "y": 46.774515
                    },
                    {
                        "x": 23.578287,
                        "y": 46.77448
                    },
                    {
                        "x": 23.578646,
                        "y": 46.774494
                    },
                    {
                        "x": 23.579086,
                        "y": 46.774564
                    }
                ],
                "speedKMH": 4.45,
                "length": 159,
                "turnType": "NONE",
                "uuid": 103203492,
                "speed": 1.23611111111111,
                "segments": [
                    {
                        "fromNode": 336753060,
                        "ID": 440860918,
                        "toNode": 336753038,
                        "isForward": false
                    }
                ],
                "roadType": 1,
                "delay": 105,
                "street": "Str. Șerpuitoare",
                "id": 103203492,
                "pubMillis": 1759925413880
            }]
        },
        "mapData": {
            "laneId": "id",
            "entitySourceId": ["city", "static:traffic", "uuid"],
            "address": {


                "addressCountry": "country",
                "addressLocality": "city",
                "streetAddress": "street"

            },
            "averageVehicleSpeed": "speedKMH",
            "location": {
                "type": "static:LineString",
                "coordinates": [
                    "foreach:line,toarray:x,y"
                ]
            },
            "targetDataModel": "DataModelTemp",
            "dateModified": "pubMillis",
            "dateObserved": "pubMillis"
        },
        "dataModel": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "$schemaVersion": "0.0.1",
            "modelTags": "",
            "title": " - Transportation / TrafficFlowObserved",
            "description": "An observation of traffic flow conditions at a certain place and time.",
            "type": "object",
            "allOf": [
                {
                    "$ref": "https://smart-data-models.github.io/data-models/common-schema.json#/definitions/GSMA-Commons"
                },
                {
                    "$ref": "https://smart-data-models.github.io/data-models/common-schema.json#/definitions/Location-Commons"
                },
                {
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "TrafficFlowObserved"
                            ],
                            "description": "Property. NGSI Entity type. It has to be TrafficFlowObserved"
                        },
                        "laneId": {
                            "type": "integer",
                            "minimum": 1,
                            "description": "Property. Lane identifier. Model:'https://schema.org/Number'. Lane identification is done using the conventions defined by RoadSegment entity which are based on [OpenStreetMap](http://wiki.openstreetmap.org/wiki/Forward_%26_backward,_left_%26_right)"
                        },
                        "refRoadSegment": {
                            "type": "string",
                            "format": "uri",
                            "description": "Relationship. Concerned road segment on which the observation has been made. Model:'https://schema.org/URL'. Reference to an entity of type RoadSegment"
                        },
                        "dateObserved": {
                            "type": "string",
                            "description": "Property. The date and time of this observation in ISO8601 UTC format. It can be represented by an specific time instant or by an ISO8601 interval. As a workaround for the lack of support of Orion Context Broker for datetime intervals, it can be used two separate attributes: `dateObservedFrom`, `dateObservedTo`. [DateTime](https://schema.org/DateTime) or an ISO8601 interval represented as [Text](https://schema.org/Text). Model:'https://schema.org/DateTime'"
                        },
                        "dateObservedFrom": {
                            "type": "string",
                            "format": "date-time",
                            "description": "Property. Observation period start date and time. See `dateObserved`. Model:'https://schema.org/Datetime'"
                        },
                        "dateObservedTo": {
                            "type": "string",
                            "format": "date-time",
                            "description": "Property. Observation period end date and time. See `dateObserved`. Model:'https://schema.org/Datetime'"
                        },
                        "intensity": {
                            "type": "number",
                            "minimum": 0,
                            "description": "Property. Total number of vehicles detected during this observation period. Model:'https://schema.org/Number'"
                        },
                        "occupancy": {
                            "type": "number",
                            "minimum": 0,
                            "maximum": 1,
                            "description": "Property. Fraction of the observation time where a vehicle has been occupying the observed lane. Model:'https://schema.org/Number'"
                        },
                        "averageVehicleSpeed": {
                            "type": "number",
                            "minimum": 0,
                            "description": "Property. Average speed of the vehicles transiting during the observation period. Model:'https://schema.org/Number'. Units:'Kilometer per hour (Km/h)'"
                        },
                        "averageVehicleLength": {
                            "type": "number",
                            "minimum": 0,
                            "description": "Property. Average length of the vehicles transiting during\n    the observation period. Model:'https://schema.org/Number'. Units:'meter (m)'"
                        },
                        "averageGapDistance": {
                            "type": "number",
                            "minimum": 0,
                            "description": "Property. Average gap distance between consecutive vehicles. Model:'https://schema.org/Number'. Units:'meter (m)'"
                        },
                        "congested": {
                            "type": "boolean",
                            "description": "Property.  Flags whether there was a traffic congestion during the observation period in the referred lane. The absence of this attribute means no traffic congestion. Model:'https://schema.org/Boolean'"
                        },
                        "averageHeadwayTime": {
                            "type": "number",
                            "minimum": 0,
                            "description": "Property. Average headway time. Headway time is the time ellapsed between two consecutive vehicles. Model:'https://schema.org/Number'. Units:'second (s)'"
                        },
                        "laneDirection": {
                            "type": "string",
                            "enum": [
                                "forward",
                                "backward"
                            ],
                            "description": "Property. Usual direction of travel in the lane referred by this observation. This attribute is useful when the observation is not referencing any road segment, allowing to know the direction of travel of the traffic flow observed. Model:'https://schema.org/Text'. Enum:forward, backward'. See RoadSegment for a description of the semantics of these values"
                        },
                        "reversedLane": {
                            "type": "boolean",
                            "description": "Property. Flags whether traffic in the lane was reversed during the observation period. The absence of this attribute means no lane reversion. Model:'https://schema.org/Boolean'"
                        },
                        "vehicleType": {
                            "type": "string",
                            "description": "Property. Type of vehicle from the point of view of its structural characteristics. Model:'https://schema.org/Text'. Enum:'agriculturalVehicle, bicycle, bus, minibus, car, caravan, tram, tanker, carWithCaravan, carWithTrailer, lorry, moped, motorcycle, motorcycleWithSideCar, motorscooter, trailer, van, constructionOrMaintenanceVehicle, trolley, binTrolley, sweepingMachine, cleaningTrolley'",
                            "enum": [
                                "agriculturalVehicle",
                                "bicycle",
                                "bus",
                                "minibus",
                                "car",
                                "caravan",
                                "tram",
                                "tanker",
                                "carWithCaravan",
                                "carWithTrailer",
                                "lorry",
                                "moped",
                                "motorcycle",
                                "motorcycleWithSideCar",
                                "motorscooter",
                                "trailer",
                                "van",
                                "constructionOrMaintenanceVehicle",
                                "trolley",
                                "binTrolley",
                                "sweepingMachine",
                                "cleaningTrolley"
                            ]
                        },
                        "vehicleSubType": {
                            "type": "string",
                            "description": "Property. It allows to specify a sub type of `vehicleType`, eg if the `vehicleType` is set to `Lorry` the `vehicleSubType` may be `OGV1` or `OGV2` to convey more information about the exact type of vehicle"
                        }
                    }
                }
            ],
            "required": [
                "id",
                "type",
                "dateObserved"
            ],
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "TrafficFlowObserved"
                    ],
                    "description": "Property. NGSI Entity type. It has to be TrafficFlowObserved"
                },
                "laneId": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Property. Lane identifier. Model:'https://schema.org/Number'. Lane identification is done using the conventions defined by RoadSegment entity which are based on [OpenStreetMap](http://wiki.openstreetmap.org/wiki/Forward_%26_backward,_left_%26_right)"
                },
                "refRoadSegment": {
                    "type": "string",
                    "format": "uri",
                    "description": "Relationship. Concerned road segment on which the observation has been made. Model:'https://schema.org/URL'. Reference to an entity of type RoadSegment"
                },
                "dateObserved": {
                    "type": "string",
                    "description": "Property. The date and time of this observation in ISO8601 UTC format. It can be represented by an specific time instant or by an ISO8601 interval. As a workaround for the lack of support of Orion Context Broker for datetime intervals, it can be used two separate attributes: `dateObservedFrom`, `dateObservedTo`. [DateTime](https://schema.org/DateTime) or an ISO8601 interval represented as [Text](https://schema.org/Text). Model:'https://schema.org/DateTime'"
                },
                "dateObservedFrom": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Property. Observation period start date and time. See `dateObserved`. Model:'https://schema.org/Datetime'"
                },
                "dateObservedTo": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Property. Observation period end date and time. See `dateObserved`. Model:'https://schema.org/Datetime'"
                },
                "intensity": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Property. Total number of vehicles detected during this observation period. Model:'https://schema.org/Number'"
                },
                "occupancy": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1,
                    "description": "Property. Fraction of the observation time where a vehicle has been occupying the observed lane. Model:'https://schema.org/Number'"
                },
                "averageVehicleSpeed": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Property. Average speed of the vehicles transiting during the observation period. Model:'https://schema.org/Number'. Units:'Kilometer per hour (Km/h)'"
                },
                "averageVehicleLength": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Property. Average length of the vehicles transiting during\n    the observation period. Model:'https://schema.org/Number'. Units:'meter (m)'"
                },
                "averageGapDistance": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Property. Average gap distance between consecutive vehicles. Model:'https://schema.org/Number'. Units:'meter (m)'"
                },
                "congested": {
                    "type": "boolean",
                    "description": "Property.  Flags whether there was a traffic congestion during the observation period in the referred lane. The absence of this attribute means no traffic congestion. Model:'https://schema.org/Boolean'"
                },
                "averageHeadwayTime": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Property. Average headway time. Headway time is the time ellapsed between two consecutive vehicles. Model:'https://schema.org/Number'. Units:'second (s)'"
                },
                "laneDirection": {
                    "type": "string",
                    "enum": [
                        "forward",
                        "backward"
                    ],
                    "description": "Property. Usual direction of travel in the lane referred by this observation. This attribute is useful when the observation is not referencing any road segment, allowing to know the direction of travel of the traffic flow observed. Model:'https://schema.org/Text'. Enum:forward, backward'. See RoadSegment for a description of the semantics of these values"
                },
                "reversedLane": {
                    "type": "boolean",
                    "description": "Property. Flags whether traffic in the lane was reversed during the observation period. The absence of this attribute means no lane reversion. Model:'https://schema.org/Boolean'"
                },
                "vehicleType": {
                    "type": "string",
                    "description": "Property. Type of vehicle from the point of view of its structural characteristics. Model:'https://schema.org/Text'. Enum:'agriculturalVehicle, bicycle, bus, minibus, car, caravan, tram, tanker, carWithCaravan, carWithTrailer, lorry, moped, motorcycle, motorcycleWithSideCar, motorscooter, trailer, van, constructionOrMaintenanceVehicle, trolley, binTrolley, sweepingMachine, cleaningTrolley'",
                    "enum": [
                        "agriculturalVehicle",
                        "bicycle",
                        "bus",
                        "minibus",
                        "car",
                        "caravan",
                        "tram",
                        "tanker",
                        "carWithCaravan",
                        "carWithTrailer",
                        "lorry",
                        "moped",
                        "motorcycle",
                        "motorcycleWithSideCar",
                        "motorscooter",
                        "trailer",
                        "van",
                        "constructionOrMaintenanceVehicle",
                        "trolley",
                        "binTrolley",
                        "sweepingMachine",
                        "cleaningTrolley"
                    ]
                },
                "vehicleSubType": {
                    "type": "string",
                    "description": "Property. It allows to specify a sub type of `vehicleType`, eg if the `vehicleType` is set to `Lorry` the `vehicleSubType` may be `OGV1` or `OGV2` to convey more information about the exact type of vehicle"
                }
            }
        },
        config: { disableAjv: true, rowEnd : 1, mappingReport: false }
    },
    response: [
        {
            "laneId": 103203492,
            "address": {
                "addressCountry": "RO",
                "addressLocality": "Cluj-Napoca",
                "streetAddress": "Str. Șerpuitoare"
            },
            "averageVehicleSpeed": 4.45,
            "location": {
                "type": "LineString",
                "coordinates": [
                    [
                        23.577028,
                        46.774555
                    ],
                    [
                        23.577587,
                        46.774515
                    ],
                    [
                        23.578287,
                        46.77448
                    ],
                    [
                        23.578646,
                        46.774494
                    ],
                    [
                        23.579086,
                        46.774564
                    ]
                ]
            },
            "dateModified": "2025-10-08T12:10:13.880Z",
            "dateObserved": "1759925413880",
            "type": "TrafficFlowObserved",
            "id": "urn:ngsi-ld:TrafficFlowObserved:gabriele.percoco@demetrix.it:Cluj-Napocatraffic103203492"
        }
    ]
}