const vscode = require('vscode');

/**
 * Provides folding ranges for Rainmeter INI files
 * Detects sections [SectionName] and allows folding of their content
 */
class RainmeterFoldingProvider {
    provideFoldingRanges(document, context, token) {
        const foldingRanges = [];
        const text = document.getText();
        const lines = text.split('\n');
        
        let currentSectionStart = -1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if this line is a section header [SectionName]
            if (this.isSectionHeader(line)) {
                // If we were already in a section, close the previous section
                if (currentSectionStart !== -1) {
                    // Find the last non-empty line before this section
                    let endLine = i - 1;
                    while (endLine > currentSectionStart && lines[endLine].trim() === '') {
                        endLine--;
                    }
                    
                    // Only create folding range if there's content to fold
                    if (endLine > currentSectionStart) {
                        foldingRanges.push(new vscode.FoldingRange(
                            currentSectionStart,
                            endLine,
                            vscode.FoldingRangeKind.Region
                        ));
                    }
                }
                
                // Start tracking this new section
                currentSectionStart = i;
            }
        }
        
        // Handle the last section if there is one
        if (currentSectionStart !== -1) {
            let endLine = lines.length - 1;
            while (endLine > currentSectionStart && lines[endLine].trim() === '') {
                endLine--;
            }
            
            if (endLine > currentSectionStart) {
                foldingRanges.push(new vscode.FoldingRange(
                    currentSectionStart,
                    endLine,
                    vscode.FoldingRangeKind.Region
                ));
            }
        }
        
        // Also handle region folding (;#region / ;#endregion)
        this.addRegionFolding(lines, foldingRanges);
        
        return foldingRanges;
    }
    
    /**
     * Check if a line is a section header like [SectionName]
     */
    isSectionHeader(line) {
        // Match lines that start with [ and end with ]
        // Allow for whitespace and comments after the closing bracket
        return /^\s*\[[^\]]+\]\s*(?:;.*)?$/.test(line);
    }
    
    /**
     * Add folding for ;#region / ;#endregion comments
     */
    addRegionFolding(lines, foldingRanges) {
        const regionStack = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for region start
            if (/^\s*;\s*#region\b/.test(line)) {
                regionStack.push(i);
            }
            // Check for region end
            else if (/^\s*;\s*#endregion\b/.test(line)) {
                if (regionStack.length > 0) {
                    const startLine = regionStack.pop();
                    foldingRanges.push(new vscode.FoldingRange(
                        startLine,
                        i,
                        vscode.FoldingRangeKind.Region
                    ));
                }
            }
        }
    }
}

/**
 * Creates and returns a folding range provider for Rainmeter files
 */
function createFoldingProvider() {
    return new RainmeterFoldingProvider();
}

module.exports = { createFoldingProvider };