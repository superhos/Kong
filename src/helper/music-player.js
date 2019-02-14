const player = require('play-sound')()
import {Howl, Howler} from 'howler';
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
      // audio = player.play(musicObj.absolutePath, function(err){
      //   if (err && !err.killed) throw err
      // })
      let file = fs.readFileSync(musicObj.absolutePath).toString('base64')
      console.log(file)
      audio = new Howl({
        src: [file]
      })

      Howler.volume(1)
      audio.play()
      
    }
  }

  static async pause () {
    audio.pause()
  }

  static async stop () {
    audio.stop()
  }
}