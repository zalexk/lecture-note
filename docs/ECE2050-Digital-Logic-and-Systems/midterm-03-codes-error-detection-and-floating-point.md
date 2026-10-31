---
title: 03 编码、校验与浮点
---

# 03 编码、校验与浮点

> **真题分布**：2024 Q2(5)；2025s Q1(4)(5)、Q3(2)、Q8；2025f Q2(2)；2026 Q2(4)；HW1 Q5(c)(d)、Q6(c)(d)、Q7、Q8　|　**考频**：4/4 年，每年 3–10 分
> **一句话**：同一串 0/1 按 BCD、校验位、CRC、浮点四种约定各读一次；题目只问「按这套约定，答案是什么」。

## 这个课题在考什么

Chapter 1 末尾把 BCD、奇偶校验、CRC 与 Chapter 2 的 IEEE 754 归为同一类：它们不是「数」，而是**编码约定**。同一个 8 位串 $10010100$ 可以是 BCD 的 94、无符号数 148，也可以是一段浮点字段。

卷面上这四类题都是「给定约定 + 一次机械操作」：BCD 加法加 6、校验位数 1 的个数、CRC 做异或除法、浮点移小数点。得分点因此不在理解，而在**每一步都落在卷面上**——官方答案给出的中间量，就是评分点。

四类题的共同前提是同一条判断：先把 bit 串按约定**分组**（4 位一组、数据加校验位、整帧、三段位域），再在组内做算术。分组错，后面全错。

数制互转与格雷码属于 01 文件（如 2024 Q2(2) 的格雷码转二进制），本文件不重复。

## 必备知识

- 二-十进制编码（binary-coded decimal, BCD）：每个十进制数字占 4 位，只用 $0000\sim1001$；$1010\sim1111$ 是非法码（invalid code）。
- BCD 加法修正：某组结果落在 $1010\sim1111$，或该组向高位产生了进位，就给这一组加 $0110$；一个 4 位组有 $2^4=16$ 个码字而 BCD 只用 10 个，差 $16-10=6$。
- 偶校验（even parity）：校验位 $p=b_{n-1}\oplus\cdots\oplus b_0$，使全组 1 的个数为偶数；奇校验（odd parity）取 $p=\overline{b_{n-1}\oplus\cdots\oplus b_0}$，使全组 1 的个数为奇数。
- 奇偶校验只检错不纠错，只能保证检出**奇数个**位错；两位同错会漏检。
- 循环冗余校验（cyclic redundancy check, CRC）：补零个数 = 生成码位数减 1 = 生成多项式次数；余数位数等于补零个数。
- 模 2 除法（modulo-2 division）：逐位异或，无借位也无进位，每一步只消去当前最高位的 1。发送码 = 数据后接余数；接收端把整帧再除一次，余数为 0 才算通过。
- IEEE 754 浮点格式（IEEE 754）：32 位 = 1 符号 + 8 指数 + 23 尾数，bias 127，真值 $(-1)^S\times(1.F)\times2^{E-127}$；自定义 $k$ 位指数域的 bias $=2^{k-1}-1$（$k=8$ 得 127，$k=4$ 得 7）。

| 4 位组的值 | $0000\sim1001$ | $1010\sim1111$ |
|---|---|---|
| 含义 | 十进制 $0\sim9$，合法 BCD | 非法码，BCD 中不出现 |
| 加法时 | 直接保留该组 | 必须 $+0110$ 修正 |

本课题只讲 BCD、奇偶校验、CRC 与浮点编码；数制互转与格雷码见 01 文件，补码与有符号算术见 02 文件。

## 题型 3.1 BCD 的合法性与 BCD 加法

### 识别特征

题干出现 "BCD Addition"、"the sum (BCD form)"、"using BCD addition"，或给出按 4 位分组、每组不超过 $1001$ 的两个数。

### 原题

(a) 2025f Q2(2)：

> (2) (3 points)Perform BCD Addition on the following BCD numbers and show the result in BCD representation:
>
> $1001 + 0011$
>
> Show your result in BCD representation.

(b) 2025s Q1(4)：

> (4) The sum (BCD form) of two BCD numbers 1001 and 0101 is 1110;

(c) HW1 Q7：

> Q7 Perform
>
> $739 + 486$
>
> using BCD addition.

### 官方答案

