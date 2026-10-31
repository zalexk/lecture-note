---
title: 11 延迟、时序与毛刺
---

# 11 延迟、时序与毛刺

> **真题分布**：M2025f Q5（12 分）；M2026 Q5(2)（6 分）；M2024 Q5(2)(3)（8 分）；M2025s Q7(2)（3 分）；HW3 Q5、Q7　|　**考频**：4/4 年，每年 3–12 分
> **一句话**：给一张门延迟表或一段输入波形，算出电路"最慢多久稳定、最快多久会动"，并画出被延迟拉歪的波形。

## 这个课题在考什么

- 组合电路没有瞬时响应：每个门都有延迟，信号沿不同路径到达输出的时刻各不相同。
- 于是有两个数：**最长**多久输出一定稳定（$t_{pd}$），**最短**多久输出可能开始变化（$t_{cd}$）。
- 出题只有三种形态：给延迟表算这两个数；给输入波形画输出；给一个"理论上不该变"的输出，问中间为什么凹了一下（毛刺）。
- 得分点在**路径枚举表**：每条输入到输出的路径列全、逐条相加、再取 max/min。只写一个数字通常拿不到分。

## 必备知识

| 概念 | 含义 | 取哪条路径 |
|---|---|---|
| 传播延迟（propagation delay）$t_{pd}$ | 输入跳变后，输出**稳定**所需的最长时间 | 所有路径延迟和的 **max** |
| 污染延迟（contamination delay）$t_{cd}$ | 输入跳变后，输出**可能开始**变化的最短时间 | 所有路径延迟和的 **min** |
| 关键路径（critical path） | 延迟和最大的那条输入到输出路径 | 决定 $t_{pd}$ |
| 最短路径 | 延迟和最小的那条 | 决定 $t_{cd}$ |
| 毛刺（glitch） | 输出本应保持，却因两条路径不等长而短时翻转 | 宽度由两条路径之差决定 |
| 静态 1 冒险（static-1 hazard） | 输出应保持 1，却出现 0 凹陷 | 与或式中两条积项"交接"失败 |
| 静态 0 冒险（static-0 hazard） | 输出应保持 0，却出现 1 尖峰 | 或与式中两条和项"交接"失败 |

- 延迟沿路径**相加**，不是逐级取 max；只在最后、在所有路径之间取 max/min。
- 一个门只计一次：信号从门的哪个输入进，延迟都按该门查表；反相器也是门，照样查表。
- 没给延迟的波形题按零延迟画：竖直边只出现在输入跳变处。

## 通用流程：路径枚举法

1. **给节点编号**：每个门的输出起名 $n_1,n_2,\dots$，总输出记作 $Y$。
2. **从每个输入走到 $Y$**：沿导线方向前进，穿过遇到的每一个门。
3. **记录门序列**：写进表格，如 `D → NAND2(n2) → NOR2(n4) → NAND2(Y)`。
4. **累加**：$t_{pd}$ 用每级 $t_{pd}$ 相加，$t_{cd}$ 用每级 $t_{cd}$ 相加。
5. **取极值**：$t_{pd}=\max$，$t_{cd}=\min$；取到 max 的那一行就是关键路径。

> 第 4 步能直接相加，是因为路径串联：信号必须依次穿过每个门。若各输入到达时刻不同，把该输入的到达时刻 $a_i$ 加在路径和之前：$T_{\text{settle}}=\max_{p}\big(a_{\text{start}(p)}+\sum_{g\in p}t_{pd}(g)\big)$，$T_{\text{change}}=\min_{p}\big(a_{\text{start}(p)}+\sum_{g\in p}t_{cd}(g)\big)$。

## 题型 11.1 给门延迟表，求整电路 $t_{pd}$ 与 $t_{cd}$

### 识别特征

题干出现 "Determine the propagation delay and contamination delay of the circuit below" 加一张 Gate / $t_{pd}$ / $t_{cd}$ 表，电路是多级与非/或非混排。

### 原题

