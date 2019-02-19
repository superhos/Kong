import Vue from 'vue'
import { cloneDeep } from 'lodash'
import TASK_MODE from '@/constant/task_mode'

export default {
  namespaced: true,
  state: {
    tasks: [{
      id: 0,
      title: '测试KONG',
      order: 0,
      state: TASK_MODE.NORMAL, 
      create_at: new Date().getTime(),
      done_at: null,
      delete_at: null
    }]
  },
  mutations: {
    init (state, tasks) {
      // state.tasks = tasks
    },
    add (state, task) {
      let tempTask = cloneDeep(state.tasks)
      console.log(task)
      tempTask.push(task)
      state.tasks.push(task)
      Vue.set(state, 'tasks', tempTask)
      console.log(state.tasks)
    },
  },
  actions: {
    async init ({commit}) {
      await Vue.$db.open()
      const tasks = await Vue.$db.task.toArray()
      commit('init', tasks)
    },
    add ({ commit }, task) {
      commit('add', task)
    }
  }
}