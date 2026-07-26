---
id: luogu-p4185
volume: upper
source_file: upper-volume
title: 洛谷 P4185 MooTube G：離線門檻連通
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - offline-query
  - disjoint-set-union
  - sorting
prerequisites:
  - disjoint-set-union
statement: 影片構成加權樹，兩影片相關值為唯一路徑上的最小邊權。每個查詢給 k、v，求除 v 外與 v 相關值至少 k 的影片數。
constraints:
  - 1 <= N,Q <= 100000
  - 邊權與 k 介於 1 到 10^9
input_format: 先給 N、Q；N-1 條 p q r；再給 Q 條 k v。
output_format: 依原順序輸出每個查詢答案。
samples:
  - input: |
      4 3
      1 2 3
      2 3 2
      2 4 4
      1 2
      4 1
      3 1
    output: |
      3
      0
      2
    explanation: 門檻 1 時影片 2 可到其餘三部；門檻 4 時影片 1 沒有合格鄰接路徑。
core_knowledge: *id001
judgment: 路徑相關值是最小邊權，所以相關值至少 k 等價於只走權值至少 k 的邊。
hints:
  - 把查詢依 k 由大到小排序。
  - 同樣由大到小逐步加入合格邊。
  - 答案是 v 所在分量大小減一。
solution_outline: 離線排序邊與查詢，移動單調指標加入邊，以 DSU 分量大小回答。
proof_or_invariant: 回答門檻 k 時 DSU 恰包含權值至少 k 的邊；樹上兩點同分量當且僅當其路徑每條邊均至少 k。
common_errors:
  - 使用嚴格大於而漏掉等於 k 的邊
  - 忘記扣除 v 本身
  - 排序後未按 id 還原答案
complexity:
  time: O((N+Q) log(N+Q))
  space: O(N+Q)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;vector<array<int,3>> edges(static_cast<size_t>(n-1));for(auto& e:edges)cin>>e[1]>>e[2]>>e[0];struct Query{int k,v,id;};vector<Query> queries(static_cast<size_t>(q));for(int i=0;i<q;++i){cin>>queries[static_cast<size_t>(i)].k>>queries[static_cast<size_t>(i)].v;queries[static_cast<size_t>(i)].id=i;}sort(edges.begin(),edges.end(),greater<array<int,3>>());sort(queries.begin(),queries.end(),[](const Query&a,const Query&b){return a.k>b.k;});DisjointSet dsu(n);vector<int> answer(static_cast<size_t>(q));size_t j=0;for(auto query:queries){while(j<edges.size()&&edges[j][0]>=query.k){dsu.unite(edges[j][1],edges[j][2]);++j;}answer[static_cast<size_t>(query.id)]=dsu.size(query.v)-1;}for(int x:answer)cout<<x<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;vector<array<int,3>> edges(static_cast<size_t>(n-1));for(auto& e:edges)cin>>e[1]>>e[2]>>e[0];struct Query{int k,v,id;};vector<Query> queries(static_cast<size_t>(q));for(int i=0;i<q;++i){cin>>queries[static_cast<size_t>(i)].k>>queries[static_cast<size_t>(i)].v;queries[static_cast<size_t>(i)].id=i;}sort(edges.begin(),edges.end(),greater<array<int,3>>());sort(queries.begin(),queries.end(),[](const Query&a,const Query&b){return a.k>b.k;});DisjointSet dsu(n);vector<int> answer(static_cast<size_t>(q));size_t j=0;for(auto query:queries){while(j<edges.size()&&edges[j][0]>=query.k){dsu.unite(edges[j][1],edges[j][2]);++j;}answer[static_cast<size_t>(query.id)]=dsu.size(query.v)-1;}for(int x:answer)cout<<x<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4185
external_platform: 洛谷
external_problem_id: P4185
external_title: MooTube G
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
---

先明確寫下資料結構不變量，再推導合併公式。
