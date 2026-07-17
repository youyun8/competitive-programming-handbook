---
id: fhq-treap
volume: upper
source_file: upper-volume
chapter: 4
section: '4.14'
title: FHQ Treap：以分裂與合併取代旋轉
summary: 不旋轉，僅用 split（按大小或鍵值）與 merge（按優先度）兩個基本操作維護期望 O(log n)。
prerequisites: [treap]
learning_goals:
  - 實作按鍵值與按大小的 split
  - 以 merge 組合子樹
  - 應用於隱式 Treap（序列維護）
concepts: [split, merge, implicit-treap]
complexity:
  time: expected O(log n)
  space: O(n)
related_exercises: []
source_book_pages: [341, 362]
source_pdf_pages: [359, 380]
review_status: verified
---

## 這個技術解決什麼問題

旋轉式 Treap 的邏輯容易出錯，且難以直接支援「按位置分裂」。FHQ Treap 只保留 split 與 merge，透過優先度自動維持堆性質，鍵值或位置維持 BST 性質，邏輯更簡潔，也更容易擴展到隱式 Treap（把陣列當 BST 維護）。

## 辨識題型的訊號

需要有序集合的 split/merge 操作、序列區間翻轉/插入/刪除（隱式 Treap）、可持久化 Treap（共用節點池）。

## 核心想法與直覺

`split(root, key)` 把樹切成兩棵：所有 `<= key` 的在左邊，其餘在右邊。分割過程中，根節點的優先度自動讓它留在正確的一側。`merge(left, right)` 則把兩棵所有鍵值都小於另一棵的樹合併，優先度高者為新根。

## 狀態／資料結構定義

節點含 `key`、`priority`、`left`、`right`、`size`。隱式 Treap 以 `size` 取代 `key`，或以索引當鍵值。

## 不變量或正確性證明

`split` 後左子樹所有節點的鍵值小於右子樹，且各自仍為合法 Treap。`merge` 假設左子樹所有鍵值小於右子樹，合併後鍵值順序與堆順序皆維持。遞迴深度由隨機優先度控制，期望 $O(\log n)$。

## 逐步演算法

1. `split(node, key)`：若 `node->key <= key`，右邊須切開，否則左邊須切開。遞迴後重接指標。
2. `merge(left, right)`：若一方為空則回傳另一方；比較優先度，高者為根，並遞迴合併其子樹。
3. 插入：先 `split(root, key)` 得到 `L, R`，再 `merge(merge(L, new_node), R)`。

## C++17 模板

```cpp
#include <cstdlib>
#include <memory>
#include <utility>

class FhqTreap {
public:
    struct Node {
        int key = 0;
        int priority = 0;
        std::unique_ptr<Node> left;
        std::unique_ptr<Node> right;
        int size = 1;
        explicit Node(int k) : key(k), priority(std::rand()) {}
    };

    void insert(int key) {
        auto [left, right] = split(std::move(root), key);
        root = merge(merge(std::move(left), std::make_unique<Node>(key)), std::move(right));
    }

    void erase(int key) {
        auto [left, mid_right] = split(std::move(root), key - 1);
        auto [mid, right] = split(std::move(mid_right), key);
        mid.reset();
        root = merge(std::move(left), std::move(right));
    }

    int kth(int k) const {
        return kth(root.get(), k);
    }

private:
    std::unique_ptr<Node> root;

    static int get_size(const Node* node) {
        return node ? node->size : 0;
    }

    static void update_size(Node* node) {
        if (node) {
            node->size = 1 + get_size(node->left.get()) + get_size(node->right.get());
        }
    }

    static std::pair<std::unique_ptr<Node>, std::unique_ptr<Node>> split(
        std::unique_ptr<Node> node,
        int key
    ) {
        if (!node) {
            return {nullptr, nullptr};
        }
        if (node->key <= key) {
            auto [left_mid, right] = split(std::move(node->right), key);
            node->right = std::move(left_mid);
            update_size(node.get());
            return {std::move(node), std::move(right)};
        }
        auto [left, right_mid] = split(std::move(node->left), key);
        node->left = std::move(right_mid);
        update_size(node.get());
        return {std::move(left), std::move(node)};
    }

    static std::unique_ptr<Node> merge(
        std::unique_ptr<Node> left,
        std::unique_ptr<Node> right
    ) {
        if (!left || !right) {
            return left ? std::move(left) : std::move(right);
        }
        if (left->priority > right->priority) {
            left->right = merge(std::move(left->right), std::move(right));
            update_size(left.get());
            return left;
        }
        right->left = merge(std::move(left), std::move(right->left));
        update_size(right.get());
        return right;
    }

    static int kth(const Node* node, int k) {
        if (!node) {
            return -1;
        }
        int left_size = get_size(node->left.get());
        if (k <= left_size) {
            return kth(node->left.get(), k);
        }
        if (k == left_size + 1) {
            return node->key;
        }
        return kth(node->right.get(), k - left_size - 1);
    }
};
```

## 時間與空間複雜度

`split` 與 `merge` 各期望 $O(\log n)$；插入與刪除為兩次 `split` 加兩次 `merge`，期望 $O(\log n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

`split` 條件用 `<=` 而 `erase` 用 `<` 導致刪錯節點、merge 前未保證左樹所有鍵值小於右樹、隱式 Treap 忘記更新 `size`。

## 與相似技巧的比較

旋轉式 Treap 邏輯更緊湊但需要左右旋轉與父指標維護；Splay 攤銷更強但實作複雜；FHQ Treap 的 split/merge 語義清晰，最容易改寫成可持久化版本。

## 例題與分級練習

先寫動態集合的插入刪除第 k 小，再做隱式 Treap 維護序列區間翻轉，最後改寫可持久化 Treap。

## 本節重點速查

兩個基本操作：split 與 merge；插入 = split + merge + merge；刪除 = split + split + merge；隱式以 size 當鍵值。
