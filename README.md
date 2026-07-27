# 競賽演算法筆記

以繁體中文重新整理上下冊十章與附錄的 Astro 靜態學習網站。公開內容採原創學習筆記模式，不部署掃描頁、OCR 原文、出版社版面或 QR 圖片。

> 目前 repo 尚未設定 GitHub remote 或 Supabase project，因此沒有公開 URL。所有前端、migration、Edge Functions 與測試都可先在本機驗證。

## 預覽

網站提供桌面固定側欄、手機抽屜、深淺色、中文搜尋、教學進度、題庫篩選、原題連結、解題狀態、解答／思路筆記、十二個演算法視覺化、依解題手法分類的策略圖鑑與 Supabase Auth。

![網站總覽預覽](docs/site-preview.svg)

## 系統架構

```mermaid
flowchart LR
  Browser[Astro static frontend<br/>GitHub Pages] -->|publishable key + user JWT| Auth[Supabase Auth]
  Browser -->|progress / notes / bookmarks / settings| Edge[Supabase Edge Functions]
  Edge --> DB[(PostgreSQL + RLS)]
  Browser -. offline .-> IndexedDB[(IndexedDB cache + sync queue)]
```

- GitHub Pages 只承載 `astro build` 的靜態檔案。
- Supabase Auth 處理電子郵件密碼、驗證信、重設密碼與 GitHub OAuth；本站不自行雜湊密碼。
- PostgreSQL 儲存每位使用者自己的進度、題目狀態、解答、思路、設定與書籤，所有資料表均啟用 RLS。
- 題目卡只記錄自我評估狀態與私人筆記；網站不編譯或執行使用者程式。

## 快速開始

需求：Node 24 LTS、pnpm 11、C++17 編譯器。PDF/OCR 流程另需 Python 3、PyMuPDF、Tesseract `chi_sim+eng` 與 Poppler。

```bash
pnpm install
cp .env.example .env
pnpm dev
```

預設 `.env.example` 使用 `PUBLIC_AUTH_MODE=mock`，可在沒有正式 Supabase 憑證時測試登入、進度、筆記、離線 queue 與 UI。

