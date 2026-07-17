---
id: kmp
volume: lower
source_file: lower-volume
chapter: 9
section: '9.5'
title: KMP：失配時保留已知的前綴資訊
summary: 以 prefix function 表示邊界，做到線性時間模式匹配。
prerequisites: [strings, invariants]
learning_goals: [計算 prefix function, 解釋失配回退, 找出所有匹配位置]
concepts: [border, prefix-function, pattern-matching]
complexity:
  time: O(n + m)
  space: O(m)
related_exercises: ['kmp-pattern-match']
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
visualizer: kmp
---

## 這個技術解決什麼問題

在長文字中找模式的所有出現位置，失配時不把文字指標倒退，避免最壞 $O(nm)$。

## 辨識題型的訊號

單一模式精確匹配、前綴與後綴關係、字串週期、border。

## 核心想法與直覺

已匹配字串的某個真前綴若也是後綴，失配後仍可能保留這段匹配。prefix function 記錄最長可保留長度。

## 狀態／資料結構定義

`prefix[i]` 是模式前綴 `pattern[0..i]` 的最長真 border 長度。

## 不變量或正確性證明

變數 `matched` 始終是目前文字後綴與模式前綴相等的最大候選。回退沿 border 鏈，只嘗試仍可能匹配的長度。

## 逐步演算法

先建立模式 prefix function；掃描文字，失配時沿 prefix 回退，匹配則加一；長度到達模式長度就記錄答案並繼續。

## C++17 模板

```cpp
#include <string>
#include <vector>

std::vector<int> prefix_function(const std::string& pattern) {
    std::vector<int> prefix(pattern.size());
    for (int index = 1; index < static_cast<int>(pattern.size()); ++index) {
        int matched = prefix[index - 1];
        while (matched > 0 && pattern[index] != pattern[matched]) {
            matched = prefix[matched - 1];
        }
        if (pattern[index] == pattern[matched]) {
            ++matched;
        }
        prefix[index] = matched;
    }
    return prefix;
}
```

## 時間與空間複雜度

指標總前進與回退次數都是線性，時間 $O(n+m)$，空間 $O(m)$。

## 常見錯誤與邊界條件

空模式、找到一次後未回退、把 prefix 長度當索引、混淆 Z-function 與 prefix function。

## 與相似技巧的比較

Z-function 比較每個後綴與整體前綴；rolling hash 易擴充但有碰撞；AC 自動機處理多模式。

## 例題與分級練習

找全部匹配位置、最小週期、最長 border 鏈。

## 教材經典例題與 C++ 解答

以下例題對應本章教材的前綴函數與回文主題。題意皆為本站重新敘述，程式為獨立撰寫、可直接編譯的 C++17，讀完即得完整解法。

### 例題一：前綴函數（KMP 的核心）

對字串 `s`，輸出每個前綴 `s[0..i]` 的最長真 border 長度（既是前綴又是後綴、且不等於整段）。計算 `pi[i]` 時從 `pi[i-1]` 出發，失配就沿 border 鏈 `j = pi[j-1]` 回退，匹配則加一。文字指標不回退，總時間 O(n)。這張表就是 KMP 匹配與許多字串結論的基礎。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 前綴函數 pi[i]：s[0..i] 最長真前綴且同時是後綴的長度。
static vector<int> prefix_function(const string& s) {
    const int n = static_cast<int>(s.size());
    vector<int> pi(n, 0);
    for (int i = 1; i < n; ++i) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) ++j;
        pi[i] = j;
    }
    return pi;
}

int main() {
    string s;
    if (!(cin >> s)) return 0;
    vector<int> pi = prefix_function(s);
    for (size_t i = 0; i < pi.size(); ++i) cout << pi[i] << " \n"[i + 1 == pi.size()];
    return 0;
}
```

對 `ababa` 輸出 `0 0 1 2 3`：到第五個字元時，最長 border 是 `aba`，長度 3。由 `n - pi[n-1]` 還能得到最短循環節候選。

### 例題二：最長回文子串（Manacher）

線性時間求最長回文子串長度。先在字元間插入分隔符，把奇偶長度回文統一處理，並加哨兵避免越界；維護目前右端最遠的回文中心與右界，界內位置先用鏡像半徑初始化，只有超出右界的部分才需要新比較。右界只向右移，總時間 O(n)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// Manacher：O(n) 求最長回文子串長度。
static int longest_palindrome(const string& s) {
    string t = "^";
    for (char c : s) {
        t += '#';
        t += c;
    }
    t += "#$";
    const int n = static_cast<int>(t.size());
    vector<int> radius(n, 0);
    int center = 0, right = 0, best = 0;
    for (int i = 1; i + 1 < n; ++i) {
        if (i < right) radius[i] = min(right - i, radius[2 * center - i]);
        while (t[i + radius[i] + 1] == t[i - radius[i] - 1]) ++radius[i];
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
        best = max(best, radius[i]);
    }
    return best;
}

int main() {
    string s;
    if (!(cin >> s)) return 0;
    cout << longest_palindrome(s) << '\n';
    return 0;
}
```

對 `abacabad` 輸出 `7`：最長回文是 `abacaba`。分隔符技巧讓奇偶長度回文不必分開處理。

## 本節重點速查

文字指標不回退；模式指標沿 border 鏈回退；prefix 值是長度。
