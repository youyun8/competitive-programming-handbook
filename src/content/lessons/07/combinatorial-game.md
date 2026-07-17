---
id: combinatorial-game
volume: lower
source_file: lower-volume
chapter: 7
section: '7.9'
title: 公平組合遊戲：P/N-position 與 SG 函數
summary: 以必勝與必敗位置的分類，建立 Nim、Bash、Wythoff 等公平遊戲的分析框架。
prerequisites: [combinatorics, xor-basis]
learning_goals:
  - 區分 P-position 與 N-position
  - 計算 Sprague-Grundy 函數
  - 應用 Nim 和與 Wythoff 結論
concepts: [nim, sprague-grundy, impartial-game]
complexity:
  time: O(n) for Grundy
  space: O(n)
related_exercises: []
source_book_pages: [504, 509]
source_pdf_pages: [134, 139]
review_status: verified
---

## 這個技術解決什麼問題

兩人輪流操作、資訊完全、無隨機性、不能行動者輸的「公平遊戲」，可用 SG 理論將複雜局面拆解成獨立子遊戲的異或和。

## 辨識題型的訊號

「兩人輪流取石頭」「每次可移動若干步」「不能動者輸」；多堆獨立石頭則指向 Nim；單堆有上限則指向 Bash。

## 核心想法與直覺

- P-position（Previous player winning）：上一位玩家（即剛移動者）有必勝策略，也就是當前玩家必敗。
- N-position（Next player winning）：當前玩家有必勝策略。
- Sprague-Grundy 定理：任何公平遊戲等價於某堆 Nim 石頭，其大小稱為 Grundy 數。獨立子遊戲的組合等價於 Grundy 數的 xor。

## 狀態／資料結構定義

$\text{grundy}(s) = \text{mex}\{ \text{grundy}(s') \mid s \to s' \text{ 為合法移動} \}$。其中 mex 為最小未出現非負整數。

## 不變量或正確性證明

SG 定理核心：局面為 P-position 若且唯若 Grundy 數為 0。因為從非零局面總可移到零（Nim  strategy stealing），而從零局面只能到非零。

## 逐步演算法

1. 列舉所有局面與合法移動。
2. 依拓撲序递推 Grundy 數。
3. 多子遊戲組合時，總 Grundy 為各子遊戲 Grundy 的 xor。
4. 總 Grundy 為 0 則先手必敗，否則先手必勝。

## C++17 模板

```cpp
#include <vector>
#include <algorithm>

int mex(const std::vector<int>& values) {
    std::vector<bool> seen(values.size() + 1, false);
    for (int v : values) {
        if (v >= 0 && static_cast<std::size_t>(v) < seen.size()) {
            seen[v] = true;
        }
    }
    for (std::size_t i = 0; i < seen.size(); ++i) {
        if (!seen[i]) return static_cast<int>(i);
    }
    return static_cast<int>(seen.size());
}

std::vector<int> compute_grundy(int max_n, const std::vector<int>& moves) {
    std::vector<int> grundy(max_n + 1, 0);
    for (int i = 1; i <= max_n; ++i) {
        std::vector<int> reachable;
        for (int m : moves) {
            if (i >= m) reachable.push_back(grundy[i - m]);
        }
        grundy[i] = mex(reachable);
    }
    return grundy;
}

// Nim: 多堆的 xor
int nim_sum(const std::vector<int>& piles) {
    int x = 0;
    for (int p : piles) x ^= p;
    return x;
}
```

## 時間與空間複雜度

單一局面 Grundy 計算 $O(n \cdot |\text{moves}|)$；Nim 查詢 $O(k)$，$k$ 為堆數。

## 常見錯誤與邊界條件

 mex 的集合可能有重複，不影響結果但要去重或直接用布爾標記；$grundy(0)=0$ 是終局狀態；非公平遊戲（如一方只能走奇數步）不適用 SG 理論。

## 與相似技巧的比較

Bash 與 Nim 是 SG 的特例；Wythoff  Nim 的兩堆版本有封閉式（Beatty 序列）。DP 記憶化搜索是 SG 的實現方式之一。

## 例題與分級練習

單堆取石頭、Nim 遊戲、Kayles、翻硬幣遊戲、Wythoff 的黃金比例通項。

## 本節重點速查

P-position 對應 Grundy=0；mex 定義單局面等價類；獨立子遊戲用 xor 合併。
