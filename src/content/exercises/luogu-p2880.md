---
id: luogu-p2880
volume: upper
source_file: upper-volume
title: 洛谷 P2880 Balanced Lineup
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 2
topics: ['Sparse Table', 'RMQ', '倍增']
prerequisites: ['區間最值', '二進位對數']
statement: 給定固定隊列中每頭牛的身高，多次詢問連續位置 [a,b] 內最高與最低身高之差。
constraints: ['1 ≤ n ≤ 50000', '1 ≤ q ≤ 180000', '1 ≤ h_i ≤ 10^6']
input_format: 第一行 n、q；接著 n 行身高；最後 q 行詢問端點 a、b。
output_format: 每個詢問輸出區間最大值減最小值。
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
    explanation: '[1,5] 最高 7、最低 1，差 6；單點區間高低相同，差 0。'
core_knowledge: ['冪長區間預處理', '兩個重疊區塊回答冪等運算']
judgment: max/min 允許區塊重疊，因此長度 L 可用兩段 2^floor(log2L) 覆蓋並 O(1) 回答。
hints:
  - 'st[k][i] 保存從 i 開始、長 2^k 的最值。'
  - '由兩個長 2^(k-1) 區塊合成第 k 層。'
  - '詢問長度 L 取 k=floor(log2L)，比較左右兩個長 2^k 區塊。'
solution_outline: 同時建立最大、最小 ST 表及整數 log 表；每個詢問以兩個可能重疊的冪長區間取極值並相減。
proof_or_invariant: 歸納可知 ST 每格保存指定區間真實最值。查詢兩區塊聯集覆蓋完整詢問；重疊不影響 max/min，故兩者合併即全區間極值。
common_errors: ['只建最大表', '右區塊起點少寫 +1', '用浮點 log2 造成邊界誤差', '把詢問當半開區間']
complexity: { time: 'O(n log n+q)', space: 'O(n log n)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,q;cin>>n>>q;for(int i=0,x;i<n;++i)cin>>x;while(q--){int l,r;cin>>l>>r;cout<<0<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,q;cin>>n>>q;vector<int> logs(static_cast<size_t>(n)+1U);for(int i=2;i<=n;++i)logs[static_cast<size_t>(i)]=logs[static_cast<size_t>(i/2)]+1;
      const int levels=logs[static_cast<size_t>(n)]+1;vector<vector<int>> maximum(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n))),minimum=maximum;
      for(int i=0;i<n;++i){cin>>maximum[0][static_cast<size_t>(i)];minimum[0][static_cast<size_t>(i)]=maximum[0][static_cast<size_t>(i)];}
      for(int k=1;k<levels;++k)for(int i=0;i+(1<<k)<=n;++i){
          const int second=i+(1<<(k-1));
          maximum[static_cast<size_t>(k)][static_cast<size_t>(i)]=max(maximum[static_cast<size_t>(k-1)][static_cast<size_t>(i)],maximum[static_cast<size_t>(k-1)][static_cast<size_t>(second)]);
          minimum[static_cast<size_t>(k)][static_cast<size_t>(i)]=min(minimum[static_cast<size_t>(k-1)][static_cast<size_t>(i)],minimum[static_cast<size_t>(k-1)][static_cast<size_t>(second)]);
      }
      while(q--){int left,right;cin>>left>>right;--left;--right;int k=logs[static_cast<size_t>(right-left+1)],start=right-(1<<k)+1;int high=max(maximum[static_cast<size_t>(k)][static_cast<size_t>(left)],maximum[static_cast<size_t>(k)][static_cast<size_t>(start)]),low=min(minimum[static_cast<size_t>(k)][static_cast<size_t>(left)],minimum[static_cast<size_t>(k)][static_cast<size_t>(start)]);cout<<high-low<<'\n';}
  }
external_url: https://www.luogu.com.cn/problem/P2880
external_platform: 洛谷
external_problem_id: P2880
external_title: '[USACO07JAN] Balanced Lineup G'
external_relation: original
source_book_pages: [58]
source_pdf_pages: [76]
review_status: verified
---

冪等最值允許查詢區塊重疊，使 Sparse Table 能以兩塊 O(1) 回答。
