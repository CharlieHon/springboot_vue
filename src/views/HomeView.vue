<template>
  <!--去掉 class="home"-->
  <div>
    <!--<img alt="Vue logo" src="../assets/logo.png">-->
    <!--
    1. 在 HomeView.vue 中引入 'src/components/HelloWorld.vue'
    -->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <!--将表格数据(即后端数据)放在HomeView.vue中-->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="address" label="地址"/>
    </el-table>
  </div>
</template>

<script>
// 2. @ 表示 /src 目录
// 3. 给 HelloWorld.vue 文件取名 HelloWorld
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  // 导出，这样在HomeView.vue就可以使用HelloWorld组件
  name: 'HomeView',
  components: {
    // HelloWorld
  }
}
</script>
