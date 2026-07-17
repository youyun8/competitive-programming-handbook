---
id: two-pointers
volume: upper
source_file: upper-volume
chapter: 2
section: '2.2'
title: 雙指標：反向與同向掃描的線性藝術
summary: 利用兩個指標的相對移動，將 O(n^2) 的暴力枚舉降為 O(n)，並掌握滑動視窗與反向配對兩大經典模式。
prerequisites: [arrays, complexity]
learning_goals:
  - 判斷題目是否具備單調性以使用雙指標
  - 實作反向指標與同向滑動視窗
  - 避免指標越界與邊界條件錯誤
concepts: [two-pointers, sliding-window, monotonicity]
complexity:
  time: O(n)
  space: O(1)
related_exercises: ['sliding-window-maximum']
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

當問題可以從「枚舉所有區間」改寫成「移動兩個端點就能調整答案」，雙指標能把二次複雜度壓縮到線性。反向掃描常用於有序陣列的配對問題，同向掃描則適合維護可伸縮的區間條件。

## 辨識題型的訊號

- 給定排序陣列，問是否存在兩數和為 target。
- 要求最短的連續子陣列使其和大於等於 target。
- 合併兩個有序串流或去重。
- 滑動視窗最大值、最小值或字符種類統計。

## 核心想法與直覺

兩個指標都在陣列上走動，不往回走。若問題具有單調性（移動左指標使值變大、移動右指標也使值變大），則每個指標最多走 n 步，總步數 O(n)。滑動視窗是同向雙指標的特例：右端擴張嘗試可行性，左端收縮追求最優性。

## 狀態／資料結構定義

int left = 0, right = n - 1;（反向）
int left = 0, right = 0;（同向，區間為 [left, right) 或閉區間）
視情況搭配計數器、總和或 hash map 記錄區間內屬性。

## 不變量或正確性證明

對反向雙指標（有序陣列求兩數和）：若 sum < target，則 left 必須右移（因為 right 左移只會使 sum 更小）；若 sum > target，則 right 必須左移。由於陣列已排序，不可能遺漏正確解，因為被排除的區間中所有配對都無法滿足條件。

## 逐步演算法

1. 初始化雙指標位置。
2. 根據當前狀態決定移動哪個指標（反向：比較 sum 與 target；同向：檢查條件是否仍被滿足）。
3. 更新答案並重複，直到指標交錯或觸及邊界。

## C++17 模板

```cpp
#include <vector>

// 反向雙指標：有序陣列中找兩數和等於 target
bool has_pair_sum(const std::vector<int>& sorted_values, int target) {
    int left = 0;
    int right = static_cast<int>(sorted_values.size()) - 1;

    while (left < right) {
        const int sum = sorted_values[left] + sorted_values[right];
        if (sum == target) {
            return true;
        }
        if (sum < target) {
            ++left;
        } else {
            --right;
        }
    }
    return false;
}
```

## 時間與空間複雜度

每個指標最多移動 n 步，總時間 O(n)。額外空間 O(1)（若不需 hash map）。

## 常見錯誤與邊界條件

- 反向指標使用 left <= right 導致同一個元素被使用兩次。
- 同向指標左端收縮時忘記把移出區間的元素從統計中扣除。
- 陣列未排序就使用反向雙指標；此時應先排序或改用 hash set。
- 滑動視窗的條件判斷與答案更新順序序寫反，導致漏解或多解。

## 與相似技巧的比較

二分搜尋適合單調真假分界，雙指標適合維持一個區間並調整兩端。前綴和也能解子陣列和問題，但若有正數單調性，雙指標空間更省且程式碼更簡潔。

## 例題與分級練習

先做「兩數之和 II」建立反向掃描直覺，再用「長度最小的子陣列」練習同向滑動視窗。進階可嘗試「乘積小於 k 的子陣列」與「最多包含兩種字元的最長子字串」。

## 本節重點速查

雙指標的核心是「不回頭」；反向掃描適合配對，同向掃描適合區間條件；每次移動指標都要有單調理由，否則會漏答案。
