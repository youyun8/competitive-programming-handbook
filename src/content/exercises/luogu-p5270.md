---
id: luogu-p5270
volume: lower
source_file: lower-volume
title: 洛谷 P5270 無論怎樣神樹大人都會刪庫跑路
chapter: 9
section: '9.1'
kind: external-oj
difficulty: 5
topics: [multiset-hash, sliding-window, periodic-sequence]
prerequisites: [prefix-sum, deque, cycle-counting]
statement: >-
  給定長度 T 的整數多重集合 S、n 個小字串與長度 m 的索引序列 R。空字串 X 進行 Q 次操作，
  第 i 次把 a[R[(i-1) mod m]] 接到尾端；每次操作後，判斷 X 是否有一個長度 T 的後綴，
  經任意排列後可等於 S。求判定成立的操作次數。
constraints:
  - 'n, T, m <= 100000'
  - 'Q <= 10^9'
  - 所有小字串總長不超過 100000
  - 字元為 0 到 100000 的整數，且 1 <= R_i <= n
input_format: >-
  第一行 n T Q；下一行 T 個整數為 S；接著 n 行各先給 len 再給小字串；
  然後給 m，最後一行給 m 個索引 R。
output_format: 輸出前 Q 次操作中，長度 T 尾端多重集合等於 S 的次數。
samples:
  - input: "2 3 5\n1 2 1\n2 1 2\n1 1\n2\n1 2\n"
    output: '4'
    explanation: 第一次總長不足 3；其後四次尾端依序為 121、112、121、112，字元計數都與 S 相同。
core_knowledge:
  - 可交換順序的等價條件是每種字元出現次數相同
  - 加法多重集合指紋支援區間 O(1) 加減
  - 尾窗填滿後，週期區塊序列使判定結果以 m 次操作為週期
judgment: 只在每個完整「追加小字串」操作後判斷；長度不足 T 時不計。
hints:
  - 為每個整數配置兩個固定 64 位權值，多重集合指紋取權值總和；每個小字串預存前綴和。
  - 用 deque 保存目前最後 T 個字元由哪些小字串區間構成；追加整塊時只需加入一個區間並從左端按長度刪除。
  - 一旦窗口填滿，往後相隔 m 次操作的長度 T 尾端完全相同；模擬一個操作週期即可用商與餘數計數。
solution_outline: >-
  以兩組 SplitMix64 權值建立 S 與每個小字串的加法前綴指紋。deque 以 `(string_id,l,r)` 表示尾窗，
  每次追加與刪除整段或部分段，O(1) 取得指紋變化。模擬到窗口首次填滿，再模擬接下來一個完整 R
  週期並保存每步結果；剩餘 Q 次以週期命中數及前綴命中數計算。
proof_or_invariant: >-
  deque 不變量是其片段依序串接恰為 X 的最長 min(T,|X|) 後綴，指紋為片段指紋和；追加後從左刪去
  超過 T 的長度維持不變量。窗口填滿後，操作 i 與 i+m 的結尾在無限週期區塊串中相差一個完整週期，
  其最後 T 字元相同，因此判定序列週期為 m。兩個獨立 64 位加法指紋同時碰撞的機率可忽略。
common_errors:
  - 逐字模擬 R 中反覆出現的長字串而超時
  - 只比較字串順序而非字元多重集合
  - 從窗口尚未填滿時就直接套用週期計數
