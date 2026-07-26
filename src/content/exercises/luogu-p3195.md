---
id: luogu-p3195
volume: upper
source_file: upper-volume
title: 洛谷 P3195 玩具裝箱
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 4
topics: ['convex-hull-trick', 'dynamic-programming']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  依序把 n 件長度 c_i 的玩具分箱，每箱相鄰玩具間留一單位空隙；箱內總長與標準長度 L 的差平方為費用，求總費用最小值。
constraints:
  - 1 <= n <= 50000
  - 1 <= L,c_i <= 100000
  - 答案需 64 位
input_format: 第一行 n、L；接著 n 行玩具長度。
output_format: 輸出最小總費用。
samples:
  - input: |-
      1 3
      3
    output: |-
      0
    explanation: 單件長度恰等於標準長度，費用為 0。
core_knowledge: ['平方轉移', '前綴和', '凸殼查詢']
judgment: 令 s[i]=Σc[1..i]+i，則一箱 j+1..i 的實際長度為 s[i]-s[j]-1，代價是其與 L 的差平方。
hints:
  - 轉移 dp[i]=min_j dp[j]+(s[i]-s[j]-L-1)^2。
  - 展開後 j 是斜率 -2s[j]、截距 dp[j]+s[j]^2+2(L+1)s[j] 的直線。
  - s 單調遞增，查詢也遞增；用交叉乘維護下凸殼。
solution_outline: >-
  計算修正前綴 s，從 j=0 的直線開始；每個 i 查凸殼求 dp[i]，再把 i 對應直線加入。
proof_or_invariant: >-
  最後一箱的起點 j 唯一分割先前最優解，得 DP。平方展開後與 i 有關的共同項外，剩餘恰是直線值；單調凸殼保留每個查詢可能最小的候選。
common_errors: ['漏掉箱內玩具間空隙造成 L+1 偏移', '平方使用 int', '凸殼維護最大值方向']
complexity:
  time: 'O(n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、子問題合併與邊界處理。
      return 0;
  }
cpp_solution: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <deque>
  #include <iostream>
  #include <vector>
  using namespace std;
  using boost::multiprecision::int128_t;
  struct Line{long long m,b;long long value(long long x)const{return m*x+b;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long length;cin>>n>>length;vector<long long>s(n+1),dp(n+1);for(int i=1;i<=n;i++){cin>>s[i];s[i]+=s[i-1]+1;}long long shift=length+1;auto make=[&](int j){return Line{-2*s[j],dp[j]+s[j]*s[j]+2*shift*s[j]};};auto bad=[](Line a,Line b,Line c){return int128_t(b.b-a.b)*(b.m-c.m)>=int128_t(c.b-b.b)*(a.m-b.m);};deque<Line>q;q.push_back(make(0));for(int i=1;i<=n;i++){while(q.size()>1&&q[0].value(s[i])>=q[1].value(s[i]))q.pop_front();dp[i]=s[i]*s[i]-2*shift*s[i]+shift*shift+q.front().value(s[i]);Line line=make(i);while(q.size()>1&&bad(q[q.size()-2],q.back(),line))q.pop_back();q.push_back(line);}cout<<dp[n]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3195
external_platform: 洛谷
external_problem_id: 'P3195'
external_title: 玩具裝箱
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

把每件玩具後的一單位空隙併入前綴和，可將箱長公式統一成平方轉移。
