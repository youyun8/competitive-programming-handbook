---
id: pigeonhole-principle
volume: lower
source_file: lower-volume
chapter: 7
section: '7.2'
title: 鴿巢原理：存在性與極值保證
summary: 以物件與容器的數量關係，證明「必然存在」的組合結論，並求極值臨界。
prerequisites: [combinatorics]
learning_goals:
  - 判斷鴿巢原理的適用情境
  - 構造正確的鴿子與鴿巢
  - 運用推廣版求極值下界
concepts: [pigeonhole, existence, extremal]
complexity:
  time: O(1)
  space: O(1)
related_exercises: []
source_book_pages: [468, 471]
source_pdf_pages: [98, 101]
review_status: verified
---

## 這個技術解決什麼問題

當題目要求證明「至少有一個物件滿足某性質」，而直接構造困難時，鴿巢原理提供存在性保證。

## 辨識題型的訊號

題目出現「必有兩數之差可整除…」「任選 $n+1$ 個數，必存在…」等絕對性語句。

## 核心想法與直覺

$n+1$ 隻鴿子飛進 $n$ 個鴿巢，至少有一巢有至少兩隻。推廣版：$m$ 隻鴿子、$n$ 個巢，至少有一巢有 $\lceil m/n \rceil$ 隻。

## 狀態／資料結構定義

鴿子：待分析的物件集合；鴿巢：依某不變量（餘數、區間、顏色等）劃分的等價類。

## 不變量或正確性證明

若每巢至多 $\lfloor (m-1)/n \rfloor$ 隻，則總數至多 $m-1$，矛盾。因此至少一巢不少於 $\lceil m/n \rceil$。

## 逐步演算法

1. 確認題目要求的存在性結論。
2. 定義鴿子與鴿巢的映射，使結論對應「同一巢內物件具備目標性質」。
3. 驗證巢數 $<$ 鴿子數，或計算臨界密度。

## C++17 模板

鴿巢原理無特定模板，但常以模運算劃分巢：

```cpp
#include <vector>

bool has_duplicate_mod(const std::vector<int>& values, int modulus) {
    std::vector<bool> seen(modulus, false);
    for (int v : values) {
        int r = ((v % modulus) + modulus) % modulus;
        if (seen[r]) {
            return true;
        }
        seen[r] = true;
    }
    return false;
}
```

## 時間與空間複雜度

劃分與檢查均為線性；理論本身為 $O(1)$ 邏輯推論。

## 常見錯誤與邊界條件

鴿巢界定錯誤（如以值域代替餘數類）；忽略 $m < n$ 時無法保證任何存在性；推廣版的上取整計算錯誤。

## 與相似技巧的比較

鴿巢給存在性但不構造實例；若題目要求構造或計數，需改用排列組合、DP 或搜尋。

## 例題與分級練習

從「任意 $n+1$ 個整數必有差為 $n$ 的倍數」開始，到圖論中的邊數臨界、拉姆齊數下界。

## 本節重點速查

對象與分類必須明確；巢數 $<$ 對象數才有保證；推廣版給出密度臨界。
