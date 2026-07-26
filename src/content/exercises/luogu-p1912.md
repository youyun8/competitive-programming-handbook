---
id: luogu-p1912
volume: upper
source_file: upper-volume
title: 洛谷 P1912 詩人小 G
chapter: 5
section: '5.10'
kind: external-oj
difficulty: 5
topics: ['decision-monotonicity', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  依序排版 n 個句子，每行放若干連續句子並以單一空格分隔。行長 x 的不協調度為 |x-L|^P；最小化總不協調度並輸出一種排版。若最小值超過 10^18，輸出指定訊息。
constraints:
  - T <= 5
  - N <= 100000
  - L <= 3000000
  - 1 <= P <= 10
  - 每個句子長度不超過 30
input_format: 第一行 T；每組先讀 N、L、P，再讀 N 行無空白句子。
output_format: 輸出最小值與一種方案，或 Too hard to arrange；每組後輸出 20 個連字號。
samples:
  - input: |-
      4
      4 9 3
      brysj,
      hhrhl.
      yqqlm,
      gsycl.
      4 9 2
      brysj,
      hhrhl.
      yqqlm,
      gsycl.
      1 1005 6
      poet
      1 1004 6
      poet
    output: |-
      108
      brysj,
      hhrhl.
      yqqlm,
      gsycl.
      --------------------
      32
      brysj, hhrhl.
      yqqlm, gsycl.
      --------------------
      Too hard to arrange
      --------------------
      1000000000000000000
      poet
      --------------------
    explanation: 前兩組展示不同 P 會改變最優換行；第三組超限，第四組恰為 10^18。
core_knowledge: ['分段 DP', '二分決策區間', '方案回溯']
judgment: 令 s_i 累加每句長度再加一格，dp_i=min_j(dp_j+|s_i-s_j-1-L|^P)。此凸代價具決策單調性，各 j 成為最優決策的終點集合是連續區間且區間依序排列。
hints:
  - 把句尾後也加一格，則 j+1..i 的實際行長是 s_i-s_j-1。
  - 用 deque 記錄每個候選決策負責的 [left,right]；算完 i 後，新決策從隊尾開始淘汰被支配區間。
  - 若新舊決策在區間左端舊者較佳、右端新者較佳，二分第一個新者不劣的位置並切開區間。
solution_outline: >-
  逐 i 取隊首決策計算 dp 與 pre，再消耗其區間左端。插入 i 時刪除隊尾完全被支配者，必要時二分交界。最後沿 pre 回溯各行端點。
proof_or_invariant: >-
  轉移式枚舉最後一行起點，故未優化 DP 正確。凸函數 |x|^P 滿足四邊形不等式，最優決策索引隨終點不減；因此兩候選優劣只交替一次，區間隊列與二分切割精確保存每個未來終點的最優決策。回溯 pre 即重建達到 dp_n 的排版。
common_errors: ['漏算句子間空格或多算行尾空格', '以 double 儲存大代價導致臨界誤判', '超過 10^18 時仍輸出排版']
complexity:
  time: 'O(n log n) 每組'
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
  #include <algorithm>
  #include <cmath>
  #include <deque>
  #include <iomanip>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  struct Choice{int left,right,position;};
  long double integer_power(long double base,int exponent){long double result=1;while(exponent){if(exponent&1)result*=base;base*=base;exponent>>=1;}return result;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){int n,line_length,power;cin>>n>>line_length>>power;vector<string>sentence(n+1);vector<int>prefix(n+1),previous(n+1);vector<long double>dp(n+1);for(int i=1;i<=n;i++){cin>>sentence[i];prefix[i]=prefix[i-1]+static_cast<int>(sentence[i].size())+1;}auto cost=[&](int j,int i){return dp[j]+integer_power(fabsl((long double)prefix[i]-prefix[j]-1-line_length),power);};deque<Choice>choices;choices.push_back({1,n,0});for(int i=1;i<=n;i++){previous[i]=choices.front().position;dp[i]=cost(previous[i],i);if(choices.front().right==i)choices.pop_front();else choices.front().left=i+1;if(i==n)continue;int replacement=-1;while(!choices.empty()&&cost(i,choices.back().left)<=cost(choices.back().position,choices.back().left)){replacement=choices.back().left;choices.pop_back();}if(choices.empty()){choices.push_back({replacement,n,i});continue;}if(cost(i,choices.back().right)<=cost(choices.back().position,choices.back().right)){int low=choices.back().left,high=choices.back().right;while(low<high){int mid=(low+high)/2;if(cost(i,mid)<=cost(choices.back().position,mid))high=mid;else low=mid+1;}choices.back().right=low-1;choices.push_back({low,n,i});}else if(replacement!=-1)choices.push_back({replacement,n,i});}if(dp[n]>1.0e18L)cout<<"Too hard to arrange\n";else{cout<<fixed<<setprecision(0)<<dp[n]<<'\n';vector<int>endpoints;for(int i=n;i;i=previous[i])endpoints.push_back(i);endpoints.push_back(0);reverse(endpoints.begin(),endpoints.end());for(size_t part=1;part<endpoints.size();part++){for(int i=endpoints[part-1]+1;i<=endpoints[part];i++){if(i>endpoints[part-1]+1)cout<<' ';cout<<sentence[i];}cout<<'\n';}}cout<<"--------------------\n";}}
external_url: https://www.luogu.com.cn/problem/P1912
external_platform: 洛谷
external_problem_id: 'P1912'
external_title: 詩人小 G
external_relation: original
source_book_pages: [384]
source_pdf_pages: [402]
review_status: verified
---

決策單調性讓每個候選只負責一段連續終點，可用區間隊列壓縮二次轉移。
