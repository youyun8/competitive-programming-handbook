---
id: undirected-connectivity
volume: lower
source_file: lower-volume
chapter: 10
section: '10.4'
title: 無向圖連通性：割點、橋與雙連通分量
summary: 以 DFS 時間戳與 low 值，線性找出關鍵節點與關鍵邊，並分解雙連通分量。
prerequisites: [graphs, dfs]
learning_goals:
  - 計算 dfn 與 low 值
  - 判斷割點與橋的條件
  - 以 stack 輔助分解點/邊雙連通分量
concepts: [articulation-point, bridge, biconnected-component, low-link]
complexity:
  time: O(V + E)
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

找出無向圖中，移除後會增加連通分量數量的節點（割點）與與邊（橋），並將圖分解為不存在割點的極大子子圖（點雙連通分量）或不存在橋的極大子圖（邊雙連通分量）。

## 辨識題型的訊號

關鍵基礎設施、網路脆弱點、必經道路、聯通塊加分量分解、仙人掌圖判定。

## 核心想法與直覺

DFS 樹上，若某子樹無法透過非樹邊連回祖先，則連接它們的樹邊就是橋，而它們的共同祖先就是割點。low 值記錄該子樹能連到的最小祖先時間戳。

## 狀態／資料結構定義

`dfn[u]`：DFS 發現順序；`low[u]`：u 及其後代能透過非樹邊連回的最小 dfn；父邊編號避免把來時路當回邊。

## 不變量或正確性證明

對 DFS 樹上的邊 `(u,v)`（v 為 u 的子節點），若 `low[v] > dfn[u]`，則 v 子樹無法連回 u 及其祖先，移除該邊後 u 與 v 不連通，故為橋。若 u 為根且有多棵子樹，或 u 非根且存在子節點 v 使 `low[v] >= dfn[u]`，則 u 為割點。

## 逐步演算法

1. DFS 遞迴，記錄 dfn 與 low；
2. 對每條非父邊更新 `low[u] = min(low[u], dfn[v])`；
3. 回溯時 `low[u] = min(low[u], low[v])`；
4. 依條件標記割點與橋；
5. 用 stack 記錄邊，遇到橋或割點條件滿足時彈出形成分量。

## C++17 模板

```cpp
#include <vector>

struct GraphEdge {
    int to;
    int index;
};

struct ArticulationBridge {
    std::vector<int> dfn;
    std::vector<int> low;
    std::vector<bool> is_cut;
    std::vector<bool> is_bridge;
    int timer = 0;

    void dfs(const std::vector<std::vector<GraphEdge>>& graph, int u, int parent_edge) {
        dfn[u] = low[u] = ++timer;
        int child_count = 0;
        for (const GraphEdge& edge : graph[u]) {
            if (edge.index == parent_edge) { continue; }
            int v = edge.to;
            if (!dfn[v]) {
                ++child_count;
                dfs(graph, v, edge.index);
                low[u] = std::min(low[u], low[v]);
                if (low[v] > dfn[u]) {
                    is_bridge[edge.index] = true;
                }
                if (parent_edge != -1 && low[v] >= dfn[u]) {
                    is_cut[u] = true;
                }
            } else {
                low[u] = std::min(low[u], dfn[v]);
            }
        }
        if (parent_edge == -1 && child_count > 1) {
            is_cut[u] = true;
        }
    }
};
```

## 時間與空間複雜度

每條邊與每個點各被訪問一次，時間 O(V+E)，空間 O(V+E)。

## 常見錯誤與邊界條件

多重邊導致單一邊移除後仍有替代路徑；自環不影響割點橋判定；根節點的割點條件與非根不同；low 值誤用 low[v] 而非 dfn[v] 更新；無向邊雙向遍歷導致把父邊當回邊。

## 與相似技巧的比較

強連通分量處理有向圖，而此處處理無向圖。Tarjan SCC 與 Tarjan 割點橋都用 dfn/low，但判定條件與方向性不同。

## 例題與分級練習

割點與橋統計、添加一條邊使圖無圖無橋、點雙/邊雙分量分解、雙連通分量縮點。

## 本節重點速查

dfn 為發現序；low 為回連最小 dfn；low[v] > dfn[u] 為橋；low[v] >= dfn[u] 為割點；根需多子樹。
