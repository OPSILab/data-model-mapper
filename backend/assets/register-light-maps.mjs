// Registra su data-model-mapper (POST /api/map/register), una chiamata per survey,
// l'equivalente in formato "map"/API delle funzioni scritte a mano in maps.js.
//
// Le chiavi obsHR per ogni survey NON sono ricopiate qui a mano: vengono estratte
// eseguendo davvero la funzione di maps.js con un obsHR "finto" (un Proxy che, per
// ogni proprietà letta, restituisce la stringa "obsHR.<proprietà>"), così l'array
// `dimensions` prodotto è già nel formato path-string richiesto dall'API ed è
// sempre allineato a maps.js — nessuna duplicazione manuale, nessun rischio di
// disallineamento tra i due file.
//
// Uso:
//   DMM_TOKEN="<bearer token>" node register-light-maps.mjs [opzioni]
//
// Opzioni:
//   --base-url=<url>       default: http://localhost:5500
//   --survey=A,B,C         registra solo le survey elencate (default: tutte quelle in maps.js)
//   --dry-run              stampa i body che verrebbero inviati, senza chiamare l'API
//   --delay=<ms>           pausa tra una chiamata e la successiva (default: 300)

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

process.env.DMM_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHQkR3NHZ1Si15SzduakFHcDU3Ry1XZTQxaEJMeEhUNUFlNWdaNDc5VWNvIn0.eyJleHAiOjE3ODc5MTAwOTQsImlhdCI6MTc4NzgyMzY5NCwiYXV0aF90aW1lIjoxNzg3ODIzNjk0LCJqdGkiOiIwMzJkYTI5NS02MTJhLTQ2ZDktYmE3My03MTQwZTBlZDhkYWYiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL3NtYXJ0ZXJhIiwic3ViIjoiNTZhNWRjOTktZDkzMC00NDNjLThkZjItY2EyMjI3NmJlOWY2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZG1tIiwic2lkIjoiZTVhNzU0NmItNWI4Ny00ZGY3LWJkMDItNmMxN2IxNzBkZDBmIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjEyMzQ1IiwiaHR0cDovL2xvY2FsaG9zdDoxMjM0NS8qIiwiKiJdLCJzY29wZSI6Im9wZW5pZCBjb25zb2xlQWRtaW4gcHJvZmlsZSBlbWFpbCIsImNvbnNvbGVBZG1pbiI6ImNvbnNvbGVBZG1pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiR2FicmllbGUgUGVyY29jbyIsInByZWZlcnJlZF91c2VybmFtZSI6InBlcmNvY28iLCJnaXZlbl9uYW1lIjoiR2FicmllbGUiLCJmYW1pbHlfbmFtZSI6IlBlcmNvY28iLCJlbWFpbCI6ImdhYnJpZWxlLnBlcmNvY29AZGVtZXRyaXguaXQiLCJwb2xpY3kiOiJjb25zb2xlQWRtaW4ifQ.QYaK5iPhNLwcWwdoOambEttMtYcJgsyUiUjmvGHSWusxTNl9nHWp8DTykPxYM-kztbM9eY04iRBubetcU88RmfQID5NUnm8C0VKZanrXV38ubyfoePIU6VpHZr1hVbWDmy5uMUamUxu9mLpdiOKRTMtimqi1SEPSsKcJZabtsqXdzAmgUFmQ2dzfnH2FX7rDKo-mrGXkwapXpdh8TE099hDy2pFIb1yRTh7aPSg3t7dPXsGV1jux9Zinm9ZruSsJEFzRVv53fMfFQJb21h5gVhoxlQtZybvakDhVmB6tAcPwtN3peDMl2ED0Kx78Sz60SAI5mRQtxD9vdth0LrJY8Q"

const __dirname = dirname(fileURLToPath(import.meta.url));
const maps = (await import('./maps.js')).default;

