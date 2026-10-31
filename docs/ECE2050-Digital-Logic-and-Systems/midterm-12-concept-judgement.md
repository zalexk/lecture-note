---
title: 12 概念判断题
---

# 12 概念判断题

> **真题分布**：M2024 Q1(1)–(10)；M2025s Q1(1)–(10)；M2025f Q1(1)–(10)；M2026 Q1(1)–(10)　|　**考频**：4/4 年，每年固定 10 分
> **一句话**：四套卷的第 1 题都是同一句题干加十句判断，只填 Y 或 N，不写步骤，考的是 Chapter 1–6 的定义有没有记偏。

## 这个课题在考什么

四套卷的题干逐字相同：`Are the following statements necessarily true (Y) or not (N)?`。10 句、10 分、每句 1 分，官方答案只给字母，偶尔附一个正确值（如 `N; 11010110`），没有步骤分。

这一题的做法与其它大题相反：**不推导，只核对定义**。题干里的 necessarily 是判据的全部来源——判的不是「这句话听起来对不对」，而是「有没有一个反例」。有反例即 N，找不到反例即 Y。

四套卷的 40 句里，定义型（数制的权、门的真值表、器件的端口）约占六成，计算型（补码值、范围、格雷码、BCD 和、校验位）约占四成。计算型的数值都只是「差一」「换向」「非法码」这一量级，不需要长竖式。

覆盖上有明显偏向：Chapter 1（数制）出现 8 句，Chapter 5（布尔）6 句，Chapter 3（编码）5 句，Chapter 9（加法器）5 句；Chapter 6（标准形式）与 Chapter 11（延迟）在四套卷里一句也没有。复习时按出现次数分配时间，比按章节顺序平均用力更划算。

陷阱集中在五处：绝对化词被忽略、角色与方向被互换、端点差一、条件被替换、公式形态反常。下文第 4 节按这五类展开，共 14 组。

### 四套卷的章节分布

| 课题 | M2024 | M2025s | M2025f | M2026 | 合计 |
|---|---|---|---|---|---|
| 01 数制与转换 | 2 | 3 | 1 | 2 | 8 |
| 02 补码与有符号算术 | 1 | 2 | 1 | 0 | 4 |
| 03 编码校验与浮点 | 0 | 2 | 2 | 1 | 5 |
| 04 逻辑门与电特性 | 1 | 2 | 0 | 1 | 4 |
| 05 布尔代数化简 | 3 | 0 | 2 | 1 | 6 |
| 06 标准形式与逻辑互转 | 0 | 0 | 0 | 0 | 0 |
| 07 卡诺图与最小化 | 0 | 0 | 1 | 0 | 1 |
| 08 通用门实现 | 1 | 0 | 1 | 1 | 3 |
| 09 加法器与运算电路 | 1 | 1 | 1 | 2 | 5 |
| 10 多路选择器与译码器 | 1 | 0 | 1 | 2 | 4 |
| 11 延迟时序与毛刺 | 0 | 0 | 0 | 0 | 0 |
| 合计 | 10 | 10 | 10 | 10 | 40 |

## 判题五步法

五步顺序固定。前两步只看不动笔（每句约 3 秒），后三步才落笔。四套卷的 40 句里，真正需要计算的不到一半。

### 第一步　按名词定位章节

句中出现的名词决定落到哪一章，也就决定了该回忆哪一条判据。定位错了，理由再顺也会判反。

| 句中的名词 | 章节 | 判据要点 |
|---|---|---|
| positive logic / HIGH / LOW / noise margin | 04 | 正逻辑 HIGH = 1 |
| weighted / base $n$ / digit / character / MSB | 01 | 基数决定符号个数与权 |
| 2's complement / range / overflow | 02 | 范围 $-2^{n-1}$ 到 $2^{n-1}-1$ |
| BCD / Gray / parity / trit | 03、01 | 合法码、相邻性、校验位的奇偶 |
| NAND / NOR / XNOR / universal | 04、08 | 真值表与通用性 |
| Boolean / DeMorgan / complement / domain | 05 | 布尔乘即与、加即或 |
| Karnaugh / adjacency / minterm | 07 | 只认共边相邻 |
| half-adder / full-adder / carry | 09 | 半加器无 $C_{in}$ |
| multiplexer / de-multiplexer / comparator | 10 | 多进一出还是一进多出 |

