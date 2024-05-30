const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true
})
module.exports = {
    devServer: {
        port: 10001,     // 启动端口
        proxy: {            // 设置代理，处理跨域问题
            '/api': {       // 设置拦截器，拦截器格式：斜杠+拦截器名字
                target: 'http://localhost:9090',    // 代理的目标地址，就是 /api 代替 http://localhost/9090
                changeOrigin: true,     // 是否设置同源，true实现跨域
                pathRewrite: {          // 路径重写
                    '/api': ''          // 选择忽略拦截器里面的单词
                }
            }
        }
    }
}
// 修改了配置文件，需要重启项目才能生效！