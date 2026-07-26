---
id: luogu-p3793
volume: upper
source_file: upper-volume
title: 洛谷 P3793 由乃救爺爺：隨機資料的常數時間 RMQ
chapter: 4
section: '4.15'
kind: external-oj
difficulty: 4
topics: [rmq, blocking, sparse-table, random-generator]
prerequisites: [sparse-table]
statement: 輸入 n、m 與種子 s；依題目指定的 32 位元亂數產生器生成 n 個陣列元素及 m 組區間端點。求每次區間最大值，最後輸出所有答案之和。
constraints: ['最大測試可達 n,m=20000000', '陣列與詢問皆由指定產生器依序生成', '答案以 unsigned long long 輸出']
input_format: 一行三個整數 n、m、s；其餘資料由指定亂數函式產生。
output_format: 一個無號 64 位元整數，為所有區間最大值之和。
samples:
  - input: '233 233 233'
    output: '243704637294'
    explanation: 以 233 初始化指定產生器，先取 233 個值，再取 466 個端點值；每對端點正規化後查最大值並累加。
core_knowledge: [分塊前後綴最大值, 塊最大值 Sparse Table, 隨機詢問的期望分析]
judgment: 必須完全照題面的 unsigned 32 位元溢位語意產生資料；不能改用標準亂數器或重設種子。
hints:
  - 跨塊詢問可拆成左塊後綴、若干完整塊、右塊前綴。
  - 預處理每點所在塊的前綴/後綴最大值，再對各塊最大值建 Sparse Table，跨塊即可 O(1)。
  - 同塊時直接掃描至多固定塊長個元素；端點均勻隨機，使同塊詢問總工作量期望為 O(mB²/n)。
solution_outline: 取固定塊長 64。生成陣列後預處理塊內前後綴最大值、塊最大值與其 Sparse Table。跨塊 O(1) 合併三部分，同塊至多掃 64 格；以 unsigned long long 累加。
proof_or_invariant: 前後綴陣列分別正確涵蓋端點到塊界；Sparse Table 回答完整中間塊最大值，三者聯集恰為查詢區間。端點獨立隨機時同塊機率約 B/n，故同塊掃描的期望總成本與 n、m 同階。
common_errors:
  [亂數常數或 unsigned 溢位語意寫錯, 生成陣列後錯誤重設種子, 同塊也套前後綴而納入區間外元素, 答案使用 32 位元]
complexity: { time: '預處理 O(n+(n/B)log(n/B))，查詢期望 O(m)', space: 'O(n+(n/B)log(n/B))' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      unsigned n, m, seed;
      cin >> n >> m >> seed;
      // TODO：照題面產生資料；分塊前後綴 + 塊 Sparse Table。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;
  namespace Generator {
  uint32_t z1, z2, z3, z4, b;
  uint32_t random_value() {
      b = ((z1 << 6U) ^ z1) >> 13U; z1 = ((z1 & 4294967294U) << 18U) ^ b;
      b = ((z2 << 2U) ^ z2) >> 27U; z2 = ((z2 & 4294967288U) << 2U) ^ b;
      b = ((z3 << 13U) ^ z3) >> 21U; z3 = ((z3 & 4294967280U) << 7U) ^ b;
      b = ((z4 << 3U) ^ z4) >> 12U; z4 = ((z4 & 4294967168U) << 13U) ^ b;
      return z1 ^ z2 ^ z3 ^ z4;
  }
  void seed(uint32_t value) {
      z1 = value;
      z2 = (~value) ^ static_cast<uint32_t>(0x233333333ULL);
      z3 = value ^ static_cast<uint32_t>(0x1234598766ULL);
      z4 = (~value) + 51U;
  }
  uint32_t read() {
      const uint32_t high = random_value() & 32767U;
      const uint32_t low = random_value() & 32767U;
      return high * 32768U + low;
  }
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, query_count;
      uint32_t seed_value;
      cin >> n >> query_count >> seed_value;
      Generator::seed(seed_value);
      constexpr int block_size = 64;
      vector<uint32_t> value(static_cast<size_t>(n) + 1U);
      vector<uint32_t> prefix(static_cast<size_t>(n) + 1U), suffix(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) value[static_cast<size_t>(i)] = Generator::read();
      const int block_count = (n + block_size - 1) / block_size;
      vector<uint32_t> block_max(static_cast<size_t>(block_count));
      for (int i = 1; i <= n; ++i) {
          const int block = (i - 1) / block_size;
          prefix[static_cast<size_t>(i)] =
              (i % block_size == 1) ? value[static_cast<size_t>(i)]
                                    : max(prefix[static_cast<size_t>(i - 1)], value[static_cast<size_t>(i)]);
          block_max[static_cast<size_t>(block)] = max(block_max[static_cast<size_t>(block)], value[static_cast<size_t>(i)]);
      }
      for (int i = n; i >= 1; --i)
          suffix[static_cast<size_t>(i)] =
              (i == n || i % block_size == 0) ? value[static_cast<size_t>(i)]
                                              : max(suffix[static_cast<size_t>(i + 1)], value[static_cast<size_t>(i)]);
      vector<int> logarithm(static_cast<size_t>(block_count) + 1U);
      for (int i = 2; i <= block_count; ++i) logarithm[static_cast<size_t>(i)] = logarithm[static_cast<size_t>(i / 2)] + 1;
      const int levels = logarithm[static_cast<size_t>(block_count)] + 1;
      vector<vector<uint32_t>> table(static_cast<size_t>(levels), vector<uint32_t>(static_cast<size_t>(block_count)));
      table[0] = block_max;
      for (int level = 1; level < levels; ++level)
          for (int i = 0; i + (1 << level) <= block_count; ++i)
              table[static_cast<size_t>(level)][static_cast<size_t>(i)] =
                  max(table[static_cast<size_t>(level - 1)][static_cast<size_t>(i)],
                      table[static_cast<size_t>(level - 1)][static_cast<size_t>(i + (1 << (level - 1)))]);
      auto block_query = [&](int left, int right) {
          if (left > right) return uint32_t{0};
          const int level = logarithm[static_cast<size_t>(right - left + 1)];
          return max(table[static_cast<size_t>(level)][static_cast<size_t>(left)],
                     table[static_cast<size_t>(level)][static_cast<size_t>(right - (1 << level) + 1)]);
      };
      unsigned long long answer = 0;
      while (query_count--) {
          int left = static_cast<int>(Generator::read() % static_cast<uint32_t>(n)) + 1;
          int right = static_cast<int>(Generator::read() % static_cast<uint32_t>(n)) + 1;
          if (left > right) swap(left, right);
          const int left_block = (left - 1) / block_size, right_block = (right - 1) / block_size;
          uint32_t result = 0;
          if (left_block == right_block) {
              for (int i = left; i <= right; ++i) result = max(result, value[static_cast<size_t>(i)]);
          } else {
              result = max(suffix[static_cast<size_t>(left)], prefix[static_cast<size_t>(right)]);
              result = max(result, block_query(left_block + 1, right_block - 1));
          }
          answer += result;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3793
external_platform: 洛谷
external_problem_id: P3793
external_title: 由乃救爺爺
external_relation: original
source_book_pages: [363, 376]
source_pdf_pages: [381, 394]
review_status: verified
---

本題把資料生成器也納入規格；演算法與 32 位元溢位語意都必須精確，任何「近似亂數」都會得到完全不同答案。
