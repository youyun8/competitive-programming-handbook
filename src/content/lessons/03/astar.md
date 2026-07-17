---
id: astar
volume: upper
source_file: upper-volume
chapter: 3
section: '3.8'
title: A*：帶啟發的最短路搜尋
summary: 在 Dijkstra 的基礎上引入可容許的啟發函數，讓搜尋朝目標方向集中，顯著減少展開節點數量。
prerequisites: [bfs-priority-queue, heuristic]
learning_goals:
  - 選擇並設計可容許（admissible）與一致的（consistent）啟發函數
  - 比較 A* 與 Dijkstra 的展開行為差異
  - 分析 A* 的複雜度與啟發強度的關係
concepts: [a-star, heuristic, admissible, consistent, best-first-search]
complexity:
  time: O(E) in best case, worst same as Dijkstra
  space: O(V)
related_exercises: []
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

在狀態空間巨大且目標明確的搜尋問題中，Dijkstra 會無差別地向四面八方擴展，直到目標被選出。A\* 透過啟發函數 h(state) 估計「從當前狀態到目標的最小成本」，讓搜尋優先探索看起來最有希望的路徑，從而大幅縮小實際展開範圍。

## 辨識題型的訊號

- 最短路/最小成本問題中，狀態空間太大，Dijkstra 會超時。
- 存在有效且易算的「到目標的距離估計」，如曼哈頓距離、歐幾里得距離。
- 拼圖、迷宮、滑塊遊戲、路徑規劃等具有明確幾何或結構啟發的問題。

## 核心想法與直覺

Dijkstra 的優先 key 是 g(u) = 從起點到 u 的實際成本。A* 把 key 改為 f(u) = g(u) + h(u)，其中 h(u) 是對剩餘成本的估計。若 h(u) 永不高估實際剩餘成本（可容許），則 A* 第一次取出目標時仍保證最優。

## 狀態／資料結構定義

- `g[state]`：從起點到該狀態的實際累積成本。
- `h(state)`：啟發函數，估計到目標的剩餘成本。
- `f(state) = g(state) + h(state)`：priority_queue 的排序 key。
- 與 Dijkstra 相同，需要 dist/g 陣列與前驅記錄。

## 不變量或正確性證明

若啟發函數 h 可容許（對所有狀態 u，h(u) <= h*(u)，其中 h*(u) 是真實最短路徑成本），且邊權非負，則 A\* 第一次從優先佇列中取出目標狀態 t 時，g(t) 即為全局最短路徑成本。

證明：假設存在另一條更短路徑成本 C < g(t)。該路徑上必有一個節點 x 仍在 frontier 中（否則 t 已被這條路徑發現）。由於 h(x) <= h*(x)，f(x) = g(x) + h(x) <= g(x) + h*(x) = C < g(t) <= f(t)。因此 x 的 f 值小於 t，應該在 t 之前被取出，矛盾。故 g(t) 已是最小。

## 逐步演算法

1. 初始化 g[start] = 0，計算 h(start)，將 (f(start), start) 推入 priority_queue。
2. 當 pq 非空：
   - 取出 f 值最小的狀態 u。
   - 若 u 是目標，回傳 g(u)。
   - 對每個鄰居 v 與邊權 w：若 g(u) + w < g(v)，更新 g(v)，計算 f(v) = g(v) + h(v)，推入 pq。
3. 若 pq 為空且未找到目標，表示無路徑。

## C++17 模板

```cpp
#include <cmath>
#include <limits>
#include <queue>
#include <string>
#include <tuple>
#include <vector>

struct Point {
    int x;
    int y;
};

// Manhattan distance heuristic
int heuristic(const Point& a, const Point& b) {
    return std::abs(a.x - b.x) + std::abs(a.y - b.y);
}

int astar_grid(const Point& start, const Point& goal,
               const std::vector<std::string>& grid) {
    const int rows = static_cast<int>(grid.size());
    const int cols = static_cast<int>(grid[0].size());
    const int INF = std::numeric_limits<int>::max() / 4;

    std::vector<std::vector<int>> g(rows, std::vector<int>(cols, INF));
    using Node = std::tuple<int, int, int>; // f, x, y
    std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;

    g[start.y][start.x] = 0;
    pq.emplace(heuristic(start, goal), start.y, start.x);

    const int dy[4] = {-1, 1, 0, 0};
    const int dx[4] = {0, 0, -1, 1};

    while (!pq.empty()) {
        const auto [f, y, x] = pq.top();
        pq.pop();
        if (y == goal.y && x == goal.x) return g[y][x];
        if (f != g[y][x] + heuristic({x, y}, goal)) continue;

        for (int d = 0; d < 4; ++d) {
            const int ny = y + dy[d];
            const int nx = x + dx[d];
            if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
            if (grid[ny][nx] == '#') continue;
            if (g[y][x] + 1 < g[ny][nx]) {
                g[ny][nx] = g[y][x] + 1;
                pq.emplace(g[ny][nx] + heuristic({nx, ny}, goal), ny, nx);
            }
        }
    }
    return -1;
}
```

## 時間與空間複雜度

最壞情況下 h(u)=0 退化成 Dijkstra，時間 O(E log V)。若啟發函數強且準確，實際展開節點數可大幅減少，甚至接近 O(d)。空間 O(V) 存放 g 與 priority_queue。

## 常見錯誤與邊界條件

- 啟發函數不可容許（高估剩餘成本），導致第一次取出目標時不一定最優。
- 忘記把 h 加入 priority_queue 的 key，變成純 Dijkstra。
- 在網格中使用歐幾里得距離卻允許四向移動，導致 h 不可容許。
- 未檢查過時條目（g 值已更新），導致重複展開。

## 與相似技巧的比較

Dijkstra 是 h(u)=0 的 A* 特例。IDA* 用迭代加深控制 A\* 的空間，犧牲重複搜尋換取 O(深度) 的記憶體。貪心最佳優先用只考慮 h(u) 而不考慮 g(u)，不保證最優但速度最快。

## 例題與分級練習

先在四向迷宮中比較 A* 與 Dijkstra 的展開節點數，再嘗試八向移動配合切比雪夫距離啟發。進階可研究一致啟發函數的設計與動態加權 A*。

## 本節重點速查

A\* = Dijkstra + 啟發函數 h；h 必須可容許（不高估）；priority_queue 的 key 是 g+h；第一次取出目標即最優；啟發越強展開越少。
