import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入css
import '@/assets/css/global.css'
// 引入element-plus: 1. 引入组件 2. 引入样式 3. 使用 .use(ElementPlus)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 国际化: 引入并与ElementPlus整合关联
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// main.js用于引入资源(css/组件等)，同时也是创建 App 挂载 #app，引入 ./router ./store 等资源的所在
createApp(App).use(store).use(router).use(ElementPlus, {locale: zhCn}).mount('#app')
