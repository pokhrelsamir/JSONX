/**
 * =========================================================
 * JSONX — Converter Utilities
 * =========================================================
 */

/**
 * Converts a JSON object or array to CSV format.
 */
function jsonToCSV(json) {
    if (!json) return "";

    // If root is a single object, wrap in an array
    const data = Array.isArray(json) ? json : [json];

    if (data.length === 0) return "";

    // Flatten nested structures for tabular output
    const flattenedData = data.map(item => flattenObject(item));

    // Extract all unique headers across objects
    const headers = Array.from(
        new Set(flattenedData.flatMap(item => Object.keys(item)))
    );

    const csvRows = [];

    // Header row
    csvRows.push(headers.map(escapeCSVValue).join(","));

    // Data rows
    for (const row of flattenedData) {
        const values = headers.map(header => {
            const val = row[header];
            return escapeCSVValue(val !== undefined ? val : "");
        });
        csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
}

/**
 * Converts a JSON object or array to YAML format.
 */
function jsonToYAML(json, indent = 0) {
    const spacing = " ".repeat(indent);

    if (json === null) return "null";
    if (typeof json === "boolean" || typeof json === "number") return String(json);
    if (typeof json === "string") return JSON.stringify(json);

    if (Array.isArray(json)) {
        if (json.length === 0) return "[]";
        return json
            .map(item => {
                if (typeof item === "object" && item !== null) {
                    const formatted = jsonToYAML(item, indent + 2).trimStart();
                    return `${spacing}- ${formatted}`;
                }
                return `${spacing}- ${jsonToYAML(item, indent + 2)}`;
            })
            .join("\n");
    }

    if (typeof json === "object") {
        const keys = Object.keys(json);
        if (keys.length === 0) return "{}";
        return keys
            .map(key => {
                const val = json[key];
                if (typeof val === "object" && val !== null) {
                    return `${spacing}${key}:\n${jsonToYAML(val, indent + 2)}`;
                }
                return `${spacing}${key}: ${jsonToYAML(val, indent)}`;
            })
            .join("\n");
    }

    return String(json);
}

/**
 * Converts a JSON object or array to XML format.
 */
function jsonToXML(json, rootName = "root") {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

    function buildXml(obj, nodeName) {
        const cleanTag = sanitizeTagName(nodeName);

        if (obj === null || obj === undefined) {
            return `<${cleanTag}/>`;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => buildXml(item, cleanTag)).join("\n");
        }

        if (typeof obj === "object") {
            let children = Object.entries(obj)
                .map(([key, val]) => buildXml(val, key))
                .join("\n  ");
            
            return children
                ? `<${cleanTag}>\n  ${children}\n</${cleanTag}>`
                : `<${cleanTag}/>`;
        }

        return `<${cleanTag}>${escapeXML(String(obj))}</${cleanTag}>`;
    }

    return xml + buildXml(json, rootName);
}

/* Helper functions */

function flattenObject(obj, prefix = "") {
    const result = {};

    for (const [key, value] of Object.entries(obj || {})) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
            result[newKey] = JSON.stringify(value);
        } else {
            result[newKey] = value;
        }
    }

    return result;
}

function escapeCSVValue(value) {
    if (value === null || value === undefined) return '""';
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function escapeXML(str) {
    return str.replace(/[<>&'"]/g, char => ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;"
    }[char]));
}

function sanitizeTagName(name) {
    let tag = name.replace(/[^a-zA-Z0-9_-]/g, "_");
    if (/^[0-9]/.test(tag)) tag = "_" + tag;
    return tag || "item";
}