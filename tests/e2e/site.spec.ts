import { expect, test, type Page } from '@playwright/test';

// 900px 以下側欄是收起來的抽屜，連結雖然存在但落在畫面外，要先按漢堡鈕。
async function openSidebarOnMobile(page: Page) {
  const menu = page.getByRole('button', { name: '開啟導覽' });
  if (await menu.isVisible()) await menu.click();
}

test('home, chapter, lesson, visualizer, and progress work under project base path', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /《演算法競賽》上下冊學習筆記/ })).toBeVisible();
  await page.getByRole('link', { name: '從二分搜尋開始讀' }).click();
  await expect(page.getByRole('heading', { name: '二分搜尋：把單調性變成答案' })).toBeVisible();
  await page.getByRole('button', { name: '下一步' }).click();
  await expect(page.getByText(/步驟 2\//)).toBeVisible();
  await page.getByRole('button', { name: '標記為完成' }).click();
  await expect(page.getByRole('button', { name: /已完成/ })).toBeVisible();
});

test('every curriculum section has a published guide instead of an expansion placeholder', async ({ page }) => {
  await page.goto('./chapters/1/');
  await expect(page.getByText('內容擴充中')).toHaveCount(0);
  await page.getByRole('link', { name: '鏈結串列', exact: true }).click();
  await expect(page.getByRole('heading', { name: '鏈結串列：用指標串起連續邏輯' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '不變量或正確性證明' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'C++17 模板' })).toBeVisible();
});

test('the sidebar exposes the whole site hierarchy and marks where the reader is', async ({ page }) => {
  await page.goto('./chapters/2/');
  await openSidebarOnMobile(page);
  const sidebar = page.locator('.site-sidebar');

  // 目前章節標成 page，並就地展開這一章的小節。
  await expect(sidebar.locator('.sidebar-link[aria-current="page"]')).toHaveText('2. 基本演算法');
  const binarySearch = sidebar.locator('.sidebar-sublink', { hasText: '二分法' });
  await expect(binarySearch).toBeVisible();
  // 上冊展開、下冊收起；下冊的章節要展開 details 才看得到。
  await expect(sidebar.getByRole('link', { name: '10. 圖論' })).toBeHidden();
  await sidebar.locator('.nav-volume-summary', { hasText: '下冊' }).click();
  await expect(sidebar.getByRole('link', { name: '10. 圖論' })).toBeVisible();

  // 每一條主線在側欄都有入口，行動版也一樣（header 的桌機連結會被藏起來）。
  for (const name of ['學習路線', '策略圖鑑', '跨章解題模式', '題庫', '題單索引', '教材題單', '策略題單', '術語表']) {
    await expect(sidebar.getByRole('link', { name, exact: true })).toBeVisible();
  }

  // 進到小節後，章節仍在路徑上，目前位置換成小節本身。
  await binarySearch.click();
  await openSidebarOnMobile(page);
  await expect(page.locator('.site-sidebar .sidebar-link[aria-current="page"]')).toContainText('二分法');
  await expect(page.locator('.site-sidebar .sidebar-link[data-state="trail"]')).toHaveText('2. 基本演算法');
  await expect(page.locator('.breadcrumb')).toContainText('第 2 章 基本演算法');
});

