---
id: treap
volume: upper
source_file: upper-volume
chapter: 4
section: '4.13'
title: Treap：以隨機堆積保持期望平衡
summary: 每個節點同時有鍵值與隨機優先度，以旋轉維護堆積順序，讓樹高期望 O(log n)。
prerequisites: [bst, randomization]
learning_goals:
  - 理解鍵值與優先度的雙重順序
  - 以旋轉維護堆積性質
  - 實作旋轉式插入與刪除
concepts: [treap, rotation, heap-property]
complexity:
  time: expected O(log n)
  space: O(n)
related_exercises: []
source_book_pages: [323, 340]
source_pdf_pages: [341, 358]
review_status: verified
---

## 這個技術解決什麼問題

BST 的平衡依賴輸入順序。Treap 為每個節點附加隨機優先度，同時滿足 BST 性質（按鍵值）與堆性質（按優先度）。隨機優先度使樹的形狀類似隨機BST，期望高度 $O(\log n)$。

## 辨識題型的訊號

需要有序集合且不能依賴輸入順序；實作相對簡單的平衡樹；要求第 k 小、區間查詢等順序統計操作。

## 核心想法與直覺

想像一疊隨機插入的卡片：先來的優先度隨機，高的在上層。左旋與右旋如同把某張卡片轉上來，但不破壞 BST 順序。旋轉只改變三條邊，因此 $O(1)$。

## 狀態／資料結構定義

節點含 `key`、`priority`、`left`、`right`、`size`。`priority` 通常由亂數產生器決定。

## 不變量或正確性證明

BST 性質保證中序有序；堆性質保證高優先度節點在上層。旋轉後仍同時維持兩種性質。隨機優先度對應隨機排列，其對應的笛卡爾樹期望高度為 $O(\log n)$。

## 逐步演算法

1. 插入：像 BST 插入到葉子，然後沿父鏈旋轉上提，直到父親優先度較高。
2. 刪除：把節點旋轉到葉子後移除；或像 BST 找後繼替換。
3. 旋轉：右旋讓左孩子成為新根，左旋讓右孩子成為新根，同時更新 `size`。

## C++17 模板

```cpp
#include <cstdlib>
#include <memory>

class Treap {
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
        root = insert(std::move(root), std::make_unique<Node>(key));
    }

    void erase(int key) {
        root = erase(std::move(root), key);
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

    static std::unique_ptr<Node> rotate_right(std::unique_ptr<Node> node) {
        auto new_root = std::move(node->left);
        node->left = std::move(new_root->right);
        update_size(node.get());
        new_root->right = std::move(node);
        update_size(new_root.get());
        return new_root;
    }

    static std::unique_ptr<Node> rotate_left(std::unique_ptr<Node> node) {
        auto new_root = std::move(node->right);
        node->right = std::move(new_root->left);
        update_size(node.get());
        new_root->left = std::move(node);
        update_size(new_root.get());
        return new_root;
    }

    static std::unique_ptr<Node> insert(
        std::unique_ptr<Node> node,
        std::unique_ptr<Node> new_node
    ) {
        if (!node) {
            return new_node;
        }
        if (new_node->key < node->key) {
            node->left = insert(std::move(node->left), std::move(new_node));
            if (node->left->priority > node->priority) {
                node = rotate_right(std::move(node));
            }
        } else {
            node->right = insert(std::move(node->right), std::move(new_node));
            if (node->right->priority > node->priority) {
                node = rotate_left(std::move(node));
            }
        }
        update_size(node.get());
        return node;
    }

    static std::unique_ptr<Node> erase(std::unique_ptr<Node> node, int key) {
        if (!node) {
            return nullptr;
        }
        if (key < node->key) {
            node->left = erase(std::move(node->left), key);
        } else if (key > node->key) {
            node->right = erase(std::move(node->right), key);
        } else {
            if (!node->left) {
                return std::move(node->right);
            }
            if (!node->right) {
                return std::move(node->left);
            }
            if (node->left->priority > node->right->priority) {
                node = rotate_right(std::move(node));
                node->right = erase(std::move(node->right), key);
            } else {
                node = rotate_left(std::move(node));
                node->left = erase(std::move(node->left), key);
            }
        }
        update_size(node.get());
        return node;
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

旋轉 $O(1)$；查找、插入、刪除期望 $O(\log n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

忘記更新 `size`、優先度衝突（需用穩定比較）、遞迴深度在退化情況過深、亂數種子未設定或只用 `rand()` 在多執行緒有問題。

## 與相似技巧的比較

Treap 實作比 Splay 直覺，比替罪羊樹更省空間（不用重建緩衝區）。FHQ Treap 用 split/merge 代替旋轉，更適合序列維護。

## 例題與分級練習

先做動態第 k 小，再做區間計數與前驅後繼，最後挑戰以 Treap 維護動態序列（翻轉、插入）。

## 本節重點速查

鍵值維持 BST，優先度維持堆；旋轉上提高優先度節點；期望高度 $O(\log n)$；維護 size 即可做排名查詢。
