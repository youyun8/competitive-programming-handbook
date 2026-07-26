---
id: luogu-p3368
volume: upper
source_file: upper-volume
title: 洛谷 P3368【模板】樹狀陣列 2
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 2
topics: &id001
  - fenwick-tree
  - difference-array
prerequisites:
  - fenwick-tree
statement: 維護序列的區間加值與單點查詢。
constraints:
  - n,m <= 500000
  - 增量與答案需 long long
input_format: n m、初值；1 x y k 區間加，2 x 單點查。
output_format: 每個操作 2 輸出答案。
samples:
  - input: |
      5 3
      1 5 4 2 3
      1 2 4 2
      2 3
      2 5
    output: |
      6
      3
    explanation: 區間加後位置 3 為 6，位置 5 不變。
core_knowledge: *id001
judgment: 差分陣列上做兩次單點更新與前綴查詢。
hints:
  - 改維護差分 d[i]=a[i]-a[i-1]。
  - '[l,r] 加 k 只需 d[l]+=k、d[r+1]-=k。'
  - a[x] 是差分前綴和。
solution_outline: 差分陣列上做兩次單點更新與前綴查詢。
proof_or_invariant: 差分更新在 l 起增加、r 後抵銷，故只有閉區間內還原值增加 k。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O((n+m) log n)
  space: O(n)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Fenwick bit(n);long long previous=0;for(int i=1;i<=n;++i){long long x;cin>>x;bit.add(i,x-previous);previous=x;}while(m--){int op;cin>>op;if(op==1){int l,r;long long k;cin>>l>>r>>k;bit.add(l,k);if(r<n)bit.add(r+1,-k);}else{int x;cin>>x;cout<<bit.sum(x)<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Fenwick bit(n);long long previous=0;for(int i=1;i<=n;++i){long long x;cin>>x;bit.add(i,x-previous);previous=x;}while(m--){int op;cin>>op;if(op==1){int l,r;long long k;cin>>l>>r>>k;bit.add(l,k);if(r<n)bit.add(r+1,-k);}else{int x;cin>>x;cout<<bit.sum(x)<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P3368
external_platform: Luogu
external_problem_id: P3368
external_title: 洛谷 P3368【模板】樹狀陣列 2
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
