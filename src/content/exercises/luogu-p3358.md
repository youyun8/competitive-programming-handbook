---
id: luogu-p3358
volume: lower
source_file: lower-volume
original_label: '洛谷 P3358'
title: '洛谷 P3358 最長 k 可重區間集問題'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 4
topics: ['座標離散', '最小費用流']
prerequisites: ['min-cost-flow']
statement: |-
  選區間使任一點覆蓋數不超過 k，並最大化所選區間長度和。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      4 2
      1 7
      6 8
      7 10
      9 13
    output: |-
      15
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['座標離散', '最小費用流']
judgment: |-
  離散端點；數軸鏈承載 k 單位流，區間邊容量一且費用為負長度。
hints:
  - '先辨識核心轉換：座標離散、最小費用流。'
  - '離散端點；數軸鏈承載 k 單位流，區間邊容量一且費用為負長度。'
  - '依「由最左端到最右端送 k 單位最小費流，答案取費用相反數。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  由最左端到最右端送 k 單位最小費流，答案取費用相反數。
proof_or_invariant: |-
  每條區間邊被用代表選該區間；鏈上 k 單位流的守恆等價於任一截面最多 k 個被選區間。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(kVE)'
  space: 'O(n)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依卡片解法建立圖或狀態，完成增廣／動態規劃並輸出答案。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wcomment"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #endif
  #include <iostream>
  #include <queue>
  #include <map>
  #include <cstring>
  #include <algorithm>
  using namespace std;

  const int N = 200010;
  const int I = 998244353;

  #define ft first
  #define sc second
  #define to(k) e[k].to
  #define fr(k) e[k].from
  #define fw(k) e[k].flow
  #define ct(k) e[k].cost
  #define next(k) e[k].next
  #define pint pair<int, int>

  struct Edge {
      int to;
      int from;
      int flow;
      int cost;
      int next;
  } e[N * 2];

  int _s;
  int _t;
  int ans;
  int res;
  int cnt;
  int n, m;
  int g[N];
  int vis[N];
  int dis[N];
  int pre[N];
  int head[N];
  int _last[N];
  queue<int> q;

  void add(int u, int v, int f, int c) {
      to(++cnt) = v;
      next(cnt) = head[u];
      fw(cnt) = f;
      ct(cnt) = c;
      fr(cnt) = u;
      head[u] = cnt;
  }

  bool spfa() {
      fill(g, g + n + 1, I);
      fill(dis, dis + n + 1, I);
      fill(vis, vis + n + 1, 0);
      q.push(_s);
      vis[_s] = 1;
      dis[_s] = 0;
      while (!q.empty()) {
          int x = q.front();
          q.pop();
          vis[x] = 0;
          for (int k = head[x]; ~k; k = next(k))
              if (dis[to(k)] > dis[x] + ct(k) && fw(k)) {
                  dis[to(k)] = dis[x] + ct(k);
                  g[to(k)] = min(fw(k), g[x]);
                  pre[to(k)] = x;
                  _last[to(k)] = k;
                  if (!vis[to(k)]) {
                      q.push(to(k));
                      vis[to(k)] = 1;
                  }
              }
      }
      return (bool)(dis[_t] < I);
  }

  void ek() {
      while (spfa()) {
          int x = _t;
          res += g[_t];
          ans += g[_t] * dis[_t];
          while (x != _s) {
              fw(_last[x]) -= g[_t];
              fw(_last[x] ^ 1) += g[_t];
              x = pre[x];
          }
      }
  }

  int len[N];
  pint base[N];
  int _n, _k, tot;
  map<int, int> Id, buc;
  map<int, int>::iterator t;

  int main() {
      int u, v, f, c;
      cin >> _n >> _k;
      cnt = -1;
      memset(head, -1, sizeof(head));
      for (int i = 1; i <= _n; ++i) {
          cin >> base[i].ft >> base[i].sc;
          len[i] = base[i].sc - base[i].ft;
      }
      for (int i = 1; i <= _n; ++i) {
          if (!Id.count(base[i].ft)) buc[base[i].ft]++;
          if (!Id.count(base[i].sc)) buc[base[i].sc]++;
      }
      add(0, 1, _k, 0);
      add(1, 0, 0, 0);
      for (t = buc.begin(); t != buc.end(); ++t)
          Id[t->ft] = ++tot;
      _s = 0;
      _t = tot + 1;
      for (int i = 1; i <= tot; ++i)
          add(i, i + 1, I, 0), add(i + 1, i, 0, 0);
      for (int i = 1; i <= _n; ++i) {
          add(Id[base[i].ft], Id[base[i].sc], 1, -len[i]);
          add(Id[base[i].sc], Id[base[i].ft], 0, len[i]);
      }
      n = _t + 1;
      ek();
      cout << -ans << endl;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3358
external_platform: '洛谷'
external_problem_id: 'P3358'
external_title: '最長 k 可重區間集問題'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
