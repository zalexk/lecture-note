---
title: 05 布尔代数化简
---

# 05 布尔代数化简

> **真题分布**：M2024 Q5(1)(3)；M2025s Q5(1)(2)；M2025f Q3(1)；M2026 Q3(3)；HW2 Q7、Q8　|　**考频**：4/4 年，每次 4–8 分
> **一句话**：给一个式子或一张门电路图，只许用布尔代数（Boolean algebra）的定理把它化到最简与或式（sum-of-products, SOP），每一步都要写得出用了哪条规则。

## 这个课题在考什么

这一课题考的不是「答案对不对」，而是「过程合不合法」。卷面出现 "using Boolean theorems" 或 "using the boolean algebra laws and rules, show the intermediate steps" 时，每一步都必须给依据。

入口只有两种：**给式子**（M2025f Q3(1)、M2026 Q3(3)、HW2 Q7、Q8）与**给门电路**（M2024 Q5、M2025s Q5）。后者更常见，因为它同时考读图。

得分点有三处：门到表达式的抄写不错、每步定理名写对、最终式确实不能再合并。本文所有结论都用 sympy（`simplify_logic` 与穷举真值表）复核过。

## 必备知识（只看解题要用到的）

| 编号 | 规则 | 公式 | 触发信号（看到什么就用它） |
|---|---|---|---|
| R1 | 交换、结合、分配 | $X+Y=Y+X$；$X(Y+Z)=XY+XZ$；$X+YZ=(X+Y)(X+Z)$ | 要重排、乘开、提公因子、把和式拆成乘积 |
| R2 | 幂等律（idempotent） | $X+X=X$；$X\cdot X=X$ | 差一项才能配对时，把已有项原样再抄一遍 |
| R3 | 互补律（complementarity） | $X+\bar X=1$；$X\bar X=0$ | 同一括号或同一项里出现一对相反文字 |
| R4 | 双重否定（involution） | $\overline{\bar X}=X$ | 两层横线直接相邻 |
| R5 | 吸收律（absorption） | $X+XY=X$；$X(X+Y)=X$ | 一项的文字集合是另一项的子集 |
| R6 | 合并律（combining） | $XY+X\bar Y=X$；$(X+Y)(X+\bar Y)=X$ | 两项只差一个变量的反号，其余文字完全相同 |
| R7 | 消去律（elimination） | $X+\bar XY=X+Y$；$X(\bar X+Y)=XY$ | 单项 $X$ 与以 $\bar X$ 开头的项并存 |
| R8 | 共识律（consensus） | $XY+\bar XZ+YZ=XY+\bar XZ$ | 三项、前两项含 $X$ 与 $\bar X$、第三项由两者各取一个文字乘成 |
| R9 | 德摩根定理（DeMorgan） | $\overline{X+Y}=\bar X\bar Y$；$\overline{XY}=\bar X+\bar Y$ | 一条横线盖住整个和式或整个积式 |
| R10 | 对偶（duality） | $\cdot$ 与 $+$ 互换、$0$ 与 $1$ 互换，变量不动 | 题目要 "the dual of" |

- 另有 $0/1$ 律：$X+0=X$，$X\cdot1=X$，$X+1=1$，$X\cdot0=0$，代入常值后用它收尾。文字（literal）指一个变量或其反，如 $A$、$\bar A$；最简的判据先比项数，再比文字总数（见文末专题）。
- 本课题只讲代数定理与化简流程；标准与或式、真值表互转见 06 文件，卡诺图见 07 文件，只用 NAND/NOR 落地见 08 文件。

## 题型 5.1 纯表达式化简：定理流水线

### 识别特征
题干写 "Simplify each expression using Boolean algebra only. Do not use Karnaugh maps."，给的是已写好的与或式或或与式，没有电路图。

### 原题
> **Q7** Simplify each expression using Boolean algebra only. Do not use Karnaugh maps.
>
> (a) $$F_1 = AB + A\overline{B} + \overline{A}B.$$
>
> (b) $$F_2 = (A + B)(A + \overline{B})(\overline{A} + C).$$
>
> (c) $$F_3 = AB + \overline{A}C + BC.$$

### 官方答案
作业题，官方不提供答案。标准解（已复核）：

$$F_1=A+B,\qquad F_2=AC,\qquad F_3=AB+\bar AC$$

