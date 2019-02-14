import buzz from 'buzz'

let audio

export default class MusicPlayer {
  static async play (musicObj) {
    if (!audio) {
      audio = new buzz.sound(musicObj.path)
    }
    audio.togglePlay().fadeIn().loop()
    audio.bind("timeupdate", function () {
      var timer = buzz.toTimer(this.getTime());
      // console.log(timer)
   }).bind("error", (err) => {
      console.log(err)
      console.log('err restart')
      audio = new buzz.sound(musicObj.path)
      audio.play()
    })
    .bind("sourceerror", (err) => console.log(err))
    .bind("stop", (evt) => console.log(evt))
    .bind("pause", (evt) => console.log(evt))
    .bind("ended", (evt) => console.log(evt))
    .bind("empty", (evt) => console.log(evt))
    .bind("progress", (evt) => console.log(evt))
    .bind("waiting", (evt) => console.log(evt))
  }

  static async pause () {
    audio.pause()
  }

  static async stop () {
    audio.stop()
    audio = null
  }
}