### 第二步　圈出绝对化词

这一步决定后面找「反例」还是找「实例」，方向搞反必错。

| 词 | 含义 | 处理 | 例句 |
|---|---|---|---|
| only | 唯一途径 | 找缺项，缺一项即 F | M2026 Q1(10) `only ... XOR gates` |
| can / possible / multiple | 存在某一实现 | 给出一例即 T | M2024 Q1(4) `multiple NAND gates` |
| all / any | 全称 | 找一个反例即 F | M2026 Q1(2) `all its input are LOW` |
| necessarily（题干） | 必然成立 | 偶尔成立也判 F | M2025f Q1(5) `overflow ... opposite signs` |
| exactly | 精确数量 | 逐位核对，多一位即 F | M2025f Q1(4) `exactly one bit` |
| 方向词（from / onto / selector / distributor） | 数据流向 | 先定源与宿再读 | M2026 Q1(9) `from a single source ... onto several lines` |

### 第三步　对定义或举反例

按第二步的结果分两路。判 F 时**必须写出具体输入**（「$A=0,B=1$ 时输出 0」），只写「定义不是这样」容易自欺。判 T 时只需确认定义逐字吻合，不必证明它对所有输入成立。

### 第四步　必要时算一个数值

句子里只要出现二进制串、进制数或位数，一律动笔。下表是四套卷里出现过的全部计算类型。

| 句中出现 | 算什么 |
|---|---|
| 补码串 | 取反加一；或用「无符号值 $-2^{n}$」得负数 |
| 位数 + range | $-2^{n-1}$ 到 $2^{n-1}-1$ |
| 两个 BCD 数相加 | 按十进制求和，逐位和大于 9 或有进位则加 6 |
| binary 转 Gray | 首位照抄，其后每位 = 本位与高一位异或 |
| 校验位 | 数 1 的个数：偶校验凑偶，奇校验凑奇 |
| 进制下标（$172_{16}$、$101_{3}$） | 按权展开，或先转十进制再算 |

### 第五步　落笔并写一行理由

理由只有两种模板：`正确的值是 X`，或 `反例：输入 … 时输出 …`。字母在前、数值在后，正是官方答案的形态（`N; 111010`）。

判分只认字母，但理由有三个作用：写不出理由说明在猜；复核时能立刻区分算错与记错；同一考点的理由可以直接复用到变体句上。

### 时间分配

先扫一遍 10 句，把需要计算的（通常 3–5 句）在题号上做记号，其余按定义直答。全题控制在 6 分钟以内，留 2 分钟复核做过记号的句子。这一题丢分几乎都源于赶时间时把「异号」读成「同号」。

## 四套卷逐句总表

卷面用 Y/N，本表统一写作 T/F：**T 即 Y**（necessarily true），**F 即 N**。原句逐字照抄，保留原卷的拼写与语法错误（`hexdecimal`、`Demorgan's`、`all its input are`、`less than other`）。

### M2024（官方答案）

| # | 题号 | 原句（英文逐字） | 答案 | 理由（中文，一句） | 课题 |
|---|---|---|---|---|---|
| 1 | Q1(1) | In positive logic, a HIGH level represents a binary 0. | F | 正逻辑 HIGH = 1；把 HIGH 当 0 是负逻辑。 | 04 |
| 2 | Q1(2) | The hexdecimal number system is a weighted system with 16 digits. | T | 按 $16^{k}$ 加权，符号共 16 个（原文拼写有误）。 | 01 |
| 3 | Q1(3) | The 2's complement of the binary number 1100 is 0011. | F | 1100 的补码是 0100；0011 只是反码。 | 02 |
| 4 | Q1(4) | It is possible to build an XOR gate with multiple NAND gates. | T | 存在即真：4 个 NAND 可搭出 XOR。 | 08 |
| 5 | Q1(5) | The domain of the expression $ABD+CD$ is A, B, C and D. | T | 域只统计出现过的变量，四变量全在其中。 | 05 |
| 6 | Q1(6) | In Boolean Algebra, the multiplication of two values is equivalent to the logical OR function. | F | 布尔乘对应 AND，布尔加才对应 OR。 | 05 |
| 7 | Q1(7) | The MSB represents the highest-order bit in a binary representation. | T | MSB 即最高位（most significant bit）。 | 01 |
| 8 | Q1(8) | The complement of a sum of variables is equal to the product of the complements of each variable is a statement of Demorgan's theorem. | T | 即 $\overline{A+B}=\bar A\bar B$，德摩根第二定理。 | 05 |
| 9 | Q1(9) | A full-adder can be realized using only 2 half-adders. | F | 两个半加器还缺一个 OR 才能得到 $C_{out}$。 | 09 |
| 10 | Q1(10) | The multiplexer is a data distributor while a de-multiplexer is a data selector. | F | 反了：MUX 是选择器，DEMUX 才是分配器。 | 10 |

