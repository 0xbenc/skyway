const formatResponse = (str) => {
  const regex = /```([^`]+)```/gm;
  let result = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      result.push({ type: "regular", text: str.substring(lastIndex, match.index) });
    }

    result.push({ type: "code", text: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    result.push({ type: "regular", text: str.substring(lastIndex) });
  }

  return result;
};

export { formatResponse };