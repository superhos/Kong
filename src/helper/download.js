const { app } = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer
import fs from 'fs'
import path from 'path'
import store from '@/store'

const MUSIC_STORE_PATH = `${path.resolve(app.getPath('userData'),'music')}`

export default class DownloadHelper {
  static checkExistsList (list) {
    for (let i = 0; i < list.length; i++) {
      if (!list[i].path || list[i].path.length === 0) continue
      list[i].filename = list[i].path.substring(list[i].path.lastIndexOf('/')+1)
      list[i].absolutePath = path.resolve(MUSIC_STORE_PATH,list[i].filename)
      list[i].isDownload = fs.existsSync(path.resolve(MUSIC_STORE_PATH,list[i].filename))
    }

    return list
  }

  static download (music) {
    ipcRenderer.send('download', music)
    ipcRenderer.on('download-onProgress', DownloadHelper.updateProgress)
    ipcRenderer.on('download-success', DownloadHelper.downloadDone)
    ipcRenderer.on('download-error', (event, data) => {
      ipcRenderer.removeListener('download-onProgress', DownloadHelper.updateProgress)
    })
  }

  static downloadDone (event, data) {
    // 下载完成后转换成dat
    setTimeout (() => {
      store.dispatch('downloadDone', data.objectId)
    }, 1200)
    ipcRenderer.removeListener('download-onProgress', DownloadHelper.updateProgress)
    ipcRenderer.removeListener('download-success', DownloadHelper.downloadDone)
  }

  static updateProgress (event, data) {
    store.dispatch('updateDownloadProgress', {
      objectId: data.objectId,
      progress: Math.floor(data.progress / 10)
    })
    console.log(data)
  }
}