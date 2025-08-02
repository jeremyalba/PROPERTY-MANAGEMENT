const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

// Database setup
const Database = require('./database')

let mainWindow
let db

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  // Initialize database
  db = new Database()
  await db.initialize()
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers for database operations
ipcMain.handle('db-exec', async (event, sql, params = []) => {
  try {
    return await db.exec(sql, params)
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
})

ipcMain.handle('db-get', async (event, sql, params = []) => {
  try {
    return await db.get(sql, params)
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
})

ipcMain.handle('db-all', async (event, sql, params = []) => {
  try {
    return await db.all(sql, params)
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
})

// File operations
ipcMain.handle('select-file', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    ...options
  })
  return result
})

ipcMain.handle('select-directory', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  return result
})

ipcMain.handle('save-file', async (event, options = {}) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'Excel Files', extensions: ['xlsx'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    ...options
  })
  return result
})

// Open external links
ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url)
})

// Export database
ipcMain.handle('export-database', async (event) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: 'property-management-backup.db',
    filters: [{ name: 'SQLite Database', extensions: ['db'] }]
  })
  
  if (!result.canceled) {
    await db.exportDatabase(result.filePath)
    return result.filePath
  }
  return null
})

// Import database
ipcMain.handle('import-database', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'SQLite Database', extensions: ['db'] }]
  })
  
  if (!result.canceled) {
    await db.importDatabase(result.filePaths[0])
    return result.filePaths[0]
  }
  return null
})