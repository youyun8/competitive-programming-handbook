export interface ChapterExample {
  title: string;
  sourceLabel: string;
  sourceBookPages: number[];
  sourcePdfPages: number[];
  setup: string;
  reasoning: string[];
  takeaway: string;
}

export interface ChapterExercise {
  level: '基礎' | '進階' | '挑戰';
  title: string;
  prompt: string;
  focus: string;
}

export interface ChapterWorkshop {
  overview: string;
  connections: string[];
  examples: ChapterExample[];
  exercises: ChapterExercise[];
}

export const chapterWorkshops: Record<number, ChapterWorkshop> = {
  1: {
    overview:
      '本章的主線不是背容器名稱，而是從操作需求反推資料的排列方式：需要保留相鄰關係時用鏈結，需要依進入順序處理時用佇列，需要反向完成未結工作時用堆疊，需要反覆取得極值時用堆積。',
    connections: [
      '鏈結串列與陣列的差別在於元素位置是否必須連續，以及插入刪除時要搬移資料還是重接關係。',
      'queue、deque、單調佇列與 priority_queue 的共同核心是「下一個被取出的元素由什麼規則決定」。',
      '樹的遍歷、堆積的陣列編號與霍夫曼樹的貪心合併，會在搜尋、圖論與字串章節反覆出現。'
    ],
    examples: [
      {
        title: '循環報數中的刪除成本',
        sourceLabel: '例 1.1',
        sourceBookPages: [2, 4],
        sourcePdfPages: [20, 22],
        setup:
          '有 n 個人圍成一圈，每數到第 m 個人就將他移除，持續到所有人出列。教材以此比較動態鏈結、靜態鏈結與 STL 容器。',
        reasoning: [
          '真正反覆發生的操作是「從目前位置向後走」與「刪除目前節點」，所以資料結構必須讓刪除後能立刻接回下一人。',
          '若用陣列直接 erase，每次可能搬移線性個元素；鏈結表示只需修改相鄰關係，但仍要付出逐步報數的成本。',
          '實作時要把「目前節點」「前驅節點」「刪除後的下一節點」三者語意分開，最後一個節點是必要邊界案例。'
        ],
        takeaway: '先計算每種操作發生幾次，再選容器；「刪除快」不代表整體一定快。'
      },
      {
        title: '滑動窗口的最小值與最大值',
        sourceLabel: '例 1.3',
        sourceBookPages: [10, 12],
        sourcePdfPages: [28, 30],
        setup: '窗口由左向右移動，每一步都要輸出窗口內最小值與最大值。',
        reasoning: [
          '佇列中保存索引而不是只有數值，才能判斷隊首是否已離開窗口。',
          '維護最小值時，從隊尾刪掉不小於新值的索引；它們更舊且更差，以後不可能成為答案。',
          '每個索引最多入隊一次、出隊一次，因此總成本是線性。最大值只需反轉比較方向。'
        ],
        takeaway: '單調佇列的正確性來自「支配關係」：更晚且更優的候選可以淘汰更早且更差的候選。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '括號序列驗證',
        prompt: '判斷一串括號是否正確配對，並回報第一個錯誤位置。',
        focus: 'stack 與不變量'
      },
      {
        level: '基礎',
        title: '循環佇列',
        prompt: '用固定大小陣列實作 push、pop、front、size，處理索引繞回。',
        focus: '空滿判定'
      },
      {
        level: '進階',
        title: '窗口極值',
        prompt: '對每個長度 k 的窗口同時輸出最小值與最大值。',
        focus: '兩個單調 deque'
      },
      {
        level: '挑戰',
        title: '合併木材',
        prompt: '每次合併兩段木材的成本是長度和，求最小總成本。',
        focus: '霍夫曼式貪心與小根堆'
      }
    ]
  },
  2: {
    overview:
      '本章把「少做重複工作」拆成多種形式：指標只向前、候選區間每次減半、靜態答案預先彙總、座標只保留相對次序，以及把大問題分成可合併的小問題。',
    connections: [
      '雙指標、二分與三分都在縮小候選集合，但前提分別是指標單向性、真假單調性與單峰性。',
      '前綴和服務查詢，差分服務批次修改；兩者互為離散意義下的積分與微分。',
      '倍增、Sparse Table、快速冪與 LCA 都利用二進位拆解，差別只在被合併的操作。'
    ],
    examples: [
      {
        title: '排序後統計固定差值數對',
        sourceLabel: '例 2.4',
        sourceBookPages: [41],
        sourcePdfPages: [59],
        setup: '統計序列中滿足 A-B=C 的數對數量，重複值要按出現次數計算。',
        reasoning: [
          '排序後固定左端值，右側候選具有單調次序。',
          '兩個輔助指標框出所有等於 A+C 的連續區間，一次把重複值的貢獻加入答案。',
          '三個指標都只向右移，掃描是 O(n)，總成本由排序的 O(n log n) 主導。'
        ],
        takeaway: '遇到重複值時，不要逐對計數；先把相同值壓成一段，再乘上頻率。'
      },
      {
        title: '二維矩形批次加一',
        sourceLabel: '例 2.17',
        sourceBookPages: [68, 69],
        sourcePdfPages: [86, 87],
        setup: '在 n×n 網格上執行多次矩形加一，最後輸出整張網格。',
        reasoning: [
          '每次矩形修改只改四個差分角點，讓單次修改降為 O(1)。',
          '所有操作完成後做二維前綴還原，每格只計算一次。',
          '總成本 O(m+n²)，而輸出本身就需要 O(n²)，因此已達漸近最佳。'
        ],
        takeaway: '若所有修改先發生、查詢最後一次完成，差分通常比線上資料結構更簡潔。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '第一個可行答案',
        prompt: '給定單調判定函式，找最小滿足條件的整數。',
        focus: '半開區間二分'
      },
      {
        level: '基礎',
        title: '區間總和',
        prompt: '回答大量一維與二維靜態區間和查詢。',
        focus: '前綴和與容斥'
      },
      {
        level: '進階',
        title: '靜態 RMQ',
        prompt: '預處理後 O(1) 回答區間最小值。',
        focus: 'Sparse Table'
      },
      { level: '挑戰', title: '逆序對', prompt: '在 O(n log n) 內統計逆序對。', focus: '分治合併' }
    ]
  },
  3: {
    overview:
      '搜尋的核心是把題目變成狀態圖，再控制展開順序與狀態數。BFS、DFS、雙向搜尋、0-1 BFS、A* 與迭代加深，都是對 frontier 規則、判重方式與估價界線的不同選擇。',
    connections: [
      '判重避免同一狀態被反覆展開；剪枝則證明某整批尚未展開的狀態不可能改善答案。',
      'BFS 的層、Dijkstra 的距離與 A* 的 f=g+h 都是「下一個應先處理誰」的排序鍵。',
      '記憶化搜尋與動態規劃共享狀態定義，差別主要在計算順序是需求驅動還是拓撲順序。'
    ],
    examples: [
      {
        title: '環形八數碼的判重',
        sourceLabel: '例 3.2',
        sourceBookPages: [110, 111],
        sourcePdfPages: [128, 129],
        setup: '在有限排列狀態中，以固定規則移動空位，求到目標排列的最少步數。',
        reasoning: [
          '把圓形位置線性編碼成字串，讓狀態可直接放入集合。',
          '若不判重，分支數會指數成長；判重後最多只展開所有排列狀態。',
          '狀態在入隊時立即標記，確保同一排列只入隊一次，第一次到達目標即為最短。'
        ],
        takeaway: '先估算「不同狀態數」而不是只看樹的分支數，常能找到可行的判重表示。'
      },
      {
        title: '數獨的動態選點剪枝',
        sourceLabel: '例 3.11',
        sourceBookPages: [120],
        sourcePdfPages: [138],
        setup: '在行、列與九宮格限制下填滿數獨，並在多解中最佳化分數。',
        reasoning: [
          '每一步選候選數量最少的空格，讓矛盾更早暴露。',
          '以行、列、宮的使用集合做 O(1) 可行性檢查。',
          '若要求最大分數，可再用剩餘格子的樂觀上界做最優性剪枝。'
        ],
        takeaway: '搜尋順序不改答案集合，卻可能讓實際狀態數相差數個數量級。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '網格連通塊',
        prompt: '計算障礙網格中的連通區數量與面積。',
        focus: 'flood fill'
      },
      {
        level: '基礎',
        title: '無權最短路',
        prompt: '輸出最短距離並還原一條最短路徑。',
        focus: 'BFS parent'
      },
      {
        level: '進階',
        title: '零一邊權',
        prompt: '圖的邊權只有 0 或 1，求單源最短路。',
        focus: '0-1 BFS'
      },
      {
        level: '挑戰',
        title: '雙向密碼鎖',
        prompt: '從起點與終點同時搜尋，總是擴展較小的一側。',
        focus: '雙向 BFS 與交會條件'
      }
    ]
  },
  4: {
    overview:
      '進階資料結構的共同設計問題是：每個節點保存什麼摘要、摘要如何合併、更新如何傳播，以及如何保證樹高或區塊大小不失控。',
    connections: [
      'Fenwick Tree 與線段樹都把區間拆成少量摘要；前者介面窄但常數小，後者合併資訊更自由。',
      '可持久化靠結構共享保存歷史，分塊靠定期重建控制成本，平衡樹靠旋轉或重建控制高度。',
      'LCA、樹鏈剖分、點分治與 LCT 都把樹路徑轉換成較容易維護的序列或輔助樹。'
    ],
    examples: [
      {
        title: '差分結合 Fenwick Tree',
        sourceLabel: '例 4.4',
        sourceBookPages: [163],
        sourcePdfPages: [181],
        setup: '支援區間加值與單點查詢。',
        reasoning: [
          '把原陣列改看成差分陣列，區間 [l,r] 加 d 只影響 l 與 r+1。',
          'Fenwick Tree 維護差分的前綴和，查詢位置 x 即得到所有覆蓋 x 的修改總和。',
          '每次更新與查詢都是 O(log n)，且只需線性空間。'
        ],
        takeaway: '資料結構不一定直接維護答案；先換表示法，常能把操作變成它擅長的介面。'
      },
      {
        title: '線段樹中搜尋第一個空位',
        sourceLabel: '例 4.12',
        sourceBookPages: [184],
        sourcePdfPages: [202],
        setup: '維護花瓶區間的占用狀態，支援區間清空與從指定位置開始放入若干物品。',
        reasoning: [
          '節點摘要保存區間內已占用數量，便能判斷區間是否仍有空位。',
          '沿樹下降時優先查看左子樹，利用摘要找到第一個或第 k 個空位。',
          '區間設為全空或全滿使用 lazy assignment，標記合成要覆蓋舊標記而不是相加。'
        ],
        takeaway: '線段樹除了算區間答案，也能利用摘要在樹上二分位置。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '動態連通性',
        prompt: '逐條加邊並回答兩點是否連通。',
        focus: '並查集'
      },
      {
        level: '基礎',
        title: '區間和',
        prompt: '支援點修改與區間和查詢。',
        focus: 'Fenwick Tree／線段樹比較'
      },
      {
        level: '進階',
        title: '區間加與區間和',
        prompt: '實作 lazy propagation，明確定義標記合成。',
        focus: '線段樹'
      },
      {
        level: '挑戰',
        title: '樹上路徑查詢',
        prompt: '支援樹上點修改與兩點路徑和。',
        focus: '樹鏈剖分'
      }
    ]
  },
  5: {
    overview:
      '動態規劃把大量方案壓縮成有限狀態。深入學習時要反覆檢查五件事：狀態語意、轉移來源、基底、計算順序、答案位置；優化則是在不破壞語意下減少狀態或轉移。',
    connections: [
      '背包的原地更新方向其實是在控制同一物品能被使用一次、無限次或有限次。',
      '數位 DP 的 tight、started 與前綴資訊，是把「不超過上界」這個全域限制局部化。',
      '單調佇列、凸殼與四邊形不等式優化，分別利用窗口、代數幾何與最佳決策單調性減少轉移。'
    ],
    examples: [
      {
        title: '0/1 背包的狀態壓縮',
        sourceLabel: '例 5.1',
        sourceBookPages: [319, 322],
        sourcePdfPages: [337, 340],
        setup: '每件物品最多選一次，在容量限制下最大化總價值。',
        reasoning: [
          '二維狀態 dp[i][c] 表示只考慮前 i 件物品、容量 c 的最佳值。',
          '轉移分成不選與選第 i 件，兩類方案互斥且完整。',
          '壓成一維後容量必須由大到小更新，否則本輪剛更新的值會讓同一物品被重複使用。'
        ],
        takeaway: '滾動陣列不只是省空間；更新方向必須維持「讀舊層、寫新層」的依賴。'
      },
      {
        title: '相鄰位數差限制的數位 DP',
        sourceLabel: '例 5.5',
        sourceBookPages: [338, 340],
        sourcePdfPages: [356, 358],
        setup: '統計區間內相鄰兩位數字差至少為 2 的整數。',
        reasoning: [
          '把區間計數轉成 count(0..r)-count(0..l-1)。',
          '狀態至少需要目前位置、上一位、是否仍貼住上界、是否已開始形成數字。',
          '只有不受上界限制的狀態可安全記憶化；前導零不可誤當一般數位參與相鄰差判斷。'
        ],
        takeaway: '數位 DP 的難點通常不是公式，而是精確定義前導零與上界限制。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '最長遞增子序列',
        prompt: '先寫 O(n²)，再優化到 O(n log n)。',
        focus: '狀態與貪心摘要'
      },
      {
        level: '基礎',
        title: '0/1 與完全背包',
        prompt: '比較兩者的一維更新方向並解釋原因。',
        focus: '依賴順序'
      },
      { level: '進階', title: '石子合併', prompt: '求合併相鄰區間的最小成本。', focus: '區間 DP' },
      {
        level: '挑戰',
        title: '樹上選點',
        prompt: '在父子限制下選固定數量節點最大化價值。',
        focus: '樹形背包'
      }
    ]
  },
  6: {
    overview:
      '本章把整數與線性轉移轉成可計算結構：模運算保留同餘、快速冪利用結合律、矩陣表示固定轉移、消去法解線性系統、篩法與卷積處理大量算術函數。',
    connections: [
      '快速冪、矩陣快速冪與倍增都維持「已累積答案 × 剩餘基底效果」的不變量。',
      '擴展 gcd、線性同餘與中國剩餘定理共享「gcd 是否整除常數」的可解條件。',
      '積性函數、Dirichlet 卷積、Möbius 反演與杜教篩構成從局部質因數資訊到大範圍前綴和的鏈條。'
    ],
    examples: [
      {
        title: '矩陣加速 Fibonacci 與固定線性遞推',
        sourceLabel: '第 6.3 節例題',
        sourceBookPages: [393, 395],
        sourcePdfPages: [23, 25],
        setup: '把相鄰遞推狀態寫成向量，利用轉移矩陣的冪直接跳到第 n 項。',
        reasoning: [
          '狀態向量必須包含算出下一步所需的全部歷史，例如二階遞推保存相鄰兩項。',
          '矩陣乘法合成多步轉移，A^k 就代表連續執行 k 次。',
          '若問題要求固定邊數的路徑，也可把普通加乘替換成 min-plus 半環。'
        ],
        takeaway: '矩陣不是目的；先找固定且可結合的狀態轉移，再決定是否值得用快速冪。'
      },
      {
        title: '網格操作轉成模線性方程組',
        sourceLabel: '例 6.5、例 6.6',
        sourceBookPages: [401, 402],
        sourcePdfPages: [31, 32],
        setup: '每次操作會同時改變自身與鄰格，要求把所有格子變成指定狀態。',
        reasoning: [
          '每個操作次數是一個未知數，每格最終狀態提供一條方程。',
          '翻轉問題在 GF(2) 上消去；三態循環則在模 3 下消去。',
          '消去後仍要區分唯一解、無解與自由變數；若求最少操作，可能需要枚舉自由變數。'
        ],
        takeaway: '看到多個操作效果線性疊加時，可嘗試把「選哪些操作」寫成方程組。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '模快速冪',
        prompt: '支援負底數、零次方與大乘法中間值。',
        focus: '模正規化與溢位'
      },
      {
        level: '基礎',
        title: '線性同餘',
        prompt: '求 ax≡b (mod m) 的一組解或判斷無解。',
        focus: 'extended gcd'
      },
      {
        level: '進階',
        title: '質因數批次查詢',
        prompt: '預處理最小質因數並快速分解多個整數。',
        focus: '線性篩'
      },
      {
        level: '挑戰',
        title: '固定長度最短路',
        prompt: '求恰走 k 條邊的最短距離。',
        focus: 'min-plus 矩陣冪'
      }
    ]
  },
  7: {
    overview:
      '組合數學先回答「在數什麼」：物件是否有序、是否可重複、哪些配置視為相同。公式、DP、容斥、生成函數與群作用只是針對不同等價關係與限制的計數工具。',
    connections: [
      '二項式係數可由選取意義、Pascal 遞推、階乘公式與生成函數四個角度理解。',
      '容斥修正重複計數；Möbius 反演可視為在因數偏序上的容斥。',
      'Catalan、Stirling、生成函數與 SG 函數分別處理前綴合法、集合分組、組合運算與公平遊戲。'
    ],
    examples: [
      {
        title: '有限硬幣數量的容斥',
        sourceLabel: '例 7.7',
        sourceBookPages: [476, 478],
        sourcePdfPages: [106, 108],
        setup: '四種硬幣面額固定，每次查詢限制各種硬幣數量，詢問湊成指定金額的方法數。',
        reasoning: [
          '先用完全背包預處理不設上限時的方案數。',
          '某種硬幣超過上限可轉成「先強制使用上限加一枚，再湊剩餘金額」。',
          '枚舉違反上限的硬幣子集合，以容斥交替加減，四種硬幣只需 16 個子集合。'
        ],
        takeaway: '少數種類的上限限制，常可用「無限制 DP + 容斥」避免多維狀態。'
      },
      {
        title: '整數劃分的兩種觀點',
        sourceLabel: '例 7.13',
        sourceBookPages: [494],
        sourcePdfPages: [124],
        setup: '計算把正整數 n 寫成若干正整數和的方法數，不考慮順序。',
        reasoning: [
          'DP 可令 dp[n][m] 表示最大部件不超過 m 的劃分數，依是否使用 m 分類。',
          '生成函數把每個可用部件 k 表示成 1+x^k+x^{2k}+…，所有部件相乘後取 x^n 係數。',
          '兩種方法本質上都在保證每個多重集合恰好被計數一次。'
        ],
        takeaway: '生成函數把「選擇的組合」轉成「係數卷積」，是計數 DP 的代數版本。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: 'Pascal 三角形',
        prompt: '用遞推計算所有 C(n,k)，並解釋邊界。',
        focus: '組合分類'
      },
      {
        level: '基礎',
        title: '鴿巢前綴和',
        prompt: '證明任意 n 個整數中存在一段連續子段和可被 n 整除。',
        focus: '餘數抽屜'
      },
      { level: '進階', title: '受限排列', prompt: '用容斥計算錯排數。', focus: '交替加減' },
      {
        level: '挑戰',
        title: 'Nim 合併遊戲',
        prompt: '計算多堆石子的勝負並構造一步必勝操作。',
        focus: 'SG／xor'
      }
    ]
  },
  8: {
    overview:
      '計算幾何的難點是把圖形敘述轉成穩定的代數判斷。先統一點、向量、方向與誤差策略，再組合成相交、包含、凸包、旋轉卡尺與半平面交。',
    connections: [
      '叉積同時描述方向、平行四邊形面積與點在線的哪一側，是二維幾何最核心的判斷。',
      '凸包先刪掉內部點，旋轉卡尺再利用支撐線單調移動，避免枚舉所有點對。',
      '隨機增量最小圓與模擬退火最小球展示了精確幾何與近似搜尋的取捨。'
    ],
    examples: [
      {
        title: '凸包直徑與旋轉卡尺',
        sourceLabel: '例 8.5',
        sourceBookPages: [528],
        sourcePdfPages: [158],
        setup: '在大量平面點中求最遠點對距離平方。',
        reasoning: [
          '先建凸包，因為內部點不可能成為最遠點對端點。',
          '對凸包每條邊，對踵點隨邊方向單調移動，不需每次從頭搜尋。',
          '建包 O(n log n)，卡尺 O(h)，總成本由排序主導。'
        ],
        takeaway: '先利用幾何性質縮小候選集合，再利用單調性線性掃描。'
      },
      {
        title: '隨機增量最小圓覆蓋',
        sourceLabel: '例 8.7',
        sourceBookPages: [535, 536],
        sourcePdfPages: [165, 166],
        setup: '求包含所有點的最小圓。',
        reasoning: [
          '先隨機打亂點，逐點維持目前最小圓。',
          '新點若在圓內不需修改；若在圓外，它必在新圓邊界上，再回頭枚舉第二、第三個邊界點。',
          '程式雖有三層迴圈，隨機順序下期望複雜度接近線性。'
        ],
        takeaway: '幾何退化情況要明確處理：重點、共線三點與浮點 epsilon 都不可省略。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '線段相交',
        prompt: '處理一般相交、端點接觸、共線重疊。',
        focus: '叉積與包圍盒'
      },
      {
        level: '基礎',
        title: '多邊形面積',
        prompt: '用有向面積計算簡單多邊形面積。',
        focus: 'shoelace'
      },
      {
        level: '進階',
        title: '凸包周長',
        prompt: '輸出凸包頂點與周長，決定是否保留共線邊界點。',
        focus: 'Andrew monotone chain'
      },
      { level: '挑戰', title: '最遠點對', prompt: '在凸包上實作旋轉卡尺。', focus: '對踵點單調性' }
    ]
  },
  9: {
    overview:
      '字串演算法的共同目標是重用前綴、後綴或回文資訊。不同結構的差別在於狀態代表單一前綴長度、共享前綴樹、回文後綴鏈，還是整個子字串等價類。',
    connections: [
      'rolling hash 用數值摘要比較子串，KMP 與 Z-function 用確定性邊界資訊比較前後綴。',
      'Trie 與 AC 自動機共享前綴；AC 再加入失配邊，讓多模式匹配不必回退文本位置。',
      '回文樹按不同回文建狀態，後綴自動機按 endpos 等價類建狀態，兩者都在線擴充字串。'
    ],
    examples: [
      {
        title: '最短循環節的雜湊與 KMP 解法',
        sourceLabel: '例 9.3',
        sourceBookPages: [554],
        sourcePdfPages: [184],
        setup: '給定週期字串的一段片段，求可能的最短循環節長度。',
        reasoning: [
          '雜湊法預處理前綴值，快速比較候選區塊是否相同，但要承擔碰撞風險。',
          'KMP 的最長 border 長度 π[n-1] 直接給出候選週期 n-π[n-1]。',
          '若題目要求完整重複，還需檢查 n 是否能被候選週期整除；片段模型則要依題意調整。'
        ],
        takeaway: '同一題可用摘要或結構性邊界資訊；能用確定性線性演算法時通常優先。'
      },
      {
        title: 'Manacher 的最右回文不變量',
        sourceLabel: '例 9.4',
        sourceBookPages: [557, 558],
        sourcePdfPages: [187, 188],
        setup: '在線性時間求最長回文子串。',
        reasoning: [
          '插入分隔符統一奇偶長度回文，並用哨兵避免越界。',
          '維持目前右端最遠的回文中心 C 與右界 R；R 內位置先利用鏡像半徑初始化。',
          '只有超出既知右界的部分需要新比較，而 R 在整體過程只向右移，因此總成本線性。'
        ],
        takeaway: '線性複雜度不是因為沒有 while，而是所有 while 的成功擴張總次數受 R 單調移動限制。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '前綴函數',
        prompt: '輸出每個前綴的最長真 border 長度。',
        focus: 'KMP fallback'
      },
      {
        level: '基礎',
        title: '字典統計',
        prompt: '插入單詞並回答完整詞與前綴出現次數。',
        focus: 'Trie'
      },
      {
        level: '進階',
        title: '多模式匹配',
        prompt: '統計每個模式在文本中的出現次數。',
        focus: 'AC 自動機'
      },
      {
        level: '挑戰',
        title: '不同子字串數',
        prompt: '在線加入字元並累計不同子字串數。',
        focus: '後綴自動機'
      }
    ]
  },
  10: {
    overview:
      '圖論先決定頂點、邊、方向、權重與容量的語意，再選擇演算法。遍歷回答可達性，low-link 回答連通結構，鬆弛回答路徑，cut property 回答生成樹，殘量網路回答流與割。',
    connections: [
      '拓撲排序、SCC 與 2-SAT 都在處理有向依賴，只是輸出分別是順序、等價縮點與布林可行性。',
      'BFS、Dijkstra、Bellman-Ford 與 Floyd-Warshall 的選擇由邊權與查詢範圍決定。',
      '最大流、二分圖匹配、最小割與費用流共享殘量網路，建模時要讓容量或費用對應題目的限制。'
    ],
    examples: [
      {
        title: '輸出所有拓撲序',
        sourceLabel: '例 10.1',
        sourceBookPages: [608],
        sourcePdfPages: [238],
        setup: '在偏序限制下，按字典序輸出所有合法排列。',
        reasoning: [
          '只求一個序列可用 Kahn；要求全部序列則需回溯枚舉每一步所有入度為零且未使用的點。',
          '選點後暫時刪除其出邊影響，回溯時完整恢復入度。',
          '輸出數量本身可能指數級，所以複雜度必須寫成與答案數相關。'
        ],
        takeaway: '判斷 DAG 是多項式問題，但列舉所有拓撲序可能天然需要指數時間。'
      },
      {
        title: 'Tarjan 強連通分量',
        sourceLabel: '例 10.6',
        sourceBookPages: [626],
        sourcePdfPages: [256],
        setup: '把有向圖切成極大強連通分量。',
        reasoning: [
          'dfn 記錄首次到達時間，low 記錄沿 DFS 樹邊與仍在棧中回邊可到達的最早時間。',
          '只有指向仍在棧中的節點才可更新 low，否則會把已完成的分量錯誤合併。',
          '當 low[u]=dfn[u]，u 是一個分量根，持續彈棧直到 u 即得到完整 SCC。'
        ],
        takeaway: 'low-link 的意義必須綁定「目前 DFS 活躍路徑」，不能只背更新公式。'
      }
    ],
    exercises: [
      {
        level: '基礎',
        title: '字典序拓撲排序',
        prompt: '輸出字典序最小拓撲序，若有環則回報。',
        focus: 'Kahn + min-heap'
      },
      {
        level: '基礎',
        title: '單源最短路',
        prompt: '依邊權類型分別選 BFS、0-1 BFS 或 Dijkstra。',
        focus: '演算法前提'
      },
      {
        level: '進階',
        title: '橋與割點',
        prompt: '找出無向圖所有橋與割點。',
        focus: 'dfn/low 與父邊'
      },
      {
        level: '挑戰',
        title: '選擇衝突模型',
        prompt: '把二元選擇限制建成蘊含圖並輸出一組可行解。',
        focus: '2-SAT + SCC'
      }
    ]
  }
};
