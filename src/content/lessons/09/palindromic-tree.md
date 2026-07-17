---
id: palindromic-tree
volume: lower
source_file: lower-volume
chapter: 9
section: '9.4'
title: 回文樹（Eertree）：線性統計回文子串
summary: 以兩個根節點與失配邊，線上建構並統計所有不同回文子串。
prerequisites: [trie, strings]
learning_goals:
  - 理解奇偶根與失配邊的含義
  - 在掃描過程中維護最長回文後綴
  - 統計不同回文子串個數與出現次數
concepts: [eertree, palindromic-tree, suffix-link]
complexity:
  time: O(n)
  space: O(n)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

## 這個技術解決什麼問題

需要在掃描字串過程中，即時得知目前為止的所有不同回文子串，並支援統計出現次數、最長回文後綴等資訊。

## 辨識題型的訊號

不同回文子串個數、回文出現次數、最長回文後綴查詢、需要動態追加字元並查詢回文結構。

## 核心想法與直覺

回文樹有兩個虛擬根：長度 -1 的根（奇數長度回文的父節點）與長度 0 的根（偶數長度回文的父節點）。每個節點對應一個唯一的回文子串，邊表示在兩端同時加上某字元。失配邊（suffix link）指向該回文的最長真回文後綴。

## 狀態／資料結構定義

每個節點記錄長度、出現次數、子節點映射、失配邊索引。`last` 指標維護目前最長回文後綴對應的節點。

## 不變量或正確性證明

每次新增字元時，透過失配邊不斷回退，直到找到某個回文可以在兩端加上新字元仍保持回文。因為每次回退都跳到更短的回文後綴，而字串總長度只增加 1，所以過程必定在常數步內結束。新增節點時再為它建一條失配邊，同樣沿失配邊回退即可找到正確目標。總節點數不超過 n+2，因此總時間 O(n)。

## 逐步演算法

1. 初始化兩個根節點，長度分別為 -1 與 0；
2. 逐字元掃描字串；
3. 從 `last` 出發沿失配邊回退，直到找到可延伸的回文；
4. 若該回文對應的子節點不存在則新建；
5. 更新新建節點的失配邊；
6. `last` 指向該節點並增加計數。

## C++17 模板

```cpp
#include <array>
#include <string>
#include <vector>

struct EertreeNode {
    std::array<int, 26> next{};
    int link = 0;
    int length = 0;
    int occurrences = 0;
    EertreeNode() { next.fill(0); }
};

struct Eertree {
    std::vector<EertreeNode> nodes;
    std::string text;
    int last = 0;

    Eertree() {
        nodes.resize(2);
        nodes[0].length = -1;
        nodes[0].link = 0;
        nodes[1].length = 0;
        nodes[1].link = 0;
        last = 1;
    }

    int get_max_suffix_palindrome(int node, int pos) {
        while (true) {
            int gap = pos - nodes[node].length - 1;
            if (gap >= 0 && text[gap] == text[pos]) {
                return node;
            }
            node = nodes[node].link;
        }
    }

    void add(char ch) {
        text.push_back(ch);
        int current = get_max_suffix_palindrome(last, static_cast<int>(text.size()) - 1);
        int index = ch - 'a';
        if (!nodes[current].next[index]) {
            int new_node = static_cast<int>(nodes.size());
            nodes.emplace_back();
            nodes[new_node].length = nodes[current].length + 2;
            if (nodes[new_node].length == 1) {
                nodes[new_node].link = 1;
            } else {
                int link_parent = get_max_suffix_palindrome(nodes[current].link, static_cast<int>(text.size()) - 1);
                nodes[new_node].link = nodes[link_parent].next[index];
            }
            nodes[current].next[index] = new_node;
        }
        last = nodes[current].next[index];
        ++nodes[last].occurrences;
    }
};
```

## 時間與空間複雜度

每個字元處理時沿失配邊回退的總次數均攤為 O(1)，總時間 O(n)；節點數最多 n+2，空間 O(n)。

## 常見錯誤與邊界條件

失配邊初始化錯誤（長度 1 的節點 link 應指向長度 0 的根）；字元集大小寫；回退條件寫錯導致無窮迴圈；長度 -1 的根用於奇數長度回文的父節點。

## 與相似技巧的比較

Manacher 求每個中心的最長回文半徑，但不直接列舉不同回文子串。回文樹則明確列出所有不同回文並可統計出現次數，但只適用離線或線上追加場景。後綴自動機結合雜湊也能類似統計，但回文樹更直接。

## 例題與分級練習

不同回文子串個數、回文出現次數、最長回文雙後綴、回文劃分計數。

## 本節重點速查

雙根處理奇偶長度；邊為兩端同加一字元；失配邊是最長真回文後綴；均攤線性。
