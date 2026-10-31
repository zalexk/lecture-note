---
title: 02 补码与有符号算术
---

# 02 补码与有符号算术

> **真题分布**：2024 Q3(1)(2)(3)；2025s Q2(2)(3)、Q3(1)；2025f Q3(2)；2026 Q2(2)(3)、Q3(1)；HW1 Q3(c)(d)、Q4、Q5(a)(b)　|　**考频**：4/4 年，每年 7–15 分
> **一句话**：给几串 0/1，问它们代表什么数、四则运算后剩下什么位型、以及结果是否溢出。

## 这个课题在考什么

这一课题只有一条主线：**在固定位宽下，用加法器完成全部四则运算**。所以卷面几乎总同时问三样东西——结果的位型、结果的十进制值、是否溢出。

出题形式固定：一道「三小问 15 分」或「一小问 4 分」。减法考「改写成加负数」，加法考「进位怎么扔、溢出怎么判」，乘法考「符号单独处理」，除法考「减 = 加补码，进位即商位」，2026 另加定点数 $Q_{a.b}$ 与偏移码两问。得分点不在算术本身，而在过程可复核：竖式对齐、进位标出、溢出结论配一句判据，只写答案通常拿一半。

## 必备知识

- 补码（two's complement）的值：$N$ 位 $b_{N-1}\cdots b_0$ 的值 $=-b_{N-1}2^{N-1}+\sum_{i=0}^{N-2}b_i2^i$，最高位权为负。
- 求负（negate）：按位取反（invert）再加 1；等价于「从右往左保留到第一个 1（含），其左各位取反」。
- 表示范围 $-2^{N-1}\sim 2^{N-1}-1$（8 位：$-128\sim+127$），不对称，负数端多一个；容量与位数问题见 01 文件题型 1.5。
- 符号扩展（sign extension）：左端补符号位（负数补 1、正数补 0），值不变。
- 减法：$A-B=A+\bar B+1$；进位输出（carry out）在补码加法里只是「模 $2^N$ 的溢出」，**不是**有符号溢出。有符号溢出（overflow）判据 $C_{out}\oplus C_{N-1}=1$，等价于「两加数同号而和异号」。
- 有符号乘法：符号位单独定，两绝对值做无符号乘法；$n$ 位 $\times$ $n$ 位积最多 $2n$ 位。
- 除法：$\div M$ 等价于反复 $+(-M)$，「够减」的判据是加法器的进位输出为 1。
- 定点数（fixed-point）$Q_{a.b}$：共 $a+b$ 位，$a$ 含符号位；值 $=$ 补码整数 $\div 2^b$，分辨率 $2^{-b}$。偏移码（biased）：值 $=$ 无符号读数 $-B$，没有「符号位」这一概念。

本课题只讲补码、有符号运算、溢出、定点与偏移码；数制互转见 01 文件，编码校验与浮点见 03 文件，加法器电路见 09 文件。

## 题型 2.1 求负、符号扩展与 $N$ 位补码范围

### 识别特征

题干出现 "2's complement of"、"express ... as an 8-bit two's complement number"、"State the decimal range"，或答案里需要一个负数的位型。

### 原题

> (c) State the decimal range of a 12-bit sign/magnitude number.
> (d) State the decimal range of a 12-bit two's-complement number.

（HW1 Q3(c)(d)。同题 (a)(b)(e) 见 01 文件题型 1.5。）

### 官方答案

作业卷面未给答案；以下为参考答案，已用 Python 复核：

> (c) $-2047\sim +2047$;
> (d) $-2048\sim +2047$.

### 解题步骤

1. **判定位权、求负** —— 补码最高位的权是 $-2^{N-1}$，其余位权照常为正；求负即按位取反、加 1，位宽不变，第 $N+1$ 位的进位丢弃。求值先看符号位再累加。
2. **定范围** —— 最小值的位型只有 $100\cdots0$ 一种，最大值的位型只有 $011\cdots1$ 一种，端点由此唯一确定。
3. **符号扩展** —— 位宽变大时左端复制符号位，值不变。