### 解题步骤
1. **先配对、再吸收** —— 扫一遍所有项，把「只差一个变量的反号」的两项挑出来用 R6，这一步收益最大，优先做；某项的文字是另一项的子集时，用 R5 删掉长项。
2. **找「单项 + 反变量项」** —— 形如 $X+\bar XY$ 直接用 R7。
3. **括号式先看同首项** —— $(X+Y)(X+\bar Y)=X$ 比乘开快，是 R6 的对偶形式。
4. **最后查共识项并自检** —— 三项以上、且含 $X$ 与 $\bar X$ 时，第三项若由前两项各取一个文字组成，用 R8 删；再逐项问「删掉它，真值表会变吗」，不会变就说明还能再化。

(a) 的完整流水线：

$$\begin{aligned}
F_1 &= AB+A\bar B+\bar AB\\
&= A(B+\bar B)+\bar AB &&\text{(R1 提 }A\text{)}\\
&= A+\bar AB &&\text{(R3：}B+\bar B=1\text{)}\\
&= A+B &&\text{(R7)}
\end{aligned}$$

(b) 不乘开，先把前两个括号配对：

$$F_2=(A+B)(A+\bar B)(\bar A+C)=\big(A+B\bar B\big)(\bar A+C)=A(\bar A+C)=AC$$

其中第一步用 R1 乘开前两项、再用 R2 把 $A+A$ 并成 $A$；第二步用 R3 消 $B\bar B$；最后一步用 R1 展开后由 $A\bar A=0$、R5 删 $A\cdot A$。

(c) 给 $BC$ 补一个 $(A+\bar A)$ 再用 R8：

$$\begin{aligned}
F_3 &= AB+\bar AC+BC\\
&= AB+\bar AC+(A+\bar A)BC &&\text{(R3：乘 }1\text{ 不改值)}\\
&= AB(1+C)+\bar AC(1+B) &&\text{(R1 重组)}\\
&= AB+\bar AC &&\text{(R5：}1+C=1\text{)}
\end{aligned}$$

### 答案复盘
- (a) 第一个动作是「提 $A$」，不是「删 $\bar AB$」。判断依据：两项共有 $A$、另一因子互补，才允许并成单项。结尾用 R7 而不再合并：$A+\bar AB$ 中 $\bar A$ 与 $B$ 相乘、$A$ 单独成项，正是 R7 的标准形。
- (b) 若全部乘开，会出现 $A\bar AC$、$AB\bar B$ 等零项，路变长但结果相同；先并前两个括号是唯一能一步消掉 $B$ 的位置。
- (c) 的 $BC$ 是共识项，必删。验算：$A=0,B=1,C=1$ 时三项都为 $1$，删掉 $BC$ 后前两项仍有一项为 $1$，函数值不变。
- 三条结论的项数分别是 2、1、2，文字数 2、2、4，均已达最简。R5–R8 都是恒等式，对任意变量个数都成立，不存在「只能用于三个变量」的限制。

### 易错点
- 把 R7 记反：$X+\bar XY=X+Y$ 正确；$X+XY=X+Y$ 错误（后者用 R5 得 $X$）。
- 合并律要求「其余因子完全相同」：$AB+A\bar BC$ 不能直接合并，只能先提 $A$。
- 对或与式误用 R5：$(A+B)(A+B+C)=A+B$ 成立（R5 的对偶），但 $(A+B)(A+C)\neq A+B$。
- 化简完不写依据。卷面写了 "using Boolean theorems"，不写定理名通常扣过程分。

### 变体
**变体原题**（M2025f Q3(1)，该卷不提供答案）：

> (1) (4 points) Simplify the Boolean equations $Y = \bar A\bar B + \bar AB\bar C + \overline{A+\bar C}$ using Boolean theorems.

自算结果 $Y=\bar A$（已复核）：

$$\begin{aligned}
Y &= \bar A\bar B+\bar AB\bar C+\overline{A+\bar C}\\
&= \bar A\bar B+\bar AB\bar C+\bar AC &&\text{(R9，R4：}\overline{A+\bar C}=\bar A\cdot C\text{)}\\
&= \bar A(\bar B+B\bar C+C) &&\text{(R1 提 }\bar A\text{)}\\
&= \bar A(\bar B+\bar C+C) &&\text{(R7：}\bar B+B\bar C=\bar B+\bar C\text{)}\\
&= \bar A &&\text{(R3：}\bar C+C=1\text{)}
\end{aligned}$$

