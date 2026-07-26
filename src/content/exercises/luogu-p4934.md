---
id: luogu-p4934
volume: lower
source_file: lower-volume
original_label: 洛谷 P4934
title: 禮物（待解除來源封鎖）
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 4
topics: [bitmask, partial-order, roadmap]
prerequisites: [bitwise-and, directed-acyclic-graph]
statement: >-
  已由洛谷題目索引與可信競賽筆記交叉確認：輸入含 n 個非負整數，需要把它們分組，使同組
  任兩數不滿足 a_i & a_j = min(a_i,a_j)，並最小化組數且輸出一組方案。完整措辭、重複值
  的判定方式及方案格式尚未能從官方頁核實，因此本卡暫不發布可提交解法。
constraints:
  - 已確認 n <= 1000000
  - 已確認 0 <= a_i <= 2^20
  - 尚待官方原文確認 2^20 端點是否含等號，以及重複值在方案中的輸出要求
input_format: 尚未可靠核實；可信筆記只確認存在 n 與序列 a_1...a_n，未確認分行方式。
output_format: 尚未可靠核實；只確認需輸出最小組數與一組分組方案，方案的精確編碼未知。
samples: []
core_knowledge:
  - 已確認衝突關係等價於二進位一位集合的包含關係
  - 可信競賽筆記指出可在 2^20 個遮罩的包含 DAG 上處理最長鏈
  - 虛擬遮罩只傳遞狀態，輸入實際出現的值才對鏈長有貢獻
judgment: >-
  本卡是 reviewed roadmap，不可視為可提交題解；在官方輸入輸出與範例取得前，不產生
  cpp_skeleton、cpp_solution，也不把推測格式標成 verified。
hints:
  - 來源解除第一步：取得洛谷 P4934 官方 Markdown 或可驗證的賽事鏡像全文。
  - 來源解除第二步：以至少兩個官方範例確認輸出分組的索引基準、分隔方式及重複值語意。
  - 來源解除第三步：完成獨立實作後，以小 k 的全部集合劃分暴力驗證最少組數與方案合法性。
solution_outline: >-
  暫不提供解法。解除門檻為：核實完整題意、輸入格式、輸出格式、至少一個官方範例與所有
  邊界限制；之後才能依已確認的包含偏序方向獨立推導並撰寫演算法。
proof_or_invariant: >-
  尚無可發布證明。可信筆記中的 Dilworth／最長鏈方向僅作後續研究線索；在確認題目要求的
  分組方案格式及重複元素語意前，不宣稱其為本題完整不變量。
common_errors:
  - 依題名猜測成其他同名「禮物」題
  - 把搜尋摘要當成官方輸入輸出格式
  - 在不清楚重複值語意時直接把相同遮罩合併
  - 只輸出最少組數而忽略題目已確認要求一組方案
complexity:
  time: 待解除來源封鎖後核實；可信筆記候選為 O(20*2^20)
  space: 待解除來源封鎖後核實；可信筆記候選為 O(2^20+n)
external_url: https://www.luogu.com.cn/problem/P4934
external_platform: Luogu
external_problem_id: P4934
external_title: 禮物
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

## 來源狀態

- 洛谷題目 URL、題號與標題可確認，但官方頁在目前環境只回傳載入殼或 Cloudflare 驗證頁。
- 題單 metadata 確認此題第一次出現於 10.2，外部鍵為 `Luogu + P4934`。
- 可讀的競賽筆記確認題意摘要、`n <= 10^6`、`a_i <= 2^20` 與候選演算法量級，但沒有完整輸入輸出及範例。

## 解除門檻

取得官方 Markdown 或具有可追溯賽事來源的全文，補齊格式、範例、限制後，才能將狀態改為
`verified` 並加入經嚴格編譯、範例執行及小資料暴力對拍的 C++17 程式。
