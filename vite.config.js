import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 基础路径（GitHub Pages 需要相对路径）
  base: './',
  
  // 源代码目录
  root: './src',
  
  // 静态资源目录
  publicDir: '../public',
  
  build: {
    // 输出目录
    outDir: '../dist',
    assetsDir: 'assets',
    
    // 代码分割配置
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
      output: {
        // 资源文件命名
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除 console
        drop_debugger: true,
      },
    },
    
    // Source Map（生产环境关闭）
    sourcemap: false,
    
    // 资源大小警告阈值
    chunkSizeWarningLimit: 500,
    
    // 压缩后大小限制
    assetsInlineLimit: 4096, // 4KB 以下的资源内联
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  
  // 预览服务器
  preview: {
    port: 4173,
    open: true,
  },
  
  // 依赖预构建优化
  optimizeDeps: {
    include: [],
    exclude: ['@playwright/test'],
  },
  
  // CSS 配置
  css: {
    devSourcemap: true,
  },
});
