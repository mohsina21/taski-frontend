import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    '/api': {
      target: 'https://taski-backend-nl91.onrender.com', // Your backend
      changeOrigin: true,
    },
  },
},

})
