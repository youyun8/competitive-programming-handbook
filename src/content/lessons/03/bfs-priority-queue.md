---
id: bfs-priority-queue
volume: upper
source_file: upper-volume
chapter: 3
section: '3.6'
title: BFS 與優先佇列：最佳優先搜尋的狀態代價
summary: 使用優先佇列取代普通普通佇列，讓 BFS 按照狀態代價而非深度展開，適用於需要優先處理低成本狀態的場景。
prerequisites: [bfs-shortest-path, heap]
learning_goals:
  - 理解最佳優先搜尋與 Dijkstra 的關係
  - 以 priority_queue 實作帶權狀態展開
  - 判斷何時使用最佳優先而非普通 BFS
concepts: [best-first-search, priority-queue, state-cost, heuristic]
complexity:
  time: O(E log V)
  space: O(V)
related_exercises: []
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

普通 BFS 適合所有邊權相同的場景。當不同轉移有不同成本時，我們希望每次都優先處理「目前總成本最低」的狀態，這樣當目標第一次被取出時，其成本即為最優解。這正是最佳優先搜尋的核心思想，也是 Dijkstra 演算法的運作方式。

## 辨識題型的訊號

- 狀態轉移的成本不統一，且有非負性保證。
- 需要「最小總成本到達目標狀態」。
- 網格或圖中，不同方向的移動花費不同。
- 需要結合啟發式估計引導搜尋方向（此時為 A\*）。

## 核心想法與直覺

普通佇列是 FIFO，先進先出；優先佇列按 key 值排序，每次取出最小 key。若 key 設為「從起點到當前狀態的累積成本」，則優先佇列保證了「第一次擴展到某狀態時，其累積成本已是最小」。這與 Dijkstra 的放鬆過程完全一致。

## 狀態／資料結構定義

- `dist[state]`：從起點到該狀態的最小已知成本，初始為 INF。
- `std::priority_queue<std::pair<cost, state>, vector<...>, greater<...>>`：小根堆，每次取出成本最小的狀態。
- 轉移函式：給定狀態，回傳所有鄰居與對應邊權。

## 不變量或正確性證明

假設所有邊權非負。當狀態 u 從優先佇列取出時，其 dist[u] 是所有尚未處理狀態中的最小值。若存在另一條更短路徑到達 u，則該路徑上必有一個節點 v 仍在佇列中，且 dist[v] + w(v,u) < dist[u]。但 dist[v] >= dist[u]（因為 u 已是最小），加上 w(v,u) >= 0，矛盾。因此 dist[u] 已是最短路徑成本。

## 逐步演算法

1. 初始化 dist 為 INF，dist[start] = 0。
2. 將 (0, start) 推入 priority_queue。
3. 當 pq 非空：
   - 取出成本最小的 (cost, u)。
   - 若 cost > dist[u]，跳過（過時條目）。
   - 若 u 是目標，可選擇直接回傳（因為已保證最小）。
   - 對每個鄰居 v 與邊權 w：若 dist[u] + w < dist[v]，更新 dist[v] 並推入 pq。

## C++17 模板

```cpp
#include <queue>
#include <vector>
#include <limits>

using State = int;
using Cost = long long;

Cost best_first_search(
    const std::vector<std::vector<std::pair<State, Cost>>>& graph,
    State source,
    State target
) {
    const int n = static_cast<int>(graph.size());
    const Cost INF = std::numeric_limits<Cost>::max() / 4;
    std::vector<Cost> dist(n, INF);
    using Node = std::pair<Cost, State>;
    std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;

    dist[source] = 0;
    pq.emplace(0, source);

    while (!pq.empty()) {
        const auto [cost, u] = pq.top();
        pq.pop();
        if (cost != dist[u]) continue;
        if (u == target) return cost;
        for (const auto& [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.emplace(dist[v], v);
            }
        }
    }
    return -1; // target unreachable
}
```

## 時間與空間複雜度

每條邊最多被放鬆一次並推入堆中，每次堆操作 O(log V)。總時間 O(E log V)。空間 O(V) 存放 dist 與 priority_queue。

## 常見錯誤與邊界條件

- 未檢查過時條目（取出的 cost != dist[u]），導致重複放鬆鄰居。
- 邊權可能為負時仍使用此結構，導致錯誤最短路徑（應改用 Bellman-Ford）。
- 忘記處理 target 不可達的情況。
- 成本累積溢出：INF 要設得夠大且加法時需防溢。

## 與相似技巧的比較

普通 BFS 是權重皆為 1 時的特例。Dijkstra 與最佳優先 BFS 本質相同，只是一般圖論教材稱之為 Dijkstra，而搜尋領域稱之為 best-first search。0-1 BFS 是邊權只有 0 和 1 時的雙端佇列優化版本。

## 例題與分級練習

先用 grid 上移動成本不同的最短路問題熟悉框架，再以「 Escape from the maze」類題目練習帶權狀態轉移。進階可連接 A\* 啟發式做更進階的最佳優先搜尋。

## 本節重點速查

最佳優先用 priority_queue，key 為累積成本；取出時跳過過時條目；邊權必須非負；第一次取出目標即為最優解。
