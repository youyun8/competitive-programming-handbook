---
id: max-flow
volume: lower
source_file: lower-volume
chapter: 10
section: '10.10'
title: Dinic 最大流：分層後一次送完阻塞流
summary: 由殘量網路、增廣路、分層圖與 current arc 理解 Dinic。
prerequisites: [graphs, bfs, dfs]
learning_goals: [建立反向邊, 解釋殘量網路, 實作 BFS 分層與 DFS 增廣]
concepts: [residual-network, augmenting-path, blocking-flow]
complexity:
  time: O(V^2 E) general
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
visualizer: max-flow
---

## 這個技術解決什麼問題

在有向容量網路中，求從源點到匯點可傳送的最大總流量，並作為二分圖匹配、最小割與選擇模型的基礎。

## 辨識題型的訊號

資源經網路流動、容量限制、互斥選擇、最小割建模、二分圖最大匹配。

## 核心想法與直覺

送出流後必須保留反悔能力，因此每條邊都有反向殘量邊。Dinic 用 BFS 只保留層數遞增邊，再用 DFS 找一組阻塞流。

## 狀態／資料結構定義

每條邊存終點、反向邊索引與剩餘容量。`level` 是分層，`current` 避免重掃已耗盡的出邊。

## 不變量或正確性證明

每次增廣都保持容量限制與流量守恆。阻塞流後，當前分層圖不存在源到匯的增廣路；重新 BFS 會使最短增廣路長度嚴格增加，直到匯點不可達。

## 逐步演算法

加邊時同時加零容量反向邊；BFS 建 level graph；DFS 只沿下一層送流；反覆直到 BFS 無法到達匯點。

## C++17 模板

```cpp
#include <algorithm>
#include <limits>
#include <queue>
#include <vector>

struct FlowEdge {
    int to;
    int reverse_index;
    long long capacity;
};

class Dinic {
public:
    explicit Dinic(int node_count) : graph(node_count), level(node_count), current(node_count) {}

    void add_edge(int from, int to, long long capacity) {
        FlowEdge forward{to, static_cast<int>(graph[to].size()), capacity};
        FlowEdge backward{from, static_cast<int>(graph[from].size()), 0};
        graph[from].push_back(forward);
        graph[to].push_back(backward);
    }

    long long max_flow(int source, int sink) {
        long long total = 0;
        while (build_levels(source, sink)) {
            std::fill(current.begin(), current.end(), 0);
            while (long long pushed = send_flow(source, sink, std::numeric_limits<long long>::max())) {
                total += pushed;
            }
        }
        return total;
    }

private:
    std::vector<std::vector<FlowEdge>> graph;
    std::vector<int> level;
    std::vector<int> current;

    bool build_levels(int source, int sink) {
        std::fill(level.begin(), level.end(), -1);
        std::queue<int> queue;
        level[source] = 0;
        queue.push(source);
        while (!queue.empty()) {
            int node = queue.front();
            queue.pop();
            for (const FlowEdge& edge : graph[node]) {
                if (edge.capacity > 0 && level[edge.to] == -1) {
                    level[edge.to] = level[node] + 1;
                    queue.push(edge.to);
                }
            }
        }
        return level[sink] != -1;
    }

    long long send_flow(int node, int sink, long long available) {
        if (node == sink) return available;
        for (int& index = current[node]; index < static_cast<int>(graph[node].size()); ++index) {
            FlowEdge& edge = graph[node][index];
            if (edge.capacity == 0 || level[edge.to] != level[node] + 1) continue;
            long long pushed = send_flow(edge.to, sink, std::min(available, edge.capacity));
            if (pushed == 0) continue;
            edge.capacity -= pushed;
            graph[edge.to][edge.reverse_index].capacity += pushed;
            return pushed;
        }
        return 0;
    }
};
```

## 時間與空間複雜度

一般圖常用上界 $O(V^2E)$；特定網路有更佳界。空間 $O(V+E)$。

## 常見錯誤與邊界條件

反向索引錯誤、把原始容量與殘量混淆、`current` 沒有每輪重設、source 等於 sink、遞迴深度與容量溢位。

## 與相似技巧的比較

Edmonds-Karp 每次只找一條最短增廣路；Dinic 一次求整個阻塞流。費用流則在容量外再最佳化成本。

## 例題與分級練習

基本最大流、二分圖匹配、最小割選點、帶下界流。

## 本節重點速查

反向邊提供反悔；只走 level+1；current arc 避免重掃；匯點不可達即完成。
