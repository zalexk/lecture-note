---
title: 10 多路选择器与译码器
---

# 10 多路选择器与译码器

> **真题分布**：M2024 Q6(2)（5 分）；M2025f Q7(2)(3)（11 分）、Q8(3)（5 分）；M2025s Q6(3)（7 分）；M2026 Q7(2)(3)（10 分）、Q8（10 分）；HW3 Q6　|　**考频**：4/4 年，每年 5–15 分
> **一句话**：把一张真值表接到成品芯片上——多路选择器（multiplexer, MUX）靠「数据端填 $0/1/X/\bar X$」，译码器（decoder）靠「最小项之或」，两者共用的工具只有一个：按选择码把真值表分组。

## 这个课题在考什么
Chapter 5 让你自己设计电路，Chapter 6 反过来：芯片已经造好，你只负责**接线**。卷面因此只考两件事——读图（引脚号、使能端、有效电平）与把函数映射到端口；答案是一张接线图或一串数据端取值，错一根线整题失分。

固定套路是「用 74HC151 实现这个函数」加「用译码器实现这个函数」。前者考**变量收缩**：$n$ 变量函数用 8 选 1 时，把真值表按选择码两行一组折起来，每组只剩 $0,1,X,\bar X$ 四种可能；后者考**最小项发生器**：译码器每根输出天生是一个最小项，函数就是若干根输出之或，输出低有效（active-low）时改用与非。

其余四题都是这两条的变体：4 选 1 的作业题（10.3）、138 做 POS（10.5）、154 当解复用器（10.6）、比较器与优先编码器只考读图（10.8、10.9）。本文所有数据端向量、译码器取脚、154 的 16 行时序，均用 Python 按真值表穷举 $2^{n}$ 组逐点比对过。

## 必备知识（只看解题要用到的）
| # | 名称 | 引脚 / 定义 | 卷面上怎么用 |
|---|---|---|---|
| B1 | 多路选择器（MUX） | $2^{k}$ 个数据端选一个接到输出，由 $k$ 根选择端决定 | 选择码 $i$ 时 $Y=D_i$ |
| B2 | 74HC151（8 选 1） | $S_2,S_1,S_0$ 在 9、10、11 脚（$S_2$ 最高位）；$D_0\sim D_7$ 在 4、3、2、1、15、14、13、12 脚；$Y$ 5 脚、$\bar Y$ 6 脚、$\bar E$ 7 脚 | 每题必给这颗芯片的空图 |
| B3 | 变量收缩 | $n$ 变量用 $2^{n-1}$ 选 1：$n-1$ 个变量进选择端，剩下一个进数据端 | 数据端出现 $X$ 与 $\bar X$ |
| B4 | 译码器（decoder） | $k$ 根输入产生 $2^{k}$ 根输出，输出恰好是全部最小项（独热，one-hot） | 译码器 = 最小项发生器 |
| B5 | 低有效（active-low） | 名字带横杠或引脚带气泡的脚，「有效」= 逻辑 0 | 138 / 154 / 42 / 147 的输出都是 |
| B6 | 74HC138（3 线-8 线） | $A_2,A_1,A_0$ 地址；$S_1$ 高有效，$\bar S_2,\bar S_3$ 低有效，三根都接对才译码 | 三变量函数的 SOP 或 POS |
| B7 | 74HC154（4 线-16 线） | $A_0\sim A_3$ 在 23、22、21、20 脚；$\overline{CS_1}$（18）、$\overline{CS_2}$（19）都接 0 才译码；16 根输出低有效 | 当 1 到 16 解复用器 |
| B8 | 74HC42（BCD-十进制） | $A_0\sim A_3$ 在 15、14、13、12 脚；OUT0~OUT9 在 1~7、9、10、11 脚，低有效 | 只认 0~9，$1010\sim1111$ 十根全高 |
| B9 | 74HC85 / 74HC147 | 4 位数值比较器（comparator）/ 10 线-4 线优先编码器（priority encoder） | 只考读图，见 10.8、10.9 |

## 一条通式与一张归纳表
记选择变量为 $S_{k-1}\dots S_0$，$m_i$ 是它们的第 $i$ 个最小项。MUX 的输出就是「数据端 $\times$ 它对应的最小项」之和：

$$Y=\sum_{i=0}^{2^{k}-1} D_i\,m_i \tag{1}$$

选择码 $i$ 只让 $m_i=1$，故 $Y=D_i$；反向使用就是**折叠**——把 $F$ 按 $m_i$ 分组，第 $i$ 组的「商」就是 $D_i$。每组只剩两行（差一个自由变量），归纳只有四种结果：

| 两行的值（$X=0$, $X=1$） | $(0,0)$ | $(0,1)$ | $(1,0)$ | $(1,1)$ |
|---|---|---|---|---|
| 该接的数据端 | $0$ | $X$ | $\bar X$ | $1$ |

译码器侧只记极性：输出高有效（$Y_i=m_i$）时 SOP 用**或门**；输出低有效（$\bar Y_i=\bar m_i$）时 SOP 用**与非门**、POS 用**与门**，三式都是 De Morgan：

$$F=\sum_{j}Y_j,\qquad F=\overline{\prod_{j}\bar Y_j},\qquad F=\prod_{j}\bar Y_j \tag{2}$$

## 题型 10.1 74HC151 实现三变量函数（选择端用满）
### 识别特征
三变量真值表 + "using one 74HC151"；变量数正好等于选择端数，没有剩余变量可挤进数据端。
### 原题
> 7. (15 points) Given the truth table of a 3-input circuit below:
>
> (2) (5 points) The below figure denotes a 8-input data selector/multiplexer 74HC151. Implement the logic function specified in the truth table using one 74HC151 chip.

| $A$ | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 |
|---|---|---|---|---|---|---|---|---|
| $B$ | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| $C$ | 0 | 1 | 0 | 1 | 0 | 1 | 0 | 1 |
| $Y$ | 0 | 1 | 0 | 1 | 0 | 1 | 1 | 0 |
### 官方答案
(No official solution for M2025f; the following is self-derived and verified by exhaustive enumeration.) Connect $S_2,S_1,S_0$ to $A,B,C$, tie $\bar E$ LOW, and take the output at pin 5:

$$Y=\Sigma m(1,3,5,6),\qquad (D_0,\dots,D_7)=(0,1,0,1,0,1,1,0)$$

| 选择码 $ABC$ | 000 | 001 | 010 | 011 | 100 | 101 | 110 | 111 |
|---|---|---|---|---|---|---|---|---|
| Given $Y$ | 0 | 1 | 0 | 1 | 0 | 1 | 1 | 0 |
| Data input | $D_0=0$ | $D_1=1$ | $D_2=0$ | $D_3=1$ | $D_4=0$ | $D_5=1$ | $D_6=1$ | $D_7=0$ |

