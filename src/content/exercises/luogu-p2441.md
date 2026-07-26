---
id: luogu-p2441
volume: lower
source_file: lower-volume
title: 洛谷 P2441 角色屬性樹
chapter: 6
section: '6.10'
kind: external-oj
difficulty: 3
topics:
  - 樹
  - 最大公因數
  - 質因數
prerequisites:
  - prime-numbers
  - gcd-lcm
statement: >-
  每個樹節點有一個屬性值。詢問節點 u 最近的、與 u 屬性值有共同質因數的祖先；亦可單點修改屬性。
constraints:
  - 1 <= n <= 200000
  - k < 100000
  - 屬性值 <= 2^31 - 1
  - 修改操作不超過 50 次；官方註明測資隨機
input_format: >-
  先輸入 n,k 與 n 個屬性；再輸入 n-1 條 x y（x 是 y 的父節點）；其後 k 次操作：1 u 查詢，2 u a 修改。
output_format: >-
  每個查詢輸出最近符合條件的祖先編號，若不存在輸出 -1。
samples:
  - input: |
      4 6
      10 8 4 3
      1 2
      2 3
      3 4
      1 1
      1 2
      1 3
      1 4
      2 1 9
      1 4
    output: |
      -1
      1
      2
      -1
      1
    explanation: >-
      例如節點 3 的值為 4，父節點 2 的值為 8，gcd=4>1，所以最近答案是 2；官方樣例。
hints:
  - >-
    有共同質因數等價於兩個屬性值的 gcd 大於 1。
  - >-
    輸入邊直接給父子方向，可用 parent[y]=x 保存。
  - >-
    官方測資隨機且修改很少；沿父鏈由近到遠檢查即可通過該題既有資料。
core_knowledge:
  - 共同質因數與 GCD
  - 父鏈查詢
judgment: >-
  官方明示測資隨機且可能是假題；此卡忠實採用可通過原題資料的父鏈掃描，而不宣稱具最壞情況保證。
solution_outline: >-
  保存每個節點的父親。查詢時從 parent[u] 開始往根走，第一個 gcd(value[u],value[v])>1 的 v 即答案；修改直接覆寫值。
proof_or_invariant: >-
  父鏈的枚舉順序按與 u 的距離嚴格遞增；第一個通過 gcd 條件的節點因此必是最近祖先。若走到根外仍未找到，則不存在。
common_errors:
  - 查詢時把節點自己也算作祖先
  - 把無向邊誤建而丟失題面給定的父子方向
  - 修改後未使用新屬性值
complexity:
  time: 每次查詢 O(h log A)，修改 O(1)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依照三個提示完成演算法；先保留可編譯的輸入輸出骨架。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, query_count; cin >> n >> query_count;
      vector<long long> value(static_cast<size_t>(n) + 1);
      vector<int> parent(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) cin >> value[static_cast<size_t>(i)];
      for (int i = 1, x = 0, y = 0; i < n; ++i) {
          cin >> x >> y; parent[static_cast<size_t>(y)] = x;
      }
      while (query_count-- > 0) {
          int operation, u; cin >> operation >> u;
          if (operation == 2) { cin >> value[static_cast<size_t>(u)]; continue; }
          int answer = -1;
          for (int v = parent[static_cast<size_t>(u)]; v != 0; v = parent[static_cast<size_t>(v)]) {
              if (gcd(value[static_cast<size_t>(u)], value[static_cast<size_t>(v)]) > 1) {
                  answer = v; break;
              }
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2441
external_platform: 洛谷
external_problem_id: 'P2441'
external_title: '角色屬性樹'
external_relation: original
original_label: '洛谷 P2441'
source_book_pages: [424, 430]
source_pdf_pages: [54, 60]
review_status: verified
---

這題的理論最壞複雜度不漂亮；評測條件是解法成立的重要部分。

原始題單中本題位於第 6.10 節、習題 第 3 題；競賽來源記為「未標示」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
