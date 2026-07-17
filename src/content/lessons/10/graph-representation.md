---
id: graph-representation
volume: lower
source_file: lower-volume
chapter: 10
section: '10.1'
title: 圖的儲存：鄰接矩陣、鄰接表與鏈式前向星
summary: 選擇適合題目規模與操作需求的圖儲存方式，是圖論演算法的第一步。
prerequisites: [arrays]
learning_goals:
  - 依據稠密度選擇鄰接矩陣或鄰接表
  - 實作鏈式前向星降低常數
  - 處理重邊、自環與無向邊的儲存細節
concepts: [adjacency-list, adjacency-matrix, graph-storage]
complexity:
  time: O(1) add edge
  space: O(V + E) adjacency list, O(V^2) matrix
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

把抽象圖的點與邊放進記憶體，使後續遍歷、修改與查詢能高效進行。

## 辨識題型的訊號

所有圖論題目的前置步驟。特別注意點數 V、邊數 E、是否需要快速判斷兩點間是否有邊、是否需要權重。

## 核心想法與直覺

鄰接矩陣像一張表格，查詢兩點間有無邊只需 O(1)，但空間與 V^2 成正比。鄰接表只儲存實際存在的邊，空間 O(V+E)，是稀疏圖的首選。鏈式前向星用單一陣列模擬鏈表，常數更小且快取友好。

## 狀態／資料結構定義

鄰接矩陣：`adj_matrix[u][v]` 表示邊權或是否存在。鄰接表：`adj[u]` 為 `(v, weight)` 的向量。鏈式前向星：用 `head[u]` 指向最後一條出邊，`to[i]`、`weight[i]`、`next_edge[i]` 描述邊 i，再更新 `head[u] = i`。

## 不變量或正確性證明

每種儲存方式都完整保留所有邊的端點與權重資訊，差異僅在於訪問方式與空間效率。無論選哪種，遍歷點 u 的所有鄰接點都能正確枚舉所有以 u 為起點的邊。

## 逐步演算法

鄰接表：每次讀入 `(u,v,w)`，壓入 `adj[u]`；無向圖同時壓入 `adj[v]`。鏈式前向星：維護邊計數器 `edge_count`，填寫 `to`、`weight`、`next_edge = head[u]`，再更新 `head[u] = edge_count++`。

## C++17 模板

```cpp
#include <vector>

struct Edge {
    int to = 0;
    int weight = 0;
};

using AdjacencyList = std::vector<std::vector<Edge>>;

struct ForwardStar {
    static const int MAX_EDGES = 200000;
    std::vector<int> head;
    std::vector<int> to;
    std::vector<int> weight;
    std::vector<int> next_edge;
    int edge_count = 0;

    explicit ForwardStar(int node_count) : head(node_count, -1) {
        to.reserve(MAX_EDGES);
        weight.reserve(MAX_EDGES);
        next_edge.reserve(MAX_EDGES);
    }

    void add_edge(int u, int v, int w) {
        to.push_back(v);
        weight.push_back(w);
        next_edge.push_back(head[u]);
        head[u] = edge_count++;
    }
};
```

## 時間與空間複雜度

建構時間 O(E)。鄰接表空間 O(V+E)，鄰接矩陣 O(V^2)。鏈式前向星空間與鄰接表同級，但常數更小。

## 常見錯誤與邊界條件

無向邊只加一個方向；自環導致 DFS/BFS 無窮迴圈；重邊未保留導致最短路演算法出錯；鏈式前向星邊數預留不足；1-based 與 0-based 節點編號混用。

## 與相似技巧的比較

陣列模擬鏈表（鏈式前向星）比 `std::vector` 更快，但可讀性較差。稠密圖（E 接近 V^2）直接用鄰接矩陣更簡潔。需要動態刪邊時，鄰接矩陣或連結串列更靈活。

## 例題與分級練習

基本圖遍歷、選擇儲存方式實作最短路、統計入度出度、判斷重邊與自環。

## 本節重點速查

稀疏圖用鄰接表；稠密圖用矩陣；無向邊加雙向；鏈式前向星常數小。
