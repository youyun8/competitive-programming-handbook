---
id: openj-bailian-1854
volume: upper
source_file: upper-volume
title: OpenJ_Bailian 1854 Evil Straw Warts Live
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 4
topics: ['貪心', '回文', '相鄰交換']
prerequisites: []
statement: |-
  求以相鄰交換把字串變成回文的最少次數；無解輸出 Impossible。
constraints:
  - '測資數在首行；字串長度<=8000，僅小寫字母。'
input_format: '依題意輸入測資數、規模與資料；多組題讀到指定終止條件。'
output_format: '每組依題意輸出答案或圖形。'
samples:
  - input: |
      3
      mamad
      asflkj
      aabb
    output: |
      3
      Impossible
      2
    explanation: '依定義計算或遞迴展開後得到所示結果。'
core_knowledge: ['貪心', '回文', '相鄰交換']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){string s;cin>>s;array<int,26>c{};for(char x:s)++c[x-'a'];int odd=0;for(int x:c)odd+=x%2;if(odd>1){cout<<"Impossible\n";continue;}long long ans=0;for(int l=0,r=static_cast<int>(s.size())-1;l<r;++l,--r){int k=r;while(k>l&&s[k]!=s[l])--k;if(k==l){swap(s[l],s[l+1]);++ans;--l;++r;}else{for(;k<r;++k){swap(s[k],s[k+1]);++ans;}}}cout<<ans<<'\n';}return 0;}
external_url: http://bailian.openjudge.cn/practice/1854
external_platform: OpenJ_Bailian
external_problem_id: '1854'
external_title: 'Evil Straw Warts Live'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
