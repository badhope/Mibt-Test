import { test } from '@playwright/test';

test('调试 - 完整控制台日志', async ({ page }) => {
  const logs = [];
  
  // 监听所有控制台消息
  page.on('console', msg => {
    const log = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    };
    logs.push(log);
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // 监听页面错误
  page.on('pageerror', error => {
    console.log('❌ 页面错误:', error.message);
    console.log('堆栈:', error.stack);
  });

  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(5000);

  // 检查 App 状态
  const appState = await page.evaluate(() => {
    const app = document.getElementById('app');
    return {
      innerHTML: app?.innerHTML || 'null',
      children: app?.children.length || 0,
      childNodes: app?.childNodes.length || 0
    };
  });
  console.log('\nApp 状态:', appState);

  // 检查是否有全局 App 实例
  const hasApp = await page.evaluate(() => {
    return typeof window.app !== 'undefined';
  });
  console.log('全局 App 实例:', hasApp);

  console.log('\n所有日志:', JSON.stringify(logs, null, 2));
});
