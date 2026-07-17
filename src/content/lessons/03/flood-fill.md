---
id: flood-fill
volume: upper
source_file: upper-volume
chapter: 3
section: '3.3'
title: 洪水填充：網格連通塊的搜尋與填色
summary: 以 BFS 或 DFS 遍歷二維網格中的連通區域，正確處理邊界與四向／八向連接。
prerequisites: [bfs-dfs, arrays]
learning_goals:
  - 以 BFS 或 DFS 標記網格連通塊
  - 正確處理地圖邊界與障礙格
  - 統計連通塊數量、面積或周長
concepts: [flood-fill, connected-components, grid-traversal, 4-direction, 8-direction]
complexity:
  time: O(rows * cols)
  space: O(rows * cols)
related_exercises: ['grid-connected-components']
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

## 這個技術解決什麼問題

在二維網格中，根據相鄰規則（四連通或八連通）找出所有由相同屬性格組成的區域，並統計每個區域的資訊。它是圖論連通分量在二維空間上的直觀應用。

## 辨識題型的訊號

- 給定地圖，問有幾座島嶼、湖泊或房間。
- 需要把連通區域標記成同一顏色或編號。
- 計算最大連通區域面積或周長。
- 染色、掃雷、細胞自動機等模擬題。

## 核心想法與直覺

從一個未造訪的非障礙格出發，把所有能走到的相鄰同色格標記為同一個連通塊，直到無路可走。再尋找下一個未造訪的起點，重複直到整張地圖檢查完畢。

## 狀態／資料結構定義

- 地圖：`std::vector<std::string>` 或 `std::vector<std::vector<int>>`。
- visited：`std::vector<std::vector<bool>>` 或原地修改地圖標記（如改為 '#'）。
- BFS 使用 `std::queue<std::pair<int, int>>`；DFS 可用顯式堆疊或遞迴。
- 方向陣列：`dx[] = {-1, 1, 0, 0}`, `dy[] = {0, 0, -1, 1}`。

## 不變量或正確性證明

Flood Fill 的不變量：當一個格子被標記為 visited 時，從起始格到該格存在一條完全由合法格子組成的路徑；反之，所有與起始格連通的合法格最終都會被標記。因為每次展開都會檢查四個鄰居，且不斷把未造訪鄰居加入 frontier，這保證了連通性的完備性。

## 逐步演算法

1. 讀取地圖大小與內容。
2. 對每個位置 (i, j)：
   - 若為合法且未造訪，啟動 BFS/DFS。
   - 在搜尋中標記所有可達格，累積該連通塊的屬性（面積、周長等）。
3. 輸出連通塊數量與統計資訊。

## C++17 模板

```cpp
#include <vector>
#include <queue>
#include <string>
#include <utility>

int count_islands(std::vector<std::string>& grid) {
    const int rows = static_cast<int>(grid.size());
    if (rows == 0) { return 0; }
    const int cols = static_cast<int>(grid[0].size());

    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int island_count = 0;

    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            if (grid[i][j] != '1') { continue; }

            ++island_count;
            std::queue<std::pair<int, int>> q;
            q.emplace(i, j);
            grid[i][j] = '0';

            while (!q.empty()) {
                auto [x, y] = q.front();
                q.pop();
                for (int d = 0; d < 4; ++d) {
                    const int nx = x + dx[d];
                    const int ny = y + dy[d];
                    if (nx < 0 || nx >= rows || ny < 0 || ny >= cols) { continue; }
                    if (grid[nx][ny] != '1') { continue; }
                    grid[nx][ny] = '0';
                    q.emplace(nx, ny);
                }
            }
        }
    }
    return island_count;
}
```

## 時間與空間複雜度

每個格子最多被訪問一次，時間 O(rows _ cols)。queue 與 visited 的空間同為 O(rows _ cols)。

## 常見錯誤與邊界條件

- 忘記檢查邊界就直接讀取 grid[nx][ny]，造成陣列越界。
- 八連通忘記處理斜對角，或四連通誤用八連通導致答案錯誤。
- DFS 遞迴太深造成 stack overflow，改用顯式堆疊或 BFS。
- 原地修改地圖時，後續計算誤把已標記格當成障礙。

## 與相似技巧的比較

BFS/DFS 在一般圖上處理連通分量；Flood Fill 是其在規則網格上的特例。並查集也能解連通性問題，但 Flood Fill 更適合需要同時計算面積、周長或形狀的場景。

## 例題與分級練習

先以「島嶼數量」建立基本感覺，再做「被圍繞的區域」練習邊界判斷。進階可挑戰「最大島嶼面積」與「八連通判斷」。

## 本節重點速查

Flood Fill = 找起點 + BFS/DFS 標記連通塊；務必先檢查邊界再讀取值；四向與八向決定連通定義；原地標記可省空間。
