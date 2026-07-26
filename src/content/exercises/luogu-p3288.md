---
id: luogu-p3288
volume: lower
source_file: lower-volume
source_book_pages:
  - 414
source_pdf_pages:
  - 44
title: Luogu P3288 方伯伯運椰子
chapter: 6
section: '6.6'
kind: external-oj
difficulty: 5
topics: &a1
  - 0/1 分數規劃
  - 負環判定
prerequisites:
  - 模運算與線性方程
  - 依題型所需的圖論或數論基礎
statement: 有向運輸網每條邊給定單位運費 a、調整費 b、目前流量 c 與容量 d。在保持源匯總流量不變下調整整數流，最大化「原費用減新費用」除以修改的邊數。
constraints:
  - 節點與邊依官方資料範圍
  - 答案保證為正
input_format: 第一行 n、m；接著 m 行 u、v、a、b、c、d。
output_format: 輸出最優比值，保留兩位小數。
samples:
  - input: |
      5 10
      1 5 13 13 0 412
      2 5 30 18 396 148
      1 5 33 31 0 39
      4 5 22 4 0 786
      4 5 13 32 0 561
      4 5 3 48 0 460
      2 5 32 47 604 258
      5 7 44 37 75 164
      5 7 34 50 925 441
      6 2 26 38 1000 22
    output: |
      103.00
    explanation: 在殘量圖選取最佳流量替換環後，每次調整的最大平均節省為 103。
core_knowledge: *a1
judgment: 把一單位退流建成反向邊、增流建成正向邊；流量守恆的修改分解為環。二分平均收益 mid，將每條修改邊扣除 mid，以 SPFA 判定是否存在非負收益環。
hints:
  - 先把隨機過程、流量調整或冪次條件寫成代數式。
  - 辨認固定維矩陣、線性方程、分數規劃或同餘系統，避免直接模擬巨大狀態。
  - 處理自由變數、非互質模數、數值精度與溢位等邊界後再輸出。
solution_outline: 把一單位退流建成反向邊、增流建成正向邊；流量守恆的修改分解為環。二分平均收益 mid，將每條修改邊扣除 mid，以 SPFA 判定是否存在非負收益環。
proof_or_invariant: 任一保持各點流量守恆的差流可分解為有向環；反之每個殘量環都是合法修改。故某修改平均收益至少 mid，等價於殘量圖存在調整後總權非負的環，二分判定單調。
complexity:
  time: O(log(R/eps)·SPFA(n,m))
  space: O(n+m)
common_errors:
  - 退流邊方向或收益符號顛倒
  - 容量為零仍建立退流邊
  - 只從單一節點找環
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
    // TODO：依三段提示建立核心狀態與演算法。
    return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct E{int to;double w;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;if(!(cin>>n>>m))return 0;n+=2;vector<vector<E>>g(n+1);for(int i=0;i<m;++i){int u,v,a,b,c,d;cin>>u>>v>>a>>b>>c>>d;g[u].push_back({v,-static_cast<double>(b+d)});if(c>0)g[v].push_back({u,static_cast<double>(d-a)});}auto ok=[&](double mid){vector<double>dis(n+1);vector<int>len(n+1),inq(n+1,1);queue<int>q;for(int i=1;i<=n;++i)q.push(i);while(!q.empty()){int u=q.front();q.pop();inq[u]=0;for(const E&e:g[u])if(dis[e.to]<dis[u]+e.w-mid+1e-12){dis[e.to]=dis[u]+e.w-mid;len[e.to]=len[u]+1;if(len[e.to]>=n)return true;if(!inq[e.to])inq[e.to]=1,q.push(e.to);}}return false;};double l=0,r=1e9;for(int it=0;it<80;++it){double mid=(l+r)/2;if(ok(mid))l=mid;else r=mid;}cout<<fixed<<setprecision(2)<<l<<"\n";}
external_url: https://www.luogu.com.cn/problem/P3288
external_platform: Luogu
external_problem_id: P3288
external_title: 方伯伯運椰子
external_relation: original
review_status: verified
---

把一單位退流建成反向邊、增流建成正向邊；流量守恆的修改分解為環。二分平均收益 mid，將每條修改邊扣除 mid，以 SPFA 判定是否存在非負收益環。
