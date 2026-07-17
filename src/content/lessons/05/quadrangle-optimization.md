---
id: quadrangle-optimization
volume: upper
source_file: upper-volume
chapter: 5
section: '5.10'
title: 四邊形不等式優化
summary: 當區間 DP 滿足四邊形不等式與單調性時，可用最優決策點的單調性將 O(n³) 降至 O(n²)。
prerequisites: [dynamic-programming, interval-dp]
learning_goals: [驗證四邊形不等式, 利用最優決策點單調性加速, 應用 Knuth 優化]
concepts: [quadrangle-inequality, monotone-optimal-point, knuth]
complexity:
  time: O(n^2)
  space: O(n^2)
related_exercises: []
source_book_pages: [379, 385]
source_pdf_pages: [397, 403]
review_status: verified
---

## 這個技術解決什麼問題

區間 DP 的轉移式常為 `dp[l][r] = min_{l <= k < r}(dp[l][k] + dp[k+1][r] + w(l, r))`。若合併成本函數 w 滿足「四邊形不等式」與「區間單調性」，則最優分割點 `opt[l][r]` 具有單調性：`opt[l][r-1] <= opt[l][r] <= opt[l+1][r]`。於是枚舉 k 的範圍被限制，時間從 O(n³) 降到 O(n²)。

## 辨識題型的訊號

區間 DP 但 n 達到 5000 左右，O(n³) 會超時；合併成本 w(l, r) 有「包含越多成本越高」或「邊際成本遞減」等性質。

## 核心想法與直覺

若 w 滿足四邊形不等式，表示「大區間的成本不會比拆成兩小區間更離譜」，這迫使最優分割點不會跳來跳去，而是隨著區間擴大平穩移動。

## 狀態／資料結構定義

`opt[l][r]`：使 `dp[l][r]` 達到最小值的分割點 k。由單調性可知，計算 `dp[l][r]` 時只需枚舉 `k` 從 `opt[l][r-1]` 到 `opt[l+1][r]`。

## 不變量或正確性證明

四邊形不等式保證：對於 a ≤ b ≤ c ≤ d，有 `w(a,c) + w(b,d) <= w(a,d) + w(b,c)`。結合區間單調性 `w(b,c) <= w(a,d)`，可證明 `opt` 的單調性。此性質讓區間 DP 的枚舉範圍受限。

## 逐步演算法

1. 驗證 w 滿足四邊形不等式與區間單調性（或透過題目性質已知）。
2. 初始化 `dp[i][i] = 0` 與 `opt[i][i] = i`。
3. 按長度 len 從 2 到 n：
   a. 枚舉 l，計算 r = l + len − 1。
   b. `k_left = opt[l][r-1]`，`k_right = opt[l+1][r]`。
   c. 在 `[k_left, k_right]` 內枚舉 k，找出最小值與對應 opt。
4. 答案在 `dp[0][n-1]`。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class QuadrangleOptimizationTemplate {
public:
    static int knuth_optimized_dp(const vector<int>& weights) {
        const int n = static_cast<int>(weights.size());
        vector<int> prefix(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            prefix[i + 1] = prefix[i] + weights[i];
        }
        auto cost = [&](int l, int r) -> int {
            return prefix[r + 1] - prefix[l];
        };
        const int INF = INT_MAX / 2;
        vector<vector<int>> dp(n, vector<int>(n, INF));
        vector<vector<int>> opt(n, vector<int>(n, 0));
        for (int i = 0; i < n; ++i) {
            dp[i][i] = 0;
            opt[i][i] = i;
        }
        for (int length = 2; length <= n; ++length) {
            for (int l = 0; l + length - 1 < n; ++l) {
                const int r = l + length - 1;
                const int k_left = opt[l][r - 1];
                const int k_right = opt[l + 1][r];
                dp[l][r] = INF;
                for (int k = k_left; k <= k_right && k < r; ++k) {
                    const int val = dp[l][k] + dp[k + 1][r] + cost(l, r);
                    if (val < dp[l][r]) {
                        dp[l][r] = val;
                        opt[l][r] = k;
                    }
                }
            }
        }
        return dp[0][n - 1];
    }
};
```

## 時間與空間複雜度

狀態數 O(n²)，每個狀態枚舉範圍受 opt 限制，均攤每個 dp 狀態只 O(1) 次更新，總時間 O(n²)。空間儲存 dp 與 opt，O(n²)。

## 常見錯誤與邊界條件

- w 不滿足四邊形不等式就直接套用，答案會錯。
- opt 初始化不正確導致枚舉範圍為空。
- 長度為 2 的區間 opt 要正確設定。
- 當 n 很小時，k_left 可能大於 k_right，需小心處理。

## 與相似技巧的比較

分治 DP 優化（Aliens）也利用決策單調性，但適用場景不同：四邊形不等式用於區間合併型 DP，而分治優化用於 1D/1D 型 DP（dp[i] = min_j(dp[j] + C(j,i))）。

## 例題與分級練習

- 入門：石子合併（Knuth 優化版本）。
- 中級：矩陣鏈乘、最優二叉搜尋樹（若滿足條件）。
- 進階：驗證四邊形不等式並證明單調性。

## 本節重點速查

驗證 w 的性質 → opt 單調 → 枚舉範圍縮小；時間從 O(n³) 到 O(n²)；初始化 opt 不可漏。