| 值 $x$ | $x$ 的 8 位位型 | 取反 | 加 1 后 $=(-x)$ 的位型 | 校验 |
|---|---|---|---|---|
| $+24$ | 00011000 | 11100111 | 11101000 | $232-256=-24$ |
| $+15$ | 00001111 | 11110000 | 11110001 | $241-256=-15$ |
| $+34$ | 00100010 | 11011101 | 11011110 | $222-256=-34$ |
| $+49$ | 00110001 | 11001110 | 11001111 | $207-256=-49$ |

### 答案复盘

- (c)(d) 是同一条「符号位占一位」规则的两种后果：原码（sign/magnitude）最高位只当符号，数值剩 11 位，上限 $2^{11}-1=2047$；补码最高位当负权 $-2048$，负数端多出一个。（规则：符号位占用一个位型）
- $-2048$ 为什么存在：位型 $1000\,0000\,0000$ 的权值是 $-2^{11}$，其余位全 0；对它求负，取反加一又回到自身——这就是「$-2^{N-1}$ 求负不变」的由来，也是不对称的来源。下面求负表里的数正是 2024 Q3 官方答案中出现的全部操作数（00011000、11110001、11011110 等），练熟这张表等于提前拿到竖式里的加数。

### 易错点

- 只取反不加 1：得到的是 $-x-1$，整段答案偏 1。对 8 位而言 $\bar x=-x-1$。
- 对 $-128$ 求负仍得 $-128$，误判为算错；扩位在右端补 0 也是错的，只能左端补符号位。

### 变体

- 符号扩展：8 位 $-5$（11111011）扩到 16 位是 1111111111111011，值仍为 $-5$。
- 反向问「最少几位」：$-91$ 需 8 位（7 位下限只有 $-64$）；$+127$ 也需 8 位（7 位上限只有 $+63$）。

## 题型 2.2 补码减法：改写成加负数

### 识别特征

题干出现 "Perform the subtraction of the signed numbers"、两个位型之间的减号，或 "Perform each of the following calculations in the 2's complement form"。

### 原题

> 3. (15 points) Perform each of the following calculations in the 2's complement form.
> (1) 01100101 $-$ 11101000;

（2024 Q3(1)。）

### 官方答案

> (1) 01111101 in Figure 1;

<table style="border-collapse:collapse;font-family:Georgia,serif;font-size:15px">
<tr><td style="padding:3px 10px"></td><td style="padding:3px 10px;text-align:right;letter-spacing:2px">01100101</td><td style="padding:3px 10px">Minuend (101)</td></tr>
<tr><td style="padding:3px 10px">+</td><td style="padding:3px 10px;text-align:right;letter-spacing:2px">00011000</td><td style="padding:3px 10px">2's complement of subtrahend (-24)</td></tr>
<tr><td style="padding:3px 10px"></td><td style="padding:3px 10px;text-align:right;letter-spacing:2px;border-top:1.4px solid #333">01111101</td><td style="padding:3px 10px">Difference (125)</td></tr>
</table>

### 解题步骤

1. **译码两个位型、求减数的相反数** —— 01100101 符号位 0，值 $+101$；11101000 符号位 1，值 $232-256=-24$，译码是为了验算与判溢出。对 11101000 取反得 00010111，加 1 得 00011000，即 $+24$，于是 $A-B$ 变成 $A+(-B)$。
2. **8 位对齐相加、丢弃最高位进位** —— 逐位相加，进位写在位上方；两操作数必须同宽，短的一侧左端符号扩展。补码加法是模 $2^N$ 的加法，第 $N+1$ 位不属于结果。
3. **译回十进制并核范围** —— 01111101 符号位 0，值 $+125$，与 $101-(-24)=125$ 一致。

### 答案复盘

