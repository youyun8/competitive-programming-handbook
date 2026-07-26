---
id: luogu-p2585
volume: upper
source_file: upper-volume
title: 洛谷 P2585 三色二叉樹
chapter: 5
section: '5.6'
kind: external-oj
difficulty: 3
topics: ['tree-dp', 'parsing']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  以 0、1、2 的前序字串描述每點兒子數。用紅綠藍染色，父子不同色，且同父的兩個兒子也不同色；求綠色節點數最大值與最小值。
constraints:
  - 編碼長度不超過 500000
  - 字串只含 0、1、2
  - 編碼保證是一棵合法二叉樹
input_format: 一行二叉樹前序編碼。
output_format: 輸出最多與最少綠色節點數。
samples:
  - input: |-
      1122002010
    output: |-
      5 2
    explanation: 逐字解析樹並枚舉每點三種顏色，最優極值分別為 5、2。
core_knowledge: ['前序編碼解析', '三色 DP', '極值 DP']
judgment: 固定節點顏色後，兒子只剩兩色可選；雙兒子時兩者必分別使用這兩色。
hints:
  - 遞迴讀取一個字元即可知道接著要解析零、一或兩棵子樹。
  - mx[u][c]、mn[u][c] 固定 u 顏色 c，先加 c 是否為綠色。
  - 一個兒子枚舉不同於 c 的色；兩個兒子只需比較剩餘兩色的兩種排列。
solution_outline: >-
  遞迴解析前序字串，同時在返回時算三色的最大與最小 DP。根的三種顏色再各取極值。
proof_or_invariant: >-
  合法性限制只發生於一個節點及其兒子。固定父色後，一子情況枚舉另外兩色；二子情況兩兒必恰用另外兩色，兩種排列完整且互斥。依解析樹高歸納得到精確極值。
common_errors: ['把字元值當節點編號', '雙兒子允許同色', '只比較根為綠色的答案']
complexity:
  time: 'O(n)'
  space: 'O(n)'
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
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <string>
  using namespace std;
  struct State{array<int,3> hi,lo;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string s;cin>>s;size_t pos=0;auto parse=[&](auto&&f)->State{int count=s[pos++]-'0';State left{},right{},res{};if(count>=1)left=f(f);if(count==2)right=f(f);for(int c=0;c<3;c++){int add=c==0;if(count==0)res.hi[c]=res.lo[c]=add;else if(count==1){res.hi[c]=add;res.lo[c]=1000000000;for(int x=0;x<3;x++)if(x!=c){res.hi[c]=max(res.hi[c],add+left.hi[x]);res.lo[c]=min(res.lo[c],add+left.lo[x]);}}else{int x=(c+1)%3,y=(c+2)%3;res.hi[c]=add+max(left.hi[x]+right.hi[y],left.hi[y]+right.hi[x]);res.lo[c]=add+min(left.lo[x]+right.lo[y],left.lo[y]+right.lo[x]);}}return res;};State root=parse(parse);cout<<*max_element(root.hi.begin(),root.hi.end())<<' '<<*min_element(root.lo.begin(),root.lo.end())<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2585
external_platform: 洛谷
external_problem_id: 'P2585'
external_title: 三色二叉樹
external_relation: original
source_book_pages: [364]
source_pdf_pages: [382]
review_status: verified
---

前序編碼可邊解析邊做後序 DP，無須另建指標樹。
