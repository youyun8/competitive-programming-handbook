---
volume: upper
source_file: upper-volume
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - recursion
id: openjudge-1011
title: OpenJudge 百練 1011 Sticks
statement: 多根等長原木棍被切成至多 64 段，每段不超過 50。使用全部短段拼回若干根等長木棍，求最小可能原長。
constraints:
  - 短段數不超過 64
  - 每段為 1..50 的整數
  - 多組資料，以 0 結束
judgment: 每段恰使用一次，原木棍根數與長度未知。
hints:
  - 候選由最長短段起，只枚舉總長因數。
  - 短段降序；逐根填滿並略過同層相同長度。
  - 新棒第一段或恰好補滿的選擇失敗時，其餘對稱分支可停止。
input_format: 每組先給段數 n，再給 n 個長度。
output_format: 每組輸出最小原長。
samples:
  - input: |
      9
      5 2 1 5 2 1 5 2 1
      4
      1 2 3 4
      0
    output: |-
      6
      5
    explanation: 第一組可拼成長 6；第二組最小可拼成兩根長 5。
core_knowledge:
  - 候選長度必須整除總長
  - 降序回溯與對稱剪枝
solution_outline: 枚舉候選原長，以 used 回溯拼出所有木棍，使用降序、重值及空棒剪枝。
proof_or_invariant: DFS 的每層選一個未用段且不超剩餘長度，成功時所有段恰分組。剪枝只刪除等價排列；候選遞增，首個成功值最小。
common_errors:
  - 未檢查整除總長
  - 相同段重複搜尋
  - 回溯未撤銷 used
complexity:
  time: 最壞 O(n!)
  space: O(n)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;while(cin>>n&&n){vector<int>a(n);int sum=0;for(int&x:a){cin>>x;sum+=x;}sort(a.rbegin(),a.rend());vector<bool>u(n);for(int len=a[0];len<=sum;++len){if(sum%len)continue;int groups=sum/len;const auto dfs=[&](const auto&self,int done,int cur,int start)->bool{if(done==groups-1)return true;if(cur==len)return self(self,done+1,0,0);int prev=-1;for(int i=start;i<n;++i)if(!u[i]&&a[i]!=prev&&cur+a[i]<=len){u[i]=true;if(self(self,done,cur+a[i],i+1))return true;u[i]=false;prev=a[i];if(cur==0||cur+a[i]==len)return false;}return false;};fill(u.begin(),u.end(),false);if(dfs(dfs,0,0,0)){cout<<len<<'\n';break;}}}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;while(cin>>n&&n){vector<int>a(n);int sum=0;for(int&x:a){cin>>x;sum+=x;}sort(a.rbegin(),a.rend());vector<bool>u(n);for(int len=a[0];len<=sum;++len){if(sum%len)continue;int groups=sum/len;const auto dfs=[&](const auto&self,int done,int cur,int start)->bool{if(done==groups-1)return true;if(cur==len)return self(self,done+1,0,0);int prev=-1;for(int i=start;i<n;++i)if(!u[i]&&a[i]!=prev&&cur+a[i]<=len){u[i]=true;if(self(self,done,cur+a[i],i+1))return true;u[i]=false;prev=a[i];if(cur==0||cur+a[i]==len)return false;}return false;};fill(u.begin(),u.end(),false);if(dfs(dfs,0,0,0)){cout<<len<<'\n';break;}}}}
external_url: http://bailian.openjudge.cn/practice/1011/
external_platform: OpenJudge 百練
external_problem_id: '1011'
external_title: Sticks
external_relation: original
source_book_pages:
  - 121
source_pdf_pages:
  - 139
review_status: verified
---

依官方題面獨立重述與實作。
