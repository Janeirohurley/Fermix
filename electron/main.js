import { app, BrowserWindow, ipcMain, dialog } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let splash;

function createWindow() {
  // Splash animé
  splash = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  });
  splash.loadFile(path.join(__dirname, "splash.html"));

  // Fenêtre principale avec frame personnalisé
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // cacher au début
    frame: false, // Pas de frame par défaut, on utilise notre propre
    icon: path.join(__dirname, "assets/icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hidden", // Masquer la barre de titre par défaut
    titleBarOverlay: {
      color: "#2d3748", // Couleur de fond de la barre personnalisée
      symbolColor: "#ffffff", // Couleur des symboles
      height: 40, // Hauteur de la barre
    },
  });
  

  // Gestion des événements de la fenêtre
  ipcMain.handle("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.handle("maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle("close-window", () => {
    mainWindow.close();
  });

  ipcMain.handle("is-maximized", () => {
    return mainWindow.isMaximized();
  });

  // Écouter les changements de maximisation
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("maximize-change", true);
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("maximize-change", false);
  });

  // Gestion de l'import/export de données
  ipcMain.handle("select-file", async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: options.title || "Sélectionner un fichier",
      buttonLabel: options.buttonLabel || "Sélectionner",
      filters: options.filters || [
        { name: "Fichiers JSON", extensions: ["json"] },
        { name: "Tous les fichiers", extensions: ["*"] },
      ],
      properties: ["openFile"],
    });
    return result;
  });

  ipcMain.handle("save-file", async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: options.title || "Enregistrer le fichier",
      buttonLabel: options.buttonLabel || "Enregistrer",
      filters: options.filters || [
        { name: "Fichiers JSON", extensions: ["json"] },
        { name: "Fichiers CSV", extensions: ["csv"] },
        { name: "Tous les fichiers", extensions: ["*"] },
      ],
    });
    return result;
  });

  ipcMain.handle("export-data", async (event, data) => {
    try {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: "Exporter les données",
        defaultPath: `fermix-export-${
          new Date().toISOString().split("T")[0]
        }.json`,
        filters: [{ name: "Fichier JSON", extensions: ["json"] }],
      });

      if (!result.canceled && result.filePath) {
        fs.writeFileSync(
          result.filePath,
          JSON.stringify(data, null, 2),
          "utf-8"
        );
        return { success: true, filePath: result.filePath };
      }

      return { success: false, canceled: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("import-data", async (event, filePath) => {
    try {
      if (!filePath) {
        const result = await dialog.showOpenDialog(mainWindow, {
          title: "Importer des données",
          filters: [{ name: "Fichiers JSON", extensions: ["json"] }],
          properties: ["openFile"],
        });

        if (result.canceled || result.filePaths.length === 0) {
          return { success: false, canceled: true };
        }

        filePath = result.filePaths[0];
      }

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);

      return { success: true, data, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Afficher la fenêtre principale après 5 secondes
  setTimeout(() => {
    splash.close();
    mainWindow.show();
  }, 5000);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