（对照：第 44 张讲义里同一函数把 $D_1,D_3,D_5,D_6$ 四根并到 $+5$ V、其余四根接地，与本表一致，可用来对答案。）
### 解题步骤
1. **竖着抄**：第 $i$ 行的 $Y$ 直接写给 $D_i$，不化简、不分组，数据端只接 $0$ 或 $1$。
2. **对号接选择端**：$S_2\leftarrow A$、$S_1\leftarrow B$、$S_0\leftarrow C$，使选择码等于行号。
3. **接使能端**：$\bar E$（7 脚）接 0 V，输出取 5 脚 $Y$。
### 答案复盘
- 为什么不用归纳表：式 (1) 里每个 $m_i$ 只乘一个常数，8 个最小项与 8 根数据端一一对应，分组退化成「一行一根线」；变量比选择端多一个时才需要两行合一根（10.2）。
- 为什么 $\bar E$ 接 0 V：它是低有效片选脚，接高或悬空（CMOS 悬空按高处理）时 $Y\equiv0$，整题归零。这是阅卷必看的一根线。
- 数据端为什么只是「抄一列」：该列与 $D_0\dots D_7$ 是同一序列，$D_6=1$ 完全由 $ABC=110$ 决定，不需要任何化简；第 (1) 问要求的 SOP 与第 (2) 问独立给分。
### 易错点
- 选择端接反（$S_2\leftarrow C$）：$ABC=001$ 会去选 $D_4$，输出全错。
- 忘接 $\bar E$，或接到 6 脚 $\bar Y$ 上（整体取反）。
- 数据端多接一根变量：本类题没有自由变量，接变量说明行号数错了。
### 变体
**M2026 Q7(3)**（有官方答案）：
> (3) (5 points) In the above table, if $Y = 0$ when the inputs are all zeros and is alternately a 1 and 0 for the remaining rows in the table, use a 74HC151 to implement the resulting function.

新表为 $0,1,0,1,\dots,0,1$，即 $Y=D$、与 $A,B,C$ 无关：**八根数据端全接 $D$**，$\bar E$ 接 0 V——官方续页的图正是把 $D$ 一条总线并到 $D_0\sim D_7$。此时选择端三根怎么排都不影响结果；这与 10.2 的变体（顺序一错就全错）构成对照。

## 题型 10.2 74HC151 实现四变量函数（分组归纳法）
### 识别特征
四变量真值表 + 8 选 1 芯片：变量比选择端多一个，必须把两行合成一根数据线。
### 原题
> 6. (15 points)
>
> (1) Derive the minimized SOP expression from the truth table below using K-map (5 points), and implement it using basic gates such as AND, OR, Inverter(5 points). The complementary inputs, if needed, are **NOT** directly available, i.e. $\bar A,\bar B,\bar C,\bar D$ are **NOT** available. Same for the question below.
>
> (2) (5 points) Implement the logic function specified in the truth table by using a 74HC151 8-input data selector/multiplexer.

| $ABCD$ | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| $X$ | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 |
### 官方答案
Official Figure 10: pin 7 ($\bar E$) is tied to ground; the variable $D$ is wired directly to $D_7$ and through one inverter to $D_2$; $D_1,D_4,D_5$ are tied HIGH ($+5$ V) and $D_0,D_3,D_6$ LOW; the output is taken at pin 5:

$$D_0=0,\quad D_1=1,\quad D_2=\bar D,\quad D_3=0,\quad D_4=1,\quad D_5=1,\quad D_6=0,\quad D_7=D$$

**分组归纳表（本章唯一必须动笔的东西）**
按选择码把 16 行切成 8 对，每对只差最后一列 $D$；逐对套用归纳表即得数据端，**这张表同时是答案和验算表**：

| 选择码 $S_2S_1S_0$（$=ABC$） | 这一对的两行 | 原表 $X$（$D=0$, $D=1$） | 归纳 | 数据端 |
|---|---|---|---|---|
| 000 | 0000, 0001（$m_0,m_1$） | 0, 0 | 恒 0 | $D_0=0$ |
| 001 | 0010, 0011（$m_2,m_3$） | 1, 1 | 恒 1 | $D_1=1$ |
| 010 | 0100, 0101（$m_4,m_5$） | 1, 0 | 随 $D$ 反向 | $D_2=\bar D$ |
| 011 | 0110, 0111（$m_6,m_7$） | 0, 0 | 恒 0 | $D_3=0$ |
| 100 | 1000, 1001（$m_8,m_9$） | 1, 1 | 恒 1 | $D_4=1$ |
| 101 | 1010, 1011（$m_{10},m_{11}$） | 1, 1 | 恒 1 | $D_5=1$ |
| 110 | 1100, 1101（$m_{12},m_{13}$） | 0, 0 | 恒 0 | $D_6=0$ |
| 111 | 1110, 1111（$m_{14},m_{15}$） | 0, 1 | 随 $D$ 同向 | $D_7=D$ |

<svg viewBox="0 0 430 360" width="430" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="160" y="36" width="110" height="304" fill="#fff" stroke="#333" stroke-width="1.4"/><text x="215" y="28" text-anchor="middle" font-size="12">74HC151</text>
  <path d="M120,56 H152" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="156" cy="56" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><text x="114" y="60" text-anchor="end">0 V</text><text x="166" y="60" font-size="11" font-style="italic">EN</text><text x="248" y="60" font-size="9" text-anchor="end">7</text>
  <path d="M120,84 H160 M120,106 H160 M120,128 H160" stroke="#333" stroke-width="1.4" fill="none"/><text x="114" y="88" font-style="italic" text-anchor="end">A</text><text x="114" y="110" font-style="italic" text-anchor="end">B</text><text x="114" y="132" font-style="italic" text-anchor="end">C</text><text x="166" y="88" font-size="11" font-style="italic">S2</text><text x="248" y="88" font-size="9" text-anchor="end">9</text><text x="166" y="110" font-size="11" font-style="italic">S1</text><text x="248" y="110" font-size="9" text-anchor="end">10</text><text x="166" y="132" font-size="11" font-style="italic">S0</text><text x="248" y="132" font-size="9" text-anchor="end">11</text>
  <path d="M120,156 H160 M120,178 H160 M120,222 H160 M120,244 H160 M120,266 H160 M120,288 H160 M26,310 H160" stroke="#333" stroke-width="1.4" fill="none"/>
  <text x="114" y="160" text-anchor="end">0</text><text x="114" y="182" text-anchor="end">1</text><text x="114" y="226" text-anchor="end">0</text><text x="114" y="248" text-anchor="end">1</text><text x="114" y="270" text-anchor="end">1</text><text x="114" y="292" text-anchor="end">0</text><text x="14" y="314">D</text>
  <text x="166" y="160" font-size="11" font-style="italic">D0</text><text x="248" y="160" font-size="9" text-anchor="end">4</text><text x="166" y="182" font-size="11" font-style="italic">D1</text><text x="248" y="182" font-size="9" text-anchor="end">3</text><text x="166" y="204" font-size="11" font-style="italic">D2</text><text x="248" y="204" font-size="9" text-anchor="end">2</text><text x="166" y="226" font-size="11" font-style="italic">D3</text><text x="248" y="226" font-size="9" text-anchor="end">1</text><text x="166" y="248" font-size="11" font-style="italic">D4</text><text x="248" y="248" font-size="9" text-anchor="end">15</text><text x="166" y="270" font-size="11" font-style="italic">D5</text><text x="248" y="270" font-size="9" text-anchor="end">14</text><text x="166" y="292" font-size="11" font-style="italic">D6</text><text x="248" y="292" font-size="9" text-anchor="end">13</text><text x="166" y="314" font-size="11" font-style="italic">D7</text><text x="248" y="314" font-size="9" text-anchor="end">12</text>
  <path d="M40,310 V200 H96" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="40" cy="310" r="2.5" fill="#333"/>
  <path d="M96,186 L120,200 L96,214 Z" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="123" cy="200" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M126,200 H160" stroke="#333" stroke-width="1.4" fill="none"/>
  <path d="M270,182 H320" stroke="#333" stroke-width="1.4" fill="none"/><text x="326" y="186" font-style="italic">X</text><text x="256" y="186" font-size="9">5</text>
  <path d="M270,206 H300" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="273" cy="206" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><text x="306" y="210" font-style="italic">Y</text><text x="256" y="210" font-size="9">6</text>
