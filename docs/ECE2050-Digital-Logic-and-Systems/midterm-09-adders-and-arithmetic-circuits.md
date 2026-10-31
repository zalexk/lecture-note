---
title: 09 加法器与运算电路
---

# 09 加法器与运算电路

> **真题分布**：M2024 Q7(1)(2)（13 分）；M2025s Q7(1)(2)（13 分）；M2026 Q6(1)(2)(3)（16 分）；HW3 Q4(1)(2)(3)　|　**考频**：3/4 年直接考（M2025f 只在 Q6 考奇偶），单题 13–16 分
> **一句话**：给几组位就逐位算和与进位；给 $G/P$ 就把进位展开成两级；给两片 283 就只加一根 $C_4\to C_0$；给竖式乘法就铺 AND 阵列加 FA 行，再数台阶。

## 这个课题在考什么
加法器是 Chapter 6 的第一个组合积木（combinational building block）：前几章的真值表、卡诺图、门电路，在这里第一次拼成有字长的器件。卷面只有三种问法——**算**（逐位求和）、**接**（283 位片级联）、**画**（CLA 框图、乘法器阵列）。三种问法的入口都是同一张全加器真值表。

得分点几乎都在进位：和位人人会算，进位链怎么写（$C_{out}=AB+C_{in}(A\oplus B)$、$C_2=G_1+P_1G_0+P_1P_0C_0$）、级联线接哪两个脚、关键路径数几级，才是区分点。

本文数值已用 Python 复核：逐位加法（M2024、M2026、8 位级联）、CLA 递推（2 位与 4 位各 512 组穷举）、部分积（256 组）、五输入奇偶（32 组）、减法（256 组）。划界：补码运算的数学见 02 文件；延迟的定量算法（$t_{pd}$、$t_{cd}$、污染延迟）见 11 文件；卡诺图见 07；NAND/NOR 落地见 08；MUX 与译码器见 10。

## 必备知识（只看解题要用到的）
| # | 名称 | 关系式 | 卷面上怎么用 |
|---|---|---|---|
| B1 | 半加器（half adder, HA） | $S=A\oplus B$，$C=AB$ | 两位相加，没有进位输入 |
| B2 | 全加器（full adder, FA） | $\Sigma=A\oplus B\oplus C_{in}$，$C_{out}=AB+C_{in}(A\oplus B)$ | 每一位一个，三个输入 |
| B3 | 行波进位加法器（ripple carry adder, RCA） | $C_{i+1}$ 逐级向高位传 | 4 位 = 4 个 FA 串接，最坏 $n\,t_{FA}$ |
| B4 | 进位生成（carry generate） | $G_i=A_iB_i$ | 本位自己产生进位，与低位无关 |
| B5 | 进位传播（carry propagate） | $P_i=A_i+B_i$（本课程用「或」型） | 本位把低位进位原样送上去 |
| B6 | 超前进位加法器（look-ahead carry adder, CLA） | $C_{i+1}=G_i+P_iC_i$，展开到只剩 $G,P,C_0$ | 进位不再串行，两级门出结果 |
| B7 | 74HC283 | 4 位全加器；$C_0$(7) 进、$C_4$(9) 出；$A_1/B_1/\Sigma_1$ 是最低位 | 两片级联成 8 位 |
| B8 | 阵列乘法器（array multiplier） | 每行 = AND 阵列（部分积）+ FA 行 | $n\times n$ 出 $2n$ 位 |
| B9 | 加法器做减法 | $A-B=A+\bar B+1$（$C_0=1$）；$C_4=1\iff A\ge B$ | 283 的反相器 + 进位输入（见 02 文件） |
| B10 | 奇偶（parity） | 各位之和的 $\Sigma_0$ = 1 的个数的奇偶 | 用加法器「数 1」 |

## 题型 9.1 半加器与全加器：真值表与两个输出式
### 识别特征
题干写 "Develop the truth table for each stage"、"design a 1-bit full adder"，或直接画一个方框（$A,B,C_{in}$ 进，$\Sigma,C_{out}$ 出）要求补内部电路。凡是要「加两个位」，先想到这一节。

### 原题
> 6. (16 points) The 74HC283 is a 4-bit adder and its logic symbol is shown below.
>
> (1) (8 points) Develop the truth table for each stage of a 4-bit parallel adder.

HW3 Q4(1)（同一题型的画图版）：
> 1. Use basic logic gates to design a 1-bit full adder as shown below where $A$ and $B$ are the input bits while $C_{in}$ is the input carry. Finally, $\sum$ is the sum and $C_{out}$ is the output carry.

（原卷空格表的列为 $C_{n-1}$、$A_n$、$B_n$、$\Sigma_n$、$C_n$，共 8 行。）

### 官方答案
| $C_{n-1}$ | $A_n$ | $B_n$ | $\Sigma_n$ | $C_n$ |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

**半加器**（两位、无进位输入，共 4 行）：

| $A$ | $B$ | $S$ | $C$ |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

$$S=A\oplus B,\qquad C=AB$$

**全加器**（三个输入，共 8 行）：

$$\Sigma=A\oplus B\oplus C_{in},\qquad C_{out}=AB+C_{in}(A\oplus B)$$

### 解题步骤
1. **先数输入** —— "each stage" 指一位加法单元：$A_n,B_n$ 加低位进位 $C_{n-1}$，$2^3=8$ 行；半加器没有 $C_{in}$，只有 4 行。
2. **$\Sigma$ 列看奇偶** —— 三个输入里 1 的个数为奇数取 1，偶数取 0。半加器同理，只是退化成两个输入。
3. **$C$ 列看多数** —— 至少两个输入为 1 才出进位（表里 $m_3,m_5,m_6,m_7$ 四行）。
4. **从表反推 $C$** —— 四个 1 的卡诺图（细节见 07 文件）得 $AB+AC_{in}+BC_{in}$，再因式分解：
$$AB+C_{in}(A+B)=AB+C_{in}(A\oplus B)$$
5. **画门电路** —— 2 个 XOR 出 $\Sigma$，2 个 AND + 1 个 OR 出 $C_{out}$（图 9-1）。

