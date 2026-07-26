---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: luogu-p1378
title: 洛谷 P1378 油滴擴展
section: '3.1'
difficulty: 3
topics:
  - depth-first-search
  - permutation
  - geometry
prerequisites:
  - circle-area
  - backtracking
statement: 長方形內有 n
  個指定圓心。依某個順序放置油滴；每滴以該點為圓心擴張，碰到邊框或先前油滴即停止。枚舉放置順序，使油滴總面積最大，輸出長方形未被油滴覆蓋的最小面積。
constraints:
  - 1 <= n <= 6
  - 各圓心相異且位於長方形內
  - 座標為整數，結果四捨五入為整數
input_format: 第一行 n；第二行為長方形一對對角頂點；其後 n 行為各圓心座標。
output_format: 輸出長方形面積減去最大油滴總面積，四捨五入為整數。
samples:
  - input: |
      2
      20 0 10 10
      13 3
      17 7
    output: '50'
    explanation: 先放任一油滴後，另一滴受邊界與既有圓限制；最佳總覆蓋面積四捨五入後使剩餘面積為 50。
core_knowledge:
  - 排列型回溯
  - 點到四邊及兩圓相切距離
judgment: 每個油滴只能受已經擴張完成的油滴限制；若圓心已落在既有圓內，該滴半徑為零。
hints:
  - 固定目前要放的圓心，先算它到四條邊的最短距離。
  - 再用它到每個已放圓心的距離減該圓半徑取最小值，負值視為零。
  - n 至多 6；枚舉全部順序，累加 πr² 並保留最大值。
solution_outline: DFS 枚舉圓心排列；選入圓心時由邊界與已放圓計算唯一最大半徑，回溯後撤銷。以長方形面積扣除最大總圓面積。
proof_or_invariant: 固定放置順序後，每滴半徑若小於最早碰撞距離仍可擴張，若更大則違規，故程式計算值是該順序唯一最大半徑。DFS 枚舉所有順序，因此最大面積為全域最優。
complexity:
  time: O(n! * n^2)
  space: O(n)
common_errors:
  - 只算到邊框距離，忽略先放油滴
  - 使用直徑而非半徑計算面積
  - 未處理圓心落在既有圓內
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  struct Point { double x, y; };
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;if(!(cin>>n))return 0;double x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;double left=min(x1,x2),right=max(x1,x2),bottom=min(y1,y2),top=max(y1,y2);vector<Point> p(n);for(auto& q:p)cin>>q.x>>q.y;vector<double> radius(n);vector<bool> used(n);double best=0.0;const auto dfs=[&](const auto& self,int depth,double area)->void{best=max(best,area);if(depth==n)return;for(int i=0;i<n;++i){if(used[i])continue;double r=min({p[i].x-left,right-p[i].x,p[i].y-bottom,top-p[i].y});for(int j=0;j<n;++j)if(used[j])r=min(r,hypot(p[i].x-p[j].x,p[i].y-p[j].y)-radius[j]);r=max(0.0,r);used[i]=true;radius[i]=r;self(self,depth+1,area+acos(-1.0)*r*r);used[i]=false;}};dfs(dfs,0,0.0);cout<<llround((right-left)*(top-bottom)-best)<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  struct Point { double x, y; };
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;if(!(cin>>n))return 0;double x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;double left=min(x1,x2),right=max(x1,x2),bottom=min(y1,y2),top=max(y1,y2);vector<Point> p(n);for(auto& q:p)cin>>q.x>>q.y;vector<double> radius(n);vector<bool> used(n);double best=0.0;const auto dfs=[&](const auto& self,int depth,double area)->void{best=max(best,area);if(depth==n)return;for(int i=0;i<n;++i){if(used[i])continue;double r=min({p[i].x-left,right-p[i].x,p[i].y-bottom,top-p[i].y});for(int j=0;j<n;++j)if(used[j])r=min(r,hypot(p[i].x-p[j].x,p[i].y-p[j].y)-radius[j]);r=max(0.0,r);used[i]=true;radius[i]=r;self(self,depth+1,area+acos(-1.0)*r*r);used[i]=false;}};dfs(dfs,0,0.0);cout<<llround((right-left)*(top-bottom)-best)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1378
external_platform: 洛谷
external_problem_id: P1378
external_title: 油滴擴展
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
