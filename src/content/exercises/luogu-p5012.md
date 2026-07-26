---
id: luogu-p5012
volume: upper
source_file: upper-volume
title: 洛谷 P5012 水の數列：DSU 掃描與區間最優比值
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 5
topics: ['並查集', '離線掃描', '線段樹', '分數比較']
prerequisites: []
statement: |-
  給定長度 n 的正整數序列。選正整數 x，標記所有值不大於 x 的位置；設形成的極大連續標記段長依序為 d_i，原始得分 S(x)=sum(d_i^2)，比較用得分為 S(x)/x。
  每次詢問給加密參數 a,b,p,q，依題定公式與上一答案解出 l,r，要求標記段數介於 [l,r] 的 x 中，使 S(x)/x 最大；同比值取 x 較大者。輸出 S(x)、x，下一行再輸出本次 l、r 與更新後 lastans mod n。無解輸出 -1 -1 並令 lastans=1。
constraints:
  - '1 <= n <= 1000000，1 <= T <= 1000'
  - '1 <= Num_i <= 1000000；其餘輸入在 int 範圍內。'
input_format: '第一行 n,T；第二行 n 個 Num_i；接著 T 行各有 a,b,p,q。真正端點為 l=(a*lastans+p-1)%n+1、r=(b*lastans+q-1)%n+1，再交換使 l<=r。初始 lastans=0。'
output_format: '每次先輸出最佳原始得分 S 與 x；再輸出 l、r、此次解碼所用的 lastans mod n。輸出後，有效答案令 lastans=S*x，無解令 lastans=1。'
samples:
  - input: |
      5 3
      3 5 1 2 4
      233 666 1 3
      555 999 2 3
      123 987 233 888
    output: |
      25 5
      1 3 0
      10 4
      2 3 0
      -1 -1
      3 3 0
    explanation: '第一問解出 [1,3]，取 x=5 時只有一段、S=25；lastans=125。第二問解出 [2,3]，最佳為 x=4、S=10。'
core_knowledge:
  - '依不同數值遞增啟用位置，啟用後的連通分量就是標記連續段。'
  - 'DSU 可在合併兩段時以 (a+b)^2-a^2-b^2=2ab 更新平方和。'
  - '以交叉乘法比較 S/x，避免浮點誤差。'
judgment: 'x 只需取序列中出現的值；同值位置必須整批啟用後才形成合法狀態。詢問只限制段數，因此可先為每個段數保留全域最佳候選。'
hints:
  - '把 x 從小到大移動；此時只有值等於新 x 的位置由未標記變成標記。'
  - '新位置會新增一段，再依左右鄰居是否已啟用進行至多兩次合併；直接維護段數與段長平方和。'
  - '完成所有狀態後，對「段數」陣列建區間最佳值結構；比較兩候選時交叉相乘，比分相同選較大的 x。'
solution_outline: |-
  將下標依 Num_i 排序，同值整批啟用。每啟用一點先令段數加一、平方和加一；若鄰點已啟用便用 DSU 合併並按段長更新平方和。每批完成後，以當前段數記錄 S/x 最佳的 x。最後在線段樹中存各段數的最佳候選，線上解碼 [l,r] 並查區間最佳值。
proof_or_invariant: |-
  處理完值 x 的整批位置後，active 恰等價於 Num_i<=x，DSU 分量恰為所有極大連續標記段，components 與 score 因合併公式分別等於段數及段長平方和。任何两個相鄰不同狀態間 x 不跨過序列值時，標記集合不變而分母 x 增大，故不可能優於該狀態最小的可行 x；枚舉所有出現值已涵蓋最優解。線段樹再從允許段數中精確選最大比值。
common_errors:
  - '同值位置逐個記答案，會產生不存在的中間標記狀態。'
  - '用浮點數比較 S/x，可能破壞平手規則。'
  - '直接計算 a*lastans 而溢位；先分別對 n 取模再相乘。'
