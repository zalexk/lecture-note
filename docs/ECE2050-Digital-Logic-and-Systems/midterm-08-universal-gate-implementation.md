---
title: 08 通用门实现
---

# 08 通用门实现：只用 NAND / 只用 NOR

> **真题分布**：M2025s Q5(2)、M2024 Q6(1)、M2025f Q6(2)、M2026 Q4(3)、HW3 Q3(2)(3)　|　**考频**：4/4 年，单题 3–12 分
> **一句话**：SOP 抄成「与非 + 与非」，POS 抄成「或非 + 或非」；没有反相信号，就用 $X\uparrow X$ 现场造一个。

记号：$X\uparrow Y=\overline{XY}$ 为 NAND（与非门，NAND gate），$X\downarrow Y=\overline{X+Y}$ 为 NOR（或非门，NOR gate）。两者都能单独搭出任意布尔函数，故称通用门（universal gate）。本文「门数」默认指二输入门，用多输入门时另行注明。

## 这个课题在考什么

判分点只有三条：形式对不对（SOP 还是 POS）、极性对不对（气泡数）、门数省不省。题面从不直说「请用 NAND-NAND」，只说 "only NAND gates"、"The complementary inputs are not directly available"。所以第一步永远是把函数化成 SOP 或 POS（化简在 05、07 文件），第二步才谈落地。

落地只有两种正确姿势：两级 NAND 做 SOP，两级 NOR 做 POS；多级电路逐级转换，每跨一级重数一次气泡。下文每条改写都用 Python 穷举 $2^n$ 行真值表复核过。

## 必备知识（只看解题要用的）

| # | 条目 | 规则 |
|---|---|---|
| 1 | NAND 定义 | $X\uparrow Y=\overline{XY}$，输入全 1 才出 0 |
| 2 | NOR 定义 | $X\downarrow Y=\overline{X+Y}$，输入全 0 才出 1 |
| 3 | NAND–NAND | $\overline{\overline{P_1}\cdot\overline{P_2}\cdots}=P_1+P_2+\cdots$，两级实现 SOP |
| 4 | NOR–NOR | $\overline{\overline{S_1}+\overline{S_2}+\cdots}=S_1S_2\cdots$，两级实现 POS |
| 5 | 自造反相器 | $\bar X=X\uparrow X=X\downarrow X$，一个门换一个反相信号 |
| 6 | 气泡推移 | $\overline{AB}=\bar A+\bar B$、$\overline{A+B}=\bar A\bar B$ 的图形版；线上相邻两气泡相加为零 |
| 7 | 扇入 | 一个门的输入个数（fan-in）；只给二输入门时，三文字项必须拆 |
| 8 | 逻辑深度 | 输入到输出经过的门数；两级 NAND 深度为 2 |

- 门数公式：$n$ 项、用到 $k$ 个不同反相文字时，二输入门数 $=n+k+1$。
- 中间结果可被多个门共用，共用是省门的主要手段（题型 8.4）；「反相信号不可得」= 输入端只有 $A,B,C,D$ 原形，凡用 $\bar A$ 处都要花一个门。
- 本课题只讲 NAND/NOR 落地、气泡推移与门数核算；布尔定理与化简见 05 文件，标准 SOP/POS 与卡诺图见 06、07 文件，加法器与 MUX 内部电路见 09、10 文件。

## 三条铁律

### 铁律一　NAND–NAND 就是 SOP

$$F=P_1+P_2+\cdots+P_n=\overline{\overline{P_1}\cdot\overline{P_2}\cdots\overline{P_n}}$$

右侧正是「$n$ 个 NAND 各出 $\overline{P_i}$，再进一个 $n$ 输入 NAND」。示范 $F=AB+\bar CD$（反相信号不可得）：

<svg viewBox="0 0 430 200" width="430" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px"><g transform="translate(110,33)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="143.5" cy="47" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(110,103)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="143.5" cy="117" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(195,103)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="228.5" cy="117" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(290,60)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="323.5" cy="74" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,40 H110 M20,54 H110" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,110 H88 M88,110 H110 M88,110 V124 H110" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="88" cy="110" r="2.5" fill="#333"/><path d="M20,170 H185 V124 H195" stroke="#333" stroke-width="1.4" fill="none"/><path d="M147,47 H270 V67 H290" stroke="#333" stroke-width="1.4" fill="none"/><path d="M147,117 H172 V110 H195" stroke="#333" stroke-width="1.4" fill="none"/><path d="M232,117 H258 V81 H290" stroke="#333" stroke-width="1.4" fill="none"/><path d="M327,74 H400" stroke="#333" stroke-width="1.4" fill="none"/><text x="4" y="44" font-style="italic">A</text><text x="4" y="58" font-style="italic">B</text><text x="4" y="114" font-style="italic">C</text><text x="4" y="174" font-style="italic">D</text><text x="402" y="78" font-style="italic">F</text><text x="152" y="41" font-style="italic">a</text><text x="174" y="106" font-style="italic">b</text><text x="240" y="111" font-style="italic">c</text><text x="112" y="28" font-size="11">n1</text><text x="112" y="98" font-size="11">n2</text><text x="197" y="98" font-size="11">n3</text><text x="292" y="55" font-size="11">n4</text></svg>

