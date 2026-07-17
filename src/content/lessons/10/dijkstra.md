---
id: dijkstra
volume: lower
source_file: lower-volume
chapter: 10
section: '10.8'
title: Dijkstra：非負邊權的最短路
summary: 以鬆弛與最小未定案距離的不變量，理解優先佇列版本 Dijkstra。
prerequisites: [graphs, priority-queue, bfs]
learning_goals: [實作鬆弛, 處理 stale entries, 判斷非負邊權前提]
concepts: [shortest-path, relaxation, greedy]
complexity:
  time: O((V + E) log V)
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
visualizer: dijkstra
---

## 這個技術解決什麼問題

在所有邊權非負的圖上，求單一起點到各點的最短距離。

## 辨識題型的訊號

道路成本非負、要求最短時間／花費、圖可能稀疏且需要單源答案。

## 核心想法與直覺

暫定距離最小的未定案節點，不可能再被其他繞路改善：任何繞路都要先到一個距離不小於它的節點，再加非負邊。

## 狀態／資料結構定義

`distance[v]` 是目前已知上界；最小堆放 `(distance,node)`。不做 decrease-key，而是允許重複項並跳過 stale entry。

## 不變量或正確性證明

從堆取出且等於目前 `distance` 的節點，其距離已是最短。若存在更短路，該路上第一個未定案節點的前驅應更早產生更小候選，矛盾。

## 逐步演算法

起點距離設 0；反覆取最小項；若過期就跳過；對每條出邊做鬆弛並把新距離入堆。

## C++17 模板

```cpp
#include <functional>
#include <limits>
#include <queue>
#include <utility>
#include <vector>

struct Edge {
    int to = 0;
    int weight = 0;
};

std::vector<long long> dijkstra(const std::vector<std::vector<Edge>>& graph, int source) {
    const long long infinity = std::numeric_limits<long long>::max() / 4;
    std::vector<long long> distance(graph.size(), infinity);
    using QueueItem = std::pair<long long, int>;
    std::priority_queue<QueueItem, std::vector<QueueItem>, std::greater<QueueItem>> queue;

    distance[source] = 0;
    queue.push({0, source});

    while (!queue.empty()) {
        const auto [current_distance, node] = queue.top();
        queue.pop();

        if (current_distance != distance[node]) {
            continue;
        }
        for (const Edge& edge : graph[node]) {
            const long long candidate = current_distance + edge.weight;
            if (candidate >= distance[edge.to]) {
                continue;
            }
            distance[edge.to] = candidate;
            queue.push({candidate, edge.to});
        }
    }

    return distance;
}
```

## 時間與空間複雜度

鄰接表＋二元堆時間 $O((V+E)\log V)$，空間 $O(V+E)$。

## 常見錯誤與邊界條件

存在負邊、距離加法溢位、堆預設是最大堆、忘記 stale entry、無向邊只加一個方向。

## 與相似技巧的比較

無權圖用 BFS；0/1 邊權用 0-1 BFS；有負邊用 Bellman-Ford 類方法；全點對且點數小可用 Floyd-Warshall。

## 例題與分級練習

單源距離、路徑還原、多源最短路、狀態擴張圖。

## 本節重點速查

非負邊是正確性前提；鬆弛改善上界；過期堆項直接跳過。
