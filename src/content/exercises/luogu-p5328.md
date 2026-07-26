---
id: luogu-p5328
volume: lower
source_file: lower-volume
title: 洛谷 P5328 浙江省選：整點直線層次
chapter: 8
section: '8.5'
kind: external-oj
difficulty: 5
topics: ['直線上包絡', '凸包分層', '整數分數', '區間覆蓋']
prerequisites: ['凸包', '分數上下取整', '區間最小值']
statement: 第 i 名選手在非負整數 x 下的表現為 a_i x+b_i，排名是表現嚴格較高的人數加一。給定省隊名額 m，對每名選手求所有 x>=0 中的最佳排名；若最佳排名大於 m 則輸出 -1。
constraints:
  - '1 <= n <= 100000'
  - '1 <= m <= n，且 m <= 20'
  - '1 <= a_i <= 10^9'
  - '1 <= b_i <= 10^18'
  - 選手屬性二元組兩兩不同
input_format: 第一行 n、m；接著 n 行 a_i、b_i。
output_format: 輸出 n 個整數；可進省隊者輸出最佳排名，否則輸出 -1。
samples:
  - input: |
      3 1
      1 5
      5 1
      2 2
    output: |
      1 1 -1
    explanation: x=1 時前兩人同為 6 分並列第一；第三人無論選哪個非負整數 x，前方至少有一人。
core_knowledge:
  - 尚未處理直線的整點上包絡，列出下一層可能取得最佳排名的所有直線
  - 已剝除直線 g 嚴格高於目前包絡 f 的整數 x 集合必為一個區間
  - 候選直線的真實最佳排名等於其包絡有效區間上「已剝除直線在上方數量」的最小值加一
judgment: 依序判斷排名 k=1..m。每輪依斜率建立尚未定案直線的上包絡，並保留只在單一整點並列最高的直線；對每條已定案線，以和目前凸包的左右切線求出 g>f 的整數區間，差分累加覆蓋數。候選有效區間若有覆蓋數小於 k 的整點，其最佳排名就是 k；只有這些已定案候選會被刪除。
hints:
  - 兩線交替點不可用浮點數；新線開始不低於舊線的最小整數是 ceil((b_old-b_new)/(a_new-a_old))。
  - 對已剝除線 g，斜率小於 g 的包絡線給下界、斜率大於 g 的包絡線給上界；凸包性使相交分數分別單峰，可二分找最緊限制。
  - 把所有「舊線嚴格在包絡上方」區間做座標壓縮差分，再以 RMQ 查每條候選有效區間的最小覆蓋數。
solution_outline: 維護尚未定案的 alive 直線。第 k 輪按斜率與截距排序，以精確交點取整建立 x>=0 的整點上包絡及每線有效閉區間。對 removed 中每條線，分別在較小、較大斜率凸包部分找最大／最小交點，得到其嚴格高於整體包絡的整數區間。將區間端點和候選端點壓縮，差分得到每個基本區間覆蓋數並建迭代 RMQ；若候選區間最小覆蓋數小於 k，就把答案定為 k 並移入 removed。未通過者即使位於包絡上也保留到下一輪。
proof_or_invariant: 第 k 輪開始時 removed 恰為最佳排名小於 k 的直線。alive 上包絡外的線在任何 x 都被某條 alive 線嚴格壓住，故不可能取得排名 k；候選有效區間內則沒有 alive 線嚴格較高，排名只等於 removed 覆蓋數加一。對固定舊線 g，g-f 是凹分段線性函數，所以嚴格為正處是單一區間；兩側切線給出其精確整數端點。因此覆蓋最小值小於 k 恰好等價於最佳排名為 k。只刪除這批已定案候選後，不變量成立；第 m 輪後未定案者不能進前 m。
complexity:
  time: O(m n log n)
  space: O(n)
