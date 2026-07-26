---
id: openj-bailian-2388
volume: upper
source_file: upper-volume
title: OpenJ_Bailian 2388 Who's in the Middle
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 4
topics: ['排序', '中位數']
prerequisites: []
statement: |-
  給定奇數個整數，輸出排序後正中央的數。
constraints:
  - 'N<=10000 且為奇數；數值<=1000000。'
input_format: '依題意輸入測資數、規模與資料；多組題讀到指定終止條件。'
output_format: '每組依題意輸出答案或圖形。'
samples:
  - input: |
      5
      2
      4
      1
      3
      5
    output: |
      3
    explanation: '依定義計算或遞迴展開後得到所示結果。'
core_knowledge: ['排序', '中位數']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;nth_element(a.begin(),a.begin()+n/2,a.end());cout<<a[n/2]<<'\n';return 0;}
external_url: http://bailian.openjudge.cn/practice/2388
external_platform: OpenJ_Bailian
external_problem_id: '2388'
external_title: "Who's in the Middle"
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
