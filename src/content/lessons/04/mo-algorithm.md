---
id: mo-algorithm
volume: upper
source_file: upper-volume
chapter: 4
section: '4.5'
title: 分塊與莫隊演算法：離線排序化解頻繁區間詢問
summary: 以區間端點的塊排序讓指標移動量趨近 O((n+q)√n)，適合無法直接用線段樹合併的區間資訊。
prerequisites: [offline-algorithms, sorting]
learning_goals:
  - 實作基礎莫隊的塊排序與指標移動
  - 加入修改時間軸做帶修改莫隊
  - 理解樹上莫隊的欧拉序轉換
concepts: [sqrt-decomposition, mo-algorithm, offline-query]
complexity:
  time: O((n + q)√n)
  space: O(n)
related_exercises: []
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
review_status: verified
---

## 這個技術解決什麼問題

當查詢區間內的資訊難以簡單合併（例如區間眾數、不同數字個數），但可透過「加入一個元素」與「移除一個元素」快速維護答案時，莫隊演算法把詢問離線排序，使總移動次數被 √n 控制。

## 辨識題型的訊號

離線查詢、區間資訊具可增減性、單次增減 $O(1)$ 或 $O(\log n)$，但直接使用線段樹或樹狀陣列難以合併答案。

## 核心想法與直覺

把陣列切成大小約 $\sqrt{n}$ 的塊，按左端點所在塊排序，同塊內右端點交替升降。這樣左端點在一塊內只會來回移動 $O(\sqrt{n})$ 次，右端點在整趟排序中單調移動，總共 $O(n \sqrt{n})$。

## 狀態／資料結構定義

維護當前區間 $[current\_left, current\_right)$ 的答案。每次移動指標時呼叫 `add(pos)` 與 `remove(pos)` 更新輔助計數結構。

## 不變量或正確性證明

排序後相鄰兩次查詢的左端點只在同一塊內移動，右端點在塊之間可能跳躍一次，但整塊內單調。每個元素被加入與移除的次數受端點移動總量限制，總複雜度 $O((n + q)\sqrt{n} \cdot f)$，其中 $f$ 是單次增減代價。

## 逐步演算法

1. 決定塊大小 `block = static_cast<int>(sqrt(n)) + 1`。
2. 對所有查詢按 `(l/block, r)` 排序，並使相鄰塊的 `r` 方向交替（奇偶優化）。
3. 從空區間開始，逐步移動 `current_left` 與 `current_right` 到目標區間。
4. 每移動一格，更新當前答案。

## C++17 模板

```cpp
#include <algorithm>
#include <cmath>
#include <vector>

struct MoQuery {
    int left = 0;
    int right = 0;
    int index = 0;
};

class MoSolver {
public:
    explicit MoSolver(int array_size) : block_size(static_cast<int>(std::sqrt(array_size)) + 1) {}

    std::vector<long long> solve(
        const std::vector<int>& values,
        const std::vector<MoQuery>& queries
    ) {
        std::vector<MoQuery> ordered = queries;
        std::sort(ordered.begin(), ordered.end(), [&](const MoQuery& a, const MoQuery& b) {
            int block_a = a.left / block_size;
            int block_b = b.left / block_size;
            if (block_a != block_b) {
                return block_a < block_b;
            }
            return (block_a & 1) ? (a.right > b.right) : (a.right < b.right);
        });

        std::vector<long long> answers(queries.size());
        int current_left = 0;
        int current_right = 0;
        long long current_answer = 0;

        for (const auto& query : ordered) {
            while (current_left > query.left) {
                --current_left;
                add(values[current_left], current_answer);
            }
            while (current_right < query.right) {
                add(values[current_right], current_answer);
                ++current_right;
            }
            while (current_left < query.left) {
                remove(values[current_left], current_answer);
                ++current_left;
            }
            while (current_right > query.right) {
                --current_right;
                remove(values[current_right], current_answer);
            }
            answers[query.index] = current_answer;
        }
        return answers;
    }

private:
    int block_size;

    static void add(int value, long long& answer) {
        (void)value;
        ++answer;
    }

    static void remove(int value, long long& answer) {
        (void)value;
        --answer;
    }
};
```

## 時間與空間複雜度

排序 $O(q \log q)$；指標總移動 $O((n + q)\sqrt{n})$；空間 $O(n)$ 用於計數陣列或雜湊表。

## 常見錯誤與邊界條件

閉區間與半開區間搞混、奇偶排序條件寫錯導致退化、忘記處理 `add`/`remove` 順序（先擴張再收縮）。

## 與相似技巧的比較

線段樹或樹狀陣列適合可合併資訊；分塊直接暴力維護塊內統計，常數更大但好寫；莫隊專攻「增減 $O(1)$」的區間統計。

## 例題與分級練習

先寫區間不同元素個數，再做帶修改莫隊（加入時間維度），最後挑戰樹上莫隊（用欧拉序攤平）。

## 本節重點速查

塊大小 $\sqrt{n}$ 最穩；排序後暴力移動指標；`add`/`remove` 必須可逆；樹上用欧拉序攤成陣列。
