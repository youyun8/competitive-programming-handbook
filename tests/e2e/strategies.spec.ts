import { expect, test, type Page } from '@playwright/test';

// 900px 以下側欄是收起來的抽屜（transform: translateX(-105%)），連結雖然存在但落在
// 畫面外，直接點會等到 timeout。mobile project 必須先按漢堡鈕，桌機版沒有這顆按鈕。
async function openSidebarOnMobile(page: Page) {
  const menu = page.getByRole('button', { name: '開啟導覽' });
  if (await menu.isVisible()) await menu.click();
}

test('strategy atlas navigates from overview through topic home into a chapter', async ({ page }) => {
  await page.goto('./strategies/');
  await expect(page.getByRole('heading', { name: '策略圖鑑', level: 1 })).toBeVisible();

  // 側欄現在也列得出四個主題，這裡要的是總覽頁正文的主題卡。
  await page
    .locator('main')
    .getByRole('link', { name: /貪心演算法/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: /貪心演算法/, level: 1 })).toBeVisible();
  await expect(page.getByText('從排序貪心到擬陣與模擬費用流的完整策略分類')).toBeVisible();

  await openSidebarOnMobile(page);
  await page.getByRole('link', { name: '2.1 排序貪心' }).first().click();
  await expect(page.getByRole('heading', { name: '2.1 排序貪心（Sort & Sweep）' })).toBeVisible();
  // 側欄要標出目前章節，主題導覽取代預設的教材章節清單。
  await expect(page.locator('.strategy-nav-link[aria-current="page"]')).toHaveText('2.1 排序貪心');
});