图 1　$F=AB+\bar CD$ 的二输入 NAND 实现：4 个门，深度 3。

- **原式**：$F=AB+\bar CD$　**NAND 形式**：$F=(A\uparrow B)\uparrow\big((C\uparrow C)\uparrow D\big)$
- **对应电路**：图 1。$n_1$ 出 $\overline{AB}$，$n_2$ 出 $\bar C$，$n_3$ 出 $\overline{\bar CD}$，$n_4$ 收掉两个反号。

一句一句：第一项乘号换 NAND，先记一个反号；第二项缺 $\bar C$，花一个门造；末级 NAND 一次抹掉两个反号，同时把两项相加。数门 $1+1+1+1=4$，3 门不可能：两个乘积与一个反相已占三门，末级还得一个（穷举确认）。

### 铁律二　NOR–NOR 就是 POS

反号换位置：$F=S_1S_2\cdots S_n=\overline{\overline{S_1}+\overline{S_2}+\cdots+\overline{S_n}}$。看到 "only NOR gates"，第一件事是圈 0、写 POS，而不是照抄 SOP。门数同样是「和项数 + 反相文字数 + 1」。

### 铁律三　反相器自造，气泡推移

"Complemented inputs are not available" 不是障碍，是考点：每缺一个反相信号，就多一个门。

- 造反相：$\bar X=X\uparrow X$（两个输入并接），$\bar X=X\downarrow X$；图上就是一个门、两根线并到同一个脚。
气泡推移（bubble pushing）有四条动作：

| 原图 | 动作 | 结果 |
|---|---|---|
| AND 后面接 OR | OR 换成 NAND，AND 的输出补气泡 | 两级 NAND，气泡推完全消 |
| OR 后面接 AND | AND 换成 NOR，OR 的输出补气泡 | 两级 NOR |
| 一根导线上两个气泡 | 直接画掉，$X=\overline{\overline X}$ | 极性不变 |
| 输出气泡要挪进门内 | 气泡复制到每个输入端 | $\overline{AB}=\bar A+\bar B$ |

- 收尾自检：沿任一路径从输入数气泡到输出，偶数同相、奇数反相；有一条为奇数，极性就错。

## 题型 8.1 只用二输入 NAND 实现「与某变量无关」的函数

### 识别特征

题面形如 "Implement $F$ using only two-input NAND gates. Complemented inputs are not available externally."；函数以最小项列表给出，前一小问还要求指出哪些变量不起作用。

### 原题

> Q3 Consider
>
> $$F(A,B,C,D)=m_0+m_2+m_5+m_7+m_8+m_{10}+m_{13}+m_{15}.$$
>
> 1. Use a Karnaugh map to obtain both a minimum SOP expression and a minimum POS expression. Identify any variables on which $F$ does not depend.
> 2. Implement $F$ using only two-input NAND gates. Complemented inputs are not available externally.
> 3. Implement $F$ using only two-input NOR gates.

### 官方答案

作业卷不附解答，参考答案（已穷举验证）：$F=B\bar D+\bar BD=B\odot D$，对 $A,C$ 无依赖。

$$F=\big(B\uparrow(D\uparrow D)\big)\uparrow\big((B\uparrow B)\uparrow D\big)$$

<svg viewBox="0 0 420 205" width="420" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px"><g transform="translate(100,33)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="133.5" cy="47" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(100,110)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="133.5" cy="124" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(100,160)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="133.5" cy="174" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(200,140)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="233.5" cy="154" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(285,85)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="318.5" cy="99" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,40 H70 M70,40 H100 M70,40 V131 M70,117 H100 M70,131 H100" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="70" cy="40" r="2.5" fill="#333"/><circle cx="70" cy="117" r="2.5" fill="#333"/><path d="M20,54 H100 M45,54 V181 M45,167 H100 M45,181 H100" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="45" cy="54" r="2.5" fill="#333"/><circle cx="45" cy="167" r="2.5" fill="#333"/><path d="M137,124 H175 V147 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M137,174 H185 V161 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M137,47 H265 V92 H285" stroke="#333" stroke-width="1.4" fill="none"/><path d="M237,154 H270 V106 H285" stroke="#333" stroke-width="1.4" fill="none"/><path d="M322,99 H385" stroke="#333" stroke-width="1.4" fill="none"/><text x="4" y="44" font-style="italic">B</text><text x="4" y="58" font-style="italic">D</text><text x="388" y="103" font-style="italic">F</text><text x="140" y="41" font-style="italic">a</text><text x="140" y="118" font-style="italic">b</text><text x="140" y="168" font-style="italic">c</text><text x="240" y="148" font-style="italic">d</text><text x="102" y="28" font-size="11">n1</text><text x="102" y="105" font-size="11">n2</text><text x="102" y="155" font-size="11">n3</text><text x="202" y="135" font-size="11">n4</text><text x="287" y="80" font-size="11">n5</text></svg>

