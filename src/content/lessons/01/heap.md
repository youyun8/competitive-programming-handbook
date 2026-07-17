---
id: heap
volume: upper
source_file: upper-volume
chapter: 1
section: '1.5'
title: 堆積：以完全二元樹維護極值
summary: 理解二元堆的結構性質、基本操作、手寫實作，以及 STL priority_queue 的使用與限制。
prerequisites: [binary-tree, arrays]
learning_goals:
  - 說明堆積的兩大性質（結構性與有序性）
  - 手寫 push 與 pop 並維護 heapify
  - 比較手寫堆與 STL priority_queue 的適用場景
concepts: [binary-heap, heapify, priority-queue, complete-binary-tree]
complexity:
  time: O(log n) push/pop，O(n) build_heap
  space: O(n)
related_exercises: ['heap-operations']
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

## 這個技術解決什麼問題

當需要反覆取出最大值（或最小值），同時不斷插入新元素時，排序整個陣列每次都花 O(n log n)；堆積能在 O(log n) 內完成插入與極值提取，並用陣列實作完全二元樹，不浪費額外指標空間。

## 辨識題型的訊號

- 合併多個有序串流取目前最小值。
- 動態維護執行緒或任務的優先級。
- Dijkstra、Prim、霍夫曼樹等需要反覆取最小邊或最小距離。
- 求陣列前 k 大元素或中位數。

## 核心想法與直覺

完全二元樹可以平整地塞進陣列：父節點 i 的左子節點是 2i、右子節點是 2i+1。只要確保每棵子樹的根都是該子樹的最大值（大根堆），整棵樹的最大值就在索引 1（或 0）。插入時把新元素放最後，再往上浮；取出時把最後一個元素搬到根，再往下沉。

## 狀態／資料結構定義

陣列 `heap[1..n]`，其中 `heap[i]` 的父節點是 `i/2`，子節點是 `2i` 與 `2i+1`。大小寫 n 表示目前元素個數，capacity 表示容量上限。

## 不變量或正確性證明

大根堆的不變量：對所有有效 i，都有 `heap[i] >= heap[2i]` 且 `heap[i] >= heap[2i+1]`。插入時，新元素從葉往上，每次與父親比較；若更大就交換，直到滿足不變量。由於只向上單一路徑調整，長度最多為樹高 O(log n)。pop 時，將最後一個元素放到根，再向下與較大子節點交換，同樣最多 O(log n)。

## 逐步演算法

1. push(x)：n 增加；heap[n] = x；從 n 向上 float_up。
2. pop()：記錄 heap[1]；heap[1] = heap[n]；n 減少；從 1 向下 sink_down。
3. build_heap：從第 n/2 個節點倒序回到 1，每個都做 sink_down，時間 O(n)。

## C++17 模板

```cpp
#include <vector>
#include <algorithm>

class MaxHeap {
    std::vector<int> data_;

    void float_up(int idx) {
        while (idx > 1 && data_[idx] > data_[idx / 2]) {
            std::swap(data_[idx], data_[idx / 2]);
            idx /= 2;
        }
    }

    void sink_down(int idx) {
        const int n = static_cast<int>(data_.size()) - 1;
        while (2 * idx <= n) {
            int child = 2 * idx;
            if (child + 1 <= n && data_[child + 1] > data_[child]) {
                ++child;
            }
            if (data_[idx] >= data_[child]) {
                break;
            }
            std::swap(data_[idx], data_[child]);
            idx = child;
        }
    }

public:
    MaxHeap() { data_.push_back(0); } // 1-based indexing dummy

    void push(int value) {
        data_.push_back(value);
        float_up(static_cast<int>(data_.size()) - 1);
    }

    int top() const {
        return data_.size() > 1 ? data_[1] : 0;
    }

    void pop() {
        if (data_.size() <= 1) return;
        data_[1] = data_.back();
        data_.pop_back();
        sink_down(1);
    }

    bool empty() const {
        return data_.size() <= 1;
    }
};
```

## 時間與空間複雜度

push 與 pop 為 O(log n)。由最後一個非葉節點逆序 sink_down 建堆，總時間 O(n)。空間為陣列大小 O(n)。

## 常見錯誤與邊界條件

- 陣列索引忘記處理 0-based 與 1-based 差異。
- sink_down 時誤拿左子節點比較而忽略右子節點可能更大。
- 只有一個元素時 pop 之後未正確縮小結構。
- STL priority_queue 預設是大根堆，若要小根堆需自訂 greater<> 或對值取負號。

## 與相似技巧的比較

排序會輸出全局有序，堆只保證「堆頂是極值」。若需要完整有序輸出，排序更直接；若只需要動態極值，堆及時 O(log n) 插入刪除勝過排序。平衡二元搜尋樹也能做到同樣效果，但常數較大且實作複雜。

## 例題與分級練習

先實作手寫大根堆與堆排序，再用 priority_queue 解決合併 k 個有序陣列。進階可研究支持 decrease-key 的手寫堆，這是 Dijkstra 加速的基礎。

## 本節重點速查

堆是陣列模擬的完全二元樹；push 上浮、pop 下沉；build_heap 從中間往回做；priority_queue 預設大根堆，小根堆用 greater<> 或負號技巧。