### M2025s（官方答案，含 1 处勘误）

| # | 题号 | 原句（英文逐字） | 答案 | 理由（中文，一句） | 课题 |
|---|---|---|---|---|---|
| 11 | Q1(1) | A full-adder can be realized only by using 2-input AND gates; | F | AND 不通用，和位需 XOR、进位需 OR。 | 09 |
| 12 | Q1(2) | 11010101 is an 8-bit number in 2's complement form for a decimal number -42; | F | 11010101 表示 $-43$；$-42$ 应为 11010110。 | 02 |
| 13 | Q1(3) | For 2's complement signed numbers, the range of values for 5-bit numbers is from $-15$ to $+16$; | F | 5 位范围是 $-16$ 到 $+15$，负端多一个。 | 02 |
| 14 | Q1(4) | The sum (BCD form) of two BCD numbers 1001 and 0101 is 1110; | F | $9+5=14$ 须加 6 修正，结果 0001 0100。 | 03 |
| 15 | Q1(5) | The odd parity bit for the BCD number 00010100 is 1; | T | 数据含两个 1，奇校验位取 1；官方数值 0 有误。 | 03 |
| 16 | Q1(6) | When '1' and '0' are input into a 2-input XNOR gate, the output is 1; | F | XNOR 输入相异时输出 0。 | 04 |
| 17 | Q1(7) | Subtract $172_{16}$ from $BCD_{16}$, the result is $A5B_{16}$; | T | $3021-370=2651=A5B_{16}$；此处 BCD 指十六进制数。 | 01 |
| 18 | Q1(8) | The Gray code for the binary 101100 is 111011; | F | 逐位异或得 111010，末位与原句不同。 | 01 |
| 19 | Q1(9) | A NOR gate can be substituted by an XOR gate; | F | NOR 是负与，真值表与 XOR 不同。 | 04 |
| 20 | Q1(10) | A ternary numeral system (also called base 3 or trinary) has three as its base. Analogous to a bit, a ternary digit is a trit (trinary digit). Ternary most often refers to a system in which the three digits are all non-negative numbers; specifically 0, 1, and 2. The decimal for the ternary number 101 is 5. | F | $101_{3}=9+1=10$，不是 5。 | 01 |

> **勘误**：Q1(5) 官方写 `Y; 0`，字母与数值自相矛盾。数据 00010100 有两个 1，要凑成奇数个 1，奇校验位必须取 1；取 0 则总个数仍为偶数，起不到奇校验作用。故原句为真、正确值为 1，本表记 T。考场按 `Y` 作答，理由写「两个 1，故奇校验位为 1」。

> **备注**：Q1(1) 官方理由列举的是 XOR 与 OR，二者都不能由 AND 实现，故「仅用 AND」不成立，字母 N 无疑义。判据落在句中的 only 上。

### M2025f

> 本卷无官方答案，以下 10 句为自判。

