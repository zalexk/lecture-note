---
title: 06 标准形式与逻辑互转
---

# 06 标准形式与逻辑互转

> **真题分布**：M2024 Q4(1)(2)、Q2(4)；M2025s Q4(1)(2)(3)；M2025f Q3(3)、Q7(1)；M2026 Q3(2)、Q7(1)；HW2 Q6　|　**考频**：4/4 年，每年 4–15 分
> **一句话**：把任何写法的表达式翻成「每项都写全所有变量」的标准与或式或标准或与式，并在两种标准式之间按编号集合互换。

## 这个课题在考什么
每年至少一小题，题干固定为 "Convert ... to standard form" 或 "Derive ... in standard form"，4–5 分。判分只看两点：每项是否写全变量，项数是否等于真值表 1（或 0）的行数。

标准形式不是终点：它是卡诺图的输入坐标（07 文件）、译码器与多路选择器的接线依据（10 文件）、NAND/NOR 实现的骨架（08 文件）。标准式错，后面全错。

本文结论均用 Python（sympy `simplify_logic` 与穷举真值表）复核。M2025f 全卷无官方答案，相关小题标注「自算」。

## 必备知识（只看解题要用到的）

| # | 名称 | 定义 | 卷面上怎么用 |
|---|---|---|---|
| B1 | 最小项（minterm）$m_i$ | 含全部 $n$ 个变量的乘积项；第 $i$ 行取 1 写原变量，取 0 写反变量 | 每个 1 行造一项 |
| B2 | 最大项（maxterm）$M_i$ | 含全部 $n$ 个变量的求和项；规则**相反**：取 0 写原变量，取 1 写反变量 | 每个 0 行造一项 |
| B3 | 标准与或式（canonical SOP） | 全部 1 行的最小项之和，记 $\Sigma m(\cdot)$ | 题目要 "standard SOP" |
| B4 | 标准或与式（canonical POS，也称标准和之积式） | 全部 0 行的最大项之积，记 $\Pi M(\cdot)$ | 题目要 "standard POS" |
| B5 | 补全缺变量 | 积项乘 $(X+\bar X)$；和项加 $X\bar X$ | 表达式 → 标准式 |
| B6 | 编号互补 | $M_i=\overline{m_i}$；$\{m\text{ 下标}\}$ 与 $\{M\text{ 下标}\}$ 互补且不交 | SOP ↔ POS |
| B7 | 个数校验 | $\#m+\#M=2^n$ | 交卷前 10 秒查错 |
| B8 | 反函数 | $\bar F=\Sigma m(\text{0 行})$，故 $\overline{\Sigma m(S)}=\Pi M(S)$：编号不变，只换符号 | 求反、互转 |
| B9 | 门级形式 | 与-或-非（AND-OR-Invert, AOI）输出 $=\overline{\text{SOP}}$；NAND-NAND 实现 SOP，NOR-NOR 实现 POS | 见 08 文件 |

本课题只讲最小项/最大项的定义、标准 SOP 与 POS 和真值表的互转；卡诺图化简见 07 文件，代数定理见 05 文件，通用门落地见 08 文件。

## 题型 6.1 由表达式求标准与或式
### 识别特征
题干写 "... to standard sum-of-product (SOP) form(s)"，给的式子带括号或有缺变量的积项。

### 原题
> 4. (15 points)
>
> (1) Convert the following expression to standard sum-of-product(SOP) forms:
> $$(A+C)(BC+AC)$$

### 官方答案
$$\begin{aligned}
&(A+C)(BC+AC)=ABC+AC+BC+AC\\
={}&ABC+A(B+\bar B)C+(A+\bar A)BC\\
={}&ABC+ABC+A\bar BC+ABC+\bar ABC=ABC+A\bar BC+\bar ABC
\end{aligned}$$

### 解题步骤
1. **化成与或式外壳** —— 先把括号全乘开；补变量只能对积项做，对 $(A+C)$ 这种和项无处下手。
2. **逐项点数、补 $(X+\bar X)$** —— $n=3$ 时每项应有 3 个文字，缺几个补几个；缺两个就连乘两个因子（展开 4 项），缺一个只展开 2 项。
3. **去重、按编号自检** —— 用幂等律 $X+X=X$ 合并同一最小项；每项译成下标，个数应等于真值表 1 的行数，本题 $m_3,m_5,m_7$。

