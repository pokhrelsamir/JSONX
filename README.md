# 🌐 JSONX — Professional JSON Toolkit

<div align="center">

<br>

### Format. Inspect. Convert. Master.

**JSONX** is a modern, high-performance **JSON Formatter, Validator, Tree Explorer, and Converter** designed to help developers, students, and engineers clean, analyze, convert, and explore complex JSON payloads seamlessly in real time.

<br>

<a href="https://pokhrelsamir.github.io/JSONX/">
  <img src="https://img.shields.io/badge/%F0%9F%9A%80%20Live%20Demo-JSONX-6366f1?style=for-the-badge" alt="Live Demo">
</a>
<a href="https://github.com/pokhrelsamir/JSONX">
  <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
</a>

<br><br>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Responsive-Yes-22c55e?style=for-the-badge" alt="Responsive">
<img src="https://img.shields.io/badge/Privacy-100%25%20Local-8b5cf6?style=for-the-badge" alt="Local & Privacy">

</div>

---

## 📌 About JSONX

JSONX is a client-side Web application built to make **JSON payload manipulation, inspection, and format conversion fast and privacy-friendly**.

Instead of juggling different tools for beautifying JSON, validating syntax errors, exploring tree nodes, computing metrics, converting formats, and keeping local history, JSONX combines everything into a unified developer dashboard.

The application combines:

* 🧮 JSON Formatter & Minifier
* 🔍 Structural Parser & Validator
* 🌳 Interactive Tree Explorer & Search
* 📊 Deep Structural Analytics (Key, Depth, Data Type counters)
* 🔄 Export Converters (CSV, YAML, XML)
* 💾 Local Storage Snippet History
* 📱 Fully Responsive Interface
* 🌙 Modern Dark & Light Themes

Everything runs entirely in your browser using standard JavaScript engines—no external APIs, remote network calls, or server processes touch your data.

---

# ✨ Features

## 🧮 JSON Formatting & Editing

Beautify or condense your JSON payloads instantly.

**Includes:**

* Configurable indentation spacing (2, 4, or 8 spaces)
* Single-click Minifier to strip unnecessary whitespace
* Real-time character counters for input and output panes
* File import via file picker (`.json`)
* Quick sample payload loader
* Clipboard copy with instant visual confirmation
* File download functionality (`jsonx-output.json`)

---

## 🔍 Validation & Error Handling

Detect syntax flaws and structure issues before sending payloads to APIs or databases.

**Includes:**

* Instant parse checks with precise error messages
* Line/token syntax error highlighting
* Dynamic status indicators (`Ready`, `Editing`, `Valid`, `Invalid`, `Error`)
* Non-blocking UI error banners

---

## 🌳 Interactive Tree Explorer

Navigate complex, deeply nested JSON objects visually.

**Includes:**

* Collapsible and expandable object/array nodes
* One-click **Expand All** and **Collapse All** actions
* Dynamic live node search across keys and scalar values
* Matching key/value count feedback
* Fallback empty states for missing or unparsed inputs

---

## 📊 Structural Insights & Analytics

Analyze structural statistics at a glance without writing custom diagnostic scripts.

**Tracks:**

* Total Objects count
* Total Arrays count
* Total Keys count
* Data type counters (Strings, Numbers, Booleans, Nulls)
* Maximum nesting depth level

---

## 🔄 Multi-Format Export Converters

Transform structured JSON payloads into alternative data exchange formats.

**Supported Converters:**

```text
JSON ➔ CSV  (Flattens arrays/nested structures into tabular rows)
JSON ➔ YAML (Generates clean, indented YAML data key-value hierarchies)
JSON ➔ XML  (Converts nested objects into valid, sanitized XML trees)

```

---

## 💾 Workspace History

Keep track of recent JSON snippets without losing your context.

**Features:**

* Automatic local persistence (`localStorage`)
* Timestamped entries with character counts
* Auto-generated contextual titles from payload keys
* One-click history loading back into the editor
* History clear functionality

---

# ⌨️ Keyboard Shortcuts

Speed up your developer workflow using integrated hotkeys.

