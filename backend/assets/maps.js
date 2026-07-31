module.exports = {
    NAMA_10R_3GDP: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['freq'],
                row['obsHR']['unit'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    BD_HGNACE_R: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['indic_sbs'],
                row['obsHR']['nace_r2'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    BD_SALGE1_NACE_R: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['indic_sbs'],
                row['obsHR']['nace_r2'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    BD_SALGE1_SIZE_R: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['indic_sbs'],
                row['obsHR']['sizeclas'],
                row['obsHR']['freq'],
                row['obsHR']['nace_r2'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    CENS_21COBHS_R3: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['c_birth'],
                row['obsHR']['hhstatus'],
                row['obsHR']['sex'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['age'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    CENS_21CTZ_R3: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['citizen'],
                row['obsHR']['unit'],
                row['obsHR']['sex'],
                row['obsHR']['freq'],
                row['obsHR']['age'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    CENS_21M_R3: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['marsta'],
                row['obsHR']['sex'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['age'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    DEMO_R_D3DENS: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    DEMO_R_GIND3: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['indic_de'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    DEMO_R_PJANAGGR3: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['sex'],
                row['obsHR']['freq'],
                row['obsHR']['age'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    DEMO_R_PJANGRP3: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['sex'],
                row['obsHR']['freq'],
                row['obsHR']['age'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    EDAT_LFSE_22: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['sex'],
                row['obsHR']['freq'],
                row['obsHR']['training'],
                row['obsHR']['wstatus'],
                row['obsHR']['age'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    EDUC_UOE_ENRA14: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['age'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    EDUC_UOE_ENRT06: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['isced11'],
                row['obsHR']['sex'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    EF_LUS_ALLCROPS: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['uaarea'],
                row['obsHR']['unit'],
                row['obsHR']['crops'],
                row['obsHR']['statinfo'],
                row['obsHR']['freq'],
                row['obsHR']['so_eur'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ENV_WASFAC: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['freq'],
                row['obsHR']['indic_env'],
                row['obsHR']['wst_oper'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    HLTH_CO_DISCH1T: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['age'],
                row['obsHR']['indic_he'],
                row['obsHR']['unit'],
                row['obsHR']['sex'],
                row['obsHR']['icd10'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ISOC_R_BLT12_I: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['indic_is'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ISOC_R_CI_IT_EN2: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['nace_r2'],
                row['obsHR']['size_emp'],
                row['obsHR']['indic_is'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ISOC_R_GOV_I: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['indic_is'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ISOC_R_IACC_H: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ISOC_R_IUSE_I: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['indic_is'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    NAMA_10R_3EMPERS: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['wstatus'],
                row['obsHR']['nace_r2'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    NAMA_10R_3GVA: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['nace_r2'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    NAMA_10R_3NLP: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['na_item'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    NRG_CHDDR2_A: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['indic_nrg'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    PAT_EP_TOT: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['coop_ptn'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['geo'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    RD_E_GERDREG: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['sectperf'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ROAD_GO_NA_RL3G: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['nst07'],
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    ROAD_GO_NA_RU3G: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['nst07'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    TRAN_R_ELVEHST: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['freq'],
                row['obsHR']['vehicle'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    },
    TRAN_R_RAPA: (row) => {
        return {
            source: row['source'],
            survey: row['survey'],
            region: row['region'],
            fromUrl: row['fromUrl'],
            timestamp: row['timestamp'],
            dimensions: [
                row['obsHR']['geo'],
                row['obsHR']['unit'],
                row['obsHR']['c_load'],
                row['obsHR']['c_unload'],
                row['obsHR']['freq'],
                row['obsHR']['conf_status'],
                row['obsHR']['time_period']
            ],
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    }
}
