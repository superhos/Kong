import Model from './model'

export default class Music extends Model {
  constructor (options = {}) {
    // this.objectId = options.objectId || ''
    // this.title = options.title || ''
    // this.filename = options.path ? options.path.substring(options.path.lastIndexOf('/') + 1) : ''
    // this.path = options.path || ''
    // this.style = options.style || {}
    // this.isDownload = false

    Object.keys(Music.schema()).forEach((key) => {
      this[key] = options[key] || Music.schema()[key]
    })
  }

  static schema () {
    return {
      objectId: '',
      title: '',
      filename: '',
      path: '',
      order: 0,
      style: {},
      isDownload: false
    }
  }
}