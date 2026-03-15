import { test, expect } from '@playwright/test';

test.describe('冒烟测试', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  test('首页加载正常', async ({ page }) => {
    await page.goto(baseUrl);
    
    // 检查标题
    await expect(page).toHaveTitle(/人格星球/);
    
    // 检查首页元素
    await expect(page.locator('#home-page')).toBeVisible();
    await expect(page.locator('h1')).toContainText('人格星球探索');
  });
  
  test('显示三种测试模式', async ({ page }) => {
    await page.goto(baseUrl);
    
    // 检查三种模式卡片
    await expect(page.locator('[data-testid="test-card-quick"]')).toBeVisible();
    await expect(page.locator('[data-testid="test-card-standard"]')).toBeVisible();
    await expect(page.locator('[data-testid="test-card-expert"]')).toBeVisible();
  });
  
  test('点击测试卡片触发选择', async ({ page }) => {
    await page.goto(baseUrl);
    
    // 点击闪电模式卡片
    await page.click('[data-testid="test-card-quick"]');
    
    // 检查是否触发 alert（Playwright 会处理）
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('闪电模式');
      await dialog.accept();
    });
  });
  
  test('响应式布局测试', async ({ page }) => {
    // 移动端视图
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseUrl);
    
    // 检查移动端布局
    const cards = await page.locator('.test-card').count();
    expect(cards).toBe(3);
    
    // 检查卡片是否全宽
    const cardWidth = await page.locator('.test-card').first().boundingBox();
    expect(cardWidth.width).toBeGreaterThan(300); // 接近屏幕宽度
  });
  
  test('桌面端布局测试', async ({ page }) => {
    // 桌面端视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(baseUrl);
    
    // 检查桌面端布局
    const cards = await page.locator('.test-card').count();
    expect(cards).toBe(3);
  });
});
