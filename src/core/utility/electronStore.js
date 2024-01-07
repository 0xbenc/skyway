/**
 * Writes a key-value pair to the electron-store persistent state.
 *
 * @param {key} str - The key to write the data to.
 * @param {value} any - The data. Can be any valid javascript object.
 */
const eSet = (key, val) => {
  window.electron.store.set(key, val);
};

/**
 * Gets a key-value pair from the electron-store persistent state.
 *
 * @param {key} str - The key to get data from.
 * @returns {any} The data from the key.
 */
const eGet = (key) => {
  const val = window.electron.store.get(key);
  return val;
};

export { eSet, eGet };
