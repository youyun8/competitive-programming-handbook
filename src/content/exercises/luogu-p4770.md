---
id: luogu-p4770
volume: lower
source_file: lower-volume
title: 洛谷 P4770 你的名字
chapter: 9
section: '9.8'
kind: external-oj
difficulty: 5
topics: [suffix-automaton, endpos, segment-tree-merge]
prerequisites: [suffix-automaton, dynamic-segment-tree]
statement: 對每筆 T,l,r，求 T 中有多少種本質不同非空子串不是 S[l..r] 的子串。
constraints:
  [
    '1 <= |S| <= 5*10^5',
    '1 <= Q <= 10^5，sum |T| <= 10^6',
    '1 <= l <= r <= |S|，1 <= |T| <= 5*10^5',
    '字串只含小寫英文字母'
  ]
input_format: 第一行 S，第二行 Q；接著每行 T、l、r。
output_format: 每筆詢問輸出一個非負整數。
samples:
  - input: "scbamgepe\n3\nsmape 2 7\nsbape 3 8\nsgepe 1 9\n"
    output: "12\n10\n4"
    explanation: 官方範例；答案只計 T 的不同內容，並排除在指定 S 區間中出現者。
core_knowledge: [SAM endpos 線段樹, 受限區間最長匹配, 查詢串 SAM 去重]
judgment: T 內相同內容只計一次；比較對象是指定閉區間 S[l..r]，不可使用區間外字元。
hints:
  - 在 S 的 SAM 每個狀態維護 endpos 集，合併動態線段樹可判定某轉移是否能在指定結尾區間出現。
  - 掃 T 時維護在 S[l..r] 可匹配的最長後綴長度；失敗時沿 suffix link 縮短。
  - 再建 T 的 SAM，把每個前綴匹配長度向 link 父親傳播；狀態貢獻為 len[v]−max(len[link[v]],matched[v])。
solution_outline: Reviewed roadmap：S-SAM 合併 endpos 線段樹；每問線性掃 T 求區間受限匹配長度，再以 T-SAM 對不同子串去重求和。
proof_or_invariant: 待補：需證明 endpos 查詢區間應為 [l+L,r]，以及匹配長度向 T-SAM link 傳播後每個等價類的排除界精確。
common_errors: [endpos 查詢未限制子串起點不早於 l, 直接按 T 前綴計數造成重複, 線段樹合併後仍保留失效根]
complexity: { time: '目標 O((|S|+sum|T|) log |S|)', space: '目標 O(|S| log |S|)' }
external_url: https://www.luogu.com.cn/problem/P4770
external_platform: 洛谷
external_problem_id: P4770
external_title: '[NOI2018] 你的名字'
external_relation: original
source_book_pages: [596, 599]
source_pdf_pages: [226, 229]
review_status: needs-review
---

Reviewed roadmap。缺口：尚無經過嚴格警告編譯的 C++17 程式；需以短 S/T 枚舉全部不同子串對拍，另驗證 l=r、全相同字元與總長上限記憶體。
