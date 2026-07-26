---
id: luogu-p3238
volume: lower
source_file: lower-volume
original_label: 洛谷 P3238
title: 洛谷 P3238 道路堵塞：reviewed roadmap
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 5
topics: [替代路徑, 動態最短路, 線段樹]
prerequisites: [dijkstra, segment-tree]
core_knowledge: [指定最短路刪邊, replacement paths, 有向圖反例]
judgment: 目前不發布解答；官方頁面明示既有解法可能被 hack，必須先完成有向 replacement-paths 正確性與隨機對拍。
statement: 給定正權有向圖及一條指定最短路，依次刪除該路上的每條邊，輸出刪邊後 1 到 n 的最短距離或 -1。
constraints: ['n < 100000', 'm < 200000', '邊權為非負整數', '官方題面附有「題解可能被 hack」警告']
input_format: 第一行 n、m、L；接著 m 條有向邊；最後一行為指定最短路的 L 個邊編號。
output_format: 對指定路徑每條邊輸出一次刪除後的最短距離，不可達輸出 -1。
samples: []
hints:
  - 暴力刪邊重跑 Dijkstra 僅可作小資料 oracle。
  - 候選正式演算法必須處理替代路徑多次離開、重新進入指定最短路的情形。
  - 以 n≤9 的全圖 Dijkstra oracle 對拍隨機有向圖，並加入零權邊、重邊及多條等長最短路。
solution_outline: 'Roadmap：先形式化有向 replacement paths；只接受具完整證明且通過窮舉/隨機 oracle 的 O((n+m)log²n) 或更優實作。'
proof_or_invariant: '發布門檻：證明每個區間更新候選確實覆蓋所有刪邊後最短路；目前常見「單一跨越邊」論證不足，官方警告亦提供反證風險。'
complexity: { time: '目標 O((n+m) log² n)', space: '目標 O(n+m)' }
common_errors: [直接套用無向 replacement-paths 結論, 假設替代路徑只離開指定路徑一次, 未處理零權與等長最短路]
external_url: https://www.luogu.com.cn/problem/P3238
external_platform: 洛谷
external_problem_id: P3238
external_title: '[HNOI2014] 道路堵塞'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## Reviewed roadmap 證據

- 官方題面目前直接標註「本題可能不存在正確解法，題解均已被 hack」。
- 題目是**有向圖** replacement paths；無向圖常用的單次跨越區間更新不能直接移植。
- 驗收需包含小圖逐邊重跑 Dijkstra oracle、隨機對拍，以及零權、重邊、多條等長最短路的固定反例組。
