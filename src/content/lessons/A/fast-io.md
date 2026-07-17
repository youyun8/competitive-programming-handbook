---
id: fast-io
volume: lower
source_file: lower-volume
chapter: 10
section: 'A.3'
title: 高效輸入／輸出
summary: 以 sync_with_stdio(false)／cin.tie(nullptr) 與 fread 級緩衝加速大量資料的讀寫。
prerequisites: [c++]
learning_goals:
  - 使用 ios::sync_with_stdio 與 cin.tie 解除同步
  - 判斷何時需要使用 scanf/printf 或自訂快速讀取
  - 避免格式化陷阱與型別錯配
concepts: [fast-io, buffer, sync, scanf-printf]
complexity:
  time: O(total_input_size) with fast buffer
  space: O(buffer_size)
related_exercises: []
source_book_pages: [691, 693]
source_pdf_pages: [321, 323]
review_status: verified
---

## 這個技術解決什麼問題

競賽題目的輸入量可能達到數百萬或數千萬筆資料，C++ 預設的 `cin`/`cout` 因與 C stdio 同步且每次輸出後刷新緩衝，速度可能變成瓶頸。

## 辨識題型的訊號

- 題目說明 $n, m$ 可達 $2 \times 10^5$ 甚至 $10^6$。
- 本地測試明顯 TLE，但複雜度理論上已經足夠。
- 需要頻繁輸入輸出，如互動題或按查詢即時回應。

## 核心想法與直覺

`cin` 慢不是因為 C++ 本身慢，而是預設做了兩件事：與 C stdio 同步（確保 `cin`/`scanf` 混用安全）、與 `cout` 綁定（每次 `cin` 自動刷新 `cout`）。解除這兩個約束即可大幅提升速度。更極端的狀況可改用 `fread`/`fwrite` 級一次性緩衝。

## 狀態／資料結構定義

不需要額外資料結構；核心是把 stream 的同步與綁定關掉：

```cpp
std::ios::sync_with_stdio(false);
std::cin.tie(nullptr);
```

## 不變量或正確性證明

`sync_with_stdio(false)` 讓 C++ stream 與 C stdio 使用各自獨立緩衝；`tie(nullptr)` 讓 `cin` 不再在每次讀取前強制刷新 `cout`。兩者都不會改變輸入輸出的語意，只是放棄了混用安全性與即時互動保證。

## 逐步演算法

1. 在 `main()` 第一行加入 `std::ios::sync_with_stdio(false);`
2. 第二行加入 `std::cin.tie(nullptr);`
3. 其餘程式碼照常使用 `cin`/`cout`。
4. 若仍然不足，換用 `scanf`/`printf` 或自訂 fread buffer。

## C++17 模板

```cpp
#include <iostream>
#include <vector>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int n = 0;
    int m = 0;
    std::cin >> n >> m;

    std::vector<long long> values(n);
    for (long long& value : values) {
        std::cin >> value;
    }

    while (m--) {
        int l = 0;
        int r = 0;
        std::cin >> l >> r;
        long long sum = 0;
        for (int i = l; i <= r; ++i) {
            sum += values[i];
        }
        std::cout << sum << '\n';
    }
}
```

## 時間與空間複雜度

解除同步後，`cin`/`cout` 的複雜度與 `scanf`/`printf` 同級，皆為 $O(\text{總輸入量})$。額外空間僅為 stream buffer（與編譯器有關，通常數 KB）。

## 常見錯誤與邊界條件

- 混用 `cin`/`cout` 與 `scanf`/`printf` 且沒有 `fflush`；解除同步後兩者緩衝不一致，輸出順序可能錯亂。
- `endl` 每次都刷新緩衝；大量輸出時應改用 `'\n'`。
- 自訂快速讀取沒有處理負號或溢位。
- 互動題需要即時回應，不應解除 `tie` 或使用大緩衝導致延遲。

## 與相似技巧的比較

`scanf`/`printf` 比綁定的 `cin`/`cout` 快，但解除同步後的 `cin`/`cout` 速度已非常接近。`fread`/`fwrite` 是最高速方案，但程式碼量較大且容易出錯。Python 的 sys.stdin.buffer 是類似概念。

## 例題與分級練習

- 基礎：大規模陣列輸入，練習解除同步後提交時間差異。
- 進階：實作基於 `fread` 的快速整數讀取器，與預設 `cin` 比較速度。

## 本節重點速查

main() 前兩行放 `sync_with_stdio(false)` 與 `cin.tie(nullptr)`；用 `'\n'` 代替 `endl`；解除同步後不要混用 `cin`/`scanf`。
