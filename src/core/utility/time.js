const isoToHuman = (isoTimeString) => {
  const date = new Date(isoTimeString);
  const humanReadableDate = date.toLocaleDateString('en-US',
    { year: '2-digit', month: '2-digit', day: 'numeric' });
  const humanReadableTime = date.toLocaleTimeString('en-US',
    { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return `${humanReadableDate}, ${humanReadableTime}`;
};

const unixToISO = (unixTime) => {
  const date = new Date(unixTime * 1000); // Convert unixTime to milliseconds

  return date.toISOString();
};

export { isoToHuman, unixToISO };
