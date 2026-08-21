import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PENTING: ganti '/REPO_NAME/' sesuai nama repository GitHub kamu.
// Jika deploy ke <username>.github.io (root domain), gunakan base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/REPO_NAME/',
})
