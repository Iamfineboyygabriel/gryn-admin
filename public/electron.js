import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';

let mainWindow;

function createWindow() {
    const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

 const logoPath = process.platform !== 'darwin'
  ? path.join(__dirname, 'apple.ico')
  : path.join(__dirname, 'apple.icns');

  console.log(path.join(__dirname));
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    // Uncomment if you need Node.js integration or preload scripts
    // webPreferences: {
    //   nodeIntegration: true,
    //   contextIsolation: false, // Only if you need Node.js APIs
    //   preload: path.join(__dirname, 'preload.js'),
    // },
    icon: logoPath,
  });

  
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build', 'index.html')}`;
  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
