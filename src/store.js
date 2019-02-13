import Vue from 'vue'
import Vuex from 'vuex'
import { remote } from 'electron'
import PLAYER_MODE from './constant/player_mode'
import DownloadHelper from './helper/download'
import MusicPlayer from './helper/music-player'

import Service from './services/service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curMusicId: null,
    playList: [],
    showBg: true,
    roundTime: 1500,
    countTime: 1500,
    timeId: 0,
    focusLog: [],
    downloadProgress: {},
    mode: PLAYER_MODE.STOP
  },
  mutations: {
    initList (state, list) {
      state.playList = list
      state.curMusicId = state.playList[0].objectId || 0
    },
    playMusic (state, musicId) {
      state.curMusicId = musicId
    },
    triggerBg (state, isShow) {
      state.showBg = isShow
    },
    start (state, timeId) {
      state.mode = PLAYER_MODE.PLAYING
      state.timeId = timeId
    },
    stop (state) {
      clearTimeout(state.timeId)
      state.countTime = state.roundTime
      state.mode = PLAYER_MODE.STOP
    },
    pause (state) {
      clearTimeout(state.timeId)
      state.mode = PLAYER_MODE.PAUSE
    },
    reset (state) {
      state.countTime = state.roundTime
    },
    updateTime (state) {
      // 一秒调用一次
      if (state.countTime <= 0) {
        clearTimeout(state.timeId)
        state.mode = PLAYER_MODE.STOP
        state.countTime = state.roundTime
      } else {
        state.countTime --
      }
    },
    download (state, musicId) {
      let music = state.playList.find(e => e.objectId === musicId)
      let ind = state.playList.findIndex(e => e.objectId === musicId)
      music.isDownloading = true
      Vue.set(state.playList, ind, music)
    },
    downloadDone (state, musicId) {
      let music = state.playList.find(e => e.objectId === musicId)
      let ind = state.playList.findIndex(e => e.objectId === musicId)
      music.isDownloading = false
      music.isDownload = true
      Vue.set(state.playList, ind, music)
    },
    updateDownloadProgress (state, payload) {
      if (!state.downloadProgress[payload.objectId]) {
        Vue.set(state.downloadProgress, payload.objectId, 0)
      }

      Vue.set(state.downloadProgress, payload.objectId, payload.progress)
    },
    resetLog(state) {
      state.focusLog = []
    },
    addLog (state, log) {
      state.focusLog.push(log)
    }
  },
  actions: {
    async initList ({ commit }) {
      let db = Vue.$db
      let configCollection = db.config
      if (configCollection) {
        // Check version first.
        let needUpdate = false
        let config = await Service('Config').list()
        let newVersion = config.find(e => e.key === 'version')
        try {
          await db.open();
          var configs = await db.config.toArray();
          console.log(configs)
          let curVersion = configs.find(e => e.key === 'version') 
          if ((curVersion ? curVersion.value : '0.0.0') < newVersion.value) {
            needUpdate = true
          }

          let list = []
          console.log(needUpdate)
          if (needUpdate) {
            list = await Service('Music').list() // testlist
            // store to local
            if (!curVersion) {
              db.config.add(newVersion)
              db.music.bulkAdd(list)
            } else {
              db.config.where("objectId").equals(curVersion.objectId).modify(newVersion)
            }

            // db.music.bulkPut(list,'objectId')
            list.forEach(music => {
              db.music.update(music.objectId, music)
            })
            // db.config.update(curVersion.)
          } else {
            list = await db.music.toArray()
            console.log(list)
          }

          console.log(list)
          // check is download 
          DownloadHelper.checkExistsList(list)

          commit('initList', list)
        } finally {
          Vue.$db.close();
        }
      }
    },
    play ({ commit }, musicId) {
      commit('playMusic', musicId)
    },
    triggerBg ({commit}, isShow) {
      commit('triggerBg', isShow)
    },
    start ({ commit, state }) {
      if (state.mode === PLAYER_MODE.PLAYING) return
      let timeId = setInterval(() => {
        commit('updateTime')
      }, 1000)
      commit('resetLog')
      setTimeout(() => {
        commit('start', timeId)
        // Play
        const curMusic = state.playList.find( e => e.objectId === state.curMusicId)
        MusicPlayer.play(curMusic)

        commit('addLog',{
          time: new Date().getTime(),
          operation: 'start'
        })
      })
    },
    stop ({ commit }) {
      MusicPlayer.stop()
      commit('stop')
      setTimeout(() => {
        commit('addLog',{
          time: new Date().getTime(),
          operation: 'stop'
        })
      })
    },
    pause ({ commit }) {
      MusicPlayer.stop()
      commit('pause')
      setTimeout(() => {
        commit('addLog',{
          time: new Date().getTime(),
          operation: 'pause'
        })
      })
    },
    download({ commit, state }, musicId) {
      commit('download', musicId)
      DownloadHelper.download(state.playList.find(e => e.objectId === musicId))
    },
    downloadDone({ commit }, musicId) {
      commit('downloadDone', musicId)
    },
    updateDownloadProgress({commit}, payload) {
      commit('updateDownloadProgress',payload)
    }
  }
})