- 第一行 "Minuend (101)" 不是得分点，却是自我复核的唯一锚点：后面每个中间结果都要能对上这几个十进制数。
- 00011000 的标注 "2's complement of subtrahend (-24)" 极易误读：括号里的 $-24$ 是**减数本身**的值，00011000 是减数的补码，即 $+24$。读成「对 $-24$ 取补仍是 $-24$」整题方向就反了。（规则：$A-B=A+\bar B+1$）
- 本题没有 "discard carry" 箭头，因为 $101+24=125<256$，第 9 位本来就是 0；2026 Q2(2) 的中间和 $01001010+11001111$ 才多出第 9 位，那时必须丢弃。是否出现进位由中间和是否达到 $2^8$ 决定，不是固定动作。
- 结果符号位 0 与「正 $+$ 正」相符，即无溢出；同理，减法可把 $A$ 与 $-B$ 当两个加数判溢出。

### 易错点

- 忘记加 1：得 01111100 $=124$，差 1。
- 对被减数取补（本末倒置），或把减法写成 $A+\bar B$。
- 先按借位法做二进制减法、再在末尾加 1，两种算法混用。

### 变体

- 2026 Q2(2)：01001010 $-$ 00110001。$74-49=25$；官方写 01001010 $+$ 11001111 $=$ 00011001，答案 25（和 $1\,00011001$ 的第 9 位被略去）。
- 2025s Q2(2)：00001100 $-$ 11110110。
  > **勘误**：官方写 "In this case, 13 − (−10) = 13 + 10 = 23"，与它自己的竖式 $00001100+00001010=00010110$ 矛盾。00001100 是 $12$ 而非 $13$，11110110 是 $-10$，正确答案 $12+10=22=$ 00010110。考试写 $12-(-10)=22$。

## 题型 2.3 补码加法与溢出判定

### 识别特征

"Please add the two's complement binary numbers ... and indicate whether the sum overflows a 6-bit result"：要求给出和，并明确回答溢出与否。

### 原题

> (1) (4 points) Please add the two's complement binary numbers $110001_2$ and $111001_2$ and indicate whether the sum overflows a 6-bit result.

（2026 Q3(1)。）

### 官方答案

> (1) 110001 (-15 in decimal) + 111001 (-7 in decimal) = 1101010.
> Since we're working with 6-bit numbers, we discard the carry out (7th bit).
> 6-bit result: 101010
> both operands are negative and the result is also negative.
> Sum: 101010; Overflow: No

<table style="border-collapse:collapse;font-family:Georgia,serif;font-size:15px;text-align:center">
<tr><td style="padding:3px 10px;text-align:left">位序</td><td style="padding:3px 10px">5</td><td style="padding:3px 10px">4</td><td style="padding:3px 10px">3</td><td style="padding:3px 10px">2</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px;border-left:1.4px solid #333">$C_{out}$</td></tr>
<tr><td style="padding:3px 10px;text-align:left">进位 $C_i$</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px;border-left:1.4px solid #333">1</td></tr>
<tr><td style="padding:3px 10px;text-align:left">$A$</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px;border-left:1.4px solid #333"></td></tr>
<tr><td style="padding:3px 10px;text-align:left">$B$</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">0</td><td style="padding:3px 10px">1</td><td style="padding:3px 10px;border-left:1.4px solid #333"></td></tr>
<tr><td style="padding:3px 10px;text-align:left">和 $S$</td><td style="padding:3px 10px;border-top:1.4px solid #333">1</td><td style="padding:3px 10px;border-top:1.4px solid #333">0</td><td style="padding:3px 10px;border-top:1.4px solid #333">1</td><td style="padding:3px 10px;border-top:1.4px solid #333">0</td><td style="padding:3px 10px;border-top:1.4px solid #333">1</td><td style="padding:3px 10px;border-top:1.4px solid #333">0</td><td style="padding:3px 10px;border-left:1.4px solid #333"></td></tr>
</table>

### 解题步骤

1. **译码、逐位相加并记录进位** —— 6 位补码：$110001=49-64=-15$，$111001=57-64=-7$；每位是「三数之和」，进位左移一位，最高位产生的进位即 $C_{out}$。
2. **丢弃 $C_{out}$、判溢出** —— 保留低 6 位 101010；三条判据任选一条写清：两加数同号而和异号；$C_{out}\oplus C_{N-1}=1$；十进制和超出 $[-2^{N-1},2^{N-1}-1]$。
3. **译回十进制验算** —— $101010=42$，$42-64=-22$，与 $-15-7=-22$ 吻合。

