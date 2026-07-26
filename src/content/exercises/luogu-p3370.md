---
id: luogu-p3370
volume: lower
source_file: lower-volume
title: 洛谷 P3370 字串雜湊：統計不同字串個數
chapter: 9
section: '9.1'
kind: external-oj
difficulty: 2
topics: ['字串雜湊', '進制雜湊', '雙模數']
prerequisites: ['string-hash']
statement: |-
  給定 N 個字串，求其中互不相同的字串有多少個。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '字串總長很大，逐對比較不可行'
  - '需要考慮雜湊碰撞的風險'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 N；接下來 N 行，每行一個字串。'
output_format: '一行一個整數，表示不同字串的個數。'
samples:
  - input: |
      5
      abc
      aaaa
      abc
      abcc
      12345
    output: |
      4
    explanation: |-
      五個字串中 abc 出現兩次，其餘各一次，因此不同的有 abc、aaaa、abcc、12345 共 4 個。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    進制雜湊把字串當成一個 base 進位的數：h = (h·base + c) mod m，逐字元累乘累加。相同字串必得相同雜湊值，於是比較字串變成比較一個整數。
  - |-
    base 要大於字元集大小（常取 131 或 13331），模數取大質數（10^9+7、998244353）。base 與 mod 都用質數能讓分佈更均勻。
  - |-
    單模數會有碰撞風險，出題人也常針對特定模數構造反例。用**兩組不同的 (base, mod)** 組成一個 pair 當作 key，碰撞機率降到可以忽略——這是競賽中的標準做法。
  - |-
    把雜湊值丟進 `set` 或排序後去重，答案就是不同值的個數。注意是比較整個 pair，不能只比其中一個。
  - |-
    這題直接用 `set<string>` 也能過，但本題的意義在於練習前綴雜湊的寫法：之後求任意子串的雜湊、判斷迴文、比較兩個子串是否相等，都建立在同一套遞推上。
solution_outline: |-
  對每個字串算出一組雙雜湊 (h1, h2)，其中 h = (h·base + c) mod m，兩組用不同的 base 與 mod。把 pair 插入 `set`，最後輸出 set 的大小。
proof_or_invariant: |-
  相同字串必然得到相同雜湊，所以不會把相同的算成不同；反向的誤判（不同字串雜湊相同）在雙模數下機率約為 1/(m1·m2)，對本題規模而言可忽略。因此 set 的大小以壓倒性機率等於不同字串個數。
complexity:
  time: 'O(總長 log N)'
  space: 'O(N)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const unsigned long long kBase1 = 131;
  static const unsigned long long kBase2 = 137;
  static const unsigned long long kMod1 = 1000000007ULL;
  static const unsigned long long kMod2 = 998244353ULL;

  // TODO 1：把字串當成 base 進位的數算出雜湊值。
  //   h = (h * base + c) % mod，逐字元累乘累加。
  //   這裡回傳一組雙雜湊，用兩個不同的 (base, mod) 讓碰撞機率低到可忽略。
  static pair<unsigned long long, unsigned long long> hash_of(const string& text) {
      unsigned long long h1 = 0;
      unsigned long long h2 = 0;
      (void)text;
      (void)kBase1;
      (void)kBase2;
      (void)kMod1;
      (void)kMod2;
      return {h1, h2};
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }

      // TODO 2：把每個字串的雜湊值丟進 set，最後輸出 set 的大小。
      //   （直接用 set<string> 也能過，但本題的重點是練習進制雜湊，
      //     之後求子串雜湊、判斷迴文都要靠同一套前綴雜湊。）
      set<pair<unsigned long long, unsigned long long>> seen;
      for (int i = 0; i < n; ++i) {
          string text;
          cin >> text;
          seen.insert(hash_of(text));
      }
      cout << seen.size() << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 雙模數進制雜湊：把字串當作 base 進位的數，兩組模數一起比對，
  // 讓不同字串碰撞的機率低到可以忽略。
  static const unsigned long long kBase1 = 131;
  static const unsigned long long kBase2 = 137;
  static const unsigned long long kMod1 = 1000000007ULL;
  static const unsigned long long kMod2 = 998244353ULL;

  static pair<unsigned long long, unsigned long long> hash_of(const string& text) {
      unsigned long long h1 = 0;
      unsigned long long h2 = 0;
      for (const unsigned char c : text) {
          h1 = (h1 * kBase1 + c) % kMod1;
          h2 = (h2 * kBase2 + c) % kMod2;
      }
      return {h1, h2};
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      set<pair<unsigned long long, unsigned long long>> seen;
      for (int i = 0; i < n; ++i) {
          string text;
          cin >> text;
          seen.insert(hash_of(text));
      }
      cout << seen.size() << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3370
external_platform: 洛谷
external_problem_id: P3370
external_title: '【模板】字串雜湊'
external_relation: original
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

雜湊是用極小的碰撞機率換取極大的便利。記住雙模數這個習慣，能擋掉大部分針對性的卡雜湊測資。
