---
id: luogu-p4619
volume: lower
source_file: lower-volume
title: 洛谷 P4619 舊試題
chapter: 6
section: '6.16'
kind: external-oj
difficulty: 5
topics:
  - 莫比烏斯反演
  - 約數函數
  - 三元環計數
  - LCM 圖
prerequisites:
  - mobius-inversion
  - multiplicative-function
statement: >-
  設 d(x) 為 x 的正約數個數。每組給定 A、B、C，求
  sum_{i=1}^A sum_{j=1}^B sum_{k=1}^C d(ijk)，答案模 1000000007。
constraints:
  - 1 <= A,B,C <= 100000
  - 輸入包含多組測試資料
input_format: >-
  第一行為測試組數 T；接著 T 行各有三個整數 A、B、C。
output_format: >-
  每組輸出一行答案模 1000000007。
samples:
  - input: |
      5
      10 10 10
      100 100 100
      1000 1000 1000
      10000 10000 10000
      100000 100000 100000
    output: |
      11536
      51103588
      165949340
      19234764
      176764584
    explanation: >-
      這是官方完整樣例；第一組可用三重枚舉並逐數分解約數個數，驗得 11536。
hints:
  - >-
    先證 d(ijk)=sum_{x|i,y|j,z|k}[gcd(x,y)=gcd(x,z)=gcd(y,z)=1]。
  - >-
    對三個互質條件分別展開莫比烏斯函數，得到 mu(u)mu(v)mu(w) 與三條邊
    lcm(u,v)、lcm(u,w)、lcm(v,w) 的乘積。
  - >-
    只保留 mu 非零的點，兩點 LCM 不超過上界時連邊；三個變數互異的貢獻就是圖中三元環，
    以度數定向後 O(E sqrt(E)) 枚舉。
core_knowledge:
  - 三重莫比烏斯反演
  - LCM 圖三元環
  - 約數個數前綴和
judgment: >-
  直接三重枚舉或只做一層反演都無法通過 10^5；必須辨認反演後的三條兩兩 LCM 關係。
solution_outline: >-
  預篩 mu 與 D(n)=sum_{i<=n}d(i)。令 F(x,N)=D(floor(N/x))，反演式為
  sum mu(u)mu(v)mu(w)F(lcm(u,w),A)F(lcm(u,v),B)F(lcm(v,w),C)。
  分別計算 u=v=w、恰有兩者相等與三者互異；互異部分在 LCM 圖中以度數定向枚舉每個三元環一次。
proof_or_invariant: >-
  固定 x|i、y|j、z|k 時，三者兩兩互質的質因數分配方式與 ijk 的每個約數一一對應，
  得到第一個恆等式。三次使用 [gcd=1]=sum_{d|gcd}mu(d) 並交換求和後，
  x、y、z 各自只須為相應 LCM 的倍數，其和即 F。相等分類互斥且完備；
  度數定向使每個互異三角形僅由最高序點枚舉一次。
common_errors:
  - 三條 LCM 邊與 A、B、C 的對應順序寫錯
  - 漏掉兩點或三點相等的退化三元環
  - 無向圖直接從每個頂點枚舉而重複計數六次
