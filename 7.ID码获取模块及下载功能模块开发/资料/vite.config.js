import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 加载特定环境文件中的环境变量
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    resolve: {
      // 別名
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: "0.0.0.0", // 监听所有可用网络接口
      proxy: {
        // 为 API 请求设置反向代理
        '/api': {
          target: env.VITE_APP_HOST,// 代理目标主机
          changeOrigin: true, // 将主机标头的源更改为目标 URL
          rewrite: '', // 重写目标的路径
        },

        // 定义一个代理规则，用于处理对 '/res' 路径的请求
        '/res': {
          // 代理目标，即请求将被转发到的服务器地址，这里使用环境变量 VITE_APP_HOST 作为目标主机
          target: env.VITE_APP_HOST,
          changeOrigin: true,
          secure: false,
          // rewrite 函数用于重写请求的路径，这里将所有以 '/res' 开头的路径重写为 'res'，移除了前面的斜杠
          rewrite: (path) => path.replace(/^\/res/, 'res'),
        },
      }
    }
  }
})
