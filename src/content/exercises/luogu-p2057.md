---
id: luogu-p2057
volume: lower
source_file: lower-volume
original_label: '洛谷 P2057'
title: '洛谷 P2057 善意的投票'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 3
topics: ['二元標號', '最小割']
prerequisites: ['max-flow']
statement: |-
  每人有原意願，朋友投票不同及改變原意願各產生一個衝突，求最少衝突。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 3
      1 0 0
      1 2
      1 3
      3 2
    output: |-
      1
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二元標號', '最小割']
judgment: |-
  源側與匯側代表兩種投票；個人原意願用一條容量一的終端邊表示。
hints:
  - '先辨識核心轉換：二元標號、最小割。'
  - '源側與匯側代表兩種投票；個人原意願用一條容量一的終端邊表示。'
  - '依「朋友間加入雙向容量一；跑一次 s-t 最小割。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  朋友間加入雙向容量一；跑一次 s-t 最小割。
proof_or_invariant: |-
  終端割邊恰計一次改票，跨側朋友邊恰計一次意見不合，因此割容量與衝突數完全相同。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(V^2E)'
  space: 'O(V+E)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依卡片解法建立圖或狀態，完成增廣／動態規劃並輸出答案。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wcomment"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #endif
  #include <bits/stdc++.h>
  #define inf 0x3f3f3f3f
  using namespace std;
  const int N=200520;
  int n,m,s,t,pos,tot=1,maxflow;
  int vis[N],incf[N],pre[N],head[N],Next[N],ver[N],edge[N];
  void add(int x,int y,int z){
      ver[++tot]=y;edge[tot]=z;Next[tot]=head[x];head[x]=tot;
      ver[++tot]=x;edge[tot]=0;Next[tot]=head[y];head[y]=tot;
  }
  bool bfs(){
      memset(vis,0,sizeof(vis));vis[s]=1;
      queue<int> q;q.push(s);
      incf[s]=inf;
      while(q.size()){
          int x=q.front();q.pop();
          for(int i=head[x];i;i=Next[i])
              if(edge[i]){
                  int y=ver[i];
                  if(vis[y])continue;
                  incf[y]=min(incf[x],edge[i]);
                  pre[y]=i;
                  q.push(y);
                  vis[y]=1;
                  if(y==t)return 1;
              }
      }
      return 0;
  }
  void update(){
      int x=t;
      while(x!=s){
          int i=pre[x];
          edge[i]-=incf[t];
          edge[i^1]+=incf[t];
          x=ver[i^1];
      }
      maxflow+=incf[t];
  }
  int main(){
      ios::sync_with_stdio(false);
      cin>>n>>m;
      s=0,t=n+1;
      for(int i=1;i<=n;i++){
          cin>>pos;
          if(pos)add(s,i,1);
          else add(i,t,1);
      }
      for(int i=1;i<=m;i++){
          int x,y;
          cin>>x>>y;
          add(x,y,1);
          add(y,x,1);
      }
      while(bfs())update();
      cout<<maxflow<<endl;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2057
external_platform: '洛谷'
external_problem_id: 'P2057'
external_title: '善意的投票'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
