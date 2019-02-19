import Vue from 'vue'
import Vuex from 'vuex'

import stores from '@/store/index'

Vue.use(Vuex)

console.log(stores)
export default new Vuex.Store({
  modules: stores
})
