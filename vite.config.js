import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      echarts: 'echarts/dist/echarts.js', // 支持echarts绘图
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://114.116.219.29:8000',
        changeOrigin: true,
        rewrite: path => path
      }
    }
  }
})