(a) 该卷无答案，以下为自算，已用 Python 复核：$1001+0011=1100$（非法码），$1100+0110=1\,0010$，结果 **0001 0010**。

(b) `N; 00010100`（即 $0001\,0100$，十进制 14）。

(c) 作业无答案，以下为自算：**1 0010 0010 0101**（$1225$）。

### 解题步骤

1. **查合法性、逐组二进制相加** —— 每个 4 位组对照 $0000\sim1001$；若题干给的"BCD 数"里出现 $1010\sim1111$，说明它根本不是 BCD。从最低组开始，组内按 4 位二进制加，组间进位照常传递；这一步得到的是"二进制和"，还不是 BCD。
2. **判修正、处理二次进位** —— 组的和落在 $1010\sim1111$，或该组向高位产生了进位，就给这一组加 $0110$；加 6 后若该组又溢出到第 5 位，进位并入高一组，本组只留低 4 位。
3. **转十进制自检** —— 按组查表还原成十进制，与两数直接相加比较。

### 答案复盘

- (a) 三个动作对应三条规则：$1001+0011=1100$ 是上面第 1 步的二进制和；$1100$ 落在非法区，触发第 2 步的 $+0110$；$1100+0110=1\,0010$ 中低 4 位 $0010=2$、第 5 位是进位，于是答案写成两组 $0001\,0010$，即 12。加 6 而不是加 10 的原因：二进制加法在 4 位组里"多走"了 $1010\sim1111$ 这 6 个 BCD 不用的码字，加 6 正好把这段落差补平。
- (b) 官方判 `N`，依据是：$1001+0101=1110$ 只是二进制和（十进制 14），而 $1110$ 是非法码，不能作为 BCD 的结果；正确的 BCD 结果是 $0001\,0100$。官方把答案连写成 `00010100`，读作两组 $0001$、$0100$——判题时省空格可以，自己作答必须分组写，否则看不出你做过修正。
- (c) 三组逐组处理：个位 $1001+0110=1111$（15，非法），$+0110=1\,0101$，留 $0101$、进位 1；十位 $0011+1000+1=1100$（12），$+0110=1\,0010$，留 $0010$、进位 1；百位 $0111+0100+1=1100$，$+0110=1\,0010$，留 $0010$、再进位 1，这个 1 就是千位。$739+486=1225$，自检通过。

### 易错点

- 只对"和大于 9"的组加 6，漏掉"和不超过 9 但产生了进位"的组：$1001+1001=1\,0010$，低组 $0010$ 仍须 $+0110$ 得 $1000$，结果 $1\,1000=18$。
- 把 BCD 加法当二进制加法，$1001+0011=1100$ 直接交卷。
- 修正后忘记进位，或加 6 后产生的第 5 位被丢掉。
- 把 $739$ 当作一个二进制数展开；BCD 里它写作 $0111\,0011\,1001$，与 $739_{10}$ 的二进制 $1011100011$ 完全不同。
- 答案不分组：`00010010` 与 `0001 0010` 数值相同，但后者才能证明你按 BCD 处理。

### 变体

- 多字节：每 4 位一组，从最低组向高处理，进位链与十进制竖式一致（HW1 Q7 就是三组）。
- 判断题：问"两 BCD 数之和是否为某串"，先算二进制和再判合法性，答案多为 `N` 加正确 BCD（2025s Q1(4)）。
- 反向：判一串是否合法 BCD，只要有一组落在 $1010\sim1111$ 即非法。
- 与译码器、七段显示结合时，BCD 的非法码通常当无关项处理，见 07 与 10 文件。

## 题型 3.2 奇偶校验

### 识别特征

题干出现 "odd/even parity bit"、"add a parity bit"、"parity receiver receives"，或问某码组能否检出错误。

### 原题

(a) 2024 Q2(5)：

> (5) Determine the odd parity bit for the BCD number 00101001.

(b) HW1 Q6(c)(d)：

> (c) Add an even-parity bit to the data: 1011011.
> (d) An odd-parity receiver receives the group 11010010. Identify whether this group containing a detectable error

(c) 2025s Q1(5)：

> (5) The odd parity bit for the BCD number 00010100 is 1;

### 官方答案

(a) `0`。

(b) (c) $10110111$；(d) 检出错误（该组有 4 个 1，为偶数，违反奇校验约定）。

(c) `Y; 0`。