| # | 题号 | 原句（英文逐字） | 答案 | 理由（中文，一句） | 课题 |
|---|---|---|---|---|---|
| 21 | Q1(1) | Diagonal adjacency is valid for grouping minterms in a Karnaugh map; | F | 卡诺图只认共边相邻，对角不能圈。 | 07 |
| 22 | Q1(2) | The XOR of all bits in a word yields the odd parity bit; | F | 全部位异或得偶校验位，奇校验位还要取反。 | 03 |
| 23 | Q1(3) | BCD uses four bits per digit, leaving six unused combinations; | T | 16 个码用 10 个，剩 6 个（1010–1111）。 | 03 |
| 24 | Q1(4) | Gray code ensures consecutive codes differ by exactly one bit; | T | 相邻码只差 1 位是格雷码的定义性质。 | 01 |
| 25 | Q1(5) | In two's complement addition, overflow occurs when adding numbers with opposite signs; | F | 异号相加绝不溢出，只有同号相加会溢出。 | 02 |
| 26 | Q1(6) | A $2^n$-to-1 multiplexer can implement any $n$-variable Boolean function by tying data inputs to constants and using the $n$ variables as select lines; | T | $2^{n}$ 个数据端配 $n$ 根选择线，接常数即可。 | 10 |
| 27 | Q1(7) | $\overline{A+B}=\bar{A}+\bar{B}$; | F | 德摩根应为 $\overline{A+B}=\bar A\bar B$。 | 05 |
| 28 | Q1(8) | $A+(B\cdot C)=(A+B)\cdot(A+C)$; | T | 这是 OR 对 AND 的分配律。 | 05 |
| 29 | Q1(9) | A 2-input XOR can be implemented using four NAND gates; | T | 4 个 NAND 的标准接法即可实现 XOR。 | 08 |
| 30 | Q1(10) | A full adder can be built from two half adders and an OR gate. | T | 两个半加器的进位相或即 $C_{out}$。 | 09 |

### M2026（官方答案）

| # | 题号 | 原句（英文逐字） | 答案 | 理由（中文，一句） | 课题 |
|---|---|---|---|---|---|
| 31 | Q1(1) | NAND gates can be used to produce XOR functions. | T | NAND 通用，可产生 XOR 功能。 | 08 |
| 32 | Q1(2) | A NOR gate outputs HIGH when all its input are LOW. | T | 全 LOW 时 OR 出 0，NOR 取反出 1。 | 04 |
| 33 | Q1(3) | 1011 is a valid BCD code; | F | 1011 落在非法区 1010–1111。 | 03 |
| 34 | Q1(4) | The hexadecimal number system has 16 characters, six of which are alphabetic characters. | T | 符号为 0–9 加 A–F，字母共 6 个。 | 01 |
| 35 | Q1(5) | A comparator circuit determines if two binary numbers are equal, greater than, or less than other. | T | 比较器给出等于、大于、小于三种结果。 | 10 |
| 36 | Q1(6) | In boolean algebra, $A\bar{A}=1$ for any input A. | F | 互补律给 $A\bar A=0$；$A+\bar A$ 才为 1。 | 05 |
| 37 | Q1(7) | A half-adder includes a carry out but no carry-in input. | T | 半加器只有 $A,B$ 两输入，有 $C_{out}$ 无 $C_{in}$。 | 09 |
| 38 | Q1(8) | The binary number 1011 is equivalent to decimal number 11. | T | $1011_{2}=8+2+1=11$。 | 01 |
| 39 | Q1(9) | A multiplexer is a logic circuit that allows digital information from a single source to be routed onto several lines. | F | 这是 DEMUX 的功能；MUX 是多路汇入一路。 | 10 |
| 40 | Q1(10) | A full-adder can be realized only by using 2-input XOR gates. | F | XOR 只出和位，进位还需 AND 与 OR。 | 09 |

> **答案分布**：40 句中 19 句 T、21 句 F。逐卷为 M2024 五 T 五 F、M2025s 二 T 八 F、M2025f 六 T 四 F、M2026 六 T 四 F。没有一年出现全真或全假，因此「拿不准就一律选 N」只能得 21 分，不能代替判断。

## 陷阱类型归纳

下面把 40 句按**错误模式**聚类，不按章节。每类给判据、例句与一句纠偏；按类别过一遍比按年份过一遍更抗变体。

### 1　only 型：断言只用某一种门

判据：only 要求「只用」该器件即可完成。全加器需要 XOR 出和位、AND 与 OR 合进位，缺任何一路即 F。

