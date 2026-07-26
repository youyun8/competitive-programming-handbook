---
id: luogu-p1955
volume: upper
source_file: upper-volume
title: 洛谷 P1955 程序自動分析：離散化約束一致性
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 4
topics: &id001
  - coordinate-compression
  - disjoint-set-union
  - constraint-satisfaction
prerequisites:
  - disjoint-set-union
statement: 給出變數編號間的相等或不等約束，判斷是否存在整數賦值同時滿足所有條件。
constraints:
  - 測試資料數不超過 10
  - 每組約束 n <= 100000
  - 變數編號可達 10^9
input_format: 先給 T；每組給 n，再給 n 行 i j e，e=1 相等、e=0 不等。
output_format: 每組輸出 YES 或 NO。
samples:
  - input: |
      2
      2
      1 2 1
      1 2 0
      2
      1 2 1
      2 1 1
    output: |
      NO
      YES
    explanation: 第一組同一對變數同時要求相等與不等；第二組只有相等條件，可滿足。
core_knowledge: *id001
judgment: 不等關係彼此不具傳遞性，只需檢查其兩端是否被等式閉包合併。
hints:
  - 先收集實際出現的巨大編號做離散化。
  - 第一遍只合併所有等式。
  - 第二遍檢查每條不等式兩端是否同根。
solution_outline: 排序去重編號，DSU 合併 e=1，再驗證 e=0。
proof_or_invariant: 等式可滿足賦值必須在每個 DSU 分量取同值；若不等式位於同分量則矛盾，否則可給各分量不同值，故條件充要。
common_errors:
  - 按輸入順序遇不等式就提前判斷
  - 直接開 10^9 陣列
  - 把不等式也合併
complexity:
  time: O(n log n)
  space: O(n)
cpp_skeleton: |
  // TODO：先自行實作核心資料結構；此框架保持可嚴格編譯。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n)){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}void unite(int a,int b){a=root(a);b=root(b);if(a!=b)p[static_cast<size_t>(a)]=b;}private:vector<int>p;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n;cin>>n;vector<tuple<long long,long long,int>> rule(static_cast<size_t>(n));vector<long long> values;for(auto& [a,b,e]:rule){cin>>a>>b>>e;values.push_back(a);values.push_back(b);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());DisjointSet dsu(static_cast<int>(values.size()));auto id=[&](long long x){return static_cast<int>(lower_bound(values.begin(),values.end(),x)-values.begin());};for(auto [a,b,e]:rule)if(e==1)dsu.unite(id(a),id(b));bool ok=true;for(auto [a,b,e]:rule)if(e==0&&dsu.root(id(a))==dsu.root(id(b)))ok=false;cout<<(ok?"YES":"NO")<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet{public:explicit DisjointSet(int n):p(static_cast<size_t>(n)){iota(p.begin(),p.end(),0);}int root(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=root(p[static_cast<size_t>(x)]);}void unite(int a,int b){a=root(a);b=root(b);if(a!=b)p[static_cast<size_t>(a)]=b;}private:vector<int>p;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n;cin>>n;vector<tuple<long long,long long,int>> rule(static_cast<size_t>(n));vector<long long> values;for(auto& [a,b,e]:rule){cin>>a>>b>>e;values.push_back(a);values.push_back(b);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());DisjointSet dsu(static_cast<int>(values.size()));auto id=[&](long long x){return static_cast<int>(lower_bound(values.begin(),values.end(),x)-values.begin());};for(auto [a,b,e]:rule)if(e==1)dsu.unite(id(a),id(b));bool ok=true;for(auto [a,b,e]:rule)if(e==0&&dsu.root(id(a))==dsu.root(id(b)))ok=false;cout<<(ok?"YES":"NO")<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P1955
external_platform: 洛谷
external_problem_id: P1955
external_title: 程序自動分析
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
