import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: '/',
    define: {
      // Make environment variables available
      'process.env': env,
      'import.meta.env': JSON.stringify(env)
    },
    server: {
      port: 3000,
      open: false
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            office: []
          }
        }
      },
      sourcemap: mode === 'development'
    }
  }
})