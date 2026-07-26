---
id: luogu-p2633
volume: upper
source_file: upper-volume
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
chapter: 4
section: '4.4'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P2633 Count on a tree：樹路徑第 k 小
difficulty: 5
topics: [主席樹, 樹上前綴, LCA]
prerequisites: [persistent-segment-tree, lca]
statement: 樹上每點有權值。每次詢問兩點簡單路徑上的第 k 小點權；讀入的第一個端點須與上次答案做 XOR。
constraints:
  - '1 <= n, m <= 100000'
  - 點權可用 32 位元有號整數表示
  - 每個 k 不超過對應路徑節點數
input_format: 第一行 n、m，第二行點權，接著 n-1 條邊，最後 m 行 u、v、k；實際 u 為 u XOR last_answer。
output_format: 每次輸出一行第 k 小點權。
samples:
  - input: |
      3 2
      5 1 4
      1 2
      1 3
      2 3 2
      5 2 1
    output: |
      4
      1
    explanation: 路徑 2-1-3 的排序權值為 1、4、5；下一筆讀入端點 5，與前答 4 XOR 後得到節點 1，路徑 1-2 的最小值是 1。
core_knowledge: [根到點前綴版本, 四根容斥, 權值二分]
judgment: 每點到根的權值頻率可存成主席樹；u-v 路徑頻率為 root[u]+root[v]-root[lca]-root[parent(lca)]。
hints:
  - 離散化點權，DFS 時由父親版本插入目前點權得到 root[u]。
  - 求 w=LCA(u,v)，四個版本同步往下；左子樹計數由兩加兩減取得。
  - 若 k 大於左計數就往右並扣除；輸出後更新 last_answer，僅下一筆 u 需要 XOR。
solution_outline: DFS 建立倍增祖先及根路徑主席樹。詢問求 LCA，以四版本容斥在值域線段樹二分第 k 小。
proof_or_invariant: root[x] 精確記錄根到 x 的點權。兩條根路徑相加後，LCA 以上重複，扣除 root[w] 與 root[parent(w)] 後每個 u-v 路徑節點恰保留一次。
complexity:
  time: 預處理 O(n log n)，每次詢問 O(log n)
  space: O(n log n)
common_errors:
  - 容斥扣兩次 root[lca] 而漏掉 LCA
  - 對 v 或 k 也做 XOR
  - 輸出離散下標而非原點權
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>value(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>value[static_cast<size_t>(i)];for(int i=1,u,v;i<n;++i)cin>>u>>v;int last=0;while(m--){int u,v,k;cin>>u>>v>>k;u^=last;last=0;cout<<last<<'\n';}/* TODO：建立 LCA 與四根主席樹查詢。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Node{int left=0,right=0,count=0;};
  static int insert(vector<Node>&t,int old,int l,int r,int p){int id=static_cast<int>(t.size());t.push_back(t[static_cast<size_t>(old)]);++t[static_cast<size_t>(id)].count;if(l==r)return id;int mid=(l+r)/2;if(p<=mid)t[static_cast<size_t>(id)].left=insert(t,t[static_cast<size_t>(old)].left,l,mid,p);else t[static_cast<size_t>(id)].right=insert(t,t[static_cast<size_t>(old)].right,mid+1,r,p);return id;}
  static int kth(const vector<Node>&t,int a,int b,int c,int d,int l,int r,int k){if(l==r)return l;int al=t[static_cast<size_t>(a)].left,bl=t[static_cast<size_t>(b)].left,cl=t[static_cast<size_t>(c)].left,dl=t[static_cast<size_t>(d)].left;int count=t[static_cast<size_t>(al)].count+t[static_cast<size_t>(bl)].count-t[static_cast<size_t>(cl)].count-t[static_cast<size_t>(dl)].count,mid=(l+r)/2;if(k<=count)return kth(t,al,bl,cl,dl,l,mid,k);return kth(t,t[static_cast<size_t>(a)].right,t[static_cast<size_t>(b)].right,t[static_cast<size_t>(c)].right,t[static_cast<size_t>(d)].right,mid+1,r,k-count);}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>value(static_cast<size_t>(n+1)),all;for(int i=1;i<=n;++i){cin>>value[static_cast<size_t>(i)];all.push_back(value[static_cast<size_t>(i)]);}sort(all.begin(),all.end());all.erase(unique(all.begin(),all.end()),all.end());for(int i=1;i<=n;++i)value[static_cast<size_t>(i)]=static_cast<int>(lower_bound(all.begin(),all.end(),value[static_cast<size_t>(i)])-all.begin());vector<vector<int>>g(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;g[static_cast<size_t>(u)].push_back(v);g[static_cast<size_t>(v)].push_back(u);}const int levels=18;vector<array<int,18>>up(static_cast<size_t>(n+1));vector<int>depth(static_cast<size_t>(n+1)),root(static_cast<size_t>(n+1));vector<Node>tree(1);tree.reserve(static_cast<size_t>(n)*20U);function<void(int,int)>dfs=[&](int u,int p){up[static_cast<size_t>(u)][0]=p;for(int j=1;j<levels;++j)up[static_cast<size_t>(u)][static_cast<size_t>(j)]=up[static_cast<size_t>(up[static_cast<size_t>(u)][static_cast<size_t>(j-1)])][static_cast<size_t>(j-1)];root[static_cast<size_t>(u)]=insert(tree,root[static_cast<size_t>(p)],0,static_cast<int>(all.size())-1,value[static_cast<size_t>(u)]);for(int v:g[static_cast<size_t>(u)])if(v!=p){depth[static_cast<size_t>(v)]=depth[static_cast<size_t>(u)]+1;dfs(v,u);}};dfs(1,0);auto lca=[&](int u,int v){if(depth[static_cast<size_t>(u)]<depth[static_cast<size_t>(v)])swap(u,v);int delta=depth[static_cast<size_t>(u)]-depth[static_cast<size_t>(v)];for(int j=0;j<levels;++j)if((delta>>j&1)!=0)u=up[static_cast<size_t>(u)][static_cast<size_t>(j)];if(u==v)return u;for(int j=levels-1;j>=0;--j)if(up[static_cast<size_t>(u)][static_cast<size_t>(j)]!=up[static_cast<size_t>(v)][static_cast<size_t>(j)]){u=up[static_cast<size_t>(u)][static_cast<size_t>(j)];v=up[static_cast<size_t>(v)][static_cast<size_t>(j)];}return up[static_cast<size_t>(u)][0];};int last=0;while(m--){int u,v,k;cin>>u>>v>>k;u^=last;int w=lca(u,v),index=kth(tree,root[static_cast<size_t>(u)],root[static_cast<size_t>(v)],root[static_cast<size_t>(w)],root[static_cast<size_t>(up[static_cast<size_t>(w)][0])],0,static_cast<int>(all.size())-1,k);last=all[static_cast<size_t>(index)];cout<<last<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P2633
external_platform: 洛谷
external_problem_id: P2633
external_title: Count on a tree
---

主席樹節點計數可做線性容斥，因此「樹上前綴」能像陣列前綴一樣相減。