### 答案复盘
- 第 1 行是分配律乘开：$(A+C)(BC)=ABC+BC$，$(A+C)(AC)=AC+AC$。末尾两个 $AC$ 不是笔误——$A\cdot AC$ 与 $C\cdot AC$ 都等于 $AC$，重复正是幂等律的表现。
- 第 2 行没有写「$AC$ 乘 $(B+\bar B)$」，而是把 $AC$ 整体换成 $A(B+\bar B)C$：补 $B$ 的同时保留 $C$。这是 B5 最不易写错的形式；$BC$ 同理换成 $(A+\bar A)BC$。第 3 行展开：$ABC$ 出现三次（原有一次 + 两处补变量各产生一次），$A\bar BC$、$\bar ABC$ 各一次，共 5 项，再用 $X+X=X$ 并成 3 项。
- 官方按 $m_7,m_5,m_3$ 降序写，顺序不影响得分；3 项对应 5 个 0 行，即 5 个最大项（见 6.5）。

### 易错点
- 只补「缺一个变量」的项：四变量里 $AB$ 要乘 $(C+\bar C)(D+\bar D)$ 展开成 4 项，常漏成 2 项。
- 把 $(B+\bar B)$ 乘在括号外：$(A+C)(B+\bar B)$ 是错的，必须先乘开成积项。
- 补变量误用 $X\bar X=0$，如把 $AC$ 补成 $AC(B\bar B)$，整项归零。
- 结果留重复项：两个 $ABC$ 相加是「与或式」，不是「标准与或式」，项数也会被判错。

### 变体
**M2026 Q3(2)**（官方答案）：
> (2) (4 points) Please convert the logic expression $A\bar C+\bar ABC$ to standard Sum-of-Product form.

$$A\bar C+\bar ABC=AB\bar C+A\bar B\bar C+\bar ABC$$

$A\bar C$ 覆盖 $m_4,m_6$，补 $B$ 得两项；$\bar ABC$ 已齐变量不动。

**M2025s Q4(3)**（官方答案，四变量）：
> (3) (5 points) Convert $AB+CD+AD$ into the standard Sum Of Products (SOP) form.

$$AB+CD+AD=ABCD+ABC\bar D+AB\bar CD+AB\bar C\bar D+A\bar BCD+\bar ABCD+\bar A\bar BCD+A\bar B\bar CD$$

三项各覆盖 4 行，并集 8 行，故 8 项，$8+8=16$。

## 题型 6.2 由表达式求标准或与式
### 识别特征
题干写 "... to standard product-of-sum (POS) form(s)"；给的通常是和之积，其中某个因子内部还套着乘积，如 $(A+BC)$。

### 原题
> (2) Convert the following expression to standard product-of-sum(POS) forms:
> $$(A+\bar C)(A+BC)$$

### 官方答案
$$\begin{aligned}
&(A+\bar C)(A+BC)=(A+\bar C)(A+B)(A+C)\\
={}&(A+\bar C+B\bar B)(A+B+C\bar C)(A+C+B\bar B)\\
={}&(A+\bar C+B)(A+\bar C+\bar B)(A+B+C)(A+B+\bar C)(A+C+B)(A+C+\bar B)\\
={}&(A+B+\bar C)(A+\bar B+\bar C)(A+B+C)(A+\bar B+C)
\end{aligned}$$

### 解题步骤
1. **拆「和里套积」** —— 用第二分配律 $X+YZ=(X+Y)(X+Z)$ 把 $A+BC$ 拆成 $(A+B)(A+C)$，不拆无法补变量。
2. **标记缺变量并补 $X\bar X$** —— 只做标记，先不展开；和项补「恒为 0 的乘积」，因为 $X+0=X$，与最小项补 $X+\bar X$ 相反。
3. **裂成两个因子、去重并编号** —— 依据 $(X+Y)(X+\bar Y)=X$ 的逆用把每个「和 + 0」裂成两个和；再用 $(X+Y)(X+Y)=X+Y$ 去重，并与 0 行个数对照。

