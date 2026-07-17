---
id: linear-dp
volume: upper
source_file: upper-volume
chapter: 5
section: '5.2'
title: 經典線性 DP
summary: 把問題展開成一維序列，設計只依賴前若干項的遞推式。
prerequisites: [recursion, dynamic-programming, arrays]
learning_goals: [設計線性狀態, 推導轉移, 掌握滾動陣列]
concepts: [linear-dp, state, transition, rolling-array]
complexity:
  time: O(n)
  space: O(n) 或 O(1) 使用滾動
related_exercises: ['dp-knapsack-01']
source_book_pages: [324, 331]
source_pdf_pages: [342, 349]
review_status: verified
---

## 這個技術解決什麼問題

當輸入本身就是線性排列（陣列、字串、序列），且任一位置的決策只需要知道前若干位置的最優值，就能用線性 DP 在 O(n) 或 O(n log n) 時間把整個序列求完。

## 辨識題型的訊號

給定一個序列要求最長遞增子序列、兩序列的最長公共子序列、零壹背包的一維優化；或者「選或不選」「切或不切」的連續決策。

## 核心想法與直覺

把「前 i 個元素的某種最佳值」當成當成狀態。狀態維度只有一維，轉移只看前綴，因此可以從左到右掃描。

## 狀態／資料結構定義

`dp[i]` 表示「考慮前 i 個元素，在目標條件下的最佳值」。根據題目，`dp[i]` 可以是「以 i 結尾的最佳值」或「前 i 個整體的最佳值」，語意不同轉移也不同。

## 不變量或正確性證明

由於 i 只依賴 j < i 的狀態，且掃描順序嚴格遞增，當計算到 i 時所有需要的子問題皆已算完，因此每個 `dp[i]` 都是最優解。

## 逐步演算法

1. 定義狀態語意。
2. 列舉最後一步（最後選的元素或切割點）。
3. 寫出轉移式。
4. 設定基底值。
5. 從左到右依序計算。
6. 輸出答案。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class LinearDpTemplate {
public:
    static int longest_increasing_subsequence(const vector<int>& sequence) {
        const int n = static_cast<int>(sequence.size());
        vector<int> dp(n, 1);
        int answer = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (sequence[j] < sequence[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
            answer = max(answer, dp[i]);
        }
        return answer;
    }

    static int longest_common_subsequence(const string& a, const string& b) {
        const int n = static_cast<int>(a.size());
        const int m = static_cast<int>(b.size());
        vector<int> previous(m + 1, 0), current(m + 1, 0);
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                if (a[i - 1] == b[j - 1]) {
                    current[j] = previous[j - 1] + 1;
                } else {
                    current[j] = max(previous[j], current[j - 1]);
                }
            }
            swap(previous, current);
        }
        return previous[m];
    }
};
```

## 時間與空間複雜度

LIS 範例時間 O(n²)，空間 O(n)；LCS 範例時間 O(nm)，空間可滾動到 O(m)。一般線性 DP 時間為「狀態數 × 轉移數」。

## 常見錯誤與邊界條件

- 「前 i 個」與「以 i 結尾」語意混淆。
- 滾動陣列時 `swap` 方向錯誤。
- 沒有處理空序列的基底值（`dp[0] = 0`）。

## 與相似技巧的比較

記憶化搜尋可寫出相同轉移，但遞迴深度可能爆掉；前綴和只是線性 DP 的特例；若狀態需要知道更多前綴資訊，就進入區間 DP 或斜率優化。

## 教材經典例題與 C++ 解答

以下六題是本節（書頁 324–331、PDF 342–349）教材依序講解的經典線性 DP。題意皆為本站重新敘述，程式為獨立撰寫的 C++17 實作，可直接讀完、不必再點連結轉來轉去。

### 例題一：最長公共子序列（LCS）

給定兩個字串 `x` 與 `y`，求一個最長的序列，使它同時是兩者的子序列（子序列允許刪去元素但不改順序）。令 `dp[i][j]` 為 `x` 前 `i` 個字元與 `y` 前 `j` 個字元的 LCS 長度：字元相等時由左上角加一延伸，否則取上方與左方的較大值。只依賴上一列，可滾動到 O(m) 空間。時間 O(nm)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 最長公共子序列：dp[i][j] 為 x 前 i 個與 y 前 j 個字元的 LCS 長度。
static int longest_common_subsequence(const string& x, const string& y) {
    const int n = static_cast<int>(x.size());
    const int m = static_cast<int>(y.size());
    vector<int> previous(m + 1, 0), current(m + 1, 0);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            if (x[i - 1] == y[j - 1]) {
                current[j] = previous[j - 1] + 1;
            } else {
                current[j] = max(previous[j], current[j - 1]);
            }
        }
        swap(previous, current);
    }
    return previous[m];
}

int main() {
    string x, y;
    if (!(cin >> x >> y)) { return 0; }
    cout << longest_common_subsequence(x, y) << '\n';
    return 0;
}
```

輸入 `abcbdab bdcaba` 會輸出 `4`（例如 `bcba`）。

### 例題二：編輯距離（Edit Distance）

