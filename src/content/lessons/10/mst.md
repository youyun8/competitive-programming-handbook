---
id: mst
volume: lower
source_file: lower-volume
chapter: 10
section: '10.9'
title: 最小生成樹：Kruskal 與 Prim
summary: 以貪婪策略選邊或擴充點集，在連通無向圖上找權重和最小的生成樹。
prerequisites: [graphs, union-find, priority-queue]
learning_goals:
  - 理解割性質與安全邊的概念
  - 實作 Kruskal 與 Prim
  - 處理次小生成樹與嚴格次小生成樹
concepts: [mst, kruskal, prim, cut-property]
complexity:
  time: Kruskal O(E log E), Prim O(E log V)
  space: O(V + E)
related_exercises: ['mst-kruskal']
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

在連通無向帶權圖中，選出一棵連接所有點的樹，使總邊邊權最小。應用於網路建設、集群合併、近似最短路等。

## 辨識題型的訊號

連通所有點、最小總成本、可能有多棵生成樹需輸出方案數或次小值、瓶頸邊。

## 核心想法與直覺

割性質：任意把點分成兩部分，跨越割的最小權邊一定屬於某棵 MST。Kruskal 從全域最小邊開始，不形成環就加入，相當於每次選一個合法割的最小邊。Prim 從單點擴充，每次選連接已選集合與未選集合的最小邊。

## 狀態／資料結構定義

Kruskal：邊按權重排序，Union-Find 判環。Prim：`min_edge[u]` 表示已選集合到 u 的最小邊權，最小堆維護候選邊。

## 不變量或正確性證明

Kruskal：每次加入的邊都是某個割的最小跨越邊（因為所有更小的邊都已處理，且未形成環意味該邊連接兩個不同連通分量）。由割性質，這條邊安全，屬於某 MST。Prim：已選集合的邊構成 MST 的一部分，每次加入的 `min_edge` 是連接已選與未選集合的最小邊，即一個合法割的最小跨越邊，安全。

## 逐步演算法（Kruskal）

1. 所有邊按權重排序；
2. 逐條檢查，若兩端點不在同一 Union-Find 集合就合併並選入 MST；
3. 選了 V-1 條邊即完成。

## C++17 模板

```cpp
#include <algorithm>
#include <vector>

struct UnionFind {
    std::vector<int> parent;
    UnionFind(int n) : parent(n) {
        for (int i = 0; i < n; ++i) { parent[i] = i; }
    }
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }
    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) { return false; }
        parent[b] = a;
        return true;
    }
};

struct WeightedEdge {
    int u = 0;
    int v = 0;
    int w = 0;
    bool operator<(const WeightedEdge& other) const {
        return w < other.w;
    }
};

long long kruskal(int node_count, std::vector<WeightedEdge> edges) {
    std::sort(edges.begin(), edges.end());
    UnionFind uf(node_count);
    long long total = 0;
    int chosen = 0;
    for (const auto& edge : edges) {
        if (uf.unite(edge.u, edge.v)) {
            total += edge.w;
            if (++chosen == node_count - 1) { break; }
        }
    }
    return total;
}
```

## 時間與空間複雜度

Kruskal 排序 O(E log E)，Union-Find 幾乎 O(1) 每次。Prim 堆版本 O(E log V)。空間皆 O(V+E)。

## 常見錯誤與邊界條件

圖不連通導致無法選夠 V-1 條邊；重邊未保留導致次小生成樹錯誤； Prim 初始化時所有點都推入堆；有向邊誤用 MST；0-based 與 1-based 索引混用。

## 與相似技巧的比較

Kruskal 邊排序後貪婪，適合稀疏圖。Prim 點擴充，適合稠密圖（可用陣列優化到 O(V^2)）。Boruvka 可平行化，但常數較大。

## 例題與分級練習

基本 MST、次小生成樹、瓶頸生成樹、MST 唯一性判定、最小生成森林。

## 本節重點速查

割性質是核心；Kruskal 排序後並查集判環；Prim 擴充點集選最小跨邊；貪婪策略保證最優。
