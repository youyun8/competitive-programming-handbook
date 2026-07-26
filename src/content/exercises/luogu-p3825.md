---
id: luogu-p3825
volume: lower
source_file: lower-volume
original_label: 洛谷 P3825
title: 洛谷 P3825 遊戲：枚舉未知地圖與 2-SAT
chapter: 10
section: '10.7'
kind: external-oj
difficulty: 5
topics: [2-SAT, 強連通分量, 狀態枚舉]
prerequisites: [directed-connectivity]
core_knowledge: [每場兩種可用車, 蘊含與逆否, 未知地圖枚舉]
judgment: 固定每個 x 地圖禁用 A 或 B 後，每場恰有兩種可用車，可化為布林變數。
statement: 每場地圖禁用 A、B、C 中一種車，少數 x 地圖的禁用類型未知；規則「第 i 場用 hi，則第 j 場必須用 hj」。輸出任一合法安排或 -1。
constraints: ['n <= 50000', 'm <= 100000', 'x 地圖數 d <= 8']
input_format: 第一行 n、d；第二行地圖字串；第三行 m；接著 m 行 i、hi、j、hj。
output_format: 有解輸出長度 n 的 A/B/C 字串，無解輸出 -1。
samples:
  - input: |-
      2 0
      ab
      1
      1 B 2 A
    output: 'BA'
    explanation: a 地圖可用 B/C、b 地圖可用 A/C；選 B、A 滿足唯一蘊含。
hints:
  - 禁用 A/B/C 時，可用車分別為 BC、AC、AB。
  - 規則 p→q 加 p→q 與 ¬q→¬p；若 q 不可用，規則退化成強制 ¬p。
  - x 只需枚舉禁用 A 或 B：兩組可用集合 BC、AC 的聯集已覆蓋 A/B/C 的所有可能選擇。
solution_outline: 枚舉至多 2^d 種未知地圖替代；每次建立兩倍點的蘊含圖，以迭代 Kosaraju 求 SCC，檢查每個變數兩狀態是否同 SCC，首個可行解依 SCC 拓撲序輸出。
proof_or_invariant: 固定禁用類型後，兩個節點與該場全部合法選擇一一對應；每條規則及逆否命題與兩條邊等價，不可用後件正確退化為禁止前件。2-SAT SCC 判據為充要。任一原問題解在 x 場所選車必落於 BC 或 AC 至少一組，故二元枚舉不漏解。
complexity: { time: 'O(2^d(n+m))', space: 'O(n+m)' }
common_errors: [枚舉 x 的三種禁用造成 3^d, 後件不可用時直接忽略整條規則, 只加蘊含而漏加逆否邊]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,d;cin>>n>>d;/* TODO：枚舉 x，建立 2-SAT 並以 SCC 判定。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Rule{int from,to;char from_car,to_car;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,d;if(!(cin>>n>>d))return 0;string original;cin>>original;vector<int> unknown;for(int i=0;i<n;++i)if(original[static_cast<size_t>(i)]=='x')unknown.push_back(i);int m;cin>>m;vector<Rule> rules(static_cast<size_t>(m));for(Rule& rule:rules){cin>>rule.from>>rule.from_car>>rule.to>>rule.to_car;--rule.from;--rule.to;}
      auto choices=[](char forbidden){if(forbidden=='A')return array<char,2>{'B','C'};if(forbidden=='B')return array<char,2>{'A','C'};return array<char,2>{'A','B'};};
      for(int mask=0;mask<(1<<d);++mask){string forbidden=original;for(int bit=0;bit<d;++bit)forbidden[static_cast<size_t>(unknown[static_cast<size_t>(bit)])]=((mask>>bit)&1)?'A':'B';for(char& value:forbidden)value=static_cast<char>(toupper(static_cast<unsigned char>(value)));
          vector<array<char,2>> available(static_cast<size_t>(n));for(int i=0;i<n;++i)available[static_cast<size_t>(i)]=choices(forbidden[static_cast<size_t>(i)]);vector<vector<int>> graph(static_cast<size_t>(2*n)),reverse_graph(static_cast<size_t>(2*n));
          auto add_edge=[&](int from,int to){graph[static_cast<size_t>(from)].push_back(to);reverse_graph[static_cast<size_t>(to)].push_back(from);};
          auto state=[&](int position,char car){if(available[static_cast<size_t>(position)][0]==car)return 2*position;if(available[static_cast<size_t>(position)][1]==car)return 2*position+1;return -1;};
          for(const Rule& rule:rules){int premise=state(rule.from,rule.from_car);if(premise<0)continue;int consequence=state(rule.to,rule.to_car);if(consequence<0)add_edge(premise,premise^1);else{add_edge(premise,consequence);add_edge(consequence^1,premise^1);}}
          vector<char> visited(static_cast<size_t>(2*n));vector<int> order;for(int start=0;start<2*n;++start)if(!visited[static_cast<size_t>(start)]){visited[static_cast<size_t>(start)]=1;vector<pair<int,size_t>> stack{{start,0}};while(!stack.empty()){int u=stack.back().first;size_t& index=stack.back().second;if(index<graph[static_cast<size_t>(u)].size()){int v=graph[static_cast<size_t>(u)][index++];if(!visited[static_cast<size_t>(v)]){visited[static_cast<size_t>(v)]=1;stack.push_back({v,0});}}else{order.push_back(u);stack.pop_back();}}}
          vector<int> component(static_cast<size_t>(2*n),-1);int component_count=0;for(auto iterator=order.rbegin();iterator!=order.rend();++iterator)if(component[static_cast<size_t>(*iterator)]<0){component[static_cast<size_t>(*iterator)]=component_count;vector<int> stack{*iterator};while(!stack.empty()){int u=stack.back();stack.pop_back();for(int v:reverse_graph[static_cast<size_t>(u)])if(component[static_cast<size_t>(v)]<0){component[static_cast<size_t>(v)]=component_count;stack.push_back(v);}}++component_count;}
          bool possible=true;for(int i=0;i<n;++i)if(component[static_cast<size_t>(2*i)]==component[static_cast<size_t>(2*i+1)])possible=false;if(!possible)continue;string answer;answer.reserve(static_cast<size_t>(n));for(int i=0;i<n;++i){int chosen=component[static_cast<size_t>(2*i)]>component[static_cast<size_t>(2*i+1)]?0:1;answer.push_back(available[static_cast<size_t>(i)][static_cast<size_t>(chosen)]);}cout<<answer<<'\n';return 0;
      }
      cout<<"-1\n";
  }
external_url: https://www.luogu.com.cn/problem/P3825
external_platform: 洛谷
external_problem_id: P3825
external_title: '[NOI2017] 遊戲'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

未知地圖只有八個，先枚舉把三選問題降成二選，再交給標準 2-SAT；這比直接建三值 SAT 更簡潔且有完備性證明。