### 答案复盘
- 第 1 行只做一件事：$A+BC=(A+B)(A+C)$。为什么必须做：$(A+BC)$ 里的 $C$ 被 $B$ 乘着，直接加 $\bar C$ 得 $A+BC+\bar C$，那不是最大项。
- 第 2 行给三个因子各补缺的那一个变量：$(A+\bar C)$ 缺 $B$、$(A+B)$ 缺 $C$、$(A+C)$ 缺 $B$，补法是 $+B\bar B$ 而不是 $\times(B+\bar B)$。
- 第 3 行把每个「和 + 0」裂成两个和，如 $(A+\bar C+B\bar B)=(A+\bar C+B)(A+\bar C+\bar B)$，即上面第 3 步。
- 第 4 行是**去重**：$(A+B+\bar C)$ 与 $(A+B+C)$ 各出现两次，并成 4 项。卷面停在 6 项会被判「含重复因子、项数错」。双重校验：四项正是 $M_0,M_1,M_2,M_3$（$A=0$ 的四行）；且 $(A+\bar C)(A+BC)=A+\bar CBC=A$，与「$A=1$ 全为 1」一致。

### 易错点
- 最大项 0/1 规则与最小项相反：$M_6$（行 110）是 $(\bar A+\bar B+C)$，写成 $(\bar A+B+C)$ 就成了 $M_4$。
- 忘了先拆 $A+BC$ 就补变量，得到 $A+BC+D$ 这类非最大项。
- 停在 6 因子中间行不去重（本题官方第 3 行正是 6 项）。
- 项数与 0 行个数不符（本题 4 个 0 行，必须恰好 4 项）。

### 变体
**M2025f Q3(3)**（本卷无答案，自算）：
> (3) (4 points) Please convert the logic expression $(A\bar C+B)(A+C)$ to standard Product-of-Sum (POS) form.

$$\begin{aligned}
(A\bar C+B)(A+C)&=(B+A\bar C)(A+C)=(A+B)(B+\bar C)(A+C)\\
&=(A+B+C)(A+B+\bar C)\cdot(A+B+\bar C)(\bar A+B+\bar C)\cdot(A+B+C)(A+\bar B+C)\\
&=(A+B+C)(A+B+\bar C)(A+\bar B+C)(\bar A+B+\bar C)
\end{aligned}$$

0 行是 $000,001,010,101$，四项，$4+4=8$。因子内部若套三变量积（如 $A+BCD$），要连拆两次。

## 题型 6.3 由真值表写标准与或式
### 识别特征
题干给一张表，接一句 "Derive the logic expression in standard Sum-of-Products form"；也可能先让你列表（6.4），再取式。

### 原题
> 7. (14 points) Given the truth table of a 4-input circuit below:
>
> (1) (4 points) Derive the logic expression in standard Sum-of-Products form.

（行号列为整理时所加，原卷只有 $A\ B\ C\ D\ Y$ 五列。）

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:3px 10px">A</th><th style="border:1px solid #999;padding:3px 10px">B</th><th style="border:1px solid #999;padding:3px 10px">C</th><th style="border:1px solid #999;padding:3px 10px">D</th><th style="border:1px solid #999;padding:3px 10px">Y</th><th style="border:1px solid #999;padding:3px 10px">行号</th></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">2</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">3</td></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">4</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">5</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">6</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">7</td></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">8</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">9</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">10</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">11</td></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">12</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">13</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">14</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">15</td></tr>
</table>

### 官方答案
$$Y=\bar A\bar B\bar CD+\bar A\bar BC\bar D+\bar AB\bar C\bar D+\bar ABC\bar D+\bar AB\bar CD+\bar ABCD+AB\bar C\bar D+AB\bar CD$$

### 解题步骤
1. **补行号** —— $A$ 是最高位，行号 $=8A+4B+2C+D$。
2. **扫出 1 行** —— 本题 8 个：$1,2,4,5,6,7,12,13$。
3. **每行造一个最小项** —— 取 1 写原变量，取 0 写反变量，再用 $+$ 相连。
4. **校验** —— 0 行也 8 个，$8+8=16$；每项必须 4 个文字。

