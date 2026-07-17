---
id: xor-basis
volume: lower
source_file: lower-volume
chapter: 6
section: '6.5'
title: XOR 空間線性基
summary: 將異或運算視為 GF(2) 上的向量空間，用高斯消去建構基底以回答最大異或值與線性獨立性。
prerequisites: [bit-manipulation]
learning_goals:
  - 理解 XOR 與 GF(2) 線性空間的對應
  - 建構與維護線性基
  - 回答最大異或值與異或路徑問題
concepts: [linear-basis, xor, gaussian-elimination-on-bits]
complexity:
  time: O(n x log MAX)
  space: O(log MAX)
related_exercises: []
source_book_pages: [402, 406]
source_pdf_pages: [32, 36]
review_status: verified
---

## 這個技術解決什麼問題

給一組整數，判斷某個異或值能否被湊出，或求最大異或子集和。把每個數看成 GF(2) 上的位元向量，問題變成線性代數。

## 辨識題型的訊號

最大異或子集、異或路徑、區間異或線性基、判斷某數能否被異或湊出。

## 核心想法與直覺

XOR 就是不進位加法，恰好是 GF(2) 的加法。整數的每一位是一個維度，高位的 1 就像主元，用它消去其他數的同位元。

## 狀態／資料結構定義

陣列 `basis[bit]`，其中 `basis[i]` 的最高位設定位恰在第 i 位。插入數字時，由高到低掃描，若該位有基底就 XOR 消去，否則加入基底。

## 不變量或正確性證明

每次插入後基底內向量線性獨立，且任何已插入數的異或組合都可被基底唯一表示。最大異或值貪心取最高位可達最優。

## 逐步演算法

1. 初始化 `basis` 全為 0。
2. 對每個數 `x`，從最高位往低位檢查。
3. 若 `basis[i]` 存在且 `x` 第 i 位為 1，則 `x ^= basis[i]`。
4. 若掃完後 `x != 0`，設為 `basis[msb(x)]`。

## C++17 模板

```cpp
#include <vector>

class XorBasis {
    std::vector<long long> basis_;

public:
    explicit XorBasis(int max_bit = 60) : basis_(max_bit + 1, 0) {}

    bool insert(long long x) {
        for (int i = 60; i >= 0; --i) {
            if ((x >> i) & 1LL) {
                if (basis_[i] == 0) {
                    basis_[i] = x;
                    return true;
                }
                x ^= basis_[i];
            }
        }
        return false;
    }

    long long max_xor() const {
        long long result = 0;
        for (int i = 60; i >= 0; --i) {
            if ((result ^ basis_[i]) > result) { result ^= basis_[i]; }
        }
        return result;
    }

    bool can_represent(long long x) const {
        for (int i = 60; i >= 0; --i) {
            if ((x >> i) & 1LL) {
                if (basis_[i] == 0) { return false; }
                x ^= basis_[i];
            }
        }
        return x == 0;
    }
};
```

## 時間與空間複雜度

插入與查詢皆為 $O(\log MAX)$，其中 $MAX$ 是數值上限。基底只需 $O(\log MAX)$ 空間。

## 常見錯誤與邊界條件

從低位開始消去會破壞唯一性、重複插入未回傳 false、忘記 query 時也要做消去、數值為 0 對應空子集。

## 與相似技巧的比較

與高斯消去是同一思想，只是把實數加法換成 XOR。異或線性基常與樹上路徑結合，用可回滾基底詢問任意樹路徑。

## 例題與分級練習

初級：最大異或子集和；中級：區間線性基（可回滾）；高級：樹路徑最大異或值、異或矩陣秩。

## 本節重點速查

XOR 是 GF(2) 加法；基底維護不變量；貪心取最大；可推廣到子空間容斥與計數。