- M2024 Q1(9)（F）：两个半加器缺最后一级 OR。
- M2025s Q1(1)（F）：只有 AND，出不了和位。
- M2026 Q1(10)（F）：只有 XOR，出不了进位。

**纠偏**：先写下 $S=A\oplus B\oplus C_{in}$ 与 $C_{out}=AB+C_{in}(A\oplus B)$，再看句中允许的门能否覆盖两式。

### 2　can 型：存在性命题被读成唯一性

判据：出现 can / possible / multiple 时，只要构造出一例即为 T，不必是最优实现。

- M2024 Q1(4)（T）：multiple 不限定个数，4 个 NAND 足够。
- M2025f Q1(9)（T）：four 是精确数量，4 个 NAND 恰好可行。
- M2026 Q1(1)（T）：只说 can be used，没有 only。

**纠偏**：only 是「必须」，can 是「可以」，两者方向相反；同一句里不会同时出现。

### 3　角色与方向被互换

判据：先定数据流向（多进一出还是一进多出），再读句中的 selector / distributor、odd / even、positive / negative。

- M2024 Q1(10)（F）：MUX 与 DEMUX 的称谓整体对调。
- M2026 Q1(9)（F）：单源分配到多线，是 DEMUX 的定义。
- M2025f Q1(2)（F）：异或得偶校验位，说成奇校验位即假。
- M2024 Q1(1)（F）：正逻辑说成 HIGH = 0，那是负逻辑。

**纠偏**：读到成对术语（选择/分配、奇/偶、正/负）就先判「谁对谁」，配错即 F，不必再读后半句。

### 4　差一：补码的三种错法

判据：求负 = 取反加一；$n$ 位范围 $-2^{n-1}$ 到 $2^{n-1}-1$；负端比正端多一个。

- M2024 Q1(3)（F）：1100 的补码是 0100，0011 只是反码。
- M2025s Q1(2)（F）：11010101 等于 $-43$，比 $-42$ 差一。
- M2025s Q1(3)（F）：5 位是 $-16$ 到 $+15$，句中的 $-15$ 到 $+16$ 把两端都挪反。

**纠偏**：补码题一律用「无符号值 $-2^{n}$」在十进制里核对，不靠心算取反。

### 5　BCD 的合法域与加 6 修正

判据：每位只准 0000–1001，4 位有 6 个非法码；两位和大于 9 或有进位则加 6。

- M2026 Q1(3)（F）：1011 等于 11，落在非法区。
- M2025s Q1(4)（F）：$9+5=14$ 须得 0001 0100，1110 本身非法。
- M2025f Q1(3)（T）：$16-10=6$，与上一句互为补集。

**纠偏**：BCD 的结果先写成十进制，再逐位拆成 4 位；出现 1010–1111 就说明漏了加 6。

### 6　把布尔式当算术式

判据：布尔乘即 AND，布尔加即 OR；$X\bar X=0$、$X+\bar X=1$，与算术的 $1\times1=1$、$1+1=2$ 无关。

- M2024 Q1(6)（F）：乘法对应 OR，是把算术直觉搬进了布尔代数。
- M2026 Q1(6)（F）：$A\bar A=1$ 把互补律与重言式弄混。

**纠偏**：凡句中出现 multiplication / addition / equals 1，先翻译成 AND / OR / 恒等式，再对照真值表。

### 7　公式形态反常：德摩根与分配律

判据：$\overline{A+B}=\bar A\bar B$、$\overline{AB}=\bar A+\bar B$；$A+BC=(A+B)(A+C)$。

- M2024 Q1(8)（T）：原句两个谓语粘连，陈述的仍是德摩根第二定理。
- M2025f Q1(7)（F）：和的补写成了补的和，横线的位置错。
- M2025f Q1(8)（T）：看着像展开错误，实为 OR 对 AND 的分配律。

**纠偏**：德摩根看「横线断在哪里」，断开后加变乘、乘变加；分配律记住 OR 也能对 AND 分配。

### 8　门与校验位：逐位列表才算数

判据：门看真值表，校验位看 1 的个数；奇校验使总数为奇，偶校验使总数为偶。

