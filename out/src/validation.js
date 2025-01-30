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
    let baseSkinDir = context.fileDir;
    let skinsDir = baseSkinDir;
    while (
      !fs.existsSync(path.join(skinsDir, "Skins")) &&
      skinsDir !== path.dirname(skinsDir)
    ) {
      skinsDir = path.dirname(skinsDir);
    }

    if (!fs.existsSync(path.join(skinsDir, "Skins"))) {
      console.error("Error: Skins directory not found.");
      skinsDir = "";
    } else {
      skinsDir = path.join(skinsDir, "Skins") + path.sep;
    }
    while (
      !fs.existsSync(path.join(baseSkinDir, "@Resources")) &&
      baseSkinDir !== path.dirname(baseSkinDir)
    ) {
      baseSkinDir = path.dirname(baseSkinDir);
    }
    const resourcesPath = fs.existsSync(path.join(baseSkinDir, "@Resources"))
      ? path.join(baseSkinDir, "@Resources") + path.sep
      : "";

    const rootConfigPath = baseSkinDir + path.sep;
    const currentConfigPath = path.dirname(context.currentFilePath) + path.sep;

    let currentConfig = "";
    if (skinsDir && context.currentFilePath.startsWith(skinsDir)) {
      currentConfig = path.relative(
        skinsDir,
        path.dirname(context.currentFilePath)
      );
    }

    if (!currentConfig || currentConfig === "") {
      currentConfig = ".";
    }

    const supportedMacros = {
      "#@#": resourcesPath,
      "#SKINSPATH#": skinsDir,
      "#CURRENTPATH#": currentConfigPath,
      "#CURRENTFILE#": path.basename(context.currentFilePath),
      "#ROOTCONFIGPATH#": rootConfigPath,
      "#ROOTCONFIG#": path.basename(baseSkinDir),
      "#CURRENTCONFIG#": currentConfig,
    };

    let resolvedPath = filePath;
    Object.keys(supportedMacros).forEach((macro) => {
      const value = supportedMacros[macro];
      resolvedPath = resolvedPath.split(macro).join(value);
    });

    const unsupportedMacroRegex = /\/?#\w+#|\[#.*?\]/g;
    const hasUnsupported = unsupportedMacroRegex.test(resolvedPath);

    return {
      path: resolvedPath,
      hasUnsupported,
    };
  };

  //=======================================================Validate for Meter Keys======================================================================//
  const validateMeterKeys = (
    lines,
    diagnostics,
    validKeys,
    meterType,
    sharedKeys = []
  ) => {
    let inTargetMeter = false;
    let currentSection = null;
  
    const allValidKeys = [...validKeys, ...sharedKeys];
  
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
  
     
      if (
        !trimmedLine ||
        trimmedLine.startsWith(";") ||
        trimmedLine.toLowerCase().startsWith("@include")
      ) {
        return;
      }
  
   
      if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
        currentSection = trimmedLine.slice(1, -1);
        inTargetMeter = false;
        return;
      }
  

      if (
        currentSection &&
        trimmedLine.toLowerCase() === `meter=${meterType.toLowerCase()}`
      ) {
        inTargetMeter = true;
        return;
      }
  
      if (inTargetMeter) {
        const keyValue = trimmedLine.split("=", 2).map((s) => s.trim());
        if (keyValue.length !== 2) return;
  
        const [key, value] = keyValue;
  
     
        if (key.toLowerCase().startsWith("@include")) return;
  
        
        if (/^MeasureName\d*$/.test(key)) {
       
          handleKeyPattern(key, value, diagnostics, index, "MeasureName");
          return;
        }
        if (/^LineColor\d*$/.test(key)) {
        
          handleKeyPattern(key, value, diagnostics, index, "LineColor");
          return;
        }
        if (/^Scale\d*$/.test(key)) {
      
          handleKeyPattern(key, value, diagnostics, index, "Scale");
          return;
        }

        if (/^InlineSetting\d*$/.test(key)) {
       
          handleKeyPattern(key, value, diagnostics, index, "InlineSetting");
          return;
        }

        if (/^InlinePattern\d*$/.test(key)) {
       
          handleKeyPattern(key, value, diagnostics, index, "InlinePattern");
          return;
        }
        
        if (key && !allValidKeys.map(k => k.toLowerCase()).includes(key.toLowerCase())) {
          const range = new vscode.Range(
            new vscode.Position(index, 0),
            new vscode.Position(index, key.length)
          );
  
          diagnostics.push(
            new vscode.Diagnostic(
              range,
              `Invalid key '${key}' in [${currentSection}]. Valid keys for ${meterType} are: ${validKeys.join(
                ", "
              )} (shared keys: ${sharedKeys.join(", ")}).`,
              vscode.DiagnosticSeverity.Error
            )
          );
        }
      }
    });
  };
  
  const handleKeyPattern = (key, value, diagnostics, lineIndex, keyPrefix) => {
    if (!value) {
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(lineIndex, 0),
            new vscode.Position(lineIndex, key.length)
          ),
          `Key '${key}' (part of the '${keyPrefix}' pattern) must have a value.`,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  };
  
  const sharedKeys = [
    "ToolTipText",
    "ToolTipTitle",
    "ToolTipIcon",
    "ToolTipType",
    "ToolTipWidth",
    "LeftMouseUpAction",
    "LeftMouseDownAction",
    "RightMouseUpAction",
    "RightMouseDownAction",
    "MouseOverAction",
    "MouseLeaveAction",
    "LeftMouseDoubleClickAction",
    "RightMouseDoubleClickAction",
    "MiddleMouseDoubleClickAction",
    "X1MouseUpAction",
    "X1MouseDownAction",
    "X2MouseUpAction",
    "X2MouseDownAction",
    "X1MouseDoubleClickAction",
    "X2MouseDoubleClickAction",
    "MouseScrollDownAction",
    "MouseScrollUpAction",
    "MouseScrollDownAction",
    "MouseScrollLeftAction",
    "MouseScrollRightAction",
    "OnUpdateAction",
    "Container",
    "W",
    "H",
    "X",
    "Y",
    "DynamicVariables",
    "Hidden",
    "MouseActionCursor",
    "MouseActionCursorName",
    "MeterStyle",
    "Group",
    "DragGroup",
    "Padding",
    "UpdateDivider",
    "TransformationMatrix",
    "AntiAlias",
    "GradientAngle",
    "SolidColor",
    "SolidColor1",
    "SolidColor2",
    "BevelColor",
    "BevelColor1",
    "BevelColor2",
    "BevelType",
    "MeasureName",
   "RegExpSubstitute",
   "Substitute",
    "Antialias"
  ];

  const validStringMeterKeys = [
    "Text",
    "FontSize",
    "FontColor",
    "FontFace",
    "StringStyle",
    "StringAlign",
    "ClipString",
    "FontFace",
    "FontColor",
    "FontWeight",
    "AutoScale",
    "InlineSetting",
    "InlinePattern",
    "StringEffect",
    "ClipStringW",
    "ClipStringH",
    "TrailingSpaces",
    "Angle",
    "Percentual",
    "NumOfDecimals",
    "StringCase",
    "FontEffectColor",
    "Scale",
    "Substitute",
    "Tile",
    "Postfix",
    "Prefix"
   
  ];

  const validImageMeterKeys = [
    "ImageName",
    "ImagePath",
    "ImageTint",
    "ImageRotate",
    "ImageFlip",
    "ImageCrop",
    "ImageDivide",
    "Greyscale",
    "ImageAlpha",
    "UseExifOrientation",
    "ColorMatrix1",
    "ColorMatrix2",
    "ColorMatrix3",
    "ColorMatrix4",
    "ColorMatrix5",
    "MaskImageName",
    "MaskImagePath",
    "MaskImageFlip",
    "MaskImageRotate",
    "PreserveAspectRatio",
    "ScaleMargins",
    "Tile"
  ];

  validateMeterKeys(
    lines,
    diagnostics,
    validStringMeterKeys,
    "String",
    sharedKeys
  );
  validateMeterKeys(
    lines,
    diagnostics,
    validImageMeterKeys,
    "Image",
    sharedKeys
  );

  //=======================================================Main validation logic======================================================================//
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith(";")) return;

    if (trimmedLine.startsWith("[")) {
      if (!trimmedLine.endsWith("]")) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(
              new vscode.Position(index, 0),
              new vscode.Position(index, line.length)
            ),
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
        /*
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
        }*/
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

        if (sectionName.toLowerCase() === "rainmeter")
          hasRainmeterSection = true;
        if (sectionName.toLowerCase() === "variables")
          hasVariablesSection = true;

        currentSection = sectionName;
        keysInCurrentSection.clear();
      }
      return;
    }

    const [key, value] = trimmedLine.split("=", 2);

    if (key?.trim().toLowerCase().startsWith("@include")) {
      const rawPath = value?.trim().replace(/"/g, "");

      let resolvedPath;
      let hasUnsupported = false;

      if (!rawPath.includes("#")) {
        resolvedPath = path.resolve(fileDir, rawPath);
      } else {
        const result = resolveRainmeterMacros(rawPath, {
          fileDir,
          currentFilePath: document.uri.fsPath,
        });
        resolvedPath = result.path;
        hasUnsupported = result.hasUnsupported;
      }

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
            new vscode.Range(
              new vscode.Position(index, 0),
              new vscode.Position(index, line.length)
            ),
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
          new vscode.Range(
            new vscode.Position(index, 0),
            new vscode.Position(index, line.length)
          ),
          "Key-value pair is malformed. Ensure the format is 'Key=Value'.",
          vscode.DiagnosticSeverity.Error
        )
      );
    } else if (keysInCurrentSection.has(key)) {
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(index, 0),
            new vscode.Position(index, key.length)
          ),
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