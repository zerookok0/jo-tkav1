import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * 默认用 '/'，本地开发和控制台预览都正常。
 *
 * 部署到 GitHub Pages 的「项目页」（地址形如 用户名.github.io/仓库名/）时，
 * 静态资源必须带上 /仓库名/ 前缀，否则 JS/CSS 会 404、页面白屏。
 *
 * 这个前缀由 .github/workflows/deploy.yml 在构建时通过 VITE_BASE 自动注入，
 * 不需要你手改代码。手工构建时也可以临时指定：
 *
 *   VITE_BASE=/你的仓库名/ npm run build
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
