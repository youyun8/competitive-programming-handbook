---
id: iddfs
volume: upper
source_file: upper-volume
chapter: 3
section: '3.9'
title: IDDFS 與 IDA*：迭代加深的記憶體精簡搜尋
summary: 透過逐步放寬深度限制，讓 DFS 保有線性記憶體的同時獲得最優解，並以 IDA* 結合啟發函數進一步加速。
prerequisites: [pruning, astar, recursion]
learning_goals:
  - 實作 IDDFS 並理解其空間優勢
  - 設計適用於 IDA* 的可容許啟發函數
  - 掌握「下界超過上限即剪枝」的核心判斷
concepts: [iddfs, iterative-deepening, depth-bound, ida-star, evaluation-function]
complexity:
  time: O(b^d)，常數因子較大；空間 O(d)
  space: O(d)
related_exercises: ['iddfs-eight-puzzle']
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

BFS 保證最優解但空間是 O(b^d)；DFS 空間只有 O(d) 但可能深陷無窮分支或因深度無界而找不到解。IDDFS（Iterative Deepening DFS）結合兩者優點：從深度限制 1 開始，反覆執行有深度上限的 DFS，直到找到目標。雖然會重複搜尋淺層節點，但總時間複雜度仍為 O(b^d)，因為深層的節點數遠多於淺層。IDA* 則在 IDDFS 中加入 A* 的 f = g + h 評估函數，在深度限制設為 f 值上限時進行剪枝。

## 辨識題型的訊號

- 狀態空間極大或無界，BFS 記憶體會爆炸。
- 需要最優解（最少步數），且分支因子固定。
- 有明確的啟發函數可估計剩餘步數，如拼圖、魔方、滑塊遊戲。
- 深度不大但廣度極大的搜尋樹。

## 核心想法與直覺

IDDFS 就像潛水：先試試水深 1 公尺，找不到再試 2 公尺，依此類推。雖然每次都重新游過前一段已經找過的區域，但海床的面積指數成長，所以淺層重複的開銷相對微不足道。IDA\* 則不只限制深度，還限制 g+h 的總評估值，若當前分支的 f 值已超過界限，立刻回頭不浪費時間。

## 狀態／資料結構定義

- `depth_limit`：目前允許的最大深度或 f 值上限。
- `g(state)`：從起點到當前狀態的實際深度/成本。
- `h(state)`：啟發函數估計剩餘成本。
- `next_bound`：本輪搜尋中超出界限的最小 f 值，用於設定下一輪的界限。

## 不變量或正確性證明

IDDFS 中，當 depth_limit = d 時，DFS 會完整搜尋所有深度不超過 d 的路徑。若最短路徑長度為 d*，則在 depth_limit 達到 d* 時，目標一定被找到，且由於更小深度已被排除無解，找到的路徑長度即為最優。

IDA* 中，若 h 可容許，則對於任何狀態，f = g + h <= g + h* = 真實最短路徑成本。因此若 f > bound，該分支的真實最短路徑成本也必然 > bound，安全剪枝。當 bound 逐步增加至最優解成本時，目標一定在搜尋範圍內。

## 逐步演算法

IDDFS：

1. 設定 depth_limit = 1。
2. 執行有深度限制的 DFS，只搜尋深度 <= depth_limit 的節點。
3. 若找到目標，回傳；否則 depth_limit 增加 1，回到步驟 2。

IDA\*：

1. 初始 bound = h(start)。
2. 執行 DFS，過程中計算 f = g + h。
3. 若 f > bound，記錄 next_bound = min(next_bound, f)，並剪枝。
4. 若找到目標，回傳；否則 bound = next_bound，回到步驟 2。

## C++17 模板

```cpp
#include <vector>
#include <string>
#include <limits>

// IDA* template; adapt state and heuristic to problem
struct Solver {
    using State = std::string;

    int heuristic(const State& s, const State& goal) {
        int dist = 0;
        for (size_t i = 0; i < s.size(); ++i) {
            if (s[i] != goal[i]) { ++dist; }
        }
        return dist;
    }

    std::vector<State> neighbors(const State& s) {
        (void)s;
        return {}; // problem-specific generation
    }

    int ida_star(const State& start, const State& goal) {
        int bound = heuristic(start, goal);
        while (true) {
            int next_bound = std::numeric_limits<int>::max();
            int result = search(start, goal, 0, bound, next_bound);
            if (result >= 0) { return result; }
            if (next_bound == std::numeric_limits<int>::max()) { return -1; }
            bound = next_bound;
        }
    }

    int search(const State& node, const State& goal, int g, int bound, int& next_bound,
               State* parent = nullptr) {
        const int f = g + heuristic(node, goal);
        if (f > bound) {
            next_bound = std::min(next_bound, f);
            return -1;
        }
        if (node == goal) { return g; }
        for (const auto& nxt : neighbors(node)) {
            if (parent && nxt == *parent) { continue; }
            int result = search(nxt, goal, g + 1, bound, next_bound, const_cast<State*>(&node));
            if (result >= 0) { return result; }
        }
        return -1;
    }
};
```

## 時間與空間複雜度

IDDFS 總時間為 O(b^d)，因為淺層重複搜尋的總成本被幾何級數收斂控制。空間僅為遞迴深度 O(d)。IDA\* 同樣空間 O(d)，時間取決於啟發函數品質；好的 h 能讓實際展開節點數逼近最優路徑上的節點數。

## 常見錯誤與邊界條件

- depth_limit 增加步長不當，若一次加很多可能跳過最優解，靠枚舉步長可避免。
- 啟發函數不可容許，導致 IDA\* 在最優解出現前誤判而剪枝。
- DFS 未記錄前驅狀態，導致在無向圖的邊來回震盪形成無窮迴圈。
- next_bound 初始化錯誤或忘記更新，造成死迴圈。
- 狀態生成鄰居時未排除「剛剛走過的反向操作」，浪費大量搜尋空間。

## 與相似技巧的比較

BFS 空間 O(b^d)，適合狀態空間小的問題。A* 空間 O(V)，展開較少但需要存 frontier。IDDFS/IDA* 犧牲重複搜尋換取 O(d) 空間，是記憶體受限環境的首選。雙向 BFS 也能降低搜尋空間，但需要明確終點且轉移可逆。

## 例題與分級練習

先以「數字華容道」或「八拼圖」練習純 IDDFS，再引入曼哈頓距離啟發改寫為 IDA*。進階可嘗試 15-puzzle 或 Cube 的 IDA* 解法。

## 本節重點速查

IDDFS = 限制深度的 DFS + 逐步放寬限制；IDA\* = IDDFS + f = g+h 界限剪枝；空間 O(d)；啟發需可容許；記得排除反向操作避免來回震盪。
