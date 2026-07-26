---
id: luogu-p3698
volume: upper
source_file: upper-volume
title: 洛谷 P3698 小Q的棋盤
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['tree', 'greedy']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  棋盤是一棵 v 點樹。棋子從節點 0 出發，最多移動 n 步，節點可重訪但只計數一次；求最多能經過多少個不同節點。
constraints:
  - 1 <= v,n <= 100
  - 節點編號為 0..v-1
  - 輸入保證是一棵樹
input_format: 第一行 v、n；接著 v-1 行無向邊。
output_format: 輸出最多經過的不同節點數。
samples:
  - input: |-
      9 5
      0 1
      0 2
      2 6
      4 2
      8 1
      1 3
      3 7
      3 5
    output: |-
      5
    explanation: 可走 0→1→3→5→3→7，共經過五個不同節點。
core_knowledge: ['樹上行走', '最深路徑', '往返成本']
judgment: 從根出發的路線只有最後一條根到終點路徑不需折返；其他新分支每增加一點至少耗兩步。
hints:
  - 先 DFS 求節點 0 到任一點的最大深度 d。
  - 若步數不超過 d，可沿最深路徑每步新增一點。
  - 超過 d 後先保留最深路徑作不回程段，其餘每兩步至多新增一點，並以 v 截斷。
solution_outline: >-
  求根的最大深度 d。答案為 n<=d 時 n+1，否則 min(v,d+1+(n-d)/2)。
proof_or_invariant: >-
  任一路線走過的邊形成含根子樹。除根到終點的路徑外，每條邊必須往返，故造訪 t 個新點至少需 2t-d 步，d 至多為樹的最大深度。先走訪側枝並回來、最後沿最深路徑可達此下界，所以公式緊確。
common_errors: ['把起點漏算', '所有邊都當成往返而漏用終點路徑', '答案超過節點總數']
complexity:
  time: 'O(v)'
  space: 'O(v)'
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
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int v,steps;cin>>v>>steps;vector<vector<int>>g(v);for(int i=1,a,b;i<v;i++){cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}int depth=0;auto dfs=[&](auto&&f,int u,int p,int d)->void{depth=max(depth,d);for(int x:g[u])if(x!=p)f(f,x,u,d+1);};dfs(dfs,0,-1,0);cout<<(steps<=depth?steps+1:min(v,depth+1+(steps-depth)/2))<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3698
external_platform: 洛谷
external_problem_id: 'P3698'
external_title: 小Q的棋盤
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

唯一不必折返的是最後的根到終點路徑，因此應把它留給最深路徑。
