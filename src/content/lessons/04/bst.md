---
id: bst
volume: upper
source_file: upper-volume
chapter: 4
section: '4.11'
title: 二元搜尋樹：以有序性加速查找
summary: 左小右大的有序性讓查找、插入、刪除可在 O(h) 完成，h 為樹高。
prerequisites: [trees, recursion]
learning_goals:
  - 維護 BST 的有序性質
  - 實作查找、插入、刪除
  - 理解中序遍歷與排序的關係
concepts: [binary-search-tree, inorder, bst-property]
complexity:
  time: O(h)
  space: O(h)
related_exercises: []
source_book_pages: [293, 306]
source_pdf_pages: [311, 324]
review_status: verified
---

## 這個技術解決什麼問題

在動態集合中維護有序資料，支援查找前驅後繼、排名、區間元素，並能以中序遍歷輸出排序結果。與排序陣列相比，BST 支援 $O(h)$ 插入與刪除。

## 辨識題型的訊號

動態有序集合、需要插入刪除同時查詢第 k 小、區間計數、前驅後繼。

## 核心想法與直覺

每個節點的左子樹全小於節點值，右子樹全大於節點值。查找如同二分搜尋：比當前節點小就向左，大就向右。刪除時若無子節點直接拔，若有一個子節點則子承父位，若有兩個子節點則以右子樹最小值取代。

## 狀態／資料結構定義

節點含 `value`、`left_child`、`right_child`。可選加 `size` 或 `count` 支援排名與第 k 小。

## 不變量或正確性證明

中序遍歷嚴格遞增。插入與刪除僅在局部替換，維護 BST 性質。查找若存在，唯一路徑必達該值。

## 逐步演算法

1. 查找：從根開始比大小，直到找到或到空節點。
2. 插入：沿查找路徑走到空位，建立新節點。
3. 刪除：
   - 葉節點：直接移除。
   - 單子節點：以子節點取代。
   - 雙子節點：找右子樹最小值取代，再遞迴刪除該最小值節點。

## C++17 模板

```cpp
#include <memory>

class BinarySearchTree {
public:
    struct Node {
        int value = 0;
        std::unique_ptr<Node> left;
        std::unique_ptr<Node> right;
        explicit Node(int val) : value(val) {}
    };

    void insert(int value) {
        root = insert(std::move(root), value);
    }

    bool contains(int value) const {
        return find(root.get(), value);
    }

    void erase(int value) {
        root = erase(std::move(root), value);
    }

private:
    std::unique_ptr<Node> root;

    std::unique_ptr<Node> insert(std::unique_ptr<Node> node, int value) {
        if (!node) {
            return std::make_unique<Node>(value);
        }
        if (value < node->value) {
            node->left = insert(std::move(node->left), value);
        } else if (value > node->value) {
            node->right = insert(std::move(node->right), value);
        }
        return node;
    }

    bool find(const Node* node, int value) const {
        if (!node) {
            return false;
        }
        if (value == node->value) {
            return true;
        }
        if (value < node->value) {
            return find(node->left.get(), value);
        }
        return find(node->right.get(), value);
    }

    std::unique_ptr<Node> erase(std::unique_ptr<Node> node, int value) {
        if (!node) {
            return nullptr;
        }
        if (value < node->value) {
            node->left = erase(std::move(node->left), value);
            return node;
        }
        if (value > node->value) {
            node->right = erase(std::move(node->right), value);
            return node;
        }
        if (!node->left) {
            return std::move(node->right);
        }
        if (!node->right) {
            return std::move(node->left);
        }
        Node* successor = node->right.get();
        while (successor->left) {
            successor = successor->left.get();
        }
        node->value = successor->value;
        node->right = erase(std::move(node->right), successor->value);
        return node;
    }
};
```

## 時間與空間複雜度

高度 $h$ 決定一切：查找、插入、刪除皆 $O(h)$，遞迴深度 $O(h)$。若樹退化為鏈，則退化為 $O(n)$。

## 常見錯誤與邊界條件

刪除時只複製值但忘了再刪除後繼節點、重複值未以計數處理、回傳指標移動導致記憶體泄漏或懸空。

## 與相似技巧的比較

排序陣列查找 $O(\log n)$ 但插入 $O(n)$；雜湊表插入刪除 $O(1)$ 但無序；Treap/Splay/Red-Black Tree 確保 $h = O(\log n)$。BST 是很多進階平衡樹的共同基礎。

## 例題與分級練習

先寫基本查找與刪除，再維護子樹大小做第 k 小與排名查詢，最後寫區間計數（>= L 且 <= R）。

## 本節重點速查

左小右大；中序有序；刪除雙子節點用後繼取代；退化鏈高度為 $n$。
