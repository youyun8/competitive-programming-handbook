---
id: openj-bailian-1837
volume: upper
source_file: upper-volume
title: OpenJudge 1837 Balance
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, counting, knapsack]
prerequisites: [dynamic-programming]
statement: >-
  天平有 c 個位置已知的掛鉤與 g 個重量互異的砝碼。每個砝碼都必須掛到某一掛鉤；
  一種方案平衡當且僅當所有「掛鉤位置乘砝碼重量」的總和為零。求平衡方案數。
constraints:
  - 2 <= c <= 20
  - 2 <= g <= 20
  - 掛鉤位置互異且遞增，皆在 -15 到 15
  - 砝碼重量互異且遞增，皆在 1 到 25
  - 官方保證至少有一種平衡方案
input_format: 第一行為 c、g；第二行為 c 個掛鉤位置；第三行為 g 個砝碼重量。
output_format: 輸出平衡方案數。
samples:
  - input: |-
      2 4
      -2 3
      3 4 5 8
    output: '2'
    explanation: 逐個砝碼枚舉所掛位置並累加力矩，恰有兩種配置使最後總力矩為零。
core_knowledge: [力矩和狀態, 計數型 DP, 有限偏移陣列]
judgment: 每個砝碼都必須且只能掛一次；多個砝碼可以掛在同一掛鉤。
hints:
  - 平衡只和總力矩有關，不必記錄每個掛鉤上有哪些砝碼。
  - 處理一個重量 w 時，從每個舊力矩轉移到 torque+w*hook。
  - 最大絕對力矩不超過 g*25*15，用固定偏移把負下標映射到陣列。
solution_outline: dp[t] 記錄已放砝碼得到力矩 t 的方案數，逐個重量枚舉舊力矩與所有掛鉤轉移。
proof_or_invariant: >-
  處理前 i 個砝碼後，dp[t] 精確等於把這些砝碼各掛一次且總力矩為 t 的方案數。加入下一砝碼時，
  每個既有方案與每個掛鉤形成唯一新方案，其新力矩為 t+w*hook；反之每個新方案移除最後砝碼後
  唯一落回一個舊方案。故轉移無遺漏也不重複，最後 dp[0] 正是所有平衡方案。
common_errors: [漏掉負力矩所需的下標偏移, 允許砝碼不掛, 原地更新而把同一砝碼使用多次]
complexity:
  time: O(g * c * g * max_weight * max_distance)
  space: O(g * max_weight * max_distance)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int c = 0; int g = 0; cin >> c >> g;
      // TODO：以總力矩為狀態逐個配置砝碼。
      cout << c - c + g - g << '\n';
  }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int c = 0; int g = 0; cin >> c >> g;
      vector<int> hook(static_cast<size_t>(c));
      vector<int> weight(static_cast<size_t>(g));
      for (int& value : hook) cin >> value;
      for (int& value : weight) cin >> value;
      const int limit = g * 25 * 15;
      const int width = 2 * limit + 1;
      vector<long long> dp(static_cast<size_t>(width), 0);
      dp[static_cast<size_t>(limit)] = 1;
      int reach = 0;
      for (int value : weight) {
          vector<long long> next(static_cast<size_t>(width), 0);
          for (int torque = -reach; torque <= reach; ++torque) {
              const long long ways = dp[static_cast<size_t>(torque + limit)];
              if (ways == 0) continue;
              for (int position : hook) {
                  const int next_torque = torque + value * position;
                  next[static_cast<size_t>(next_torque + limit)] += ways;
              }
          }
          reach += value * 15;
          dp.swap(next);
      }
      cout << dp[static_cast<size_t>(limit)] << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/1837/
external_platform: OpenJudge 百練
external_problem_id: '1837'
external_title: Balance
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

「平衡」把完整配置壓縮成一個可加總的力矩狀態，是計數 DP 的關鍵。