常用檢查：

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:content
pnpm validate:cpp
pnpm validate:secrets
pnpm build
pnpm test:e2e
```

## 網站架構

站台分成「讀、查、練」三條主線，加上帳戶；三者共用同一份練習進度：

```
/                          總覽：三種用法、上下冊地圖、策略主題、推薦起點
├─ 讀 /learn/              學習路線（依先備關係）
│   └─ /volumes/{upper,lower}/ → /chapters/<1-10>/ → /lessons/<section>/
│                               └─ /lessons/topic/<id>/（同一節的其他深度教學）
│      /appendix/          附錄 A：C++ 競賽工程技巧（掛在下冊）
├─ 查 /strategies/         策略圖鑑 → /strategies/<topic>/ → /strategies/<topic>/<page>/
│      /patterns/          跨章解題模式
│      /glossary/          術語表
├─ 練 /practice/           題庫（本站題目卡）→ /practice/<id>/
│      /problem-lists/     題單索引 hub
│        ├─ /problem-lists/textbook/    教材題單（依章節小節）
│        └─ /problem-lists/strategies/  策略題單（依手法、難度、標籤）
└─ 帳戶 /dashboard/、/profile/、/auth/*
```

導覽只有一份真實來源：`src/lib/navigation.ts` 定義側欄分組、header 連結、上下冊章節樹與「目前位置」判斷；`src/components/nav/SiteNav.astro` 依它渲染側欄，`Breadcrumb.astro` 渲染麵包屑。新增頁面時在 `navigation.ts` 補一筆，header、側欄與 `tests/unit/navigation.test.ts` 的路由存在性檢查都會跟著更新。

側欄依所在位置展開：目前那一冊會打開，目前章節就地列出所有小節並標出正在讀的那一節；策略圖鑑的頁面則把主題導覽（`StrategyNav`）掛進「解題策略」分組，同時把教材冊別收起來。路徑看不出位置的路由（`/lessons/topic/<id>/`、`/practice/<id>/`）由頁面用 `activeChapter`／`activeSection` 告訴 layout。

## 內容結構

網站有兩套互補的索引方式，兩者共用同一份練習進度：

- **章節**（`/chapters/`、`/lessons/`）依《演算法競賽》上下冊十章與附錄 A 編排。
- **策略圖鑑**（`/strategies/`）依解題手法分類，適合賽前複習與遇到新題時查手法。

檔案配置：

- `data/toc.json`：十章、各節與附錄 A 的公開課程結構。
- `data/page-map.json`：上下冊獨立頁碼映射與抽查狀態。
- `src/content/lessons/`：原創教學；每篇固定包含問題、訊號、直覺、狀態、不變量、步驟、C++、複雜度、陷阱、比較、練習與速查。
- `src/content/exercises/`：改寫或自行設計的題目、提示、解答、證明、C++ 與已確認的外部原題連結。
- `reports/content-review.md`：所有待人工確認項目。未確認 OCR 不會渲染到公開頁面。

### 策略圖鑑

策略圖鑑原本是獨立的靜態網站專案（`youyun8/competitive-programming`），內容已完整併入本 repo，原專案不再更新。

- `src/content/strategies/<主題>/*.html`：教學內容的唯一來源，維持手寫 HTML 片段的原貌（已列入 `.prettierignore`，避免重排動到內容）。每個主題另有一份 `OUTLINE.md` 記錄大綱。
- `src/lib/strategy-topics.ts`：主題註冊表——哪些片段、以什麼順序、用什麼標題組成一個主題，以及內文錨點（`#s2-1`、`#topic-dp`）對應到哪個頁面。
- `src/lib/strategy-beginner.ts`：各主題的初學者導讀素材與「最小可手算例子」。
- `src/lib/strategies.ts`：渲染管線。片段在建置時內嵌，補上站內連結、KaTeX 數學式與 Shiki 程式碼上色；產生物不寫回內容檔。
- `data/strategy-problems.json`：258 筆策略題單，於 `/problem-lists/strategies/` 呈現。

新增一個策略章節：在 `src/content/strategies/<主題>/` 放入片段檔，並於 `strategy-topics.ts` 對應主題的 `pages` 陣列插入一筆（`id`、`slug`、`title`、`nav`、`desc`、`fragment`）。路由、側欄導覽與上一節／下一節都會自動更新。

題目卡以 `data-problem-id` 標記，進度 id 沿用題庫命名（`lc-455`、`luogu-p1090`），因此同一題在策略章節、策略題單與題庫詳情頁標記任一處都會同步。

## 本機 Supabase

安裝 Docker 與 Supabase CLI 後：

```bash
supabase start
supabase db reset
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f tests/rls/rls.sql
supabase functions serve --env-file supabase/.env.local
```

RLS 測試建立 user A 與 user B，證明 user A 看不到或改不到 user B 的 profile、進度、題目狀態與私人解題筆記。Service-role key 不得放進 `PUBLIC_*`、前端 bundle、log 或 artifact。

## 同步模型

訪客資料存入 IndexedDB 的分表與事件 queue；登入後由 `sync-progress` 做 idempotent merge：

- 完成狀態優先。
- 進度取較高者。
- 題目狀態與解答／思路筆記以 `updated_at` 做衝突檢查。
- 書籤取聯集。
- 設定比較 `updated_at`，遇到雲端較新資料回報 conflict，不靜默覆寫。
- 重複 idempotency key 由 `sync_receipts` 去重。

離線事件在恢復網路後可重送。Dashboard 統計只讀取該使用者自己的資料。

## 題目卡與解題筆記

每張公開題目卡都必須有經確認的原題或相關原題連結，並提供：

- 未開始、練習中、待複習、已解決四種自我管理狀態。
- 「解答（程式碼）」與「思路（Markdown）」兩個筆記面板。
- Markdown 編輯／預覽、C++17／C++20 標籤、分欄清空、全部清空與更新時間。
- IndexedDB 本機保存；登入後由 Supabase 同步。
- 尚未設定狀態但開始寫筆記時，自動標記為待複習。

## 環境變數

前端可公開：

- `PUBLIC_SITE_URL`
- `PUBLIC_BASE_PATH`
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `PUBLIC_API_URL`
- `PUBLIC_AUTH_MODE`

只可放在 GitHub Environment 或後端 secret store：

- `SUPABASE_SERVICE_ROLE_KEY`
- OAuth client secret
- database password／URL

## GitHub Pages 與後端部署

`astro.config.ts` 會在 Actions 依 `GITHUB_REPOSITORY` 設定專案型 Pages `base`。`.github/workflows/deploy.yml` 使用 Astro 官方 action 建置並交給 GitHub Pages deploy action。

完整逐步部署指南請見 [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)。

正式部署前需要使用者確認：

1. GitHub owner、repo 名稱與 private visibility。
2. Supabase project、region、GitHub OAuth callback domain。
3. Pages URL 與可選 custom domain，供 `ALLOWED_ORIGINS` 精確列入 CORS。

Supabase migration／Functions 需獨立部署，不能由 GitHub Pages 代替。Fork PR 不取得正式 secrets；後端部署應使用 protected environment 與人工核準。

## 備份與復原

- PostgreSQL 使用 Supabase 排程備份或 `pg_dump` 的加密私有備份；dump 不進 Git。
- 復原時先套 migration，再還原使用者進度、題目狀態、私人筆記、書籤與設定。
- 使用者刪除流程利用 FK cascade 清除個人資料與儲存物件。
