import { CONFIG_LIST } from './api'
import BaseService from './base-service'

export default class ConfigService extends BaseService{
    async list () {
        return await this.getOpt(CONFIG_LIST)
    }
}