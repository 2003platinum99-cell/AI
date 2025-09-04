import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Replace 'somali-programmer-ai-bot' with the name of your GitHub repository.
const repositoryName = 'somali-programmer-ai-bot';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${repositoryName}/`,
})