图 2　$F=B\odot D$ 的二输入 NAND 实现：5 个门，深度 3。

### 解题步骤

1. **看依赖**：8 个最小项按 $(B,D)$ 分组，同号时 $F=1$、异号时 $F=0$，对 $A,C$ 的四种取值都成立。
2. **写最小 SOP**：$F=B\bar D+\bar BD$，两项、四文字。
3. **补反相信号，每项一个 NAND，末级再一个**：$\bar B=B\uparrow B$、$\bar D=D\uparrow D$，两个门；于是 $F=(B\bar D)'\uparrow(\bar BD)'$。

### 答案复盘

- **第 1 步决定门数上限**：若没发现与 $A,C$ 无关，8 个四文字项要 8 个反相器 + 8 个 NAND + 1 个 NAND，门数翻三倍。
- **第 3 步的两个门是题目逼出来的**：若允许反相信号，门数降到 3（$n_3,n_4,n_5$）；末级 NAND 则一次抹掉两个反号、把两项相加。
- **5 门确实最少**：穷举全部二输入 NAND 的 1–4 门网络均无解；$A\oplus B$ 只要 4 门（题型 8.4），XNOR 多出那一门就是省不掉的取反。

### 易错点

- 写成「对称漂亮」的 $(B\uparrow D)\uparrow(B\uparrow D)$：那只是 $\overline{BD}$。
- 用 $B\uparrow D$ 冒充 $B\bar D$：漏掉 $\bar D$ 的反相器，函数已变；画成三输入 NAND 也违规，题目限定 two-input。

### 变体

- 换成 "using only NOR gates"：见题型 8.2，要先有 POS。函数若含孤立最小项（如 $m_4$），该项要四文字，反相器成主要开销，即题型 8.5。

## 题型 8.2 只用二输入 NOR 实现同一函数

### 识别特征

同一题的第 (3) 问 "Implement $F$ using only two-input NOR gates."。没有「反相信号不可得」字样，但同样要补反相器；差别在于必须先有 POS。

### 原题

> 3. Implement $F$ using only two-input NOR gates.

### 官方答案

作业卷不附解答，参考答案：$F=(B+\bar D)(\bar B+D)$，于是

$$F=\big(B\downarrow(D\downarrow D)\big)\downarrow\big((B\downarrow B)\downarrow D\big)$$

<svg viewBox="0 0 400 190" width="400" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px"><g transform="translate(60,33)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="93.5" cy="47" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(60,110)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="93.5" cy="124" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(170,60)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="203.5" cy="74" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(170,150)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="203.5" cy="164" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(270,95)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="303.5" cy="109" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,40 H60 M45,40 V54 H60 M45,40 V67 H170" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="45" cy="40" r="2.5" fill="#333"/><circle cx="45" cy="54" r="2.5" fill="#333"/><path d="M20,90 H25 M25,90 V171 M25,117 H60 M25,131 H60 M25,171 H170" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="25" cy="90" r="2.5" fill="#333"/><circle cx="25" cy="117" r="2.5" fill="#333"/><path d="M97,47 H140 V157 H170" stroke="#333" stroke-width="1.4" fill="none"/><path d="M97,117 H130 V81 H170" stroke="#333" stroke-width="1.4" fill="none"/><path d="M207,74 H245 V102 H270" stroke="#333" stroke-width="1.4" fill="none"/><path d="M207,164 H250 V116 H270" stroke="#333" stroke-width="1.4" fill="none"/><path d="M307,109 H370" stroke="#333" stroke-width="1.4" fill="none"/><text x="4" y="44" font-style="italic">B</text><text x="4" y="94" font-style="italic">D</text><text x="374" y="113" font-style="italic">F</text><text x="100" y="41" font-style="italic">e</text><text x="100" y="111" font-style="italic">f</text><text x="62" y="28" font-size="11">n1</text><text x="62" y="105" font-size="11">n2</text><text x="172" y="55" font-size="11">n4</text><text x="172" y="145" font-size="11">n3</text><text x="272" y="90" font-size="11">n5</text></svg>

图 3　$F=B\odot D$ 的二输入 NOR 实现：5 个门，深度 3。

### 解题步骤

1. **换形式**：NOR–NOR 吃 POS。$F$ 的 0 出现在 $B\bar D$ 与 $\bar BD$，各给一个和项。
2. **每因子一个 NOR**：$(B+\bar D)'=B\downarrow\bar D$，$(\bar B+D)'=\bar B\downarrow D$。
3. **补反相信号，末级 NOR 合成**：$\bar B=B\downarrow B$、$\bar D=D\downarrow D$，再由一级 NOR 把两个反号一起收掉。

### 答案复盘

