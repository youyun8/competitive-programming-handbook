---
id: luogu-p3302
volume: upper
source_file: upper-volume
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
chapter: 4
section: '4.4'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3302 森林：動態連邊與路徑第 k 小
difficulty: 5
topics: [主席樹, 啟發式合併, LCA]
prerequisites: [persistent-segment-tree, disjoint-set, lca]
statement: 帶點權森林支援兩種在線操作：連接兩個不同連通塊，或查詢已連通兩點路徑上的第 k 小點權。操作參數都與上次答案 XOR。
constraints:
  - '測試點編號 1..20；n、初始邊數、操作數 <= 80000'
  - 連邊後仍為森林；查詢兩點連通且路徑至少有 k 點
  - 點權為非負 32 位元整數
input_format: 第一行測試點編號；第二行 n、m、t；第三行點權，接著 m 條邊及 t 個 `Q x y k`／`L x y` 操作。
output_format: 每個 Q 操作輸出一行答案並更新 last_answer。
samples:
  - input: |
      1
      3 1 3
      5 1 4
      1 2
      Q 1 2 1
      L 3 2
      Q 0 2 3
    output: |
      1
      4
    explanation: 首次查 1-2 最小值為 1；解碼後連接 2-3，最後查 1-3 的第二小值為 4。
core_knowledge: [樹路徑主席樹, 小併大重建, 動態祖先表]
judgment: 連邊只合併連通塊；每次把較小塊掛到較大塊並重建其根路徑版本，任一節點最多被重建 O(log n) 次。
hints:
  - 靜態時 root[u]+root[v]-root[lca]-root[parent(lca)] 可求路徑第 k 小。
  - 連邊前以 DSU 比較兩塊大小，讓小塊端點成為大塊端點的孩子。
  - 從小塊端點 DFS，重算深度、倍增祖先與主席樹根，再合併 DSU；所有輸入參數先 XOR。
solution_outline: 初始化每棵樹的祖先與主席樹。Q 使用 LCA 四根查詢；L 以 DSU 小併大，新增邊後遍歷較小連通塊，依新父子方向重建資訊。
proof_or_invariant: 每個節點 root 始終表示目前樹根到該點的權值。連接時大塊資訊不變，小塊每點沿唯一新父鏈重建後恢復不變量；四根容斥遂一直有效。小併大保證重建總量 O(n log n)。
complexity:
  time: O((n+t)log²n)
  space: O((n+t)log n)
