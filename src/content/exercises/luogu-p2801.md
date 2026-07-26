---
id: luogu-p2801
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P2801 教主的魔法：區間加與門檻計數
difficulty: 4
topics: [序列分塊, 整塊標記, 塊內排序]
prerequisites: [sqrt-decomposition]
statement: 維護一列防禦力。區間修改會令其中每個值增加同一整數；區間詢問要求防禦力不小於指定門檻的元素數。
constraints:
  - '1 <= n, q <= 1000000'
  - 初值、增量與門檻均可用 32 位元有號整數表示
  - '1 <= l <= r <= n'
input_format: 第一行 n、q，第二行初值；其後 `M l r w` 表示區間加，`A l r c` 表示門檻計數。
output_format: 每個 A 操作輸出一行答案。
samples:
  - input: |
      5 4
      1 4 2 5 3
      A 1 5 4
      M 2 4 2
      A 1 4 5
      A 3 5 4
    output: |
      2
      2
      2
    explanation: 初始有 4、5 達標；修改後前四項為 1、6、4、7，其中 6、7 不小於 5。
core_knowledge: [分塊, lazy tag, lower_bound]
judgment: 區間加可對完整塊只記標記；門檻計數可在塊內排序副本中二分，兩端散塊暴力。
hints:
  - 同時保存每個位置不含整塊標記的值，以及每塊排序後的副本。
  - 修改完整塊只增加 tag；修改散塊前後重建其排序副本。
  - 查完整塊時二分 `threshold-tag`，散塊則以 `value+tag` 逐一比較。
solution_outline: 依約 sqrt(n) 長度分塊，維護原值、塊標記及排序副本；區間修改與查詢分成兩端散塊和中間整塊。
proof_or_invariant: 任意真實值恆等於 raw[i]+tag[block(i)]。重建後 sorted 是該塊所有 raw 的排序，因此 lower_bound 精確切出達標後綴；散塊直接比較也一致。
complexity:
  time: 每次操作 O(sqrt(n) log n)
  space: O(n)
common_errors:
  - 重建散塊時把 tag 重複加進 raw
  - 整塊二分忘記從門檻扣除 tag
  - n 很大時塊長過小導致整塊數過多
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;vector<long long>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(q--){char op;int l,r;long long x;cin>>op>>l>>r>>x;if(op=='M')for(int i=l;i<=r;++i)a[static_cast<size_t>(i)]+=x;else{int answer=0;for(int i=l;i<=r;++i)answer+=a[static_cast<size_t>(i)]>=x;cout<<answer<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;int length=max(1,static_cast<int>(sqrt(n)));int blocks=(n+length-1)/length;vector<long long>a(static_cast<size_t>(n+1)),tag(static_cast<size_t>(blocks));vector<vector<long long>>sorted(static_cast<size_t>(blocks));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];auto rebuild=[&](int b){int left=b*length+1,right=min(n,(b+1)*length);auto&v=sorted[static_cast<size_t>(b)];v.clear();for(int i=left;i<=right;++i)v.push_back(a[static_cast<size_t>(i)]);sort(v.begin(),v.end());};for(int b=0;b<blocks;++b)rebuild(b);while(q--){char op;int l,r;long long x;cin>>op>>l>>r>>x;int left_block=(l-1)/length,right_block=(r-1)/length;if(op=='M'){if(left_block==right_block){for(int i=l;i<=r;++i)a[static_cast<size_t>(i)]+=x;rebuild(left_block);}else{int left_end=(left_block+1)*length;for(int i=l;i<=left_end;++i)a[static_cast<size_t>(i)]+=x;rebuild(left_block);for(int b=left_block+1;b<right_block;++b)tag[static_cast<size_t>(b)]+=x;for(int i=right_block*length+1;i<=r;++i)a[static_cast<size_t>(i)]+=x;rebuild(right_block);}}else{int answer=0;if(left_block==right_block){for(int i=l;i<=r;++i)answer+=a[static_cast<size_t>(i)]+tag[static_cast<size_t>(left_block)]>=x;}else{int left_end=(left_block+1)*length;for(int i=l;i<=left_end;++i)answer+=a[static_cast<size_t>(i)]+tag[static_cast<size_t>(left_block)]>=x;for(int b=left_block+1;b<right_block;++b){const auto&v=sorted[static_cast<size_t>(b)];answer+=static_cast<int>(v.end()-lower_bound(v.begin(),v.end(),x-tag[static_cast<size_t>(b)]));}for(int i=right_block*length+1;i<=r;++i)answer+=a[static_cast<size_t>(i)]+tag[static_cast<size_t>(right_block)]>=x;}cout<<answer<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P2801
external_platform: 洛谷
external_problem_id: P2801
external_title: 教主的魔法
---

分塊讓「區間加」與「依值比較」兩種不同維度的操作取得平衡。
