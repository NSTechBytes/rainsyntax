
const vscode = require("vscode");
const { colorProvider } = require("./src/colorFunctions");
const { autoRefresh } = require("./src/autorefresh");
const { registerRainmeterCommands } = require("./src/settings");
const { setupSettingsCommand } = require("./src/webviewContent");
const { validateDocument } = require("./src/validation");
const { provideCompletionItems } = require("./src/autocomplete");

/**
 * This method is called when the extension is activated.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("RainSyntax extension is now active!");
  const diagnosticsCollection = vscode.languages.createDiagnosticCollection("rainmeter");

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: "rainmeter", scheme: "file" },
    {
      provideCompletionItems: (document, position) => provideCompletionItems(document, position),
    },
    "="
  );

  context.subscriptions.push(diagnosticsCollection);
  context.subscriptions.push(completionProvider);
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === "rainmeter") {
        const diagnostics = validateDocument(event.document);
        diagnosticsCollection.set(event.document.uri, diagnostics);
      }
    })
  );

  context.subscriptions.push(diagnosticsCollection);
  vscode.languages.registerColorProvider(colorProvider);
  autoRefresh(context);
  registerRainmeterCommands(context);
  setupSettingsCommand(context);
}


function deactivate() { }

module.exports = {
  activate,
  deactivate,
};