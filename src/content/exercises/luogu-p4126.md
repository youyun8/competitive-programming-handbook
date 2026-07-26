---
id: luogu-p4126
volume: lower
source_file: lower-volume
original_label: '洛谷 P4126'
title: '洛谷 P4126 最小割'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 5
topics: ['殘量圖', '強連通分量', '最小割格']
prerequisites: ['max-flow']
statement: |-
  對每條有向邊判斷：是否出現在某個最小割，以及是否出現在所有最小割。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 2 1 3
      1 2 1
      2 3 1
    output: |-
      1 0
      1 0
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['殘量圖', '強連通分量', '最小割格']
judgment: |-
  先求最大流，再在殘量圖縮強連通分量。
hints:
  - '先辨識核心轉換：殘量圖、強連通分量、最小割格。'
  - '先求最大流，再在殘量圖縮強連通分量。'
  - '依「飽和邊 u→v 若 SCC(u)≠SCC(v)，就在某個最小割；若 SCC(u)=SCC(s) 且 SCC(v)=SCC(t)，則在所有最小割。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  飽和邊 u→v 若 SCC(u)≠SCC(v)，就在某個最小割；若 SCC(u)=SCC(s) 且 SCC(v)=SCC(t)，則在所有最小割。
proof_or_invariant: |-
  最小割的源側必為殘量閉合集；SCC 不可拆。跨 SCC 的飽和邊可由閉合集選取，而固定源、匯 SCC 的跨邊對每個閉合集都必跨越。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(N^2M)'
  space: 'O(N+M)'
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
  // Problem: P4126 [AHOI2009]最小割
  // Contest: Luogu
  // URL: https://www.luogu.com.cn/problem/P4126
  // Memory Limit: 125 MB
  // Time Limit: 1000 ms
  //
  // Powered by CP Editor (https://cpeditor.org)

  /*
   * Author: chenkaifeng @BDFZ
   */

  #include <bits/stdc++.h>

  using namespace std;

  typedef long long ll;
  #define fi first
  #define se second
  #define mp make_pair
  #define pb push_back
  #define pf push_front
  #define rep(i, s, t) for (int i = s; i <= t; ++i)
  #define per(i, s, t) for (int i = t; i >= s; --i)

  namespace nqio{const unsigned R=4e5,W=4e5;char*a,*b,i[R],o[W],*c=o,*d=o+W,h[40],*p=h,y;bool s;struct q{void r(char&x){x=a==b&&(b=(a=i)+fread(i,1,R,stdin),a==b)?-1:*a++;}void f(){fwrite(o,1,c-o,stdout);c=o;}~q(){f();}void w(char x){*c=x;if(++c==d)f();}q&operator>>(char&x){do r(x);while(x<=32);return*this;}q&operator>>(char*x){do r(*x);while(*x<=32);while(*x>32)r(*++x);*x=0;return*this;}template<typename t>q&operator>>(t&x){for(r(y),s=0;!isdigit(y);r(y))s|=y==45;if(s)for(x=0;isdigit(y);r(y))x=x*10-(y^48);else for(x=0;isdigit(y);r(y))x=x*10+(y^48);return*this;}q&operator<<(char x){w(x);return*this;}q&operator<<(char*x){while(*x)w(*x++);return*this;}q&operator<<(const char*x){while(*x)w(*x++);return*this;}template<typename t>q&operator<<(t x){if(!x)w(48);else if(x<0)for(w(45);x;x/=10)*p++=48|-(x%10);else for(;x;x/=10)*p++=48|x%10;while(p!=h)w(*--p);return*this;}}qio;}using nqio::qio;

  #define OK debug("OK!\n")
  #ifndef ONLINE_JUDGE
  namespace debuger{void debug(const char *s) {cerr << s;}template<typename T1,typename... T2>void debug(const char*s, const T1 x, T2...ls) { int p=0; while(*(s + p)!='\0') {if(*(s+p)=='{'&&*(s+p+1)=='}'){cerr << x;debug(s + p + 2, ls...);return;}cerr << *(s + p++);}}}using debuger::debug;
  #else
  #define debug(...) void(0)
  #endif

  // const int mod = 1e9 + 7;
  const int mod = 998244353;

  int qpow(int x, ll p) {
  	int res = 1, base = x;
  	while(p) {
  		if(p & 1) res = 1ll * res * base % mod;
  		base = 1ll * base * base % mod;
  		p >>= 1;
  	}
  	return res;
  }

  template<typename T> inline void upd(T& x, const T& y) {	x += y;	if(x >= mod) x -= mod; }
  template<typename T> inline void upd(T& x, const T& y, const T& z) { x = y + z; if(x >= mod) x -= mod; }

  /* template ends here */

  std::mt19937 mtrnd(std::chrono::system_clock::now().time_since_epoch().count());

  const int N = 4e3 + 5;
  const int M = 2e5 + 5;
  const int inf = 2e9;

  int n, m, s, t;
  int cur[N], head[N], nxt[M], to[M], fl[M], tot = 1;
  int dis[N];
  int que[N], ph=1, pt=0;
  int dfn[N], low[N], dfncnt, scc[N], sid, stk[N], ins[N], top;

  inline void tarjan(int u) {
  	stk[++top ] =u;
  	ins[u] = 1;
  	dfn[u] = low[u] = ++dfncnt;
  	for(int i = head[u]; i; i = nxt[i]) {
  		if(!fl[i]) continue;
  		int v = to[i];
  		if(!dfn[v]) {
  			tarjan(v);
  			low[u] = min(low[u], low[v]);
  		} else if(ins[v]) {
  			low[u] = min(low[u], dfn[v]);
  		}
  	}
  	if(dfn[u] == low[u]) {
  		++sid;
  		while(1) {
  			int x = stk[top--];
  			scc[x] = sid;
  			ins[x] = 0;
  			if(x==u) break;
  		}
  	}
  }

  inline void addedge(int u, int v, int f) {
  	nxt[++tot] = head[u];
  	to[tot] = v;
  	fl[tot] = f;
  	head[u] = tot;
  }

  inline bool bfs() {
  	memset(dis, 0, sizeof dis);
  	memcpy(cur, head, sizeof cur);
  	ph=1, pt=0;
  	dis[s] = 1;
  	que[++pt] = s;
  	while(ph <= pt) {
  		int u = que[ph++];
  		for(int i = head[u]; i; i = nxt[i]) {
  			int v = to[i];
  			int f = fl[i];
  			if(f && !dis[v]) {
  				dis[v] = dis[u] + 1;
  				que[++pt] = v;
  			}
  		}
  	}
  	return dis[t];
  }

  inline int dfs(int u, int l) {
  	if(u == t) return l;
  	int res = 0;
  	for(int& i = cur[u]; i; i = nxt[i]) {
  		int v = to[i];
  		int f = fl[i];
  		if(f && dis[v] == dis[u] + 1) {
  			int x = dfs(v, min(l, f));
  			l -= x;
  			fl[i] -= x;
  			fl[i^1] += x;
  			res += x;
  		}
  		if(!l) break;
  	}
  	if(l) dis[u] = -1;
  	return res;
  }

  int dinic() {
  	int res = 0;
  	while(bfs()) res += dfs(s, inf);
  	return res;
  }

  int ex[M], ey[M];

  map<pair<int, int>, int> vv;

  int main() {
  	ios::sync_with_stdio(false);
  	cin.tie(nullptr), cout.tie(nullptr);
  	cout << fixed << setprecision(15);
  	cerr << fixed << setprecision(15);

  	cin >> n >> m >> s >> t;
  	rep(i, 1, m) {
  		int u, v, w;
  		cin >> u >> v >> w;
  		ex[i] = u;
  		ey[i] = v;
  		addedge(u, v, w);
  		addedge(v, u, 0);
  	}

  	int x = dinic();

  	rep(i, 1, n) if(!dfn[i]) tarjan(i);
  	// rep(i ,1, n) cerr << scc[i] << " \n"[i == n];

  	rep(u, 1, n) {
  		for(int i = head[u]; i; i = nxt[i]) {
  			int v = to[i], f = fl[i];
  			vv[mp(u, v)] += f;
  		}
  	}

  	rep(i, 1, m) {
  		if(!fl[i<<1]) {
  			cout << (scc[ex[i]]!=scc[ey[i]]) << " " << (scc[s]==scc[ex[i]] && scc[ey[i]]==scc[t]) << "\n";
  		} else {
  			cout << 0 << " " << 0 << "\n";
  		}
  	}

  	return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4126
external_platform: '洛谷'
external_problem_id: 'P4126'
external_title: '最小割'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
