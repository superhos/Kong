import buzz from 'buzz'

let audio

export default class MusicPlayer {
  static async play (musicObj) {
    if (!audio) {
      audio = new buzz.sound(musicObj.path)
    }
    audio.togglePlay().fadeIn().loop()
  }

  static async pause () {
    audio.pause()
  }

  static async stop () {
    audio.stop()
    audio = null
  }
}