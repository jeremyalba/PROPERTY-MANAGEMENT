const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  dbExec: (sql, params) => ipcRenderer.invoke('db-exec', sql, params),
  dbGet: (sql, params) => ipcRenderer.invoke('db-get', sql, params),
  dbAll: (sql, params) => ipcRenderer.invoke('db-all', sql, params),
  
  // File operations
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  
  // External operations
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Database backup/restore
  exportDatabase: () => ipcRenderer.invoke('export-database'),
  importDatabase: () => ipcRenderer.invoke('import-database'),
  
  // Platform info
  platform: process.platform
})