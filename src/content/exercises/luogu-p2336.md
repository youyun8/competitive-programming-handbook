---
id: luogu-p2336
volume: lower
source_file: lower-volume
title: 洛谷 P2336 喵星球上的點名
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 5
topics: [suffix-array, lcp, offline-query, fenwick-tree]
prerequisites: [suffix-array, range-minimum-query, fenwick-tree]
statement: 每隻貓有姓、名兩個整數串；一次點名串若是任一者的子串，該貓答到。輸出每次點名的答到貓數，最後輸出每隻貓答到的次數。
constraints:
  ['1 <= n <= 5*10^4，1 <= m <= 10^5', '姓名總長、點名串總長各 <= 10^5', '姓名中作為字元的整數種類不超過 10^4']
input_format: 第一行 n、m；接著 n 行各給兩個「長度後接整數序列」；再給 m 行點名串。
output_format: 先輸出 m 行各點名答到數；末行輸出 n 隻貓各自答到次數。
samples:
  - input: "2 3\n6 8 25 0 24 14 8 6 18 0 10 20 24 0\n7 14 17 8 7 0 17 0 5 8 25 0 24 0\n4 8 25 0 24\n4 7 0 17 0\n4 17 0 8 25\n"
    output: "2\n1\n0\n1 2"
    explanation: 官方範例分別等價於查 izay、hara、raiz；前兩次各有 2、1 隻貓答到。
core_knowledge: [整數後綴陣列, 查詢串的 SA 區間, 區間不同顏色, 離線二維計數]
judgment: 姓或名任一處出現即答到；同一貓在一次點名中無論出現幾次只計一次。
hints:
  - 將所有姓名與查詢串以互異分隔符串接，查詢串在 SA 上對應一個 LCP 不小於其長度的連續區間。
  - 第一類答案是 SA 區間內不同貓編號數，可按左端排序並用 next occurrence 與 Fenwick tree 離線。
  - 每隻貓答案需把「區間內至少出現一次」轉成 previous occurrence 的二維條件，不能直接累加後綴出現數。
solution_outline: Reviewed roadmap：驗證整數 SA 與 LCP 區間後，分兩次離線掃描；第一次求每個區間不同顏色數，第二次依同色前驅把每個查詢對顏色的首次出現貢獻聚合。
proof_or_invariant: 待補：需正式證明第二次掃描的事件式對每個「查詢、貓」配對恰計一次，並檢查姓、名分隔符不會跨界匹配。
common_errors: [姓與名之間未放唯一分隔符, 同一貓多次匹配被重複計數, 只完成每次點名答案而漏掉每隻貓答案]
complexity: { time: '目標 O((L+m) log L)', space: '目標 O(L log L)' }
external_url: https://www.luogu.com.cn/problem/P2336
external_platform: 洛谷
external_problem_id: P2336
external_title: '[SCOI2012] 喵星球上的點名'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: needs-review
---

Reviewed roadmap。缺口：尚未提交嚴格 C++17 實作；官方範例僅核對 metadata，仍需短整數串暴力對拍、跨姓／名邊界測試與最壞重複字元壓測後才能改為 `verified`。
