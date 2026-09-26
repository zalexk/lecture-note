---
course: CSC3001 离散数学
lecture: LN2.1 - Sets
title: 集合 (Sets) — 基本定义、运算、恒等式与罗素悖论
date: 2026-09-07
tags: [CSC3001, Sets, Logic, Foundations]
source: "D:\\University\\CSC3001\\LN2.1 - Sets.pdf"
---

# 集合 (Sets) — 基本定义、运算、恒等式与罗素悖论

本讲是离散数学的"地基"——集合 (set)。从中学数学的角度看,集合只是一堆对象的容器;但从离散数学和整个现代数学的角度看,集合论 (set theory) 是一切数学对象(数、函数、关系、图、…)的共同出发点。所以本讲的目标不只是介绍几个符号,而是把"用集合描述世界"这种思考方式讲清楚,顺便指出这条路走到极端时会撞上罗素悖论 (Russell's Paradox),由此自然引出"公理化集合论"。

## 为什么先讲集合

我们在 LN0 - Introduction 里已经看到,命题逻辑 (propositional logic) 处理的是"真 / 假"这种最抽象的判断。但一旦要描述"一组对象满足某性质"——比如"所有大于 2 的偶数"、"集合 $A$ 中包含集合 $B$ 的全部元素"——我们就需要一个容器来装这些东西。集合就是最基础的容器:它不假设元素之间有任何顺序或结构,纯粹是一袋子"互不相同"的对象。这节课我们就从最朴素的定义出发,一步步把"集合能做什么"和"集合的边界在哪里"都讲清楚。

## 集合的基本定义 (Basic Definitions)

### 集合与元素

**定义**:集合 (set) 是一个**无序的** (unordered) 且元素**互不相同** (distinct) 的对象容器。

$$
S = \{2, 3, 5, 7\} = \{3, 5, 7, 2\}
$$

注意大括号 `{}`、逗号分隔、没有顺序、没有重复。集合里的对象称为这个集合的**元素** (element) 或**成员** (member),我们说 $S$ **包含** (contains) 它的元素。

教材上给了两个小测验,帮助我们理解"什么算集合":

- $S = \{2, 3, 5, 3, 7\}$ —— **不是集合**,因为 $3$ 出现了两次,违反"distinct"。
- $S = \{\, \{a\}, a\}$ —— **是集合**。这里集合的元素可以是另一个集合 ($\{a\}$),甚至可以包含元素自己。

### 经典集合符号

| 符号 | 含义 |
| --- | --- |
| $\mathbb{Z}$ | 全体整数 (integers) |
| $\mathbb{Z}^+$ | 正整数 (positive integers) |
| $\mathbb{Z}^-$ | 负整数 (negative integers) |
| $\mathbb{N}$ | 非负整数 (nonnegative integers) |
| $\mathbb{R}$ | 全体实数 (real numbers) |
| $\mathbb{Q}$ | 全体有理数 (rational numbers) |
| $\mathbb{C}$ | 全体复数 (complex numbers) |

### 用性质定义集合

把所有元素逐个列出来既不方便,有时甚至不可能(比如大于 $-2$ 且小于 $5$ 的实数)。因此常用"集合构造式" (set-builder notation) 来定义集合:

$$
S = \{x \in A \mid P(x)\}
$$

读作"$A$ 中**满足性质** $P$ 的所有元素 $x$ 组成的集合"。竖线 `|` 相当于"使得"(such that)。

例如:
- $S = \{x \in \mathbb{R} \mid -2 < x < 5\}$,即开区间 $(-2, 5)$。
- $S = \{x \mid x \text{ is a prime and } x < 70{,}000{,}000\}$——这里省略了"$x \in$ 哪里",默认由上下文补充。

### 集合的大小

**定义**:集合 $S$ 的**大小** (size),记为 $|S|$,定义为 $S$ 中包含的元素个数。

大小也叫集合的**基数** (cardinality)。如果 $S$ 元素无限多,我们说 $|S| = \infty$ 或具体用 $\aleph_0$、$\mathfrak{c}$ 等基数(这部分 LN 会再讲)。

### 元素与集合的成员关系 (Membership)

集合论里最基本的问题就是:"一个对象是不是某个集合的元素?"我们用两个符号回答:

$$
x \in A \quad \text{(读作 "$x$ is in $A$",即 $x$ 是 $A$ 的元素)}
$$
$$
x \notin A \quad \text{(读作 "$x$ is not in $A$",即 $x$ 不是 $A$ 的元素)}
$$

### 子集、相等、真子集 (Subsets)

教材在一张图里给出了三个最常用的"集合之间"的判定,新手常常混在一起,这里拆开讲。

- $A \subseteq B$ 读作"$A$ 是 $B$ 的**子集**" (subset),当且仅当:对任意 $x \in A$,都有 $x \in B$。也就是说 $A$ 的所有元素都被 $B$ 装下了。
- $A = B$ 读作"$A$ **等于** $B$",当且仅当 $A \subseteq B$ **且** $B \subseteq A$。这是判断"两个集合完全相同"的标准做法:互相包含。
- $A \subset B$ 读作"$A$ 是 $B$ 的**真子集**" (proper subset),当且仅当 $A \subseteq B$ **且** $A \neq B$。换言之,$A$ 在 $B$ 里,但 $B$ 至少还有一个 $A$ 没有的元素。

新手容易混淆的两个符号:`⊆`(子集,允许相等)和 `⊂`(真子集,严格小于)。不同教材记法略有差异,有的书反过来用 $\subset$ 表示"可以是子集"、用 $\subsetneq$ 表示"真子集",要看上下文判断。

## 集合的基本运算 (Operations on Sets)

设 $A, B$ 是某个**全集** (universal set) $U$ 的两个子集(根据上下文 $U$ 可能是 $\mathbb{R}$、$\mathbb{Z}$、…,或某个明确的范围)。全集就是讨论的"宇宙边界",我们讨论的元素都在 $U$ 里。

### 交集 (Intersection) 与并集 (Union)

$$
A \cap B = \{x \in U \mid x \in A \text{ and } x \in B\}
$$
$$
A \cup B = \{x \in U \mid x \in A \text{ or } x \in B\}
$$

直观上,交集是两个集合**重叠**的部分,并集是把两个集合**合并**后的部分。这里"or"是包含性的——$x$ 只要属于 $A$、$B$ 其中之一就属于 $A \cup B$,两者都属也算。

**事实 (Inclusion-Exclusion,容斥原理)**:
$$
|A \cup B| = |A| + |B| - |A \cap B|
$$

直觉:把 $|A|$ 和 $|B|$ 相加时,$A \cap B$ 里的元素被加了两次,所以要减回去一次。容斥是后面计数 (counting) 一讲的基石。

**定义**:如果两个集合的交集是空集,即 $A \cap B = \varnothing$,则称它们**不相交** (disjoint)。

例如奇数集和偶数集在 $\mathbb{Z}$ 上是 disjoint,因为不存在既是奇数又是偶数的整数。

### 补集 (Complement) 与差集 (Difference)

$$
\overline{A} = A^c = \{x \in U \mid x \notin A\}
$$

即"$U$ 中不属于 $A$ 的全部元素"。

例如:取 $U = \mathbb{Z}$,$A$ 是奇数集,则 $\overline{A}$ 就是偶数集。

$$
A - B = \{x \in U \mid x \in A \text{ and } x \notin B\}
$$

即"在 $A$ 中,但不在 $B$ 中"。也叫**集合差** (set difference) 或**相对补** (relative complement)。

**事实**:
$$
A - B = A \cap \overline{B}
$$

把差集翻译成"在 $A$ 中且不在 $B$ 中"就得到这个等价式,后面证明恒等式时会反复用到。

**事实**:如果 $A \subseteq B$,那么 $\overline{B} \subseteq \overline{A}$。即子集关系在取补后**反序**。

### 索引族的并与交 (Indexed Collections)

把并/交推广到任意多个集合,需要给集合编上号 $A_0, A_1, A_2, \dots$:

$$
\bigcup_{i=0}^{n} A_i = \{x \in U \mid x \in A_i \text{ for at least one } i = 0, 1, 2, \dots, n\}
$$
$$
\bigcup_{i=0}^{\infty} A_i = \{x \in U \mid x \in A_i \text{ for at least one nonnegative integer } i\}
$$
$$
\bigcap_{i=0}^{n} A_i = \{x \in U \mid x \in A_i \text{ for all } i = 0, 1, 2, \dots, n\}
$$
$$
\bigcap_{i=0}^{\infty} A_i = \{x \in U \mid x \in A_i \text{ for all nonnegative integers } i\}
$$

关键差别:**并集**是"只要属于某一个就算",**交集**是"必须属于所有才算"。把"for at least one"和"for all"这两个短语记牢,后面许多结论都从这里来。

教材给了一道练习:对每个正整数 $i$,令 $A_i = \{x \in \mathbb{R} \mid -\frac{1}{i} < x < \frac{1}{i}\} = (-\frac{1}{i}, \frac{1}{i})$。
- $A_1 \cup A_2 \cup A_3 = A_3$ (最大的那个包含所有小的)。
- $A_1 \cap A_2 \cap A_3 = A_1$ (最小的那个被所有大的包含)。
- $\bigcup_{i=1}^{\infty} A_i = A_1$ (因为 $A_1$ 已包含所有更小的区间)。
- $\bigcap_{i=1}^{\infty} A_i = \{0\}$ (只有 $0$ 在每个 $A_i$ 里,因为区间越来越小,最后只剩 $0$ 这一点)。

### 集合的划分 (Partitions of Sets)

**定义**:一组非空集合 $\{A_1, A_2, \dots, A_n\}$ 是集合 $A$ 的一个**划分** (partition),当且仅当
1. $A = A_1 \cup A_2 \cup \dots \cup A_n$ (它们并起来刚好是 $A$);
2. $A_1, A_2, \dots, A_n$ 互相**两两不相交** (mutually disjoint / pairwise disjoint)。

也就是说:把 $A$ 切成几块,每块非空、彼此不重叠、并起来是 $A$。

经典例子:把整数集 $\mathbb{Z}$ 按"除以 3 的余数"划分:
- $A_1 = \{x \in \mathbb{Z} \mid x = 3k+1 \text{ for some integer } k\}$
- $A_2 = \{x \in \mathbb{Z} \mid x = 3k+2 \text{ for some integer } k\}$
- $A_3 = \{x \in \mathbb{Z} \mid x = 3k \text{ for some integer } k\}$

则 $\{A_1, A_2, A_3\}$ 是 $\mathbb{Z}$ 的一个划分。后续 LN 会看到,这种"按模 $n$ 分类"的思想在群、环、图着色中反复出现。

### 笛卡尔积 (Cartesian Products)

**定义**:给定两个集合 $A$ 和 $B$,$A$ 和 $B$ 的**笛卡尔积** (Cartesian product) 是所有**有序对** (ordered pair) $(a, b)$ 组成的集合:

$$
A \times B = \{(a, b) \mid a \in A, b \in B\}
$$

注意"有序对"的**顺序很重要**:$(1, 2) \neq (2, 1)$。这是和"集合"最大的区别——集合 $\{1, 2\}$ 和 $\{2, 1\}$ 相同,但有序对 $(1, 2)$ 和 $(2, 1)$ 是两个不同的对象。

例如:设 $A$ 是英文字母集 $\{a, b, c, \dots, x, y, z\}$,$B$ 是数字 $\{0, 1, \dots, 9\}$。
- $A \times A$ 是所有"两个字母的字符串"的集合;
- $B \times B$ 是所有"两个数字的字符串"的集合;
- $A \times B$ 是所有"先字母后数字"的二元组合。

推广到任意多个集合:
$$
A \times B \times C = \{(a, b, c) \mid a \in A \text{ and } b \in B \text{ and } c \in C\}
$$

**事实 (大小)**:
$$
|A \times B| = |A| \cdot |B|
$$

直觉:第一个元素有 $|A|$ 种选法,第二个有 $|B|$ 种,两者独立,所以是乘积。推广到任意 $k$ 个集合:
$$
|A_1 \times A_2 \times \dots \times A_k| = |A_1| \cdot |A_2| \cdots |A_k|
$$

特别地,$\mathbb{R}^3 = \mathbb{R} \times \mathbb{R} \times \mathbb{R}$ 就是三维实向量空间,这就是为什么坐标几何把"点"看成一组有序实数。

## 集合恒等式 (Set Identities)

设 $A, B, C$ 是某个全集 $U$ 的子集。下面这些"集合版"的恒等式和布尔代数 (Boolean algebra) 里的规则一一对应——每个都把集合运算化简成更"原子"的形式。熟练它们,后面证明集合等式会轻松很多。

| 律 | 公式 |
| --- | --- |
| **交换律 (Commutative Law)** | (a) $A \cup B = B \cup A$  &nbsp;&nbsp; (b) $A \cap B = B \cap A$ |
| **结合律 (Associative Law)** | (a) $(A \cup B) \cup C = A \cup (B \cup C)$  &nbsp;&nbsp; (b) $(A \cap B) \cap C = A \cap (B \cap C)$ |
| **分配律 (Distributive Law)** | (a) $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$  &nbsp;&nbsp; (b) $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ |
| **同一律 (Identity Law)** | (a) $A \cup \varnothing = A$  &nbsp;&nbsp; (b) $A \cap U = A$ |
| **补律 (Complement Law)** | (a) $A \cup A^c = U$  &nbsp;&nbsp; (b) $A \cap A^c = \varnothing$ |
| **德摩根律 (De Morgan's Law)** | (a) $\overline{A \cup B} = \overline{A} \cap \overline{B}$  &nbsp;&nbsp; (b) $\overline{A \cap B} = \overline{A} \cup \overline{B}$ |
| **差集律 (Set Difference Law)** | $A - B = A \cap \overline{B}$ |

每条律都对应"用 $U$ / $\varnothing$ / $c$ / $\cup$ / $\cap$ 的最小集合重新表达同一件事"。**德摩根律**尤其重要,它在计算机科学里到处出现——把"非 (A 或 B)"翻译成"非 A 且非 B",把"非 (A 且 B)"翻译成"非 A 或非 B"。

### 用 Venn 图直观理解

Venn 图 (韦恩图) 是把全集画成一个矩形,把每个集合画成一个圆,落在某区域里的元素就属于对应的组合。教材用 De Morgan 律做示范:
- 左边画的是 $\overline{A}$(矩形里 $A$ 圆外),单独一个图;
- 右边画的是 $\overline{B}$(矩形里 $B$ 圆外),单独一个图;
- 下面画的是 $\overline{A \cup B}$(矩形里"$A$ 圆 ∪ $B$ 圆"外)。

三张图阴影**完全一致**——这就"看出来"了 $\overline{A \cup B} = \overline{A} \cap \overline{B}$。Venn 图是给**自己**做直觉检查的工具,正式的证明还是按"集合包含关系"或"代数法"做。

## 如何验证 / 反驳集合恒等式

教材给了一个非常具体的例子,正好教我们"反证 (disproof)"和"代数证 (algebraic proof)"两种风格。我们看
$$
(A - B) \cup (B - C) = A - C \quad \textbf{?}
$$

### Disproof: 用反例

Venn 图法:分别画出左右两边的阴影,看是否一致。这里 LHS 的阴影包含"在 $A$ 中但不在 $B$ 中"加上"在 $B$ 中但不在 $C$ 中";RHS 的阴影是"在 $A$ 中但不在 $C$ 中"。两者**不相等**——具体可以这样造一个反例:

教材上把 Venn 图的 7 个区域标上数字 1–7,然后**在每个区域放一个具体元素**:
- $A = \{1, 2, 4, 5\}$
- $B = \{2, 3, 5, 6\}$
- $C = \{4, 5, 6, 7\}$

数一数 LHS 和 RHS:
- LHS = $(A - B) \cup (B - C) = \{1, 2, 3, 4\}$
- RHS = $A - C = \{1, 2\}$

LHS ≠ RHS,所以等式不成立。这说明:**只要找到一个反例,等式就被推翻**——证明"等式不成立"远比为真的等式写证明容易。

### Algebraic Proof: 用恒等式化简

教材演示了用 De Morgan 律 + 分配律证明
$$
\overline{(A \cup C) \cap (B \cup C)} = \overline{A} \cap \overline{B} \cap \overline{C} \quad \textbf{?}
$$

每一步都标了"用了哪条律":

$$
\begin{aligned}
\overline{(A \cup C) \cap (B \cup C)}
&= \overline{(A \cup C)} \cup \overline{(B \cup C)} && \text{(De Morgan's Law)} \\
&= (\overline{A} \cap \overline{C}) \cup \overline{(B \cup C)} && \text{(De Morgan's Law)} \\
&= (\overline{A} \cap \overline{C}) \cup (\overline{B} \cap \overline{C}) && \text{(De Morgan's Law)} \\
&= (\overline{A} \cup \overline{B}) \cap \overline{C} && \text{(Distributive Law)}
\end{aligned}
$$

注意:三步连续用 De Morgan 律,把"对并集取补"和"对集合取补"一层层剥开;最后用分配律把"$\cap \overline{C}$"提到外面。**代数法的套路是"选一条能让表达式更简单的恒等式,反复迭代"**——和我们在初等代数里化简多项式的方法论一致。

### Proof by Definition: 用元素论证

当集合之间的运算涉及 $\times$ 等更复杂的结构时,代数律可能不够,我们回到定义:

**目标**:证明 $(A \cap B) \times C = (A \times C) \cap (B \times C)$。

教材用"双向包含":要证 $LHS = RHS$,只需证 $LHS \subseteq RHS$ **且** $RHS \subseteq LHS$。

**(1) LHS $\subseteq$ RHS**:
取任意 $(x, y) \in (A \cap B) \times C$,则 $x \in A \cap B$,$y \in C$。
由 $A \cap B \subseteq A$ 得 $x \in A$;由 $A \cap B \subseteq B$ 得 $x \in B$。所以 $(x, y) \in A \times C$ 且 $(x, y) \in B \times C$,即 $(x, y) \in (A \times C) \cap (B \times C)$。

**(2) RHS $\subseteq$ LHS**:
取任意 $(x, y) \in (A \times C) \cap (B \times C)$,则 $(x, y) \in A \times C$ **且** $(x, y) \in B \times C$。
所以 $x \in A$ 且 $x \in B$,即 $x \in A \cap B$;又 $y \in C$。所以 $(x, y) \in (A \cap B) \times C$。

双向包含都给出来了,所以等式成立。**这是离散数学里最常见的证明套路**:把"集合相等"翻译成"双向包含",再把"包含"翻译成"对任意元素做一遍检验"。

## 一些值得做的练习 (Exercises)

教材在最后留了三道集合恒等式让读者**自己判断真假并证明或举反例**:
- $A - (A \cap B) = A - B$? — 真 (用 $A \cap B \subseteq B$ 和差集律即可)。
- $(A \cup B) - C = (A - C) \cup (B - C)$? — 真 (直接展开 + 分配律)。
- $\overline{A \cup B \cup C} = \overline{A} \cap \overline{B} \cap \overline{C}$? — 真 (De Morgan 律两步)。

另一组基于"操作"小节的练习:
1. 设 $A$ 是素数集、$B$ 是偶数集,求 $A \cap B$ 和 $|A \cap B|$。
2. 是否总有 $A \cup B \supseteq A \supseteq A \cap B$?(这里 $\supseteq$ 是"超集",即"包含")。
3. 设 $A$ 是所有 $n$ 位二进制字符串集,$A_i$ 是恰有 $i$ 个 $1$ 的子集。$(A_1, A_2, \dots, A_n)$ 是 $A$ 的划分吗?
4. 是否总有 $A \cap B \times C = A \times C \cap B \times C$? — 注意运算优先级,这里 $(A \cap B) \times C$ 与 $(A \times C) \cap (B \times C)$ 才相等,而 $A \cap (B \times C)$ 是另一回事。
5. 设 $A = \{x, y\}$,求 $|pow(A) \times pow(A)|$。提示:$|pow(A)| = 2^{|A|} = 4$。

## 罗素悖论 (Russell's Paradox) — "集合论的裂缝"

学到这里,大家可能觉得集合论"什么都能装"。但罗素 (Bertrand Russell) 在 1901 年指出:用我们目前学过的"任意写一个集合构造式"的方式,会构造出**自相矛盾**的集合。

教材用集合构造式写出
$$
W := \{S \in \text{Sets} \mid S \notin S\}
$$

即"$W$ 是所有"不包含自己"的集合的集合"。

现在问:**$W$ 在不在 $W$ 里?**

- **假设 $W \in W$**。那么 $W$ 就属于 $W$,而 $W$ 是"不包含自己的集合的集合",所以 $W$ 应该不包含自己,矛盾。
- **假设 $W \notin W$**。那么 $W$ 不属于 $W$,说明 $W$ 是"不包含自己的集合",按 $W$ 的定义,这种集合就**应该**属于 $W$,矛盾。

两条假设都推出矛盾——这就是著名的**罗素悖论**。它告诉我们:**"任意性质都能定义出一个集合"是错的**。比如"所有集合的集合"、"所有不包含自己的集合"这种"过于庞大"的定义,会落入自指的陷阱。

### 用"理发师悖论"帮助理解

教材上插了一张漫画把罗素悖论用生活化版本讲一遍:

- 一个理发师声称:"我给所有**不自己剃头**的人剃头,但我**不**给那些**自己剃头**的人剃头。"
- 问:理发师给不给自己剃头?
- 如果他给自己剃头,那按规矩他就不该给自己剃头——矛盾。
- 如果他不给自己剃头,那按规矩他就应该给自己剃头——矛盾。

本质上和 $W$ 是一回事。罗素悖论在历史上动摇了整个数学基础——直到 ZF 公理化集合论 (Zermelo–Fraenkel Set Theory) 把"什么可以是集合"用一组**公理**严格限制,才把这种自指排除出去。本课程不深入公理细节,只需记住:**不能把"任意满足性质的全体"都默认成集合**。

### 一点延伸:与停机问题的关系

教材最后提了一句:罗素悖论和计算机科学里最著名的**停机问题 (Halting Problem)** 在推理结构上非常相似。停机问题问:"能不能写一个程序 $H$,对任意程序 $P$ 和输入 $I$,在有限时间内正确判断 $P$ 会不会终止?"答案是否定的——证明手法就是"用 $H$ 自己来构造一个会矛盾的对手程序",和我们上面"用 $W$ 自己推出矛盾"是同一套思路:把对象**作用在它自己**身上,自指就会炸出来。

## 总结 (Summary)

这一讲我们搭建了离散数学最底层的语言:

- **基本定义**:集合是无序、不重复的对象容器;元素、子集 (⊆)、真子集 (⊂)、相等 (=)、大小 (|S|)。
- **基本运算**:交集 ($\cap$)、并集 ($\cup$)、补集 ($A^c$)、差集 ($-$,等价于 $A \cap B^c$);以及索引族的并/交、集合的划分、笛卡尔积 ($\times$)。
- **集合恒等式**:交换律、结合律、分配律、同一律、补律、德摩根律、差集律——可以代数化简、可以用 Venn 图直观检查、可以用"双向包含"按定义证。
- **罗素悖论**:任意写出的"集合构造式"不一定真能成为集合;ZF 公理化集合论给出了更严格的安全边界。这提醒我们"看起来很自然的定义"在逻辑上未必自洽。

下一讲 (LN 2.2 / 2.3 等) 会沿着集合论继续往前走——函数 (functions)、关系 (relations)、计数 (counting) 这些更上层的概念,都以今天的集合运算为基础。
