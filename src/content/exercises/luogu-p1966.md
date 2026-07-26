---
id: luogu-p1966
volume: upper
source_file: upper-volume
title: 洛谷 P1966 火柴排隊
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - sorting
  - rank-matching
  - inversion-count
prerequisites:
  - fenwick-tree
statement: 可相鄰交換第二列火柴，使兩列對應高度差平方和最小；求最少交換數模 99999997。
constraints:
  - n <= 100000
  - 每列高度互異
input_format: 輸入 n、第一列、第二列高度。
output_format: 輸出最少交換數模 99999997。
samples:
  - input: |
      4
      2 3 1 4
      3 2 1 4
    output: |
      1
    explanation: 兩列同名次火柴應對齊，只需交換第二列前兩根。
core_knowledge: *id001
judgment: 排序建立名次映射，以 BIT 計逆序並取模。
hints:
  - 重排不等式指出最小平方差由相同高度名次配對。
  - 把第一列位置映射到第二列同名次的位置。
  - 所需最少相鄰交換數就是此位置排列的逆序數。
solution_outline: 排序建立名次映射，以 BIT 計逆序並取模。
proof_or_invariant: 相同名次配對使內積最大、平方差和最小；排列轉換的最少相鄰交換數等於逆序數。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O(n log n)
  space: O(n)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<pair<int,int>>a(static_cast<size_t>(n)),b(static_cast<size_t>(n));for(int i=0;i<n;++i){cin>>a[static_cast<size_t>(i)].first;a[static_cast<size_t>(i)].second=i;}for(int i=0;i<n;++i){cin>>b[static_cast<size_t>(i)].first;b[static_cast<size_t>(i)].second=i;}sort(a.begin(),a.end());sort(b.begin(),b.end());vector<int>target(static_cast<size_t>(n));for(int rank=0;rank<n;++rank)target[static_cast<size_t>(a[static_cast<size_t>(rank)].second)]=b[static_cast<size_t>(rank)].second+1;Fenwick bit(n);long long ans=0;constexpr long long mod=99999997;for(int i=0;i<n;++i){int x=target[static_cast<size_t>(i)];ans=(ans+i-bit.sum(x))%mod;bit.add(x,1);}cout<<ans<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<pair<int,int>>a(static_cast<size_t>(n)),b(static_cast<size_t>(n));for(int i=0;i<n;++i){cin>>a[static_cast<size_t>(i)].first;a[static_cast<size_t>(i)].second=i;}for(int i=0;i<n;++i){cin>>b[static_cast<size_t>(i)].first;b[static_cast<size_t>(i)].second=i;}sort(a.begin(),a.end());sort(b.begin(),b.end());vector<int>target(static_cast<size_t>(n));for(int rank=0;rank<n;++rank)target[static_cast<size_t>(a[static_cast<size_t>(rank)].second)]=b[static_cast<size_t>(rank)].second+1;Fenwick bit(n);long long ans=0;constexpr long long mod=99999997;for(int i=0;i<n;++i){int x=target[static_cast<size_t>(i)];ans=(ans+i-bit.sum(x))%mod;bit.add(x,1);}cout<<ans<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1966
external_platform: Luogu
external_problem_id: P1966
external_title: 洛谷 P1966 火柴排隊
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
