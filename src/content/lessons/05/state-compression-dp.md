---
id: state-compression-dp
volume: upper
source_file: upper-volume
chapter: 5
section: '5.4'
title: 狀態壓縮 DP
summary: 以位元遮罩或進位制編碼壓縮集合狀態，在多項式時間內解決指數級問題。
prerequisites: [bit-manipulation, dynamic-programming]
learning_goals: [用位元遮罩表示集合狀態, 設計壓縮轉移, 認識三進位狀壓]
concepts: [bitmask-dp, state-compression]
complexity:
  time: O(n × 2^m)
  space: O(2^m)
related_exercises: []
source_book_pages: [339, 345]
source_pdf_pages: [357, 363]
review_status: verified
---

## 這個技術解決什麼問題

當問題涉及「每個元素選或不選」「每行每列的放置狀態」「子集之間的轉移」時，狀態數本身是 2^m。若 m 在 15–22 左右，可用整數 bitmask 壓縮狀態並做 DP。

## 辨識題型的訊號

題目規模 n ≤ 20 或 m ≤ 20，且需要對每個子集或每行狀態做決策；常見關鍵字有「子集覆蓋」「每行放不放」「染色」「哈密頓路徑」。

## 核心想法與直覺

把一個長度為 m 的布林陣列塞進一個 m 位元整數。用位元運算檢查、加入、移除元素。轉移時枚舉合法子集或合法下一狀態。

## 狀態／資料結構定義

`dp[mask]` 表示「在子集 `mask` 的狀態下，某種最佳值」。`mask` 是 0 到 (1 << m) − 1 的整數。三進位壓縮則用 0, 1, 2 表示「未放、放第一種、放第二種」。

## 不變量或正確性證明

每個 `mask` 唯一對應一組元素的選取結果。位元運算不改變對應關係。狀態轉移只從已知 `mask` 到新增元素的 `mask`，保證拓撲順序。

## 逐步演算法

1. 確定 m 的大小。
2. 定義 `dp[mask]` 的語意。
3. 找出合法轉移（例如「由 mask 去掉某元素轉移來」或「由上一行的相容狀態轉移來」）。
4. 按 `mask` 從小到大或行數順序計算。
5. 輸出全滿或特定 `mask` 的答案。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class StateCompressionDpTemplate {
public:
    static int tsp_style_dp(const vector<vector<int>>& dist) {
        const int n = static_cast<int>(dist.size());
        const int full_mask = (1 << n) - 1;
        vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX / 2));
        dp[1][0] = 0; // 從 0 出發
        for (int mask = 1; mask <= full_mask; ++mask) {
            for (int last = 0; last < n; ++last) {
                if (!(mask & (1 << last))) { continue; }
                if (dp[mask][last] >= INT_MAX / 2) { continue; }
                for (int nxt = 0; nxt < n; ++nxt) {
                    if (mask & (1 << nxt)) { continue; }
                    const int next_mask = mask | (1 << nxt);
                    dp[next_mask][nxt] = min(dp[next_mask][nxt],
                                             dp[mask][last] + dist[last][nxt]);
                }
            }
        }
        int answer = INT_MAX / 2;
        for (int last = 1; last < n; ++last) {
            answer = min(answer, dp[full_mask][last] + dist[last][0]);
        }
        return answer;
    }
};
```

## 時間與空間複雜度

狀態數為 2^m，每個狀態轉移最多 O(m)，因此時間 O(m × 2^m)，空間 O(2^m)。對於 TSP 風格則為 O(n² × 2^n)。

## 常見錯誤與邊界條件

- `mask` 範圍沒開到 (1 << m) 導致漏狀態。
- 位元運算優先級搞錯（記得加括號）。
- dp 初始值沒設成極大或極小。
- 三進位狀壓時存取沒有先除模再取模。

## 與相似技巧的比較

回溯搜尋枚舉所有子集時間 O(2^m × poly(m))，狀壓 DP 是把最優子結構加進去；若 m > 22 則 2^m 爆炸，此時需考慮折半搜尋或啟發式。

## 例題與分級練習

- 入門：子集和判定。
- 中級：TSP、棋盤覆蓋。
- 進階：三進位狀壓搭配輪廓線 DP。

## 本節重點速查

Bitmask 是集合的編碼；轉移靠位元運算；狀態數為 2^m，m 不能太大；三進位擴展可描述多值屬性。
