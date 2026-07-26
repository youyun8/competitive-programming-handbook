---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: openjudge-4001
title: OpenJudge 百練 4001 抓住那頭牛
section: '3.1'
difficulty: 1
topics:
  - breadth-first-search
  - number-line
prerequisites:
  - queue
statement: 農夫位於數軸 N，牛固定在 K。每分鐘可由 x 到 x-1、x+1 或 2x，求最少時間。
constraints:
  - 0 <= N,K <= 100000
  - 牛不移動
  - 三種動作皆耗時一分鐘
input_format: 兩個整數 N、K。
output_format: 輸出最少分鐘數。
samples:
  - input: |
      5 17
    output: '4'
    explanation: 例如 5→10→9→18→17，共四分鐘。
core_knowledge:
  - 隱式無權圖 BFS
  - 安全搜尋邊界
judgment: 位置不能小於 0；只需搜尋到 2*max(N,K)+2。
hints:
  - 若 N>=K，持續減一顯然最短。
  - 否則把每個整數位置視為節點，三種動作是單位邊。
  - 限制上界為目標兩倍附近；超過後直接走回來不會優於先抵達 K。
solution_outline: 特判 N>=K；否則在有限區間對三種轉移 BFS。
proof_or_invariant: 有限區間包含某條最短路，因超過 2K 再回到 K 不優於從 K 以下直接前進。BFS 對單位邊第一次抵達 K 的距離即最短。
complexity:
  time: O(max(N,K))
  space: O(max(N,K))
common_errors:
  - 搜尋陣列上界不足
  - 將倍增動作當成零成本
  - 沒有判重
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,k;cin>>n>>k;if(n>=k){cout<<n-k<<'\n';return 0;}int limit=2*k+2;vector<int>dist(limit+1,-1);queue<int>q;q.push(n);dist[n]=0;while(!q.empty()){int x=q.front();q.pop();for(int y:{x-1,x+1,2*x})if(y>=0&&y<=limit&&dist[y]<0){dist[y]=dist[x]+1;q.push(y);}}cout<<dist[k]<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,k;cin>>n>>k;if(n>=k){cout<<n-k<<'\n';return 0;}int limit=2*k+2;vector<int>dist(limit+1,-1);queue<int>q;q.push(n);dist[n]=0;while(!q.empty()){int x=q.front();q.pop();for(int y:{x-1,x+1,2*x})if(y>=0&&y<=limit&&dist[y]<0){dist[y]=dist[x]+1;q.push(y);}}cout<<dist[k]<<'\n';}
external_url: http://bailian.openjudge.cn/practice/4001/
external_platform: OpenJudge 百練
external_problem_id: '4001'
external_title: OpenJudge 百練 4001 抓住那頭牛
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
