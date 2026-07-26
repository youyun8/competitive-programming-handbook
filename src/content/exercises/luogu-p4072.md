---
id: luogu-p4072
volume: upper
source_file: upper-volume
title: 洛谷 P4072 征途
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 4
topics: ['convex-hull-trick', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  把 n 段正長度道路依序分成恰好 m 個非空連續日程。求每日路程方差 v 的 v*m²，並輸出其最小值。
constraints:
  - 1 <= n <= 3000
  - 2 <= m <= n
  - 總路程不超過 30000
  - 每段長度為正整數
input_format: 第一行 n、m；第二行 n 段道路長度。
output_format: 輸出最小方差乘 m²。
samples:
  - input: |-
      5 2
      1 2 5 8 6
    output: |-
      36
    explanation: 最佳分段使兩日路程平方和最小，代入 m*Σday²-total² 得 36。
core_knowledge: ['分段平方和', '斜率優化', '方差變形']
judgment: 總路程固定，最小化方差等價於最小化各段和平方總和；分組 DP 的平方轉移可視為直線查詢。
hints:
  - 令 prefix[i] 為路程前綴，dp[g][i]=min_j(dp[g-1][j]+(prefix[i]-prefix[j])²)。
  - 候選 j 是斜率 -2prefix[j]、截距 dp_prev[j]+prefix[j]² 的直線。
  - prefix 嚴格遞增，斜率與查詢單調；每組用 deque 維護下凸殼，最後輸出 m*dp[m][n]-prefix[n]²。
solution_outline: >-
  第一組直接為 prefix 平方；對組數 2..m，從合法前驅 g-1 建凸殼並依 i 遞增查詢、加入新線。
proof_or_invariant: >-
  方差恆等式給出 m²v=m*Σsegment²-total²，後項固定。枚舉最後切點得到 DP；平方展開後每個 j 對查詢 prefix[i] 是直線。單調凸殼僅刪除未來不可能最小的候選，故每層轉移精確。
common_errors: ['允許空分段', '最後忘記乘 m 再扣總路程平方', '凸殼交叉乘用 32 位']
complexity:
  time: 'O(mn)'
  space: 'O(n)'
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
  #include <boost/multiprecision/cpp_int.hpp>
  #include <deque>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  using boost::multiprecision::int128_t;
  struct Line{long long slope,intercept;long long value(long long x)const{return slope*x+intercept;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,groups;cin>>n>>groups;vector<long long>prefix(n+1),previous(n+1),current(n+1);for(int i=1;i<=n;i++){cin>>prefix[i];prefix[i]+=prefix[i-1];previous[i]=prefix[i]*prefix[i];}auto bad=[](Line a,Line b,Line c){return int128_t(b.intercept-a.intercept)*(b.slope-c.slope)>=int128_t(c.intercept-b.intercept)*(a.slope-b.slope);};for(int g=2;g<=groups;g++){deque<Line>hull;auto make=[&](int j){return Line{-2*prefix[j],previous[j]+prefix[j]*prefix[j]};};hull.push_back(make(g-1));for(int i=g;i<=n;i++){while(hull.size()>1&&hull[0].value(prefix[i])>=hull[1].value(prefix[i]))hull.pop_front();current[i]=prefix[i]*prefix[i]+hull.front().value(prefix[i]);Line line=make(i);while(hull.size()>1&&bad(hull[hull.size()-2],hull.back(),line))hull.pop_back();hull.push_back(line);}previous.swap(current);}cout<<1LL*groups*previous[n]-prefix[n]*prefix[n]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4072
external_platform: 洛谷
external_problem_id: 'P4072'
external_title: 征途
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

方差目標先化為分段平方和，再用單調凸殼把每層 DP 降至線性。
