---
title: 99 考前速查
---

# ECE2050 期中 · 一页速查

> 考前最后 20 分钟看这一页。左边是「题目长什么样」，右边是「第一步做什么」。
> 需要完整推导时点回对应章节。

---

## 一、67 个题型压缩成 12 行

| 看到什么 | 归属 | 第一步 | 关键动作 |
|---|---|---|---|
| 换进制、带小数、求最少位数 | 01 | 按权展开，或连除取余倒读 | 小数部分连乘取整，正读 |
| 补码、求负、加减、溢出、乘除 | 02 | 负数先转补码 | 减法改加负数；溢出看「同号相加、结果异号」 |
| BCD、校验位、CRC、IEEE 754 | 03 | 先判合法性（1010–1111 非法） | BCD 和 >9 就 +6；CRC 余数即校验位 |
| 门电路 → 表达式 / 波形 | 04 | 从输出往回推，逐级写 | 波形按时钟刻度对齐，标出延迟错位 |
| 化简、证明、对偶 | 05 | 先找「一项含另一项」→ 吸收律 | 每步写规则名 |
| 标准 SOP / POS、真值表 | 06 | 列真值表 | 每个 1 一项（SOP），每个 0 一因子（POS） |
| 卡诺图、最小化、无关项 | 07 | 画图，先圈大组 | 边界与四角相邻，对角不相邻 |
| 只用 NAND / NOR | 08 | 先化到 SOP / POS | NAND-NAND 实现 SOP，NOR-NOR 实现 POS |
| 全加器、加法器、乘法器 | 09 | 列进位链 | $C_{out}=AB+C_{in}(A\oplus B)$ |
| MUX、译码器、比较器、编码器 | 10 | 定选择端接哪几个变量 | 每对最小项归纳成 $0/1/X/\bar X$ |
| 门延迟、$t_{pd}$、$t_{cd}$、毛刺 | 11 | 枚举所有输入→输出路径 | $t_{pd}$ 取最大，$t_{cd}$ 取最小 |
| Q1 十句判断 | 12 | 找绝对化词 | 举一个反例即可判 F |

---

## 二、公式墙

**数制与编码**

$$N=\sum_i d_i R^i,\qquad \text{unsigned range}=[0,\,2^N-1]$$

$$\text{two's complement range}=[-2^{N-1},\,2^{N-1}-1],\qquad -x=\bar x+1$$

$$\text{fixed point }Q_{a.b}:\quad \text{value}=\frac{\text{code}}{2^b}$$

$$\text{BCD correction:}\quad S>9\ \text{or carry}\ \Rightarrow\ S+6$$

$$\text{even parity bit}=d_1\oplus d_2\oplus\cdots\oplus d_n$$

$$\text{CRC}:\ \text{append }(k-1)\ \text{zeros},\ \text{remainder of mod-2 division}=CRC$$

$$\text{IEEE 754}:\ (-1)^S\times 1.M\times 2^{E-\text{bias}},\quad \text{32-bit bias}=127$$

**布尔与卡诺图**

$$\text{absorption: }X+XY=X,\qquad X+\bar XY=X+Y$$

$$\text{consensus: }XY+\bar XZ+YZ=XY+\bar XZ$$

$$\text{DeMorgan: }\overline{X+Y}=\bar X\bar Y,\qquad \overline{XY}=\bar X+\bar Y$$

$$\#\text{minterms}+\#\text{maxterms}=2^n$$

**模块**

$$\Sigma=A\oplus B\oplus C_{in},\qquad C_{out}=AB+C_{in}(A\oplus B)$$

$$G_i=A_iB_i,\quad P_i=A_i+B_i,\quad C_1=G_0+P_0C_0,\quad C_2=G_1+P_1G_0+P_1P_0C_0$$

$$\text{74HC151}:\ Y=\sum_{i=0}^{7}D_i\,m_i(S_2,S_1,S_0)$$

**时序与电特性**

$$t_{pd}=\max_{\text{paths}}\sum t_p,\qquad t_{cd}=\min_{\text{paths}}\sum t_c$$

$$NM_H=V_{OH}-V_{IH},\qquad NM_L=V_{IL}-V_{OL}$$

$$\text{interface OK}\iff V_{OH}(\text{driver})>V_{IH}(\text{receiver})\ \text{and}\ V_{OL}<V_{IL}$$

---

## 三、十个最常见的扣分点

1. **卡诺图对角线不相邻。** 只有上下、左右、跨边界、四角算相邻。
2. **POS 圈的是 0。** 圈完之后，格子里为 0 的变量取原变量，为 1 的取反——与 SOP 正好相反。
3. **无关项可以弃。** 圈大组时用得上才圈，不能为了「都用上」而把组圈小。
4. **MUX 数据端只有四种可能**：$0$、$1$、$X$、$\bar X$。写出别的形式一定是配对错了。
5. **151 的选择码顺序看接线，不看变量名。** $A$ 接 $S_2$ 才是最高位。
6. **补码减法丢掉最高位进位。** 有进位不代表溢出，溢出只看符号。
7. **标准 POS 的因子数 = 真值表中 0 的个数。** 数不对就重来。
8. **$t_{pd}$ 取最长路径，$t_{cd}$ 取最短路径**，不是同一条路径。
9. **波形题要画内部节点。** 只画最终输出，中间那级延迟就体现不出来。
10. **判断题先找 `all / always / only / never / must`。** 有一个反例就判 F。

---

## 四、90 分钟怎么分配

| 时段 | 任务 | 提醒 |
|---|---|---|
| 0–8 min | Q1 十句判断 | 先做会的，卡住的标记后回 |
| 8–20 min | Q2 简答（数制、编码） | 写过程，别只写答案 |
| 20–45 min | 卡诺图 / 标准形式大题 | 先列真值表再画图，避免连锁错 |
| 45–70 min | 模块实现（MUX、译码器、加法器） | 画图 + 标注引脚，按步骤给分 |
| 70–85 min | 时序 / 波形 | 路径枚举表写出来 |
| 85–90 min | 检查 | 重点查勘误表里那几处易误读 |

---

> 完整推导见 [00-总纲](midterm-00-overview.md) 的索引。
