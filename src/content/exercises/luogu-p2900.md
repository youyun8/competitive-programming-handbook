---
id: luogu-p2900
volume: upper
source_file: upper-volume
title: 洛谷 P2900 Land Acquisition G
chapter: 5
section: '5.9'
kind: external-oj
difficulty: 4
topics: ['convex-hull-trick', 'dynamic-programming']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  有 n 塊寬 w、高 h 的土地。每批土地的購買費為該批最大寬乘最大高，可任意分批；求買下全部土地的最小總費用。
constraints:
  - 1 <= n <= 50000
  - 1 <= w,h <= 1000000
  - 答案需 64 位
input_format: 第一行 n；接著 n 行 w、h。
output_format: 輸出最小總費用。
samples:
  - input: |-
      1
      3 4
    output: |-
      12
    explanation: 唯一土地單獨成批，費用為 3×4=12。
core_knowledge: ['支配刪除', '斜率優化', '矩形分組']
judgment: 被另一矩形寬高同時覆蓋的土地可刪除；剩餘寬遞增、高遞減後，分批必為連續區間。
hints:
  - 排序並刪除受支配矩形，得到 w 遞增、h 遞減序列。
  - dp[i]=min_{1<=j<=i}(dp[j-1]+w[i]*h[j])。
  - 把 j 視為斜率 h[j]、截距 dp[j-1] 的直線；斜率與查詢皆單調，用 deque 維護下凸殼。
solution_outline: >-
  先正規化矩形集合，再依序查詢 w[i] 的最小直線值作 dp[i]，加入下一個候選 h[i+1]、dp[i]。
proof_or_invariant: >-
  受支配土地與覆蓋它的土地同批不增加費用。正規化後任何批次可調整為連續段；最後一段 j..i 的最大寬為 w[i]、最大高為 h[j]，得到轉移。凸殼只刪除在所有未來遞增查詢中不可能最優的線。
common_errors: ['未刪受支配矩形使斜率不單調', 'dp 截距索引錯用 dp[j]', '交叉乘使用 32 位']
complexity:
  time: 'O(n log n)'
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
  #include <algorithm>
  #include <deque>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  using boost::multiprecision::int128_t;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<pair<long long,long long>>a(n);for(auto&[w,h]:a)cin>>w>>h;sort(a.begin(),a.end(),[](auto x,auto y){return x.first==y.first?x.second>y.second:x.first<y.first;});vector<pair<long long,long long>>v;for(auto p:a){while(!v.empty()&&v.back().second<=p.second)v.pop_back();v.push_back(p);}int m=static_cast<int>(v.size());vector<long long>dp(m+1);struct Line{long long m,b;long long val(long long x)const{return m*x+b;}};deque<Line>q;auto bad=[](Line first,Line second,Line third){return int128_t(second.b-first.b)*(second.m-third.m)>=int128_t(third.b-second.b)*(first.m-second.m);};q.push_back({v[0].second,0});for(int i=1;i<=m;i++){long long x=v[i-1].first;while(q.size()>1&&q[0].val(x)>=q[1].val(x))q.pop_front();dp[i]=q.front().val(x);if(i<m){Line line{v[i].second,dp[i]};while(q.size()>1&&bad(q[q.size()-2],q.back(),line))q.pop_back();q.push_back(line);}}cout<<dp[m]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2900
external_platform: 洛谷
external_problem_id: 'P2900'
external_title: Land Acquisition G
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

支配刪除同時建立了寬與高的反向單調性，正好供 deque 凸殼使用。
