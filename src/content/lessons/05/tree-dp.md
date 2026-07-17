---
id: tree-dp
volume: upper
source_file: upper-volume
chapter: 5
section: '5.6'
title: 樹形 DP
summary: 以後序 DFS 把子樹資訊往上合併，在樹結構上完成動態規劃。
prerequisites: [trees, dynamic-programming, dfs]
learning_goals: [用 DFS 定義子樹狀態, 合併子節點結果, 掌握背包型樹形 DP]
concepts: [tree-dp, subtree-dp, knapsack-on-tree]
complexity:
  time: O(n) 簡單樹形 DP，O(n × capacity) 背包型
  space: O(n) 或 O(n × capacity)
related_exercises: []
source_book_pages: [353, 359]
source_pdf_pages: [371, 377]
review_status: verified
---

## 這個技術解決什麼問題

當決策結構天然是樹狀（部門預算、依賴賴關係、樹上的獨立集、最小點覆蓋），且子樹問題彼此獨立，就可把每棵子樹當狀態做 DP。

## 辨識題型的訊號

給定一棵樹，要求選點或選邊滿足條件；點之間有父子限制（如選父不能選子）。也常見「樹上背包」選若干節點帶權重與價值。

## 核心想法與直覺

後序遍歷先處理子節點，再把子節點的 DP 數組合併到父節點。子樹之間互不干擾，因此可以枚舉每個子節點的貢獻。

## 狀態／資料結構定義

`dp[u][k]` 表示以 u 為根的子樹中，某種屬性（例如選 k 個節點、u 選或不選）的最佳值。最簡單版本是 `dp[u][0/1]` 表示 u 不選或選。

## 不變量或正確性證明

由於樹無環，子樹之間僅透過父節點相連。後序遍歷保證處理 u 時所有子樹結果已確定。枚舉子節點合併時類似背包，保證每個子樹只被計入一次。

## 逐步演算法

1. 建鄰接表並選根（通常 0 或 1）。
2. DFS(u, parent)：
   a. 初始化 `dp[u]` 為基底（如只選 u 自身的狀態）。
   b. 對每個子節點 v ≠ parent：
      - 遞迴處理 v。
      - 做背包合併：新 dp = 合併(dp[u], dp[v])。
3. 回傳 `dp[u]`。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class TreeDpTemplate {
public:
    static int tree_independent_set(const vector<vector<int>>& tree) {
        const int n = static_cast<int>(tree.size());
        vector<array<int, 2>> dp(n);
        function<void(int, int)> dfs = [&](int u, int parent) {
            dp[u][0] = 0; // u 不選
            dp[u][1] = 1; // u 選，權重為 1
            for (int v : tree[u]) {
                if (v == parent) continue;
                dfs(v, u);
                dp[u][0] += max(dp[v][0], dp[v][1]);
                dp[u][1] += dp[v][0];
            }
        };
        dfs(0, -1);
        return max(dp[0][0], dp[0][1]);
    }

    static vector<int> tree_knapsack(const vector<vector<int>>& tree,
                                     const vector<int>& weight,
                                     const vector<int>& value,
                                     int capacity) {
        const int n = static_cast<int>(tree.size());
        vector<vector<int>> dp(n, vector<int>(capacity + 1, 0));
        function<void(int, int)> dfs = [&](int u, int parent) {
            for (int c = weight[u]; c <= capacity; ++c) {
                dp[u][c] = value[u];
            }
            for (int v : tree[u]) {
                if (v == parent) continue;
                dfs(v, u);
                for (int c = capacity; c >= weight[u]; --c) {
                    for (int k = 0; k <= c - weight[u]; ++k) {
                        dp[u][c] = max(dp[u][c], dp[u][c - k] + dp[v][k]);
                    }
                }
            }
        };
        dfs(0, -1);
        return dp[0];
    }
};
```

## 時間與空間複雜度

簡單樹形 DP（如獨立集）時間 O(n)，空間 O(n)。樹上背包時間 O(n × capacity²)，可用優化降至 O(n × capacity)。

## 常見錯誤與邊界條件

- 沒有排除父節點導致無限遞迴。
- 背包合併時容量上界寫錯。
- 選根後有重邊或孤立點。
- 多棵樹（森林）時需要每棵都 DFS。

## 與相似技巧的比較

換根 DP 是樹形 DP 的變形，先做一遍後再做第二遍轉移父節點資訊；樹鏈剖分則是把鏈上的問題轉成序列問題。

## 例題與分級練習

- 入門：樹上最大獨立集、樹上最小點覆蓋。
- 中級：樹上背包（選課問題）。
- 進階：換根 DP、樹形依賴背包優化。

## 本節重點速查

後序遍歷；子樹背包合併；狀態含「選／不選」屬性；注意容量與無向邊的回溯。
