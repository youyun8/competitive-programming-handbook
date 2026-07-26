---
id: spoj-cot2
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: SPOJ COT2 Count on a tree II：樹路徑不同值
difficulty: 5
topics: [樹上莫隊, 歐拉序, LCA]
prerequisites: [mo-algorithm, lca]
statement: 一棵樹的每個節點有一個值。對每次兩點詢問，求兩點間簡單路徑上有多少種不同值。
constraints:
  - '1 <= n, m <= 40000'
  - 節點值可用 32 位元有號整數表示
  - 輸入 n-1 條邊構成一棵樹
input_format: 第一行 n、m，第二行節點值，接著 n-1 條邊，最後 m 行各給 u、v。
output_format: 每次詢問輸出一行路徑不同值數。
samples:
  - input: |
      5 3
      1 2 1 3 2
      1 2
      1 3
      2 4
      2 5
      4 3
      4 5
      1 3
    output: |
      3
      2
      1
    explanation: 路徑 4-2-1-3 的值為 3、2、1、1；4-2-5 的值為 3、2、2；1-3 只有值 1。
core_knowledge: [雙次歐拉序, 節點切換, 最近公共祖先]
judgment: 查詢可離線，歐拉序區間端點每移一步只切換一個節點；配合 LCA 可把任意樹路徑轉成區間。
hints:
  - DFS 時進入與離開節點都寫入歐拉序，窗口中出現奇數次的節點才屬於目前路徑。
  - 若 lca(u,v)=u，區間用 [tin[u],tin[v]]；否則用 [tout[u],tin[v]] 並額外切換 LCA。
  - 對節點值離散化，toggle 時以頻率從 0 到 1 或 1 到 0更新不同值數。
solution_outline: 建雙次歐拉序與倍增 LCA，把每條路徑轉成莫隊區間和可選額外 LCA；移動窗口時切換節點是否生效。
proof_or_invariant: 在轉換後區間中，路徑外節點恰出現零或兩次，路徑節點恰出現一次；非祖先情況僅缺 LCA。奇偶切換後 active 集合因此精確等於路徑。
complexity:
  time: O((n+m)sqrt(n)+n log n)
  space: O(n log n+m)
common_errors:
  - 使用只有進入時間的歐拉序而無法消去支路
  - 非祖先情況忘記額外加入 LCA
  - toggle 節點時以節點編號而非其離散化值維護頻率
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>value(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>value[static_cast<size_t>(i)];vector<vector<int>>g(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;g[static_cast<size_t>(u)].push_back(v);g[static_cast<size_t>(v)].push_back(u);}while(m--){int u,v;cin>>u>>v;cout<<0<<'\n';}/* TODO：以雙次歐拉序、LCA 與莫隊取代占位輸出。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Query{int left,right,extra,index;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>value(static_cast<size_t>(n+1)),all;for(int i=1;i<=n;++i){cin>>value[static_cast<size_t>(i)];all.push_back(value[static_cast<size_t>(i)]);}sort(all.begin(),all.end());all.erase(unique(all.begin(),all.end()),all.end());for(int i=1;i<=n;++i)value[static_cast<size_t>(i)]=static_cast<int>(lower_bound(all.begin(),all.end(),value[static_cast<size_t>(i)])-all.begin());vector<vector<int>>g(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;g[static_cast<size_t>(u)].push_back(v);g[static_cast<size_t>(v)].push_back(u);}const int levels=17;vector<array<int,17>>up(static_cast<size_t>(n+1));vector<int>depth(static_cast<size_t>(n+1)),tin(static_cast<size_t>(n+1)),tout(static_cast<size_t>(n+1)),euler(static_cast<size_t>(2*n));int timer=0;function<void(int,int)>dfs=[&](int u,int p){tin[static_cast<size_t>(u)]=timer;euler[static_cast<size_t>(timer++)]=u;up[static_cast<size_t>(u)][0]=p;for(int j=1;j<levels;++j)up[static_cast<size_t>(u)][static_cast<size_t>(j)]=up[static_cast<size_t>(up[static_cast<size_t>(u)][static_cast<size_t>(j-1)])][static_cast<size_t>(j-1)];for(int v:g[static_cast<size_t>(u)])if(v!=p){depth[static_cast<size_t>(v)]=depth[static_cast<size_t>(u)]+1;dfs(v,u);}tout[static_cast<size_t>(u)]=timer;euler[static_cast<size_t>(timer++)]=u;};dfs(1,1);auto lca=[&](int u,int v){if(depth[static_cast<size_t>(u)]<depth[static_cast<size_t>(v)])swap(u,v);int d=depth[static_cast<size_t>(u)]-depth[static_cast<size_t>(v)];for(int j=0;j<levels;++j)if((d>>j&1)!=0)u=up[static_cast<size_t>(u)][static_cast<size_t>(j)];if(u==v)return u;for(int j=levels-1;j>=0;--j)if(up[static_cast<size_t>(u)][static_cast<size_t>(j)]!=up[static_cast<size_t>(v)][static_cast<size_t>(j)]){u=up[static_cast<size_t>(u)][static_cast<size_t>(j)];v=up[static_cast<size_t>(v)][static_cast<size_t>(j)];}return up[static_cast<size_t>(u)][0];};vector<Query>queries(static_cast<size_t>(m));for(int i=0,u,v;i<m;++i){cin>>u>>v;if(tin[static_cast<size_t>(u)]>tin[static_cast<size_t>(v)])swap(u,v);int w=lca(u,v);if(w==u)queries[static_cast<size_t>(i)]={tin[static_cast<size_t>(u)],tin[static_cast<size_t>(v)],0,i};else queries[static_cast<size_t>(i)]={tout[static_cast<size_t>(u)],tin[static_cast<size_t>(v)],w,i};}int block=max(1,static_cast<int>(sqrt(static_cast<double>(2*n))));sort(queries.begin(),queries.end(),[block](const Query&a,const Query&b){int x=a.left/block,y=b.left/block;return x!=y?x<y:((x&1)!=0?a.right>b.right:a.right<b.right);});vector<int>frequency(all.size()),answer(static_cast<size_t>(m));vector<unsigned char>active(static_cast<size_t>(n+1));int distinct=0,left=0,right=-1;auto toggle=[&](int position){int node=euler[static_cast<size_t>(position)],x=value[static_cast<size_t>(node)];if(active[static_cast<size_t>(node)]!=0){if(--frequency[static_cast<size_t>(x)]==0)--distinct;}else if(frequency[static_cast<size_t>(x)]++==0)++distinct;active[static_cast<size_t>(node)]^=1U;};for(const Query&q:queries){while(left>q.left)toggle(--left);while(right<q.right)toggle(++right);while(left<q.left)toggle(left++);while(right>q.right)toggle(right--);if(q.extra!=0)toggle(tin[static_cast<size_t>(q.extra)]);answer[static_cast<size_t>(q.index)]=distinct;if(q.extra!=0)toggle(tin[static_cast<size_t>(q.extra)]);}for(int x:answer)cout<<x<<'\n';}
external_url: https://www.spoj.com/problems/COT2/
external_platform: SPOJ
external_problem_id: COT2
external_title: Count on a tree II
---

樹上莫隊的關鍵不是排序，而是把路徑轉成「奇數次出現」的歐拉序窗口。
