---
id: tree-basics
volume: upper
source_file: upper-volume
chapter: 4
section: '4.7'
title: 簡單樹上問題：重心與直徑
summary: 以子樹大小找重心，以兩次 BFS 找樹直徑，作為樹上分析的基礎工具。
prerequisites: [trees, bfs-dfs]
learning_goals:
  - 計算子樹大小並找出重心
  - 以兩次 BFS 求樹直徑
  - 理解重心與直徑的基本性質
concepts: [tree-centroid, tree-diameter]
complexity:
  time: O(n)
  space: O(n)
related_exercises: []
source_book_pages: [233, 246]
source_pdf_pages: [251, 264]
review_status: verified
---

## 這個技術解決什麼問題

樹的重心與直徑是最基本的結構資訊。重心常用於點分治的遞迴分解；直徑決定了樹上最遠距離，是許多樹上 DP 與貪婪策略的起點。

## 辨識題型的訊號

樹上最大距離、最小化最大子樹大小、刪除某點後的最大連通分量、樹上服務站選址。

## 核心想法與直覺

重心：若某點的最大子樹大小不超過 $n/2$，則稱為重心。直徑：任取一點做 BFS 到最遠點 $u$，再從 $u$ 做 BFS 到最遠點 $v$，則 $u$ 到 $v$ 為直徑端點。這在樹上正確性成立，但在有環圖上不成立。

## 狀態／資料結構定義

`subtree_size[v]` 為 DFS 中以 `v` 為根的子樹大小；`parent[v]` 為 DFS 樹中的父親。BFS 時記錄 `distance[v]`。

## 不變量或正確性證明

重心：若當前節點存在某子樹大小 $> n/2$，則重心一定在其中，可貪婪向下走。直徑：第一次 BFS 得到直徑的一端；假設直徑端點為 $a,b$，則從任意點出發的最遠點一定為 $a$ 或 $b$ 之一。

## 逐步演算法

### 重心
1. DFS 計算 `subtree_size`。
2. 對每個節點，最大子樹大小為 `max(n - subtree_size[v], max(subtree_size[child]))`。
3. 取最大值最小者即為重心。

### 直徑
1. 從任意點 BFS 找最遠點 `u`。
2. 從 `u` BFS 找最遠點 `v`，距離即為直徑長度。

## C++17 模板

```cpp
#include <algorithm>
#include <queue>
#include <vector>

class TreeBasics {
public:
    explicit TreeBasics(const std::vector<std::vector<int>>& adjacency)
        : graph(adjacency), node_count(static_cast<int>(adjacency.size())) {}

    std::vector<int> find_centroids() const {
        std::vector<int> subtree(node_count, 0);
        std::vector<int> parent(node_count, -1);
        dfs_subtree(0, -1, subtree, parent);

        std::vector<int> centroids;
        int min_max_part = node_count;
        for (int v = 0; v < node_count; ++v) {
            int max_part = node_count - subtree[v];
            for (int neighbor : graph[v]) {
                if (neighbor == parent[v]) {
                    continue;
                }
                max_part = std::max(max_part, subtree[neighbor]);
            }
            if (max_part < min_max_part) {
                min_max_part = max_part;
                centroids.clear();
                centroids.push_back(v);
            } else if (max_part == min_max_part) {
                centroids.push_back(v);
            }
        }
        return centroids;
    }

    int tree_diameter() const {
        auto [far_node, ignore] = bfs_farthest(0);
        auto [other_node, diameter] = bfs_farthest(far_node);
        (void)other_node;
        return diameter;
    }

private:
    std::vector<std::vector<int>> graph;
    int node_count;

    void dfs_subtree(
        int node,
        int parent_node,
        std::vector<int>& subtree,
        std::vector<int>& parent
    ) const {
        parent[node] = parent_node;
        subtree[node] = 1;
        for (int neighbor : graph[node]) {
            if (neighbor == parent_node) {
                continue;
            }
            dfs_subtree(neighbor, node, subtree, parent);
            subtree[node] += subtree[neighbor];
        }
    }

    std::pair<int, int> bfs_farthest(int source) const {
        std::vector<int> distance(node_count, -1);
        std::queue<int> q;
        q.push(source);
        distance[source] = 0;
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            for (int neighbor : graph[node]) {
                if (distance[neighbor] == -1) {
                    distance[neighbor] = distance[node] + 1;
                    q.push(neighbor);
                }
            }
        }
        int far = source;
        for (int v = 0; v < node_count; ++v) {
            if (distance[v] > distance[far]) {
                far = v;
            }
        }
        return {far, distance[far]};
    }
};
```

## 時間與空間複雜度

重心與直徑皆需遍歷全樹一次，時間 $O(n)$、空間 $O(n)$。

## 常見錯誤與邊界條件

重心計算時忘記「上方子樹」為 `n - subtree[v]`、BFS 未標記已訪問導致無限迴圈、森林未選每棵樹根分別處理。

## 與相似技巧的比較

重心用於點分治，直徑用於樹上距離分析。兩者都屬於 tree DP 的前置基礎，和 LCA、樹鏈剖分互補。

## 例題與分級練習

先求重心與直徑長度，再求直徑路徑上的點數，最後挑戰樹上所有簡單路徑最長長度（即直徑本身）。

## 本節重點速查

重心：最大子樹最小；直徑：兩次 BFS；皆 $O(n)$。注意森林情況需對每棵樹分別執行。