> 5. (12 points) Determine the propagation delay and contamination delay of the circuit below.
>
> Use the gate delays given below.

| Gate | $t_{pd}$ (ps) | $t_{cd}$ (ps) | | Gate | $t_{pd}$ (ps) | $t_{cd}$ (ps) |
|---|---|---|---|---|---|---|
| NOT | 15 | 10 | | 3-input AND | 40 | 30 |
| 2-input NAND | 20 | 15 | | 2-input OR | 40 | 30 |
| 3-input NAND | 30 | 25 | | 3-input OR | 55 | 45 |
| 2-input NOR | 30 | 25 | | 2-input XOR | 60 | 40 |
| 3-input NOR | 45 | 35 | | 2-input AND | 30 | 25 |

<svg viewBox="0 0 470 200" width="470" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <g stroke="#333" stroke-width="1.4" fill="none"><path d="M32,33 H100"/><path d="M32,40 H100"/><path d="M32,47 H100"/><path d="M137,40 H165 V87 H185"/><path d="M32,101 H185"/><path d="M32,131 H240"/><path d="M32,159 H185"/><path d="M32,173 H185"/><path d="M218,166 H232 V145 H240"/><path d="M222,94 H290 V99 H300"/><path d="M277,138 H295 V113 H300"/><path d="M337,106 H345 V99 H360"/><path d="M345,106 V113"/><path d="M345,113 H360"/><path d="M397,106 H412"/></g>
  <g fill="#fff" stroke="#333" stroke-width="1.4"><g transform="translate(100,26)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><circle cx="133.5" cy="40" r="3.5"/><g transform="translate(185,80)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><circle cx="218.5" cy="94" r="3.5"/><g transform="translate(185,152)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><g transform="translate(240,124)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z"/></g><circle cx="273.5" cy="138" r="3.5"/><g transform="translate(300,92)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z"/></g><circle cx="333.5" cy="106" r="3.5"/><g transform="translate(360,92)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><circle cx="393.5" cy="106" r="3.5"/></g>
  <g fill="#333"><text x="10" y="37" font-style="italic">A</text><text x="10" y="44" font-style="italic">B</text><text x="10" y="51" font-style="italic">C</text><text x="10" y="105" font-style="italic">D</text><text x="10" y="135" font-style="italic">E</text><text x="10" y="163" font-style="italic">F</text><text x="10" y="177" font-style="italic">G</text><text x="416" y="110" font-style="italic">Y</text><text x="146" y="34" font-size="11">n1</text><text x="226" y="88" font-size="11">n2</text><text x="281" y="132" font-size="11">n3</text><text x="341" y="100" font-size="11">n4</text></g>
</svg>

### 官方答案

> **无官方答案**（M2025f 全卷无解答）。以下数值自算，已用 Python 枚举全部路径复核。

$$t_{pd}=110\ \text{ps},\qquad t_{cd}=55\ \text{ps},\qquad \text{critical path: }F\to n_3\to n_4\to Y$$

### 解题步骤

1. **编号**：$n_1$ 为 3 输入与非输出，$n_2$ 为上面 2 输入与非输出，$n_3$ 为或非输出，$n_4$ 为中间或非输出；末级与非两输入短接，作反相器。先编号是为了后面只写节点名。
2. **查门型**：$n_1$ 是 **3 输入**与非（$A,B,C$ 三个脚），不能按 2 输入算。
3. **列路径**：从每个输入沿导线走到 $Y$，见下表。
4. **分别累加**：$t_{pd}$ 列用 $t_{pd}$ 相加，$t_{cd}$ 列用 $t_{cd}$ 相加。
5. **取极值**：max 行即关键路径，要写清起点、终点与门序列。

