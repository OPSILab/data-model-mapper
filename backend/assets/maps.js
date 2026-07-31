// Ported from smartera-initializer/reorder-dimensions/reorder-dimensions.mjs (POSITION_CONFIG)
// and smartera-initializer/reorder-dimensions/category-to-obshr.json.
// Keep these two objects in sync with those files if the reorder rules change.
const POSITION_CONFIG = {
    BD_HGNACE_R: { pins: { 2: 'hgnace_activity' }, last: ['year'] },
    BD_SALGE1_NACE_R: { pins: { 1: 'employmentType', 2: 'nace_sector' }, last: ['year'] },
    BD_SALGE1_SIZE_R: { pins: { 2: 'enterprise_size_class' }, last: ['year'] },
    CENS_21COBHS_R3: { pins: { 1: 'birthCountry', 2: 'householdType', 3: 'cobhs_sex' }, last: ['year'] },
    CENS_21CTZ_R3: { pins: { 1: 'citizenship', 3: 'ctz_sex' }, last: ['year'] },
    CENS_21M_R3: { pins: { 1: 'maritalStatus', 2: 'm_sex' }, last: ['year'] },
    DEMO_R_D3DENS: { last: ['year'] },
    DEMO_R_GIND3: { last: ['gind3_indicator'] },
    DEMO_R_PJANAGGR3: { last: ['year'] },
    DEMO_R_PJANGRP3: { last: ['year'] },
    EDAT_LFSE_22: { last: ['year'] },
    EDUC_UOE_ENRA14: { last: ['year'] },
    EDUC_UOE_ENRT06: { last: ['year'] },
    EF_LUS_ALLCROPS: { pins: { 3: 'land_use_category' }, last: ['year'] },
    ENV_WASFAC: { last: ['year'] },
    HLTH_CO_DISCH1T: { pins: { 1: 'hosp_age_group', 5: 'diagnosis' }, last: ['year'] },
    ISOC_R_BLT12_I: { last: ['year'] },
    ISOC_R_CI_IT_EN2: { pins: { 1: 'enterprise_industry', 2: 'enterprise_size', 3: 'internet_speed', 4: 'enterprise_unit', 6: 'enterprise_year' } },
    ISOC_R_GOV_I: { last: ['year'] },
    ISOC_R_IACC_H: { last: ['year'] },
    ISOC_R_IUSE_I: { pins: { 1: 'internet_use_activity' }, last: ['year'] },
    NAMA_10R_3EMPERS: { pins: { 5: 'empers_year' } },
    NAMA_10R_3GDP: { last: ['gdp_group'] },
    NAMA_10R_3GVA: { pins: { 1: 'gva_group1', 4: 'gva_group2' } },
    NAMA_10R_3NLP: { last: ['year'] },
    NRG_CHDDR2_A: { last: ['year'] },
    PAT_EP_TOT: { pins: { 3: 'pat_region' }, last: ['year'] },
    RD_E_GERDREG: { last: ['year'] },
    ROAD_GO_NA_RL3G: { pins: { 0: 'rl3g_goods' }, last: ['year'] },
    ROAD_GO_NA_RU3G: { last: ['year'] },
    TRAN_R_ELVEHST: { last: ['year'] },
    TRAN_R_RAPA: { pins: { 2: 'rapa_reporting_region', 3: 'destination_region' }, last: ['year'] }
};

const CATEGORY_TO_OBSHR = {
    birthCountry: 'c_birth',
    householdType: 'hhstatus',
    cobhs_sex: 'sex',
    citizenship: 'citizen',
    ctz_sex: 'sex',
    maritalStatus: 'marsta',
    m_sex: 'sex',
    gind3_indicator: 'time_period',
    gva_group1: 'unit',
    gva_group2: 'time_period',
    gdp_group: 'time_period',
    employmentType: 'indic_sbs',
    nace_sector: 'nace_r2',
    hgnace_activity: 'nace_r2',
    enterprise_size_class: 'sizeclas',
    internet_use_activity: 'indic_is',
    enterprise_industry: 'nace_r2',
    enterprise_size: 'size_emp',
    internet_speed: 'indic_is',
    enterprise_unit: 'unit',
    enterprise_year: 'time_period',
    land_use_category: 'crops',
    empers_year: 'time_period',
    rapa_reporting_region: 'c_load',
    destination_region: 'c_unload',
    hosp_age_group: 'age',
    diagnosis: 'icd10',
    year: 'time_period',
    rl3g_goods: 'nst07',
    pat_region: 'geo',
    lha_sex: 'sex'
};

// Lightweight re-implementation of reorderDimensions() from reorder-dimensions.mjs, adapted to
// build `dimensions` straight from `obsHR` at ingest time instead of reordering an array already
// written to mongo. Since we have direct key access to obsHR here, positions are resolved by
// obsHR key instead of by searching for a matching label, which sidesteps needing a fixed,
// per-survey "default order" that we'd otherwise have no reliable source for.
function buildOrderedDimensions(obsHR, surveyConfig) {
    const entries = Object.entries(obsHR || {}).filter(([key]) => key.toLowerCase() !== 'value');
    const n = entries.length;
    const result = new Array(n).fill(undefined);
    const used = new Array(n).fill(false);

    const takeKey = key => {
        const idx = entries.findIndex(([k], i) => !used[i] && k === key);
        if (idx === -1) return false;
        used[idx] = true;
        return true;
    };

    const place = (pos, token) => {
        if (pos < 0 || pos >= n) return;
        const obsKey = CATEGORY_TO_OBSHR[token];
        if (!obsKey || !(obsKey in obsHR)) return;
        if (result[pos] !== undefined) return;
        if (!takeKey(obsKey)) return;
        result[pos] = obsHR[obsKey];
    };

    for (const [posStr, token] of Object.entries(surveyConfig.pins || {})) place(Number(posStr), token);
    for (const token of surveyConfig.last || []) place(n - 1, token);

    let cursor = 0;
    for (let i = 0; i < n; i++) {
        if (used[i]) continue;
        while (cursor < n && result[cursor] !== undefined) cursor++;
        result[cursor++] = entries[i][1];
    }

    return result;
}

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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.BD_HGNACE_R),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.BD_SALGE1_NACE_R),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.BD_SALGE1_SIZE_R),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.CENS_21COBHS_R3),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.CENS_21CTZ_R3),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.CENS_21M_R3),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.DEMO_R_D3DENS),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.DEMO_R_GIND3),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.DEMO_R_PJANAGGR3),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.DEMO_R_PJANGRP3),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.EDAT_LFSE_22),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.EDUC_UOE_ENRA14),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.EDUC_UOE_ENRT06),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.EF_LUS_ALLCROPS),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ENV_WASFAC),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.HLTH_CO_DISCH1T),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ISOC_R_BLT12_I),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ISOC_R_CI_IT_EN2),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ISOC_R_GOV_I),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ISOC_R_IACC_H),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ISOC_R_IUSE_I),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.NAMA_10R_3EMPERS),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.NAMA_10R_3GVA),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.NAMA_10R_3NLP),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.NRG_CHDDR2_A),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.PAT_EP_TOT),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.RD_E_GERDREG),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ROAD_GO_NA_RL3G),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.ROAD_GO_NA_RU3G),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.TRAN_R_ELVEHST),
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
            dimensions: buildOrderedDimensions(row['obsHR'], POSITION_CONFIG.TRAN_R_RAPA),
            value: row['value'],
            obs: row['obs'],
            obsHR: row['obsHR'],
            rawDimensions: row['rawDimensions']
        }
    }
}
