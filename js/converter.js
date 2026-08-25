/**
 * JSONX Converter Module
 * Handles converting JSON objects into CSV, XML, and YAML formats.
 */
const Converter = (() => {
  // Convert JSON to CSV
  const toCSV = (jsonData) => {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    const array = Array.isArray(data) ? data : [data];
    if (array.length === 0) return '';

    // Collect all unique keys from all objects
    const headers = Array.from(
      new Set(array.flatMap((item) => (typeof item === 'object' && item !== null ? Object.keys(item) : [])))
    );

    if (headers.length === 0) return 'value\n' + array.join('\n');

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of array) {
      const values = headers.map((header) => {
        let val = row[header] ?? '';
        if (typeof val === 'object') val = JSON.stringify(val);
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  // Convert JSON to XML
  const toXML = (jsonData, rootName = 'root') => {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    const parseNode = (obj, name) => {
      if (obj === null || obj === undefined) return `<${name}></${name}>`;
      if (typeof obj !== 'object') return `<${name}>${String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${name}>`;

      let xml = `<${name}>`;
      if (Array.isArray(obj)) {
        xml = obj.map((item) => parseNode(item, 'item')).join('');
      } else {
        for (const key of Object.keys(obj)) {
          xml += parseNode(obj[key], key.replace(/[^a-zA-Z0-9_-]/g, '_'));
        }
        xml += `</${name}>`;
      }
      return xml;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n` + parseNode(data, rootName);
  };

  // Convert JSON to simple YAML
  const toYAML = (jsonData, indent = 0) => {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    const spacing = ' '.repeat(indent);

    if (data === null) return 'null';
    if (typeof data !== 'object') return JSON.stringify(data);

    let yaml = '';
    if (Array.isArray(data)) {
      for (const item of data) {
        if (typeof item === 'object' && item !== null) {
          yaml += `${spacing}-\n${toYAML(item, indent + 2)}\n`;
        } else {
          yaml += `${spacing}- ${toYAML(item, 0)}\n`;
        }
      }
    } else {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
          yaml += `${spacing}${key}:\n${toYAML(value, indent + 2)}\n`;
        } else {
          yaml += `${spacing}${key}: ${toYAML(value, 0)}\n`;
        }
      }
    }
    return yaml.trimEnd();
  };

  // Download string contents as file
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { toCSV, toXML, toYAML, downloadFile };
})();