| 输入 | 经过的门（输入 → 输出） | $t_{pd}$ 和 | $t_{cd}$ 和 |
|---|---|---|---|
| $A$（$B,C$ 同） | NAND3($n_1$) → NAND2($n_2$) → NOR2($n_4$) → NAND2($Y$) | $30+20+30+20=100$ | $25+15+25+15=80$ |
| $D$ | NAND2($n_2$) → NOR2($n_4$) → NAND2($Y$) | $20+30+20=70$ | $15+25+15=55$ |
| $E$ | NOR2($n_3$) → NOR2($n_4$) → NAND2($Y$) | $30+30+20=80$ | $25+25+15=65$ |
| $F$（$G$ 同） | AND2 → NOR2($n_3$) → NOR2($n_4$) → NAND2($Y$) | $30+30+30+20=110$ | $25+25+25+15=90$ |

$$\Rightarrow\ t_{pd}=\max\{100,70,80,110\}=110\ \text{ps},\qquad t_{cd}=\min\{80,55,65,90\}=55\ \text{ps}$$

### 答案复盘

- **为什么 $F/G$ 最长**：它与 $A$ 路径同为 4 级，但第二级一个是 NAND2(20)、一个是 NOR2(30)，差 10 ps。"级数相同"不等于"延迟相同"，必须看门型。
- **为什么 $t_{cd}$ 出自另一条路**：$t_{cd}$ 取最小，$D$ 只串 3 级门，最早被影响。所以 $t_{pd}$ 与 $t_{cd}$ 不能在同一条路径上读。
- **末级那一点**：图上短接的与非仍按 2 输入与非取 20/15；若按 NOT 取 15/10，答案变成 105/50，是常见扣分点。另外 $A,B,C$ 是同一门的三个脚，路径相同，表中合并一行即可。

> **勘误（题型清单）**：《题型清单》第 11 节把 M2025f Q5 记为"$A/B/C$ 路径最长"，与门表不符。$A$ 路径为 100 ps，$F/G$ 路径为 110 ps，最长的是 $F/G$。考试按 110 ps 作答。

### 易错点

- 把 3 输入与非按 2 输入算（$n_1$ 少 10 ps）。
- 逐级取 max 后再相加，得到偏大的数。
- 用同一条路径同时读 $t_{pd}$ 与 $t_{cd}$。
- 只写两个数字，不写关键路径的门序列。

### 变体

- 问"$Y$ 何时稳定"：答相对输入跳变的 $110\ \text{ps}$，前提是各输入同时到达。
- 给每个输入的到达时刻：把到达时刻加在表右侧再取 max/min（公式见上文）。
- 问"换哪个门最能降低 $t_{pd}$"：只能换关键路径上的门，且新值要低于次长路径 100 ps 才真正有效。

## 题型 11.2 含反相器与多输入门：关键路径与最短路径分离

### 识别特征

每个输入先经一个反相器，再进一组与门，最后汇到一个多输入或门。要求同上，但必须注意**反相器多一级**、**末级是多输入门**。

### 原题

> Q7 Determine the propagation delay and contamination delay of the circuit below.
>
> Use the gate delays given below.

| Gate | $t_{pd}$ (ps) | $t_{cd}$ (ps) | | Gate | $t_{pd}$ (ps) | $t_{cd}$ (ps) |
|---|---|---|---|---|---|---|
| NOT | 15 | 10 | | 3-input AND | 40 | 30 |
| 2-input NAND | 20 | 15 | | 2-input OR | 40 | 30 |
| 3-input NAND | 30 | 25 | | 3-input OR | 55 | 45 |
| 2-input NOR | 30 | 25 | | 2-input XOR | 60 | 40 |
| 3-input NOR | 45 | 35 | | 2-input AND | 30 | 25 |
| | | | | 4-input OR | 100 | 70 |

