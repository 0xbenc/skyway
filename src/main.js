const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path')
const Store = require('electron-store');
const axios = require('axios');
const fs = require('fs');
const { buildSystemPrompts_1_2_0 } = require('./core/utility/migrations');

//Helpers START
const getFileName = (filePath) => {
  const lastSlashIndex = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
  return filePath.substring(lastSlashIndex + 1);
};
const getFileExtension = (filePath) => {
  const lastPeriodIndex = filePath.lastIndexOf(".");
  return filePath.substring(lastPeriodIndex + 1);
};
const getFolderPath = (filePath) => {
  const lastSlashIndex = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
  return filePath.substring(0, lastSlashIndex);
};

//Helpers END

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
    '1.2.0': store => {
      store.set('version', '1.2.0')
      store.set('system_prompts', buildSystemPrompts_1_2_0(store.get("system_prompts")))
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

  ipcMain.handle('dialog-choose-directory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    };
  });

  ipcMain.handle('dialog-open-filtered-file', async (_, directory, filters) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      filters: filters,
      properties: ['openFile'],
      defaultPath: directory,
    })
    if (canceled) {
      return;
    } else {
      const filePath = filePaths[0];
      const fileBuffer = fs.readFileSync(filePath);
      const encodedFile = `data:application/octet-stream;base64,${fileBuffer.toString('base64')}`;
      const fileName = getFileName(filePath);
      const fileExtension = getFileExtension(filePath);
      const folderPath = getFolderPath(filePath);

      const file = {
        "data": encodedFile,
        "fileExtension": fileExtension,
        "fileName": fileName,
        "filePath": filePaths[0],
        "folderPath": folderPath,
        "origin": "local" // local vs session (session is in RAM / temp, not in plastic folder)
      };
      return file
    };
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

  ipcMain.on('store-get', async (event, val) => {
    event.returnValue = store.get(val);
  });

  ipcMain.on('store-set', async (_, key, val) => {
    store.set(key, val);
  });

  ipcMain.on('save-json', (_, args) => {
    fs.writeFile(`${args.dir}/${args.filename}.json`, args.jsonstr, (err) => {
      if (err) throw err;
    });
  });
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
