<template>
  <div>
    <!--引用组件：头部-->
    <Header/>
    <!--主体-->
    <div style="display: flex">
      <!--侧边栏-->
      <Aside/>
      <!--内容区，这个部分是从HomeView.vue组件来的，通过路由机制-->
      <!--俺是这么理解的：
      1. 首先index.html是首页面
      2. App.vue负责组织外观布局，然后被挂载到index.html上
      3. 在App.vue使用组件方式，如<Aside/>引入的部分为固定组件，即在布局中常在
      4. 而使用路由机制，即<router-view>方式可以根据请求的uri，路由到不同的组件。
          如 / 路由到 HomeView组件，/about 路由到 AboutView组件
      -->
      <router-view style="flex: 1"/>
    </div>
  </div>
</template>
<style>

</style>
<script>
// 回顾前端技术栈-es6
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";

export default {
  name: "layout",
  components: {
    Header,
    Aside
  }
}
</script>