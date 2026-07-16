---
id: extended-gcd
volume: lower
source_file: lower-volume
chapter: 6
section: '6.8'
title: 擴展歐幾里得：求出 gcd 之外的係數
summary: 在歐幾里得遞迴回代中求 ax + by = gcd(a,b)，並連到丟番圖方程與模反元素。
prerequisites: [gcd, recursion, congruence]
learning_goals: [推導回代公式, 解二元丟番圖方程, 判斷模反元素是否存在]
concepts: [bezout, diophantine-equation, modular-inverse]
complexity:
  time: O(log min(a,b))
  space: O(log min(a,b))
related_exercises: []
source_book_pages: [387, 461]
source_pdf_pages: [17, 91]
review_status: verified
visualizer: extended-gcd
---

## 這個技術解決什麼問題

除了求 gcd，也找出係數 `x,y` 使 `a*x+b*y=gcd(a,b)`，進而解線性丟番圖方程與模反元素。

## 辨識題型的訊號

整數方程、模逆元、線性同餘、中國剩餘定理合併非互質模數。

## 核心想法與直覺

普通 gcd 的每次取餘都能回代成原始兩數的線性組合；遞迴返回時同步更新係數。

## 狀態／資料結構定義

函式回傳 `gcd`，並透過參考參數填入對應的 `x,y`。

## 不變量或正確性證明

若遞迴得到 `b*x1 + (a%b)*y1 = g`，代入 `a%b = a - floor(a/b)*b`，即可整理出新的 `x,y`。

## 逐步演算法

基底 `b=0`；遞迴求 `(b,a%b)`；依代數公式回代；若解 `a*x+b*y=c`，先檢查 `gcd` 是否整除 `c`。

## C++17 模板

```cpp
long long extended_gcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long next_x = 0;
    long long next_y = 0;
    long long gcd = extended_gcd(b, a % b, next_x, next_y);
    x = next_y;
    y = next_x - (a / b) * next_y;
    return gcd;
}
```

## 時間與空間複雜度

與歐幾里得演算法相同，時間與遞迴空間皆為 $O(\log \min(a,b))$。

## 常見錯誤與邊界條件

負數除法規則、係數乘法溢位、忘記只有 `gcd(a,m)=1` 時 `a` 才有模 `m` 逆元。

## 與相似技巧的比較

費馬小定理可在質數模下用快速冪求逆；擴展 gcd 不要求模數為質數，資訊更完整。

## 例題與分級練習

先求裴蜀係數，再解 `ax+by=c`，最後合併兩個同餘式。

## 本節重點速查

先求 gcd 再判斷可解性；回代公式來自 `a%b=a-qb`；逆元存在條件是互質。
