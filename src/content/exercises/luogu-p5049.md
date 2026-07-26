---
id: luogu-p5049
volume: lower
source_file: lower-volume
original_label: 洛谷 P5049
title: 洛谷 P5049 旅行（加強版）：reviewed roadmap
chapter: 10
section: '10.6'
kind: external-oj
difficulty: 5
topics: [基環樹, 字典序, 貪心 DFS]
prerequisites: [trees]
core_knowledge: [排序鄰接表, 唯一環斷邊, 線性反悔判定]
judgment: 目前不發布程式；P5022 的逐環邊刪除 O(n²) 在本題 n=500000 必定超時，只接受有完整反悔判定證明的 O(n log n) 解。
statement: 從 1 出發走訪樹或基環樹，每條邊至多經過兩次，記錄各點首次到達順序；求字典序最小序列。
constraints: ['n <= 500000', 'm 為 n-1 或 n', '無向連通圖']
input_format: 第一行 n、m；接著 m 行無向邊 u、v。
output_format: 輸出字典序最小的首次到達點序列。
samples: []
hints:
  - 樹的情況只需排序鄰接表後做迭代 DFS。
  - 基環樹只會放棄一條環邊，但不能枚舉每條環邊重跑 DFS。
  - 正式證明需刻畫「繼續走環」與「回溯後下一個未訪分支」的首個不同元素，反悔最多一次。
solution_outline: 'Roadmap：O(n log n) 排序、線性找環；沿字典序 DFS 維護回溯後的最小候選，在可證明首個字典序劣化處斷開環邊，之後退化為普通 DFS。'
proof_or_invariant: '發布門檻：證明局部斷環條件等價於兩個完整 DFS 序列的首個不同位置比較；尤其要覆蓋環入口不為 1、環點含多棵掛樹與環鄰點位於排序中間的情形。'
complexity: { time: '目標 O(n log n)', space: '目標 O(n)' }
common_errors: [沿用 P5022 枚舉環邊的 O(n²) 解, 僅比較兩個環鄰點而忽略回溯分支, 遞迴 DFS 在五十萬點鏈上爆棧]
external_url: https://www.luogu.com.cn/problem/P5049
external_platform: 洛谷
external_problem_id: P5049
external_title: '[NOIP2018 提高組] 旅行（加強版）'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: needs-review
---

## Reviewed roadmap 證據

- 官方加強資料把 `n` 提升到 `500000`，原題常見的「枚舉環邊、每次 DFS」不再可行。
- 可信資料指出正確方向是排序後一次 DFS，僅在環上做至多一次有證明的反悔；局部判定若忽略掛樹分支會產生反例。
- 驗收需以 n≤10 枚舉所有可斷環邊所得 DFS 序列作 oracle，隨機生成樹與基環樹對拍，另測五十萬點鏈避免遞迴爆棧。
