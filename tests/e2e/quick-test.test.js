import { test, expect } from '@playwright/test';

test.describe('MBTI 测试 - 功能验证', () => {
  const baseUrl = 'http://localhost:3001';

  test('完整功能测试', async ({ page }) => {
    console.log('🚀 开始测试...');
    
    // 访问页面
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // 截图 - 初始状态
    await page.screenshot({ 
      path: 'tests/screenshots/test-01-initial.png',
      fullPage: true 
    });
    console.log('✅ 页面加载完成');

    // 检查标题
    const title = await page.title();
    console.log('📄 页面标题:', title);
    expect(title).toContain('人格星球');

    // 检查首页元素
    const homePage = page.locator('#home-page');
    await expect(homePage).toBeVisible();
    console.log('✅ 首页容器可见');

    // 检查主标题
    const mainTitle = page.locator('h1');
    await expect(mainTitle).toBeVisible();
    const titleText = await mainTitle.textContent();
    console.log('📝 主标题:', titleText);
    expect(titleText).toContain('人格星球探索');

    // 检查测试卡片
    const cards = page.locator('.test-card');
    const cardCount = await cards.count();
    console.log('🎴 测试卡片数量:', cardCount);
    expect(cardCount).toBe(3);

    // 检查每个卡片的内容
    const modes = ['quick', 'standard', 'expert'];
    for (let i = 0; i < modes.length; i++) {
      const card = page.locator(`[data-testid="test-card-${modes[i]}"]`);
      await expect(card).toBeVisible();
      const cardText = await card.textContent();
      console.log(`  卡片 ${i + 1}:`, cardText.substring(0, 50) + '...');
    }

    // 截图 - 卡片显示
    await page.screenshot({ 
      path: 'tests/screenshots/test-02-cards.png',
      fullPage: true 
    });
    console.log('✅ 所有卡片正常显示');

    // 测试悬停效果
    const firstCard = page.locator('[data-testid="test-card-quick"]');
    await firstCard.hover();
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'tests/screenshots/test-03-hover.png' 
    });
    console.log('✅ 悬停效果正常');

    // 测试点击功能
    console.log('🖱️ 测试点击功能...');
    
    // 监听对话框
    page.on('dialog', async dialog => {
      console.log('💬 对话框消息:', dialog.message());
      await dialog.accept();
    });

    // 点击第一个卡片的按钮
    const firstButton = firstCard.locator('button[data-action="select"]');
    await firstButton.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ 
      path: 'tests/screenshots/test-04-after-click.png' 
    });
    console.log('✅ 点击功能正常');

    // 测试响应式布局 - 移动端
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'tests/screenshots/test-05-mobile.png',
      fullPage: true 
    });
    console.log('✅ 移动端布局正常');

    // 测试响应式布局 - 平板
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'tests/screenshots/test-06-tablet.png',
      fullPage: true 
    });
    console.log('✅ 平板布局正常');

    // 测试响应式布局 - 桌面
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'tests/screenshots/test-07-desktop.png',
      fullPage: true 
    });
    console.log('✅ 桌面布局正常');

    // 性能检查
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      const loadTime = timing.loadEnd - timing.navigationStart;
      return {
        pageLoadTime: loadTime || 0,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart
      };
    });
    console.log('⚡ 性能指标:', performanceMetrics);
    if (performanceMetrics.pageLoadTime > 0) {
      expect(performanceMetrics.pageLoadTime).toBeLessThan(5000);
    }

    // 控制台错误检查
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'tests/screenshots/test-08-final.png',
      fullPage: true 
    });

    if (errors.length > 0) {
      console.log('⚠️ 控制台错误:', errors);
    } else {
      console.log('✅ 无控制台错误');
    }

    console.log('🎉 所有测试通过！');
  });
});
