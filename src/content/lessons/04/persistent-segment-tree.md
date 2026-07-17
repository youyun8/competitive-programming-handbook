---
id: persistent-segment-tree
volume: upper
source_file: upper-volume
chapter: 4
section: '4.4'
title: 可持久化線段樹：記錄每一個版本的歷史
summary: 每次修改只複製變動的節點的節點鏈，讓所有版本共享大部分結構，以 O(log n) 時空回答區間第 k 大。
prerequisites: [segment-tree, recursion]
learning_goals:
  - 建立持久化節點池
  - 以版本根區分歷史
  - 解決區間第 k 大問題
concepts: [version-control, persistence, kth-order-statistic]
complexity:
  time: O(log n) per version
  space: O(n log n)
related_exercises: []
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
review_status: verified
---

## 這個技術解決什麼問題

線段樹的每次修改會覆蓋舊資訊。可持久化線段樹在修改時只新建從根到葉的那條路徑上的節點，舊版本根仍指向完整的舊樹，因此可以隨時查詢任意歷史版本。

## 辨識題型的訊號

需要比較「修改前」與「修改後」的差異、線上查詢子陣列第 k 大、時間軸上的區間統計。

## 核心想法與直覺

把線段樹的節點當成不可變物件。更新某個位置時，從舊根複製一條新路徑，其餘子樹共用舊指標，因此時間與額外空間都只多 $O(\log n)$。

## 狀態／資料結構定義

動態配置節點池，每個節點有 `left`、`right` 子節點索引與 `sum` 計數。`root[version]` 指向該版本根節點。

## 不變量或正確性證明

因節點建立後不再修改，舊版本根到葉路徑上的所有節點保持不變。新版本只新建 $O(\log n)$ 個節點，因此兩個版本的結構仍各自為一棵合法線段樹。

## 逐步演算法

1. 建空樹（全零或全為初始陣列）。
2. 單點修改：以舊根為基礎，遞迴建立新路徑，非路徑上的子樹直接連回舊節點。
3. 查詢：和一般線段樹一樣從版本根開始遞迴。

## C++17 模板

```cpp
#include <vector>

class PersistentSegmentTree {
public:
    struct Node {
        int left_child = 0;
        int right_child = 0;
        int sum = 0;
    };

    explicit PersistentSegmentTree(int count) : size(count) {
        nodes.emplace_back();
        roots.push_back(0);
    }

    int update(int previous_root, int position, int delta) {
        int new_root = clone_node(previous_root);
        update(new_root, 0, size, position, delta);
        roots.push_back(new_root);
        return new_root;
    }

    int query_kth(int left_root, int right_root, int k) const {
        return query_kth(left_root, right_root, 0, size, k);
    }

private:
    int size;
    std::vector<Node> nodes;
    std::vector<int> roots;

    int clone_node(int index) {
        nodes.push_back(nodes[index]);
        return static_cast<int>(nodes.size()) - 1;
    }

    void update(int node, int left, int right, int position, int delta) {
        nodes[node].sum += delta;
        if (right - left == 1) {
            return;
        }
        int middle = left + (right - left) / 2;
        if (position < middle) {
            int new_left = clone_node(nodes[node].left_child);
            nodes[node].left_child = new_left;
            update(new_left, left, middle, position, delta);
        } else {
            int new_right = clone_node(nodes[node].right_child);
            nodes[node].right_child = new_right;
            update(new_right, middle, right, position, delta);
        }
    }

    int query_kth(int left_node, int right_node, int left, int right, int k) const {
        if (right - left == 1) {
            return left;
        }
        int middle = left + (right - left) / 2;
        int left_count = nodes[nodes[right_node].left_child].sum
                       - nodes[nodes[left_node].left_child].sum;
        if (left_count >= k) {
            return query_kth(
                nodes[left_node].left_child,
                nodes[right_node].left_child,
                left, middle, k
            );
        }
        return query_kth(
            nodes[left_node].right_child,
            nodes[right_node].right_child,
            middle, right, k - left_count
        );
    }
};
```

## 時間與空間複雜度

每個版本增加 $O(\log n)$ 節點，單次更新與查詢皆為 $O(\log n)$；總空間 $O(n + q \log n)$，離線離散化後通常簡記為 $O(n \log n)$。

## 常見錯誤與邊界條件

忘記離散化值域、新節點複製深度錯誤（只複製單邊）、查詢時版本根擅自複製而非直接使用舊根。

## 與相似技巧的比較

樹狀陣列可做單點版本快照，但區間歷史對應困難；主席樹（可持久化線段樹）是區間第 k 大標準解法。離線套個整體二分也可達成類似效果但犧牲線上能力。

## 例題與分級練習

先寫區間第 k 大，再做子陣列不同元素個數的持久化線段樹，最後挑戰時間軸上的區間修改與查詢。

## 本節重點速查

共用手指標、複製路徑；版本根陣列是歷史入口；配合離散化把值域壓到 $O(n)$。
