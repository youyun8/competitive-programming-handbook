---
id: luogu-p1593
volume: upper
source_file: upper-volume
title: 洛谷 P1593 因子和
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 4
topics: ['質因數分解', '等比級數', '快速冪']
prerequisites: []
statement: |-
  求 A^B 所有正因數之和，答案模 9901。
constraints:
  - '0<=A,B<=50000000。'
input_format: '依題意輸入測資數、規模與資料；多組題讀到指定終止條件。'
output_format: '每組依題意輸出答案或圖形。'
samples:
  - input: |
      2 3
    output: |
      15
    explanation: '依定義計算或遞迴展開後得到所示結果。'
core_knowledge: ['質因數分解', '等比級數', '快速冪']
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
  using namespace std;constexpr long long M=9901;long long pw(long long a,long long b){long long r=1;for(a%=M;b;b/=2,a=a*a%M)if(b&1)r=r*a%M;return r;}long long sum(long long p,long long n){if(n==0)return 1;if(n&1){long long h=sum(p,n/2);return h*(1+pw(p,n/2+1))%M;}return (sum(p,n/2-1)*(1+pw(p,n/2))+pw(p,n))%M;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);long long a,b;cin>>a>>b;if(a==0){cout<<0<<'\n';return 0;}long long ans=1;for(long long p=2;p*p<=a;++p)if(a%p==0){long long e=0;while(a%p==0){a/=p;++e;}ans=ans*sum(p,e*b)%M;}if(a>1)ans=ans*sum(a,b)%M;cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1593
external_platform: 洛谷
external_problem_id: 'P1593'
external_title: '因子和'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
