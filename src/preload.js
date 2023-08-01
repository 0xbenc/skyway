const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  store: {
    get(key) {
      return ipcRenderer.sendSync('store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('store-set', property, val);
    }
  },
  engine: {
    chat: async (data, key) => {
      const response = await ipcRenderer.invoke('openai-api', "v1/chat/completions", data, key);
      return response;
    },
    version: async () => {
      const response = await ipcRenderer.invoke('version-get');
      return response;
    },
    dialog_choose_directory: () => ipcRenderer.invoke(
      'dialog-choose-directory'
    ),
    dialog_open_filtered_file: (directory, filters) => ipcRenderer.invoke(
      'dialog-open-filtered-file',
      directory,
      filters
    ),
    send: (channel, data) => ipcRenderer.send(channel, data)
  }
});

contextBridge.exposeInMainWorld('ipc', {
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});