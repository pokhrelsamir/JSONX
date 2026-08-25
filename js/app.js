/**
 * =========================================================
 * JSONX
 * JSON Formatter & Explorer
 * Application Controller
 * =========================================================
 *
 * Responsibilities:
 * - UI event handling
 * - Format / Minify
 * - Validation
 * - Statistics
 * - Tree rendering
 * - Clipboard
 * - Download
 * - Theme switching
 * - Local storage
 * - Sample data
 * =========================================================
 */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const jsonInput =
    document.getElementById("jsonInput");

const jsonOutput =
    document.getElementById("jsonOutput");

const formatButton =
    document.getElementById("formatButton");

const minifyButton =
    document.getElementById("minifyButton");

const validateButton =
    document.getElementById("validateButton");

const copyButton =
    document.getElementById("copyButton");

const downloadButton =
    document.getElementById("downloadButton");

const clearButton =
    document.getElementById("clearButton");

const sampleButton =
    document.getElementById("sampleButton");

const themeToggle =
    document.getElementById("themeToggle");

const indentSize =
    document.getElementById("indentSize");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");

const inputStatus =
    document.getElementById("inputStatus");

const outputStatus =
    document.getElementById("outputStatus");

const jsonTree =
    document.getElementById("jsonTree");

const expandAllButton =
    document.getElementById("expandAllButton");

const collapseAllButton =
    document.getElementById("collapseAllButton");


/* =========================================================
   STATISTIC ELEMENTS
   ========================================================= */

const objectCount =
    document.getElementById("objectCount");

const arrayCount =
    document.getElementById("arrayCount");

const keyCount =
    document.getElementById("keyCount");

const stringCount =
    document.getElementById("stringCount");

const numberCount =
    document.getElementById("numberCount");

const depthCount =
    document.getElementById("depthCount");


/* =========================================================
   SAMPLE JSON
   ========================================================= */

const SAMPLE_JSON = {
    user: {
        name: "Samir",
        age: 26,
        active: true,
        location: {
            city: "Pokhara",
            country: "Nepal"
        },
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Python"
        ]
    },

    projects: [
        {
            name: "JSONX",
            type: "Developer Tool"
        },
        {
            name: "StatKit",
            type: "Statistics Toolkit"
        }
    ]
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    loadSavedData();

    loadSavedTheme();

    attachEventListeners();

    updateStatistics(null);
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function attachEventListeners() {

    formatButton.addEventListener(
        "click",
        handleFormat
    );

    minifyButton.addEventListener(
        "click",
        handleMinify
    );

    validateButton.addEventListener(
        "click",
        handleValidate
    );

    copyButton.addEventListener(
        "click",
        handleCopy
    );

    downloadButton.addEventListener(
        "click",
        handleDownload
    );

    clearButton.addEventListener(
        "click",
        handleClear
    );

    sampleButton.addEventListener(
        "click",
        handleSample
    );

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );

    expandAllButton.addEventListener(
        "click",
        expandAllTreeNodes
    );

    collapseAllButton.addEventListener(
        "click",
        collapseAllTreeNodes
    );


    jsonInput.addEventListener(
        "input",
        handleInput
    );
}


/* =========================================================
   INPUT HANDLING
   ========================================================= */

function handleInput() {

    const value = jsonInput.value.trim();

    saveJSON(value);

    hideError();

    if (!value) {

        inputStatus.textContent = "Ready";

        outputStatus.textContent = "Ready";

        return;
    }

    inputStatus.textContent = "Editing";
}


/* =========================================================
   FORMAT
   ========================================================= */

function handleFormat() {

    const input = jsonInput.value;

    const indentation =
        Number(indentSize.value);

    try {

        const formatted =
            formatJSON(
                input,
                indentation
            );

        jsonOutput.textContent =
            formatted;

        const data =
            JSON.parse(input);

        renderJSONTree(
            data,
            jsonTree
        );

        updateStatistics(data);

        inputStatus.textContent =
            "Valid";

        outputStatus.textContent =
            "Formatted";

        hideError();

        saveJSON(input);

    } catch (error) {

        showError(
            error.message
        );

        outputStatus.textContent =
            "Error";
    }
}


/* =========================================================
   MINIFY
   ========================================================= */

function handleMinify() {

    const input = jsonInput.value;

    try {

        const minified =
            minifyJSON(input);

        jsonOutput.textContent =
            minified;

        const data =
            JSON.parse(input);

        renderJSONTree(
            data,
            jsonTree
        );

        updateStatistics(data);

        inputStatus.textContent =
            "Valid";

        outputStatus.textContent =
            "Minified";

        hideError();

        saveJSON(input);

    } catch (error) {

        showError(
            error.message
        );

        outputStatus.textContent =
            "Error";
    }
}


