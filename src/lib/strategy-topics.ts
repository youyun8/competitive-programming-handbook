// 策略圖鑑主題註冊表。
//
// 內容原始檔是 src/content/strategies/<topic>/<fragment>.html，本檔案只描述
// 「哪些片段、以什麼順序、用什麼標題」組成一個主題。新增章節時，在對應主題的
// pages 陣列插入一筆並放進同名片段檔即可，路由與側欄導覽會自動更新。

export type StrategyPageGroup = 'strategies';

export interface StrategyPage {
  /** 主題內唯一的頁面 id，供 anchors 交叉引用使用。 */
  id: string;
  /** 路由片段；主題首頁為 null。 */
  slug: string | null;
  title: string;
  /** 側欄與上一節／下一節使用的短標題；主題首頁沒有。 */
  nav?: string;
  desc?: string;
  /** src/content/strategies/<topic>/ 底下的檔名（不含副檔名）。 */
  fragment?: string;
  group?: StrategyPageGroup;
}

export interface StrategyTopic {
  id: string;
  icon: string;
  short: string;
  name: string;
  tagline: string;
  homeDescription: string;
  /** 內文 href="#s2-1" 這類錨點 → 頁面 id（可帶 #fragment）。 */
  anchors: Record<string, string>;
  pages: StrategyPage[];
}

