const eSet = (key, val) => {
  window.electron.store.set(key, val)
};

const eGet = (key) => {
  const val = window.electron.store.get(key)
  return val;
};

export {eSet, eGet}