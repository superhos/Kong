const  electron = require('electron')
const md5 = require('js-md5')

export default class BaseService {
    sign () {
        let KEY = electron.remote.getGlobal('env').LEANCLOUD_KEY
        let time = new Date().getTime()
        return md5(time + KEY) + ',' + time
    }

    headers() {
        let ID = electron.remote.getGlobal('env').LEANCLOUD_ID
        let SIGN = this.sign()
        return {
            'X-LC-Id'   : ID,
            'X-LC-Sign' : SIGN,
            'Content-Type': 'application/json'
        }
    }

    getOpt (url) {
        return new Promise ((resolve, reject) => {
            fetch (url, {
                method: 'GET',
                headers: this.headers()
            }).then((res) => {
                if (!res.ok)reject()
                return res.json()
            }).then((res) => {
                resolve(res.results)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}