const previewText = (str, len) => {
  return `${String(str).substring(0, len)}${String(str).length < len ? "" : "..."}`;
};

const cleanFileTitle = (str) => {
  let cleanedStr = str
    .trim()
    .replace(/\s/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_');

  if (cleanedStr.endsWith('_')) {
    cleanedStr = cleanedStr.slice(0, -1);
  };

  return cleanedStr;
};

export { previewText, cleanFileTitle }