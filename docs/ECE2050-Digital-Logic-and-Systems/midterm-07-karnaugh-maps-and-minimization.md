---
title: 07 卡诺图与最小化
---

# 07 卡诺图与最小化

> **真题分布**：M2024 Q2(3)、Q6(1)、Q8；M2025s Q6(2)；M2025f Q1(1)、Q4(3)；M2026 Q4(2)(3)；HW2 Q5；HW3 Q2　|　**考频**：4/4 年，单题 5–16 分
> **一句话**：把真值表搬上 16 格图，圈出「最大且必要」的组，每圈换一个乘积项，再用项数与文字数判断是否最简。

## 这个课题在考什么

卡诺图（Karnaugh map，K-map）是期中唯一靠画图得分的题型：即使最后一项写错，圈对了也能拿大半分。四套卷里它从不单独出现，最小式后面必然接「实现」：画门电路（M2024 Q6(1)、M2026 Q4(3)）、接 74HC151（M2024 Q6(2)）、接 4 位译码器（M2025s Q6(3)）。

入口只有两类：给真值表（M2024 Q6、M2025s Q6、M2026 Q4），或给文字规格（M2024 Q8、HW2 Q5、HW3 Q2）。后者一定带 BCD 约束与无关项（don't care），是本章最容易丢分的地方。

得分点有五处：坐标顺序写对、组的形状与格数合法、每个 1 都被覆盖、表达式确实最简、门电路与表达式一致。本文所有最小式都用 Python 穷举复核：枚举全部质蕴含项组合，同时最小化项数与文字总数，并检查最优解是否唯一。

## 必备知识（只看解题要用到的）

| # | 条目 | 规则 |
|---|---|---|
| 1 | 格数 | $2^{n}$ 格：3 变量 8 格，4 变量 16 格，5 变量 32 格 |
| 2 | 坐标 | 行标签 AB、列标签 CD，都按 $00,01,11,10$（格雷序） |
| 3 | 相邻 | 两个最小项的编号只差一位；含上下、左右跨边界 |
| 4 | 组形 | 组内格数只能是 $1,2,4,8,16$，且必须拼成矩形（可跨边界） |
| 5 | 文字数 | $k$ 格组 → $n-\log_2 k$ 个文字（literal）；$4$ 格组在 4 变量图里是 2 个文字 |
| 6 | SOP | 圈 1：组内恒为 1 的变量取原形，恒为 0 的取反，各项相加 |
| 7 | POS | 圈 0：组内恒为 0 的变量取原形，恒为 1 的取反，因子内相加 |
| 8 | 无关项 | 记作 X，既可当 1 也可当 0；不能单独成组，必须与至少一个 1 同组 |
| 9 | 覆盖 | 每个 1 至少进一组；每组至少含一个「只有它能覆盖」的 1，否则该组可删 |
| 10 | 最简 | 先比项数（SOP 项数 / POS 因子数），再比文字总数 |

- 素蕴含项（prime implicant）= 不能再扩大的合法组；本质素蕴含项（essential prime implicant）= 含某个「只被它覆盖」的 1，必选。
- 本课题只讲卡诺图的布局、圈组规则与无关项；标准 SOP/POS 的定义与互转见 06 文件，纯代数化简见 05 文件，NAND/NOR 落地见 08 文件，译码器与 MUX 见 10 文件。

## 4 变量卡诺图的坐标：为什么用格雷序

行标签 AB 依次 $00,01,11,10$，列标签 CD 同理，任意相邻两行（列）只差一位：$00\to01$ 差 B，$01\to11$ 差 A，$11\to10$ 差 B，$10\to00$ 差 A，首尾也相邻。若按二进制序 $00,01,10,11$ 排，第 2 列与第 3 列差两位，两个只差一位的最小项会被拆到不相邻的位置，无法合并。

格雷码（Gray code）的意义正在此：一圈 $2^{k}$ 格里，$k$ 个变量在变，其余 $n-k$ 个变量恒定；恒定的那 $n-k$ 个变量就是乘积项。

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="2" colspan="2">AB \ CD</th><th style="border:1px solid #999;padding:4px 10px" colspan="4">CD</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="4">AB</th><th style="border:1px solid #999;padding:4px 10px">00</th><td style="border:1px solid #999;padding:4px 10px">$m_0$</td><td style="border:1px solid #999;padding:4px 10px">$m_1$</td><td style="border:1px solid #999;padding:4px 10px">$m_3$</td><td style="border:1px solid #999;padding:4px 10px">$m_2$</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">01</th><td style="border:1px solid #999;padding:4px 10px">$m_4$</td><td style="border:1px solid #999;padding:4px 10px">$m_5$</td><td style="border:1px solid #999;padding:4px 10px">$m_7$</td><td style="border:1px solid #999;padding:4px 10px">$m_6$</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">11</th><td style="border:1px solid #999;padding:4px 10px">$m_{12}$</td><td style="border:1px solid #999;padding:4px 10px">$m_{13}$</td><td style="border:1px solid #999;padding:4px 10px">$m_{15}$</td><td style="border:1px solid #999;padding:4px 10px">$m_{14}$</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">10</th><td style="border:1px solid #999;padding:4px 10px">$m_8$</td><td style="border:1px solid #999;padding:4px 10px">$m_9$</td><td style="border:1px solid #999;padding:4px 10px">$m_{11}$</td><td style="border:1px solid #999;padding:4px 10px">$m_{10}$</td></tr>
</table>

- 表内是**最小项编号**，不是二进制值。第 3 列是 11，第 4 列才是 10；把 10 写在 11 左边是这张图唯一的「反直觉」之处。
- 读格技巧：编号 = $8A+4B+2C+D$。要在图上找 $m_{13}$，先算 $13=1101$，按 AB=11、CD=01 定位。

**相邻关系四条**

- 左右相邻：同一行相邻两列，含最左列与最右列（CD=00 与 CD=10 相邻）；上下相邻：同一列相邻两行，含最上行与最下行（AB=00 与 AB=10 相邻），这就是「跨边界」。
- 四角可以成组：$m_0,m_2,m_{10},m_8$ 四格（$B=0,D=0$）是合法 4 格圈，因为它在图上首尾相接成环；斜对不相邻：$m_0$ 与 $m_{10}$ 差 A、C 两位，$m_6$ 与 $m_9$ 差三位，任何情况下都不能同组。

## 题型 7.1 布局与相邻性：概念题

### 识别特征

一句话问「多少格」「对角能否合并」「$m_x$ 与 $m_y$ 是否相邻」，不给真值表、不给表达式。

### 原题

> 2. (10 points) Provide your answers to the following short questions.
>
> (3) How many cells do a 4-variable Karnaugh map have?

> 1. (10 points) Are the following statements necessarily true (Y) or not (N)?
>
> (1) Diagonal adjacency is valid for grouping minterms in a Karnaugh map;

### 官方答案

> (3) 16;
>
> (1) N

### 解题步骤

1. **数格**：格数 $=2^{n}$，与图上格子怎么摆无关；4 变量 16 格，5 变量是两张 16 格叠起来，仍是 32。
2. **判相邻**：编号写成 4 位二进制逐位比较；异或结果是 2 的幂（1、2、4、8）则相邻，是 3、6、12 这类多位数则不相邻。
3. **判对角**：斜对两格必然行列各变一位，差 2 位以上，一律判不相邻。

### 答案复盘

- 16 是 $2^{4}$，不是「4 行 $\times$ 4 列」的巧合；4 变量图恰好是方阵，5 变量图不是。官方判 N 的根据就是第 2 步：对角格差两位，合并后剩下的不是乘积项。$m_0$ 与 $m_{10}$ 若强行合并，得到 $B=0,D=0$，收进的却是没被圈到的 $m_2,m_8$，值就错了。
- 「四角相邻」只对同边成立：$m_0$—$m_2$、$m_2$—$m_{10}$、$m_{10}$—$m_8$、$m_8$—$m_0$ 两两相邻，而 $m_0$—$m_{10}$ 不相邻；四格成组靠这个环，不靠斜线。

### 易错点

- 把行列标签写成 $00,01,10,11$（二进制序），自己把自己搞成无法合并。
- 忘记第 4 列（10）与第 1 列（00）相邻，漏掉本可做大的圈。
- 混「跨边界相邻」与「斜对不相邻」：$m_0$ 与 $m_8$ 可合并，$m_0$ 与 $m_{10}$ 不可。

### 变体

- 3 变量图：2 行（A=0/1）$\times$ 4 列（BC=$00,01,11,10$），共 8 格。M2025f Q4 用的就是它。
- 问「$n$ 变量图最多几项」：一次圈全图 16 格得常数 1，说明项数上限由 1 的散布决定，不由格数决定。

## 题型 7.2 真值表 → 最小 SOP → 门电路

### 识别特征

题干给完整真值表，要求 "minimized SOP ... using K-map"，第二问要求用 AND/OR/Inverter 实现，并常说「反相信号不可得」。

### 原题

> 6. (15 points)
>
> (1) Derive the minimized SOP expression from the truth table below using K-map (5 points), and implement it using basic gates such as AND, OR, Inverter(5 points). The complementary inputs, if needed, are **NOT** directly available, i.e. $\bar{A},\bar{C},\bar{D}$ are NOT available. Same for the question below.
>
> Table 1: The truth table of Q.6.

| A | B | C | D | X |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 1 | 0 | 1 |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 0 | 1 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |

### 官方答案

> (1) The K-map is shown in Fig. 8.
>
> The minimized SOP form is:
>
> $$X = ACD + A\bar{B} + \bar{B}C + \bar{A}B\bar{C}\bar{D}$$
>
> The logic circuit implemented is shown in Fig. 9.

官方 K-map（Fig. 8）重绘，1 的位置为 $m_2,m_3,m_4,m_8,m_9,m_{10},m_{11},m_{15}$：

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="2" colspan="2">AB \ CD</th><th style="border:1px solid #999;padding:4px 10px" colspan="4">CD</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="4">AB</th><th style="border:1px solid #999;padding:4px 10px">00</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">01</th><td style="border:1px solid #999;padding:4px 10px;background:#fff3cd">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">11</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">10</th><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 33%,#fce8e6 33% 66%,#e6f4ea 66%)">1</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#fce8e6 50%)">1</td></tr>
</table>

- 组1（蓝，4 格，$m_8,m_9,m_{10},m_{11}$）→ $A\bar{B}$
- 组2（红，4 格，$m_2,m_3,m_{10},m_{11}$，跨上下边界）→ $\bar{B}C$
- 组3（绿，2 格，$m_{11},m_{15}$，第 3 列上下两格）→ $ACD$
- 组4（黄，1 格，$m_4$）→ $\bar{A}B\bar{C}\bar{D}$
- 斜分或三段的渐变色格表示同时属于多组（$m_{10}$ 属组1+组2，$m_{11}$ 属三组）。

<svg viewBox="0 0 520 300" width="520" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M20,40 H60 M20,100 H60 M20,160 H60 M20,220 H60 M87,40 H112 M87,100 H112 M87,160 H112 M87,220 H112" stroke="#333" stroke-width="1.4" fill="none"/>
  <path d="M60,26 L80,40 L60,54 Z M60,86 L80,100 L60,114 Z M60,146 L80,160 L60,174 Z M60,206 L80,220 L60,234 Z" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <circle cx="83.5" cy="40" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="83.5" cy="100" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="83.5" cy="160" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="83.5" cy="220" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <path d="M116,33 H127 M116,93 H127 M116,153 H127 M116,213 H127" stroke="#333" stroke-width="1.4" fill="none"/>
  <text x="12" y="44" font-style="italic">A</text><text x="12" y="104" font-style="italic">B</text><text x="12" y="164" font-style="italic">C</text><text x="12" y="224" font-style="italic">D</text>
  <text x="116" y="44" font-style="italic">A</text><text x="116" y="104" font-style="italic">B</text><text x="116" y="164" font-style="italic">C</text><text x="116" y="224" font-style="italic">D</text>
  <path d="M250,24 H270 A21,21 0 0 1 270,66 H250 Z M250,94 H266 A14,14 0 0 1 266,122 H250 Z M250,150 H266 A14,14 0 0 1 266,178 H250 Z M250,198 H274 A28,28 0 0 1 274,254 H250 Z M390,136 Q414,136 430,158 Q414,180 390,180 Q400,158 390,136 Z" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <path d="M212,31 H250 M212,45 H250 M212,59 H250 M222,101 H250 M222,115 H250 M222,157 H250 M222,171 H250 M212,205 H250 M212,219 H250 M212,233 H250 M212,247 H250" stroke="#333" stroke-width="1.4" fill="none"/>
  <path d="M218,108 H227 M218,150 H227 M208,198 H217 M208,226 H217 M208,240 H217" stroke="#333" stroke-width="1.4" fill="none"/>
  <text x="208" y="35" font-style="italic" text-anchor="end">A</text><text x="208" y="49" font-style="italic" text-anchor="end">C</text><text x="208" y="63" font-style="italic" text-anchor="end">D</text><text x="218" y="105" font-style="italic" text-anchor="end">A</text><text x="218" y="119" font-style="italic" text-anchor="end">B</text><text x="218" y="161" font-style="italic" text-anchor="end">B</text><text x="218" y="175" font-style="italic" text-anchor="end">C</text><text x="208" y="209" font-style="italic" text-anchor="end">A</text><text x="208" y="223" font-style="italic" text-anchor="end">B</text><text x="208" y="237" font-style="italic" text-anchor="end">C</text><text x="208" y="251" font-style="italic" text-anchor="end">D</text>
  <path d="M291,45 H350 V142 H390 M280,108 H360 V154 H390 M280,164 H370 V166 H390 M302,226 H380 V178 H390 M430,158 H470" stroke="#333" stroke-width="1.4" fill="none"/>
  <text x="476" y="162" font-style="italic">X</text>
</svg>

左侧四个反相器产生 $\bar A,\bar B,\bar C,\bar D$（题目规定反相信号不可得，必须自备）；各与门输入旁的文字即所接信号，字母上的短横表示该反相输出。

### 解题步骤

1. **算编号再落格**：每行按 $8A+4B+2C+D$ 求编号，再按「行 = AB、列 = CD」定位；切勿按表格行序从左到右填。
2. **先找本质素蕴含项**：$m_{15}$ 只能与 $m_{11}$ 合并 → $ACD$ 必选；$m_4$ 的四邻（$m_0,m_5,m_6,m_{12}$）全是 0 → 只能单格成组。
3. **再补大圈**：$m_8$–$m_{11}$ 连成整行 → $A\bar B$；$m_2,m_3$ 与 $m_{10},m_{11}$ 跨上下边界成 4 格 → $\bar BC$。
4. **读项后画图**：组内恒为 1 取原形、恒为 0 取反；每个乘积项一个与门，全部与门进一个或门，用到的反变量各配一个反相器（本题 4 个全用上）。

### 答案复盘

- **为什么先圈整行 $A\bar B$**：行 10 的四个 1 连成 4 格，读成 2 个文字；若拆成两组，只得 $A\bar B\bar C$ 与 $A\bar BC$，共 6 文字。**为什么 $m_4$ 只能单格**：合并的前提是相邻格为 1 或 X，而 $m_4$ 的四个邻居全为 0，故 $\bar A B\bar C\bar D$ 的 4 个文字无法避免，这是本题 11 文字的主因。
- **为什么 $m_{15}$ 一定要圈**：它只有 $m_{11}$ 一个伙伴（$m_7,m_{13},m_{14}$ 都是 0），故 $ACD$ 是本质素蕴含项，不圈就漏 1。
- **重复覆盖与最简性**：$m_{11}$ 同属三组，但每组都有独占的 1（组1 靠 $m_8$、组2 靠 $m_2$、组3 靠 $m_{15}$）就不算冗余。穷举确认 4 项 / 11 文字唯一最优；圈 0 得 4 因子 / 12 文字，比 SOP 贵，官方选 SOP 正确。

### 易错点

- 把 $m_{10}$ 与 $m_{11}$ 的列序写反，导致 $A\bar B$ 读成 $AB$；或圈出斜对的两格（如 $m_2,m_{11}$），得到不存在的乘积项。
- 只圈出所有 1 就收工，不检查是否还能合并（本图 $m_2,m_3$ 必须与 $m_{10},m_{11}$ 合）。
- 画电路时以为 A、B、C、D 都在手边就直接接反相信号：题目明确 $\bar A,\bar C,\bar D$ 不可得，缺反相器要扣分。
- 与门输入数写错：$ACD$ 是 3 输入，$\bar A B\bar C\bar D$ 是 4 输入。

### 变体

- **追加一问「最小 POS」**：0 在 $m_0,m_1,m_5,m_6,m_7,m_{12},m_{13},m_{14}$，最小 POS 为 $(A+B+C)(A+\bar B+\bar C)(\bar A+\bar B+D)(\bar B+C+\bar D)$，4 因子 / 12 文字（另有 1 组等价最优解），正好与 11 文字的 SOP 对照。
- **把 A 定义为最低位**：整张图沿主对角线镜像，圈的形状不变，但每项要按新位序重读。
- **加第 5 个变量**：两张 16 格图按 $E$ 叠放，同一位置的两格可合并（消去 E），其余规则不变。

## 题型 7.3 最小 POS：圈 0 再取反

### 识别特征

题干出现 "minimum product of sums (POS)"、"Product-of-Sum"，或问「用或与式实现」；给的是真值表或一句文字描述。

### 原题

> 6. (15 points) Design a circuit with four inputs, namely $A, B, C$, and $D$, and one output $Y$. The output is 1 when the consecutive sequence '110' is present, e.g., 0110.
>
> (1) (3 points) Develop the truth table for $Y$ with four inputs $A, B, C$ and $D$;
>
> (2) (5 points) Use a Karnaugh map to find the minimum product of sums (POS) form of $Y$;

### 官方答案

> (2) Fig. 6(b).
>
> $$Y = B(\bar{C} + \bar{D})(A + C)$$

官方 K-map（Fig. 6(b)）重绘。$Y=1$ 于 $m_6,m_{12},m_{13},m_{14}$，其余为 0：

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="2" colspan="2">AB \ CD</th><th style="border:1px solid #999;padding:4px 10px" colspan="4">CD</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="4">AB</th><th style="border:1px solid #999;padding:4px 10px">00</th><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#e6f4ea 50%)">0</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#e6f4ea 50%)">0</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#fce8e6 50%,#e6f4ea 50%)">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">01</th><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">0</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">0</td><td style="border:1px solid #999;padding:4px 10px">1</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">11</th><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">0</td><td style="border:1px solid #999;padding:4px 10px">1</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">10</th><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">0</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#fce8e6 50%,#e6f4ea 50%)">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">0</td></tr>
</table>

- 组1（蓝，4 格，$m_0,m_1,m_4,m_5$）→ $A+C$
- 组2（红，4 格，$m_3,m_7,m_{15},m_{11}$，整列 CD=11）→ $\bar{C}+\bar{D}$
- 组3（绿，8 格，行 00 与行 10 的全 8 格）→ $B$
- 斜分渐变色格表示同时属于两组（$m_0,m_1$ 属组1+组3，$m_3,m_{11}$ 属组2+组3）。

### 解题步骤

1. **照常填图**：1 与 0 都标上（无 X 时 0 必须标，因为 POS 要圈 0）。
2. **改圈 0**：所有规则不变，只是把 0 当作「1」来圈，越大越好；格数仍是 1/2/4/8/16。
3. **每个圈写一个因子**：组内恒为 0 的变量取原形，恒为 1 的取反，因子内用 $+$ 连接，因子之间相乘。
4. **覆盖检查**：每个 0 至少进一圈，且每圈至少含一个不被别的圈覆盖的 0；随后任取一行验算，为 1 的输入代入应得 1，为 0 的至少有一个因子为 0。

### 答案复盘

- **官方为什么圈 0、是否最简**：题目要 POS，若圈 1 得 $Y=AB\bar C+BC\bar D$（2 项 6 文字），形式上更短却答非所问——POS 必须由 0 组给出。本式 3 因子 / 5 文字，穷举确认唯一最优；与最小 SOP 相比项数、文字数各胜一项，题目指定 POS 时按题目答。
- **组1 → $(A+C)$，组2 → $(\bar C+\bar D)$**：组1 四格为行 00、01 与列 00、01，$A=0$、$C=0$ 恒定，0 取原形故得 $(A+C)$；组2 占整列 CD=11，$C=1$、$D=1$ 恒定，取反得 $(\bar C+\bar D)$，官方图上的细长椭圆本质就是「整列 4 格」。
- **组3 → $(B)$**：行 00 与行 10 共 8 格，只剩 $B=0$ 一个恒定变量，取原形，故因子是 $(B)$ 而不是 $(\bar B)$；8 格组只出 1 个文字，这是 POS 省文字的关键。

### 易错点

- 因子内变量取反搞反：组内恒为 0 的变量写原形，这是 POS 与 SOP 唯一的形式差别。
- POS 写成相加：$(A+C)+(\bar C+\bar D)$ 是把或与式写成了或式，值完全不同。
- 只圈 4 格以下，漏掉 8 格的 $(B)$，结果多出两个因子；或把 $(B)$ 写成 $(\bar B)$，极性不能反。
- 题目同时要「standard POS」时别交最小式：标准式每个因子必须含全部变量（M2025f Q4 见下）。

### 变体

**变体原题**（M2025f Q4，本卷不提供答案，3 变量）：

> 4. (16 points) A circuit has four inputs and two outputs. The inputs $A_{2:0}$ represent a number from 0 to 7. Output $P$ should be TRUE if the number is not prime (0 and 1 are not prime, but 2, 3, 5, and so on, are prime). Output $D$ should be TRUE if the number is divisible by 4. (Tips: A prime number is a number greater than 1 that has no divisors other than 1 and itself.)
>
> (2) (6 points) Give simplified Boolean equation for the output $D$.
>
> (3) (5 points) Give the standard Product-of-Sum (POS) form for output $P$.

自算结果（已复核）：$D=\bar{A}_1\bar{A}_0$（即 $m_0,m_4$ 两格合并，2 文字）。

$P=1$ 于 $m_0,m_1,m_4,m_6$，0 于 $m_2,m_3,m_5,m_7$：

- 标准 POS（每个因子含全部变量）：$P=(A_2+\bar{A}_1+A_0)(A_2+\bar{A}_1+\bar{A}_0)(\bar{A}_2+A_1+\bar{A}_0)(\bar{A}_2+\bar{A}_1+\bar{A}_0)$，4 个最大项。
- 最小 POS：$(A_2+\bar{A}_1)(\bar{A}_2+\bar{A}_0)$，2 因子 4 文字。
- 最小 SOP：$\bar{A}_2\bar{A}_1+A_2\bar{A}_0$，2 项 4 文字，与最小 POS 同价。

要点：题目写 "standard" 就按最大项逐个列，写 "minimum" 才允许合并；同一函数的标准式有 4 项而最小式只有 2 项，差别全在合并。

## 题型 7.4 无关项：BCD 约束下的「恰好两个 1」

### 识别特征

题干给一段业务描述（"only produce a 1 output when exactly 2 input variables are 1s"），输入被声明为 BCD，真值表里出现 X；或明说 "treat ... as don't cares"。

### 原题

> 8. (10 points) Develop a logic circuit with **BCD** inputs that will only produce a 1 output when exactly 2 input variables are 1s.
>
> (1) Please develop the truth table for the above circuit.
>
> (2) Please use K-map to derive the minimized SOP expression for the circuit.

### 官方答案

> (2) $$X = AB + AC + AD + BC\bar{D} + B\bar{C}D + \bar{B}CD$$

官方真值表：$X=1$ 于 $m_3,m_5,m_6,m_9$；$X=0$ 于 $m_0,m_1,m_2,m_4,m_7,m_8$；$m_{10}$–$m_{15}$ 为 X。

官方 K-map（Fig. 15）重绘：

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="2" colspan="2">AB \ CD</th><th style="border:1px solid #999;padding:4px 10px" colspan="4">CD</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="4">AB</th><th style="border:1px solid #999;padding:4px 10px">00</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">01</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#fff3cd">1</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">11</th><td style="border:1px solid #999;padding:4px 10px">X</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#e6f4ea 50%)">X</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">X</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#fff3cd 50%)">X</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">10</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#fce8e6 50%)">X</td><td style="border:1px solid #999;padding:4px 10px">X</td></tr>
</table>

- 组1（蓝，4 格，$m_9,m_{11},m_{13},m_{15}$）→ $AD$
- 组2（红，2 格，$m_3,m_{11}$）→ $\bar{B}CD$
- 组3（绿，2 格，$m_5,m_{13}$）→ $B\bar{C}D$
- 组4（黄，2 格，$m_6,m_{14}$）→ $BC\bar{D}$

> **勘误**：官方式 6 项 14 文字，其中 $AB$（$m_{12}$–$m_{15}$）与 $AC$（$m_{10},m_{11},m_{14},m_{15}$）两圈内全是无关项，不含任何一个 1，属无效圈，必须删。删后为
> $$X = AD + \bar{B}CD + B\bar{C}D + BC\bar{D}$$
> 4 项 11 文字，穷举确认这是唯一最优解。考试时按 4 项作答，并可在旁边注明「$AB$、$AC$ 覆盖不到任何 1，故舍去」。

### 解题步骤

1. **先判码域**：BCD 只用到 $0000$–$1001$（0–9），$1010$–$1111$（10–15）不可能出现，标 X。这一步只做一次，后面都受益。
2. **按业务规则填 1/0**：$m_3,m_5,m_6,m_9$ 各有两个 1 → 填 1；$m_0,m_1,m_2,m_4,m_7,m_8$ 的 1 的个数不是 2 → 填 0。
3. **把 X 当「可用的 1」，但禁止纯 X 圈**：只要整组是矩形且含至少一个真 1，就可把 X 圈进来；优先圈那些「能把 2 格变 4 格」的 X，本题 $m_{11},m_{13},m_{15}$ 让 $m_9$ 由 $AB\bar{C}\bar{D}$（4 文字）变成 $AD$（2 文字）；而整圈皆 X 的项对输出毫无贡献，必须删（官方本题正败在这里）。
4. **复查**：把每个 1 打勾，再把 X 逐一代入，确认没有把某个合法码 0 圈进去（例如 $m_7$ 是三个 1 的码，不能圈）。

### 答案复盘

- **为什么 $AD$ 圈得动**：$m_9$ 的四个邻居中 $m_1,m_8$ 为 0，$m_{11},m_{13}$ 为 X。把 $m_{11},m_{13},m_{15}$ 三个 X 一起收进来，四格拼成右下 $2\times 2$，$A=1,D=1$ 恒定 → 2 文字。
- **为什么 $m_3$ 只能做 2 格**：$m_3$ 的邻居是 $m_1=0$、$m_2=0$、$m_7=0$、$m_{11}=X$，只有 $m_{11}$ 可用，故只能是 3 文字的 $\bar BCD$；想做成 4 格必须拉进 $m_7$，但 $m_7$ 是合法码 7（三个 1），值为 0，不能进圈。$m_5$、$m_6$ 同构：各只与 $m_{13}$、$m_{14}$ 一个 X 相邻，形成「1 + X」的竖对。
- **官方的两个空圈从哪来、是否另有最优解**：$AB$ 覆盖 $m_{12}$–$m_{15}$、$AC$ 覆盖 $m_{10},m_{11},m_{14},m_{15}$，都是「四个 X 拼成的 4 格圈」，只让函数在非法码上取 1，没覆盖任何合法码，纯属浪费两个与门。最优解唯一：4 项 11 文字；若把 X 全取 0，成本立刻涨到 4 项 16 文字（四个单格圈），可见 X 的价值全在「把 2 格扩成 4 格」。

### 易错点

- 把 $m_7$ 当无关项：7 是合法 BCD 码，只是它的 1 的个数为 3，必须判 0；也别把 $m_{10}$ 算成合法码，非法码一共 6 个。
- 只圈 1 不看 X，得到 4 个 4 文字项，成本翻倍。
- 圈出「全是 X」的组，本题官方就多写了 $AB$ 与 $AC$ 两项。

### 变体

- **改判据**：换成「奇数个 1」时 1 落在 $m_1,m_2,m_4,m_7,m_8$；换成「恰好一个 1」时落在 $m_1,m_2,m_4,m_8$。流程完全一样，只换 1 的集合。
- **改码域**：若输入只有 0–7（3 变量），就不存在非法码，也就没有 X 可用，成本显著上升（参考自测题第 4 题）。
- **加第二问「若非法码必须输出 0」**：把所有 X 改 0 重圈，四个 1 全部孤立，成本升到 4 项 16 文字（见章末自测题第 5 题）。

## 题型 7.5 共阳七段译码器：g 段的最小化

### 识别特征

题干出现 "common-anode 7-segment display"、"a segment is considered activated when the output is Low(0)"，要求先写真值表，再对某一段做标准 SOP + 最小化 + 画图。

### 原题

> 4. (16 points) In a common-anode 7-segment display, each of the seven segments is activated for various digits, and a segment is considered "activated" when the output is Low(0). For example, segment a is activated for the digits 0, 2, 3, 5, 6, 7, 8, and 9, as illustrated in the below figure.
>
> (1) (7 points) Since each digit can be represented by a BCD code using $ABCD$ ($A$ is the MSB), develop a truth table for this BCD to 7-segment decoder.
>
> (2) (6 points) Derive a standard SOP for segment 'g' and minimize the expression using a K-Map.
>
> (3) (3 points) Draw the logic diagram for the segment-g logic using basic logic gates.

### 官方答案

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px">A</th><th style="border:1px solid #999;padding:4px 10px">B</th><th style="border:1px solid #999;padding:4px 10px">C</th><th style="border:1px solid #999;padding:4px 10px">D</th><th style="border:1px solid #999;padding:4px 10px">a</th><th style="border:1px solid #999;padding:4px 10px">b</th><th style="border:1px solid #999;padding:4px 10px">c</th><th style="border:1px solid #999;padding:4px 10px">d</th><th style="border:1px solid #999;padding:4px 10px">e</th><th style="border:1px solid #999;padding:4px 10px">f</th><th style="border:1px solid #999;padding:4px 10px">g</th></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
</table>

> (2) $$\bar{A}\bar{B}\bar{C}\bar{D} + \bar{A}\bar{B}C\bar{D} + \bar{A}BCD$$
>
> $$\bar{A}\bar{B}\bar{C} + BCD$$

官方 K-map 重绘（$g=1$ 于 $m_0,m_1,m_7$；$m_{10}$–$m_{15}$ 为 X）：

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="2" colspan="2">AB \ CD</th><th style="border:1px solid #999;padding:4px 10px" colspan="4">CD</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="4">AB</th><th style="border:1px solid #999;padding:4px 10px">00</th><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">01</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">11</th><td style="border:1px solid #999;padding:4px 10px">X</td><td style="border:1px solid #999;padding:4px 10px">X</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">X</td><td style="border:1px solid #999;padding:4px 10px">X</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">10</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">X</td><td style="border:1px solid #999;padding:4px 10px">X</td></tr>
</table>

- 组1（蓝，2 格，$m_0,m_1$）→ $\bar{A}\bar{B}\bar{C}$
- 组2（红，2 格，$m_7,m_{15}$，第 3 列上下两格）→ $BCD$

> **核对**：官方标准式写得对，三项正好是 $m_0$、$m_1$、$m_7$：
> $$\bar{A}\bar{B}\bar{C}\bar{D}+\bar{A}\bar{B}\bar{C}D+\bar{A}BCD$$
> 扫描件分辨率低时，中间项的 $\bar{C}$ 极易看成 $C$（于是误当 $m_2$）；对答案时务必看清横线覆盖的是哪个字母。最小式 $\bar{A}\bar{B}\bar{C}+BCD$ 与官方电路一致。

<svg viewBox="0 0 380 260" width="380" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M20,40 H60 M20,100 H60 M20,160 H60 M20,220 H160" stroke="#333" stroke-width="1.4" fill="none"/>
  <path d="M60,26 L80,40 L60,54 Z M60,86 L80,100 L60,114 Z M60,146 L80,160 L60,174 Z" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <circle cx="83.5" cy="40" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="83.5" cy="100" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="83.5" cy="160" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <text x="12" y="44" font-style="italic">A</text><text x="12" y="104" font-style="italic">B</text><text x="12" y="164" font-style="italic">C</text><text x="12" y="224" font-style="italic">D</text>
  <path d="M110,40 V113 H160 M95,100 V127 H160 M88,160 V141 H160 M45,100 V192 H160 M35,160 V206 H160" stroke="#333" stroke-width="1.4" fill="none"/>
  <circle cx="45" cy="100" r="2.5" fill="#333"/><circle cx="35" cy="160" r="2.5" fill="#333"/>
  <path d="M160,106 H180 A21,21 0 0 1 180,148 H160 Z M160,185 H180 A21,21 0 0 1 180,227 H160 Z M280,143 Q298,143 310,154 Q298,165 280,165 Q287,154 280,143 Z" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <path d="M201,127 H250 V148 H280 M201,206 H260 V160 H280 M310,154 H350" stroke="#333" stroke-width="1.4" fill="none"/>
  <text x="356" y="158" font-style="italic">g</text>
</svg>

上方的与门得到 $\bar{A}\bar{B}\bar{C}$（三路均经反相器），下方的与门得到 $BCD$（B、C 取自原信号的分支，D 直通），两者相或得 $g$。

### 解题步骤

1. **先定极性**：共阳（common-anode）意味着输出 0 才点亮，故真值表里 1 = 熄灭。把这句话写在卷面第一行，避免后面全盘反掉。
2. **逐段填表**：数码 8 全段点亮（a–g 全 0），数码 1 只亮 b、c，其余按标准字形填；顺带记下每段为 1 的数码，$g$ 的是 0、1、7。
3. **写标准 SOP 并圈组**：每个 1 一个最小项，$m_0,m_1,m_7$ 各写一个四项乘积；上 K-map 后 $m_0,m_1$ 相邻成对 → $\bar{A}\bar{B}\bar{C}$，$m_7$ 与 $m_{15}$（X）成对 → $BCD$。
4. **删无效项再画图**：$m_8,m_9$ 是合法码（8、9），值为 0，不能圈；$m_2$ 也是 0，不能被 $\bar{A}\bar{B}\bar{C}$ 带走。电路为 3 个反相器 + 2 个三输入与门 + 1 个或门，$D$ 不反相，$B,C$ 同时供两个与门。

### 答案复盘

- **为什么 1 落在 0、1、7**：本题的「1」代表熄灭，不是点亮。段 $g$ 在数码 0、1、7 上不亮（0 的中间横杠不亮、1 与 7 都不用中间横杠）；其余数码 2、3、4、5、6、8、9 的 $g$ 要点亮 → 0。
- **为什么 $m_8,m_9$ 不能当 X**：8 与 9 是合法 BCD 码，真值表里必须给出确定值（都是 0），只有 10–15 才是 X。这一步是本题最大的坑：若把 $m_8$ 当 X，$\bar{A}\bar{B}\bar{C}$ 就能扩成 4 格 $\bar{A}\bar{C}$，答案虽更短但错。它的两个真邻居 $m_2$（0010）与 $m_8$（1000）都是 0，故 $\bar{A}\bar{B}\bar{C}$ 也到此为止。
- **为什么 $BCD$ 能借 $m_{15}$、全式是否最优**：$m_7$ 的邻居 $m_3,m_5,m_6$ 都是 0，只有 $m_{15}$ 是 X；借进来后两格成竖对，得 3 文字。若把 $m_{15}$ 当 0，$m_7$ 只能单格 → $\bar{A}BCD$（4 文字），全式变 7 文字。官方电路正是「三输入与门（三路反相）+ 三输入与门 + 或门」，与最小式吻合；穷举确认 2 项 6 文字为唯一最优，只有印刷的标准 SOP 中间一项写错（见勘误）。

### 易错点

- 共阳/共阴搞反：共阴（common-cathode）时 1 点亮，$g$ 的 1 落在 $m_2,m_3,m_4,m_5,m_6,m_8,m_9$，最小式完全不同。
- 把 $m_8,m_9$ 标成 X，多圈两格，答案失分。
- 标准 SOP 漏项或写错下标：本题 3 个 1，标准式必须恰好 3 项。
- 画图时给 $D$ 也加反相器（$BCD$ 与 $\bar{A}\bar{B}\bar{C}$ 都不含 $\bar D$，只需 3 个反相器）。

### 变体

- **改共阴（1 点亮）**：$g$ 的 1 变为 $m_2,m_3,m_4,m_5,m_6,m_8,m_9$，最小 SOP 为 $A+\bar{B}C+B\bar{C}+C\bar{D}$（4 项 7 文字），另有 $A+\bar{B}C+B\bar{C}+B\bar{D}$ 同样最优——这类「两个等价最优解」只差一个文字位置，考试给一个即可。
- **改问 a 段**：$a$ 点亮的数码是 0、2、3、5、6、7、8、9，故 $a=1$ 只在 $m_1,m_4$。两格不相邻，$m_1$ 孤立 → $\bar{A}\bar{B}\bar{C}D$；$m_4$ 借 $m_{12}$（X）→ $B\bar{C}\bar{D}$。共 2 项 7 文字。
- **改问「译码器 + 门」**：见 10 文件，思路是用 4 位译码器产生最小项，再或起来。

## 题型 7.6 SOP 与 POS 的成本比较

### 识别特征

题干明写 "compare ... in terms of product-term count and literal count"，或同一函数先求 SOP 再求 POS。

### 原题

> Q5 An input $ABCD$ represents a decimal digit in BCD, with bit weights 8, 4, 2, 1. An output $P$ must equal 1 exactly when the represented decimal digit is prime. The prime decimal digits are
>
> $$2,\ 3,\ 5,\ 7.$$
>
> (a) Construct the truth table and derive a minimum SOP expression, treating BCD inputs 10 through 15 as don't cares.
>
> (b) Derive a minimum POS expression under the same assumption.
>
> (c) Suppose invalid BCD inputs can occur and the output must now be 0 for every invalid input. Find a new minimum SOP expression.
>
> (d) Compare the two SOP expressions in terms of product-term count and literal count.

### 官方答案

作业题，官方不提供答案。标准解（Python 穷举复核，均为唯一最优）：

$$(a)\ P=\bar{B}C+BD \qquad (b)\ P=(B+C)(\bar{B}+D) \qquad (c)\ P=\bar{A}\bar{B}C+\bar{A}BD$$

K-map（(a)(b) 用，X 在 $m_{10}$–$m_{15}$）：

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="2" colspan="2">AB \ CD</th><th style="border:1px solid #999;padding:4px 10px" colspan="4">CD</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="4">AB</th><th style="border:1px solid #999;padding:4px 10px">00</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">01</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">11</th><td style="border:1px solid #999;padding:4px 10px">X</td><td style="border:1px solid #999;padding:4px 10px">X</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">X</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">X</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">10</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">X</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">X</td></tr>
</table>

- 组1（蓝，4 格，$m_2,m_3,m_{11},m_{10}$，跨上下边界）→ $\bar{B}C$
- 组2（红，4 格，$m_5,m_7,m_{15},m_{13}$）→ $BD$
- 圈 0 得 (b)：$(B+C)$ 来自 $m_0,m_1,m_8,m_9$，$(\bar{B}+D)$ 来自 $m_4,m_6,m_{12},m_{14}$。

### 解题步骤

1. **定 1 的位置并带 X 画图**：质数 2、3、5、7 → $m_2,m_3,m_5,m_7$；(a) 与 (b) 都允许把 10–15 当 X。
2. **SOP 圈 1**：$m_2,m_3$ 与 $m_{10},m_{11}$ 合成 4 格 → $\bar BC$；$m_5,m_7$ 与 $m_{13},m_{15}$ 合成 4 格 → $BD$。共 2 项 4 文字。
3. **POS 圈 0**：$m_0,m_1,m_8,m_9$（$B=0,C=0$）→ $(B+C)$；$m_4,m_6$ 与 $m_{12},m_{14}$（$B=1,D=0$）→ $(\bar B+D)$。共 2 因子 4 文字。
4. **做 (c) 与 (d)**：X 变成 0 后重新圈 1，$m_2,m_3$ 只能靠自己 → $\bar A\bar BC$，$m_5,m_7$ 只能靠自己 → $\bar ABD$，共 2 项 6 文字；再列表比较项数与文字数，并指出多出的 2 个文字来自哪里。

### 答案复盘

- **X 的作用**：$\bar BC$ 之所以是 2 文字而不是 3 文字，全靠 $m_{10},m_{11}$ 两个 X 把 2 格撑成 4 格；$BD$ 同理靠 $m_{13},m_{15}$。去掉 X，每个圈退回 3 文字，(c) 的答案就是这样来的。
- **(a) 与 (b) 打平，但选 SOP**：SOP 2 项 4 文字，POS 2 因子 4 文字，平手时选 SOP——与非门实现少一级（属 08 文件），与门扇入也更小。(d) 的答法就是把这张表写出来：项数同为 2，文字数 4 对 6，故 (a) 少 2 个文字。
- **为什么 (b) 的 $(B+C)$ 不是 $(B)$、有无等价解**：0 组是 $B=0,C=0$ 的 4 格（$m_0,m_1,m_8,m_9$），$A$ 在变，故删 $A$；若误圈成 8 格会带进 $m_2,m_3$（值为 1），不允许。本题各问的最小解唯一，没有第二种同价写法，答题不必犹豫。

### 易错点

- 把 1 写成 2、3、5、7 之外的数（1 不是质数，题目已明说 0 与 1 不是质数）。
- (c) 里继续把 10–15 当 X：题目要求「非法输入必须输出 0」，X 全部钉成 0。
- (d) 只比较项数就下结论：两项都是 2 项，必须比文字数才能分出高下。
- POS 的因子极性写反：$B=0$ 的 0 组对应 $(B+\cdots)$，若写成 $(\bar B+\cdots)$ 会圈进值为 1 的格。

### 变体

- **换成「偶数」**：1 落在 $m_0,m_2,m_4,m_6,m_8$，而 $m_{10},m_{12},m_{14}$ 是 X，正好补齐 $\bar D$ 的其余格，最小式退化成 $\bar D$（1 项 1 文字）——X 使成本结构完全变了，不能照搬质数题的结论。
- **换成「$\ge 5$」**：见 7.7，$H=1$ 于 $m_5$–$m_9$，最小式只有 3 项。
- **要求「只用或非门」**：POS 直接对应或非-或非结构，见 08 文件。

## 题型 7.7 BCD 阈值判定：无关项全部取 1 的技巧

### 识别特征

题干给「有效输入时输出 1 / 无效输入时输出 1（报警）」两个版本，第二版要求重算最小式。关键词 "invalid codes activate a warning"、"$H = 1$ for every invalid BCD input"。

### 原题

> Q2 The input $ABCD$ represents a decimal digit in binary-coded decimal (BCD). For valid inputs, the output $H$ must be 1 for digits 5, 6, 7, 8, 9 and 0 for digits 0, 1, 2, 3, 4.
>
> 1. Find a minimum SOP expression for $H$ using a Karnaugh map.
>
> 2. A revised specification requires $H = 1$ for every invalid BCD input, so that invalid codes activate a warning. Find a minimum SOP expression under this specification.

### 官方答案

作业题，官方不提供答案。标准解（Python 穷举复核，唯一最优）：

$$H = A + BC + BD \qquad\text{(两问同解: 3 项, 5 文字)}$$

K-map（第 1 问：$m_{10}$–$m_{15}$ 为 X）：

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="2" colspan="2">AB \ CD</th><th style="border:1px solid #999;padding:4px 10px" colspan="4">CD</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">00</th><th style="border:1px solid #999;padding:4px 10px">01</th><th style="border:1px solid #999;padding:4px 10px">11</th><th style="border:1px solid #999;padding:4px 10px">10</th></tr>
<tr><th style="border:1px solid #999;padding:4px 10px" rowspan="4">AB</th><th style="border:1px solid #999;padding:4px 10px">00</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">01</th><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px;background:#e6f4ea">1</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#fce8e6 50%,#e6f4ea 50%)">1</td><td style="border:1px solid #999;padding:4px 10px;background:#fce8e6">1</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">11</th><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">X</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#e6f4ea 50%)">X</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 33%,#fce8e6 33% 66%,#e6f4ea 66%)">X</td><td style="border:1px solid #999;padding:4px 10px;background:linear-gradient(135deg,#e8f0fe 50%,#fce8e6 50%)">X</td></tr>
<tr><th style="border:1px solid #999;padding:4px 10px">10</th><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">1</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">X</td><td style="border:1px solid #999;padding:4px 10px;background:#e8f0fe">X</td></tr>
</table>

- 组1（蓝，8 格，行 11 与行 10 的全部 8 格）→ $A$
- 组2（红，4 格，$m_6,m_7,m_{15},m_{14}$）→ $BC$
- 组3（绿，4 格，$m_5,m_7,m_{13},m_{15}$）→ $BD$
- 三分渐变的 $m_{15}$ 同属三组。

### 解题步骤

1. **填图**：$H=1$ 于 $m_5$–$m_9$，$H=0$ 于 $m_0$–$m_4$，X 在 $m_{10}$–$m_{15}$。
2. **先看最大的组**：$m_8,m_9$ 的邻居有 $m_{12},m_{13}$（X），把 $m_{14},m_{15}$ 一起收进，行 11 + 行 10 共 8 格全是 1 或 X → 一圈得 $A$（1 个文字）。
3. **补剩下的 1，再做第 2 问**：$m_5,m_6,m_7$ 还未覆盖，$m_6,m_7$ 与 $m_{14},m_{15}$ 成 4 格 → $BC$；$m_5$ 的邻居 $m_1,m_4$ 为 0，只能与 $m_7$ 合并，故 $BD$（借 $m_{13},m_{15}$）不可省。第 2 问把 X 全取 1，与上面的圈完全一致——$A$ 已覆盖 $m_{10}$–$m_{15}$，答案不变。

### 答案复盘

- **为什么 $A$ 是 8 格圈**：行 11 全 X、行 10 有两个 1 和两个 X，合起来 8 格没有 0，$A=1$ 恒定。8 格圈只出 1 个文字，这是本题能压到 5 文字的唯一原因。
- **学生常见答案 $A\bar B+BC+BD$**：把 $m_8,m_9$ 单独圈成 2 格（$A\bar B$），得 3 项 6 文字，比 $A$ 多 1 个文字；用 $A$ 之所以合法，是因为 $m_{10}$–$m_{15}$ 是无关项，允许取 1。
- **两问同解不是巧合**：第 1 问的最优圈法已把全部 X 取成 1，而第 2 问正要求这些位置为 1，规格变了而最优解没变；把这句话写出来，比只给式子更能说明理解。本题最优解唯一。

### 易错点

- 只圈 $m_5$–$m_9$ 的小圈，看不到 $A$ 这个 8 格圈，多花 1 个文字。
- 第 2 问忘了把 X 变 1，仍按 X 圈，写出的式子对非法码不报警；反过来也别以为「无效码必须为 1」会让式子变复杂——约束变强，式子只会更短或不变。
- 把 $m_4$（数码 4，$H=0$）圈进 $A$ 以外的项：$A$ 不含 $m_4$，但 $BC$ 若扩成 $B$ 就会把 $m_4$ 带走。

### 变体

- **阈值改 $\ge 7$**：1 落在 $m_7,m_8,m_9$，最小式变为 $A+BCD$（2 项 4 文字），同样靠 $A$ 的 8 格圈。
- **改 $\le 4$**：1 落在 $m_0$–$m_4$，最小式 $\bar A\bar B+B\bar C\bar D$（2 项 5 文字，后一项也可写成 $\bar A\bar C\bar D$），此时 $m_4$ 只能与 $m_{12}$（X）合并。
- **加「无效码输出 0」**：与本题第 1 问相反，X 全取 0，$A\bar B$ 这一圈缩成 $A\bar B\bar C$，最小式变为 $\bar ABC+\bar ABD+A\bar B\bar C$，3 项 9 文字。

## 题型 7.8 与译码器 / MUX 的衔接（只点名）

### 识别特征

同一道题的后续小问写 "Implement ... by using a 74HC151 8-input data selector" 或 "by using a 4-bit Decoder and basic logic gates"。

### 原题

> (2) (5 points) Implement the logic function specified in the truth table by using a 74HC151 8-input data selector/multiplexer.

> (3) (7 points) Implement the logic function specified in the truth table of (1) by using a 4-bit Decoder and basic logic gates.

### 官方答案

> (2) The logic function implemented by a 74HC151 is shown in Figure 10.

> (3) Fig. 6(c).

### 解题步骤

1. **译码器法**：4 位译码器输出 $m_0$–$m_{15}$，把函数为 1 的那些输出或起来；输出低有效时改用与非门（M2025s Q6 取 $m_6,m_{12},m_{13},m_{14}$）。接法细节见 10 文件。
2. **MUX 法**：3 个变量接选择端，剩下 1 个变量留在数据端，按选择码把真值表切成 8 对，每对归纳成 $0/1/X/\bar X$。细节见 10 文件。

### 答案复盘

- **最小式不是给它们用的**：译码器直接消费最小项，MUX 消费按选择码分组的真值表，两者都不吃合并后的乘积项；但 K-map 上 1 的分布决定要接几个门（M2025s 的 4 个 1 接 4 个输入），也决定 MUX 数据端取 $0/1/X/\bar X$ 中的哪一个。
- **MUX 数据端与 K-map 的对应**：抽出一个变量后，每个 2 格组恰好对应数据端的一个取值，圈的形状照旧。

### 易错点

- 把最小式硬套到译码器上，试图用 4 个乘积项去接 16 个输出。
- 忘记低有效输出要用与非而不是或。

### 变体

- 3 变量函数 + 74HC151：多出的选择端接地，数据端只用前 4 个；74HC154（4→16 解复用）见 10 文件与 M2026 Q8。

## 自测题

1. $m_6$ 与 $m_{14}$ 是否相邻？$m_0$ 与 $m_{10}$ 是否相邻？
2. $F=\Sigma m(0,1,2,3,8,9,10,11)$ 的最小 SOP 是什么？几项几文字？
3. $G$ 的 0 在 $m_0,m_2,m_5,m_7$，其余为 1，求最小 POS。
4. $F=\Sigma m(1,3)+d(5,7)$ 的最小 SOP 是什么？如果不许用无关项呢？
5. M2024 Q8 若把 $m_{10}$–$m_{15}$ 当 0 而不是 X，最小 SOP 的成本变成多少？

---

**自测题答案**

1. $m_6=0110$ 与 $m_{14}=1110$ 只差 A → 相邻（同列 CD=10 的上下两行）；$m_0=0000$ 与 $m_{10}=1010$ 差 A、C 两位 → 不相邻。
2. $F=\bar{B}$，1 项 1 文字。行 00 与行 10 的 8 格合成一圈（$B=0$），是本章最省的一个例子。
3. $G=(A+B+D)(A+\bar{B}+\bar{D})$，2 因子 6 文字。$m_0,m_2$ 靠 $A=0,B=0,D=0$ 成组，$m_5,m_7$ 靠 $A=0,B=1,D=1$ 成组。
4. 用无关项：$\bar{A}D$，1 项 2 文字（$m_1,m_3,m_5,m_7$ 四格，$A=0,D=1$）。若把 5、7 当 0，则只剩 $m_1,m_3$ 一对，得 $\bar{A}\bar{B}D$，1 项 3 文字——无关项省下的不是项数，而是每个项的文字数。
5. 4 项 16 文字：$\bar{A}\bar{B}CD+\bar{A}B\bar{C}D+\bar{A}BC\bar{D}+A\bar{B}\bar{C}D$，四个 1 全部孤立。与允许 X 时的 4 项 11 文字对比，可见无关项省下的正是「相邻伙伴」。