<svg viewBox="0 0 500 210" width="500" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="60" y="28" width="80" height="44" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="250" y="28" width="80" height="44" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M15,44 H60 M15,60 H60 M140,44 H250 M15,150 H210 V64 H250 M140,66 H175 V144 H390 M290,72 V170 H385 V156 H390 M330,44 H455 M420,150 H455" stroke="#333" stroke-width="1.4" fill="none"/><g transform="translate(390,136)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="175" cy="66" r="2.5" fill="#333"/><g font-style="italic"><text x="2" y="48">A</text><text x="2" y="64">B</text><text x="2" y="154">Cin</text><text x="146" y="40">S1</text><text x="118" y="60">C1</text><text x="296" y="88">C2</text><text x="460" y="48">Σ</text><text x="460" y="154">Cout</text></g><g><text x="82" y="54">HA 1</text><text x="272" y="54">HA 2</text></g></svg>

图 9-1　全加器 = 两个半加器 + 一个或门：$\Sigma=S_1\oplus C_{in}$，$C_{out}=C_1+C_2=AB+C_{in}(A\oplus B)$。未画结点的交叉线不相连。

### 答案复盘
- 第 4 列是「奇偶」、第 5 列是「多数」：同一个三输入单元，两个输出对应两种完全不同的判据。官方 8 分全落在表上——表对了，两个式子自然读得出来；公式只给画图题用（第 (2) 问只要求查表算 1100+1100）。
- 为什么 $C_{out}$ 要拆成 $AB+C_{in}(A\oplus B)$ 而不是三项的 $AB+AC_{in}+BC_{in}$：第一项是「生成」——本位两个 1，进位必定出，与低位无关；第二项是「传播」——两加数不同（$A\oplus B=1$）时，低位来什么就送什么。这个拆法是 9.4 超前进位的直接前身。
- 两个式子为什么等价：只在 $A=B=1$ 处不同，而那里 $AB=1$ 已把输出钉住，故 $C_{in}(A+B)$ 与 $C_{in}(A\oplus B)$ 给出同一个 $C_{out}$（8 行穷举已验证）。这也是 9.4 里 $P$ 可以取「或」的依据。

### 易错点
- $\Sigma$ 写成 $A\oplus B$（漏第三个输入）；或写成 $(A\oplus B)C_{in}$（等于把加数当乘数）。
- $C_{out}$ 只写 $AB$：漏掉 $0+0+1$、$1+0+1$ 这类「低位进位被传播上去」的情形。
- 表只列 4 行，忘掉 $C_{n-1}$ 这一维；或列头顺序写 $A,B,C_{in}$ 却按 $C_{in},A,B$ 填值；或三个数相加却用半加器（半加器只有两个输入）。

### 变体
- "using ONLY NAND gates"：SOP 两次取反即 NAND-NAND 结构，做法见 08 文件。
- 4 位加法器（HW3 Q4(2)）：4 个 FA 串接，低位 $C_{in}$ 接 $C_0$，最高位 $C_{out}$ 接 $C_4$（图 9-2）。

## 题型 9.2 行波进位：逐位演算与最坏延迟
### 识别特征
题干给一张 4 个 FA 串接的图，上方标着输入位，最右一块的 $C_{in}$ 接地写 0，要求 "determine the complete sum by analyzing the operation of the circuit"。

### 原题
> 7. (13 points) A ripple carry adder is one in which the carry output of each full adder is connected to the carry input of the next higher-order stage (a stage is one full adder). The sum and the output carry of any stage cannot be produced until the input carry occurs; this causes a time delay in the addition process, as shown in Figure 7. The carry propagation delay for each full adder is the time from the application of the input carry until the output carry occurs, assuming that the $A$ and $B$ inputs are already present.
>
> (1) (2 points) For the parallel adder in Fig. 11, determine the complete sum by analyzing the operation of the circuit.

（Figure 11: The 4-bit ripple carry adder. 四块 FA 自左向右排，最右一块的 $C_{in}$ 接地标 0，最左一块的 $C_{out}$ 标 $\Sigma_5$。Figure 7 在每级 FA 下方标 "8 ns"，链尾标 "32 ns"。）

同一题型的查表版（M2026 Q6(2)）：
> (2) (4 points) Use the truth table to find the sum and output carry for the addition of the following two 4-bit numbers if the input carry ($C_{n-1}$) is 0: $A_3A_2A_1A_0 = 1100$ and $B_3B_2B_1B_0 = 1100$.

### 官方答案
> (1) The complete sum is $\Sigma=\Sigma_5\Sigma_4\Sigma_3\Sigma_2\Sigma_1=10001$.

（续页 Figure 13 在每块下方标出 $\Sigma_5=1$、$\Sigma_4=0$、$\Sigma_3=0$、$\Sigma_2=0$、$\Sigma_1=1$。）

> (2) $\Sigma_0=0$, $\Sigma_1=0$, $\Sigma_2=0$, $\Sigma_3=1$, $C_4=1$

### 解题步骤
1. **定最低位** —— 接地的 $C_{in}=0$ 在最右，故最右是第 0 位；自右向左读得 $A=0110$、$B=1011$。
2. **每位一行两算** —— $\Sigma_i=A_i\oplus B_i\oplus C_i$（奇偶），$C_{i+1}=A_iB_i+C_i(A_i\oplus B_i)$（多数）。进位从 $i=0$ 起逐级往左喂。
3. **列成表** —— 把权 3、2、1、0 排成四列，每列填 $A_i$、$B_i$、$C_i$、$\Sigma_i$、$C_{i+1}$（下表）。
4. **收口** —— 最左 FA 的 $C_{out}$ 记为 $\Sigma_5$，与 $\Sigma_4\ldots\Sigma_1$ 拼成 5 位，再核 $6+11=17$。

