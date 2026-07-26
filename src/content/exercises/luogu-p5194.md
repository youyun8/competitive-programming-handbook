---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: luogu-p5194
title: 洛谷 P5194 Scales S
section: '3.1'
difficulty: 3
topics:
  - depth-first-search
  - branch-and-bound
  - subset-sum
prerequisites:
  - prefix-sum
  - backtracking
statement: 從非遞減排列的 n 個砝碼選若干個，使總重不超過承重 C 且盡量大。自第三個起，每個砝碼至少為前兩個之和。
constraints:
  - 1 <= n <= 1000
  - 1 <= C <= 2^30
  - 砝碼為正整數、非遞減，且滿足類 Fibonacci 增長
input_format: 第一行 n、C；其後 n 行各一個砝碼重量。
output_format: 輸出不超過 C 的最大可選總重。
samples:
  - input: |
      3 15
      1
      10
      20
    output: '11'
    explanation: 20 超過承重，選 1 與 10 可得到最大合法總重 11。
core_knowledge:
  - 快速增長限制下的子集搜尋
  - 剩餘總和上界剪枝
judgment: 每個砝碼至多選一次；重量大於 C 的砝碼可直接忽略。
hints:
  - 由大到小決定是否選取，通常能很早得到接近 C 的答案。
  - 若目前重量加所有剩餘砝碼仍不超過 C，可直接全部選取。
  - 若目前重量加剩餘總和也不可能超過已知答案，整個分支可刪除。
solution_outline: 去除超重砝碼，計算前綴和並由最大索引回溯選或不選；使用可全取與樂觀上界兩種剪枝。
proof_or_invariant: 每層恰決定一個砝碼，兩分支涵蓋所有子集。前綴和是尚未決定重量的精確總和：全取可行時必為該分支最優；連全取也不勝答案時不可能改善，故剪枝安全。
complexity:
  time: 最壞 O(2^k)，k 為不超過 C 的砝碼數；題目增長條件使 k=O(log C)
  space: O(n)
common_errors:
  - 使用 int 累加前綴和而溢位
  - 未利用輸入的快速增長條件剪枝
  - 把每個砝碼當成可重複選
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long capacity;cin>>n>>capacity;vector<long long> w;for(int i=0;i<n;++i){long long x;cin>>x;if(x<=capacity)w.push_back(x);}vector<long long> prefix(w.size()+1);for(size_t i=0;i<w.size();++i)prefix[i+1]=prefix[i]+w[i];long long answer=0;const auto dfs=[&](const auto& self,int index,long long sum)->void{answer=max(answer,sum);if(index<0)return;if(sum+prefix[static_cast<size_t>(index)+1]<=capacity){answer=max(answer,sum+prefix[static_cast<size_t>(index)+1]);return;}if(sum+prefix[static_cast<size_t>(index)+1]<=answer)return;if(sum+w[static_cast<size_t>(index)]<=capacity)self(self,index-1,sum+w[static_cast<size_t>(index)]);self(self,index-1,sum);};dfs(dfs,static_cast<int>(w.size())-1,0);cout<<answer<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long capacity;cin>>n>>capacity;vector<long long> w;for(int i=0;i<n;++i){long long x;cin>>x;if(x<=capacity)w.push_back(x);}vector<long long> prefix(w.size()+1);for(size_t i=0;i<w.size();++i)prefix[i+1]=prefix[i]+w[i];long long answer=0;const auto dfs=[&](const auto& self,int index,long long sum)->void{answer=max(answer,sum);if(index<0)return;if(sum+prefix[static_cast<size_t>(index)+1]<=capacity){answer=max(answer,sum+prefix[static_cast<size_t>(index)+1]);return;}if(sum+prefix[static_cast<size_t>(index)+1]<=answer)return;if(sum+w[static_cast<size_t>(index)]<=capacity)self(self,index-1,sum+w[static_cast<size_t>(index)]);self(self,index-1,sum);};dfs(dfs,static_cast<int>(w.size())-1,0);cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5194
external_platform: 洛谷
external_problem_id: P5194
external_title: Scales S
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
