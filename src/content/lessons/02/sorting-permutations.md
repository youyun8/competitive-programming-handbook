---
id: sorting-permutations
volume: upper
source_file: upper-volume
chapter: 2
section: '2.8'
title: 排序與排列：順序與全域枚舉
summary: 掌握常用排序函式的特性，以及如何用 next_permutation 依字典序生列排列並剪枝搜尋。
prerequisites: [arrays, complexity]
learning_goals:
  - 正確選擇穩定與不穩定排序函式
  - 使用自訂比較器處理結構體多欄位排序
  - 以 next_permutation 枚舉排列並結合剪枝優化
concepts: [sorting, comparator, permutation, lexicographic-order]
complexity:
  time: O(n log n) 排序，O(n!) 全排列枚舉
  space: O(n)
related_exercises: []
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

排序是最常用的前置處理，能讓資料產生順序結構，從而啟用雙指標、二分搜尋與貪心策略。排列枚舉則用在需要考慮所有順序的組合最佳化問題中，next_permutation 的重點在於它有字典序，能與剪枝結合提前跳過不必要的分支。

## 辨識題型的訊號

- 題目要求「按某欄位排序」。
- 需要枚舉所有執行順序或分配方式，且 n 不大（通常 n <= 8~10）。
- 需找「下一個字典序排列」或「第 k 個排列」。
- 排序後統計逆序對、中位數或重心。

## 核心想法與直覺

排序把無序變有序，讓我們可以用「前面一定比後面小」這個條件簡化問題。next_permutation 的演算法則是：從右邊找出第一個上升對，再從右邊找第一個比它大的數交換，最後反轉後綴，得到剛好比目前大的排列。

## 狀態／資料結構定義

排序：陣列或向量。
排列枚舉：`std::vector<int> perm`，配合 `std::sort` 與 `do { ... } while (std::next_permutation(perm.begin(), perm.end()))`。

## 不變量或正確性證明

next_permutation 的不變量：每次呼叫後，序列變為「所有元素排列中字典序剛好比目前大」的那一個。若序列已是字典序最大（遞減），回傳 false。由於它按字典序遍歷，以排序後的初始序列開始，就能不重不漏地枚舉所有排列。

## 逐步演算法

排序：

1. `std::sort(vec.begin(), vec.end())` 或 `std::stable_sort`。
2. 自訂lambda：`std::sort(vec.begin(), vec.end(), [](const auto& a, const auto& b){ return a.key < b.key; })`。

排列：

1. 將序列排序為最小字典序。
2. do-while 迴圈中使用 next_permutation。
3. 在迴圈內檢查當前排列是否滿足條件，並更新最佳答案。

## C++17 模板

```cpp
#include <algorithm>
#include <string>
#include <vector>

// 多欄位排序：先按分數降序，同分按名字升序
struct Student {
    std::string name;
    int score;
};

void sort_students(std::vector<Student>& students) {
    std::sort(students.begin(), students.end(),
        [](const Student& a, const Student& b) {
            if (a.score != b.score) return a.score > b.score;
            return a.name < b.name;
        });
}
```

## 時間與空間複雜度

std::sort 為 O(n log n)。next_permutation 每次生成下一排列為 O(n)，全部 n! 個排列的總時間為 O(n! \* n)。空間均為 O(n)。

## 常見錯誤與邊界條件

- next_permutation 會修改輸入序列，若需要保留原始排列要先複製。
- std::sort 不是穩定排序，若相等元素的原始相對順序重要，應使用 stable_sort。
- 自訂比較器未滿足嚴格弱序（如使用 <=），會導致未定義行為。
- 忘記先 sort 再呼叫 next_permutation，導致從非最小字典序開始，遺漏部分排列。

## 與相似技巧的比較

排序是將任意順序變成統一順序；next_permutation 是窮舉所有順序。若 n 太大（>10），全排列不可行，這時應改用動態規劃或回溯剪枝，而非直接枚舉。

## 例題與分級練習

自訂比較器解決多欄位排序；next_permutation 解決「旅行推銷員問題」小數據版本並計算最小總距離。進階可練習 prev_permutation 與字典序排名第 k 個排列。

## 本節重點速查

排序選 sort 或 stable_sort；比較器要嚴格弱序；next_permutation 前先 sort；記得用 do-while 確保第一個排列也被處理。
