---
id: eulerian-path
volume: lower
source_file: lower-volume
chapter: 10
section: '10.3'
title: 歐拉路：一次走完所有邊的路徑與迴路
summary: 以度數條件判定歐拉路存在性，並用 DFS 搭配刪邊輸出實際路徑。
prerequisites: [graphs, dfs]
learning_goals:
  - 判斷歐拉路與歐拉迴路的存在條件
  - 實作 Hierholzer 演算法輸出路徑
  - 區分有向圖與無向圖的度數條件差異
concepts: [eulerian-path, eulerian-circuit, degree-condition]
complexity:
  time: O(V + E)
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

給定圖，判斷是否存在一條經過每條邊恰好一次的路徑（歐拉路）或迴路（歐拉迴路），並輸出該路徑。經典應用包括一筆畫問題、路線規劃、DNA 組裝。

## 辨識題型的訊號

一次走完所有邊、每條路只能走一次、筆畫問題、郵差路線、De Bruijn 序列。

## 核心想法與直覺

無向圖中，歐拉迴路要求所有點度數為偶數；歐拉路恰好有兩個點度數為奇數，分別作為起點與終點。有向圖則看入度與出度：迴路要求所有點入度等於出度；路線要求一點出度比入度多 1（起點），一點入度比出度多 1（終點），其餘相等。

## 狀態／資料結構定義

每條邊標記是否已走訪；鄰接表儲存邊索引以便刪除；度數陣列統計入度與出度。

## 不變量或正確性證明

Hierholzer 演算法：從起點出發 DFS，走到無路時把該點壓入答案；回溯時把中間點也壓入。因為每次刪邊都保證了該邊只走一次，且度數條件保證了「走進一點必能走出」（除了起終點），所以過程不會被困在中間點。最終答案反轉即為歐拉路。

## 逐步演算法

1. 統計度數，判斷存在性與起點；
2. 若為無向圖，選擇最小的奇度點為起點（或任意點）；
3. 從起點 DFS，對每條未走訪邊繼續深入，標記該邊已走；
4. 無路可走時把當前點加入暫存路徑；
5. 反轉暫存路徑即為答案。

## C++17 模板

```cpp
#include <algorithm>
#include <vector>

struct EulerianEdge {
    int to;
    int index;
};

std::vector<int> hierholzer(int node_count, const std::vector<std::vector<EulerianEdge>>& adj, int start) {
    std::vector<int> path;
    std::vector<int> ptr(node_count);
    int edge_count = 0;
    for (const std::vector<EulerianEdge>& edges : adj) {
        for (const EulerianEdge& edge : edges) {
            edge_count = std::max(edge_count, edge.index + 1);
        }
    }
    std::vector<bool> used(edge_count, false);

    auto dfs = [&](auto&& self, int u) -> void {
        while (ptr[u] < static_cast<int>(adj[u].size())) {
            const EulerianEdge& edge = adj[u][ptr[u]++];
            if (used[edge.index]) { continue; }
            used[edge.index] = true;
            self(self, edge.to);
        }
        path.push_back(u);
    };

    dfs(dfs, start);
    std::reverse(path.begin(), path.end());
    return path;
}
```

## 時間與空間複雜度

判定存在性需統計度數 O(V+E)；Hierholzer 每條邊只走訪一次，時間 O(V+E)，空間 O(V+E)。

## 常見錯誤與邊界條件

圖不連通；有孤立的無邊點干擾度數判斷；無向邊重複標記；答案順序顛倒；有向圖的正向與反向邊處理錯誤。

## 與相似技巧的比較

哈密頓路是每個點恰好走一次，屬於 NP-完全問題。歐拉路是每條邊恰好走一次，有多項式時間解法。中國郵差問題則允許重複走邊，以最小化總長度。

## 例題與分級練習

一筆畫問題、字典序最小歐拉路、De Bruijn 序列建構、混合圖歐拉路。

## 本節重點速查

無向迴路全偶度；無向路恰兩奇度；有向迴路出入相等；有向路起點出多一、終點入多一；Hierholzer 反轉得路徑。
