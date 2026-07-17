---
id: binomial-theorem
volume: lower
source_file: lower-volume
chapter: 7
section: '7.3'
title: 二項式定理與楊輝三角形
summary: 以二項式係數建立冪展開與組合計數的橋樑，並用遞推建表。
prerequisites: [combinatorics]
learning_goals:
  - 推導並應用二項式定理
  - 以楊輝三角形遞推計算組合數
  - 理解係數與子集選取之間的對應
concepts: [binomial-coefficient, pascal-triangle]
complexity:
  time: O(n²) for table
  space: O(n²)
related_exercises: []
source_book_pages: [472, 476]
source_pdf_pages: [102, 106]
review_status: verified
---

## 這個技術解決什麼問題

快速展開 $(a+b)^n$、計算特定項係數，以及把「選或不選」的決策轉成組合數求和。

## 辨識題型的訊號

求 $(1+x)^n$ 某次項係數、路徑數等於組合數、權重和恰好對應二項式展開。

## 核心想法與直覺

$(a+b)^n$ 的展開中，$a^{n-k}b^k$ 項來自 $n$ 個括號中恰選 $k$ 個取 $b$，其餘取 $a$。因此係數為 $C(n,k)$。

## 狀態／資料結構定義

楊輝三角以二維陣列存 $C[i][j]$，其中 $0 \le j \le i \le n$。

## 不變量或正確性證明

二項式定理：$(a+b)^n = \sum_{k=0}^{n} C(n,k) a^{n-k} b^k$。杨辉恒等式 $C(n,k)=C(n-1,k-1)+C(n-1,k)$ 由「第 $n$ 個元素選或不選」直接得到。

## 逐步演算法

1. 初始化 $C[0][0]=1$。
2. 逐列遞推：$C[i][0]=C[i][i]=1$，其餘 $C[i][j]=C[i-1][j-1]+C[i-1][j]$。
3. 依題意查表或代入二項式展開公式。

## C++17 模板

```cpp
#include <vector>

std::vector<std::vector<long long>> build_pascal(int n) {
    std::vector<std::vector<long long>> c(n + 1, std::vector<long long>(n + 1, 0));
    for (int i = 0; i <= n; ++i) {
        c[i][0] = c[i][i] = 1;
        for (int j = 1; j < i; ++j) {
            c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
        }
    }
    return c;
}
```

## 時間與空間複雜度

建表 $O(n^2)$ 時間與空間；若只需單列，可滾動至 $O(n)$ 空間。

## 常見錯誤與邊界條件

$C(n,k)$ 在 $k<0$ 或 $k>n$ 時為 0；$n$ 稍大時 `long long` 會溢位，大模數下需用模逆元或 Lucas 定理。

## 與相似技巧的比較

楊輝三角適合多點離線查詢；若需大量在線查詢與模質數運算，預處理階乘與逆階乘更高效。

## 例題與分級練習

二項式係數奇偶性、格路計數、$(1+1)^n$ 與 $(1-1)^n$ 的組合恒等式。

## 本節重點速查

選 $k$ 個對應 $C(n,k)$；遞推式來自「選或不選」；大數需模運算保護。
