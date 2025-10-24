const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  maximizeWindow: () => ipcRenderer.invoke("maximize-window"),
  closeWindow: () => ipcRenderer.invoke("close-window"),
  isMaximized: () => ipcRenderer.invoke("is-maximized"),
  onMaximizeChange: (callback) => ipcRenderer.on("maximize-change", callback),

  // API pour l'import/export de données
  exportData: (data) => ipcRenderer.invoke("export-data", data),
  importData: (filePath) => ipcRenderer.invoke("import-data", filePath),
  selectFile: (options) => ipcRenderer.invoke("select-file", options),
  saveFile: (options) => ipcRenderer.invoke("save-file", options),
});
