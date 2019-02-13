import { MUSIC_LIST } from './api'
import BaseService from './base-service'

export default class MusicService extends BaseService{
    async list () {
        return await this.getOpt(MUSIC_LIST)
    }
}