---
id: luogu-p5576
volume: lower
source_file: lower-volume
title: 洛谷 P5576 口頭禪
chapter: 9
section: '9.7'
kind: external-oj
difficulty: 5
topics: [generalized-suffix-automaton, offline-query, segment-tree-merge]
prerequisites: [suffix-automaton, segment-tree-merge]
statement: 給 n 個依時間排列的 01 串；每問 [l,r] 中所有字串的最長公共連續子串長度。
constraints: ['n <= 2*10^4', 'm <= 10^5', '所有字串總長 <= 4*10^5', '1 <= l < r <= n', '最終子任務空間限制 128 MB']
input_format: 第一行 n、m；接著 n 行 01 串；再給 m 行 l、r。
output_format: 每問輸出一行最長公共子串長度。
samples:
  - input: "3 3\n10111\n1111010111\n010111111101\n1 3\n1 2\n2 3\n"
    output: "5\n5\n6"
    explanation: 官方範例；每個答案要求區間內每一條語錄都含有該連續片段。
core_knowledge: [廣義 SAM, 狀態出現字串集合, 連續顏色區間, 離線區間詢問]
judgment: 求連續子串而非子序列；同一片段可在各字串不同位置出現；詢問至少包含兩串。
hints:
  - 廣義 SAM 狀態的 endpos 顏色集合指出該狀態代表的子串出現在哪些語錄。
  - 問題變成找最大 len[v]，使狀態 v 的顏色集合完整覆蓋 [l,r] 的每個編號。
  - 可在 parent 樹合併顏色線段樹並維護連續段，再離線回答；128 MB 限制要求壓縮節點與避免高常數容器。
solution_outline: Reviewed roadmap：建立二進位廣義 SAM；為各狀態聚合出現語錄，於 suffix-link 樹上合併線段樹並提取完整連續顏色區間，將詢問按區間端點離線匹配最大狀態長度。
proof_or_invariant: 待補：需證明線段樹合併時產生的每個最大連續顏色段被唯一枚舉，且所有覆蓋 [l,r] 的狀態都能更新詢問。
common_errors: [只統計出現語錄數而忽略編號必須連續覆蓋, 每串建 SAM 時未重設 last, 線段樹節點超過 128 MB, 把子序列當子串]
complexity: { time: '目標 O((總長+m) log n)', space: '目標 O(總長 log n)，且須低於 128 MB' }
external_url: https://www.luogu.com.cn/problem/P5576
external_platform: 洛谷
external_problem_id: P5576
external_title: '[CmdOI2019] 口頭禪'
external_relation: original
source_book_pages: [587, 595]
source_pdf_pages: [217, 225]
review_status: needs-review
---

Reviewed roadmap。缺口：尚無符合 128 MB 的可信實作；需與逐枚舉子串的小資料程式對拍，並完成全相同長串、稀疏出現及最大節點數記憶體量測。
