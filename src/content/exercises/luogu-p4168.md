---
id: luogu-p4168
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4168 蒲公英：在線區間眾數
difficulty: 5
topics: [分塊預處理, 區間眾數, 強制在線]
prerequisites: [sqrt-decomposition]
statement: 給定序列，多次在線詢問區間眾數；若頻率最高者不只一個，輸出數值最小者。端點須用上次答案解碼。
constraints:
  - '1 <= n <= 40000，1 <= m <= 50000'
  - '1 <= a_i <= 10^9，1 <= l_0,r_0 <= n'
  - 每次讀入端點先以 `(x+last-1) mod n+1` 解碼
input_format: 第一行 n、m，第二行序列，接著 m 行各給兩個加密端點。
output_format: 每次輸出一行解碼區間的最小眾數。
samples:
  - input: |
      5 2
      1 2 2 3 3
      1 5
      1 2
    output: |
      2
      2
    explanation: 全區間中 2、3 都出現兩次，先取 2；第二次解碼後為區間 [3,4]，值 2、3 同頻仍取 2。
core_knowledge: [整塊區間眾數, 邊界候選, 出現位置表]
judgment: 任一答案若不是完整中間塊的眾數，就必在兩側散塊出現；只需檢查這些 O(sqrt n) 個候選。
hints:
  - 離散化後，為每種值保存所有出現位置，便可二分求任意區間頻率。
  - 預處理每對完整塊 [i,j] 的最小眾數。
  - 查詢先取中間完整塊答案，再枚舉左右散塊內每個值，以真實頻率和原值比較更新。
solution_outline: 預處理所有塊區間眾數及各值位置表。每次解碼後，以中間塊眾數和兩端元素作候選，二分計頻並按「頻率大、原值小」取優。
proof_or_invariant: 若最終眾數未出現在邊界散塊，它的全部出現都在中間完整塊，必不優於中間塊眾數；反之它會被邊界枚舉。因此候選集合必含正確答案。
complexity:
  time: 預處理 O(n sqrt(n))，每次 O(sqrt(n) log n)
  space: O(n)
common_errors:
  - 頻率相同時沒有選原值較小者
  - 用壓縮編號大小取代原值大小
  - 第二次以後忘記用上次答案解碼兩端
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];int last=0;while(m--){int l,r;cin>>l>>r;l=(l+last-1)%n+1;r=(r+last-1)%n+1;if(l>r)swap(l,r);map<int,int>count;for(int i=l;i<=r;++i)++count[a[static_cast<size_t>(i)]];int best_count=-1;for(auto[value,c]:count)if(c>best_count){best_count=c;last=value;}cout<<last<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>original(static_cast<size_t>(n+1)),values;for(int i=1;i<=n;++i){cin>>original[static_cast<size_t>(i)];values.push_back(original[static_cast<size_t>(i)]);}sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());vector<int>a(static_cast<size_t>(n+1));vector<vector<int>>position(values.size());for(int i=1;i<=n;++i){a[static_cast<size_t>(i)]=static_cast<int>(lower_bound(values.begin(),values.end(),original[static_cast<size_t>(i)])-values.begin());position[static_cast<size_t>(a[static_cast<size_t>(i)])].push_back(i);}int length=max(1,static_cast<int>(sqrt(static_cast<double>(n))));int blocks=(n+length-1)/length;vector<vector<int>>mode(static_cast<size_t>(blocks),vector<int>(static_cast<size_t>(blocks),-1));vector<int>frequency(values.size());for(int left_block=0;left_block<blocks;++left_block){fill(frequency.begin(),frequency.end(),0);int best=-1,best_count=0;for(int i=left_block*length+1;i<=n;++i){int value=a[static_cast<size_t>(i)],count=++frequency[static_cast<size_t>(value)];if(count>best_count||(count==best_count&&(best<0||values[static_cast<size_t>(value)]<values[static_cast<size_t>(best)]))){best=value;best_count=count;}if(i%length==0||i==n)mode[static_cast<size_t>(left_block)][static_cast<size_t>((i-1)/length)]=best;}}auto range_count=[&](int value,int l,int r){const auto&p=position[static_cast<size_t>(value)];return static_cast<int>(upper_bound(p.begin(),p.end(),r)-lower_bound(p.begin(),p.end(),l));};int last=0;while(m--){int l,r;cin>>l>>r;l=(l+last-1)%n+1;r=(r+last-1)%n+1;if(l>r)swap(l,r);int lb=(l-1)/length,rb=(r-1)/length,best=-1,best_count=-1;auto consider=[&](int value){int count=range_count(value,l,r);if(count>best_count||(count==best_count&&(best<0||values[static_cast<size_t>(value)]<values[static_cast<size_t>(best)]))){best=value;best_count=count;}};if(lb+1<=rb-1)consider(mode[static_cast<size_t>(lb+1)][static_cast<size_t>(rb-1)]);int left_end=min(r,(lb+1)*length);for(int i=l;i<=left_end;++i)consider(a[static_cast<size_t>(i)]);if(rb!=lb)for(int i=rb*length+1;i<=r;++i)consider(a[static_cast<size_t>(i)]);last=values[static_cast<size_t>(best)];cout<<last<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4168
external_platform: 洛谷
external_problem_id: P4168
external_title: '[Violet] 蒲公英'
---

區間眾數不能直接合併，但「中間答案加兩側候選」使候選數降到根號級。
