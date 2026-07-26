---
id: luogu-p1052
volume: upper
source_file: upper-volume
title: 洛谷 P1052 過河
chapter: 2
section: '2.7'
kind: external-oj
difficulty: 4
topics: ['路徑壓縮', '動態規劃']
prerequisites: []
statement: |-
  橋長可達 10^9；青蛙每步跳 S..T，求跳過終點前最少踩到的石子數。
constraints:
  - 'L<=10^9；1<=S<=T<=10；石子數<=100。'
input_format: '依上列敘述順序輸入所有參數與操作。'
output_format: '依題意輸出每組答案。'
samples:
  - input: |
      10
      2 3 5
      2 3 5 6 7
    output: |
      2
    explanation: '依操作或定義直接計算可得此結果。'
core_knowledge: ['路徑壓縮', '動態規劃']
judgment: '座標或狀態範圍大，但實際事件有限，應用本節離散化、差分或狀態壓縮。'
hints:
  [
    '先找出真正會改變答案的事件或邊界。',
    '將大座標／大量區間轉成有限狀態後依序處理。',
    '維持狀態不變量，最後掃描所有候選並取最優。'
  ]
solution_outline: '依核心知識壓縮資料，再按事件順序更新並輸出答案。'
proof_or_invariant: '壓縮後每個原始事件仍有唯一對應，且事件間狀態不變；逐段計算涵蓋所有候選，因此所得值與原問題相同。'
common_errors: ['閉區間端點處理錯誤', '多組資料未清空', '計數或面積使用 int 溢位']
complexity:
  time: 'O(n log n) 或與壓縮後網格大小同階'
  space: 'O(n) 或與壓縮後網格大小同階'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：依提示完成。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);long long L;int s,t,m;cin>>L>>s>>t>>m;vector<long long>x(m);for(auto&v:x)cin>>v;if(s==t){int ans=0;for(auto v:x)ans+=v%s==0;cout<<ans<<'\n';return 0;}sort(x.begin(),x.end());vector<int>p;long long old=0;int now=0;for(auto v:x){now+=static_cast<int>(min<long long>(v-old,100));p.push_back(now);old=v;}int end=now+100;vector<int>rock(end+t+1),dp(end+t+1,1000000);for(int v:p)rock[v]=1;dp[0]=0;for(int i=1;i<=end+t;++i)for(int j=s;j<=t;++j)if(i>=j)dp[i]=min(dp[i],dp[i-j]+rock[i]);cout<<*min_element(dp.begin()+end,dp.begin()+end+t+1)<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1052
external_platform: 洛谷
external_problem_id: 'P1052'
external_title: '過河'
external_relation: original
source_book_pages: [78]
source_pdf_pages: [96]
review_status: verified
---

本題採獨立敘述與 C++17 解法。
