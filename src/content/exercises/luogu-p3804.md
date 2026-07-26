---
id: luogu-p3804
volume: lower
source_file: lower-volume
title: 洛谷 P3804 後綴自動機：出現多次的子串最大長度乘積
chapter: 9
section: '9.8'
kind: external-oj
difficulty: 5
topics: ['後綴自動機', 'SAM', 'link 樹', '子串統計']
prerequisites: ['suffix-automaton', 'suffix-array']
statement: |-
  給定字串 s，在所有出現次數大於 1 的子串中，求「長度 × 出現次數」的最大值。
constraints:
  - '1 <= |S| <= 10^6'
  - 'S 只含小寫英文字母；答案需用 64 位整數'
input_format: '一行一個由小寫字母組成的字串。'
output_format: '一行一個整數，表示最大的「長度 × 出現次數」。'
samples:
  - input: |
      abab
    output: |
      4
    explanation: |-
      這是本站依官方規格建立的最小檢查例：ab 出現 2 次，2×2=4；a 出現 2 次得 2；aba 只出現 1 次不計。另以枚舉短字串全部子串的暴力程式交叉驗證。
core_knowledge:
  - SAM 狀態代表相同 endpos 的子串區間
  - 原生狀態計數一而 clone 計數零
  - 按最大長度逆序沿 suffix link 累加出現次數
judgment: 只考慮出現超過一次的連續子串，輸出長度乘出現次數的最大值，答案使用 64 位整數。
hints:
  - 每個 SAM 狀態代表一組 endpos 相同、長度位於一段連續區間的子串。
  - 每次加入字元的新狀態先記一次出現，clone 不代表新結尾所以記零；建完逆序累加到 suffix link。
  - 同狀態出現次數相同，選其最大長度最優；只對 count>1 計算 length*count。
solution_outline: |-
  線上建構 SAM：每次擴展一個字元，必要時分裂節點（clone 繼承轉移與 link，length 改成 len[p]+1，計數設 0）。建完後依 length 計數排序得到 link 樹的由深到淺順序，把出現次數逐層累加給 link。掃過所有狀態，取出現次數大於 1 者的 len × 次數最大值。
proof_or_invariant: |-
  SAM 的核心性質是「同一狀態內的子串 endpos 集合相同，且長度構成連續區間」。link 樹上父節點的 endpos 是子節點 endpos 的超集，因此由深到淺累加恰好求出每個狀態的 endpos 大小。分裂操作保持該性質：clone 承接較短的那段長度區間，原節點保留較長的一段。
common_errors:
  - clone 的初始出現次數設成一
  - 沿長度遞增順序累加 suffix link
  - 乘法先用 int 計算造成溢位
