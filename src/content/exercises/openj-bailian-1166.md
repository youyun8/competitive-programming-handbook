---
id: openj-bailian-1166
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: OpenJ_Bailian 1166 The Clocks
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 2
topics:
  - 線性代數
  - 數論
prerequisites:
  - 高斯消元與圖論
statement: 九個時鐘各有四種狀態，九種操作會旋轉指定時鐘；輸出使全部回到 12 點的最短排序操作序列。
constraints:
  - 固定 3x3、9 種操作
input_format: 依題面讀入維度、矩陣、圖或測試資料。
output_format: 依指定精度與固定字串輸出答案。
samples:
  - input: |
      3 3 0
      2 2 2
      2 1 2
    output: |
      4 5 8 9
    explanation: 依操作定義或方程直接驗算，可得到所示結果。
core_knowledge:
  - 不變量與代數建模
  - 消元或狀態搜尋
judgment: 每種操作做四次等於未操作，因此枚舉九種操作各 0..3 次，檢查終態並取操作總數最少者。
hints:
  - 先將幾何、操作或連通條件寫成方程或有限狀態。
  - 選擇符合代數結構的消元、矩陣樹或 BFS。
  - 最後處理唯一性、模數、精度與輸出方案。
solution_outline: 每種操作做四次等於未操作，因此枚舉九種操作各 0..3 次，檢查終態並取操作總數最少者。
proof_or_invariant: 任何操作序列可交換排序且次數對 4 化簡，所以枚舉涵蓋每個等價方案；題目保證最短答案唯一。
complexity:
  time: O(4^9·9)
  space: O(1)
common_errors:
  - 主元或狀態編號錯誤
  - 非質數模數誤用逆元
  - 輸出精度或固定字串不符
cpp_skeleton: |
  // TODO：依證明自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){vector<int>a(9);for(int&x:a)cin>>x;vector<string>mv={"0134","012","1245","036","13457","258","3467","678","4578"};int best=99,bm=0;for(int s=0;s<(1<<18);++s){int z=s,c=0;vector<int>x=a;for(int i=0;i<9;++i){int t=z&3;z>>=2;c+=t;for(char q:mv[i])x[q-'0']=(x[q-'0']+t)%4;}if(c<best&&all_of(x.begin(),x.end(),[](int v){return v==0;}))best=c,bm=s;}bool first=true;for(int i=0;i<9;++i){int t=(bm>>(2*i))&3;while(t--){if(!first)cout<<' ';first=false;cout<<i+1;}}cout<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){vector<int>a(9);for(int&x:a)cin>>x;vector<string>mv={"0134","012","1245","036","13457","258","3467","678","4578"};int best=99,bm=0;for(int s=0;s<(1<<18);++s){int z=s,c=0;vector<int>x=a;for(int i=0;i<9;++i){int t=z&3;z>>=2;c+=t;for(char q:mv[i])x[q-'0']=(x[q-'0']+t)%4;}if(c<best&&all_of(x.begin(),x.end(),[](int v){return v==0;}))best=c,bm=s;}bool first=true;for(int i=0;i<9;++i){int t=(bm>>(2*i))&3;while(t--){if(!first)cout<<' ';first=false;cout<<i+1;}}cout<<"\n";}
external_url: http://bailian.openjudge.cn/practice/1166/
external_platform: OpenJ_Bailian
external_problem_id: '1166'
external_title: The Clocks
external_relation: original
review_status: verified
---

將題意轉成可驗證的代數或圖模型。