### 答案复盘

- 第二句 "we discard the carry out (7th bit)" 对应上面第 2 步：补码加法是模 $2^6$ 的加法，第 7 位不是结果的位，只说明无符号和达到了 64。
- 第四句只用符号法，措辞值得学：先说两加数都是负、再说和也是负，两个前提缺一不可。符号法失效的场合正是「两加数异号」——那时直接判不溢出。
- 本题 $C_{out}=1$ 且 $C_5=1$：进位被丢弃却没有溢出，说明「丢弃进位」与「溢出」是两件独立的事，判溢出必须看 $C_{out}\oplus C_{N-1}$。$101010$ 按补码读得 $-22$，是最快的自检：位数转换与符号判定一次完成，比任何判据都可靠。

| 8 位算式 | 位型和 | 按补码读 | 十进制真值 | $C_{out}$ / $C_7$ | 溢出 |
|---|---|---|---|---|---|
| $101+106$ | 01100101 $+$ 01101010 $=$ 11001111 | $-49$ | $207$ | $0$ / $1$ | 是 |
| $(-100)+(-50)$ | 10011100 $+$ 11001110 $=$ 01101010 | $+106$ | $-150$ | $1$ / $0$ | 是 |
| $(-64)+(-64)$ | 11000000 $+$ 11000000 $=$ 10000000 | $-128$ | $-128$ | $1$ / $1$ | 否 |

### 易错点

- 把 $C_{out}=1$ 直接当溢出（本题即反例）；也有人在 $C_{out}=0$ 时反而判溢出。
- 丢弃进位后忘记按补码读结果，把 101010 当 42 交卷。
- 卷面写 "Overflow: No" 却给出与之矛盾的进位理由，过程分全失。

### 变体

- 2025f Q3(2)（该卷无答案，以下为自算并复核）：000101 $+$ 011001，6 位。$5+25=30$，和 011110，正 $+$ 正 $=$ 正，$C_{out}=C_5=0$，不溢出。
- HW1 Q4(a)：$(-52)+(-37)$。11001100 $+$ 11011011 $=$ 1 10100111，取低 8 位 10100111 $=-89$，$C_{out}=C_7=1$，不溢出（$-89\in[-128,127]$）。此题常被误判为溢出，理由是「两个负数加起来更负」——判溢出看范围，不看绝对值大小。
- HW1 Q4(b)：$84+(-109)$。01010100 $+$ 10010011 $=$ 11100111 $=-25$，异号相加必不溢出。

## 题型 2.4 有符号乘法：符号单独处理

### 识别特征

"01101010 $\times$ 11110001" 或 "Use the sign rules for signed multiplication"，且要求结果是 $N$ 位补码或声明溢出。

### 原题

> (2) 01101010 $\times$ 11110001;

（2024 Q3(2)，题干同题型 2.2。）

### 官方答案

> (2) 100111001010 in Figure 2;

<table style="border-collapse:collapse;font-family:Georgia,serif;font-size:15px">
<tr><td style="padding:3px 10px">Multiplicand (106)</td><td style="padding:3px 10px;letter-spacing:1px">0000 0110 1010</td></tr>
<tr><td style="padding:3px 10px">2's complement of multiplier (15)</td><td style="padding:3px 10px;letter-spacing:1px">0000 0000 1111</td></tr>
<tr><td style="padding:3px 10px">部分积，乘数 $b_0=1$</td><td style="padding:3px 10px;letter-spacing:1px;border-top:1.4px solid #333">0000 0110 1010</td></tr>
<tr><td style="padding:3px 10px">部分积，$b_1=1$，左移 1</td><td style="padding:3px 10px;letter-spacing:1px">0000 1101 0100</td></tr>
<tr><td style="padding:3px 10px">部分积，$b_2=1$，左移 2</td><td style="padding:3px 10px;letter-spacing:1px">0001 1010 1000</td></tr>
<tr><td style="padding:3px 10px">部分积，$b_3=1$，左移 3</td><td style="padding:3px 10px;letter-spacing:1px">0011 0101 0000</td></tr>
<tr><td style="padding:3px 10px">和 $=$ Final product (1590)</td><td style="padding:3px 10px;letter-spacing:1px;border-top:1.4px solid #333">0110 0011 0110</td></tr>
<tr><td style="padding:3px 10px">取反加一 $=$ 2's complement ($-1590$)</td><td style="padding:3px 10px;letter-spacing:1px">1001 1100 1010</td></tr>
</table>

