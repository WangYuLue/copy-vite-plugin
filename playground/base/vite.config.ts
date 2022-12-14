import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copy } from 'copy-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      pattern: [
        // copy dir
        { from: 'src/images', to: 'images' },
        // copy file
        { from: 'src/constants/info.json', to: 'info.json' }
      ]
    })
  ]
})
