---
id: bfs-dfs
volume: upper
source_file: upper-volume
chapter: 3
section: '3.1'
title: BFS 與 DFS：先決定搜尋順序
summary: 以 frontier、visited 與不變量理解兩種基本圖搜尋，而不是只記遞迴模板。
prerequisites: [queue, stack, graph-storage]
learning_goals: [選擇 BFS 或 DFS, 正確標記 visited, 以 BFS 求無權最短路]
concepts: [frontier, visited, connected-components, shortest-path]
complexity:
  time: O(V + E)
  space: O(V)
related_exercises: [grid-shortest-path]
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
visualizer: search
---

## 這個技術解決什麼問題

BFS 與 DFS 都能枚舉從起點可達的狀態。差別不在「能不能找到」，而在展開順序：BFS 依距離分層，DFS 沿一條路走深後回退。

## 辨識題型的訊號

連通塊、可達性、迷宮、最少步數、拓撲結構、回溯枚舉，通常都先問「狀態是什麼、轉移是什麼、重複狀態如何避免」。

## 核心想法與直覺

搜尋維護兩類狀態：已看過的 `visited`，以及等待展開的 frontier。frontier 用佇列就是 BFS，用堆疊或遞迴就是 DFS。

## 狀態／資料結構定義

圖用鄰接表；BFS 用 `queue<int>`，DFS 可用顯式 `stack<int>`。最短路版本另存 `distance`，未造訪設為 `-1`。

## 不變量或正確性證明

BFS 從佇列取出的節點距離不遞減。第一次發現節點時，所有更短的層都已處理，因此該距離就是無權圖最短距離。

## 逐步演算法

先標記起點，再放入 frontier；每次取出一個狀態，枚舉合法鄰居，對未造訪鄰居立即標記並加入 frontier。

## C++17 模板

```cpp
#include <queue>
#include <vector>

std::vector<int> bfs_distance(const std::vector<std::vector<int>>& graph, int source) {
    std::vector<int> distance(graph.size(), -1);
    std::queue<int> frontier;
    distance[source] = 0;
    frontier.push(source);

    while (!frontier.empty()) {
        const int node = frontier.front();
        frontier.pop();

        for (const int next : graph[node]) {
            if (distance[next] != -1) {
                continue;
            }
            distance[next] = distance[node] + 1;
            frontier.push(next);
        }
    }

    return distance;
}
```

## 時間與空間複雜度

鄰接表下每個節點與邊只處理常數次，時間 $O(V+E)$、空間 $O(V)$。

## 常見錯誤與邊界條件

把 `visited` 延後到出隊才設，可能重複入隊；遞迴 DFS 可能爆 stack；網格搜尋要先檢查邊界再讀陣列。

## 與相似技巧的比較

邊權皆為 1 用 BFS；邊權為 0/1 用 deque；非負一般權重用 Dijkstra。DFS 更適合需要進入／離開時間或回溯狀態的題目。

## 例題與分級練習

從網格最短路開始，再做連通塊數量、路徑還原與多源 BFS。

## 本節重點速查

先畫狀態圖；visited 在入 frontier 時設定；最短路的演算法選擇由邊權決定。
