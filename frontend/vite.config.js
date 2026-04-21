import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {

      '/jobs': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
      '/members': 'http://localhost:8080',
      '/api/jobs': 'http://localhost:8080',
      '/api/resumes': {
              target: 'http://localhost:8080',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/resumes/, '/resumes')
            }
    }
  }
})
