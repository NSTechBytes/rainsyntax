const vscode = require("vscode");

/**
 * Registers commands related to Rainmeter.
 * @param {vscode.ExtensionContext} context
 */
function registerRainmeterCommands(context) {
  // Toggle Auto Refresh command
  const toggleAutoRefreshCommand = vscode.commands.registerCommand(
    "rainSyntax.toggleAutoRefresh",
    () => {
      const config = vscode.workspace.getConfiguration("rainSyntax");
      const currentSetting = config.get("autoRefreshOnSave");
      const newSetting = !currentSetting;

      config.update("autoRefreshOnSave", newSetting, vscode.ConfigurationTarget.Global)
        .then(() => {
          vscode.window.showInformationMessage(
            `Auto Refresh is now ${newSetting ? "enabled" : "disabled"}`
          );
        });
    }
  );

  // Change Rainmeter Path command
  const changeRainmeterPathCommand = vscode.commands.registerCommand(
    "rainSyntax.changeRainmeterPath",
    async () => {
      const currentPath = vscode.workspace
        .getConfiguration("rainSyntax")
        .get("rainmeterPath");

      const newPath = await vscode.window.showInputBox({
        prompt: "Enter the path to your Rainmeter executable",
        value: currentPath,
        validateInput: (input) => {
          if (input.trim() === "") {
            return "Path cannot be empty!";
          }
          return null;
        },
      });

      if (newPath) {
        vscode.workspace
          .getConfiguration("rainSyntax")
          .update("rainmeterPath", newPath, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage(`Rainmeter path set to: ${newPath}`);
      }
    }
  );

  // Change Refresh Mode command
  const changeRefreshModeCommand = vscode.commands.registerCommand(
    "rainSyntax.changeRefreshMode",
    async () => {
      const options = ["Refresh All Skins", "Refresh Specific Skin"];
      const selection = await vscode.window.showQuickPick(options, {
        placeHolder: "Select the Rainmeter refresh mode",
      });

      if (selection) {
        const newMode = selection === "Refresh All Skins" ? "all" : "specific";
        vscode.workspace
          .getConfiguration("rainSyntax")
          .update("refreshMode", newMode, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage(
          `Rainmeter refresh mode set to: ${selection}`
        );
      }
    }
  );

  // Add commands to the context's subscriptions
  context.subscriptions.push(toggleAutoRefreshCommand);
  context.subscriptions.push(changeRainmeterPathCommand);
  context.subscriptions.push(changeRefreshModeCommand);
}

module.exports = {
  registerRainmeterCommands,
};
