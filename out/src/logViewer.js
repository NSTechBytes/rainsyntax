const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

let logPanel = null;
let refreshInterval = null;

function getDefaultRainmeterLogPath() {
  return path.join(process.env.APPDATA || "", "Rainmeter", "Rainmeter.log");
}

function getFormattedLogContent(logFilePath) {
  // Return guide if file missing
  if (!logFilePath || !fs.existsSync(logFilePath)) {
    return getLogGuideHtml("Rainmeter.log not found. Please select the correct path.");
  }

  // Read and strip BOM if present
  let raw = fs.readFileSync(logFilePath, "utf8");
  raw = raw.replace(/^\uFEFF/, "");

  // Return guide if empty
  if (!raw.trim()) {
    return getLogGuideHtml(
      "Rainmeter.log is empty. Please ensure that logging is enabled (Logging=1 in Rainmeter.ini)."
    );
  }

  // Split, reverse, and format each line
  const lines = raw.split("\n").filter(Boolean).reverse();
  return lines
    .map((line, idx) => {
      const escaped = line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const level = getLogLevel(escaped);
      return `
        <div class="log-line ${level}">
          <pre>${escaped}</pre>
          <button onclick="copyLine(${idx})" title="Copy this line">📋</button>
        </div>`;
    })
    .join("");
}

function getLogGuideHtml(reason) {
  // Full guide HTML block
  return `
    <div class="log-guide">
      <h2>📄 Rainmeter Log Guide</h2>
      <p>${reason}</p>
      <p>You can manually select the <code>Rainmeter.log</code> file if it's in a custom or portable location.</p>
      <p><strong>Step 1:</strong> Ensure that Rainmeter logging is enabled:</p>
      <ul>
        <li>Open your <code>Rainmeter.ini</code> file in the Rainmeter installation or portable folder.</li>
        <li>Set <code>Logging=1</code> under the <code>[Rainmeter]</code> section.</li>
      </ul>
      <p><strong>Step 2:</strong> Restart Rainmeter to apply changes.</p>
      <p><strong>Step 3:</strong> Use the <strong>📂 Change Log Path</strong> option above if Rainmeter is installed in a custom directory.</p>
    </div>`;
}

function getLogLevel(line) {
  // Detect levels based on Rainmeter prefixes
  if (/\bERRO\b/.test(line)) return "error";
  if (/\bWARN\b/.test(line)) return "warning";
  if (/\bDBUG\b/i.test(line)) return "debug";
  if (/\bDEBUG\b/i.test(line)) return "debug";
  if (/\bNOTE\b/i.test(line)) return "note";
  return "note";
}

function openLogViewerPanel(context) {
  if (logPanel) {
    logPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  const defaultPath = getDefaultRainmeterLogPath();
  let currentLogPath = context.globalState.get("rainmeterLogPath") || defaultPath;

  logPanel = vscode.window.createWebviewPanel(
    "rainmeterLogViewer",
    "📄 Rainmeter Logs",
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  function update() {
    currentLogPath = context.globalState.get("rainmeterLogPath") || defaultPath;
    const content = getFormattedLogContent(currentLogPath);
    logPanel.webview.html = getWebviewHtml(content, currentLogPath);
  }

  update();
  refreshInterval = setInterval(update, 1000);

  logPanel.webview.onDidReceiveMessage(async (msg) => {
    const logPath = context.globalState.get("rainmeterLogPath") || defaultPath;
    switch (msg.command) {
      case "copyAll":
        if (fs.existsSync(logPath)) {
          vscode.env.clipboard.writeText(fs.readFileSync(logPath, "utf8"));
          vscode.window.showInformationMessage("✅ All logs copied to clipboard");
        }
        break;
      case "clearLogs":
        if (fs.existsSync(logPath)) {
          fs.writeFileSync(logPath, "");
          vscode.window.showInformationMessage("🗑️ Logs cleared");
          update();
        }
        break;
      case "copyLine": {
        const lines = fs.readFileSync(logPath, "utf8").split("\n").filter(Boolean).reverse();
        const line = lines[msg.index] || "";
        vscode.env.clipboard.writeText(line);
        vscode.window.showInformationMessage("📋 Log line copied");
        break;
      }
      case "changePath": {
        const file = await vscode.window.showOpenDialog({
          canSelectMany: false,
          openLabel: "Select Rainmeter.log",
          filters: { Log: ["log"], All: ["*"] },
        });
        if (file && file[0]) {
          const newPath = file[0].fsPath;
          await context.globalState.update("rainmeterLogPath", newPath);
          vscode.window.showInformationMessage(`📂 Custom Rainmeter.log path saved: ${newPath}`);
          update();
        }
        break;
      }
    }
  });

  logPanel.onDidDispose(() => {
    clearInterval(refreshInterval);
    logPanel = null;
  }, null, context.subscriptions);
}

function getWebviewHtml(logContent, logPath) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      --color-note: #9cdcfe;
      --color-warning: #ffae00;
      --color-error: #f44747;
      --color-debug: #4ec9b0;
    }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:0; background:#343746; color:#ecf0f1; }
    h1 { text-align:center; padding:20px; margin:0; background:#21222c; color:#fff; border-radius:8px 8px 0 0; font-size:24px; text-transform:uppercase; }
    .controls { background:#21222c; padding:10px; display:flex; gap:10px; align-items:center; border-bottom:1px solid #3c3c3c; }
    .controls button { background:#1abc9c; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; text-transform:uppercase; }
    .controls button:hover { background:#16a085; }
    .log-path { font-size:12px; color:#bdc3c7; margin-left: auto; }
    #logs { padding:10px; }
    .log-line { display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:#21222c; border:1px solid #3c3c3c; border-radius:4px; margin-bottom:4px; }
    .log-line pre { margin:0; white-space: pre; color: inherit; font-family: monospace; }
    .log-line button { background:none; border:none; cursor:pointer; color:#1abc9c; font-size:16px; }
    .note    { color: var(--color-note); }
    .warning { color: var(--color-warning); }
    .error   { color: var(--color-error); }
    .debug   { color: var(--color-debug); }
    .log-guide { padding:20px; background:#21222c; border:1px solid #3c3c3c; border-radius:8px; margin:20px; }
    .log-guide h2 { margin-top:0; color:#1abc9c; }
    .log-guide p, .log-guide ul { color:#bdc3c7; font-size:14px; }
    .log-guide code { background:#2d2f3b; padding:2px 6px; border-radius:4px; color:#1abc9c; font-family:monospace; }
    footer { text-align:center; margin-top:20px; font-size:12px; color:#7f8c8d; }
    footer a { color:#1abc9c; text-decoration:none; }
    footer a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <h1>Rainmeter Logs</h1>
  <div class="controls">
    <button onclick="post('copyAll')">📋 Copy All</button>
    <button onclick="post('clearLogs')">🗑️ Clear Logs</button>
    <button onclick="post('changePath')">📂 Change Log Path</button>
    <span class="log-path">Current: ${logPath}</span>
  </div>
  <div id="logs">${logContent}</div>
  <footer>Developed with 💚 by Nasir Shahbaz</footer>
  <script>
    const vscode = acquireVsCodeApi();
    function post(cmd) { vscode.postMessage({ command: cmd }); }
    function copyLine(idx) { vscode.postMessage({ command: 'copyLine', index: idx }); }
  </script>
</body>
</html>`;
}

module.exports = { openLogViewerPanel };
