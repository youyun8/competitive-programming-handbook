---
id: luogu-p1111
volume: upper
source_file: upper-volume
title: 洛谷 P1111 修復公路：最早全連通時刻
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - kruskal
  - disjoint-set-union
  - connectivity-threshold
prerequisites:
  - disjoint-set-union
statement: n 個村莊與 m 條受損道路，每條道路在指定時刻完成修復。求所有村莊首次能互通的最早時刻；若永遠無法全連通輸出 -1。
constraints:
  - 1 <= n <= 1000
  - 1 <= m <= 100000
  - 道路完成時間為正整數
input_format: 第一行 n、m；接著 m 行 x y t。
output_format: 輸出最早全連通時刻，或 -1。
samples:
  - input: |
      4 4
      1 2 6
      1 3 4
      1 4 5
      4 2 3
    output: |
      5
    explanation: 時刻五時已修道路讓四個村莊連成一體，時刻四仍未全連通。
core_knowledge: *id001
judgment: 同一時刻多條道路的先後不影響首次全連通的時刻。
hints:
  - 依修復時間由小到大加入道路。
  - 成功合併代表連通分量減一。
  - 分量第一次變成一時，當前時間即答案。
solution_outline: 排序道路後做 Kruskal 式合併，維護分量數。
proof_or_invariant: 處理到時間 t 後 DSU 恰包含所有完成時間不大於 t 的道路，因此首次單一分量的 t 正是最早可互通時刻。
common_errors:
  - 取最大道路時間而非首次連通時間
  - 失敗合併也減分量
  - 不連通時未輸出 -1
complexity:
  time: O(m log m)
  space: O(n+m)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<array<int,3>> road(static_cast<size_t>(m));for(auto& e:road)cin>>e[0]>>e[1]>>e[2];sort(road.begin(),road.end(),[](auto a,auto b){return a[2]<b[2];});DisjointSet dsu(n);int components=n;for(auto e:road)if(dsu.unite(e[0],e[1])){--components;if(components==1){cout<<e[2]<<'\n';return 0;}}cout<<-1<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<array<int,3>> road(static_cast<size_t>(m));for(auto& e:road)cin>>e[0]>>e[1]>>e[2];sort(road.begin(),road.end(),[](auto a,auto b){return a[2]<b[2];});DisjointSet dsu(n);int components=n;for(auto e:road)if(dsu.unite(e[0],e[1])){--components;if(components==1){cout<<e[2]<<'\n';return 0;}}cout<<-1<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1111
external_platform: 洛谷
external_problem_id: P1111
external_title: 修復公路
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
