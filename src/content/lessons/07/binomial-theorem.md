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

## 教材經典例題與 C++ 解答

以下例題對應本章教材的組合遞推與容斥主題。題意皆為本站重新敘述，程式為獨立撰寫、可直接編譯的 C++17，讀完即得完整解法。

### 例題一：楊輝三角形預處理組合數

預處理所有 `C(a, b) mod p`（`a, b ≤ n`）以回答大量詢問。用 Pascal 遞推 `C(n,k)=C(n-1,k-1)+C(n-1,k)`，邊界 `C(n,0)=C(n,n)=1`，逐列填表。這對應「指定元素選或不選」把 k 元子集分成互斥兩類的組合意義。預處理 O(n²)，單次查詢 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 楊輝三角形遞推計算 C(n,k) mod p，邊界 C(n,0)=C(n,n)=1。
int main() {
    int n;
    long long p;
    if (!(cin >> n >> p)) return 0;
    vector<vector<long long>> c(n + 1, vector<long long>(n + 1, 0));
    for (int i = 0; i <= n; ++i) {
        c[i][0] = 1 % p;
        for (int j = 1; j <= i; ++j)
            c[i][j] = (c[i - 1][j - 1] + c[i - 1][j]) % p;
    }
    int q;
    cin >> q;
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << (b < 0 || b > a ? 0 : c[a][b]) << '\n';
    }
    return 0;
}
```

以 `n=5`、`p=1000000007` 建表後，`C(5,2)=10`、`C(5,0)=1`、`C(5,5)=1`。

### 例題二：錯排數（容斥）

錯排數 `D(n)` 是「n 個元素全都不在原位」的排列數，是容斥的經典應用：`D(n) = n!·Σ(-1)^k/k!`。實作上用等價的整數遞推 `D(n) = (n-1)·(D(n-1) + D(n-2))`，避免浮點誤差，邊界 `D(0)=1`、`D(1)=0`。時間 O(n)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 錯排數 D(n)：容斥 D(n) = n! * sum_{k=0}^{n} (-1)^k / k!，用遞推 D(n)=(n-1)(D(n-1)+D(n-2)).
int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> d(max(n + 1, 2), 0);
    d[0] = 1;
    if (n >= 1) d[1] = 0;
    for (int i = 2; i <= n; ++i)
        d[i] = static_cast<long long>(i - 1) * (d[i - 1] + d[i - 2]);
    cout << d[n] << '\n';
    return 0;
}
```

輸入 `4` 得 `9`：四個元素的錯排恰有 9 種。遞推版與容斥公式等價，但全程是整數運算。

## 本節重點速查

選 $k$ 個對應 $C(n,k)$；遞推式來自「選或不選」；大數需模運算保護。
