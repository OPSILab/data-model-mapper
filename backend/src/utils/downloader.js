const axios = require("axios");
const zlib = require("zlib");
const tar = require("tar-stream");
const path = require("path");
const { Readable } = require("stream");
const log = require('./logger')//.app(module);
const { Logger } = log
const logger = new Logger(__filename)

async function downloadAndParse(url) {
    const response = await axios.get(url, {
        responseType: "arraybuffer"
    });

    const buffer = Buffer.from(response.data);
    const headers = response.headers || {};
    const contentType = headers["content-type"] || "";
    const filename = getFilenameFromHeaders(headers, url);

    if (isGzipBuffer(buffer)) {
        const decompressed = zlib.gunzipSync(buffer);

        if (isTarBuffer(decompressed)) {
            const files = await extractTarBuffer(decompressed);

            return {
                type: "tar.gz",
                filename,
                contentType,
                data: files
            };
        }

        const sniff = decompressed.slice(0, 6).toString("utf8").trimStart();
        const isXmlContent = sniff.startsWith("<?xml") || sniff.startsWith("<");

        if (
            contentType.includes("json") ||
            filename.toLowerCase().endsWith(".json.gz")
        ) {
            const decompressedText = decompressed.toString("utf8").trim();
            return {
                type: "json.gz",
                filename,
                contentType,
                data: JSON.parse(decompressedText)
            };
        }

        if (
            contentType.includes("xml") ||
            filename.toLowerCase().endsWith(".xml.gz") ||
            isXmlContent
        ) {
            return {
                type: "xml.gz",
                filename,
                contentType,
                data: decompressed  
            };
        }

        try {
            const decompressedText = decompressed.toString("utf8").trim();
            return {
                type: "json.gz",
                filename,
                contentType,
                data: JSON.parse(decompressedText)
            };
        } catch { }

        return {
            type: "gz",
            filename,
            contentType,
            data: decompressed
        };
    }

    if (contentType.includes("json") || filename.toLowerCase().endsWith(".json")) {
        const text = buffer.toString("utf8").trim();

        return {
            type: "json",
            filename,
            contentType,
            data: JSON.parse(text)
        };
    }

    if (contentType.includes("xml") || filename.toLowerCase().endsWith(".xml")) {
        return {
            type: "xml",
            filename,
            contentType,
            data: buffer  
        };
    }

    
    const sniffPlain = buffer.slice(0, 6).toString("utf8").trimStart();
    const isXmlPlain = sniffPlain.startsWith("<?xml") || sniffPlain.startsWith("<");

    if (isXmlPlain) {
        return {
            type: "xml",
            filename,
            contentType,
            data: buffer  
        };
    }

    const text = buffer.toString("utf8").trim();

    try {
        return {
            type: "json",
            filename,
            contentType,
            data: JSON.parse(text)
        };
    } catch { }

    return {
        type: "unknown",
        filename,
        contentType,
        data: buffer
    };
}

function getFilenameFromHeaders(headers, url) {
    const contentDisposition = headers["content-disposition"];

    if (contentDisposition) {
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

        if (utf8Match) {
            return decodeURIComponent(utf8Match[1].replace(/["']/g, ""));
        }

        const normalMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

        if (normalMatch) {
            return normalMatch[1];
        }
    }

    try {
        const pathname = new URL(url).pathname;
        const basename = path.basename(pathname);

        return basename || "download";
    } catch {
        return "download";
    }
}

function isGzipBuffer(buffer) {
    return buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
}

function isTarBuffer(buffer) {
    return buffer.length > 262 && buffer.slice(257, 262).toString() === "ustar";
}

function extractTarBuffer(tarBuffer) {
    const extract = tar.extract();

    return new Promise((resolve, reject) => {
        const files = {};

        extract.on("entry", (header, stream, next) => {
            const chunks = [];

            stream.on("data", chunk => {
                chunks.push(chunk);
            });

            stream.on("end", () => {
                const fileBuffer = Buffer.concat(chunks);

                files[header.name] = {
                    name: header.name,
                    type: header.type,
                    size: header.size,
                    buffer: fileBuffer
                };

                next();
            });

            stream.on("error", reject);
        });

        extract.on("finish", () => {
            resolve(files);
        });

        extract.on("error", reject);

        Readable.from(tarBuffer).pipe(extract);
    });
}

function logResult(result) {
    logger.info("Tipo:", result.type);
    logger.info("Nome file:", result.filename);
    logger.info("Content-Type:", result.contentType);

    if (result.type === "json" || result.type === "json.gz") {
        logger.info("JSON letto:");
        logger.info(result.data);
    }

    if (result.type === "xml" || result.type === "xml.gz") {
        logger.info("XML letto:");
        logger.info(result.data.substring(0, 300));
    }

    if (result.type === "tar.gz") {
        logger.info("File contenuti nel tar.gz:");

        for (const [internalPath, file] of Object.entries(result.data)) {
            logger.info("-", internalPath, file.size, "bytes");

            const text = file.buffer.toString("utf8");
            logger.info(text.slice(0, 300));
        }
    }

    if (result.type === "gz") {
        logger.info("Gzip non TAR e non JSON.");
        logger.info("Buffer decompresso:", result.data);
    }

    if (result.type === "unknown") {
        logger.info("Formato non riconosciuto.");
        logger.info("Buffer originale:", result.data);
    }
}

async function download(url) {

    const result = await downloadAndParse(url);

    //logResult(result);
    return result
}

//const jsonUrl = "https://dx-lab.eng.it/data-model-mapper-gui/assets/source.json"
//const tarGzUrl = "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/NAMA_10R_3GDP?format=sdmx_2.1_structured&compressed=true"
module.exports = download