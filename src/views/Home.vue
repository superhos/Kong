<template>
  <div class="home">
    <MusicSelector class="center" :style="musicBgStyle"/>
    <Focus class="focus"/>
    <div class="mask">
    </div>
    <transition name="slide-fade">
      <div class="bg" :style="musicBgStyle" v-show="showBg">
      </div>
    </transition>
    <ResultPage :show="showResult"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('music/')
import MusicSelector from '@/components/MusicSelector.vue'
import Focus from '@/components/Focus.vue'
import ResultPage from '@/components/ResultPage.vue'


export default {
  name: 'home',
  data () {
    return {
      showResult: true
    }
  },
  components: {
    MusicSelector,
    Focus,
    ResultPage
  },
  computed: {
    ...mapState(['showBg', 'playList','curMusicId']),
    musicBgStyle () {
      let bg = this.playList.find(e => e.objectId == this.curMusicId)
      return bg ? bg.style : {}
    }
  }
}
</script>

<style lang="scss">
.center {
  position: absolute;
  top: 40%;
  left: 0;
  transform: translateY(-50%);
  z-index: 999;
}

.home, .bg {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-size: 100% 100%;
  background-position: center;
  z-index:9;
  transform-origin: 50% 50%;
}

.mask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  background-size: cover;
  top: 0;
  left: 0;
  z-index: 10;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.focus {
  bottom: 20vh;
  left:50%;
  transform: translateX(-50%);
  z-index:99;
}
// .slide-fade-leave-to
// /* .slide-fade-leave-active for below version 2.1.8 */ {
//   // transform: translateX(10px);
//   opacity: 0;
// }

// .slide-fade-enter {
//   opacity: 1;
// }
</style>