| 位权 $i$ | 3 | 2 | 1 | 0 |
|---|---|---|---|---|
| $A_i$ | 0 | 1 | 1 | 0 |
| $B_i$ | 1 | 0 | 1 | 1 |
| $C_i$（来自低位） | 1 | 1 | 0 | 0 |
| $\Sigma_i$ | 0 | 0 | 0 | 1 |
| $C_{i+1}$（送高位） | 1 | 1 | 1 | 0 |

最左的 $C_4=1$ 即 $\Sigma_5$，于是 $\Sigma_5\Sigma_4\Sigma_3\Sigma_2\Sigma_1=10001$（$=17$）。查表版同理：$1100+1100=(11000)_2$，故 $\Sigma_3\Sigma_2\Sigma_1\Sigma_0=1000$、$C_4=1$。

**最坏延迟**：信号只能沿进位链一格一格走，第 $i$ 位要等第 $i-1$ 位的 $C_{out}$。故 $n$ 位 RCA 的最坏延迟

$$t_{RCA}=n\cdot t_{FA}$$

M2025s 的 Figure 7 直接标了这个数：每级 8 ns，四级合计 32 ns。$t_{FA}$ 是「进位入 $\to$ 进位出」的一段门延迟，也就是关键路径上每级 FA 的贡献；$t_{pd}$ 与污染延迟的严格定义见 11 文件。

### 答案复盘
- 官方只写 5 位结果、只值 2 分，过程分落在续页 Figure 13：把每位 $\Sigma$ 标在 FA 下方，等于向评卷人证明逐位算过。只写十进制 $17$ 或只写二进制不给分，因为题目要的是 "analyzing the operation of the circuit"。
- $\Sigma_5$ 不是第五个全加器的输出，而是最左 FA 的 $C_{out}$：4 位相加最大 $15+15+1=31$，必须 5 位，第 5 位只能来自进位。同理 M2026 的 $C_4$ 就是第 5 位。
- 位 2、3 出现「和为 0、进位仍 1」，是连续进位：$1+1=0$ 带进位，进位把下一列 $1+0$ 变成 $1+0+1$，仍是 0 带进位。这是 RCA 最慢的情形，也是 32 ns 出现的前提。
- 本题结果 $10001$ 是回文，位序读反也看不出差别；位序只能从图读——接地端是最低位。M2024 用 $\Sigma_5\ldots\Sigma_1$ 编号，M2026 用 $\Sigma_3\ldots\Sigma_0$ 加 $C_4$，两套编号指同一条进位链。
- 为什么延迟是 $n$ 倍而不是 $2n$：只有进位在链上走，和位 $\Sigma_i$ 等的是本位的 $C_i$，与更高位无关；每级只算一次「进位入 → 进位出」。

### 易错点
- 把最左 FA 当最低位：$C_{in}$ 接在最右端，最右才是第 0 位。
- 进位只写 $A_iB_i$，漏掉 $C_i$ 项，遇到连续进位就错。
- 只给 4 位和、丢掉 $C_4$；或改成「先转十进制再加」冒充逐位分析；或把 RCA 的延迟写成 $t_{FA}$、$2n\,t_{FA}$。

### 变体
- 8 位、16 位：表加列，延迟 $8t_{FA}$、$16t_{FA}$——位宽翻倍最坏延迟翻倍，这正是 CLA 存在的理由；用 283 搭 8 位时片内是 CLA、片间是行波（9.3）。
- HW3 Q4(2)：4 个 FA 按 $C_0\to C_4$ 串成 4 位加法器，就是本节的图 9-2。

<svg viewBox="0 0 520 145" width="520" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="40" y="44" width="80" height="54" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="150" y="44" width="80" height="54" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="260" y="44" width="80" height="54" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="370" y="44" width="80" height="54" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M62,18 V44 M98,18 V44 M172,18 V44 M208,18 V44 M282,18 V44 M318,18 V44 M392,18 V44 M428,18 V44" stroke="#333" stroke-width="1.4" fill="none"/><path d="M150,71 H120 M260,71 H230 M370,71 H340 M490,71 H450 M40,71 H18 M80,98 V118 M190,98 V118 M300,98 V118 M410,98 V118" stroke="#333" stroke-width="1.4" fill="none"/><g><text x="52" y="76">FA 3</text><text x="162" y="76">FA 2</text><text x="272" y="76">FA 1</text><text x="382" y="76">FA 0</text></g><g font-style="italic"><text x="52" y="14">A3</text><text x="88" y="14">B3</text><text x="162" y="14">A2</text><text x="198" y="14">B2</text><text x="272" y="14">A1</text><text x="308" y="14">B1</text><text x="382" y="14">A0</text><text x="418" y="14">B0</text></g><g font-style="italic"><text x="70" y="134">Σ4</text><text x="180" y="134">Σ3</text><text x="290" y="134">Σ2</text><text x="400" y="134">Σ1</text><text x="476" y="66">0</text><text x="0" y="66">Σ5</text></g></svg>

图 9-2　四位行波进位加法器：$C_{in}$ 从最右进入、逐级向左，最左 FA 的 $C_{out}$ 即 $\Sigma_5$。

## 题型 9.3 74HC283：引脚含义与两片级联
### 识别特征
题干给出 74HC283 的逻辑符号（带引脚号），并要 "use two 74HC283 chips to handle the addition of two 8-bit numbers ... Please show the connection"。

### 原题
> 6. (16 points) The 74HC283 is a 4-bit adder and its logic symbol is shown below.
>
> (3) (4 points) Use two 74HC283 chips to handle the addition of two 8-bit numbers $A_7A_6A_5A_4A_3A_2A_1A_0$ andn $B_7B_6B_5B_4B_3B_2B_1B_0$. Please show the connection.

> **勘误**：题干 "andn" 是原卷拼写错误，应为 "and"。抄题照旧，答题按 "and" 理解，不必在卷面上纠正。

### 官方答案
（两片 283 并排、引脚照抄，唯一新增的连线是左片 $C_4$（pin 9）接右片 $C_0$（pin 7）；左片 $C_0$ 接 0，右片 $C_4$（pin 9）空出，即第 9 位。两片 pin 16 接 $V_{CC}$、pin 8 接 GND。）

