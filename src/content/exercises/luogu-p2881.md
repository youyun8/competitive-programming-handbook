---
id: luogu-p2881
volume: lower
source_file: lower-volume
original_label: 洛谷 P2881
title: 洛谷 P2881 Ranking the Cows：尚缺關係數
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 2
topics: [傳遞閉包, 偏序, 排名]
prerequisites: [dijkstra]
core_knowledge: [可比較點對, 布林 Floyd, 全序關係數]
judgment: n 頭牛的完整排序共有 n(n-1)/2 對可比較關係；閉包已知多少就少問多少。
statement: 已知若干「牛 X 強於牛 Y」且關係一致，求至少還需知道多少對關係才能確定完整排序。
constraints: [關係無矛盾, 關係具有傳遞性]
input_format: 第一行 n、m；接著 m 行 X、Y 表示 X 強於 Y。
output_format: 輸出至少還缺多少對關係。
samples:
  - input: |-
      5 5
      2 1
      1 5
      2 3
      1 4
      3 4
    output: '3'
    explanation: 傳遞閉包後仍有三對牛互相不可比較，至少需補三項關係。
hints:
  - 先用傳遞閉包推出所有間接強弱。
  - 對每個無序點對 i<j，只要任一方向可達就已知。
  - 不可比較的每一對都必須補上一個方向，數量就是答案。
solution_outline: Floyd 求可達閉包，枚舉 i<j 統計雙向皆不可達的點對。
proof_or_invariant: 閉包精確表示目前可推出的關係。完整全序要求每個無序點對可比；每個不可比點對至少需新增一項資訊，而為所有這些點對指定與某個相容拓撲序一致的方向即可同時達成，故下界可達。
complexity: { time: 'O(n^3)', space: 'O(n^2)' }
common_errors: [直接用 m 而未計入傳遞關係, 統計有序點對造成兩倍, 把 i 本身納入]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m;cin>>n>>m;/* TODO：閉包後計不可比較點對。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;if(!(cin>>n>>m))return 0;vector<vector<char>> reach(static_cast<size_t>(n),vector<char>(static_cast<size_t>(n),0));
      for(int i=0;i<m;++i){int x,y;cin>>x>>y;reach[static_cast<size_t>(x-1)][static_cast<size_t>(y-1)]=1;}
      for(int k=0;k<n;++k)for(int i=0;i<n;++i)if(reach[static_cast<size_t>(i)][static_cast<size_t>(k)])for(int j=0;j<n;++j)reach[static_cast<size_t>(i)][static_cast<size_t>(j)]|=reach[static_cast<size_t>(k)][static_cast<size_t>(j)];
      int answer=0;for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)if(!reach[static_cast<size_t>(i)][static_cast<size_t>(j)]&&!reach[static_cast<size_t>(j)][static_cast<size_t>(i)])++answer;
      cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P2881
external_platform: 洛谷
external_problem_id: P2881
external_title: '[USACO07MAR] Ranking the Cows G'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

完整排名缺的不是邊，而是傳遞閉包後仍不可比較的點對。
