import Vue from 'vue'
import Vuex from 'vuex'
import testlist from '../mock/testlist'
import PLAYER_MODE from './constant/player_mode'

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
    mode: PLAYER_MODE.STOP
  },
  mutations: {
    initList (state, list) {
      state.playList = list
      state.curMusicId = state.playList[0].id || 0
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
    resetLog(state) {
      state.focusLog = []
    },
    addLog (state, log) {
      state.focusLog.push(log)
    }
  },
  actions: {
    initList ({ commit }) {
      let list = testlist
      commit('initList', list)
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
      commit('start', timeId)
      commit('addLog',{
        time: new Date().getTime(),
        operation: 'start'
      })
    },
    stop ({ commit }) {
      commit('stop')
      commit('addLog',{
        time: new Date().getTime(),
        operation: 'stop'
      })
    },
    pause ({ commit }) {
      commit('pause')
      commit('addLog',{
        time: new Date().getTime(),
        operation: 'pause'
      })
    }
  }
})