complexity:
  time: O(V log V + E sqrt(E)) 每組
  space: O(V + E)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：完成三重反演、LCM 圖建邊與度數定向三元環計數。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static constexpr long long kMod = 1000000007;
  static constexpr int kLimit = 100000;

  struct Edge {
      int u;
      int v;
      int lcm;
  };

  static vector<int> mobius_sieve() {
      vector<int> mu(static_cast<size_t>(kLimit) + 1, 0);
      vector<int> primes;
      vector<char> composite(static_cast<size_t>(kLimit) + 1, false);
      mu[1] = 1;
      for (int i = 2; i <= kLimit; ++i) {
          if (!composite[static_cast<size_t>(i)]) {
              primes.push_back(i);
              mu[static_cast<size_t>(i)] = -1;
          }
          for (int p : primes) {
              if (p > kLimit / i) { break; }
              const int next = i * p;
              composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) {
                  mu[static_cast<size_t>(next)] = 0;
                  break;
              }
              mu[static_cast<size_t>(next)] = -mu[static_cast<size_t>(i)];
          }
      }
      return mu;
  }

  static vector<long long> divisor_prefix(int limit) {
      vector<int> divisor_count(static_cast<size_t>(limit) + 1, 0);
      for (int divisor = 1; divisor <= limit; ++divisor) {
          for (int multiple = divisor; multiple <= limit; multiple += divisor) {
              ++divisor_count[static_cast<size_t>(multiple)];
          }
      }
      vector<long long> prefix(static_cast<size_t>(limit) + 1, 0);
      for (int i = 1; i <= limit; ++i) {
          prefix[static_cast<size_t>(i)] =
              prefix[static_cast<size_t>(i - 1)] + divisor_count[static_cast<size_t>(i)];
      }
      return prefix;
  }

  static long long normalized(long long value) {
      value %= kMod;
      if (value < 0) { value += kMod; }
      return value;
  }

  static long long solve(int a, int b, int c, const vector<int>& mu,
                         const vector<long long>& divisor_sum) {
      const int maximum = max({a, b, c});
      const int minimum = min({a, b, c});
      vector<long long> first(static_cast<size_t>(maximum) + 1, 0);
      vector<long long> second(static_cast<size_t>(maximum) + 1, 0);
      vector<long long> third(static_cast<size_t>(maximum) + 1, 0);
      for (int i = 1; i <= a; ++i) {
          first[static_cast<size_t>(i)] = divisor_sum[static_cast<size_t>(a / i)];
      }
      for (int i = 1; i <= b; ++i) {
          second[static_cast<size_t>(i)] = divisor_sum[static_cast<size_t>(b / i)];
      }
      for (int i = 1; i <= c; ++i) {
          third[static_cast<size_t>(i)] = divisor_sum[static_cast<size_t>(c / i)];
      }

      long long answer = 0;
      for (int value = 1; value <= minimum; ++value) {
          if (mu[static_cast<size_t>(value)] == 0) { continue; }
          const long long contribution = first[static_cast<size_t>(value)] *
              second[static_cast<size_t>(value)] % kMod *
              third[static_cast<size_t>(value)] % kMod;
          answer += static_cast<long long>(mu[static_cast<size_t>(value)]) * contribution;
      }

      vector<Edge> edges;
      vector<int> degree(static_cast<size_t>(maximum) + 1, 0);
      for (int common = 1; common <= maximum; ++common) {
          for (int left = 1; left <= maximum / common; ++left) {
              const int u = left * common;
              if (mu[static_cast<size_t>(u)] == 0) { continue; }
              for (int right = left + 1; right <= maximum / common / left; ++right) {
                  if (gcd(left, right) != 1) { continue; }
                  const int v = right * common;
                  if (mu[static_cast<size_t>(v)] == 0) { continue; }
                  const int edge_lcm = left * right * common;
                  const long long twice_u = static_cast<long long>(mu[static_cast<size_t>(v)]) *
                      (first[static_cast<size_t>(u)] * second[static_cast<size_t>(edge_lcm)] % kMod *
                           third[static_cast<size_t>(edge_lcm)] % kMod +
                       first[static_cast<size_t>(edge_lcm)] * second[static_cast<size_t>(u)] % kMod *
                           third[static_cast<size_t>(edge_lcm)] % kMod +
                       first[static_cast<size_t>(edge_lcm)] * second[static_cast<size_t>(edge_lcm)] % kMod *
                           third[static_cast<size_t>(u)] % kMod);
                  const long long twice_v = static_cast<long long>(mu[static_cast<size_t>(u)]) *
                      (first[static_cast<size_t>(v)] * second[static_cast<size_t>(edge_lcm)] % kMod *
                           third[static_cast<size_t>(edge_lcm)] % kMod +
                       first[static_cast<size_t>(edge_lcm)] * second[static_cast<size_t>(v)] % kMod *
                           third[static_cast<size_t>(edge_lcm)] % kMod +
                       first[static_cast<size_t>(edge_lcm)] * second[static_cast<size_t>(edge_lcm)] % kMod *
                           third[static_cast<size_t>(v)] % kMod);
                  answer += twice_u + twice_v;
                  ++degree[static_cast<size_t>(u)];
                  ++degree[static_cast<size_t>(v)];
                  edges.push_back({u, v, edge_lcm});
              }
          }
      }

      vector<vector<pair<int, int>>> graph(static_cast<size_t>(maximum) + 1);
      for (const Edge& edge : edges) {
          int from = edge.u;
          int to = edge.v;
          if (degree[static_cast<size_t>(from)] < degree[static_cast<size_t>(to)] ||
              (degree[static_cast<size_t>(from)] == degree[static_cast<size_t>(to)] && from > to)) {
              swap(from, to);
          }
          graph[static_cast<size_t>(from)].push_back({to, edge.lcm});
      }

      vector<int> marked_lcm(static_cast<size_t>(maximum) + 1, 0);
      for (int x = 1; x <= maximum; ++x) {
          for (const auto& [neighbor, edge_lcm] : graph[static_cast<size_t>(x)]) {
              marked_lcm[static_cast<size_t>(neighbor)] = edge_lcm;
          }
          for (const auto& [y, xy_lcm] : graph[static_cast<size_t>(x)]) {
              for (const auto& [z, yz_lcm] : graph[static_cast<size_t>(y)]) {
                  const int xz_lcm = marked_lcm[static_cast<size_t>(z)];
                  if (xz_lcm == 0) { continue; }
                  const long long sign = static_cast<long long>(mu[static_cast<size_t>(x)]) *
                      mu[static_cast<size_t>(y)] * mu[static_cast<size_t>(z)];
                  long long six = 0;
                  six += first[static_cast<size_t>(xy_lcm)] * second[static_cast<size_t>(yz_lcm)] % kMod *
                      third[static_cast<size_t>(xz_lcm)] % kMod;
                  six += first[static_cast<size_t>(xy_lcm)] * second[static_cast<size_t>(xz_lcm)] % kMod *
                      third[static_cast<size_t>(yz_lcm)] % kMod;
                  six += first[static_cast<size_t>(yz_lcm)] * second[static_cast<size_t>(xy_lcm)] % kMod *
                      third[static_cast<size_t>(xz_lcm)] % kMod;
                  six += first[static_cast<size_t>(yz_lcm)] * second[static_cast<size_t>(xz_lcm)] % kMod *
                      third[static_cast<size_t>(xy_lcm)] % kMod;
                  six += first[static_cast<size_t>(xz_lcm)] * second[static_cast<size_t>(xy_lcm)] % kMod *
                      third[static_cast<size_t>(yz_lcm)] % kMod;
                  six += first[static_cast<size_t>(xz_lcm)] * second[static_cast<size_t>(yz_lcm)] % kMod *
                      third[static_cast<size_t>(xy_lcm)] % kMod;
                  answer += sign * six;
              }
          }
          for (const auto& [neighbor, edge_lcm] : graph[static_cast<size_t>(x)]) {
              (void)edge_lcm;
              marked_lcm[static_cast<size_t>(neighbor)] = 0;
          }
      }
      return normalized(answer);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      const vector<int> mu = mobius_sieve();
      const vector<long long> divisor_sum = divisor_prefix(kLimit);
      int tests;
      cin >> tests;
      while (tests-- > 0) {
          int a, b, c;
          cin >> a >> b >> c;
          cout << solve(a, b, c, mu, divisor_sum) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4619
external_platform: 洛谷
external_problem_id: 'P4619'
external_title: '[SDOI2018] 舊試題'
external_relation: original
original_label: '洛谷 P4619'
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

這題的三重反演不應背結論；先確認三條 LCM 邊如何對應三個上界，再寫圖論部分。

原始題單中本題位於第 6.16 節、習題第 6 題；競賽來源記為「SDOI2018」。小範圍可三重枚舉 i、j、k 並試除計算 d(ijk) 對拍。
