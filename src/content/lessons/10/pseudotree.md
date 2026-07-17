---
id: pseudotree
volume: lower
source_file: lower-volume
chapter: 10
section: '10.6'
title: 基環樹：拆環為樹的經典結構
summary: 把每個連通分量恰含一環的圖拆成環與樹枝，分別處理後合併答案。
prerequisites: [trees, graphs, dfs]
learning_goals:
  - 辨識基環樹與功能圖的結構
  - 以 DFS 拓撲或入度消除找出環上節點
  - 在環與樹枝上各自做 DP 再合併
concepts: [pseudotree, functional-graph, cycle-detection]
complexity:
  time: O(V + E)
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

處理每個連通分量邊數恰等於點數（即恰有一環）的圖，或每個點出度為 1 的功能圖。常見於選擇問題、有向無環基環樹上的 DP、最小覆蓋等。

## 辨識題型的訊號

每個點恰好選一個、N 個點 N 條邊、功能圖（每點出度為 1）、環與樹的混合結構、仙人掌圖的特例。

## 核心想法與直覺

基環樹的結構可以看成「一個環，每個環上點長出一棵樹」。只要把環切開，每棵樹就能獨立處理，最後在環上跑環形 DP 合併各樹的結果。

## 狀態／資料結構定義

每個點的父親、入度、是否在環上。先以拓撲方式（剝葉子）找出所有環上節點，再對每棵樹枝做以環上節點為根的樹 DP。

## 不變量或正確性證明

在無向基環樹中，邊數 = 點數，所以每個連通分量恰有一環。不斷移除葉子（度數為 1 的點）不會破壞環，最終剩下的就是環上節點。對有向功能圖，不斷移除入度為 0 的點同理。每個被移除的點都屬於唯一的樹枝，以環上節點為根做樹 DP 即可。

## 逐步演算法

1. 統計每點入度（或度數）；
2. 把入度 0（或度數 1）的點入隊，不斷移除並更新鄰點入度；
3. 未被移除的點即為環上節點；
4. 以每個環上點為根，對樹枝部分做樹 DP；
5. 在環上跑環形 DP（破環成鏈，分首個點選或不選等情形）。

## C++17 模板

```cpp
#include <queue>
#include <vector>

std::vector<int> find_cycle_nodes(const std::vector<std::vector<int>>& graph) {
    int n = static_cast<int>(graph.size());
    std::vector<int> degree(n);
    for (int u = 0; u < n; ++u) {
        degree[u] = static_cast<int>(graph[u].size());
    }
    std::queue<int> queue;
    std::vector<bool> removed(n, false);
    for (int i = 0; i < n; ++i) {
        if (degree[i] <= 1) {
            queue.push(i);
            removed[i] = true;
        }
    }
    while (!queue.empty()) {
        int u = queue.front();
        queue.pop();
        for (int v : graph[u]) {
            if (removed[v]) continue;
            if (--degree[v] <= 1) {
                removed[v] = true;
                queue.push(v);
            }
        }
    }
    std::vector<int> cycle_nodes;
    for (int i = 0; i < n; ++i) {
        if (!removed[i]) {
            cycle_nodes.push_back(i);
        }
    }
    return cycle_nodes;
}
```

## 時間與空間複雜度

剝葉子與後續 DP 都各走訪每條邊一次，時間 O(V+E)，空間 O(V+E)。

## 常見錯誤與邊界條件

自環視為長度 1 的環；重邊影響度數計數；環形 DP 忘記處理首尾相連；功能圖中多個環未獨立處理；樹 DP 根節點狀態未正確初始化。

## 與相似技巧的比較

一般樹上 DP 無環，可直接遞迴。基環樹需先拆環。仙人掌圖允許多個環，但更複雜。拓撲排序用於 DAG，基環樹則用剝葉子找出環。

## 例題與分級練習

基環樹最大獨立集、功能圖週期長度、基環樹最短路徑、選擇問題（每點恰選一條出邊）。

## 本節重點速查

邊數 = 點數即含一環；剝葉子找出環上節點；樹枝部分獨立 DP；環上破環成鏈做 DP。
