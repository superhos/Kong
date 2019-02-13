import { MUSIC_LIST } from './api'
import Service from './service'

let instance = null

export default class MusicService extends Service{

    static getInstance () {
        if (!instance) {
            instance = new MusicService()
        }
        return instance
    }

    async list () {
        return await this.getOpt(MUSIC_LIST)
    }
}