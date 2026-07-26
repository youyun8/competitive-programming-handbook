---
id: luogu-p1600
volume: upper
source_file: upper-volume
source_book_pages: [244]
source_pdf_pages: [262]
chapter: 4
section: '4.8'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P1600 天天愛跑步：路徑拆分與深度桶差分
difficulty: 5
topics: [LCA, 樹上差分, 深度桶, 離線統計]
prerequisites: [lowest-common-ancestor]
statement: 每個玩家在時刻 0 從 s 出發，沿樹上唯一最短路徑每秒走一條邊到 t。節點 u 的觀察員只在時刻 w_u 觀察，求每個觀察員能看到多少名玩家。
constraints:
  - '1 <= n,m <= 300000'
  - '0 <= w_i <= n'
  - 玩家路徑端點在 1..n
input_format: 第一行 n、m；接著 n-1 條邊；一行 n 個觀察時刻；再接 m 行 s、t。
output_format: 一行 n 個整數，依節點編號輸出看到的玩家數。
samples:
  - input: |
      4 2
      1 2
      2 3
      2 4
      0 1 2 2
      1 3
      4 3
    output: |
      1 2 2 0
    explanation: 第一名玩家時刻 0、1、2 位於 1、2、3；第二名時刻 0、1、2 位於 4、2、3。
core_knowledge: [路徑在 LCA 拆成上下行, 深度等式, 子樹事件差分]
judgment: 玩家到達節點的時間可在上行與下行段各改寫成一個只含起點/LCA 的常數，讓同常數路徑以深度桶批次統計。
hints:
  - 上行 s 到 lca：到 u 的時間為 depth[s]-depth[u]，需 depth[s]=depth[u]+w[u]。
  - 下行 lca 的下一點到 t：時間為 depth[s]+depth[u]-2depth[lca]，需 depth[s]-2depth[lca]=w[u]-depth[u]。
  - 對第一類在 s 加事件、parent(lca) 減；第二類在 t 加、lca 減。後序 DFS 以進子樹前後的桶差求每點答案。
solution_outline: 倍增求每條路徑 LCA，建立兩組節點事件；後序 DFS 維護兩個深度鍵頻率陣列，對每個 u 查對應鍵在其子樹處理前後的差。
proof_or_invariant: 事件的子樹前綴差使一個常數只作用於指定祖先鏈；兩個時間等式分別精確涵蓋 LCA 上下兩段，且下行在 LCA 減事件避免重複，故每名玩家恰在符合時刻的節點貢獻一次。
complexity:
  time: O((n+m)log n)
  space: O(n log n+m)
common_errors:
  - 上下行都包含 LCA 而重複計數
  - 第二類鍵寫成 depth[t]-2depth[lca]
  - 負鍵沒有加足夠偏移量
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;/* TODO：LCA 拆路徑並建立兩組深度事件。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}vector<int>watch(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>watch[static_cast<size_t>(i)];int levels=1;while((1<<levels)<=n)++levels;vector<vector<int>>up(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n+1)));vector<int>depth(static_cast<size_t>(n+1)),order{1};for(size_t i=0;i<order.size();++i){int node=order[i];for(int next:graph[static_cast<size_t>(node)])if(next!=up[0][static_cast<size_t>(node)]){up[0][static_cast<size_t>(next)]=node;depth[static_cast<size_t>(next)]=depth[static_cast<size_t>(node)]+1;for(int bit=1;bit<levels;++bit)up[static_cast<size_t>(bit)][static_cast<size_t>(next)]=up[static_cast<size_t>(bit-1)][static_cast<size_t>(up[static_cast<size_t>(bit-1)][static_cast<size_t>(next)])];order.push_back(next);}}auto lca=[&](int x,int y){if(depth[static_cast<size_t>(x)]<depth[static_cast<size_t>(y)])swap(x,y);int difference=depth[static_cast<size_t>(x)]-depth[static_cast<size_t>(y)];for(int bit=0;bit<levels;++bit)if(((difference>>bit)&1)!=0)x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];if(x==y)return x;for(int bit=levels-1;bit>=0;--bit)if(up[static_cast<size_t>(bit)][static_cast<size_t>(x)]!=up[static_cast<size_t>(bit)][static_cast<size_t>(y)]){x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];y=up[static_cast<size_t>(bit)][static_cast<size_t>(y)];}return up[0][static_cast<size_t>(x)];};vector<vector<pair<int,int>>>up_event(static_cast<size_t>(n+1)),down_event(static_cast<size_t>(n+1));for(int i=0;i<m;++i){int start,finish;cin>>start>>finish;int ancestor=lca(start,finish);int up_key=depth[static_cast<size_t>(start)];up_event[static_cast<size_t>(start)].push_back({up_key,1});up_event[static_cast<size_t>(up[0][static_cast<size_t>(ancestor)])].push_back({up_key,-1});int down_key=depth[static_cast<size_t>(start)]-2*depth[static_cast<size_t>(ancestor)];down_event[static_cast<size_t>(finish)].push_back({down_key,1});down_event[static_cast<size_t>(ancestor)].push_back({down_key,-1});}int offset=2*n+2,array_size=4*n+5;vector<int>up_frequency(static_cast<size_t>(array_size)),down_frequency(static_cast<size_t>(array_size)),answer(static_cast<size_t>(n+1));vector<int>before_up(static_cast<size_t>(n+1)),before_down(static_cast<size_t>(n+1));vector<pair<int,bool>>stack{{1,false}};while(!stack.empty()){auto [node,exiting]=stack.back();stack.pop_back();int key_up=depth[static_cast<size_t>(node)]+watch[static_cast<size_t>(node)];int key_down=watch[static_cast<size_t>(node)]-depth[static_cast<size_t>(node)];if(!exiting){before_up[static_cast<size_t>(node)]=up_frequency[static_cast<size_t>(key_up+offset)];before_down[static_cast<size_t>(node)]=down_frequency[static_cast<size_t>(key_down+offset)];stack.push_back({node,true});for(int next:graph[static_cast<size_t>(node)])if(up[0][static_cast<size_t>(next)]==node)stack.push_back({next,false});}else{for(auto [key,value]:up_event[static_cast<size_t>(node)])up_frequency[static_cast<size_t>(key+offset)]+=value;for(auto [key,value]:down_event[static_cast<size_t>(node)])down_frequency[static_cast<size_t>(key+offset)]+=value;answer[static_cast<size_t>(node)]=up_frequency[static_cast<size_t>(key_up+offset)]-before_up[static_cast<size_t>(node)]+down_frequency[static_cast<size_t>(key_down+offset)]-before_down[static_cast<size_t>(node)];}}for(int node=1;node<=n;++node)cout<<answer[static_cast<size_t>(node)]<<(node==n?'\n':' ');}
external_url: https://www.luogu.com.cn/problem/P1600
external_platform: 洛谷
external_problem_id: P1600
external_title: '[NOIP2016 提高组] 天天爱跑步'
---

把到達時間化成深度等式後，一條路徑不再需要逐點模擬，而成為某個常數鍵在祖先鏈上的區間事件。
