import Model from './model'

export default class Config extends Model{
  constructor (options) {
    // this.objectId = options.objectId || ''
    // this.key = options.key || ''
    // this.value = options.value || ''

    Object.keys(Config.schema()).forEach((key) => {
      this[key] = options[key] || Config.schema()[key]
    })
  }

  static schema () {
    return {
      id: 0,
      time: '',
      operation: ''
    }
  }
}