### 解题步骤
1. **切两半** —— 低 4 位 $A_3A_2A_1A_0$ / $B_3B_2B_1B_0$ 进第一片，高 4 位进第二片。
2. **按引脚号接**（表 9-1）—— 283 的 $A_1/B_1/\Sigma_1$ 是**最低位**，不能把 $A_0$ 接到 pin 1 旁边的 5 号位后按 1、2、3、4 顺排。
3. **连进位** —— 低片 $C_4$(9) → 高片 $C_0$(7)（图 9-3）；低片 $C_0$(7) 接 0（GND）。
4. **取输出与电源** —— 低片 $\Sigma_4\ldots\Sigma_1$ 是 $\Sigma_3\ldots\Sigma_0$，高片同脚位是 $\Sigma_7\ldots\Sigma_4$，高片 $C_4$(9) 是 $\Sigma_8$。

| 符号 | 引脚 | 接法 |
|---|---|---|
| $A_1\ A_2\ A_3\ A_4$ | 5、3、14、12 | 低片接 $A_0\ldots A_3$，高片接 $A_4\ldots A_7$（$A_1$ 为最低位） |
| $B_1\ B_2\ B_3\ B_4$ | 6、2、15、11 | 与 $A$ 同序：低片 $B_0\ldots B_3$，高片 $B_4\ldots B_7$ |
| $C_0$ | 7 | 低片接 0；高片接低片 $C_4$ |
| $\Sigma_1\ \Sigma_2\ \Sigma_3\ \Sigma_4$ | 4、1、13、10 | 低片给 $\Sigma_0\ldots\Sigma_3$，高片给 $\Sigma_4\ldots\Sigma_7$ |
| $C_4$ | 9 | 低片→高片 $C_0$；高片→$\Sigma_8$ |

表 9-1　74HC283 引脚（按 M2026 Q6 卷面符号）。

<svg viewBox="0 0 520 200" width="520" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="60" y="34" width="140" height="130" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="330" y="34" width="140" height="130" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,58 H60 M20,82 H60 M20,150 H60 M200,58 H240 M290,58 H330 M290,82 H330 M470,58 H500 M470,150 H500 M200,164 H330 V150" stroke="#333" stroke-width="1.4" fill="none"/><g font-style="italic"><text x="22" y="52">A3..A0</text><text x="22" y="76">B3..B0</text><text x="292" y="52">A7..A4</text><text x="292" y="76">B7..B4</text></g><g font-style="italic"><text x="204" y="52">Σ3..Σ0</text><text x="474" y="52">Σ7..Σ4</text><text x="474" y="144">Σ8</text><text x="6" y="144">0</text></g><g><text x="86" y="100">74HC283</text><text x="98" y="120">低 4 位</text><text x="356" y="100">74HC283</text><text x="368" y="120">高 4 位</text><text x="206" y="160">C4(9)→C0(7)</text></g></svg>

图 9-3　两片 283 级联：唯一要新加的连线是「低片 $C_4$(9) → 高片 $C_0$(7)」。

### 答案复盘
- 官方图只画了这根 $C_4\to C_0$，其余按符号照抄：级联的全部信息就是进位方向与位权分配，这也就是 4 分的全部得分点。引脚号不能按大小排——$A_1$ 在 pin 5、$A_4$ 在 pin 12，脚号写在括号里，抄图时连括号一起抄。
- 为什么不并联：283 片内虽是超前进位，但只把 $C_0$、$C_4$ 引到脚上，中间进位拿不到，片间只能行波——8 位的延迟因此是「两段片内 CLA + 一段片间进位」。
- 位权必须连续：低片输出 $2^0\ldots2^3$，高片 $2^4\ldots2^7$；接错一片，结果差 16 的整数倍，但和位本身仍然「看起来对」——这是最难自查的错误。
- 高片空出的 $C_4$ 不是废脚：无符号加法里它就是第 9 位 $\Sigma_8$。
- **级联后判溢出**：两片 283 只把 $C_0$、$C_4$ 引到脚上，符号位的进位入 $C_7$ 藏在片内取不到，所以 $C_8\oplus C_7$ 在引脚上算不出来。有符号溢出只能改用符号法：两加数符号相同、而和符号不同；无符号「溢出」则直接读高片 $C_4$。

$$\text{overflow}=A_7B_7\bar\Sigma_7+\bar A_7\bar B_7\Sigma_7$$

| $A_7$ | $B_7$ | $\Sigma_7$ | $C_8$ | 有符号溢出 | 例（8 位） |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 否 | $0F_{16}+01_{16}=10_{16}$ |
| 0 | 0 | 1 | 0 | 是 | $7F_{16}+01_{16}=80_{16}$（$127+1$） |
| 0 | 1 | 任意 | 0 或 1 | 否 | $7F_{16}+FF_{16}=7E_{16}$（$127-1$） |
| 1 | 1 | 1 | 1 | 否 | $FF_{16}+01_{16}=00_{16}$（$-1+1$，$C_8=1$） |
| 1 | 1 | 0 | 1 | 是 | $80_{16}+80_{16}=00_{16}$（$-128-128$） |

### 易错点
- 把 $A_0$ 接到 pin 1（那是 $A_1$ 的位置），整体位序错一位。
- 两片 $C_0$ 都接地，高 4 位被当成独立加法器；或低片 $C_0$ 悬空不接。
- 把低片 $C_4$ 接到高片的 $C_4$（应接 $C_0$），或把进位方向画成高片→低片。

### 变体
- 进位输入的处理：CMOS 输入端**不可悬空**（悬空电平不定、易振荡、静态电流大），未用的 $C_0$ 一律接 GND；相反，$C_4$ 是输出，不接也允许。题目若写 "the carry input is left floating"，那是错误接法，答 "tie to GND"。
- 三片级联成 12 位：$C_4\to C_0$ 串两次；最坏延迟 = 3 段。
- 用 283 做减法：$B$ 每位过反相器、$C_0$ 接 1，即 $A+\bar B+1$；此时 $C_4=1\iff A\ge B$（256 组已穷举验证；补码推导见 02 文件，接线细节见 9.6）。

