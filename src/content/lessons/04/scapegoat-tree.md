---
id: scapegoat-tree
volume: upper
source_file: upper-volume
chapter: 4
section: '4.12'
title: 替罪羊樹：以重建代替旋轉的平衡樹
summary: 當子樹不平衡率超過門檻 α，就選替罪羊節點整棵重建為完美平衡樹，攤銷 O(log n)。
prerequisites: [bst]
learning_goals:
  - 以不平衡門檻 α 觸發重建
  - 中序攤平後重建完美平衡樹
  - 分析替罪羊樹的攤銷複雜度
concepts: [scapegoat, rebuild, alpha-balanced]
complexity:
  time: amortized O(log n)
  space: O(n)
related_exercises: []
source_book_pages: [307, 322]
source_pdf_pages: [325, 340]
review_status: verified
---

## 這個技術解決什麼問題

普通二元搜尋樹因插入順序可能退化為鏈。替罪羊樹不旋轉，只在子樹「太不平衡」時整棵中序重建為平衡狀態，實作簡潔且攤銷效率優良。

## 辨識題型的訊號

需要平衡二元搜尋樹但不想寫複雜的旋轉邏輯；常數不大、但 insert/delete 操作頻繁且要求 $O(\log n)$。

## 核心想法與直覺

設定常數 $\alpha$（通常 $0.6 \sim 0.75$），當某子樹的 max(size(left), size(right)) > $\alpha \cdot$ size(node) 時，該節點成為替罪羊。刪除後若子樹過空，也向上找替罪羊重建。整棵中序收集再二分建樹即可達到完美平衡。

## 狀態／資料結構定義

每個節點含 `value`、`left`、`right`、`size`。另維護整棵樹的 `node_count` 與 `deleted_count`（或直接用實際大小判斷）。

## 不變量或正確性證明

重建後為完美 BST，因此高度 $O(\log n)$。替罪羊條件保證任何時候存在深度 $O(\log n)$ 的替罪羊祖先；攤銷分析顯示重建總成本可被之前 $O(n)$ 次操作均攤。

## 逐步演算法

1. 插入：沿 BST 路徑插入，同時更新 `size`。回溯時若某節點觸發替罪羊條件，以該子樹中序重建。
2. 刪除：標記刪除（懶惰）或真正刪除後更新大小；若整棵樹過空，重建整棵。
3. 重建：中序收集節點值，二分法遞迴建立完美平衡樹。

## C++17 模板

```cpp
#include <memory>
#include <vector>

class ScapegoatTree {
public:
    struct Node {
        int value = 0;
        std::unique_ptr<Node> left;
        std::unique_ptr<Node> right;
        int size = 1;
        bool deleted = false;
        explicit Node(int val) : value(val) {}
    };

    void insert(int value) {
        root = insert(std::move(root), value);
        if (need_rebuild_root()) {
            root = rebuild(std::move(root));
        }
    }

    bool contains(int value) const {
        return find(root.get(), value);
    }

private:
    std::unique_ptr<Node> root;
    static constexpr double ALPHA = 0.75;

    static int get_size(const Node* node) {
        return node ? node->size : 0;
    }

    static void update_size(Node* node) {
        if (node) {
            node->size = 1 + get_size(node->left.get()) + get_size(node->right.get());
        }
    }

    static bool is_unbalanced(const Node* node) {
        if (!node) {
            return false;
        }
        int max_child = std::max(get_size(node->left.get()), get_size(node->right.get()));
        return max_child > static_cast<int>(ALPHA * node->size) + 1;
    }

    std::unique_ptr<Node> insert(std::unique_ptr<Node> node, int value) {
        if (!node) {
            return std::make_unique<Node>(value);
        }
        if (value < node->value) {
            node->left = insert(std::move(node->left), value);
        } else {
            node->right = insert(std::move(node->right), value);
        }
        update_size(node.get());
        if (is_unbalanced(node.get())) {
            return rebuild(std::move(node));
        }
        return node;
    }

    bool find(const Node* node, int value) const {
        if (!node) {
            return false;
        }
        if (value == node->value) {
            return !node->deleted;
        }
        if (value < node->value) {
            return find(node->left.get(), value);
        }
        return find(node->right.get(), value);
    }

    static std::unique_ptr<Node> rebuild(std::unique_ptr<Node> node) {
        std::vector<int> values;
        collect_inorder(node.get(), values);
        return build_balanced(values, 0, static_cast<int>(values.size()));
    }

    static void collect_inorder(const Node* node, std::vector<int>& values) {
        if (!node) {
            return;
        }
        collect_inorder(node->left.get(), values);
        if (!node->deleted) {
            values.push_back(node->value);
        }
        collect_inorder(node->right.get(), values);
    }

    static std::unique_ptr<Node> build_balanced(
        const std::vector<int>& values,
        int left,
        int right
    ) {
        if (left >= right) {
            return nullptr;
        }
        int middle = left + (right - left) / 2;
        auto node = std::make_unique<Node>(values[middle]);
        node->left = build_balanced(values, left, middle);
        node->right = build_balanced(values, middle + 1, right);
        update_size(node.get());
        return node;
    }

    bool need_rebuild_root() const {
        if (!root) {
            return false;
        }
        int real = 0;
        count_real(root.get(), real);
        return real < static_cast<int>(ALPHA * root->size);
    }

    static void count_real(const Node* node, int& count) {
        if (!node) {
            return;
        }
        if (!node->deleted) {
            ++count;
        }
        count_real(node->left.get(), count);
        count_real(node->right.get(), count);
    }
};
```

## 時間與空間複雜度

查找 $O(\log n)$；插入與刪除在觸發重建時 $O(n)$，但攤銷後為 $O(\log n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

$\alpha$ 選太大（如 $0.9$）導致樹過淺但重建頻繁；忘記更新 `size` 導致不平衡判斷錯誤；懶惰刪除累積過多死節點。

## 與相似技巧的比較

替罪羊樹無旋轉、程式短，但常數比 Treap/Splay 大；Red-Black Tree 最嚴格但最複雜。替罪羊樹適合競賽中需要平衡 BST 但時間有限的情境。

## 例題與分級練習

先寫動態第 k 小，再寫區間計數，最後挑戰序列維護（配合中序序列化做區間操作）。

## 本節重點速查

$\alpha$ 控制平衡門檻；替罪羊觸發後中序攤平再二分重建；懶惰刪除後定期清理。無旋轉、好寫、攤銷穩定。