> **勘误**：2025s Q1(5) 的官方答案 `Y; 0` 自相矛盾。数据 $00010100$ 含两个 1（偶数个），要使含校验位后 1 的个数为奇数，校验位必须是 1，故原句 "is 1" 为真。正确判定是 `Y; 1`，官方第二栏的 `0` 与第一栏的 `Y` 冲突，疑为抄串。考试遇到同类句：先数 1 的个数，再定校验位，最后判原句给的数值是否等于算出的值；判定字母与数值必须自洽。

### 解题步骤

1. **数 1、定目标奇偶** —— 数数据位（不含校验位）中 1 的个数 $k$；偶校验要求 $k+p$ 为偶数，奇校验要求 $k+p$ 为奇数。
2. **定校验位、接收端判定** —— $k$ 的奇偶性已符合目标则 $p=0$，否则 $p=1$；等价写法是偶校验 $p=b_{n-1}\oplus\cdots\oplus b_0$，奇校验再取反。接收端把收到的校验位一起数（或全部异或），与约定比较，不符即"检出错误"。
3. **交代位置** —— 校验位加在最高位左侧还是最低位右侧要写明；本课默认加在左侧。

### 答案复盘

- (a) $00101001$ 有 3 个 1（第 5、3、0 位），已是奇数；奇校验要求含校验位共奇数个 1，故 $p=0$。官方只写一个 `0`，因为这一步没有别的中间量；考场上应补一句"3 个 1，奇数，故 0"。
- (b)(c) $1011011$ 有 5 个 1（奇数），偶校验要求总数为偶数，故 $p=1$；拼在最左得 $1\,1011011$，即 $10110111$。官方未说明位序，答案默认校验位在最高位。
- (b)(d) $11010010$ 有 4 个 1，为偶数，而接收端约定的是奇校验；偶数个 1 违反约定，判"有可检出的错误"。注意题目问的是能否检出（detectable），不是错在哪一位——奇偶校验给不出位置。
- (c) 用同一条规则重算：$00010100$ 有 2 个 1，奇校验位应为 1，原句为真，故 `Y`；官方第二栏应为 `1`，见勘误。这一问的坑是"判定句真假"与"求校验位"两件事被压在一栏里：字母答对、数值抄错，仍然没分。

### 易错点

- 把校验位也算进 $k$ 之后再判奇偶（应先用数据位定 $p$，接收端才连校验位一起数）。
- even 与 odd 记反：偶校验是"总数为偶"，不是"校验位取偶数"。
- 位序混用：$10110111$ 与 $01101101$ 是两个不同码字。
- 认为奇偶校验能纠错，或认为它能发现任意错误；两位同错漏检。判定题还要"字母 + 依据"自洽，像官方 (c) 那样 `Y; 0` 会被判错。

### 变体

- 给一帧含校验位、问哪组出错（讲义 p70 的 5 组例题）：逐组数 1 的奇偶即可。
- 长数据：可整体配一个校验位，也可按字节各配一个。
- 用门实现：偶校验生成器就是一棵 XOR 树，见 08 文件；用加法器搭多位奇偶电路见 09 文件。

## 题型 3.3 CRC 循环冗余校验

### 识别特征

题干出现 "Apply CRC"、"generator code"、"Remainder (Checksum)"、"modulo-2 division"，并给出数据位串与生成码；问余数、发送码，或问接收端能否通过。

### 原题

(a) 2025s Q3(2)：

> (2) (8 points) Apply CRC to the data bits 1101 using the generator code 101 to produce the transmitted CRC code. (Tips: The Number of zeros to append equals the length of the generator code minus one.)

(b) 2026 Q2(4)：

> (4) (3 points) About Cyclic Redundancy Check, at the sending end wants to send data 11010011 to the receiving end. The generator code is 1010. Please write down the Remainder (Checksum) at the sending end.

(c) HW1 Q8：

> Q8 Use modulo-2 division (XOR), find the CRC checksum.
>
> $D=(10110110)_2,\qquad G=(1101)_2$
>
> For the case:
> (i) Append the correct number of zeros to the data.
> (ii) Calculate the remainder.
> (iii) Write the complete transmitted code.
> (iv) Verify that dividing the transmitted codeword by the generator produces a zero remainder.

### 官方答案

(a) `The remainder is 10, so the transmitted CRC is 110110`。官方竖式重绘如下（生成码 $101$ 为 3 位，故余数 2 位）。

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif;font-size:13px">
<tr><th style="border:1px solid #999;padding:4px 10px">行</th><th style="border:1px solid #999;padding:4px 10px">$b_5$</th><th style="border:1px solid #999;padding:4px 10px">$b_4$</th><th style="border:1px solid #999;padding:4px 10px">$b_3$</th><th style="border:1px solid #999;padding:4px 10px">$b_2$</th><th style="border:1px solid #999;padding:4px 10px">$b_1$</th><th style="border:1px solid #999;padding:4px 10px">$b_0$</th><th style="border:1px solid #999;padding:4px 10px">说明</th></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">被除数</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">$1101$ 后补 2 个 0</td></tr>
<tr style="background:#e8f0fe"><td style="border:1px solid #999;padding:4px 10px">XOR 101</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px">对齐最高位的 1</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">余</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">$b_5$ 已消为 0</td></tr>
<tr style="background:#e8f0fe"><td style="border:1px solid #999;padding:4px 10px">XOR 101</td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px">对齐 $b_4$ 的 1</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">余</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">只剩 $b_3$ 的 1</td></tr>
<tr style="background:#e8f0fe"><td style="border:1px solid #999;padding:4px 10px">XOR 101</td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px"></td><td style="border:1px solid #999;padding:4px 10px">对齐 $b_3$ 的 1</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">余</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">0</td><td style="border:1px solid #999;padding:4px 10px">余数 $10$，位数已到 2</td></tr>
</table>

(b) `Append zeros to the data: 11010011000`；`Perform polynomial division: Let's divide 11010011000 by 1010: The remainder is 010 (3 bits)`。逐步重绘：

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif;font-size:13px">
<tr><th style="border:1px solid #999;padding:4px 10px">步</th><th style="border:1px solid #999;padding:4px 10px">当前被除数</th><th style="border:1px solid #999;padding:4px 10px">对齐后的生成码</th><th style="border:1px solid #999;padding:4px 10px">异或结果</th></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">11010011000</td><td style="border:1px solid #999;padding:4px 10px">10100000000</td><td style="border:1px solid #999;padding:4px 10px">01110011000</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">2</td><td style="border:1px solid #999;padding:4px 10px">01110011000</td><td style="border:1px solid #999;padding:4px 10px">01010000000</td><td style="border:1px solid #999;padding:4px 10px">00100011000</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">3</td><td style="border:1px solid #999;padding:4px 10px">00100011000</td><td style="border:1px solid #999;padding:4px 10px">00101000000</td><td style="border:1px solid #999;padding:4px 10px">00001011000</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">4</td><td style="border:1px solid #999;padding:4px 10px">00001011000</td><td style="border:1px solid #999;padding:4px 10px">00001010000</td><td style="border:1px solid #999;padding:4px 10px">00000001000</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">5</td><td style="border:1px solid #999;padding:4px 10px">00000001000</td><td style="border:1px solid #999;padding:4px 10px">00000001010</td><td style="border:1px solid #999;padding:4px 10px">00000000010</td></tr>
</table>

余数取最低 3 位，即 `010`。

(c) 自算，已复核：(i) 补 3 个 0 得 $10110110000$；(ii) 余数 `010`；(iii) 发送码 $10110110010$；(iv) 整帧再除，四步后得 $00000000000$，余 `000`，验证通过。

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif;font-size:13px">
<tr><th style="border:1px solid #999;padding:4px 10px">步</th><th style="border:1px solid #999;padding:4px 10px">当前被除数</th><th style="border:1px solid #999;padding:4px 10px">对齐后的生成码</th><th style="border:1px solid #999;padding:4px 10px">异或结果</th></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">1</td><td style="border:1px solid #999;padding:4px 10px">10110110000</td><td style="border:1px solid #999;padding:4px 10px">11010000000</td><td style="border:1px solid #999;padding:4px 10px">01100110000</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">2</td><td style="border:1px solid #999;padding:4px 10px">01100110000</td><td style="border:1px solid #999;padding:4px 10px">01101000000</td><td style="border:1px solid #999;padding:4px 10px">00001110000</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">3</td><td style="border:1px solid #999;padding:4px 10px">00001110000</td><td style="border:1px solid #999;padding:4px 10px">00001101000</td><td style="border:1px solid #999;padding:4px 10px">00000011000</td></tr>
<tr><td style="border:1px solid #999;padding:4px 10px">4</td><td style="border:1px solid #999;padding:4px 10px">00000011000</td><td style="border:1px solid #999;padding:4px 10px">00000011010</td><td style="border:1px solid #999;padding:4px 10px">00000000010</td></tr>
</table>

