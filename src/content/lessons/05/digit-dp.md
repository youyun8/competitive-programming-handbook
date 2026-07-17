---
id: digit-dp
volume: upper
source_file: upper-volume
chapter: 5
section: '5.3'
title: 數位統計 DP
summary: 以十進位位數為階段，逐位統計滿足條件的數字個數。
prerequisites: [dynamic-programming, recursion]
learning_goals: [設計位數轉移, 使用記憶化搜尋實現數位 DP]
concepts: [digit-dp, memoized-search, positional-dp]
complexity:
  time: O(位數 × 狀態數)
  space: O(位數 × 狀態數)
related_exercises: []
source_book_pages: [332, 338]
source_pdf_pages: [350, 356]
review_status: verified
---

## 這個技術解決什麼問題

統計區間 [0, N] 內滿足某些性質（例如數字和為 K、包含某子序列、有特定數字出現次數）的整數個數。N 很大時無法枚舉，直接按位數 DP。

## 辨識題型的訊號

給定一個很大的上界 N（如 10¹⁸），要求數字性質統計；通常伴隨「數字和」「某數字出現次數」「單調性」等條件。

## 核心想法與直覺

把整數視為字串，從最高位到最低位一位一位填。狀態記錄「當前位數、是否已經小於上界、前導零狀態、已累積的屬性」。當所有位都填完，檢查累積屬性是否合法。

## 狀態／資料結構定義

設 `pos` 為當前處理位數（從高位到 0），`tight` 表示前面是否都貼著上界（若 `tight = true` 則當前位不能超過 N 對應位），`lead_zero` 表示是否仍為前導零，`extra` 為題目客製化屬性（例如數字和）。`dp[pos][tight][lead_zero][extra]` 表示剩餘位數的合法方案數。

## 不變量或正確性證明

對於每個前綴，所有後繼位的可能性被枚舉且互斥。若 `tight = 1` 則上限正確；若 `tight = 0` 則後續位可取 0–9。前導零用於區分「數字 0」與「位數不足」的不同統計規則。

## 逐步演算法

1. 把 N 拆成數位陣列 `digits[]`。
2. 設計 `dfs(pos, tight, lead_zero, extra)` 回傳剩餘位數的方案數。
3. 邊界 `pos < 0` 時回傳屬性判定結果。
4. 否則枚舉當前位可選數字，更新 `tight` 與 `lead_zero`，遞迴並加總。
5. 用記憶化時，只在 `tight = 0` 且 `lead_zero = 0` 時快取。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class DigitDpTemplate {
    vector<int> digits;
    long long memo[20][2][2][200]; // 依題目調整 extra 上限
    int target_sum;

    long long dfs(int pos, bool tight, bool lead_zero, int current_sum) {
        if (pos < 0) {
            return current_sum == target_sum ? 1 : 0;
        }
        if (!tight && !lead_zero && memo[pos][tight][lead_zero][current_sum] != -1) {
            return memo[pos][tight][lead_zero][current_sum];
        }
        long long result = 0;
        const int upper_bound = tight ? digits[pos] : 9;
        for (int d = 0; d <= upper_bound; ++d) {
            const bool next_tight = tight && (d == upper_bound);
            const bool next_lead = lead_zero && (d == 0);
            const int next_sum = next_lead ? current_sum : current_sum + d;
            result += dfs(pos - 1, next_tight, next_lead, next_sum);
        }
        if (!tight && !lead_zero) {
            memo[pos][tight][lead_zero][current_sum] = result;
        }
        return result;
    }

public:
    long long count_up_to(long long n, int sum) {
        target_sum = sum;
        digits.clear();
        while (n > 0) {
            digits.push_back(static_cast<int>(n % 10));
            n /= 10;
        }
        memset(memo, -1, sizeof(memo));
        return dfs(static_cast<int>(digits.size()) - 1, true, true, 0);
    }
};
```

## 時間與空間複雜度

位數為 d（通常 ≤ 19），狀態數為 d × tight × lead_zero × extra_range。時間與空間均為 O(d × extra_range)。

## 常見錯誤與邊界條件

- `tight` 為 `true` 時 `upper_bound` 錯寫成 9。
- `memo` 在 `tight = 1` 時被錯誤查詢。
- 前導零狀態與數字 0 本身的統計規則不同。
- 答案區間 [L, R] 時別忘記 `prefix(R) − prefix(L − 1)`。

## 與相似技巧的比較

純數學組合計數需嚴格推導公式，數位 DP 則以通用模版處理複雜條件；與一般線性 DP 的差異在於「階段」是十進位位數，且帶有 `tight` 這種「是否受限」的額外維度。

## 例題與分級練習

- 入門：統計 [0, N] 中數字和等於 K 的數量。
- 中級：不含特定連續子串的數字個數。
- 進階：大區間內滿足多條件限制的數位統計。

## 本節重點速查

拆位、記 `tight` 與前導零、只在非受限狀態記憶化、最後用前綴相減求區間。
