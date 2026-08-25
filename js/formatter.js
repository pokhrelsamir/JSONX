/**
 * JSONX — Formatter Engine
 */

function parseJSON(input) {
    if (!input || !input.trim()) {
        throw new Error("JSON input is empty.");
    }
    return JSON.parse(input);
}

function formatJSON(input, indentation = 2) {
    return JSON.stringify(parseJSON(input), null, indentation);
}

function minifyJSON(input) {
    return JSON.stringify(parseJSON(input));
}

function getJSONData(input) {
    return parseJSON(input);
}
