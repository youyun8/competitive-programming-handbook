---
id: luogu-p3938
volume: upper
source_file: upper-volume
source_book_pages: [244]
source_pdf_pages: [262]
chapter: 4
section: '4.8'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3938 斐波那契：隱式樹最近公共祖先
difficulty: 4
topics: [斐波那契數, 隱式樹, LCA]
prerequisites: [lowest-common-ancestor]
statement: 兔子按出生順序編號，繁衍關係形成題目定義的斐波那契樹。回答多組兩個編號的最近公共祖先。
constraints:
  - '1 <= m <= 300000'
  - '1 <= a_i,b_i <= 10^12'
input_format: 第一行詢問數 m；接著 m 行 a、b。
output_format: 每組輸出最近公共祖先編號。
samples:
  - input: |
      3
      5 7
      1 2
      6 6
    output: |
      2
      1
      6
    explanation: 與官方題面列舉的三組祖先關係一致。
core_knowledge: [Zeckendorf 型父節點, 最大嚴格小 Fibonacci, 單調編號]
judgment: 樹不需顯式建立；節點 x 的父親是 x 減去嚴格小於 x 的最大斐波那契數，且每次上跳編號下降。
hints:
  - 預先產生 1、2、3、5…直到超過 10^12。
  - 對 x>1，用 lower_bound 找第一個不小於 x 的 Fibonacci，前一項就是要減的值。
  - 兩點未相等時，只把編號較大的點跳到父親；單調下降後相遇點即 LCA。
solution_outline: 預處理 Fibonacci；每個詢問反覆將較大編號替換成 parent，直到兩者相等。
proof_or_invariant: 編號的分批出生規則使父節點公式成立。祖先鏈嚴格遞減；若目前 a>b，b 不可能是 a 之下的節點，將 a 上跳不會越過兩鏈的首次交點，因此相遇即最近公共祖先。
complexity:
  time: 每詢問 O(log^2 max_label)
  space: O(log max_label)
common_errors:
  - 減去小於等於 x 的最大 Fibonacci；x 本身為 Fibonacci 時必須取前一項
  - Fibonacci 從 1、1 開始造成 lower_bound 重複混亂
  - 以 32 位元儲存編號
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int m;cin>>m;/* TODO：預處理 Fibonacci 並反覆上跳較大節點。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);vector<long long>fibonacci{1,2};while(fibonacci.back()<=1000000000000LL){size_t size=fibonacci.size();fibonacci.push_back(fibonacci[size-1]+fibonacci[size-2]);}auto parent=[&](long long node){auto iterator=lower_bound(fibonacci.begin(),fibonacci.end(),node);return node-*(iterator-1);};int query_count;cin>>query_count;while(query_count--){long long first,second;cin>>first>>second;while(first!=second){if(first<second)swap(first,second);first=parent(first);}cout<<first<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3938
external_platform: 洛谷
external_problem_id: P3938
external_title: 斐波那契
---

這棵樹的拓撲已完全編碼在節點編號中；找出父節點公式後，不必儲存任何邊。
