---
id: tree-divide-and-conquer
volume: upper
source_file: upper-volume
chapter: 4
section: '4.9'
title: 樹上分治：以重心遞迴分解路徑問題
summary: 每次選重心刪除，將樹上路徑統計分解為跨過重心與不跨過重心兩類，遞迴複雜度 O(n log n)。
prerequisites: [trees, recursion]
learning_goals:
  - 寫出靜態點分治的重心選取與刪除
  - 統計跨過重心的路徑資訊
  - 理解動態點分治的維護方式
concepts: [centroid-decomposition, static, dynamic]
complexity:
  time: O(n log n) for static
  space: O(n log n)
related_exercises: []
source_book_pages: [256, 276]
source_pdf_pages: [274, 294]
review_status: verified
---

## 這個技術解決什麼問題

樹上任意兩點之間的路徑數量或路徑總長直接枚舉是 $O(n^2)$。點分治每次選重心，把路徑分為「經過重心」與「完全在某子樹內」兩類；後者遞迴處理，前者只需合併各子樹到重心的距離資訊，單層 $O(n)$，總 $O(n \log n)$。

## 辨識題型的訊號

統計樹上路徑數量、路徑邊權和滿足某條件、樹上點對距離、K 遠點對、帶修改的樹上距離。

## 核心想法與直覺

重心保證刪除後最大子樹不超過 $n/2$，因此遞迴深度 $O(\log n)$。對每個重心，收集各子樹節點到重心的距離，用雙指標或雜湊表合併，統計經過重心的合法路徑。注意同一子樹內的路徑會被重複計算，要減去。

## 狀態／資料結構定義

`deleted[v]` 標記該節點是否已在更高層重心被刪除。`distances` 暫存當前子樹各節點到當前重心的距離。`subtree_size` 用於找重心。

## 不變量或正確性證明

任意樹上路徑若兩端在不同子樹（或一端為重心），恰在當前重心層被統計一次；若在同一子樹內，則由子樹的遞迴重心處理。因此每條路徑恰被計算一次。

## 逐步演算法

1. 在當前連通塊內 DFS 找重心。
2. 以重心為根，DFS 各子樹收集到重心的距離。
3. 對每個子樹，先用全局資料結構統計跨重心的路徑數，再把該子樹距離加入全局。
4. 標記重心已刪除，對各子樹遞迴。

## C++17 模板

```cpp
#include <algorithm>
#include <vector>

class CentroidDecomposition {
public:
    explicit CentroidDecomposition(const std::vector<std::vector<int>>& adjacency)
        : graph(adjacency), node_count(static_cast<int>(adjacency.size())),
          deleted(node_count, false), subtree(node_count, 0) {}

    void decompose(int entry) {
        compute_subtree(entry, -1);
        int centroid = find_centroid(entry, -1, subtree[entry]);
        process_centroid(centroid);
        deleted[centroid] = true;
        for (int neighbor : graph[centroid]) {
            if (!deleted[neighbor]) {
                decompose(neighbor);
            }
        }
    }

private:
    std::vector<std::vector<int>> graph;
    int node_count;
    std::vector<bool> deleted;
    std::vector<int> subtree;
    long long answer = 0;

    void compute_subtree(int node, int parent) {
        subtree[node] = 1;
        for (int neighbor : graph[node]) {
            if (neighbor == parent || deleted[neighbor]) {
                continue;
            }
            compute_subtree(neighbor, node);
            subtree[node] += subtree[neighbor];
        }
    }

    int find_centroid(int node, int parent, int total) const {
        for (int neighbor : graph[node]) {
            if (neighbor == parent || deleted[neighbor]) {
                continue;
            }
            if (subtree[neighbor] > total / 2) {
                return find_centroid(neighbor, node, total);
            }
        }
        return node;
    }

    void process_centroid(int centroid) {
        std::vector<int> all_distances;
        all_distances.push_back(0);
        for (int neighbor : graph[centroid]) {
            if (deleted[neighbor]) {
                continue;
            }
            std::vector<int> distances;
            collect_distances(neighbor, centroid, 1, distances);
            answer += static_cast<long long>(distances.size()) *
                      static_cast<long long>(all_distances.size());
            all_distances.insert(all_distances.end(), distances.begin(), distances.end());
        }
    }

    void collect_distances(int node, int parent, int depth, std::vector<int>& distances) {
        distances.push_back(depth);
        for (int neighbor : graph[node]) {
            if (neighbor == parent || deleted[neighbor]) {
                continue;
            }
            collect_distances(neighbor, node, depth + 1, distances);
        }
    }
};
```

## 時間與空間複雜度

每層處理 $O(n)$，深度 $O(\log n)$，總時間 $O(n \log n)$。空間 $O(n \log n)$ 儲存遞迴與距離陣列。

## 常見錯誤與邊界條件

同一子樹距離被重複加入導致多算、遞迴層數太深（可用迭代輔助）、重心計算時未排除已刪除節點。

## 與相似技巧的比較

樹鏈剖分適合路徑修改與查詢；點分治適合路徑統計與點對計數；動態點分治則在靜態點分治外層套一個修改結構。

## 例題與分級練習

先做「樹上距離不超過 K 的點對數」，再做帶邊權版本，最後挑戰動態點分治（支援修改子樹權重）。

## 本節重點速查

找重心、收集距離、先統計再加入、標記刪除後遞迴。核心公式：answer += 跨重心路徑 - 子樹內重複。