<svg viewBox="0 0 430 215" width="430" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <g stroke="#333" stroke-width="1.4" fill="none"><path d="M36,20 H205"/><path d="M36,70 H205"/><path d="M36,120 H205"/><path d="M60,20 V45 H72"/><path d="M60,70 V95 H72"/><path d="M60,120 V145 H72"/><path d="M150,20 V134 H205"/><path d="M160,70 V34 H205"/><path d="M168,120 V84 H205"/><path d="M99,45 H124 V177 H205"/><path d="M99,95 H118 V184 H205"/><path d="M99,145 H112 V191 H205"/><path d="M238,27 H290 V91 H320"/><path d="M238,77 H296 V97 H320"/><path d="M238,127 H302 V103 H320"/><path d="M238,184 H308 V109 H320"/><path d="M350,98 H372"/></g>
  <g fill="#333"><circle cx="150" cy="20" r="2.5"/><circle cx="160" cy="70" r="2.5"/><circle cx="168" cy="120" r="2.5"/><circle cx="60" cy="20" r="2.5"/><circle cx="60" cy="70" r="2.5"/><circle cx="60" cy="120" r="2.5"/></g>
  <g fill="#fff" stroke="#333" stroke-width="1.4"><g transform="translate(72,31)"><path d="M0,0 L20,14 L0,28 Z"/></g><circle cx="95.5" cy="45" r="3.5"/><g transform="translate(72,81)"><path d="M0,0 L20,14 L0,28 Z"/></g><circle cx="95.5" cy="95" r="3.5"/><g transform="translate(72,131)"><path d="M0,0 L20,14 L0,28 Z"/></g><circle cx="95.5" cy="145" r="3.5"/><g transform="translate(205,13)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><g transform="translate(205,63)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><g transform="translate(205,113)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><g transform="translate(205,170)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z"/></g><g transform="translate(320,84)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z"/></g></g>
  <g fill="#333"><text x="12" y="24" font-style="italic">R</text><text x="12" y="74" font-style="italic">A</text><text x="12" y="124" font-style="italic">G</text><text x="376" y="102" font-style="italic">Z</text><text x="243" y="24" font-size="11">a1</text><text x="243" y="74" font-size="11">a2</text><text x="243" y="124" font-size="11">a3</text><text x="243" y="181" font-size="11">a4</text></g>
</svg>

### 官方答案

> **无官方答案**（HW3 无解答）。以下数值自算，已用 Python 枚举全部路径复核。

$$Z=\bar RA+AG+GR+\bar R\bar A\bar G,\qquad t_{pd}=155\ \text{ps},\qquad t_{cd}=95\ \text{ps}$$

### 解题步骤

1. **读结构**：三个输入各带一个反相器；四个与门 $a_1=RA$、$a_2=AG$、$a_3=GR$、$a_4=\bar R\bar A\bar G$（**3 输入**）；末级是 **4 输入或门**。
2. **确认脚数**：$a_4$ 三个输入脚、末级或门四个输入脚，都要查对应表行。
3. **两条支路分开枚举**：直接支路（不经反相器）与反相支路。
4. **累加取极值**：直接支路 2 级，反相支路 3 级。
5. **两条路径都要写**：本题关键路径与最短路径不同。

| 输入 | 经过的门 | $t_{pd}$ 和 | $t_{cd}$ 和 |
|---|---|---|---|
| $R$ | AND2($a_1$) → OR4($Z$) | $30+100=130$ | $25+70=95$ |
| $R$ | AND2($a_3$) → OR4($Z$) | $130$ | $95$ |
| $R$ | NOT → AND3($a_4$) → OR4($Z$) | $15+40+100=155$ | $10+30+70=110$ |
| $A$ | AND2($a_1$) 或 AND2($a_2$) → OR4 | $130$ | $95$ |
| $A$ | NOT → AND3($a_4$) → OR4 | $155$ | $110$ |
| $G$ | AND2($a_2$) 或 AND2($a_3$) → OR4 | $130$ | $95$ |
| $G$ | NOT → AND3($a_4$) → OR4 | $155$ | $110$ |

$$\Rightarrow\ t_{pd}=155\ \text{ps},\qquad t_{cd}=\min\{95,110\}=95\ \text{ps}$$

### 答案复盘

