/**
 * =========================================================
 * JSONX
 * JSON Formatter & Explorer
 * JSON Validator
 * =========================================================
 *
 * Responsibilities:
 * - Validate JSON
 * - Detect parsing errors
 * - Return readable error information
 * =========================================================
 */


/**
 * Validate JSON input
 *
 * @param {string} input
 * @returns {object}
 */
function validateJSON(input) {

    if (!input || !input.trim()) {

        return {
            valid: false,
            error: "JSON input is empty."
        };
    }


    try {

        const data = JSON.parse(input);

        return {
            valid: true,
            data: data,
            error: null
        };

    } catch (error) {

        return {
            valid: false,
            data: null,
            error: formatJSONError(error.message)
        };
    }
}


/**
 * Convert browser JSON errors
 * into cleaner messages.
 *
 * @param {string} message
 * @returns {string}
 */
function formatJSONError(message) {

    if (!message) {
        return "Invalid JSON syntax.";
    }

    return message
        .replace(/^JSON\.parse:\s*/i, "")
        .replace(/\s+/g, " ")
        .trim();
}


/**
 * Check whether JSON is valid
 *
 * @param {string} input
 * @returns {boolean}
 */
function isValidJSON(input) {

    return validateJSON(input).valid;
}