---
id: bfs-shortest-path
volume: upper
source_file: upper-volume
chapter: 3
section: '3.4'
title: BFS 與最短路徑：分層展開的距離藝術
summary: 以 BFS 的分層特性求無權圖最短路徑，並掌握最短路徑數統計與多源 BFS 的技巧。
prerequisites: [bfs-dfs, queue]
learning_goals:
  - 證明 BFS 在無權圖上求出最短路徑
  - 記錄前驅節點以還原最短路徑
  - 使用多源 BFS 處理多個起點的同時擴散
concepts: [shortest-path, layer-bfs, predecessor, multi-source]
complexity:
  time: O(V + E)
  space: O(V)
related_exercises: ['grid-shortest-path']
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

在邊權皆為 1（或相同常數）的圖中，BFS 按照距離起點的遠近分層展開，天然地保證了第一次發現節點時的距離就是最短距離。這是處理迷宮、網格、社交網路等無權最短路徑問題的首選演算法。

## 辨識題型的訊號

- 迷宮中從入口走到出口的最少步數。
- 社交網路中兩個人的最短認識鏈長度。
- 棋盤上馬或王的移動，每步成本相同。
- 需要統計「最短路徑有幾條」或「字典序最小的最短路徑」。

## 核心想法與直覺

BFS 的佇列性質確保了先發現的節點距離不遞減。當你第一次看到鄰居時，你站在當前層，而鄰居就在下一層，這條路不可能是繞路的，因為任何其他路到達這個鄰居都需要至少同等層數。

## 狀態／資料結構定義

- `distance` 陣列：初始化為 -1 表示未訪問，起點設為 0。
- `predecessor` 陣列：記錄每個節點是由哪個節點發現的，用於路徑還原。
- `std::queue<int>` 或 `std::queue<std::pair<int, int>>` 存放 frontier。

## 不變量或正確性證明

BFS 的不變量：佇列中節點的距離依序不遞減。當節點 u 出隊時，所有距離小於 distance[u] 的節點都已出隊完畢。對於 u 的未訪問鄰居 v，設 distance[v] = distance[u] + 1，任何到達 v 的其他路徑都需要至少經過 distance[u] + 1 條邊（因為所有邊權為 1）。因此第一次設定的 distance[v] 即為最短路徑長度。

## 逐步演算法

1. 初始化 distance 為 -1，predecessor 為 -1。
2. 起點 distance = 0，入隊。
3. 當佇列非空：
   - 取出節點 u。
   - 對每個鄰居 v：若 distance[v] == -1，設 distance[v] = distance[u] + 1，predecessor[v] = u，入隊。
4. distance[target] 即為最短路徑長度；沿 predecessor 回溯得到路徑。

## C++17 模板

```cpp
#include <algorithm>
#include <queue>
#include <vector>

std::vector<int> bfs_shortest_path(
    const std::vector<std::vector<int>>& graph,
    int source,
    int target
) {
    const int n = static_cast<int>(graph.size());
    std::vector<int> distance(n, -1);
    std::vector<int> predecessor(n, -1);
    std::queue<int> q;

    distance[source] = 0;
    q.push(source);

    while (!q.empty()) {
        const int u = q.front();
        q.pop();
        if (u == target) break;
        for (int v : graph[u]) {
            if (distance[v] != -1) continue;
            distance[v] = distance[u] + 1;
            predecessor[v] = u;
            q.push(v);
        }
    }

    std::vector<int> path;
    if (distance[target] != -1) {
        for (int at = target; at != -1; at = predecessor[at]) {
            path.push_back(at);
        }
        std::reverse(path.begin(), path.end());
    }
    return path;
}
```

## 時間與空間複雜度

每個節點與邊最多處理一次，時間 O(V + E)。distance 與 predecessor 陣列空間 O(V)。

## 常見錯誤與邊界條件

- 忘記把 visited 設在入隊時，導致同一節點被重複入隊（雖然不影響正確性，但會增加常數）。
- 將 BFS 用於邊權不等的圖，導致「距離」不代表最短路徑成本。
- 路徑還原時若 target 不可達，忘記檢查 distance[target] == -1 就回溯，可能造成無限迴圈。
- 多源 BFS 未將所有起點同時入隊並設定距離為 0，導致層次計算錯誤。

## 與相似技巧的比較

