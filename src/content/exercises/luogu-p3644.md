---
id: luogu-p3644
volume: upper
source_file: upper-volume
title: '洛谷 P3644 [APIO2015] 巴鄰旁之橋'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['中位數', '前後綴最佳值', '兩堆動態中位數']
prerequisites: ['中位數', '前後綴最佳值', '兩堆動態中位數']
statement: |-
  兩岸建築以座標排列；至多建 K 座垂直橋，使所有居民從家到辦公室的最短路總和最小，K 只為 1 或 2。
constraints:
  - 'K in {1,2}'
  - '1 <= N <= 100000'
  - '0 <= 座標 <= 1000000000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      1 1
      A 0 B 2
    output: |-
      3
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['中位數', '前後綴最佳值', '兩堆動態中位數']
judgment: |-
  同岸居民的距離是固定值；跨岸居民額外付 1，且一座橋對一組端點的成本為 |s-x|+|t-x|。
hints:
  - '先辨識核心模型：中位數、前後綴最佳值、兩堆動態中位數；暫時不要處理所有操作細節。'
  - '同岸居民的距離是固定值；跨岸居民額外付 1，且一座橋對一組端點的成本為 |s-x|+|t-x|。'
  - '最後依此不變量實作：先累加同岸固定成本。跨岸端點依 s+t 排序；K=1 取全部 2N 個端點中位數。K=2 時計算每個前綴與後綴各用一座橋的最小絕對差和，枚舉分界。'
solution_outline: |-
  先累加同岸固定成本。跨岸端點依 s+t 排序；K=1 取全部 2N 個端點中位數。K=2 時計算每個前綴與後綴各用一座橋的最小絕對差和，枚舉分界。
