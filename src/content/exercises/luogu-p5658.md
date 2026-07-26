---
id: luogu-p5658
volume: upper
source_file: upper-volume
title: 洛谷 P5658 括號樹
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 4
topics: ['tree-dp', 'persistent-stack']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  根為 1 的樹上每點是一個括號。令 answer[u] 為根到 u 的括號字串中合法括號子串數，輸出所有 u*answer[u] 的位元 XOR。
constraints:
  - 1 <= n <= 500000
  - 每點字元為左或右括號
  - 對 i=2..n 給父節點且父編號較小
input_format: 第一行 n，第二行括號字串，第三部分給節點 2..n 的父編號。
output_format: 輸出 XOR 聚合值。
samples:
  - input: |-
      5
      (()()
      1 1 2 2
    output: |-
      6
    explanation: 沿各根路徑累積以目前位置結尾的合法串數，再按節點編號 XOR。
core_knowledge: ['括號匹配', '路徑 DP', '持久化堆疊']
judgment: 到每點的路徑狀態等同父路徑狀態加一個字元，可用持久化未配對左括號堆疊。
hints:
  - top[u] 保存根到 u 路徑尚未匹配的最近左括號節點。
  - 遇左括號令 top[u]=u；遇右括號且可匹配 x 時，彈回 x 出現前的 top。
  - 以 u 結尾的新合法串數 cnt[u]=cnt[parent[x]]+1，prefix[u]=prefix[parent[u]]+cnt[u]。
solution_outline: >-
  利用父編號較小依序處理。持久化堆疊只存每點 top 指標；匹配時由左括號的父狀態完成彈棧，計算新增與累計答案。
proof_or_invariant: >-
  堆疊不變量是 top[u] 指向根到 u 未匹配左括號鏈頂。右括號匹配 x 後，最短合法後綴開始於 x；它前面可串接的合法後綴數正是 cnt[parent[x]]，故新增 cnt 為其加一。所有合法子串按右端點唯一計入 prefix。
common_errors: ['把整條根路徑是否完全合法當成題目答案', '分支間共用可變堆疊未回滾', '乘法與 XOR 使用 32 位']
complexity:
  time: 'O(n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、子問題合併與邊界處理。
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;string s;cin>>s;s=' '+s;vector<int>parent(n+1),top(n+1),count(n+1);for(int i=2;i<=n;i++)cin>>parent[i];vector<long long>sum(n+1);long long answer=0;for(int u=1;u<=n;u++){int p=parent[u];if(s[u]=='(')top[u]=u;else if(top[p]){int open=top[p];top[u]=top[parent[open]];count[u]=count[parent[open]]+1;}else top[u]=top[p];sum[u]=sum[p]+count[u];answer^=1LL*u*sum[u];}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5658
external_platform: 洛谷
external_problem_id: 'P5658'
external_title: 括號樹
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

父狀態不可變，因此一個 top 指標即可讓每條根路徑擁有自己的括號堆疊版本。