邊權為 0 或 1 時使用 0-1 BFS；一般非負權使用 Dijkstra。BFS 是這兩者的特例與基礎。DFS 雖然也能遍歷，但無法保證最短路徑。

## 例題與分級練習

先以迷宮最短路徑建立路徑還原能力，再練習多源 BFS 求每個格子到最近障礙物的距離。進階可嘗試最少轉彎次數的變形 BFS。

## 教材經典例題與 C++ 解答

以下例題對應本章教材的 BFS 與 0-1 BFS 主題。題意皆為本站重新敘述，程式為獨立撰寫、可直接編譯的 C++17，讀完即得完整解法。

### 例題一：網格無權最短路並還原路徑

在一張 `#` 為障礙、`.` 為可走的網格上，求從左上角走到右下角的最少步數，並還原一條最短路徑。BFS 按距離逐層展開，節點第一次入隊時就是最短距離；同時記錄 `parent`，最後沿 `parent` 反推即可還原路徑。時間 O(rows·cols)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 網格無權最短路：BFS 求最短步數並還原一條路徑。
int main() {
    int rows, cols;
    if (!(cin >> rows >> cols)) return 0;
    vector<string> grid(rows);
    for (string& row : grid) cin >> row;
    int start = 0, goal = rows * cols - 1;
    vector<int> distance(rows * cols, -1), parent(rows * cols, -1);
    queue<int> frontier;
    distance[start] = 0;
    frontier.push(start);
    const int dr[] = {-1, 1, 0, 0};
    const int dc[] = {0, 0, -1, 1};
    while (!frontier.empty()) {
        int cell = frontier.front();
        frontier.pop();
        int r = cell / cols, c = cell % cols;
        for (int k = 0; k < 4; ++k) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] == '#') continue;
            int next = nr * cols + nc;
            if (distance[next] != -1) continue;
            distance[next] = distance[cell] + 1;
            parent[next] = cell;
            frontier.push(next);
        }
    }
    if (distance[goal] == -1) {
        cout << "-1\n";
        return 0;
    }
    cout << distance[goal] << '\n';
    vector<int> path;
    for (int cell = goal; cell != -1; cell = parent[cell]) path.push_back(cell);
    reverse(path.begin(), path.end());
    for (size_t i = 0; i < path.size(); ++i)
        cout << '(' << path[i] / cols << ',' << path[i] % cols << ')' << " \n"[i + 1 == path.size()];
    return 0;
}
```

對 3×3 網格 `... / .#. / ...` 會輸出步數 `4` 與一條路徑 `(0,0) (1,0) (2,0) (2,1) (2,2)`。

### 例題二：0-1 BFS

當圖的邊權只有 0 或 1 時，不必動用 Dijkstra：改用雙端佇列，鬆弛出的 0 權節點放前端、1 權節點放後端，佇列中的距離就保持非遞減，等價於這個特例上的 Dijkstra。時間 O(V + E)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 0-1 BFS：邊權只有 0 或 1 的單源最短路，用 deque 維持距離非遞減。
int main() {
    int n, m, source;
    if (!(cin >> n >> m >> source)) return 0;
    vector<vector<pair<int, int>>> adjacency(n);  // (to, weight in {0,1})
    for (int i = 0; i < m; ++i) {
        int u, v, w;
        cin >> u >> v >> w;
        adjacency[u].push_back({v, w});
    }
    vector<int> distance(n, INT_MAX);
    deque<int> frontier;
    distance[source] = 0;
    frontier.push_back(source);
    while (!frontier.empty()) {
        int u = frontier.front();
        frontier.pop_front();
        for (auto [v, w] : adjacency[u]) {
            if (distance[u] + w < distance[v]) {
                distance[v] = distance[u] + w;
                if (w == 0) frontier.push_front(v);
                else frontier.push_back(v);
            }
        }
    }
    for (int i = 0; i < n; ++i)
        cout << (distance[i] == INT_MAX ? -1 : distance[i]) << " \n"[i + 1 == n];
    return 0;
}
```

四個節點、邊 `0→1(1)`、`1→2(0)`、`0→2(1)`、`2→3(1)`，從 0 出發的距離是 `0 1 1 2`：走 `0→1→2` 用一條 1 權加一條 0 權，與 `0→2` 同為 1。

## 本節重點速查

BFS 求無權最短路徑；入隊時設 distance 與 predecessor；記得檢查 target 是否可達；多源 BFS 要同時初始化所有起點。
