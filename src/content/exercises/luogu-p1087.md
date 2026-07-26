---
id: luogu-p1087
volume: upper
source_file: upper-volume
title: 洛谷 P1087 FBI 樹
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 1
topics: [binary-tree, recursion, postorder]
prerequisites: [recursion, tree-traversal]
statement: >-
  給定長度為 2^n 的 01 字串。每個子字串若全為 0、全為 1、或兩者皆有，分別標成 B、I、F；
  長度大於一時將它等分成左右兩半並遞迴建樹。請輸出這棵分類樹的後序遍歷。
constraints:
  - 0 <= n <= 10
  - 字串長度恰為 2^n，且只含 0 與 1
  - 時間限制 1 秒，記憶體限制 125 MB
input_format: 第一行為 n，第二行為長度 2^n 的 01 字串。
output_format: 輸出由 B、I、F 組成的後序遍歷字串。
samples:
  - input: |
      3
      10001011
    output: 'IBFBBBFIBFIIIFF'
    explanation: 先完成左半與右半的分類序列，最後才輸出整串同時含 0、1 所對應的 F。
core_knowledge: [分治建樹, 後序遍歷, 區間分類]
judgment: 輸出不得含空格；每個葉與內部區間各貢獻一個分類字元。
hints:
  - 每個連續區間就是一個節點；先判斷左右孩子何時存在。
  - 後序順序要求先處理左半、再處理右半，最後才處理目前區間。
  - 區間含 1 的數量若為 0 就是 B，等於區間長度就是 I，否則是 F。
solution_outline: 對半開區間遞迴；非葉節點先走左右半區，再依區間內 1 的數量輸出 B、I 或 F。前綴和可常數時間取得區間計數。
proof_or_invariant: 每次呼叫完整輸出該區間所建子樹的後序序列；左右遞迴分別正確後再輸出根分類，恰符合後序定義。由區間長度歸納即涵蓋整棵樹。
common_errors:
  - 把題面排版中的 2^n 誤讀成 2n
  - 先輸出目前分類而變成先序
  - 分割端點重疊或漏掉字元
complexity:
  time: O(2^n)
  space: O(n)，不計輸出
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static void emit_postorder(int left, int right, const vector<int>& prefix) {
      if (right - left > 1) {
          const int middle = (left + right) / 2;
          emit_postorder(left, middle, prefix);
          emit_postorder(middle, right, prefix);
      }
      // TODO：依 [left, right) 的 1 數量輸出 B、I 或 F。
  }

  int main() {
      int n;
      string bits;
      cin >> n >> bits;
      vector<int> prefix(bits.size() + 1);
      for (size_t i = 0; i < bits.size(); ++i) { prefix[i + 1] = prefix[i] + bits[i] - '0'; }
      emit_postorder(0, static_cast<int>(bits.size()), prefix);
      cout << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static void emit_postorder(int left, int right, const vector<int>& prefix) {
      if (right - left > 1) {
          const int middle = (left + right) / 2;
          emit_postorder(left, middle, prefix);
          emit_postorder(middle, right, prefix);
      }
      const int ones = prefix[right] - prefix[left];
      if (ones == 0) {
          cout << 'B';
      } else if (ones == right - left) {
          cout << 'I';
      } else {
          cout << 'F';
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      string bits;
      cin >> n >> bits;
      vector<int> prefix(bits.size() + 1);
      for (size_t i = 0; i < bits.size(); ++i) { prefix[i + 1] = prefix[i] + bits[i] - '0'; }
      emit_postorder(0, static_cast<int>(bits.size()), prefix);
      cout << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1087
external_platform: 洛谷
external_problem_id: P1087
external_title: '[NOIP 2004 普及組] FBI 樹'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

這題不必配置節點物件；遞迴區間本身就已隱含完整樹形。
