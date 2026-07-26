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
id: openjudge-1129
title: OpenJudge 百練 1129 Channel Allocation
statement: 給定至多 26 個中繼站的平面無向鄰接圖，鄰站不得使用同頻道，求最少頻道數。
constraints:
  - 1 <= n <= 26
  - 頂點為 A 起的連續大寫字母
  - 輸入 0 結束
judgment: 鄰接關係無向，即使只需讀題目所給每行一次。
hints:
  - 從一種顏色開始測試是否可著色。
  - 依頂點順序，嘗試所有不與已染鄰點衝突的顏色。
  - 第一個可行顏色數就是最小值；平面圖至多需四種。
input_format: 每組先給 n，再給 n 行如 A:BC 的鄰接表。
output_format: 依答案輸出 `1 channel needed.` 或 `k channels needed.`。
samples:
  - input: |
      2
      A:
      B:
      4
      A:BC
      B:ACD
      C:ABD
      D:BC
      4
      A:BCD
      B:ACD
      C:ABD
      D:ABC
      0
    output: |-
      1 channel needed.
      3 channels needed.
      4 channels needed.
    explanation: 三張圖分別是空圖、需三色的圖及 K4。
core_knowledge:
  - 圖著色回溯
  - 逐步加深顏色數
solution_outline: 解析鄰接矩陣，對 k=1..4 回溯 k-著色。
proof_or_invariant: 固定 k 時 DFS 枚舉每頂點全部合法顏色，因此成功充要於可 k 著色。由小到大測試，首個成功值即色數。
common_errors:
  - 單複數格式錯誤
  - 忘記鄰接為對稱
  - 找到衝突後仍接受顏色
complexity:
  time: O(4^n)
  space: O(n^2)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;while(cin>>n&&n){vector<vector<bool>>g(n,vector<bool>(n));for(int i=0;i<n;++i){string s;cin>>s;for(size_t j=2;j<s.size();++j){int v=s[j]-'A';g[i][v]=g[v][i]=true;}}vector<int>color(n,-1);int answer=4;for(int limit=1;limit<=4;++limit){const auto dfs=[&](const auto&self,int v)->bool{if(v==n)return true;for(int c=0;c<limit;++c){bool ok=true;for(int u=0;u<n;++u)if(g[v][u]&&color[u]==c)ok=false;if(ok){color[v]=c;if(self(self,v+1))return true;color[v]=-1;}}return false;};fill(color.begin(),color.end(),-1);if(dfs(dfs,0)){answer=limit;break;}}cout<<answer<<(answer==1?" channel needed.\n":" channels needed.\n");}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;while(cin>>n&&n){vector<vector<bool>>g(n,vector<bool>(n));for(int i=0;i<n;++i){string s;cin>>s;for(size_t j=2;j<s.size();++j){int v=s[j]-'A';g[i][v]=g[v][i]=true;}}vector<int>color(n,-1);int answer=4;for(int limit=1;limit<=4;++limit){const auto dfs=[&](const auto&self,int v)->bool{if(v==n)return true;for(int c=0;c<limit;++c){bool ok=true;for(int u=0;u<n;++u)if(g[v][u]&&color[u]==c)ok=false;if(ok){color[v]=c;if(self(self,v+1))return true;color[v]=-1;}}return false;};fill(color.begin(),color.end(),-1);if(dfs(dfs,0)){answer=limit;break;}}cout<<answer<<(answer==1?" channel needed.\n":" channels needed.\n");}}
external_url: http://bailian.openjudge.cn/practice/1129/
external_platform: OpenJudge 百練
external_problem_id: '1129'
external_title: Channel Allocation
external_relation: original
source_book_pages:
  - 121
source_pdf_pages:
  - 139
review_status: verified
---

依官方題面獨立重述與實作。
