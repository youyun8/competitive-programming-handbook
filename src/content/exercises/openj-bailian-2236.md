---
id: openj-bailian-2236
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2236 Wireless Network：逐步修復連通性
chapter: 4
section: '4.1'
kind: external-oj
difficulty: 3
topics: &id001
  - disjoint-set-union
  - incremental-connectivity
  - squared-distance
prerequisites:
  - disjoint-set-union
statement: n 台電腦起初全壞；距離不超過 d 的兩台已修電腦可直接通訊，也可透過其他已修電腦轉送。處理修復 O p 與連通查詢 S p q。
constraints:
  - 1 <= N <= 1001
  - 0 <= d <= 20000
  - 座標介於 0 與 10000；總輸入不超過 300000 行
input_format: 先給 N、d 與 N 個座標；之後讀到 EOF，每行為 O p 或 S p q。
output_format: 每次 S 輸出 SUCCESS 或 FAIL。
samples:
  - input: |
      4 1
      0 1
      0 2
      0 3
      0 4
      O 1
      O 2
      O 4
      S 1 4
      O 3
      S 1 4
    output: |
      FAIL
      SUCCESS
    explanation: 修復 3 前，1、2 與 4 分離；修復後四台形成距離一的鏈。
core_knowledge: *id001
judgment: 損壞電腦即使座標相近也不能通訊；重複 O 不應破壞狀態。
hints:
  - 只會新增可用節點，不會刪除連線。
  - 修復 p 時檢查它與每台已修電腦的距離。
  - 比較平方距離避免浮點誤差。
solution_outline: 維護 active；每次首次修復掃描所有 active 節點並合併距離合格者，查詢同時要求兩端 active 且同根。
proof_or_invariant: 每條可用邊恰在較晚端點修復時加入，因此並查集始終等於目前已修電腦圖的連通分量。
common_errors:
  - 查詢未檢查端點是否修復
  - 用 sqrt 浮點比較
  - 重複修復造成額外處理
complexity:
  time: O(N^2 alpha(N)+操作數 alpha(N))
  space: O(N)
cpp_skeleton: |
  // TODO：先自行重建核心不變量，再與下列可編譯框架比較。
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet { public: explicit DisjointSet(int n): parent_(static_cast<size_t>(n)), size_(static_cast<size_t>(n),1){iota(parent_.begin(),parent_.end(),0);} int find_root(int x){if(parent_[static_cast<size_t>(x)]!=x) parent_[static_cast<size_t>(x)]=find_root(parent_[static_cast<size_t>(x)]); return parent_[static_cast<size_t>(x)];} bool unite(int a,int b){a=find_root(a); b=find_root(b); if(a==b)return false; if(size_[static_cast<size_t>(a)]<size_[static_cast<size_t>(b)])swap(a,b); parent_[static_cast<size_t>(b)]=a; size_[static_cast<size_t>(a)]+=size_[static_cast<size_t>(b)]; return true;} int component_size(int x){return size_[static_cast<size_t>(find_root(x))];} private: vector<int> parent_,size_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,d;if(!(cin>>n>>d))return 0;vector<pair<int,int>> point(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>point[static_cast<size_t>(i)].first>>point[static_cast<size_t>(i)].second;DisjointSet dsu(n+1);vector<char> active(static_cast<size_t>(n+1),0);char op;while(cin>>op){int a,b;if(op=='O'){cin>>a;if(active[static_cast<size_t>(a)]!=0)continue;active[static_cast<size_t>(a)]=1;for(int j=1;j<=n;++j)if(active[static_cast<size_t>(j)]!=0){long long dx=point[static_cast<size_t>(a)].first-point[static_cast<size_t>(j)].first;long long dy=point[static_cast<size_t>(a)].second-point[static_cast<size_t>(j)].second;if(dx*dx+dy*dy<=1LL*d*d)dsu.unite(a,j);}}else{cin>>a>>b;cout<<((active[static_cast<size_t>(a)]!=0&&active[static_cast<size_t>(b)]!=0&&dsu.find_root(a)==dsu.find_root(b))?"SUCCESS":"FAIL")<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class DisjointSet { public: explicit DisjointSet(int n): parent_(static_cast<size_t>(n)), size_(static_cast<size_t>(n),1){iota(parent_.begin(),parent_.end(),0);} int find_root(int x){if(parent_[static_cast<size_t>(x)]!=x) parent_[static_cast<size_t>(x)]=find_root(parent_[static_cast<size_t>(x)]); return parent_[static_cast<size_t>(x)];} bool unite(int a,int b){a=find_root(a); b=find_root(b); if(a==b)return false; if(size_[static_cast<size_t>(a)]<size_[static_cast<size_t>(b)])swap(a,b); parent_[static_cast<size_t>(b)]=a; size_[static_cast<size_t>(a)]+=size_[static_cast<size_t>(b)]; return true;} int component_size(int x){return size_[static_cast<size_t>(find_root(x))];} private: vector<int> parent_,size_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,d;if(!(cin>>n>>d))return 0;vector<pair<int,int>> point(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>point[static_cast<size_t>(i)].first>>point[static_cast<size_t>(i)].second;DisjointSet dsu(n+1);vector<char> active(static_cast<size_t>(n+1),0);char op;while(cin>>op){int a,b;if(op=='O'){cin>>a;if(active[static_cast<size_t>(a)]!=0)continue;active[static_cast<size_t>(a)]=1;for(int j=1;j<=n;++j)if(active[static_cast<size_t>(j)]!=0){long long dx=point[static_cast<size_t>(a)].first-point[static_cast<size_t>(j)].first;long long dy=point[static_cast<size_t>(a)].second-point[static_cast<size_t>(j)].second;if(dx*dx+dy*dy<=1LL*d*d)dsu.unite(a,j);}}else{cin>>a>>b;cout<<((active[static_cast<size_t>(a)]!=0&&active[static_cast<size_t>(b)]!=0&&dsu.find_root(a)==dsu.find_root(b))?"SUCCESS":"FAIL")<<'\n';}}}
external_url: http://bailian.openjudge.cn/practice/2236/
external_platform: OpenJ_Bailian
external_problem_id: '2236'
external_title: Wireless Network
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
---

本題卡片依官方題面重新敘述，程式採 C++17。
