// electron/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });

  const indexPath = path.join(__dirname, "..", "dist", "index.html");
  win.loadFile(indexPath);
}

app.whenReady().then(createWindow);