common_errors:
  - 把較大連通塊掛到較小塊而退化
  - 重建時沿新增邊走回大塊
  - Q 的 k 以及 L 的兩端忘記 XOR
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int testcase,n,m,t;cin>>testcase>>n>>m>>t;vector<int>value(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>value[static_cast<size_t>(i)];vector<vector<int>>g(static_cast<size_t>(n+1));for(int i=0,u,v;i<m;++i){cin>>u>>v;g[static_cast<size_t>(u)].push_back(v);g[static_cast<size_t>(v)].push_back(u);}int last=0;while(t--){char op;int x,y;cin>>op>>x>>y;x^=last;y^=last;if(op=='L'){g[static_cast<size_t>(x)].push_back(y);g[static_cast<size_t>(y)].push_back(x);}else{int k;cin>>k;k^=last;last=0;cout<<last<<'\n';}}/* TODO：小併大重建主席樹。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Node{int left=0,right=0,count=0;};
  static int insert(vector<Node>&tr,int old,int l,int r,int p){int id=static_cast<int>(tr.size());tr.push_back(tr[static_cast<size_t>(old)]);++tr[static_cast<size_t>(id)].count;if(l==r)return id;int mid=(l+r)/2;if(p<=mid)tr[static_cast<size_t>(id)].left=insert(tr,tr[static_cast<size_t>(old)].left,l,mid,p);else tr[static_cast<size_t>(id)].right=insert(tr,tr[static_cast<size_t>(old)].right,mid+1,r,p);return id;}
  static int kth(const vector<Node>&tr,int a,int b,int c,int d,int l,int r,int k){if(l==r)return l;int al=tr[static_cast<size_t>(a)].left,bl=tr[static_cast<size_t>(b)].left,cl=tr[static_cast<size_t>(c)].left,dl=tr[static_cast<size_t>(d)].left,count=tr[static_cast<size_t>(al)].count+tr[static_cast<size_t>(bl)].count-tr[static_cast<size_t>(cl)].count-tr[static_cast<size_t>(dl)].count,mid=(l+r)/2;if(k<=count)return kth(tr,al,bl,cl,dl,l,mid,k);return kth(tr,tr[static_cast<size_t>(a)].right,tr[static_cast<size_t>(b)].right,tr[static_cast<size_t>(c)].right,tr[static_cast<size_t>(d)].right,mid+1,r,k-count);}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int testcase,n,m,operation_count;cin>>testcase>>n>>m>>operation_count;vector<int>value(static_cast<size_t>(n+1)),all;for(int i=1;i<=n;++i){cin>>value[static_cast<size_t>(i)];all.push_back(value[static_cast<size_t>(i)]);}sort(all.begin(),all.end());all.erase(unique(all.begin(),all.end()),all.end());for(int i=1;i<=n;++i)value[static_cast<size_t>(i)]=static_cast<int>(lower_bound(all.begin(),all.end(),value[static_cast<size_t>(i)])-all.begin());vector<vector<int>>g(static_cast<size_t>(n+1));vector<int>dsu(static_cast<size_t>(n+1)),component_size(static_cast<size_t>(n+1),1);iota(dsu.begin(),dsu.end(),0);function<int(int)>find_root=[&](int x){while(dsu[static_cast<size_t>(x)]!=x)x=dsu[static_cast<size_t>(x)];return x;};for(int i=0,u,v;i<m;++i){cin>>u>>v;g[static_cast<size_t>(u)].push_back(v);g[static_cast<size_t>(v)].push_back(u);int a=find_root(u),b=find_root(v);if(a!=b){dsu[static_cast<size_t>(b)]=a;component_size[static_cast<size_t>(a)]+=component_size[static_cast<size_t>(b)];}}const int levels=17;vector<array<int,17>>up(static_cast<size_t>(n+1));vector<int>depth(static_cast<size_t>(n+1)),root(static_cast<size_t>(n+1));vector<unsigned char>visited(static_cast<size_t>(n+1));vector<Node>tree(1);tree.reserve(static_cast<size_t>(n)*300U);function<void(int,int)>rebuild=[&](int u,int p){up[static_cast<size_t>(u)][0]=p;depth[static_cast<size_t>(u)]=depth[static_cast<size_t>(p)]+1;for(int j=1;j<levels;++j)up[static_cast<size_t>(u)][static_cast<size_t>(j)]=up[static_cast<size_t>(up[static_cast<size_t>(u)][static_cast<size_t>(j-1)])][static_cast<size_t>(j-1)];root[static_cast<size_t>(u)]=insert(tree,root[static_cast<size_t>(p)],0,static_cast<int>(all.size())-1,value[static_cast<size_t>(u)]);for(int v:g[static_cast<size_t>(u)])if(v!=p)rebuild(v,u);};for(int i=1;i<=n;++i)if(visited[static_cast<size_t>(i)]==0){function<void(int,int)>mark=[&](int u,int p){visited[static_cast<size_t>(u)]=1;up[static_cast<size_t>(u)][0]=p;depth[static_cast<size_t>(u)]=depth[static_cast<size_t>(p)]+1;for(int j=1;j<levels;++j)up[static_cast<size_t>(u)][static_cast<size_t>(j)]=up[static_cast<size_t>(up[static_cast<size_t>(u)][static_cast<size_t>(j-1)])][static_cast<size_t>(j-1)];root[static_cast<size_t>(u)]=insert(tree,root[static_cast<size_t>(p)],0,static_cast<int>(all.size())-1,value[static_cast<size_t>(u)]);for(int v:g[static_cast<size_t>(u)])if(v!=p)mark(v,u);};mark(i,0);}auto lca=[&](int u,int v){if(depth[static_cast<size_t>(u)]<depth[static_cast<size_t>(v)])swap(u,v);int delta=depth[static_cast<size_t>(u)]-depth[static_cast<size_t>(v)];for(int j=0;j<levels;++j)if((delta>>j&1)!=0)u=up[static_cast<size_t>(u)][static_cast<size_t>(j)];if(u==v)return u;for(int j=levels-1;j>=0;--j)if(up[static_cast<size_t>(u)][static_cast<size_t>(j)]!=up[static_cast<size_t>(v)][static_cast<size_t>(j)]){u=up[static_cast<size_t>(u)][static_cast<size_t>(j)];v=up[static_cast<size_t>(v)][static_cast<size_t>(j)];}return up[static_cast<size_t>(u)][0];};int last=0;while(operation_count--){char op;int x,y;cin>>op>>x>>y;x^=last;y^=last;if(op=='Q'){int k;cin>>k;k^=last;int w=lca(x,y),index=kth(tree,root[static_cast<size_t>(x)],root[static_cast<size_t>(y)],root[static_cast<size_t>(w)],root[static_cast<size_t>(up[static_cast<size_t>(w)][0])],0,static_cast<int>(all.size())-1,k);last=all[static_cast<size_t>(index)];cout<<last<<'\n';}else{int rx=find_root(x),ry=find_root(y);if(component_size[static_cast<size_t>(rx)]>component_size[static_cast<size_t>(ry)]){swap(x,y);swap(rx,ry);}g[static_cast<size_t>(x)].push_back(y);g[static_cast<size_t>(y)].push_back(x);rebuild(x,y);dsu[static_cast<size_t>(rx)]=ry;component_size[static_cast<size_t>(ry)]+=component_size[static_cast<size_t>(rx)];}}}
external_url: https://www.luogu.com.cn/problem/P3302
external_platform: 洛谷
external_problem_id: P3302
external_title: '[SDOI2013] 森林'
---

動態連邊並不一定要 Link-Cut Tree；只增不刪的森林可用小併大重建靜態資訊。