## 题型 9.4 超前进位：$G/P$ 与两级进位
### 识别特征
题干出现 "look-ahead carry"、"carry generation / propagation"，并给两张标着 Block 1 / Block 2 的空框图；分值通常拆成「写表达式 6 分 + 画图 5 分」。

### 原题
> (2) Assume $A=A_1A_0$ and $B=B_1B_0$, and $C_0$ denotes the initial carry input. If implement the 2-bit addition using the look-ahead carry adder: Firstly, please give the expressions of the carry generation ($G_1$ and $G_0$, respectively), carry propagation ($P_1$ and $P_0$, respectively) and the carry output ($C_1$ and $C_2$, respectively) for each stage (6 points), and draw the logic diagrams inside the block 1 and block 2 of Fig. 12 to show the inside logic circuits using necessary logic gates (5 points).

### 官方答案
$$G_0=A_0B_0,\quad P_0=A_0+B_0,\quad C_1=G_0+P_0C_0$$
$$G_1=A_1B_1,\quad P_1=A_1+B_1,\quad C_2=G_1+P_1C_1=G_1+P_1(G_0+P_0C_0)=G_1+P_1G_0+P_1P_0C_0$$

> (Note: Both "OR" and "XOR" gates can be used to calculate the carry propagation.)

### 解题步骤
1. **写生成项** —— $G_i=A_iB_i$：本位两加数都为 1，进位必定产生，与低位无关。
2. **写传播项** —— $P_i=A_i+B_i$：本位至少一个 1，低位来什么就原样送上去。
3. **第一级** —— $C_1=G_0+P_0C_0$：把 FA 的 $C_{out}$ 式换成 $G/P$ 记号即可。
4. **代入展开** —— $C_2=G_1+P_1C_1$ 中的 $C_1$ 用第 3 步替换，再乘开得三项。展开后右边只剩 $G$、$P$、$C_0$，不再出现 $C_1$。
5. **按框图分工画图** —— Block 1（只吃 $A,B$）= 2 AND + 2 OR；Block 2（只吃 $G,P,C_0$）= 3 AND + 2 OR（图 9-4、图 9-5）。

<svg viewBox="0 0 520 230" width="520" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="70" y="44" width="160" height="160" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="320" y="44" width="120" height="160" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,60 H70 M20,82 H70 M20,130 H70 M20,152 H70 M20,186 H70 M230,60 H320 M230,90 H320 M230,130 H320 M230,160 H320 M230,186 H320 M440,80 H490 M440,160 H490" stroke="#333" stroke-width="1.4" fill="none"/><g font-style="italic"><text x="24" y="56">A1</text><text x="24" y="78">B1</text><text x="24" y="126">A0</text><text x="24" y="148">B0</text><text x="24" y="182">C0</text></g><g font-style="italic"><text x="240" y="56">G1</text><text x="240" y="86">P1</text><text x="240" y="126">G0</text><text x="240" y="156">P0</text><text x="240" y="182">C0</text><text x="492" y="76">C2</text><text x="492" y="156">C1</text></g><g><text x="108" y="36">Block 1</text><text x="344" y="36">Block 2</text><text x="88" y="112">G = A·B</text><text x="88" y="134">P = A + B</text><text x="338" y="112">只做与或</text></g></svg>

图 9-4　卷面 Fig. 12 的信号流：Block 1 吃 $A,B$，Block 2 只吃 $G,P,C_0$，$C_1$、$C_2$ 由它出。

<svg viewBox="0 0 520 240" width="520" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <g transform="translate(90,50)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(160,60)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(120,160)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(200,164)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(340,80)"><path d="M0,0 H16 A17,17 0 0 1 16,34 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(430,30)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q8,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><path d="M30,50 H90 M30,90 H110 V78 H90 M30,130 H70 V64 H160 M30,175 H120 M30,200 H108 V188 H120 M90,78 H110 V92 H160 M160,74 H200 M200,90 H230 M200,192 H430 V62 M60,50 V100 H200" stroke="#333" stroke-width="1.4" fill="none"/><path d="M120,174 H145 V178 H200 M230,178 H340 V46 H430 M356,97 H400 V70 H430" stroke="#333" stroke-width="1.4" fill="none"/><g font-style="italic"><text x="4" y="54">G1</text><text x="4" y="84">P1</text><text x="4" y="124">G0</text><text x="4" y="170">P0</text><text x="4" y="196">C0</text><text x="240" y="104">C1</text><text x="470" y="50">C2</text></g></svg>

图 9-5　Block 2 内部：左下 1 AND + 1 OR 出 $C_1=G_0+P_0C_0$；右侧 2 AND + 1 个三输入 OR 出 $C_2=G_1+P_1G_0+P_1P_0C_0$（画法不唯一，只要门与式一致）。

### 答案复盘
- 官方把 $P_i$ 定义成 $A_i+B_i$ 而不是 $A_i\oplus B_i$：两者只在 $A_i=B_i=1$ 处不同，而那里 $G_i=1$ 已把 $C_{i+1}$ 钉成 1，故两种定义给出同样的进位（32 组已穷举验证）。用「或」还省掉一个 XOR 门。官方注 "Both OR and XOR" 讲的就是这件事。
- 全题的核心是第 4 步的「代入 + 乘开」：$C_2$ 写成三项后右边只剩 $G,P,C_0$。这就是「两级」——任一进位都只需过一层 AND 造乘积项、一层 OR 求和，不必等前一位算完。若停在 $C_2=G_1+P_1C_1$，进位仍然是串行的，第 (1) 问的 6 分拿不到。
- 三项的物理含义：$G_1$ 本位自己生成；$P_1G_0$ 本位传播、低位生成；$P_1P_0C_0$ 两位都传播、进位来自最外面。项数 = 位数 + 1，最长一项的因子数 = 位数 + 1。
- 框图分工即「数据通路 / 进位通路」分离：Block 1 只依赖 $A,B$，可与进位并行先算；Block 2 只做与或，因此画图时 Block 2 里不能再出现 $A$、$B$——这是评分时最容易看出的对错。
- 代价：$n$ 位时最长一项有 $n+1$ 个因子，OR 门扇入随之增长，这也是真实芯片按 4 位分块（如 283）的原因。

### 易错点
- $P_i$ 写成 $A_iB_i$（那是 $G_i$）；或 $G_i$ 写成 $A_i\oplus B_i$。
- 展开 $C_2$ 时漏掉 $P_1P_0C_0$ 中的某个因子，或写成 $G_1+P_1G_0+P_1P_0$（丢了最外面的 $C_0$）。
- 画图时把 Block 2 画成又一个方块写 "CLA"，或把 $A,B$ 引进 Block 2。
- 只给 $C_2=G_1+P_1C_1$ 就交卷：形式上对，但没有实现「超前进位」。

### 变体
- 4 位 CLA：继续展开到 $C_4=G_3+P_3G_2+P_3P_2G_1+P_3P_2P_1G_0+P_3P_2P_1P_0C_0$，5 项、最长 5 个因子（章末自测第 2 题）。

## 题型 9.5 阵列乘法器：AND 阵列 + FA 行与关键路径
### 识别特征
题干先给两个 4 位无符号数的竖式乘法（标着 partial products），再要求 "implement this combinational multiplier by using full adders and AND gates ONLY"，第二问必问关键路径与传播延迟。

### 原题
> Consider multiplication with unsigned 4-bit numbers can be performed as shown in Figure 11.
>
> (1) (10 points) Implement this combinational multiplier by using full adders and AND gates ONLY.
>
> (2) (3 points) The critical path is the longest path in the circuit. Propagation delay (latency) is one of the important factors to describe a digital circuit. It is defined as the time needed for an input change to produce an output change. The critical path is the path in the entire design with the maximum propagation delay. As an example, a critical path is denoted in Figure 7. Analyze whether there is a possible critical path in your designed combinational multiplier. If yes, please mark the critical path and approximate its propagation delay (Assume the propagation delay of each adder is $t$, and the propagation delay of AND gate is $0.1t$); If no, please give reasons.

> **勘误**：题干引 "Figure 11"，但卷面上这张竖式乘法图实为 Figure 8（Figure 9 是阵列图，Figure 11 在本卷第 10 页是 IEEE 754 的 16 位布局图）。又 "Consider multiplication ... can be performed" 是原卷语病，应作 "Multiplication ... can be performed"。两处均照抄。

### 官方答案
> (1) The combinational multiplier is shown in Figure 9.
>
> (2) The propagation delay is 8.1$t$.

（Figure 9：四行 AND 阵列 + 三行 FA，每行 4 个 FA；最右 FA 的 $C_{in}$ 接 0；输出标 $O_0\ldots O_6$。）

### 解题步骤
1. **写部分积** —— 每个部分积（partial product）是被乘数一位与乘数一位的 AND：$A_iB_j$，$n=4$ 共 16 个 AND（图 9-6）。
2. **排行** —— 第 0 行只有 AND（$A_iB_0$），$O_0=A_0B_0$ 直接引出；第 1、2、3 行各 = 4 个 AND + 4 个 FA，把本行部分积加到上一行余数上。行与行错开一格，等于「左移一位」。
3. **接进位与 0** —— 每行进位向左传，最右 FA 的 $C_{in}$ 接 0；第 1 行最左 FA 有一个输入接 0（该列没有 $A_4B_0$）。
4. **取输出、数关键路径** —— 第 1 行最右 FA 的和是 $O_1$，第 2 行最右 FA 的和是 $O_2$，第 3 行四个和与最左进位给出 $O_3\ldots O_7$，共 $2n=8$ 位；再从最低位部分积出发，每行「横推到最左」再「落到下一行」，把穿过的 FA 数加起来（表 9-2）。

以 $A=1101$、$B=1011$ 验算（Python 复核）：四个部分积为 $0000\,1101$、$0001\,1010$、$0000\,0000$、$0110\,1000$（$13+26+0+104$），错位相加得 $1000\,1111=143=13\times11$。

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:3px 8px">层 \ 位权</th><th style="border:1px solid #999;padding:3px 8px">7</th><th style="border:1px solid #999;padding:3px 8px">6</th><th style="border:1px solid #999;padding:3px 8px">5</th><th style="border:1px solid #999;padding:3px 8px">4</th><th style="border:1px solid #999;padding:3px 8px">3</th><th style="border:1px solid #999;padding:3px 8px">2</th><th style="border:1px solid #999;padding:3px 8px">1</th><th style="border:1px solid #999;padding:3px 8px">0</th></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">PP0</th><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">PP1</th><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999"></td></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">FA 行 1</th><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999"></td></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">PP2</th><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">FA 行 2</th><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">PP3</th><td style="border:1px solid #999"></td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999">&#9679;</td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">FA 行 3</th><td style="border:1px solid #999"></td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999;background:#e8f0fe">FA</td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td><td style="border:1px solid #999"></td></tr>
<tr><th style="border:1px solid #999;padding:3px 8px">输出</th><td style="border:1px solid #999">$O_7$</td><td style="border:1px solid #999">$O_6$</td><td style="border:1px solid #999">$O_5$</td><td style="border:1px solid #999">$O_4$</td><td style="border:1px solid #999">$O_3$</td><td style="border:1px solid #999">$O_2$</td><td style="border:1px solid #999">$O_1$</td><td style="border:1px solid #999">$O_0$</td></tr>
</table>

图 9-6　点图（dot diagram）：$PP_r=A\cdot B_r$ 是第 $r$ 个部分积，黑点是一位（一个 AND 输出），FA 格吃掉本列的两个点加右邻送来的进位。四行点共 16 个 AND，三行 FA 共 12 个。

| 段 | 器件 | 位置（列 = 位权） | 累计 |
|---|---|---|---|
| 1 | AND | $A_0B_1$，列 1 | 0.1$t$ |
| 2–4 | 第 1 行 3 个 FA | 进位 $c_1\to c_2\to c_3$ | 3.1$t$ |
| 5–7 | 第 2 行 3 个 FA | 和落到 $c_3$，进位 $c_3\to c_4\to c_5$ | 6.1$t$ |
| 8–9 | 第 3 行 2 个 FA | 和落到 $c_5$，进位 $c_5\to c_6$，出 $O_6$、$O_7$ | 8.1$t$ |