common_errors:
  - 把 x 當實數，刪除只在單一整點並列最高的直線
  - 排名比較使用大於等於；題目只計嚴格較高者
  - 負分數的 floor/ceil 直接用 C++ 截零除法
  - 最後一段無界區間使用 LLONG_MAX 後再加一溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：逐層建立整點上包絡，統計已剝除直線在候選區間上的最小覆蓋。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  #include <boost/multiprecision/cpp_int.hpp>
  using namespace std;
  using boost::multiprecision::int128_t;

  struct Line {
      long long slope;
      long long intercept;
      int id;
  };
  struct Rational {
      long long numerator;
      long long denominator;
  };
  static bool less_rational(const Rational& a, const Rational& b) {
      return int128_t(a.numerator) * b.denominator <
             int128_t(b.numerator) * a.denominator;
  }
  static long long floor_div(long long numerator, long long denominator) {
      if (numerator >= 0) { return numerator / denominator; }
      return -((-numerator + denominator - 1) / denominator);
  }
  static long long ceil_div(long long numerator, long long denominator) {
      return -floor_div(-numerator, denominator);
  }
  static int128_t value_at(const Line& line, long long x) {
      return int128_t(line.slope) * x + line.intercept;
  }

  class RangeMinimum {
    public:
      explicit RangeMinimum(const vector<int>& values) {
          size_ = 1;
          while (size_ < static_cast<int>(values.size())) { size_ *= 2; }
          tree_.assign(static_cast<size_t>(size_ * 2),
                       numeric_limits<int>::max());
          for (size_t i = 0; i < values.size(); ++i) {
              tree_[static_cast<size_t>(size_) + i] = values[i];
          }
          for (int node = size_ - 1; node > 0; --node) {
              tree_[static_cast<size_t>(node)] =
                  min(tree_[static_cast<size_t>(node * 2)],
                      tree_[static_cast<size_t>(node * 2 + 1)]);
          }
      }
      int query(int left, int right) const {
          int result = numeric_limits<int>::max();
          left += size_;
          right += size_;
          while (left <= right) {
              if ((left & 1) != 0) {
                  result = min(result, tree_[static_cast<size_t>(left++)]);
              }
              if ((right & 1) == 0) {
                  result = min(result, tree_[static_cast<size_t>(right--)]);
              }
              left /= 2;
              right /= 2;
          }
          return result;
      }

    private:
      int size_ = 0;
      vector<int> tree_;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int team_size;
      cin >> n >> team_size;
      vector<Line> lines(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) {
          cin >> lines[static_cast<size_t>(i)].slope >>
              lines[static_cast<size_t>(i)].intercept;
          lines[static_cast<size_t>(i)].id = i;
      }
      constexpr long long infinity = 4000000000000000000LL;
      vector<int> alive(static_cast<size_t>(n));
      iota(alive.begin(), alive.end(), 0);
      vector<int> removed;
      vector<int> answer(static_cast<size_t>(n), -1);

      for (int layer = 1; layer <= team_size && !alive.empty(); ++layer) {
          sort(alive.begin(), alive.end(), [&](int first, int second) {
              const Line& a = lines[static_cast<size_t>(first)];
              const Line& b = lines[static_cast<size_t>(second)];
              if (a.slope != b.slope) { return a.slope < b.slope; }
              return a.intercept > b.intercept;
          });
          vector<int> slope_best;
          for (int id : alive) {
              if (slope_best.empty() ||
                  lines[static_cast<size_t>(slope_best.back())].slope !=
                      lines[static_cast<size_t>(id)].slope) {
                  slope_best.push_back(id);
              }
          }
          vector<int> hull;
          vector<long long> start;
          for (int id : slope_best) {
              while (!hull.empty()) {
                  const Line& old_line =
                      lines[static_cast<size_t>(hull.back())];
                  const Line& new_line = lines[static_cast<size_t>(id)];
                  const long long raw_start = ceil_div(
                      old_line.intercept - new_line.intercept,
                      new_line.slope - old_line.slope);
                  const long long candidate_start = max(0LL, raw_start);
                  bool remove_old = candidate_start < start.back();
                  if (!remove_old && candidate_start == start.back() &&
                      value_at(new_line, candidate_start) >
                          value_at(old_line, candidate_start)) {
                      remove_old = true;
                  }
                  if (!remove_old) { break; }
                  hull.pop_back();
                  start.pop_back();
              }
              long long begin = 0;
              if (!hull.empty()) {
                  const Line& old_line =
                      lines[static_cast<size_t>(hull.back())];
                  const Line& new_line = lines[static_cast<size_t>(id)];
                  begin = max(
                      0LL,
                      ceil_div(old_line.intercept - new_line.intercept,
                               new_line.slope - old_line.slope));
              }
              hull.push_back(id);
              start.push_back(begin);
          }

          vector<pair<long long, long long>> candidate_ranges;
          candidate_ranges.reserve(hull.size());
          for (size_t i = 0; i < hull.size(); ++i) {
              long long right = infinity;
              if (i + 1U < hull.size()) {
                  right = start[i + 1U];
                  if (value_at(lines[static_cast<size_t>(hull[i])], right) <
                      value_at(lines[static_cast<size_t>(hull[i + 1U])],
                               right)) {
                      --right;
                  }
              }
              candidate_ranges.push_back({start[i], right});
          }

          vector<pair<long long, long long>> above_ranges;
          above_ranges.reserve(removed.size());
          for (int removed_id : removed) {
              const Line& line =
                  lines[static_cast<size_t>(removed_id)];
              const auto same_slope = lower_bound(
                  hull.begin(), hull.end(), line.slope,
                  [&](int id, long long slope) {
                      return lines[static_cast<size_t>(id)].slope < slope;
                  });
              const int split = static_cast<int>(
                  distance(hull.begin(), same_slope));
              bool impossible = false;
              if (split < static_cast<int>(hull.size()) &&
                  lines[static_cast<size_t>(hull[static_cast<size_t>(split)])]
                          .slope == line.slope &&
                  lines[static_cast<size_t>(hull[static_cast<size_t>(split)])]
                          .intercept >= line.intercept) {
                  impossible = true;
              }
              if (impossible) { continue; }
              long long left = 0;
              if (split > 0) {
                  int low = 0;
                  int high = split - 1;
                  const auto ratio = [&](int index) {
                      const Line& other =
                          lines[static_cast<size_t>(
                              hull[static_cast<size_t>(index)])];
                      return Rational{
                          other.intercept - line.intercept,
                          line.slope - other.slope};
                  };
                  while (low < high) {
                      const int middle = (low + high) / 2;
                      if (less_rational(ratio(middle),
                                        ratio(middle + 1))) {
                          low = middle + 1;
                      } else {
                          high = middle;
                      }
                  }
                  const Rational bound = ratio(low);
                  left = max(0LL, floor_div(bound.numerator,
                                            bound.denominator) +
                                      1);
              }
              long long right = infinity;
              int upper_begin = split;
              if (upper_begin < static_cast<int>(hull.size()) &&
                  lines[static_cast<size_t>(
                      hull[static_cast<size_t>(upper_begin)])]
                          .slope == line.slope) {
                  ++upper_begin;
              }
              if (upper_begin < static_cast<int>(hull.size())) {
                  int low = upper_begin;
                  int high = static_cast<int>(hull.size()) - 1;
                  const auto ratio = [&](int index) {
                      const Line& other =
                          lines[static_cast<size_t>(
                              hull[static_cast<size_t>(index)])];
                      return Rational{
                          line.intercept - other.intercept,
                          other.slope - line.slope};
                  };
                  while (low < high) {
                      const int middle = (low + high) / 2;
                      if (less_rational(ratio(middle + 1),
                                        ratio(middle))) {
                          low = middle + 1;
                      } else {
                          high = middle;
                      }
                  }
                  const Rational bound = ratio(low);
                  right = min(infinity,
                              ceil_div(bound.numerator,
                                       bound.denominator) -
                                  1);
              }
              if (left <= right) {
                  above_ranges.push_back({left, right});
              }
          }

          vector<long long> coordinates;
          coordinates.reserve(
              (above_ranges.size() + candidate_ranges.size()) * 2U + 1U);
          coordinates.push_back(0);
          for (const auto& [left, right] : above_ranges) {
              coordinates.push_back(left);
              coordinates.push_back(right + 1);
          }
          for (const auto& [left, right] : candidate_ranges) {
              coordinates.push_back(left);
              coordinates.push_back(right + 1);
          }
          sort(coordinates.begin(), coordinates.end());
          coordinates.erase(
              unique(coordinates.begin(), coordinates.end()),
              coordinates.end());
          vector<int> difference(coordinates.size() + 1U, 0);
          for (const auto& [left, right] : above_ranges) {
              const int begin = static_cast<int>(
                  lower_bound(coordinates.begin(), coordinates.end(), left) -
                  coordinates.begin());
              const int end = static_cast<int>(
                  lower_bound(coordinates.begin(), coordinates.end(),
                              right + 1) -
                  coordinates.begin());
              ++difference[static_cast<size_t>(begin)];
              --difference[static_cast<size_t>(end)];
          }
          vector<int> coverage(coordinates.size(), 0);
          int current = 0;
          for (size_t i = 0; i < coordinates.size(); ++i) {
              current += difference[i];
              coverage[i] = current;
          }
          RangeMinimum range_minimum(coverage);
          for (size_t i = 0; i < hull.size(); ++i) {
              const auto [left, right] = candidate_ranges[i];
              const int begin = static_cast<int>(
                  lower_bound(coordinates.begin(), coordinates.end(), left) -
                  coordinates.begin());
              const int end = static_cast<int>(
                                  lower_bound(coordinates.begin(),
                                              coordinates.end(), right + 1) -
                                  coordinates.begin()) -
                              1;
              const int best_rank = range_minimum.query(begin, end) + 1;
              if (best_rank <= layer) {
                  answer[static_cast<size_t>(
                      lines[static_cast<size_t>(hull[i])].id)] = layer;
              }
          }

          vector<unsigned char> on_hull(static_cast<size_t>(n), 0);
          for (int id : hull) {
              if (answer[static_cast<size_t>(
                      lines[static_cast<size_t>(id)].id)] == layer) {
                  on_hull[static_cast<size_t>(id)] = 1;
                  removed.push_back(id);
              }
          }
          vector<int> next_alive;
          next_alive.reserve(alive.size() - hull.size());
          for (int id : alive) {
              if (on_hull[static_cast<size_t>(id)] == 0) {
                  next_alive.push_back(id);
              }
          }
          alive.swap(next_alive);
      }
      for (int i = 0; i < n; ++i) {
          if (i != 0) { cout << ' '; }
          cout << answer[static_cast<size_t>(i)];
      }
      cout << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5328
external_platform: 洛谷
external_problem_id: P5328
external_title: '[ZJOI2019] 浙江省選'
external_relation: original
source_book_pages: [552]
source_pdf_pages: [182]
review_status: verified
---

題面、限制與樣例依 UOJ 471、ZJOI 2019 官方存檔及洛谷交叉核實；整點包絡分層與舊線覆蓋判準另和多份獨立題解核對，本站程式全程使用精確整數分數。