test('merged chapter content keeps its maths, C++ blocks, and rewritten cross-links', async ({ page }) => {
  await page.goto('./strategies/greedy/01-sorting/');

  // 數學式由 KaTeX 於建置時排版，不應留下 TeX 分隔符或排版錯誤。
  await expect(page.locator('.strategy-body .katex').first()).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await expect(page.locator('.strategy-body')).not.toContainText('\\(');

  // 程式碼收在題目卡的「程式碼（C++）」摺疊區裡，展開後才看得到。
  const codeBlocks = page.locator('.strategy-body pre.strategy-code');
  expect(await codeBlocks.count()).toBeGreaterThan(0);
  await page.locator('.strategy-body details').filter({ hasText: '程式碼（C++）' }).first().click();
  const openedCode = page.locator('.strategy-body details[open] pre[data-language="cpp"]').first();
  await expect(openedCode).toBeVisible();
  await expect(openedCode).toContainText('sort(');

  // 原本由 build.py 以字串樣板產生的導讀與複習，現在改由 Astro 元件組版。
  const guide = page.locator('.beginner-guide');
  await expect(guide).toContainText('初學者閱讀指南');
  await expect(guide.getByRole('heading', { name: '這頁要解決什麼問題？' })).toBeVisible();
  await expect(guide.locator('.predict-box summary')).toContainText('先猜猜看');
  await expect(guide.locator('.mini-trace li').first()).toBeVisible();

  const recap = page.locator('.beginner-recap');
  await expect(recap.getByRole('heading', { name: '常見誤解與除錯順序' })).toBeVisible();
  await expect(recap.locator('.reference-list a').first()).toHaveAttribute('href', /^https?:\/\//);
});

test('in-content cross references resolve to site routes, including in-page anchors', async ({ page }) => {
  await page.goto('./strategies/greedy/theory/');
  const body = page.locator('.strategy-body');
  // 原本的 #s2-11、#s3、#s4-3 錨點都要改寫成本站路由，不能留下原始寫法。
  await expect(body.locator('a[href$="/strategies/greedy/11-expert/"]')).toHaveCount(1);
  await expect(body.locator('a[href$="/strategies/greedy/pitfalls/"]')).toHaveCount(1);
  await expect(body.locator('a[href$="/strategies/greedy/proofs/#s4-3"]')).toHaveCount(1);
  await expect(body.locator('a[href^="#s"]')).toHaveCount(0);

  // 帶頁內片段的連結要真的跳到該段落。
  await body.locator('a[href$="/strategies/greedy/proofs/#s4-3"]').click();
  await expect(page.locator('#s4-3')).toBeVisible();
});

test('cross-topic and problem-list references leave the topic correctly', async ({ page }) => {
  await page.goto('./strategies/dp/pitfalls/');
  const crossTopic = page.locator('.strategy-body a[href$="/strategies/greedy/"]').first();
  await expect(crossTopic).toBeVisible();
  await crossTopic.click();
  await expect(page.getByRole('heading', { name: /貪心演算法/, level: 1 })).toBeVisible();
});

test('previous and next links walk the topic reading order', async ({ page }) => {
  await page.goto('./strategies/greedy/02-intervals/');
  await page.locator('.strategy-pagenav a.previous').click();
  await expect(page.getByRole('heading', { name: '2.1 排序貪心（Sort & Sweep）' })).toBeVisible();
  await page.locator('.strategy-pagenav a.next').click();
  await expect(page.getByRole('heading', { name: /2.2 區間問題全家桶/ })).toBeVisible();
});

test('topic switcher keeps the reader inside the strategy atlas', async ({ page }) => {
  await page.goto('./strategies/greedy/01-sorting/');
  await openSidebarOnMobile(page);
  await page.locator('.strategy-switcher-link', { hasText: '字串' }).click();
  await expect(page.getByRole('heading', { name: /字串演算法/, level: 1 })).toBeVisible();
  await expect(page.locator('.strategy-switcher-link.active')).toHaveText(/字串/);
});

test('problem card status is shared with the strategy problem list and the practice library', async ({ page }) => {
  await page.goto('./strategies/greedy/01-sorting/');
  const card = page.locator('[data-problem-id="lc-455"]');
  const cardStatus = card.getByLabel('學習狀態');
  await expect(cardStatus).toBeVisible();
  await cardStatus.selectOption('solved');
  await expect(card.locator('.status-chip')).toHaveText('已解決');

  // 重新載入後仍保留（本機優先）。
  await page.reload();
  await expect(page.locator('[data-problem-id="lc-455"]').getByLabel('學習狀態')).toHaveValue('solved');

  // 進度 id 沿用題庫命名，因此策略題單看到的是同一個狀態。
  await page.goto('./problem-lists/strategies/');
  const row = page.locator('.strategy-problem-row', { hasText: 'LC 455 分發餅乾' }).first();
  await row.scrollIntoViewIfNeeded();
  await expect(row.getByLabel('學習狀態')).toHaveValue('solved', { timeout: 30_000 });
});

test('strategy problem list filters by topic, difficulty, tag, and free text', async ({ page }) => {
  await page.goto('./problem-lists/strategies/');
  const rows = page.locator('.strategy-problem-row');
  const visible = page.locator('.strategy-problem-row:visible');
  expect(await rows.count()).toBe(258);

  await page.locator('#strategy-topic').selectOption('strings');
  await expect(visible).toHaveCount(51);

  await page.locator('#strategy-topic').selectOption('');
  await page.locator('#strategy-difficulty').selectOption('5');
  await expect(visible).toHaveCount(36);

  await page.locator('#strategy-difficulty').selectOption('');
  await page.getByRole('searchbox', { name: '搜尋' }).fill('反悔');
  await expect(visible.first()).toBeVisible();
  expect(await visible.count()).toBeLessThan(258);

  await page.getByRole('searchbox', { name: '搜尋' }).fill('絕對不存在的題目');
  await expect(page.getByText('沒有符合條件的題目。')).toBeVisible();
});

test('topic query string preselects the strategy problem list filter', async ({ page }) => {
  await page.goto('./problem-lists/strategies/?topic=ds');
  await expect(page.locator('#strategy-topic')).toHaveValue('ds');
  await expect(page.locator('.strategy-problem-row:visible')).toHaveCount(61);
});

test('strategy pages are reachable from the sidebar and the home page', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: '依解題策略查手法' }).click();
  await expect(page.getByRole('heading', { name: '策略圖鑑', level: 1 })).toBeVisible();

  await page.goto('./chapters/2/');
  await openSidebarOnMobile(page);
  await page.locator('.site-sidebar').getByRole('link', { name: '策略圖鑑' }).click();
  await expect(page.getByRole('heading', { name: '策略圖鑑', level: 1 })).toBeVisible();
});
