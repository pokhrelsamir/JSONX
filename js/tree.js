/**
 * =========================================================
 * JSONX
 * JSON Formatter & Explorer
 * JSON Tree Explorer
 * =========================================================
 *
 * Responsibilities:
 * - Build JSON tree
 * - Display objects
 * - Display arrays
 * - Display primitive values
 * - Expand / collapse nodes
 * =========================================================
 */


/**
 * Render JSON tree
 *
 * @param {object|array} data
 * @param {HTMLElement} container
 */
function renderJSONTree(data, container) {

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const tree = createTreeNode(data, "root");

    container.appendChild(tree);
}


/**
 * Create a tree node
 *
 * @param {*} value
 * @param {string} key
 * @returns {HTMLElement}
 */
function createTreeNode(value, key) {

    const wrapper = document.createElement("div");

    wrapper.className = "tree-node";


    /* Object / Array */

    if (typeof value === "object" && value !== null) {

        const isArray = Array.isArray(value);

        const entries = Object.entries(value);

        const nodeHeader = document.createElement("div");

        nodeHeader.className = "tree-header";


        const toggle = document.createElement("button");

        toggle.className = "tree-toggle";
        toggle.textContent = "▼";


        const keyElement = document.createElement("span");

        keyElement.className = "tree-key";
        keyElement.textContent = key;


        const typeElement = document.createElement("span");

        typeElement.className = "tree-type";

        typeElement.textContent = isArray
            ? `Array [${entries.length}]`
            : `Object {${entries.length}}`;


        nodeHeader.appendChild(toggle);
        nodeHeader.appendChild(keyElement);
        nodeHeader.appendChild(typeElement);


        const children = document.createElement("div");

        children.className = "tree-children";


        entries.forEach(([childKey, childValue]) => {

            const childNode = createTreeNode(
                childValue,
                childKey
            );

            children.appendChild(childNode);

        });


        toggle.addEventListener("click", () => {

            const collapsed =
                children.style.display === "none";

            children.style.display =
                collapsed ? "block" : "none";

            toggle.textContent =
                collapsed ? "▼" : "▶";

        });


        wrapper.appendChild(nodeHeader);
        wrapper.appendChild(children);

    }

    /* Primitive */

    else {

        const primitive = document.createElement("div");

        primitive.className = "tree-primitive";


        const keyElement = document.createElement("span");

        keyElement.className = "tree-key";

        keyElement.textContent = key;


        const valueElement = document.createElement("span");

        valueElement.className =
            `tree-value tree-${typeof value}`;

        valueElement.textContent =
            formatTreeValue(value);


        primitive.appendChild(keyElement);
        primitive.appendChild(valueElement);

        wrapper.appendChild(primitive);
    }


    return wrapper;
}


/**
 * Format primitive values
 *
 * @param {*} value
 * @returns {string}
 */
function formatTreeValue(value) {

    if (value === null) {
        return "null";
    }

    if (typeof value === "string") {
        return `"${value}"`;
    }

    return String(value);
}


/**
 * Expand all tree nodes
 */
function expandAllTreeNodes() {

    document
        .querySelectorAll(".tree-children")
        .forEach(element => {
            element.style.display = "block";
        });

    document
        .querySelectorAll(".tree-toggle")
        .forEach(button => {
            button.textContent = "▼";
        });
}


/**
 * Collapse all tree nodes
 */
function collapseAllTreeNodes() {

    document
        .querySelectorAll(".tree-children")
        .forEach(element => {
            element.style.display = "none";
        });

    document
        .querySelectorAll(".tree-toggle")
        .forEach(button => {
            button.textContent = "▶";
        });
}