給定兩個字串 `a` 與 `b`，每次可插入、刪除或替換一個字元，求把 `a` 變成 `b` 的最少操作數。令 `dp[i][j]` 為把 `a` 前 `i` 字元轉成 `b` 前 `j` 字元的最少步數；字元相同時直接繼承左上角，否則取刪除、插入、替換三者的最小值加一。基底是把空字串補齊需要的長度。時間 O(nm)，空間可滾動到 O(m)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 編輯距離：dp[i][j] 為把 a 前 i 字元轉成 b 前 j 字元的最少操作數。
static int edit_distance(const string& a, const string& b) {
    const int n = static_cast<int>(a.size());
    const int m = static_cast<int>(b.size());
    vector<int> previous(m + 1), current(m + 1);
    for (int j = 0; j <= m; ++j) { previous[j] = j; }
    for (int i = 1; i <= n; ++i) {
        current[0] = i;
        for (int j = 1; j <= m; ++j) {
            if (a[i - 1] == b[j - 1]) {
                current[j] = previous[j - 1];
            } else {
                current[j] = 1 + min({previous[j - 1], previous[j], current[j - 1]});
            }
        }
        swap(previous, current);
    }
    return previous[m];
}

int main() {
    string a, b;
    if (!(cin >> a >> b)) { return 0; }
    cout << edit_distance(a, b) << '\n';
    return 0;
}
```

輸入 `sunday saturday` 會輸出 `3`。

### 例題三：最長遞增子序列（LIS，O(n log n)）

求序列中最長的嚴格遞增子序列長度。維護一個 `tails` 陣列，`tails[k]` 表示「長度為 k+1 的遞增子序列」目前可能的最小結尾。掃描每個元素時用 `lower_bound` 找到第一個不小於它的位置替換，或在尾端追加。`tails` 的長度就是答案。時間 O(n log n)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 最長嚴格遞增子序列長度，O(n log n)。
static int longest_increasing_subsequence(const vector<int>& sequence) {
    vector<int> tails;
    for (int value : sequence) {
        auto position = lower_bound(tails.begin(), tails.end(), value);
        if (position == tails.end()) {
            tails.push_back(value);
        } else {
            *position = value;
        }
    }
    return static_cast<int>(tails.size());
}

int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    vector<int> sequence(n);
    for (int& value : sequence) { cin >> value; }
    cout << longest_increasing_subsequence(sequence) << '\n';
    return 0;
}
```

輸入 `7` 與 `1 7 3 5 9 4 8` 會輸出 `4`（例如 `1 3 5 8`）。若要最長不下降子序列，把 `lower_bound` 換成 `upper_bound` 即可。

### 例題四：子集和判定（Subset Sum）

給定一組非負整數與目標值 `target`，問能否選出一個子集使總和恰為 `target`。這是零壹背包的布林版：`dp[s]` 表示「是否能湊出和 s」，每加入一個數就由大到小更新，避免同一元素被重複使用。時間 O(n·target)，空間 O(target)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 子集和：能否從 items 選出一個子集，使其總和恰為 target。
static bool subset_sum_exists(const vector<int>& items, int target) {
    vector<char> dp(target + 1, 0);
    dp[0] = 1;
    for (int value : items) {
        for (int sum = target; sum >= value; --sum) {
            if (dp[sum - value]) { dp[sum] = 1; }
        }
    }
    return dp[target] != 0;
}

int main() {
    int n, target;
    if (!(cin >> n >> target)) { return 0; }
    vector<int> items(n);
    for (int& value : items) { cin >> value; }
    cout << (subset_sum_exists(items, target) ? "YES" : "NO") << '\n';
    return 0;
}
```

輸入 `6 9` 與 `6 2 5 8 3 5` 會輸出 `YES`（例如 `6 3`）；目標 `100` 則輸出 `NO`。由大到小的迴圈方向是零壹背包的關鍵，寫反會讓一個元素被拿多次。

### 例題五：行走問題（Ways to Cover a Distance）

一個人每步可走 1、2 或 3 格，問走到第 `n` 格共有幾種走法。這是三階費氏遞推：`dp[i] = dp[i-1] + dp[i-2] + dp[i-3]`，基底 `dp[0]=1`、`dp[1]=1`、`dp[2]=2`。時間 O(n)，只需保留最近三項即可降到 O(1) 空間。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 行走問題：每步走 1~3 格，走到第 n 格的走法數。
static long long count_ways(int n) {
    vector<long long> dp(max(n + 1, 3), 0);
    dp[0] = 1;
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; ++i) {
        dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
    }
    return dp[n];
}

int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    cout << count_ways(n) << '\n';
    return 0;
}
```

輸入 `3` 會輸出 `4`（`1+1+1`、`1+2`、`2+1`、`3`）；輸入 `4` 會輸出 `7`。走法數成長很快，實務上會取模或改用大整數。

## 例題與分級練習

- 入門：爬樓梯、最小路徑和。
- 中級：最長遞增子序列、最長公共子序列。
- 進階：線性 DP 加上滾動優化後，參與線段樹或凸殼優化。

## 本節重點速查

狀態語意必先釐清；轉移只朝左看；滾動陣列可省空間，但會丟失歷史狀態。
