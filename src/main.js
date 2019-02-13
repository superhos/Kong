import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import CONSTANT from './constant'
import Dexie from 'dexie'

import music from './model/music'
import config from './model/config'

Vue.config.productionTip = false
Vue.$db = Vue.prototype.$db = new Dexie(CONSTANT.DB)

if (!Vue.$db.config) {
  Vue.$db.version(1).stores({
    music: music.printSchema(),
    config: config.printSchema()
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
