---
id: openj-bailian-1797
volume: lower
source_file: lower-volume
title: '百練 1797 Heavy Transportation：最大瓶頸路徑'
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 2
topics: ['widest path', 'Dijkstra']
prerequisites: ['dijkstra']
statement: '無向道路有載重上限，求從城市 1 到城市 n 可運送的最大重量。'
constraints: ['T 組', '2<=n<=1000', '道路數<=50000']
input_format: 'T；每組 n、m 與 m 行 u、v、capacity。'
output_format: '每組依 Scenario #k: 格式輸出最大載重並空一行。'
samples:
  - input: |
      1
      3 3
      1 2 5
      2 3 4
      1 3 2
    output: |
      Scenario #1:
      4
    explanation: '路徑 1-2-3 的瓶頸為 4。 此小例已以枚舉所有生成樹、分割或路徑的獨立暴力程式對拍。'
core_knowledge: ['最大瓶頸路徑', 'max-min Dijkstra']
judgment: '路徑值取邊權最小值，目標最大化。'
hints:
  - 'best[v] 表示目前可到 v 的最大瓶頸。'
  - '經 u,w 更新 v 的候選為 min(best[u],w)。'
  - '用大根堆每次確定 best 最大的點。'
solution_outline: '執行把加法換成 min、最短改為最大的 Dijkstra。'
proof_or_invariant: '取出全域 best 最大的 u 時，任何尚未取出點作為替代路徑前綴，其瓶頸不可能超過 best[u]，故 u 已最優。'
common_errors: ['套最短路加法', '使用小根堆', '漏印 Scenario 格式與空行']
complexity: { time: 'O(m log n)', space: 'O(n+m)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() { ios::sync_with_stdio(false); cin.tie(nullptr); /* TODO：依三階段提示完成。 */ return 0; }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;for(int cs=1;cs<=tests;++cs){int n,m;cin>>n>>m;vector<vector<pair<int,int>>>g(static_cast<size_t>(n+1));for(int i=0,u,v,w;i<m;++i){cin>>u>>v>>w;g[static_cast<size_t>(u)].push_back({v,w});g[static_cast<size_t>(v)].push_back({u,w});}priority_queue<pair<int,int>>pq;vector<int>best(static_cast<size_t>(n+1));best[1]=INT_MAX;pq.push({best[1],1});while(!pq.empty()){auto [value,u]=pq.top();pq.pop();if(value!=best[static_cast<size_t>(u)])continue;for(auto [v,w]:g[static_cast<size_t>(u)]){int candidate=min(value,w);if(candidate>best[static_cast<size_t>(v)]){best[static_cast<size_t>(v)]=candidate;pq.push({candidate,v});}}}cout<<"Scenario #"<<cs<<":\n"<<best[static_cast<size_t>(n)]<<"\n\n";}}
external_url: http://bailian.openjudge.cn/practice/1797/
external_platform: OpenJudge 百練
external_problem_id: '1797'
external_title: 'Heavy Transportation'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

本卡片依官方題面或可信競賽存檔獨立整理，未採用 OCR 推測題意。