complexity:
  time: 'O(n log Σ)（用 map 存轉移）'
  space: 'O(n log Σ)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 後綴自動機：每個狀態代表一組「結束位置集合相同」的子串。
  struct SuffixAutomaton {
      struct State {
          int length = 0;
          int link = -1;
          map<char, int> next;
      };
      vector<State> states{State{}};
      vector<long long> occurrences{0};
      int last = 0;

      // TODO 1：線上擴展一個字元。
      //   1. 新建狀態 current，length = len[last] + 1，出現次數設為 1
      //      （它代表一個真實出現過的前綴）。
      //   2. 從 last 沿 link 往上，凡是沒有 c 轉移的都指向 current。
      //   3. 若一路走到 -1，link[current] = 根。
      //      否則設 q 為該轉移的目標：
      //        若 len[p] + 1 == len[q]，直接 link[current] = q；
      //        否則要「分裂」——複製 q 成 clone（繼承轉移與 link，
      //        但 length 改成 len[p] + 1、出現次數設為 0），
      //        把指向 q 的那些轉移改指向 clone，再讓 q 與 current 的 link 都指向 clone。
      //   分裂是 SAM 最容易寫錯的一步：clone 是「虛擬」節點，
      //   不對應任何一次真實出現，所以出現次數必須是 0。
      void extend(char c) { (void)c; }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      if (!(cin >> text)) { return 0; }
      SuffixAutomaton automaton;
      for (const char c : text) { automaton.extend(c); }

      // TODO 2：把出現次數沿 link 樹由深到淺累加。
      //   一個狀態的出現次數 = 它在 link 樹子樹中所有原生節點的數量。
      //   排序技巧：依 length 做計數排序即可得到「由深到淺」的順序，
      //   不必真的建樹再 DFS。
      // TODO 3：答案取所有「出現次數 > 1」的狀態中 length × occurrences 的最大值。
      //   注意用 long long，長度乘次數會超過 32 位元。
      long long answer = 0;
      cout << answer << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 後綴自動機（SAM）：每個狀態代表一組「結束位置集合相同」的子串，
  // 長度落在 (len[link], len[state]] 這個區間。
  // 一個狀態的出現次數 = 它在 link 樹（後綴連結樹）子樹中的複製節點數量。
  struct SuffixAutomaton {
      struct State {
          int length = 0;
          int link = -1;
          map<char, int> next;
      };
      vector<State> states{State{}};
      vector<long long> occurrences{0};
      int last = 0;

      void extend(char c) {
          const int current = static_cast<int>(states.size());
          states.push_back(State{});
          occurrences.push_back(1);  // 原生節點各代表一個前綴，出現次數起始為 1
          states[static_cast<size_t>(current)].length = states[static_cast<size_t>(last)].length + 1;

          int p = last;
          while (p != -1 && states[static_cast<size_t>(p)].next.count(c) == 0) {
              states[static_cast<size_t>(p)].next[c] = current;
              p = states[static_cast<size_t>(p)].link;
          }
          if (p == -1) {
              states[static_cast<size_t>(current)].link = 0;
          } else {
              const int q = states[static_cast<size_t>(p)].next[c];
              if (states[static_cast<size_t>(p)].length + 1 == states[static_cast<size_t>(q)].length) {
                  states[static_cast<size_t>(current)].link = q;
              } else {
                  // 分裂出一個複製節點，它只繼承轉移與連結，出現次數為 0。
                  const int clone = static_cast<int>(states.size());
                  states.push_back(states[static_cast<size_t>(q)]);
                  occurrences.push_back(0);
                  states[static_cast<size_t>(clone)].length = states[static_cast<size_t>(p)].length + 1;
                  while (p != -1 && states[static_cast<size_t>(p)].next[c] == q) {
                      states[static_cast<size_t>(p)].next[c] = clone;
                      p = states[static_cast<size_t>(p)].link;
                  }
                  states[static_cast<size_t>(q)].link = clone;
                  states[static_cast<size_t>(current)].link = clone;
              }
          }
          last = current;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      if (!(cin >> text)) { return 0; }
      SuffixAutomaton automaton;
      for (const char c : text) { automaton.extend(c); }

      // 依 length 做計數排序，等於 link 樹由深到淺的順序。
      const size_t total = automaton.states.size();
      vector<int> bucket(text.size() + 2, 0);
      for (size_t i = 1; i < total; ++i) {
          ++bucket[static_cast<size_t>(automaton.states[i].length)];
      }
      for (size_t i = 1; i < bucket.size(); ++i) { bucket[i] += bucket[i - 1]; }
      vector<int> order(total - 1);
      for (size_t i = total; i-- > 1;) {
          order[static_cast<size_t>(--bucket[static_cast<size_t>(automaton.states[i].length)])] =
              static_cast<int>(i);
      }

      long long answer = 0;
      for (size_t i = order.size(); i-- > 0;) {
          const int state = order[i];
          const int link = automaton.states[static_cast<size_t>(state)].link;
          if (link >= 0) {
              automaton.occurrences[static_cast<size_t>(link)] +=
                  automaton.occurrences[static_cast<size_t>(state)];
          }
          const long long count = automaton.occurrences[static_cast<size_t>(state)];
          if (count > 1) {
              answer = max(answer, count * automaton.states[static_cast<size_t>(state)].length);
          }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3804
external_platform: 洛谷
external_problem_id: P3804
external_title: '【模板】後綴自動機（SAM）'
external_relation: original
source_book_pages: [599]
source_pdf_pages: [229]
review_status: verified
---

SAM 把「所有子串」壓成 O(n) 個狀態，是字串演算法裡最強的結構之一。分裂與 clone 計數為 0 這兩點務必寫穩。