</svg>

图 10-1　M2024 Q6(2) 官方接法重绘（按 $S_2S_1S_0=A,B,C$ 摆放）：$D_2$ 经反相器接 $\bar D$，$D_7$ 直连 $D$，$D_1,D_4,D_5$ 接 $+5$ V，$D_0,D_3,D_6$ 接 0 V，$\bar E$ 接地，输出取 5 脚。

> **读图提示**：官方 Figure 10 把 $A$ 画在最上面那根选择线（11 脚，即 $S_0$），于是它的选择码是 $CBA$。本题两种排序给出同一组数据端，原因是该函数在 $A\leftrightarrow C$ 互换下不变（$m_2\leftrightarrow m_8$、$m_3\leftrightarrow m_9$，其余不动）；换一张表就不再成立，别把这个巧合当规律。
### 解题步骤
1. **定被牺牲的变量**：$D$ 留作数据变量，$A,B,C$ 进选择端，并把 $A$ 接 $S_2$（9 脚）、$B$ 接 $S_1$、$C$ 接 $S_0$——这样选择码等于 $ABC$，「同一对」正好是表上相邻两行，可以对着抄。
2. **查表归纳**：按 $(0,0)\to0$、$(0,1)\to D$、$(1,0)\to\bar D$、$(1,1)\to1$ 填出八根数据端。
3. **接线并自检**：$0/1$ 接 0 V 与 $+5$ V，$D$ 直连、$\bar D$ 加一个反相器（题干说反相信号不可得，必须自己造），$\bar E$ 接地，再用式 (1) 把 16 行逐行回代。
### 答案复盘
- **为什么 $D_2$ 接 $\bar D$ 而不是 0**：$010$ 这一对是 $m_4=1$、$m_5=0$。若接 0，$D=0$ 时输出被拉成 0，$m_4$ 就错了；只有 $\bar D$ 能让 $D=0$ 输出 1、$D=1$ 输出 0。口诀：**这一对里「自由变量取 1 的那行」是 1 就接 $D$，是 0 就接 $\bar D$**。
- **四种取值从哪来**：把式 (1) 按选择码提公因子得 $Y=\sum_i m_i(\bar D\,X_{i0}+D\,X_{i1})$，括号里就是 $D_i$。两个取值的组合只有四种，所以数据端**只可能**是 $0,1,D,\bar D$；出现别的写法一定是配对配错了。
- 全表只有 $010$ 与 $111$ 两组随 $D$ 翻转，其余六组两行同值，退化成常数——这就是官方图只有两根线接变量的原因。第 (1) 问的 K-map 化简（见 07 文件）与第 (2) 问独立给分，不必互相服务。
### 易错点
- **配错对**：把 $0001$ 与 $0010$ 配成一对（差两位）。判据只有「只差最后一列」。
- **把 $(1,0)$ 写成 $D$**：这两行反向，必须接 $\bar D$；$(0,1)$ 才接 $D$。本章最高频失分点。
- **按引脚号念数据端**：$D_0\sim D_7$ 是 4、3、2、1、15、14、13、12，不顺序；$\bar E$ 接 $+5$ V 或 $6$ 脚当输出同样全错。
### 变体
**M2026 Q7(2)**（有官方答案）：同一题干换成 $Y=\Sigma m(1,2,4,5,6,7,12,13)$。

| 选择码 $ABC$ | 000 | 001 | 010 | 011 | 100 | 101 | 110 | 111 |
|---|---|---|---|---|---|---|---|---|
| 这一对 | $m_0,m_1$ | $m_2,m_3$ | $m_4,m_5$ | $m_6,m_7$ | $m_8,m_9$ | $m_{10},m_{11}$ | $m_{12},m_{13}$ | $m_{14},m_{15}$ |
| 值 | 0, 1 | 1, 0 | 1, 1 | 1, 1 | 0, 0 | 0, 0 | 1, 1 | 0, 0 |
| 数据端 | $D$ | $\bar D$ | $1$ | $1$ | $0$ | $0$ | $1$ | $0$ |

即 $(D_0,\dots,D_7)=(D,\bar D,1,1,0,0,1,0)$，与官方图相同。

> **读图提示**：官方 Figure 10 把 $A$ 接 11 脚（$S_0$）、$B$ 接 10 脚（$S_1$）、$C$ 接 9 脚（$S_2$），选择码其实是 $CBA$；数据端向量 $(0,1,\bar D,0,1,1,0,D)$ 与此对应。若改接 $A\to S_2$（选择码 $ABC$），同一向量仍然成立，因为该函数在 $A\leftrightarrow C$ 互换下不变。换一道不对称的题就必须重算，别把这个巧合当规律。图中 7 脚（$\bar E$）已接地，$D_0$ 与它共用这条地线。

**M2025f Q7(3)**：四变量、十项之和，即 $Y=\Sigma m(1,2,5,6,7,8,10,12,13,15)$。取 $S_2S_1S_0=A_3A_2A_1$、自由变量 $A_0$，八个选择码上都有项，得 $(D_0,\dots,D_7)=(A_0,\bar A_0,A_0,1,\bar A_0,\bar A_0,1,A_0)$（$000\to m_0,m_1=0,1$ 故 $A_0$；$001\to m_2,m_3=1,0$ 故 $\bar A_0$；$011\to m_6,m_7=1,1$ 故 1，其余同理）。

## 题型 10.3 4 选 1 多路选择器实现三变量函数（HW3）
### 识别特征
给 4 选 1 的梯形框，四个数据端画成问号，要求换成 $0$、$1$、$C$ 或 $\bar C$，并写出 MUX 通式。
### 原题
> Q6 The multiplexer in Figure 2 selects $D_0$, $D_1$, $D_2$, or $D_3$ for select codes $S_1S_0 = 00, 01, 10, or 11$, respectively.
>
> Implement the function $F(A,B,C)=m_1+m_2+m_6+m_7$, where $A$ is the most significant input bit.
>
> 2. Replace each question mark in Figure 2 with $0$, $1$, $C$, or $\bar C$.　3. Verify the implementation for $ABC=010$ and $ABC=101$.　4. Write the general Boolean expression for a 4-to-1 multiplexer in terms of $D_0$, $D_1$, $D_2$, $D_3$, $S_1$, and $S_0$.