要点：整条横线盖住和式时，先拆横线再谈别的；$\overline{A+\bar C}$ 中的 $\overline{\bar C}$ 要还原成 $C$，漏掉这一步就会得到 $\bar A\bar C$ 而不是 $\bar AC$。

## 题型 5.2 门电路 → 表达式 → 化简

### 识别特征
给一张多级门电路图，问 "Derive the expression of the output $X$ and minimize it using the boolean algebra laws and rules, show the intermediate steps"。

### 原题
> 5. (12 points) For the logic circuit and the input waveforms shown in Figure 4, respectively, answer the following questions.
>
> (1) (4 points) Derive the expression of the output $X$ and minimize it using the boolean algebra laws and rules, show the intermediate steps;

<svg viewBox="0 0 400 240" width="400" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M20,40 H40 M67,40 H100 M20,100 H60 M60,100 V51 H100 M60,100 V128 H100 M20,160 H72 V140 H100 M137,46 H170 V58 H190 M137,136 H178 V70 H190 M227,66 H240 V98 H255 M20,210 H245 V110 H255 M292,104 H305 M332,104 H370" stroke="#333" stroke-width="1.4" fill="none"/>
  <g transform="translate(40,26)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(100,32)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(100,122)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(190,52)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(255,90)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(305,90)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g fill="#fff" stroke="#333" stroke-width="1.4"><circle cx="63.5" cy="40" r="3.5"/><circle cx="133.5" cy="46" r="3.5"/><circle cx="133.5" cy="136" r="3.5"/><circle cx="223.5" cy="66" r="3.5"/><circle cx="288.5" cy="104" r="3.5"/><circle cx="328.5" cy="104" r="3.5"/></g>
  <circle cx="60" cy="100" r="2.5" fill="#333"/>
  <g font-style="italic"><text x="6" y="44">A</text><text x="6" y="104">B</text><text x="6" y="164">C</text><text x="6" y="214">D</text><text x="374" y="108">X</text></g>
  <g><text x="36" y="20">G1</text><text x="110" y="26">G2</text><text x="110" y="116">G3</text><text x="196" y="46">G4</text><text x="262" y="84">G5</text><text x="312" y="84">G6</text></g>
</svg>

### 官方答案
$$X=\overline{\overline{\overline{\overline{(\bar A+B)}(\overline{BC})}+D}}=\overline{\overline{(\bar A+B)}(\overline{BC})}+D=\bar A+B+BC+D=\bar A+B+D$$

### 解题步骤
1. **给门编号、逐门列中间式** —— 从输入端往输出端依次 G1、G2…，每个气泡都代表对该点取反一次；只写本门类型对应的运算，先不管化简。$G_2$ 的输入是 $\bar A$ 与 $B$，不是 $A$ 与 $B$。
2. **拼成嵌套式** —— 把每个 $G_i$ 直接代入上一层，横线叠横线，不要提前消。
3. **由外向内拆、收尾化简** —— 相邻两条横线用 R4 消掉，一条横线盖住积式时用 R9；拆完后通常只剩 R3、R5、R7 三种动作。

逐门结果：$G_1=\bar A$；$G_2=\overline{\bar A+B}$；$G_3=\overline{BC}$；$G_4=\overline{G_2G_3}$；$G_5=\overline{G_4+D}$；$X=\overline{G_5}$。

$$\begin{aligned}
X &= \overline{\overline{G_4+D}} &&\text{(G5、G6 两级反号)}\\
&= G_4+D &&\text{(R4)}\\
&= \overline{G_2G_3}+D &&\text{(G4 代入)}\\
&= \overline{\overline{(\bar A+B)}\,(\overline{BC})}+D &&\text{(G2、G3 代入)}\\
&= (\bar A+B)+BC+D &&\text{(R9 拆积式，R4 消两层横线)}\\
&= \bar A+B+D &&\text{(R5：}B+BC=B\text{)}
\end{aligned}$$

### 答案复盘

| 官方写法 | 电路来源 | 规则 |
|---|---|---|
| 整个和式上的两条横线 | G5 的 NOR 与 G6 的反相器各贡献一条 | 两条相邻横线，R4 可消 |
| 乘积上的一条横线 | G4 的 NAND | 照抄，抄写阶段不动它 |
| $(\bar A+B)$ 上的一条横线 | G2 的 NOR | 照抄；注意括号里是 $\bar A$，来自 G1 |
| $\overline{BC}$ | G3 的 NAND | 照抄 |
| 第二式 | 去掉外层双横线 | R4，这是官方唯一一次真正的化简 |
| 第三式 $(\bar A+B)+BC+D$ | 拆 G4 的横线 | R9：$\overline{XY}=\bar X+\bar Y$，再对两个因子各用一次 R4 |
| 第四式 $\bar A+B+D$ | 删去 $BC$ | R5：$B+BC=B(1+C)=B$ |

