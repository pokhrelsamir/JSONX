/**
 * =========================================================
 * JSONX — Application Controller
 * =========================================================
 */

const $ = id => document.getElementById(id);

const jsonInput = $("jsonInput");
const jsonOutput = $("jsonOutput");
const formatButton = $("formatButton");
const minifyButton = $("minifyButton");
const validateButton = $("validateButton");
const copyButton = $("copyButton");
const downloadButton = $("downloadButton");
const clearButton = $("clearButton");
const sampleButton = $("sampleButton");
const themeToggle = $("themeToggle");
const indentSize = $("indentSize");
const errorMessage = $("errorMessage");
const errorText = $("errorText");
const inputStatus = $("inputStatus");
const outputStatus = $("outputStatus");
const jsonTree = $("jsonTree");
const expandAllButton = $("expandAllButton");
const collapseAllButton = $("collapseAllButton");
const treeSearch = $("treeSearch");
const searchCount = $("searchCount");
const fileInput = $("fileInput");
const clearHistoryButton = $("clearHistoryButton");
const historyList = $("historyList");

// Export buttons
const exportCsvBtn = $("exportCsvBtn");
const exportYamlBtn = $("exportYamlBtn");
const exportXmlBtn = $("exportXmlBtn");

const stats = {
    objects: $("objectCount"),
    arrays: $("arrayCount"),
    keys: $("keyCount"),
    strings: $("stringCount"),
    numbers: $("numberCount"),
    booleans: $("booleanCount"),
    nulls: $("nullCount"),
    depth: $("depthCount")
};

const SAMPLE_JSON = {
    user: {
        name: "Samir",
        age: 26,
        active: true,
        location: { city: "Pokhara", country: "Nepal" },
        skills: ["HTML", "CSS", "JavaScript", "Python"]
    },
    projects: [
        { name: "JSONX", type: "Developer Tool", status: "active" },
        { name: "StatKit", type: "Statistics Toolkit", status: "complete" }
    ],
    metadata: { version: "1.0.0", openSource: true, notes: null }
};

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    loadSavedData();
    loadSavedTheme();
    renderHistory();
    updateStatistics(null);
    updateInputMeta();
    attachEventListeners();
}

function attachEventListeners() {
    formatButton.addEventListener("click", handleFormat);
    minifyButton.addEventListener("click", handleMinify);
    validateButton.addEventListener("click", handleValidate);
    copyButton.addEventListener("click", handleCopy);
    downloadButton.addEventListener("click", handleDownload);
    clearButton.addEventListener("click", handleClear);
    sampleButton.addEventListener("click", handleSample);
    themeToggle.addEventListener("click", toggleTheme);
    expandAllButton.addEventListener("click", expandAllTreeNodes);
    collapseAllButton.addEventListener("click", collapseAllTreeNodes);
    clearHistoryButton.addEventListener("click", handleClearHistory);
    treeSearch.addEventListener("input", handleTreeSearch);
    fileInput.addEventListener("change", handleFileImport);

    // Export conversion handlers
    if (exportCsvBtn) exportCsvBtn.addEventListener("click", () => handleExport("csv"));
    if (exportYamlBtn) exportYamlBtn.addEventListener("click", () => handleExport("yaml"));
    if (exportXmlBtn) exportXmlBtn.addEventListener("click", () => handleExport("xml"));

    jsonInput.addEventListener("input", () => {
        saveJSON(jsonInput.value);
        updateInputMeta();
        inputStatus.textContent = jsonInput.value.trim() ? "Editing" : "Ready";
        if (!jsonInput.value.trim()) {
            outputStatus.textContent = "Ready";
            hideError();
        }
    });

    jsonInput.addEventListener("keydown", event => {
        if (event.key === "Tab") {
            event.preventDefault();
            const start = jsonInput.selectionStart;
            const end = jsonInput.selectionEnd;
            jsonInput.value = jsonInput.value.substring(0, start) + "  " + jsonInput.value.substring(end);
            jsonInput.selectionStart = jsonInput.selectionEnd = start + 2;
        }
    });

    document.addEventListener("keydown", handleShortcuts);
}

