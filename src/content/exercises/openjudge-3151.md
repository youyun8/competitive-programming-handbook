---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: openjudge-3151
title: OpenJudge 百練 3151 Pots
section: '3.1'
difficulty: 2
topics:
  - breadth-first-search
  - path-reconstruction
prerequisites:
  - queue
statement: 容量 A、B 的兩水壺初始皆空。每步可裝滿一壺、倒空一壺，或互倒至來源空或目的滿。求讓任一壺恰有 C 公升的最短操作序列。
constraints:
  - 1 <= A,B,C <= 100
  - C <= max(A,B)
  - 多個最短序列可輸出任一個
input_format: 一行 A、B、C。
output_format: 可行時先輸出步數再逐行操作；否則輸出 impossible。
samples:
  - input: |
      3 5 4
    output: |-
      6
      FILL(2)
      POUR(2,1)
      DROP(1)
      POUR(2,1)
      FILL(2)
      POUR(2,1)
    explanation: 六次操作後第二壺剩四公升；BFS 保證操作數最少。
core_knowledge:
  - 二維容量狀態 BFS
  - 父狀態與操作復原
judgment: 倒水必須持續到來源壺空或目的壺滿，不能任意中止。
hints:
  - 狀態只需記兩壺目前水量 (x,y)。
  - 每個狀態固定產生裝、倒、互倒共六種後繼。
  - 首次到達 x=C 或 y=C 後沿父指標回溯操作並反轉。
solution_outline: 在 (A+1)(B+1) 個狀態上 BFS，記錄父狀態及六種操作編號，找到目標後復原。
proof_or_invariant: 六個轉移與所有合法單步操作一一對應。BFS 第一次到達目標的層數最小；父鏈每段都是實際轉移，因此輸出序列合法且最短。
complexity:
  time: O(AB)
  space: O(AB)
common_errors:
  - 互倒時允許任意停止
  - 只判斷第一個壺是否有 C
  - 父鏈輸出順序未反轉
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int a,b,c;cin>>a>>b>>c;int width=b+1,total=(a+1)*width;vector<int>parent(total,-2),op(total,-1);queue<int>q;parent[0]=-1;q.push(0);int goal=-1;const array<string,6>name={"FILL(1)","FILL(2)","DROP(1)","DROP(2)","POUR(1,2)","POUR(2,1)"};while(!q.empty()){int id=q.front();q.pop();int x=id/width,y=id%width;if(x==c||y==c){goal=id;break;}int t12=min(x,b-y),t21=min(y,a-x);array<pair<int,int>,6>nxt={{{a,y},{x,b},{0,y},{x,0},{x-t12,y+t12},{x+t21,y-t21}}};for(int k=0;k<6;++k){int nid=nxt[k].first*width+nxt[k].second;if(parent[nid]!=-2)continue;parent[nid]=id;op[nid]=k;q.push(nid);}}if(goal<0){cout<<"impossible\n";return 0;}vector<int>ops;for(int x=goal;parent[x]!=-1;x=parent[x])ops.push_back(op[x]);reverse(ops.begin(),ops.end());cout<<ops.size()<<'\n';for(int x:ops)cout<<name[x]<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int a,b,c;cin>>a>>b>>c;int width=b+1,total=(a+1)*width;vector<int>parent(total,-2),op(total,-1);queue<int>q;parent[0]=-1;q.push(0);int goal=-1;const array<string,6>name={"FILL(1)","FILL(2)","DROP(1)","DROP(2)","POUR(1,2)","POUR(2,1)"};while(!q.empty()){int id=q.front();q.pop();int x=id/width,y=id%width;if(x==c||y==c){goal=id;break;}int t12=min(x,b-y),t21=min(y,a-x);array<pair<int,int>,6>nxt={{{a,y},{x,b},{0,y},{x,0},{x-t12,y+t12},{x+t21,y-t21}}};for(int k=0;k<6;++k){int nid=nxt[k].first*width+nxt[k].second;if(parent[nid]!=-2)continue;parent[nid]=id;op[nid]=k;q.push(nid);}}if(goal<0){cout<<"impossible\n";return 0;}vector<int>ops;for(int x=goal;parent[x]!=-1;x=parent[x])ops.push_back(op[x]);reverse(ops.begin(),ops.end());cout<<ops.size()<<'\n';for(int x:ops)cout<<name[x]<<'\n';}
external_url: http://bailian.openjudge.cn/practice/3151/
external_platform: OpenJudge 百練
external_problem_id: '3151'
external_title: OpenJudge 百練 3151 Pots
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