表 9-2　关键路径逐门核对：1 个 AND + 8 个 FA = $0.1t+8t=8.1t$。官方只给这个数，图上不逐个编号；从别的列起步、或换一列下坠，数出来仍是 8（横推的级数与下坠跨过的列数之和守恒），故 8 就是最大值。

### 答案复盘
- 官方图最低位在右、进位向左、$O_0$ 在最右：位权与列号一致，行与行错开一格就是「左移一位」。这三条决定了整张图的形状。
- 两个「0」不是画错：最右 FA 的 $C_{in}=0$ 表示本行没有更低的进位；第 1 行最左 FA 的 0 表示 $A_4B_0$ 恒为 0。少了任一个，行数或位宽就对不上。
- 为什么第 $r$ 行最右 FA 的和能直接当 $O_r$：该列此后不再有新的部分积加入，这一位已定稿。
- 为什么关键路径是「先横后纵」的台阶而不是竖直向下：数据从最右一列出发，进位在行内每推一格就多一级 FA，而「落到下一行」只是接线、不花时间。故路径长 = 横推的 FA 数，最大 $2n=8$。
- 官方图上的红线是手绘示意，落点与表 9-2 的分段略有出入，穿过 FA 的总数同样是 8；答题时按结构数 8 个，并把路径画成台阶：每行横推若干 FA 后落到下一行，直到出 $O_7$。官方图只标 $O_0\ldots O_6$，第 3 行最左 FA 的进位（第 8 位 $O_7$）没标：$4\times4$ 最大 $15\times15=225$，必须 8 位，答题时应补上。

### 易错点
- 只画两行 FA（以为 4 乘 4 只需两次加法），漏掉第三行；进位方向画成向右，输出位序随之颠倒；或每行最右 FA 的 $C_{in}$ 悬空不接 0。
- 用半加器顶替全加器（一笔要加三个数，半加器只有两个输入），或把 $O_0$ 也接进 FA。
- 关键路径数成 $4+4+4=12$ 级（把每行都走满），或只数竖直方向的 3 级。

### 变体
- $n=8$：AND 64 个、FA $8\times7=56$ 个、输出 16 位；关键路径 $2n=16$ 级 FA，延迟 $0.1t+16t=16.1t$。
- 只要「实现」不问延迟（10 分那问）：答结构即可——16 AND + 12 FA + 输出 8 位 + 每行最右 $C_{in}$ 接 0。

## 题型 9.6 用加法器搭其他功能：奇偶与减法
### 识别特征
题干给一个 "Parity Generator/Checker" 方框（$A\ldots E$ 五路进，$\Sigma$ Odd / $\Sigma$ Even 两路出），并指定「用两个 1 位全加器 + 一片 4 位加法器」搭出来。另一种问法是给一片现成加法器，要求「加、减两用」。两者都不考加法本身，而考「把别的运算化成求和，再取某一位或某一根进位」。

### 原题
> **Q4** A Parity Generator/Checker and its function table are shown below.
>
> | Number of Inputs A-E That Are High | Outputs $\Sigma$ Even / $\Sigma$ Odd |
> |---|---|
> | 0, 2, 4 | H / L |
> | 1, 3, 5 | L / H |
>
> 3. Finally, use two 1-bit full-adders and one 4-bit adder together with other basic logic gates to implement the Parity Generator/Checker.

（同一题的 (2) 要求先用 4 个 1 位全加器搭 4 位加法器，即 9.2 的变体。减法器在四套卷里没有独立题面：M2024 Q3(1)、M2026 Q2(2) 只要求补码竖式，见 02 文件；下面按 283 的接法给出，供「用加法器搭减法器」一类题使用。）

### 官方答案
（作业无官方答案；奇偶 32 组、减法 256 组已用 Python 穷举验证。）

$$A-B=A+\bar B+1\quad(C_0=1),\qquad C_4=1\iff A\ge B$$

### 解题步骤
1. **把「奇数个 1」变成算术** —— 五个位相加，最低位就是 1 的个数的奇偶：$\Sigma_0=(A+B+C+D+E)\bmod 2$。
2. **两两先加** —— FA1 加 $A,B$ 得 $s_1$（权 $2^0$）、$c_1$（权 $2^1$）；FA2 加 $C,D$ 得 $s_2,c_2$。此时 $A+B+C+D=s_1+2c_1+s_2+2c_2$。
3. **塞进 4 位加法器** —— A 端接 $0,0,c_1,s_1$，B 端接 $0,0,c_2,s_2$，$C_0$ 接第 5 个输入 $E$。四位数相加最大 $1+1+1+1+1=5$，4 位够用（图 9-7）。
4. **取输出并验算** —— $\Sigma$ Odd $=\Sigma_0$，$\Sigma$ Even $=\overline{\Sigma_0}$（一个 NOT 门）。$1,1,1,1,1$ 时 4 位和为 $0101$，$\Sigma_0=1$ → Odd 高，与表一致。
5. **减法：先取反** —— $B$ 的每一位过一个 XOR，另一端接控制端 $S$：$B_i\oplus1=\bar B_i$，$B_i\oplus0=B_i$，一根线给出原码与反码两种。
6. **减法：再加一** —— 同一个 $S$ 接 $C_0$，于是 $S=1$ 时和为 $A+\bar B+1=A-B$，$S=0$ 时仍是 $A+B$，一片加法器两用。
7. **减法：读标志** —— $C_4=1$ 表示无借位（$A\ge B$），$C_4=0$ 表示不够减；有符号是否溢出仍按 9.3 的符号法判。

