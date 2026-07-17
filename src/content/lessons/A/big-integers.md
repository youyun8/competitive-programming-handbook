---
id: big-integers
volume: lower
source_file: lower-volume
chapter: 10
section: 'A.1'
title: 大數計算
summary: 以 boost::multiprecision::cpp_int 或手寫十進位陣列處理超出 64 位元的整數運算。
prerequisites: [c++]
learning_goals:
  - 使用 boost::multiprecision 處理任意精度整數
  - 判斷何時需要大數與效能瓶頸
  - 設計手寫大數的基本加減乘方向
concepts: [big-integer, multiprecision, arbitrary-precision]
complexity:
  time: O(n) per digit for schoolbook methods
  space: O(n) digits
related_exercises: []
source_book_pages: [684, 687]
source_pdf_pages: [314, 317]
review_status: verified
---

## 這個技術解決什麼問題

競賽中某些題目的中間結果或答案會超過 64 位元整數上限（約 9e18）。大數計算提供了任意精度的整數加減乘除與比較。

## 辨識題型的訊號

- 題目明確說明答案可能很大，要求輸出精確整數。
- 階乘、冪次或組合數的結果明顯溢位 long long。
- 需要精確的十進位輸出，而非模意義下的結果。

## 核心想法與直覺

把整數切成許多「位數塊」儲存在陣列或鏈表中；加減乘以位數塊為單位逐位計算，類似小學直式運算。C++ 中 boost::multiprecision::cpp_int 已經做好了這件事。

## 狀態／資料結構定義

```cpp
#include <boost/multiprecision/cpp_int.hpp>
using boost::multiprecision::cpp_int;
```

`cpp_int` 是任意長度的帶號整數，支援所有內建運算子與 I/O。

## 不變量或正確性證明

boost::multiprecision 以二進位大整數實作，每一位的字進位與借位都與手算直式等價，因此運算結果與數學定義一致。

## 逐步演算法

1. `#include <boost/multiprecision/cpp_int.hpp>`
2. 宣告 `cpp_int` 變數並直接運算。
3. 以 `std::cin >>` / `std::cout <<` 輸入輸出。

## C++17 模板

```cpp
#include <boost/multiprecision/cpp_int.hpp>
#include <iostream>

using boost::multiprecision::cpp_int;

cpp_int factorial(int n) {
    cpp_int result = 1;
    for (int i = 2; i <= n; ++i) {
        result *= i;
    }
    return result;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << factorial(n) << '\n';
}
```

## 時間與空間複雜度

`cpp_int` 的加法為 $O(n)$、乘法為 $O(n \log n)$（FFT 優化時）或 $O(n^2)$（學校方法），其中 $n$ 為機器字數。空間與位數成正比。

## 常見錯誤與邊界條件

- 忘記正確引入 boost header 或編譯時未連結。
- 把 `cpp_int` 強制轉型回內建型別導致截斷。
- 在大迴圈中頻繁建立銷毀大整數，造成常數過大。
- 使用 `cpp_int` 做大量小整數運算時，不如手寫模運算高效。

## 與相似技巧的比較

模運算把數字壓在固定範圍，速度快但無法得到真實值；大數保留完整值，但開銷較大。Java BigInteger 也提供相同功能。

## 例題與分級練習

- 基礎：高精度階乘、大數加法減法。
- 進階：大數乘法（FFT 優化）、大數除法。

## 本節重點速查

優先使用 boost::multiprecision::cpp_int；只在需要精確十進位值時才上大數；模運算與大數選擇取決於輸出要求。
