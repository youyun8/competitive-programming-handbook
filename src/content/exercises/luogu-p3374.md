---
id: luogu-p3374
volume: upper
source_file: upper-volume
title: 洛谷 P3374【模板】樹狀陣列 1
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 2
topics: &id001
  - fenwick-tree
  - prefix-sum
prerequisites:
  - fenwick-tree
statement: 維護序列的單點增量與閉區間和。
constraints:
  - 1 <= n,m <= 500000
  - 答案可能超過 32 位元
input_format: n m、n 個初值；1 x k 單點加，2 x y 查區間和。
output_format: 每個操作 2 輸出答案。
samples:
  - input: |
      5 3
      1 5 4 2 3
      2 1 3
      1 3 5
      2 2 5
    output: |
      10
      19
    explanation: 先查得 10；位置 3 加五後 [2,5] 和為 19。
core_knowledge: *id001
judgment: BIT 維護單點增量與前綴和。
hints:
  - tree[i] 管轄 (i-lowbit(i),i]。
  - 單點加沿 i+=lowbit(i)；前綴和沿 i-=lowbit(i)。
  - 區間 [l,r] 等於 prefix(r)-prefix(l-1)。
solution_outline: BIT 維護單點增量與前綴和。
proof_or_invariant: BIT 節點區間在查詢路徑上不重不漏拼成前綴，更新路徑恰含所有覆蓋該點的節點。
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Fenwick bit(n);for(int i=1;i<=n;++i){long long x;cin>>x;bit.add(i,x);}while(m--){int op,x;long long y;cin>>op>>x>>y;if(op==1)bit.add(x,y);else cout<<bit.sum(static_cast<int>(y))-bit.sum(x-1)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Fenwick bit(n);for(int i=1;i<=n;++i){long long x;cin>>x;bit.add(i,x);}while(m--){int op,x;long long y;cin>>op>>x>>y;if(op==1)bit.add(x,y);else cout<<bit.sum(static_cast<int>(y))-bit.sum(x-1)<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3374
external_platform: Luogu
external_problem_id: P3374
external_title: 洛谷 P3374【模板】樹狀陣列 1
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