读图要点：Figure 2 的梯形框底边把 $S_0$ 画在左、$S_1$ 画在右，$A$ 接 $S_0$、$B$ 接 $S_1$，故**选择码是 $S_1S_0=BA$**，不是 $AB$。
### 官方答案
(No solution is provided for HW3; the following is self-derived and verified by exhaustive enumeration.) Leave $C$ as the data variable:

| 选择码 $S_1S_0=BA$ | 这一对的两行 | $F$（$C=0$, $C=1$） | 数据端 |
|---|---|---|---|
| 00（$B=0,A=0$） | 000, 001（$m_0,m_1$） | 0, 1 | $D_0=C$ |
| 01（$B=0,A=1$） | 100, 101（$m_4,m_5$） | 0, 0 | $D_1=0$ |
| 10（$B=1,A=0$） | 010, 011（$m_2,m_3$） | 1, 0 | $D_2=\bar C$ |
| 11（$B=1,A=1$） | 110, 111（$m_6,m_7$） | 1, 1 | $D_3=1$ |

(3) $ABC=010$: $BA=10$ selects $D_2=\bar C=1$, hence $F=1$ ($=m_2$); $ABC=101$: $BA=01$ selects $D_1=0$, hence $F=0$ ($m_5$ is not a minterm of $F$). (4) $F=\bar S_1\bar S_0D_0+\bar S_1S_0D_1+S_1\bar S_0D_2+S_1S_0D_3$.
### 解题步骤
1. **先认选择码**：$S_0$ 在左、$S_1$ 在右，$A\to S_0$、$B\to S_1$，所以码字是 $BA$。
2. **列 8 行真值表**：$F=1$ 于 $m_1,m_2,m_6,m_7$，按 $BA$ 两行一组归纳。
3. **代回验算**：用第 4 问的通式代入 $010$、$101$，顺便检查通式本身。
### 答案复盘
- $D_1$ 为什么是常量 $0$ 而不是 $\bar C$：$BA=01$ 的两行 $100$、$101$ 都是 0。这里最容易顺手写成 $\bar C$，因为上一组结论是 $C$。四根数据端恰好 $C,0,\bar C,1$ 各出现一次，是命题人故意的「四种情况全覆盖」，可用来自检。
- 通式就是式 (1) 在 $k=2$ 时的展开：每个选择码一个与项、乘以对应数据端。题干 "where $A$ is the most significant input bit" 说的是**输入变量**的权重（$m_1$ 指 $ABC=001$），与选择端接哪根无关。
### 易错点
- 把选择码当成 $AB$：$D_0$ 与 $D_2$ 互换，$ABC=010$ 的校验立刻失败。
- 通式写成 $F=D_0+D_1+D_2+D_3$：四项必须互斥，每项都要带选择端因子。
- 只写 $D_2=\bar C$ 而不写「两行分别是 1 和 0」的理由，扣过程分。
### 变体
四变量函数用 4 选 1 时剩两个自由变量，归纳结果可能是 $C\oplus D$，需再加一个异或门；三变量用 2 选 1 同理只剩一个自由变量。选择码永远是 $S_1S_0$，图上哪根在上不影响码字。

## 题型 10.4 通用 4 位译码器 + 与非门实现最小项之和
### 识别特征
"by using a 4-bit Decoder and basic logic gates"，且译码器输出引脚**带气泡**（低有效），地址脚只标权值 1、2、4、8。
### 原题
> 6. (15 points) Design a circuit with four inputs, namely $A$, $B$, $C$, and $D$, and one output $Y$. The output is 1 when the consecutive sequence ‘110’ is present, e.g., 0110.
>
> (3) (7 points) Implement the logic function specified in the truth table of (1) by using a 4-bit Decoder and basic logic gates.
### 官方答案
$Y=\Sigma m(6,12,13,14)$. Official Fig. 6(c): outputs **6, 12, 13, 14** drive one 4-input **NAND** gate whose output is $Y$, all other outputs left open. The address pins are weighted 1, 2, 4, 8, hence $D\to1$, $C\to2$, $B\to4$, $A\to8$ — the middle form of eq. (2):

$$Y=\overline{\bar Y_6\,\bar Y_{12}\,\bar Y_{13}\,\bar Y_{14}}$$
### 解题步骤
1. **把条件翻成最小项**：'110' 可落在 $ABC$ 或 $BCD$ 上，即 $110x$ 与 $x110$，合起来 $m_6,m_{12},m_{13},m_{14}$。
2. **认极性**：每根输出带气泡，地址 $i$ 时第 $i$ 根为 0，即 $\bar Y_i=\bar m_i$。
3. **按极性选门**：低有效 + SOP 只能走与非式，四根输入接这四脚，地址线按权值接 $A,B,C,D$。
### 答案复盘
- **为什么用与非门**：低有效输出的「选中」是 0，或门认不出 0——四个 0 或起来仍是 0，而函数在这些行要为 1；取反一次（与非）才对。写成 $\overline{\bar Y_6+\bar Y_{12}+\cdots}$ 是把与非当或。
- **为什么不走 POS**：$Y$ 的 0 行有 12 个，POS 要一个 12 输入与门，等于不可实现。**1 行少走 SOP，0 行少走 POS**，这是选路线的唯一依据。
- **为什么 $m_6$ 不能漏**：'110' 跨在 $B,C,D$ 上（$0110$、$1110$）同样合法，$D$ 任取；$0111$ 里没有 '110' 段，所以 $m_7$ 不算。这是「序列检波」题的标准陷阱。
### 易错点
- 漏 $m_6$ 或误加 $m_7$：回到真值表逐行核对（$011$、$111$ 都不是 '110'）。
- 对低有效输出直接用或门，得到 $\bar Y_6+\bar Y_{12}+\cdots$，函数整体取反。
- 地址接反（$A\to1$、$D\to8$）：四个取脚全落到别的行上。
### 变体
输出高有效（无气泡）时改用或门：$Y=Y_6+Y_{12}+Y_{13}+Y_{14}$。变量数少于译码器输入数时，多余地址脚接地，等于把译码器降级使用；五变量要用两片 4 位译码器，最高位接两片的使能端（讲义第 34 张，154 版）。

