export default class Model {
  static printSchema () {
    return Object.keys(this.schema()).join(',')
  }
}