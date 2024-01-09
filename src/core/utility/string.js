/**
 * Generates a preview from the given input string. The length of the preview is determined by the specified length.
 * If the input string is longer than the specified length, an ellipsis is added to the end.
 *
 * @param {string} str - The string to preview.
 * @param {number} len - The length of the preview.
 * @returns {string} The preview string.
 */
const previewText = (str, len) => {
  return `${String(str).substring(0, len)}${
    String(str).length < len ? '' : '...'
  }`;
};

/**
 * Cleans up a string that represents a file title. The cleaning process includes: trimming leading/trailing white space,
 * replacing blank spaces with underscores, converting to lowercase, and replacing non-alphanumeric characters with underscores.
 * If the string ends with an underscore, it is removed.
 *
 * @param {string} str - The string to clean.
 * @returns {string} The cleaned string.
 */
const cleanFileTitle = (str) => {
  let cleanedStr = str
    .trim()
    .replace(/\s/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_');

  if (cleanedStr.endsWith('_')) {
    cleanedStr = cleanedStr.slice(0, -1);
  }

  return cleanedStr;
};

export { previewText, cleanFileTitle };
