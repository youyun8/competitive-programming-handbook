---
id: luogu-p3586
volume: upper
source_file: upper-volume
title: 洛谷 P3586 [POI2015] 物流 Logistics
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - coordinate-compression
  - two-fenwick-trees
  - greedy
prerequisites:
  - fenwick-tree
statement: 序列初值零；U k a 賦值。Z c s 問能否重複 s 次，每次選 c 個正數各減一（詢問不改序列）。
constraints:
  - n,m <= 1000000
  - a,s <= 1000000000
input_format: 輸入 n m 與 m 個 U/Z 操作。
output_format: 每個 Z 輸出 TAK 或 NIE。
samples:
  - input: |
      3 4
      U 1 5
      U 2 7
      Z 2 6
      Z 2 5
    output: |
      NIE
      TAK
    explanation: 把每值截為 s 後，總供應量需至少 c*s。
core_knowledge: *id001
judgment: 離散所有更新值，動態維護前綴計數與和並檢查截斷總和。
hints:
  - 每個位置最多能在 s 輪中貢獻 min(a_i,s) 次。
  - 可行充要條件是 sum min(a_i,s) >= c*s。
  - 用兩棵權值 BIT 維護值的個數與總和。
solution_outline: 離散所有更新值，動態維護前綴計數與和並檢查截斷總和。
proof_or_invariant: 必要性顯然；充分性可每輪選目前剩餘最大的 c 個，若提前不足 c 個正數便會違反截斷總量條件。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O(m log m)
  space: O(n+m)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Op{char type;int x;long long y;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<Op>ops(static_cast<size_t>(m));vector<long long>values{0};for(auto&o:ops){cin>>o.type>>o.x>>o.y;if(o.type=='U')values.push_back(o.y);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());Fenwick counts(static_cast<int>(values.size())),sums(static_cast<int>(values.size()));vector<long long>a(static_cast<size_t>(n+1));counts.add(1,n);for(auto o:ops){if(o.type=='U'){int old=static_cast<int>(lower_bound(values.begin(),values.end(),a[static_cast<size_t>(o.x)])-values.begin())+1;int now=static_cast<int>(lower_bound(values.begin(),values.end(),o.y)-values.begin())+1;counts.add(old,-1);sums.add(old,-a[static_cast<size_t>(o.x)]);a[static_cast<size_t>(o.x)]=o.y;counts.add(now,1);sums.add(now,o.y);}else{int below=static_cast<int>(lower_bound(values.begin(),values.end(),o.y)-values.begin());long long small_sum=sums.sum(below);long long large_count=counts.sum(static_cast<int>(values.size()))-counts.sum(below);cout<<(small_sum+large_count*o.y>=static_cast<long long>(o.x)*o.y?"TAK":"NIE")<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Op{char type;int x;long long y;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<Op>ops(static_cast<size_t>(m));vector<long long>values{0};for(auto&o:ops){cin>>o.type>>o.x>>o.y;if(o.type=='U')values.push_back(o.y);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());Fenwick counts(static_cast<int>(values.size())),sums(static_cast<int>(values.size()));vector<long long>a(static_cast<size_t>(n+1));counts.add(1,n);for(auto o:ops){if(o.type=='U'){int old=static_cast<int>(lower_bound(values.begin(),values.end(),a[static_cast<size_t>(o.x)])-values.begin())+1;int now=static_cast<int>(lower_bound(values.begin(),values.end(),o.y)-values.begin())+1;counts.add(old,-1);sums.add(old,-a[static_cast<size_t>(o.x)]);a[static_cast<size_t>(o.x)]=o.y;counts.add(now,1);sums.add(now,o.y);}else{int below=static_cast<int>(lower_bound(values.begin(),values.end(),o.y)-values.begin());long long small_sum=sums.sum(below);long long large_count=counts.sum(static_cast<int>(values.size()))-counts.sum(below);cout<<(small_sum+large_count*o.y>=static_cast<long long>(o.x)*o.y?"TAK":"NIE")<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P3586
external_platform: Luogu
external_problem_id: P3586
external_title: 洛谷 P3586 [POI2015] 物流 Logistics
external_relation: original
source_book_pages:
  - 151
  - 170
source_pdf_pages:
  - 169
  - 188
review_status: verified
---

本卡片依外部題面與限制獨立整理。