- **照抄 SOP 会翻车**：硬写 $F=(B\downarrow D)\downarrow(\bar B\downarrow\bar D)$ 得 $\bar F$，因为末级只够收一次反号。
- **极性自检**：$B$ 到输出只经过「取反 + 末级再取反」两处反号，故 $B$ 以原形出现，与 $B\odot D$ 一致。
- **图 3 不是最少解**：4 门即可——$n_1=B\downarrow D$、$n_2=B\downarrow n_1$、$n_3=D\downarrow n_1$、$F=n_2\downarrow n_3$，$n_1$ 被两个门共用；穷举确认 3 门无解，故 4 门最少。图 3 只是「按公式逐项填」的结果。

### 易错点

- SOP 直接套 NOR–NOR 得 $\bar F$：本章最常见的极性事故。
- 把 $B+\bar D$ 画成 $B\downarrow D$：漏了反相器。
- 把 POS 的因子写成乘积项：NOR–NOR 的因子必须是和项。

### 变体

- 同一题两问并列时，先答「NAND 走 SOP、NOR 走 POS」，再分别落地比门数；纯乘积 $F=AB$ 用 NOR 要先补成 POS，代价高。

## 题型 8.3 先读电路、再改写成全 NAND（多级 → 两级）

### 识别特征

题干给一张原理图（可能含自定义器件，如 "K gate" 加真值表），要求 "analyze this circuit and come-up with the logic circuit for the same function that uses ONLY NAND gates"。原电路是多级的，不是两级 SOP。

### 原题

> 5. (12 points)
>
> The gate labeled "K gate" has the truth table as shown in Table 1.
>
> Table 1: The truth table of K gate
>
> Figure 3: Q5 circuit.
>
> (1) (5 points) Write down the logic expression in the **standard sum of product form**;
>
> (2) (7 points) Given the circuit as shown in Figure 3, analyze this circuit and come-up with the logic circuit for the same function that uses **ONLY** NAND gates (The complementary inputs are not directly available - e.g., $\bar A$ is not directly available.)

真值表（$A,B,C\to X$）：$000\to1$、$001\to0$、$010\to1$、$011\to0$、$100\to1$、$101\to0$、$110\to1$、$111\to1$。

Figure 3 的接法：$P,Q$ 进 AND 得 $PQ$，该乘积与 $A$ 再进第二个 AND；$A,B,C$ 另进 K gate；两支进 OR 得 $Y$。

### 官方答案

> (1) $X=\bar A\bar B\bar C+\bar AB\bar C+A\bar B\bar C+AB\bar C+ABC$
>
> (2) $X=(\bar A\bar B\bar C+\bar AB\bar C+A\bar B\bar C+AB\bar C)+(AB\bar C+ABC)=(\bar A\bar C+A\bar C)+AB=\bar C+AB$，hence $Y=PQA+X=APQ+AB+\bar C$。
>
> Figure 4: Q5-2 solution.

