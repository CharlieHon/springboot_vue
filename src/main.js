import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// main.js用于引入资源(css/组件等)，同时也是创建 App 挂载 #app，引入 ./router ./store 等资源的所在
createApp(App).use(store).use(router).mount('#app')
