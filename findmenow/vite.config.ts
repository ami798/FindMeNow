import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // if you use React plugin
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