### 答案复盘
- 官方按「表从上往下」记录，顺序 $m_1,m_2,m_4,m_6,m_5,m_7,m_{12},m_{13}$，下标不单调：扫描法不易漏行，代价是难核对。上半表（$A=0$）6 个 1，下半表（$A=1$）只有 2 个 1，失分点几乎都在下半表：$m_8$–$m_{11}$ 连续四个 0，扫到这里容易提前收笔。
- 4 个文字是最小项与普通积项的分界：写成 $\bar B\bar CD$ 会把 $m_1,m_9$ 一起算进来，不是标准式。若另问 POS：0 行 $0,3,8,9,10,11,14,15$ 共 8 项，$8+8=16$，满足 B7。

### 易错点
- 把 $A$ 当最低位，全表编号偏移，整题作废。
- $A=0$ 的行写成 $A$：最小项里 0 必须配反变量。
- 只看上半表，漏 $m_{12},m_{13}$（本题唯一的两个高位 1）。
- 用化简项冒充标准项，如把 $m_4,m_5$ 合成 $\bar AB\bar C$。

### 变体
**M2025f Q7(1)**（本卷无答案，自算）：
> (1) (4 points) Derive the logic expression in stand Sum-of-Products form.

8 行表 $Y=0,1,0,1,0,1,1,0$（行号 0–7），1 行是 $1,3,5,6$：

$$Y=\bar A\bar BC+\bar ABC+A\bar BC+AB\bar C$$

> **勘误**：题干 "stand Sum-of-Products" 是原卷笔误，应为 "standard sum-of-products"，不影响作答。另注意 110 行（$AB\bar C$）为 1，只记 $\Sigma m(1,3,5)$ 就漏了这一项。

## 题型 6.4 表达式 → 真值表 → 标准式 → 最简式
### 识别特征
题干先要 "Develop a truth table"，后面可能追加 "then derive the standard form" 或 "hence find the minimum expression"。

### 原题
> 4. (15 points)
>
> (1) (5 points) Develop a truth table for $ABC+A\bar B\bar C+\bar AB\bar C$.

### 官方答案
（官方只给到真值表；行号列为整理时所加）

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:3px 10px">A</th><th style="border:1px solid #999;padding:3px 10px">B</th><th style="border:1px solid #999;padding:3px 10px">C</th><th style="border:1px solid #999;padding:3px 10px">X</th><th style="border:1px solid #999;padding:3px 10px">行号</th></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">2</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">3</td></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">4</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">5</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">6</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">7</td></tr>
</table>

### 解题步骤
1. **按项覆盖行** —— $ABC$ 只覆盖 111，$A\bar B\bar C$ 只覆盖 100，$\bar AB\bar C$ 只覆盖 010。
2. **填表** —— 被覆盖的行置 1，其余置 0；项数少时比逐行代入快一倍。
3. **抽行验算** —— 全 0 行、全 1 行、每项独占行各代一次原式。
4. **表 → 标准式** —— 1 行取最小项（6.3），0 行取最大项（6.2 的规则）。
5. **标准式 → 最简式** —— 看 1 行是否相邻，能圈则化（07 文件）；不能圈就写「已最简」。

### 答案复盘
- 官方表的 $X$ 列只在 010、100、111 三行为 1，正是三个积项各自独占的行：可见「按项覆盖行」与逐行代入一致，可作自查手段。
- 表序 $ABC$ 从 000 到 111 递增，行号即二进制值，最小项下标可直接从表面读出。
- 后两步原题没问。延伸：标准与或式 $\bar AB\bar C+A\bar B\bar C+ABC=\Sigma m(2,4,7)$；三个 1 互不相邻（$m_2$ 与 $m_4$、$m_7$ 都不同时只差一个变量），卡诺图上只能单独圈，最简式仍为三项——这是「并非所有函数都能化简」的典型例子。
- 若继续要 POS：0 行 $0,1,3,5,6$ 共 5 个，故 $\Pi M(0,1,3,5,6)$，$3+5=8$。

