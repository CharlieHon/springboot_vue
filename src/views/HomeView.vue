<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!--
    1. 在 HomeView.vue 中引入 'src/components/HelloWorld.vue'
    -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// 2. @ 表示 /src 目录
// 3. 给 HelloWorld.vue 文件取名 HelloWorld
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  // 导出，这样在HomeView.vue就可以使用HelloWorld组件
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
