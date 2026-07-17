---
id: two-sat
volume: lower
source_file: lower-volume
chapter: 10
section: '10.7'
title: 2-SAT：布林約束的可滿足性與構造解
summary: 以蘊含圖與強連通分量，把每個變數兩種狀態化為點，線性判定並構造滿足解。
prerequisites: [graphs, scc, boolean-logic]
learning_goals:
  - 把每個子句轉成蘊含圖的有向邊
  - 用 SCC 判定可滿足性
  - 根據 SCC 拓撲序構造一組滿足解
concepts: [2-sat, implication-graph, satisfiability]
complexity:
  time: O(V + E)
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

給定一組子句，每個子句最多兩個字元，判定是否存在布林變數指派使所有子句為真，並輸出一組可行解。應用於約束滿足、配置選項、邏輯謎題等。

## 辨識題型的訊號

每個變數只有真假兩種狀態、子句形式為 (a or b)、至多兩個變數的互斥條件、選擇問題的二元決策。

## 核心想法與直覺

子句 `(a or b)` 等價於 `(¬a → b)` 且 `(¬b → a)`。把每個變數的真假視為兩個節點，每個蘊含關係視為有向邊。若 `a` 與 `¬a` 在同一強連通分量，則矛盾，無解。否則縮點後的 DAG 中，拓撲序較大的分量取真即可。

## 狀態／資料結構定義

變數 `i` 的兩個節點：`2*i`（假）與 `2*i+1`（真）或類似映射。蘊含圖為有向圖，邊數為子句數的兩倍。

## 不變量或正確性證明

若 `a` 與 `¬a` 在同一 SCC，則存在路徑 `a → ... → ¬a` 與 `¬a → ... → a`，意味 a 與 ¬a 必須同時為真，矛盾。反之若所有變數的真假都不在同一 SCC，則縮點後 DAG 中每個 SCC 及其對偶 SCC 互不相交。取拓撲序較大的 SCC 為真，可以保證所有蘊含邊都從假指向真，不產生矛盾。

## 逐步演算法

1. 為每個子句 `(a or b)` 添加邊 `¬a → b` 與 `¬b → a`；
2. 在蘊含圖上跑 SCC（如 Kosaraju 或 Tarjan）；
3. 檢查每個變數的真假是否在同一 SCC；
4. 若無矛盾，按 SCC 拓撲序遞減，為每個變數選擇序較大的狀態。

## C++17 模板

```cpp
#include <vector>

struct TwoSat {
    int n;
    std::vector<std::vector<int>> graph;
    std::vector<int> component;
    std::vector<bool> assignment;

    explicit TwoSat(int variables) : n(variables), graph(2 * n), component(2 * n, -1), assignment(n) {}

    int var_index(int id, bool is_true) {
        return 2 * id + (is_true ? 1 : 0);
    }

    void add_or(int a, bool a_true, int b, bool b_true) {
        graph[var_index(a, !a_true)].push_back(var_index(b, b_true));
        graph[var_index(b, !b_true)].push_back(var_index(a, a_true));
    }

    void dfs1(const std::vector<std::vector<int>>& g, std::vector<bool>& used, std::vector<int>& order, int u) {
        used[u] = true;
        for (int v : g[u]) {
            if (!used[v]) dfs1(g, used, order, v);
        }
        order.push_back(u);
    }

    void dfs2(const std::vector<std::vector<int>>& rg, int u, int label) {
        component[u] = label;
        for (int v : rg[u]) {
            if (component[v] == -1) dfs2(rg, v, label);
        }
    }

    bool satisfiable() {
        std::vector<bool> used(2 * n);
        std::vector<int> order;
        for (int i = 0; i < 2 * n; ++i) {
            if (!used[i]) dfs1(graph, used, order, i);
        }
        std::vector<std::vector<int>> reverse_graph(2 * n);
        for (int u = 0; u < 2 * n; ++u) {
            for (int v : graph[u]) {
                reverse_graph[v].push_back(u);
            }
        }
        int label = 0;
        for (int i = 2 * n - 1; i >= 0; --i) {
            int u = order[i];
            if (component[u] == -1) {
                dfs2(reverse_graph, u, label++);
            }
        }
        for (int i = 0; i < n; ++i) {
            if (component[2 * i] == component[2 * i + 1]) {
                return false;
            }
            assignment[i] = component[2 * i + 1] > component[2 * i];
        }
        return true;
    }
};
```

## 時間與空間複雜度

蘊含圖點數 2V，邊數 2E。SCC 時間 O(V+E)，總時間 O(V+E)，空間 O(V+E)。

## 常見錯誤與邊界條件

真值映射搞反（`var_index` 定義錯誤）；子句只有一個字元時需補 `(a or a)`；自蘊含邊導致 SCC 判定錯誤；拓撲序方向取反導致解矛盾；0-based 與 1-based 索引混用。

## 與相似技巧的比較

一般 SAT 是 NP-完全問題，但每個子句限定兩個字元時變成多項式時間。差分約束系統也轉換為圖論問題，但處理的是不等式而非布林邏輯。

## 例題與分級練習

變數互斥約束、棋盤覆蓋二選一、拓撲選擇、開關問題、圖的雙色擴展。

## 本節重點速查

(a or b) 等價於兩條蘊含邊；真假同一 SCC 則矛盾；拓撲序大者為真；線性可解。
