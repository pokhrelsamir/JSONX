/**
 * JSONX — JSON Validator
 */

function validateJSON(input) {
    if (!input || !input.trim()) {
        return { valid: false, data: null, error: "JSON input is empty." };
    }

    try {
        const data = JSON.parse(input);
        return { valid: true, data, error: null };
    } catch (error) {
        return {
            valid: false,
            data: null,
            error: formatJSONError(error.message, input)
        };
    }
}

function formatJSONError(message, input = "") {
    if (!message) return "Invalid JSON syntax.";

    const positionMatch = message.match(/position\s+(\d+)/i);
    if (positionMatch) {
        const position = Number(positionMatch[1]);
        const before = input.slice(0, position);
        const line = before.split("\n").length;
        const column = position - before.lastIndexOf("\n");
        return `${message.replace(/\s+/g, " ").trim()} (line ${line}, column ${column})`;
    }

    return message
        .replace(/^JSON\.parse:\s*/i, "")
        .replace(/\s+/g, " ")
        .trim();
}

function isValidJSON(input) {
    return validateJSON(input).valid;
}
