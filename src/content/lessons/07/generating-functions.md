---
id: generating-functions
volume: lower
source_file: lower-volume
chapter: 7
section: '7.8'
title: 生成函數：計數的代數語言
summary: 把離散計數序列包裝成冪級數，用代數運算求解遞推與組合結構。
prerequisites: [combinatorics, polynomials]
learning_goals:
  - 建立普通型與指數型生成函數的直覺
  - 以生成函數求解遞推關係
  - 結合卷積處理組合結構的拼接
concepts: [ordinary-generating-function, exponential-generating-function]
complexity:
  time: O(n log n) for convolution
  space: O(n)
related_exercises: []
source_book_pages: [499, 503]
source_pdf_pages: [129, 133]
review_status: verified
---

## 這個技術解決什麼問題

直接列遞推可能困難；生成函數把計數問題轉化為多項式運算，讓卷積對應結構組合、微分對應標記變化。

## 辨識題型的訊號

求數列通項、帶權計數、多重集選取、結構的遞歸定義（如樹、序列、集合）。

## 核心想法與直覺

普通生成函數 $F(x) = \sum a_n x^n$：$x^n$ 的係數就是答案。乘積對應獨立結構的拼接。
指數生成函數 $E(x) = \sum a_n \frac{x^n}{n!}$：適合標記結構（如集合劃分、排列），乘積自動處理標記分配。

## 狀態／資料結構定義

多項式以係數向量 $[a_0, a_1, \dots, a_n]$ 儲存；用 NTT 或 FFT 加速卷積。

## 不變量或正確性證明

生成函數的乘法 $F(x)G(x)$ 中，$x^n$ 係數為 $\sum_{k=0}^{n} a_k b_{n-k}$，恰好對應「總大小為 $n$ 的前後段組合數」。這是生成函數能自動化計數的核心。

## 逐步演算法

1. 根據組合結構選擇 OGF 或 EGF。
2. 寫出結構的生成函數方程式（如樹 = 節點 × 樹序列）。
3. 解方程式或展開級數至所需項。
4. 用多項式乘法（或 NTT）加速卷積。

## C++17 模板

```cpp
#include <vector>

using Poly = std::vector<long long>;

Poly multiply_naive(const Poly& a, const Poly& b, long long mod) {
    Poly c(a.size() + b.size() - 1, 0);
    for (std::size_t i = 0; i < a.size(); ++i) {
        for (std::size_t j = 0; j < b.size(); ++j) {
            c[i + j] = (c[i + j] + a[i] * b[j]) % mod;
        }
    }
    return c;
}

// 普通生成函數：從 (1 + x + x^2 + ...) 的乘積求組合數
Poly build_ogf(const std::vector<int>& limits, long long mod) {
    Poly res = {1};
    for (int lim : limits) {
        Poly term(lim + 1, 1);
        res = multiply_naive(res, term, mod);
    }
    return res;
}
```

## 時間與空間複雜度

naive 卷積 $O(n^2)$；NTT $O(n \log n)$；空間 $O(n)$。

## 常見錯誤與邊界條件

OGF 與 EGF 選錯會導致少除或多乘 $n!$；級數截斷時遺漏高階項；模數不適合 NTT 時需用 FFT 或任意模數卷積。

## 與相似技巧的比較

DP 是直接計數；生成函數把計數包裝成代數運算，適合有多個子結構拼接的問題。形式冪級數與組合種類理論則更進一步抽象化。

## 例題與分級練習

整數拆分、帶限制硬幣問題、集合劃分、排列的循環結構計數。

## 本節重點速查

OGF 對應無標結構、拼接用乘積；EGF 對應有標結構、集合用指數；卷積是核心運算。
