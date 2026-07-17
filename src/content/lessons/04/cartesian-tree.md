---
id: cartesian-tree
volume: upper
source_file: upper-volume
chapter: 4
section: '4.15'
title: 笛卡兒樹：由堆積與中序同時定義的樹
summary: 以單調堆疊從陣列線性建樹，根為區間極值，中序即原陣列，可 O(1) RMQ。
prerequisites: [stack, bst]
learning_goals:
  - 以單調堆疊線性建笛卡兒樹
  - 理解堆積性與中序性的雙重約束
  - 應用於 RMQ 與其他區間極值問題
concepts: [cartesian-tree, monotone-stack, rmq]
complexity:
  time: O(n)
  space: O(n)
related_exercises: []
source_book_pages: [363, 376]
source_pdf_pages: [381, 394]
review_status: verified
---

## 這個技術解決什麼問題

若需要多次詢問陣列區間最小值（RMQ），且陣列不改變，可預先建立笛卡兒樹。樹上任意節點代表以該值為極值的區間，兩點的 LCA 即為區間極值，配合 LCA 的 $O(1)$ 查詢，可達到 $O(1)$ RMQ。

## 辨識題型的訊號

靜態陣列的區間最小值、最大矩形面積（直方圖）、區間眾數、某些序列 DP 的單調性優化。

## 核心想法與直覺

笛卡兒樹同時滿足「堆積性」與「中序等價於原序列」。根為整段最小值（或最大值），左子樹為其左邊子陣列的笛卡兒樹，右子樹為其右邊子陣列的笛卡兒樹。用單調堆疊可線性建構：維護遞增棧，每次遇到新元素時彈出較小者並調整父子關係。

## 狀態／資料結構定義

節點含 `value`、`left`、`right`、`parent`。建樹過程中，單調堆疊儲存當前右鍊（right spine）上的節點。

## 不變量或正確性證明

堆疊始終維持遞增順序，因此彈出的節點都是新元素左邊比它小的鄰居。新元素成為最後一個彈出節點的右孩子，同時也成為前一個棧頂的右孩子（若存在）。如此每個節點的父親一定是左右兩邊最近比它大的較小者。

## 逐步演算法

1. 初始化空堆疊與根指標。
2. 對每個元素從左到右：
   - 當堆疊不空且堆疊頂 `value < 當前 value`（大根堆則相反），彈出；最後彈出的節點設為當前節點的左孩子。
   - 若堆疊仍不空，當前節點設為堆疊頂的右孩子。
   - 當前節點入堆疊。
3. 堆疊底即為根。

## C++17 模板

```cpp
#include <stack>
#include <vector>

class CartesianTree {
public:
    struct Node {
        int value = 0;
        int left = -1;
        int right = -1;
        int parent = -1;
    };

    explicit CartesianTree(const std::vector<int>& values) {
        if (values.empty()) {
            return;
        }
        nodes.reserve(values.size());
        std::stack<int> st;
        for (int i = 0; i < static_cast<int>(values.size()); ++i) {
            nodes.push_back({values[i], -1, -1, -1});
            int last = -1;
            while (!st.empty() && nodes[st.top()].value < values[i]) {
                last = st.top();
                st.pop();
            }
            nodes[i].left = last;
            if (last != -1) {
                nodes[last].parent = i;
            }
            if (!st.empty()) {
                nodes[st.top()].right = i;
                nodes[i].parent = st.top();
            }
            st.push(i);
        }
        while (!st.empty()) {
            root = st.top();
            st.pop();
        }
    }

    int get_root() const {
        return root;
    }

    const Node& node_at(int index) const {
        return nodes[index];
    }

private:
    std::vector<Node> nodes;
    int root = -1;
};
```

## 時間與空間複雜度

每個元素最多入堆疊一次、出堆疊一次，時間 $O(n)$；空間 $O(n)$。

## 常見錯誤與邊界條件

大根堆與小根堆方向搞反、堆疊頂調整 `right` 時覆蓋舊值、陣列有相同值時比較條件未用 `<=` 或 `<` 統一導致結構歧義。

## 與相似技巧的比較

稀疏表做 RMQ 需 $O(n \log n)$ 空間；笛卡兒樹 + LCA 壓到 $O(n)$ 空間與 $O(1)$ 查詢（前提是 LCA 為 $O(1)$）。線段樹支援修改，笛卡兒樹只適合靜態陣列。

## 例題與分級練習

先寫線性建笛卡兒樹，再寫 RMQ（配合 LCA），最後挑戰最大矩形面積（直方圖，本質就是每根柱子當最小值的笛卡爾樹高度乘子樹大小）。

## 本節重點速查

小根或大根堆 + 中序還原原陣列；單調堆疊維護右鍊；每個節點父親為左右最近較大（或較小）者。
