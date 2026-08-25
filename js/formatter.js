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

/**
 * JSONX Formatter Module
 * Handles JSON string formatting, minification, and syntax highlighting.
 */
const Formatter = (() => {
  const formatJSON = (jsonString, indentSize = 2) => {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indentSize);
  };

  const minifyJSON = (jsonString) => {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  };

  const highlightJSON = (jsonString) => {
    if (!jsonString) return '';
    
    // Escape HTML special characters to prevent XSS
    const escaped = jsonString
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Regex matching keys, strings, numbers, booleans, and nulls
    const jsonRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

    return escaped.replace(jsonRegex, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return {
    formatJSON,
    minifyJSON,
    highlightJSON
  };
})();