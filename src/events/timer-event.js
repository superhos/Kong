const ipcMain = require('electron').ipcMain;

export default function (mainWindow) {
    let timerId
    
    // timer
    console.log('timer init')
    ipcMain.on('timer-start', async (e, args) => {
      console.log('timer-start')
      timerId = setInterval(() => {
        mainWindow.webContents.send('timer-per')
      }, 1000);
    })

    ipcMain.on('timer-stop', async (e, args) => {
      console.log('timer stop')
      clearInterval(timerId)
      timerId = null
    })
}