---
id: queue
volume: upper
source_file: upper-volume
chapter: 1
section: '1.2'
title: 佇列：先進先出的順序管理
summary: 掌握 STL queue、循環佇列、雙端佇列、單調佇列與優先佇列的核心特性與使用時機。
prerequisites: [arrays, linked-list]
learning_goals:
  - 理解 FIFO 原則與佇列的各種變形
  - 手寫循環佇列並避免溢出與判空錯誤
  - 使用單調佇列解決區間極值問題
concepts: [fifo, circular-queue, deque, monotone-queue, priority-queue]
complexity:
  time: O(1) 基本操作，O(n) 單調佇列構建
  space: O(n)
related_exercises: []
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

## 這個技術解決什麼問題

當資料需要按照到達順序處理，或需要從兩端彈性操作時，佇列提供插入在尾端、移除在首端的抽象。單調佇列更進一步維護遞增或遞減順序，讓區間極值查詢可在均攤 O(1) 內完成。

## 辨識題型的訊號

- BFS 的分層展開必須按先發現先處理。
- 滑動視窗最大值或最小值。
- 需要在頭尾兩側插入或移除的模擬題。
- 需要按權重或優先級取元素的場景。

## 核心想法與直覺

普通佇列就是排隊；雙端佇列把入口也開到最前面；單調佇列則在入隊前把不可能成為答案的元素擠掉，維持有用的子集。

## 狀態／資料結構定義

- 普通佇列：`std::queue<T>`。
- 循環佇列：`int head, tail` 與固定大小陣列。
- 雙端佇列：`std::deque<T>`。
- 單調佇列：可用 `std::deque<T>` 手動維護，儲存元素值與過期位置。

## 不變量或正確性證明

對單調遞減佇列（求滑動視窗最大值），佇列內元素依入隊順序遞減。新元素 x 從尾端移除所有小於等於 x 的元素，因為它們在 x 離開視窗前絕對不可能成為最大值。佇列首端即為當前視窗最大值。當首端元素離開視窗時，直接 pop_front。

## 逐步演算法

1. 初始化空的雙端佇列。
2. 對每個新位置 i：
   - 若首端已過期（索引 < i - k + 1），pop_front。
   - 從尾端移除所有值不大於當前值的元素。
   - 將當前（值, 索引）推入尾端。
3. 首端即為當前視窗最大值。

## C++17 模板

```cpp
#include <deque>
#include <vector>

std::vector<int> sliding_window_max(const std::vector<int>& values, int window_size) {
    std::vector<int> result;
    std::deque<int> mono; // stores indices, values decreasing

    for (int i = 0; i < static_cast<int>(values.size()); ++i) {
        if (!mono.empty() && mono.front() < i - window_size + 1) {
            mono.pop_front();
        }
        while (!mono.empty() && values[mono.back()] <= values[i]) {
            mono.pop_back();
        }
        mono.push_back(i);
        if (i >= window_size - 1) {
            result.push_back(values[mono.front()]);
        }
    }

    return result;
}
```

## 時間與空間複雜度

每個元素最多入隊出隊各一次，單調佇列均攤 O(n)。循環佇列與 std::deque 操作均為 O(1)。空間上佇列最多容納 n 個元素。

## 常見錯誤與邊界條件

- 循環佇列的判滿與判空條件混淆（常用 (tail + 1) % cap == head 表示滿）。
- 單調佇列忘記在取值前清理過期元素。
- 使用 pop 前先判空，否則會造成未定義行為。
- 雙端佇列在大區間操作時比 vector 頭部插入快，但隨機存取較慢。

## 與相似技巧的比較

堆疊是 LIFO，適合回溯；佇列是 FIFO，適合順序序處理。單調堆疊處理「下個更大元素」，單調佇列則處理「區間最大元素」，兩者的維護原則類似但問題維度不同。

## 例題與分級練習

先實作循環佇列模擬快取，再用單調佇列解決滑動視窗最大值，最後練習優先佇列合併多個有序串流。

## 本節重點速查

佇列變形關鍵在於「哪端進、哪端出」與「是否維護單調性」；單調佇列用雙端佇列維護，過期清頭、無用清尾、保證均攤線性。
