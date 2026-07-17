---
id: suffix-automaton
volume: lower
source_file: lower-volume
chapter: 9
section: '9.8'
title: 後綴自動機：線性壓縮所有子串資訊
summary: 以 endpos 等價類建構線性大小的 DFA，支援子串查詢、出現次數與最長公共子串。
prerequisites: [strings, automata]
learning_goals:
  - 理解 endpos 等價類與 SAM 狀態的對應
  - 線上建構 SAM 的複製與轉移更新
  - 利用 SAM 解決子串相關統計問題
concepts: [suffix-automaton, endpos, linear-construction]
complexity:
  time: O(n)
  space: O(n)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

## 這個技術解決什麼問題

給定字串，需要一個大小僅 O(n) 的結構，能夠識別所有子串、查詢某子串是否存在、統計出現次數、求不同子串個數，以及解決多字串公共子串等問題。

## 辨識題型的訊號

不同子串個數、某子串出現次數、最長重複子串、最長公共子串、字典序第 k 小子串、字串週期性分析。

## 核心想法與直覺

把所有結尾位置集合（endpos）相同的子串歸為一個等價類。同一類的子串互為彼此的後綴，且最長的長度等於該類代表的長度上限，最短的則由其 suffix link 所代表的長度上限 +1 決定。這樣的等價類最多只有 2n-1 個，可以線上建構。

## 狀態／資料結構定義

每個狀態記錄 `length`（該類最長子串長度）、`link`（suffix link，指向最長真後綴對應的狀態）、`transitions`（字元到狀態的映射）、`occurrences`（endpos 集合大小，即最長子串的出現次數）。

## 不變量或正確性證明

每次新增字元時，創建新狀態 `current` 代表整個字串。從 `last` 沿 suffix link 回退，對每一個沒有該字元轉移的狀態補上轉移到 `current`。若所有狀態都缺少該該轉移，則 `current.link = root`。若遇到某狀態 `p` 已有該轉移到 `q`，且 `q.length == p.length + 1`，則 `current.link = q`。否則需要複製 `q` 為 `clone`，調整長度為 `p.length + 1`，並讓 `p` 與沿 suffix link 鏈上同樣指向 `q` 的狀態改指向 `clone`，最後 `q.link = current.link = clone`。每次操作都保持 endpos 等價類的劃分正確，因此狀態與轉移都正確對應所有子串。

## 逐步演算法

1. 初始化 root 狀態，`last = root`；
2. 逐字元 `ch` 掃描：
   - 新建 `current`，`length = last.length + 1`；
   - `p = last`，沿 suffix link 回退，補 `ch` 轉移到 `current`；
   - 若遇到 `p` 有 `ch` 轉移到 `q`：
     - 若 `q.length == p.length + 1`，則 `current.link = q`；
     - 否則複製 `q` 為 `clone`，調整長度，更新轉移鏈；
3. 建構完畢後，按 length 遞減拓撲排序，把 occurrences 沿 suffix link 傳遞。

## C++17 模板

```cpp
#include <array>
#include <string>
#include <vector>

struct SuffixAutomatonNode {
    std::array<int, 26> next{};
    int link = -1;
    int length = 0;
    long long occurrences = 0;
    SuffixAutomatonNode() { next.fill(-1); }
};

struct SuffixAutomaton {
    std::vector<SuffixAutomatonNode> nodes;
    int last = 0;

    SuffixAutomaton() {
        nodes.emplace_back();
        nodes[0].length = 0;
        nodes[0].link = -1;
        last = 0;
    }

    void extend(char ch) {
        int index = ch - 'a';
        int current = static_cast<int>(nodes.size());
        nodes.emplace_back();
        nodes[current].length = nodes[last].length + 1;
        nodes[current].occurrences = 1;
        int p = last;
        while (p != -1 && nodes[p].next[index] == -1) {
            nodes[p].next[index] = current;
            p = nodes[p].link;
        }
        if (p == -1) {
            nodes[current].link = 0;
        } else {
            int q = nodes[p].next[index];
            if (nodes[q].length == nodes[p].length + 1) {
                nodes[current].link = q;
            } else {
                int clone = static_cast<int>(nodes.size());
                nodes.emplace_back(nodes[q]);
                nodes[clone].length = nodes[p].length + 1;
                nodes[clone].occurrences = 0;
                while (p != -1 && nodes[p].next[index] == q) {
                    nodes[p].next[index] = clone;
                    p = nodes[p].link;
                }
                nodes[q].link = nodes[current].link = clone;
            }
        }
        last = current;
    }

    void build_occurrences() {
        int max_length = 0;
        for (const auto& node : nodes) {
            max_length = std::max(max_length, node.length);
        }
        std::vector<int> count(max_length + 1);
        for (const auto& node : nodes) {
            ++count[node.length];
        }
        for (int i = 1; i <= max_length; ++i) {
            count[i] += count[i - 1];
        }
        std::vector<int> order(nodes.size());
        for (int i = static_cast<int>(nodes.size()) - 1; i >= 0; --i) {
            order[--count[nodes[i].length]] = i;
        }
        for (int i = static_cast<int>(order.size()) - 1; i > 0; --i) {
            int node = order[i];
            if (nodes[node].link != -1) {
                nodes[nodes[node].link].occurrences += nodes[node].occurrences;
            }
        }
    }
};
```

## 時間與空間複雜度

每次 extend 的回退步數均攤 O(1)，總時間 O(n)；狀態數最多 2n-1，轉移數最多 3n-4，空間 O(n)。

## 常見錯誤與邊界條件

複製狀態時忘記把 occurrences 設為 0；轉移鏈更新不完整導致指標遺漏；suffix link 為 -1 時的邊界處理；字元集大小與映射錯誤；未 build_occurrences 就直接查詢次數。

## 與相似技巧的比較

後綴陣列也能回答多數子串問題，但 SAM 更適合線上追加與自動機相關查詢（如「某串是否為子串」只需沿轉移走一遍）。後綴樹概念對應 SAM 的轉移圖，但 SAM 狀態更少、實作更精簡。

## 例題與分級練習

不同子串個數、最長重複子串、出現 k 次的最長子串、多字串最長公共子串、字串最小循環移位。

## 本節重點速查

endpos 等價類即 SAM 狀態；suffix link 是最長真後綴狀態；複製狀態維護等價類劃分；拓撲傳遞 occurrences。
