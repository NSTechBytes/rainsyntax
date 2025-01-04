const vscode = require("vscode");
const { exec } = require("child_process");
const path = require("path");
const selector = { scheme: "file", language: "rainmeter" };
/**
 * Initializes Rainmeter-related listeners, such as auto-refresh on file save.
 * @param {vscode.ExtensionContext} context
 */
function autoRefresh(context) {
  const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    const autoRefreshEnabled = vscode.workspace
      .getConfiguration("rainSyntax")
      .get("autoRefreshOnSave", true);

    if (!autoRefreshEnabled || document.languageId !== "rainmeter") {
      return;
    }

    const refreshMode = vscode.workspace
      .getConfiguration("rainSyntax")
      .get("refreshMode", "all");

    if (refreshMode === "specific" && document.uri.fsPath.endsWith(".ini")) {
      refreshSpecificSkin(document.uri.fsPath);
    } else if (
      refreshMode === "all" &&
      (document.uri.fsPath.endsWith(".ini") ||
        document.uri.fsPath.endsWith(".inc") ||
        document.uri.fsPath.endsWith(".nek"))
    ) {
      refreshAllSkins();
    }
  });

  context.subscriptions.push(saveListener);
}


/**
 * Refreshes a specific Rainmeter skin based on the file path.
 * @param {string} filePath - The file path of the skin to refresh.
 */
function refreshSpecificSkin(filePath) {
  const rainmeterPath = vscode.workspace
    .getConfiguration("rainSyntax")
    .get("rainmeterPath", "C:\\Program Files\\Rainmeter\\Rainmeter.exe");

  if (!rainmeterPath) {
    vscode.window.showErrorMessage(
      "Rainmeter path is not configured. Please set it in the settings."
    );
    return;
  }

  const skinsIndex = filePath.toLowerCase().indexOf("\\skins\\");
  if (skinsIndex === -1) {
    vscode.window.showErrorMessage(
      "File is not located within the Rainmeter 'Skins' folder."
    );
    return;
  }

  const relativePath = filePath.substring(skinsIndex + 7);
  const iniFolderPath = relativePath.split(path.sep).slice(0, -1).join(path.sep);

  const sanitizedIniFolderPath = iniFolderPath.trim().replace(/[^\w\s\-\\]/g, "");

  exec(
    `"${rainmeterPath}" !Refresh "${sanitizedIniFolderPath}"`,
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`Error refreshing Rainmeter: ${error?.message || stderr}`);
        vscode.window.showErrorMessage(
          `Failed to refresh Rainmeter skin "${sanitizedIniFolderPath}". Ensure the skin exists.`
        );
        return;
      }

      vscode.window.showInformationMessage(
        `Rainmeter skin "${sanitizedIniFolderPath}" refreshed successfully!`
      );
    }
  );
}

/**
 * Refreshes all Rainmeter skins.
 */
function refreshAllSkins() {
  const rainmeterPath = vscode.workspace
    .getConfiguration("rainSyntax")
    .get("rainmeterPath", "C:\\Program Files\\Rainmeter\\Rainmeter.exe");

  if (!rainmeterPath) {
    vscode.window.showErrorMessage(
      "Rainmeter path is not configured. Please set it in the settings."
    );
    return;
  }

  exec(`"${rainmeterPath}" !RefreshApp`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error refreshing Rainmeter: ${error.message}`);
      vscode.window.showErrorMessage(
        "Failed to refresh Rainmeter. Make sure Rainmeter is installed."
      );
      return;
    }

    vscode.window.showInformationMessage(
      "Rainmeter skins refreshed successfully!"
    );
  });
}


module.exports = {
  autoRefresh,
  refreshSpecificSkin,
  refreshAllSkins,
};
