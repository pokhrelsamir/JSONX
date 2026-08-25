/**
 * JSONX — JSON Tree Explorer
 */

let currentTreeData = null;

function renderJSONTree(data, container) {
    if (!container) return;

    currentTreeData = data;
    container.innerHTML = "";

    const tree = createTreeNode(data, "root", true);
    container.appendChild(tree);
}

function createTreeNode(value, key, isRoot = false) {
    const wrapper = document.createElement("div");
    wrapper.className = "tree-node";

    if (typeof value === "object" && value !== null) {
        const isArray = Array.isArray(value);
        const entries = Object.entries(value);

        const nodeHeader = document.createElement("div");
        nodeHeader.className = "tree-header";

        const toggle = document.createElement("button");
        toggle.className = "tree-toggle";
        toggle.type = "button";
        toggle.textContent = entries.length ? "▼" : "•";
        toggle.disabled = !entries.length;
        toggle.setAttribute("aria-label", entries.length ? "Toggle node" : "Empty node");

        const keyElement = document.createElement("span");
        keyElement.className = "tree-key";
        keyElement.textContent = key;

        const typeElement = document.createElement("span");
        typeElement.className = "tree-type";
        typeElement.textContent = isArray
            ? `Array [${entries.length}]`
            : `Object {${entries.length}}`;

        nodeHeader.append(toggle, keyElement, typeElement);

        const children = document.createElement("div");
        children.className = "tree-children";

        entries.forEach(([childKey, childValue]) => {
            children.appendChild(createTreeNode(childValue, childKey));
        });

        toggle.addEventListener("click", () => {
            const collapsed = children.style.display === "none";
            children.style.display = collapsed ? "block" : "none";
            toggle.textContent = collapsed ? "▼" : "▶";
        });

        wrapper.append(nodeHeader, children);
    } else {
        const primitive = document.createElement("div");
        primitive.className = "tree-primitive";

        const keyElement = document.createElement("span");
        keyElement.className = "tree-key";
        keyElement.textContent = key;

        const valueElement = document.createElement("span");
        valueElement.className = `tree-value tree-${value === null ? "null" : typeof value}`;
        valueElement.textContent = formatTreeValue(value);

        primitive.append(keyElement, valueElement);
        wrapper.appendChild(primitive);
    }

    return wrapper;
}

function formatTreeValue(value) {
    if (value === null) return "null";
    if (typeof value === "string") return `"${value}"`;
    return String(value);
}

function expandAllTreeNodes() {
    document.querySelectorAll(".tree-children").forEach(el => el.style.display = "block");
    document.querySelectorAll(".tree-toggle").forEach(btn => {
        if (!btn.disabled) btn.textContent = "▼";
    });
}

function collapseAllTreeNodes() {
    document.querySelectorAll(".tree-children").forEach(el => el.style.display = "none");
    document.querySelectorAll(".tree-toggle").forEach(btn => {
        if (!btn.disabled) btn.textContent = "▶";
    });
}

function searchTree(query) {
    const normalized = query.trim().toLowerCase();
    const nodes = document.querySelectorAll("#jsonTree .tree-node");
    let matches = 0;

    nodes.forEach(node => {
        node.classList.remove("tree-hidden");
        node.querySelectorAll(".tree-match").forEach(el => el.classList.remove("tree-match"));

        if (!normalized) return;

        const text = node.textContent.toLowerCase();
        if (text.includes(normalized)) {
            matches++;
        } else {
            node.classList.add("tree-hidden");
        }
    });

    if (normalized) {
        document.querySelectorAll("#jsonTree .tree-node").forEach(node => {
            const text = node.textContent.toLowerCase();
            if (text.includes(normalized)) {
                let parent = node.parentElement.closest(".tree-node");
                while (parent) {
                    parent.classList.remove("tree-hidden");
                    const children = parent.querySelector(":scope > .tree-children");
                    if (children) children.style.display = "block";
                    const toggle = parent.querySelector(":scope > .tree-header > .tree-toggle");
                    if (toggle && !toggle.disabled) toggle.textContent = "▼";
                    parent = parent.parentElement.closest(".tree-node");
                }
            }
        });
    }

    return matches;
}
