
let tasks = new Map()
let id = 0
let isRunning = false
let last

export default class Timer {
  static count (time) {
    // 每秒执行
    tasks.forEach(task => {
      if (!task.last || time - task.last >= task.timegap) {
        if (task.last) {
          task.func()
        }
        task.last = time
      }
    })

    if (tasks.size > 0) {
      requestAnimationFrame(Timer.count)
    } else {
      isRunning = false
    }
  }

  static push(task, timegap = 1000) {
    tasks.set(++id, {
      last: null,
      func: task,
      timegap
    })
    if (!isRunning) {
      isRunning = true
      requestAnimationFrame(Timer.count)
    }

    return id
  }

  static remove(taskId) {
    tasks.delete(taskId)
  }
}