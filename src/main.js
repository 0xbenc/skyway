const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const axios = require("axios");
const store = require("./tools/electron/store");
const createMenuTemplate = require("./tools/electron/menu");

const WINDOW_WIDTH = 1600;
const WINDOW_HEIGHT = 900;

const getFileName = (filePath) => {
  const lastSlashIndex = Math.max(
    filePath.lastIndexOf("/"),
    filePath.lastIndexOf("\\"),
  );
  return filePath.substring(lastSlashIndex + 1);
};

const getFileExtension = (filePath) => {
  const lastPeriodIndex = filePath.lastIndexOf(".");
  return filePath.substring(lastPeriodIndex + 1);
};

const getFolderPath = (filePath) => {
  const lastSlashIndex = Math.max(
    filePath.lastIndexOf("/"),
    filePath.lastIndexOf("\\"),
  );
  return filePath.substring(0, lastSlashIndex);
};

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    autoHideMenuBar: true,
    icon: "./public/icons/icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  Menu.setApplicationMenu(
    Menu.buildFromTemplate(createMenuTemplate(mainWindow)),
  );

  setUpMainInteractions(mainWindow);
};

const setUpMainInteractions = (mainWindow) => {
  ipcMain.handle("dialog-choose-directory", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    return canceled ? null : filePaths[0];
  });

  ipcMain.handle("dialog-open-filtered-file", (event, directory, filters) =>
    openFilteredFile(mainWindow, event, directory, filters),
  );
  ipcMain.handle("openai-api", callOpenAI);
  ipcMain.handle("version-get", () => app.getVersion());
  ipcMain.on("store-get", (event, val) => {
    event.returnValue = store.get(val);
  });
  ipcMain.on("store-set", (_, key, val) => {
    store.set(key, val);
  });
  ipcMain.on("save-json", saveJson);
};

const openFilteredFile = async (mainWindow, _, directory, filters) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    filters: filters,
    properties: ["openFile"],
    defaultPath: directory,
  });

  if (canceled) {
    return;
  } else {
    const filePath = filePaths[0];
    // Use readFile and asynchronously handle the promise
    const fileBuffer = await fs.readFile(filePath);
    const encodedFile = `data:application/octet-stream;base64,${fileBuffer.toString(
      "base64",
    )}`;
    const fileName = getFileName(filePath);
    const fileExtension = getFileExtension(filePath);
    const folderPath = getFolderPath(filePath);

    const file = {
      data: encodedFile,
      fileExtension: fileExtension,
      fileName: fileName,
      filePath: filePaths[0],
      folderPath: folderPath,
    };
    return file;
  }
};

const callOpenAI = async (_, endpoint, data, key) => {
  const bearer = `Bearer ${key}`;
  try {
    const response = await axios.post(
      "https://api.openai.com/" + endpoint,
      data,
      {
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API request error", error);
    throw error;
  }
};

const saveJson = (_, args) => {
  if (args.dir) {
    // Only proceed if dir is not undefined
    fs.writeFile(`${args.dir}/${args.filename}.json`, args.jsonstr, (err) => {
      if (err) throw err;
    });
  }
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
