---
id: openj-bailian-2083
volume: upper
source_file: upper-volume
title: OpenJ_Bailian 2083 Fractal
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 4
topics: ['分治', '遞迴圖形']
prerequisites: []
statement: |-
  遞迴輸出 X 形分形；每階以五個前一階圖案組成，-1 結束。
constraints:
  - '1<=n<=7。'
input_format: '依題意輸入測資數、規模與資料；多組題讀到指定終止條件。'
output_format: '每組依題意輸出答案或圖形。'
samples:
  - input: |
      1
      2
      -1
    output: |
      X
      -
      X X
       X
      X X
      -
    explanation: '依定義計算或遞迴展開後得到所示結果。'
core_knowledge: ['分治', '遞迴圖形']
judgment: '直接列舉成本過高或圖形具有自相似性，應使用排序、分治、遞迴或數學分解。'
hints:
  [
    '先明確定義較小子問題或排序後的局部目標。',
    '證明合併子問題結果時不會遺漏或重複計數。',
    '實作時處理相等值、端點、終止條件與寬整數。'
  ]
solution_outline: '依核心技巧拆成較小問題，求解後合併為原問題答案。'
proof_or_invariant: '每次拆分保持原問題所有候選恰被分配至一個子問題；合併步驟依定義計入跨區資訊，因此歸納可得答案正確。'
common_errors: ['終止條件或下標差一', '相等元素誤算', '計數溢位或輸出格式錯誤']
complexity:
  time: 'O(n log n)；圖形題與輸出大小同階'
  space: 'O(n)；圖形題與輸出大小同階'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：依三個提示完成。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;vector<string>make(int n){if(n==1)return{"X"};auto a=make(n-1);int q=static_cast<int>(a.size()),z=3*q;vector<string>s(z,string(z,' '));for(int i=0;i<q;++i)for(int j=0;j<q;++j)if(a[i][j]=='X')for(auto [x,y]:array<pair<int,int>,5>{{{0,0},{0,2},{1,1},{2,0},{2,2}}})s[x*q+i][y*q+j]='X';return s;}int main(){int n;bool first=true;while(cin>>n&&n!=-1){if(!first)cout<<"-\n";first=false;auto s=make(n);for(auto x:s){while(!x.empty()&&x.back()==' ')x.pop_back();cout<<x<<'\n';}}cout<<"-\n";return 0;}
external_url: http://bailian.openjudge.cn/practice/2083
external_platform: OpenJ_Bailian
external_problem_id: '2083'
external_title: 'Fractal'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
