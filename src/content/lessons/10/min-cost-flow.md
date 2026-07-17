---
id: min-cost-flow
volume: lower
source_file: lower-volume
chapter: 10
section: '10.13'
title: 費用流：最小成本的最大流
summary: 在殘量網路上以最短增廣路逐步擴充，兼顧流量與總成本最小化。
prerequisites: [max-flow, shortest-path, dijkstra]
learning_goals:
  - 建立帶費用的殘量網路與反向邊
  - 以勢函數或 SPFA 求最短路後增廣
  - 判斷流量與成本的平衡條件
concepts: [min-cost-flow, successive-shortest-path, potential, reduced-cost]
complexity:
  time: O(F * E log V)  with potentials
  space: O(V + E)
related_exercises: []
source_book_pages: [672, 683]
source_pdf_pages: [302, 313]
review_status: verified
---

## 這個技術解決什麼問題

每條邊除了容量還有單位費用，要求在達到指定流量的前提下使總費用最小。常見變形包括最小費用最大流與固定流量最小費用。

## 辨識題型的訊號

- 每條管線有成本，要最小化運輸或分配總花費。
- 問題可建模為網路流，且目標是「最小成本完成任務」。
- 需要固定流量但允許付費擴充。

## 核心想法與直覺

每次沿著殘量網路上費用最短的增廣路送流；反向邊用來撤銷已送流並退還費用。若邊權均非負，可用 Dijkstra 加速；存在負邊則先用 Bellman-Ford 初始化勢，再轉成還原費用後跑 Dijkstra。

## 狀態／資料結構定義

```cpp
struct Edge {
    int to = 0;
    int reverse = 0;
    long long capacity = 0;
    long long cost = 0;
};
```

- `capacity`：剩餘容量。
- `cost`：每單位流量的費用。
- `reverse`：在 `to` 的鄰接表中對應的反向邊索引。

## 不變量或正確性證明

每次增廣都沿著殘量網路上的最短路徑；若所有還原費用非負，則 Dijkstra 所求是真正的最短路。由於每次增廣都不會讓已達成流量的總費用變差，反覆進行直到流量達標即得最小費用。

## 逐步演算法

1. 建圖，同時加入容量為 0、費用為負原費的反向邊。
2. 以 Bellman-Ford 初始化勢 `potential`（或全部設 0 若無負邊）。
3. 反覆以 `potential` 計算還原費用，跑 Dijkstra 求最短路。
4. 沿著找到的增廣路盡量送流（瓶頸容量），更新總流量與總成本。
5. 更新每個節點的 `potential` 為 `potential + distance`。
6. 直到總流量達到需求或無增廣路為止。

## C++17 模板

```cpp
#include <functional>
#include <limits>
#include <queue>
#include <utility>
#include <vector>

struct McmfEdge {
    int to = 0;
    int rev = 0;
    long long cap = 0;
    long long cost = 0;
};

class MinCostMaxFlow {
public:
    explicit MinCostMaxFlow(int vertex_count)
        : graph_(vertex_count), potential_(vertex_count, 0) {}

    void add_edge(int from, int to, long long cap, long long cost) {
        McmfEdge forward{to, static_cast<int>(graph_[to].size()), cap, cost};
        McmfEdge backward{from, static_cast<int>(graph_[from].size()), 0, -cost};
        graph_[from].push_back(forward);
        graph_[to].push_back(backward);
    }

    std::pair<long long, long long> min_cost_flow(int source, int sink, long long max_flow) {
        const long long infinity = std::numeric_limits<long long>::max() / 4;
        long long flow = 0;
        long long cost = 0;

        while (flow < max_flow) {
            std::vector<long long> distance(graph_.size(), infinity);
            std::vector<int> parent_vertex(graph_.size(), -1);
            std::vector<int> parent_edge(graph_.size(), -1);
            distance[source] = 0;

            using Item = std::pair<long long, int>;
            std::priority_queue<Item, std::vector<Item>, std::greater<Item>> queue;
            queue.push({0, source});

            while (!queue.empty()) {
                const auto [dist, node] = queue.top();
                queue.pop();
                if (dist != distance[node]) continue;
                for (int i = 0; i < static_cast<int>(graph_[node].size()); ++i) {
                    const McmfEdge& edge = graph_[node][i];
                    if (edge.cap <= 0) continue;
                    long long reduced = edge.cost + potential_[node] - potential_[edge.to];
                    if (distance[edge.to] > distance[node] + reduced) {
                        distance[edge.to] = distance[node] + reduced;
                        parent_vertex[edge.to] = node;
                        parent_edge[edge.to] = i;
                        queue.push({distance[edge.to], edge.to});
                    }
                }
            }

            if (distance[sink] == infinity) break;

            for (size_t i = 0; i < graph_.size(); ++i) {
                if (distance[i] != infinity) potential_[i] += distance[i];
            }

            long long add_flow = max_flow - flow;
            for (int node = sink; node != source; node = parent_vertex[node]) {
                const McmfEdge& edge = graph_[parent_vertex[node]][parent_edge[node]];
                add_flow = std::min(add_flow, edge.cap);
            }

            for (int node = sink; node != source; node = parent_vertex[node]) {
                McmfEdge& edge = graph_[parent_vertex[node]][parent_edge[node]];
                edge.cap -= add_flow;
                graph_[node][edge.rev].cap += add_flow;
                cost += add_flow * edge.cost;
            }
            flow += add_flow;
        }
        return {flow, cost};
    }

private:
    std::vector<std::vector<McmfEdge>> graph_;
    std::vector<long long> potential_;
};
```

## 時間與空間複雜度

每輪 Dijkstra 為 $O(E \log V)$，共送 $F$ 單位流，因此時間為 $O(F \cdot E \log V)$；空間為 $O(V + E)$。

## 常見錯誤與邊界條件

- 忘記建反向邊，或反向邊費用沒有取負。
- 容量為 0 的邊仍被嘗試鬆弛。
- `potential` 沒有正確更新導致還原費用變回負值。
- 要求的是「最大流最小費」還是「固定流量最小費」，兩者退出條件不同。
- 總費用溢位：建議使用 `long long`。

## 與相似技巧的比較

最大流只關心容量；費用流在容量之上多了一維成本。若費用全為 0，費用流退化成最大流。循環流與上下界流是更進階的建模特化。

## 例題與分級練習

- 基礎：最小費用運輸、任務分配。
- 進階：帶費用的二分圖最大匹配、時間擴展網路。

## 本節重點速查

反向邊費用取負；還原費用 = 原費用 + potential[u] - potential[v]；每輪增廣後更新勢函數；確實達到目標流量才算正確。