- 第一式不是算出来的，是「照抄电路」的产物。考试时先写它，可以拿到抄写分。
- 第二个等号只做了一件事：抵消 G5、G6 的一对反号。合法的前提是这两条横线确实相邻。
- 第三个等号一次用了 R9 加两次 R4：$\overline{\overline{(\bar A+B)}(\overline{BC})}=\overline{\overline{(\bar A+B)}}+\overline{\overline{BC}}=(\bar A+B)+BC$。
- $D$ 单独成项，与 $\bar A$、$B$ 都没有公共文字，化简到此为止；结果 3 项 3 文字。

### 易错点
- 把 G2 读成 OR：它的输入是 $\bar A$ 与 $B$，输出带气泡，所以是 $\overline{\bar A+B}$，不是 $\overline{A+B}$。
- 两个反号不相邻也提前消。只有当两条横线之间没有别的运算时才可用 R4。
- 漏掉 G6。G5 的输出是 $\overline{G_4+D}$，G6 再取反才等于 $X$。
- 拆 G4 的横线时只拆外层，忘了两个因子各自还带一条横线。

### 变体
**接地变体原题**（同题第 (3) 问，官方有答案）：

> (3) (4 points) Assuming that the input $B$ is shorted to ground, derive the expression of the output $X$ and draw its waveform.

$$X=\bar A+D$$

做法：把 $B=0$ 代入上一问的最简式，用 $0/1$ 律收尾；不要从电路重推。

$$\begin{aligned}
X &= \bar A+B+D &&\text{(5.2 结果)}\\
&= \bar A+0+D &&\text{(B 接地：}B=0\text{)}\\
&= \bar A+D &&\text{(0/1 律：}X+0=X\text{)}
\end{aligned}$$

- 合法性在「代入」而非「删除」：$B$ 仍出现在式子里，只是恒为 $0$；图中 $B$ 的引脚仍在，画成接地符号。
- 若某项形如 $\bar BC$，代入 $B=0$ 得 $1\cdot C=C$，不是 $0$；直接划掉整项会错。
- 接 $V_{cc}$ 时 $B=1$，$X=\bar A+1+D=1$，输出恒为 $1$，电路退化为常数源。
- 其他变体：要求 "redraw the circuit" 时按 08 文件换成 NAND 实现；固定两个输入时逐次代入，顺序不影响结果。

## 题型 5.3 证明相等、写对偶式、用 DeMorgan 展开

### 识别特征
题干出现 "Prove"、"Show that"、"Write the dual of"、"Apply DeMorgan's theorems to express … using complements of individual variables only"。

### 原题
> **Q8** (a) Prove
>
> $$A + \overline{A}B = A + B.$$
>
> (b) Write the dual of
>
> $$A + AB = A.$$
>
> (c) Apply DeMorgan's theorems to express
>
> $$\overline{(A + \overline{B})C}$$
>
> using complements of individual variables only.

### 官方答案
作业题，官方不提供答案。标准解（已复核）：

- (a) $A+\bar AB=(A+\bar A)(A+B)=1\cdot(A+B)=A+B$
- (b) 对偶式 $A(A+B)=A$
- (c) $\overline{(A+\bar B)C}=\overline{A+\bar B}+\bar C=\bar AB+\bar C$

### 解题步骤
1. **选方法** —— 变量不超过 4 个、只问「是否相等」，真值表最稳；题目写 "Prove" 且变量多，用逐条变形；两边都能化到最小项时，用同一标准形式。
2. **真值表法、代数法** —— 列全 $2^n$ 行，左右各算一列，两列逐行相同即证；代数法则从较复杂的一边出发，每步只用一条定理，把另一边变出来，不要两边同时动。
3. **标准形式法** —— 两边都化成最小项之和，比较下标集合（写法见 06 文件）。
4. **对偶式与 DeMorgan** —— 对偶只换运算符与 $0/1$，变量及其反号一律不动；DeMorgan 两步走：先拆最外层横线（加变乘、乘变加），再拆内层，最后处理单个变量上的反号。

