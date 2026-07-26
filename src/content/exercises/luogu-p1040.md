---
id: luogu-p1040
volume: upper
source_file: upper-volume
title: 洛谷 P1040 加分二叉樹
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['interval-dp', 'binary-tree']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  中序遍歷為 1..n，每點有分數。樹的加分為左子樹分數乘右子樹分數再加根分數，空子樹分數為 1；求最大分數及字典序規則下的前序遍歷。
constraints:
  - 1 <= n <= 30
  - 節點分數為正整數
  - 答案在 32 位有號整數範圍
input_format: 第一行 n，第二行 n 個節點分數。
output_format: 第一行最大加分，第二行最佳樹前序遍歷。
samples:
  - input: |-
      5
      5 7 1 2 10
    output: |-
      145
      3 1 2 4 5
    explanation: 區間 [1,5] 選 3 為根可得最大值 145；遞迴輸出根、左、右。
core_knowledge: ['區間 DP', '根節點決策', '前序重建']
judgment: 中序順序固定後，選根 k 會唯一把問題切成左右兩個連續區間。
hints:
  - 令 dp[l][r] 為中序區間 [l,r] 的最大分數，空區間值為 1。
  - 枚舉根 k，候選為 dp[l][k-1]*dp[k+1][r]+score[k]。
  - 只在嚴格變大時更新 root[l][r]，再按根、左、右遞迴輸出。
solution_outline: >-
  按區間長度遞增計算 dp 與最佳根。單點依題目定義直接取自身分數；最後從 [1,n] 依 root 表重建前序。
proof_or_invariant: >-
  任一符合中序的樹，其根 k 的左右子樹恰對應兩個連續子區間；固定 k 時兩側應各自最優，否則可替換改善。枚舉全部 k 因而得到全域最優，root 表保存的決策可重建該樹。
common_errors: ['把單點算成 1*1+a 而非題目規定的 a', '空區間設為 0', '同分時更新根破壞指定前序']
complexity:
  time: 'O(n^3)'
  space: 'O(n^2)'
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
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;i++)cin>>a[i];vector<vector<long long>>dp(n+2,vector<long long>(n+2,1));vector<vector<int>>rt(n+2,vector<int>(n+2));for(int i=1;i<=n;i++)dp[i][i]=a[i],rt[i][i]=i;for(int len=2;len<=n;len++)for(int l=1,r=l+len-1;r<=n;l++,r++){dp[l][r]=-1;for(int k=l;k<=r;k++){long long v=dp[l][k-1]*dp[k+1][r]+a[k];if(v>dp[l][r])dp[l][r]=v,rt[l][r]=k;}}cout<<dp[1][n]<<'\n';bool first=true;auto out=[&](auto&&s,int l,int r)->void{if(l>r)return;int k=rt[l][r];if(!first)cout<<' ';first=false;cout<<k;s(s,l,k-1);s(s,k+1,r);};out(out,1,n);cout<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1040
external_platform: 洛谷
external_problem_id: 'P1040'
external_title: 加分二叉樹
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

固定中序後，根的位置就是區間 DP 的唯一分割決策。
