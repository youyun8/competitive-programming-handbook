---
id: link-cut-tree
volume: upper
source_file: upper-volume
chapter: 4
section: '4.18'
title: 動態樹與 LCT：以 Splay 維護輔助森林
summary: 把樹分解為偏好路徑，以 Splay 維護輔助樹，動態連邊、斷邊並路徑聚合，攤銷 O(log n)。
prerequisites: [splay, trees]
learning_goals:
  - 理解偏好路徑與輔助樹的對應關係
  - 實作 access、makeroot、link、cut
  - 支援路徑查詢與修改
concepts: [link-cut-tree, splay-auxiliary, path-aggregate]
complexity:
  time: amortized O(log n)
  space: O(n)
related_exercises: []
source_book_pages: [421, 448]
source_pdf_pages: [439, 466]
review_status: verified
---

## 這個技術解決什麼問題

靜態樹的剖分與 LCA 無法應付「隨時連邊、斷邊，同時查詢路徑資訊」的動態森林問題。LCT 把每棵樹表示為一組偏好路徑（preferred path），每條路徑以 Splay 維護，實現動態連邊、斷邊與路徑聚合。

## 辨識題型的訊號

動態連通性帶路徑查詢、最小生成樹的動態維護（加邊刪邊）、網路流中的動態樹優化、需要支援換根的樹上路徑操作。

## 核心想法與直覺

每個節點同時屬於「原樹」與「輔助樹（auxiliary tree）」。`access(v)` 把從根到 `v` 的路徑變成偏好路徑，並以 Splay 維護這條路徑為一個連續區間。`makeroot(v)` 則透過 `access(v)` + `reverse` 把 `v` 變成根，讓任意路徑都能被表示。

## 狀態／資料結構定義

節點含 `left`、`right`、`parent`（在輔助樹中的父親，同時也代表原樹中的路徑父親）。`path_parent` 的概念由「輔助樹根的原樹父親」扮演。另需 `reverse` 懶惰標記實現換根。

## 不變量或正確性證明

`access` 後，從原樹根到 `v` 的路徑恰好對應一個 Splay 中序序。`makeroot` 透過翻轉使 `v` 成為該路徑最左端，即新的原樹根。link 與 cut 只改變偏好路徑的端點連接，不影響其他路徑的結構不變量。

## 逐步演算法

1. `is_root(x)`：判斷 x 在其輔助樹父親的 splay 中是否為根（父親為空，或 x 不是父親的左/右孩子）。
2. `push(x)`：下傳 reverse 標記，交換左右子樹。
3. `rotate` / `splay`：標準 Splay 旋轉，但 `is_root` 決定是否已達輔助樹根。
4. `access(x)`：反覆 splay(x)，把右子樹設為上一次 access 的輔助樹，然後沿 `parent` 向上。
5. `makeroot(x)`：`access(x)`，splay(x)，打 `reverse` 標記。
6. `link(x, y)`：`makeroot(x)`，`access(y)`，設 `x->parent = y`。
7. `cut(x, y)`：`makeroot(x)`，`access(y)`，`splay(y)`，分離 `y` 的左子樹。

## C++17 模板

```cpp
#include <algorithm>
#include <vector>

class LinkCutTree {
public:
    struct Node {
        int left = 0;
        int right = 0;
        int parent = 0;
        bool reverse = false;
    };

    explicit LinkCutTree(int count) : nodes(count + 1) {}

    bool is_connected(int x, int y) {
        if (x == y) {
            return true;
        }
        makeroot(x);
        access(y);
        splay(y);
        return nodes[y].left != 0;
    }

    void link(int x, int y) {
        makeroot(x);
        if (!is_connected(x, y)) {
            nodes[x].parent = y;
        }
    }

    void cut(int x, int y) {
        makeroot(x);
        access(y);
        splay(y);
        if (nodes[y].left == x && nodes[x].right == 0) {
            nodes[y].left = 0;
            nodes[x].parent = 0;
        }
    }

    void makeroot(int x) {
        access(x);
        splay(x);
        toggle(x);
    }

    int findroot(int x) {
        access(x);
        splay(x);
        push_down(x);
        while (nodes[x].left) {
            x = nodes[x].left;
            push_down(x);
        }
        splay(x);
        return x;
    }

private:
    std::vector<Node> nodes;

    bool is_root(int x) const {
        int p = nodes[x].parent;
        return p == 0 || (nodes[p].left != x && nodes[p].right != x);
    }

    void push_down(int x) {
        if (nodes[x].reverse) {
            toggle(nodes[x].left);
            toggle(nodes[x].right);
            nodes[x].reverse = false;
        }
    }

    void toggle(int x) {
        if (x == 0) {
            return;
        }
        std::swap(nodes[x].left, nodes[x].right);
        nodes[x].reverse ^= true;
    }

    void rotate(int x) {
        int p = nodes[x].parent;
        int g = nodes[p].parent;
        if (nodes[p].left == x) {
            nodes[p].left = nodes[x].right;
            if (nodes[x].right) {
                nodes[nodes[x].right].parent = p;
            }
            nodes[x].right = p;
        } else {
            nodes[p].right = nodes[x].left;
            if (nodes[x].left) {
                nodes[nodes[x].left].parent = p;
            }
            nodes[x].left = p;
        }
        nodes[p].parent = x;
        nodes[x].parent = g;
        if (g) {
            if (nodes[g].left == p) {
                nodes[g].left = x;
            } else if (nodes[g].right == p) {
                nodes[g].right = x;
            }
        }
    }

    void splay(int x) {
        static std::vector<int> stk;
        stk.clear();
        int y = x;
        stk.push_back(y);
        while (!is_root(y)) {
            y = nodes[y].parent;
            stk.push_back(y);
        }
        while (!stk.empty()) {
            push_down(stk.back());
            stk.pop_back();
        }
        while (!is_root(x)) {
            int p = nodes[x].parent;
            int g = nodes[p].parent;
            if (!is_root(p)) {
                if ((nodes[p].left == x) ^ (nodes[g].left == p)) {
                    rotate(x);
                } else {
                    rotate(p);
                }
            }
            rotate(x);
        }
    }

    void access(int x) {
        int last = 0;
        for (int y = x; y != 0; y = nodes[y].parent) {
            splay(y);
            nodes[y].right = last;
            last = y;
        }
        splay(x);
    }
};
```

## 時間與空間複雜度

`access` 與 `splay` 攤銷 $O(\log n)$，`makeroot`、`link`、`cut` 皆為數次 `access`/`splay`，因此亦為攤銷 $O(\log n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

`is_root` 與普通 BST 的根不同，是指在輔助樹中的根；`push_down` 順序錯誤導致 reverse 標記未下傳、access 後忘記 splay、link 前沒 makeroot 導致環。

## 與相似技巧的比較

並查集只回答連通性，不支援刪邊與路徑查詢；樹鏈剖分只適用靜態樹。LCT 是唯一同時支援動態連邊斷邊與路徑聚合的標準結構，但常數較大、實作門檻高。

## 例題與分級練習

先做動態連通性（連邊、斷邊、查詢是否連通），再做路徑最大值查詢，最後挑戰動態 MST（邊插入與刪除）。

## 本節重點速查

偏好路徑對應 Splay；access 把根到點拉成同一個 Splay；makeroot = access + reverse；link 前記得 makeroot。核心 bugs 都在 push_down 與 is_root 的邊界。
