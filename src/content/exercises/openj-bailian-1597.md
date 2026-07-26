---
id: openj-bailian-1597
volume: lower
source_file: lower-volume
source_book_pages:
  - 418
source_pdf_pages:
  - 48
title: OpenJ_Bailian 1597 Uniform Generator
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 1
topics:
  - 最大公因數
  - 互質
prerequisites:
  - 最大公因數與整除
statement: 給定線性同餘亂數產生器的步長 step 與模數 mod，判斷它是否會在重複前走遍所有模 mod 的剩餘類。
constraints:
  - 0 < step, mod < 100000
input_format: 每行兩個整數 step、mod，讀至 EOF。
output_format: 以各寬 10 欄輸出 step、mod，接四個空格與 `Good Choice` 或 `Bad Choice`，每組後留空行。
samples:
  - input: |
      3 5
      15 20
    output: |2+
               3         5    Good Choice

              15        20    Bad Choice

    explanation: 3 與 5 互質所以週期為 5；15 與 20 不互質。
core_knowledge:
  - 模循環
  - gcd
judgment: 加法序列的週期為 mod/gcd(step,mod)，恰在 gcd 為 1 時覆蓋全部狀態。
hints:
  - 觀察相鄰狀態的差固定為 step。
  - 回到起點等價於 k·step 被 mod 整除。
  - 用 gcd 求最小正 k，並依題目固定欄寬輸出。
solution_outline: 加法序列的週期為 mod/gcd(step,mod)，恰在 gcd 為 1 時覆蓋全部狀態。
proof_or_invariant: 最小正週期是 mod/gcd(step,mod)，因此週期等於 mod 當且僅當兩數互質。
complexity:
  time: 每組 O(log mod)
  space: O(1)
common_errors:
  - 漏掉每組後的空行
  - 輸出欄寬不符
cpp_skeleton: |
  // TODO：理解證明後，可嘗試自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int step,mod;while(cin>>step>>mod){cout<<setw(10)<<step<<setw(10)<<mod<<"    "<<(gcd(step,mod)==1?"Good Choice":"Bad Choice")<<"\n\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int step,mod;while(cin>>step>>mod){cout<<setw(10)<<step<<setw(10)<<mod<<"    "<<(gcd(step,mod)==1?"Good Choice":"Bad Choice")<<"\n\n";}}
external_url: http://bailian.openjudge.cn/practice/1597/
external_platform: OpenJ_Bailian
external_problem_id: '1597'
external_title: Uniform Generator
external_relation: original
review_status: verified
---

本題以可驗證的數論性質化簡後實作。
