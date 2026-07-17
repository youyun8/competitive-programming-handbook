---
id: topological-sort
volume: lower
source_file: lower-volume
chapter: 10
section: '10.2'
title: 拓撲排序：有向無環圖的線性展開
summary: 利用入度或 DFS 後序，把 DAG 的節點排成所有邊都往前指的順序。
prerequisites: [graphs, bfs, dfs]
learning_goals:
  - 用 Kahn 演算法與 DFS 後序兩種方式輸出拓撲序
  - 判斷圖是否含有環
  - 處理字典序最小或多組解的情況
concepts: [topological-sort, dag, in-degree]
complexity:
  time: O(V + E)
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

在有向無環圖中，把節點排成線性序列，使所有邊都從前面的點指向後面的點。常用於依賴解析、課程安排、編譯順序等。

## 辨識題型的訊號

先修條件、依賴關係、任務排程、前提條件約束、DAG 判定。

## 核心想法與直覺

Kahn 演算法：不斷取出沒有前驅的點，相當於「沒有任何未處理依賴的任務可以先執行」。DFS 後序：走到盡頭再記錄，相當於「完成所有後繼任務後才輪到自己」。

## 狀態／資料結構定義

入度陣列 `in_degree`、鄰接表、佇列（或最小堆求字典序）。DFS 版本則用訪問標記與完成標記，輔以結果向量。

## 不變量或正確性證明

Kahn：每次取出入度為 0 的點，加入答案後刪除其出邊。因為 DAG 必有入度為 0 的點，過程中若無法取出點但仍有未處理點，則圖有環。DFS：在 DAG 中，後繼節點必在遞迴更深處，後序保證後繼先被記錄，反轉後即為拓撲序。

## 逐步演算法（Kahn）

1. 計算所有點入度；
2. 入度為 0 的點入隊；
3. 取出點，加入答案，對每條出邊降低目標點入度，若變為 0 則入隊；
4. 若答案長度等於點數則成功，否則圖有環。

## C++17 模板

```cpp
#include <queue>
#include <vector>

std::vector<int> topological_sort(const std::vector<std::vector<int>>& graph) {
    int n = static_cast<int>(graph.size());
    std::vector<int> in_degree(n);
    for (int u = 0; u < n; ++u) {
        for (int v : graph[u]) {
            ++in_degree[v];
        }
    }
    std::queue<int> queue;
    for (int i = 0; i < n; ++i) {
        if (in_degree[i] == 0) {
            queue.push(i);
        }
    }
    std::vector<int> result;
    result.reserve(n);
    while (!queue.empty()) {
        int u = queue.front();
        queue.pop();
        result.push_back(u);
        for (int v : graph[u]) {
            if (--in_degree[v] == 0) {
                queue.push(v);
            }
        }
    }
    if (static_cast<int>(result.size()) != n) {
        return {};
    }
    return result;
}
```

## 時間與空間複雜度

遍歷所有點與邊各一次，時間 O(V+E)，空間 O(V+E)。

## 常見錯誤與邊界條件

圖有環卻未檢查答案長度；自環導致入度永遠不為 0；多組解時未明確要求字典序最小；無向邊誤用拓撲排序。

## 與相似技巧的比較

DFS 後序可自然產生拓撲序，但檢測環需要顏色標記。Kahn 演算法更直觀，且容易改成求字典序最小（改用最小堆）。

## 例題與分級練習

課程安排、編譯順序、最長鏈長度、DAG 上動態規劃、字典序最小拓撲序。

## 教材經典例題與 C++ 解答

以下例題對應本章教材的拓撲排序與強連通分量主題。題意皆為本站重新敘述，程式為獨立撰寫、可直接編譯的 C++17，讀完即得完整解法。

### 例題一：字典序最小拓撲排序

