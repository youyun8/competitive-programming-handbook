---
id: binary-search
volume: upper
source_file: upper-volume
chapter: 2
section: '2.3'
title: 二分搜尋：把單調性變成答案
summary: 用一致的半開區間不變量，處理精確查找、第一個可行解與答案二分。
prerequisites: [complexity, arrays]
learning_goals:
  - 判斷題目是否具有可二分的單調性
  - 寫出不越界且不死循環的 lower_bound
  - 將最佳化問題改寫為可行性判定
concepts: [monotonicity, invariant, lower-bound, answer-search]
complexity:
  time: O(log n)
  space: O(1)
related_exercises: [first-not-less]
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
visualizer: binary-search
---

## 這個技術解決什麼問題

當候選答案有順序，而且「某個位置之後全部可行」或「某個位置之前全部成立」時，可以每次排除一半。它不只用於排序陣列，也能在答案範圍上搜尋最小可行值。

## 辨識題型的訊號

- 資料已排序，要求第一個、最後一個或插入位置。
- 問「最小的最大值」「最大的最小值」。
- 給定答案 `x` 後，能在可接受時間內判定是否可行。

## 核心想法與直覺

不要背「相等就回傳」的版本；先定義真假分界。以下模板維持半開區間 `[left, right)`，答案永遠留在區間內。

## 狀態／資料結構定義

`left` 是尚未排除的第一個位置，`right` 是尚未排除區間的尾端。目標是第一個滿足 `values[i] >= target` 的位置。

## 不變量或正確性證明

迴圈開始時，所有小於 `left` 的位置都不可能是答案；答案若存在，一定位於 `[left, right)`。若 `values[mid] < target`，則 `mid` 以前都太小；否則 `mid` 仍可能是第一個答案，不能排除。

## 逐步演算法

1. 初始化 `left = 0`、`right = n`。
2. 當 `left < right`，取不溢位的中點。
3. 依判定結果保留左半或右半。
4. 區間縮成空區間時，`left` 就是分界。

## C++17 模板

```cpp
#include <vector>

int first_not_less(const std::vector<int>& values, int target) {
    int left = 0;
    int right = static_cast<int>(values.size());
    while (left < right) {
        int middle = left + (right - left) / 2;
        if (values[middle] < target) {
            left = middle + 1;
        } else {
            right = middle;
        }
    }
    return left;
}
```

## 時間與空間複雜度

每輪至少讓候選區間減半，所以時間是 $O(\log n)$，額外空間是 $O(1)$。

## 常見錯誤與邊界條件

- 混用閉區間與半開區間。
- `right = middle - 1` 套進半開區間模板。
- 答案可能不存在時，忘記允許回傳 `n`。
- 實數二分只看相鄰浮點數相等，造成迴圈不穩定；通常固定迭代次數更可靠。

## 與相似技巧的比較

雙指標利用兩個位置的相對移動，通常是線性掃描；二分依靠單調判定，每次排除一半。三分搜尋則要求單峰／單谷形狀，不是一般真假單調。

## 例題與分級練習

先完成「第一個不小於目標的位置」，再把判定函式替換成「容量 `x` 是否能完成排程」，練習答案二分。

## 本節重點速查

先寫出判定的單調方向，再選區間定義；每個分支都必須嚴格縮小區間，並用不變量解釋為何沒有丟掉答案。
