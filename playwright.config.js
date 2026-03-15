import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 测试文件位置
  testDir: './tests/e2e',
  
  // 超时配置
  timeout: 30 * 1000,
  
  // 并行执行
  workers: 2,
  
  // 重试次数
  retries: 2,
  
  // 浏览器配置
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
      },
    },
    // 移动端测试
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
      },
    },
  ],
  
  // 服务器配置（本地测试）
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
});
