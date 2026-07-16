# 執行計畫

## 盤點與安全邊界

- [x] 檢查 repo、Git 狀態、remote 與既有檔案
- [x] 找到並識別上下冊 PDF，記錄 checksum 與頁數
- [x] 檢查 Node、OCR、PDF、C++、Docker、Supabase 等工具
- [x] 建立 `AGENTS.md` 與 `.gitignore`
- [x] 建立內容授權、來源與未確認 OCR 的公開邊界

## PDF 與內容擷取

- [x] 建立 `data/toc.json`
- [x] 建立分冊 `data/page-map.json`，抽查每章起訖頁
- [x] 建立可續跑的 `data/extraction-manifest.json`
- [x] 建立分頁渲染、OCR、QR 解碼與候選例題擷取腳本
- [x] 掃描所有頁面中的例題、練習與外部 OJ 候選
- [x] 建立 `reports/content-review.md` 與統計報告
- [ ] 驗證所有公開文字、公式、程式碼與 URL

## 資料模型與內容

- [x] 建立 lesson、exercise、glossary、learning-path 嚴格 schema
- [x] 為十章、所有小節與附錄 A 建立可追溯內容節點
- [x] 完成至少一條教學 → 練習 → 提示 → 解答 → 進度流程
- [x] 撰寫核心原創繁體中文 lessons 與 exercises
- [x] 將附錄 Python 主題重寫為可編譯的 C++17/C++20 教學
- [x] 建立術語、跨章模式與先備關係

## UI 與靜態網站

- [x] 建立 Astro 靜態輸出、GitHub Pages base 與設計系統
- [x] 完成首頁、分冊、路線、章節、lesson、題庫、題目、patterns、glossary、來源頁
- [x] 完成桌面／行動導覽、麵包屑、前後篇
- [x] 完成主題、字體、正文寬度、程式碼字體與 reduced-motion
- [x] 完成中文全文搜尋、篩選、書籤、完成狀態與 IndexedDB
- [x] 完成 12 個可操作、可及且有測試的演算法視覺化

## Auth、資料與同步

- [x] 完成電子郵件註冊／登入／驗證／忘記與重設密碼
- [x] 完成 GitHub OAuth callback、返回原頁、refresh、登出與跨分頁同步
- [x] 建立 PostgreSQL migrations、完整限制、UTC 時間與索引
- [x] 為公開 schema 啟用 RLS，隔離各使用者的進度與解題筆記
- [x] 完成訪客 IndexedDB queue、首次登入合併、衝突偵測與離線重送
- [x] 完成同步狀態 UI、匯出資料與刪除帳號
- [x] 完成 user A、user B 與 backend role 的本機資料庫權限測試

## 題目卡、進度與解題筆記

- [x] 每張公開題目卡連至已確認的原題或相關原題
- [x] 提供未開始、練習中、待複習、已解決四種狀態
- [x] 提供解答程式碼與 Markdown 思路的 modal 編輯／預覽
- [x] 解題筆記先存 IndexedDB，登入後與進度同步
- [x] 未設定狀態但開始寫筆記時，自動標記為待複習
- [x] 以 RLS 隔離不同使用者的解題筆記

## 驗證、CI 與部署

- [x] 完成 Vitest、Playwright、內容、C++、RLS、整合與安全測試
- [x] 驗證內部連結、錨點、alt、重複 ID、孤立內容與來源頁碼
- [x] 驗證 GitHub Pages 專案子路徑、404、搜尋與 auth callback mock
- [x] 建立最小權限 `deploy.yml` 與 `backend-checks.yml`
- [x] 完成 README、架構、安全、備份、內容新增與部署文件
- [x] 執行 format、lint、typecheck、test、build、E2E 與 Lighthouse
- [ ] 等使用者確認後再建立 remote、commit、push 或 provision 外部服務
