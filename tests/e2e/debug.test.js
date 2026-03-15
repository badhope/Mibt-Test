import { test } from '@playwright/test';

test('调试 - 检查页面实际内容', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(3000);

  // 获取页面 HTML
  const html = await page.content();
  console.log('页面 HTML 长度:', html.length);
  console.log('页面 HTML 前 500 字符:\n', html.substring(0, 500));

  // 检查 app 元素
  const appContent = await page.evaluate(() => {
    const app = document.getElementById('app');
    return {
      exists: !!app,
      innerHTML: app?.innerHTML || 'null',
      children: app?.children.length || 0,
      textContent: app?.textContent?.substring(0, 200) || 'null'
    };
  });
  console.log('\nApp 元素状态:', appContent);

  // 检查是否有 JavaScript 错误
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('❌ 控制台错误:', msg.text());
    } else {
      console.log(`📝 控制台 [${msg.type()}]:`, msg.text());
    }
  });

  // 刷新页面并监听
  await page.reload();
  await page.waitForTimeout(3000);

  console.log('\n所有错误:', errors);

  // 截图
  await page.screenshot({ 
    path: 'tests/screenshots/debug-page.png',
    fullPage: true 
  });
});
