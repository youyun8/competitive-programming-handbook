---
id: openj-bailian-2253
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 2253
title: 百練 2253 Frogger：最小瓶頸路徑
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [最小瓶頸路徑, Dijkstra, 計算幾何]
prerequisites: [dijkstra]
core_knowledge: [路徑最大邊, min-max 鬆弛, 歐氏距離]
judgment: 路徑代價不是邊長總和，而是其中最長一跳。
statement: 給定湖中石頭座標，求由第 1 顆到第 2 顆的所有路徑中，最大單跳距離的最小值。
constraints: ['2 <= n <= 200', '座標介於 0 與 1000', 'n=0 結束']
input_format: 多組資料；每組 n 與 n 個座標，0 結束。
output_format: 依指定 Scenario 與 Frog Distance 格式輸出三位小數，組間空行。
samples:
  - input: |-
      2
      0 0
      3 4
      0
    output: |-
      Scenario #1
      Frog Distance = 5.000
    explanation: 只有兩顆石頭，必須直接跳 5 單位。
hints:
  - dist[v] 定義為從起點到 v 的最小可能最大邊。
  - 經 u 到 v 的候選值是 max(dist[u], weight(u,v))。
  - 此代價具單調性，可沿用 Dijkstra 每次確定最小暫定值的貪心。
solution_outline: 完全圖邊權為歐氏距離，使用 min-max 版 Dijkstra 求第 2 顆石頭的瓶頸值。
proof_or_invariant: 所有延伸路徑的瓶頸不小於前綴瓶頸，因此未確定點中 dist 最小者不可能經其他更大暫定值改善，Dijkstra 貪心成立；鬆弛完整枚舉最後一跳。
complexity: { time: 'O(n^2)', space: 'O(n)' }
common_errors: [仍把邊長相加, 輸出格式缺空行, 把第 1 與第 2 顆石頭索引寫錯]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;while(cin>>n&&n){/* TODO：min-max Dijkstra。 */}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,case_no=0;while(cin>>n&&n!=0){
          vector<double>x(static_cast<size_t>(n)),y(static_cast<size_t>(n));for(int i=0;i<n;++i)cin>>x[static_cast<size_t>(i)]>>y[static_cast<size_t>(i)];
          vector<double> dist(static_cast<size_t>(n),1e100);vector<char> used(static_cast<size_t>(n),0);dist[0]=0;
          for(int step=0;step<n;++step){int u=-1;for(int i=0;i<n;++i)if(!used[static_cast<size_t>(i)]&&(u<0||dist[static_cast<size_t>(i)]<dist[static_cast<size_t>(u)]))u=i;used[static_cast<size_t>(u)]=1;
              for(int v=0;v<n;++v){double edge=hypot(x[static_cast<size_t>(u)]-x[static_cast<size_t>(v)],y[static_cast<size_t>(u)]-y[static_cast<size_t>(v)]);dist[static_cast<size_t>(v)]=min(dist[static_cast<size_t>(v)],max(dist[static_cast<size_t>(u)],edge));}}
          cout<<"Scenario #"<<++case_no<<"\nFrog Distance = "<<fixed<<setprecision(3)<<dist[1]<<"\n\n";
      }
  }
external_url: http://bailian.openjudge.cn/practice/2253/
external_platform: OpenJudge 百練
external_problem_id: '2253'
external_title: Frogger
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

最短路框架可推廣到任何滿足單調延伸的路徑代價；瓶頸最小化就是代表例。
