---
id: luogu-p5332
volume: lower
source_file: lower-volume
original_label: 洛谷 P5332
title: 洛谷 P5332 精準預測：reviewed roadmap
chapter: 10
section: '10.7'
kind: external-oj
difficulty: 5
topics: [2-SAT, 傳遞閉包, bitset 分塊]
prerequisites: [directed-connectivity, topological-sort]
core_knowledge: [時間狀態壓縮, 蘊含圖 SCC, 分塊可達性]
judgment: 目前不發布程式；未分塊的每點 bitset 傳遞閉包會超出記憶體，必須完成壓縮圖與分塊可達性的證明及壓力測試。
statement: 根據火星人在不同時間的生死預言，對每個人求最終仍可能與其同時存活的人數。
constraints: ['只保留預言涉及時間及終止時間的狀態', '正式解需避免 O((n+m)n) bit 記憶體', '輸出每人的可共存人數']
input_format: 第一行終止時間 T、人數 n、預言數 m；接著 m 行依題面給預言類型、時間與人物。
output_format: 輸出 n 個整數，依序表示每人的答案。
samples:
  - input: |-
      3 3 2
      0 2 1 3
      1 1 2 3
    output: '2 1 1'
    explanation: 官方樣例；兩種預言連同死亡不可逆的時間蘊含限制了最終可共存集合。
hints:
  - 對每人只建立預言提及時間及 T+1 的生死狀態，按時間連死亡不可逆的蘊含。
  - 先縮 SCC；最終生可達最終死表示相應組合不可能。
  - 對「最終死」目標按固定塊大小分批，以拓撲 bitset 傳播統計，避免保存全閉包。
solution_outline: 'Roadmap：建立 O(n+m) 壓縮 2-SAT 圖、縮 SCC 成 DAG，按終點人物分塊計算最終生到最終死的可達性，扣除本身與必死人。'
proof_or_invariant: '發布門檻：證明壓縮時間邊與完整逐時刻模型等價；證明 SCC 後分塊 bitset 只改變儲存方式、不漏任何可達關係。'
complexity: { time: '目標 O((n+m)n/word_size)', space: '目標 O(n+m+(n+m)B/word_size)' }
common_errors: [為每個人建立全部 T 個時刻, 保存完整 n×(n+m) bitset 導致 MLE, 未排除本身必死或另一人必死的組合]
external_url: https://www.luogu.com.cn/problem/P5332
external_platform: 洛谷
external_problem_id: P5332
external_title: '[JSOI2019] 精準預測'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## Reviewed roadmap 證據

- 可信題解一致要求把逐時刻模型壓到至多 `O(n+m)` 個關鍵狀態，再做 SCC。
- 直接為每個 SCC 保存全體人物 bitset 的空間仍可能超限；正式版本需按人物塊重跑 DAG 傳播。
- 驗收需以小規模完整逐時刻 SAT 枚舉作 oracle，並對最大 n、m 執行記憶體壓力測試。
