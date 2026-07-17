---
id: deque-bfs
volume: upper
source_file: upper-volume
chapter: 3
section: '3.7'
title: BFS 與雙端佇列：0-1 BFS 的邊權分類
summary: 利用雙端佇列在 O(V + E) 時間內解決邊權只有 0 和 1 的最短路徑問題。
prerequisites: [bfs-shortest-path, deque]
learning_goals:
  - 理解 0-1 BFS 的原理與雙端佇列操作規則
  - 將一般邊權問題轉換為 0-1 BFS 可處理的形式
  - 判斷 0-1 BFS 與 Dijkstra 的適用分界
concepts: [0-1-bfs, deque, edge-weight, shortest-path]
complexity:
  time: O(V + E)
  space: O(V)
related_exercises: ['zero-one-bfs-shortest']
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

當圖中所有邊的權重只有 0 或 1 時，使用 priority_queue 的 Dijkstra 會帶來 O(E log V) 的對數開銷。0-1 BFS 利用雙端雙端佇列：邊權為 0 的轉移從佇列前端加入（維持同一層），邊權為 1 的轉移從尾端加入（下一層），從而達到 O(V + E) 的線性複雜度。

## 辨識題型的訊號

- 網格中移動有兩種成本：直行成本為 0、轉彎或障礙成本為 1。
- 狀態轉移中，大部分轉移不改變累積成本，只有少數特殊轉移增加 1。
- 需要最短路徑且權重種類極少（主要是 0 和 1）。

## 核心想法與直覺

普通 BFS 每條邊隱含成本為 1，因此每深入一層距離加 1。若某條邊成本為 0，則走到該鄰居不應該「延後」到下一層，而應立即處理，甚至優先於某些已經在佇列中的節點。這正是「從前端加入」的直覺。

## 狀態／資料結構定義

- `dist[state]`：最小成本，初始 INF。
- `std::deque<int>`： frontier。
- 對於權重為 w（0 或 1）的轉移到鄰居 v：
  - 若 w == 0：`dq.push_front(v)`
  - 若 w == 1：`dq.push_back(v)`

## 不變量或正確性證明

0-1 BFS 維持佇列中元素的距離值非嚴格遞增（或最多相差 1）。當元素 u 從前端取出時，其 dist[u] 是所有佇列元素中的最小值。對於權重為 0 的邊，新距離 dist[v] = dist[u]，與 u 同層，因此 push_front 保證了 v 會在 u 之後、但在所有距離更大的元素之前被處理。對於權重為 1 的邊，dist[v] = dist[u] + 1，應在當前層之後處理，因此 push_back。這與 Dijkstra 的貪心選擇一致，但利用邊權種類少的特性避免了堆操作。

## 逐步演算法

1. dist[start] = 0，將 start push_back 到 deque。
2. 當 deque 非空：
   - u = pop_front()
   - 對每個鄰居 v 與邊權 w：
     - 若 dist[u] + w < dist[v]，更新 dist[v]；
     - w == 0 則 push_front(v)，否則 push_back(v)。
3. dist[target] 即為最短路徑長度。

## C++17 模板

```cpp
#include <deque>
#include <vector>
#include <limits>

using Cost = int;

Cost bfs_01(const std::vector<std::vector<std::pair<int, Cost>>>& graph,
            int source, int target) {
    const int n = static_cast<int>(graph.size());
    const Cost INF = std::numeric_limits<Cost>::max() / 4;
    std::vector<Cost> dist(n, INF);
    std::deque<int> dq;

    dist[source] = 0;
    dq.push_back(source);

    while (!dq.empty()) {
        const int u = dq.front();
        dq.pop_front();
        if (u == target) { continue; } // optional early exit not guaranteed optimal here
        for (const auto& [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) {
                    dq.push_front(v);
                } else {
                    dq.push_back(v);
                }
            }
        }
    }
    return dist[target] == INF ? -1 : dist[target];
}
```

## 時間與空間複雜度

每個節點與邊最多處理一次，雙端佇列操作均攤 O(1)，總時間 O(V + E)。空間 O(V)。

## 常見錯誤與邊界條件

- 邊權不只有 0 和 1 時仍使用 0-1 BFS，導致錯誤。
- 忘記 `dist[u] + w` 可能溢出，需確認 INF 夠大。
- push_front 的節點若已被處理過，再次 push_front 會導致重複處理，需靠 dist 更新判斷來避免無窮迴圈。
- 以為 pop_front 時 u == target 就能立即回傳最優解，但實際上 0-1 BFS 不像 Dijkstra 那樣取出即最優（雖然在 0-1 邊權下其實仍是正確的，但為了\_PATTERN 一致，建議跑完或嚴謹證明後再回傳）。

## 與相似技巧的比較

Dijkstra 適用任意非負權重，0-1 BFS 只適用 0/1。若邊權為小整數（如 0..k），可推廣為 dial's algorithm（桶優先佇列）。BFS 則是所有邊權皆為 1 時的特例。

## 例題與分級練習

以「最少翻牆次數的迷宮逃生」練習 0-1 BFS，再FS，再嘗試「雙向有向圖中邊反向成本為 1」的變形。進階可研究 Dial's algorithm 處理更大整數權重。

## 本節重點速查

0-1 BFS 用 deque；權 0 放頭、權 1 放尾；只適用邊權 0/1；比 Dijkstra 快一個 log 因子；注意標記 dist 避免重複。
