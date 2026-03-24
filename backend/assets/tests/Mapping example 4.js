module.exports = {//NOTE: 3. BikeHireDockingStationMap.json has a BOM char in LOCALITÀ DI INTERVENTO
    body: {
        "sourceDataIn": "4. PointOfInterestSource.json",
        "mapPathIn": "4. PointOfInterestMap.json",
        "dataModelIn": "PointOfInterest",
        "config": { "NGSI_entity": true, "rowEnd": 1 }
    },
    response: [
        {
            "name": "insegna",
            "description": "insegna (superficie_venditasq) - posto_speciale_cf, posto_speciale_cf, attivita_prevalente, settore_merceologico, settore_storico_n,s ettore_storico_preval, settore_storico_s",
            "address": {
                "addressLocality": "Milan",
                "addressRegion": "Lombardia",
                "streetAddress": "TipoVia DescrizioneVia CivicoBar",
            },
            "category": "123",
            "source": "http://dati.comune.milano.it/dataset/ds49_economia_esercizi_vicinato_sede_fissa_2015",
            "id": "urn:ngsi-ld:PointOfInterest:gabriele.percoco@demetrix.it:ds49-1",
            "type": "PointOfInterest"
        },
        {
            "MAPPING_REPORT": {
                "Processed_objects": 25929,
                "Mapped_and_Validated_Objects": "1-25929",
                "Mapped_and_NOT_Validated_Objects": "25928-25929"
            },
            "ORION_REPORT": {
                "Object written to Orion Context Broker": "1/1",
                "Object NOT written to Orion Context Broker": "0/1",
                "Object SKIPPED": "0/1"
            }
        }
    ]
}