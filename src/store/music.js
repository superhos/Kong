/** 
 * Music store
*/
import Vue from 'vue'
import PLAYER_MODE from '@/constant/player_mode'
import LOG from '@/constant/log'
import MusicPlayer from '@/helper/music-player'
import Timer from '@/helper/timer'

import Service from '@/services/service'

export default {
  namespaced: true,
  state: {
    curMusicId: null,
    playList: [],
    showBg: true,
    showResult: false,
    roundTime: 1500,
    countTime: 1500,
    timeId: 0,
    logTimeId: 0,
    focusLog: [],
    allLog: [],
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
    start (state, payload) {
      state.mode = PLAYER_MODE.PLAYING
      state.timeId = payload.timeId
      state.logTimeId = payload.logTimeId
    },
    stop (state) {
      // clearInterval(state.timeId)
      MusicPlayer.stop()
      Timer.remove(state.timeId)
      Timer.remove(state.logTimeId)
      state.countTime = state.roundTime
      state.mode = PLAYER_MODE.STOP
    },
    pause (state) {
      MusicPlayer.pause()
      Timer.remove(state.timeId)
      Timer.remove(state.logTimeId)
      state.mode = PLAYER_MODE.PAUSE
    },
    reset (state) {
      state.countTime = state.roundTime
    },
    updateTime (state) {
      state.countTime --
    },
    resetLog(state) {
      state.focusLog = []
    },
    addLog (state, log) {
      state.focusLog.push(log)
    },
    allLog (state, logs) {
      state.allLog = logs
      Vue.set(state, allLog, logs)
    },
    triggerResult (state, isShow) {
      state.showResult = isShow
    }
  },
  actions: {
    async initList ({ commit, dispatch }) {
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
          dispatch('allLog')
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
    start ({ commit, state, dispatch }) {
      if (state.mode === PLAYER_MODE.PLAYING) return

      commit('resetLog')
      let timeId = Timer.push((setState) => {
        if (state.countTime <= 0) {
          dispatch('stop')
          return
        }

        if (state.mode !== PLAYER_MODE.PLAYING) return
        commit('updateTime')
      })
      let logTimeId = Timer.push(() => {
        commit('addLog',{
          time: new Date().getTime(),
          operation: LOG.FOCUS
        })
      }, 3000)

      setTimeout(() => {
        commit('start', {
          timeId,
          logTimeId
        })
        // Play
        const curMusic = state.playList.find( e => e.objectId === state.curMusicId)
        MusicPlayer.play(curMusic)

        commit('addLog',{
          time: new Date().getTime(),
          operation: LOG.START
        })
      })
    },
    stop ({ commit, dispatch }) {
      commit('stop')
      commit('addLog',{
        time: new Date().getTime(),
        operation: LOG.STOP
      })
      setTimeout(() => {
        dispatch('restoreLog')
        dispatch('triggerResult', true)
      })
    },
    pause ({ commit }) {  
      commit('pause')
      setTimeout(() => {
        commit('addLog',{
          time: new Date().getTime(),
          operation: LOG.PAUSE
        })
      })
    },
    async restoreLog ({ state, dispatch }) {
      await Vue.$db.open()
      Vue.$db.log.bulkAdd(state.focusLog)
      dispatch('allLog')
    },
    triggerResult ({ commit }, result) {
      commit('triggerResult', result)
    },
    async allLog ({ commit }) {
      let logs = await Vue.$db.log.toArray()
      commit('allLog', logs)
    }
  }
}