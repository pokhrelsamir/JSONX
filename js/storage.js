/**
 * JSONX — Local Storage Manager
 */

const JSONX_STORAGE_KEY = "jsonx_data";
const JSONX_THEME_KEY = "jsonx_theme";
const JSONX_HISTORY_KEY = "jsonx_history";
const JSONX_HISTORY_LIMIT = 6;

function saveJSON(data) {
    try { localStorage.setItem(JSONX_STORAGE_KEY, data); }
    catch (error) { console.warn("Unable to save JSON:", error); }
}

function loadJSON() {
    try { return localStorage.getItem(JSONX_STORAGE_KEY) || ""; }
    catch (error) { return ""; }
}

function clearStoredJSON() {
    try { localStorage.removeItem(JSONX_STORAGE_KEY); }
    catch (error) { console.warn("Unable to clear stored JSON:", error); }
}

function saveTheme(theme) {
    try { localStorage.setItem(JSONX_THEME_KEY, theme); }
    catch (error) { console.warn("Unable to save theme:", error); }
}

function loadTheme() {
    try { return localStorage.getItem(JSONX_THEME_KEY); }
    catch (error) { return null; }
}

function addHistory(data) {
    if (!data || !data.trim()) return;

    try {
        const history = loadHistory();
        const filtered = history.filter(item => item.data !== data);

        filtered.unshift({
            data,
            createdAt: Date.now()
        });

        localStorage.setItem(
            JSONX_HISTORY_KEY,
            JSON.stringify(filtered.slice(0, JSONX_HISTORY_LIMIT))
        );
    } catch (error) {
        console.warn("Unable to save history:", error);
    }
}

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(JSONX_HISTORY_KEY) || "[]");
    } catch (error) {
        return [];
    }
}

function clearHistory() {
    try { localStorage.removeItem(JSONX_HISTORY_KEY); }
    catch (error) { console.warn("Unable to clear history:", error); }
}
