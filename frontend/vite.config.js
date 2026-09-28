import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/data-form/',
  build: {
    sourcemap: false,
    emptyOutDir: true
  },

  server: {
    port: 3000,
    proxy: {
      '/praveentp': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
