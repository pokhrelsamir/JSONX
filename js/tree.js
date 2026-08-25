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


/**
 * JSONX Interactive Tree Explorer
 * Render JSON as expandable tree nodes with path copying and search.
 */
const TreeExplorer = (() => {
  let containerElement = null;

  const init = (containerId) => {
    containerElement = document.getElementById(containerId);
  };

  const renderTree = (data, searchFilter = '') => {
    if (!containerElement) return;
    containerElement.innerHTML = '';
    const rootNode = createNode('root', data, '', searchFilter.toLowerCase());
    containerElement.appendChild(rootNode);
  };

  const createNode = (key, value, path, filter) => {
    const nodeWrapper = document.createElement('div');
    nodeWrapper.className = 'tree-node';

    const currentPath = path ? (Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`) : key;
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    const header = document.createElement('div');
    header.className = 'tree-header';

    // Expand/Collapse Toggle Icon
    if (isObject) {
      const toggle = document.createElement('span');
      toggle.className = 'tree-toggle expanded';
      toggle.textContent = '▼';
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nodeWrapper.classList.toggle('collapsed');
        toggle.textContent = nodeWrapper.classList.contains('collapsed') ? '▶' : '▼';
      });
      header.appendChild(toggle);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'tree-spacer';
      header.appendChild(spacer);
    }

    // Key Name Display
    const keySpan = document.createElement('span');
    keySpan.className = 'tree-key';
    keySpan.textContent = isArray ? `[${key}]:` : `${key}:`;
    header.appendChild(keySpan);

    // Value or Composite Type Badge
    if (isObject) {
      const typeBadge = document.createElement('span');
      typeBadge.className = 'tree-badge';
      const count = Object.keys(value).length;
      typeBadge.textContent = isArray ? `Array(${count})` : `Object{${count}}`;
      header.appendChild(typeBadge);
    } else {
      const valSpan = document.createElement('span');
      valSpan.className = `tree-val tree-val-${typeof value}`;
      valSpan.textContent = typeof value === 'string' ? `"${value}"` : String(value);

      // Highlight match if filter is active
      if (filter && (key.toLowerCase().includes(filter) || String(value).toLowerCase().includes(filter))) {
        header.classList.add('tree-highlight');
      }

      header.appendChild(valSpan);
    }

    // Copy Path Button on hover
    const copyPathBtn = document.createElement('button');
    copyPathBtn.className = 'copy-path-btn';
    copyPathBtn.title = `Copy Path: ${currentPath}`;
    copyPathBtn.textContent = '📍';
    copyPathBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(currentPath);
      copyPathBtn.textContent = '✓';
      setTimeout(() => (copyPathBtn.textContent = '📍'), 1000);
    });
    header.appendChild(copyPathBtn);

    nodeWrapper.appendChild(header);

    // Recursively render children for objects and arrays
    if (isObject) {
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'tree-children';

      Object.keys(value).forEach((childKey) => {
        const childNode = createNode(childKey, value[childKey], currentPath, filter);
        childrenContainer.appendChild(childNode);
      });

      nodeWrapper.appendChild(childrenContainer);
    }

    return nodeWrapper;
  };

  const expandAll = () => {
    containerElement.querySelectorAll('.tree-node').forEach((node) => node.classList.remove('collapsed'));
    containerElement.querySelectorAll('.tree-toggle').forEach((toggle) => (toggle.textContent = '▼'));
  };

  const collapseAll = () => {
    containerElement.querySelectorAll('.tree-node').forEach((node) => node.classList.add('collapsed'));
    containerElement.querySelectorAll('.tree-toggle').forEach((toggle) => (toggle.textContent = '▶'));
  };

  return { init, renderTree, expandAll, collapseAll };
})();