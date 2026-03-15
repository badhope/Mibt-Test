import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 测试文件匹配
    include: ['tests/unit/**/*.test.js'],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'src/main.js', // 入口文件不统计
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // 测试超时
    testTimeout: 10000,
  },
});
