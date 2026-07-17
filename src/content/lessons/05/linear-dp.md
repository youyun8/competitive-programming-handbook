---
id: linear-dp
volume: upper
source_file: upper-volume
chapter: 5
section: '5.2'
title: 經典線性 DP
summary: 把問題展開成一維序列，設計只依賴前若干項的遞推式。
prerequisites: [recursion, dynamic-programming, arrays]
learning_goals: [設計線性狀態, 推導轉移, 掌握滾動陣列]
concepts: [linear-dp, state, transition, rolling-array]
complexity:
  time: O(n)
  space: O(n) 或 O(1) 使用滾動
related_exercises: ['dp-knapsack-01']
source_book_pages: [324, 331]
source_pdf_pages: [342, 349]
review_status: verified
---

## 這個技術解決什麼問題

當輸入本身就是線性排列（陣列、字串、序列），且任一位置的決策只需要知道前若干位置的最優值，就能用線性 DP 在 O(n) 或 O(n log n) 時間把整個序列求完。

## 辨識題型的訊號

給定一個序列要求最長遞增子序列、兩序列的最長公共子序列、零壹背包的一維優化；或者「選或不選」「切或不切」的連續決策。

## 核心想法與直覺

把「前 i 個元素的某種最佳值」當成當成狀態。狀態維度只有一維，轉移只看前綴，因此可以從左到右掃描。

## 狀態／資料結構定義

`dp[i]` 表示「考慮前 i 個元素，在目標條件下的最佳值」。根據題目，`dp[i]` 可以是「以 i 結尾的最佳值」或「前 i 個整體的最佳值」，語意不同轉移也不同。

## 不變量或正確性證明

由於 i 只依賴 j < i 的狀態，且掃描順序嚴格遞增，當計算到 i 時所有需要的子問題皆已算完，因此每個 `dp[i]` 都是最優解。

## 逐步演算法

1. 定義狀態語意。
2. 列舉最後一步（最後選的元素或切割點）。
3. 寫出轉移式。
4. 設定基底值。
5. 從左到右依序計算。
6. 輸出答案。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class LinearDpTemplate {
public:
    static int longest_increasing_subsequence(const vector<int>& sequence) {
        const int n = static_cast<int>(sequence.size());
        vector<int> dp(n, 1);
        int answer = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (sequence[j] < sequence[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
            answer = max(answer, dp[i]);
        }
        return answer;
    }

    static int longest_common_subsequence(const string& a, const string& b) {
        const int n = static_cast<int>(a.size());
        const int m = static_cast<int>(b.size());
        vector<int> previous(m + 1, 0), current(m + 1, 0);
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                if (a[i - 1] == b[j - 1]) {
                    current[j] = previous[j - 1] + 1;
                } else {
                    current[j] = max(previous[j], current[j - 1]);
                }
            }
            swap(previous, current);
        }
        return previous[m];
    }
};
```

## 時間與空間複雜度

LIS 範例時間 O(n²)，空間 O(n)；LCS 範例時間 O(nm)，空間可滾動到 O(m)。一般線性 DP 時間為「狀態數 × 轉移數」。

## 常見錯誤與邊界條件

- 「前 i 個」與「以 i 結尾」語意混淆。
- 滾動陣列時 `swap` 方向錯誤。
- 沒有處理空序列的基底值（`dp[0] = 0`）。

## 與相似技巧的比較

記憶化搜尋可寫出相同轉移，但遞迴深度可能爆掉；前綴和只是線性 DP 的特例；若狀態需要知道更多前綴資訊，就進入區間 DP 或斜率優化。

## 例題與分級練習

- 入門：爬樓梯、最小路徑和。
- 中級：最長遞增子序列、最長公共子序列。
- 進階：線性 DP 加上滾動優化後，參與線段樹或凸殼優化。

## 本節重點速查

狀態語意必先釐清；轉移只朝左看；滾動陣列可省空間，但會丟失歷史狀態。
