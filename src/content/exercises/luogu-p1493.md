---
id: luogu-p1493
volume: upper
source_file: upper-volume
title: 洛谷 P1493 分梨子
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 5
topics: ['枚舉最小值', '離線掃描', 'Fenwick tree']
prerequisites: ['座標壓縮', '二維計數']
statement: 每顆梨有大小 A_i、甜度 B_i。若選中集合的兩屬性最小值為 A0、B0，且每顆皆滿足 C1(A_i-A0)+C2(B_i-B0)≤C3，該集合合法。求最多可選幾顆。
constraints: ['1 ≤ N ≤ 2000', 'C1,C2 ≤ 2000', 'C3 ≤ 10^9', 'A_i、B_i 為整數']
input_format: 第一行 N；第二行 C1、C2、C3；之後 N 行 A_i、B_i。
output_format: 輸出合法集合最大大小。
samples:
  - input: |
      3
      2 3 6
      3 2
      1 1
      2 1
    output: |
      2
    explanation: 可選第 1、3 顆或第 2、3 顆；三顆同選會有梨超出相對最小屬性的限制。
core_knowledge: ['枚舉 A0、B0', '把限制改寫成加權分數上界', 'Fenwick 維護 B 下界計數']
judgment: 固定 A0、B0 後，需數 A≥A0、B≥B0 且 C1A+C2B≤C3+C1A0+C2B0 的點。
hints:
  - '把不等式展開，把含梨 i 的項移到左側。'
  - 'A0、B0 必可取自某些梨的屬性；枚舉 A0，令 B0 遞增掃描。'
  - '按 score=C1A+C2B 排序加入達門檻點，以 Fenwick 查目前 B≥B0 且 A≥A0 的數量。'
solution_outline: 壓縮所有 B。枚舉每個梨的 A 作 A0；把 A≥A0 的梨依 score 排序。再依 B0 遞增，加入 score 不超過對應上界的梨至 Fenwick，查詢 B≥B0 的已加入數量並更新答案。
proof_or_invariant: 任一最優集合的實際 A0、B0 都是輸入屬性，故枚舉涵蓋它。固定兩最小值時，三個條件恰等價於所計數三側區域，區域內全部梨一起選仍合法。Fenwick 在每個 B0 時保存且僅保存分數達標、A 達標的梨，後綴查詢再施加 B 達標，故計數精確。
common_errors:
  ['只檢查 A、B 的最大最小差，漏掉加權和', '乘積使用 32 位元', 'Fenwick 查成 B≤B0', '認為 A0、B0 必須來自同一顆梨']
complexity: { time: 'O(N² log N)', space: 'O(N)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; long long c1, c2, c3; cin >> n >> c1 >> c2 >> c3;
      vector<pair<long long,long long>> pears(static_cast<size_t>(n));
      for (auto& pear : pears) cin >> pear.first >> pear.second;
      // TODO：枚舉 A0，按 B0 掃描分數門檻並用 Fenwick 做後綴計數。
      cout << 0 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Pear { long long a, b, score; };
  struct Fenwick {
      vector<int> tree;
      explicit Fenwick(size_t n) : tree(n + 1U) {}
      void add(size_t p) { for (++p; p < tree.size(); p += p & (~p + 1U)) ++tree[p]; }
      int sum(size_t p) const { int result = 0; for (; p > 0; p -= p & (~p + 1U)) result += tree[p]; return result; }
  };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; long long c1, c2, c3; cin >> n >> c1 >> c2 >> c3;
      vector<Pear> pears(static_cast<size_t>(n));
      vector<long long> b_values;
      for (auto& pear : pears) { cin >> pear.a >> pear.b; pear.score = c1 * pear.a + c2 * pear.b; b_values.push_back(pear.b); }
      sort(b_values.begin(), b_values.end()); b_values.erase(unique(b_values.begin(), b_values.end()), b_values.end());
      int answer = 0;
      for (const Pear& base : pears) {
          vector<const Pear*> eligible;
          for (const Pear& pear : pears) if (pear.a >= base.a) eligible.push_back(&pear);
          sort(eligible.begin(), eligible.end(), [](const Pear* x, const Pear* y) { return x->score < y->score; });
          Fenwick fenwick(b_values.size()); size_t added = 0;
          for (const long long b0 : b_values) {
              const long long limit = c3 + c1 * base.a + c2 * b0;
              while (added < eligible.size() && eligible[added]->score <= limit) {
                  const size_t index = static_cast<size_t>(lower_bound(b_values.begin(), b_values.end(), eligible[added]->b) - b_values.begin());
                  fenwick.add(index); ++added;
              }
              const size_t first = static_cast<size_t>(lower_bound(b_values.begin(), b_values.end(), b0) - b_values.begin());
              answer = max(answer, static_cast<int>(added) - fenwick.sum(first));
          }
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1493
external_platform: 洛谷
external_problem_id: P1493
external_title: 分梨子
external_relation: original
source_book_pages: [49]
source_pdf_pages: [67]
review_status: verified
---

展開相對最小值不等式後，問題成為可離線掃描的三側點計數。