## 题型 10.5 74HC138 + 门实现标准 POS
### 识别特征
给 74HC138 的芯片图与功能表，要求用 "one 74HC138 chip and the necessary logic gates" 实现 (2) 求出的 POS。
### 原题
> 8. (11 points) A lab in CUHKSZ uses two LEDs to display the fault status of three devices ($A$, $B$ and $C$). The yellow LED ($Z_1$) turns on if only one device has faults, the red LED ($Z_2$) turns on if any two devices have faults. Both yellow and red LEDs turn on if all three devices have fault detected. Please design a logic circuit to realize the above functions. Note that “fault detected” and “LED on” are represented with logic high (‘1’), “no fault” and “LED off” are represented with logic low (‘0’);
>
> (3) (5 points) The chip 74HC138 is a 3-to-8 decoder, whose chip diagram and truth table are shown below. Please use one 74HC138 chip and the necessary logic gates to implement the expressions in (2).
### 官方答案
(The M2025f paper has no official solutions; the following is self-derived and verified by exhaustive enumeration.)

$$Z_1=\Sigma m(1,2,4,7)=\Pi M(0,3,5,6)=A\oplus B\oplus C,\qquad Z_2=\Sigma m(3,5,6,7)=\Pi M(0,1,2,4)=AB+AC+BC$$

POS from active-LOW outputs, one 4-input AND gate each (right form of eq. (2)): $Z_1=\bar Y_0\bar Y_3\bar Y_5\bar Y_6$, $Z_2=\bar Y_0\bar Y_1\bar Y_2\bar Y_4$. Wiring: $A_2,A_1,A_0\leftarrow A,B,C$; $S_1$ to $+5$ V; $\bar S_2,\bar S_3$ to 0 V.

<svg viewBox="0 0 470 200" width="470" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="80" y="26" width="96" height="160" fill="#fff" stroke="#333" stroke-width="1.4"/><text x="128" y="42" text-anchor="middle" font-size="11">74HC138</text>
  <path d="M40,60 H80 M40,78 H80 M40,96 H80 M40,114 H80 M40,132 H72 M40,150 H72" stroke="#333" stroke-width="1.4" fill="none"/>
  <circle cx="76" cy="132" r="4" fill="#fff" stroke="#333" stroke-width="1.2"/><circle cx="76" cy="150" r="4" fill="#fff" stroke="#333" stroke-width="1.2"/>
  <text x="36" y="64" font-style="italic" text-anchor="end">A</text><text x="36" y="82" font-style="italic" text-anchor="end">B</text><text x="36" y="100" font-style="italic" text-anchor="end">C</text><text x="36" y="118" text-anchor="end">+5 V</text><text x="36" y="136" text-anchor="end">0 V</text><text x="36" y="154" text-anchor="end">0 V</text>
  <text x="86" y="64" font-size="10" font-style="italic">A2</text><text x="86" y="82" font-size="10" font-style="italic">A1</text><text x="86" y="100" font-size="10" font-style="italic">A0</text><text x="86" y="118" font-size="10" font-style="italic">S1</text><text x="86" y="136" font-size="10" font-style="italic">S2</text><text x="86" y="154" font-size="10" font-style="italic">S3</text>
  <path d="M180,66 H212 M180,84 H212 M180,120 H212 M180,174 H212" stroke="#333" stroke-width="1.4" fill="none"/>
  <g font-size="10"><text x="168" y="52" text-anchor="end">Y0</text><text x="168" y="70" text-anchor="end">Y1</text><text x="168" y="88" text-anchor="end">Y2</text><text x="168" y="106" text-anchor="end">Y3</text><text x="168" y="124" text-anchor="end">Y4</text><text x="168" y="142" text-anchor="end">Y5</text><text x="168" y="160" text-anchor="end">Y6</text><text x="168" y="178" text-anchor="end">Y7</text></g>
  <g fill="#fff" stroke="#333" stroke-width="1.2"><circle cx="176" cy="48" r="4"/><circle cx="176" cy="66" r="4"/><circle cx="176" cy="84" r="4"/><circle cx="176" cy="102" r="4"/><circle cx="176" cy="120" r="4"/><circle cx="176" cy="138" r="4"/><circle cx="176" cy="156" r="4"/><circle cx="176" cy="174" r="4"/></g>
  <path d="M180,48 H330 M180,102 H280 V68 H330 M180,138 H290 V88 H330 M180,156 H300 V108 H330" stroke="#333" stroke-width="1.4" fill="none"/>
  <path d="M330,30 H340 A44,44 0 0 1 340,118 H330 Z" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M384,74 H424" stroke="#333" stroke-width="1.4" fill="none"/><text x="430" y="78" font-style="italic">Z1</text>
  <text x="345" y="136" font-size="11" text-anchor="middle">4 输入与门</text>
</svg>

图 10-2　74HC138 + 一个 4 输入与门给出 $Z_1$；$Z_2$ 用另一个 4 输入与门接 $\bar Y_0,\bar Y_1,\bar Y_2,\bar Y_4$。输出脚带气泡，0 表示该最小项被选中；未取的四根只留短脚。
### 解题步骤
1. **先按 (2) 求 POS**：直接列「函数值为 0 的行」——$Z_1$ 的 0 行是 0、3、5、6，$Z_2$ 是 0、1、2、4，每个 0 行写一个最大项。
2. **认输出极性**：8 根输出带气泡，$\bar Y_i=\bar m_i$，选中时为 0。
3. **POS + 低有效 $\to$ 与门**：把上述几根 $\bar Y$ 相与，因 $\prod_j\bar Y_j=\prod_j\bar m_j=\prod_jM_j$。
4. **接使能**：$S_1=+5$ V、$\bar S_2=\bar S_3=0$ V，三根缺一不可。
### 答案复盘
- **为什么用与门而不是与非门**：第 (2) 问要 POS，积直接对应「与」；低有效时 $\bar Y_j$ 恰好就是最大项 $M_j$，其积即函数。若改走 SOP（$Z_1=\overline{\bar Y_1\bar Y_2\bar Y_4\bar Y_7}$）要用与非门，两套取脚互为补集，都能得分，但要与自己的 (2) 对齐。
- **为什么 $Z_1$ 的 0 行含偶数个 1**：$Z_1=A\oplus B\oplus C$ 是奇校验，0 行必须含偶数个 1——0（零个 1）、3、5、6（各两个），正好四条，可用来秒查 0 行有没有抄错。$Z_2$ 是多数表决，0 行是 1 的个数不足 2 的四行。
- **使能那一列怎么读**：表头印作 $\bar S_2+\bar S_3$，格中的 0 表示**两只脚都为低**（引脚电平），三根同时满足才译码；若当成布尔式 $S_2,S_3$ 的函数来读会得出相反结论。
### 易错点
- 把低有效输出的 0 当成「该最小项不存在」：恰恰相反，选中就是 0，所以 POS 用与门、SOP 用与非门。
- $\Pi M$ 取错成 1 行：$Z_1$ 的 0 行是 0、3、5、6，写成 1、2、4、7 就把结果取反了。
- 使能三根只接两根（$S_1$ 悬空或 $\bar S_3$ 忘了接地）：输出恒为全 1，与「什么都不选」无法区分。
### 变体
要求 "NAND gates only" 时改走 SOP：$Z_1=\overline{\bar Y_1\bar Y_2\bar Y_4\bar Y_7}$、$Z_2=\overline{\bar Y_3\bar Y_5\bar Y_6\bar Y_7}$。四变量函数用 138 需两片，最高位接使能端选片。