function handleShortcuts(event) {
    if (!event.ctrlKey) return;

    if (event.key === "Enter") {
        event.preventDefault();
        handleFormat();
    } else if (event.shiftKey && event.key.toLowerCase() === "m") {
        event.preventDefault();
        handleMinify();
    } else if (event.shiftKey && event.key.toLowerCase() === "v") {
        event.preventDefault();
        handleValidate();
    } else if (event.shiftKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        handleCopy();
    } else if (event.key.toLowerCase() === "k") {
        event.preventDefault();
        handleClear();
    }
}

function handleFormat() {
    try {
        const formatted = formatJSON(jsonInput.value, Number(indentSize.value));
        const data = JSON.parse(jsonInput.value);

        setOutput(formatted, "Formatted");
        renderJSONTree(data, jsonTree);
        updateStatistics(data);
        setValidState();
        saveAndRemember();
    } catch (error) {
        handleError(error.message);
    }
}

function handleMinify() {
    try {
        const minified = minifyJSON(jsonInput.value);
        const data = JSON.parse(jsonInput.value);

        setOutput(minified, "Minified");
        renderJSONTree(data, jsonTree);
        updateStatistics(data);
        setValidState();
        saveAndRemember();
    } catch (error) {
        handleError(error.message);
    }
}

function handleValidate() {
    const result = validateJSON(jsonInput.value);

    if (!result.valid) {
        inputStatus.textContent = "Invalid";
        inputStatus.classList.add("invalid");
        outputStatus.textContent = "Invalid";
        showError(result.error);
        return;
    }

    setValidState();
    renderJSONTree(result.data, jsonTree);
    updateStatistics(result.data);
    hideError();
}