- **为什么反相支路最长**：比直接支路多一级 NOT（+15），且末级与门是 3 输入（40 而非 30），两项叠加 $+25$，把 130 抬到 155。
- **为什么 $t_{cd}$ 出自直接支路**：直接支路只有"2 输入与 + 4 输入或"两级，是最短通道；反相支路按污染延迟算仍是三级。
- **末级按 100 算**：4 输入或门在表里单独一行，不能按 3 输入或门（55/45）算，也不能用两个 2 输入或门级联（$40+40$）代替——除非题目允许自己搭。
- **三个输入并列**：$R,A,G$ 结构对称，只需枚举"直接/反相"两类，不必写九行。

### 易错点

- 漏掉反相器一级（把 155 写成 140）。
- 把 $a_4$ 当 2 输入与门（40 写成 30）。
- 末级按 3 输入或门查表（100 写成 55）。

### 变体

- 只问"$Z$ 最早何时可能变化"：答 95 ps，并指出发生在直接驱动的那两个与门上。
- 给出各输入到达时刻 $a_i$：把 $a_i$ 加到对应各行两个和上，再取 max/min。
- 末级换成与非门：逻辑反转，延迟算法不变，只换表行。

## 题型 11.3 由表达式与输入波形画输出波形（含内部节点）

### 识别特征

题干给电路图与输入波形，要求 "determine the timing diagram showing the outputs of $G_1$, $G_2$ and $G_3$"。题中**不给门延迟**，按理想（零延迟）画。

### 原题

> 5. (10 points) Given the below circuit,
>
> (1) (4 points) Derive the boolean expression for the output $X$ with the inputs $A$ and $B$.
>
> (2) (6 points) If the input waveforms are applied as indicated, determine the timing diagram showing the outputs of $G_1$, $G_2$ and $G_3$.

### 官方答案

> (1) $X=AB+\bar A\bar B$　(2) 波形如下（$A$ 起始为高、$B$ 起始为低，七个跳变点 $t_1\sim t_7$）。

<svg viewBox="0 0 300 300" width="300" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:12px">
  <g stroke="#ccc" stroke-width="1" stroke-dasharray="4,3"><path d="M90,20 V278"/><path d="M119,20 V278"/><path d="M141,20 V278"/><path d="M154,20 V278"/><path d="M167,20 V278"/><path d="M202,20 V278"/><path d="M222,20 V278"/></g>
  <g fill="none" stroke-width="2" stroke-linejoin="miter"><path d="M55,30 H90 V50 H141 V30 H167 V50 H222 V30 H262" stroke="#1a73e8"/><path d="M55,104 H119 V84 H154 V104 H202 V84 H262" stroke="#1a73e8"/><path d="M55,158 H141 V138 H154 V158 H222 V138 H262" stroke="#b3261e"/><path d="M55,212 H90 V192 H119 V212 H167 V192 H202 V212 H262" stroke="#b3261e"/><path d="M55,266 H90 V246 H119 V266 H141 V246 H154 V266 H167 V246 H202 V266 H222 V246 H262" stroke="#b3261e"/></g>
  <g fill="#333"><text x="86" y="14">t1</text><text x="115" y="14">t2</text><text x="137" y="14">t3</text><text x="150" y="14">t4</text><text x="163" y="14">t5</text><text x="198" y="14">t6</text><text x="218" y="14">t7</text><text x="28" y="38" font-style="italic">A</text><text x="28" y="112" font-style="italic">B</text><text x="6" y="146" font-style="italic">G2</text><text x="6" y="200" font-style="italic">G3</text><text x="28" y="254" font-style="italic">X</text></g>
</svg>

### 解题步骤

1. **先化简**：$G_2=AB$，$G_3=\bar A\bar B$，$X=AB+\bar A\bar B$（化简属 05/06）。式子越简单，后面越不易错。
2. **标跳变点**：把每条输入跳变的时刻编号 $t_1,\dots,t_7$，它们把时间轴切成 8 段。
3. **逐段求值**：每段取一个中点，读出 $(A,B)$，代入三个式子。
4. **画竖边**：只在跳变点处画竖直边；相邻两段取值相同的，该处**不画**边。
5. **自检**：每一段都必须满足 $X=G_2+G_3$。

