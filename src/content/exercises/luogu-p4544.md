---
id: luogu-p4544
volume: upper
source_file: upper-volume
title: 洛谷 P4544 Buying Feed G
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 4
topics: ['monotonic-queue', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  從座標 0 開車到家 E，要帶回恰 K 噸飼料。沿途商店 i 在 X_i，庫存 F_i、單價 C_i；車上 X 噸每公里花 X²。求購買與運輸總成本最小值。
constraints:
  - 1 <= K <= 10000
  - 1 <= E <= 500
  - 1 <= N <= 500
  - 商店總庫存不少於 K
input_format: 第一行 K、E、N；接著 N 行 X_i、F_i、C_i。
output_format: 輸出最小總成本。
samples:
  - input: |-
      2 5 3
      3 1 2
      4 1 2
      1 1 1
    output: |-
      9
    explanation: 在座標 3、4 各買一噸，購買費 4、運輸費 5，總計 9。
core_knowledge: ['採購 DP', '二次運輸成本', '窗口最小值']
judgment: 到商店 i 前已有 p 噸，路段成本為 Δx*p²；在店內買到 j 噸的轉移中 p∈[j-F_i,j]，是一個滑動窗口最小值。
hints:
  - previous[p] 表示上一位置離開時已買 p 噸的最小成本。
  - current[j]=C_i*j+min(previous[p]+Δx*p²-C_i*p)，p 位於庫存窗口。
  - 按 j 遞增用 deque 維護括號內值；把家 E 當庫存、單價皆零的最後商店完成最後路段。
solution_outline: >-
  排序商店並附加家。逐位置計算可達總購買量上限；掃描 j 時插入合法舊持有量 p、移除低於 j-F 的索引，以隊首更新 current。
proof_or_invariant: >-
  在兩商店間不會改變載重，故行車成本只依舊持有量 p。當前購買 j-p 受 0..F 限制，恰給出連續窗口；代數移項後窗口鍵值與 j 無關。deque 精確取最小，逐店歸納得到全局最優。
common_errors: ['用購買後 j 計算到商店前的運輸成本', '窗口允許 p 超過前店可達庫存', '漏加家作最後位置']
complexity:
  time: 'O(NK)'
  space: 'O(K)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、轉移與答案輸出。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <deque>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  struct Store{int x,stock,cost;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int target,home,n;cin>>target>>home>>n;vector<Store>stores(n);for(auto&s:stores)cin>>s.x>>s.stock>>s.cost;sort(stores.begin(),stores.end(),[](auto a,auto b){return a.x<b.x;});stores.push_back({home,0,0});const long long inf=numeric_limits<long long>::max()/4;vector<long long>previous(target+1,inf),current(target+1,inf);previous[0]=0;int old_cap=0,last_x=0;for(auto store:stores){int cap=min(target,old_cap+store.stock),delta=store.x-last_x;fill(current.begin(),current.end(),inf);deque<int>q;auto key=[&](int p){return previous[p]+1LL*delta*p*p-1LL*store.cost*p;};for(int j=0;j<=cap;j++){if(j<=old_cap&&previous[j]<inf){while(!q.empty()&&key(q.back())>=key(j))q.pop_back();q.push_back(j);}while(!q.empty()&&q.front()<j-store.stock)q.pop_front();if(!q.empty())current[j]=1LL*store.cost*j+key(q.front());}previous.swap(current);old_cap=cap;last_x=store.x;}cout<<previous[target]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4544
external_platform: 洛谷
external_problem_id: 'P4544'
external_title: Buying Feed G
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

購買量限制形成舊持有量的移動窗口，二次運輸成本只需併入窗口鍵值。
