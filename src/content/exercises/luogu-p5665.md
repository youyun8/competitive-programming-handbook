---
id: luogu-p5665
volume: upper
source_file: upper-volume
title: 洛谷 P5665 劃分
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 5
topics: ['monotonic-queue', 'dynamic-programming', 'greedy']
prerequisites: ['dynamic-programming']
statement: >-
  把正整數序列切成若干非空連續段，使各段和非遞減，並最小化各段和平方之總和。輸入可直接給序列，也可由指定遞迴與分段模數規則生成。
constraints:
  - n <= 4 * 10^7
  - a_i 為正整數
  - type=0 時直接輸入；type=1 時按題定公式生成
  - 答案可能超過 64 位整數
input_format: 第一行 n、type。type=0 時下一行為 n 個 a_i；type=1 時讀 x,y,z,b_1,b_2,m，再讀 m 組 p_j,l_j,r_j。
output_format: 輸出合法劃分的最小平方和。
samples:
  - input: |-
      5 0
      5 1 7 9 9
    output: |-
      247
    explanation: 最優段和為 6、7、9、9，平方和 36+49+81+81=247。
core_knowledge: ['決策單調性', '前綴和', '大整數']
judgment: 令 s_i 為前綴和、pre_i 為 i 的最優前驅。j 可接到 i 當且僅當 s_i >= 2s_j-s_pre[j]；正數條件下最靠右的合法 j 產生最優劃分。
hints:
  - 把前一段和寫成 s_j-s_pre[j]，合法條件可移項成只比較前綴和與 key(j)=2s_j-s_pre[j]。
  - 維護 key 單調遞增的候選隊列；若下一候選也合法，就永久移動隊首。
  - 沿 pre 從 n 回溯，累加每段和的平方；使用標準 Boost uint128_t 輸出大答案。
solution_outline: >-
  線性產生前綴和。每個 i 先從隊首找最後可行候選並記錄 pre_i，再刪除隊尾 key 不小於 key(i) 的候選。最後回溯唯一記錄的最優鏈。
proof_or_invariant: >-
  所有 a_i>0，故前綴和嚴格增加。對固定 i，若候選 j 可行，採用更靠右且 key 不大的候選會把最後一段拆得更細；由 x²+y²<(x+y)²，且仍保持段和非遞減，平方和不增，因此最右可行候選最優。key 更大且位置更早的候選被新候選永久支配，隊尾可刪。歸納可得 pre 鏈為全局最優。
common_errors: ['把段和限制寫成嚴格遞增', '64 位整數計算最終平方和溢位', '生成資料時沒有依 p_j 切換 l_j、r_j']
complexity:
  time: 'O(n)'
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
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;
  using boost::multiprecision::uint128_t;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,type;cin>>n>>type;vector<uint64_t>prefix(n+1);vector<int>pre(n+1),queue(n+1);if(type==0){for(int i=1;i<=n;i++){uint64_t value;cin>>value;prefix[i]=prefix[i-1]+value;}}else{uint64_t x,y,z,b1,b2;int m;cin>>x>>y>>z>>b1>>b2>>m;vector<int>p(m);vector<uint64_t>low(m),high(m);for(int i=0;i<m;i++)cin>>p[i]>>low[i]>>high[i];uint64_t older=b1,newer=b2;int group=0;for(int i=1;i<=n;i++){uint64_t raw;if(i==1)raw=b1;else if(i==2)raw=b2;else{raw=(x*newer+y*older+z)&((1ULL<<30)-1);older=newer;newer=raw;}while(i>p[group])group++;uint64_t value=raw%(high[group]-low[group]+1)+low[group];prefix[i]=prefix[i-1]+value;}}auto key=[&](int i){return 2*prefix[i]-prefix[pre[i]];};int head=0,tail=0;queue[0]=0;for(int i=1;i<=n;i++){while(head<tail&&key(queue[head+1])<=prefix[i])head++;pre[i]=queue[head];while(head<tail&&key(queue[tail])>=key(i))tail--;queue[++tail]=i;}uint128_t answer=0;for(int i=n;i>0;i=pre[i]){uint128_t part=prefix[i]-prefix[pre[i]];answer+=part*part;}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5665
external_platform: 洛谷
external_problem_id: 'P5665'
external_title: 劃分
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

正數序列讓最右合法前驅同時具備貪心最優性，候選門檻則可由單調隊列維護。
