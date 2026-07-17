---
id: heavy-light-decomposition
volume: upper
source_file: upper-volume
chapter: 4
section: '4.10'
title: 樹鏈剖分：把樹上路徑拆成 O(log n) 個區間
summary: 以重鏈將樹壓平為線性序列，讓樹上路徑查詢與修改降到 O(log² n)。
prerequisites: [trees, segment-tree, lca]
learning_goals:
  - 求出重兒子與鏈頂
  - 以 DFS 序建立線段樹基礎陣列
  - 查詢與修改樹上任意路徑
concepts: [heavy-path, light-edge, path-query]
complexity:
  time: O(log² n) per query
  space: O(n)
related_exercises: []
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

## 這個技術解決什麼問題

樹上路徑查詢（和、最大值、修改）若逐點處理太慢。樹鏈剖分把樹按重兒子優先走成一條鏈，每條鏈對應線段樹的一段連續區間，讓路徑跳躍次數變成 $O(\log n)$。

## 辨識題型的訊號

樹上點權或邊權路徑查詢、子樹查詢、換根問題（配合附加技巧）、需要同時支援 LCA 與路徑聚合。

## 核心想法與直覺

對每個節點，子樹最大的兒子為「重兒子」，鏈由其優先延伸。輕邊往上跳時，子樹大小至少翻倍，因此任意點到根最多經過 $O(\log n)$ 條輕邊。鏈頂（top）指同一條鏈的最高點，路徑查詢時同步跳 top 到 LCA。

## 狀態／資料結構定義

`parent`, `depth`, `heavy_child`, `size` 由第一次 DFS 求出。`top[v]` 為 `v` 所在重鏈的頂端。`dfn[v]` 為在線段樹基礎陣列中的位置，`rev[dfn[v]] = v`。

## 不變量或正確性證明

輕邊連接的兩個子樹，上方子樹大小至少為下方的兩倍，因此輕邊數量 $\le \log_2 n$。重鏈內節點的 DFS 序連續，因此鏈內區間可直接線段樹查詢。

## 逐步演算法

1. 第一次 DFS 求 `size`, `parent`, `depth`, `heavy_child`。
2. 第二次 DFS 分配 `top` 與 `dfn`，重兒子繼承 top，輕兒子自成新 top。
3. 以 `dfn` 建立線段樹或樹狀陣列。
4. 路徑查徑查詢：兩點同步往上跳，每次處理 top 較深的整條鏈，最後在 LCA 處合併。

## C++17 模板

```cpp
#include <algorithm>
#include <vector>

class HeavyLightDecomposition {
public:
    explicit HeavyLightDecomposition(const std::vector<std::vector<int>>& adjacency)
        : graph(adjacency), node_count(static_cast<int>(adjacency.size())),
          parent(node_count, -1), depth(node_count, 0),
          heavy(node_count, -1), top(node_count, 0),
          dfn(node_count, 0), size(node_count, 0) {
        dfs_size(0, -1);
        dfs_decompose(0, -1, 0, current_dfn);
    }

    bool is_ancestor(int ancestor, int descendant) const {
        return dfn[ancestor] <= dfn[descendant] &&
               dfn[descendant] < dfn[ancestor] + size[ancestor];
    }

    std::vector<std::pair<int, int>> path_ranges(int u, int v) const {
        std::vector<std::pair<int, int>> ranges;
        while (top[u] != top[v]) {
            if (depth[top[u]] < depth[top[v]]) {
                std::swap(u, v);
            }
            ranges.emplace_back(dfn[top[u]], dfn[u] + 1);
            u = parent[top[u]];
        }
        if (depth[u] > depth[v]) {
            std::swap(u, v);
        }
        ranges.emplace_back(dfn[u], dfn[v] + 1);
        return ranges;
    }

    int get_dfn(int node) const {
        return dfn[node];
    }

private:
    std::vector<std::vector<int>> graph;
    int node_count;
    std::vector<int> parent;
    std::vector<int> depth;
    std::vector<int> heavy;
    std::vector<int> top;
    std::vector<int> dfn;
    std::vector<int> size;
    int current_dfn = 0;

    void dfs_size(int node, int parent_node) {
        parent[node] = parent_node;
        size[node] = 1;
        int max_size = 0;
        for (int neighbor : graph[node]) {
            if (neighbor == parent_node) {
                continue;
            }
            depth[neighbor] = depth[node] + 1;
            dfs_size(neighbor, node);
            size[node] += size[neighbor];
            if (size[neighbor] > max_size) {
                max_size = size[neighbor];
                heavy[node] = neighbor;
            }
        }
    }

    void dfs_decompose(int node, int parent_node, int chain_top, int& out_dfn) {
        top[node] = chain_top;
        dfn[node] = out_dfn++;
        if (heavy[node] != -1) {
            dfs_decompose(heavy[node], node, chain_top, out_dfn);
        }
        for (int neighbor : graph[node]) {
            if (neighbor == parent_node || neighbor == heavy[node]) {
                continue;
            }
            dfs_decompose(neighbor, node, neighbor, out_dfn);
        }
    }
};
```

## 時間與空間複雜度

兩趟 DFS $O(n)$，每次路徑拆成 $O(\log n)$ 個區間，每個區間線段樹查詢 $O(\log n)$，因此單次路徑操作 $O(\log^2 n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

邊權轉點權時需特判 LCA、混用 0-indexed 與半開區間、top 跳躍條件寫錯導致無限迴圈。

## 與相似技巧的比較

LCA 倍增只回答祖先關係；樹鏈剖分同時回答路徑聚合。若只需子樹而非路徑，單純欧拉序 + 線段樹就夠用。Link-Cut Tree 可處理動態樹，但實作複雜度更高。

## 例題與分級練習

先做路徑最大值查詢，再做路徑加值與查詢，最後挑戰換根後的查詢（需額外判斷重心關係）。

## 本節重點速查

兩遍 DFS：求 size+heavy，分配 top+dfn。路徑操作時 top 不同就先處理較深的整條鏈。鏈內區間連續，可直送線段樹。
