---
id: luogu-p2048
volume: upper
source_file: upper-volume
title: 洛谷 P2048 超級鋼琴：前 K 大合法子段和
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 5
topics: ['ST 表', '優先佇列', '前綴和', '第 K 大']
prerequisites: ['prefix-sum', 'sparse-table', 'priority-queue']
statement: |-
  有 n 個音符，第 i 個音符的美妙度為 a_i。超級和弦是一段長度介於 L 與 R 的連續音符，其美妙度為段和。從所有端點不同的超級和弦中選 k 個，使美妙度總和最大。
constraints:
  - '1 <= n, k <= 500000'
  - '-1000 <= a_i <= 1000'
  - '1 <= L <= R <= n，且保證至少有 k 個合法和弦'
input_format: '第一行輸入 n、k、L、R；接著 n 行各輸入一個 a_i。'
output_format: '輸出選取 k 個不同和弦可得的最大總美妙度。'
samples:
  - input: |
      4 3 2 3
      3
      2
      -6
      8
    output: |
      11
    explanation: '選取 [1,2]、[3,4]、[2,4]，段和分別為 5、2、4，總和 11。'
core_knowledge:
  - '固定左端點後，子段和大小只取決於合法右端點的前綴和。'
  - 'RMQ 找候選區間最大值；取出後以最大值位置分裂，可枚舉每組候選的降序序列。'
judgment: '需要所有 O(nR) 子段中的前 k 大值，應以堆合併 n 組隱式排序候選，而非列舉全部。'
hints:
  - '令 prefix[j] 為前 j 項和。固定左端 i 時，合法右端 j 位於 [i+L-1,min(n,i+R-1)]，段和是 prefix[j]-prefix[i-1]。'
  - '用 ST 表在任意前綴和區間找最大值位置；先把每個左端點的最佳候選放入大根堆。'
  - '堆頂使用位置 p 後，把其右端點候選範圍分成 [l,p-1]、[p+1,r]，各自的最大值重新入堆。重複 k 次。'
solution_outline: |-
  建前綴和與「區間最大前綴和位置」ST 表。對每個可行左端點建立一個候選範圍並將範圍最佳值入堆。每次取最大值加入答案，再以其最佳位置分裂範圍並放回兩個非空子範圍。
proof_or_invariant: |-
  對固定左端點，每個合法右端點唯一對應一個不同和弦。堆中每個節點代表一個尚未取用的右端點集合，並保存該集合最大值；分裂後兩子集合互斥、聯集恰為原集合扣除已取位置。因此堆始終涵蓋所有未取和弦且堆頂為全域最大者，連取 k 次即得到前 k 大段和。
common_errors:
  - '使用 int 累積 k 個段和而溢位。'
  - '右端點上界忘記截在 n。'
  - '分裂時重複放入已取出的最大位置。'
complexity:
  time: 'O((n+k) log n)'
  space: 'O(n log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：前綴和、最大值位置 ST 表、大根堆與候選分裂。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Candidate {
      long long value;
      int start;
      int left;
      int right;
      int best;
      bool operator<(const Candidate& other) const { return value < other.value; }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, chord_count, minimum_length, maximum_length;
      if (!(cin >> n >> chord_count >> minimum_length >> maximum_length)) { return 0; }
      vector<long long> prefix(static_cast<size_t>(n + 1), 0);
      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          prefix[static_cast<size_t>(i)] = prefix[static_cast<size_t>(i - 1)] + value;
      }
      vector<int> logs(static_cast<size_t>(n + 1), 0);
      for (int i = 2; i <= n; ++i) {
          logs[static_cast<size_t>(i)] = logs[static_cast<size_t>(i / 2)] + 1;
      }
      const int levels = logs[static_cast<size_t>(n)] + 1;
      vector<vector<int>> st(static_cast<size_t>(levels),
                             vector<int>(static_cast<size_t>(n + 1), 0));
      for (int i = 1; i <= n; ++i) { st[0][static_cast<size_t>(i)] = i; }
      const auto better = [&prefix](int first, int second) {
          return prefix[static_cast<size_t>(first)] >= prefix[static_cast<size_t>(second)]
                     ? first : second;
      };
      for (int level = 1; level < levels; ++level) {
          const int span = 1 << level;
          const int half = span >> 1;
          for (int i = 1; i + span - 1 <= n; ++i) {
              st[static_cast<size_t>(level)][static_cast<size_t>(i)] =
                  better(st[static_cast<size_t>(level - 1)][static_cast<size_t>(i)],
                         st[static_cast<size_t>(level - 1)][static_cast<size_t>(i + half)]);
          }
      }
      const auto range_best = [&st, &logs, &better](int left, int right) {
          const int level = logs[static_cast<size_t>(right - left + 1)];
          const int span = 1 << level;
          return better(st[static_cast<size_t>(level)][static_cast<size_t>(left)],
                        st[static_cast<size_t>(level)]
                          [static_cast<size_t>(right - span + 1)]);
      };
      priority_queue<Candidate> heap;
      const auto push_range = [&heap, &range_best, &prefix](int start, int left, int right) {
          if (left > right) { return; }
          const int best = range_best(left, right);
          heap.push({prefix[static_cast<size_t>(best)] -
                         prefix[static_cast<size_t>(start - 1)],
                     start, left, right, best});
      };
      for (int start = 1; start + minimum_length - 1 <= n; ++start) {
          push_range(start, start + minimum_length - 1,
                     min(n, start + maximum_length - 1));
      }
      long long answer = 0;
      for (int picked = 0; picked < chord_count; ++picked) {
          const Candidate current = heap.top();
          heap.pop();
          answer += current.value;
          push_range(current.start, current.left, current.best - 1);
          push_range(current.start, current.best + 1, current.right);
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2048
external_platform: 洛谷
external_problem_id: P2048
external_title: '[NOI2010] 超級鋼琴'
external_relation: original
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

這是「用 RMQ 隱式產生排序序列，再由堆取全域前 K 大」的代表題。
