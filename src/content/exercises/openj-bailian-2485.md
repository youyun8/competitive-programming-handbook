---
id: openj-bailian-2485
volume: lower
source_file: lower-volume
title: '百練 2485 Highways：最小瓶頸生成樹'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 2
topics: ['Prim', '最小生成樹', '瓶頸']
prerequisites: ['minimum-spanning-tree']
statement: '給完全圖距離矩陣，連通所有城鎮並最小化所建公路中的最大長度。'
constraints: ['T 組', '3<=n<=500', '距離<=65536']
input_format: 'T；每組 n 與 n*n 距離矩陣。'
output_format: '每組輸出最小可能最大邊長。'
samples:
  - input: |
      1
      3
      0 4 2
      4 0 3
      2 3 0
    output: |
      3
    explanation: '選長度 2、3 的道路即可連通。 此小例已以枚舉所有生成樹、分割或路徑的獨立暴力程式對拍。'
core_knowledge: ['MST 瓶頸性質', 'O(n^2) Prim']
judgment: '要求連通且最小化最大邊，而非總長。'
hints:
  - '任一 MST 也是最小瓶頸生成樹。'
  - '矩陣適合 O(n²) Prim。'
  - '答案為 Prim 選入邊權的最大值。'
solution_outline: '從任一點做 Prim，每次加入距樹最近的點並更新答案最大值。'
proof_or_invariant: '若有生成樹最大邊小於 MST 的最大邊，Kruskal 在該門檻下已可連通，與 MST 首次連通門檻矛盾。'
common_errors: ['輸出 MST 總和', '漏讀測試組數', '把對角線零選作跨點邊']
complexity: { time: 'O(Tn^2)', space: 'O(n^2)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() { ios::sync_with_stdio(false); cin.tie(nullptr); /* TODO：依三階段提示完成。 */ return 0; }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n;cin>>n;vector<vector<int>>w(static_cast<size_t>(n),vector<int>(static_cast<size_t>(n)));for(auto&r:w)for(int&x:r)cin>>x;vector<int>d(static_cast<size_t>(n),INT_MAX);vector<char>used(static_cast<size_t>(n));d[0]=0;int answer=0;for(int step=0;step<n;++step){int u=-1;for(int i=0;i<n;++i)if(!used[static_cast<size_t>(i)]&&(u<0||d[static_cast<size_t>(i)]<d[static_cast<size_t>(u)]))u=i;used[static_cast<size_t>(u)]=1;answer=max(answer,d[static_cast<size_t>(u)]);for(int v=0;v<n;++v)if(!used[static_cast<size_t>(v)])d[static_cast<size_t>(v)]=min(d[static_cast<size_t>(v)],w[static_cast<size_t>(u)][static_cast<size_t>(v)]);}cout<<answer<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/2485/
external_platform: OpenJudge 百練
external_problem_id: '2485'
external_title: 'Highways'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