(a) 的三种证法：

$$\begin{aligned}
&\text{代数法：} && A+\bar AB=(A+\bar A)(A+B)=1\cdot(A+B)=A+B\\
&\text{穷举法：} && A=0\Rightarrow 0+1\cdot B=B=0+B;\quad A=1\Rightarrow 1+0=1=1+B\\
&\text{标准形式：} && A+\bar AB\to m_1+m_2+m_3;\quad A+B\to m_1+m_2+m_3
\end{aligned}$$

| $A$ | $B$ | $A+\bar AB$ | $A+B$ |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 |

(c) 逐步拆线：

$$\overline{(A+\bar B)C}=\overline{A+\bar B}+\bar C=\bar A\cdot\overline{\bar B}+\bar C=\bar AB+\bar C$$

### 答案复盘
- (a) 第一招是反向用分配律：$A+\bar AB=(A+\bar A)(A+B)$，相当于给 $A$ 配一个 $(A+\bar A)$ 因子，合法依据是 R1（$X=A$、$Y=\bar A$、$Z=B$）。若直接用 R7 得 $A+B$，结论虽对，但没有展示过程；题目写 "Prove" 时这属于「用结论证结论」，过程分拿不满。
- (b) 的关键是**对偶不等于取反**：取反会把变量也变号，得 $\bar A(\bar A+\bar B)$；对偶只动符号，得 $A(A+B)$。对偶式恰好也等于 $A$，说明「定理的对偶仍是定理」。
- (c) 的第一个等号拆最外层积式，第二个等号拆 $\overline{A+\bar B}$，第三个等号用 R4 还原 $\overline{\bar B}=B$。顺序不能反：先动内层会漏掉 $\bar C$。
- 若用标准形式法验证 (a)：$\bar AB$ 已是 $m_1$，$A$ 展开为 $m_2+m_3$，右边 $A+B=m_1+m_2+m_3$，集合相同。

### 易错点
- 两边同时变形，最后两式相等却说不清哪一步合法；只允许从一边推到另一边。
- 对偶式里把变量也加了反号，或忘记把 $0$ 与 $1$ 互换。
- DeMorgan 只拆一半：$\overline{XY}=\bar X+\bar Y$ 会拆，$\overline{X+Y}$ 却写成 $\bar X+\bar Y$。
- 真值表必须列全 $2^n$ 行；一组取值相同不是证明，必须全表或逐步等价。

### 变体
- 问「是否满足规格」：HW2 Q6(e) 给规格与 $F_{\text{alt}}=S+AT+M$，问 "Determine whether it satisfies the specification. If not, identify every input combination on which it fails."。做法是把「证明等价」换成「找反例行」，一行不同即可否定。
- 问「对偶式是否成立」：写对偶式后照常化简，结论与原式相同即成立；概念题里的判断属 12 文件。

## 题型 5.4 由真值表/标准式化到最简式

### 识别特征
给一张真值表，先要求 "Write down the logic expression in the standard sum of product form"，再要求 "analyze this circuit" 或 "minimize"。项数 4–6，其中若干项可以两两配对。

### 原题
> 5. (12 points)
>
> The gate labeled “K gate” has the truth table as shown in Table 1.
>
> | A | B | C | X |
> |---|---|---|---|
> | 0 | 0 | 0 | 1 |
> | 0 | 0 | 1 | 0 |
> | 0 | 1 | 0 | 1 |
> | 0 | 1 | 1 | 0 |
> | 1 | 0 | 0 | 1 |
> | 1 | 0 | 1 | 0 |
> | 1 | 1 | 0 | 1 |
> | 1 | 1 | 1 | 1 |
>
> Table 1: The truth table of K gate
>
> (1) (5 points) Write down the logic expression in the **standard sum of product form**;
>
> (2) (7 points) Given the circuit as shown in Figure 3, analyze this circuit and come-up with the logic circuit for the same function that uses **ONLY** NAND gates (The complementary inputs are not directly available - e.g., $\bar{A}$ is not directly available.)

