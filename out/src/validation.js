const path = require("path");
const fs = require("fs");
const vscode = require("vscode");

function validateDocument(document) {
  const diagnostics = [];
  const text = document.getText();
  const lines = text.split(/\r?\n/);

  const sectionHeaders = new Set();
  let currentSection = null;
  const keysInCurrentSection = new Set();

  let hasRainmeterSection = false;
  let hasVariablesSection = false;

  const fileDir = path.dirname(document.uri.fsPath);
  const includedFiles = new Set();
  //=======================================================Validate Macros======================================================================//
  const resolveRainmeterMacros = (filePath, context) => {
    const skinsDir = path.resolve(context.fileDir, "../../") + path.sep; // Add path.sep for trailing backslash
    let baseSkinDir = context.fileDir;

    // Find the base skin directory that contains "@Resources"
    while (!fs.existsSync(path.join(baseSkinDir, "@Resources")) && baseSkinDir !== skinsDir) {
        baseSkinDir = path.dirname(baseSkinDir);
    }

    // Define paths for resources and root config
    const resourcesPath = fs.existsSync(path.join(baseSkinDir, "@Resources"))
        ? path.join(baseSkinDir, "@Resources") + path.sep
        : "";

    const rootConfigPath = baseSkinDir + path.sep;
    const currentConfigPath = path.dirname(context.currentFilePath) + path.sep;

    // Get the full relative path from skinsDir to the current skin's directory
    const currentConfig = path.relative(skinsDir, currentConfigPath).replace(/\\/g, '/'); // Use forward slashes for consistency

    // Ensure currentConfig does not include the file name
    const currentFile = path.basename(context.currentFilePath);
    const rootConfig = path.basename(baseSkinDir);

    const supportedMacros = {
        "#@#": resourcesPath,
        "#SKINSPATH#": skinsDir, // This has a trailing backslash
        "#CURRENTPATH#": currentConfigPath,
        "#CURRENTFILE#": currentFile,
        "#ROOTCONFIGPATH#": rootConfigPath,
        "#ROOTCONFIG#": rootConfig,
        "#CURRENTCONFIG#": currentConfig.endsWith('/') ? currentConfig.slice(0, -1) : currentConfig, // Ensure no trailing slash
    };

    // Log each key-value pair for debugging
    for (const [key, value] of Object.entries(supportedMacros)) {
        console.log(`${key}: ${value}`);
    }

    // Replace macros in the input filePath
    let resolvedPath = filePath;
    Object.keys(supportedMacros).forEach((macro) => {
        const value = supportedMacros[macro];
        resolvedPath = resolvedPath.split(macro).join(value);
    });

    // Check for unsupported macros
    const unsupportedMacroRegex = /\/?#\w+#|\[#.*?\]/g;


    const hasUnsupported = unsupportedMacroRegex.test(resolvedPath);

    return {
        path: resolvedPath,
        hasUnsupported,
    };
};

  //=======================================================Validate for Meter Keys======================================================================//
  const validateMeterKeys = (lines, diagnostics, validKeys, meterType, sharedKeys = []) => {
    let inTargetMeter = false;
    let currentSection = null;


    const allValidKeys = [...validKeys, ...sharedKeys];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();


      if (!trimmedLine || trimmedLine.startsWith(";") || trimmedLine.toLowerCase().startsWith("@include")) {
        return;
      }


      if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
        currentSection = trimmedLine.slice(1, -1);
        inTargetMeter = false;
        return;
      }

      if (currentSection && trimmedLine.toLowerCase() === `meter=${meterType.toLowerCase()}`) {
        inTargetMeter = true;
        return;
      }


      if (inTargetMeter) {
        const keyValue = trimmedLine.split("=", 2).map((s) => s.trim());
        if (keyValue.length !== 2) return;

        const [key] = keyValue;


        if (key.toLowerCase().startsWith("@include")) return;

        if (key && !allValidKeys.includes(key)) {
          const range = new vscode.Range(
            new vscode.Position(index, 0),
            new vscode.Position(index, key.length)
          );
          diagnostics.push(
            new vscode.Diagnostic(
              range,
              `Invalid key '${key}' in [${currentSection}]. Valid keys for ${meterType} are: ${validKeys.join(", ")} (shared keys: ${sharedKeys.join(", ")}).`,
              vscode.DiagnosticSeverity.Error
            )
          );
        }
      }
    });
  };
  const sharedKeys = [
    "DynamicVariables",
    "SolidColor",
  ];

  const validStringMeterKeys = [
    "Text",
    "FontSize",
    "FontColor",
    "FontFace",
    "StringStyle",
    "StringAlign",
    "Padding",
    "AntiAlias",
    "ClipString",
    "TransformationMatrix",
  ];

  const validImageMeterKeys = [
    "ImageName",
    "ImageTint",
    "ImageRotate",
    "ImageFlip",
    "ImageCrop",
    "ImageDivide",
  ];

  validateMeterKeys(lines, diagnostics, validStringMeterKeys, "String", sharedKeys);
  validateMeterKeys(lines, diagnostics, validImageMeterKeys, "Image", sharedKeys);

  //=======================================================Main validation logic======================================================================//
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith(";")) return;

    if (trimmedLine.startsWith("[")) {
      if (!trimmedLine.endsWith("]")) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
            "Section header must end with ']'.",
            vscode.DiagnosticSeverity.Warning
          )
        );
      } else {
        const sectionName = trimmedLine.slice(1, -1);
        if (sectionName.length > 255) {
          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(
                new vscode.Position(index, 1),
                new vscode.Position(index, trimmedLine.length - 1)
              ),
              "Section name is too long. Maximum allowed length is 255 characters.",
              vscode.DiagnosticSeverity.Error
            )
          );
        }
        if (!/^[a-zA-Z0-9_\-]+$/.test(sectionName)) {
          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(
                new vscode.Position(index, 1),
                new vscode.Position(index, trimmedLine.length - 1)
              ),
              "Section header contains invalid characters. Only alphanumeric, underscores, and hyphens are allowed.",
              vscode.DiagnosticSeverity.Error
            )
          );
        }
        if (sectionHeaders.has(sectionName)) {
          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(
                new vscode.Position(index, 1),
                new vscode.Position(index, trimmedLine.length - 1)
              ),
              `Duplicate section header: [${sectionName}].`,
              vscode.DiagnosticSeverity.Warning
            )
          );
        } else {
          sectionHeaders.add(sectionName);
        }

        if (sectionName.toLowerCase() === "rainmeter") hasRainmeterSection = true;
        if (sectionName.toLowerCase() === "variables") hasVariablesSection = true;

        currentSection = sectionName;
        keysInCurrentSection.clear();
      }
      return;
    }
    const [key, value] = trimmedLine.split("=", 2);

    if (key?.trim().toLowerCase().startsWith("@include")) {
      const rawPath = value?.trim().replace(/"/g, "");
      const { path: resolvedPath, hasUnsupported } = resolveRainmeterMacros(rawPath, {
        fileDir,
        currentFilePath: document.uri.fsPath,
      });

      if (hasUnsupported) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(
              new vscode.Position(index, key.length + 1),
              new vscode.Position(index, line.length)
            ),
            `Path contains unsupported macros: ${rawPath}. Macros remain unresolved.`,
            vscode.DiagnosticSeverity.Hint
          )
        );
        return;
      }
      if (!fs.existsSync(resolvedPath)) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(
              new vscode.Position(index, key.length + 1),
              new vscode.Position(index, line.length)
            ),
            `Included file not found: ${rawPath} (Resolved: ${resolvedPath}). Ensure the macro resolves to a valid file path.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      } else if (includedFiles.has(resolvedPath)) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
            `Circular include detected for file: ${rawPath} (Resolved: ${resolvedPath}).`,
            vscode.DiagnosticSeverity.Error
          )
        );
      } else {
        includedFiles.add(resolvedPath);
      }
      return;
    }
    if (!key || value === undefined) {
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
          "Key-value pair is malformed. Ensure the format is 'Key=Value'.",
          vscode.DiagnosticSeverity.Error
        )
      );
    } else if (keysInCurrentSection.has(key)) {
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, key.length)),
          `Duplicate key '${key}' found in section [${currentSection}].`,
          vscode.DiagnosticSeverity.Warning
        )
      );
    } else {
      keysInCurrentSection.add(key);
    }
  });

  if (!hasRainmeterSection) {
    diagnostics.push(
      new vscode.Diagnostic(
        new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)),
        "Missing required section: [Rainmeter].",
        vscode.DiagnosticSeverity.Error
      )
    );
  }
  if (!hasVariablesSection) {
    diagnostics.push(
      new vscode.Diagnostic(
        new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)),
        "Missing recommended section: [Variables].",
        vscode.DiagnosticSeverity.Warning
      )
    );
  }

  return diagnostics;
}

module.exports = {
  validateDocument,
};