| 区间 | $A$ | $B$ | $G_2=AB$ | $G_3=\bar A\bar B$ | $X$ |
|---|---|---|---|---|---|
| $[0,t_1]$ | 1 | 0 | 0 | 0 | 0 |
| $[t_1,t_2]$ | 0 | 0 | 0 | 1 | 1 |
| $[t_2,t_3]$ | 0 | 1 | 0 | 0 | 0 |
| $[t_3,t_4]$ | 1 | 1 | 1 | 0 | 1 |
| $[t_4,t_5]$ | 1 | 0 | 0 | 0 | 0 |
| $[t_5,t_6]$ | 0 | 0 | 0 | 1 | 1 |
| $[t_6,t_7]$ | 0 | 1 | 0 | 0 | 0 |
| $[t_7,\cdot]$ | 1 | 1 | 1 | 0 | 1 |

### 答案复盘

- **为什么 $X$ 在每个虚线处都翻一次**：$X$ 是"同或"，而本题输入被安排成每段取值都变，于是输入一动它就动，八段高低交替。
- **为什么 $G_3$ 在 $[t_3,t_4]$ 为 0**：这一段 $A=B=1$，两个反相器输出都是 0，与门输出 0；$G_3$ 只在 $A=B=0$ 时为 1。
- **为什么 $[t_5,t_6]$ 与 $[t_1,t_2]$ 相同**：两段输入组合都是 $(0,0)$，同一输入组合必然同输出，这是自查波形的快捷方式。
- **边没有漏画**：$G_2$ 只在 $t_3,t_4$ 有边，$G_3$ 在 $t_1,t_2,t_5,t_6$ 有边，合起来正好覆盖 $X$ 的七条边。

### 易错点

- 只画 $X$，漏掉内部节点（题目明确要求三个）。
- 在输入跳变处画斜坡或滞后（本题无延迟）。
- 把 $X$ 写成 $AB+\bar AB$（少一个上划线，等于 $B$，波形全错）。
- 遇到两输入同时跳变时按"先后"分别处理；正确做法是先按两段算，再看结果是否相同。

### 变体

- **M2024 Q5(2)(3)**：同一技能，四变量。官方 (1) 已化到 $X=\bar A+B+D$，故 $X$ 只在 $A=1,B=0,D=0$ 时为 0，只需盯这一种组合；$B$ 接地后 $X=\bar A+D$，低电平段缩短。原文：*"(2) (4 points) Draw the output waveform based on the inputs. (3) (4 points) Assuming that the input $B$ is shorted to ground, derive the expression of the output $X$ and draw its waveform."*

## 题型 11.4 固定延迟模型下的毛刺（静态 1 冒险）

### 识别特征

题干出现 "Each AND gate and the OR gate has a propagation delay of 2 ns ... the inverter has a propagation delay of 3 ns"，且 "Assume $B=C=1$ ... $A$ changes from 1 to 0 at $t=0$"，问稳态值、跳变时刻、波形与毛刺宽度。

### 原题

> Q5 Figure 1 implements $F=\overline{A}B+AC$.
>
> Each AND gate and the OR gate has a propagation delay of 2 ns.  The inverter has a propagation delay of 3 ns. Ignore wire delays and use a simple fixed-delay model.
>
> Assume $B=C=1$, the circuit is initially stable, and $A$ changes from 1 to 0 at $t=0$.
>
> 1. Determine the steady-state values of $P$, $Q$, and $F$ before and after the transition.
> 2. Calculate the times at which $P$ and $Q$ change.
> 3. Draw timing waveforms for $A$, $P$, $Q$, and $F$. Label all transition times and the duration of any glitch.

### 官方答案

> **无官方答案**（HW3 无解答）。以下自算，已用 Python 复核时刻与宽度。
>
> 1. Before: $\bar A=0$, $P=0$, $Q=1$, $F=1$. After: $\bar A=1$, $P=1$, $Q=0$, $F=1$.
> 2. $Q$ changes at $t=2\ \text{ns}$; $P$ changes at $t=3+2=5\ \text{ns}$.
> 3. $F$ falls at $t=2+2=4\ \text{ns}$, rises at $t=5+2=7\ \text{ns}$; the glitch lasts $3\ \text{ns}$.

