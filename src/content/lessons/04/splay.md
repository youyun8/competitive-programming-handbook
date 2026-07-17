---
id: splay
volume: upper
source_file: upper-volume
chapter: 4
section: '4.16'
title: Splay：以旋轉將最近存取點推向根
summary: 每次操作後把該節點旋轉到根，利用存取局部性達到 amortized O(log n)。
prerequisites: [bst]
learning_goals:
  - 實作 zig、zig-zig、zig-zag 旋轉
  - 把任意節點 splay 到根
  - 理解攤銷分析的潛能函數直覺
concepts: [splay, zig-zag, amortized-analysis]
complexity:
  time: amortized O(log n)
  space: O(n)
related_exercises: []
source_book_pages: [377, 402]
source_pdf_pages: [395, 420]
review_status: verified
---

## 這個技術解決什麼問題

普通 BST 退化嚴重，而平衡樹的嚴格旋轉規則太複雜。Splay Tree 用「每存取一次就旋轉到根」的簡單規則，讓經常存取的節點靠近根，攤銷複雜度仍為 $O(\log n)$。

## 辨識題型的訊號

需要平衡二元搜尋樹且常會重複存取某區間；或需要一個簡單的攤銷結構做序列分裂與合併（配合隱式 Splay）。

## 核心想法與直覺

存取一個節點後，把它一路旋轉到根。若它和父親、祖父共線（同為左或同為右），先旋轉父親再旋轉自己（zig-zig）；若不共線，連續兩次旋轉自己（zig-zag）。這種「雙旋」可避免單旋導致的惡化，同時使樹趨向平衡。

## 狀態／資料結構定義

節點含 `key`、`left`、`right`、`parent`。旋轉時更新 `parent` 指標，並向上傳遞 `size`（若為順序統計樹）。

## 不變量或正確性證明

每次旋轉只改變三條邊，BST 性質不變。splay 過程的攤銷分析以子樹大小為潛能函數，證明每次 splay 的攤銷代價為 $O(\log n)$。

## 逐步演算法

1. `rotate(node)`：判斷 node 是父親的左或右孩子，以對應的右旋或左旋提升 node。
2. `splay(node)`：
   - 若父親為根，單旋（zig）。
   - 若 node 與父親同向，先旋父親再旋 node（zig-zig）。
   - 若 node 與父親異向，連旋 node 兩次（zig-zag）。
3. 查找/插入/刪除後都執行 splay。

## C++17 模板

```cpp
#include <memory>

class SplayTree {
public:
    struct Node {
        int key = 0;
        Node* left = nullptr;
        Node* right = nullptr;
        Node* parent = nullptr;
        explicit Node(int k) : key(k) {}
    };

    ~SplayTree() {
        delete_tree(root);
    }

    void insert(int key) {
        Node* node = root;
        Node* parent = nullptr;
        while (node) {
            parent = node;
            if (key < node->key) {
                node = node->left;
            } else {
                node = node->right;
            }
        }
        node = new Node(key);
        node->parent = parent;
        if (!parent) {
            root = node;
        } else if (key < parent->key) {
            parent->left = node;
        } else {
            parent->right = node;
        }
        splay(node);
    }

    bool find(int key) {
        Node* node = root;
        while (node) {
            if (key == node->key) {
                splay(node);
                return true;
            }
            if (key < node->key) {
                node = node->left;
            } else {
                node = node->right;
            }
        }
        return false;
    }

private:
    Node* root = nullptr;

    static void set_child(Node* parent, Node* child, bool is_left) {
        if (parent) {
            if (is_left) {
                parent->left = child;
            } else {
                parent->right = child;
            }
        }
        if (child) {
            child->parent = parent;
        }
    }

    static bool is_left_child(Node* node) {
        return node->parent && node->parent->left == node;
    }

    void rotate(Node* node) {
        Node* parent = node->parent;
        Node* grandparent = parent ? parent->parent : nullptr;
        bool node_is_left = is_left_child(node);
        if (node_is_left) {
            set_child(parent, node->right, true);
            set_child(node, parent, false);
        } else {
            set_child(parent, node->left, false);
            set_child(node, parent, true);
        }
        node->parent = grandparent;
        if (grandparent) {
            if (grandparent->left == parent) {
                grandparent->left = node;
            } else {
                grandparent->right = node;
            }
        } else {
            root = node;
        }
    }

    void splay(Node* node) {
        while (node->parent) {
            Node* parent = node->parent;
            Node* grandparent = parent->parent;
            if (!grandparent) {
                rotate(node);
            } else if (is_left_child(node) == is_left_child(parent)) {
                rotate(parent);
                rotate(node);
            } else {
                rotate(node);
                rotate(node);
            }
        }
    }

    static void delete_tree(Node* node) {
        if (!node) {
            return;
        }
        delete_tree(node->left);
        delete_tree(node->right);
        delete node;
    }
};
```

## 時間與空間複雜度

單次 splay 最壞 $O(n)$，但攤銷 $O(\log n)$。任何 $m$ 次操作的序列總代價 $O(m \log n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

旋轉後未更新根指標、zig-zig 與 zig-zag 條件判斷錯誤、parent 指標未正確維護導致結構斷裂、記憶體未釋放。

## 與相似技巧的比較

Treap 用亂數維持期望平衡，實作較短；Splay 無亂數依賴，且有「存取加速」優勢，但單次操作不保證 $O(\log n)$。FHQ Treap 用 split/merge 更適合序列維護；Splay 則是 Link-Cut Tree 的標準底層結構。

## 例題與分級練習

先寫基本查找與插入，再寫區間翻轉的隱式 Splay，最後實作序列維護（split by size + merge）。

## 本節重點速查

存取後旋到根；zig（單旋）、zig-zig（同向雙旋）、zig-zag（異向雙旋）；旋轉時維護 parent 與根指標；攤銷 O(log n)。