### 解题步骤

1. **译码、定符号** —— 01101010 $=+106$；11110001 符号位 1，取反加一得 $00001111=15$，故原数为 $-15$。一正一负，积为负。
2. **取绝对值做无符号竖式** —— 只保留 $106$ 与 $15$，按「最小够用的位宽」写竖式；乘数为 1 的第 $k$ 位产生一行为「被乘数左移 $k$ 位」，各行相加。
3. **补符号位、负则取反加一** —— $1590$ 需 11 位，前置 0 成 12 位（目标 16 位则继续补 0）；积为负，再取反加一得 100111001010。

### 答案复盘

- 官方把 11110001 标为 "2's complement of multiplier (-15)"，竖式却写 0001111：先对乘数取补得到 $+15$，再只用数值位。0001111 是 7 位，与 8 位取补的真结果 00001111 差一个前导 0——位宽只影响书写，不影响数值（本表为看清位移统一取 12 位）。（规则：符号单独、绝对值相乘）
- 四行部分积长度相同、逐行左移一位，正是「乘数第 $k$ 位为 1 就加被乘数左移 $k$ 位」。乘数高 3 位为 0 对应三行全 0 被省略：$15=1111$ 只有 4 个有效位。
- "Final product (1590)" 前面那个 0 是符号位，不是数值位：$1590$ 只占 11 位。若把这一步当成「凑够 12 位」而补 1，整题作废。最后一行才是答案。若图省事写成原码式 $1\,11000110110$，按 12 位补码读得 $-458$，不是 $-1590$——这就是必须再取一次补的原因。位宽：$-1590$ 需 12 位；若题目要求 8 位，应回答 overflow。

### 易错点

- 把两个补码直接按无符号相乘：$106\times241=25546$，低 12 位 0011 1100 1010，既不是 $1590$ 也不是 $-1590$。
- 部分积忘记左移（四行都右对齐），四行之和变成 $424$。
- 定好符号后忘记取补，写「符号位 1 $+$ 1590 的位型」，得到原码而非补码。

### 变体

- HW1 Q5(a)：$(-13)\times7$，要求 8 位。$13\times7=91=1011011$，补 0 成 01011011，取反加一得 10100101 $=-91$；$-91\in[-128,127]$，可表示，无溢出。
- 两数同号：积为正，跳过第 5 步；要求 16 位积时末尾做符号扩展（正数补 0、负数补 1）。

## 题型 2.5 恢复余数除法：减 = 加补码

### 识别特征

"Divide the signed number 00011001 by the signed number 00000101"、长竖式，或出现 "Discard carry"、"Add 1 to quotient" 字样。

### 原题

> (3) 01100110 $\div$ 00100010.

（2024 Q3(3)，题干同题型 2.2。）

### 官方答案

> (3) 00000011 in Figure 3.
> （重绘说明：原图左侧 "Discard carry" 指向每行第 9 位，右侧 "Add 1 to quotient" 是商计数。）

