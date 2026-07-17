---
id: burnside-polya
volume: lower
source_file: lower-volume
chapter: 7
section: '7.7'
title: Burnside 定理與 Pólya 計數
summary: 用群論的不變軌道觀點，計數在對稱操作下的等價類數目。
prerequisites: [combinatorics, number-theory]
learning_goals:
  - 理解群作用與軌道的定義
  - 應用 Burnside 引理計數等價類
  - 結合循環指數進行 Pólya 計數
concepts: [burnside-lemma, polya-counting, group-action]
complexity:
  time: depends on group size
  space: O(n)
related_exercises: []
source_book_pages: [492, 498]
source_pdf_pages: [122, 128]
review_status: verified
---

## 這個技術解決什麼問題

計數「看起來一樣」的方案時，不能直接排列組合，必須把旋轉、翻轉等對稱操作納入考量，把等價方案折疊成單一軌道。

## 辨識題型的訊號

「旋轉後相同視為同類」「項鍊染色」「立方體面染色」「在對稱下不同的方案數」。

## 核心想法與直覺

Burnside：等價類數 = 所有群元素的不動點平均數。
Pólya：把每個群元素拆解成不相交循環，每個循環內顏色必須相同；代入顏色數即得不動點數。

## 狀態／資料結構定義

群 $G$ 作用在染色集合 $X$ 上。對每個 $g \in G$，計算 $\text{fix}(g)$：在 $g$ 下不變的染色數。

## 不變量或正確性證明

Burnside：$|X/G| = \frac{1}{|G|} \sum_{g \in G} |X^g|$。等式來自對所有 $(g,x)$ 滿足 $g \cdot x = x$ 的有序對雙重計數。Pólya 是 Burnside 在置換群上的具體實現。

## 逐步演算法

1. 列出群的所有元素（如旋轉 $0^\circ, 90^\circ, \dots$）。
2. 對每個元素計算循環分解，得到循環數 $c(g)$。
3. 不動點數為 $m^{c(g)}$，$m$ 為顏色數。
4. 取平均即為不等價方案數。

## C++17 模板

```cpp
#include <vector>

long long mod_pow(long long a, long long e, long long mod) {
    long long r = 1 % mod;
    while (e) {
        if (e & 1) r = r * a % mod;
        a = a * a % mod;
        e >>= 1;
    }
    return r;
}

// 對 n 個位置的旋轉群計算項鍊染色數
long long necklace_count(int n, int colors, long long mod) {
    long long sum = 0;
    for (int shift = 0; shift < n; ++shift) {
        int g = std::gcd(shift, n);
        int cycles = n / g;
        sum = (sum + mod_pow(colors, cycles, mod)) % mod;
    }
    long long inv_n = mod_pow(n, mod - 2, mod);
    return sum * inv_n % mod;
}
```

## 時間與空間複雜度

群大小為 $|G|$；每個元素循環分解 $O(n)$。總時間 $O(|G| \cdot n)$；空間 $O(n)$。

## 常見錯誤與邊界條件

群必須封閉且含單位元；旋轉 $0$ 的不動點數為 $m^n$ 不能漏；模運算下除以 $|G|$ 要用逆元。

## 與相似技巧的比較

單純組合數忽略對稱；Burnside 系統地處理對稱；Pólya 進一步把不動點計算自動化為循環結構代入。

## 例題與分級練習

項鍊染色、手鐲染色（含翻轉）、正多邊形頂點染色、立方體面與邊染色。

## 本節重點速查

等價類 = 不動點平均；每個循環同色；群必須完整列出。
