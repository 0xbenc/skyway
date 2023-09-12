const createMenuTemplate = (mainWindow) => [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Chat',
        accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
        click: () => {
          mainWindow.webContents.send("new chat");
        }
      },
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
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+C' : 'Ctrl+Shift+C',
        click: () => {
          mainWindow.webContents.send("toggle color");
        }
      }
    ]
  },
];

module.exports = createMenuTemplate;