const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  store: {
    get(key) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    }
  },
  engine: {
    chat: async (data, key) => {
      const response = await ipcRenderer.invoke('apiRequest', "v1/chat/completions", data, key)
      return response;
    },
    version: async () => {
      const response = await ipcRenderer.invoke('version')
      return response;
    }
  }
});