對有向圖輸出字典序最小的拓撲序，若有環則回報。把 Kahn 演算法的普通佇列換成小根堆：每次從所有入度為 0 的節點中取編號最小者輸出，再刪其出邊、更新入度。若最終輸出數不足 n，代表存在環。時間 O((V+E) log V)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// Kahn + 小根堆：輸出字典序最小拓撲序，有環則回報。
int main() {
    int n, m;
    if (!(cin >> n >> m)) { return 0; }
    vector<vector<int>> adjacency(n);
    vector<int> indegree(n, 0);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        adjacency[u].push_back(v);
        ++indegree[v];
    }
    priority_queue<int, vector<int>, greater<int>> ready;
    for (int i = 0; i < n; ++i) {
        if (indegree[i] == 0) { ready.push(i); }
    }
    vector<int> order;
    while (!ready.empty()) {
        int u = ready.top();
        ready.pop();
        order.push_back(u);
        for (int v : adjacency[u]) {
            if (--indegree[v] == 0) { ready.push(v); }
        }
    }
    if (static_cast<int>(order.size()) != n) {
        cout << "cycle\n";
        return 0;
    }
    for (size_t i = 0; i < order.size(); ++i) { cout << order[i] << " \n"[i + 1 == order.size()]; }
    return 0;
}
```

四個節點、邊 `0→1`、`0→2`、`2→3`，輸出 `0 1 2 3`：在 1 與 2 都可選時優先取較小的 1。

### 例題二：強連通分量（Tarjan）

把有向圖切成極大強連通分量。DFS 中 `dfn` 記錄首次到達時間，`low` 記錄沿樹邊與仍在棧中的回邊可到達的最早時間；只有指向仍在棧中的節點才可更新 `low`。當 `low[u] == dfn[u]`，`u` 是一個分量的根，持續彈棧直到 `u` 即得到一個完整 SCC。時間 O(V+E)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// Tarjan：把有向圖切成強連通分量，輸出分量數與每點所屬分量編號。
class TarjanScc {
public:
    explicit TarjanScc(const vector<vector<int>>& graph)
        : graph_(graph), n_(static_cast<int>(graph.size())), dfn_(n_, -1), low_(n_, 0),
          on_stack_(n_, false), component_(n_, -1) {
        for (int v = 0; v < n_; ++v) {
            if (dfn_[v] == -1) { dfs(v); }
        }
    }
    int count() const { return component_count_; }
    const vector<int>& component() const { return component_; }

private:
    void dfs(int u) {
        dfn_[u] = low_[u] = timer_++;
        stack_.push_back(u);
        on_stack_[u] = true;
        for (int v : graph_[u]) {
            if (dfn_[v] == -1) {
                dfs(v);
                low_[u] = min(low_[u], low_[v]);
            } else if (on_stack_[v]) {
                low_[u] = min(low_[u], dfn_[v]);
            }
        }
        if (low_[u] == dfn_[u]) {
            while (true) {
                int w = stack_.back();
                stack_.pop_back();
                on_stack_[w] = false;
                component_[w] = component_count_;
                if (w == u) { break; }
            }
            ++component_count_;
        }
    }
    const vector<vector<int>>& graph_;
    int n_;
    int timer_ = 0;
    int component_count_ = 0;
    vector<int> dfn_;
    vector<int> low_;
    vector<char> on_stack_;
    vector<int> component_;
    vector<int> stack_;
};

int main() {
    int n, m;
    if (!(cin >> n >> m)) { return 0; }
    vector<vector<int>> graph(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        graph[u].push_back(v);
    }
    TarjanScc scc(graph);
    cout << scc.count() << '\n';
    const vector<int>& component = scc.component();
    for (int i = 0; i < n; ++i) { cout << component[i] << " \n"[i + 1 == n]; }
    return 0;
}
```

四個節點、邊 `0→1`、`1→0`、`1→2`、`2→3`：`{0,1}` 互相可達成為一個分量，`2`、`3` 各自獨立，輸出分量數 `3` 與每點的分量編號 `2 2 1 0`（編號依 Tarjan 完成順序產生）。

## 本節重點速查

入度為 0 先出隊；刪邊降低入度；答案長度不符即為環；DAG 才有拓撲序。
