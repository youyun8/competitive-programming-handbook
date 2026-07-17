---
id: trie
volume: lower
source_file: lower-volume
chapter: 9
section: '9.3'
title: Trie 字典樹：前綴共用與高效檢索
summary: 以邊表示字元的樹狀結構，共用前綴並支援快速插入、查詢與前綴匹配。
prerequisites: [trees, strings]
learning_goals:
  - 建構與走訪 Trie
  - 統計前綴出現次數
  - 延伸至多模式匹配與異或問題
concepts: [trie, prefix-tree, string-storage]
complexity:
  time: O(L) per string operation
  space: O(total characters)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

## 這個技術解決什麼問題

需要高效插入與查詢大量字串，或快速判斷某前綴是否存在，例如字典、自動補全、前綴計數。

## 辨識題型的訊號

多字串前綴查詢、字典壓縮、異或最大值對、字元統計、多模式匹配的前置結構。

## 核心想法與直覺

共用相同前綴的節點，就像翻開字典時共享相同開頭的頁面。每個節點代表一個前綴，子節點代表往後追加一個字元的延伸。

## 狀態／資料結構定義

每個節點包含子節點映射（或陣列）與計數標記。根節點代表空字串，深度為字元位置。

## 不變量或正確性證明

Trie 中從根到任一節點的路徑，恰好對應某個已插入字串的前綴。插入時沿字元一路建立節點，查詢時沿字元一路走訪，缺失即代表不存在。

## 逐步演算法

插入：從根開始，逐字元下行，無則建新節點，最後標記結尾。查詢：同樣逐字元下行，中途缺失則回報不存在。

## C++17 模板

```cpp
#include <array>
#include <memory>
#include <string>
#include <vector>

struct TrieNode {
    std::array<int, 26> child{};
    int count = 0;
    int end_count = 0;
    TrieNode() { child.fill(-1); }
};

struct Trie {
    std::vector<TrieNode> nodes;

    Trie() { nodes.emplace_back(); }

    void insert(const std::string& s) {
        int node = 0;
        for (char ch : s) {
            int index = ch - 'a';
            if (nodes[node].child[index] == -1) {
                nodes[node].child[index] = static_cast<int>(nodes.size());
                nodes.emplace_back();
            }
            node = nodes[node].child[index];
            ++nodes[node].count;
        }
        ++nodes[node].end_count;
    }

    bool search(const std::string& s) const {
        int node = 0;
        for (char ch : s) {
            int index = ch - 'a';
            if (nodes[node].child[index] == -1) {
                return false;
            }
            node = nodes[node].child[index];
        }
        return nodes[node].end_count > 0;
    }

    int prefix_count(const std::string& prefix) const {
        int node = 0;
        for (char ch : prefix) {
            int index = ch - 'a';
            if (nodes[node].child[index] == -1) {
                return 0;
            }
            node = nodes[node].child[index];
        }
        return nodes[node].count;
    }
};
```

## 時間與空間複雜度

每次插入或查詢時間 O(L)，L 為字串長度。空間與所有字元的總長度成正比。

## 常見錯誤與邊界條件

字元範圍開錯（如大小寫混合、數字）；忘記區分 end_count 與 count；記憶體預留不足導致頻繁重分配；空字串處理。

## 與相似技巧的比較

雜湊表單次查詢 O(L) 但無法前綴搜尋；排序後二分搜尋可前綴匹配但無動態插入。Trie 適合前綴相關操作，是 AC 自動機與後綴樹的基礎。

## 例題與分級練習

字典前綴查詢、異或對最大值、字串統計、字典序第 k 小字串。

## 本節重點速查

根為空字串；邊為字元；共用前綴省空間；前綴查詢走到即得。
