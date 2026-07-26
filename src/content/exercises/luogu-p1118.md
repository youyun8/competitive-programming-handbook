---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: luogu-p1118
title: 洛谷 P1118 Backward Digit Sums
section: '3.2'
difficulty: 2
topics:
  - depth-first-search
  - binomial-coefficients
prerequisites:
  - permutation
  - pascal-triangle
statement: 排列 1..n，反覆把相鄰數相加直到剩一數。給定 n 與最終總和，輸出字典序最小的初始排列；無解不輸出。
constraints:
  - 1 <= n <= 12
  - 1 <= sum <= 12345
  - 每個 1..n 恰使用一次
input_format: 一行 n、sum。
output_format: 輸出字典序最小排列；無解時不輸出。
samples:
  - input: |
      4 16
    output: 3 1 2 4
    explanation: 係數為 1,3,3,1；內積 3+3+6+4=16。
core_knowledge:
  - 相鄰和對應二項式係數
  - 字典序排列回溯
judgment: 最終值等於 Σ a_i*C(n-1,i)。
hints:
  - 先用 Pascal 三角形算最後一層每個原始位置的係數。
  - 由左至右、數字由小至大回溯，第一個解自然最小。
  - 目前加權和超過目標即可停止該分支。
solution_outline: 預算二項式係數，回溯排列並累加加權貢獻，首個達標解即輸出。
proof_or_invariant: 線性相加展開後各位置出現次數是 Pascal 第 n-1 列。DFS 枚舉全部排列且依字典序；首個滿足內積者即最小答案。
complexity:
  time: O(n!)
  space: O(n)
common_errors:
  - 使用第 n 列而非 n-1 列係數
  - 找到解後仍繼續覆寫
  - 數字嘗試順序不是遞增
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,target;cin>>n>>target;vector<int>coefficient(n,1);/* TODO：計算二項式係數並按字典序回溯排列。*/(void)target;(void)coefficient;return 0;}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,target;cin>>n>>target;vector<int>coef(n,1);for(int i=1;i<n;++i)coef[i]=static_cast<int>(1LL*coef[i-1]*(n-i)/i);vector<int>path(n);vector<bool>used(n+1);const auto dfs=[&](const auto& self,int pos,int sum)->bool{if(pos==n)return sum==target;for(int value=1;value<=n;++value)if(!used[value]){int next=sum+value*coef[pos];if(next>target)continue;used[value]=true;path[pos]=value;if(self(self,pos+1,next))return true;used[value]=false;}return false;};if(dfs(dfs,0,0)){for(int i=0;i<n;++i)cout<<path[i]<<(i+1==n?'\n':' ');}}
external_url: https://www.luogu.com.cn/problem/P1118
external_platform: 洛谷
external_problem_id: P1118
external_title: Backward Digit Sums
external_relation: original
source_book_pages:
  - 114
source_pdf_pages:
  - 132
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