## 题型 10.6 74HC154 作解复用器
### 识别特征
题干出现 "demultiplexing"、"sequenced through a straight binary count"、串行数据流，芯片是 74HC154（4 线-16 线）。
### 原题
> 8. (10 points) Develop the total timing diagram (inputs and outputs) for a 74HC154 used in a demultiplexing applications, as shown below, in which the inputs are as follows: the data-select inputs are repetitively sequenced through a straight binary count beginning with 0000, and the data input is a serial data stream carrying BCD data representing the decimal number 1357. The least significant digit (7) is first in the sequence, with its LSB first, and it should appear in the first 4-bit positions of the output.
### 官方答案
The 16-bit serial stream is `1110 1010 1100 1000`. At step $t$ the address $t$ selects output $D_t$; when $data=0$ that output is 0, when $data=1$ the chip is inhibited and all 16 outputs stay 1. So only the 8 steps below show a 0 (16 bits per row, **$D_0$ at the left and $D_{15}$ at the right**); the other 8 steps are all 1s:

```
t=3   S=0011  1110 1111 1111 1111   0 at D3
t=5   S=0101  1111 1011 1111 1111   0 at D5
t=7   S=0111  1111 1110 1111 1111   0 at D7
t=10  S=1010  1111 1111 1101 1111   0 at D10
t=11  S=1011  1111 1111 1110 1111   0 at D11
t=13  S=1101  1111 1111 1111 1011   0 at D13
t=14  S=1110  1111 1111 1111 1101   0 at D14
t=15  S=1111  1111 1111 1111 1110   0 at D15
```

<svg viewBox="0 0 400 250" width="400" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="120" y="24" width="86" height="200" fill="#fff" stroke="#333" stroke-width="1.4"/><text x="163" y="40" text-anchor="middle" font-size="11">74HC154</text>
  <text x="126" y="56" font-size="9" font-style="italic">A0</text><text x="126" y="72" font-size="9" font-style="italic">A1</text><text x="126" y="88" font-size="9" font-style="italic">A2</text><text x="126" y="104" font-size="9" font-style="italic">A3</text>
  <path d="M80,52 H120 M80,68 H120 M80,84 H120 M80,100 H120" stroke="#333" stroke-width="1.4" fill="none"/><g font-size="9" text-anchor="end"><text x="116" y="49">23</text><text x="116" y="65">22</text><text x="116" y="81">21</text><text x="116" y="97">20</text></g>
  <path d="M80,164 H112 M80,178 H112" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="116" cy="164" r="4" fill="#fff" stroke="#333" stroke-width="1.2"/><circle cx="116" cy="178" r="4" fill="#fff" stroke="#333" stroke-width="1.2"/><text x="76" y="168" text-anchor="end" font-style="italic">data</text><text x="76" y="182" text-anchor="end">0 V</text><text x="126" y="168" font-size="9" font-style="italic">CS1</text><text x="126" y="182" font-size="9" font-style="italic">CS2</text>
  <path d="M210,44 H240" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="206" cy="44" r="4" fill="#fff" stroke="#333" stroke-width="1.2"/><text x="244" y="48" font-size="9" font-style="italic">D0</text>
  <path d="M210,196 H240" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="206" cy="196" r="4" fill="#fff" stroke="#333" stroke-width="1.2"/><text x="244" y="200" font-size="9" font-style="italic">D15</text>
  <text x="163" y="126" font-size="10" text-anchor="middle">16 根输出</text><text x="163" y="140" font-size="10" text-anchor="middle">D0..D15</text><text x="163" y="154" font-size="10" text-anchor="middle">全部带气泡</text>
</svg>

图 10-3　74HC154 当解复用器：串行数据接 $\overline{CS_1}$（18 脚），$\overline{CS_2}$（19 脚）接地，地址按 $0000\to1111$ 循环扫描。
> **勘误**：官方第 6 行（$t=5$，地址 0101）印作 `1111 0111 1111 1111`，0 落在 $D_4$；按地址 0101 应选中 $D_5$，该行应为 `1111 1011 1111 1111`。其余 15 行与逐位枚举完全吻合，只此一行错位一格。
### 解题步骤
1. **先写串行流**：数字顺序 $7,5,3,1$，每个 4 位、LSB 在前——$0111\to1110$、$0101\to1010$、$0011\to1100$、$0001\to1000$。
2. **认解复用条件**：数据进 18 脚（$\overline{CS_1}$），19 脚（$\overline{CS_2}$）接 0 V；输出低有效，未选中的 15 根保持 1。
3. **逐拍列表**：第 $t$ 拍地址 $=t$，把第 $t$ 位数据送到 $D_t$；数据为 0 时该路输出 0，为 1 时整片禁止、16 根全 1。
### 答案复盘
- **为什么每行只有一个 0**：154 是纯组合电路、没有锁存，上一拍的 0 不会保留（$t=3$ 留 0、$t=4$ 又回全 1）。数据为 1 时整行全 1，看不出选中哪一路，所以这张表的信息全在 0 的位置上。
- **数据端为什么能当数据入口**：$\overline{CS_1}$ 低有效，接 0 才译码；把串行数据接到它上面，就等于给「译码」加一个开关——闭合（data=0）时被选中的那路输出 0，断开时 16 路全 1。解复用器（demultiplexer）的定义「单输入分配到多输出」由此实现，芯片一根线都不用改。
- **为什么前四列拼成 $1110$**：$D_0\sim D_3$ 依次拿到 7 的 LSB 先行四位，正是题干 "it should appear in the first 4-bit positions of the output" 的含义。
### 易错点
- 数字顺序搞反：题干 "The least significant digit (7) is first"，故为 $7,5,3,1$，不是 $1,3,5,7$。
- 每位内部也容易反：LSB 在前，$7=0111$ 要写成 $1110$。
- 让上一拍的 0 保留（当成锁存）、把 16 位写成 8 位，或按引脚号（1~11、13~17）排输出而题目要的是 $D_0\sim D_{15}$。
### 变体
数据改接高有效使能时表中 0 与 1 互换。两片 154 可搭 5 位译码器：最高位接两片的 $\overline{CS_1}$、其反接另一片的（讲义第 34 张）。与 138 的差别不止位数：138 只有 8 根输出、一根高有效加两根低有效使能；154 有 16 根、两根低有效使能，故更适合当解复用器（位数越多，一次分配的选择余地越大）。

