const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path')
const Store = require('electron-store');
const axios = require('axios');

const store = new Store({
  migrations: {
    '<1.0.1': store => {
      store.set('version', '1.0.0')
    },
    '1.0.1': store => {
      store.set('version', '1.0.1')
    },
    '1.1.0': store => {
      store.set('version', '1.1.0')
      store.set('open_ai_api_keys',
        [{
          key: store.get("open_ai_api_key"),
          name: "default"
        }]
      )
      store.set('open_ai_api_key', 0)
    },
    '1.1.1': store => {
      store.set('version', '1.1.1')
    },
  }
});

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    autoHideMenuBar: true,
    icon: "./public/icons/icon.png",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: true
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const template = [
    {
      label: 'File',
      submenu: [
        {
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        {
          label: 'Toggle Color Mode',
          accelerator: 'Ctrl+Shift+C',
          click: () => {
            mainWindow.webContents.send("toggle color");
          }
        }
      ]
    },
  ];

  const menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//Begin IPC
ipcMain.on('store-get', async (event, val) => {
  event.returnValue = store.get(val);
});

ipcMain.on('store-set', async (_, key, val) => {
  store.set(key, val);
});

ipcMain.handle('openai-api', async (_, endpoint, data, key) => {
  const bearer = `Bearer ${key}`
  try {
    const response = await axios.post('https://api.openai.com/' + endpoint, data, {
      headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json'
      },
    })
    return response.data
  } catch (error) {
    console.error("API request error", error)
    throw error
  };
});

ipcMain.handle('version-get', () => {
  return app.getVersion();
});
// End IPC
