const vscode = require("vscode");


function provideCompletionItems(document, position) {
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
            (lineText.startsWith("regexpsubstitute=") &&
            !hasAssignedValue("regexpsubstitute=")) ||
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
}


module.exports = {
    provideCompletionItems,
};