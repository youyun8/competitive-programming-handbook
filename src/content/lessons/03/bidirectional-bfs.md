---
id: bidirectional-bfs
volume: upper
source_file: upper-volume
chapter: 3
section: '3.5'
title: 雙向廣搜：從兩端同時逼進目標
summary: 同時從起點與終點展開 BFS，當兩個 frontier 相遇時即得最短路徑，大幅降低搜尋空間。
prerequisites: [bfs-shortest-path, queue]
learning_goals:
  - 分析雙向 BFS 的複雜度優勢
  - 實作兩種常見策略：交替擴展與擴展較小層
  - 正確判斷兩端相遇並還原最短路徑
concepts: [bidirectional-bfs, meet-in-the-middle, frontier, search-space-reduction]
complexity:
  time: O(b^{d/2})，單向為 O(b^d)
  space: O(b^{d/2})
related_exercises: []
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

在單向 BFS 中，搜尋空間隨深度呈指數爆炸。若問題具有明確的終點狀態，同時從起點與終點進行 BFS，兩個 frontier 在中途相遇，就能將搜尋深度減半，從 O(b^d) 降到 O(b^{d/2})。

## 辨識題型的訊號

- 狀態空間巨大但起點與終點都明確。
- 單向 BFS 在測資規模下會超時或記憶體不足。
- 拼圖、字串變換、密碼鎖等狀態轉換問題。
- 圖結構無權且邊的轉移可逆。

## 核心想法與直覺

既然最短路徑是從起點走到終點，那麼它也等於「從起點走一半」加上「從終點走一半」。兩個 frontier 像兩道光，對向射出，交會點就是最短路徑的中點。搜尋樹的節點數量從 b^d 降到約 2 \* b^{d/2}。

## 狀態／資料結構定義

- `dist_from_start[state]`：從起點到該狀態的距離。
- `dist_from_target[state]`：從終點到該狀態的距離。
- `visited_start` 與 `visited_target`：兩組已造訪集合。
- `queue_start` 與 `queue_target`：兩個 BFS 佇列。

## 不變量或正確性證明

設最短路徑長度為 d。單向 BFS 會展開所有距離 <= d 的節點。雙向 BFS 中，當兩個 frontier 第一次相遇於狀態 x 時，存在一條從起點到 x 的路徑長度為 ds，以及從終點到 x 的路徑長度為 dt。因為兩側都是按層展開，ds 與 dt 分別不超過各自側的最短路徑。總長度 ds + dt 即為全域最短路徑長度，否則存在更短的單向路徑會導致更早相遇。

## 逐步演算法

策略一（交替擴展）：

1. 初始化起點與終點的佇列和距離。
2. 輪流從較小的 frontier 取出一層節點展開。
3. 若發現鄰居已在對側 visited 中，計算總距離並回傳。
4. 若某側佇列為空，表示無路徑。

策略二（每次擴展節點較少的一側）：
與策略一類似，但每次只選擇 queue size 較小的那一側展開一個節點。

## C++17 模板

```cpp
#include <queue>
#include <unordered_map>
#include <string>

int bidirectional_bfs(const std::string& start, const std::string& target,
                      const std::vector<std::string>& (*get_neighbors)(const std::string&)) {
    if (start == target) { return 0; }

    std::unordered_map<std::string, int> dist_a, dist_b;
    std::queue<std::string> qa, qb;
    dist_a[start] = 0; qa.push(start);
    dist_b[target] = 0; qb.push(target);

    while (!qa.empty() && !qb.empty()) {
        // expand the side with smaller frontier
        auto& dist_from = qa.size() <= qb.size() ? dist_a : dist_b;
        auto& dist_to   = qa.size() <= qb.size() ? dist_b : dist_a;
        auto& q_from    = qa.size() <= qb.size() ? qa : qb;

        const int layer_size = static_cast<int>(q_from.size());
        for (int i = 0; i < layer_size; ++i) {
            const auto cur = q_from.front();
            q_from.pop();
            for (const auto& nxt : get_neighbors(cur)) {
                if (dist_from.count(nxt)) { continue; }
                dist_from[nxt] = dist_from[cur] + 1;
                if (dist_to.count(nxt)) {
                    return dist_from[nxt] + dist_to[nxt];
                }
                q_from.push(nxt);
            }
        }
    }
    return -1; // unreachable
}
```

## 時間與空間複雜度

理論上從 O(b^d) 降到 O(b^{d/2})，其中 b 是分支因子，d 是最短路徑長度。空間同為 O(b^{d/2})。實務上加速效果隨 d 增大而更顯著。

## 常見錯誤與邊界條件

- 起點等於終點時未先處理，導致多繞一圈。
- 兩側 visited 檢查的方向搞混，導致以為找到了但其實是在同一側。
- 狀態轉移不可逆（如有向圖），雙向 BFS 可能找不到路徑或找到非最短路。
- 複雜度分析時忘記 b^{d/2} 的常數實際上是 2 倍。

## 與相似技巧的比較

中間相遇法（Meet-in-the-Middle）是雙向 BFS 的泛化，常用於組合枚舉。IDA\* 則是深度優先的單向搜尋，與雙向 BFS 的空間策略截然不同。

## 例題與分級練習

先以「單詞接龍」或「密碼碼鎖」練習雙向 BFS，再嘗試拼圖類問題。進階可研究如何在隱式圖上實作雙向搜尋。

## 本節重點速查

雙向 BFS 要求起終點明確且轉移可逆；每次擴展較小 frontier；相遇時兩側距離相加即為答案；起手先檢查 start == target。
