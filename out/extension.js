const vscode = require("vscode");
const { colorProvider } = require("./src/colorFunctions");
const { autoRefresh } = require("./src/autorefresh");
const { registerRainmeterCommands } = require("./src/settings");
const { setupSettingsCommand } = require("./src/webviewContent");
const { validateDocument } = require("./src/validation");
const { provideCompletionItems } = require("./src/autocomplete");
const { createHoverProvider } = require("./src/hoverProvider");
const { formatRainmeterFile } = require("./src/formatter");
const { openLogViewerPanel } = require("./src/logViewer");
const { createFoldingProvider } = require("./src/sectionFoldingProvider");

/**
 * This method is called when the extension is activated.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("RainSyntax extension is now active!");
  const diagnosticsCollection =
    vscode.languages.createDiagnosticCollection("rainmeter");

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: "rainmeter", scheme: "file" },
    {
      provideCompletionItems: (document, position) =>
        provideCompletionItems(document, position),
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

  const guiButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  guiButton.text = ` 💧 RainSyntax Settings`;
  guiButton.tooltip = "Click to for RainSyntax Settings";
  guiButton.command = "rainSyntax.openSettings";
  guiButton.show();
  context.subscriptions.push(guiButton);

  const hoverProvider = vscode.languages.registerHoverProvider(
    { scheme: "file", language: "rainmeter" },
    createHoverProvider()
  );

  // Add the hover provider to the extension's context
  context.subscriptions.push(hoverProvider);

  // Register folding range provider for section folding
  const foldingProvider = vscode.languages.registerFoldingRangeProvider(
    { scheme: "file", language: "rainmeter" },
    createFoldingProvider()
  );
  context.subscriptions.push(foldingProvider);

  const formatCommand = vscode.commands.registerCommand(
    "rainSyntax.formatRainmeterFile",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const fullText = document.getText();
        const formattedText = formatRainmeterFile(fullText);
        editor.edit((editBuilder) => {
          const range = new vscode.Range(
            document.positionAt(0),
            document.positionAt(fullText.length)
          );
          editBuilder.replace(range, formattedText);
        });
      }
    }
  );

  context.subscriptions.push(formatCommand);

  // Register document formatting provider
  const formattingProvider =
    vscode.languages.registerDocumentFormattingEditProvider(
      { scheme: "file", language: "rainmeter" },
      {
        provideDocumentFormattingEdits(document) {
          const fullText = document.getText();
          const formattedText = formatRainmeterFile(fullText);

          return [
            vscode.TextEdit.replace(
              new vscode.Range(
                document.positionAt(0),
                document.positionAt(fullText.length)
              ),
              formattedText
            ),
          ];
        },
      }
    );

  const logButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99
  );
  logButton.text = `📄 Rainmeter Logs`;
  logButton.tooltip = "Open Rainmeter.log Viewer";
  logButton.command = "rainSyntax.openLogViewer";
  logButton.show();
  context.subscriptions.push(logButton);

  context.subscriptions.push(formattingProvider);

  const logCommand = vscode.commands.registerCommand(
    "rainSyntax.openLogViewer",
    () => {
      openLogViewerPanel(context);
    }
  );
  context.subscriptions.push(logCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };