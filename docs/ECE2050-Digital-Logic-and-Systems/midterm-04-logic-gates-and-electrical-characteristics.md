---
title: 04 逻辑门与电特性
---

# 04 逻辑门与电特性

> **真题分布**：2024 Q1(1)(4)；2025s Q1(1)(6)(9)；2025f Q1(2)(9)；2026 Q1(1)(2)、Q5；HW2 Q1–Q4　|　**考频**：4/4 年，概念句每年 3–5 分，波形题 6–10 分
> **一句话**：给一张门电路图和一组输入波形，问输出表达式与输出波形；或给一张门规格表，问这两个器件能不能直接接在一起。

## 这个课题在考什么

前面的章节把 0 和 1 当成抽象符号，本章把它们变回**电压**和**门**。卷子上只有两种出法。

第一种是读图：给电路图，正着写表达式、倒着画波形。得分点在"逐门命名 + 逐段填表"，不化简也给分。

第二种是判定：给门的真值表或器件电压表，问"这等价于哪个门""这两级能不能互连"。得分点在**指纹**和**一个减法**。

电特性（噪声容限、扇出）四套真题一次都没考过，只出现在 HW2，属于"低概率、零成本"的送分点。

## 必备知识（只看解题要用到的）

| # | 知识点 | 内容 |
|---|---|---|
| 1 | 六个基本门 | AND、OR、NOT、NAND、NOR、XOR、XNOR；后四个 = 前三个加输出气泡 |
| 2 | 气泡读法 | NAND 读作 Negative-OR（$\bar{A}+\bar{B}$）；NOR 读作 Negative-AND（$\bar{A}\bar{B}$） |
| 3 | 正逻辑 | 正逻辑（positive logic）下 HIGH $=1$、LOW $=0$，这是全书默认约定 |
| 4 | 多输入 NAND/NOR | NAND 全 1 才出 0；NOR 全 0 才出 1；其余输入不影响 |
| 5 | 多输入 XOR | 输出 1 当且仅当"1 的个数为奇数"，即奇校验（odd parity） |
| 6 | 通用门 | universal gate：NAND、NOR 各自单独就能实现任意布尔函数 |
| 7 | 逻辑电平 | logic level：$V_{OH}$（输出高）、$V_{OL}$（输出低）、$V_{IH}$（输入认高的下限）、$V_{IL}$（输入认低的上限） |
| 8 | 噪声容限 | noise margin：$NM_H=V_{OH}-V_{IH}$，$NM_L=V_{IL}-V_{OL}$，两个都必须为正；互连判据 $V_{OH}(\text{driver})>V_{IH}(\text{receiver})$ 且 $V_{OL}<V_{IL}$（与 $NM>0$ 等价） |
| 9 | 扇出 | fan-out：一个输出能带动的同类输入个数；电压之外还要过电流判据 $I_{OL}\ge N I_{IL}$、$I_{OH}\ge N I_{IH}$ |

本课题只讲门符号、真值表指纹、噪声容限与 XOR 性质；通用门实现见 08 文件，化简见 05 文件，延迟与毛刺见 11 文件。

## 题型 4.1 由门电路图写输出表达式，并由输入波形画输出波形
### 识别特征
题干出现 "Given the below circuit" + "Derive the boolean expression" + "determine the timing diagram"；图中有若干门，门上标 $G_1,G_2,G_3$。

本文件只讲**定性对齐**（输出与输入在同一条竖线上翻转）；延迟与毛刺的定量计算见 11 文件，化简见 05 文件。
### 原题
来源：M2026 Q5（p06），10 分。

> **5.** (10 points) Given the below circuit,
>
> (1) (4 points) Derive the boolean expression for the output $X$ with the inputs $A$ and $B$.
> (2) (6 points) If the input waveforms are applied as indicated, determine the timing diagram showing the outputs of $G_{1}$, $G_{2}$ and $G_{3}$.

<svg viewBox="0 0 460 175" width="460" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M20,51 H300 M20,65 H300 M170,51 V134 H178 M250,65 V93 H258 M205,134 H288 V126 H300 M285,93 H292 V112 H300 M330,58 H350 V74 H372 M330,119 H350 V86 H372 M402,80 H440" stroke="#333" stroke-width="1.4" fill="none"/>
  <circle cx="170" cy="51" r="2.5" fill="#333"/>
  <circle cx="250" cy="65" r="2.5" fill="#333"/>
  <g transform="translate(178,120)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <circle cx="201.5" cy="134" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <g transform="translate(258,79)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <circle cx="281.5" cy="93" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <g transform="translate(300,44)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(300,105)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(372,66)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <text font-style="italic"><tspan x="6" y="55">A</tspan><tspan x="6" y="69">B</tspan><tspan x="444" y="84">X</tspan></text>
  <text><tspan x="302" y="38">G2</tspan><tspan x="302" y="99">G3</tspan><tspan x="374" y="60">G1</tspan></text>
</svg>

输入波形（$A$ 高→低→高→低→高，$B$ 低→高→低→高）：

<svg viewBox="0 0 620 130" width="620" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M80,20 V120 M130,20 V120 M210,20 V120 M280,20 V120 M325,20 V120 M360,20 V120 M465,20 V120 M530,20 V120 M600,20 V120" stroke="#ddd" stroke-width="1" stroke-dasharray="3,3" fill="none"/>
  <path d="M80,40 H130 V60 H280 V40 H325 V60 H530 V40 H600" stroke="#1a73e8" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M80,90 H210 V70 H325 V90 H465 V70 H600" stroke="#1a73e8" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <text font-style="italic"><tspan x="56" y="44">A</tspan><tspan x="56" y="94">B</tspan></text>
</svg>
### 官方答案
(1) $X = AB + \bar{A}B$

(2) 官方时序图：$G_{2}$ 在 $A=1,B=1$ 的区段为高；$G_{3}$ 在 $A=0,B=0$ 的区段为高；$X$ 在 $A=B$ 时为高。

> **勘误**：(1) 的表达式与官方自己画的电路、自己画的时序图都不一致。图中 $A$ 支路与 $B$ 支路各串了一只反相器，$G_{3}$ 的两个输入是 $\bar{A}$ 与 $\bar{B}$，故正确表达式为 $X=AB+\bar{A}\bar{B}$（即 XNOR）。官方时序图正是"$A=B$ 时 $X$ 高"，与该式吻合；若按官方式子 $AB+\bar{A}B=B$，$X$ 应恒等于 $B$，与所画波形在第 2、3、6、7 段不符。考试时写 $X=AB+\bar{A}\bar{B}$，波形照官方图。
### 解题步骤
1. **数反相器，确定归属** —— 每个三角+气泡只反相"接在它左边那条竖线"上的信号。本例 $A$ 的竖线通到下面那只反相器、$B$ 的竖线通到上面那只，于是 $\bar{A}$ 进 $G_{3}$ 下输入、$\bar{B}$ 进上输入。
2. **给每个门命名，写局部表达式** —— $G_{2}=AB$，$G_{3}=\bar{A}\bar{B}$，$G_{1}=G_{2}+G_{3}$。先不化简，化简会掩盖接线错误。
3. **代入总式** —— $X=G_{2}+G_{3}=AB+\bar{A}\bar{B}$。
4. **切段** —— 把所有输入跳变时刻按先后排成竖虚线，相邻两条线之间输入不变，输出也不变。本例 7 条竖线切出 8 段。
5. **逐段填表** —— 每段取 $A,B$ 的值，算 $G_{2},G_{3},X$ 再画电平。按"段"画，不按"跳变"画。
6. **自检** —— 把 $X$ 与某个简单参照比对。本例 $X$ 在 $A=B$ 时为高，正是 XNOR，一步就能发现表达式写反。

<svg viewBox="0 0 620 300" width="620" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M130,20 V290 M210,20 V290 M280,20 V290 M325,20 V290 M360,20 V290 M465,20 V290 M530,20 V290" stroke="#ddd" stroke-width="1" stroke-dasharray="3,3" fill="none"/>
  <path d="M80,40 H130 V60 H280 V40 H325 V60 H530 V40 H600" stroke="#1a73e8" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M80,110 H210 V90 H325 V110 H465 V90 H600" stroke="#1a73e8" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M80,170 H280 V150 H325 V170 H530 V150 H600" stroke="#b3261e" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M80,220 H130 V200 H210 V220 H360 V200 H465 V220 H600" stroke="#b3261e" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M80,270 H130 V250 H210 V270 H280 V250 H325 V270 H360 V250 H465 V270 H530 V250 H600" stroke="#b3261e" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <text font-style="italic"><tspan x="50" y="44">A</tspan><tspan x="50" y="114">B</tspan><tspan x="24" y="174">G2</tspan><tspan x="24" y="224">G3</tspan><tspan x="38" y="274">X</tspan></text>
</svg>
### 答案复盘
- 官方 (1) 的 $G_{2}=AB$：$G_{2}$ 两个输入直接从 $A$、$B$ 干线进来，门上无气泡、形状是平背弧腹，对应"AND"这一条规则，没有中间步骤。
- 官方 (1) 的 $\bar{A}B$：只解释了一只反相器，漏掉 $B$ 支路上那只。这是**步骤 1**没执行完的典型后果 —— 反相器归属要顺着竖线走，不能按"上下"想当然。
- 官方 (2) 的 7 条竖虚线全部对齐输入跳变时刻，输出没有滞后：说明官方采用**零延迟理想模型**。题目未给 $t_{pd}$（传播延迟，propagation delay），所以不必错位。
- 官方 (2) 的 $X$ 在 $A=B$ 的四段为高：这是**步骤 4、5**的直接结果，也是全题唯一自检点。若按 (1) 的错误式子，第 2、3、6、7 段会全部翻转，一眼可辨。官方没有把 $X$ 化成 $A\odot B$：题目只说 "Derive the boolean expression"，未写 "minimize"。对比 M2024 Q5(1) 明确写了 "and minimize it" —— **卷面措辞决定要不要化简**。

真实门有延迟时，输出的每次翻转都比输入晚若干门延迟，画法如下（虚线为输入跳变时刻，$N$ 比输入晚 $\Delta$，$X$ 再晚 $\Delta$）：

<svg viewBox="0 0 600 250" width="600" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M200,20 V230 M380,20 V230" stroke="#ddd" stroke-width="1" stroke-dasharray="4,3" fill="none"/>
  <path d="M60,50 H200 V70 H380 V50 H560" stroke="#1a73e8" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M60,120 H220 V140 H400 V120 H560" stroke="#b3261e" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M60,190 H240 V210 H420 V190 H560" stroke="#b3261e" stroke-width="2" fill="none" stroke-linejoin="miter"/>
  <path d="M200,232 H240 M380,232 H420" stroke="#333" stroke-width="1.2" fill="none"/>
  <text font-style="italic"><tspan x="30" y="54">A</tspan><tspan x="30" y="124">N</tspan><tspan x="30" y="194">X</tspan></text>
  <text><tspan x="203" y="246">Δ</tspan><tspan x="383" y="246">Δ</tspan></text>
</svg>
### 易错点
- 反相器归属靠竖线判断，不靠位置远近：上方的反相器不一定属于上面的信号线。
- 干线交叉但无实心圆点 = 不连接。本图 $A$ 的竖线与 $B$ 的干线就有一处十字交叉，那是交叉不是连接。
- 题问 "outputs of $G_{1}$, $G_{2}$ and $G_{3}$" 时要画三条输出线，$G_{1}$ 的输出就是 $X$，别只画 $X$。
- 输入波形有几条跳变竖线就切几段；漏看一条边沿，后面全部错位。
### 变体
- **电路更大**：M2024 Q5 用 6 个门串成 $X=\overline{\overline{(\bar{A}+B)(\overline{BC})}+D}$，官方化简得 $\bar{A}+B+D$；问法多了 "minimize it" 与 "B is shortened to ground"（即 $B=0$，重写表达式并重画波形）。化简见 05 文件，波形方法与本题型完全相同，只是段数更多。
- **只问波形不问式子**：可跳过第 2、3 步，直接逐段填中间节点，最后再合并。
- **给出门延迟**：输出竖线整体右移，并可能出现毛刺，见 11 文件。

## 题型 4.2 门电路真值表：这个门等价于哪个基本门
### 识别特征
题干给出 4 行（或 8 行）真值表（truth table），问 "Which logic gate implements $S$?"；或判断题问"这个门能否被那个门替代"。
### 原题
来源：HW2 Q2。

> **Q2** Two bits $A$ and $B$ are added together.
>
> (a) Complete the table below, where $S$ is the sum bit and $C_{\text{out}}$ is the carry-out bit.
> (b) Which logic gate implements $S$?
> (c) Which logic gate implements $C_{\text{out}}$?

| $A$ | $B$ | $S$ | $C_{\text{out}}$ |
|---|---|---|---|
| 0 | 0 | | |
| 0 | 1 | | |
| 1 | 0 | | |
| 1 | 1 | | |
### 官方答案
作业未发布答案，以下为按真值表指纹自解并验算：

| $A$ | $B$ | $S$ | $C_{\text{out}}$ |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

(b) $S$: XOR gate.　(c) $C_{\text{out}}$: AND gate.
### 解题步骤
1. **按二进制加法填表** —— $A+B$ 的结果低位进 $S$、高位进 $C_{\text{out}}$：$0+0=00$，$0+1=01$，$1+0=01$，$1+1=10$。
2. **把输出列读成"1 出现在哪几行"** —— $S$ 的 1 在第 2、3 行；$C_{\text{out}}$ 的 1 只在第 4 行。
3. **查指纹表**，直接落到门名，不必写表达式。

| 输出 1 的位置 | 等价门 | 输出 1 的位置 | 等价门 |
|---|---|---|---|
| 只在 11 | AND | 除 00 外全为 1 | OR |
| 只在 00 | NOR | 除 01 与 10 外全为 1 | XNOR |
| 只在 01 与 10 | XOR | 除 11 外全为 1 | NAND |
### 答案复盘
- $S$ 的列 $0110$ 与指纹表"只在 01 与 10"逐格相同 → XOR。**为什么不是 OR**：OR 是 $0111$，只在 $A=B=1$ 那格不同；"$1+1$ 的和位是 0"正是 XOR 用来做加法的原因。
- $C_{\text{out}}$ 的列 $0001$ 与"只在 11"相同 → AND。**为什么不是 XOR**：进位的本质是"两个输入同时为 1"，是 AND 型事件，XOR 从定义上把这种情况判成 0。
- 两步可互证：$S=A\bar{B}+\bar{A}B$、$C_{\text{out}}=AB$，与指纹表一致（标准形式见 06 文件）。HW2 Q2 三个小问合起来就是半加器（half adder）的完整定义；全加器在此基础上再加进位输入，见 09 文件。
### 易错点
- 把 $S$ 写成 OR：$1+1$ 的和位是 0 不是 1，OR 在此格错。
- 把 $C_{\text{out}}$ 写成 XOR 或 OR：$1+1$ 才进位，只有 AND 满足。
- 指纹要背"1 出现在哪几行"，不要背"01 输出 1"这类逐格口诀，三输入以上逐格必乱。
### 变体
- **判断题形式**：2025s Q1(9) "A NOR gate can be substituted by an XOR gate;"，官方答案 N，并补出 NOR 的等价形式是 **negative-AND**（$\bar{A}\bar{B}$）。两者真值表 $1000$ 与 $0110$ 不同，替换不成立。
- **XNOR 单格题**：2025s Q1(6) "When '1' and '0' are input into a 2-input XNOR gate, the output is 1;"，答案 N，应为 0 —— 输入不同时 XNOR 输出 0。
- **NOR 与正逻辑**：2026 Q1(2) "A NOR gate outputs HIGH when all its input are LOW." 官方判 T；2024 Q1(1) "In positive logic, a HIGH level represents a binary 0." 官方判 N（正逻辑下 HIGH 即 1）。
- **三输入门**：$NAND3$ 只在 $111$ 出 0；三输入真值表按"1 的个数"归类，仍可用指纹表逐层拆。

## 题型 4.3 NAND / NOR 的通用性（universality）
### 识别特征
题干出现 "only using NAND gates"、"can be implemented using four NAND gates"、"only by using 2-input AND gates"；判断题问"某门能否替代另一门"。
### 原题
来源：四套卷 Q1 的四句（完整 40 句判定表见 12 文件）。

> **M2024 Q1(4)** It is possible to build an XOR gate with multiple NAND gates.
>
> **M2025s Q1(9)** A NOR gate can be substituted by an XOR gate;
>
> **M2025f Q1(9)** A 2-input XOR can be implemented using four NAND gates;
> **M2026 Q1(1)** NAND gates can be used to produce XOR functions.
### 官方答案
- M2024 Q1(4): **Y**
- M2025s Q1(9): **N; negative-AND gate**
- M2026 Q1(1): **T**
- M2025f Q1(9): 本卷无官方答案，以下为按规则自解：**Y**（标准 4 个 NAND 接法即可）
### 解题步骤
1. **先背两条等价式** —— $NAND(x,x)=\bar{x}$；有 NOT 就能把任意与或式翻成 NAND 网络。
2. **再用"双层"套路** —— 任意 SOP 写成 $\overline{\overline{P_1}\cdot\overline{P_2}\cdots}$，每个乘积项一只 NAND，最后一只 NAND 收口。
3. **判断题只看"是否只用这一种门"** —— 只给 AND、只给 XOR 都造不出反相，故不通用；NAND、NOR 通用。
4. **数门数** —— 2 输入 XOR 的常规 NAND 实现恰好 4 只，是常考常数。

<svg viewBox="0 0 420 290" width="420" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M20,40 H180 V67 M60,40 V127 H110 M20,240 H80 V141 H110 M80,211 H180 M147,134 H160 M160,81 H180 M160,81 V197 H180 M217,74 H250 V132 H280 M217,204 H250 V146 H280 M317,139 H350" stroke="#333" stroke-width="1.4" fill="none"/>
  <circle cx="60" cy="40" r="2.5" fill="#333"/>
  <circle cx="80" cy="211" r="2.5" fill="#333"/>
  <circle cx="160" cy="134" r="2.5" fill="#333"/>
  <g transform="translate(110,120)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <circle cx="143.5" cy="134" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <g transform="translate(180,60)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <circle cx="213.5" cy="74" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <g transform="translate(180,190)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <circle cx="213.5" cy="204" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <g transform="translate(280,125)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <circle cx="313.5" cy="139" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <text font-style="italic"><tspan x="6" y="44">A</tspan><tspan x="6" y="244">B</tspan><tspan x="354" y="143">X</tspan></text>
  <text><tspan x="112" y="116">N1</tspan><tspan x="182" y="56">N2</tspan><tspan x="182" y="186">N3</tspan><tspan x="282" y="121">N4</tspan></text>
</svg>

上图为 $X=A\oplus B$ 的四 NAND 实现：$N_1=\overline{AB}$，$N_2=\overline{A N_1}$，$N_3=\overline{B N_1}$，$X=\overline{N_2N_3}=A\bar{B}+\bar{A}B$。
### 答案复盘
- **M2024 Q1(4) 判 Y**：NAND 是通用门，任何布尔函数都能只靠 NAND 搭出；4-NAND 的 XOR 电路就是构造性证明。考试只需写 "NAND is a universal gate"。
- **M2026 Q1(1) 判 T**：与上一句只差措辞（"can be used to produce XOR functions"），答案必须同向 —— 同一考点换主语是这套卷的常见手法。
- **M2025f Q1(9) 判 Y**：4 个 NAND 正是 XOR 的常规实现，见上图；若改成 "three NAND gates"，答案要翻成 N。
- **M2025s Q1(9) 判 N**：官方补的 "negative-AND gate" 说明命题人要考**等价形式**而非"能否替代"。NOR $=1000$、XOR $=0110$ 不等价；NOR 真正的等价写法是把输入取反后做 AND，即 $\bar{A}\bar{B}$。
- **通用性口诀**：能造 NOT 的门才通用。AND、OR、XOR、XNOR 单独都造不出反相，NAND、NOR 能（把输入并成一根）。

