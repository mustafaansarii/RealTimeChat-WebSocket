import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'window', // Define global as window in the browser environment
  },
  plugins: [tailwindcss(), react()],
})
