import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: [
      '9636b2b6656e.ngrok-free.app', // libera esse domínio
    ]
  }
})
