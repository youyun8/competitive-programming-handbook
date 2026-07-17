---
id: monotone-queue-dp
volume: upper
source_file: upper-volume
chapter: 5
section: '5.8'
title: 單調佇列優化
summary: 利用雙端佇列維護滑動視窗的極值，把 O(nk) 的 DP 轉移降到 O(n)。
prerequisites: [dynamic-programming, deque]
learning_goals: [辨識滑動視窗型轉移, 用 deque 維護單調性, 將 O(nk) 降至 O(n)]
concepts: [monotone-queue, sliding-window-maximum, dp-optimization]
complexity:
  time: O(n)
  space: O(n)
related_exercises: []
source_book_pages: [366, 370]
source_pdf_pages: [384, 388]
review_status: verified
---

## 這個技術解決什麼問題

當 DP 轉移式形如 `dp[i] = min/max(dp[j] + cost(i, j))`，且 j 的合法範圍是一個隨 i 移動的連續區間 [i-k, i-1] 時，若 cost(i, j) 可拆成只與 i 和只與 j 有關的兩部分，就可以用單調佇列維護區間極值，把每個 i 的轉移變成 O(1) 均攤。

## 辨識題型的訊號

範圍固定長度 k 的滑動視窗；轉移需要取前面「一段區間」的最小值或最大值；j 的範圍隨 i 單調右移。

## 核心想法與直覺

雙端佇列維護候選索引 j，保持佇列內的 dp 值單調遞增（或遞減）。新的 i 進來時，先彈出離開視窗的舊索引，再從尾部移除不會再成為最值的候選，最後隊首就是當前最值。

## 狀態／資料結構定義

deque 存放索引 j，且 dp[j] 在佇列中保持單調。轉移時取隊首對應的 dp 值。

## 不變量或正確性證明

deque 中索引嚴格遞增，且對應 dp 值單調，因此隊首永遠是當前視窗內的最值。被彈出的元素因為超出視窗或比新元素差，永遠不會再被用到。

## 逐步演算法

1. 初始化 dp[0]。
2. 建立空 deque，放入合法初始索引。
3. 對 i = 1 到 n：
   a. 彈出 deque 前端超出 [i-k, i-1] 的索引。
   b. 用隊首更新 dp[i]。
   c. 從 deque 後端彈出 dp 值不優於 dp[i] 的元素。
   d. 將 i 壓入 deque 後端。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class MonotoneQueueDpTemplate {
public:
    // dp[i] = min(dp[j]) for j in [i-k, i-1] + cost(i)
    static int sliding_window_minimum(const vector<int>& cost, int k) {
        const int n = static_cast<int>(cost.size());
        vector<int> dp(n, INT_MAX / 2);
        dp[0] = cost[0];
        deque<int> dq;
        dq.push_back(0);
        for (int i = 1; i < n; ++i) {
            // 移除離開視窗的索引
            while (!dq.empty() && dq.front() < i - k) {
                dq.pop_front();
            }
            // 隊首即區間最小值
            dp[i] = dp[dq.front()] + cost[i];
            // 維護單調遞增
            while (!dq.empty() && dp[i] <= dp[dq.back()]) {
                dq.pop_back();
            }
            dq.push_back(i);
        }
        return dp[n - 1];
    }
};
```

## 時間與空間複雜度

每個索引最多入隊和出隊各一次，因此時間 O(n)，空間 O(n)（dp 陣列）或 O(k)（只保留視窗內元素）。

## 常見錯誤與邊界條件

- 視窗大小 k 與題目定義差 1（閉區間 vs 開區間）。
- dp 初值沒處理好導致 deque 為空時訪問隊首。
- 單調性方向寫反（最小 vs 最大）。

## 與相似技巧的比較

單調佇列與單調堆疊的差異在於視窗：佇列維護的是區間極值，堆疊通常維護「左側第一個更大元素」。若轉移式不能拆成只與 i 和只與 j 有關的項，則需使用斜率優化。

## 例題與分級練習

- 入門：滑動視窗最大值。
- 中級：跳躍遊戲最小成本、固定窗口 DP。
- 進階：多重背包單調佇列優化。

## 本節重點速查

deque 維護單調索引；每次處理「出窗、取最值、入隊」三步；時間從 O(nk) 降到 O(n)。
