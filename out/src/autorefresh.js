const vscode = require("vscode");
const { exec } = require("child_process");
const path = require("path");
const util = require("util");
const execAsync = util.promisify(exec);
const selector = { scheme: "file", language: "rainmeter" };

/**
 * Initializes Rainmeter-related listeners, such as auto-refresh on file save.
 * @param {vscode.ExtensionContext} context
 */
function autoRefresh(context) {
  const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
    const config = vscode.workspace.getConfiguration("rainSyntax");
    const autoRefreshEnabled = config.get("autoRefreshOnSave", true);
    const refreshMode = config.get("refreshMode", "all");

    if (!autoRefreshEnabled || document.languageId !== "rainmeter") {
      return;
    }

    const isRunning = await RainmeterUtils.isRunning();
    if (!isRunning) {
      vscode.window.showWarningMessage(
        "Rainmeter is not running. Please start Rainmeter to enable skin refreshing."
      );
      return;
    }

    const filePath = document.uri.fsPath;
    if (refreshMode === "specific" && filePath.endsWith(".ini")) {
      RainmeterUtils.refreshSpecificSkin(filePath);
    } else if ([".ini", ".inc", ".nek"].some(ext => filePath.endsWith(ext))) {
      RainmeterUtils.refreshAllSkins();
    }
  });

  context.subscriptions.push(saveListener);
}

/**
 * Rainmeter utility functions.
 */
const RainmeterUtils = {
  /**
   * Checks if Rainmeter is running.
   * @returns {Promise<boolean>} True if running, false otherwise.
   */
  async isRunning() {
    if (process.platform !== "win32") {
      vscode.window.showErrorMessage(
        "Rainmeter is only supported on Windows systems."
      );
      return false;
    }

    try {
      const { stdout } = await execAsync('C:\\Windows\\System32\\tasklist.exe /FI "IMAGENAME eq Rainmeter.exe"');
      return stdout.toLowerCase().includes("rainmeter.exe");
    } catch (error) {
      console.error(`Error checking Rainmeter status: ${error.message}`);
      return false;
    }
  },

  /**
   * Refreshes a specific Rainmeter skin.
   * @param {string} filePath 
   */
  async refreshSpecificSkin(filePath) {
    const config = vscode.workspace.getConfiguration("rainSyntax");
    const rainmeterPath = config.get("rainmeterPath", "C:\\Program Files\\Rainmeter\\Rainmeter.exe");

    if (!rainmeterPath) {
      vscode.window.showErrorMessage(
        "Rainmeter path is not configured. Please set it in the settings."
      );
      return;
    }

    const skinsIndex = filePath.toLowerCase().indexOf("\\skins\\");
    if (skinsIndex === -1) {
      vscode.window.showErrorMessage(
        "The file is not located within the Rainmeter 'Skins' folder. Unable to refresh."
      );
      return;
    }

    const relativePath = filePath.substring(skinsIndex + 7);
    const iniFolderPath = relativePath.split(path.sep).slice(0, -1).join(path.sep);

    try {
      const command = `"${rainmeterPath}" !Refresh "${iniFolderPath}"`;
      await execAsync(command);
      vscode.window.showInformationMessage(
        `Rainmeter skin "${iniFolderPath}" refreshed successfully!`
      );
    } catch (error) {
      console.error(`Error refreshing specific skin: ${error.message}`);
      vscode.window.showErrorMessage(
        `Failed to refresh Rainmeter skin "${iniFolderPath}". Ensure the skin exists and Rainmeter is running.`
      );
    }
  },

  async refreshAllSkins() {
    const config = vscode.workspace.getConfiguration("rainSyntax");
    const rainmeterPath = config.get("rainmeterPath", "C:\\Program Files\\Rainmeter\\Rainmeter.exe");

    if (!rainmeterPath) {
      vscode.window.showErrorMessage(
        "Rainmeter path is not configured. Please set it in the settings."
      );
      return;
    }

    try {
      const command = `"${rainmeterPath}" !RefreshApp`;
      await execAsync(command);
      vscode.window.showInformationMessage("All Rainmeter skins refreshed successfully!");
    } catch (error) {
      console.error(`Error refreshing all skins: ${error.message}`);
      vscode.window.showErrorMessage(
        "Failed to refresh all Rainmeter skins. Ensure Rainmeter is running."
      );
    }
  }
};

module.exports = {
  autoRefresh,
};