- M2025s Q1(6)（F）：XNOR 遇相异输入输出 0，不是 1。
- M2025s Q1(9)（F）：NOR 是负与，与 XOR 无替代关系。
- M2025s Q1(5)（T）：两个 1，奇校验位取 1；官方数值有误，见勘误。

**纠偏**：这两类都用「写出两行真值表」解决，不靠语感；校验位只需数 1 的奇偶。

### 9　端口数与规模必须配上

判据：半加器 2 入 2 出、无 $C_{in}$；全加器 3 入 2 出；$2^{n}$:1 的 MUX 有 $2^{n}$ 个数据端与 $n$ 根选择线。

- M2026 Q1(7)（T）：半加器有 $C_{out}$、无 $C_{in}$，描述正确。
- M2025f Q1(6)（T）：$2^{n}$ 数据端配 $n$ 根选择线，接 0/1 即可实现任意 $n$ 变量函数。
- M2025f Q1(10)（T）：两个半加器加一个 OR，端口正好够。

**纠偏**：读器件句先数端口（几个输入、几个输出、有无进位输入），数与句子不符即 F。

### 10　「相邻」的两种含义

判据：格雷码的相邻指编码序列相邻、只差 1 位；卡诺图的相邻指格子共边，含边界回卷，不含对角。

- M2025f Q1(4)（T）：相邻码只差 1 位，是格雷码的定义。
- M2025f Q1(1)（F）：对角格不共边，圈起来不化简。
- M2025s Q1(8)（F）：101100 的格雷码是 111010，只差末位。

**纠偏**：格雷码逐位异或后再核末位；卡诺图先问「两格是否共边」，再谈能否成组。

### 11　符号集与权：基数的两重含义

判据：$n$ 进制有 $n$ 个符号，第 $k$ 位权为 $n^{k}$；十六进制的 16 个符号中有 6 个是字母。

- M2024 Q1(2)（T）：weighted 与 16 digits 都成立，原文拼写不影响。
- M2026 Q1(4)（T）：16 个符号、6 个字母，两个数都要对上。

**纠偏**：把「基数 = 符号个数」与「基数 = 权值的底」分开记，两句都成立才算读懂。

### 12　进制换算：写到末位再对

判据：按权展开，或先转十进制；十六进制竖式按 16 借位。

- M2025s Q1(7)（T）：$3021-370=2651=A5B_{16}$；此处的 BCD 是十六进制数，不是 BCD 码。
- M2025s Q1(10)（F）：$101_{3}=10$，末句的 5 是错的。
- M2026 Q1(8)（T）：$1011_{2}=11$，逐位加完即得。

**纠偏**：长句只看带数值的末句；名字里带 BCD 的十六进制数照十六进制算。

### 13　when 从句才是判据所在

判据：主句给结论、从句给条件时，被换掉的往往是条件。

- M2025f Q1(5)（F）：溢出条件是同号相加，句中说成异号。
- M2026 Q1(2)（T）：条件 all inputs LOW 与 NOR 的真值表吻合。

**纠偏**：把 when / if 从句圈出来单独读一遍，再读主句，两句都成立才判 T。

### 14　术语与功能直述

判据：MSB/LSB 说位序；domain 说出现过的变量集合；比较器给三种关系。

- M2024 Q1(7)（T）：MSB 即最高位。
- M2024 Q1(5)（T）：$ABD+CD$ 覆盖 A、B、C、D，故域为四变量。
- M2026 Q1(5)（T）：比较器判等于、大于、小于。

**纠偏**：术语题不设陷阱，按定义直答；若觉得「不太对」，先确认是否把 least 与 most 读反。

## 高频必背的 15 条判定句

以下 15 句为正面表述，考场上遇到反说法即判 F。括号外的英文是句中会出现的关键词。

