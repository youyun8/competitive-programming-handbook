---
id: block-linked-list
volume: upper
source_file: upper-volume
chapter: 4
section: '4.6'
title: 塊狀鏈表：分塊儲存下的動態序列
summary: 把序列切成大小約 √n 的的塊，塊內用陣列維護，支援均攤 √n 的插入、刪除與查詢。
prerequisites: [linked-list, sqrt-decomposition]
learning_goals:
  - 以塊為單位維護動態序列
  - 在塊內直接操作，適時重建
  - 分析均攤複雜度
concepts: [block-list, rebuild, sqrt]
complexity:
  time: amortized O(√n)
  space: O(n)
related_exercises: []
source_book_pages: [221, 232]
source_pdf_pages: [239, 250]
review_status: verified
---

## 這個技術解決什麼問題

在序列中頻繁插入與刪除元素，同時需要區間查詢。純陣列插入 $O(n)$；純鏈表區間查詢 $O(n)$。塊狀鏈表折衷兩者，把操作分散到塊內小陣列與塊間指標。

## 辨識題型的訊號

動態序列（插入、刪除、翻轉、區間詢問），且 $n$ 不大到只允許 $O(\log n)$，或是實作平衡樹太複雜的場合。

## 核心想法與直覺

把鏈表的節點放大成「包含 $O(\sqrt{n})$ 個元素的小陣列」。插入與刪除只動到所在塊，最多觸發 $O(\sqrt{n})$ 的塊內搬動；若某塊過大或過小，就分裂或合併，偶爾整體重建維持塊大小。

## 狀態／資料結構定義

每個塊儲存 `std::vector<int> elements` 與指向下一塊的指標。另有 `block_count` 與 `total_size` 供重建判斷。

## 不變量或正確性證明

每次操作後，塊大小被限制在 $[\frac{\sqrt{n}}{2}, 2\sqrt{n}]$ 之間，或不定期全域重建使之回歸 $\sqrt{n}$。因此每次定位目標塊的掃描不超過 $O(\sqrt{n})$ 個塊，塊內搬動也不超過 $O(\sqrt{n})$ 個元素。

## 逐步演算法

1. 定位目標位置：從頭塊逐塊跳躍，用塊大小累加找到目標塊。
2. 塊內插入／刪除：直接 `vector::insert` 或 `erase`。
3. 若塊大小超過門檻，分裂為兩塊；若連續小塊太多，執行全域重建。

## C++17 模板

```cpp
#include <cmath>
#include <vector>

class BlockLinkedList {
public:
    struct Block {
        std::vector<int> elements;
        Block* next = nullptr;
    };

    explicit BlockLinkedList(int block_size_hint = 0) : hint(block_size_hint) {
        head = new Block();
    }

    ~BlockLinkedList() {
        while (head != nullptr) {
            Block* temp = head;
            head = head->next;
            delete temp;
        }
    }

    void insert(int position, int value) {
        Block* block = locate_block(position);
        int offset = position - prefix_size;
        block->elements.insert(block->elements.begin() + offset, value);
        ++total_size;
        if (static_cast<int>(block->elements.size()) > max_size()) {
            split_block(block);
        }
        if (should_rebuild()) {
            rebuild();
        }
    }

    void erase(int position) {
        Block* block = locate_block(position);
        int offset = position - prefix_size;
        block->elements.erase(block->elements.begin() + offset);
        --total_size;
        if (should_rebuild()) {
            rebuild();
        }
    }

    int at(int position) const {
        const Block* block = const_cast<BlockLinkedList*>(this)->locate_block(position);
        return block->elements[position - prefix_size];
    }

private:
    Block* head = nullptr;
    int hint = 0;
    int total_size = 0;
    int prefix_size = 0;

    int block_size() const {
        if (hint > 0) {
            return hint;
        }
        return static_cast<int>(std::sqrt(std::max(1, total_size))) + 1;
    }

    int max_size() const {
        return block_size() * 2;
    }

    Block* locate_block(int position) {
        prefix_size = 0;
        Block* current = head;
        while (current != nullptr && prefix_size + static_cast<int>(current->elements.size()) <= position) {
            prefix_size += static_cast<int>(current->elements.size());
            current = current->next;
        }
        return current != nullptr ? current : head;
    }

    void split_block(Block* block) {
        Block* new_block = new Block();
        int mid = static_cast<int>(block->elements.size()) / 2;
        new_block->elements.assign(block->elements.begin() + mid, block->elements.end());
        block->elements.resize(mid);
        new_block->next = block->next;
        block->next = new_block;
    }

    bool should_rebuild() const {
        int count = 0;
        for (Block* cur = head; cur != nullptr; cur = cur->next) {
            ++count;
        }
        return count > 0 && block_size() > 0 && count > total_size / block_size() * 4;
    }

    void rebuild() {
        std::vector<int> all;
        all.reserve(total_size);
        for (Block* cur = head; cur != nullptr; cur = cur->next) {
            all.insert(all.end(), cur->elements.begin(), cur->elements.end());
        }
        Block* current = head;
        while (current != nullptr) {
            Block* temp = current;
            current = current->next;
            delete temp;
        }
        int bs = block_size();
        head = new Block();
        Block* tail = head;
        for (std::size_t i = 0; i < all.size(); i += bs) {
            if (i > 0) {
                tail->next = new Block();
                tail = tail->next;
            }
            tail->elements.assign(all.begin() + i, all.begin() + std::min(all.size(), i + bs));
        }
    }
};
```

## 時間與空間複雜度

單次操作均攤 $O(\sqrt{n})$；全序列重建 $O(n)$，但觸發頻率低。空間 $O(n)$。

## 常見錯誤與邊界條件

插入位置在塊邊界時定位錯誤、忘記 `total_size` 歸零導致重建頻繁、記憶體泄漏（未釋放被刪除的塊）。

## 與相似技巧的比較

Treap 或 Splay 操作為 $O(\log n)$，但實作較長；塊狀鏈表常數小、好除錯，適合 $n \le 10^5$ 且時限寬鬆的場合。

## 例題與分級練習

先做插入與區間求和，再做區間翻轉（配合惰性標記），最後挑戰區間第 k 大（塊內排序 + 二分）。

## 本節重點速查

塊大小維持 $\sqrt{n}$；定位用塊大小掃描；適時分裂與全域重建來避免退化。
