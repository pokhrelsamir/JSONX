/**
 * =========================================================
 * JSONX
 * JSON Formatter & Explorer
 * Local Storage Manager
 * =========================================================
 *
 * Responsibilities:
 * - Save JSON locally
 * - Load saved JSON
 * - Store theme preference
 * - Store recent JSON
 * =========================================================
 */

const JSONX_STORAGE_KEY = "jsonx_data";
const JSONX_THEME_KEY = "jsonx_theme";


/**
 * Save JSON input
 *
 * @param {string} data
 */
function saveJSON(data) {

    try {
        localStorage.setItem(
            JSONX_STORAGE_KEY,
            data
        );
    } catch (error) {
        console.warn(
            "Unable to save JSON:",
            error
        );
    }
}


/**
 * Load previously saved JSON
 *
 * @returns {string}
 */
function loadJSON() {

    try {

        return localStorage.getItem(
            JSONX_STORAGE_KEY
        ) || "";

    } catch (error) {

        console.warn(
            "Unable to load JSON:",
            error
        );

        return "";
    }
}


/**
 * Clear stored JSON
 */
function clearStoredJSON() {

    try {

        localStorage.removeItem(
            JSONX_STORAGE_KEY
        );

    } catch (error) {

        console.warn(
            "Unable to clear stored JSON:",
            error
        );
    }
}


/**
 * Save theme
 *
 * @param {string} theme
 */
function saveTheme(theme) {

    try {

        localStorage.setItem(
            JSONX_THEME_KEY,
            theme
        );

    } catch (error) {

        console.warn(
            "Unable to save theme:",
            error
        );
    }
}


/**
 * Load theme
 *
 * @returns {string|null}
 */
function loadTheme() {

    try {

        return localStorage.getItem(
            JSONX_THEME_KEY
        );

    } catch (error) {

        console.warn(
            "Unable to load theme:",
            error
        );

        return null;
    }
}