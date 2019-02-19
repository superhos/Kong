import Model from './model'
import TASK_MODE from '@/constant/task_mode'

export default class Task extends Model {
  constructor (options = {}) {
    Object.keys(Music.schema()).forEach((key) => {
      this[key] = options[key] || Music.schema()[key]
    })
  }

  static schema () {
    return {
      id: '',
      title: '',
      order: 0,
      state: TASK_MODE.NORMAL, 
      create_at: new Date().getTime(),
      done_at: null,
      delete_at: null
    }
  }
}