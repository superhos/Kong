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
        MusicPlayer.stop()
        state.mode = PLAYER_MODE.STOP
        state.countTime = state.roundTime
      } else {
        state.countTime --
      }
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
          let curVersion = configs.find(e => e.key === 'version') 
          if ((curVersion ? curVersion.value : '0.0.0') < newVersion.value) {
            needUpdate = true
          }

          let list = []
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
          }

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
      MusicPlayer.pause()
      commit('pause')
      setTimeout(() => {
        commit('addLog',{
          time: new Date().getTime(),
          operation: 'pause'
        })
      })
    }
  }
})
