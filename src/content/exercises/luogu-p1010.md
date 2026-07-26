---
id: luogu-p1010
volume: upper
source_file: upper-volume
title: 洛谷 P1010 冪次方
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 4
topics: ['二進位分解', '遞迴']
prerequisites: []
statement: |-
  將正整數遞迴表示為 2 的冪次和；指數也使用相同表示法。
constraints:
  - 'n<=20000。'
input_format: '依題意輸入測資數、規模與資料；多組題讀到指定終止條件。'
output_format: '每組依題意輸出答案或圖形。'
samples:
  - input: |
      137
    output: |
      2(2(2)+2+2(0))+2(2+2(0))+2(0)
    explanation: '依定義計算或遞迴展開後得到所示結果。'
core_knowledge: ['二進位分解', '遞迴']
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
  using namespace std;string show(int n){string r;for(int i=30;i>=0;--i)if((n&(1<<i))!=0){if(!r.empty())r+='+';if(i==0)r+="2(0)";else if(i==1)r+="2";else r+="2("+show(i)+")";}return r;}int main(){int n;cin>>n;cout<<show(n)<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1010
external_platform: 洛谷
external_problem_id: 'P1010'
external_title: '冪次方'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
