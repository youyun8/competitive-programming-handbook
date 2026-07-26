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
id: openjudge-2362
title: OpenJudge 百練 2362 Square
statement: 給定 4..20 根木棒，判斷能否全部首尾相接分成四條等長邊形成正方形。
constraints:
  - 測試組數由首行給定
  - 4 <= M <= 20
  - 棒長 1..10000
judgment: 每根棒必須使用且不可折斷。
hints:
  - 總長須能被四整除，且最長棒不可超過邊長。
  - 木棒降序，依序嘗試放入四條尚未超長的邊。
  - 若兩條邊目前長度相同，只需嘗試其中一條。
input_format: 每組先給 M，再給 M 個長度。
output_format: 可行輸出 yes，否則 no。
samples:
  - input: |
      3
      4 1 1 1 1
      5 10 20 30 40 50
      8 1 7 2 6 4 4 3 5
    output: |-
      yes
      no
      yes
    explanation: 第一組每棒一邊；第二組總長不能分成四條可拼邊。
core_knowledge:
  - 四分組回溯
  - 對稱剪枝
solution_outline: 先檢查必要條件，再降序 DFS 將每根棒分配到四邊。
proof_or_invariant: DFS 枚舉每根棒的所有可行邊；略過等長邊只消除邊標號對稱。全部放完時總和已是四倍邊長，無超長即四邊皆等長。
common_errors:
  - 未使用全部木棒
  - 未檢查最長棒
  - 相同邊狀態反覆搜尋
complexity:
  time: O(4^M)
  space: O(M)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){int n;cin>>n;vector<int>a(n);long long sum=0;for(int&x:a){cin>>x;sum+=x;}sort(a.rbegin(),a.rend());if(sum%4||a[0]>sum/4){cout<<"no\n";continue;}long long target=sum/4;array<long long,4>side{};const auto dfs=[&](const auto&self,int i)->bool{if(i==n)return true;for(int s=0;s<4;++s){if(side[s]+a[i]>target)continue;if(s>0&&side[s]==side[s-1])continue;side[s]+=a[i];if(self(self,i+1))return true;side[s]-=a[i];}return false;};cout<<(dfs(dfs,0)?"yes\n":"no\n");}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){int n;cin>>n;vector<int>a(n);long long sum=0;for(int&x:a){cin>>x;sum+=x;}sort(a.rbegin(),a.rend());if(sum%4||a[0]>sum/4){cout<<"no\n";continue;}long long target=sum/4;array<long long,4>side{};const auto dfs=[&](const auto&self,int i)->bool{if(i==n)return true;for(int s=0;s<4;++s){if(side[s]+a[i]>target)continue;if(s>0&&side[s]==side[s-1])continue;side[s]+=a[i];if(self(self,i+1))return true;side[s]-=a[i];}return false;};cout<<(dfs(dfs,0)?"yes\n":"no\n");}}
external_url: http://bailian.openjudge.cn/practice/2362/
external_platform: OpenJudge 百練
external_problem_id: '2362'
external_title: Square
external_relation: original
source_book_pages:
  - 121
source_pdf_pages:
  - 139
review_status: verified
---

依官方題面獨立重述與實作。