<svg viewBox="0 0 360 240" width="360" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:12px">
  <g stroke="#ccc" stroke-width="1" stroke-dasharray="4,3"><path d="M80,18 V226"/><path d="M136,18 V226"/><path d="M164,18 V226"/><path d="M192,18 V226"/><path d="M220,18 V226"/><path d="M276,18 V226"/></g>
  <g fill="none" stroke-width="2" stroke-linejoin="miter"><path d="M40,30 H80 V50 H345" stroke="#1a73e8"/><path d="M40,104 H220 V84 H345" stroke="#b3261e"/><path d="M40,138 H136 V158 H345" stroke="#b3261e"/><path d="M40,192 H192 V212 H276 V192 H345" stroke="#b3261e"/></g>
  <g stroke="#333" stroke-width="1"><path d="M192,228 H276"/><path d="M192,224 V232"/><path d="M276,224 V232"/></g>
  <g fill="#333"><text x="74" y="14">0</text><text x="132" y="14">2</text><text x="160" y="14">3</text><text x="188" y="14">4</text><text x="216" y="14">5</text><text x="272" y="14">7</text><text x="12" y="38" font-style="italic">A</text><text x="12" y="92" font-style="italic">P</text><text x="12" y="146" font-style="italic">Q</text><text x="12" y="200" font-style="italic">F</text><text x="286" y="232" font-size="11">3 ns</text></g>
</svg>

### 解题步骤

1. **先算稳态**：跳变前后各代一次 $(A,B,C)$，得到波形的两个端点。
2. **列两条路径**：$A\to\bar A\to P\to F$（经反相器）与 $A\to Q\to F$（直通）。
3. **各自累加**：长路 $3+2+2=7\ \text{ns}$，短路 $2+2=4\ \text{ns}$。
4. **定节点时刻**：$Q$ 在 2，$P$ 在 5，$F$ 的两条支路分别在 4 与 7 到达。
5. **看交接**：$F$ 靠哪条支路维持 1，就在它"接通"之前出现空档。
6. **量宽度**：起点 = 短路到达时刻，终点 = 长路到达时刻，宽度 $=7-4=3\ \text{ns}$。

| 节点 | 路径 | 延迟 | 跳变时刻 |
|---|---|---|---|
| $\bar A$ | NOT | 3 ns | 3 |
| $P=\bar AB$ | NOT → AND | $3+2=5$ | 5（0→1） |
| $Q=AC$ | AND | 2 ns | 2（1→0） |
| $F$（先掉） | AND → OR（短路） | $2+2=4$ | 4（1→0） |
| $F$（后升） | NOT → AND → OR（长路） | $3+2+2=7$ | 7（0→1） |

### 答案复盘

- **为什么是静态 1 冒险**：$B=C=1$ 时 $F=\bar A+A\equiv1$，稳态始终 1，输出却掉到 0，属于"应保持 1 而出现凹陷"。
- **为什么毛刺只在 $A$ 由 $1\to0$ 出现**：$1\to0$ 时直通支路 2 ns 就关断，反相支路 5 ns 才接通——**先断后通**，必然空档。若 $A$ 由 $0\to1$，直通支路 2 ns 先接通、反相支路 5 ns 才关断——**先通后断**，全程有支路顶着，无毛刺。
- **为什么从 4 ns 开始、到 7 ns 结束**：4 是短路把"0"送到或门的时刻（该支路的 $t_{pd}$），7 是长路把"1"送到或门的时刻。
- **可直接套用的结论**：毛刺宽度 = 两条路径延迟之差，与门的绝对值无关。

### 易错点

- 把 $P$ 的跳变写成 3 ns（只算反相器，漏了与门）。
- 忘记或门自身的 2 ns，把 $F$ 的边画在 2 与 5；或认为 $F$ 全程为 1，看不出冒险。
- 把毛刺画成"先升后降"（方向反了：应保持 1，凹陷才是毛刺）。
- 只答"有毛刺"，不标起止时刻与宽度。

