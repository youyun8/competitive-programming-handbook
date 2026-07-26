---
id: openjudge-1020
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1020 Anniversary Cake
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 4
topics:
  - search
prerequisites:
  - graph-search
statement: 將邊長 s 的正方形蛋糕無浪費地切成 n 個指定邊長的正方形，判斷是否可行。
constraints:
  - 1 <= t <= 10
  - 1 <= n <= 16
  - 小蛋糕邊長 1..10
judgment: 每塊指定正方形恰使用一次，不可旋轉出不同形狀，也不可重疊或留空。
hints:
  - 先檢查小塊總面積是否等於 s²。
  - 以每欄目前已填高度表示輪廓，總在最低且最左的欄放下一塊。
  - 相同邊長只試一次；放置範圍內各欄高度必須相同且不超過 s。
input_format: 首行測試數；每組依序給 s、n 與 n 個邊長。
output_format: 可行輸出 KHOOOOB!，否則 HUTUTU!。
samples:
  - input: |
      2
      4 8 1 1 1 1 1 3 1 1
      5 6 3 3 2 1 1 1
    output: |-
      KHOOOOB!
      HUTUTU!
    explanation: 第一組面積相等且能以一塊 3×3 與七塊 1×1 鋪滿；第二組無法鋪滿。
core_knowledge:
  - 輪廓線回溯
  - 面積必要條件
solution_outline: 短邊降序，以欄高輪廓 DFS；選最低左欄，枚舉可放的未用方塊並回溯。
proof_or_invariant: 任何完整鋪法在最低左空格必有一塊以該處為左下角，DFS 枚舉其所有可能尺寸；輪廓條件恰保證不重疊且在界內。歸納可知不漏鋪法。
complexity:
  time: 最壞 O(n!)
  space: O(n+s)
common_errors:
  - 未先檢查面積
  - 允許跨越不同高度欄
  - 相同尺寸造成重複分支
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){int side,n;cin>>side>>n;vector<int>a(n);int area=0;for(int&x:a){cin>>x;area+=x*x;}sort(a.rbegin(),a.rend());vector<int>height(side);vector<bool>used(n);const auto dfs=[&](const auto&self,int placed)->bool{if(placed==n)return true;int col=static_cast<int>(min_element(height.begin(),height.end())-height.begin()),base=height[col],previous=-1;for(int i=0;i<n;++i)if(!used[i]&&a[i]!=previous){int len=a[i];if(col+len>side||base+len>side)continue;bool flat=true;for(int c=col;c<col+len;++c)if(height[c]!=base)flat=false;if(!flat)continue;previous=len;used[i]=true;for(int c=col;c<col+len;++c)height[c]+=len;if(self(self,placed+1))return true;for(int c=col;c<col+len;++c)height[c]-=len;used[i]=false;}return false;};cout<<((area==side*side&&dfs(dfs,0))?"KHOOOOB!\n":"HUTUTU!\n");}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){int side,n;cin>>side>>n;vector<int>a(n);int area=0;for(int&x:a){cin>>x;area+=x*x;}sort(a.rbegin(),a.rend());vector<int>height(side);vector<bool>used(n);const auto dfs=[&](const auto&self,int placed)->bool{if(placed==n)return true;int col=static_cast<int>(min_element(height.begin(),height.end())-height.begin()),base=height[col],previous=-1;for(int i=0;i<n;++i)if(!used[i]&&a[i]!=previous){int len=a[i];if(col+len>side||base+len>side)continue;bool flat=true;for(int c=col;c<col+len;++c)if(height[c]!=base)flat=false;if(!flat)continue;previous=len;used[i]=true;for(int c=col;c<col+len;++c)height[c]+=len;if(self(self,placed+1))return true;for(int c=col;c<col+len;++c)height[c]-=len;used[i]=false;}return false;};cout<<((area==side*side&&dfs(dfs,0))?"KHOOOOB!\n":"HUTUTU!\n");}}
external_url: http://bailian.openjudge.cn/practice/1020/
external_platform: OpenJudge 百練
external_problem_id: '1020'
external_title: Anniversary Cake
external_relation: original
source_book_pages:
  - 122
source_pdf_pages:
  - 140
review_status: verified
---

依官方題面獨立重述與實作。
