const ipcRenderer = require('electron').ipcRenderer
let tasks = new Map()
let id = 0
let isRunning = false
let last = 0

export default class Timer {
  static count () {
    // 每秒执行
    last += 1000 
    tasks.forEach(task => {
      if (last % task.timegap === 0) task.func()
    })

    if (tasks.size <= 0) {
      Timer.stop()
    }
  }

  static push(task, timegap = 1000) {
    tasks.set(++id, {
      last: 0,
      func: task,
      timegap
    })
    if (!isRunning) {
      isRunning = true
      ipcRenderer.send('timer-start')
      ipcRenderer.on('timer-per', Timer.count)
    }

    return id
  }

  static remove(taskId) {
    tasks.delete(taskId)
    if (tasks.size <= 0) {
      Timer.stop()
    }
  }

  static stop() {
    last = 0
    isRunning = false
    ipcRenderer.send('timer-stop')
    ipcRenderer.removeListener('timer-per', Timer.count)
  }
}