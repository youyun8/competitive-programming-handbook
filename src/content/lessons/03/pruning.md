---
id: pruning
volume: upper
source_file: upper-volume
chapter: 3
section: '3.2'
title: 剪枝：砍掉不可能的搜尋分支
summary: 利用 BFS 判重、可行性剪枝與最優性剪枝，讓指數級搜尋空間收斂到可接受範圍。
prerequisites: [bfs-dfs, recursion]
learning_goals:
  - 在搜尋樹中識別並應用三種基本剪枝策略
  - 設計狀態的雜湊表示以實現 BFS 判重
  - 估算剩餘下界以進行最優性剪枝
concepts: [pruning, duplicate-detection, feasibility, optimality, search-space]
complexity:
  time: 視搜尋空間與剪枝強度而定
  space: O(狀態數)
related_exercises: []
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

暴力搜尋的複雜度通常是指數甚至階乘級。剪枝透過提前判定「這條路不可能到達解」或「已經有更優解存在」，直接捨棄整個子整個子樹，讓搜尋在實務上可完成。

## 辨識題型的訊號

- 題目要求數獨、迷宮、拼圖、排列組合枚舉。
- 狀態空間巨大但有效狀態稀疏。
- 需要「最少步數」「最短路徑」或「最優配置」。
- BFS/DFS 直接實作會超時或記憶體爆炸。

## 核心想法與直覺

BFS 判重：已經到過的狀態不必再進一次 queue，否則同一層會膨脹。
可行性剪枝：當前狀態已經違反題目硬性限制，往下走也沒用。
最優性剪枝：當前部分解的代價加上理論下界已經超過目前最佳答案，這條路不可能更優。

## 狀態／資料結構定義

- BFS 判重：`std::unordered_set<std::string>` 或 `std::set<std::vector<int>>`，或將狀態編碼為整數後用 `std::unordered_set<long long>`。
- 最優性剪枝：維護全域變數 `best_cost`，以及從當前狀態到達終點的啟發下界 `heuristic(state)`。

## 不變量或正確性證明

剪枝的正確性基於「被捨棄的分支不可能包含需要輸出的解」。可行性剪枝若只剪掉確定不可行的分支，就不會影響正確性。BFS 判重若狀態表示完備且轉移確定，則已訪問過的狀態的所有後繼都已被或正被展開，再次展開只會產生重複或更長路徑。最優性剪枝中，若當前累積成本 + 剩餘下界 >= best_cost，則任何此狀態的完整延伸都不可能優於已知 best_cost，安全可剪。

## 逐步演算法

1. 建立起點狀態，初始化 visited 與 best_cost。
2. 從 frontier 取出一個狀態。
3. 若狀態已達目標，更新 best_cost。
4. 對每個合法轉移：
   - 若轉移後狀態不可行，跳過（可行性剪枝）。
   - 若此狀態已 visited，跳過（判重）。
   - 若當前成本 + 下界 >= best_cost，跳過（最優性剪枝）。
   - 否則加入 frontier。

## C++17 模板

```cpp
#include <limits>
#include <string>
#include <unordered_set>
#include <vector>

// 示範：BFS 判重 + 可行性剪枝的框架
// 狀態用 string 編碼，例如 "123456780" 表示 3x3 拼圖
bool is_feasible(const std::string& state) {
    // 檢查硬性限制
    return !state.empty();
}

int heuristic_cost(const std::string& state) {
    // 剩餘步數下界估計
    (void)state;
    return 0;
}

void search_with_pruning(const std::string& start) {
    std::unordered_set<std::string> visited;
    std::vector<std::string> frontier{start};
    int best_cost = std::numeric_limits<int>::max();

    while (!frontier.empty()) {
        std::string state = frontier.back();
        frontier.pop_back();

        if (!is_feasible(state)) continue;

        const int cost = 0; // 實際應根據已走步數計算
        if (cost + heuristic_cost(state) >= best_cost) continue;

        if (state == "target") {
            best_cost = std::min(best_cost, cost);
            continue;
        }

        visited.insert(state);
        // generate neighbors...
        // if not visited, push to frontier
    }
}
```

## 時間與空間複雜度

剪枝後的時間取決於實際造訪的狀態數，從最壞指數降到多項式都有可能。空間需儲存 visited，通常等於實際造訪狀態數。

## 常見錯誤與邊界條件

- 狀態編碼不完備，導致不同實體狀態被視為相同（漏解）。
- 狀態編碼過度冗長，導致判重雜湊過慢。
- 最優性剪枝的下界估計過鬆，剪不掉應該剪的分支。
- DFS 中更新 best_cost 後忘了立即剪枝，導致大量無用搜尋。

## 與相似技巧的比較

BFS 判重是寬度優先的標準配備；DFS 回溯則更常搭配可行性與最優性剪枝。IDA\* 把最優性剪枝發揮到極致，用迭代加深配合啟發下界進行深度控制。

## 例題與分級練習

先以「數獨求解」練習可行性剪枝與判重，再以「旅行推銷員問題」小數據版本練習最優性剪枝與下界估計。

## 本節重點速查

三種剪枝：判重、可行性、最優性；判重要狀態編碼完備精簡；最優性剪枝的關鍵在於緊的下界估計。