<svg viewBox="0 0 400 250" width="400" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M20,45 H80 M20,59 H80 M110,52 H190 V80 H200 M20,130 H150 M150,130 V92 H200 M150,130 V165 H180 M20,190 H180 M20,215 H180 M230,86 H280 V118 H300 M260,190 H280 V130 H300 M330,124 H370" stroke="#333" stroke-width="1.4" fill="none"/>
  <g transform="translate(80,38)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(200,72)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <rect x="180" y="150" width="80" height="80" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <g transform="translate(300,110)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <circle cx="150" cy="130" r="2.5" fill="#333"/>
  <g font-style="italic"><text x="6" y="49">P</text><text x="6" y="63">Q</text><text x="6" y="134">A</text><text x="6" y="194">B</text><text x="6" y="219">C</text><text x="374" y="128">Y</text></g>
  <g><text x="86" y="78">AND</text><text x="206" y="112">AND</text><text x="186" y="170">A</text><text x="186" y="195">B</text><text x="186" y="220">C</text><text x="244" y="195" font-style="italic">X</text><text x="188" y="244">K gate</text></g>
</svg>

### 官方答案
$$X = \bar A\bar B\bar C + \bar AB\bar C + A\bar B\bar C + AB\bar C + ABC$$

$$\begin{aligned}
X&=\bar A\bar B\bar C+\bar AB\bar C+A\bar B\bar C+AB\bar C+ABC\\
&=(\bar A\bar B\bar C+\bar AB\bar C+A\bar B\bar C+AB\bar C)+(AB\bar C+ABC)\\
&=(\bar A\bar C+A\bar C)+AB\\
&=\bar C+AB
\end{aligned}$$

$$Y = PQA + X = APQ + AB + \bar C$$

### 解题步骤
1. **先看表的规律、写标准与或式** —— 8 行里 5 个 $1$，其中 $C=0$ 的四行全为 $1$，剩下一行是 $A=B=C=1$，有规律就先记下，作为化简目标；每个 $1$ 对应一个最小项（写法见 06 文件），照抄 5 项。
2. **找一个跨组的项** —— 这里 $AB\bar C$ 既属于 $C=0$ 的四个一组，又要与 $ABC$ 配对。
3. **用 R2 把它抄一遍** —— $X+X=X$，多写一项不改变函数。
4. **分组并项** —— 四个 $\bar C$ 项两两并用 R6，得 $\bar C$；$AB\bar C+ABC$ 用 R6 得 $AB$。
5. **读电路、代入** —— 顶层是或门：$Y=PQA+X$，其中 $PQA$ 来自两个与门；把 $X$ 的最简式代入 $Y$，NAND-only 的实现见 08 文件。

| 行 | 动作 | 规则 | 为什么想到它 |
|---|---|---|---|
| 2 | $AB\bar C$ 出现两次 | R2 | 四个 $\bar C$ 项里只有它还能与 $ABC$ 再配一对 |
| 3 | $\bar A\bar B\bar C+\bar AB\bar C=\bar A\bar C$ | R6 | 只差 $B$ 的反号 |
| 3 | $A\bar B\bar C+AB\bar C=A\bar C$ | R6 | 只差 $B$ 的反号 |
| 3 | $\bar A\bar C+A\bar C=\bar C$ | R6 | 只差 $A$ 的反号 |
| 3 | $AB\bar C+ABC=AB$ | R6 | 只差 $C$ 的反号 |
| 4 | $X=\bar C+AB$ | R1 | 两项无公共文字，停止 |

### 答案复盘
- 官方第 2 行把 $AB\bar C$ 写成两份，而不是把 $ABC$ 写两份。原因是 $AB\bar C$ 同时属于两个待并组；若抄 $ABC$，只能得到 $ABC+ABC=ABC$，没有收益。选**跨组**的那一项来复制。
- 第 3 行两个括号各是一次 R6，第 4 行再用一次 R6 得 $\bar C$，官方省略了中间两步。考场上补写 $\bar A\bar B\bar C+\bar AB\bar C=\bar A\bar C$ 更稳。
- $X$ 最终 2 项 3 文字。真值表自检：$C=0$ 时全为 $1$，$C=1$ 时只有 $A=B=1$ 为 $1$，与第 1 步的观察一致。
- $Y$ 只做代入，没有再化简：$APQ$、$AB$、$\bar C$ 两两无公共文字，也不构成共识关系。
- 若表改成「$A=B=1$ 才为 $0$」，则 $X=\overline{AB}$，流水线照用；「复制跨组项」的技巧只在存在可配对最小项时有效。

