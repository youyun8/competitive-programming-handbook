---
id: luogu-p4281
volume: upper
source_file: upper-volume
source_book_pages: [244]
source_pdf_pages: [262]
chapter: 4
section: '4.8'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4281 緊急集合：三點樹上中位點
difficulty: 4
topics: [LCA, 樹距離, 三點中位點]
prerequisites: [lowest-common-ancestor]
statement: 每次給樹上三個節點，三人各沿最短路到同一集合點；求總路程最小的集合點與最小總路程。
constraints:
  - '1 <= n,m <= 500000'
  - 輸入 n-1 條邊構成無權樹
  - 每個詢問含三個節點
input_format: 第一行 n、m；接著 n-1 條邊；再接 m 行 x、y、z。
output_format: 每組輸出最佳集合點編號與最小總路程。
samples:
  - input: |
      5 2
      1 2
      1 3
      3 4
      3 5
      2 4 5
      4 5 3
    output: |
      3 4
      3 2
    explanation: 三條兩兩路徑的唯一共同分岔點為最佳集合點。
core_knowledge: [三點 Steiner 中位點, 三組 LCA, 兩兩距離和]
judgment: 三點兩兩路徑交於唯一中位點；固定根後，它是三個兩兩 LCA 中深度最大的那一個。
hints:
  - 分別求 a=LCA(x,y)、b=LCA(x,z)、c=LCA(y,z)。
  - a、b、c 中深度最大者就是三條路徑的共同分岔點。
  - 最小總距離也可直接算成 (dist(x,y)+dist(x,z)+dist(y,z))/2。
solution_outline: 倍增預處理深度與 LCA；每組取最深 pairwise LCA 作集合點，再用深度距離公式計算總路程。
proof_or_invariant: 三點最小連通子樹由中位點向三端分出三段，每段在兩個 pairwise distance 中各出現兩次，因此距離和的一半等於三人總路程；最深 pairwise LCA 正是該分岔點。
complexity:
  time: O((n+m)log n)
  space: O(n log n)
common_errors:
  - 固定輸出某一組 LCA 而未比較深度
  - 忘記兩兩距離總和要除以二
  - n 很大時遞迴 DFS 爆棧
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;/* TODO：LCA 與三點中位點。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,query_count;cin>>n>>query_count;vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}int levels=1;while((1<<levels)<=n)++levels;vector<vector<int>>up(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n+1)));vector<int>depth(static_cast<size_t>(n+1)),order{1};for(size_t i=0;i<order.size();++i){int node=order[i];for(int next:graph[static_cast<size_t>(node)])if(next!=up[0][static_cast<size_t>(node)]){up[0][static_cast<size_t>(next)]=node;depth[static_cast<size_t>(next)]=depth[static_cast<size_t>(node)]+1;for(int bit=1;bit<levels;++bit)up[static_cast<size_t>(bit)][static_cast<size_t>(next)]=up[static_cast<size_t>(bit-1)][static_cast<size_t>(up[static_cast<size_t>(bit-1)][static_cast<size_t>(next)])];order.push_back(next);}}auto lca=[&](int x,int y){if(depth[static_cast<size_t>(x)]<depth[static_cast<size_t>(y)])swap(x,y);int difference=depth[static_cast<size_t>(x)]-depth[static_cast<size_t>(y)];for(int bit=0;bit<levels;++bit)if(((difference>>bit)&1)!=0)x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];if(x==y)return x;for(int bit=levels-1;bit>=0;--bit)if(up[static_cast<size_t>(bit)][static_cast<size_t>(x)]!=up[static_cast<size_t>(bit)][static_cast<size_t>(y)]){x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];y=up[static_cast<size_t>(bit)][static_cast<size_t>(y)];}return up[0][static_cast<size_t>(x)];};auto distance=[&](int x,int y){return depth[static_cast<size_t>(x)]+depth[static_cast<size_t>(y)]-2*depth[static_cast<size_t>(lca(x,y))];};while(query_count--){int x,y,z;cin>>x>>y>>z;array<int,3>candidate{lca(x,y),lca(x,z),lca(y,z)};int meeting=*max_element(candidate.begin(),candidate.end(),[&](int first,int second){return depth[static_cast<size_t>(first)]<depth[static_cast<size_t>(second)];});int total=(distance(x,y)+distance(x,z)+distance(y,z))/2;cout<<meeting<<' '<<total<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4281
external_platform: 洛谷
external_problem_id: P4281
external_title: '[AHOI2008] 紧急集合 / 聚会'
---

三點在樹上的最短連接子圖只有一個分岔點；pairwise LCA 與距離恰能直接恢復它。
