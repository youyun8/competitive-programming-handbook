---
id: luogu-p2865
volume: lower
source_file: lower-volume
original_label: 洛谷 P2865
title: 洛谷 P2865 Roadblocks：嚴格次短路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [次短路, Dijkstra, 雙距離]
prerequisites: [dijkstra]
core_knowledge: [最短與次短狀態, 嚴格大於, 非負權]
judgment: 每點維護最小與嚴格次小兩個路徑長；相同長度不算次短。
statement: 正權無向圖中求從 1 到 n、長度嚴格大於最短路的最小路徑長；可重複經過點或邊。
constraints: [邊權為正, 圖連通, 無向道路]
input_format: 第一行 n、m；接著 m 行 a、b、w。
output_format: 輸出 1 到 n 的嚴格次短路長。
samples:
  - input: |-
      4 4
      1 2 1
      2 4 1
      1 3 2
      3 4 2
    output: '4'
    explanation: 最短路 1→2→4 長 2；下一個不同長度為 1→3→4 的 4。
hints:
  - 對每個點保存 best 與 second。
  - 新候選小於 best 時，舊 best 要下放到 second。
  - 只有 best < candidate < second 才更新次短，排除等長最短路。
solution_outline: 小根堆中的狀態是某條到點路徑長；鬆弛時維護每點兩個嚴格不同的最小值，最後輸出 second[n]。
proof_or_invariant: Dijkstra 依路徑長遞增枚舉所有可達 walk。每點只保留最小兩個不同長度；更大的第三個前綴接上非負邊後不可能優於由前兩個形成的對應候選，因此剪枝安全。
complexity: { time: 'O((n+m) log n)', space: 'O(n+m)' }
common_errors: [把等長另一條最短路當次短, best 更新時遺失舊 best, 只允許簡單路徑而做錯模型]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m;cin>>n>>m;/* TODO：每點維護兩個距離。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;if(!(cin>>n>>m))return 0;vector<vector<pair<int,int>>> graph(static_cast<size_t>(n+1));
      for(int i=0;i<m;++i){int a,b,w;cin>>a>>b>>w;graph[static_cast<size_t>(a)].push_back({b,w});graph[static_cast<size_t>(b)].push_back({a,w});}
      const long long inf=LLONG_MAX/4;vector<long long> best(static_cast<size_t>(n+1),inf),second(static_cast<size_t>(n+1),inf);
      priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>> queue;best[1]=0;queue.push({0,1});
      while(!queue.empty()){auto[d,u]=queue.top();queue.pop();if(d>second[static_cast<size_t>(u)])continue;
          for(const auto& [v,w]:graph[static_cast<size_t>(u)]){long long candidate=d+w;
              if(candidate<best[static_cast<size_t>(v)]){swap(candidate,best[static_cast<size_t>(v)]);queue.push({best[static_cast<size_t>(v)],v});}
              if(candidate>best[static_cast<size_t>(v)]&&candidate<second[static_cast<size_t>(v)]){second[static_cast<size_t>(v)]=candidate;queue.push({candidate,v});}
          }}
      cout<<second[static_cast<size_t>(n)]<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P2865
external_platform: 洛谷
external_problem_id: P2865
external_title: '[USACO06NOV] Roadblocks G'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

次短路不是重跑一次 Dijkstra，而是把每個點的「第二個嚴格不同距離」也納入狀態。