## 题型 10.7 74HC42 BCD-十进制译码器（讲义有、真题未考）
本节**讲义有、真题未考**（Chapter 6 讲义第 35 张）。四套期中卷未直接出题，但 10.6 的 154 与 10.5 的 138 说明这一族随时可能换型号考。
### 识别特征
"BCD-to-decimal"、"4-line-to-10-line"，输入是 BCD 码，输出 10 根且带气泡。
### 原题
讲义只给一句规格：
> 4-line-to-10-line decoder: only the ten decimal digits 0 through 9.
### 官方答案
Pins: $A_0,A_1,A_2,A_3$ at 15, 14, 13, 12 (weighted 1, 2, 4, 8); OUT0~OUT9 at 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, each with a bubble (active-LOW output). For $0\sim9$ the selected output is 0 and the other nine are 1; for $1010\sim1111$ all ten stay 1, i.e. $OUT_j=\overline{m_j}$ ($j=0,\dots,9$). The right half of the slide is a timing chart: $A_0$ toggles every cell, $A_1$ every two cells, $A_2$ every four, $A_3$ every eight.
### 解题步骤
1. **认输出极性**：低有效，选中为 0，未选中为 1。
2. **认地址空间**：只用 10 个码字，$1010\sim1111$ 是「无人认领」的码。
3. **接函数**：SOP 用与非门接 $\bar Y_j$（$j$ 取函数为 1 的位号），POS 用与门接 0 行；位号只能取 0~9。
### 答案复盘
- 与 154 的差别不在极性（两者都低有效），而在**地址空间**：154 用满 16 个码，42 只用 10 个。非法码时 154 仍有一根输出 0，42 则十根全 1——前者「选中一条空路」，后者「什么都不选」。正因为多出来的六个码输出全 1，用 42 实现函数前必须确认函数在 $1010\sim1111$ 上取什么值，否则电路在这六行会出错。
### 易错点
- 以为非法码会输出 0 或乱码（那是仿真器件的毛病，纯组合译码器只会「全 1」）。
- 把 10 根输出当 16 根数，地址给到 $1111$ 还在找第 11 根线。
### 变体
用 42 做「质数数字检测」（数字为 2、3、5、7 时 $Y=1$）：$Y=\overline{\bar Y_2\bar Y_3\bar Y_5\bar Y_7}$，一个 4 输入与非门。地址落到 $1010\sim1111$ 时十根全 1，与非门输出 0，正好表示「这不是一个十进制数字」，非法码被顺带处理掉。

## 题型 10.8 74HC85 数值比较器读图与级联（讲义有、真题未考）
本节**讲义有、真题未考**：Chapter 6 讲义第 22–23 张，四套期中卷未直接出题，但属于考纲内的「读图 + 级联」。
### 识别特征
给 74HC85 的引脚图或功能表，问某组输入下的三个输出；或用两片比较 8 位数。
### 原题
讲义第 23 张的级联图：低位片收 $A_0\sim A_3$、$B_0\sim B_3$，高位片收 $A_4\sim A_7$、$B_4\sim B_7$；低位片的 $Q_{A>B},Q_{A=B},Q_{A<B}$ 分别接高位片的三个同名级联输入 $I_{A>B},I_{A=B},I_{A<B}$，结果从高位片取。图注原文：
> Note the lowest-order comparator must have　• A HIGH on the $A=B$ input and　• LOWs on the $A>B$ and $A<B$ inputs.
### 官方答案
The lowest-order chip must have $I_{A=B}=1$ and $I_{A>B}=I_{A<B}=0$; only the top chip's three outputs are valid. Pins: $A_3\sim A_0$ at 15, 13, 12, 10; $B_3\sim B_0$ at 1, 14, 11, 9; cascade inputs $I_{A<B},I_{A=B},I_{A>B}$ at 2, 3, 4; outputs $Q_{A>B},Q_{A=B},Q_{A<B}$ at 5, 6, 7; $V_{CC}$ 16, GND 8.

<svg viewBox="0 0 470 200" width="470" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="100" y="36" width="96" height="140" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="288" y="36" width="96" height="140" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <text x="148" y="30" text-anchor="middle" font-size="11">低位片</text><text x="336" y="30" text-anchor="middle" font-size="11">高位片</text>
  <path d="M56,56 H100 M56,76 H100 M56,112 H100 M56,130 H100 M56,148 H100 M210,56 H288 M210,76 H288" stroke="#333" stroke-width="1.4" fill="none"/>
  <text x="52" y="60" text-anchor="end" font-style="italic">A0-A3</text><text x="52" y="80" text-anchor="end" font-style="italic">B0-B3</text><text x="52" y="116" text-anchor="end">+5 V</text><text x="52" y="134" text-anchor="end">0 V</text><text x="52" y="152" text-anchor="end">0 V</text>
  <text x="234" y="50" text-anchor="middle" font-size="10" font-style="italic">A4-A7</text><text x="234" y="70" text-anchor="middle" font-size="10" font-style="italic">B4-B7</text>
  <g font-size="10"><text x="106" y="60">A0-A3</text><text x="106" y="80">B0-B3</text><text x="106" y="116">I A&gt;B</text><text x="106" y="134">I A=B</text><text x="106" y="152">I A&lt;B</text><text x="190" y="116" text-anchor="end">Q A&gt;B</text><text x="190" y="134" text-anchor="end">Q A=B</text><text x="190" y="152" text-anchor="end">Q A&lt;B</text></g>
  <g font-size="10"><text x="294" y="60">A4-A7</text><text x="294" y="80">B4-B7</text><text x="294" y="116">I A&gt;B</text><text x="294" y="134">I A=B</text><text x="294" y="152">I A&lt;B</text><text x="378" y="60" text-anchor="end">Q A&gt;B</text><text x="378" y="80" text-anchor="end">Q A=B</text><text x="378" y="100" text-anchor="end">Q A&lt;B</text></g>
  <path d="M196,112 H288 M196,130 H288 M196,148 H288" stroke="#333" stroke-width="1.4" fill="none"/>
  <path d="M384,56 H430 M384,76 H430 M384,96 H430" stroke="#333" stroke-width="1.4" fill="none"/>
  <text x="436" y="60" font-style="italic">A&gt;B</text><text x="436" y="80" font-style="italic">A=B</text><text x="436" y="100" font-style="italic">A&lt;B</text>
</svg>

图 10-4　两片 74HC85 级联：低位片预置 $1/0/0$，三个结果按名接到高位片，最终只读高位片的三根输出。
### 解题步骤
1. **认三组脚**：4 位比较输入、3 根级联输入、3 根输出，名称一一对应，接错方向最致命。
2. **用一条规则代替 11 行功能表**：从 $A_3/B_3$ 往低位扫，第一个不等的位决定输出；四位全等则三个输出**等于三个级联输入**（功能表最后三行）。
3. **预置最低片、只取最高片**：$I_{A=B}=1$、另两根 0——下面没有更低的位，「更低位全相等」天然成立；最终答案从最高位片读。
### 答案复盘
- **为什么必须预置 $1/0/0$**：功能表最后三行说「四位全等时输出 = 级联输入」。若把 $I_{A=B}$ 也接 0，两数完全相等时三个输出全 0，全等被判成「谁都不大于」。
- **为什么要「低位相等才看高位」**：低位片无从知道上面还有没有更高位，它只能算出「假设高位全等时」的结论，经级联输入往上送；高位片四位不等时直接用自己判，等于把这个假设作废。这与加法器级联方向相反——加法的进位从低位流到高位、每片的和位都有效；比较器只有最高片那片的结论有效。
- **为什么不能把两片的输出「或」起来**：$A>B$ 是全局结论，低位片 $Q_{A>B}=1$ 不代表整体 $A>B$（上面可能更大，也可能更小或相等）。
### 易错点
- 三根级联线接错位：$A>B$ 接到 $A<B$，比较结果整体反向。
- 高位片级联输入悬空（CMOS 按高处理）：误判为相等。
- 位序接反：脚 1 是 $B_3$ 不是 $B_0$，脚 10 是 $A_0$ 不是 $A_3$。
### 变体
三片级联成 12 位：最低片预置 $1/0/0$，中间片与最高片各接下一片的三根输出。只比 4 位、不用级联时也要预置 $1/0/0$。例：$A=1001\,1000$、$B=1001\,0111$，高位片四位全等 $\to$ 透传低位片的 $Q_{A>B}\to$ 最终 $A>B$；而 $A=1100\,0000$、$B=1011\,1111$ 时高位片 $1100>1011$ 已定结论，低位片被无视。