### 解题步骤

1. **数补零个数、对齐最高位 1** —— 生成码 $k$ 位就补 $k-1$ 个 0（等于生成多项式的次数），余数也占 $k-1$ 位，不足左补 0；把生成码左移，使其最高位与当前被除数最左边的 1 对齐。
2. **异或相减、降位重复** —— 对齐后逐位异或，不借位不进位，唯一效果是把当前最高位变成 0；丢掉左端剩下的 0，从新的最高位 1 重复上一步，直到余数位数小于 $k$。
3. **拼接与验证** —— 发送码 = 原数据后接余数；若问接收端，把整帧再除一次，余 0 通过。

### 答案复盘

- (a) 8 分题把最关键的规则直接写进题干：`The Number of zeros to append equals the length of the generator code minus one`，这就是上面第 1 步——$101$ 三位，补 2 个 0，因此余数 2 位。官方竖式里第二行的 `101` 省略了尾部补位，对齐信息藏在缩进中，对应第 1 步的"左移到最高位 1"。三次异或后剩 `10`，位数已到 2，停止；发送码 `1101` 接 `10` 得 `110110`，是第 3 步。
- (b) 官方只保留"补 0"和"余数 `010`（3 bits）"两句，中间除法被略去——3 分题的评分点就是余数的**位数与数值**：$1010$ 四位，补 3 个 0，余数必须写满 3 位 `010`，写成 `10` 或 `0100` 都不对。这与 (a) 的唯一区别就是位数。
- (c) 四小问是上面三步的逐条展开：(i) 对应第 1 步，(ii) 对应第 2 步，(iii) 对应第 3 步的前半，(iv) 对应第 3 步的后半。验证必然为 0 的理由：模 2 除法的定义给出 $D\cdot2^{k-1}=G\cdot Q\oplus R$，故整帧 $D\cdot2^{k-1}\oplus R=G\cdot Q\oplus R\oplus R=G\cdot Q$，余数必为 0。
- 三题的共同点：每一步只关心"当前最高位的 1"，其余位直接照抄，这正是"模 2"与普通除法的区别——普通除法要试商、要借位，这里只需异或。

### 易错点

- 补零个数用"生成码位数"而不是"位数减 1"，帧会多一位。（讲义 p71 的课件例子对 $1010$ 补了 4 个 0、余数写成 `0100`，与考试题的 "length minus one" 不同；考试按题干给的口径。）
- 异或时借位：模 2 除法里 $0-1=1$，不向前借。
- 余数丢前导 0：3 位余数 `010` 不能写成 `10`；生成码也须对齐到**当前最高位的 1**，不是固定右对齐。
- 把余数写在数据前面，或忘记余数要占满 $k-1$ 位。

### 变体

- 换生成码：$1101$ 四位则补 3 个 0（HW1 Q8），$1011$ 同理；位数规则永远照步骤 1。
- 给多项式 $G(x)=x^3+x+1$：系数即 `1011`，次数 3 就是补零个数。
- 问接收端：给一帧问是否出错，整帧除以生成码，余数非 0 即检出错误；CRC 同样不能定位错位。
- 数据很长时改用"移位寄存器"逐位推进，结果与竖式完全一致。

## 题型 3.4 IEEE 754 32 位浮点

### 识别特征

题干出现 "IEEE 754"、"single-precision"、"32-bit binary"、"biased exponent"，要求把十进制写成位串或十六进制，或把 `0x...` 还原成十进制。32 位与自定义 16 位的位域对比见本文件 3.5 节的图 3-1。

### 原题

(a) 2025s Q8（前言与第 (1) 问）：

