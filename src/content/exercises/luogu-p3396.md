---
id: luogu-p3396
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3396 哈希衝突：模類和與單點修改
difficulty: 4
topics: [根號分治, 預處理, 模同餘類]
prerequisites: [sqrt-decomposition]
statement: 維護一起算序列。支援單點賦值，以及詢問所有下標 i 滿足 i mod p = k 的元素總和。
constraints:
  - '1 <= n, m <= 150000'
  - '1 <= a_i, new_value <= 1000'
  - '1 <= p <= n，0 <= k < p'
input_format: 第一行 n、m，第二行序列；`A p k` 詢問模類和，`C x y` 把 a_x 改成 y。
output_format: 每個 A 操作輸出一行總和。
samples:
  - input: |
      5 4
      1 2 3 4 5
      A 2 1
      C 3 10
      A 2 1
      A 3 0
    output: |
      9
      16
      10
    explanation: 奇數下標初始和為 1+3+5；修改第三項後為 1+10+5。下標模 3 為 0 的只有位置 3。
core_knowledge: [大小模數分治, 模類預處理, 差值更新]
judgment: 小模數的餘數種類總量為 O(B²)，可預存；大模數每個餘數類只有 O(n/B) 個下標，可直接枚舉。
hints:
  - 選 B 約為 sqrt(n)，預處理 sum[p][k]，其中 p<B。
  - 單點值改變 delta 時，對每個小 p 更新 sum[p][x mod p]。
  - 詢問 p>=B 時從第一個符合餘數的正下標開始，每次加 p 枚舉。
solution_outline: 預處理所有小模數餘數桶；修改同步更新 O(B) 個桶，大模數詢問直接走等差下標。
proof_or_invariant: sum[p][k] 恆為目前所有 i mod p=k 的值和。小模數直接讀取；大模數逐一枚舉且每個符合下標恰走一次，兩條分支均正確。
complexity:
  time: 預處理 O(n sqrt(n))，每次操作 O(sqrt(n))
  space: O(n)
common_errors:
  - 一起算下標的 i mod p 與零起算混淆
  - 修改時用新值而非差值更新預存桶
  - k=0 時從下標 0 開始而越界
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<long long>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];while(m--){char op;int x,y;cin>>op>>x>>y;if(op=='C')a[static_cast<size_t>(x)]=y;else{long long answer=0;for(int i=1;i<=n;++i)if(i%x==y)answer+=a[static_cast<size_t>(i)];cout<<answer<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;const int boundary=400;vector<long long>a(static_cast<size_t>(n+1));vector<vector<long long>>sum(static_cast<size_t>(boundary),vector<long long>(static_cast<size_t>(boundary)));for(int i=1;i<=n;++i){cin>>a[static_cast<size_t>(i)];for(int p=1;p<boundary;++p)sum[static_cast<size_t>(p)][static_cast<size_t>(i%p)]+=a[static_cast<size_t>(i)];}while(m--){char op;int x,y;cin>>op>>x>>y;if(op=='C'){long long delta=static_cast<long long>(y)-a[static_cast<size_t>(x)];for(int p=1;p<boundary;++p)sum[static_cast<size_t>(p)][static_cast<size_t>(x%p)]+=delta;a[static_cast<size_t>(x)]=y;}else if(x<boundary)cout<<sum[static_cast<size_t>(x)][static_cast<size_t>(y)]<<'\n';else{long long answer=0;int start=y==0?x:y;for(int i=start;i<=n;i+=x)answer+=a[static_cast<size_t>(i)];cout<<answer<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P3396
external_platform: 洛谷
external_problem_id: P3396
external_title: 哈希冲突
---

以模數大小分治，比直接把序列切成連續位置塊更貼合詢問形狀。