export const strategyTopics: StrategyTopic[] = [
  {
    id: 'greedy',
    icon: '🧭',
    short: '貪心',
    name: '貪心演算法',
    tagline: '從排序貪心到擬陣與模擬費用流的完整策略分類',
    homeDescription: '從入門到程式競賽專家的貪心演算法策略分類與題目整理',
    anchors: {
      s1: 'theory',
      's2-11': 's11',
      s3: 'pitfalls',
      s4: 'proofs',
      's4-3': 'proofs#s4-3',
      s6: 'roadmap'
    },
    pages: [
      {
        id: 'index',
        slug: null,
        title: '首頁'
      },
      {
        id: 'theory',
        slug: 'theory',
        title: '理論基礎：什麼時候貪心是對的',
        nav: '1. 理論基礎',
        desc: '貪心選擇性質、最優子結構、四大證明技巧與反例構造的系統方法',
        fragment: 's1-theory'
      },
      {
        id: 's01',
        slug: '01-sorting',
        title: '2.1 排序貪心（Sort & Sweep）',
        nav: '2.1 排序貪心',
        desc: '找到正確排序鍵，排序後線性掃描，決策就變得顯然',
        fragment: 's2-1',
        group: 'strategies'
      },
      {
        id: 's02',
        slug: '02-intervals',
        title: '2.2 區間問題全家桶（Interval Scheduling Family）',
        nav: '2.2 區間問題全家桶',
        desc: '活動選擇、區間覆蓋、區間分組——左右端點排序的完整對照',
        fragment: 's2-2',
        group: 'strategies'
      },
      {
        id: 's03',
        slug: '03-exchange-scheduling',
        title: '2.3 交換論證排程（Scheduling by Exchange Argument）',
        nav: '2.3 交換論證排程',
        desc: "Smith's Rule、Johnson's Rule 與交換論證+DP 的組合套路",
        fragment: 's2-3',
        group: 'strategies'
      },
      {
        id: 's04',
        slug: '04-regret',
        title: '2.4 反悔貪心（Regret Greedy）',
        nav: '2.4 反悔貪心',
        desc: '先貪心接受，再用堆撤銷最差決策的萬用框架',
        fragment: 's2-4',
        group: 'strategies'
      },
      {
        id: 's05',
        slug: '05-heap',
        title: '2.5 堆積貪心（Priority-Queue Greedy）',
        nav: '2.5 堆積貪心',
        desc: 'Huffman 編碼、對頂堆與多路歸併',
        fragment: 's2-5',
        group: 'strategies'
      },
      {
        id: 's06',
        slug: '06-lexicographic',
        title: '2.6 字典序貪心與單調堆疊構造',
        nav: '2.6 字典序貪心',
        desc: '逐位確定最小/最大字元，搭配可行性檢查與單調棧實作',
        fragment: 's2-6',
        group: 'strategies'
      },
      {
        id: 's07',
        slug: '07-math',
        title: '2.7 數學貪心與調整法',
        nav: '2.7 數學貪心與調整法',
        desc: '中位數、排序不等式、均值不等式與 canonical 硬幣系統',
        fragment: 's2-7',
        group: 'strategies'
      },
      {
        id: 's08',
        slug: '08-graph',
        title: '2.8 圖上貪心',
        nav: '2.8 圖上貪心',
        desc: 'MST 的 Cut/Cycle Property、Dijkstra 正確性邊界、Boruvka',
        fragment: 's2-8',
        group: 'strategies'
      },
      {
        id: 's09',
        slug: '09-data-structures',
        title: '2.9 貪心 × 資料結構',
        nav: '2.9 貪心 × 資料結構',
        desc: '並查集找空位、線段樹/BIT 加速貪心決策',
        fragment: 's2-9',
        group: 'strategies'
      },
      {
        id: 's10',
        slug: '10-binary-search',
        title: '2.10 貪心 × 二分答案（參數化貪心）',
        nav: '2.10 貪心 × 二分答案',
        desc: '最大化最小值 → 二分答案 + 貪心可行性驗證',
        fragment: 's2-10',
        group: 'strategies'
      },
      {
        id: 's11',
        slug: '11-expert',
        title: '2.11 專家專題',
        nav: '2.11 專家專題',
        desc: '擬陣與 Rado–Edmonds 定理、slope trick、模擬費用流',
        fragment: 's2-11',
        group: 'strategies'
      },
      {
        id: 'pitfalls',
        slug: 'pitfalls',
        title: '經典「假貪心」陷阱',
        nav: '3. 經典「假貪心」陷阱',
        desc: '五個貪心失效的反例，以及為什麼失敗、正確解法指向',
        fragment: 's3-pitfalls'
      },
      {
        id: 'proofs',
        slug: 'proofs',
        title: '證明方法實戰模板',
        nav: '4. 證明方法實戰模板',
        desc: '交換論證五步驟、領先論證模板，以及對拍驗證器範例碼',
        fragment: 's4-proofs'
      },
      {
        id: 'roadmap',
        slug: 'roadmap',
        title: '學習路線圖',
        nav: '6. 學習路線圖',
        desc: '四階段學習計畫，每階段附代表題與畢業檢定',
        fragment: 's6-roadmap'
      }
    ]
  },
  {
    id: 'dp',
    icon: '📈',
    short: 'DP',
    name: '動態規劃',
    tagline: '13 大策略分類、狀態設計方法論與 DP 優化技術全解',
    homeDescription: '從入門到程式競賽專家的動態規劃策略分類與題目整理',
    anchors: {
      s1: 'theory',
      's2-1': 's01',
      's2-2': 's02',
      's2-3': 's03',
      's2-4': 's04',
      's2-5': 's05',
      's2-6': 's06',
      's2-7': 's07',
      's2-8': 's08',
      's2-9': 's09',
      's2-10': 's10',
      's2-11': 's11',
      's2-12': 's12',
      's2-13': 's13',
      s3: 'pitfalls',
      s4: 'method',
      s6: 'roadmap'
    },
    pages: [
      {
        id: 'index',
        slug: null,
        title: '首頁'
      },
      {
        id: 'theory',
        slug: 'theory',
        title: '理論基礎：DP 思考框架',
        nav: '1. 理論基礎',
        desc: '三大前提、解題六步驟、記憶化 vs 遞推、複雜度反推狀態設計',
        fragment: 's1-theory'
      },
      {
        id: 's01',
        slug: '01-linear',
        title: '2.1 線性 DP（入門三件套與 LIS 家族）',
        nav: '2.1 線性 DP',
        desc: '「前 i 個」與「以 i 結尾」兩種視角，從爬樓梯到 LIS 二維偏序',
        fragment: 's2-1',
        group: 'strategies'
      },
      {
        id: 's02',
        slug: '02-grid',
        title: '2.2 網格與座標 DP',
        nav: '2.2 網格與座標 DP',
        desc: '路徑計數、倒推設計（地下城）與雙路徑同步（方格取數）',
        fragment: 's2-2',
        group: 'strategies'
      },
      {
        id: 's03',
        slug: '03-knapsack',
        title: '2.3 背包全家桶（背包九講精華）',
        nav: '2.3 背包全家桶',
        desc: '0/1、完全、多重、分組、依賴、二維費用、計數與退背包',
        fragment: 's2-3',
        group: 'strategies'
      },
      {
        id: 's04',
        slug: '04-interval',
        title: '2.4 區間 DP',
        nav: '2.4 區間 DP',
        desc: '石子合併、迴文、戳氣球的「枚舉最後一步」與狀態加維',
        fragment: 's2-4',
        group: 'strategies'
      },
      {
        id: 's05',
        slug: '05-two-sequences',
        title: '2.5 雙序列 DP',
        nav: '2.5 雙序列 DP',
        desc: 'LCS、編輯距離、子序列計數與萬用字元/正則匹配',
        fragment: 's2-5',
        group: 'strategies'
      },
      {
        id: 's06',
        slug: '06-state-machine',
        title: '2.6 狀態機 DP',
        nav: '2.6 狀態機 DP',
        desc: '股票系列全解、KMP 自動機上的計數與矩陣冪',
        fragment: 's2-6',
        group: 'strategies'
      },
      {
        id: 's07',
        slug: '07-bitmask',
        title: '2.7 位元狀壓 DP',
        nav: '2.7 位元狀壓 DP',
        desc: '集合推進型與行輪廓型：TSP、配對計數、棋盤放置',
        fragment: 's2-7',
        group: 'strategies'
      },
      {
        id: 's08',
        slug: '08-tree',
        title: '2.8 樹上 DP',
        nav: '2.8 樹上 DP',
        desc: '樹上獨立集、樹上背包、換根 DP 與覆蓋三態',
        fragment: 's2-8',
        group: 'strategies'
      },
      {
        id: 's09',
        slug: '09-digit',
        title: '2.9 數位 DP',
        nav: '2.9 數位 DP',
        desc: 'tight/lead 兩面旗的統一模板，windy 數到 mod 2520 壓縮',
        fragment: 's2-9',
        group: 'strategies'
      },
      {
        id: 's10',
        slug: '10-counting-expectation',
        title: '2.10 計數 DP 與期望 DP',
        nav: '2.10 計數與期望 DP',
        desc: '不重不漏的計數、逆推期望、對稱性壓縮與二次期望',
        fragment: 's2-10',
        group: 'strategies'
      },
      {
        id: 's11',
        slug: '11-graph-game',
        title: '2.11 圖上 DP 與博弈 DP',
        nav: '2.11 圖上與博弈 DP',
        desc: 'DAG 拓撲序、SCC 縮點、分層圖與 minimax 差值博弈',
        fragment: 's2-11',
        group: 'strategies'
      },
      {
        id: 's12',
        slug: '12-optimization',
        title: '2.12 DP 優化技術（競賽分水嶺）',
        nav: '2.12 DP 優化技術',
        desc: '前綴和、單調佇列、斜率優化、Knuth、分治、wqs 二分、矩陣冪、bitset',
        fragment: 's2-12',
        group: 'strategies'
      },
      {
        id: 's13',
        slug: '13-expert',
        title: '2.13 專家專題',
        nav: '2.13 專家專題',
        desc: '輪廓線/插頭 DP、SOS、連通塊插入、動態 DP、DP 套 DP',
        fragment: 's2-13',
        group: 'strategies'
      },
      {
        id: 'pitfalls',
        slug: 'pitfalls',
        title: '常見錯誤與除錯（假 DP 教材）',
        nav: '3. 常見錯誤與除錯',
        desc: '後效性、背包方向、恰好裝滿、狀態不完整——高頻坑與修法',
        fragment: 's3-pitfalls'
      },
      {
        id: 'method',
        slug: 'method',
        title: '狀態設計實戰方法論',
        nav: '4. 狀態設計方法論',
        desc: '從暴力遞迴機械化推導 DP、四視角、降維清單與對拍驗證器',
        fragment: 's4-method'
      },
      {
        id: 'roadmap',
        slug: 'roadmap',
        title: '學習路線圖',
        nav: '6. 學習路線圖',
        desc: '四階段學習計畫，每階段附代表題與畢業檢定',
        fragment: 's6-roadmap'
      }
    ]
  },
  {
    id: 'strings',
    icon: '🔤',
    short: '字串',
    name: '字串演算法',
    tagline: '從雜湊與 KMP 到後綴自動機的完整策略分類',
    homeDescription: '從入門到程式競賽專家的字串演算法策略分類與題目整理',
    anchors: {
      s1: 'theory',
      's2-1': 's01',
      's2-2': 's02',
      's2-3': 's03',
      's2-4': 's04',
      's2-5': 's05',
      's2-6': 's06',
      's2-7': 's07',
      's2-8': 's08',
      's2-9': 's09',
      's2-10': 's10',
      's2-11': 's11',
      s3: 'pitfalls',
      s4: 'method',
      s6: 'roadmap'
    },
    pages: [
      {
        id: 'index',
        slug: null,
        title: '首頁'
      },
      {
        id: 'theory',
        slug: 'theory',
        title: '理論基礎：字串的共同語言',
        nav: '1. 理論基礎',
        desc: 'border 與週期的核心等式、三種匹配思維、複雜度反推與實作工具箱',
        fragment: 's1-theory'
      },
      {
        id: 's01',
        slug: '01-hashing',
        title: '2.1 字串雜湊（Polynomial Hashing）',
        nav: '2.1 字串雜湊',
        desc: 'O(1) 子串比較、防卡雙模數、hash+二分求 LCP',
        fragment: 's2-1',
        group: 'strategies'
      },
      {
        id: 's02',
        slug: '02-kmp',
        title: '2.2 KMP、失配函數與週期',
        nav: '2.2 KMP 與週期',
        desc: 'fail 鏈 = 所有 border、最小週期 n−fail[n]、KMP 自動機',
        fragment: 's2-2',
        group: 'strategies'
      },
      {
        id: 's03',
        slug: '03-z-function',
        title: '2.3 Z 函數（擴展 KMP）',
        nav: '2.3 Z 函數',
        desc: 'Z-box 線性構造、exkmp、Z 與 fail 的方向對照',
        fragment: 's2-3',
        group: 'strategies'
      },
      {
        id: 's04',
        slug: '04-manacher',
        title: '2.4 Manacher（線性迴文半徑）',
        nav: '2.4 Manacher',
        desc: '插 # 統一奇偶、鏡像繼承、迴文計數與拼接應用',
        fragment: 's2-4',
        group: 'strategies'
      },
      {
        id: 's05',
        slug: '05-trie',
        title: '2.5 Trie 與 01-Trie',
        nav: '2.5 Trie 與 01-Trie',
        desc: '前綴樹、逐位貪心求最大 XOR、樹上路徑 XOR 轉化',
        fragment: 's2-5',
        group: 'strategies'
      },
      {
        id: 's06',
        slug: '06-aho-corasick',
        title: '2.6 AC 自動機（多模式匹配）',
        nav: '2.6 AC 自動機',
        desc: 'Trie 圖、fail 樹子樹和、自動機上 DP',
        fragment: 's2-6',
        group: 'strategies'
      },
      {
        id: 's07',
        slug: '07-suffix-array',
        title: '2.7 後綴數組（Suffix Array）',
        nav: '2.7 後綴數組',
        desc: '倍增構造、height 陣列與 LCP Lemma、去重與分組應用',
        fragment: 's2-7',
        group: 'strategies'
      },
      {
        id: 's08',
        slug: '08-sam',
        title: '2.8 後綴自動機（SAM）',
        nav: '2.8 後綴自動機',
        desc: 'endpos 等價類、parent 樹、線上構造與應用地圖',
        fragment: 's2-8',
        group: 'strategies'
      },
      {
        id: 's09',
        slug: '09-pam',
        title: '2.9 迴文自動機（PAM／迴文樹）',
        nav: '2.9 迴文自動機',
        desc: '本質不同迴文至多 n 個、雙根增量構造、出現次數統計',
        fragment: 's2-9',
        group: 'strategies'
      },
      {
        id: 's10',
        slug: '10-lyndon',
        title: '2.10 最小表示法與 Lyndon 分解',
        nav: '2.10 最小表示與 Lyndon',
        desc: '雙指標批量淘汰、Duval 演算法、最小後綴',
        fragment: 's2-10',
        group: 'strategies'
      },
      {
        id: 's11',
        slug: '11-expert',
        title: '2.11 專家專題',
        nav: '2.11 專家專題',
        desc: '失配樹、廣義 SAM、SAM×線段樹合併、border 理論、位平行',
        fragment: 's2-11',
        group: 'strategies'
      },
      {
        id: 'pitfalls',
        slug: 'pitfalls',
        title: '常見錯誤與陷阱',
        nav: '3. 常見錯誤與陷阱',
        desc: 'hash 被卡全家桶、下標制混用、統計順序、多測清空——高頻坑與修法',
        fragment: 's3-pitfalls'
      },
      {
        id: 'method',
        slug: 'method',
        title: '模板整理與選型方法論',
        nav: '4. 模板整理與選型',
        desc: '選型決策樹、一題三解對照、模板風格約定與對拍驗證器',
        fragment: 's4-method'
      },
      {
        id: 'roadmap',
        slug: 'roadmap',
        title: '學習路線圖',
        nav: '6. 學習路線圖',
        desc: '四階段學習計畫，每階段附代表題與畢業檢定',
        fragment: 's6-roadmap'
      }
    ]
  },
  {
    id: 'ds',
    icon: '🧱',
    short: '資結',
    name: '競賽資料結構',
    tagline: '從前綴和與 BIT 到吉司機線段樹與 LCT 的完整策略分類',
    homeDescription: '從入門到程式競賽專家的競賽資料結構策略分類與題目整理',
    anchors: {
      s1: 'theory',
      's2-1': 's01',
      's2-2': 's02',
      's2-3': 's03',
      's2-4': 's04',
      's2-5': 's05',
      's2-6': 's06',
      's2-7': 's07',
      's2-8': 's08',
      's2-9': 's09',
      's2-10': 's10',
      's2-11': 's11',
      's2-12': 's12',
      's2-13': 's13',
      s3: 'pitfalls',
      s4: 'method',
      s6: 'roadmap'
    },
    pages: [
      {
        id: 'index',
        slug: null,
        title: '首頁'
      },
      {
        id: 'theory',
        slug: 'theory',
        title: '理論基礎：維護增量的思考框架',
        nav: '1. 理論基礎',
        desc: '操作分析法、可合併性、均攤與勢能、離線 vs 線上、複雜度預算',
        fragment: 's1-theory'
      },
      {
        id: 's01',
        slug: '01-prefix-sums',
        title: '2.1 前綴和、差分與 ST 表（靜態的力量）',
        nav: '2.1 前綴和・差分・ST 表',
        desc: '預處理換查詢：一維/二維前綴和、差分打點、可重複貢獻 RMQ',
        fragment: 's2-1',
        group: 'strategies'
      },
      {
        id: 's02',
        slug: '02-monotonic',
        title: '2.2 單調堆疊與單調佇列',
        nav: '2.2 單調堆疊與單調佇列',
        desc: '維護有用候選人：下一個更大元素、滑窗最值、均攤 O(n)',
        fragment: 's2-2',
        group: 'strategies'
      },
      {
        id: 's03',
        slug: '03-heap',
        title: '2.3 堆、對頂堆與可刪堆',
        nav: '2.3 堆與對頂堆',
        desc: '動態中位數、懶惰刪除、multiset 的替代範圍',
        fragment: 's2-3',
        group: 'strategies'
      },
      {
        id: 's04',
        slug: '04-dsu',
        title: '2.4 並查集（DSU）',
        nav: '2.4 並查集',
        desc: '等價類維護：種類/帶權 DSU、離線倒序、可撤銷預告',
        fragment: 's2-4',
        group: 'strategies'
      },
      {
        id: 's05',
        slug: '05-bit',
        title: '2.5 樹狀數組（BIT / Fenwick Tree）',
        nav: '2.5 樹狀數組 BIT',
        desc: 'lowbit 切前綴：逆序對、雙 BIT 區間和、BIT 上倍增求第 k 小',
        fragment: 's2-5',
        group: 'strategies'
      },
      {
        id: 's06',
        slug: '06-segment-tree',
        title: '2.6 線段樹基礎（build／懶標記／資訊設計）',
        nav: '2.6 線段樹基礎',
        desc: '懶標記三函式分工、先乘後加、最大子段和四元組',
        fragment: 's2-6',
        group: 'strategies'
      },
      {
        id: 's07',
        slug: '07-segment-tree-advanced',
        title: '2.7 線段樹進階（權值／動態開點／合併／二分／李超）',
        nav: '2.7 線段樹進階',
        desc: '值域當下標、用到才開點、樹上二分與線段樹合併、李超樹',
        fragment: 's2-7',
        group: 'strategies'
      },
      {
        id: 's08',
        slug: '08-sweepline-cdq',
        title: '2.8 掃描線、二維數點與離線分治（CDQ／整體二分）',
        nav: '2.8 掃描線與離線分治',
        desc: '把一個維度變成時間：矩形面積並、三維偏序、整體二分',
        fragment: 's2-8',
        group: 'strategies'
      },
      {
        id: 's09',
        slug: '09-balanced-bst',
        title: '2.9 平衡樹（FHQ Treap／Splay）',
        nav: '2.9 平衡樹',
        desc: 'split/merge 兩原語打天下：名次、區間翻轉、整體偏移',
        fragment: 's2-9',
        group: 'strategies'
      },
      {
        id: 's10',
        slug: '10-sqrt',
        title: '2.10 分塊與莫隊（根號演算法）',
        nav: '2.10 分塊與莫隊',
        desc: '不可合併資訊的救生圈：整塊標記散塊暴力、詢問重排',
        fragment: 's2-10',
        group: 'strategies'
      },
      {
        id: 's11',
        slug: '11-tree',
        title: '2.11 樹上資料結構（LCA／樹上差分／樹剖／DSU on tree）',
        nav: '2.11 樹上資料結構',
        desc: '把樹線性化：DFS 序、歐拉序、重鏈剖分序與樹上差分',
        fragment: 's2-11',
        group: 'strategies'
      },
      {
        id: 's12',
        slug: '12-persistent',
        title: '2.12 可持久化資料結構',
        nav: '2.12 可持久化',
        desc: '版本共享 O(log n)：主席樹區間第 k 小、可持久化 01-Trie',
        fragment: 's2-12',
        group: 'strategies'
      },
      {
        id: 's13',
        slug: '13-expert',
        title: '2.13 專家專題',
        nav: '2.13 專家專題',
        desc: '吉司機線段樹、線段樹分治、LCT、ODT、回滾莫隊、樹套樹',
        fragment: 's2-13',
        group: 'strategies'
      },
      {
        id: 'pitfalls',
        slug: 'pitfalls',
        title: '常見錯誤與陷阱',
        nav: '3. 常見錯誤與陷阱',
        desc: '線段樹 4n、標記複合順序、離散化漏值、莫隊指標順序——高頻坑與修法',
        fragment: 's3-pitfalls'
      },
      {
        id: 'method',
        slug: 'method',
        title: '選型方法論與離線思維',
        nav: '4. 選型方法論',
        desc: '操作規格書、選型決策表、五種離線重排與對拍驗證器',
        fragment: 's4-method'
      },
      {
        id: 'roadmap',
        slug: 'roadmap',
        title: '學習路線圖',
        nav: '6. 學習路線圖',
        desc: '四階段學習計畫，每階段附代表題與畢業檢定',
        fragment: 's6-roadmap'
      }
    ]
  }
];
