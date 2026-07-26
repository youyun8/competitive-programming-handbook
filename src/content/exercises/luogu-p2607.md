---
id: luogu-p2607
volume: upper
source_file: upper-volume
title: 洛谷 P2607 騎士
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 4
topics: ['functional-graph', 'tree-dp']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  n 名騎士各有戰鬥力並憎恨另一名騎士；一對互相憎恨的騎士不能同時參加，求參加者最大總戰鬥力。
constraints:
  - 1 <= n <= 1000000
  - 戰鬥力為非負整數
  - 每點恰給一個憎恨對象
input_format: 第一行 n；接著 n 行給騎士 i 的戰鬥力與憎恨對象。
output_format: 輸出最大戰鬥力總和。
samples:
  - input: |-
      3
      10 2
      20 3
      30 1
    output: |-
      30
    explanation: 三人形成環，最多選一組不相鄰騎士，選第三人得 30。
core_knowledge: ['基環樹', '最大權獨立集', '拓撲剝葉']
judgment: 每點一條指向憎恨對象的邊，無向圖每個連通塊恰為一個環加若干樹。
hints:
  - 以入度為零節點開始剝葉，維護 skip[u]、take[u] 的樹上最大權獨立集值。
  - 剝掉 u 時，把 max(skip,take) 與 skip 分別累加到其父的 skip、take。
  - 剩餘節點組成互斥環；將每點附樹值當權重，分別固定首點不選／選做兩次線性 DP。
solution_outline: >-
  拓撲剝除所有非環點並把 DP 貢獻推向父節點。逐個未訪問環取出序列，用環形最大權獨立集兩情況求值，各連通塊答案相加。
proof_or_invariant: >-
  剝葉順序保證處理 u 時所有入樹兒子已合併，兩狀態轉移是樹上獨立集。剝完後每點入度一，故只剩互不相交的有向環；附樹決策已壓縮成環點選或不選的權值，兩次線性 DP 完整處理首尾不能同選。
common_errors: ['把整個函數圖當成樹漏掉環邊', '環首尾同時選取', '多個連通塊只取最大值而非求和']
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
  #include <algorithm>
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>take(n+1),skip(n+1);vector<int>to(n+1),indeg(n+1);for(int i=1;i<=n;i++){cin>>take[i]>>to[i];indeg[to[i]]++;}queue<int>q;for(int i=1;i<=n;i++)if(!indeg[i])q.push(i);while(!q.empty()){int u=q.front();q.pop();int v=to[u];skip[v]+=max(skip[u],take[u]);take[v]+=skip[u];if(--indeg[v]==0)q.push(v);}vector<char>seen(n+1);long long answer=0;for(int start=1;start<=n;start++)if(indeg[start]&&!seen[start]){vector<int>cycle;for(int u=start;!seen[u];u=to[u])seen[u]=1,cycle.push_back(u);auto solve=[&](bool first_taken){long long no=first_taken?-(1LL<<60):skip[cycle[0]],yes=first_taken?take[cycle[0]]:-(1LL<<60);for(size_t i=1;i<cycle.size();i++){int u=cycle[i];long long next_no=max(no,yes)+skip[u],next_yes=no+take[u];no=next_no;yes=next_yes;}return first_taken?no:max(no,yes);};answer+=max(solve(false),solve(true));}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2607
external_platform: 洛谷
external_problem_id: 'P2607'
external_title: 騎士
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

剝葉把附著樹壓成兩個權值，剩下的唯一障礙只是環首尾衝突。
