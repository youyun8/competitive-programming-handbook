---
id: binary-tree
volume: upper
source_file: upper-volume
chapter: 1
section: '1.4'
title: 二元樹與霍夫曼樹：層次結構與最佳編碼
summary: 理解二元樹的基本性質、三種遍歷方式，以及霍夫曼樹如何產生最優前綴編碼。
prerequisites: [recursion, queue]
learning_goals:
  - 計算二元樹的節點數、深度與形狀限制
  - 實作遞迴與非遞迴的三種遍歷
  - 使用霍夫曼樹生成最優前綴編碼並計算帶權路徑長度
concepts: [binary-tree, tree-traversal, huffman-tree, prefix-code]
complexity:
  time: O(n) 遍歷，O(n log n) 霍夫曼建樹
  space: O(n) 或 O(h) 遞迴深度
related_exercises: ['huffman-encoding']
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---


## 這個技術解決什麼問題

二元樹以兩個子節點的規則簡化多叉結構，使搜尋、排序與編碼問題有清晰的遞迴定義。霍夫曼樹則針對「出現頻率不同的符號」，產生總編碼長度最短的前綴碼。

## 辨識題型的訊號

- 需要表示層次父子關係的資料結構。
- 題目給出中序與前序／後序，要求重建樹。
- 壓縮、編碼或合併成本問題中，頻率高的項應該分配較短碼長。

## 核心想法與直覺

遍歷的本質是按既定順序訪問每個節點一次。前序是「先做事再下去」，中序在二元搜尋樹上會得到排序結果，後序則是「子樹全處理完再回來」。霍夫曼樹是貪心法：每次合併頻率最小的兩棵樹，高頻節點自然離根更近。

## 狀態／資料結構定義

```cpp
struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
};
```

霍夫曼節點額外儲存權重與編碼字串；建樹過程使用最小堆（priority_queue 配合自訂比較器）。

## 不變量或正確性證明

霍夫曼樹的最優性可用交換論證：假設存在最優最優樹中，頻率最小的兩個字元不是最深的兄弟節點。交換它們到最深位置不會增加總加權路徑長度，因為較小頻率移向更深層的增量被較大頻率移向較淺層的減量抵消。合併這兩個字元後，問題規模減一，遞迴成立。

## 逐步演算法

1. 將所有字元與頻率包裝成節點放入最小堆。
2. 當堆中節點數大於 1：
   - 取出頻率最小的兩個節點 a, b。
   - 新建節點，權重為 a.weight + b.weight，左右子節點設為 a, b。
   - 將新節點推回堆。
3. 堆中唯一節點即為霍夫曼樹根。

## C++17 模板

```cpp
#include <queue>
#include <string>
#include <vector>

struct HuffmanNode {
    int weight;
    char ch;
    HuffmanNode* left = nullptr;
    HuffmanNode* right = nullptr;
};

struct CompareNode {
    bool operator()(const HuffmanNode* a, const HuffmanNode* b) const {
        return a->weight > b->weight;
    }
};

HuffmanNode* build_huffman(const std::vector<std::pair<char, int>>& freq) {
    std::priority_queue<HuffmanNode*, std::vector<HuffmanNode*>, CompareNode> pq;
    for (const auto& p : freq) {
        pq.push(new HuffmanNode{p.second, p.first, nullptr, nullptr});
    }
    while (pq.size() > 1) {
        HuffmanNode* left = pq.top(); pq.pop();
        HuffmanNode* right = pq.top(); pq.pop();
        HuffmanNode* parent = new HuffmanNode{
            left->weight + right->weight, '\0', left, right
        };
        pq.push(parent);
    }
    return pq.empty() ? nullptr : pq.top();
}
```

## 時間與空間複雜度

遍歷每個節點一次，時間 O(n)。霍夫曼建樹每次堆操作 O(log n)，共 O(n log n)。空間為節點數 O(n)。

## 常見錯誤與邊界條件

- 重建樹時，前序第一個是根，再找中序中的根位置切分左右區段；切分後區段為空時要正確設為 nullptr。
- 霍夫曼樹若只有一個字元，編碼可規定為 "0" 避免空字串。
- 遞迴遍歷深度可能等於節點數（退化鏈），需確認遞迴深度限制或改用顯式堆疊。

## 與相似技巧的比較

二元樹是鏈結串列的分叉版；陣列可實作完全二元樹，父節點與子節點有固定索引公式。霍夫曼樹是貪心法在編碼上的特例，與一般 BST 的搜尋目的不同。

## 例題與分級練習

先練習給定中序與前序重建二元樹，再實作霍夫曼編碼並比較固定長度編碼的壓縮率。

## 本節重點速查

前序根左右、中序左根右、後序左右根；霍夫曼樹每次合併最小兩個權重，高頻淺層、低頻深層，保證最優前綴碼。
