import { expect, test } from '@playwright/test';

test('home, chapter, lesson, visualizer, and progress work under project base path', async ({
  page
}) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /把演算法/ })).toBeVisible();
  await page.getByRole('link', { name: '從二分搜尋開始' }).click();
  await expect(page.getByRole('heading', { name: '二分搜尋：把單調性變成答案' })).toBeVisible();
  await page.getByRole('button', { name: '下一步' }).click();
  await expect(page.getByText(/步驟 2\//)).toBeVisible();
  await page.getByRole('button', { name: '標記為完成' }).click();
  await expect(page.getByRole('button', { name: /已完成/ })).toBeVisible();
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

test('theme, auth callback mock, dashboard, offline status, profile, and 404', async ({
  page,
  context
}) => {
  await page.goto('./');
  await page.getByRole('button', { name: '切換深淺色主題' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', /dark|light/);
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
