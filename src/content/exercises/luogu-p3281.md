---
id: luogu-p3281
volume: upper
source_file: upper-volume
title: 洛谷 P3281 數數
chapter: 5
section: '5.3'
kind: external-oj
difficulty: 5
topics: [digit-dp, substring-sum, aggregate-dp]
prerequisites: [digit-dp, modular-arithmetic]
statement: >-
  給定 B 進位區間 [L,R]。對區間內每個整數的標準 B 進位表示，列出所有連續子字串，
  把每個子字串仍視為 B 進位數並加總。求總和模 20130427。
constraints:
  - 2 <= B <= 100000
  - 1 <= N,M <= 100000
  - 0 <= L <= R，輸入的每一位皆介於 0 與 B-1
input_format: 第一行 B；第二行為 L 的位數 N 與由高至低的 N 位；第三行同樣給 R。
output_format: 輸出區間內所有數的全部連續子字串值之和模 20130427。
samples:
  - input: |-
      10
      3 1 0 3
      3 1 0 3
    output: '120'
    explanation: 官方範例；103 的子字串 1、10、103、0、03、3 合計 120。
  - input: |-
      10
      1 1
      1 2
    output: '3'
    explanation: 自建範例；區間只有 1、2，各自唯一子字串的值合計為 3。
core_knowledge: [附加數位遞推, 數位上界分類, 大整數逐位減一]
judgment: 每個整數使用不含前導零的標準表示；子字串本身可以零開頭，例如 03 的值為 3。
hints:
  - 對字串 x 維護所有後綴的值之和 suffix(x) 與所有子字串值之和 total(x)。
  - 在長度為 len 的 x 後附加 d，有 suffix'=B*suffix+d*len，total'=total+suffix'。
  - 對相同長度的一批前綴同時維護數量、suffix 總和、total 總和；依是否已小於上界分兩類即可線性轉移。
solution_outline: 以聚合狀態計算 F(X)，先累加所有較短正整數，再做與 X 等長的鬆緊數位 DP；將 L 逐位減一後輸出 F(R)-F(L-1)。
proof_or_invariant: >-
  新增一位後，舊子字串全部保留；新出現的恰是所有以新位結尾的後綴，因此兩條遞推正確。
  聚合轉移對一段候選數位使用候選個數與數位和，等價於逐一分支後相加。較短長度與上界等長
  的合法表示互斥且合併為 1..X 的全部整數；等長 DP 中 tight 精確表示前綴是否貼住 X，
  首位從 1 開始則排除前導零。故 F(X) 無重漏，前綴差即為所求區間。
common_errors: [把前導零也當作原數字串的一部分, 只維護整個數值而無法加入新後綴, 用內建整數儲存十萬位端點]
complexity:
  time: O(N+M)
  space: O(N+M)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int base = 0; cin >> base; /* TODO：聚合後綴和數位 DP。 */ }
cpp_solution: |
  #include <array>
  #include <cstddef>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  constexpr long long mod = 20130427;
  struct Aggregate {
      long long count = 0;
      long long suffix = 0;
      long long total = 0;
  };
  long long multiply(long long left, long long right) {
      return left * right % mod;
  }
  void extend_range(const Aggregate& source, long long first, long long last,
                    int position, long long base, Aggregate& target) {
      if (source.count == 0 || first > last) return;
      const long long choices = (last - first + 1) % mod;
      const long long digit_sum = ((first + last) * (last - first + 1) / 2) % mod;
      const long long added_suffix =
          (multiply(multiply(base % mod, source.suffix), choices) +
           multiply(multiply(source.count, position % mod), digit_sum)) % mod;
      target.count = (target.count + multiply(source.count, choices)) % mod;
      target.suffix = (target.suffix + added_suffix) % mod;
      target.total =
          (target.total + multiply(source.total, choices) + added_suffix) % mod;
  }
  vector<int> normalize(vector<int> digit) {
      size_t first = 0;
      while (first + 1 < digit.size() && digit[first] == 0) ++first;
      return vector<int>(digit.begin() + static_cast<ptrdiff_t>(first), digit.end());
  }
  vector<int> minus_one(vector<int> digit, int base) {
      digit = normalize(std::move(digit));
      bool is_zero = true;
      for (int value : digit) is_zero = is_zero && value == 0;
      if (is_zero) return {};
      for (int position = static_cast<int>(digit.size()) - 1; position >= 0; --position) {
          if (digit[static_cast<size_t>(position)] > 0) {
              --digit[static_cast<size_t>(position)];
              break;
          }
          digit[static_cast<size_t>(position)] = base - 1;
      }
      return normalize(std::move(digit));
  }
  long long prefix_sum(vector<int> limit, int base) {
      if (limit.empty()) return 0;
      limit = normalize(std::move(limit));
      const int length = static_cast<int>(limit.size());
      long long answer = 0;
      Aggregate exact{1, 0, 0};
      for (int position = 1; position < length; ++position) {
          Aggregate next;
          extend_range(exact, position == 1 ? 1 : 0, base - 1,
                       position, base, next);
          exact = next;
          answer = (answer + exact.total) % mod;
      }
      array<Aggregate, 2> dp{};
      dp[1].count = 1;
      for (int position = 1; position <= length; ++position) {
          array<Aggregate, 2> next{};
          const int lower = position == 1 ? 1 : 0;
          extend_range(dp[0], lower, base - 1, position, base, next[0]);
          const int upper = limit[static_cast<size_t>(position - 1)];
          extend_range(dp[1], lower, upper - 1, position, base, next[0]);
          extend_range(dp[1], upper, upper, position, base, next[1]);
          dp = next;
      }
      return (answer + dp[0].total + dp[1].total) % mod;
  }
  vector<int> read_number() {
      int length = 0;
      cin >> length;
      vector<int> digit(static_cast<size_t>(length));
      for (int& value : digit) cin >> value;
      return digit;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int base = 0;
      cin >> base;
      vector<int> left = read_number();
      vector<int> right = read_number();
      const long long answer =
          (prefix_sum(right, base) - prefix_sum(minus_one(left, base), base) + mod) % mod;
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3281
external_platform: 洛谷
external_problem_id: P3281
external_title: 数数
external_relation: original
source_book_pages: [334]
source_pdf_pages: [352]
review_status: verified
---

「附加一位只新增若干後綴」把所有子字串的二次枚舉化成三個可按數位批次轉移的統計量。
