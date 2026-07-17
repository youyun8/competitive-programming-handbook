---
id: discretization
volume: upper
source_file: upper-volume
chapter: 2
section: '2.7'
title: 離散化：把無限大的座標壓進有限空間
summary: 將大範圍或浮點數值映射到連續的小整數區間，節省空間並使陣列索引成為可行方案。
prerequisites: [sorting, arrays]
learning_goals:
  - 手寫離散化的去重與編碼流程
  - 使用 STL lower_bound 完成自動映射
  - 判斷離散化後是否需保留原始數值關係
concepts: [coordinate-compression, mapping, lower-bound]
complexity:
  time: O(n log n)
  space: O(n)
related_exercises: []
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

當數值的範圍極大（如 10^9）但實際出現的數量不多（如 10^5）時，直接用值做陣列索引會配置不可能的大空間。離散化把出現過的值壓縮成 1..m 的連續整數，讓樹狀陣列、線段樹、前綴和等依賴索引的結構得以運作。

## 辨識題型的訊號

- 數值範圍高達 10^9，但 n 只有 10^5。
- 需要對「位置」建立區間資料結構，但位置是任意整數座標。
- 多次查詢排名或區間數字種類數。
- 大數據配對但只在意相對大小關係。

## 核心想法與直覺

離散化的本質是「建立全序關係的索引」。只要原始值之間的大小順序不變，壓縮後的編碼就能正確回答「有幾個數小於 x」這類問題。若需要計算原始值的差（如區間長度），則需保留原始值另行查詢。

## 狀態／資料結構定義

1. 收集所有需要離散化的原始值到陣列 all。
2. 排序 all，再去除重複元素。
3. 對每個原始值 x，其在 all 中的 lower_bound 位置即為離散化後的編號。

## 不變量或正確性證明

排序後的 all 滿足 `all[i] < all[i+1]`。對任意兩個原始值 a < b，因為 lower_bound 返回的是第一個不小於目標的位置，而 all 嚴格遞增，所以 `rank(a) < rank(b)`。這保證了全序關係的保真性。

## 逐步演算法

1. 讀取所有數值，儲存於向量 all_values。
2. `std::sort(all_values.begin(), all_values.end())`。
3. `all_values.erase(std::unique(...), end)` 去重。
4. 對每個原始值 x：`rank = std::lower_bound(all_values.begin(), all_values.end(), x) - all_values.begin()`。

## C++17 模板

```cpp
#include <vector>
#include <algorithm>
#include <iterator>

class CoordinateCompression {
    std::vector<long long> sorted;

public:
    explicit CoordinateCompression(const std::vector<long long>& values) {
        sorted = values;
        std::sort(sorted.begin(), sorted.end());
        sorted.erase(std::unique(sorted.begin(), sorted.end()), sorted.end());
    }

    int get_rank(long long value) const {
        return static_cast<int>(std::lower_bound(sorted.begin(), sorted.end(), value) - sorted.begin());
    }

    int size() const {
        return static_cast<int>(sorted.size());
    }
};
```

## 時間與空間複雜度

排序 O(m log m)，m 為不同值的個數。每次查詢 rank O(log m)。空間 O(m)。

## 常見錯誤與邊界條件

- 忘記去重導致相同值拿到不同編號。
- lower_bound 與 upper_bound 混用，導致離散化後的區間劃分不一致。
- 需要處理區間長度時，用離散化後的編號相減不等於原始區間長度。
- 浮點數離散化時，若涉及精度容差，需先統一縮放轉為整數再壓縮。

## 與相似技巧的比較

Hash 映射也能把大值對應到小空間，但離散化保留了順序關係，支援區間查詢與前後繼操作。若只需求是否存在，unordered_map 就夠了。

## 例題與分級練習

先做區間覆蓋的離散化與前綴和統計，再以離散化後的座標建立樹狀陣列解決「逆序對」問題。進階可嘗試二維離散化配合掃描線。

## 本節重點速查

離散化 = 收集、排序、去重、lower_bound；保留大小順序但不保留差值；需要長度時記得保留原始值。
