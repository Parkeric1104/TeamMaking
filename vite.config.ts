import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/TeamMaking/',
  optimizeDeps: {
    include: ['xlsx'],
  },
  build: {
    commonjsOptions: {
      include: [/xlsx/, /node_modules/],
    },
  },
})
