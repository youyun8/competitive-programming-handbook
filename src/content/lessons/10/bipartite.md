---
id: bipartite
volume: lower
source_file: lower-volume
chapter: 10
section: '10.11'
title: 二分圖：染色、匹配與覆蓋
summary: 以染色判定二分性，以匈牙利或 Hopcroft-Karp 求最大匹配，並理解匹配與點覆蓋的對偶關係。
prerequisites: [graphs, bfs]
learning_goals:
  - 以 BFS/DFS 染色判定二分圖
  - 實作二分圖最大匹配
  - 應用 König 定理解決最小點覆蓋與最大獨立集
concepts: [bipartite, matching, hungarian, konig]
complexity:
  time: matching O(VE) naive, O(E√V) Hopcroft-Karp
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

判定圖是否為二分圖，並在二分圖上求最大匹配、最小點覆蓋、最大獨立集。廣泛應用於任務分配、棋盤覆蓋、資源調度等。

## 辨識題型的訊號

兩類物件互相配對、棋盤黑白染色、沒有奇環、無向圖中點可分兩組且組內無邊、任務與工人一對一。

## 核心想法與直覺

二分圖沒有奇數長度的環，可以用兩種顏色染色成功。最大匹配是不相鄰邊的最大集合。匈牙利算法不斷尋找增廣路來擴大匹配。Hopcroft-Karp 一次找出多條最短的增廣路，時間更優。

## 狀態／資料結構定義

染色陣列 `color`（0/1 或未染色）。匹配陣列 `match_to`，記錄右部點匹配到的左部點。匈牙利用 DFS 尋找增廣路；Hopcroft-Karp 用 BFS 分層再 DFS 找多條不相交增廣路。

## 不變量或正確性證明

增廣路定理：若當前匹配非最大，則存在增廣路（非匹配邊與匹配邊交錯，起終點皆未匹配）。沿增廣路翻轉會使匹配數 +1。匈牙利每次找一條增廣路，Hopcroft-Karp 一次找一組最短路層的增廣路，每輪最短路長度嚴格增加。

## 逐步演算法（匈牙利）

1. 初始化 match_to 為 -1；
2. 對每個左部點，重置 visited；
3. DFS 嘗試匹配：遍歷鄰居，若未訪問就標記，遞迴嘗試騰出該鄰居目前的匹配；
4. 成功則更新 match_to，匹配數 +1。

## C++17 模板

```cpp
#include <vector>

struct BipartiteMatching {
    std::vector<std::vector<int>> graph;
    std::vector<int> match_to;
    std::vector<bool> visited;

    explicit BipartiteMatching(int left_count) : graph(left_count) {}

    void add_edge(int u, int v) {
        graph[u].push_back(v);
    }

    bool dfs(int u) {
        for (int v : graph[u]) {
            if (visited[v]) continue;
            visited[v] = true;
            if (match_to[v] == -1 || dfs(match_to[v])) {
                match_to[v] = u;
                return true;
            }
        }
        return false;
    }

    int max_matching(int right_count) {
        match_to.assign(right_count, -1);
        int result = 0;
        for (int u = 0; u < static_cast<int>(graph.size()); ++u) {
            visited.assign(right_count, false);
            if (dfs(u)) ++result;
        }
        return result;
    }
};
```

## 時間與空間複雜度

染色 O(V+E)。匈牙利最壞 O(VE)。Hopcroft-Karp O(E√V)。空間 O(V+E)。

## 常見錯誤與邊界條件

有奇環卻未檢測；增廣路搜尋時 visited 未重置；匹配陣列只維護單邊導致無法回溯；未匹配點的處理；多重邊導致匹配數計算錯誤。

## 與相似技巧的比較

一般圖最大匹配需 Blossom 算法，遠比二分圖複雜。最大流也能解二分圖匹配，但匈牙利更直接且常數小。最小點覆蓋與最大獨立集在一般圖上是 NP-難，但在二分圖上可透過匹配在多項式時間解決。

## 例題與分級練習

二分圖判定、最大匹配數、最小點覆蓋、最大獨立集、完美匹配、DAG 最小路徑覆蓋。

## 本節重點速查

無奇環即可二分染色；增廣路翻轉加大匹配；König 得最小點覆蓋；最大獨立集 = 總點數 - 最小點覆蓋。
