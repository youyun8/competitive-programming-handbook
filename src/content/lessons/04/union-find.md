---
id: union-find
volume: upper
source_file: upper-volume
chapter: 4
section: '4.1'
title: 並查集：維護會合併的集合
summary: 以代表元、按大小合併與路徑壓縮處理動態連通性。
prerequisites: [trees, amortized-analysis]
learning_goals: [實作 find 與 unite, 解釋路徑壓縮, 辨認離線連通性]
concepts: [representative, path-compression, union-by-size]
complexity:
  time: O(alpha(n)) amortized
  space: O(n)
related_exercises: []
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
visualizer: union-find
---

## 這個技術解決什麼問題

並查集支援「兩點是否同組」與「合併兩組」，適合邊只增加、不需要拆除集合的動態連通性。

## 辨識題型的訊號

反覆加入關係、判斷是否已連通、Kruskal、等價類、離線反向處理刪除。

## 核心想法與直覺

每個集合選一個根作代表。`find` 沿父指標找根；`unite` 只需把一棵根樹接到另一棵。

## 狀態／資料結構定義

`parent[x]` 是父節點；根滿足 `parent[x] == x`。`size[x]` 只在根有效。

## 不變量或正確性證明

同一棵父指標樹中的節點有相同根，合併只改根的父指標，所以不會拆散既有集合。路徑壓縮改短路徑但不改根。

## 逐步演算法

初始化每點自成一組；查詢時壓縮路徑；合併時把小樹接到大樹，避免樹高失控。

## C++17 模板

```cpp
#include <numeric>
#include <vector>

class DisjointSet {
public:
    explicit DisjointSet(int count) : parent(count), size(count, 1) {
        std::iota(parent.begin(), parent.end(), 0);
    }

    int find(int node) {
        if (parent[node] != node) parent[node] = find(parent[node]);
        return parent[node];
    }

    bool unite(int left, int right) {
        left = find(left);
        right = find(right);
        if (left == right) return false;
        if (size[left] < size[right]) std::swap(left, right);
        parent[right] = left;
        size[left] += size[right];
        return true;
    }

private:
    std::vector<int> parent;
    std::vector<int> size;
};
```

## 時間與空間複雜度

兩種優化同時使用時，均攤時間為 $O(\alpha(n))$，實務上近似常數；空間 $O(n)$。

## 常見錯誤與邊界條件

對非根讀取 `size`、合併前沒有先找根、帶權並查集壓縮時忘記同步更新相對權值。

## 與相似技巧的比較

並查集不支援一般刪邊；需要動態森林路徑操作時考慮 LCT，需要整張圖的線上刪除則要更進階的動態連通結構。

## 例題與分級練習

先做連通性查詢，再做 Kruskal；進階可做奇偶關係或距離關係的帶權並查集。

## 本節重點速查

集合資訊只放在根；所有操作先 `find`；小樹接大樹，`find` 順便壓縮。