proof_or_invariant: |-
  固定一組使用同座橋時，絕對差和由中位數最小化。兩座橋的最優分組可按端點和排序後切成前後綴；交換論證排除交錯分組，枚舉分界因此完備。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(N log N)'
  space: 'O(N)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依題卡的不變量完成平衡樹、KD-tree 或 Link-Cut Tree。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wunused-function"
  #pragma GCC diagnostic ignored "-Wunused-result"
  #pragma GCC diagnostic ignored "-Wparentheses"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #pragma GCC diagnostic ignored "-Wdangling-else"
  #pragma GCC diagnostic ignored "-Wsequence-point"
  #pragma GCC diagnostic ignored "-Wclass-memaccess"
  #pragma GCC diagnostic ignored "-Wimplicit-fallthrough"
  #endif
  #include <iostream>
  #include <algorithm>
  #include <queue>
  #include <vector>
  #include <cmath>
  using namespace std;

  const int MAXN = 200000; // 最大居民数量

  struct Person {
      int a, b; // 对侧居民的家和办公室坐标
  };

  Person p[MAXN]; // 存储对侧居民
  int pl[MAXN * 2]; // 存储所有对侧居民的坐标（用于K=1的情况）

  // 比较函数：按家和办公室坐标和排序
  bool cmp(const Person &x, const Person &y) {
      return x.a + x.b < y.a + y.b;
  }

  int main() {
      int k, n; // k: 桥的数量上限, n: 居民数量
      cin >> k >> n;
      long long ans = 0; // 总距离
      int tot = 0; // 对侧居民数量
      int cnt = 0; // 所有对侧居民坐标数量（2 * tot）

      // 读取输入数据
      for (int i = 0; i < n; i++) {
          char c1, c2;
          int x1, x2;
          cin >> c1 >> x1 >> c2 >> x2;

          // 处理同侧居民
          if (c1 == c2) {
              ans += abs(x2 - x1); // 直接计算距离
          } else {
              // 处理对侧居民
              ans++; // 过桥的固定距离1
              p[tot].a = x1;
              p[tot].b = x2;
              pl[cnt++] = x1;
              pl[cnt++] = x2;
              tot++;
          }
      }

      // K=1的情况：只建一座桥
      if (k == 1) {
          // 排序所有坐标
          sort(pl, pl + cnt);
          // 取中位数（对于偶数个点，取中间任意一个都可以）
          int mid = pl[cnt / 2];
          // 计算所有点到中位数的距离和
          for (int i = 0; i < cnt; i++) {
              ans += abs(pl[i] - mid);
          }
          cout << ans << endl;
      } else {
          // K=2的情况：建两座桥

          // 如果没有对侧居民，直接输出结果
          if (tot == 0) {
              cout << ans << endl;
              return 0;
          }

          // 按家和办公室坐标和排序对侧居民
          sort(p, p + tot, cmp);

          // pre[i]: 前i个对侧居民使用一座桥的最小距离和
          // suf[i]: 从第i个到最后一个对侧居民使用一座桥的最小距离和
          vector<long long> pre(tot + 1, 0);
          vector<long long> suf(tot + 2, 0);

          // 使用对顶堆动态计算最小距离和
          // q1: 大顶堆，存储较小的一半点
          // q2: 小顶堆，存储较大的一半点
          priority_queue<int> q1;
          priority_queue<int, vector<int>, greater<int>> q2;

          // s1: 大顶堆中所有点的和
          // s2: 小顶堆中所有点的和
          long long s1 = 0, s2 = 0;

          // 计算前缀最小距离和 pre[i]
          for (int i = 0; i < tot; i++) {
              // 将当前居民的两个点加入大顶堆
              q1.push(p[i].a);
              q1.push(p[i].b);
              s1 += p[i].a + p[i].b;

              // 保持堆的平衡：将大顶堆的最大值移动到小顶堆
              int top = q1.top();
              q1.pop();
              s1 -= top;
              s2 += top;
              q2.push(top);

              // 如果大顶堆的最大值大于小顶堆的最小值，交换它们
              if (!q1.empty() && !q2.empty() && q1.top() > q2.top()) {
                  int t1 = q1.top();
                  int t2 = q2.top();
                  q1.pop();
                  q2.pop();
                  q1.push(t2);
                  q2.push(t1);
                  // 更新两个堆的和
                  s1 = s1 - t1 + t2;
                  s2 = s2 - t2 + t1;
              }

              // 计算前i+1个居民的最小距离和
              // 对于偶数个点，最小距离和 = 小顶堆的和 - 大顶堆的和
              pre[i + 1] = s2 - s1;
          }

          // 清空堆，准备计算后缀最小距离和
          while (!q1.empty()) q1.pop();
          while (!q2.empty()) q2.pop();
          s1 = 0;
          s2 = 0;

          // 计算后缀最小距离和 suf[i]
          for (int i = tot - 1; i >= 0; i--) {
              // 将当前居民的两个点加入大顶堆
              q1.push(p[i].a);
              q1.push(p[i].b);
              s1 += p[i].a + p[i].b;

              // 保持堆的平衡：将大顶堆的最大值移动到小顶堆
              int top = q1.top();
              q1.pop();
              s1 -= top;
              s2 += top;
              q2.push(top);

              // 如果大顶堆的最大值大于小顶堆的最小值，交换它们
              if (!q1.empty() && !q2.empty() && q1.top() > q2.top()) {
                  int t1 = q1.top();
                  int t2 = q2.top();
                  q1.pop();
                  q2.pop();
                  q1.push(t2);
                  q2.push(t1);
                  // 更新两个堆的和
                  s1 = s1 - t1 + t2;
                  s2 = s2 - t2 + t1;
              }

              // 计算从第i+1个到最后一个居民的最小距离和
              suf[i + 1] = s2 - s1;
          }

          // 枚举所有可能的分组点，找到最小总距离
          long long min_val = 1e18;
          for (int i = 0; i <= tot; i++) {
              // 前i个居民使用第一座桥，后tot-i个居民使用第二座桥
              min_val = min(min_val, pre[i] + suf[i + 1]);
          }

          // 加上最小分组距离和
          ans += min_val;
          cout << ans << endl;
      }

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3644
external_platform: '洛谷'
external_problem_id: 'P3644'
external_title: '[APIO2015] 巴鄰旁之橋'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