<svg viewBox="0 0 740 210" width="640" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px"><g transform="translate(70,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="103.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(150,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="183.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(230,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="263.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(310,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="343.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(230,110)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="263.5" cy="124" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(310,110)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="343.5" cy="124" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(150,170)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="183.5" cy="184" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(390,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="423.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(390,110)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="423.5" cy="124" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(470,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="503.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(550,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="583.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(550,170)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="583.5" cy="184" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(630,40)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="663.5" cy="54" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,47 H70 M20,61 H70" stroke="#333" stroke-width="1.4" fill="none"/><path d="M107,54 H135 M135,54 V47 H150 M135,54 V61 H150" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="135" cy="54" r="2.5" fill="#333"/><path d="M187,54 H215 V47 H230" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,100 H200 V61 H230" stroke="#333" stroke-width="1.4" fill="none"/><path d="M267,54 H295 M295,54 V47 H310 M295,54 V61 H310" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="295" cy="54" r="2.5" fill="#333"/><path d="M347,54 H375 M375,54 V47 H390 M375,54 V61 H390" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="375" cy="54" r="2.5" fill="#333"/><path d="M427,54 H455 V47 H470" stroke="#333" stroke-width="1.4" fill="none"/><path d="M507,54 H535 M535,54 V47 H550 M535,54 V61 H550" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="535" cy="54" r="2.5" fill="#333"/><path d="M587,54 H610 V47 H630" stroke="#333" stroke-width="1.4" fill="none"/><path d="M667,54 H710" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,100 H170 V117 H230" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,131 H230" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="170" cy="100" r="2.5" fill="#333"/><path d="M267,124 H295 M295,124 V117 H310 M295,124 V131 H310" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="295" cy="124" r="2.5" fill="#333"/><path d="M347,124 H375 M375,124 V117 H390 M375,124 V131 H390" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="375" cy="124" r="2.5" fill="#333"/><path d="M427,124 H440 V61 H470" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,145 H120 V177 H150" stroke="#333" stroke-width="1.4" fill="none"/><path d="M135,177 V191 H150" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="135" cy="177" r="2.5" fill="#333"/><path d="M187,184 H520 V177 H550" stroke="#333" stroke-width="1.4" fill="none"/><path d="M535,177 V191 H550" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="535" cy="177" r="2.5" fill="#333"/><path d="M587,184 H605 V61 H630" stroke="#333" stroke-width="1.4" fill="none"/><text x="4" y="51" font-style="italic">P</text><text x="4" y="65" font-style="italic">Q</text><text x="4" y="104" font-style="italic">A</text><text x="4" y="135" font-style="italic">B</text><text x="4" y="149" font-style="italic">C</text><text x="714" y="58" font-style="italic">Y</text><text x="70" y="35" font-size="11">N1</text><text x="150" y="35" font-size="11">N2</text><text x="230" y="35" font-size="11">N3</text><text x="310" y="35" font-size="11">N4</text><text x="230" y="105" font-size="11">N5</text><text x="310" y="105" font-size="11">N6</text><text x="150" y="165" font-size="11">N7</text><text x="390" y="35" font-size="11">G1</text><text x="390" y="105" font-size="11">G2</text><text x="470" y="35" font-size="11">G3</text><text x="550" y="35" font-size="11">G1'</text><text x="550" y="165" font-size="11">G2'</text><text x="630" y="35" font-size="11">G3'</text></svg>

图 4　官方 Figure 4 重绘：13 个二输入 NAND，其中 8 个只作反相，深度 8。

### 解题步骤

1. **读图**：$Y=A\cdot(PQ)+X$。
2. **读 K gate**：$X=\bar C+AB$（真值表到最小式属 06、07 文件）。
3. **合并**：$Y=APQ+AB+\bar C$，三项 SOP。
4. **允许三输入**：3 个门；**只给二输入**则提公因子 $Y=\bar C+A(PQ+B)$，5 个门（图 5）。
5. **与官方图对照**：同功能，门数与深度都大降。

**第 4 步之一（三输入版，本题最漂亮的一步）**

- **原式**：$Y=APQ+AB+\bar C$　**NAND 形式**：$Y=(A\uparrow P\uparrow Q)\uparrow(A\uparrow B)\uparrow C$
- **对应电路**：两个 NAND 出 $\overline{APQ}$、$\overline{AB}$，末级三输入 NAND 的第三个输入直接接 $C$。

一句一句：前两项各进一个 NAND，得两个「反着的乘积」；第三项是 $\bar C$，它的反就是 $C$，所以末级接原变量，一个反相器都不用；末级把三路反号一起收掉，$\overline{\overline{APQ}\cdot\overline{AB}\cdot C}=APQ+AB+\bar C$。

**第 4 步之二（二输入版）**

- **原式**：$Y=\bar C+A(PQ+B)$　**NAND 形式**：$Y=\Big(A\uparrow\big((P\uparrow Q)\uparrow(B\uparrow B)\big)\Big)\uparrow C$　**对应电路**：图 5。

一句一句：$(P\uparrow Q)\uparrow(B\uparrow B)=\overline{\overline{PQ}\cdot\bar B}=PQ+B$，中间这级两个反号相消，正是气泡推移的核心动作；$A\uparrow$ 上式把「和」整体反相，为末级铺路；末级接 $C$（不是 $\bar C$）即得 $A(PQ+B)+\bar C$。

<svg viewBox="0 0 430 205" width="430" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px"><g transform="translate(90,33)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="123.5" cy="47" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(90,93)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="123.5" cy="107" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(170,66)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="203.5" cy="80" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(250,80)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="283.5" cy="94" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(330,100)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="363.5" cy="114" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,40 H90 M20,54 H90" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,100 H90 M75,100 V114 H90" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="75" cy="100" r="2.5" fill="#333"/><path d="M127,47 H150 V73 H170" stroke="#333" stroke-width="1.4" fill="none"/><path d="M127,107 H155 V87 H170" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,150 H230 V87 H250" stroke="#333" stroke-width="1.4" fill="none"/><path d="M207,80 H235 V101 H250" stroke="#333" stroke-width="1.4" fill="none"/><path d="M287,94 H310 V107 H330" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,190 H300 V121 H330" stroke="#333" stroke-width="1.4" fill="none"/><path d="M367,114 H400" stroke="#333" stroke-width="1.4" fill="none"/><text x="4" y="44" font-style="italic">P</text><text x="4" y="58" font-style="italic">Q</text><text x="4" y="104" font-style="italic">B</text><text x="4" y="154" font-style="italic">A</text><text x="4" y="194" font-style="italic">C</text><text x="404" y="118" font-style="italic">Y</text><text x="130" y="41" font-style="italic">a</text><text x="130" y="101" font-style="italic">b</text><text x="210" y="74" font-style="italic">c</text><text x="292" y="88" font-style="italic">d</text><text x="92" y="28" font-size="11">n1</text><text x="92" y="88" font-size="11">n2</text><text x="172" y="61" font-size="11">n3</text><text x="252" y="75" font-size="11">n4</text><text x="332" y="95" font-size="11">n5</text></svg>

图 5　$Y=APQ+AB+\bar C$ 的 5 门二输入 NAND 解（第 4 步之二），深度 4。

### 答案复盘

- **第 1 行 5 个最小项**：直接照真值表的 1 读，属 06 文件的标准形式；$\bar C$ 的 4 个最小项并成一项，$AB\bar C$ 与 $ABC$ 再并成 $AB$。
- **第 2 行分组**：把 $\bar C$ 的四个最小项圈在一起（卡诺图 4 格组，属 07 文件），再把 $AB$ 的两个并掉。
- **第 3 行 $(AB\bar C+ABC)=AB$**：吸收律 $X+X\bar Y=X$，末项省掉一个文字。
- **第 4 行 $Y=PQA+X$**：纯读图，AND 层出乘积、OR 层求和。
- **官方 Figure 4 为什么 13 门**：它每一步都「先造正逻辑量、再造反相量」。$N_1,N_2$ 造 $PQ$，$N_3,N_4$ 造 $APQ$，$N_5,N_6$ 造 $AB$，$N_7$ 造 $\bar C$；$G_1,G_2$ 又把 $N_3,N_5$ 的输出再反一次——$G_1$ 与 $N_3$ 是同一个信号，$G_2$ 与 $N_5$ 也是；$G_2'$ 把 $N_7$ 的 $\bar C$ 还原成 $C$。删掉这 6 个「反了又反」的门剩 7 门，再提公因子降到 5 门。

### 易错点

- 只把 AND 换 NAND 就交卷：极性全反，必须按铁律三推气泡，否则交出去的是反函数。
- 末级把 $\bar C$ 接进去：末级自带反号，接 $\bar C$ 会得到 $C$。
- 二输入限制下不提公因子：$APQ$ 拆两级，5 门涨到 7 门。

### 变体

- 允许三输入 NAND：3 门、深度 2（第 4 步之一）。
- 要求 NOR-only：先圈 0 化 POS 再套铁律二，门数通常多于 NAND 版。
- **倒推题**（"use at most 5 NAND gates"）：先算下界「项数 + 反相文字数 + 1」，再看能否提公因子，最后才动笔。

## 题型 8.4 偶校验生成器与校验器（只用 NAND）

### 识别特征

题干出现 "even-parity code generator / checker" 与 "only using NAND gates"，数据位数很少（本题 2 位）；一问画真值表，一问画电路。

### 原题

> 6. (15 points) A communication system uses the **even**-parity code in the sender and the **even**-parity code checker in the receiver to detect data transmission. The data has 2 bits.
>
> (1) (7 points) Draw the truth tables for even-parity code generator in the sender and the even-parity code checker in the receiver, respectively;
>
> (2) (8 points) Design the circuits of even-parity code generator and the even-parity code checker only using NAND gates, respectively;

### 官方答案

原卷未给解答，参考答案：生成器 $P=A\oplus B$（4 个 NAND）；校验器 $C=A\oplus B\oplus P$（8 个 NAND）；$C=1$ 表示三位中 1 的个数为奇数，即出错。真值表：$P$ 为 $00\to0,\ 01\to1,\ 10\to1,\ 11\to0$；$C$ 为 $000\to0,\ 001\to1,\ 010\to1,\ 011\to0,\ 100\to1,\ 101\to0,\ 110\to0,\ 111\to1$。

<svg viewBox="0 0 380 140" width="380" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px"><g transform="translate(90,70)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="123.5" cy="84" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(175,30)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="208.5" cy="44" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(175,100)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="208.5" cy="114" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(260,65)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="293.5" cy="79" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,37 H175" stroke="#333" stroke-width="1.4" fill="none"/><path d="M45,37 V77 H90" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="45" cy="37" r="2.5" fill="#333"/><path d="M20,121 H175" stroke="#333" stroke-width="1.4" fill="none"/><path d="M60,121 V91 H90" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="60" cy="121" r="2.5" fill="#333"/><path d="M127,84 H150 M150,84 V51 H175 M150,84 V121 H175" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="150" cy="84" r="2.5" fill="#333"/><path d="M213,44 H235 V72 H260" stroke="#333" stroke-width="1.4" fill="none"/><path d="M213,114 H235 V86 H260" stroke="#333" stroke-width="1.4" fill="none"/><path d="M297,79 H350" stroke="#333" stroke-width="1.4" fill="none"/><text x="4" y="41" font-style="italic">A</text><text x="4" y="125" font-style="italic">B</text><text x="354" y="83" font-style="italic">S</text><text x="92" y="65" font-size="11">g1</text><text x="177" y="25" font-size="11">g2</text><text x="177" y="95" font-size="11">g3</text><text x="262" y="60" font-size="11">g4</text></svg>

图 6　4 个 NAND 组成的异或块，$S=A\oplus B$；生成器用一次，校验器串两次。

### 解题步骤

1. **定定义**：偶校验 = 数据位与校验位中 1 的总数为偶，故 $P=A\oplus B$。
2. **异或的 4 门电路**：$g_1=A\uparrow B$，$g_2=A\uparrow g_1$，$g_3=B\uparrow g_1$，$S=g_2\uparrow g_3$。
3. **校验器再来一级异或**：$C=(A\oplus B)\oplus P$，把 $P$ 接到第二个块的 $B$ 位。
4. **要低有效错误**再加一个反相器（第 9 门）。

一句一句：先一个 NAND 得 $g_1=(AB)'$，同时喂后两个门——共用中间结果是 4 门而非 5 门的原因；$g_2=\overline{A(AB)'}$、$g_3=\overline{B(AB)'}$；末级 $\overline{g_2g_3}=A\bar B+\bar AB$。

### 答案复盘

- **为什么不套两级 NAND–NAND**：$A\bar B+\bar AB$ 走两级要 2 个反相器 + 3 个 NAND = 5 门；共用 $g_1$ 的多级写法 4 门，且穷举确认 3 门无解。
- **校验器 8 门**：异或满足结合律，$A\oplus B\oplus P=(A\oplus B)\oplus P$，两个 4 门块串联；$A\oplus B$ 只算一次，重画两遍才会变成 12 门。

### 易错点

- 生成器与校验器角色搞反：生成器输出校验位本身，校验器输出「是否出错」。
- 定义只数数据位、漏掉校验位自己。
- $A\oplus B$ 算两遍，8 门涨到 12。

### 变体

- 3 位数据：生成器 8 门（两个块），校验器 12 门（三个块）；奇校验所有输出取反，每处 $+1$ 门。

## 题型 8.5 基本门实现与「反相信号不可得」的成本

### 识别特征

"Draw the logic diagram ... using basic logic gates"（AND/OR/NOT 都可用），常紧跟最小化；另一类是 "The complementary inputs ... are NOT directly available"。

### 原题

> (1) Derive the minimized SOP expression from the truth table below using K-map (5 points), and implement it using basic gates such as AND, OR, Inverter(5 points). The complementary inputs, if needed, are **NOT** directly available, i.e. $\bar A,\bar B,\bar C,\bar D$ are NOT available. Same for the question below.
>
> 4. (16 points) In a common-anode 7-segment display, each of the seven segments is activated for various digits ... segment $a$ is activated for the digits 0, 2, 3, 5, 6, 7, 8, and 9 ...
>
> (3) (3 points) Draw the logic diagram for the segment-g logic using basic logic gates.

### 官方答案

- M2026 Q4(3)：$g=\bar A\bar B\bar C+BCD$，官方图为 3 个 NOT + 2 个三输入 AND + 1 个 OR = 6 门，最大扇入 3。
- M2024 Q6(1)：$X=ACD+A\bar B+\bar BC+\bar AB\bar C\bar D$（推导见 07 文件），官方 Fig. 9 为 4 个反相器 + 4 个 AND + 1 个 OR = 9 门。

<svg viewBox="0 0 400 190" width="400" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px"><g transform="translate(90,33)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="113.5" cy="47" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(90,73)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="113.5" cy="87" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(90,113)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="113.5" cy="127" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><g transform="translate(200,55)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(200,150)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(290,100)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><path d="M20,40 H90" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,80 H90" stroke="#333" stroke-width="1.4" fill="none"/><path d="M60,80 V156 H200" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="60" cy="80" r="2.5" fill="#333"/><path d="M20,120 H90 M20,120 V164 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M20,172 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M117,47 H165 V61 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M117,87 H150 V69 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M117,127 H180 V77 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M233,69 H260 V107 H290" stroke="#333" stroke-width="1.4" fill="none"/><path d="M233,164 H265 V121 H290" stroke="#333" stroke-width="1.4" fill="none"/><path d="M323,114 H365" stroke="#333" stroke-width="1.4" fill="none"/><text x="4" y="44" font-style="italic">A</text><text x="4" y="84" font-style="italic">B</text><text x="4" y="124" font-style="italic">C</text><text x="4" y="176" font-style="italic">D</text><text x="369" y="118" font-style="italic">g</text><text x="92" y="28" font-size="11">NOT</text><text x="92" y="68" font-size="11">NOT</text><text x="92" y="108" font-size="11">NOT</text><text x="206" y="50" font-size="11">AND</text><text x="206" y="145" font-size="11">AND</text><text x="300" y="95" font-size="11">OR</text></svg>

图 7　$g=\bar A\bar B\bar C+BCD$ 的基本门实现：3 个 NOT + 2 个三输入 AND + 1 个 OR，共 6 门。

### 解题步骤

1. **数反相文字**：$g$ 需 $\bar A,\bar B,\bar C$；$X$ 需 $\bar A,\bar B,\bar C,\bar D$。
2. **每个反相文字配一个反相器、每项一个 AND、末级一个 OR**（题目说反相信号不可得，不能省），共用只算一次。
4. **若改 NAND**：$g$ 用三输入 NAND 也是 6 门（3 个反相器 + 2 个 NAND + 1 个 NAND）。

一句一句：$\bar B,\bar C$ 被第一项共用（第二项 $BCD$ 全用原变量，帮不上忙）；第一项要「反着的乘积」$\overline{\bar A\bar B\bar C}$，正好一个三输入 NAND；第二项同样处理，末级 NAND 把两个反号收掉。

### 答案复盘

- **$g$ 为什么省不到 5 门**：第一项三个反相文字各要一个门，第二项无任何反相文字，共用不了；再加两个乘积门与末级，正好 6。
- **M2024 为什么 4 个反相器**：$\bar A$ 只在第 4 项、$\bar B$ 在第 2、3、4 项、$\bar C,\bar D$ 只在第 4 项，四个都用到，一个都省不掉。
- **通用公式**：反相器数 = 用到的不同反相文字数；只给二输入 NAND 时 $g$ 要 10 门——每个三文字项都得「NAND 出反乘积 → 反相 → 再 NAND」三步。

### 易错点

- 直接接 $\bar A$ 不画反相器：题面已明说 NOT available。
- 共同反相文字重复画：$\bar B$ 被多项共用，一个门即可；不先最小化就画，多一项直接 $+2$ 门。

### 变体

- 题目给的是 "using basic gates"，答案可自由选门型，但门数要报出来；本问只占 3 分，画完顺手标门数。

## 门数台账

| 函数（出处） | 实现方式 | 门数 | 最大扇入 | 深度 |
|---|---|---|---|---|
| $B\odot D$（HW3 8.1） | 二输入 NAND（图 2） | 5 | 2 | 3 |
| 同上 | 二输入 NOR，共用中间量 | 4 | 2 | 3 |
| $Y=APQ+AB+\bar C$（M2025s） | 三输入 NAND | 3 | 3 | 2 |
| 同上 | 二输入 NAND，提公因子（图 5） | 5 | 2 | 4 |
| 同上 | 官方 Figure 4（图 4） | 13 | 2 | 8 |
| $A\oplus B$（M2025f） | 二输入 NAND（图 6） | 4 | 2 | 3 |
| $g=\bar A\bar B\bar C+BCD$（M2026） | 基本门（图 7） | 6 | 3 | 3 |

三条结论：多输入 NAND 最省门；限二输入时先提公因子；官方手绘图的 13 门不是标准答案，而是「照结构逐级转」的结果。

## 原卷勘误（本课题相关）

1. M2025s Q5(2) 的 "come-up with" 应为 "come up with"（原卷如此，本文照抄）。
2. M2025s 官方解答把 $A\bar B\bar C$ 印成 $\bar A\bar B\bar C$，与首项重复；由 $X+X=X$ 不影响结果。
3. M2025s Figure 4 的 $P,Q,AP,AB$ 等标注丢了横线；13 个 NAND 里 8 个只作反相，不是最小解。
4. M2024 Q6(1) 的 "Inverter(5 points)" 缺一个空格（原卷如此）。
5. M2026 Q4 题干 "as illustrated in the below figure" 应为 "in the figure below"。
6. M2026 Q4(2) 的 "standard SOP" 经 900 dpi 放大核对无误，三项为 $m_0,m_1,m_7$；低分辨率下中间项的 $\bar C$ 易误读为 $C$，不是原卷之误。
7. M2025f Q6 原卷无解答，本文答案为自拟，已穷举验证。

## 自测题

1. 只用二输入 NAND 实现 $F=A\oplus B$，最少几个门？
2. 只用二输入 NOR 实现 $F=(A+B)(C+\bar D)$，最少几个门？
3. 判断：只用二输入 NAND 时 $F=AB+\bar C$ 两个门就够。对还是错？
4. 电路为 $g_1=A\uparrow A$、$g_2=g_1\uparrow B$、$F=g_2\uparrow C$，写出 $F$，并说明沿路径数气泡的结果。
5. 4 位数据 $A,B,C,D$ 的偶校验位用二输入 NAND 实现要几个门？奇校验位呢？

## 自测答案

1. **4 个**：$t_1=A\uparrow B$、$t_2=A\uparrow t_1$、$t_3=B\uparrow t_1$、$F=t_2\uparrow t_3$；穷举 2 输入 NAND 的 1–3 门网络无解。
2. **4 个**：$n_1=\bar D=D\downarrow D$、$t_1=A\downarrow B$、$t_2=C\downarrow n_1$、$F=t_1\downarrow t_2$；穷举确认 3 门无解。
3. **对**：$t=A\uparrow B=\overline{AB}$，$F=t\uparrow C=AB+\bar C$；末级那个反号正好把 $\bar C$ 拉回 $C$，与题型 8.3 第 4 步同一技巧。
4. $F=\bar AB+\bar C$（3 门，已穷举确认最少）：$g_1$ 一个反号、$g_2$ 再一个（相消，$g_2=\overline{\bar AB}$）、末级一个；净剩一个反号落在 $C$ 上，故输出是 $\bar C$ 而非 $C$。
5. **12 个 / 13 个**：偶校验位 $=A\oplus B\oplus C\oplus D$，三个 4 门异或块串联；奇校验位再取反一次，多 1 门。

以上电路均用穷举真值表验证，可直接背。
