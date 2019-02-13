const player = require('play-sound')()
import fs from 'fs'
import store from '@/store'

let audio

export default class MusicPlayer {
  static async play (musicObj, init = true) {
    console.log(musicObj.absolutePath)
    console.log('play')
    // check file exist
    if (!fs.existsSync(musicObj.absolutePath)) {
      // redownload
      store.dispatch('stop')
      store.dispatch('download', musicObj.objectId)
    } else {
      audio = player.play(musicObj.absolutePath, function(err){
        if (err && !err.killed) throw err
      })
    }
  }

  static async pause () {
    audio.kill()
  }

  static async stop () {
    audio.kill()
  }
}