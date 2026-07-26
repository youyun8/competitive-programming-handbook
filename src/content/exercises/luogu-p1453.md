---
id: luogu-p1453
volume: lower
source_file: lower-volume
original_label: 洛谷 P1453
title: 洛谷 P1453 城市環路：基環樹最大權獨立集
chapter: 10
section: '10.6'
kind: external-oj
difficulty: 4
topics: [基環樹, 樹形 DP, 最大權獨立集]
prerequisites: [trees, dynamic-programming]
core_knowledge: [剝葉找環, 樹枝 DP, 環形 DP]
judgment: n 點 n 邊且連通，唯一環外都是掛樹；相鄰點不能同選。
statement: 連通單圈圖每點有權值，相鄰點不可同時選；最大化所選權值和，最後乘給定實數 k 並保留一位小數。
constraints: ['n <= 100000', '點編號 0..n-1', '圖連通且恰有一環']
input_format: 第一行 n；第二行 n 個點權；接著 n 條無向邊；最後輸入實數 k。
output_format: 輸出最大權值和乘 k，保留一位小數。
samples:
  - input: |-
      3
      1 2 3
      0 1
      1 2
      2 0
      1.0
    output: '3.0'
    explanation: 三角形至多選一點，選權值 3 的點最佳。
hints:
  - 反覆移除度數 1 的點，最後留下唯一環。
  - 被移除的樹枝可由葉向根累積：不選父可取子兩狀態最大值，選父只能不選子。
  - 環上做兩次鏈 DP：第一點強制不選，或強制選且最後一點不得選。
solution_outline: 以剝葉同時完成掛樹 DP，取得每個環點含樹枝的選或不選價值；沿環排序後分首點兩種狀態做環形獨立集 DP。
proof_or_invariant: 剝葉時子樹已完整處理，兩式正是獨立集的局部最優。剩餘環點間唯一耦合是相鄰不可同選；分首點選否後環被化為鏈，鏈 DP 完整枚舉合法狀態，兩案取大即全圖最優。
complexity: { time: 'O(n)', space: 'O(n)' }
common_errors: [樹枝 DP 忘記累加到環根, 環形 DP 未限制首尾, 輸出乘 k 前使用整數或精度錯誤]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;cin>>n;/* TODO：剝葉樹 DP，再做環形 DP。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n;if(!(cin>>n))return 0;vector<long long> weight(static_cast<size_t>(n));for(long long& x:weight)cin>>x;vector<vector<int>> graph(static_cast<size_t>(n));vector<int> degree(static_cast<size_t>(n));
      for(int i=0;i<n;++i){int u,v;cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);++degree[static_cast<size_t>(u)];++degree[static_cast<size_t>(v)];}
      vector<long long> dp0(static_cast<size_t>(n),0),dp1=weight;queue<int> leaves;vector<char> removed(static_cast<size_t>(n));for(int i=0;i<n;++i)if(degree[static_cast<size_t>(i)]==1)leaves.push(i);
      while(!leaves.empty()){int u=leaves.front();leaves.pop();removed[static_cast<size_t>(u)]=1;for(int v:graph[static_cast<size_t>(u)])if(!removed[static_cast<size_t>(v)]){dp0[static_cast<size_t>(v)]+=max(dp0[static_cast<size_t>(u)],dp1[static_cast<size_t>(u)]);dp1[static_cast<size_t>(v)]+=dp0[static_cast<size_t>(u)];if(--degree[static_cast<size_t>(v)]==1)leaves.push(v);}}
      vector<int> cycle;int start=0;while(start<n&&removed[static_cast<size_t>(start)])++start;int previous=-1,current=start;do{cycle.push_back(current);int next=-1;for(int v:graph[static_cast<size_t>(current)])if(!removed[static_cast<size_t>(v)]&&v!=previous){next=v;break;}previous=current;current=next;}while(current!=start);
      const long long neg=LLONG_MIN/4;auto solve=[&](bool take_first){long long no=take_first?neg:dp0[static_cast<size_t>(cycle[0])],yes=take_first?dp1[static_cast<size_t>(cycle[0])]:neg;for(size_t i=1;i<cycle.size();++i){int u=cycle[i];long long new_no=max(no,yes)+dp0[static_cast<size_t>(u)],new_yes=no+dp1[static_cast<size_t>(u)];no=new_no;yes=new_yes;}return take_first?no:max(no,yes);};
      double factor;cin>>factor;cout<<fixed<<setprecision(1)<<static_cast<double>(max(solve(false),solve(true)))*factor<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P1453
external_platform: 洛谷
external_problem_id: P1453
external_title: 城市環路
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

剝葉不只找環，也能順手把樹枝 DP 壓回環點，最後只剩一個環形序列問題。
