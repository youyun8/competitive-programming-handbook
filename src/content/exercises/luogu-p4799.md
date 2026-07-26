---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - graph-search
id: luogu-p4799
title: 洛谷 P4799 世界冰球錦標賽
section: '3.5'
statement: 有 n 場比賽，每場門票價格給定；預算為 m，可任選若干場（也可一場不選），求總價不超過 m 的選法數。
constraints:
  - 1 <= n <= 40
  - 0 <= m <= 10^18
  - 票價為非負整數
judge: 空集合也是一種選法；每場至多選一次。
hints:
  - 把最多四十個價格分成兩半。
  - 枚舉每半所有子集和，保留不超過 m 的值。
  - 排序右半；對每個左半和，用 upper_bound 計算可搭配的右半數量。
input_format: 第一行 n、m；第二行 n 個票價。
output_format: 輸出總價不超預算的子集數。
samples:
  - input: |
      3 10
      1 2 4
    output: '8'
    explanation: 所有八個子集總價都不超過十。
core_knowledge:
  - 折半搜尋
  - 排序加二分計數
solution_outline: meet-in-the-middle 枚舉兩側 2^(n/2) 個和，排序後二分配對計數。
proof_or_invariant: 每個完整子集唯一分解為左右兩半子集；對固定左和，upper_bound 恰計數所有使總和不超 m 的右和。累加不重不漏。
complexity:
  time: O(2^(n/2) log 2^(n/2))
  space: O(2^(n/2))
common_errors:
  - 漏算空集合
  - 使用 32 位整數存總價或答案
  - 二分使用 lower_bound
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;int main(){int n;long long budget;cin>>n>>budget;vector<long long>a(n);for(auto&x:a)cin>>x;int mid=n/2;auto sums=[&](int l,int r){vector<long long>v{0};for(int i=l;i<r;++i){size_t size=v.size();for(size_t j=0;j<size;++j)if(v[j]+a[i]<=budget)v.push_back(v[j]+a[i]);}return v;};auto left=sums(0,mid),right=sums(mid,n);sort(right.begin(),right.end());long long ans=0;for(long long x:left)ans+=upper_bound(right.begin(),right.end(),budget-x)-right.begin();cout<<ans<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;int main(){int n;long long budget;cin>>n>>budget;vector<long long>a(n);for(auto&x:a)cin>>x;int mid=n/2;auto sums=[&](int l,int r){vector<long long>v{0};for(int i=l;i<r;++i){size_t size=v.size();for(size_t j=0;j<size;++j)if(v[j]+a[i]<=budget)v.push_back(v[j]+a[i]);}return v;};auto left=sums(0,mid),right=sums(mid,n);sort(right.begin(),right.end());long long ans=0;for(long long x:left)ans+=upper_bound(right.begin(),right.end(),budget-x)-right.begin();cout<<ans<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4799
external_platform: 洛谷
external_problem_id: P4799
external_title: 洛谷 P4799 世界冰球錦標賽
external_relation: original
source_book_pages:
  - 131
source_pdf_pages:
  - 149
review_status: verified
---

依官方或可信存檔題面獨立重述與實作。
