---
id: min-cut
volume: lower
source_file: lower-volume
chapter: 10
section: '10.12'
title: 最小割：最大流最小割定理與建模
summary: 利用最大流求 s-t 最小割，並把選擇、覆蓋與劃分問題轉為網路流模型。
prerequisites: [max-flow]
learning_goals:
  - 理解最大流最小割定理的對偶關係
  - 從殘量網路還原最小割的點集
  - 把選擇問題建模為最小割
concepts: [min-cut, max-flow-min-cut, network]
complexity:
  time: same as max flow
  space: same as max flow
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

在有向容量網路中，求把源點與匯點分離所需拆除的最小總容量。最小割與最大流數值相等，且殘量網路中從源點可達的點集即為最小割的一側。

## 辨識題型的訊號

劃分點集使跨集邊總和最小、選擇與放棄的權衡、關閉某些路徑的最小成本、最大流建構後求方案。

## 核心想法與直覺

最大流最小割定理：任何流不大於任何割的容量；當最大流達成時，對應的殘量網路中從源點不可到達匯點，此時把可達點與不可達點分開的邊就構成最小割。

## 狀態／資料結構定義

沿用最大流的殘量網路。最小割只需跑一次最大流，然後在殘量網路上從源點 BFS/DFS，走容量大於 0 的邊，訪問到的點即為 S 側。

## 不變量或正確性證明

最大流等於某割的容量：飽和邊構成從 S 側到 T 側的屏障，任何額外流都需經過飽和邊，但無剩餘容量。殘量網路中從源點可達的點集與不可達點集之間的所有前向邊恰為飽和邊，總容量等於最大流，故為最小割。

## 逐步演算法

1. 以 Dinic 或其他算法求最大流；
2. 在殘量網路上從源點 BFS，只走 capacity > 0 的邊；
3. 被訪問的點屬於 S 側，其餘屬於 T 側；
4. 跨越兩側的原始正向邊構成最小割。

## C++17 模板

最小割的實作建立在最大流之上，以下是從 Dinic 殘量網路還原最小割點集的輔助函式：

```cpp
#include <queue>
#include <vector>

struct FlowEdge {
    int to;
    long long capacity;
};

std::vector<bool> min_cut_reachable(
    const std::vector<std::vector<FlowEdge>>& residual_graph,
    int source) {
    int n = static_cast<int>(residual_graph.size());
    std::vector<bool> visited(n, false);
    std::queue<int> queue;
    visited[source] = true;
    queue.push(source);
    while (!queue.empty()) {
        int u = queue.front();
        queue.pop();
        for (const FlowEdge& edge : residual_graph[u]) {
            if (edge.capacity > 0 && !visited[edge.to]) {
                visited[edge.to] = true;
                queue.push(edge.to);
            }
        }
    }
    return visited;
}
```

## 時間與空間複雜度

等同於最大流算法的時間。額外 BFS 還原割點集為 O(V+E)。

## 常見錯誤與邊界條件

殘量邊的 capacity 判斷方向錯誤；把反向邊也算進割邊；源點等於匯點；未區分原始邊與殘量邊；最大流未跑完就求割。

## 與相似技巧的比較

全域最小割可用 Stoer-Wagner 算法，無需指定源匯。點连通度與邊连通度也可透過流建模。s-t 最小割是最基礎的網路流應用之一。

## 例題與分級練習

基本 s-t 最小割、閉合圖最大權、選點與放棄的權衡、圖像分割、專案選擇。

## 本節重點速查

最大流值 = 最小割容量；殘量網路 BFS 得 S 側；跨越邊即割邊；定理對偶是建模關鍵。
