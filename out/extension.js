
const vscode = require("vscode");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { Console } = require("console");


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
      provideCompletionItems(document, position) {
        const lineText = document.lineAt(position).text.trim().toLowerCase();

        const hasAssignedValue = (property) => {
          const regex = new RegExp(`^${property.toLowerCase()}=.+`);
          return regex.test(lineText);
        };

        //===================================================================================================================================//
        //                                                  MeterCompletionItems                                                             //
        //===================================================================================================================================//
        function createMeterCompletionItems() {
          const meterTypes = [
            "Shape",
            "Image",
            "String",
            "Bar",
            "Bitmap",
            "Button",
            "Histogram",
            "Line",
            "Rotator",
            "Roundline",
          ];

          return meterTypes.map(
            (type) =>
              new vscode.CompletionItem(type, vscode.CompletionItemKind.Value)
          );
        }

        if (lineText.startsWith("meter=") && !hasAssignedValue("meter=")) {
          return createMeterCompletionItems();
        }
        //===================================================================================================================================//
        //                                                  MeasureCompletionItems                                                           //
        //===================================================================================================================================//
        function createMeasureCompletionItems() {
          const measuresTypes = [
            "Calc",
            "Plugin",
            "Time",
            "CPU",
            "FreeDiskSpace",
            "Loop",
            "MediaKey",
            "Memory",
            "Net",
            "NowPlaying",
            "Process",
            "RecycleManager",
            "Registry",
            "Script",
            "String",
            "SysInfo",
            "Time",
            "UpTime",
            "WebParser",
            "WifiStatus",
          ];

          return measuresTypes.map(
            (type) =>
              new vscode.CompletionItem(type, vscode.CompletionItemKind.Value)
          );
        }

        if (lineText.startsWith("measure=") && !hasAssignedValue("measure=")) {
          return createMeasureCompletionItems();
        }
        //===================================================================================================================================//
        //                                                  PluginCompletionItems                                                            //
        //===================================================================================================================================//
        function createPluginCompletionItems() {
          const pluginTypes = [
            "Calc",
            "Time",
            "CPU",
            "FreeDiskSpace",
            "Loop",
            "MediaKey",
            "Memory",
            "Net",
            "NowPlaying",
            "Process",
            "RecycleManager",
            "Registry",
            "Script",
            "String",
            "SysInfo",
            "Time",
            "UpTime",
            "WebParser",
            "WifiStatus",
          ];

          return pluginTypes.map(
            (type) =>
              new vscode.CompletionItem(type, vscode.CompletionItemKind.Value)
          );
        }

        if (lineText.startsWith("plugin=") && !hasAssignedValue("plugin=")) {
          return createPluginCompletionItems();
        }

        //===================================================================================================================================//
        //                                                  AlignmentCompletionItems                                                         //
        //===================================================================================================================================//
        function createAlignmentCompletionItems(alignments) {
          return alignments.map(
            (align) =>
              new vscode.CompletionItem(align, vscode.CompletionItemKind.Value)
          );
        }
        if (
          lineText.startsWith("stringalign=") &&
          !hasAssignedValue("stringalign=")
        ) {
          const stringAlignments = [
            "Center",
            "Left",
            "Right",
            "Bottom",
            "Top",
            "CenterCenter",
            "LeftCenter",
            "RightCenter",
            "TopLeft",
            "BottomRight",
            "TopCenter",
            "BottomCenter",
          ];
          return createAlignmentCompletionItems(stringAlignments);
        }

        if (
          lineText.startsWith("bitmapalign=") &&
          !hasAssignedValue("bitmapalign=")
        ) {
          const bitmapAlignments = ["Center", "Left", "Right"];
          return createAlignmentCompletionItems(bitmapAlignments);
        }

        if (
          lineText.startsWith("graphstart=") &&
          !hasAssignedValue("graphstart=")
        ) {
          return createAlignmentCompletionItems(["Left", "Right"]);
        }

        //===================================================================================================================================//
        //                                                 ImageCropCompletionItem                                                           //
        //===================================================================================================================================//
        function createImageCropCompletionItem() {
          const item = new vscode.CompletionItem(
            "TopLeft,TopRight,BottomRight,BottomLeft,Center",
            vscode.CompletionItemKind.Value
          );
          item.documentation =
            "A way to envision what ImageCrop is doing is: ImageCrop=-50,-30,100,60,5";
          return [item];
        }
        if (
          (lineText.startsWith("primaryimagecrop=") &&
            !hasAssignedValue("primaryimagecrop=")) ||
          (lineText.startsWith("secondaryimagecrop=") &&
            !hasAssignedValue("secondaryimagecrop=")) ||
          (lineText.startsWith("bothimagecrop=") &&
            !hasAssignedValue("bothimagecrop=")) ||
          (lineText.startsWith("imagecrop=") && !hasAssignedValue("imagecrop="))
        ) {
          return createImageCropCompletionItem();
        }

        //===================================================================================================================================//
        //                                                  BinaryCompletionItems                                                            //
        //===================================================================================================================================//
        function createBinaryCompletionItems() {
          return [
            new vscode.CompletionItem("0", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("1", vscode.CompletionItemKind.Value),
          ];
        }
        if (
          (lineText.startsWith("dynamicvariables=") &&
            !hasAssignedValue("dynamicvariables=")) ||
          (lineText.startsWith("alwaysontop=") &&
            !hasAssignedValue("alwaysontop=")) ||
          (lineText.startsWith("autoselectscreen=") &&
            !hasAssignedValue("autoselectScreen=")) ||
          (lineText.startsWith("MouseActionCursor=") &&
            !hasAssignedValue("MouseActionCursor=")) ||
          (lineText.startsWith("preserveaspectratio=") &&
            !hasAssignedValue("preserveaspectratio=")) ||
          (lineText.startsWith("hidden=") && !hasAssignedValue("hidden=")) ||
          (lineText.startsWith("antialias=") &&
            !hasAssignedValue("antialias=")) ||
          (lineText.startsWith("greyscale=") &&
            !hasAssignedValue("greyscale=")) ||
          (lineText.startsWith("autoscale=") &&
            !hasAssignedValue("autoscale=")) ||
          (lineText.startsWith("bothgreyscale=") &&
            !hasAssignedValue("bothgreyscale=")) ||
          (lineText.startsWith("flip=") && !hasAssignedValue("flip=")) ||
          (lineText.startsWith("primarygreyscale=") &&
            !hasAssignedValue("primarygreyscale=")) ||
          (lineText.startsWith("secondarygreyscale=") &&
            !hasAssignedValue("secondarygreyscale=")) ||
          (lineText.startsWith("imagerotate=") &&
            !hasAssignedValue("imagerotate=")) ||
          (lineText.startsWith("useexiforientation=") &&
            !hasAssignedValue("useexiforientation=")) ||
          (lineText.startsWith("tile=") && !hasAssignedValue("tile=")) ||
          (lineText.startsWith("horizontallines=") &&
            !hasAssignedValue("horizontallines=")) ||
          (lineText.startsWith("solid=") && !hasAssignedValue("solid=")) ||
          (lineText.startsWith("controlangle=") &&
            !hasAssignedValue("controlangle=")) ||
          (lineText.startsWith("controlstart=") &&
            !hasAssignedValue("controlstart=")) ||
          (lineText.startsWith("startshift=") &&
            !hasAssignedValue("startshift=")) ||
          (lineText.startsWith("controllength=") &&
            !hasAssignedValue("controllength=")) ||
          (lineText.startsWith("lengthshift=") &&
            !hasAssignedValue("lengthshift=")) ||
          (lineText.startsWith("trailingspaces=") &&
            !hasAssignedValue("trailingspaces=")) ||
          (lineText.startsWith("percentual=") &&
            !hasAssignedValue("percentual=")) ||
          (lineText.startsWith("draggable=") &&
            !hasAssignedValue("draggable=")) ||
          (lineText.startsWith("snapedges=") &&
            !hasAssignedValue("snapedges=")) ||
          (lineText.startsWith("starthidden=") &&
            !hasAssignedValue("starthidden=")) ||
          (lineText.startsWith("keeponscreen=") &&
            !hasAssignedValue("keeponscreen=")) ||
          (lineText.startsWith("dynamicwindowsize=") &&
            !hasAssignedValue("dynamicwindowsize=")) ||
          (lineText.startsWith("accuratetext=") &&
            !hasAssignedValue("accuratetext=")) ||
          (lineText.startsWith("tooltiphidden=") &&
            !hasAssignedValue("tooltiphidden=")) ||
          (lineText.startsWith("blur=") &&
            !hasAssignedValue("blur=")) ||
          (lineText.startsWith("defaultclickthrough=") &&
            !hasAssignedValue("defaultclickthrough=")) ||
          (lineText.startsWith("defaultkeeponscreen=") &&
            !hasAssignedValue("defaultkeeponscreen=")) ||
          (lineText.startsWith("defaultautoselectscreen=") &&
            !hasAssignedValue("defaultautoselectscreen=")) ||
          (lineText.startsWith("defaultanchory=") &&
            !hasAssignedValue("defaultanchory=")) ||
          (lineText.startsWith("defaultsaveposition=") &&
            !hasAssignedValue("defaultsaveposition=")) ||
          (lineText.startsWith("defaultdraggable=") &&
            !hasAssignedValue("defaultdraggable=")) ||
          (lineText.startsWith("defaultsnappedges=") &&
            !hasAssignedValue("defaultsnappedges=")) ||
          (lineText.startsWith("defaultstarthidden=") &&
            !hasAssignedValue("defaultstarthidden="))
        ) {
          return createBinaryCompletionItems();
        }

        //===================================================================================================================================//
        //                                                 BitmapCompletionItems                                                             //
        //===================================================================================================================================//
        function createBitmapCompletionItems() {
          return [
            new vscode.CompletionItem(
              "Horizontal",
              vscode.CompletionItemKind.Value
            ),
            new vscode.CompletionItem(
              "Vertical",
              vscode.CompletionItemKind.Value
            ),
          ];
        }
        if (
          (lineText.startsWith("bitmapzeroframe=") &&
            !hasAssignedValue("bitmapzeroframe=")) ||
          (lineText.startsWith("bitmapextend=") &&
            !hasAssignedValue("bitmapextend=")) ||
          (lineText.startsWith("bitmapdigits=") &&
            !hasAssignedValue("bitmapdigits=")) ||
          (lineText.startsWith("barorientation=") &&
            !hasAssignedValue("barorientation="))
        ) {
          return createBitmapCompletionItems();
        }

        //===================================================================================================================================//
        //                                                   ColorCompletionItems                                                            //
        //===================================================================================================================================//
        function createColorCompletionItems() {
          const colors = [
            {
              value: "255,255,255,255",
              description: "White color with full opacity.",
            },
            {
              value: "0,0,0,255",
              description: "Black color with full opacity.",
            },
            {
              value: "255,0,0,255",
              description: "Red color with full opacity.",
            },
            {
              value: "0,255,0,255",
              description: "Green color with full opacity.",
            },
            {
              value: "0,0,255,255",
              description: "Blue color with full opacity.",
            },
            {
              value: "128,128,128,255",
              description: "Gray color with full opacity.",
            },
            {
              value: "255,255,0,255",
              description: "Yellow color with full opacity.",
            },
          ];

          return colors.map((color) => {
            const item = new vscode.CompletionItem(
              color.value,
              vscode.CompletionItemKind.Value
            );
            item.documentation = color.description;
            return item;
          });
        }
        if (
          (lineText.startsWith("primaryimagetint=") &&
            !hasAssignedValue("primaryimagetint=")) ||
          (lineText.startsWith("secondaryimagetint=") &&
            !hasAssignedValue("secondaryimagetint=")) ||
          (lineText.startsWith("bothimagetint=") &&
            !hasAssignedValue("bothimagetint=")) ||
          (lineText.startsWith("solidcolor=") &&
            !hasAssignedValue("solidcolor=")) ||
          (lineText.startsWith("fontcolor=") &&
            !hasAssignedValue("fontcolor=")) ||
          (lineText.startsWith("bothcolor=") &&
            !hasAssignedValue("bothcolor=")) ||
          (lineText.startsWith("primarycolor=") &&
            !hasAssignedValue("primarycolor=")) ||
          (lineText.startsWith("secondarycolor=") &&
            !hasAssignedValue("secondarycolor=")) ||
          (lineText.startsWith("linecolor=") &&
            !hasAssignedValue("linecolor=")) ||
          (lineText.startsWith("imagetint=") &&
            !hasAssignedValue("imagetint=")) ||
          (lineText.startsWith("horizontallinecolor=") &&
            !hasAssignedValue("horizontallinecolor=")) ||
          (lineText.startsWith("fonteffectcolor=") &&
            !hasAssignedValue("fonteffectcolor=")) ||
          (lineText.startsWith("selectedcolor=") &&
            !hasAssignedValue("selectedcolor="))
        ) {
          return createColorCompletionItems();
        }

        //===================================================================================================================================//
        //                                                   NumericCompletionItems                                                          //
        //===================================================================================================================================//
        function createNumericCompletionItems(start, end, step = 1) {
          const items = [];
          for (let i = start; i <= end; i += step) {
            items.push(
              new vscode.CompletionItem(
                i.toString(),
                vscode.CompletionItemKind.Value
              )
            );
          }
          return items;
        }

        if (
          lineText.startsWith("fontWeight=") &&
          !hasAssignedValue("fontWeight=")
        ) {
          return createNumericCompletionItems(100, 900, 100);
        }

        if (
          lineText.startsWith("update=") &&
          !hasAssignedValue("update=")
        ) {
          return createNumericCompletionItems(0, 1000, 50);
        }

        if (
          lineText.startsWith("defaultupdatedivider=") &&
          !hasAssignedValue("defaultupdatedivider=")
        ) {
          return createNumericCompletionItems(0, 1000, 50);
        }

        if (
          lineText.startsWith("updatedivider=") &&
          !hasAssignedValue("updatedivider=")
        ) {
          return createNumericCompletionItems(0, 1000, 50);
        }


        if (
          lineText.startsWith("bitmapseparation=") &&
          !hasAssignedValue("bitmapseparation=")
        ) {
          return createNumericCompletionItems(-2, 2);
        }
        if (
          lineText.startsWith("bitmapframes=") &&
          !hasAssignedValue("bitmapframes=")
        ) {
          return createNumericCompletionItems(0, 10);
        }

        if (
          lineText.startsWith("imagealpha=") &&
          !hasAssignedValue("imagealpha=")
        ) {
          return createNumericCompletionItems(0, 250, 50);
        }

        if (
          lineText.startsWith("primaryimagealpha=") &&
          !hasAssignedValue("primaryimagealpha=")
        ) {
          return createNumericCompletionItems(0, 250, 50);
        }

        if (
          lineText.startsWith("secondaryimagealpha=") &&
          !hasAssignedValue("secondaryimagealpha=")
        ) {
          return createNumericCompletionItems(0, 250, 50);
        }

        if (
          lineText.startsWith("bothimagealpha=") &&
          !hasAssignedValue("bothimagealpha=")
        ) {
          return createNumericCompletionItems(0, 250, 50);
        }

        if (
          lineText.startsWith("clipstring=") &&
          !hasAssignedValue("clipstring=")
        ) {
          return createNumericCompletionItems(0, 2);
        }

        if (
          lineText.startsWith("numofdecimals=") &&
          !hasAssignedValue("numofdecimals=")
        ) {
          return createNumericCompletionItems(1, 3);
        }

        if (lineText.startsWith("scale=") && !hasAssignedValue("scale=")) {
          return createNumericCompletionItems(1, 3);
        }

        if (
          lineText.startsWith("defaultalphavalue=") &&
          !hasAssignedValue("defaultalphavalue=")
        ) {
          return createNumericCompletionItems(0, 250, 50);
        }

        if (
          lineText.startsWith("alphavalue=") &&
          !hasAssignedValue("alphavalue=")
        ) {
          return createNumericCompletionItems(0, 250, 50);
        }

        if (
          lineText.startsWith("loadorder=") &&
          !hasAssignedValue("loadorder=")
        ) {
          return createNumericCompletionItems(-1, 2);

        }

        if (
          lineText.startsWith("fadeduration=") &&
          !hasAssignedValue("fadeduration=")
        ) {
          return createNumericCompletionItems(250, 2500, 50);
        }

        if (
          lineText.startsWith("defaultfadeduration=") &&
          !hasAssignedValue("defaultfadeduration=")
        ) {
          return createNumericCompletionItems(250, 2500, 50);
        }

        if (
          lineText.startsWith("defaultalwaysontop=") &&
          !hasAssignedValue("defaultalwaysontop=")
        ) {
          return createNumericCompletionItems(-2, 2, 1);
        }

        if (
          lineText.startsWith("gradientangle=") &&
          !hasAssignedValue("gradientangle=")
        ) {
          return createNumericCompletionItems(0, 360, 90);
        }

        //===================================================================================================================================//
        //                                                 Other Stuff                                                                       //
        //===================================================================================================================================//

        if (
          lineText.startsWith("transformstroke=") &&
          !hasAssignedValue("transformstroke=")
        ) {
          const item0 = new vscode.CompletionItem(
            "Normal",
            vscode.CompletionItemKind.Value
          );
          item0.documentation =
            "Normal (default) : \nThe line width will be impacted by any scale or skew transforms from TransformationMatrix.";

          const item1 = new vscode.CompletionItem(
            "Fixed",
            vscode.CompletionItemKind.Value
          );
          item1.documentation =
            "Fixed : \nThe line width will not be impacted by any transforms from TransformationMatrix.\nThe width will be fixed to the width defined in LineWidth.";

          return [item0, item1];
        }

        if (
          lineText.startsWith("inlinesetting=") &&
          !hasAssignedValue("inlinesetting=")
        ) {
          const item0 = new vscode.CompletionItem(
            "CharacterSpacing  Leading | Trailing | Minimum Advance Width",
            vscode.CompletionItemKind.Value
          );
          item0.documentation =
            "This will increase the leading space before characters and the trailing space after characters.";

          const item1 = new vscode.CompletionItem(
            "Shadow XOffset | YOffset | BlurAmount | Color",
            vscode.CompletionItemKind.Value
          );
          item1.documentation =
            "Used to create a Drop Shadow on all or part of the string.";

          const item2 = new vscode.CompletionItem(
            "Strikethrough",
            vscode.CompletionItemKind.Value
          );
          item2.documentation =
            "Used to Strikethrough characters in part or all of the string. No parameter required.";

          const item3 = new vscode.CompletionItem(
            "Italic",
            vscode.CompletionItemKind.Value
          );
          item3.documentation =
            "Uses Italic characters in part or all of the string. No parameter required. This will be simulated by Rainmeter if not supported by the font family.";

          const item4 = new vscode.CompletionItem(
            "Oblique",
            vscode.CompletionItemKind.Value
          );
          item4.documentation =
            "Uses Oblique characters in part or all of the string. No parameter required. This will be simulated by Rainmeter if not supported by the font family.";

          const item5 = new vscode.CompletionItem(
            "Underline",
            vscode.CompletionItemKind.Value
          );
          item5.documentation =
            "Used to Underline characters in part or all of the string. No parameter required.";

          const item6 = new vscode.CompletionItem(
            "Face | font family name ",
            vscode.CompletionItemKind.Value
          );
          item6.documentation =
            "This uses the same values as the setting for FontFace on the meter.";

          const item7 = new vscode.CompletionItem(
            "Size | numeric point size ",
            vscode.CompletionItemKind.Value
          );
          item7.documentation =
            "This uses the same values as the setting for FontSize on the meter.";

          const item8 = new vscode.CompletionItem(
            "Color  | rrr,ggg,bbb,aaa ",
            vscode.CompletionItemKind.Value
          );
          item8.documentation =
            "This uses the same values as the setting for FontColor on the meter.";

          const item9 = new vscode.CompletionItem(
            "Weight  | FontWeight ",
            vscode.CompletionItemKind.Value
          );
          item9.documentation =
            "This will simulate a FontWeight.\n100 - Thin (Hairline)\n200 - Extra Light (Ultra Light)\n300 - Light|400 - Regular (Normal)\n500 - Medium \n600 - Semi Bold (Demi Bold)\n700 - Bold  \n800 - Extra Bold (Ultra Bold) \n900 - Black (Heavy) \n950 - Extra Black (UltraBlack)";

          const item10 = new vscode.CompletionItem(
            "Case  | CaseType ",
            vscode.CompletionItemKind.Value
          );
          item10.documentation =
            "1.Lower - (All characters lower case)\n2.Upper  - (All characters upper case)\n3.Proper - (First character of each word upper case, the balance lower case)\n4.Sentence - (First character of each sentence upper case, the balance lower case).";

          const item11 = new vscode.CompletionItem(
            "Stretch | compressed / expanded values ",
            vscode.CompletionItemKind.Value
          );
          item11.documentation =
            "1 - Ultra-Condensed\n2 - Extra-Condensed\n3 - Condensed\n4 - Semi-Condensed\n5 - Normal\n6 - Semi-Expanded\n7 - Expanded\n8 - Extra-Expanded\n9 - Ultra-Expanded";

          const item12 = new vscode.CompletionItem(
            "Typography | code ",
            vscode.CompletionItemKind.Value
          );
          item12.documentation =
            "smcp - Small Capitals\nonum - Old Style Figures\nsups - Superscript\nsubs - Subscript\ncpsp - Capital Spacing\nss01 - Stylistic Set 1\nss02 - Stylistic Set 2";

          const item13 = new vscode.CompletionItem(
            "GradientColor Angle | Color ; Percentage | Color ; Percentage",
            vscode.CompletionItemKind.Value
          );
          item13.documentation =
            "Defines a color gradient, at any angle, to be used on the selected text. This can consist of two or more colors as desired, with percentage points being used to define transition points for each color.\nThe Angle is defined as:\n0 (360) - Right to Left\n90 - Bottom to Top\n180 - Left to Right\n270 - Top to Bottom";

          return [
            item0,
            item1,
            item2,
            item3,
            item4,
            item5,
            item6,
            item7,
            item8,
            item9,
            item10,
            item11,
            item12,
            item13,
          ];
        }
        if (
          lineText.startsWith("backgroundmose=") &&
          !hasAssignedValue("backgroundmose=")
        ) {
          const item0 = new vscode.CompletionItem(
            "0",
            vscode.CompletionItemKind.Value
          );
          item0.documentation =
            "(Image as defined by Background) : Uses the background image as defined.";

          const item1 = new vscode.CompletionItem(
            "1",
            vscode.CompletionItemKind.Value
          );
          item1.documentation =
            "(Transparent background) : Makes the background transparent.";

          const item2 = new vscode.CompletionItem(
            "2",
            vscode.CompletionItemKind.Value
          );
          item2.documentation =
            "(Fill with a solid color) : Fills the background with a solid color.";

          const item3 = new vscode.CompletionItem(
            "3",
            vscode.CompletionItemKind.Value
          );
          item3.documentation =
            "(Fill by scaling image as defined by Background) : Scales the image to fill the background.";

          const item4 = new vscode.CompletionItem(
            "4",
            vscode.CompletionItemKind.Value
          );
          item4.documentation =
            "(Fill by tiling image as defined by Background) : Tiles the image to fill the background.";

          return [item0, item1, item2, item3, item4];
        }

        if (
          lineText.startsWith("blurregion=") &&
          !hasAssignedValue("blurregion=")
        ) {
          const item0 = new vscode.CompletionItem(
            "0",
            vscode.CompletionItemKind.Value
          );
          item0.documentation =
            "(Region is disabled) : No blur region is applied.";

          const item1 = new vscode.CompletionItem(
            "1",
            vscode.CompletionItemKind.Value
          );
          item1.documentation =
            "(Rectangular region) : Applies a rectangular blur region.";

          const item2 = new vscode.CompletionItem(
            "2",
            vscode.CompletionItemKind.Value
          );
          item2.documentation =
            "(Rectangular region with rounded corners) : Applies a rectangular blur region with rounded corners. Requires a defined Radius.";

          const item3 = new vscode.CompletionItem(
            "3",
            vscode.CompletionItemKind.Value
          );
          item3.documentation =
            "(Elliptical region) : Applies an elliptical blur region.";

          return [item0, item1, item2, item3];
        }


        if (
          lineText.startsWith("beveltype=") &&
          !hasAssignedValue("beveltype=")
        ) {
          const item0 = new vscode.CompletionItem(
            "0",
            vscode.CompletionItemKind.Value
          );
          item0.documentation =
            "(No bevel) : No bevel effect is applied.";

          const item1 = new vscode.CompletionItem(
            "1",
            vscode.CompletionItemKind.Value
          );
          item1.documentation =
            "(Raised) : Applies a raised bevel effect to the element.";

          const item2 = new vscode.CompletionItem(
            "2",
            vscode.CompletionItemKind.Value
          );
          item2.documentation =
            "(Sunken) : Applies a sunken bevel effect to the element.";

          return [item0, item1, item2];
        }

        if (
          lineText.startsWith("stringcase=") &&
          !hasAssignedValue("stringcase=")
        ) {
          return [
            new vscode.CompletionItem("Upper", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("Lower", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("Power", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("None", vscode.CompletionItemKind.Value),
          ];
        }

        if (
          lineText.startsWith("stringstyle=") &&
          !hasAssignedValue("stringstyle=")
        ) {
          return [
            new vscode.CompletionItem(
              "Normal",
              vscode.CompletionItemKind.Value
            ),
            new vscode.CompletionItem("Bold", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem(
              "Italic",
              vscode.CompletionItemKind.Value
            ),
            new vscode.CompletionItem(
              "BoldItalic",
              vscode.CompletionItemKind.Value
            ),
          ];
        }

        if (
          lineText.startsWith("mouseactioncursorname=") &&
          !hasAssignedValue("mouseactioncursorname=")
        ) {
          return [
            new vscode.CompletionItem("HAND", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("TEXT", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("HELP", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("BUSY", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("CROSS", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("PEN", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("NO", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("SIZE_ALL", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("SIZE_NESW", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("SIZE_NS", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("SIZE_NWSE", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("SIZE_WE", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("UPARROW", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("WAIT", vscode.CompletionItemKind.Value),
          ];
        }


        if (
          lineText.startsWith("stringeffect=") &&
          !hasAssignedValue("stringeffect=")
        ) {
          return [
            new vscode.CompletionItem("None", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem(
              "Shadow",
              vscode.CompletionItemKind.Value
            ),
            new vscode.CompletionItem("Boder", vscode.CompletionItemKind.Value),
          ];
        }

        function createFontFaceCompletionItems(fonts) {
          return fonts.map(
            (font) =>
              new vscode.CompletionItem(font, vscode.CompletionItemKind.Value)
          );
        }

        if (
          lineText.startsWith("fontface=") &&
          !hasAssignedValue("fontface=")
        ) {
          const fontList = [
            "Arial",
            "Calibri",
            "Tahoma",
            "Verdana",
            "Times New Roman",
            "Georgia",
            "Courier New",
            "Comic Sans MS",
            "Trebuchet MS",
            "Impact",
            "Consolas",
            "Lucida Console",
            "Segoe UI",
            "Roboto",
            "Helvetica",
          ];
          return createFontFaceCompletionItems(fontList);
        }

        if (
          lineText.startsWith("defaultonhover=") &&
          !hasAssignedValue("defaultonhover=")
        ) {
          const item0 = new vscode.CompletionItem(
            "0",
            vscode.CompletionItemKind.Value
          );
          item0.documentation =
            "(Do Nothing - default) : No action is taken.";

          const item1 = new vscode.CompletionItem(
            "1",
            vscode.CompletionItemKind.Value
          );
          item1.documentation =
            " (Hide) : Skin will fade between the value in AlphaValue and hidden. If no AlphaValue is defined, it will simply fade between fully visible and hidden.";

          const item2 = new vscode.CompletionItem(
            "2",
            vscode.CompletionItemKind.Value
          );
          item2.documentation =
            " (Fade in) : Skin will fade between the value in AlphaValue and fully visible.";

          const item3 = new vscode.CompletionItem(
            "3",
            vscode.CompletionItemKind.Value
          );
          item3.documentation =
            " (Fade out) : Skin will fade between the value in AlphaValue and hidden.";

          return [item0, item1, item2, item3];
        }


        if (
          lineText.startsWith("onhover=") &&
          !hasAssignedValue("onhover=")
        ) {
          const item0 = new vscode.CompletionItem(
            "0",
            vscode.CompletionItemKind.Value
          );
          item0.documentation =
            "(Do Nothing - default) : No action is taken.";

          const item1 = new vscode.CompletionItem(
            "1",
            vscode.CompletionItemKind.Value
          );
          item1.documentation =
            " (Hide) : Skin will fade between the value in AlphaValue and hidden. If no AlphaValue is defined, it will simply fade between fully visible and hidden.";

          const item2 = new vscode.CompletionItem(
            "2",
            vscode.CompletionItemKind.Value
          );
          item2.documentation =
            " (Fade in) : Skin will fade between the value in AlphaValue and fully visible.";

          const item3 = new vscode.CompletionItem(
            "3",
            vscode.CompletionItemKind.Value
          );
          item3.documentation =
            " (Fade out) : Skin will fade between the value in AlphaValue and hidden.";

          return [item0, item1, item2, item3];
        }
        //===================================================================================================================================//
        //                                                  FlipCompletionItems                                                              //
        //===================================================================================================================================//

        function createOrientationCompletionItems() {
          return [
            new vscode.CompletionItem(
              "Horizontal",
              vscode.CompletionItemKind.Value
            ),
            new vscode.CompletionItem(
              "Vertical",
              vscode.CompletionItemKind.Value
            ),
          ];
        }

        function createFlipCompletionItems() {
          return [
            new vscode.CompletionItem(
              "Horizontal",
              vscode.CompletionItemKind.Value
            ),
            new vscode.CompletionItem(
              "Vertical",
              vscode.CompletionItemKind.Value
            ),
            new vscode.CompletionItem("Both", vscode.CompletionItemKind.Value),
            new vscode.CompletionItem("None", vscode.CompletionItemKind.Value),
          ];
        }

        if (
          lineText.startsWith("graphorientation=") &&
          !hasAssignedValue("graphorientation=")
        ) {
          return createOrientationCompletionItems();
        }

        if (
          lineText.startsWith("primaryimageflip=") &&
          !hasAssignedValue("primaryimageflip=")
        ) {
          return createFlipCompletionItems();
        }

        if (
          lineText.startsWith("secondaryimageflip=") &&
          !hasAssignedValue("secondaryimageflip=")
        ) {
          return createFlipCompletionItems();
        }

        if (
          lineText.startsWith("bothimageflip=") &&
          !hasAssignedValue("bothimageflip=")
        ) {
          return createFlipCompletionItems();
        }

        return undefined;
      },
    },
    "="
  );
  //===================================================================================================================================//
  //                                                 Color Picker Provider                                                             //
  //===================================================================================================================================//
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

  //===================================================================================================================================//
  //                                               AutoRefreshRainmeter                                                                 //
  //===================================================================================================================================//

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
  //===================================================================================================================================//
  //                                                 Commands                                                                           //
  //===================================================================================================================================//


  let toggleAutoRefreshCommand = vscode.commands.registerCommand('rainSyntax.toggleAutoRefresh', () => {
    const config = vscode.workspace.getConfiguration('rainSyntax');
    const currentSetting = config.get('autoRefreshOnSave');
    const newSetting = !currentSetting;

    config.update('autoRefreshOnSave', newSetting, vscode.ConfigurationTarget.Global)
      .then(() => {
        vscode.window.showInformationMessage(`Auto Refresh is now ${newSetting ? 'enabled' : 'disabled'}`);
      });
  });

  let changeRainmeterPathCommand = vscode.commands.registerCommand('rainSyntax.changeRainmeterPath', async () => {
    const currentPath = vscode.workspace.getConfiguration('rainSyntax').get('rainmeterPath');
    const newPath = await vscode.window.showInputBox({
      prompt: "Enter the path to your Rainmeter executable",
      value: currentPath,
      validateInput: (input) => {
        if (input.trim() === '') {
          return "Path cannot be empty!";
        }
        return null;
      }
    });

    if (newPath) {
      vscode.workspace.getConfiguration('rainSyntax').update('rainmeterPath', newPath, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Rainmeter path set to: ${newPath}`);
    }
  });


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

  context.subscriptions.push(changeRefreshModeCommand);
  context.subscriptions.push(toggleAutoRefreshCommand);
  context.subscriptions.push(changeRainmeterPathCommand);
  //===================================================================================================================================//
  //                                                Setteings Through Gui                                                              //
  //===================================================================================================================================//
  const openSettingsCommand = vscode.commands.registerCommand('rainSyntax.openSettings', () => {
    const panel = vscode.window.createWebviewPanel(
      'rainSyntaxSettings',
      'RainSyntax Settings',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getWebviewContent();


    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'saveSettings') {

        await vscode.workspace.getConfiguration('rainSyntax').update('rainmeterPath', message.rainmeterPath, true);
        await vscode.workspace.getConfiguration('rainSyntax').update('autoRefreshOnSave', message.autoRefreshOnSave, true);
        await vscode.workspace.getConfiguration('rainSyntax').update('refreshMode', message.refreshMode, true);

        vscode.window.showInformationMessage('RainSyntax settings updated!');
      }
    });
  });

  context.subscriptions.push(openSettingsCommand);


  function getWebviewContent() {
    const config = vscode.workspace.getConfiguration('rainSyntax');
    const rainmeterPath = config.get('rainmeterPath', 'C:\\Program Files\\Rainmeter\\Rainmeter.exe');
    const autoRefreshOnSave = config.get('autoRefreshOnSave', true);
    const refreshMode = config.get('refreshMode', 'all');

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
    </style>
</head>
<body>
    <h1>RainSyntax Settings</h1>
    <form id="settingsForm">
        <label for="rainmeterPath">Rainmeter Path</label>
        <input type="text" id="rainmeterPath" value="${rainmeterPath}" placeholder="Enter Rainmeter path" />

        <label for="autoRefreshOnSave">Auto Refresh on Save</label>
        <div class="checkbox-wrapper">
            <input type="checkbox" id="autoRefreshOnSave" ${autoRefreshOnSave ? 'checked' : ''} />
            <span>Enable auto refresh when saving files</span>
        </div>

        <label for="refreshMode">Refresh Mode</label>
        <select id="refreshMode">
            <option value="all" ${refreshMode === 'all' ? 'selected' : ''}>All Skins</option>
            <option value="specific" ${refreshMode === 'specific' ? 'selected' : ''}>Specific Skin</option>
        </select>

        <button type="button" id="saveSettings">Save Settings</button>
    </form>
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

  //===================================================================================================================================//
  //                                                Validation Extension for Rainmeter                                                  //
  //===================================================================================================================================//
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === "rainmeter") {
        const diagnostics = [];
        const text = event.document.getText();
        const lines = text.split(/\r?\n/);

        const sectionHeaders = new Set();
        let currentSection = null;
        const keysInCurrentSection = new Set();

        let hasRainmeterSection = false;
        let hasVariablesSection = false;

        const fileDir = path.dirname(event.document.uri.fsPath);
        const includedFiles = new Set();
        //=======================================================Validate Macros======================================================================//

        const resolveRainmeterMacros = (filePath, context) => {
          const skinsDir = path.resolve(context.fileDir, "../../");
          let baseSkinDir = context.fileDir;

          while (!fs.existsSync(path.join(baseSkinDir, "@Resources")) && baseSkinDir !== skinsDir) {
            baseSkinDir = path.dirname(baseSkinDir);
          }

          const resourcesPath = fs.existsSync(path.join(baseSkinDir, "@Resources"))
            ? path.join(baseSkinDir, "@Resources") + path.sep
            : "";

          const rootConfigPath = baseSkinDir + path.sep;
          const currentConfigPath = path.dirname(context.currentFilePath) + path.sep;


          const supportedMacros = {
            "#@#": resourcesPath,
            "#SKINSPATH#": resourcesPath,
            "#CURRENTPATH#": currentConfigPath,
            "#CURRENTFILE#": path.basename(context.currentFilePath),
            "#ROOTCONFIGPATH#": rootConfigPath,
            "#ROOTCONFIG#": path.basename(baseSkinDir),
            "#CURRENTCONFIG#": path.relative(baseSkinDir, path.dirname(context.currentFilePath)),
          };


          let resolvedPath = filePath;
          Object.keys(supportedMacros).forEach((macro) => {
            const value = supportedMacros[macro];
            resolvedPath = resolvedPath.split(macro).join(value);
          });


          const unsupportedMacroRegex = /#[A-Z0-9_]+#/g;
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
              currentFilePath: event.document.uri.fsPath,
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


        diagnosticsCollection.set(event.document.uri, diagnostics);
      }
    })
  );

  context.subscriptions.push(diagnosticsCollection);
}


function deactivate() { }

module.exports = {
  activate,
  deactivate,
};