<table style="border-collapse:collapse;font-family:Georgia,serif;font-size:15px">
<tr><td style="padding:3px 10px">步</td><td style="padding:3px 10px">$R$</td><td style="padding:3px 10px">$+$ 11011110</td><td style="padding:3px 10px">9 位和</td><td style="padding:3px 10px">保留</td><td style="padding:3px 10px">商</td></tr>
<tr><td style="padding:3px 10px;border-top:1.4px solid #333">0</td><td style="padding:3px 10px;border-top:1.4px solid #333">01100110（102）</td><td style="padding:3px 10px;border-top:1.4px solid #333">—</td><td style="padding:3px 10px;border-top:1.4px solid #333">—</td><td style="padding:3px 10px;border-top:1.4px solid #333">01100110</td><td style="padding:3px 10px;border-top:1.4px solid #333">0000</td></tr>
<tr><td style="padding:3px 10px">1</td><td style="padding:3px 10px">01100110</td><td style="padding:3px 10px">11011110</td><td style="padding:3px 10px">1 01000100</td><td style="padding:3px 10px">01000100</td><td style="padding:3px 10px">0001</td></tr>
<tr><td style="padding:3px 10px">2</td><td style="padding:3px 10px">01000100</td><td style="padding:3px 10px">11011110</td><td style="padding:3px 10px">1 00100010</td><td style="padding:3px 10px">00100010</td><td style="padding:3px 10px">0010</td></tr>
<tr><td style="padding:3px 10px">3</td><td style="padding:3px 10px">00100010</td><td style="padding:3px 10px">11011110</td><td style="padding:3px 10px">1 00000000</td><td style="padding:3px 10px">00000000</td><td style="padding:3px 10px">0011</td></tr>
</table>

> Quotient $=3=$ 0011（图末行和为 0，即余数为 0）。

### 解题步骤

1. **译码、除数取补** —— $102\div34$；两数皆正，商的符号由两符号异或得正。00100010 $\to$ 11011110，即 $-34$；「减 34」换成「加 $-34$」。
2. **逐次相加并读第 9 位** —— 每步 $R\leftarrow R+11011110$。第 9 位为 1 表示 $R\ge34$，够减：丢弃第 9 位、保留低 8 位、商加 1；第 9 位为 0 说明 $R<34$，不够减，把除数加回去（$R\leftarrow R+34$）恢复原值，商不再加，除法停止。
3. **记商与余** —— 成功减法次数即商，停下时的 $R$ 即余数；回代 $M\cdot Q+r=N$。

### 答案复盘

- 为什么「减」写成「加 11011110」：硬件只有加法器，$A-B=A+\bar B+1$；对 00100010 取反加一即 11011110。这也是 74HC283 一类加法器兼做减法器的算术依据（第二个操作数取反、进位输入接 1，见 09 文件）。至于第 9 位为 1 为何等价于「够减」：8 位加法把结果对 256 取模，$R+222\ge256\iff R\ge34$，丢弃进位后剩下的正是 $R-34\ge0$；反之第 9 位为 0，低 8 位是 $R-34$ 的补码（负数）。两种情况下低 8 位都等于 $R-34$，能否使用全看第 9 位。
- 官方每行右侧 "Add 1 to quotient" 是商计数，左侧 "Discard carry" 是模 $2^8$ 的丢弃；三行分别得商 0001、0010、0011。
- 最后一行和为 0，说明整除、余数为 0。位宽上官方图写 "Quotient $=3=$ 0011"（4 位）、答案汇总写 00000011（8 位）：8 位除法的商可达 255，按题干位宽写 8 位最安全；本题三次减法全成功，看不到「恢复」动作，恢复发生在某步不够减时（见变体），必要性在于加法已把 $R$ 改成负数的补码。

### 易错点

- 第 9 位为 0 时不恢复就继续减，负的余数一路带下去，商和余都错。
- 把第 9 位为 1 当成溢出错误，丢掉该步的商加 1。
- 忘记回代「商 $\times$ 除数 $+$ 余数 $=$ 被除数」。

### 变体

