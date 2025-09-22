import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nasdaq100-stock-price-by-yahoo-finance/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})