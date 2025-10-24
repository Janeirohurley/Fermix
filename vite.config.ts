import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "./", // chemins relatifs pour Electron
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  css: {
    postcss: './postcss.config.js',
  },
})
