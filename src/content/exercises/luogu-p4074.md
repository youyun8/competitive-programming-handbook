---
id: luogu-p4074
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4074 糖果公園：帶修改樹上莫隊
difficulty: 5
topics: [樹上莫隊, 帶修改莫隊, LCA, 歐拉序]
prerequisites: [mo-algorithm, lowest-common-ancestor]
statement: 樹上每個節點有一種糖果。遊客走簡單路徑，吃到某顏色第 k 顆糖的愉悅值為該顏色價值 V_c 乘次數權 W_k。支援單點改色與詢問一條路徑的總愉悅值。
constraints:
  - '1 <= n,m,q <= 100000'
  - V、W 與答案須使用 64 位元
  - 操作 0 為改色，操作 1 為路徑詢問
input_format: 第一行 n、m、q；接著 m 個 V、n 個 W、n-1 條邊、n 個初始顏色，再接 q 個操作。
output_format: 依序輸出每個路徑詢問的愉悅值。
samples:
  - input: |
      3 2 3
      10 20
      1 2 3
      1 2
      2 3
      1 2 1
      1 1 3
      0 2 1
      1 1 3
    output: |
      50
      60
    explanation: 初次顏色 1 出現兩次，得 10×(1+2)，顏色 2 得 20，合計 50；改色後三顆皆為顏色 1，得 10×(1+2+3)。
core_knowledge: [雙次歐拉序, 路徑集合 toggle, 修改時間維, 增量計分]
judgment: 路徑可轉成歐拉序區間的奇數出現節點集合；加入某顏色第 k 個節點的增量恰為 V_c×W_k，且修改可作第三維移動。
hints:
  - DFS 記錄進出各一次；移動區間端點時 toggle 該位置節點，出現奇數次者正好保留。
  - 若 LCA 不是其中一端，區間用 tout[u] 到 tin[v]，並在計分時暫時加入 LCA。
  - 離線記下每次修改的前後顏色；時間前進或倒退時，若節點目前啟用，先移除舊色再加入新色。
solution_outline: 建立 LCA 與雙次歐拉序，將詢問轉為區間、時間及可選額外 LCA；三維莫隊維護啟用節點、各色數量與分數。
proof_or_invariant: 歐拉區間 toggle 後啟用集合恰為路徑節點（或少 LCA）。score 維持 Σ_c V_c Σ_{k=1}^{count_c}W_k；增刪與時間修改都按此式更新，因此記錄答案正確。
complexity:
  time: O((n+q)n^(2/3) log n)
  space: O(n+m+q)
