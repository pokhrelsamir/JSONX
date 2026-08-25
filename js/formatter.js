/**
 * =========================================================
 * JSONX
 * JSON Formatter & Explorer
 * Formatter Engine
 * =========================================================
 *
 * Responsibilities:
 * - Format JSON
 * - Minify JSON
 * - Parse JSON
 * - Generate formatted output
 * - Handle indentation
 * =========================================================
 */


/**
 * Parse JSON text
 *
 * @param {string} input
 * @returns {object|array}
 */
function parseJSON(input) {

    if (!input || !input.trim()) {
        throw new Error("JSON input is empty.");
    }

    return JSON.parse(input);
}


/**
 * Format JSON
 *
 * @param {string} input
 * @param {number} indentation
 * @returns {string}
 */
function formatJSON(input, indentation = 2) {

    const data = parseJSON(input);

    return JSON.stringify(data, null, indentation);
}


/**
 * Minify JSON
 *
 * @param {string} input
 * @returns {string}
 */
function minifyJSON(input) {

    const data = parseJSON(input);

    return JSON.stringify(data);
}


/**
 * Get JSON data
 *
 * @param {string} input
 * @returns {object|array}
 */
function getJSONData(input) {

    return parseJSON(input);
}