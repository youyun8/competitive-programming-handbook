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
id: openjudge-1416
title: OpenJudge 百練 1416 Shredding Company
statement: 把紙上的至多六位數沿數字間隙切段，各段視為整數。找不超過目標值且總和最大的切法；無可行切法輸出 error，最佳切法不唯一輸出 rejected。
constraints:
  - 目標與紙面數皆為正整數且至多六位
  - 紙面數可含內部 0
  - 0 0 結束
judgment: 不同切點配置即不同方案，即使段值序列相同也會造成 rejected。
hints:
  - 長度至多六，遞迴枚舉下一段的右端點。
  - 累加和超過目標立即停止該分支。
  - 葉節點和更大時覆寫答案；相同最佳和時增加方案數。
input_format: 每行目標與紙面數。
output_format: 唯一最佳時輸出總和及各段；否則輸出 rejected 或 error。
samples:
  - input: |
      50 12346
      376 144139
      9 3142
      0 0
    output: |-
      43 1 2 34 6
      283 144 139
      error
    explanation: 第一筆最佳切為 1+2+34+6；第三筆連逐位切的最小和也超標。
core_knowledge:
  - 切點子集合枚舉
  - 最佳解計數
solution_outline: DFS 依序選每段終點，保存目前段列、最佳和與最佳方案數。
proof_or_invariant: 每個數字間隙切或不切的配置，對應 DFS 唯一葉節點。比較所有不超標葉節點後，最佳值與是否唯一都正確。
common_errors:
  - 把數字 0 段視為非法
  - 相同最佳未輸出 rejected
  - 輸出多餘空白
complexity:
  time: O(2^L)
  space: O(L)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int target;string s;while(cin>>target>>s&&!(target==0&&s=="0")){int best=-1,count=0;vector<int>path,answer;const auto dfs=[&](const auto&self,int pos,int sum)->void{if(sum>target)return;if(pos==static_cast<int>(s.size())){if(sum>best){best=sum;count=1;answer=path;}else if(sum==best)++count;return;}int value=0;for(int end=pos;end<static_cast<int>(s.size());++end){value=value*10+s[end]-'0';path.push_back(value);self(self,end+1,sum+value);path.pop_back();}};dfs(dfs,0,0);if(best<0)cout<<"error\n";else if(count>1)cout<<"rejected\n";else{cout<<best;for(int x:answer)cout<<' '<<x;cout<<'\n';}}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int target;string s;while(cin>>target>>s&&!(target==0&&s=="0")){int best=-1,count=0;vector<int>path,answer;const auto dfs=[&](const auto&self,int pos,int sum)->void{if(sum>target)return;if(pos==static_cast<int>(s.size())){if(sum>best){best=sum;count=1;answer=path;}else if(sum==best)++count;return;}int value=0;for(int end=pos;end<static_cast<int>(s.size());++end){value=value*10+s[end]-'0';path.push_back(value);self(self,end+1,sum+value);path.pop_back();}};dfs(dfs,0,0);if(best<0)cout<<"error\n";else if(count>1)cout<<"rejected\n";else{cout<<best;for(int x:answer)cout<<' '<<x;cout<<'\n';}}}
external_url: http://bailian.openjudge.cn/practice/1416/
external_platform: OpenJudge 百練
external_problem_id: '1416'
external_title: Shredding Company
external_relation: original
source_book_pages:
  - 121
source_pdf_pages:
  - 139
review_status: verified
---

依官方題面獨立重述與實作。