function handleExport(type) {
    const raw = jsonInput.value.trim();
    if (!raw) {
        showError("Please enter valid JSON before exporting.");
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        let converted = "";
        let mimeType = "text/plain";
        let extension = type;

        if (type === "csv") {
            converted = jsonToCSV(parsed);
            mimeType = "text/csv";
        } else if (type === "yaml") {
            converted = jsonToYAML(parsed);
            mimeType = "text/yaml";
            extension = "yaml";
        } else if (type === "xml") {
            converted = jsonToXML(parsed);
            mimeType = "application/xml";
        }

        downloadFile(converted, `jsonx-export.${extension}`, mimeType);
    } catch (error) {
        handleError(`Export failed: ${error.message}`);
    }
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function setValidState() {
    inputStatus.textContent = "Valid";
    inputStatus.classList.remove("invalid");
    inputStatus.classList.add("success");
}

function setOutput(output, label) {
    jsonOutput.textContent = output;
    outputStatus.textContent = label;
    outputStatus.classList.add("success");
    outputStatus.classList.remove("invalid");
    updateOutputMeta();
    hideError();
}

async function handleCopy() {
    const output = jsonOutput.textContent;

    if (!output) {
        showError("There is no JSON output to copy.");
        return;
    }

    try {
        await navigator.clipboard.writeText(output);
        const original = copyButton.textContent;
        copyButton.textContent = "Copied";
        setTimeout(() => copyButton.textContent = original, 1400);
    } catch {
        showError("Unable to copy JSON. Your browser may block clipboard access.");
    }
}

function handleDownload() {
    const output = jsonOutput.textContent;

    if (!output) {
        showError("There is no JSON available to download.");
        return;
    }

    downloadFile(output, "jsonx-output.json", "application/json");
}

function handleClear() {
    jsonInput.value = "";
    jsonOutput.textContent = "";
    clearStoredJSON();

    inputStatus.textContent = "Ready";
    inputStatus.classList.remove("success", "invalid");
    outputStatus.textContent = "Ready";
    outputStatus.classList.remove("success", "invalid");

    hideError();
    updateStatistics(null);
    updateInputMeta();
    updateOutputMeta();
    treeSearch.value = "";
    searchCount.textContent = "0";
    renderEmptyTree();
}

function handleSample() {
    jsonInput.value = JSON.stringify(SAMPLE_JSON, null, 2);
    saveJSON(jsonInput.value);
    updateInputMeta();
    handleFormat();
}

function handleError(message) {
    inputStatus.textContent = "Invalid";
    inputStatus.classList.remove("success");
    inputStatus.classList.add("invalid");
    outputStatus.textContent = "Error";
    outputStatus.classList.remove("success");
    outputStatus.classList.add("invalid");
    showError(message);
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.hidden = false;
}

function hideError() {
    errorMessage.hidden = true;
    errorText.textContent = "";
}

function updateStatistics(data) {
    const result = {
        objects: 0,
        arrays: 0,
        keys: 0,
        strings: 0,
        numbers: 0,
        booleans: 0,
        nulls: 0,
        depth: 0
    };

    if (data !== null && data !== undefined) {
        analyzeJSON(data, 1, result);
    }

    stats.objects.textContent = result.objects;
    stats.arrays.textContent = result.arrays;
    stats.keys.textContent = result.keys;
    stats.strings.textContent = result.strings;
    stats.numbers.textContent = result.numbers;
    stats.booleans.textContent = result.booleans;
    stats.nulls.textContent = result.nulls;
    stats.depth.textContent = result.depth;
}

function analyzeJSON(value, depth, result) {
    result.depth = Math.max(result.depth, depth);

    if (Array.isArray(value)) {
        result.arrays++;
        value.forEach(item => analyzeJSON(item, depth + 1, result));
        return;
    }

    if (typeof value === "object" && value !== null) {
        result.objects++;
        Object.entries(value).forEach(([key, child]) => {
            result.keys++;
            analyzeJSON(child, depth + 1, result);
        });
        return;
    }

    if (typeof value === "string") result.strings++;
    else if (typeof value === "number") result.numbers++;
    else if (typeof value === "boolean") result.booleans++;
    else if (value === null) result.nulls++;
}

function updateInputMeta() {
    const count = jsonInput.value.length;
    $("inputMeta").textContent = `${count.toLocaleString()} characters`;
}

function updateOutputMeta() {
    const count = jsonOutput.textContent.length;
    $("outputMeta").textContent = `${count.toLocaleString()} characters`;
}

function saveAndRemember() {
    const value = jsonInput.value.trim();
    if (!value) return;
    saveJSON(value);
    addHistory(value);
    renderHistory();
}

function loadSavedData() {
    const saved = loadJSON();
    if (saved) jsonInput.value = saved;
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    saveTheme(isDark ? "dark" : "light");
}

function loadSavedTheme() {
    if (loadTheme() === "dark") document.body.classList.add("dark");
}

function handleTreeSearch() {
    searchCount.textContent = String(searchTree(treeSearch.value));
}

function renderEmptyTree() {
    jsonTree.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">{ }</div>
            <h3>Nothing to explore yet</h3>
            <p>Enter valid JSON and format it to view the structure.</p>
        </div>
    `;
}

async function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        JSON.parse(text);

        jsonInput.value = text;
        saveJSON(text);
        updateInputMeta();
        handleFormat();
    } catch (error) {
        showError(`Unable to import "${file.name}". ${error.message}`);
        handleError(error.message);
    } finally {
        fileInput.value = "";
    }
}

function renderHistory() {
    const history = loadHistory();

    if (!history.length) {
        historyList.innerHTML = `<div class="history-empty">No recent JSON yet.</div>`;
        return;
    }

    historyList.innerHTML = history.map((item, index) => {
        let title = "JSON snippet";

        try {
            const parsed = JSON.parse(item.data);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                const firstKey = Object.keys(parsed)[0];
                if (firstKey) title = firstKey;
            }
        } catch {}

        const date = new Date(item.createdAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        return `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-name">${escapeHTML(title)}</div>
                    <div class="history-meta">${item.data.length.toLocaleString()} characters · ${date}</div>
                </div>
                <button class="text-button history-load" data-history-index="${index}">Load</button>
            </div>
        `;
    }).join("");

    historyList.querySelectorAll("[data-history-index]").forEach(button => {
        button.addEventListener("click", () => {
            const item = history[Number(button.dataset.historyIndex)];
            if (!item) return;

            jsonInput.value = item.data;
            saveJSON(item.data);
            updateInputMeta();
            handleFormat();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

function handleClearHistory() {
    clearHistory();
    renderHistory();
}

function escapeHTML(value) {
    return value.replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}