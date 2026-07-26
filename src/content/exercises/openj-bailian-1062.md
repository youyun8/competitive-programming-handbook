---
id: openj-bailian-1062
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 1062
title: 百練 1062 昂貴的聘禮：等級視窗最短路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: [Dijkstra, 枚舉視窗, 建模]
prerequisites: [dijkstra]
core_knowledge: [物品替代邊, 虛擬源點, 等級差限制]
judgment: 一條交易鏈中最高與最低地位差不能超過 M；枚舉包含酋長物品的合法等級視窗。
statement: 每件物品可直接購買，或持有另一物品再補差價交換；交易涉及人物地位差受限。求取得編號 1 物品的最低金額。
constraints: [物品數 <= 100, 所有花費非負, 目標為物品 1]
input_format: 第一行允許等級差 M 與物品數 N；每件物品輸入直接價格、主人等級、替代方案數，再列替代物品與補價。
output_format: 輸出最低花費。
samples:
  - input: |-
      1 2
      100 5 1
      2 10
      20 4 0
    output: '30'
    explanation: 兩名主人等級差為 1，可先花 20 買物品 2，再補 10 換得物品 1。
hints:
  - 虛擬源點 0 到物品 i 連直接價格。
  - 「持有 t 再補 v 換 i」建 t→i、權 v。
  - 枚舉長度 M 的等級區間且必須包含物品 1 的主人，只允許區間內節點跑 Dijkstra。
solution_outline: 建購買與替代有向圖；枚舉所有可能視窗下界，對每個視窗由虛擬源點跑 Dijkstra，取到物品 1 的最小值。
proof_or_invariant: 任一合法交易方案涉及的等級集合落在某個枚舉視窗；該方案對應視窗子圖的一條路。反之子圖任一路只用視窗內人物，等級差合法。每個視窗 Dijkstra 最優，跨視窗取小即全域最優。
complexity: { time: 'O(M(N+E) log N)', space: 'O(N+E)' }
common_errors: [替代邊方向接反, 等級視窗未強制包含物品 1, 把 M 當作上下各可差 M]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int limit,n;cin>>limit>>n;/* TODO：枚舉等級視窗跑 Dijkstra。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int limit,n;if(!(cin>>limit>>n))return 0;vector<int> level(static_cast<size_t>(n+1));vector<vector<pair<int,int>>> graph(static_cast<size_t>(n+1));
      for(int item=1;item<=n;++item){int price,count;cin>>price>>level[static_cast<size_t>(item)]>>count;graph[0].push_back({item,price});while(count-->0){int source,cost;cin>>source>>cost;graph[static_cast<size_t>(source)].push_back({item,cost});}}
      const long long inf=LLONG_MAX/4;long long answer=inf;int target_level=level[1];
      for(int low=target_level-limit;low<=target_level;++low){vector<long long> dist(static_cast<size_t>(n+1),inf);priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>> queue;dist[0]=0;queue.push({0,0});
          while(!queue.empty()){auto[d,u]=queue.top();queue.pop();if(d!=dist[static_cast<size_t>(u)])continue;for(const auto& [v,w]:graph[static_cast<size_t>(u)])if(level[static_cast<size_t>(v)]>=low&&level[static_cast<size_t>(v)]<=low+limit&&d+w<dist[static_cast<size_t>(v)]){dist[static_cast<size_t>(v)]=d+w;queue.push({d+w,v});}}
          answer=min(answer,dist[1]);
      }
      cout<<answer<<'\n';
  }
external_url: http://bailian.openjudge.cn/practice/1062/
external_platform: OpenJudge 百練
external_problem_id: '1062'
external_title: 昂貴的聘禮
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

全域等級限制不適合直接放進距離；枚舉包含目標的等級視窗後，每個子問題就是普通最短路。
