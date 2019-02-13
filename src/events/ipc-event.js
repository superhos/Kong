import { ipcMain, app } from 'electron'
import path from 'path'
import fs from 'fs'
import download from 'electron-dl'

const MUSIC_STORE_PATH = `${path.resolve(app.getPath('userData'),'music')}`

export default function (mainWindow) {
    // ipcMain.on('check-exist',(e, args) => {
    //     if (fs.existsSync(`${path.resolve(MUSIC_STORE_PATH,args.filename)}`)) {

    //     }
    // })

    // Download music
    ipcMain.on('download', (e, args) => {
        download(mainWindow, args.path, {
            filename: args.filename,
            directory: `${MUSIC_STORE_PATH}`,
            onProgress (progress) {
                mainWindow.webContent.send('download-onProgress', {
                    objectId: args.objectId,
                    progress: progress * 100
                })
            },
            onStarted (downloadItem) {
                mainWindow.webContents.send('download-onStarted', {
                    objectId: args.objectId,
                    downloadItem
                })
            }
        }).then(downloadItem => {
            mainWindow.webContents.send('download-success', {
                objectId: args.objectId,
                downloadItem
            })
        }).catch(e => {
            console.warn(e)
            mainWindow.webContents.send('download-error', {
                objectId: args.objectId,
                error: e
            })
        })
    })
}