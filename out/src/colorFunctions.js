  const vscode = require("vscode");
  const selector = { scheme: "file", language: "rainmeter" };

  const colorProvider = {
    provideDocumentColors(document, token) {
      const colors = [];
      const text = document.getText();
      const regex = /\b(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\b|(\b[0-9a-fA-F]{6}\b)/g;

      let match;
      while ((match = regex.exec(text)) !== null) {
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(start, end);

        if (match[4]) {

          const color = hexToColor(match[4]);
          colors.push(new vscode.ColorInformation(range, color));
        } else if (match[1]) {

          const r = Math.min(parseInt(match[1]), 255);
          const g = Math.min(parseInt(match[2]), 255);
          const b = Math.min(parseInt(match[3]), 255);

          const color = new vscode.Color(r / 255, g / 255, b / 255, 1);
          colors.push(new vscode.ColorInformation(range, color));
        }
      }
      return colors;
    },

    provideColorPresentations(color, context, token) {
      const text = context.document.getText(context.range);
      let presentationText;

      if (/\b\d{1,3},\s*\d{1,3},\s*\d{1,3}\b/.test(text)) {

        const rgb = colorToRgb(color);
        presentationText = rgb;
      } else if (/\b[0-9a-fA-F]{6}\b/.test(text)) {

        const hex = colorToHex(color);
        presentationText = hex;
      }

      const presentation = new vscode.ColorPresentation(presentationText);
      presentation.textEdit = vscode.TextEdit.replace(context.range, presentationText);
      return [presentation];
    },
  };

  vscode.languages.registerColorProvider(selector, colorProvider);

  function hexToColor(hex) {
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    return new vscode.Color(r, g, b, 1);
  }

  function colorToRgb(color) {
    const r = Math.round(color.red * 255);
    const g = Math.round(color.green * 255);
    const b = Math.round(color.blue * 255);
    return `${r},${g},${b}`;
  }

  function colorToHex(color) {
    const r = Math.round(color.red * 255).toString(16).padStart(2, "0");
    const g = Math.round(color.green * 255).toString(16).padStart(2, "0");
    const b = Math.round(color.blue * 255).toString(16).padStart(2, "0");
    return `${r}${g}${b}`;
  }
  module.exports = {
    colorProvider,
  };