function parseArgs(argv) {
  const a = { baseUrl: 'http://localhost:5500', surveys: null, dryRun: false, delay: 300 };
  for (const x of argv) {
    if (x === '--dry-run') a.dryRun = true;
    else if (x.startsWith('--base-url=')) a.baseUrl = x.slice(11).replace(/\/+$/, '');
    else if (x.startsWith('--survey=')) a.surveys = x.slice(9).split(',').map((s) => s.trim()).filter(Boolean);
    else if (x.startsWith('--delay=')) a.delay = Number(x.slice(8));
  }
  return a;
}

// Estrae, per una survey, l'array `dimensions` già nel formato "obsHR.<chiave>"
// eseguendo davvero la funzione di maps.js con un obsHR "sonda".
function extractDimensionPaths(mapFn) {
  const obsHRProbe = new Proxy({}, { get: (_t, prop) => `obsHR.${String(prop)}` });
  const fakeRow = {
    source: 'source', survey: 'survey', region: 'region', fromUrl: 'fromUrl',
    timestamp: 'timestamp', value: 'value', obs: 'obs', obsHR: obsHRProbe, rawDimensions: 'rawDimensions'
  };
  const result = mapFn(fakeRow);
  if (!Array.isArray(result.dimensions)) {
    throw new Error('dimensions non è un array (la funzione in maps.js non ha la forma attesa?)');
  }
  return result.dimensions; // es. ["obsHR.geo", "obsHR.freq", ...]
}

// Da "obsHR.geo" -> "geo"
const keyFromPath = (p) => p.replace(/^obsHR\./, '');

function buildSchemaProperties(keys) {
  const properties = {};
  for (const k of keys) properties[k] = { type: 'string' };
  return properties;
}

function buildRequestBody(survey, dimensionPaths) {
  const keys = dimensionPaths.map(keyFromPath);
  const schemaProps = buildSchemaProperties(keys);

  return {
    name: survey,
    status: 'Under development',
    description: `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/${survey.toLowerCase()}?format=sdmx_2.1_structured&compressed=true`,
    map: {
      _id: '',
      source: 'source',
      survey: 'survey',
      region: 'region',
      fromUrl: 'fromUrl',
      timestamp: 'timestamp',
      dimensions: dimensionPaths,
      value: 'value',
      obs: 'obs',
      obsHR: 'obsHR',
      rawDimensions: 'rawDimensions',
      patSwapped: 'patSwapped'
    },
    sourceDataType: 'json',
    config: {
      NGSI_entity: false,
      ignoreValidation: true,
      writers: [],
      disableAjv: true,
      mappingReport: true,
      newSdmxDecode: true,
      mappingMode: 'light'
    },
    dataModel: {
      type: 'object',
      properties: {
        source: { type: 'string' },
        survey: { type: 'string' },
        region: { type: 'string' },
        fromUrl: { type: 'string', format: 'uri' },
        timestamp: { type: 'string' },
        dimensions: { type: 'array' },
        value: { type: 'number' },
        obs: { type: 'object', properties: schemaProps, additionalProperties: true },
        obsHR: { type: 'object', properties: schemaProps, additionalProperties: true },
        rawDimensions: { type: 'array', items: { type: 'string' } }
      },
      additionalProperties: true,
      $schema: 'https://json-schema.org/draft/2020-12/schema'
    },
    sourceDataMinio: {}
  };
}

