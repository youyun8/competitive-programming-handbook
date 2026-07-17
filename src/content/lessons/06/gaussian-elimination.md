---
id: gaussian-elimination
volume: lower
source_file: lower-volume
chapter: 6
section: '6.4'
title: 高斯消去
summary: 以基本列運算將線性方程組化為上三角或簡化列階梯形，求唯一解、無解或無限多解。
prerequisites: [matrix]
learning_goals:
  - 掌握基本列運算與消去步驟
  - 實作高斯－喬登消去法
  - 判斷解的種類
concepts: [gaussian-elimination, pivot, linear-system]
complexity:
  time: O(n^3)
  space: O(n^2)
related_exercises: []
source_book_pages: [396, 402]
source_pdf_pages: [26, 32]
review_status: verified
---

## 這個技術解決什麼問題

給定 n 元線性方程組，用基本列運算消去變數，化為易解的階梯形，判定解存在性與唯一性。

## 辨識題型的訊號

線性方程組、矩陣求秩、求逆矩陣、判斷向量是否可由其他向量線性表出。

## 核心想法與直覺

每一列代表一條方程；基本列運算不改變解集合。選主元把該變數從下方所有方程消掉，依序往下做。

## 狀態／資料結構定義

擴增矩陣 `A[n][n+1]`，前 n 列是係數，最後一欄是常數項。用 `pivot_row[col]` 記錄每列主元所在行。

## 不變量或正確性證明

三種基本列運算（交換、倍乘、倍加）都是可逆線性變換，因此方程組的解集合保持不變。

## 逐步演算法

1. 對每一行 `col`，從當前列以下找絕對值最大的非零元素當主元。
2. 交換到當前列，將主元歸一（喬登）或保留（高斯）。
3. 用該列消去下方（高斯）或全部（喬登）同行的元素。
4. 回代（高斯）或直接讀取解答（喬登）。

## C++17 模板

```cpp
#include <vector>
#include <cmath>

const double EPS = 1e-9;

std::vector<double> gaussian_elimination(std::vector<std::vector<double>> a) {
    const int n = static_cast<int>(a.size());
    const int m = static_cast<int>(a[0].size());
    std::vector<int> where(m - 1, -1);
    for (int col = 0, row = 0; col < m - 1 && row < n; ++col) {
        int sel = row;
        for (int i = row; i < n; ++i)
            if (std::fabs(a[i][col]) > std::fabs(a[sel][col])) sel = i;
        if (std::fabs(a[sel][col]) < EPS) continue;
        std::swap(a[sel], a[row]);
        where[col] = row;
        for (int i = 0; i < n; ++i) {
            if (i != row) {
                double coeff = a[i][col] / a[row][col];
                for (int j = col; j < m; ++j)
                    a[i][j] -= coeff * a[row][j];
            }
        }
        ++row;
    }
    std::vector<double> ans(m - 1, 0);
    for (int i = 0; i < m - 1; ++i)
        if (where[i] != -1) ans[i] = a[where[i]][m - 1] / a[where[i]][i];
    return ans;
}
```

## 時間與空間複雜度

時間 $O(n^3)$，空間 $O(n^2)$。高斯－喬登消去法的常數因子與高斯消去加回代相當。

## 常見錯誤與邊界條件

主元為零或近零導致數值不穩定；忘記部分選主元；整數模域下除法要用逆元；解不存在或有無限多解時未判斷。

## 與相似技巧的比較

高斯消去後需回代；喬登直接得到簡化形。對於模質數域，除法改用模逆元；對於位元矩陣可用 XOR 基底取代浮點運算。

## 例題與分級練習

初級：二元一次方程組；中級：判定線性相關性、求逆矩陣；高級：模質數域線性方程、區間線性基底。

## 本節重點速查

列運算不改變解；部分選主元防誤差；喬登形直接讀答案；非滿秩時需判斷自由變數。
