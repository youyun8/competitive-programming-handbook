---
id: lca
volume: upper
source_file: upper-volume
chapter: 4
section: '4.8'
title: LCA 倍增：在祖先鏈上做二進位跳躍
summary: 預處理 2 的冪次祖先，以 O(log n) 回答最近公共祖先與樹上距離。
prerequisites: [trees, dfs, binary-lifting]
learning_goals: [建立 up 表, 同步深度, 回答樹上距離]
concepts: [ancestor, binary-lifting, tree-distance]
complexity:
  time: O(n log n) preprocess, O(log n) query
  space: O(n log n)
related_exercises: []
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
visualizer: lca
---

## 這個技術解決什麼問題

在根樹中快速找兩點共同祖先中最深者，並延伸到樹上距離、路徑分解與跳到第 k 個祖先。

## 辨識題型的訊號

大量樹上兩點查詢、距離公式、路徑是否經過某點、需要把節點向上跳很多層。

## 核心想法與直覺

預先記錄每個節點的 $2^k$ 階祖先。先把深點提升到同深度，再從大步到小步同步提升，直到兩點父親相同。

## 狀態／資料結構定義

`up[k][v]` 是 `v` 的 $2^k$ 階祖先，`depth[v]` 是深度。

## 不變量或正確性證明

深度同步後，若兩點不相同，從最大跳躍量往下，只在跳後祖先仍不同時移動；因此不會跨過 LCA，最後兩點恰為 LCA 的不同孩子。

## 逐步演算法

DFS 建深度與 `up[0]`，動態規劃其餘祖先；查詢時依深度差的位元提升，再同步上跳。

## C++17 模板

```cpp
#include <vector>

int lift_node(int node, int distance, const std::vector<std::vector<int>>& up) {
    for (int bit = 0; distance > 0; ++bit, distance >>= 1) {
        if (distance & 1) node = up[bit][node];
    }
    return node;
}

int lowest_common_ancestor(
    int left,
    int right,
    const std::vector<int>& depth,
    const std::vector<std::vector<int>>& up
) {
    if (depth[left] < depth[right]) std::swap(left, right);
    left = lift_node(left, depth[left] - depth[right], up);
    if (left == right) return left;
    for (int bit = static_cast<int>(up.size()) - 1; bit >= 0; --bit) {
        if (up[bit][left] != up[bit][right]) {
            left = up[bit][left];
            right = up[bit][right];
        }
    }
    return up[0][left];
}
```

## 時間與空間複雜度

預處理 $O(n\log n)$，每次查詢 $O(\log n)$，空間 $O(n\log n)$。

## 常見錯誤與邊界條件

根的父親未定義、`log` 層數少一層、森林未分別處理、遞迴 DFS 深度過大。

## 與相似技巧的比較

Tarjan 離線 LCA 適合查詢全部事先已知；Euler Tour＋RMQ 可把 LCA 轉成區間最小深度；倍增最直觀且支援線上查詢。

## 例題與分級練習

先做 LCA，再用 `dist(u,v)=depth[u]+depth[v]-2*depth[lca]` 求距離，最後做路徑第 k 點。

## 本節重點速查

先同步深度；大步不跨過 LCA；最後回傳共同父親。
