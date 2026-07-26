---
id: openj-bailian-1487
volume: lower
source_file: lower-volume
source_book_pages:
  - 405
source_pdf_pages:
  - 35
title: OpenJ_Bailian 1487 Single-Player Games
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 5
topics: &a1
  - 期望
  - 高斯消去
  - 遞迴下降剖析
prerequisites:
  - 模運算與線性方程
  - 依題型所需的圖論或數論基礎
statement: 以 a、b…命名可能遞迴的遊戲樹；整數葉為分數，括號內節點等機率選一個子樹。對每個識別字，若遊戲以機率 1 結束，輸出期望分數，否則輸出 undefined。
constraints:
  - 多組資料，以 n=0 結束
  - 每組有 n 個依 a、b…排列的定義
input_format: 每組先 n，接著 n 行「識別字 = 樹」。
output_format: 依指定 Game 格式輸出各識別字結果，組間空行。
samples:
  - input: |
      1
      a = ((1 7) 6 ((8 3) 4))
      2
      a = (1 b)
      b = (4 a)
      1
      a = (a a a)
      0
    output: |+
      Game 1
      Expected score for a = 4.917

      Game 2
      Expected score for a = 2.000
      Expected score for b = 3.000

      Game 3
      Expected score for a undefined

    explanation: 第一棵有限樹直接加權平均；第二組聯立兩條期望方程；第三組永遠回到 a，終止機率為零。
core_knowledge: *a1
judgment: 遞迴解析每棵樹，得到常數分數與各識別字被選到的機率；建立 E_i-RHS_i=0。對實數方程做 RREF。自由變數及仍依賴自由變數的主元變數皆為 undefined。
hints:
  - 先把隨機過程、流量調整或冪次條件寫成代數式。
  - 辨認固定維矩陣、線性方程、分數規劃或同餘系統，避免直接模擬巨大狀態。
  - 處理自由變數、非互質模數、數值精度與溢位等邊界後再輸出。
solution_outline: 遞迴解析每棵樹，得到常數分數與各識別字被選到的機率；建立 E_i-RHS_i=0。對實數方程做 RREF。自由變數及仍依賴自由變數的主元變數皆為 undefined。
proof_or_invariant: 內節點均勻選子節點，所以期望是子樹期望算術平均，解析所得方程與隨機過程的全期望公式等價。若某變數由方程唯一決定，吸收機率為 1 且其值為期望；若依賴自由量，存在非終止閉類，期望未定義。
complexity:
  time: O(L+n³)
  space: O(n²+L)
common_errors:
  - 負整數葉解析失敗
  - 括號只除直接子樹數而非字元數
  - 僅把無主元變數標 undefined，未傳播依賴
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
    // TODO：依三段提示建立核心狀態與演算法。
    return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  const double EPS=1e-10;struct Val{vector<double>c;double k=0;};string line;int posi,n;void skip(){while(posi<(int)line.size()&&line[posi]==' ')++posi;}Val parse(){skip();Val r{vector<double>(n),0};if(line[posi]=='('){++posi;vector<Val>v;while(true){skip();if(line[posi]==')'){++posi;break;}v.push_back(parse());}for(const Val&t:v){r.k+=t.k;for(int i=0;i<n;++i)r.c[i]+=t.c[i];}double z=static_cast<double>(v.size());r.k/=z;for(double&x:r.c)x/=z;}else if(islower(static_cast<unsigned char>(line[posi]))){r.c[line[posi++]-'a']=1;}else{int sign=1;if(line[posi]=='-')sign=-1,++posi;while(posi<(int)line.size()&&isdigit(static_cast<unsigned char>(line[posi])))r.k=r.k*10+(line[posi++]-'0');r.k*=sign;}return r;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int game=0;while(cin>>n&&n){getline(cin,line);vector<vector<double>>a(n,vector<double>(n+1));for(int i=0;i<n;++i){getline(cin,line);posi=static_cast<int>(line.find('='))+1;Val v=parse();a[i][i]=1;for(int j=0;j<n;++j)a[i][j]-=v.c[j];a[i][n]=v.k;}vector<int>where(n,-1);int row=0;for(int col=0;col<n&&row<n;++col){int sel=row;for(int i=row;i<n;++i)if(abs(a[i][col])>abs(a[sel][col]))sel=i;if(abs(a[sel][col])<EPS)continue;swap(a[sel],a[row]);double d=a[row][col];for(int j=col;j<=n;++j)a[row][j]/=d;for(int i=0;i<n;++i)if(i!=row&&abs(a[i][col])>EPS){double f=a[i][col];for(int j=col;j<=n;++j)a[i][j]-=f*a[row][j];}where[col]=row++;}cout<<"Game "<<++game<<"\n";for(int col=0;col<n;++col){bool undef=where[col]==-1;if(!undef)for(int j=0;j<n;++j)if(where[j]==-1&&abs(a[where[col]][j])>EPS)undef=true;cout<<"Expected score for "<<char('a'+col);if(undef)cout<<" undefined\n";else cout<<" = "<<fixed<<setprecision(3)<<a[where[col]][n]<<"\n";}cout<<"\n";}}
external_url: http://bailian.openjudge.cn/practice/1487/
external_platform: OpenJ_Bailian
external_problem_id: '1487'
external_title: Single-Player Games
external_relation: original
review_status: verified
---

遞迴解析每棵樹，得到常數分數與各識別字被選到的機率；建立 E_i-RHS_i=0。對實數方程做 RREF。自由變數及仍依賴自由變數的主元變數皆為 undefined。
