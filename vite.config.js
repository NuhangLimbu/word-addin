import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,  // Use Render's port
  },
  // Add this for proper routing
  base: '/',
})