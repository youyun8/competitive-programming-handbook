---
id: openj-bailian-1125
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 1125
title: 百練 1125 Stockbroker Grapevine：最小離心率
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 2
topics: [Floyd-Warshall, 圖中心, 有向圖]
prerequisites: [dijkstra]
core_knowledge: [全源最短路, 點離心率, 不可達]
judgment: 從起點傳遍所有人的時間是該點到其餘點最短距離的最大值。
statement: 多組帶權有向通訊網，選一名經紀人作消息源，使消息傳到所有人的最晚時間最小；若不存在能傳遍全圖者輸出 disjoint。
constraints: ['n <= 100', 'n=0 結束']
input_format: 每組先給 n；每人一行先給出邊數，再給多組目的與時間。
output_format: 輸出最佳起點編號與最短最晚時間，或 disjoint。
samples:
  - input: |-
      3
      2 2 4 3 2
      1 3 1
      1 1 3
      0
    output: '1 4'
    explanation: 從 1 到 3 需 2、到 2 需 4，最晚為 4；其他起點不更優。
hints:
  - Floyd 求有向圖任兩點最短距離。
  - 每個候選起點的成本是該列最大值。
  - 該列若有無限距離，這個起點不能傳遍全圖。
solution_outline: 初始化有向距離矩陣並 Floyd，逐列計算有限離心率，取最小者。
proof_or_invariant: Floyd 後 d[s][v] 是消息由 s 傳到 v 的最快時間；所有人收到的時刻由其中最大值決定。枚舉所有可達全圖的 s 並最小化，正是題目目標。
complexity: { time: 'O(n^3)', space: 'O(n^2)' }
common_errors: [把通訊邊當雙向, 有不可達點仍取該列最大值, 點編號輸出少加一]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;while(cin>>n&&n){/* TODO：Floyd 後找最小離心率。 */}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n;while(cin>>n&&n!=0){const int inf=1000000000;vector<vector<int>> d(static_cast<size_t>(n),vector<int>(static_cast<size_t>(n),inf));
          for(int i=0;i<n;++i){d[static_cast<size_t>(i)][static_cast<size_t>(i)]=0;int count;cin>>count;while(count-->0){int v,w;cin>>v>>w;d[static_cast<size_t>(i)][static_cast<size_t>(v-1)]=min(d[static_cast<size_t>(i)][static_cast<size_t>(v-1)],w);}}
          for(int k=0;k<n;++k)for(int i=0;i<n;++i)for(int j=0;j<n;++j)if(d[static_cast<size_t>(i)][static_cast<size_t>(k)]<inf&&d[static_cast<size_t>(k)][static_cast<size_t>(j)]<inf)d[static_cast<size_t>(i)][static_cast<size_t>(j)]=min(d[static_cast<size_t>(i)][static_cast<size_t>(j)],d[static_cast<size_t>(i)][static_cast<size_t>(k)]+d[static_cast<size_t>(k)][static_cast<size_t>(j)]);
          int best=-1,best_time=inf;for(int i=0;i<n;++i){int maximum=0;for(int value:d[static_cast<size_t>(i)])maximum=max(maximum,value);if(maximum<best_time){best_time=maximum;best=i;}}
          if(best<0||best_time>=inf)cout<<"disjoint\n";else cout<<best+1<<' '<<best_time<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1125/
external_platform: OpenJudge 百練
external_problem_id: '1125'
external_title: Stockbroker Grapevine
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

選最佳消息源就是在有向最短路度量下尋找離心率最小的點。
