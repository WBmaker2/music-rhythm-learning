import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/music-rhythm-learning/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