### 易错点
- 只写答案不画表。"Develop a truth table" 是独立得分点。
- 表格行序不按二进制递增，编号整体错位。
- 误以为 $m_2$ 与 $m_3$ 可合并：$m_3$ 是 0，圈 0 只能做 POS。
- 表达式含 XOR 时直接按项覆盖行会出错，应先用 05 的方法展开成与或式。

### 变体
- 四变量版本 16 行，覆盖行法照用（2026 Q7(1) 即此类）。
- 给 POS 壳子（如 $(A+B)(\bar A+C)$）时，第 1 步改为「按因子排除行」：任一变量使因子为 0 的行就是 0 行。
- 末问若是 "hence design the circuit"，接 08 文件的 NAND/NOR 落地。

## 题型 6.5 标准与或式与标准或与式互转
### 识别特征
题干给一个已是标准与或式（或能一步读成最小项集合）的式子，要求 "convert into the standard POS form"，或反向。核心动作是**取补集**。

### 原题
> (2) (5 points) Convert $ABC+A\bar BC+\bar AB\bar C$ into the standard Product Of Sums (POS) form.

### 官方答案
$$\begin{aligned}
&ABC+A\bar BC+\bar AB\bar C=A(BC+\bar BC)+\bar AB\bar C=AC+\bar AB\bar C\\
={}&(AC+\bar A)(AC+B\bar C)\\
={}&(\bar A+A)(\bar A+C)(AC+B)(AC+\bar C)\\
={}&(\bar A+C)(A+B)(B+C)(A+\bar C)(C+\bar C)\\
={}&(\bar A+C+B\bar B)(A+B+C\bar C)(B+C+A\bar A)(A+\bar C+B\bar B)\\
={}&(\bar A+C+B)(\bar A+C+\bar B)(A+B+C)(A+B+\bar C)(B+C+A)(B+C+\bar A)\\
&\quad\cdot(A+\bar C+B)(A+\bar C+\bar B)\\
={}&(\bar A+B+C)(\bar A+\bar B+C)(A+B+C)(A+B+\bar C)(A+\bar B+\bar C)
\end{aligned}$$

### 解题步骤
1. **读成编号集合** —— 逐项确认变量齐全，读出 $S=\{2,5,7\}$。
2. **取补集** —— $\bar S=\{0,\dots,7\}\setminus S=\{0,1,3,4,6\}$，即 POS 的最大项下标。
3. **造最大项** —— 0 写原变量、1 写反变量，求和后相乘。
4. **个数校验** —— $3+5=8=2^3$；不等于 $2^n$ 必有漏项或重复。
5. **要过程分就补变量** —— 用 $X+YZ=(X+Y)(X+Z)$ 拆和项，逐因子补，最后去重（官方那条链）。

### 答案复盘
- 官方前两步先化简：$ABC+A\bar BC=A(BC+\bar BC)=AC$。不是必需，但让因式分解从三项降到两项，链子短一半。
- 第 3 行把「两项之和」改成「两组之和的积」，用 $X+YZ=(X+Y)(X+Z)$ 的逆向：$AC+\bar A=(\bar A+A)(\bar A+C)$，$AC+B\bar C=(AC+B)(AC+\bar C)$。
- 第 4 行继续拆并丢常数：$AC+B=(A+B)(C+B)$，$AC+\bar C=(A+\bar C)(C+\bar C)$；$(\bar A+A)=1$、$(C+\bar C)=1$ 消失。
- 第 5、6 行补变量成 8 个因子，第 7 行去重成 5 项 $M_4,M_6,M_0,M_1,M_3$。
- 互补规则验：1 行 $m_2,m_5,m_7$，补集 $0,1,3,4,6$ 与定稿下标逐一吻合。整条链可整段跳过——原式已是标准 SOP 时，直接取补集即可。

### 易错点
- 把 POS 项数写成 1 的个数（3 项）。POS 数的是 0 行。
- 最大项变量规则反了：$M_5$（行 101）是 $(\bar A+B+\bar C)$。
- 第 6 行 8 个因子不去重，交卷成 8 项。
- 反函数把编号也取了补：$\overline{\Sigma m(S)}=\Pi M(S)$，编号**不变**，只换符号。

### 变体

| 已知 | 求 | 做法 | 例 |
|---|---|---|---|
| $\Sigma m(S)$ | $\Pi M$ | 取补集 | 本题 $3+5=8$ |
| $\Pi M(T)$ | $\Sigma m$ | 取补集 | M2024 Q4(2) 反推得 $m_4$–$m_7$ |
| 表达式 | $\Sigma m$ | 数 1 行 | M2026 Q7(1) $8+8=16$ |
| 表达式 | $\Pi M$ | 数 0 行 | HW2 Q6 $12+4=16$ |
| $F$ | $\bar F$ | 换符号不换编号 | HW3 Q3 的 $8+8=16$ |

M2024 Q4(2) 的 POS 四项 $M_0,M_1,M_2,M_3$，补集 $4,5,6,7$ 正是该函数的 1 行，故 $F=A$。函数若只依赖部分变量（如 $F=A$），标准式仍要写满对应下标，不能少写。

## 题型 6.6 文字规则 → 布尔式 → 真值表 → 标准式
### 识别特征
题干是一段自然语言规则（"runs exactly when ..."、"at least two of ... agree"），要求 (a) 写布尔式 (b) 列表 (c) 写标准 SOP 与 POS。

### 原题
> **Q6** A ventilation controller has four active-high inputs:
>
> $A$ : automatic mode is enabled,　$T$ : temperature is high,
> $S$ : smoke is detected,　$M$ : manual override is active.
>
> The fan output $F$ must obey the following rules:
>
> - Smoke detection forces the fan on, regardless of the other inputs.
> - If smoke is not detected and automatic mode is enabled, the fan runs exactly when the temperature is high.
> - If smoke is not detected and automatic mode is disabled, the fan runs exactly when manual override is active.
>
> (a) Translate the rules directly into a Boolean expression.
> (b) Construct the truth table.
> (c) Derive standard SOP and standard POS representations.

### 官方答案
作业题，官方不提供解答。标准解（已复核）：$F=S+\bar SAT+\bar S\bar AM=S+AT+\bar AM$。

<table style="border-collapse:collapse;text-align:center;font-family:Georgia,serif">
<tr><th style="border:1px solid #999;padding:3px 10px">A</th><th style="border:1px solid #999;padding:3px 10px">T</th><th style="border:1px solid #999;padding:3px 10px">S</th><th style="border:1px solid #999;padding:3px 10px">M</th><th style="border:1px solid #999;padding:3px 10px">F</th><th style="border:1px solid #999;padding:3px 10px">行号</th></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">2</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">3</td></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">4</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">5</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">6</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">7</td></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">8</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">9</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">10</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">11</td></tr>
<tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">12</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">13</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">0</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">14</td></tr><tr><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">1</td><td style="border:1px solid #999;padding:3px 10px">15</td></tr>
</table>

标准与或式（12 项，$\Sigma m(1,2,3,5,6,7,10,11,12,13,14,15)$）：

$$\begin{aligned}
F={}&\bar A\bar T\bar SM+\bar A\bar TS\bar M+\bar A\bar TSM+\bar AT\bar SM+\bar ATS\bar M+\bar ATSM\\
&+A\bar TS\bar M+A\bar TSM+AT\bar S\bar M+AT\bar SM+ATS\bar M+ATSM
\end{aligned}$$

标准或与式（4 项）：$F=(A+T+S+M)(A+\bar T+S+M)(\bar A+T+S+M)(\bar A+T+S+\bar M)$，即 $M_0,M_4,M_8,M_9$。

### 解题步骤
1. **给变量定序** —— 按题干顺序 $A,T,S,M$，全表统一。
2. **一条规则一个积项** —— 条件用 AND 串起来；"regardless of" 表示该变量不出现在项里；"exactly when $X$" 表示 $F=X$。各规则之间是「或」，直接 $+$。
3. **先化简再列表** —— 用 $X+\bar XY=X+Y$ 提出公因子。
4. **填表并取式** —— 16 行代入最简式；1 行取最小项，0 行取最大项。