/* =========================================================
   VALIDATE
   ========================================================= */

function handleValidate() {

    const result =
        validateJSON(
            jsonInput.value
        );


    if (result.valid) {

        inputStatus.textContent =
            "Valid";

        outputStatus.textContent =
            "Valid";

        hideError();

        updateStatistics(
            result.data
        );

        renderJSONTree(
            result.data,
            jsonTree
        );

    } else {

        inputStatus.textContent =
            "Invalid";

        outputStatus.textContent =
            "Invalid";

        showError(
            result.error
        );
    }
}


/* =========================================================
   COPY
   ========================================================= */

async function handleCopy() {

    const output =
        jsonOutput.textContent;

    if (!output) {

        showError(
            "There is no formatted JSON to copy."
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(
            output
        );

        const originalText =
            copyButton.textContent;

        copyButton.textContent =
            "Copied";

        setTimeout(() => {

            copyButton.textContent =
                originalText;

        }, 1400);

    } catch (error) {

        showError(
            "Unable to copy JSON."
        );
    }
}


/* =========================================================
   DOWNLOAD
   ========================================================= */

function handleDownload() {

    const output =
        jsonOutput.textContent;

    if (!output) {

        showError(
            "There is no JSON available to download."
        );

        return;
    }


    const blob =
        new Blob(
            [output],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "jsonx-output.json";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


/* =========================================================
   CLEAR
   ========================================================= */

function handleClear() {

    jsonInput.value = "";

    jsonOutput.textContent = "";

    clearStoredJSON();

    hideError();

    inputStatus.textContent =
        "Ready";

    outputStatus.textContent =
        "Ready";

    updateStatistics(null);

    jsonTree.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                { }
            </div>

            <h3>
                Nothing to explore yet
            </h3>

            <p>
                Enter valid JSON and format it to view the structure.
            </p>

        </div>
    `;
}


/* =========================================================
   SAMPLE
   ========================================================= */

function handleSample() {

    const sample =
        JSON.stringify(
            SAMPLE_JSON,
            null,
            2
        );

    jsonInput.value =
        sample;

    saveJSON(sample);

    handleFormat();
}


/* =========================================================
   ERROR HANDLING
   ========================================================= */

function showError(message) {

    errorText.textContent =
        message;

    errorMessage.hidden =
        false;
}


function hideError() {

    errorMessage.hidden =
        true;

    errorText.textContent =
        "";
}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics(data) {

    if (data === null || data === undefined) {

        objectCount.textContent = "0";
        arrayCount.textContent = "0";
        keyCount.textContent = "0";
        stringCount.textContent = "0";
        numberCount.textContent = "0";
        depthCount.textContent = "0";

        return;
    }


    const stats = {
        objects: 0,
        arrays: 0,
        keys: 0,
        strings: 0,
        numbers: 0,
        depth: 0
    };


    analyzeJSON(
        data,
        1,
        stats
    );


    objectCount.textContent =
        stats.objects;

    arrayCount.textContent =
        stats.arrays;

    keyCount.textContent =
        stats.keys;

    stringCount.textContent =
        stats.strings;

    numberCount.textContent =
        stats.numbers;

    depthCount.textContent =
        stats.depth;
}


/**
 * Analyze JSON recursively
 *
 * @param {*} value
 * @param {number} depth
 * @param {object} stats
 */
function analyzeJSON(
    value,
    depth,
    stats
) {

    stats.depth =
        Math.max(
            stats.depth,
            depth
        );


    if (Array.isArray(value)) {

        stats.arrays++;

        value.forEach(item => {

            analyzeJSON(
                item,
                depth + 1,
                stats
            );

        });

        return;
    }


    if (
        typeof value === "object" &&
        value !== null
    ) {

        stats.objects++;

        Object.entries(value)
            .forEach(
                ([key, child]) => {

                    stats.keys++;

                    analyzeJSON(
                        child,
                        depth + 1,
                        stats
                    );

                }
            );

        return;
    }


    if (typeof value === "string") {
        stats.strings++;
    }

    else if (typeof value === "number") {
        stats.numbers++;
    }
}


/* =========================================================
   THEME
   ========================================================= */

function toggleTheme() {

    const isDark =
        document.body.classList.toggle(
            "dark"
        );


    const theme =
        isDark
            ? "dark"
            : "light";


    saveTheme(theme);
}


function loadSavedTheme() {

    const theme =
        loadTheme();

    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );
    }
}


/* =========================================================
   LOAD SAVED DATA
   ========================================================= */

function loadSavedData() {

    const saved =
        loadJSON();

    if (!saved) {
        return;
    }

    jsonInput.value =
        saved;
}