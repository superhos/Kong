<template>
<div class="focus">
    <button @click="start" v-show="mode === PLAYER_MODE.STOP">
        开始专注
    </button>    
    <button @click="start" v-show="mode === PLAYER_MODE.PAUSE">
        继续专注
    </button>    
    <button class="stop" @click="stop" v-show="mode === PLAYER_MODE.PAUSE">
        停止专注
    </button>    
    <button @click="pause" v-show="mode === PLAYER_MODE.PLAYING">
        休息
    </button>    
</div>    
</template>

<script>
import PLAYER_MODE from '../constant/player_mode'

export default {
    name: 'Focus',
    data () {
        return {
            PLAYER_MODE
        }
    },
    computed: {
        mode () {
            return this.$store.state.mode
        }
    },
    methods: {
        start () {
            this.$store.dispatch('start')
        },
        stop () {
            this.$store.dispatch('stop')
        },
        pause () {
            this.$store.dispatch('pause')
        }
    }
}
</script>

<style lang="scss">
.focus {
    background: transparent;
    position: absolute;

    button{
        display: inline-block;
        width: 80px;
        background: #EEE;
        color: #575757;
        border: 0;
        box-shadow: 0;
        font-size: 13px;
        padding: 8px 5px;
        border-radius: 50px;
        outline: none;
        font-weight: bolder;
    }

    button.stop {
        background: #db2323;
        margin-top: 15px;
        color: #FFF;
    }
}
</style>


