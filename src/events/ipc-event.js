import { app } from 'electron'
const ipcMain = require('electron').ipcMain;
import path from 'path'
import fs from 'fs'
const { download } = require('electron-dl')

const MUSIC_STORE_PATH = `${path.resolve(app.getPath('userData'),'music')}`

export default function (mainWindow) {
    // ipcMain.on('check-exist',(e, args) => {
    //     if (fs.existsSync(`${path.resolve(MUSIC_STORE_PATH,args.filename)}`)) {

    //     }
    // })

    // Download music
    console.log('init')
    ipcMain.on('download', async (e, args) => {
        console.log(args)

        try {
            await download(mainWindow, args.path, {
                filename: args.filename,
                directory: `${MUSIC_STORE_PATH}`,
                onProgress (progress) {
                    mainWindow.webContents.send('download-onProgress', {
                        objectId: args.objectId,
                        progress: progress * 100
                    })
                }
            })

            mainWindow.webContents.send('download-success', {
                objectId: args.objectId
            })
        } catch (err) {
            mainWindow.webContents.send('download-error', {
                objectId: args.objectId,
                error: err
            })
        }
    })
}