module.exports = {
    sample: (email) => {
        return {
            "Field 1": "[Field 1 value 1,Field 1 value 2]",
            "Field 2": [
                "Field 2 value 1",
                "Field 2 value 2"
            ],
            "Field 3": [
                "Field 3 value 1",
                "Field 3 value 2"
            ],
            "Field 31": [
                {
                    "Field 31a": "Field 31a",
                    "Field 31b": "Field 31b"
                }
            ],
            "Field 32": 33,
            "Field 33": 33,
            "Field 4": {
                "Field 4a": "[Field 4a value 1,Field 4a value 2]",
                "Field 4b": [
                    "Field 4b value 1",
                    "Field 4b value 2"
                ],
                "Field 4c": [
                    "Field 4c value 1",
                    "Field 4c value 1"
                ],
                "Field 4d": [
                    {
                        "Field 4da": "Field 4da",
                        "Field 4db": "Field 4db"
                    },
                    {
                        "Field 4da1": "Field 4da1",
                        "Field 4db1": "Field 4db1"
                    }
                ]
            },
            "Field 5": 5,
            "Field 6": 6,
            "Field 7": "7",
            "type": "Example",
            "id": "urn:ngsi-ld:Example:" + email + ":ExampleDataModel-1"
        }
    },
    sample_non_ngsi: {
        "Field 1": "Value 1",
        "Field 2": 2,
        "Field 3": [
            1,
            2,
            3
        ],
        "Field 4": {
            "Field 1": "Value 1",
            "Field 2": 2,
            "Field 3": [
                1,
                2,
                3
            ]
        }
    },
    sample_schema_non_ngsi: {
        "$schema": "http://json-schema.org/schema#",
        "type": "object",
        "properties": {
            "Field 1": {
                "type": "string"
            },
            "Field 2": {
                "type": "integer"
            },
            "Field 3": {
                "type": "array",
                "items": {
                    "type": "integer"
                }
            },
            "Field 4": {
                "type": "object",
                "properties": {
                    "Field 1": {
                        "type": "string"
                    },
                    "Field 2": {
                        "type": "integer"
                    },
                    "Field 3": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    }
                },
                "required": [
                    "Field 1",
                    "Field 2",
                    "Field 3"
                ]
            }
        },
        "required": [
            "Field 1",
            "Field 2",
            "Field 3",
            "Field 4"
        ]
    },
    map_non_ngsi: {
        "Field 1": "Field 1",
        "Field 2": "Field 2",
        "Field 3": "Field 3",
        "Field 4": {
            "Field 1": "Field 4 1",
            "Field 2": "Field 4 2",
            "Field 3": "Field 4 3"
        }
    },
    source_non_ngsi: "Field 1;Field 2;Field 3;Field 4 1;Field 4 2;Field 4 3\r\nValue 1;2;[1,2,3];Value 1;2;[1,2,3]",
    example_1: (email) => {
        return {
            "name": "001 Duomo 1",
            "location": {
                "type": "Point",
                "coordinates": [
                    9.1890425716699,
                    45.464725436014575
                ]
            },
            "totalSlotNumber": 24,
            "address": {
                "streetAddress": "P.za Duomo"
            },
            "type": "DataModel",
            "id": "urn:ngsi-ld:DataModel:" + email + ":001Duomo1"
        }
    },
    example_1_full: (email) => {
        return [
            {
                "name": "001 Duomo 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.1890425716699,
                        45.464725436014575
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Duomo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:001Duomo1"
            },
            {
                "name": "002 San Babila",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.197596296602454,
                        45.46647450916635
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za S.Babila"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:002SanBabila"
            },
            {
                "name": "003 Cadorna 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.175674275275924,
                        45.46800482576666
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "P.za Cadorna"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:003Cadorna1"
            },
            {
                "name": "004 Lanza",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.181982903152086,
                        45.47227586265889
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "L.go Greppi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:004Lanza"
            },
            {
                "name": "005 Università Cattolica",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.176510469619469,
                        45.46304362370177
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za S.Ambrogio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:005UniversitaCattolica"
            },
            {
                "name": "006 San Giorgio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.183633584585358,
                        45.46089124802226
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za S.Giorgio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:006SanGiorgio"
            },
            {
                "name": "007 Santa Maria Beltrade",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.186781880321773,
                        45.462787531397915
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za S.Maria Beltrade"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:007SantaMariaBeltrade"
            },
            {
                "name": "008 Velasca",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.1902273288414,
                        45.4600549567641
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Velasca"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:008Velasca"
            },
            {
                "name": "009 Santo Stefano",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.195339228952989,
                        45.46236662558186
                    ]
                },
                "totalSlotNumber": 18,
                "address": {
                    "streetAddress": "P.za S.Stefano"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:009SantoStefano"
            },
            {
                "name": "010 Missori",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.188164701368793,
                        45.46129681755833
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "P.za Missori"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:010Missori"
            },
            {
                "name": "011 Castello  Acquario civico ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.179437196955785,
                        45.472455046320675
                    ]
                },
                "totalSlotNumber": 18,
                "address": {
                    "streetAddress": "Via Gadio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:011CastelloAcquariocivico"
            },
            {
                "name": "012 San Lorenzo  Colonne ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.181492029991068,
                        45.45860395234187
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Pio IV"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:012SanLorenzoColonne"
            },
            {
                "name": "013 Senato",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.197466352839745,
                        45.470548362181674
                    ]
                },
                "totalSlotNumber": 18,
                "address": {
                    "streetAddress": "Via Senato"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:013Senato"
            },
            {
                "name": "014 San Barnaba  H Mangiagalli ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.19853375185194,
                        45.459517598528194
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "Via S. Barnaba"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:014SanBarnabaHMangiagalli"
            },
            {
                "name": "015 Cantore",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.172824023936837,
                        45.455802786165826
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Cantore"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:015Cantore"
            },
            {
                "name": "016 Moscova",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.18461601100957,
                        45.47753190894335
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "L.go La Foppa"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:016Moscova"
            },
            {
                "name": "017 Legnano  Arena civica ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.1808760137557,
                        45.47720566958185
                    ]
                },
                "totalSlotNumber": 18,
                "address": {
                    "streetAddress": "Via Legnano"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:017LegnanoArenacivica"
            },
            {
                "name": "018 Tommaseo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.166553380626823,
                        45.46950719052524
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Tommaseo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:018Tommaseo"
            },
            {
                "name": "019 Santa Sofia",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.188173260306684,
                        45.45633500495002
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via S.Sofia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:019SantaSofia"
            },
            {
                "name": "020 Erculea",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.18961970516238,
                        45.45908582429938
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "P.za Erculea"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:020Erculea"
            },
            {
                "name": "021 Università Bocconi 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.19045387546217,
                        45.44857963375735
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Bocconi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:021UniversitaBocconi1"
            },
            {
                "name": "022 Medaglie d Oro 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.20410207265532,
                        45.451211907132645
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "C.so Lodi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:022MedagliedOro1"
            },
            {
                "name": "023 Regina Margherita",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.205272953913026,
                        45.45825023698922
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "V.le Regina Margherita"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:023ReginaMargherita"
            },
            {
                "name": "024 Tricolore",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.207338257630365,
                        45.467966537513114
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "C.so Concordia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:024Tricolore"
            },
            {
                "name": "025 Centrale 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.202495891646244,
                        45.48542305284559
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Duca d Aosta sx"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:025Centrale1"
            },
            {
                "name": "026 Centrale 2",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.204257579587727,
                        45.48454094992481
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Duca d Aosta dx"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:026Centrale2"
            },
            {
                "name": "027 P.ta Venezia - Oberdan",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.204562528852325,
                        45.47467498534485
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Bastioni di P.ta Venezia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:027P.taVenezia-Oberdan"
            },
            {
                "name": "028 San Giovanni sul Muro",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.181458833705786,
                        45.467467633535
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "L.go Callas"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:028SanGiovannisulMuro"
            },
            {
                "name": "029 San Pietro in Gessate  Tribunale ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.201404037827844,
                        45.46239680137473
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "C.so P.ta Vittoria"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:029SanPietroinGessateTribunale"
            },
            {
                "name": "030 Crocetta",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.19567990442352,
                        45.45624564386215
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "L.go Crocetta"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:030Crocetta"
            },
            {
                "name": "032 Manin - Bastioni",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.198328802907929,
                        45.476861537651565
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Manin"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:032Manin-Bastioni"
            },
            {
                "name": "033 Alemagna  Triennale ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.1734899126788,
                        45.47187986641619
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Alemagna"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:033AlemagnaTriennale"
            },
            {
                "name": "034 Cairoli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.182314897768721,
                        45.467998673032
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "L.go Cairoli"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:034Cairoli"
            },
            {
                "name": "035 Torino - Carrobbio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.181736612551143,
                        45.46043604465841
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "Via Torino"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:035Torino-Carrobbio"
            },
            {
                "name": "036 San Vito",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.183720170682026,
                        45.45920369701504
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via S.Vito"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:036SanVito"
            },
            {
                "name": "037 Italia - San Martino",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.18696632414349,
                        45.45296973336811
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "C.so Italia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:037Italia-SanMartino"
            },
            {
                "name": "038 XXIV Maggio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.179172274241724,
                        45.45215506141916
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.le XXIV Maggio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:038XXIVMaggio"
            },
            {
                "name": "039 XXV Aprile",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.186705745959243,
                        45.48022914894882
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "C.so Garibaldi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:039XXVAprile"
            },
            {
                "name": "040 Morozzo della Rocca",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.168926306064774,
                        45.463975007611154
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Morozzo della Rocca"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:040MorozzodellaRocca"
            },
            {
                "name": "041 Conciliazione",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.166953721174048,
                        45.467689599679865
                    ]
                },
                "totalSlotNumber": 18,
                "address": {
                    "streetAddress": "P.za Conciliazione"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:041Conciliazione"
            },
            {
                "name": "042 San Pietro all Orto",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.195615813025647,
                        45.46608474902932
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via S.Pietro all Orto"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:042SanPietroallOrto"
            },
            {
                "name": "043 Festa del Perdono",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.194718421089794,
                        45.461307908305926
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Festa del Perdono"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:043FestadelPerdono"
            },
            {
                "name": "044 Richini  Univ. Statale ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.19293775402444,
                        45.459360840944335
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "L.go Richini"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:044RichiniUniv.Statale"
            },
            {
                "name": "045 Cantù",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.186638643595655,
                        45.46419196182558
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "Via Cantù"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:045Cantu"
            },
            {
                "name": "046 Porta Nuova",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.192834897085634,
                        45.48000363460237
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.le Principessa Clotilde"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:046PortaNuova"
            },
            {
                "name": "047 Gorizia 1  Navigli ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.177456249604894,
                        45.45232694786329
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "V.le Gorizia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:047Gorizia1Navigli"
            },
            {
                "name": "048 Gorizia 2  Navigli ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.177311184753774,
                        45.45234220374472
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "V.le Gorizia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:048Gorizia2Navigli"
            },
            {
                "name": "049 San Paolo - P.za Meda",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.193028969943617,
                        45.46644825604215
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via S.Paolo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:049SanPaolo-P.zaMeda"
            },
            {
                "name": "050 Beccaria",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.194839753590077,
                        45.464373115758214
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Beccaria"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:050Beccaria"
            },
            {
                "name": "051 Santa Maria delle Grazie",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.169799197342185,
                        45.46650823982317
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via F.lli Ruffini"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:051SantaMariadelleGrazie"
            },
            {
                "name": "052 Vittor Pisani",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.199150218802362,
                        45.480433437838286
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Vittor Pisani"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:052VittorPisani"
            },
            {
                "name": "053 Palestro 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.201720994171302,
                        45.472340155224586
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Palestro"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:053Palestro1"
            },
            {
                "name": "054 Sant Eustorgio - P.ta Ticinese",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.180706235200434,
                        45.45516864493504
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "C.so P.ta Ticinese"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:054SantEustorgio-P.taTicinese"
            },
            {
                "name": "055 Cinque Giornate",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.20706959956623,
                        45.462655149729066
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Cinque Giornate"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:055CinqueGiornate"
            },
            {
                "name": "056 Bastioni di P.ta Venezia",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.200599809162231,
                        45.475911701776944
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "V.le Città di Fiume"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:056BastionidiP.taVenezia"
            },
            {
                "name": "057 Brera",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.18755459562637,
                        45.47179161962907
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Brera"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:057Brera"
            },
            {
                "name": "058 Sant Agostino",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.169532402025292,
                        45.45892077924672
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Numa Pompilio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:058SantAgostino"
            },
            {
                "name": "059 Palestro 2",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.201514674012095,
                        45.472437806083015
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Palestro"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:059Palestro2"
            },
            {
                "name": "060 Edison",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.18355681204713,
                        45.46433242899364
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via della Posta"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:060Edison"
            },
            {
                "name": "061 Augusto",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.19817327182878,
                        45.46343076859652
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "L.go Augusto"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:061Augusto"
            },
            {
                "name": "062 Treves",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.186800739533034,
                        45.47504681280987
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "L.go Treves"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:062Treves"
            },
            {
                "name": "063 Sant Ambrogio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.174016673262322,
                        45.461969871645714
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via S.Vittore"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:063SantAmbrogio"
            },
            {
                "name": "064 Diaz",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.189875070040063,
                        45.4630092789916
                    ]
                },
                "totalSlotNumber": 33,
                "address": {
                    "streetAddress": "Via Marconi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:064Diaz"
            },
            {
                "name": "065 Bertarelli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.187530592319563,
                        45.458540232425094
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Bertarelli"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:065Bertarelli"
            },
            {
                "name": "066 Cavour  Giardini Pubblici ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.196401071546939,
                        45.47297143570702
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "P.za Cavour"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:066CavourGiardiniPubblici"
            },
            {
                "name": "067 Repubblica",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.196583281332211,
                        45.47893976603408
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za della Repubblica"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:067Repubblica"
            },
            {
                "name": "068 Rotonda della Besana",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.205351200878157,
                        45.46056594395752
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Visconti Venosta"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:068RotondadellaBesana"
            },
            {
                "name": "069 San Nazaro in Brolo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.192714893317646,
                        45.45824986807907
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za S.Nazaro in Brolo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:069SanNazaroinBrolo"
            },
            {
                "name": "070 Fatebenefratelli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.190174829577833,
                        45.47311387748866
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Fatebenefratelli"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:070Fatebenefratelli"
            },
            {
                "name": "071 Medaglie d Oro 2",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.202976247520478,
                        45.45196284904043
                    ]
                },
                "totalSlotNumber": 18,
                "address": {
                    "streetAddress": "P.za Medaglie d Oro"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:071MedagliedOro2"
            },
            {
                "name": "072 Cardinal Ferrari",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.192705775220883,
                        45.45662951882573
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "Via S.Calimero"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:072CardinalFerrari"
            },
            {
                "name": "073 Majno - Baretti",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.20498920965229,
                        45.47148749999586
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Baretti"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:073Majno-Baretti"
            },
            {
                "name": "074 Dante - San Tomaso",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.184023058009421,
                        45.46708579603621
                    ]
                },
                "totalSlotNumber": 15,
                "address": {
                    "streetAddress": "Via S.Tomaso"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:074Dante-SanTomaso"
            },
            {
                "name": "075 Cusani",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.184894566515212,
                        45.46871878137441
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Cusani"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:075Cusani"
            },
            {
                "name": "076 Mentana",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.181950451438086,
                        45.46175719222642
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Mentana"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:076Mentana"
            },
            {
                "name": "077 Sant Angelo - P.ta Nuova",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.191782193933056,
                        45.47661683856462
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "C.so P.ta Nuova"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:077SantAngelo-P.taNuova"
            },
            {
                "name": "078 Aquileia",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.163350389761062,
                        45.46086024677828
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.le Aquileia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:078Aquileia"
            },
            {
                "name": "079 Baracca",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.165068208963929,
                        45.466460504660326
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.le Baracca"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:079Baracca"
            },
            {
                "name": "080 Manzoni - Sant Erasmo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.192463195549456,
                        45.47119546709353
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za S. Erasmo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:080Manzoni-SantErasmo"
            },
            {
                "name": "081 Università Bocconi 2",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.191016181046125,
                        45.44827702493374
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "V.le Bach"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:081UniversitaBocconi2"
            },
            {
                "name": "082 dell Umanitaria",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.200606590300659,
                        45.45817428801375
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za dell Umanitaria"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:082dellUmanitaria"
            },
            {
                "name": "083 Rastrelli - Larga",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.191470057956558,
                        45.46205391180632
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Rastrelli"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:083Rastrelli-Larga"
            },
            {
                "name": "084 Cadorna 2",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.17614825150093,
                        45.46905640422827
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Paleocapa"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:084Cadorna2"
            },
            {
                "name": "085 D Ancona",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.175796064893289,
                        45.465687081670204
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "Via Buttinone"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:085DAncona"
            },
            {
                "name": "086 Mascagni",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.203100482787017,
                        45.46538991619139
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Conservatorio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:086Mascagni"
            },
            {
                "name": "087 P.ta Genova",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.16963308898301,
                        45.452979495281085
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "P.ale Stazione Genova"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:087P.taGenova"
            },
            {
                "name": "088 Filippetti - Cassolo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.197582934186245,
                        45.45220201065263
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "V.le Filippetti Angelo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:088Filippetti-Cassolo"
            },
            {
                "name": "089 Patellani - Bligny",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.194186070557263,
                        45.45109570552362
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Patellani"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:089Patellani-Bligny"
            },
            {
                "name": "090 Gioia - Sassetti",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.194732841313554,
                        45.48464988959223
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Filippo Sassetti"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:090Gioia-Sassetti"
            },
            {
                "name": "091 Gioia - Pirelli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.195922966582453,
                        45.48409284380562
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Pirelli"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:091Gioia-Pirelli"
            },
            {
                "name": "092 Casati - Cordusio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.18551930876806,
                        45.46548729688104
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Gabrio Casati"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:092Casati-Cordusio"
            },
            {
                "name": "093 Borgogna",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.200051852250292,
                        45.465833225206765
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Borgogna"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:093Borgogna"
            },
            {
                "name": "094 Cadorna 3",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.176132113777342,
                        45.4680437139927
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "P.za Cadorna"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:094Cadorna3"
            },
            {
                "name": "095 Resistenza Partigiana",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.177498474571891,
                        45.458777837804554
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Resistenza Partigiana"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:095ResistenzaPartigiana"
            },
            {
                "name": "096 Donizzetti  Provincia ",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.2044405748324,
                        45.46736877580355
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Donizzetti"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:096DonizzettiProvincia"
            },
            {
                "name": "097 Molino delle Armi",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.182039720957572,
                        45.457190959422064
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Molino delle Armi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:097MolinodelleArmi"
            },
            {
                "name": "098 San Marco",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.189219875818777,
                        45.478686252453564
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via San Marco"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:098SanMarco"
            },
            {
                "name": "099 Arco della Pace 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.17352720062984,
                        45.47635229374781
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Bertani"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:099ArcodellaPace1"
            },
            {
                "name": "100 Palazzo Marino",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.191667555782546,
                        45.467004392079396
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Case Rotte"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:100PalazzoMarino"
            },
            {
                "name": "101 Gadio - Paleocapa",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.175619303590315,
                        45.47006768925407
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Gadio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:101Gadio-Paleocapa"
            },
            {
                "name": "102 Arcivescovado",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.192955622408812,
                        45.463785154484434
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Arcivescovado"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:102Arcivescovado"
            },
            {
                "name": "103 Arco della Pace 2",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.171668849936765,
                        45.47503804351999
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Sempione"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:103ArcodellaPace2"
            },
            {
                "name": "104 Gioia - Algarotti RL",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.196880822423582,
                        45.4862255937005
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Melchiorre Gioia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:104Gioia-AlgarottiRL"
            },
            {
                "name": "105 P.le Lodi",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.209919017367408,
                        45.447750068714235
                    ]
                },
                "totalSlotNumber": 33,
                "address": {
                    "streetAddress": "C.so Lodi + P.le Lodi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:105P.leLodi"
            },
            {
                "name": "106 Restelli - Galvani RL 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.194692229509545,
                        45.487282217300525
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Viale Restelli"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:106Restelli-GalvaniRL1"
            },
            {
                "name": "107 S. Gioacchimo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.196959622087116,
                        45.48084007598922
                    ]
                },
                "totalSlotNumber": 39,
                "address": {
                    "streetAddress": "P.zza San Gioachimo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:107S.Gioacchimo"
            },
            {
                "name": "108 Tunisia - Piscina Cozzi",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.201520987745315,
                        45.47899032698154
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "V.le Tunisia - Cozzi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:108Tunisia-PiscinaCozzi"
            },
            {
                "name": "109 Tunisia - Lecco - Bellintani",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.204946661580816,
                        45.47737441812452
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "V.le Tunisia - Bellintani"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:109Tunisia-Lecco-Bellintani"
            },
            {
                "name": "110 S. Francesca Romana",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.208582562055438,
                        45.47642435409101
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza S. Francesca Romana"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:110S.FrancescaRomana"
            },
            {
                "name": "111 B. Marcello - Boscovich",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.20755559164647,
                        45.480189986370014
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Benedetto Marcello"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:111B.Marcello-Boscovich"
            },
            {
                "name": "112 Napo Torriani - De Lellis",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.203252012790715,
                        45.48239014987574
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "Via Napo Torriani"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:112NapoTorriani-DeLellis"
            },
            {
                "name": "113 Buenos Aires - Lima",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.211088325119137,
                        45.48019649662964
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "P.za Lima"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:113BuenosAires-Lima"
            },
            {
                "name": "114 Buenos Aires - Argentina",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.214666877029105,
                        45.483786140151416
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.za Argentina"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:114BuenosAires-Argentina"
            },
            {
                "name": "115 Caiazzo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.20916469005732,
                        45.48525818423062
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza Caiazzo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:115Caiazzo"
            },
            {
                "name": "116 Morgagni - Redi",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.211893137294728,
                        45.47785235331636
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Morgagni"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:116Morgagni-Redi"
            },
            {
                "name": "117 Bacone - Monteverdi",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.214925822621273,
                        45.481376400936995
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Monteverdi, angolo Bacone"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:117Bacone-Monteverdi"
            },
            {
                "name": "118 Otto Novembre",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.21113455707748,
                        45.47507011754169
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza Otto Novembre"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:118OttoNovembre"
            },
            {
                "name": "119 Settembrini - Vitruvio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.206818932578377,
                        45.482473947764625
                    ]
                },
                "totalSlotNumber": 33,
                "address": {
                    "streetAddress": "Via Settembrini"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:119Settembrini-Vitruvio"
            },
            {
                "name": "120 Filzi - Pirelli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.200420869750895,
                        45.48440321463131
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Filzi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:120Filzi-Pirelli"
            },
            {
                "name": "121 Galvani - Copernico",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.197972629761749,
                        45.48669526774145
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "Via Gioia, angolo Galvani"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:121Galvani-Copernico"
            },
            {
                "name": "123 Castel Morrone - M.A. di Savoia",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.214589534586493,
                        45.47258109823418
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "VIa Castel Morrone 35"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:123CastelMorrone-M.A.diSavoia"
            },
            {
                "name": "124 P.ta Venezia 2",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.204675153433174,
                        45.47518379592525
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.za Oberdan"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:124P.taVenezia2"
            },
            {
                "name": "125 Fratelli Bandiera",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.210426097725595,
                        45.470544399149844
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via F.lli Bandiera 2"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:125FratelliBandiera"
            },
            {
                "name": "126 Modena - Castel Morrone",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.21442008171433,
                        45.47085440948175
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Modena 15"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:126Modena-CastelMorrone"
            },
            {
                "name": "127 Risorgimento",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.210720287895594,
                        45.46804820432442
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Piazza Risorgimento lato nord parterre centrale"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:127Risorgimento"
            },
            {
                "name": "128 Indipendenza - Castel Morrone",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.21435639909519,
                        45.468281387880424
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "C.so Indipendenza angolo Castel Morrone"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:128Indipendenza-CastelMorrone"
            },
            {
                "name": "129 Fiamma",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.21137596494248,
                        45.464456279939945
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Fiamma tra 18 e 20"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:129Fiamma"
            },
            {
                "name": "130 XXII Marzo S.M. del Sufragio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.212487144387014,
                        45.46216033670327
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "C.so XXII Marzo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:130XXIIMarzoS.M.delSufragio"
            },
            {
                "name": "131 Emilia - Piceno",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.216058957790526,
                        45.46233715689667
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.za Emilia 1 - ang XXII Marzo"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:131Emilia-Piceno"
            },
            {
                "name": "132 Bronzetti - Archimede",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.21455056198759,
                        45.4653276529082
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "F.lli Bronzetti 20 angolo Archimede"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:132Bronzetti-Archimede"
            },
            {
                "name": "133 Dateo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.21651204199418,
                        45.46839855891333
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zzale Dateo lato nord su Park"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:133Dateo"
            },
            {
                "name": "135 Umbria - Muratori",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.212453007264559,
                        45.450819549360354
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Muratori angolo Viale Umbria"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:135Umbria-Muratori"
            },
            {
                "name": "136 Monte Nero - Spartaco",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.207657122290449,
                        45.46013017075622
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "V.le Monte Nero"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:136MonteNero-Spartaco"
            },
            {
                "name": "137 Sempione - RAI",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.166781478384566,
                        45.47943025200413
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "C.so Sempione"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:137Sempione-RAI"
            },
            {
                "name": "138 Cadore - Pinaroli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.213145660255108,
                        45.458306236080276
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Cadore centro piazza"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:138Cadore-Pinaroli"
            },
            {
                "name": "139 Lazio - Vasari - Morosini",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.20810498697691,
                        45.455326670370766
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Lazio angolo via Morosini"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:139Lazio-Vasari-Morosini"
            },
            {
                "name": "140 Cirene - Friuli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.21249441177875,
                        45.45344292823143
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Viale Cirene angolo Friuli  parterre "
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:140Cirene-Friuli"
            },
            {
                "name": "141 Caldara - Curtatone",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.202948967941687,
                        45.455111923070874
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "V.le Caldara"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:141Caldara-Curtatone"
            },
            {
                "name": "143 Lodi - Buozzi - Papi",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.206638182583337,
                        45.44977490307706
                    ]
                },
                "totalSlotNumber": 21,
                "address": {
                    "streetAddress": "Via Lazzaro Papi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:143Lodi-Buozzi-Papi"
            },
            {
                "name": "146 Crema - Giulio Romano",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.202747531207523,
                        45.44806456519048
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Crema angolo via Trebbia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:146Crema-GiulioRomano"
            },
            {
                "name": "147 Ripamonti - Bellezza",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.197237081980932,
                        45.44880654673329
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Ripamonti intersezione Bellezza"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:147Ripamonti-Bellezza"
            },
            {
                "name": "148 Bocconi 3 - I.Aragona",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.190505696326694,
                        45.45106143976126
                    ]
                },
                "totalSlotNumber": 33,
                "address": {
                    "streetAddress": "Via Bocconi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:148Bocconi3-I.Aragona"
            },
            {
                "name": "150 Sraffa",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.186043122486824,
                        45.448363305488726
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Castelbarco di fronte civico 13"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:150Sraffa"
            },
            {
                "name": "151 Balilla",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.182755359758607,
                        45.444562915451534
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Balilla"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:151Balilla"
            },
            {
                "name": "152 S. Gottardo - Gentilino",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.179878976408277,
                        45.44888459066914
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Gentilino 1-5"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:152S.Gottardo-Gentilino"
            },
            {
                "name": "153 Segantini - Darwin",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.172733014016236,
                        45.44553768578198
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Segantini marciapiede opposto intersezione lat"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:153Segantini-Darwin"
            },
            {
                "name": "154 Ascanio Sforza - Pavia",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.177494729076164,
                        45.44735958993068
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Pavia civici dispari fronte civico 10"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:154AscanioSforza-Pavia"
            },
            {
                "name": "155 Naviglio Pavese - Torricelli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.176371835636228,
                        45.44427071435591
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Sforza angolo Tibadi  parterre "
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:155NaviglioPavese-Torricelli"
            },
            {
                "name": "156 Arcole - Argelati",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.172682555133656,
                        45.449655685750486
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza Arcole marciapiede lato piscina"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:156Arcole-Argelati"
            },
            {
                "name": "158 Naviglio Grande - Valenza",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.167415023751264,
                        45.449848967765135
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Ripa di Porta Ticinese - Giardini Powell"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:158NaviglioGrande-Valenza"
            },
            {
                "name": "160 Zara M3",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.191882398846515,
                        45.49155644320276
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Viale Zara civ.13 angolo via Arese"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:160ZaraM3"
            },
            {
                "name": "161 Coni Zugna - Solari",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.167995372607136,
                        45.45708446049529
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Solari"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:161ConiZugna-Solari"
            },
            {
                "name": "163 Rosario",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.16280643646695,
                        45.45482558068437
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza del Rosario marciapiede Esselunga"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:163Rosario"
            },
            {
                "name": "164 Bergognone - Tortona",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.165079435003323,
                        45.452311784646035
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Bergognone area verde"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:164Bergognone-Tortona"
            },
            {
                "name": "166 Coni Zugna - Foppa",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.165406991376235,
                        45.459181734467954
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Foppa"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:166ConiZugna-Foppa"
            },
            {
                "name": "167 Foppa - Caravaggio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.161928024709265,
                        45.45805956151542
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Foppa 17"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:167Foppa-Caravaggio"
            },
            {
                "name": "168 Carbonari",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.199344313870094,
                        45.4924802489056
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Keplero"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:168Carbonari"
            },
            {
                "name": "169 Vesuvio - Lipari",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.159361956751814,
                        45.45960076568984
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza Vesuvio uffici postali lato bus"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:169Vesuvio-Lipari"
            },
            {
                "name": "170 S. Michele del Carso",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.163594034798914,
                        45.4634771383464
                    ]
                },
                "totalSlotNumber": 33,
                "address": {
                    "streetAddress": "Via Andrea Verga"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:170S.MicheledelCarso"
            },
            {
                "name": "171 Elba - Cimarosa",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.157298520842165,
                        45.463360860029674
                    ]
                },
                "totalSlotNumber": 33,
                "address": {
                    "streetAddress": "Via Elba 26"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:171Elba-Cimarosa"
            },
            {
                "name": "173 Vercelli - Cherubini",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.159438802680823,
                        45.46704668644219
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Cherubini 3-4  parterre "
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:173Vercelli-Cherubini"
            },
            {
                "name": "174 Vercelli - Piemonte",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.155371569025684,
                        45.467367225105676
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Buonarroti 4"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:174Vercelli-Piemonte"
            },
            {
                "name": "175 Pagano - G. d Arezzo",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.160466096071037,
                        45.46814209913612
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Pagano / Burchiello"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:175Pagano-G.dArezzo"
            },
            {
                "name": "176 Buonarroti",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.155404930288597,
                        45.47082119484524
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Buonarroti angolo piazza Buonarroti  parterre "
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:176Buonarroti"
            },
            {
                "name": "178 V Alpini",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.166777235415925,
                        45.47157629975879
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "L.go V Alpini"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:178VAlpini"
            },
            {
                "name": "179 Giovanni XXIII",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.16423661043853,
                        45.4748817469534
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza Giovannoi XXIII angolo via Monti"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:179GiovanniXXIII"
            },
            {
                "name": "180 Canova - Sangiorgio",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.168294947003174,
                        45.47541045871029
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Canova"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:180Canova-Sangiorgio"
            },
            {
                "name": "181 Sempione - Melzi d Eril",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.169773417230193,
                        45.47784748090671
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "C.so Sempione"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:181Sempione-MelzidEril"
            },
            {
                "name": "182 Melzi d Eril - Cagnola",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.172932040906327,
                        45.47831041389658
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Melzi d Eril"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:182MelzidEril-Cagnola"
            },
            {
                "name": "184 P.ta Volta",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.182307652921606,
                        45.480183381885844
                    ]
                },
                "totalSlotNumber": 33,
                "address": {
                    "streetAddress": "Bastioni P.ta Volta"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:184P.taVolta"
            },
            {
                "name": "185 SS. Trinità",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.176422567192033,
                        45.47803937473465
                    ]
                },
                "totalSlotNumber": 35,
                "address": {
                    "streetAddress": "Via Cesariano"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:185SS.Trinita"
            },
            {
                "name": "187 Sarpi - Albertini",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.172187599750233,
                        45.48101328531566
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Alfredo Albertini"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:187Sarpi-Albertini"
            },
            {
                "name": "188 Sarpi - Niccolini",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.178130700938656,
                        45.4816346142616
                    ]
                },
                "totalSlotNumber": 24,
                "address": {
                    "streetAddress": "Via Paolo Sarpi"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:188Sarpi-Niccolini"
            },
            {
                "name": "189 Procaccini - Cimitero Monumentale",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.177212865808986,
                        45.4838949237151
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.zza Cimitero Maggiore angolo via Niccolini"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:189Procaccini-CimiteroMonumentale"
            },
            {
                "name": "192 Col di Lana - Col Moschin",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.184606651763213,
                        45.45184694175582
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Col Moschin"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:192ColdiLana-ColMoschin"
            },
            {
                "name": "193 Garibaldi - Pepe",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.18500433560355,
                        45.48674783383425
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Via Guglielmo Pepe"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:193Garibaldi-Pepe"
            },
            {
                "name": "194 Borsieri - Confalonieri",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.188399462863947,
                        45.48554711719118
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via De Castillia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:194Borsieri-Confalonieri"
            },
            {
                "name": "195 Pola RL",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.1933339354449,
                        45.48907417489782
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "Via Pola"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:195PolaRL"
            },
            {
                "name": "196 Lagosta",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.19100937111762,
                        45.48917179513573
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.ale Lagosta"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:196Lagosta"
            },
            {
                "name": "200 Luigi di Savoia - Doria",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.205966672348609,
                        45.485019365866904
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "P.za Luigi di Savoia"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:200LuigidiSavoia-Doria"
            },
            {
                "name": "203 Taramelli RL",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.193840193069587,
                        45.490773492205896
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Taramelli"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:203TaramelliRL"
            },
            {
                "name": "206 Friuli - Comelico",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.213603162753765,
                        45.4548113152146
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Friuli 50"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:206Friuli-Comelico"
            },
            {
                "name": "211 Bernini",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.221730965559338,
                        45.4790115126201
                    ]
                },
                "totalSlotNumber": 27,
                "address": {
                    "streetAddress": "Piazza Bernini tra via Noe e via Pinturicchio"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:211Bernini"
            },
            {
                "name": "212 Verrocchio - Juvara",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.219778113112799,
                        45.47325855902322
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Juvara angolo Verrocchio fronte civico 3"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:212Verrocchio-Juvara"
            },
            {
                "name": "213 Novelli - Carnaghi",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.220551537195744,
                        45.47080155611533
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Carnaghi 2"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:213Novelli-Carnaghi"
            },
            {
                "name": "214 Piazzale Susa",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.223994552788357,
                        45.46887096084782
                    ]
                },
                "totalSlotNumber": 30,
                "address": {
                    "streetAddress": "Isola spartitraffico Sidoli - Romagna"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:214PiazzaleSusa"
            },
            {
                "name": "215 Politecnico 1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.226213689212095,
                        45.47865843299429
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "piazzale Leonardo da Vinci lato nord"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:215Politecnico1"
            },
            {
                "name": "216 Romagna - Pascoli",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        9.22445549593154,
                        45.476520816482534
                    ]
                },
                "totalSlotNumber": 36,
                "address": {
                    "streetAddress": "Via Pascoli 53"
                },
                "type": "DataModel",
                "id": "urn:ngsi-ld:DataModel:gabriele.percoco@demetrix.it:216Romagna-Pascoli"
            }
        ]
    },

    example_2: (email) => {
        return {
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
            "dateObserved": 1759925413880,
            "type": "TrafficFlowObserved",
            "id": "urn:ngsi-ld:TrafficFlowObserved:" + email + ":Cluj-Napocatraffic103203492"
        }
    }
}