### 答案复盘
- 第 1 条 "regardless of the other inputs" 对应单项 $S$，不能写成 $S(A+T+M)$：那句话是其余三变量任意，$S$ 已覆盖 8 行。
- 第 2 条前提给 $\bar SA$，结论 "exactly when" 给 $F=T$，合起来 $\bar SAT$；第 3 条同理 $\bar S\bar AM$。三条相加得 $F=S+\bar SAT+\bar S\bar AM$。
- 化简用消去律：$F=S+\bar S(AT+\bar AM)=S+AT+\bar AM$，每行只看三个乘积即可填表。
- 表中 12 个 1、4 个 0，$12+4=16$，与 POS 四项吻合；四个 0 行都是「该开而没开」：$0000$、$0100$、$1000$、$1001$。

### 易错点
- 把 "regardless of the other inputs" 写成 $S(A+T+M)$，凭空多三个变量，标准式项数翻倍。
- 把 "runs exactly when" 读成「只要」，漏掉前提 $\bar S$。
- 变量顺序与表列顺序不一致（题干 $A,T,S,M$，别按 $ABCD$ 习惯排）。
- 12 项漏写：抄写时按行号顺序，抄一项划一行。
- 直接对 12 项做 POS，忘了 POS 数 0 行，写出重复因子。

### 变体
- 「三票中至少两票同意」：$F=AB+AC+BC$，$\Sigma m(3,5,6,7)$，POS 为 $M_0,M_1,M_2,M_4$（章末自测第 4 题）。
- 「$n$ 位里恰好有 $k$ 个 1」：先按组合枚举行号再取式（如 M2024 Q8 的「恰好两个 1」）。
- 追加 "identify every input combination on which it fails" 时，用异或求差集，别逐行肉眼比对。

## 题型 6.7 与-或-非（AOI）与与非/或非写法
### 识别特征
题干写 "write down the logic expression using And-Or-Invert logic"，或 "using only NAND gates" 之前的一步。

### 原题
> (4) If the inputs to an exclusive-NOR function is A and B, write down the logic expression using And-Or-Invert logic.

### 官方答案
$$AB+\bar A\bar B;$$

### 解题步骤
1. **写真值表** —— XNOR 在 $00$、$11$ 为 1，在 $01$、$10$ 为 0。
2. **按 1 行写与或式** —— $AB+\bar A\bar B$；这是函数的与或式，还不是 AOI 形式。
3. **按 0 行写积项再加整体反号** —— AOI 门输出是「或与式之后取反」，故 $Y=\overline{A\bar B+\bar A B}$。
4. **换通用门** —— NAND：$Y=\overline{\overline{AB}\cdot\overline{\bar A\bar B}}$；NOR：$Y=\overline{\overline{A+\bar B}+\overline{\bar A+B}}$（落地见 08 文件）。

<svg viewBox="0 0 300 130" width="300" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif;font-size:13px">
  <path d="M16,33 H90" stroke="#333" stroke-width="1.4" fill="none"/><path d="M16,33 V81 H86.5" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="16" cy="33" r="2.5" fill="#333"/>
  <path d="M16,95 H90" stroke="#333" stroke-width="1.4" fill="none"/><path d="M34,95 V47 H86.5" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="34" cy="95" r="2.5" fill="#333"/>
  <circle cx="86.5" cy="47" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/><circle cx="86.5" cy="81" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <g transform="translate(90,26)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g><g transform="translate(90,74)"><path d="M0,0 H16 A14,14 0 0 1 16,28 H0 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <g transform="translate(170,50)"><path d="M0,3 Q18,3 30,14 Q18,25 0,25 Q7,14 0,3 Z" fill="#fff" stroke="#333" stroke-width="1.4"/></g>
  <path d="M120,40 H155 V56 H170" stroke="#333" stroke-width="1.4" fill="none"/><path d="M120,88 H155 V68 H170" stroke="#333" stroke-width="1.4" fill="none"/>
  <path d="M200,64 H250" stroke="#333" stroke-width="1.4" fill="none"/><circle cx="203.5" cy="64" r="3.5" fill="#fff" stroke="#333" stroke-width="1.4"/>
  <text x="6" y="37" font-style="italic">A</text><text x="6" y="99" font-style="italic">B</text><text x="256" y="68" font-style="italic">Y</text>
