---
id: stack
volume: upper
source_file: upper-volume
chapter: 1
section: '1.3'
title: 堆疊：後進先出的回溯結構
summary: 掌握 STL stack、手寫堆疊與單調堆疊的原理，並能利用後進先出特性解決回溯與極值問題。
prerequisites: [arrays, queue]
learning_goals:
  - 理解 LIFO 原則與遞迴的對應關係
  - 手寫固定大小堆疊與動態堆疊
  - 使用單調堆疊求下個更大元素與區間極值
concepts: [lifo, monotone-stack, recursion-stack, bracket-matching]
complexity:
  time: O(1) 基本操作，O(n) 單調堆疊
  space: O(n)
related_exercises: ['monotone-stack-histogram']
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---


## 這個技術解決什麼問題

需要「最近」發生的事件優先被處理或撤銷時，堆疊提供後進先出的順序。它也是非遞迴 DFS、語法解析與回溯演算法的基礎資料結構。單調堆疊則能在線性時間內找到每個元素的「下個更大／更小元素」。

## 辨識題型的訊號

- 括號匹配、表達式求值、迷宮回溯。
- 需要記住歷史狀態以便撤銷的模擬題。
- 求「陣列中每個元素右邊第一個比它大的數」。
- 深度優先的非遞迴實作。

## 核心想法與直覺

堆疊就像一疊盤子：只能在頂端放入或取出。單調堆疊則在放入新元素前，把不可能成為後續答案的舊元素丟掉。例如，當新元素比堆疊頂端大時，頂端元素的下個更大元素就是這個新元素。

## 狀態／資料結構定義

手寫堆疊可用固定陣列：`int data[MAXN]; int top = -1;`
STL：`std::stack<T>`。
單調堆疊常用 `std::vector<T>` 或 `std::deque<T>` 自行維護，儲存元素值或索引。

## 不變量或正確性證明

對遞增單調堆單調堆疊（從底到頂遞減，求下個更大元素），每個元素入堆疊時，會先彈出所有不大於它的元素。被彈出的元素其「下個更大元素」就是當前元素。若某元素在堆疊中，其下方元素必嚴格小於它，且出現位置在它左邊。這保證了堆疊大小的單調性與答案的正確性。

## 逐步演算法

1. 初始化空堆疊，遍歷陣列每個位置 i。
2. 當堆疊非空且當前值大於堆疊頂端對應值時：
   - 彈出頂端，記錄其「下個更大元素」為當前值。
3. 將當前索引推入堆疊。
4. 遍歷結束後，堆疊中剩餘元素的「下個更大元素」為不存在（標記 -1）。

## C++17 模板

```cpp
#include <vector>

std::vector<int> next_greater_element(const std::vector<int>& values) {
    const int n = static_cast<int>(values.size());
    std::vector<int> answer(n, -1);
    std::vector<int> mono; // stores indices, values decreasing from bottom

    for (int i = 0; i < n; ++i) {
        while (!mono.empty() && values[mono.back()] < values[i]) {
            answer[mono.back()] = values[i];
            mono.pop_back();
        }
        mono.push_back(i);
    }

    return answer;
}
```

## 時間與空間複雜度

每個元素最多入堆疊與出堆疊一次，時間 O(n)。空間 O(n) 用於儲存堆疊與答案。

## 常見錯誤與邊界條件

- 把 top 初始設為 0 導致第一個 push 後 top 指向空位置。
- 忘記檢查非空就 pop 或讀取頂端。
- 單調堆疊的條件用 < 還是 <=，會影響「相等元素」是否互相彈出。
- 非遞迴 DFS 出堆疊時要記得標記 visited 在入堆疊時而非出堆疊時，避免重複入堆疊。

## 與相似技巧的比較

佇列追求先來先服務，堆疊追求最近優先。單調堆疊與單調佇列本質相同，只是題目決定「向左看」還是「向右看」。遞迴是隱式的堆疊，但手寫顯式堆疊可避免遞迴深度過大造成的 stack overflow。

## 例題與分級練習

先做括號匹配與表達式求值，再用單調堆疊解決「每日溫度」問題。進階可嘗試用單調堆疊計算最大矩形面積。

## 本節重點速查

堆疊核心是 LIFO；手寫版本注意 top 初始值與空堆疊檢查；單調堆疊用 while 清掉無用元素，均攤 O(n) 解決鄰近極值問題。
