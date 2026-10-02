import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Christian-Vision/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        cvGlobal: 'cv-global.html',
        film: 'fj-n2n-film.html',
      },
    },
  },
})