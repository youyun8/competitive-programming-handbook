---
id: openj-bailian-3760
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 3760
title: 百練 3760 Sightseeing Cows：分數規劃
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: [01 分數規劃, Bellman-Ford, 最大平均環]
prerequisites: [dijkstra]
core_knowledge: [收益時間比, 二分答案, 正環]
judgment: 候選比值 r 可行，當且僅當存在環使 Σ(fun[u]-r×time)>0。
statement: 有向圖點有觀光收益、邊有旅行時間，求環的總收益與總時間之比最大值。
constraints: [收益時間皆為正, 圖中存在環]
input_format: 第一行 n、m；接著 n 個收益，再輸入 m 條起點、終點、時間。
output_format: 輸出最大收益率，保留兩位小數。
samples:
  - input: |-
      2 2
      10
      20
      1 2 2
      2 1 3
    output: '6.00'
    explanation: 唯一環的收益率為 (10+20)/(2+3)=6。
hints:
  - 二分答案 mid 並將邊權改為 fun[u]-mid×time。
  - 轉換圖存在正環就表示 mid 還可提高。
  - 從虛擬源點連向所有點，等價於所有距離初始化為 0。
solution_outline: 二分答案，每次以 Bellman-Ford 最長路判任意正環，迭代足夠次數後輸出下界。
proof_or_invariant: 每個環的轉換總權正是總收益-mid×總時間；其為正與原收益率大於 mid 等價。可行性對 mid 單調，故二分極限為最大比值。
complexity: { time: 'O(60nm)', space: 'O(n+m)' }
common_errors: [只檢查從 1 可達的環, 二分方向顛倒, 輸出精度不足]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m;cin>>n>>m;/* TODO：二分並判正環。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int from,to,time;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;if(!(cin>>n>>m))return 0;vector<double> fun(static_cast<size_t>(n));double high=0;for(double& x:fun){cin>>x;high=max(high,x);}vector<Edge> edges;for(int i=0;i<m;++i){int u,v,t;cin>>u>>v>>t;edges.push_back({u-1,v-1,t});}
      auto check=[&](double average){vector<double> dist(static_cast<size_t>(n),0);for(int round=1;round<=n;++round){bool changed=false;for(const Edge& e:edges){double candidate=dist[static_cast<size_t>(e.from)]+fun[static_cast<size_t>(e.from)]-average*e.time;if(candidate>dist[static_cast<size_t>(e.to)]+1e-12){dist[static_cast<size_t>(e.to)]=candidate;changed=true;if(round==n)return true;}}if(!changed)break;}return false;};
      double low=0;for(int iteration=0;iteration<60;++iteration){double middle=(low+high)/2;if(check(middle))low=middle;else high=middle;}cout<<fixed<<setprecision(2)<<low<<'\n';
  }
external_url: http://bailian.openjudge.cn/practice/3760/
external_platform: OpenJudge 百練
external_problem_id: '3760'
external_title: Sightseeing Cows
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

平均收益環是分數規劃與環判定結合的標準模型。