<svg viewBox="0 0 560 210" width="560" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <rect x="60" y="36" width="72" height="36" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="60" y="116" width="72" height="36" fill="#fff" stroke="#333" stroke-width="1.4"/><rect x="260" y="60" width="110" height="90" fill="#fff" stroke="#333" stroke-width="1.4"/><path d="M20,48 H60 M20,60 H60 M20,128 H60 M20,140 H60 M132,48 H260 M132,60 H150 V84 H260 M132,128 H180 V120 H260 M132,140 H190 V136 H260 M20,175 H240 V146 H260 M370,100 H420 M420,100 V70 H480 M420,100 H452 M476,100 H510" stroke="#333" stroke-width="1.4" fill="none"/><g transform="translate(452,86)"><path d="M0,0 L20,14 L0,28 Z" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="23.5" cy="14" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/></g><circle cx="420" cy="100" r="2.5" fill="#333"/><g font-style="italic"><text x="24" y="44">A</text><text x="24" y="56">B</text><text x="24" y="124">C</text><text x="24" y="136">D</text><text x="8" y="180">E</text><text x="74" y="58">FA 1</text><text x="74" y="138">FA 2</text></g><g font-style="italic"><text x="140" y="44">s1</text><text x="140" y="56">c1</text><text x="140" y="124">s2</text><text x="140" y="136">c2</text><text x="266" y="86">00c1s1</text><text x="266" y="122">00c2s2</text><text x="266" y="150">C0 = E</text><text x="486" y="66">Σ Odd</text><text x="512" y="104">Σ Even</text></g></svg>

图 9-7　五输入奇偶电路：两个 FA 把 $A\ldots D$ 两两相加，4 位加法器把两个「两位和」与 $E$ 一起加，$\Sigma_0$ 即奇偶。

### 答案复盘
- 为什么用加法器而不是 4 个 XOR 串起来：$C_0$ 端把第 5 个输入 $E$ 免费加进去，省一个 XOR 门。这正是题目指定「两片 FA + 一片 4 位加法器」的原因——三块积木正好吃下 5 个输入。
- 为什么只看 $\Sigma_0$：模 2 只取最低位，$\Sigma_1,\Sigma_2$ 携带的是「1 的个数 ÷2」，与奇偶无关，不能接到别的门上去（也没有别的门可接）。
- 权位对齐是关键：$c_1$ 是 $2^1$ 位、$s_1$ 是 $2^0$ 位，故接成 $c_1s_1$；接反等于算 $2s_1+c_1$。32 组全部验算后，1 的个数 0、2、4 时 $\Sigma_0=0$ → Even 高；1、3、5 时 $\Sigma_0=1$ → Odd 高。
- 减法只多两处接线：$B_i$ 各串一个 XOR（另一端共接 $S$），$S$ 再接 $C_0$，不需要第二次加法，283 本体一根线都不用改；又因 $A+\bar B+1=A-B+2^4$，丢掉第 5 位后 $C_4$ 恰好是「没有借位」（256 组穷举确认 $C_4=1\iff A\ge B$）。

### 易错点
- 想把 5 个输入直接塞进 4 位加法器（没有 5 个输入口，且一位放不下）；或忘了 $E$ 可以走 $C_0$。
- $s_1,c_1$ 接反（差一位权）；$\Sigma$ Even 忘取反，两个输出同相。
- 拿 $\Sigma_3$ 或 $C_4$ 当奇偶位——只有 $\Sigma_0$ 才是模 2。
- 减法时 $C_0$ 接 0（算成 $A+\bar B$，结果恒差 1），或只取反不加一（那是反码减法）；把 $C_4=1$ 读成借位（方向反了，$C_4=1$ 是「够减」）。

### 变体
- 8 位数据：两片 4 位加法器级联（$C_4\to C_0$），$C_0$ 接第 9 位或 0；校验器把数据与校验位一起相加，$\Sigma_0=1$ 即检出单比特错（编码层规则见 03 文件）。
- 8 位加/减器：两片 283 级联，8 个 XOR 共用一个 $S$，$S$ 接低片 $C_0$；无符号看高片 $C_4$，有符号看符号位。
- M2025f Q6：两比特数据的偶校验生成器/校验器，只许用 NAND，不用加法器——做法见 08 文件。

## 章末自测
1. 用公式算 $A=1011$、$B=0110$、$C_0=1$ 的 4 位和，写出 5 位结果与每位进位。
2. 写出 4 位 CLA 的 $C_4$ 展开式，并数它有几项、最长一项几个因子。
3. 两片 74HC283：低片 $A_3\ldots A_0=1111$、$B_3\ldots B_0=0001$，高片两输入全 0，求 $C_8$ 与 8 位和。
4. $4\times4$ 阵列乘法器用几个 AND、几个 FA，输出几位，关键路径几级 FA、多少 $t$？
5. 用 4 位加法器算 $9-5$：$B$ 端实际输入的 4 位是什么？$C_0$ 是几？
6. 五输入奇偶电路：$A=B=C=D=1$、$E=0$ 时 $\Sigma$ Odd 与 $\Sigma$ Even 各为高还是低？

## 自测答案
1. 逐位得 $\Sigma_3\ldots\Sigma_0=0010$、$C_4=1$（$11+6+1=18$），故五位为 $10010$；进位 $C_1=1$、$C_2=1$、$C_3=1$、$C_4=1$。
2. $C_4=G_3+P_3G_2+P_3P_2G_1+P_3P_2P_1G_0+P_3P_2P_1P_0C_0$：5 项，最长 5 个因子。
3. 低片 $1111+0001=10000$：$\Sigma_3\ldots\Sigma_0=0000$、$C_4=1$；高片 $0000+0000+1=0001$、$C_8=0$；8 位和 $=00010000$（$=16$）。
4. 16 个 AND、12 个 FA（3 行 × 4），输出 8 位；关键路径 8 级 FA，$0.1t+8t=8.1t$。
5. $\bar 5=\overline{0101}=1010$，故 $B$ 端为 $1010$、$C_0=1$；结果 $\Sigma=0100$（4），$C_4=1$ 说明 $9\ge5$。
6. 四个 1 是偶数个：$\Sigma_0=0$ → $\Sigma$ Even 为高、$\Sigma$ Odd 为低。
