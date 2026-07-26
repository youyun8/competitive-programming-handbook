---
id: luogu-p5599
volume: lower
source_file: lower-volume
title: 洛谷 P5599 文本編輯器
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 5
topics: [aho-corasick, dynamic-string, range-assign, block-decomposition]
prerequisites: [aho-corasick, lazy-segment-tree]
statement: 維護固定長度文件。查找操作詢問子區間內所有字典詞出現次數總和；替換操作把 [l,r] 改成給定字串循環重複的結果。
constraints:
  [
    'n,m,q <= 10^5',
    '所有字典詞總長 <= 10^5',
    '字元集為大小寫英文字母與數字，共 62 種',
    '輸入使用 CRLF 行尾，讀取時不可把 carriage return 當字元'
  ]
input_format: 第一行 n、m、q；第二行初始文件；接著 m 個字典詞；最後 q 個操作：1 l r 或 2 l r t。
output_format: 每個查找操作輸出一行總出現次數。
samples:
  - input: "6 2 5\nBBABBA\nBB\nBAB\n1 1 6\n2 3 5 A\n1 2 3\n2 1 6 B\n1 1 5\n"
    output: "3\n0\n4"
    explanation: 官方範例；字典詞的重疊出現也各自計數，替換字串不足區間長時循環使用。
core_knowledge: [AC 匹配總權重, 動態區間覆寫, 邊界跨塊匹配, 短模式性質]
judgment: 每個字典詞與每個出現位置都要計；出現可重疊；查詢只計完全落在 [l,r] 的匹配。
hints:
  - AC 自動機可把整段文字的字典匹配總數化為逐字狀態貢獻，但區間左右邊界會截斷跨界模式。
  - 字典詞總長小於文件與操作規模；需利用最大有效模式長度，只重算修改附近邊界或採分塊摘要。
  - 週期覆寫應保存 lazy 的模式與相位；合併摘要時必須扣除越過查詢邊界的匹配。
solution_outline: Reviewed roadmap：先確認官方滿分做法的區間摘要；候選為 AC 狀態轉換/匹配權重的分塊或線段樹 monoid，範圍循環賦值以模式相位 lazy 表示，查詢合併並修正邊界。
proof_or_invariant: 待補：目前尚未證明候選摘要大小能在 62 字元與總詞長 10^5 下維持可接受複雜度，也未核實替換字串長度上限。
common_errors: [把 CR 字元讀入文件, 漏算重疊匹配, 查詢誤算跨出 l/r 的單詞, 循環覆寫相位從零而非區間左端重啟]
complexity: { time: '待核實官方滿分界；不可宣稱', space: '待核實' }
external_url: https://www.luogu.com.cn/problem/P5599
external_platform: 洛谷
external_problem_id: P5599
external_title: 【XR-4】文本編輯器
external_relation: original
source_book_pages: [579, 586]
source_pdf_pages: [209, 216]
review_status: needs-review
---

Reviewed roadmap。缺口：官方頁面公式在目前擷取結果中缺字，替換字串長度等細項仍須從原題 PDF/可讀鏡像二次核對；因此不提供猜測程式。完成 metadata 核對後，需以直接字串模擬對拍所有查找/覆寫序列並做最大資料壓測。
