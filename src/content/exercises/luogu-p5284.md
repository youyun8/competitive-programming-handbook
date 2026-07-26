---
id: luogu-p5284
volume: lower
source_file: lower-volume
title: 洛谷 P5284 字符串問題
chapter: 9
section: '9.8'
kind: external-oj
difficulty: 5
topics: [suffix-array, prefix-interval, graph, topological-sort]
prerequisites: [suffix-array, persistent-segment-tree, longest-path-dag]
statement: 從 A 類子串串接目標串；相鄰 A_i、A_j 合法須存在 A_i 支配的 B 串且該 B 串是 A_j 前綴。求最大總長；可無限延伸輸出 -1。
constraints:
  ['T <= 100', '1 <= |S| <= 2*10^5', '0 <= n_a,n_b,m <= 2*10^5', '同測試點多組資料的各項總量另受題面十倍上限']
input_format: 每組依序給 S、A 區間列表、B 區間列表及 m 組 A 到 B 支配關係。
output_format: 每組輸出最大長度；存在可達循環則輸出 -1。
samples:
  - input: "3\nabaaaba\n2\n4 7\n1 3\n1\n3 4\n1\n2 1\nabaaaba\n2\n4 7\n1 3\n1\n7 7\n1\n2 1\nabbaabbaab\n4\n1 5\n4 7\n6 9\n8 10\n3\n1 6\n10 10\n4 6\n5\n1 2\n1 3\n2 1\n3 3\n4 1\n"
    output: "7\n-1\n13"
    explanation: 官方範例；第二組存在可重複轉移的循環，第三組最長目標串長 13。
core_knowledge: [B 前綴對應 SA 區間, 壓縮區間連邊, DAG 最長路]
judgment: k 可為 0；相同內容的 A/B 仍按編號參與支配關係；只有能產生任意長目標串時輸出 -1。
hints:
  - 每個 B 串能作哪些 A 串前綴，可由 SA 上 LCP 區間描述。
  - 不可對區間內每個 A 暴力連邊；需以可持久化線段樹或等價圖節點把區間邊壓成 O(log n)。
  - A 點權為自身長度、輔助/B 點權為零；拓撲失敗表示循環，否則做帶點權最長路。
solution_outline: Reviewed roadmap：建 SA/LCP，將 A 依長度與排名放入持久化區間結構；每個 B 連到所有以它為前綴的 A，再加入支配邊，最後拓撲判環並求最長路。
proof_or_invariant: 待補：需形式化壓縮圖中每條路與合法 A 串接的一一對應，尤其 |B|>|A|、相同子串節點及 k=0 情況。
common_errors: [直接建立二次數量的前綴邊, 多測資料未完全清空, 只找任意循環而未確認圖路徑語義, A 長度點權重複加入]
complexity: { time: '目標 O((|S|+n_a+n_b+m) log |S|)', space: '同階' }
external_url: https://www.luogu.com.cn/problem/P5284
external_platform: 洛谷
external_problem_id: P5284
external_title: '[十二省聯考 2019] 字符串問題'
external_relation: original
source_book_pages: [596, 599]
source_pdf_pages: [226, 229]
review_status: needs-review
---

Reviewed roadmap。缺口：尚未完成壓縮圖 C++17 實作；需用小型 A/B 集合顯式建圖對拍、循環可達性測試，以及多測清空與 2×10^5 規模壓測。
