---
id: directed-connectivity
volume: lower
source_file: lower-volume
chapter: 10
section: '10.5'
title: 有向圖連通性：強連通分量與縮點
summary: 以 Kosaraju 或 Tarjan 算法找出強連通分量，將有向圖縮成 DAG 以利後續處理。
prerequisites: [graphs, dfs]
learning_goals:
  - 實作 Kosaraju 與 Tarjan SCC
  - 理解縮點後的 DAG 性質
  - 將 SCC 應用於 2-SAT 與其他圖論模型
concepts: [scc, kosaraju, tarjan-scc]
complexity:
  time: O(V + E)
  space: O(V + E)
related_exercises: []
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

## 這個技術解決什麼問題

在有向圖中找出極大的互相可達子集（強連通分量），把每個 SCC 縮成一個點後，圖變成 DAG，可用於拓撲排序、最長路徑、2-SAT 等問題。

## 辨識題型的訊號

互相可達性、有向圖中的環檢測、選擇問題的蘊含圖、縮點後 DAG 上 DP。

## 核心想法與直覺

Kosaraju：第一次 DFS 記錄完成順序，第二次在反圖上依完成順序反向 DFS，每次 DFS 的點形成一個 SCC。Tarjan：用 DFS 樹與 low-link，類似無向圖的割點橋，但 low 只考慮還在遞迴堆疊上的點。

## 狀態／資料結構定義

Tarjan：`dfn[u]`、`low[u]`、遞迴堆疊標記 `on_stack`、實際堆疊 `stack`。Kosaraju：完成順序 `order`、訪問標記。

## 不變量或正確性證明

Kosaraju：在有向圖中，若把 SCC 縮縮點，則縮點後的 DAG 中，任何路的完成順序與原圖相反。因此反圖上按完成順序遞減 DFS，相當於從 DAG 的匯點開始，每個 SCC 只會被訪問一次。Tarjan：low[u] 是 u 透過樹邊與橫叉邊能連到還在堆疊中的最小 dfn。當 `dfn[u] == low[u]` 時，u 是該 SCC 在 DFS 樹中最淺的點，此時把堆疊彈到 u 即形成一個 SCC。

## 逐步演算法（Tarjan）

1. DFS，記錄 dfn、low，點入堆疊；
2. 對每條出邊，未訪問則遞迴更新 low，已訪問且在堆疊則更新 low；
3. 回溯時若 `dfn[u] == low[u]`，不斷彈出堆疊直到 u，這些點為一個 SCC。

## C++17 模板

```cpp
#include <vector>

struct TarjanSCC {
    std::vector<int> dfn;
    std::vector<int> low;
    std::vector<bool> on_stack;
    std::vector<int> stack;
    std::vector<int> component;
    int timer = 0;
    int component_count = 0;

    void dfs(const std::vector<std::vector<int>>& graph, int u) {
        dfn[u] = low[u] = ++timer;
        stack.push_back(u);
        on_stack[u] = true;
        for (int v : graph[u]) {
            if (!dfn[v]) {
                dfs(graph, v);
                low[u] = std::min(low[u], low[v]);
            } else if (on_stack[v]) {
                low[u] = std::min(low[u], dfn[v]);
            }
        }
        if (dfn[u] == low[u]) {
            while (true) {
                int v = stack.back();
                stack.pop_back();
                on_stack[v] = false;
                component[v] = component_count;
                if (v == u) break;
            }
            ++component_count;
        }
    }

    std::vector<int> solve(const std::vector<std::vector<int>>& graph) {
        int n = static_cast<int>(graph.size());
        dfn.assign(n, 0);
        low.assign(n, 0);
        on_stack.assign(n, false);
        component.assign(n, -1);
        for (int i = 0; i < n; ++i) {
            if (!dfn[i]) {
                dfs(graph, i);
            }
        }
        return component;
    }
};
```

## 時間與空間複雜度

每個點與有向邊各被訪問一次，時間 O(V+E)，空間 O(V+E)。

## 常見錯誤與邊界條件

反圖建錯導致 Kosaraju 失敗；Tarjan 中誤把已出堆疊的點當回邊；縮點後重邊未處理；單點 SCC 的邊界；有向邊方向搞反。

## 與相似技巧的比較

Kosaraju 需要建反圖與兩次 DFS，概念清晰但常數較大。Tarjan 一次 DFS 完成，空間較省，但遞迴深度需注意。兩者都線性。

## 例題與分級練習

SCC 個數、縮點後 DAG 最長路、2-SAT 判定、傳遞閉包、學校網路接入點。

## 本節重點速查

SCC 為互相可達極大子集；縮點得 DAG；Kosaraju 兩次 DFS；Tarjan 一次 DFS 彈堆疊。
