---
id: luogu-p5521
volume: upper
source_file: upper-volume
title: 洛谷 P5521 梅深不見冬
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 4
topics: ['樹形 DP', '子節排序', '交換論證']
prerequisites: []
statement: |-
  在有根樹依規則完成子節點放花後才能為父節點放花；求每個節點所需最少初始梅花。
constraints:
  - 'n<=100004；p_i<=i；1<=w_i<=1000。'
input_format: '依題意輸入測資數、規模與各項資料。'
output_format: '依題意輸出每組最優值。'
samples:
  - input: |
      3
      1 1
      1 2 3
    output: |
      6 2 3
    explanation: '按所述限制比較所有必要決策後，可得此最優值。'
core_knowledge: ['樹形 DP', '子節排序', '交換論證']
judgment: '目標具有可交換的局部決策；以兩項交換論證導出排序規則，再線性累積。'
hints:
  [
    '先假設只有兩個候選，分別計算兩種先後順序。',
    '把較優順序化成可排序的比較式，避免浮點除法。',
    '排序後維護前綴量、剩餘量或樹形子問題答案。'
  ]
solution_outline: '依交換論證得到貪心次序，排序後逐項更新累積狀態與答案。'
proof_or_invariant: '若相鄰兩項違反比較式，交換它們不會使目標更差；反覆消除逆序可得到排序後方案，因此該方案全域最優。'
common_errors: ['比較器不滿足嚴格弱序', '乘積或總和溢位', '相等與邊界狀況處理錯誤']
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：完成貪心排序與答案計算。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<vector<int>>ch(n);for(int i=1,p;i<n;++i){cin>>p;ch[p-1].push_back(i);}vector<long long>w(n),dp(n);for(auto&x:w)cin>>x;for(int u=n-1;u>=0;--u){sort(ch[u].begin(),ch[u].end(),[&](int a,int b){return dp[a]-w[a]>dp[b]-w[b];});long long sum=0;for(int v:ch[u])sum+=w[v];dp[u]=w[u]+sum;long long used=0;for(int v:ch[u]){dp[u]=max(dp[u],used+dp[v]);used+=w[v];}}for(int i=0;i<n;++i)cout<<(i?" ":"")<<dp[i];cout<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P5521
external_platform: 洛谷
external_problem_id: 'P5521'
external_title: '梅深不見冬'
external_relation: original
source_book_pages: [99]
source_pdf_pages: [117]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
