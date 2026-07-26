---
id: luogu-p1973
volume: upper
source_file: upper-volume
title: 洛谷 P1973 NOI 嘉年華
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 5
topics: ['interval-dp', 'two-pointers']
prerequisites: ['dynamic-programming']
statement: >-
  有兩個嘉年華會場，每個申請活動可選擇不辦或放入任一會場；不同會場的活動不可在開放時間內重疊，同一會場則不受此限制。最大化兩會場中活動較少者的數量，並分別回答強制選每個活動時的最優值。
constraints:
  - 1 <= n <= 200
  - 0 <= S_i <= 10^9
  - 1 <= T_i <= 10^9
  - 端點相接不算重疊
input_format: 第一行 n；接著 n 行活動開始 S_i 與持續時間 T_i。
output_format: 第一行無限制答案；其後 n 行依序為強制選活動 i 的答案。
samples:
  - input: |-
      5
      8 2
      1 5
      5 3
      3 2
      5 3
    output: |-
      2
      2
      1
      2
      2
      2
    explanation: 無限制時可讓兩會場各辦兩場；強制活動 2 時平衡值只能為 1。
core_knowledge: ['時間離散化', '前後綴 DP', '單調決策']
judgment: 離散端點後，cnt[l][r] 表示完整落在時間段 [l,r] 的活動數。prefix[i][j] 表示前綴中一會場辦 j 場時，另一會場最多可辦幾場；同一時間塊的活動全放同一會場即可避免跨會場重疊，suffix 對稱。
hints:
  - 最優安排可依時間切成交替分配給兩會場的區塊，用 cnt 做前綴／後綴分割轉移。
  - 若強制某活動，枚舉包含它的時間區間 [l,r]，把其中所有活動交給同一會場，再拼接左右最優安排。
  - 固定 [l,r] 時，左右選量 x 增加會使最佳 y 不增；用雙指標把 O(n²) 合併降成 O(n)。
solution_outline: >-
  離散化並用二維包含和求 cnt。以 O(n³) 建 prefix、suffix；對每個 [l,r] 用單調雙指標求強制整段的平衡值，再由長區間向短區間傳遞最大值。
proof_or_invariant: >-
  任何合法方案都可依時間分成輪流指派給兩會場的區塊；同一區塊內可同時舉辦活動，prefix/suffix 枚舉最後分界故完整且正確。強制活動所在會場可擴張成某 [l,r] 的整塊，左右安排獨立；合併式取兩會場數量較小者。其一項隨 y 增、另一項隨 y 減，最優交界單調，雙指標不漏最佳。枚舉所有包含原活動的擴張區間即得強制答案。
common_errors:
  ['把活動端點 [S,S+T] 當成閉區間而誤判相接', '只用活動本身區間，漏掉擴張區間的更佳方案', '四重枚舉左右活動數導致逾時']
complexity:
  time: 'O(n³)'
  space: 'O(n²)'
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
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>start(n),finish(n),points;for(int i=0;i<n;i++){long long duration;cin>>start[i]>>duration;finish[i]=start[i]+duration;points.push_back(start[i]);points.push_back(finish[i]);}sort(points.begin(),points.end());points.erase(unique(points.begin(),points.end()),points.end());int m=static_cast<int>(points.size());vector<int>left(n),right(n);vector<vector<int>>count(m,vector<int>(m));for(int i=0;i<n;i++){left[i]=static_cast<int>(lower_bound(points.begin(),points.end(),start[i])-points.begin());right[i]=static_cast<int>(lower_bound(points.begin(),points.end(),finish[i])-points.begin());for(int l=0;l<=left[i];l++)for(int r=right[i];r<m;r++)count[l][r]++;}const int negative=-1000000000;vector<vector<int>>prefix(m,vector<int>(n+1,negative)),suffix(m,vector<int>(n+1,negative));for(int i=0;i<m;i++)prefix[i][0]=suffix[i][0]=0;for(int i=0;i<m;i++)for(int chosen=0;chosen<=count[0][i];chosen++)for(int split=0;split<=i;split++){int block=count[split][i];prefix[i][chosen]=max(prefix[i][chosen],prefix[split][chosen]+block);if(chosen>=block)prefix[i][chosen]=max(prefix[i][chosen],prefix[split][chosen-block]);}for(int i=m-1;i>=0;i--)for(int chosen=0;chosen<=count[i][m-1];chosen++)for(int split=i;split<m;split++){int block=count[i][split];suffix[i][chosen]=max(suffix[i][chosen],suffix[split][chosen]+block);if(chosen>=block)suffix[i][chosen]=max(suffix[i][chosen],suffix[split][chosen-block]);}for(int i=0;i<m;i++)for(int chosen=n-1;chosen>=0;chosen--){prefix[i][chosen]=max(prefix[i][chosen],prefix[i][chosen+1]);suffix[i][chosen]=max(suffix[i][chosen],suffix[i][chosen+1]);}int unrestricted=0;for(int chosen=0;chosen<=n;chosen++)unrestricted=max(unrestricted,min(chosen,prefix[m-1][chosen]));cout<<unrestricted<<'\n';vector<vector<int>>forced(m,vector<int>(m));for(int l=0;l<m;l++)for(int r=l+1;r<m;r++){auto value=[&](int x,int y){return min(x+count[l][r]+y,prefix[l][x]+suffix[r][y]);};int y=n;for(int x=0;x<=n;x++){int current=value(x,y);while(y>0&&current<=value(x,y-1)){current=value(x,y-1);y--;}forced[l][r]=max(forced[l][r],current);}}for(int i=0;i<n;i++){int answer=0;for(int l=0;l<=left[i];l++)for(int r=right[i];r<m;r++)answer=max(answer,forced[l][r]);cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P1973
external_platform: 洛谷
external_problem_id: 'P1973'
external_title: NOI 嘉年華
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

前後綴區塊 DP 把兩會場排程拆開，再以單調合併回答每個強制活動。