complexity:
  time: '預處理 O(n log n)，每次詢問 O(log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO 1：依數值遞增啟用位置，以 DSU 維護連續段數及段長平方和。
      // TODO 2：為每個段數保留 score / x 最大、平手時 x 最大的候選。
      // TODO 3：建區間最佳值結構，線上解碼每組 [l,r] 並回答。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Candidate { long long score = -1; int value = -1; };
  bool better(const Candidate& a, const Candidate& b) {
      if (a.score < 0) return false;
      if (b.score < 0) return true;
      long long left = a.score * b.value;
      long long right = b.score * a.value;
      return left != right ? left > right : a.value > b.value;
  }
  class Dsu {
      vector<int> parent, size;
  public:
      explicit Dsu(int n) : parent(static_cast<size_t>(n)), size(static_cast<size_t>(n), 1) { iota(parent.begin(), parent.end(), 0); }
      int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
      int component_size(int x) { return size[find(x)]; }
      void unite(int a, int b) { a = find(a); b = find(b); if (a == b) return; if (size[a] < size[b]) swap(a, b); parent[b] = a; size[a] += size[b]; }
  };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, query_count; if (!(cin >> n >> query_count)) return 0;
      vector<int> numbers(n), order(n); for (int& x : numbers) cin >> x;
      iota(order.begin(), order.end(), 0);
      sort(order.begin(), order.end(), [&](int a, int b) { return numbers[a] < numbers[b]; });
      Dsu dsu(n); vector<char> active(n, 0); vector<Candidate> best(static_cast<size_t>(n + 1));
      int components = 0; long long score = 0;
      for (int begin = 0; begin < n;) {
          int end = begin; while (end < n && numbers[order[end]] == numbers[order[begin]]) ++end;
          for (int k = begin; k < end; ++k) {
              int p = order[k]; active[p] = 1; ++components; ++score;
              if (p > 0 && active[p - 1]) { long long s = dsu.component_size(p - 1); score += 2 * s; --components; dsu.unite(p, p - 1); }
              if (p + 1 < n && active[p + 1]) { long long a = dsu.component_size(p), b = dsu.component_size(p + 1); score += 2 * a * b; --components; dsu.unite(p, p + 1); }
          }
          Candidate now{score, numbers[order[begin]]}; if (better(now, best[components])) best[components] = now;
          begin = end;
      }
      int base = 1; while (base <= n) base *= 2;
      vector<Candidate> tree(static_cast<size_t>(2 * base));
      for (int i = 1; i <= n; ++i) tree[base + i] = best[i];
      for (int i = base - 1; i > 0; --i) tree[i] = better(tree[2 * i], tree[2 * i + 1]) ? tree[2 * i] : tree[2 * i + 1];
      auto range_best = [&](int l, int r) { Candidate answer; l += base; r += base; while (l <= r) { if (l % 2 == 1) { if (better(tree[l], answer)) answer = tree[l]; ++l; } if (r % 2 == 0) { if (better(tree[r], answer)) answer = tree[r]; --r; } l /= 2; r /= 2; } return answer; };
      unsigned long long last_answer = 0;
      while (query_count--) {
          unsigned long long a, b, x, y; cin >> a >> b >> x >> y;
          unsigned long long decoding_remainder = last_answer % static_cast<unsigned long long>(n);
          int l = static_cast<int>(((a % static_cast<unsigned long long>(n)) * decoding_remainder + x - 1) % static_cast<unsigned long long>(n)) + 1;
          int r = static_cast<int>(((b % static_cast<unsigned long long>(n)) * decoding_remainder + y - 1) % static_cast<unsigned long long>(n)) + 1;
          if (l > r) swap(l, r);
          Candidate answer = range_best(l, r);
          if (answer.score < 0) { cout << "-1 -1\n"; last_answer = 1; }
          else { cout << answer.score << ' ' << answer.value << '\n'; last_answer = static_cast<unsigned long long>(answer.score) * static_cast<unsigned long long>(answer.value); }
          cout << l << ' ' << r << ' ' << decoding_remainder << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P5012
external_platform: 洛谷
external_problem_id: P5012
external_title: '水の數列'
external_relation: original
source_book_pages: [113]
source_pdf_pages: [131]
review_status: verified
---

本卡依官方題面公式、官方樣例與獨立題解描述交叉核對，未以 OCR 猜補公式。
