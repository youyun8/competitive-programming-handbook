---
id: sparse-table
volume: upper
source_file: upper-volume
chapter: 2
section: '2.5'
title: 倍增法與 Sparse Table：靜態區間查詢
summary: 利用倍增預處理，讓靜態陣列的區間最值查詢在 O(1) 時間內完成。
prerequisites: [binary-search, arrays]
learning_goals:
  - 理解倍增思想在資料結構中的應用
  - 建構 Sparse Table 並處理 RMQ 問題
  - 判斷其他可重疊區間查詢是否適用 ST
concepts: [binary-lifting, sparse-table, rmq, overlap-query]
complexity:
  time: O(n log n) 預處理，O(1) 查詢
  space: O(n log n)
related_exercises: []
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

對於不會修改的靜態陣列，若需要頻繁查詢某個區間的最小值或最大值，線段樹可以做到 O(n) 建樹與 O(log n) 查詢，但 Sparse Table 用預處理空間換取 O(1) 查詢時間，非常適合只讀場景。

## 辨識題型的訊號

- 陣列給定後不再修改，但查詢次數極多（如 10^5 次以上）。
- 問區間最小值、最大值、GCD 等「可重疊」運算。
- LCA 問題中需要快速查詢 Euler tour 區間最淺節點。

## 核心想法與直覺

預先計算所有長度為 2^k 的區間答案。對於任意區間 [l, r]，取不超過其長度的最大 2 的冪次 k，則區間可被兩個長度為 2^k 的區間完全覆蓋（允許重疊），因為最值運算滿足「重疊不影響結果」。

## 狀態／資料結構定義

`st[k][i]` 表示從位置 i 開始、長度為 2^k 的區間答案。
`log_table[i]` 預先計算 floor(log2(i)) 加速查詢。

## 不變量或正確性證明

建構時：`st[0][i] = a[i]`；`st[k][i] = op(st[k-1][i], st[k-1][i + 2^{k-1}])`。由數學歸納法，st[k][i] 正確儲存長度 2^k 的答案。
查詢時：對於長度 len = r - l + 1，取 k = log_table[len]，兩個區間 [l, l+2^k-1] 與 [r-2^k+1, r] 一定覆蓋 [l, r] 且各自長度為 2^k。因為 op 滿足冪等性（如 min, max, gcd），重疊不影響結果。

## 逐步演算法

1. 計算 log_table[1..n]。
2. st[0][i] = a[i]。
3. 對 k 從 1 到 K：對 i 從 1 到 n - 2^k + 1，st[k][i] = op(st[k-1][i], st[k-1][i + 2^{k-1}])
4. 查詢：k = log_table[len]；ans = op(st[k][l], st[k][r - 2^k + 1])

## C++17 模板

```cpp
#include <vector>
#include <cmath>

class SparseTable {
    std::vector<std::vector<int>> st;
    std::vector<int> log_table;

public:
    SparseTable(const std::vector<int>& values) {
        const int n = static_cast<int>(values.size());
        log_table.resize(n + 1);
        log_table[1] = 0;
        for (int i = 2; i <= n; ++i) {
            log_table[i] = log_table[i / 2] + 1;
        }
        const int k = log_table[n] + 1;
        st.assign(k, std::vector<int>(n));
        for (int i = 0; i < n; ++i) {
            st[0][i] = values[i];
        }
        for (int j = 1; j < k; ++j) {
            for (int i = 0; i + (1 << j) <= n; ++i) {
                st[j][i] = std::min(st[j - 1][i], st[j - 1][i + (1 << (j - 1))]);
            }
        }
    }

    int query_min(int left, int right) const {
        const int len = right - left + 1;
        const int j = log_table[len];
        return std::min(st[j][left], st[j][right - (1 << j) + 1]);
    }
};
```

## 時間與空間複雜度

預處理 O(n log n)，查詢 O(1)。空間 O(n log n)。

## 常見錯誤與邊界條件

- 嘗試對「和」運算使用 ST，因為和運算不滿足冪等性，重疊區間會重複計算。
- log_table 沒有預先計算導致查詢時呼叫 log 函數變慢。
- 索引混淆 0-based 與 1-based，特別在計算 `right - (1 << j) + 1` 時。
- 忘記 ST 不支援修改，若題目有 update 操作應改用線段樹或樹狀陣列。

## 與相似技巧的比較

線段樹支援修改但查詢 O(log n)；ST 查詢 O(1) 但不支援修改。倍增法不只在 ST 使用，也常見於 LCA 與二分圖匹配等場景。

## 例題與分級練習

先實作 RMQ，再將 ST 與二分搜尋結合解決「區間最小值版的最大子陣列」。進階可將 GCD 作為運算實作 ST。

## 本節重點速查

ST 只適用冪等運算；預處理 log_table；查詢用兩個等長冪次區間重疊覆蓋；不支援單點修改。
