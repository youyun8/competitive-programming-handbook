---
id: openj-bailian-3438
volume: upper
source_file: upper-volume
title: OpenJudge 百練 3438 Balanced Lineup：靜態區間極差
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - sparse-table
  - range-minimum-maximum
prerequisites:
  - fenwick-tree
statement: 給定固定身高序列，多次查詢連續區間最高與最低身高之差。
constraints:
  - N <= 50000
  - Q <= 200000
  - 身高 <= 1000000
input_format: 輸入 N、Q、N 個身高，再給 Q 個 A B。
output_format: 每問輸出 max-min。
samples:
  - input: |
      6 3
      1
      7
      3
      4
      2
      5
      1 5
      4 6
      2 2
    output: |
      6
      3
      0
    explanation: 三個區間極差分別為 7-1、5-2 與 7-7。
core_knowledge: *id001
judgment: 建立最小與最大 Sparse Table，O(1) 查詢極差。
hints:
  - 序列不修改，可預處理長度為 2^k 的區間。
  - min 與 max 都是冪等運算，查詢可用兩個重疊區塊。
  - 令 k=floor(log2(len))，合併左右兩個長 2^k 區塊。
solution_outline: 建立最小與最大 Sparse Table，O(1) 查詢極差。
proof_or_invariant: 兩個選取區塊共同覆蓋查詢範圍；重疊不影響 min/max，故各極值正確。
common_errors:
  - 索引基準或閉區間端點處理錯誤
  - 更新資料結構後忘記同步原始狀態
  - 使用 32 位元儲存可能溢位的計數或總和
complexity:
  time: O(N log N+Q)
  space: O(N log N)
cpp_skeleton: |
  // TODO：先依三階段提示自行完成核心；以下框架可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;int levels=1;while((1<<levels)<=n)++levels;vector<vector<int>>mn(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n))),mx=mn;for(int i=0;i<n;++i){cin>>mn[0][static_cast<size_t>(i)];mx[0][static_cast<size_t>(i)]=mn[0][static_cast<size_t>(i)];}for(int k=1;k<levels;++k)for(int i=0;i+(1<<k)<=n;++i){mn[static_cast<size_t>(k)][static_cast<size_t>(i)]=min(mn[static_cast<size_t>(k-1)][static_cast<size_t>(i)],mn[static_cast<size_t>(k-1)][static_cast<size_t>(i+(1<<(k-1)))]);mx[static_cast<size_t>(k)][static_cast<size_t>(i)]=max(mx[static_cast<size_t>(k-1)][static_cast<size_t>(i)],mx[static_cast<size_t>(k-1)][static_cast<size_t>(i+(1<<(k-1)))]);}while(q--){int l,r;cin>>l>>r;--l;int k=31-__builtin_clz(r-l);int low=min(mn[static_cast<size_t>(k)][static_cast<size_t>(l)],mn[static_cast<size_t>(k)][static_cast<size_t>(r-(1<<k))]);int high=max(mx[static_cast<size_t>(k)][static_cast<size_t>(l)],mx[static_cast<size_t>(k)][static_cast<size_t>(r-(1<<k))]);cout<<high-low<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;int levels=1;while((1<<levels)<=n)++levels;vector<vector<int>>mn(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n))),mx=mn;for(int i=0;i<n;++i){cin>>mn[0][static_cast<size_t>(i)];mx[0][static_cast<size_t>(i)]=mn[0][static_cast<size_t>(i)];}for(int k=1;k<levels;++k)for(int i=0;i+(1<<k)<=n;++i){mn[static_cast<size_t>(k)][static_cast<size_t>(i)]=min(mn[static_cast<size_t>(k-1)][static_cast<size_t>(i)],mn[static_cast<size_t>(k-1)][static_cast<size_t>(i+(1<<(k-1)))]);mx[static_cast<size_t>(k)][static_cast<size_t>(i)]=max(mx[static_cast<size_t>(k-1)][static_cast<size_t>(i)],mx[static_cast<size_t>(k-1)][static_cast<size_t>(i+(1<<(k-1)))]);}while(q--){int l,r;cin>>l>>r;--l;int k=31-__builtin_clz(r-l);int low=min(mn[static_cast<size_t>(k)][static_cast<size_t>(l)],mn[static_cast<size_t>(k)][static_cast<size_t>(r-(1<<k))]);int high=max(mx[static_cast<size_t>(k)][static_cast<size_t>(l)],mx[static_cast<size_t>(k)][static_cast<size_t>(r-(1<<k))]);cout<<high-low<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/3438/
external_platform: OpenJ_Bailian
external_problem_id: '3438'
external_title: OpenJudge 百練 3438 Balanced Lineup
external_relation: original
source_book_pages:
  - 151
  - 170
source_pdf_pages:
  - 169
  - 188
review_status: verified
---

本卡片依外部題面與限制獨立整理。