> **勘误**：M2025s Q1(1) "A full-adder can be realized only by using 2-input AND gates;" 官方判 N 正确，但理由写成 "2 NAND gates, 2 XOR gates and 1 OR gate"。全加器 = 两个半加器 + 一只 OR，半加器 = XOR + AND，故标准实现是 **2 个 XOR、2 个 AND、1 个 OR**，"NAND" 应为 "AND"。作答时写 2 XOR + 2 AND + 1 OR，或直接写 "AND alone cannot invert, so N"。
### 易错点
- 把"等价"与"可替代"混为一谈：NAND 可替代任何门（需多个），但不等于任何门（单个）。
- 4 个 NAND 实现 XOR 记成常数；3 个不够，5 个可以但非最小。
- 判断题里 "only" 是关键词：出现 "only using AND" 几乎必判 N。
### 变体
- **NOR-only**：同一函数用 NOR 实现，套路是"先写 POS，再双层取反"，见 08 文件。
- **反相信号不可得**：题目说"只有原变量"时，每个需要的反相都要单独用 $NAND(x,x)$ 造，门数因此翻倍。
- **改门数**：把 "four NAND" 改成 "three NAND" 或 "two NAND"，答案均为 N。

## 题型 4.4 XOR 的性质与多输入奇校验
### 识别特征
题干出现 $Y=A\oplus B\oplus C\oplus D$、"odd number of its inputs are 1"、"parity"；或判断题问 XOR 与奇偶校验位的关系。
### 原题
来源：HW2 Q3。

> **Q3** A multiple-input XOR gate produces a logic 1 when an odd number of its inputs are 1. For the 4-input XOR function
>
> $$Y = A \oplus B \oplus C \oplus D,$$
>
> determine $Y$ for each input combination below.

| $A$ | $B$ | $C$ | $D$ | $Y$ |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | |
| 0 | 1 | 0 | 0 | |
| 1 | 1 | 0 | 0 | |
| 1 | 0 | 1 | 1 | |
| 1 | 1 | 1 | 1 | |
### 官方答案
作业未发布答案，以下为按定义自解并验算：

| $A$ | $B$ | $C$ | $D$ | 1 的个数 | $Y$ |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 | 2 | 0 |
| 1 | 0 | 1 | 1 | 3 | 1 |
| 1 | 1 | 1 | 1 | 4 | 0 |
### 解题步骤
1. **数 1 的个数，不逐级算** —— 由结合律 $(A\oplus B)\oplus C=A\oplus(B\oplus C)$，任意分组结果相同，直接数个数最快。
2. **奇数填 1，偶数填 0** —— 这就是"奇校验"定义。
3. **要表达式时用恒等式吸收常数** —— $X\oplus 0=X$、$X\oplus 1=\bar{X}$。
### 答案复盘
- 第 3 行 $1100$ 得 0：两个 1 抵消。最易错成 1，因为 2 输入 XOR 里 $11$ 出 0，但这里要数**全部四个**输入的 1 的个数。
- 第 5 行 $1111$ 得 0：四个 1，偶数。可见 $n$ 输入 XOR 的判据不能退化成"有没有 1"。
- 步骤 1 的合法性来自**结合律**：多输入 XOR 无需规定运算顺序，这也是讲义能直接用"1 的个数为奇数"定义多输入 XOR 的原因。两条常数性质在加法器里反复出现：$\Sigma=A\oplus B\oplus C_{in}$ 中 $C_{in}=0$ 时退化为半加器的 $A\oplus B$（见 09 文件）。
### 易错点
- 把"奇数个 1"读成"至少一个 1"，第 3、5 行会全错。
- 写成"1 的个数为偶数时输出 1" —— 那是 XNOR 的规则。
- 4 输入 XOR 有 8 个最小项（minterm，$m_1,m_2,m_4,m_7,m_8,m_{11},m_{13},m_{14}$），不要只列一半。
### 变体
- **奇偶校验位**：2025f Q1(2) "The XOR of all bits in a word yields the odd parity bit"。本卷无官方答案，按定义判 **N**：全部比特异或得 1 当且仅当 1 的个数为奇数，那正是**偶校验**位的取法；奇校验位是它的反（M2024 Q2(5) 的 $00101001$ 有三个 1，奇校验位取 0，正说明 $p=\overline{XOR}$）。
- **XOR 当反相器**：$X\oplus 1=\bar{X}$，图省门时可用常 1 输入的 XOR 代替 NOT。
- **五输入以上**：判据不变，数个数即可；若题目给的是"奇校验发生器 + 校验器"，校验器输出 1 表示传输出错，见 03 文件。

## 题型 4.5 噪声容限与器件互连（作业有、真题未考）