> 8. (10 points) The IEEE 754 standard specifies a 32-bit binary as having: 1 bit Sign; 8 bits Exponent width; 24 bits (23 explicitly stored) Mantissa precision. The sign bit determines the sign of the number, which is the sign of the mantissa as well. The exponent is an 8-bit unsigned integer from 0 to 255, in biased form: an exponent value of 127 represents the actual zero. Exponents range from -126 to +127 because exponents of -127 (all 0s) and +128 (all 1s) are reserved for special numbers. The true mantissa includes 23 fraction bits to the right of the binary point and an implicit leading bit (to the left of the binary point) with value 1, unless the exponent is stored with all zeros. Thus only 23 fraction bits of the mantissa appear in the memory format, but the total precision is 24 bits. The bits are laid out as shown in Figure 10: The real value assumed by a given 32-bit binary data with a given sign, biased exponent (the 8-bit unsigned integer), and a 23-bit mantissa is
>
> $$(-1)^{b_{31}}\times2^{(b_{30}b_{29}\cdots b_{23})_2-127}\times(1.b_{22}b_{21}\cdots b_0)_2.$$
>
> (1) (4 points) Convert the decimal number $8.75_{10}$ to IEEE 754 standard 32-bit binary. Show your work;

(b) HW1 Q5(c)(d)：

> (c) Convert $(-45.375)_{10}$ to IEEE 754 single-precision format.
> (d) Decode the IEEE 754 single-precision pattern 0xC1200000.  Show the sign, exponent, significand, and final decimal value.

### 官方答案

(a) $8.75_{10}=1000.11_2=1.00011\times2^{011}$；$011+1111111=10000010$；`0 10000010 00011000000000000000000`。原文的指数写作 `011`（3 位）。

(b) 作业无答案，以下为自算，已用 `struct` 复核：(c) `0xC2358000`；(d) sign $=1$，exponent 字段 $=10000010_2=130$，真实指数 $130-127=3$，significand $=1.01_2$，真值 $-1.25\times2^3=-10.0$。

### 解题步骤

1. **绝对值转二进制** —— 整数部分连除取余，小数部分连乘取整，见 01 文件。
2. **规格化** —— 小数点左移到最高位 1 之后，写成 $1.F\times2^{E}$；$E$ 是移动的位数，左移为正、右移为负。
3. **填符号** —— 负数 $S=1$，正数 $S=0$；符号位只管正负，不参与数值。
4. **填指数** —— 存 $E+127$ 的 8 位二进制，不足 8 位左补 0。
5. **填尾数** —— 小数点后的位照抄，右补 0 到 23 位；超过 23 位时四舍五入。
6. **解码反向** —— 拆 1/8/23，$E=$ 指数字段 $-127$，尾数补回隐含的 1，再算 $(-1)^S\times1.F\times2^{E}$。

### 答案复盘

- (a) 官方第一句同时完成步骤 1 与 2：$8.75=1000.11_2$，小数点左移 3 位得 $1.00011\times2^3$。官方把指数写成 `011`（3 位），是为了让 `011 + 1111111` 这个加法看起来对齐 7 位；真正的字段必须是 8 位 `00000011`，答案里的 `10000010` 才是 8 位。第二句 `011 + 1111111 = 10000010` 就是步骤 4 的 $E+127=3+127=130$。注意加的是 127 而不是 128，这就是 bias 的定义 $2^{8-1}-1$。
- 第三句拼接：符号 `0`（步骤 3）、指数 `10000010`（步骤 4）、尾数 `00011` 后补 18 个 0 共 23 位（步骤 5）。核对位数：$1+8+23=32$。
- (b)(c) $-45.375$：$45=101101_2$，$0.375=0.011_2$，故 $45.375=101101.011_2=1.01101011\times2^5$；指数 $5+127=132=10000100_2$；符号 1。拼接 $1\,10000100\,01101011000000000000000$，四位一组写成 `C2 35 80 00`。这里能看出步骤 5 为什么必须补零：$01101011$ 只有 8 位，还差 15 个 0。
- (b)(d) 解码是编码的逆运算：`0xC1200000` $=1100\,0001\,0010\,0\ldots$，拆成 $1\,10000010\,01000000000000000000000$。指数字段 130，减 bias 得 3；尾数 $010\ldots$ 前补隐含 1 得 $1.01_2=1.25$；$1.25\times2^3=10$，符号为负得 $-10.0$。步骤 6 的三件事——减 bias、补隐含 1、乘 $2^E$——顺序与编码相反。

### 易错点

