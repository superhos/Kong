<template>
  <div class="selector">
    <div class="control">
       <ul v-bind:style="selectorStyle" @click="moveSelector">
          <li :class="{
              show: mode === PLAYER_MODE.STOP || selectIndex === key,
              current: selectIndex === key, 
              playing:  (mode === PLAYER_MODE.PLAYING && selectIndex === key)
            }" 
            :data-index="key" :data-id="item.objectId" v-for="(item, key) in playList" :key="item.objectId">{{item.title}}
            <span>{{countTime.toString().secondsToTime(0)}}</span>
          </li>
      </ul>
      <div class="arrow arrow-left" @click="slideTo(-1)" v-show="mode === PLAYER_MODE.STOP">
      </div>
      <div class="arrow arrow-right" @click="slideTo(1)" v-show="mode === PLAYER_MODE.STOP">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PLAYER_MODE from '../constant/player_mode'

String.prototype.timeToSeconds = function () {
  let [mins, seconds] = this.split(':')
  return +mins * 60 + +seconds
}

String.prototype.secondsToTime = function () {
  let mins = Math.floor(+this / 60).toFixed(0)
  let seconds = +this % 60
  seconds = seconds < 10 ? '0' + seconds: seconds
  return `${mins}:${seconds}`
}

export default {
  name: 'MusicSelector',
  props: {
    msg: String
  },
  data () {
    return {
      PLAYER_MODE,
      selectIndex: 0,
      currentX: 100,
      selectorStyle: {
          transform: `translateX(100px)`
      },
      tween: {
        v: 50 // 速度
      }
    }
  },
  computed: {
    ...mapState(['mode','countTime','curMusicId','playList'])
  },
  methods: {
    slideTo (direc) {
      if (this.selectIndex === 0 && direc < 0) return
      if (this.selectIndex >= this.playList.length - 1 && direc > 0) return
      this.selectIndex = this.selectIndex + direc
      let selectId = this.playList[this.selectIndex].objectId
      this.slideToId(selectId)
    },
    slideToId (selectId) {
      if (this.$store.state.curMusicId !== +selectId) {
        this.$store.dispatch('play', selectId)
        this.$store.dispatch('triggerBg', false)
      }

      this.moveTo(this.selectIndex)
    },
    moveSelector (evt) {
        const target = evt.target.get || evt.srcElement
        if(target.nodeName.toLowerCase() == 'li') {
          this.selectIndex = +target.getAttribute('data-index')
          let selectId = target.getAttribute('data-id')
          
          this.slideToId(selectId)
        }
    },
    moveTo (ind) {
      this.tween.from = this.currentX
      this.tween.to = - 100 * ind + 100
      this.tween.time = null
      window.requestAnimationFrame(this.update)
    },
    update (time) {
      if (!this.tween.time) {
        this.tween.time = time
      }

      if ((this.tween.to <= this.tween.from && this.currentX <= this.tween.to)
        || (this.tween.to > this.tween.from && this.currentX >= this.tween.to)
      ) {
        this.selectorStyle.transform = `translateX(${this.tween.to}px)`
        this.currentX = this.tween.to
        this.$store.dispatch('triggerBg', true)
        return
      }

      let offset = (time - this.tween.time) * this.tween.v / 1000
      this.currentX = this.currentX + (this.tween.to > this.tween.from ? offset : - offset)
      this.selectorStyle.transform = `translateX(${this.currentX}px)`
      window.requestAnimationFrame(this.update)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
.selector {
  background: transparent!important;
  height: 80px;

  ul {
    z-index:98;
    list-style-type: none;
    padding: 0;
    margin: 0;
    white-space: nowrap;
  }

  li {
    display: inline-block;
    margin: 0;
    width: 100px;
    cursor: pointer;
    user-select: none;
    line-height: 80px;
    font-size:13px;
    visibility: hidden;
    border: 1px solid rgba(0,0,0,0);
    border-radius: 100px;
    transform-origin: 50% 50%;
  }

  li.show {
    visibility: visible;
  }

  li span{
    display:none;
  }

  li.current {
    font-size: 23px;
    border: 1px solid #FFF;
    height: 100px;
    width: 100px;
    line-height: 90px;
    position: relative;
    transition: all .5s linear;
  }

  li.current.playing {
    width: 150px;
    height: 150px;
    border: 1px solid #FFF;
    border-radius: 100px;
    line-height: 135px;
    transform: translate(-25px,-80px);
  }

  // li.current:first-child {
  //   transform: translateX(-10px);
  // }

  li.current span {
    position: absolute;
    top: 23px;
    font-size: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: block;
  }

  .control {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 99;

    .arrow {
      width: 30px;
      height: 100%;
      background: transparent;
      position:absolute;
      overflow: hidden;
      border-right: 10px solid rgba(0,0,0,0);
      border-left: 10px solid rgba(0,0,0,0);
    }

    .arrow:hover {
      background: rgba(0,0,0,.6);
    }

    .arrow-left {left:0;top:-100%;border-left:0;}
    .arrow-right {right:0;top:100%;border-right:0;}

    .arrow::after {
      content: ' ';
      display:block;
      width: 30px;
      height: 30px;
      border: 2px solid #c4c4c4;
      transform: rotate(45deg);
      position: absolute;
      top: calc(50% - 15px);
      left: 50%;
    }

    .arrow-right::after {
      transform: rotate(-45deg);
      top: calc(50% - 15px);
      left: -60%;
    }
  }
}
</style>
