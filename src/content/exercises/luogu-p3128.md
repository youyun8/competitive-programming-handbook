---
id: luogu-p3128
volume: upper
source_file: upper-volume
source_book_pages: [234]
source_pdf_pages: [252]
chapter: 4
section: '4.8'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3128 Max Flow：樹上路徑差分
difficulty: 4
topics: [樹上差分, LCA, 子樹累加]
prerequisites: [lowest-common-ancestor]
statement: 給一棵樹與 K 條牛隻行走路徑，每條路徑包含兩端點及中間所有節點；求被最多路徑經過的節點所承受的路徑數。
constraints:
  - '2 <= n <= 50000'
  - '1 <= K <= 100000'
  - 輸入 n-1 條邊構成樹
input_format: 第一行 n、K；接著 n-1 行樹邊；最後 K 行每條路徑端點 s、t。
output_format: 一個整數，任一節點被經過的最大次數。
samples:
  - input: |
      5 3
      1 2
      1 3
      3 4
      3 5
      2 4
      4 5
      2 5
    output: |
      3
    explanation: 三條路徑都經過節點 3。
core_knowledge: [node_path_difference, binary_lifting, postorder_sum]
judgment: 大量靜態路徑只求每點覆蓋數，可在端點與 LCA 做 O(1) 差分，再由子樹和一次還原。
hints:
  - 對路徑 u—v，先求 ancestor=LCA(u,v)。
  - 節點版差分為 delta[u]++、delta[v]++、delta[ancestor]--、delta[parent[ancestor]]--。
  - 後序把每個兒子的 delta 累加到父親；累加後的值就是該節點覆蓋數。
solution_outline: 二進位提升預處理 LCA；對每條路徑作節點差分；反向 DFS 序累加並取最大。
proof_or_invariant: 每個端點向根貢獻一條單位流，LCA 與其父各抵消一次，使流恰停在並包含 LCA；後序子樹和因此等於穿過節點的路徑數。
complexity:
  time: O((n+K)log n)
  space: O(n log n)
common_errors:
  - 套用邊差分 delta[lca]-=2 而漏算 LCA 節點
  - 根節點的 parent 為 0 時陣列未保留索引 0
  - 累加順序由根往葉而非後序
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;/* TODO：LCA、節點差分與後序累加。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,path_count;cin>>n>>path_count;vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}constexpr int log=17;vector<array<int,log>>up(static_cast<size_t>(n+1));vector<int>depth(static_cast<size_t>(n+1)),order{1};for(size_t i=0;i<order.size();++i){int node=order[i];for(int next:graph[static_cast<size_t>(node)])if(next!=up[static_cast<size_t>(node)][0]){up[static_cast<size_t>(next)][0]=node;depth[static_cast<size_t>(next)]=depth[static_cast<size_t>(node)]+1;for(int bit=1;bit<log;++bit)up[static_cast<size_t>(next)][static_cast<size_t>(bit)]=up[static_cast<size_t>(up[static_cast<size_t>(next)][static_cast<size_t>(bit-1)])][static_cast<size_t>(bit-1)];order.push_back(next);}}auto lca=[&](int x,int y){if(depth[static_cast<size_t>(x)]<depth[static_cast<size_t>(y)])swap(x,y);int difference=depth[static_cast<size_t>(x)]-depth[static_cast<size_t>(y)];for(int bit=0;bit<log;++bit)if(((difference>>bit)&1)!=0)x=up[static_cast<size_t>(x)][static_cast<size_t>(bit)];if(x==y)return x;for(int bit=log-1;bit>=0;--bit)if(up[static_cast<size_t>(x)][static_cast<size_t>(bit)]!=up[static_cast<size_t>(y)][static_cast<size_t>(bit)]){x=up[static_cast<size_t>(x)][static_cast<size_t>(bit)];y=up[static_cast<size_t>(y)][static_cast<size_t>(bit)];}return up[static_cast<size_t>(x)][0];};vector<int>delta(static_cast<size_t>(n+1));while(path_count--){int x,y;cin>>x>>y;int ancestor=lca(x,y);++delta[static_cast<size_t>(x)];++delta[static_cast<size_t>(y)];--delta[static_cast<size_t>(ancestor)];--delta[static_cast<size_t>(up[static_cast<size_t>(ancestor)][0])];}int answer=0;for(auto iterator=order.rbegin();iterator!=order.rend();++iterator){int node=*iterator;answer=max(answer,delta[static_cast<size_t>(node)]);delta[static_cast<size_t>(up[static_cast<size_t>(node)][0])]+=delta[static_cast<size_t>(node)];}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3128
external_platform: 洛谷
external_problem_id: P3128
external_title: '[USACO15DEC] Max Flow P'
---

樹上差分把每條路徑的逐點更新延後成一次後序匯流，是靜態路徑統計的核心技巧。