### 变体

- 问"$A$ 由 $0\to1$ 会怎样"：没有毛刺，理由是先通后断。
- 问"如何消除"：加一致项 $BC$，见下节。
- 问"静态 0 冒险"：把式子写成或与式，如 $F=(A+B)(\bar A+C)$，$B=C=0$ 时 $A$ 由 $0\to1$ 出现向上的尖峰，消除办法是加冗余和项 $(B+C)$。

## 毛刺的消除：冗余项（一致项）

两条积项只差一个变量（$A$ 与 $\bar A$）、其余文字相同，就可能在交接处出空档。补上一致项（consensus）即可：

$$XY+\bar XZ+YZ=XY+\bar XZ \tag{1}$$

两端逻辑等价（共识律），多出的 $YZ$ 不改变功能，只在交接时提供"保持"通路。本题加 $BC$：$F=\bar AB+AC+BC$。

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th rowspan="2" colspan="2" style="border:1px solid #999;padding:4px 10px">A \ BC</th><th colspan="4" style="border:1px solid #999;padding:4px 10px">BC</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">0</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">1</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
</table>

- 组 1（蓝，$m_1,m_3$）→ $\bar AB$；组 2（红，$m_5,m_7$）→ $AC$；组 3（绿，$m_3,m_7$）→ $BC$，即补上的一致项。
- 三个圈互有重叠，逻辑上多余，**物理上必要**：$B=C=1$ 时 $BC$ 恒为 1，$A$ 怎么变都不断路。
- 判定口诀：两个圈"贴着"却不相交，交界那一格就是冒险发生处；把两圈共用的那一格再圈一次即可。

## 关键路径的迁移：阵列乘法器（详见 09）

M2025s Q7(2) 用同一套方法，只是电路更大：4×4 阵列乘法器，加法器延迟 $t$、与门 $0.1t$，官方答案 $8.1t$。此处不重复推导，只抽方法：

1. 从**输出**反向追到输入（乘法器从 $O_6$ 追，不走 $O_0$）。
2. 数路径上的门：$8$ 个加法器串联 $+\,1$ 个与门 $=8t+0.1t$。
3. 比较候选路径，取 max 后仍是 $8.1t$；关键路径要画在图上，从 $A_0$ 出发串过三条进位链，终止于 $O_6$。

## 组合逻辑的时序约束

- $t_{pd}$ 决定**最长**路径：时钟周期必须大于它（再加下级触发器的建立时间 setup time），否则数据来不及。
- $t_{cd}$ 决定**最短**路径：数据不能太快到达下一级（保持时间 hold time 约束），否则会冲掉上一拍的值。
- 考题若只给门延迟表、不给触发器参数，这两句各写一行即可。

## 自测题

1. 电路：$A,B$ 进 2 输入与非得 $n_1$，$n_1$ 与 $C$ 进 2 输入或非得 $Y$。用 11.1 的表求 $t_{pd}$、$t_{cd}$，并写出两条路径。
2. $F=A\bar B+BC$，$A=C=1$ 时 $B$ 由 $1\to0$ 会不会有毛刺？指出类型与消除项。
3. 判断：$t_{cd}$ 取自最长路径。说明理由。

### 自测题答案

1. 路径 $A\to$NAND2$\to$NOR2$\to Y$（$B$ 同）：$20+30=50$；路径 $C\to$NOR2$\to Y$：30。故 $t_{pd}=50$，$t_{cd}=\min(15+25,\,25)=25$。
2. 会。$A=C=1$ 时 $F=\bar B+B\equiv1$，$\bar B$ 支路多一级反相器，$B$ 由 $1\to0$ 时先断后通，属静态 1 冒险；消除项 $AC$，即 $F=A\bar B+BC+AC$。
3. 错。$t_{cd}$ 是输出**最早**可能变化的时刻，取所有路径中的**最小**和；最长路径对应 $t_{pd}$。
