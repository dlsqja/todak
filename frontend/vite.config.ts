import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(),
    tailwindcss(), // tsconfig.json의 경로 설정을 Vite에서 사용할 수 있도록 해줌
  ],
  
})
