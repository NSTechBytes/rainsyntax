const vscode = require("vscode");

function setupSettingsCommand(context) {
  const openSettingsCommand = vscode.commands.registerCommand(
    "rainSyntax.openSettings",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "rainSyntaxSettings",
        "RainSyntax Settings",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === "saveSettings") {
          await vscode.workspace
            .getConfiguration("rainSyntax")
            .update("rainmeterPath", message.rainmeterPath, true);
          await vscode.workspace
            .getConfiguration("rainSyntax")
            .update("autoRefreshOnSave", message.autoRefreshOnSave, true);
          await vscode.workspace
            .getConfiguration("rainSyntax")
            .update("refreshMode", message.refreshMode, true);

          vscode.window.showInformationMessage("RainSyntax settings updated!");
        }
      });
    }
  );

  context.subscriptions.push(openSettingsCommand);
}

function getWebviewContent() {
  const config = vscode.workspace.getConfiguration("rainSyntax");
  const rainmeterPath = config.get(
    "rainmeterPath",
    "C:\\Program Files\\Rainmeter\\Rainmeter.exe"
  );
  const autoRefreshOnSave = config.get("autoRefreshOnSave", true);
  const refreshMode = config.get("refreshMode", "all");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RainSyntax Settings</title>
      <style>
         
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(to bottom, #343746, #343746);
              color: #ecf0f1;
          }
          h1 {
              text-align: center;
              padding: 20px;
              margin: 0;
              background-color: #21222c;
              color: #fff;
              border-radius: 8px 8px 0 0;
              font-size: 24px;
              text-transform: uppercase;
              letter-spacing: 2px;
          }
          form {
              max-width: 400px;
              margin: 30px auto;
              padding: 20px;
              background-color: #21222c;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
              border-radius: 8px;
          }
          label {
              display: block;
              margin-bottom: 5px;
              font-weight: 600;
              color: #bdc3c7;
          }
          input, select, button {
          
              margin-bottom: 15px;
              padding: 10px;
              border: 1px solid #7f8c8d;
              border-radius: 4px;
              font-size: 16px;
              background-color: #34495e;
              color: #ecf0f1;
          }
          input{
              width: 95%;
          }
          select{
              width: 100%;
          }
          input::placeholder {
              color: #95a5a6;
          }
          input:focus, select:focus {
              border-color: #1abc9c;
              outline: none;
              box-shadow: 0 0 5px rgba(26, 188, 156, 0.5);
          }
          button {
              background-color: #1abc9c;
              color: #fff;
              font-weight: 600;
              border: none;
              cursor: pointer;
              width: 100%;
              text-transform: uppercase;
          }
          button:hover {
              background-color: #16a085;
          }
          .checkbox-wrapper {
              display: flex;
              align-items: center;
              gap: 10px;
           
          }
          .checkbox-wrapper span {
              color: #bdc3c7;
          }
          /* Add subtle animation */
          button {
              transition: background-color 0.3s ease;
          }
          input, select {
              transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
                  footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #7f8c8d;
    }
    footer a {
      color: #1abc9c;
      text-decoration: none;
    }
    footer a:hover {
      text-decoration: underline;
    }
      </style>
  </head>
  <body>
      <h1>RainSyntax Settings 💧</h1>
      <form id="settingsForm">
          <label for="rainmeterPath">Rainmeter Path</label>
          <input type="text" id="rainmeterPath" value="${rainmeterPath}" placeholder="Enter Rainmeter path" />
  
          <label for="autoRefreshOnSave">Auto Refresh on Save</label>
          <div class="checkbox-wrapper">
              <input type="checkbox" id="autoRefreshOnSave" ${
                autoRefreshOnSave ? "checked" : ""
              } />
              <span>Enable auto refresh when saving files</span>
          </div>
  
          <label for="refreshMode">Refresh Mode</label>
          <select id="refreshMode">
              <option value="all" ${
                refreshMode === "all" ? "selected" : ""
              }>All Skins</option>
              <option value="specific" ${
                refreshMode === "specific" ? "selected" : ""
              }>Specific Skin</option>
          </select>
  
          <button type="button" id="saveSettings">Save Settings</button>
      </form>
        <footer>
    Made with ❤ by <a href="https://github.com/NSTechBytes" target="_blank">NS Tech Bytes</a>
  </footer>
      <script>
          const vscode = acquireVsCodeApi();
  
          document.getElementById('saveSettings').addEventListener('click', () => {
              const rainmeterPath = document.getElementById('rainmeterPath').value;
              const autoRefreshOnSave = document.getElementById('autoRefreshOnSave').checked;
              const refreshMode = document.getElementById('refreshMode').value;
  
              vscode.postMessage({
                  command: 'saveSettings',
                  rainmeterPath: rainmeterPath,
                  autoRefreshOnSave: autoRefreshOnSave,
                  refreshMode: refreshMode
              });
          });
      </script>
  </body>
  </html>

  `;
}

module.exports = {
  setupSettingsCommand,
};
