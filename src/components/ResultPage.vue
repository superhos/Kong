<template>
  <div :class="{'show': showResult, 'result-box': true }">
    <header @click="triggerResult">
      <a href="#" class="close" />
    </header>
    <section>
      <div class="top">
        <h2>{{moment().format('YYYY')}}</h2>
        <h3>{{moment().format('MM月DD日')}}</h3>
        <radial-progress-bar :diameter="100" 
          startColor="#f95b91"
          stopColor="#ff914c"
          innerStrokeColor="rgba(0,0,0,0.3)"
          :strokeWidth="parseInt(10)"
          :completed-steps="curDownloadSteps"
          :total-steps="totalSteps">
          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="30px" height="30px"  stroke="#F7FCFD" fill="#F7FCFD" viewBox="0 0 511.62 511.62" style="color:#F7FCFD;enable-background:new 0 0 511.62 511.62;">
            <g>
              <path style="color:#FFF;background:#FFF;" d="M156.45,351.309c8.564,12.272,19.368,23.935,32.404,34.972c13.039,11.036,26.215,20.553,39.543,28.547
                c13.326,7.998,28.553,15.893,45.682,23.702l-0.287-0.287l1.143,0.287c-12.754-24.365-19.128-45.679-19.128-63.953
                c0-9.709,2.334-18.894,7-27.549c4.661-8.664,10.749-16.426,18.268-23.271c7.522-6.851,15.848-13.702,24.982-20.554
                c9.133-6.857,18.267-14.232,27.411-22.127c9.134-7.898,17.463-16.276,24.981-25.126c7.519-8.852,13.606-19.558,18.274-32.12
                c4.661-12.563,6.995-26.269,6.995-41.112c0-18.654-2.621-36.164-7.851-52.534c-5.235-16.368-12.135-30.693-20.697-42.968
                c-8.562-12.275-19.362-23.935-32.408-34.97c-13.038-11.04-26.214-20.557-39.539-28.549C269.897,15.703,254.671,7.804,237.543,0
                l0.284,0.288L236.971,0c12.56,24.741,18.839,46.061,18.839,63.95c0,9.707-2.331,18.892-6.995,27.55
                c-4.665,8.66-10.754,16.415-18.271,23.269c-7.52,6.851-15.846,13.703-24.982,20.557c-9.139,6.851-18.276,14.228-27.411,22.126
                c-9.136,7.898-17.462,16.274-24.982,25.122c-7.517,8.852-13.606,19.558-18.271,32.12c-4.661,12.563-6.995,26.269-6.995,41.112
                c0,18.654,2.611,36.165,7.846,52.533C140.985,324.708,147.886,339.037,156.45,351.309z"/>
              <path style="color:#FFF" d="M454.092,477.788c-1.811-1.803-3.949-2.703-6.42-2.703H63.95c-2.474,0-4.615,0.9-6.423,2.703
                c-1.809,1.808-2.712,3.949-2.712,6.424v18.271c0,2.479,0.903,4.617,2.712,6.427c1.809,1.811,3.949,2.711,6.423,2.711h383.722
                c2.471,0,4.609-0.9,6.42-2.711c1.807-1.81,2.714-3.948,2.714-6.427v-18.271C456.806,481.737,455.905,479.596,454.092,477.788z"/>
            </g>
          </svg>
          <span>{{curDownloadTime}}</span>
        </radial-progress-bar>
        <span>* 按8小时工作时间计算</span>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RadialProgressBar from 'vue-radial-progress'
import LOG from '@/constant/log'
import moment from 'moment'

export default {
  name: 'ResultPage',
  components: {
    RadialProgressBar
  },
  data () {
    return {
      totalSteps: 480,
      moment: (evt) => moment(evt)
    }
  },
  computed: {
    ...mapState(['showResult','allLog']),
    curDownloadSteps () {
      let data = this.allLog
      let yData = [0,0]
      
      let start = 0
      data.sort((a,b) => a.time - b.time).forEach(e => {
        if (e.operation === LOG.START) {
          if (start !== 0) yData[1] += +e.time - +start
          start = +e.time
        } else if (e.operation === LOG.PAUSE) {
          yData[0] += +e.time - +start
          start = +e.time
        } else if (e.operation === LOG.STOP) {
          yData[0] += +e.time - +start
          start = +e.time
        } 
      })

      yData = yData.map(e => Math.ceil(e / 60000))

      return yData[0]
    },
    curDownloadTime () {
      let result = this.curDownloadSteps
      if (result > 60) {
        result = +(result / 60).toFixed(1) + 'H'
      } else {
        result = result + 'min'
      }

      return result
    }
  },
  methods: {
    triggerResult (evt) {
      const target = evt.target.get || evt.srcElement
      this.$store.dispatch('triggerResult', target.nodeName.toLowerCase() === 'header')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.result-box {
  position: absolute;
  top: 98vh;
  left: 0;
  width: 100vw;
  height: 90vh;
  background: #FFF;
  z-index: 999;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transition: all 1s;
  
  header {
    height: 30px;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 999;
  }

  section {
    height: calc(100% - 30px);
    
    .top {
      height: 30%;
      overflow: hidden;
      width: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      color:#F7FCFD;
      font-weight: bolder;
      background: #FFF;
      padding-top: 18%;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      transition: all 3s ease-in-out;
      flex-direction: column;
      align-items: center;

      h2, h3 {
        font-size: 15px;
        margin: 0;
        padding: 0;
        font-weight: 100;
        margin-bottom: 5px;
      }

      h2 {
        margin: 0;
        font-size: 23px;
        font-weight: bolder;
        letter-spacing: 3px;
      }

      & > span {
        margin-top: 10px;
        font-size: 13px;
        color: #B4D1E1;
      }
    }

    .comment {
      width: 100%;
      font-size: 13 px;
    }
  }
}

.result-box.show {
  top: 10vh;
  box-shadow: 1px -2px 7px #525252;
}

.result-box.show section .top {
  background: #7C9AAB;
  padding-top: 3%;
  height: 60%;
  // background: #e7e7e7;
}

.close {
  position: absolute;
  right: 5px;
  top: 8px;
  width: 32px;
  height: 32px;
  opacity: 0.3;
}
.close:hover {
  opacity: 1;
}
.close:before, .close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 20px;
  width: 2px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}

</style>
