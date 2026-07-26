---
id: luogu-p1498
volume: upper
source_file: upper-volume
title: 洛谷 P1498 南蠻圖騰
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 4
topics: ['分治', '遞迴圖形']
prerequisites: []
statement: |-
  輸出第 n 階由三個較小圖騰組成的三角形 ASCII 圖案。
constraints:
  - '1<=n<=10。'
input_format: '依題意輸入測資數、規模與資料；多組題讀到指定終止條件。'
output_format: '每組依題意輸出答案或圖形。'
samples:
  - input: |
      2
    output: |2
         /\
        /__\
       /\  /\
      /__\/__\
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
  using namespace std;void draw(vector<string>&s,int x,int y,int h){if(h==2){s[x][y+1]='/';s[x][y+2]='\\';s[x+1][y]='/';s[x+1][y+1]=s[x+1][y+2]='_';s[x+1][y+3]='\\';return;}int q=h/2;draw(s,x,y+q,q);draw(s,x+q,y,q);draw(s,x+q,y+2*q,q);}int main(){int n;cin>>n;int h=1<<n;vector<string>s(h,string(2*h,' '));draw(s,0,0,h);for(auto&x:s){while(!x.empty()&&x.back()==' ')x.pop_back();cout<<x<<'\n';}return 0;}
external_url: https://www.luogu.com.cn/problem/P1498
external_platform: 洛谷
external_problem_id: 'P1498'
external_title: '南蠻圖騰'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