</svg>

图 6-1　AOI 门实现 $Y=\overline{A\bar B+\bar A B}$：两个与门各带一个输入气泡，或门输出带气泡，整体等于 XNOR。

### 答案复盘
- 官方答案 $AB+\bar A\bar B$ 是 XNOR 的**与或式**，函数正确，但没有体现 "Invert"：AOI 门输出端自带反相，端口方程必须是「某个 SOP 取反」的样子。
- 它得分的原因是 $\overline{A\bar B+\bar A B}=AB+\bar A\bar B$（德摩根），两式同函数，差别只在有没有写出取反。
- 输入气泡对应 $\bar A$、$\bar B$，输出气泡对应整体取反；三层结构（与-或-非）正对应「SOP 取反」，所以 AOI 只能直接实现「反着的 SOP」。
- 若改为 "using only NAND gates"，从 $AB+\bar A\bar B$ 两次取反即可，规则见 08 文件。

> **勘误**：官方答案只写 $AB+\bar A\bar B$，缺了 "And-Or-Invert" 要求的整体反号。函数没错，形式不完整。考试时两式都写：先写 $Y=\overline{A\bar B+\bar A B}$，再注「等价于 $AB+\bar A\bar B$」。

### 易错点
- 用 1 行写 AOI：$Y=\overline{AB+\bar A\bar B}$ 不是 XNOR——它等于 $A\bar B+\bar AB$，正是 XOR。
- 把 $A\bar B+\bar A B$ 当 XNOR：它是 XOR。记法：XNOR 认「相同为 1」，1 行是 $00$ 与 $11$。
- 三变量及以上别套奇偶口诀：三变量 XNOR 是 $\Sigma m(0,3,5,6)$。

### 变体
- 三变量 XNOR 的 AOI 形式：$Y=\overline{\bar A\bar BC+\bar AB\bar C+A\bar B\bar C+ABC}$，括号内是 3 输入 XOR 的四个最小项。
- 给 POS 壳子并要求 "using only NOR gates" 时，先把 POS 两次取反，再按 08 文件逐层换门。

## 章末自测
1. 把 $Y=A\bar B+\bar ABC$ 写成三变量标准与或式。
2. 某三变量函数 $F=\Sigma m(0,2,6)$，写标准或与式并做个数校验。
3. 把 $(A+\bar B)(\bar A+C)$ 化成标准或与式。
4. 「三人表决，至少两人同意输出 1」：写标准与或式与标准或与式。
5. 用 AOI 形式写 $Y=A\oplus B$。
6. 判断：某三变量函数写成 5 个最小项加 4 个最大项，是否可能？

## 自测答案
1. $A\bar B$ 覆盖 $m_4,m_5$，$\bar ABC$ 是 $m_3$，故 $Y=A\bar B\bar C+A\bar BC+\bar ABC$（$m_3,m_4,m_5$）。
2. 0 行是 $1,3,4,5,7$，故 $F=(A+B+\bar C)(A+\bar B+\bar C)(\bar A+B+C)(\bar A+B+\bar C)(\bar A+\bar B+\bar C)$；$3+5=8$。
3. 0 行是 $2,3,4,6$，故 $F=(A+\bar B+C)(A+\bar B+\bar C)(\bar A+B+C)(\bar A+\bar B+C)$；$4+4=8$。
4. $F=AB+AC+BC=\bar ABC+A\bar BC+AB\bar C+ABC$（$m_3,m_5,m_6,m_7$）；POS 为 $(A+B+C)(A+B+\bar C)(A+\bar B+C)(\bar A+B+C)$，即 $M_0,M_1,M_2,M_4$。
5. $\oplus$ 的 0 行是 $01$、$10$，故 $Y=\overline{AB+\bar A\bar B}$（$AB+\bar A\bar B$ 是 XNOR，别混）。
6. 不可能。最小项集合与最大项集合互补，$5+4=9\neq 2^3=8$，必有一项重复或漏写。
