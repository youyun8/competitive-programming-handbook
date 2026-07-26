---
id: luogu-p5468
volume: upper
source_file: upper-volume
title: 洛谷 P5468 回家路線
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 5
topics: ['convex-hull-trick', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  有 n 個站與 m 班列車；列車 i 於 p_i 從 x_i 出發、q_i 到 y_i。從 1 號站換乘至 n 號站，等待 t 的煩躁增加 At²+Bt+C，到站時再增加最終時刻，求最小煩躁值。
constraints:
  - 2 <= n <= 100000
  - 1 <= m <= 200000
  - 0 <= A <= 10
  - 0 <= B,C <= 1000000
  - 0 <= p_i < q_i <= 1000
input_format: 第一行 n、m、A、B、C；接著 m 行 x_i、y_i、p_i、q_i。
output_format: 輸出最小煩躁值。
samples:
  - input: |-
      3 4 1 5 10
      1 2 3 4
      1 2 5 7
      1 2 6 8
      2 3 9 10
    output: |-
      94
    explanation: 依序乘 1→2 的合適列車與 2→3 列車，總等待代價加最終到達時刻為 94。
core_knowledge: ['按時間掃描', '每站凸包', '二次費用']
judgment: 令 dp_i 為乘完列車 i 的等待代價。前車 j 的 q_j<=p_i 且 y_j=x_i；轉移可寫成 A p_i²+B p_i+C + min(Y_j-2A p_i X_j)，其中 X_j=q_j、Y_j=dp_j+Aq_j²-Bq_j。
hints:
  - 按時刻掃描：先把此刻到站且可達的列車加入終點站凸包，再查詢此刻出發的列車。
  - 每個站的點 X=q 單調加入，查詢斜率 2A p 也單調，可用 deque 維護下凸包。
  - 加入虛擬狀態 (站 1、時間 0、代價 0)；到達 n 時用 dp_i+q_i 更新答案。
solution_outline: >-
  以出發、到達時刻分桶。每站維護下凸包；同 X 只留 Y 較小者，三點叉積刪除中間點。查詢時從隊首移除不再最優的點。
proof_or_invariant: >-
  展開等待平方後，與前車 j 有關的項恰為 Y_j-(2Ap_i)X_j。時間掃描保證凸包內且僅有 q_j<=p_i 的可達狀態；按站分開保證接續站相同。下凸包查詢精確取得該線性式最小值，故每個 dp 正確；所有終點為 n 的末班車取最小即為答案。
common_errors: ['同一時刻先查詢才插入，漏掉零等待換乘', '忘記最終答案還要加到達時刻 q_i', '用浮點斜率比較造成共線誤差']
complexity:
  time: 'O(m log m + m)'
  space: 'O(n+m)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、轉移與答案輸出。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <boost/multiprecision/cpp_int.hpp>
  #include <deque>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  using boost::multiprecision::int128_t;
  struct Train{int from,to,depart,arrive;long long dp;};
  struct Point{long long x,y;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;long long a,b,c;cin>>n>>m>>a>>b>>c;vector<Train>trains(m);vector<vector<int>>departures(1001),arrivals(1001);for(int i=0;i<m;i++){auto&t=trains[i];cin>>t.from>>t.to>>t.depart>>t.arrive;t.dp=numeric_limits<long long>::max()/4;departures[t.depart].push_back(i);arrivals[t.arrive].push_back(i);}vector<deque<Point>>hulls(n+1);auto insert_point=[&](int station,Point point){auto&q=hulls[station];if(!q.empty()&&q.back().x==point.x){if(q.back().y<=point.y)return;q.pop_back();}while(q.size()>=2){Point x=q[q.size()-2],y=q.back();if(int128_t(y.y-x.y)*(point.x-y.x)>=int128_t(point.y-y.y)*(y.x-x.x))q.pop_back();else break;}q.push_back(point);};auto query=[&](int station,long long slope){auto&q=hulls[station];auto value=[&](Point p){return p.y-slope*p.x;};while(q.size()>=2&&value(q[0])>=value(q[1]))q.pop_front();return value(q.front());};insert_point(1,{0,0});long long answer=numeric_limits<long long>::max()/4;for(int time=0;time<=1000;time++){for(int id:arrivals[time]){auto&t=trains[id];if(t.dp>=numeric_limits<long long>::max()/8)continue;insert_point(t.to,{t.arrive,t.dp+a*t.arrive*t.arrive-b*t.arrive});}for(int id:departures[time]){auto&t=trains[id];if(hulls[t.from].empty())continue;t.dp=query(t.from,2*a*t.depart)+a*t.depart*t.depart+b*t.depart+c;if(t.to==n)answer=min(answer,t.dp+t.arrive);}}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5468
external_platform: 洛谷
external_problem_id: 'P5468'
external_title: 回家路線
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

時間順序同時保證轉移合法，也讓每站凸包的插入座標與查詢斜率皆單調。
