---
id: interval-dp
volume: upper
source_file: upper-volume
chapter: 5
section: '5.5'
title: 區間 DP
summary: 在連續子區間上建立狀態，由小區間的最優解合併成大區間。
prerequisites: [dynamic-programming, recursion]
learning_goals: [定義區間狀態, 推導合併轉移, 掌握二維區間 DP]
concepts: [interval-dp, optimal-substructure, merge-cost]
complexity:
  time: O(n^3)
  space: O(n^2)
related_exercises: []
source_book_pages: [346, 352]
source_pdf_pages: [364, 370]
review_status: verified
---

## 這個技術解決什麼問題

當問題可以把序列切成連續區段，且大區間的最優值可以由內部所有可能的「最後合併點」轉移而來，就適用區間 DP。經典例子是石子合併與矩陣鏈乘。

## 辨識題型的訊號

區間成本、合併相鄰元素、矩陣鏈乘、字串分割、括號化。關鍵詞常見「合併代價」「區間最值」。

## 核心想法與直覺

`dp[l][r]` 表示將區間 [l, r] 處理到最優狀態的成本。假設最後一次操作是在 k 分割，則 `dp[l][r] = min(dp[l][k] + dp[k+1][r] + merge_cost(l, r))`。

## 狀態／資料結構定義

二維陣列 `dp[l][r]`，0 ≤ l ≤ r < n。也可擴展到 `dp[l][r][k]` 表示區間內切成 k 段或類似變形。通常只需要上半對角線。

## 不變量或正確性證明

對任意區間 [l, r]，最後一次操作必在某個唯一的 k 發生。所有 k 被枚舉且互斥，因此取最小值即為最優解。

## 逐步演算法

1. 初始化所有 `dp[i][i]` 為 0 或已知值。
2. 按長度 len 從 2 到 n 枚舉區間。
3. 枚舉左端點 l，計算 r = l + len − 1。
4. 枚舉分割點 k，更新 `dp[l][r]`。
5. 答案在 `dp[0][n-1]`。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class IntervalDpTemplate {
public:
    static int stone_merge(const vector<int>& stones) {
        const int n = static_cast<int>(stones.size());
        vector<int> prefix(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            prefix[i + 1] = prefix[i] + stones[i];
        }
        vector<vector<int>> dp(n, vector<int>(n, 0));
        for (int length = 2; length <= n; ++length) {
            for (int left = 0; left + length - 1 < n; ++left) {
                const int right = left + length - 1;
                dp[left][right] = INT_MAX / 2;
                for (int split = left; split < right; ++split) {
                    const int cost = dp[left][split] + dp[split + 1][right]
                                   + prefix[right + 1] - prefix[left];
                    dp[left][right] = min(dp[left][right], cost);
                }
            }
        }
        return dp[0][n - 1];
    }
};
```

## 時間與空間複雜度

區間數 O(n²)，每個區間枚舉 O(n) 個分割點，因此時間 O(n³)，空間 O(n²)。

## 常見錯誤與邊界條件

- 長度枚舉順序反了導致子區間還沒算到。
- `dp[l][r]` 沒有初始化為極大值。
- 合併成本計算錯誤，應涵蓋整個 [l, r] 區間。
- 字串區間 DP 要注意空字串與單一字元的基底。

## 與相似技巧的比較

線性 DP 只看前缀，區間 DP 需要看所有内部子區間。與分治 DP 的差異在於區間 DP 的狀態是連續區段。

## 例題與分級練習

- 入門：石子合併。
- 中級：矩陣鏈乘、字串分割最大化乘積。
- 進階：帶單調性優化的區間 DP（Knuth / 四邊形不等式）。

## 本節重點速查

區間長度從小到大；最後一次分割點枚舉；空間二維；O(n³) 是起點，可優化。
