---
id: ac-automaton
volume: lower
source_file: lower-volume
chapter: 9
section: '9.6'
title: AC 自動機：多模式單文字線性匹配
summary: 在 Trie 上建構失配邊，使單次掃描即可找出所有模式出現位置。
prerequisites: [trie, kmp]
learning_goals:
  - 在 Trie 上建立失配邊
  - 利用 BFS 確保失配邊的正確順序
  - 處理多模式輸出與計數
concepts: [aho-corasick, failure-link, multi-pattern-match]
complexity:
  time: O(|text| + total patterns + matches)
  space: O(total characters)
related_exercises: []
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

## 這個技術解決什麼問題

同時在長文字中搜尋多個模式的所有出現位置，總時間與文字長度及模式總長度線性相關，而非各自獨立搜尋的乘積。

## 辨識題型的訊號

多關鍵字搜尋、敏感詞過濾、DNA 序列多重標記、字串集合與長文字的交互查詢。

## 核心想法與直覺

把所有模式先建 Trie，然後模仿 KMP 的 prefix function，為 Trie 上每個節點建立失配邊：當目前字元無法繼續匹配時，跳到失配邊指向的節點繼續嘗試。這樣文字指標永遠只向前移動。

## 狀態／資料結構定義

Trie 節點含子節點索引、失配、失配邊索引、輸出標記（紀錄哪些模式在此結尾）。可用 BFS 按層級建立失配邊，確保失配邊指向的節點的失配邊已先建立。

## 不變量或正確性證明

BFS 過程中，節點的失配邊指向其父節點失配邊所對應節點中，最長存在的真後綴葉路徑。因為 BFS 由淺到深，父節點的失配邊已正確，所以當前失配邊也必然正確。文字掃描時，每個字元最多被處理一次，總時間為線性。

## 逐步演算法

1. 把所有模式插入 Trie；
2. BFS：根的直接子節點失配邊指向根；
3. 對每個節點，複製失配邊節點的子節點映射（若自身無該子節點）；
4. 掃描文字，依字元往下走，無路則沿失配邊回退；
5. 每到一個節點，輸出所有以該節點為結尾的模式。

## C++17 模板

```cpp
#include <array>
#include <queue>
#include <string>
#include <vector>

struct AhoNode {
    std::array<int, 26> child{};
    int fail = 0;
    std::vector<int> output;
    AhoNode() { child.fill(-1); }
};

struct AhoCorasick {
    std::vector<AhoNode> nodes;

    AhoCorasick() { nodes.emplace_back(); }

    void insert(const std::string& pattern, int pattern_id) {
        int node = 0;
        for (char ch : pattern) {
            int index = ch - 'a';
            if (nodes[node].child[index] == -1) {
                nodes[node].child[index] = static_cast<int>(nodes.size());
                nodes.emplace_back();
            }
            node = nodes[node].child[index];
        }
        nodes[node].output.push_back(pattern_id);
    }

    void build() {
        std::queue<int> queue;
        for (int index = 0; index < 26; ++index) {
            int child = nodes[0].child[index];
            if (child != -1) {
                nodes[child].fail = 0;
                queue.push(child);
            } else {
                nodes[0].child[index] = 0;
            }
        }
        while (!queue.empty()) {
            int node = queue.front();
            queue.pop();
            for (int index = 0; index < 26; ++index) {
                int child = nodes[node].child[index];
                if (child == -1) {
                    nodes[node].child[index] = nodes[nodes[node].fail].child[index];
                    continue;
                }
                nodes[child].fail = nodes[nodes[node].fail].child[index];
                for (int pattern_id : nodes[nodes[child].fail].output) {
                    nodes[child].output.push_back(pattern_id);
                }
                queue.push(child);
            }
        }
    }

    std::vector<std::vector<int>> search(const std::string& text, int pattern_count) const {
        std::vector<std::vector<int>> result(pattern_count);
        int node = 0;
        for (int position = 0; position < static_cast<int>(text.size()); ++position) {
            node = nodes[node].child[text[position] - 'a'];
            for (int pattern_id : nodes[node].output) {
                result[pattern_id].push_back(position);
            }
        }
        return result;
    }
};
```

## 時間與空間複雜度

建構 O(total patterns × alphabet)；搜尋 O(|text| + matches)；空間 O(total characters × alphabet)。若使用失配邊補齊子節點，每步轉移 O(1)。

## 常見錯誤與邊界條件

BFS 順序錯誤導致失配邊未建立；忘記把失配邊節點的 output 合併；子節點補齊後改壞原始 Trie 結構；文字字元不在模式字元集中；空模式。

## 與相似技巧的比較

對每個模式跑 KMP 是 O(|text| × number of patterns)。AC 自動機把多模式資訊壓進 Trie，只掃描一次文字。後綴自動機適合同一文字的多子串查詢，但反過來的模式匹配不如 AC 直觀。

## 例題與分級練習

多模式出現位置、出現次數統計、字典樹 + DP、最短路徑上的字串匹配。

## 本節重點速查

Trie 收納所有模式；BFS 建失配邊；掃描文字不回退；output 彙總所有匹配。