| Action | Shortcut |
| --- | --- |
| **Format JSON** | Ctrl + Enter |
| **Minify JSON** | Ctrl + Shift + M |
| **Validate JSON** | Ctrl + Shift + V |
| **Copy Output** | Ctrl + Shift + C |
| **Clear Workspace** | Ctrl + K |

---

# 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| **HTML5** | Web application structure and semantic elements |
| **CSS3** | Modern styling, CSS variables, dark/light themes, custom scrollbars |
| **JavaScript (ES6+)** | Core state management, string conversion logic, and DOM handling |
| **DOM API** | Dynamic node rendering and tree manipulation |
| **CSS Grid & Flexbox** | Dual-pane responsive layout system |
| **Web Storage API** | Browser `localStorage` for history and preferences |

---

# 📁 Project Structure

```text
JSONX/
│
├── index.html
├── README.md     
│
├── css/
│   └── style.css 
│
└── js/
    ├── formatter.js  
    ├── validator.js  
    ├── tree.js       
    ├── converter.js  
    ├── storage.js    
    └── app.js

```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone [https://github.com/pokhrelsamir/JSONX.git](https://github.com/pokhrelsamir/JSONX.git)

```

## 2. Navigate to the Directory

```bash
cd JSONX

```

## 3. Open the Application

Launch `index.html` directly in your browser.

For an improved live-reloading experience during development, use **Visual Studio Code with Live Server**.

---

# 💻 Running with Live Server

If using VS Code:

1. Open the `JSONX` workspace folder.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The dashboard will launch in your default Web browser.

---

# 🌐 Live Demo

Try the deployed web application:

[https://pokhrelsamir.github.io/JSONX/](https://pokhrelsamir.github.io/JSONX/)

---

# 🔒 Privacy & Local Security

JSONX is built with a **Local-First Architecture**.

## Zero Server Overhead

All conversions, formatting routines, and tree generations are processed purely inside your client engine.

User data such as:

```text
API Response payloads
Private key/token configurations
Application state JSON
Export files

```

is never uploaded to external servers or third-party tracking services.

---

# 🗺️ Application Modules Overview

```text
JSONX
│
├── 🧮 Workspace Section
│   ├── Input Panel (Textarea, File Import, Sample Loader)
│   ├── Formatted Output Panel (Copy, Raw Output, Character Stats)
│   ├── Action Toolbar (Format, Minify, Validate, Indent Select, Download)
│   └── Export Actions (CSV, YAML, XML)
│
├── 📊 JSON Insights Section
│   └── Metric Counters (Objects, Arrays, Keys, Strings, Numbers, Booleans, Nulls, Depth)
│
├── 🌳 Explorer Section
│   ├── Tree Search Bar & Node Counter
│   ├── Expand / Collapse Controls
│   └── Dynamic Tree Node Viewer
│
├── 💾 Recent History Section
│   └── Local Snippets List & Quick Restore Controls
│
└── ⌨️ Shortcuts Reference

```

---

# 🔮 Future Improvements

* [ ] JSON Schema validation support
* [ ] Full bi-directional conversion (CSV / YAML / XML to JSON)
* [ ] Large-file streaming support for multi-megabyte payloads
* [ ] Side-by-side JSON Diff viewer
* [ ] Custom color theme builder for code highlighting

---

# 🤝 Contributing

Contributions are welcome! If you want to enhance JSONX:

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch** (`git checkout -b feature/awesome-feature`).
3. **Commit your Changes** (`git commit -m "Add awesome converter feature"`).
4. **Push to the Branch** (`git push origin feature/awesome-feature`).
5. **Open a Pull Request** describing your changes.

---

# 👨‍💻 Author

### Samir Pokhrel

**B.Sc. CSIT Student | Web Developer | Software Enthusiast**

Built using **HTML, CSS, and JavaScript**

---

# ⭐ Support

If **JSONX** helps you inspect APIs or format JSON data faster, feel free to give the repository a ⭐ on GitHub!

---

### 🌐 JSONX

**Format. Inspect. Convert. Master.**

Made for developers.

Built for speed.

Designed for privacy.