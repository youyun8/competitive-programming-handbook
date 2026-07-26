---
id: luogu-p3958
volume: upper
source_file: upper-volume
title: 洛谷 P3958 奶酪：球體通道連通性
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - geometry-connectivity
  - disjoint-set-union
  - squared-distance
prerequisites:
  - disjoint-set-union
statement: 高 h 的乳酪中有 n 個半徑 r 的球形空洞。相交或相切空洞可互通；判斷能否由下表面沿空洞到上表面。
constraints:
  - 1 <= T <= 20
  - 1 <= n <= 1000
  - 座標、h、r 為整數
input_format: 先給 T；每組給 n h r，再給 n 個球心 x y z。
output_format: 每組輸出 Yes 或 No。
samples:
  - input: |
      3
      2 4 1
      0 0 1
      0 0 3
      2 5 1
      0 0 1
      0 0 4
      2 5 2
      0 0 2
      2 0 4
    output: |
      Yes
      No
      Yes
    explanation: 第一組兩球相切並分別接觸上下表面；第二組兩球不相接。
core_knowledge: *id001
judgment: 球體相切也算連通；接觸底面條件 z<=r，頂面條件 z+r>=h。
hints:
  - 新增虛擬底面與頂面節點。
  - 兩球心距離不超過 2r 就合併。
  - 全程比較距離平方避免浮點。
solution_outline: 合併相交球與其接觸表面，最後檢查兩虛擬節點同根。
proof_or_invariant: DSU 邊恰表示可直接穿越的接觸關係；其傳遞閉包就是所有可行空洞路徑，兩表面同分量與通路存在等價。
common_errors:
  - 漏算相切
  - 距離平方溢位 int
  - 上下表面判斷用球心而非球面
complexity:
  time: O(n^2 alpha(n))
  space: O(n)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n;long long h,r;cin>>n>>h>>r;vector<array<long long,3>> p(static_cast<size_t>(n));for(auto& x:p)cin>>x[0]>>x[1]>>x[2];DisjointSet dsu(n+2);int bottom=n,top=n+1;for(int i=0;i<n;++i){if(p[static_cast<size_t>(i)][2]<=r)dsu.unite(i,bottom);if(p[static_cast<size_t>(i)][2]+r>=h)dsu.unite(i,top);for(int j=0;j<i;++j){long long dx=p[static_cast<size_t>(i)][0]-p[static_cast<size_t>(j)][0],dy=p[static_cast<size_t>(i)][1]-p[static_cast<size_t>(j)][1],dz=p[static_cast<size_t>(i)][2]-p[static_cast<size_t>(j)][2];if(dx*dx+dy*dy+dz*dz<=4*r*r)dsu.unite(i,j);}}cout<<(dsu.root(bottom)==dsu.root(top)?"Yes":"No")<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}bool unite(int a,int b){a=root(a);b=root(b);if(a==b)return false;if(s[static_cast<size_t>(a)]<s[static_cast<size_t>(b)])swap(a,b);p[static_cast<size_t>(b)]=a;s[static_cast<size_t>(a)]+=s[static_cast<size_t>(b)];return true;}int size(int x){return s[static_cast<size_t>(root(x))];}private:vector<int>p,s;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n;long long h,r;cin>>n>>h>>r;vector<array<long long,3>> p(static_cast<size_t>(n));for(auto& x:p)cin>>x[0]>>x[1]>>x[2];DisjointSet dsu(n+2);int bottom=n,top=n+1;for(int i=0;i<n;++i){if(p[static_cast<size_t>(i)][2]<=r)dsu.unite(i,bottom);if(p[static_cast<size_t>(i)][2]+r>=h)dsu.unite(i,top);for(int j=0;j<i;++j){long long dx=p[static_cast<size_t>(i)][0]-p[static_cast<size_t>(j)][0],dy=p[static_cast<size_t>(i)][1]-p[static_cast<size_t>(j)][1],dz=p[static_cast<size_t>(i)][2]-p[static_cast<size_t>(j)][2];if(dx*dx+dy*dy+dz*dz<=4*r*r)dsu.unite(i,j);}}cout<<(dsu.root(bottom)==dsu.root(top)?"Yes":"No")<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3958
external_platform: 洛谷
external_problem_id: P3958
external_title: 奶酪
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