- 2025s Q2(3)：00011001 $\div$ 00000101。除数取补 11111011，五次成功后得 0：商 0101 $=5$、余 0（官方 "Quotient is 5 = 0101, remainder is 0"）。
- 需要恢复的场合（自算 26 $\div$ 5）：前四次减完 $R=$ 00000110（6），第五次后 $R=$ 00000001；第 6 步 00000001 $+$ 11111011 $=$ 11111100，无进位（第 9 位 0）$\to$ 不够减，加回 00000101 恢复为 00000001，停止。商 5、余 1，$5\times5+1=26$。
- 移位式恢复余数除法（要求 8 位商时用）：置 $A=0$、$Q=$ 被除数，重复 $n$ 次：$A{:}Q$ 左移一位，$A\leftarrow A-M$；若 $C_{out}=1$ 则 $Q_0=1$，否则 $Q_0=0$ 且 $A\leftarrow A+M$ 恢复。判据与卷面题相同，只是商位改为逐位左移产生。

## 题型 2.6 定点数 $Q_{a.b}$ 的表示

### 识别特征

题干出现 "Qa.b"、"signed 2's complement fixed point number"、"represent -12.25 in Q5.2 format"。

### 原题

> (3) (3 points) “Qa.b” denotes signed 2’s complement fixed point number, where ‘a’ and ‘b’ are integer bits and fractional bits, respectively. Please represent -12.25 in Q5.2 format.

（2026 Q2(3)。）

### 官方答案

> (3) Step 1: Convert the absolute value to binary
> - Absolute value: 12.25
> - Integer part (12): 1100
> - Fractional part (0.25): $0.25\times2=0.5\to0$ (carry 0.5)
> - $0.5\times2=1.0\to1$ (carry 0)
> - So $0.25=0.01$ in binary
> - $12.25=1100.01$ in binary
> Step 2: Represent in Q5.2 format
> - Q5.2 has 5 integer bits $+$ 2 fractional bits $=7$ bits total
> - Need to pad the integer part to 5 bits: 01100.01
> Step 3: Convert to 2's complement for a negative number
> - Positive representation: 0110001
> - 2's complement: 1001110 $+$ 1 $=$ 1001111

### 解题步骤

1. **拆绝对值** —— 整数部分连除取余、小数部分连乘取整；$0.25\to01$，故 $12.25=1100.01_2$。
2. **定总位宽并补齐** —— $a+b$；$a$ 已含符号位，故数值整数部分只剩 $a-1$ 位，整数部分左补到 $a$ 位（补的是符号位 0），小数位不够则在右侧补 0。
3. **去小数点拼成整数，负数再取反加一** —— 去点等价于整体乘 $2^b$：01100.01 $\to$ 0110001；取补得 1001110 $+$ 1 $=$ 1001111。

### 答案复盘

- "Q5.2 has 5 integer bits + 2 fractional bits = 7 bits total" 把 $a$ 的定义写死：答案 7 位，而 1100.01 只有 6 位，补齐靠**左端**补 0——说明 5 个整数位里有一位是符号位。（规则：$a$ 含符号位）
- "01100.01" 保留小数点是对的，但取补前必须去掉小数点：取补是整串按位操作，只对 1100 取补得 0100，0100.01 $\ne-12.25$。"Positive representation: 0110001" 已是缩放后的整数：$0110001_2=49$，$49\div4=12.25$，正是 $Q_{5.2}$ 的定义（位型 $=$ 值 $\times2^2$）。最终 1001111 按 7 位补码读得 $79-128=-49$，$-49\div4=-12.25$；$Q_{5.2}$ 的范围是 $-16\sim15.75$、步长 0.25，$20.5\times4=82>63$ 就不可表示了。

### 易错点

- 把 $a$ 当纯数值位，写成 8 位 00110001。
- 小数位不补足（0.25 只写 1 位），或只对整数部分取补。
- $12.5$ 的小数写成 1 位：$0.5=0.10_2$，两位都要写。

### 变体

- HW1 Q5(b)：$-5.375$ 的 $Q_{4.4}$。$5.375=101.011$，$a=4$ 含符号位，补成 0101.0110，取反加一得 10101010；验算 $-86\div16=-5.375$。
- 反向问法（给位型求值）：$Q_{4.4}$ 的 10101010 $\to$ 补码 $-86\to-86/16=-5.375$。换格式只改标度：$Q_{8.8}$ 步长 $1/256$。

## 题型 2.7 偏移码：值 $=$ 编码 $-$ 偏置