| # | 判定句 | 英文关键词 | 详见 |
|---|---|---|---|
| 1 | 正逻辑下 HIGH = 1、LOW = 0；负逻辑才相反。 | positive / negative logic | 04 |
| 2 | $n$ 进制有 $n$ 个符号，第 $k$ 位权为 $n^{k}$；十六进制 16 个符号中含 6 个字母。 | weighted system, base, character | 01 |
| 3 | MSB 是最高位，LSB 是最低位。 | most / least significant bit | 01 |
| 4 | $n$ 位补码范围是 $-2^{n-1}$ 到 $2^{n-1}-1$，负数比正数多一个。 | 2's complement range | 02 |
| 5 | 求补码 = 取反加一；只取反得到的是反码。 | one's complement, negate | 02 |
| 6 | 只有同号相加才可能溢出；异号相加绝不溢出。 | overflow, same / opposite signs | 02 |
| 7 | BCD 每位只允许 0000–1001，4 位有 6 个非法码；两位和大于 9 或有进位就加 6。 | BCD, invalid code, add 6 | 03 |
| 8 | 格雷码相邻码只差 1 位；二进制转格雷 = 本位与高一位异或。 | Gray code, adjacent | 01 |
| 9 | 偶校验位 = 全部数据位异或；奇校验位 = 该值取反。 | even / odd parity bit, XOR | 03 |
| 10 | NAND、NOR 是通用门，可单独实现任意布尔函数；AND、OR、XOR 不是。 | universal gate | 08 |
| 11 | 布尔乘即 AND，布尔加即 OR；$X\bar X=0$，$X+\bar X=1$。 | Boolean product / sum, complement | 05 |
| 12 | 德摩根：和的补等于补的积，积的补等于补的和。 | DeMorgan's theorem | 05 |
| 13 | 卡诺图只认同行同列相邻（含边界回卷），对角不算；每组格数为 $2^{k}$。 | adjacency, grouping, don't care | 07 |
| 14 | 两个半加器加一个 OR 才是全加器；半加器有 $C_{out}$、无 $C_{in}$。 | half adder, full adder, carry | 09 |
| 15 | MUX 多进一出，DEMUX 一进多出；$2^{n}$:1 的 MUX 数据端接 0/1 可做任意 $n$ 变量函数；比较器给等于、大于、小于。 | multiplexer, select line, comparator | 10 |

## 章末自测（10 句新编）

以下 10 句按真题体例改写，答案在表后。先合上答案，每题限时 30 秒。

1. In negative logic, a LOW level represents a binary 1.
2. The 2's complement of the 8-bit number 10000000 is 10000000.
3. An 8-bit 2's complement number can represent the value $+128$.
4. Adding 0111 and 0111 as 4-bit 2's complement numbers gives 1110 and sets the overflow flag.
5. A 3-input XOR gate outputs 1 when exactly two of its inputs are 1.
6. A 4-to-1 multiplexer requires two select lines.
7. Any Boolean function of three variables can be implemented by a 4-to-1 multiplexer whose data inputs are tied to 0, 1, $X$ or $\bar X$.
8. In a Karnaugh map, three adjacent 1s can be combined into a single product term.
9. For the data word 1110, the odd parity bit is 0.
10. The sum output of a half adder is $A+B$.

### 答案

| # | 答案 | 一句理由 |
|---|---|---|
| 1 | T | 负逻辑 LOW = 1，与正逻辑相反。 |
| 2 | T | 取反加一仍在 8 位内得 10000000，即该数的相反数是自身。 |
| 3 | F | 8 位上限是 $+127$，$+128$ 已溢出。 |
| 4 | T | $7+7=14$ 超出 4 位正数上限 7，和的符号位变负。 |
| 5 | F | 两个 1 时 1 的个数为偶，XOR 输出 0。 |
| 6 | T | 4 个数据端正好对应 2 位选择码。 |
| 7 | T | 两变量做选择，第三个变量以 $X$ 或 $\bar X$ 进数据端。 |
| 8 | F | 组内格数必须是 $2^{k}$，3 格无法成组。 |
| 9 | T | 1110 已有三个 1，补 0 才保持奇数个 1。 |
| 10 | F | 半加器的和是 $A\oplus B$，$A+B$ 是 OR。 |

答对 9 句以上：Q1 可稳拿 9–10 分。答对 7–8 句：回看第 4 节中错句所属的那一组。答对 6 句以下：按第 5 节逐条默写 15 条判定句，再回到「判题五步法」检查第二步是否漏圈绝对化词。