test('the problem list hub routes to the textbook list, the strategy list, and the practice library', async ({
  page
}) => {
  await page.goto('./problem-lists/');
  await expect(page.getByRole('heading', { name: '題單索引', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: '開啟教材題單 →' }).click();
  await expect(page.getByRole('heading', { name: '教材題單', level: 1 })).toBeVisible();
  await page.locator('.breadcrumb').getByRole('link', { name: '題單索引' }).click();
  await page.getByRole('link', { name: '開啟策略題單 →' }).click();
  await expect(page.getByRole('heading', { name: '策略題單', level: 1 })).toBeVisible();
});

test('practice cards, external links, hints, solution, and progress status', async ({ page }) => {
  await page.goto('./practice/');
  await page.getByRole('searchbox', { name: '搜尋' }).fill('第一個');
  const card = page.locator('.exercise-card').filter({ hasText: '第一個不小於查詢值的位置' });
  await card.getByLabel('學習狀態').selectOption('in-progress');
  await expect(card.locator('.status-chip')).toHaveText('練習中');
  await expect(card.getByRole('link', { name: /洛谷 P2249/ })).toHaveAttribute(
    'href',
    'https://www.luogu.com.cn/problem/P2249'
  );
  await page.getByRole('link', { name: '第一個不小於查詢值的位置' }).click();
  await page.getByLabel('學習狀態').selectOption('needs-review');
  await expect(page.locator('.status-chip')).toHaveText('待複習');
  await page.getByRole('button', { name: '記錄解答與思路' }).click();
  await page.getByLabel('解答程式碼').fill('#include <iostream>\\nint main() { return 0; }');
  await page.getByRole('tab', { name: '思路（Markdown）' }).click();
  await page.getByLabel('解題思路').fill('使用 **半開區間**，維持答案仍在 `[left, right)`。');
  await page.getByRole('button', { name: '預覽' }).click();
  await expect(page.getByText('使用 半開區間，維持答案仍在')).toBeVisible();
  await page.getByRole('button', { name: '儲存記錄' }).click();
  await expect(page.getByText('已儲存')).toBeVisible();
  await page.locator('.notes-footer').getByRole('button', { name: '關閉' }).click();
  await expect(page.getByRole('button', { name: '查看解答與思路' })).toBeVisible();
  await page.getByText('提示 1').click();
  await expect(page.getByText(/答案定義/)).toBeVisible();
  await page.getByText(/解答與證明/).click();
  await expect(page.getByRole('heading', { name: '解法概要' })).toBeVisible();

  await page.goto('./practice/modular-power/');
  await page.getByRole('button', { name: '記錄解答與思路' }).click();
  await page.getByRole('tab', { name: '思路（Markdown）' }).click();
  await page.getByLabel('解題思路').fill('下次複習負數取模與乘法溢位。');
  await page.getByRole('button', { name: '儲存記錄' }).click();
  await page.locator('.notes-footer').getByRole('button', { name: '關閉' }).click();
  await expect(page.getByLabel('學習狀態')).toHaveValue('needs-review');
});

test('reading settings, auth callback mock, dashboard, offline status, profile, and 404', async ({ page, context }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '開啟閱讀設定' }).click();
  await page.getByRole('button', { name: '深色', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: '全螢幕' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-reading-width', 'full');
  const wrap_lines = page.getByLabel('程式碼長行換行');
  await expect(wrap_lines).toBeChecked();
  await wrap_lines.uncheck();
  await expect(page.locator('html')).toHaveAttribute('data-wrap-lines', 'false');
  await wrap_lines.check();
  await expect(page.locator('html')).toHaveAttribute('data-wrap-lines', 'true');
  await page.getByLabel(/正文字級/).fill('20');
  await page.getByRole('button', { name: '關閉閱讀設定' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-reading-width', 'full');
  await context.setOffline(true);
  await expect(page.getByText('離線：等待同步')).toBeVisible();
  await context.setOffline(false);
  await page.goto('./auth/callback/?next=/competitive-programming-handbook/dashboard/');
  await expect(page.getByRole('heading', { name: '你的學習摘要' })).toBeVisible();
  await page.goto('./dashboard/');
  await expect(page.getByRole('heading', { name: '你的學習摘要' })).toBeVisible();
  await page.goto('./profile/');
  await expect(page.getByRole('heading', { name: '個人資料、偏好與資料權利' })).toBeVisible();
  await page.goto('./does-not-exist/');
  await expect(page.getByRole('heading', { name: '這個頁面不存在' })).toBeVisible();
});
