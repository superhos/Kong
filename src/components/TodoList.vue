<template>
  <div class="to-do-list">
    <ul>
      {{tasks.length}}
      <li v-for="item in tasks" :key="item.id">
        {{item.title}}
      </li>
    </ul>
  </div>
</template>

<script>
import TASK_MODE from '@/constant/task_mode'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('todoList/')

export default {
  name: 'TodoList',
  computed: {
    ...mapState(['tasks']),
  },
  mounted() {
    this.$store.dispatch('todoList/init')
    this.$store.dispatch('todoList/add', {
      id: 1,
      title: '测试KONG',
      order: 0,
      state: TASK_MODE.NORMAL, 
      create_at: new Date().getTime(),
      done_at: null,
      delete_at: null
    })

    console.log(this.tasks)
  }
}
</script>

<style lang="scss">
.to-do-list {
  background: #202020;
  height: 100%;
  width: 100vw;
  color: #FFF;
}
</style>