> **标签**：本题型在 HW2 出现两题，四套真题均未考（2024–2026 全卷检索无 $V_{OH}$、$NM$ 类题干）。属考纲内、零成本送分点。
### 识别特征
题干给一张 "Logic Family / $V_{DD}$ / $V_{IL}$ / $V_{IH}$ / $V_{OL}$ / $V_{OH}$" 表，或给 driver 的 $V_{OH},V_{OL}$ 与 receiver 的 $V_{IH},V_{IL}$，问 $NM_H$、$NM_L$、"能否可靠驱动"。
### 原题
来源：HW2 Q1、HW2 Q4。

> **Q1** Consider the following specifications.
>
> | Logic Family | $V_{DD}$ | $V_{IL}$ | $V_{IH}$ | $V_{OL}$ | $V_{OH}$ |
> |---|---|---|---|---|---|
> | TTL | 5.0 V | 0.8 V | 2.0 V | 0.4 V | 2.4 V |
> | LVCMOS | 3.3 V | 0.9 V | 1.8 V | 0.36 V | 2.7 V |
>
> (a) Calculate $NM_H$ and $NM_L$ for TTL.
> (b) Calculate $NM_H$ and $NM_L$ for LVCMOS.
> (c) Based only on the voltage thresholds shown, determine whether a TTL output can reliably drive an LVCMOS input. Justify your answer using $V_{OH}$ and $V_{IH}$.

> **Q4** A driver has the specifications
>
> $$V_{OH} = 3.0\ \text{V}, \qquad V_{OL} = 0.25\ \text{V}.$$
>
> A receiving gate has the input specifications
>
> $$V_{IH} = 2.1\ \text{V}, \qquad V_{IL} = 0.8\ \text{V}.$$
>
> (a) Calculate $NM_H$ and $NM_L$.
> (b) A long wire causes a maximum HIGH-level voltage drop of 0.55 V. What is the minimum HIGH voltage received?
> (c) Is the received HIGH voltage guaranteed to be recognized as logic 1? Justify your answer quantitatively.
> (d) Noise can raise a LOW-level voltage by 0.40 V. What is the maximum voltage received for a transmitted logic 0?
> (e) Is the received LOW voltage guaranteed to be recognized as logic 0?
### 官方答案
作业未发布答案，以下为按规则自解并用 Python 验算：

**Q1**　(a) $NM_H=2.4-2.0=0.4\ \text{V}$，$NM_L=0.8-0.4=0.4\ \text{V}$。
(b) $NM_H=2.7-1.8=0.9\ \text{V}$，$NM_L=0.9-0.36=0.54\ \text{V}$。
(c) Yes. $V_{OH}(\text{TTL})=2.4\ \text{V}>V_{IH}(\text{LVCMOS})=1.8\ \text{V}$，且 $V_{OL}(\text{TTL})=0.4\ \text{V}<V_{IL}(\text{LVCMOS})=0.9\ \text{V}$，两个方向都过关。