complexity:
  time: O(T + 所有小字串總長 + m)
  space: O(T + 所有小字串總長 + m)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建立雙多重集合指紋，以片段 deque 維護尾窗，再計算操作週期。
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <deque>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;

  using Fingerprint = pair<uint64_t, uint64_t>;

  static uint64_t splitmix64(uint64_t value) {
      value += 0x9e3779b97f4a7c15ULL;
      value = (value ^ (value >> 30U)) * 0xbf58476d1ce4e5b9ULL;
      value = (value ^ (value >> 27U)) * 0x94d049bb133111ebULL;
      return value ^ (value >> 31U);
  }

  static Fingerprint weight(int value) {
      const uint64_t x = static_cast<uint64_t>(value);
      return {splitmix64(x + 17U), splitmix64(x + 1000003U)};
  }

  struct Piece {
      int string_id;
      int left;
      int right;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n = 0;
      int target_length = 0;
      long long operation_count = 0;
      cin >> n >> target_length >> operation_count;
      Fingerprint target{0, 0};
      for (int i = 0; i < target_length; ++i) {
          int value = 0;
          cin >> value;
          const Fingerprint current = weight(value);
          target.first += current.first;
          target.second += current.second;
      }

      vector<vector<Fingerprint>> prefix(static_cast<size_t>(n));
      vector<int> length(static_cast<size_t>(n), 0);
      for (int id = 0; id < n; ++id) {
          cin >> length[static_cast<size_t>(id)];
          prefix[static_cast<size_t>(id)].resize(
              static_cast<size_t>(length[static_cast<size_t>(id)] + 1), {0, 0});
          for (int i = 0; i < length[static_cast<size_t>(id)]; ++i) {
              int value = 0;
              cin >> value;
              const Fingerprint current = weight(value);
              prefix[static_cast<size_t>(id)][static_cast<size_t>(i + 1)] = {
                  prefix[static_cast<size_t>(id)][static_cast<size_t>(i)].first + current.first,
                  prefix[static_cast<size_t>(id)][static_cast<size_t>(i)].second + current.second};
          }
      }
      int period = 0;
      cin >> period;
      vector<int> order(static_cast<size_t>(period));
      for (int& id : order) {
          cin >> id;
          --id;
      }

      auto range_hash = [&](int id, int left, int right) -> Fingerprint {
          const auto& values = prefix[static_cast<size_t>(id)];
          return {values[static_cast<size_t>(right)].first -
                      values[static_cast<size_t>(left)].first,
                  values[static_cast<size_t>(right)].second -
                      values[static_cast<size_t>(left)].second};
      };

      deque<Piece> window;
      Fingerprint current{0, 0};
      int window_length = 0;
      auto append = [&](int id) {
          const int block_length = length[static_cast<size_t>(id)];
          if (block_length >= target_length) {
              window.clear();
              const int left = block_length - target_length;
              window.push_back({id, left, block_length});
              current = range_hash(id, left, block_length);
              window_length = target_length;
              return;
          }
          window.push_back({id, 0, block_length});
          const Fingerprint added = range_hash(id, 0, block_length);
          current.first += added.first;
          current.second += added.second;
          window_length += block_length;
          int remove = window_length - target_length;
          while (remove > 0) {
              Piece& front = window.front();
              const int piece_length = front.right - front.left;
              const int take = remove < piece_length ? remove : piece_length;
              const Fingerprint erased =
                  range_hash(front.string_id, front.left, front.left + take);
              current.first -= erased.first;
              current.second -= erased.second;
              front.left += take;
              window_length -= take;
              remove -= take;
              if (front.left == front.right) { window.pop_front(); }
          }
      };
      auto matches = [&]() {
          return window_length == target_length && current == target;
      };

      long long answer = 0;
      long long processed = 0;
      while (processed < operation_count && window_length < target_length) {
          append(order[static_cast<size_t>(processed % period)]);
          ++processed;
          if (matches()) { ++answer; }
      }
      if (processed == operation_count) {
          cout << answer << '\n';
          return 0;
      }

      vector<int> cycle_hit(static_cast<size_t>(period), 0);
      int cycle_total = 0;
      for (int step = 0; step < period; ++step) {
          append(order[static_cast<size_t>((processed + step) % period)]);
          cycle_hit[static_cast<size_t>(step)] = matches() ? 1 : 0;
          cycle_total += cycle_hit[static_cast<size_t>(step)];
      }
      const long long remaining = operation_count - processed;
      answer += remaining / period * cycle_total;
      for (int step = 0; step < remaining % period; ++step) {
          answer += cycle_hit[static_cast<size_t>(step)];
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P5270
external_platform: 洛谷
external_problem_id: P5270
external_title: 無論怎樣神樹大人都會刪庫跑路
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

字元數可能極大，但操作邊界的尾窗只需由少量小字串片段表示；填滿後再利用區塊序列週期一次計數。
