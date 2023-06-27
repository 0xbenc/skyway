const previewText = (str, len) => {
  return `${String(str).substring(0, len)}${String(str).length < len ? "" : "..."}`;
};

export { previewText }