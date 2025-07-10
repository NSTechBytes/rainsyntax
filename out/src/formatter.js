const vscode = require("vscode");

/**
 * Formats Rainmeter INI files by aligning keys, fixing indentation, and organizing sections.
 * Ensures sections are preserved and no extra newlines are added.
 * @param {string} text - The content of the Rainmeter INI file.
 * @returns {string} - The formatted content.
 */
function formatRainmeterFile(text) {
  const lines = text.split("\n");
  const formattedLines = [];
  let currentSection = null;

  let inSection = false;

  for (let line of lines) {
    line = line.trim(); // Remove leading and trailing whitespaces

    // Ignore completely empty lines
    if (line === "") {
      continue;
    }

    // Check if the line is a section (e.g., [SectionName])
    const sectionMatch = line.match(/^\[.*\]$/);
    if (sectionMatch) {
      currentSection = line;
      if (
        formattedLines.length > 0 &&
        !formattedLines[formattedLines.length - 1].endsWith("\n")
      ) {
        formattedLines.push(""); // Add a blank line between sections
      }
      formattedLines.push(currentSection); // Add section name
      inSection = true;
      continue;
    }

    // Process key-value pairs (e.g., Key=Value)
    const keyValueMatch = line.match(/^([^=]+)=(.*)$/);
    if (keyValueMatch) {
      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();
      formattedLines.push(`${key}=${value}`); // Add key-value pair without extra spaces
      continue;
    }

    // Push comments or invalid lines as-is
    formattedLines.push(line);
  }

  // Join the formatted lines and return the result
  return formattedLines.join("\n").trim() + "\n";
}

module.exports = { formatRainmeterFile };
