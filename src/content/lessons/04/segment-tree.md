---
id: segment-tree
volume: upper
source_file: upper-volume
chapter: 4
section: '4.3'
title: 線段樹：把區間拆成可合併摘要
summary: 由節點摘要、combine 與 lazy tag 三個介面理解區間查詢與更新。
prerequisites: [recursion, divide-and-conquer]
learning_goals: [定義節點摘要, 完成區間查詢, 理解 lazy propagation]
concepts: [range-query, monoid, lazy-propagation]
complexity:
  time: O(log n) per query or update
  space: O(n)
related_exercises: ['fenwick-tree-query']
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
visualizer: segment-tree
---

## 這個技術解決什麼問題

當陣列會更新，又要反覆查詢區間和、最小值、最大值或其他可合併資訊時，線段樹把任意區間拆成 $O(\log n)$ 個節點摘要。

## 辨識題型的訊號

點更新＋區間查詢、區間更新＋區間查詢、需要自訂合併規則，且離線排序或前綴和不足以處理修改。

## 核心想法與直覺

每個節點負責一段半開區間。父節點的答案由左右兒子 `combine`。查詢完全覆蓋就直接取摘要，部分覆蓋才遞迴。

## 狀態／資料結構定義

範例維護區間和。`tree[node]` 是節點區間總和；葉節點是一個元素。

## 不變量或正確性證明

建樹後，每個節點摘要等於其完整區間的答案。更新只重算根到葉路徑；查詢選出的節點區間互不重疊且聯集正好是目標區間。

## 逐步演算法

建樹、點更新、區間查詢各自維持同一個區間定義。區間修改時，lazy tag 表示「已作用於本節點摘要，但尚未下推給孩子」。

## C++17 模板

```cpp
#include <algorithm>
#include <vector>

class SegmentTree {
public:
    explicit SegmentTree(const std::vector<long long>& values)
        : size(static_cast<int>(values.size())),
          tree(static_cast<std::size_t>(std::max(1, size)) * 4, 0) {
        if (size > 0) {
            build(1, 0, size, values);
        }
    }

    long long query(int query_left, int query_right) const {
        if (size == 0 || query_left >= query_right) {
            return 0;
        }
        return query(1, 0, size, query_left, query_right);
    }

private:
    int size;
    std::vector<long long> tree;

    void build(int node, int left, int right, const std::vector<long long>& values) {
        if (right - left == 1) {
            tree[node] = values[left];
            return;
        }
        int middle = left + (right - left) / 2;
        build(node * 2, left, middle, values);
        build(node * 2 + 1, middle, right, values);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }

    long long query(int node, int left, int right, int query_left, int query_right) const {
        if (query_right <= left || right <= query_left) {
            return 0;
        }
        if (query_left <= left && right <= query_right) {
            return tree[node];
        }
        int middle = left + (right - left) / 2;
        return query(node * 2, left, middle, query_left, query_right) +
               query(node * 2 + 1, middle, right, query_left, query_right);
    }
};
```

## 時間與空間複雜度

建樹 $O(n)$；一般區間查詢與更新 $O(\log n)$；陣列式儲存使用 $O(n)$ 空間。

## 常見錯誤與邊界條件

混用閉區間、空陣列、lazy tag 合成順序錯誤、查詢的單位元選錯。最大值查詢的不相交回傳值不能固定用 `0`。

## 與相似技巧的比較

樹狀陣列常數小，但主要適合可逆前綴資訊；Sparse Table 不支援更新；分塊較簡單但單次通常是根號複雜度。

## 例題與分級練習

依序做區間和、區間最小值、區間加法＋區間和，再挑戰最大子段和的節點摘要。

## 本節重點速查

先寫清楚節點代表什麼、如何合併、單位元是什麼，再決定是否需要 lazy tag。