### 识别特征

题干出现 "biased $N$-bit binary number system with bias $B$"、"What decimal value does the binary number ... represent"，并给一个小例子（如 5 位、偏置 15）。

### 原题

> (1) (7 points) In a biased N-bit binary number system with bias B, positive and negative numbers are represented as their value plus the bias B. For example, for 5-bit numbers with a bias of 15, the number 0 is represented as 01111, 1 as 10000, and so forth. Consider a biased 8-bit binary number system with a bias of $63_{10}$. What decimal value does the binary number $10000010_2$ represent?

（2025s Q3(1)。）

### 官方答案

> (1) $10000010_2 = 1\times2^7 + 1\times2^1 = 128+2 = 130$
> $130-63=67$

### 解题步骤

1. **按权展开读无符号值** —— 偏移码没有符号位，最高位的权是 $+2^{N-1}$，故读得 130。
2. **减偏置** —— 值 $=$ 读数 $-B=130-63=67$。
3. **逆运算自检** —— $67+63=130=10000010$，回到原位型。

### 答案复盘

- 官方把两步分两行：第一行只做按权展开（完全不认符号），第二行才减 63。顺序不能颠倒——先减偏置再按权展开没有意义。（规则：值 $=$ 编码 $-B$）
- 题干第二句给了判据：5 位、$B=15$ 时 $0\to01111$、$1\to10000$，即「编码 $=$ 值 $+$ 偏置」。本题 $130-63=67$ 正是它的逆运算，写答案时把 $67+63=130$ 补在边上即可自证。与补码的关系：同一串 10000010 按 8 位补码读是 $130-256=-126$。一般地偏移码值 $=$ 补码值 $+2^N-B$，本题为 $-126+193=67$。只有 $B=2^{N-1}$ 时偏移码才等于「补码符号位取反」，本题 $B=63\ne128$，取反符号位会错得 2；范围则是 $-63\sim192$，0 对应代码 63（00111111）。

### 易错点

- 减 128 而非 63，得 2。
- 按补码读成 $-126$，或按无符号读成 130 就交卷（漏了减偏置）。
- 认为最高位是符号位；偏移码的最高位只是权 $2^{N-1}$，或把题干 5 位 $B=15$ 的例子当成本题偏置。

### 变体

- $B=2^{N-1}$ 时退化为「补码符号位取反」：10000010 $\to$ 值 2。
- 给值求码：$67+63=130=10000010$，即本题的逆向问法；IEEE 754 的 8 位指数用 $B=127$（见 03 文件）。

## 本课题自测

1. 写出 $-37$ 的 8 位补码；把 10110110 分别按补码、按偏移码（$B=63$）读一次。
2. 8 位相加：01110100 + 01101100，给出和、$C_{out}$、$C_7$，并判溢出。
3. 用符号规则算 $(-9)\times6$，写成 8 位补码。
4. 用逐次减法求 $100\div7$ 的商与余数；说明第几步停止、为什么。
5. 写出 $-3.75$ 的 $Q_{3.4}$ 表示（共几位？）；8 位偏移码 $B=31$，编码 11000101 表示什么值？

### 参考答案

1. $37=00100101$，取反加一得 11011011；10110110 按补码读 $182-256=-74$，按偏移码读 $182-63=119$。
2. 和 11100000，$C_{out}=0$、$C_7=1$，$0\oplus1=1$ 故溢出；$116+108=224>127$，且按补码读 11100000 得 $-32$，符号也矛盾。
3. $9\times6=54=110110$，补 0 成 00110110，取反加一得 11001010 $=-54$。
4. 商 14、余 2：连减 14 次后 $R=2$，第 15 次 $2+(-7)<0$（第 9 位为 0），恢复为 2 并停止；$7\times14+2=100$。
5. $3.75=11.11$，$a=3$ 含符号位，补成 011.1100，共 7 位，取反加一得 1000100；验算 $68-128=-60$，$-60/16=-3.75$。偏移码：$197-31=166$，在 $-31\sim224$ 内，合法。