## 题型 10.9 74HC147 优先编码器读图（讲义有、真题未考）
本节**讲义有、真题未考**：Chapter 6 讲义第 26–28 张（含键盘编码器例题），四套期中卷未直接出题，但属于读图范围。
### 识别特征
给 74HC147 的引脚图或键盘接法，问某几根输入为 LOW 时输出是什么，或问优先级的含义。
### 原题
讲义第 27 张例题（原文照抄，幻灯片里 "74HC147" 与 "Pin 4" 之间是一个损坏的箭头字形，此处记为 $\to$）：
> If LOW levels appear on pins, 1, 4, and 13 of the 74HC147 $\to$ Pin 4 is the highest-order decimal digit input having a LOW level and represents decimal 7. Therefore, the output levels indicate the BCD code for decimal 7
### 官方答案
The three LOW pins are $D_4$ (pin 1), $D_7$ (pin 4) and $D_3$ (pin 13); the highest-numbered one, $D_7$, wins, so the answer is decimal 7 = BCD $0111$. The four outputs carry bubbles (labelled BCD complement on the slide), so the pin levels are $\overline{A_3A_2A_1A_0}=1000$.

| Signal | Pin | Signal | Pin |
|---|---|---|---|
| $D_1\sim D_4$ | 11、12、13、1 | $D_5\sim D_9$ | 2、3、4、5、10 |
| $\overline{A_0},\overline{A_1},\overline{A_2},\overline{A_3}$ | 9、7、6、14 | NC 15、$V_{CC}$ 16、GND 8 | — |

All nine inputs are active LOW and priority follows the digit number ($D_9$ highest); there is no $D_0$ input, and with no input LOW the outputs are all HIGH, i.e. the same code as $D_0$ LOW.
### 解题步骤
1. **把引脚号翻成信号名**：pin 1、4、13 分别是 $D_4$、$D_7$、$D_3$。
2. **取编号最大者**：优先级 = 数字编号，最大者胜出，其余全部忽略。
3. **写 BCD 码再按极性取反**：$7$ 即 $A_3A_2A_1A_0=0111$，四根输出带气泡，故引脚电平为 $1000$。
### 答案复盘
- **为什么讲义只说「输出电平指示 BCD 码」**：它讲的是功能，没走「取反」这一步；把 $0111$ 直接写在带气泡的输出脚上，是本题最常见的失分点。
- **优先级为什么能压缩真值表**：$D_7$ 有效那一行其余输入全写 X（don't care），9 行就代替了 $2^{9}$ 行；「输入低有效」由键盘接法保证——按键接地得 LOW，上拉电阻保证未按时为 HIGH。
- **为什么没有 $D_0$ 输入**：0 的码是 $0000$，与「无输入」的输出完全相同，所以干脆不设这根线，靠「没有任何键按下」隐含数字 0。
### 易错点
- 把 pin 4 当成「第 4 号数字」：引脚号与数字编号无关，$D_7$ 才在 pin 4。
- 忘了取反、直接把 $0111$ 写在输出脚上。
- 取编号最小的有效输入，或把多根有效输入的码相加。
### 变体
8 线-3 线优先编码器（讲义第 28 张）：输出 3 位，$D_7$ 最高优先。若问「$D_2$ 与 $D_9$ 同时有效」，$D_9$ 胜出，BCD 码 $1001$，引脚电平 $0110$。

## 章末自测
1. 三变量函数 $Y=\Sigma m(0,2,5,7)$，用 74HC151 实现（$S_2S_1S_0=ABC$），写出八根数据端。
2. 四变量函数 $Y=\Sigma m(3,7,11,15)$，用 74HC151 实现（$S_2S_1S_0=ABC$），写出八根数据端，并说出它的化简结果。
3. 某四变量函数折叠后得 $(D_0,\dots,D_7)=(0,1,D,\bar D,1,0,D,1)$，写出它的 $\Sigma m$。
4. 用 4 位译码器（低有效输出）和最少门实现 $Y=\Sigma m(0,5,9,14)$，写出门型与取脚。
5. 用 74HC138 实现 $F=\Pi M(1,4,6)$（三变量），写出门型、取脚与三根使能端的接法。
6. 74HC154 的 $\overline{CS_1}$ 接串行数据 1、$\overline{CS_2}$ 接 0 V、地址为 8，问 16 根输出各是什么值。
7. 74HC147 的 pin 3 与 pin 10 同时为 LOW，输出引脚电平是多少？

## 自测答案
1. $(\bar D,\bar D,D,D,0,0,0,0)$：$000\to m_0,m_1=1,0$ 得 $\bar D$；$001\to m_2,m_3=1,0$ 得 $\bar D$；$010\to m_4,m_5=0,1$ 得 $D$；$011\to m_6,m_7=0,1$ 得 $D$；其余四组两行全 0。
2. $(0,D,0,D,0,D,0,D)$：该函数即 $Y=CD$，与 $A,B$ 无关，故只有 $C=1$ 的四个奇数选择码接 $D$。
3. $001\to m_2,m_3$、$010\to m_5$、$011\to m_6$、$100\to m_8,m_9$、$101$ 空、$110\to m_{13}$、$111\to m_{14},m_{15}$，即 $\Sigma m(2,3,5,6,8,9,13,14,15)$。
4. $Y=\overline{\bar Y_0\bar Y_5\bar Y_9\bar Y_{14}}$，一个 4 输入与非门；地址 8、4、2、1 分别接 $A,B,C,D$。
5. POS 与低有效输出都用「与」：$F=\bar Y_1\bar Y_4\bar Y_6$，一个 3 输入与门；$S_1=+5$ V，$\bar S_2=\bar S_3=0$ V。
6. 数据脚为 1 即整片禁止，16 根输出全为 1（数据为 0 时才在 $D_8$ 出现 0）。这正是 10.6 中「数据为 1 时一行全 1」的来源。
7. pin 3 是 $D_6$、pin 10 是 $D_9$，$D_9$ 胜出，BCD $1001$，四根低有效输出为 $0110$（pin 14 $=0$、pin 6 $=1$、pin 7 $=1$、pin 9 $=0$）。
