---
id: linked-list
volume: upper
source_file: upper-volume
chapter: 1
section: '1.1'
title: 鏈結串列：用指標串起連續邏輯
summary: 以動態與靜態兩種方式實作鏈結串列，並理解 STL list 的雙向鏈結特性與適用場景。
prerequisites: [arrays, pointers]
learning_goals:
  - 比較陣列與鏈結串列的存取特性差異
  - 手寫動態與靜態鏈結串列的插入與刪除
  - 判斷何時該使用 STL list
concepts: [dynamic-memory, static-linked-list, doubly-linked-list]
complexity:
  time: O(n) 查詢，O(1) 已知位置插入與刪除
  space: O(n)
related_exercises: ['linked-list-queue']
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

## 這個技術解決什麼問題

當資料需要頻繁在中間插入或刪除，且不適合預先配置連續記憶體時，鏈結串列用額外的指標空間換取操作彈性。靜態版本則在禁止動態配置的環境中提供相同的邏輯結構。

## 辨識題型的訊號

需要維護一個能即時插斷與移除元素的序列；或模擬鄰居操作（如併查集的鏈式前向星前身）。若題目要求頻繁隨機存取，鏈結串列反而會是陷阱。

## 核心想法與直覺

每個節點保存資料與至少一個 next 指標。走訪只能從頭依序進行，因此「找到位置」的成本是 O(n)，但「修改連結」本身是常數時間。靜態版本用陣列模擬節點池，以整數索引代替指標。

## 狀態／資料結構定義

動態節點：`struct Node { int value; Node* next; };`
靜態節點池：`struct Node { int value; int next; }; std::array<Node, MAXN> pool;`

## 不變量或正確性證明

若維護好 head 與尾端指標，每次插入都在正確的 next 鏈上。刪除時，先將前驅的 next 指向目標的 next，再釋放（或回收）目標節點，即可保證鏈的連續性不被破壞。

## 逐步演算法

1. 建立空鏈表，head = nullptr（或靜態的 -1）。
2. 新增節點：配置記憶體，填入資料，next 指向原 head，再更新 head。
3. 插入中間：走到目標前驅，修改前驅的 next 與新節點的 next。
4. 刪除節點：找到前驅，跳過目標節點，記得釋放或標記為可用。

## C++17 模板

```cpp
#include <array>
#include <iostream>

struct StaticLinkedList {
    struct Node {
        int value = 0;
        int next = -1;
    };

    static constexpr int MAXN = 100005;
    std::array<Node, MAXN> pool;
    int head = -1;
    int used = 0;

    void push_front(int value) {
        const int idx = used++;
        pool[idx].value = value;
        pool[idx].next = head;
        head = idx;
    }

    void erase_after(int prev_idx) {
        if (prev_idx == -1) {
            if (head != -1) {
                head = pool[head].next;
            }
            return;
        }
        const int target = pool[prev_idx].next;
        if (target != -1) {
            pool[prev_idx].next = pool[target].next;
        }
    }
};
```

## 時間與空間複雜度

走訪第 k 個元素是 O(k)；已知前驅位置的插入與刪除是 O(1)。空間額外需要每個節點至少一個指標。靜態版本不呼叫動態配置，速度較穩定。

## 常見錯誤與邊界條件

- 刪除時沒有先記錄目標的 next，導致斷鏈。
- 靜態版本忘記初始化 next 為 -1。
- 在迴圈中修改 next 卻同時走訪同一條鏈，造成指標失效。
- 未考慮空鏈表或單一節點的特殊情況。

## 與相似技巧的比較

陣列提供 O(1) 隨機存取但 O(n) 中間插入；鏈結串列反過來，犧牲隨機存取換取局部修改效率。STL vector 在尾部操作已夠快，只有需要大量中間操作時才該考慮 list。

## 例題與分級練習

先練習靜態鏈結串列模擬翻轉與刪除操作，再嘗試用 STL list 實作高效的中間合併。進階題可試著用鏈結串列實作大數加法。

## 本節重點速查

鏈結串列適合「找到位置後快速插入刪除」；走訪只能用順向指標；靜態版本以陣列索引代替指標，並需回收節點池或預留足夠空間。