async function registerSurvey(baseUrl, token, survey, body, dryRun) {
  if (dryRun) {
    console.log(`\n--- DRY RUN: ${survey} ---`);
    console.log(JSON.stringify(body, null, 2));
    return { survey, ok: true, dryRun: true };
  }

  const res = await fetch(`${baseUrl}/api/map/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = text; }

  if (!res.ok) {
    return { survey, ok: false, status: res.status, response: parsed };
  }
  return { survey, ok: true, status: res.status, response: parsed };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.dryRun && !process.env.DMM_TOKEN) {
    console.error('Errore: variabile d\'ambiente DMM_TOKEN mancante (il bearer token cambia sempre, va passato così).');
    console.error('Uso: DMM_TOKEN="<token>" node register-light-maps.mjs [--base-url=...] [--survey=A,B] [--dry-run]');
    process.exit(1);
  }
  const token = process.env.DMM_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHQkR3NHZ1Si15SzduakFHcDU3Ry1XZTQxaEJMeEhUNUFlNWdaNDc5VWNvIn0.eyJleHAiOjE3ODc5MTAwOTQsImlhdCI6MTc4NzgyMzY5NCwiYXV0aF90aW1lIjoxNzg3ODIzNjk0LCJqdGkiOiIwMzJkYTI5NS02MTJhLTQ2ZDktYmE3My03MTQwZTBlZDhkYWYiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL3NtYXJ0ZXJhIiwic3ViIjoiNTZhNWRjOTktZDkzMC00NDNjLThkZjItY2EyMjI3NmJlOWY2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZG1tIiwic2lkIjoiZTVhNzU0NmItNWI4Ny00ZGY3LWJkMDItNmMxN2IxNzBkZDBmIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjEyMzQ1IiwiaHR0cDovL2xvY2FsaG9zdDoxMjM0NS8qIiwiKiJdLCJzY29wZSI6Im9wZW5pZCBjb25zb2xlQWRtaW4gcHJvZmlsZSBlbWFpbCIsImNvbnNvbGVBZG1pbiI6ImNvbnNvbGVBZG1pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiR2FicmllbGUgUGVyY29jbyIsInByZWZlcnJlZF91c2VybmFtZSI6InBlcmNvY28iLCJnaXZlbl9uYW1lIjoiR2FicmllbGUiLCJmYW1pbHlfbmFtZSI6IlBlcmNvY28iLCJlbWFpbCI6ImdhYnJpZWxlLnBlcmNvY29AZGVtZXRyaXguaXQiLCJwb2xpY3kiOiJjb25zb2xlQWRtaW4ifQ.QYaK5iPhNLwcWwdoOambEttMtYcJgsyUiUjmvGHSWusxTNl9nHWp8DTykPxYM-kztbM9eY04iRBubetcU88RmfQID5NUnm8C0VKZanrXV38ubyfoePIU6VpHZr1hVbWDmy5uMUamUxu9mLpdiOKRTMtimqi1SEPSsKcJZabtsqXdzAmgUFmQ2dzfnH2FX7rDKo-mrGXkwapXpdh8TE099hDy2pFIb1yRTh7aPSg3t7dPXsGV1jux9Zinm9ZruSsJEFzRVv53fMfFQJb21h5gVhoxlQtZybvakDhVmB6tAcPwtN3peDMl2ED0Kx78Sz60SAI5mRQtxD9vdth0LrJY8Q';

  const allSurveys = Object.keys(maps);
  const surveys = opts.surveys ? allSurveys.filter((s) => opts.surveys.includes(s)) : allSurveys;

  if (opts.surveys) {
    const missing = opts.surveys.filter((s) => !allSurveys.includes(s));
    if (missing.length) console.warn(`Avviso: non trovate in maps.js (ignorate): ${missing.join(', ')}`);
  }

  console.log(`${opts.dryRun ? '[DRY RUN] ' : ''}Registrazione di ${surveys.length} survey su ${opts.baseUrl}/api/map/register\n`);

  const results = [];
  for (const survey of surveys) {
    try {
      const dimensionPaths = extractDimensionPaths(maps[survey]);
      const body = buildRequestBody(survey, dimensionPaths);
      const result = await registerSurvey(opts.baseUrl || "http://localhost:5500", token, survey, body, opts.dryRun);
      results.push(result);
      console.log(`${result.ok ? 'ok' : 'FAIL'} ${survey}${result.status ? ` (HTTP ${result.status})` : ''}`);
      if (!result.ok) console.log('  ->', JSON.stringify(result.response));
    } catch (err) {
      results.push({ survey, ok: false, error: err.message });
      console.log(`FAIL ${survey} -> ${err.message}`);
    }
    if (!opts.dryRun && opts.delay > 0) await sleep(opts.delay);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n──────── riepilogo: ${results.length - failed.length}/${results.length} registrate con successo ────────`);
  if (failed.length) {
    console.log('fallite: ' + failed.map((r) => r.survey).join(', '));
    process.exitCode = 1;
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