- 指数忘加 bias，或把 $E-127$ 用在编码方向。
- 尾数写 24 位（把隐含的 1 也存进去），或只补到 8 位、16 位。
- 小数点移动方向与指数符号搞混：$0.00101$ 要右移 3 位成 $1.01\times2^{-3}$，指数是 $-3$。
- 解码时把尾数当整数读：$010\ldots$ 是小数 $0.25$，不是 2 也不是 512。十六进制分组从左起 4 位一组，`C1200000` 恰有 8 个 hex 数字即 32 位。

### 变体

- 只给十六进制问十进制（HW1 Q5(d)）：先展开成 32 位再走步骤 6。
- 指数全 0 或全 1：那是特殊值（$\pm0$、次正规数、$\pm\infty$、NaN），不套 $1.F$ 公式，按讲义 p62 的约定作答。
- 问可表示范围：最小正规数是 $E=1,F=0$ 时的 $2^{-126}$，最大正规数是 $E=254,F$ 全 1 时的 $(2-2^{-23})\times2^{127}$。

## 题型 3.5 自定义位宽的浮点格式

### 识别特征

题干给一套非 32 位的规格，形如 "1 bit Sign; 4 bits Exponent width; 12 bits (11 explicitly stored) Mantissa"，并交代 bias 与保留值；要求画位域布局、编码或解码。

### 原题

> (2) (4 points) A IEEE 754 customization specifies a 16-bit binary as having: 1 bit Sign; 4 bits Exponent width; 12 bits (11 explicitly stored) Mantissa precision. The sign bit determines the sign of the number. The exponent is a 4-bit unsigned integer from 0 to 15, in the biased form: an exponent value of 7 represents the actual zero. Exponents range from -6 to +7 because exponents of -7 (all 0s) and +8 (all 1s) are reserved for special numbers. The true mantissa includes 11 fraction bits to the right of the binary point and an implicit leading bit (to the left of the binary point) with value 1, unless the exponent is stored with all zeros. Thus only 11 fraction bits of the mantissa appear in the memory format, but the total precision is 12 bits. Sketch the IEEE 754 customization 16-bit binary layout;
> (3) (2 points) Convert the decimal number $8.75_{10}$ to the IEEE 754 customization 16-bit binary. Show your work.

### 官方答案

(2) 官方给出一张位域图（按原图重绘，见下）。

(3) $8.75_{10}=1000.11_2=1.00011\times2^{011}$；$011+111=1010$；`0 1010 00011000000.`

<svg viewBox="0 0 490 145" width="490" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:12px">
  <text x="102" y="18" text-anchor="end" font-style="italic">Sign</text>
  <text x="150" y="18" text-anchor="middle">Exponent (8 bits)</text>
  <text x="336" y="18" text-anchor="middle">Mantissa / fraction (23 bits)</text>
  <rect x="90" y="24" width="12" height="28" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <rect x="102" y="24" width="96" height="28" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <rect x="198" y="24" width="276" height="28" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <text x="96" y="68" text-anchor="middle">31</text>
  <text x="108" y="68" text-anchor="middle">30</text>
  <text x="192" y="68" text-anchor="middle">23</text>
  <text x="204" y="68" text-anchor="middle">22</text>
  <text x="468" y="68" text-anchor="middle">0</text>
  <text x="114" y="84" text-anchor="end" font-style="italic">Sign</text>
  <text x="162" y="84" text-anchor="middle">Exponent (4 bits)</text>
  <text x="342" y="84" text-anchor="middle">Mantissa / fraction (11 bits)</text>
  <rect x="90" y="90" width="24" height="28" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <rect x="114" y="90" width="96" height="28" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <rect x="210" y="90" width="264" height="28" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <text x="102" y="134" text-anchor="middle">15</text>
  <text x="126" y="134" text-anchor="middle">14</text>
  <text x="198" y="134" text-anchor="middle">11</text>
  <text x="222" y="134" text-anchor="middle">10</text>
  <text x="468" y="134" text-anchor="middle">0</text>
</svg>

图 3-1　两种位域按真实比例画：上行是 32 位的 1/8/23，下行是本题自定义的 1/4/11。每行下方的数字即位号，符号恒在最高位。

### 解题步骤