### 易错点
- 漏掉 $111$ 那一行。它单独成组，最容易看漏。
- 把标准式写成 4 项（把两个 $AB\bar C$ 合成一项）：形式没错，但后面凑对时找不到配对项。
- 复制错项：抄 $ABC$ 而不是 $AB\bar C$，整条链断掉。
- 读电路时把 $APQ$ 写成 $AP+Q$：图中 $P,Q$ 先过一个与门，其输出再与 $A$ 相与。
- 把 K 门直接当 $\bar C$ 用而丢掉 $AB$：$110$ 行是 $1$，$\bar C$ 在该行给 $0$，会错。

### 变体
- 要求 "ONLY NAND gates"：从 $Y=APQ+AB+\bar C$ 出发做两次取反并推气泡，见 08 文件。
- 表换成 4 变量：第 1 步的「找规律」改成「按某个变量分组看 0/1」，其余不变。

## 专题：怎样判断已经最简（含 M2026 Q3(3) 勘误）

**原题**（M2026 Q3(3)）：

> 3. (12 points)
>
> (3) (4 points) Simplify the Boolean equations $Y = A\bar B\bar C + A\bar B\bar C\bar D + \bar A\bar B\bar C D + \bar A\bar B\bar C\bar D$.

**官方答案**：

$$\bar B\bar C + A\bar C\bar D$$

> **勘误**：第二项 $A\bar C\bar D$ 只在 $(A,B,C,D)=(1,1,0,0)$ 即 $m_{12}$ 处为 $1$，而原式在该点为 $0$：前两项要求 $B=0$，后两项要求 $A=0$，没有一项覆盖 $A=B=1$。官方卡诺图把 $AB=11,\ CD=00$ 这一格误标为 $1$，才多出该项。正确结果是 $\bar B\bar C$（1 项 2 文字）。考试时按 $\bar B\bar C$ 作答，并可用 $m_{12}$ 一行反证。

判定流程：
1. **翻最小项、找共同文字** —— 缺哪个变量，就让它取 $0$ 与 $1$ 两种。本题四项分别为 $m_8,m_9$、$m_8$、$m_1$、$m_0$，并集是 $\{m_0,m_1,m_8,m_9\}$；四个最小项都满足 $B=0$、$C=0$，可并为 $\bar B\bar C$。
2. **覆盖检查** —— 答案的每个 1 必须落在题目的集合内；官方第二项落在 $m_{12}$，越界。
3. **删除测试** —— 删掉某项后真值集合不变，该项冗余。本题第一项已覆盖全部四个最小项。
4. **合并测试、计数** —— 两项只差一个文字才能并，差两个及以上不能并；项数少先于文字数少，项数与文字数都相同的不同答案视为同级最简。

- 错误来源是卡诺图抄格：$A\bar B\bar C$ 的 $B$ 是 $0$，对应行 $AB=10$，不是 $11$。按 07 文件圈组时，行标错一格就会多出一项。
- 若题目真的含 $m_{12}$，则 $m_8,m_{12}$ 可并为 $A\bar C\bar D$，官方两项式反而正确。最简性必须相对于题干的最小项集合来判。
- 同类错误：M2024 Q8 官方答案含 $AB$、$AC$ 两个只覆盖无关项的冗余项，其最小化按 07 文件处理。

## 章末自测

1. 化到最简：$F=\bar AB+A\bar B+AB$。
2. 化到最简：$G=(A+\bar B)(A+B)C+\bar AC$。
3. 用代数法证明共识律 $AB+\bar AC+BC=AB+\bar AC$。
4. 读图得 $X=\overline{\overline{A+BC}+\bar AB}$，化简。
5. M2024 Q5 中若把 $B$ 接 $V_{cc}$（$B=1$），$X$ 等于什么？

## 自测答案

1. $A\bar B+AB=A$（R6），再 $A+\bar AB=A+B$（R7）。答案 $A+B$。
2. $(A+\bar B)(A+B)=A$（R1+R3），故 $G=AC+\bar AC=C$（R6）。
3. $BC=BC(A+\bar A)=ABC+\bar ABC$，前项被 $AB$ 吸收、后项被 $\bar AC$ 吸收（R5），故 $BC$ 可删（R8）。
4. 先拆外层：$X=(A+BC)\cdot\overline{\bar AB}=(A+BC)(A+\bar B)$（R9、R4）；乘开得 $A+A\bar B+ABC+BC\bar B=A+ABC=A$（R5）。答案 $A$。
5. $X=\bar A+1+D=1$，输出恒为 $1$，与 $A,C,D$ 无关。
