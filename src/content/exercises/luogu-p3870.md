---
id: luogu-p3870
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3870 開關：區間翻轉與亮燈計數
difficulty: 3
topics: [分塊, lazy flip, 區間計數]
prerequisites: [sqrt-decomposition]
statement: n 盞燈初始全關。操作 0 翻轉一段區間內每盞燈的狀態；操作 1 詢問區間內目前亮著的燈數。
constraints:
  - '1 <= n, m <= 100000'
  - '1 <= l <= r <= n'
  - 初始狀態皆為 0
input_format: 第一行 n、m；接著 m 行各為 op、l、r。
output_format: 每個 op=1 的操作輸出一行答案。
samples:
  - input: |
      5 5
      0 1 3
      1 1 5
      0 2 5
      1 1 3
      1 4 5
    output: |
      3
      1
      2
    explanation: 第一次翻轉後前三盞亮；再翻轉 2 到 5 後狀態為 1、0、0、1、1。
core_knowledge: [區間翻轉, 分塊標記, 整塊計數]
judgment: 翻轉完整塊時亮燈數變成塊長減原數，並可延後逐點套用；兩端散塊才需實際翻轉。
hints:
  - 每塊維護亮燈數與一個整塊翻轉標記。
  - 碰到散塊前先把標記下推到每個元素，再逐點操作並重算計數。
  - 完整塊翻轉只需反轉標記，並令 ones=block_size-ones。
solution_outline: 將序列分塊；整塊 O(1) 翻轉或取計數，散塊下推後逐點處理。
proof_or_invariant: 下推前，元素陣列配合 flip 標記代表真實狀態，而 ones 始終是真實亮燈數。整塊與散塊操作都保持此不變量，區間查詢相加即正確。
complexity:
  time: 每次操作 O(sqrt(n))
  space: O(n)
common_errors:
  - 散塊操作前忘記下推 flip
  - 最後一塊不足標準塊長卻仍用固定長度更新 ones
  - 翻轉標記直接賦 1 而非 XOR
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>light(static_cast<size_t>(n+1));while(m--){int op,l,r;cin>>op>>l>>r;if(op==0)for(int i=l;i<=r;++i)light[static_cast<size_t>(i)]^=1;else cout<<accumulate(light.begin()+l,light.begin()+r+1,0)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;int length=max(1,static_cast<int>(sqrt(static_cast<double>(n))));int blocks=(n+length-1)/length;vector<unsigned char>light(static_cast<size_t>(n+1)),flip(static_cast<size_t>(blocks));vector<int>ones(static_cast<size_t>(blocks));auto size_of=[&](int b){return min(n,(b+1)*length)-b*length;};auto push=[&](int b){if(flip[static_cast<size_t>(b)]==0)return;int left=b*length+1,right=min(n,(b+1)*length);for(int i=left;i<=right;++i)light[static_cast<size_t>(i)]^=1U;flip[static_cast<size_t>(b)]=0;};while(m--){int op,l,r;cin>>op>>l>>r;int lb=(l-1)/length,rb=(r-1)/length;if(op==0){if(lb==rb){push(lb);for(int i=l;i<=r;++i){ones[static_cast<size_t>(lb)]+=light[static_cast<size_t>(i)]==0?1:-1;light[static_cast<size_t>(i)]^=1U;}}else{push(lb);for(int i=l;i<=(lb+1)*length;++i){ones[static_cast<size_t>(lb)]+=light[static_cast<size_t>(i)]==0?1:-1;light[static_cast<size_t>(i)]^=1U;}for(int b=lb+1;b<rb;++b){flip[static_cast<size_t>(b)]^=1U;ones[static_cast<size_t>(b)]=size_of(b)-ones[static_cast<size_t>(b)];}push(rb);for(int i=rb*length+1;i<=r;++i){ones[static_cast<size_t>(rb)]+=light[static_cast<size_t>(i)]==0?1:-1;light[static_cast<size_t>(i)]^=1U;}}}else{int answer=0;if(lb==rb){push(lb);for(int i=l;i<=r;++i)answer+=light[static_cast<size_t>(i)];}else{push(lb);for(int i=l;i<=(lb+1)*length;++i)answer+=light[static_cast<size_t>(i)];for(int b=lb+1;b<rb;++b)answer+=ones[static_cast<size_t>(b)];push(rb);for(int i=rb*length+1;i<=r;++i)answer+=light[static_cast<size_t>(i)];}cout<<answer<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P3870
external_platform: 洛谷
external_problem_id: P3870
external_title: '[TJOI2009] 开关'
---

翻轉是可疊加的 XOR 標記，兩次翻轉會互相抵消。