1. **算 bias、定三段宽度** —— $k$ 位指数域，bias $=2^{k-1}-1$；本题 $k=4$，bias $=7$。题干若直接说"exponent value of 7 represents the actual zero"，就用这个 7。三段宽度 $1+4+11=16$；题干说 "12 bits precision"，其中 1 位是隐含的前导 1，字段里只放 11 位。
2. **查可用指数** —— 字段 $0$ 与 $2^k-1$ 被特殊值占用，真实范围是 $-(2^{k-1}-2)\sim+(2^{k-1}-1)$，本题 $-6\sim+7$。
3. **编码** —— 与 32 位完全同流程：规格化、$E+7$ 写成 4 位、尾数右补 0 到 11 位。
4. **核对总位数** —— 三段拼起来必须正好 16 位，多一位或少一位都说明某段宽度用错。

### 答案复盘

- (2) "an exponent value of 7 represents the actual zero" 一句就是上面第 1 步的 bias，即存 $E+7$；"exponents of -7 (all 0s) and +8 (all 1s) are reserved" 是第 2 步的端点，说明 4 位字段只有 $0001\sim1110$ 可用。位域顺序仍是符号、指数、尾数——题目叫 customization，是因为只改宽度、不改布局规则。
- (3) 官方算式与 32 位版本逐项对应：$8.75=1.00011\times2^3$ 不变；差别只在指数 $3+7=10=1010_2$（4 位）与尾数 $00011$ 右补 6 个 0 到 11 位。拼接 $0\,1010\,00011000000$ 共 $1+4+11=16$ 位，写成十六进制是 `0x50C0`。官方把 $8.75$ 的编码直接填进了位域图，等于 (2) 的图兼作了 (3) 的答案；答题时第 (2) 问只需给宽度与位号，第 (3) 问再填值，两问分开写更安全。

> **勘误**：2025s Q8(2) 的官方答案文字写成 "IEEE 754 standard 16-bit binary layout is shown below"，图题也写 "IEEE 754 standard 16-bit binary"。1/4/11 并不是 IEEE 754 的任何标准格式（标准半精度 binary16 是 1/5/10、bias 15），它是本题自定义的。作答时应写 "the customized 16-bit layout"，不要写 standard，否则等于说错格式来源。

### 易错点

- bias 照抄 32 位的 127，而不是 $2^{4-1}-1=7$。
- 把 "12 bits precision" 当成 12 位尾数字段，拼出 17 位。
- 指数写 8 位或 3 位：字段宽度由题目给定，4 位就写 4 位。
- 位号标错：符号在 bit 15，指数在 bit 14 至 11，尾数在 bit 10 至 0。题干已把 $-7$ 与 $+8$ 列为保留值，它们不能被编码。

### 变体

- 换宽度：1/5/10（binary16，bias 15）、1/11/52（binary64，bias 1023），流程不变，只换 $k$ 与补零个数。
- 解自定义格式：$0\,1011\,10000000000$ 中 $E=1011_2-7=4$，$1.1_2=1.5$，值 $1.5\times2^4=24$。
- 无法精确表示的数：$0.1$ 的尾数是无限循环 $1001\ldots$，11 位必须截断或舍入，末位可能与标准答案差 1；作答时注明"截断"或"四舍五入"。

## 自测题

1. BCD 加法：$0110\,1001+0011\,1000$。
2. 判断 $1001\,0100$ 是否为合法 BCD，并说明理由。
3. 给数据 $1100110$ 加偶校验位（放在最高位左侧）。
4. CRC：$D=1101$，$G=1011$，求余数与发送码。
5. 把 $-0.15625$ 写成 IEEE 754 单精度，给出十六进制。
6. 解码自定义 16 位格式（1/4/11，bias 7）：$0\,1011\,10000000000$。

### 自测答案

1. $0001\,0000\,0111$（107）。个位 $1001+1000=1\,0001$ 有进位，低组 $0001+0110=0111$；十位 $0110+0011+1=1010$ 非法，$+0110=1\,0000$（留 $0000$、进位 1）。
2. 合法。两组 $1001$、$0100$ 分别为 9 与 4，都落在 $0000\sim1001$ 内；若问值，是 94。
3. $01100110$。$1100110$ 有 4 个 1，为偶数，偶校验位取 0。
4. 补 3 个 0 得 $1101000$，四步异或后余 `001`，发送码 $1101001$。
5. `0xBE200000`。$-0.15625=1.01_2\times2^{-3}$，$-3+127=124=01111100_2$，尾数 $010\ldots$。
6. $24$。$E=1011_2-7=4$，$1.1_2=1.5$，$1.5\times2^4=24$。
