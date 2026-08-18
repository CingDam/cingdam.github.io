import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // cingdam.github.io 는 유저 페이지라 base 가 루트다.
  // 프로젝트 페이지로 옮기면 '/<repo>/' 로 바꿔야 한다.
  base: '/',
  build: {
    outDir: 'dist',
  },
});
