---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: luogu-p1120
title: 洛谷 P1120 小木棍
section: '3.2'
difficulty: 4
topics:
  - depth-first-search
  - branch-and-bound
prerequisites:
  - sorting
  - backtracking
statement: 若干原本等長的木棍被切成 n 段。給定所有段長，求原木棍可能的最小長度。
constraints:
  - 1 <= n <= 65
  - 1 <= a_i <= 50
  - 所有短段都必須使用且每段一次
input_format: 第一行 n；第二行 n 個段長。
output_format: 輸出最小可能原長。
samples:
  - input: |
      9
      5 2 1 5 2 1 5 2 1
    output: '6'
    explanation: 每組 5+1 或 2+2+2 可組成長 6，且更短候選不能整除總長。
core_knowledge:
  - 枚舉總長因數
  - 拼組回溯強剪枝
judgment: 候選長度至少為最長短段，且必須整除總長。
hints:
  - 短段降序排序；候選原長由最大段起遞增，只試總和的因數。
  - 逐根拼滿；一根剛開始時固定取第一個未用段可消除原木棍排列對稱。
  - 同層略過相同長度；若第一段或恰好補滿的選擇失敗，可立即返回。
solution_outline: 枚舉候選長度，以 DFS 依序拼出 sum/length 根；使用降序、同值去重、空棒與恰填滿失敗剪枝。
proof_or_invariant: DFS
  每次選未用短段且不超剩餘長度，完成指定根數時所有段恰用一次。固定新棒第一段只消除等長原棒的排列，不刪本質方案；其他剪枝皆為對稱或必要條件。首個成功因數最小。
complexity:
  time: 最壞 O(n!)
  space: O(n)
common_errors:
  - 候選長度未檢查整除總和
  - 相同段長反覆嘗試
  - 新棒第一個選擇失敗後仍做大量等價搜尋
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;cin>>n;vector<int>a(n);int sum=0;for(int& x:a){cin>>x;sum+=x;}sort(a.rbegin(),a.rend());vector<bool>used(n);for(int target=a[0];target<=sum;++target){if(sum%target!=0)continue;int groups=sum/target;const auto dfs=[&](const auto& self,int done,int current,int start)->bool{if(done==groups-1)return true;if(current==target)return self(self,done+1,0,0);int previous=-1;for(int i=start;i<n;++i){if(used[i]||a[i]==previous||current+a[i]>target)continue;used[i]=true;if(self(self,done,current+a[i],i+1))return true;used[i]=false;previous=a[i];if(current==0||current+a[i]==target)return false;}return false;};fill(used.begin(),used.end(),false);if(dfs(dfs,0,0,0)){cout<<target<<'\n';break;}}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;cin>>n;vector<int>a(n);int sum=0;for(int& x:a){cin>>x;sum+=x;}sort(a.rbegin(),a.rend());vector<bool>used(n);for(int target=a[0];target<=sum;++target){if(sum%target!=0)continue;int groups=sum/target;const auto dfs=[&](const auto& self,int done,int current,int start)->bool{if(done==groups-1)return true;if(current==target)return self(self,done+1,0,0);int previous=-1;for(int i=start;i<n;++i){if(used[i]||a[i]==previous||current+a[i]>target)continue;used[i]=true;if(self(self,done,current+a[i],i+1))return true;used[i]=false;previous=a[i];if(current==0||current+a[i]==target)return false;}return false;};fill(used.begin(),used.end(),false);if(dfs(dfs,0,0,0)){cout<<target<<'\n';break;}}}
external_url: https://www.luogu.com.cn/problem/P1120
external_platform: 洛谷
external_problem_id: P1120
external_title: 小木棍
external_relation: original
source_book_pages:
  - 114
source_pdf_pages:
  - 132
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