**Q4**　(a) $NM_H=3.0-2.1=0.9\ \text{V}$，$NM_L=0.8-0.25=0.55\ \text{V}$。
(b) $3.0-0.55=2.45\ \text{V}$。
(c) Yes. $2.45\ \text{V}>2.1\ \text{V}$，尚余 $0.35\ \text{V}$。
(d) $0.25+0.40=0.65\ \text{V}$。
(e) Yes. $0.65\ \text{V}<0.8\ \text{V}$。
### 解题步骤
1. **分清四个量属于谁** —— $V_{OH},V_{OL}$ 是**驱动器输出**的保证值，$V_{IH},V_{IL}$ 是**接收器输入**的门限，两者不在同一颗芯片上。
2. **两个减法，被减数都是驱动器的量** —— 高电平怕往下掉，$NM_H=V_{OH}-V_{IH}$；低电平怕往上抬，$NM_L=V_{IL}-V_{OL}$。减反会得到负数。
3. **判互连** —— $NM_H>0$ 且 $NM_L>0$ 即可靠；等价写法是 $V_{OH}>V_{IH}$ 且 $V_{OL}<V_{IL}$。
4. **有噪声时直接加减** —— 压降从 $V_{OH}$ 里扣，抬升加到 $V_{OL}$ 上，再与门限比大小。
5. **两套判据互检** —— "剩余余量 $>0$" 与 "实际电平越过门限" 必须同时成立。
### 答案复盘
- Q4(a) 的两个数就是两条预算：0.9 V 与 0.55 V。**两条预算不等长是常态**，系统容限取 $\min(NM_H,NM_L)=0.55\ \text{V}$，由低电平一侧决定。Q4(b) 只做 $V_{OH}-0.55$，这是**步骤 4**（压降从输出高电平里扣）。不能用 $NM_H$ 减 —— 那得到 0.35 V，是"还剩多少余量"，不是"收到多少伏"。
- Q4(c) 把 2.45 V 与 2.1 V 直接比，等价于"消耗的 0.55 V 少于 $NM_H$ 0.9 V"；两法同源，即**步骤 5** 的自检。Q4(d)(e) 是 (b)(c) 的镜像：噪声把低电平往上抬，最坏收到 0.65 V，仍低于 $V_{IL}=0.8$，故安全。若抬到 0.60 V，收到 0.85 V $>$ 0.8 V，即误判为 1。
- Q1(c) 题干写 "based only on the voltage thresholds"，是**限定条件**：只答两个不等式，不要扯扇出、电流、$V_{DD}$ 差异。四族数据与讲义 p23 一致：TTL 与 LVTTL 都是 $0.40/0.40$，LVCMOS 是 $0.54/0.90$，与本题 (a)(b) 吻合，可用来自查。
### 易错点
- 减法顺序写反：$V_{IH}-V_{OH}$ 得负数，误判"不兼容"。
- 把 $NM$ 当成"实际收到的电压"：$NM$ 是**还能吃多少噪声**，单位虽同为伏特，含义不同。
- 用标称 $V_{DD}$ 当 $V_{OH}$：$V_{OH}$ 是保证的最坏输出，永远小于 $V_{DD}$（TTL 5.0 V 供电、$V_{OH}$ 只保证 2.4 V）。
- 只查高电平或只查低电平：两个方向都要过，容限取小的那条。
- 题干说 "based only on voltage" 又去算电流，属超纲作答。
### 变体
- **扇出与电流驱动**：电压过关后还要过电流判据 $N\le I_{OL}/I_{IL}$（拉低）与 $N\le I_{OH}/I_{IH}$（拉高）。讲义只在"缓冲器的用途"处定性提到扇出，三份作业与四套卷均未出定量题，记住"电压与电流要分别满足"即可。
- **加温度或容差**：$V_{OH}$ 随温度下降，若给两个温度下的值，取**更坏**的那个代公式。
- **中间插入缓冲器**：把驱动器的 $V_{OH}/V_{OL}$ 换成缓冲器的，两段各自判一次。

## 自测题

1. 三输入 NAND 的输入为 $1,1,0$，输出是多少？
2. $Y=A\oplus B\oplus C\oplus D\oplus E$，输入 $1,0,1,1,0$，求 $Y$。
3. 驱动器 $V_{OH}=4.2\ \text{V}$、$V_{OL}=0.2\ \text{V}$；接收器 $V_{IH}=3.4\ \text{V}$、$V_{IL}=0.9\ \text{V}$。求 $NM_H$、$NM_L$。
4. 承上题，导线造成 0.9 V 的高电平压降，接收端还能认出 1 吗？用两种判据各说一遍。
5. 某门输出列（按 $00,01,10,11$）为 $1110$，等价于哪个基本门？输出列为 $1000$ 呢？

## 自测题答案

1. NAND 只有输入全 1 才出 0；有 0 就出 1，故为 **1**。
2. 三个 1（第 1、3、4 位），奇数 → $Y=1$。
3. $NM_H=4.2-3.4=0.8\ \text{V}$；$NM_L=0.9-0.2=0.7\ \text{V}$。
4. 不能。判据一：收到 $4.2-0.9=3.3\ \text{V}<3.4\ \text{V}$；判据二：压降 0.9 V 已超过 $NM_H=0.8\ \text{V}$。两者同源。
5. $1110$ 是"除 11 外全 1"→ **OR**（$A+B$）；$1000$ 是"只在 00 为 1"→ **NOR**（$\overline{A+B}$）。