common_errors:
  - 非祖先情況漏掉額外 LCA
  - 回退修改時仍套用新顏色
  - 移除顏色先遞減計數，導致取錯 W 下標
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,q;cin>>n>>m>>q;vector<long long>v(static_cast<size_t>(m+1)),w(static_cast<size_t>(n+1));for(int i=1;i<=m;++i)cin>>v[static_cast<size_t>(i)];for(int i=1;i<=n;++i)cin>>w[static_cast<size_t>(i)];/* TODO：雙次 Euler、LCA 與三維莫隊。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Change{int node,before,after;};
  struct Query{int left,right,time,extra,index;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,operation_count;cin>>n>>m>>operation_count;vector<long long>value(static_cast<size_t>(m+1)),weight(static_cast<size_t>(n+1));for(int i=1;i<=m;++i)cin>>value[static_cast<size_t>(i)];for(int i=1;i<=n;++i)cin>>weight[static_cast<size_t>(i)];vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}vector<int>initial(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>initial[static_cast<size_t>(i)];constexpr int log=18;vector<array<int,log>>up(static_cast<size_t>(n+1));vector<int>depth(static_cast<size_t>(n+1)),entry(static_cast<size_t>(n+1)),exit_time(static_cast<size_t>(n+1)),euler(static_cast<size_t>(2*n+1));int timer=0;function<void(int,int)>dfs=[&](int node,int parent){up[static_cast<size_t>(node)][0]=parent;for(int bit=1;bit<log;++bit)up[static_cast<size_t>(node)][static_cast<size_t>(bit)]=up[static_cast<size_t>(up[static_cast<size_t>(node)][static_cast<size_t>(bit-1)])][static_cast<size_t>(bit-1)];entry[static_cast<size_t>(node)]=++timer;euler[static_cast<size_t>(timer)]=node;for(int next:graph[static_cast<size_t>(node)])if(next!=parent){depth[static_cast<size_t>(next)]=depth[static_cast<size_t>(node)]+1;dfs(next,node);}exit_time[static_cast<size_t>(node)]=++timer;euler[static_cast<size_t>(timer)]=node;};dfs(1,0);auto lca=[&](int x,int y){if(depth[static_cast<size_t>(x)]<depth[static_cast<size_t>(y)])swap(x,y);int difference=depth[static_cast<size_t>(x)]-depth[static_cast<size_t>(y)];for(int bit=0;bit<log;++bit)if(((difference>>bit)&1)!=0)x=up[static_cast<size_t>(x)][static_cast<size_t>(bit)];if(x==y)return x;for(int bit=log-1;bit>=0;--bit)if(up[static_cast<size_t>(x)][static_cast<size_t>(bit)]!=up[static_cast<size_t>(y)][static_cast<size_t>(bit)]){x=up[static_cast<size_t>(x)][static_cast<size_t>(bit)];y=up[static_cast<size_t>(y)][static_cast<size_t>(bit)];}return up[static_cast<size_t>(x)][0];};vector<int>reading_color=initial;vector<Change>changes(1);vector<Query>queries;int query_count=0;for(int i=0;i<operation_count;++i){int operation,x,y;cin>>operation>>x>>y;if(operation==0){changes.push_back({x,reading_color[static_cast<size_t>(x)],y});reading_color[static_cast<size_t>(x)]=y;}else{if(entry[static_cast<size_t>(x)]>entry[static_cast<size_t>(y)])swap(x,y);int ancestor=lca(x,y);if(ancestor==x)queries.push_back({entry[static_cast<size_t>(x)],entry[static_cast<size_t>(y)],static_cast<int>(changes.size())-1,0,query_count++});else queries.push_back({exit_time[static_cast<size_t>(x)],entry[static_cast<size_t>(y)],static_cast<int>(changes.size())-1,ancestor,query_count++});}}int block=max(1,static_cast<int>(pow(static_cast<double>(2*n),2.0/3.0)));sort(queries.begin(),queries.end(),[block](const Query&a,const Query&b){int al=a.left/block,bl=b.left/block;if(al!=bl)return al<bl;int ar=a.right/block,br=b.right/block;if(ar!=br)return ((al&1)!=0)?ar>br:ar<br;return ((ar&1)!=0)?a.time>b.time:a.time<b.time;});vector<int>color=initial,color_count(static_cast<size_t>(m+1));vector<char>active(static_cast<size_t>(n+1));vector<long long>answer(static_cast<size_t>(query_count));long long score=0;auto add_node=[&](int node){int current=color[static_cast<size_t>(node)];++color_count[static_cast<size_t>(current)];score+=value[static_cast<size_t>(current)]*weight[static_cast<size_t>(color_count[static_cast<size_t>(current)])];};auto remove_node=[&](int node){int current=color[static_cast<size_t>(node)];score-=value[static_cast<size_t>(current)]*weight[static_cast<size_t>(color_count[static_cast<size_t>(current)])];--color_count[static_cast<size_t>(current)];};auto toggle=[&](int position){int node=euler[static_cast<size_t>(position)];if(active[static_cast<size_t>(node)]!=0){remove_node(node);active[static_cast<size_t>(node)]=0;}else{add_node(node);active[static_cast<size_t>(node)]=1;}};auto apply=[&](int change_index,bool forward){const Change&change=changes[static_cast<size_t>(change_index)];if(active[static_cast<size_t>(change.node)]!=0)remove_node(change.node);color[static_cast<size_t>(change.node)]=forward?change.after:change.before;if(active[static_cast<size_t>(change.node)]!=0)add_node(change.node);};int left=1,right=0,current_time=0;for(const Query&query:queries){while(current_time<query.time)apply(++current_time,true);while(current_time>query.time)apply(current_time--,false);while(left>query.left)toggle(--left);while(right<query.right)toggle(++right);while(left<query.left)toggle(left++);while(right>query.right)toggle(right--);if(query.extra!=0)add_node(query.extra);answer[static_cast<size_t>(query.index)]=score;if(query.extra!=0)remove_node(query.extra);}for(long long result:answer)cout<<result<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4074
external_platform: 洛谷
external_problem_id: P4074
external_title: '[WC2013] 糖果公园'
---

樹上莫隊與帶修改莫隊可以正交組合：前兩維描述歐拉區間，第三維描述版本。
