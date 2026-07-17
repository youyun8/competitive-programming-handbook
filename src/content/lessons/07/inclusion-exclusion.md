---
id: inclusion-exclusion
volume: lower
source_file: lower-volume
chapter: 7
section: '7.5'
title: 容斥原理：集合交聯集的精確計數
summary: 以交替加減交集的方式，修正重複計數，求出聯集的精確大小。
prerequisites: [combinatorics, bit-manipulation]
learning_goals:
  - 理解容斥的符號交替結構
  - 以位元枚舉實作子集容斥
  - 判斷容斥與直接計數的適用分界
concepts: [inclusion-exclusion, subset-summation]
complexity:
  time: O(2^n) for n sets
  space: O(n)
related_exercises: []
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

## 這個技術解決什麼問題

直接計算「至少滿足一個條件」的物件數時，分類往往互有重疊；容斥原理用交集修正重複，得到精確結果。

## 辨識題型的訊號

「至少有一個…」「不全部…」「可被2或3或5整除的個數」等量詞轉換後涉及多個集合聯集。

## 核心想法與直覺

兩集合：$|A \cup B| = |A| + |B| - |A \cap B|$。推廣到 $n$ 個集合：對每個非空子集，若子集大小為奇數則加、偶數則減其交集大小。

## 狀態／資料結構定義

以位元掩碼 $mask \in [1, 2^n)$ 代表集合子集；`__builtin_popcount(mask)` 判斷正負號。

## 不變量或正確性證明

對任意元素 $x$，設其屬於 $k$ 個集合。在容斥和中，$x$ 被計入 $\sum_{i=1}^{k} (-1)^{i-1} C(k,i) = 1$ 次，恰好在聯集中被計一次。

## 逐步演算法

1. 枚舉所有非空子集 $mask$。
2. 計算該子集對應的交集大小。
3. 若 popcount 為奇數則加，偶數則減。
4. 總和即為聯集大小。

## C++17 模板

```cpp
#include <vector>

long long inclusion_exclusion(const std::vector<long long>& single,
                              const std::vector<std::vector<long long>>& inter) {
    int n = static_cast<int>(single.size());
    long long total = 0;
    for (int mask = 1; mask < (1 << n); ++mask) {
        int bits = __builtin_popcount(mask);
        long long sign = (bits % 2 == 1) ? 1 : -1;
        long long ways = 1;
        // 依題意計算交集；此處以 LCM 或乘積為例
        for (int i = 0; i < n; ++i) {
            if (mask & (1 << i)) {
                ways = ways * single[i]; // 實際題目用交集計算
            }
        }
        total += sign * ways;
    }
    return total;
}
```

## 時間與空間複雜度

枚舉全部子集 $O(2^n)$；計算交集依題目而定。空間 $O(n)$。

## 常見錯誤與邊界條件

空集（mask=0）不計入；符號正負搞反；$n>20$ 時 $2^n$ 過大需尋找更聰明的結構。

## 與相似技巧的比較

莫比烏斯反演是容斥在偏序集上的推廣；DP 計數則適合條件有明顯階段結構的問題。

## 例題與分級練習

整數倍數計數、排列中的禁止位置、圖論中特定子結構的存在性計數。

## 本節重點速查

子集大小決定正負；空集不計；交集計算決定實作難度。
