---
id: openjudge-4054
volume: upper
source_file: upper-volume
title: OpenJudge 4054 Cubic Eight-Puzzle：reviewed roadmap（缺初始面向圖）
chapter: 3
section: '3.5'
kind: external-oj
difficulty: 5
topics: [source-recovery, cube-orientation, roadmap]
prerequisites: []
statement: 八個彩色立方體置於 3×3 棋盤並留一空格，每步把相鄰立方體滾入空格，要求頂面形成指定色彩圖案；官方文字與樣例已恢復，但決定各立方體初始各面的關鍵圖片仍缺失。
constraints: [資料組少於 16, 每組目標為 3×3 且恰有一個 E, 只接受 30 步內答案]
input_format: 每組先給初始空格座標 x、y，再給三行目標頂面 B/W/R/E；`0 0` 結束。
output_format: 三十步內可達輸出最少步數，否則輸出 -1。
samples: []
core_knowledge: [立方體面向模型, 圖片來源恢復, 樣例回歸]
judgment: 不發布搜尋程式；缺少初始立方體面向定義時，任何旋轉轉移都可能與原題不同。
hints:
  - 下載官方頁面引用的原始圖片 URL，並查找 Wayback 與同場 ICPC problem set PDF。
  - 恢復後把每顆立方體表示為頂面、前面、右面的顏色，明確推導四向滾動。
  - 以官方八組樣例 `0,3,13,23,29,30,-1,-1` 作第一層回歸，再設逆向滾動性質測試。
solution_outline: Roadmap：先恢復並人工確認初始面向圖；再建立可逆的立方體旋轉狀態、搜尋三十步內最短路，且以完整官方樣例驗證。現階段不得猜圖。
proof_or_invariant: 發布門檻要求圖片中的每個初始可見面都能轉成明確狀態，四向滾動互為逆操作，並完整重現八組官方輸出。
complexity: { time: 待恢復圖片後分析, space: 待恢復圖片後分析 }
common_errors: [假設所有立方體面向相同, 只記頂面而遺失側面, 把洛谷 P4054 計數問題錯當本題]
external_url: http://bailian.openjudge.cn/practice/4054/
external_platform: OpenJudge 百練
external_problem_id: '4054'
external_title: Cubic Eight-Puzzle
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: needs-review
---

## Reviewed roadmap 證據

- 官方頁面可核對題名、輸入輸出、30 步限制及八組輸出，但立方體初始各面配置由圖片承載。
- 沒有該圖便無法唯一決定滾動後頂面，因此不能從文字或樣例猜測轉移。
- 解除阻擋需保存原圖或正式競賽 PDF，人工轉錄面向，並讓完整官方樣例全部通過。
