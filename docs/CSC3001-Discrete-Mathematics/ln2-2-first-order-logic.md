---
course: CSC3001 离散数学
lecture: LN2.2 - First-order logic
title: 一阶逻辑 (First-order Logic) — 量词、否定、多量词次序与带量词的推理规则
date: 2026-09-08
tags: [CSC3001, Logic, First-order Logic, Quantifiers, Predicate Calculus]
source: "D:\\University\\Year 2\\CSC3001\\LN2.2 - First-order logic.pdf"
---

# 一阶逻辑 (First-order Logic) — 量词、否定、多量词次序与带量词的推理规则

上一讲 LN2.1 讲了命题逻辑 (propositional logic),它只处理"对 / 错"这种最粗粒度的判断——把每条复合命题拆成原子命题 ($p, q, r, \ldots$),再用 $\land, \lor, \lnot, \to, \leftrightarrow$ 把它们粘起来。但一旦要表达"对所有整数 $n>2$,方程 $a^n + b^n = c^n$ 没有正整数解"这种数学定理,命题逻辑就不够用了——它没有"对所有"、"存在"这种带"变量"的说话方式。本讲正式引入**一阶逻辑** (First-order Logic, FOL),它给命题逻辑加上"**量词**" (quantifier) 和"**谓词**" (predicate) 两件武器,让逻辑第一次能精确刻画数学定理。

本讲分四条主线展开:量词本身 (量词是什么、量词的真值怎么算) → 量化命题的否定怎么写 → 多个量词嵌套时为什么次序很重要 → 把命题逻辑里学过的推理规则 (modus ponens, modus tollens, …) 推广到带量词的世界。

## 为什么要从命题逻辑升级到一阶逻辑

命题逻辑把每条陈述当成一个不可拆的"整体"——比如"$a^2 + b^2 = c^2$"就是一条命题,真或假,但它内部不再展开。这种视角有两大致命短板:

- 第一,**它表达不了"全称"与"特称"**。你想说"对所有正整数 $n$,$n$ 都有某个性质",命题逻辑只能列出一堆 $P(1), P(2), P(3), \ldots$ 然后用 $\land$ 串起来——但 $n$ 可以是任意大,这个 $\land$ 永远写不完。
- 第二,**它内部没有"结构"**。比如勾股定理"对所有直角三角形, $a^2 + b^2 = c^2$",这里 $a, b, c$ 是变量,我们要说的是"对任意 $a, b, c$ 满足某种关系";命题逻辑没办法把 $a, b, c$ 当作变量处理。

一阶逻辑就是为了解决这两件事:它允许命题里有"带空位的模板"——也就是**谓词** (predicate),然后再用**量词**来声明这些空位应该"对所有"还是"存在"取值。本讲 4 个核心议题就是量词、否定、多量词次序、量化论证的推理规则。

## 谓词 (Predicate) 与论域 (Domain)

### 什么是谓词

谓词 (predicate) 可以理解为"带变量的命题"——也就是把一条命题里的某些具体值挖空,让它变成一个模板,等后面填入具体的值才有真值。例如 $x + 2 = y$ 是一个谓词,常记为 $P(x, y)$。当 $x = 1, y = 3$ 时, $P(1, 3)$ 为真;当 $x = 1, y = 4$ 时, $P(1, 4)$ 为假, 因而 $\lnot P(1, 4)$ 为真。谓词本质上就是"还没填完的命题",一旦把每个空位都填上一个具体的值,它就退化成普通的命题,可以求真值。

注意谓词和命题逻辑里"$p$"的区别: $p$ 已经是 0/1 的真值,谓词 $P(x)$ 是个函数,输入一个值输出 0/1。这是逻辑"颗粒度"上从"词"到"句子模板"的一次升级。

### 论域 (Domain)

因为谓词里有变量,我们就必须**事先声明变量的取值范围**——也就是**论域** (domain),即所有可以填入变量的值的集合。比如 $P(x, y): x + 2 = y$,如果论域是整数,那 $P(1, 3)$ 为真;如果论域是模 5 的有限域,结果又会不同。**一条量化语句的真值,严重依赖论域的选择**——这是整个一阶逻辑里最容易被新手忽视、却贯穿全讲的一条原则。

## 量词 (Quantifier)

量词是用来"声明变量的取值范围"或"声明变量遍历方式"的符号。一阶逻辑有两个基本量词。

### 全称量词 $\forall$ (Universal Quantifier)

符号 $\forall x$ 读作"for all $x$" (对所有 $x$)。它表示"不管 $x$ 在论域里取什么值,后面那条命题都必须为真"。从直觉上, $\forall x \in \mathbb{Z}^+, P(x)$ 等价于把论域展开成一个无穷合取 $P(1) \land P(2) \land P(3) \land \ldots$——只要有一个 $P(c)$ 为假,整条 $\forall$ 语句就为假。

讲义上给了三组例子,值得一一品味。

第一个例子是"$\forall$ 右角三角形, $a^2 + b^2 = c^2$",也就是**勾股定理** (Pythagorean theorem) 本身。这里"右角三角形"是一个谓词, $a, b, c$ 是它的三条边, $a, b$ 是直角边、 $c$ 是斜边。把这句话写成量词形式就是:对所有满足"是直角三角形"的对象 $(a, b, c)$, 都有 $a^2 + b^2 = c^2$。

第二个例子 $\forall x \in \mathbb{Z}, \forall y \in \mathbb{Z}, x + y = y + x$,这是整数加法的**交换律** (commutativity)。

第三个例子最关键——讲义用它来说明"真值依赖论域":$\forall x, x^2 \geq x$。这个命题在整数 $\mathbb{Z}$ 上成立(每个整数的平方都 $\geq$ 它自己,负数更不必说),但在实数 $\mathbb{R}$ 上**不成立**——只要 $x = 0.5$,就有 $0.5^2 = 0.25 < 0.5$。这就提示我们:以后看到 $\forall$ 语句,第一反应应该是"它是在哪个论域上谈的",脱离论域谈真假毫无意义。讲义把这条提示用黄底框标了出来——"The truth of a quantified statement depends on the domain." (量化语句的真值取决于论域)。

### 存在量词 $\exists$ (Existential Quantifier)

符号 $\exists y$ 读作"there exists some $y$" (存在某个 $y$)。它表示"在论域里至少能找到一个值,使得后面那条命题为真"。从直觉上, $\exists y \in \mathbb{Z}^+, P(y)$ 等价于把论域展开成一个无穷析取 $P(1) \lor P(2) \lor P(3) \lor \ldots$——只要有一个 $P(c)$ 为真,整条 $\exists$ 语句就为真。

讲义上的典型例子是 $\forall x \exists y: x < y$ (对所有 $x$ 都存在 $y$ 比 $x$ 大)。同一个 $\forall \exists$ 命题,在不同论域上真值完全不同:

| 论域 | $\forall x \exists y: x < y$ 真值 | 解释 |
| --- | --- | --- |
| 正整数 $\mathbb{Z}^+$ | T | 取 $y = x+1$ 即可 |
| 整数 $\mathbb{Z}$ | T | 同上 |
| 负整数 $\mathbb{Z}^-$ | F | $x = -1$ 找不到比 $-1$ 还小的整数 |
| 负实数 $\mathbb{R}^-$ | T | $x = -0.5$ 时 $y = -0.25$ 即可 |

这里 $\forall \exists$ 的顺序尤其重要:先 $\forall$ 后 $\exists$,意味着"那个 $y$ 可以依赖于 $x$" (对每个 $x$ 都能找到一个 $y$,至于 $y$ 是不是同一个 $x$ 对应的无所谓)。如果颠倒成 $\exists y \forall x: x < y$,意思就完全变了——它要"存在一个最大的上界 $y$,对所有 $x$ 都成立",这在 $\mathbb{Z}$、 $\mathbb{Z}^+$、 $\mathbb{R}^-$ 上都是假,只对有上界的论域才真。后文会专门讲量词次序,这里先记个印象。

讲义还顺手提了一句 $\exists y \in \mathbb{Z}^+: y = y^2$ 作为" $\exists$ 含义是什么"的小例子:在 $\mathbb{Z}^+$ 里 $y = 1$ 满足 $1 = 1^2$,所以该命题为真——存在量词只要"找到一个"就够。

## 把数学定理翻译成一阶逻辑

量词 + 谓词的真正威力,是能精确表达数学定理。这一节给出三个翻译示例,每一步都遵循"**先抓条件、再抓变量、再抓论域、最后加量词**"的四步法。

### 费马最后定理 (Fermat's Last Theorem)

费马 1637 年猜的:**如果整数 $n > 2$,那么方程 $a^n + b^n = c^n$ 在正整数 $a, b, c$ 中没有解**。这句话翻译成量词形式的关键,是把"没有解"用全称量词 $\forall$ 表达——"对所有 $a, b, c, n$ 满足 $n > 2$,方程都不成立"。

四步翻译:

- **条件**: 方程 $a^n + b^n = c^n$ 不成立,等价于 $a^n + b^n \neq c^n$。
- **变量**: $a, b, c, n$。
- **论域**: $a \in \mathbb{Z}^+, b \in \mathbb{Z}^+, c \in \mathbb{Z}^+, n \in \mathbb{Z}, n > 2$。
- **加量词**: 把所有变量都用 $\forall$ 包起来,得到

$$
\forall a, b, c \in \mathbb{Z}^+, \forall n \in \mathbb{Z}, n > 2 \rightarrow a^n + b^n \neq c^n.
$$

最后整理成逻辑式时,通常把" $n > 2$"也并入条件(写成 $n > 2 \land a^n + b^n \neq c^n$),再用 $\forall$ 统辖整个式子。这个定理之所以有名,是因为 1994 年才被 Andrew Wiles 完全证明——证明的方法 $\neq$ 翻译的方法,翻译是逻辑的事,证明是数学的事。

### 哥德巴赫猜想 (Goldbach's Conjecture)

**每个 $\geq 6$ 的正偶数都能写成两个素数之和**。设 $p, q, n$ 为变量,翻译过程:

- **条件**: $p + q = n$, 其中 $p, q$ 都要是素数。
- **变量**: $p, q, n$。
- **论域**: $p \in \mathbb{Z}, q \in \mathbb{Z}, n \in \mathbb{Z}^+$, $n \geq 6$ 且 $n$ 是偶数;同时 $\text{prime}(p)$, $\text{prime}(q)$。
- **加量词**: $n$ 是"任意给定的大偶数", 用 $\forall n$; $p, q$ 是"对每个 $n$ 都能找到的"两个素数, 用 $\exists p \exists q$。

$$
\forall n \in \mathbb{Z}^+, (n \geq 6 \land \text{even}(n)) \rightarrow \exists p, q \in \mathbb{Z}, \text{prime}(p) \land \text{prime}(q) \land p + q = n.
$$

注意**量词次序**: 这里的 $\exists p, q$ 必须放在 $\forall n$ 的右边(里面), 表示"对**每个** $n$ 都能找到一对 $(p, q)$", 而不是"存在一对 $(p, q)$ 对所有 $n$ 都成立"——后者是错的, 一对 $(p, q)$ 至多对应一个 $n$。量词次序错了,意思就完全变了。

### 素数 (prime) 怎么写

为了把" $\text{prime}(p)$"展开成纯量词公式,需要用到素数的**定义**:一个大于 1 的自然数 $p$,如果除了 1 和它自己之外没有正因子,就是素数。翻译成公式:

- **条件**: $p \neq a \cdot b$ 或者 $a = 1$ 或者 $a = p$。
- **变量**: $p, a, b$。
- **论域**: $p > 1, a > 1, b > 1, p, a, b \in \mathbb{Z}$。
- **加量词**: 因为是对**所有**可能的 $a, b$,素数应该"对所有 $a, b$ 都不可能分解",所以三个变量都用 $\forall$:

$$
\text{prime}(p) \equiv (p > 1) \land p \in \mathbb{Z} \land \forall a, b \in \mathbb{Z}^+, (p \neq a \cdot b) \lor (a = 1) \lor (a = p).
$$

这只是一个"定义性的展开",实际上很少有人真把 $\text{prime}(p)$ 完全展开——但要点是:**任何看似"基本"的谓词,理论上都能用纯量词 + 基本算术重新定义**。这正是"一阶逻辑 + 自然数算术"能成为整个数学基础的根源。

## 量化语句的否定 (Negation of Quantified Statements)

学过命题逻辑里的德摩根律 (De Morgan's Laws),自然想把它推广到量化语句。答案是**完全能推广**——而且形式非常优美:

$$
\lnot \forall x, P(x) \equiv \exists x, \lnot P(x),
$$

$$
\lnot \exists x, P(x) \equiv \forall x, \lnot P(x).
$$

直觉上:说"不是所有人都喜欢足球",等价于"存在某个人不喜欢足球";说"不存在会飞的植物",等价于"所有植物都不会飞"。前者是"全称"被否定,降级成"存在一个反例";后者是"存在"被否定,升级成"全都满足反面"。讲义把这一对规则称作"广义德摩根律" (generalized De Morgan's Law),它对**任意可数**个变量都成立——这一点的证明思路是:把论域展开成 $1, 2, 3, \ldots$ 然后用普通的德摩根律逐条翻,翻完再合起来即可。

讲义上专门做了两次"翻译练习":

- 句子 1: "Everyone likes football."(所有人都喜欢足球)。把 $\forall x, \text{likes}(x, \text{football})$ 否定,得到 $\exists x, \lnot \text{likes}(x, \text{football})$——"存在某个人不喜欢足球",用中文自然语就是"不是所有人都喜欢足球"。
- 句子 2: "There is a plant that can fly."(存在一种会飞的植物)。把 $\exists x, \text{plant}(x) \land \text{can\_fly}(x)$ 否定,得到 $\forall x, \text{plant}(x) \rightarrow \lnot \text{can\_fly}(x)$——"所有植物都不会飞"。

注意第二条里原命题用了 $\land$ 而不是 $\rightarrow$——这是 $\exists$ 的标准形式:把"是植物"和"会飞"两个谓词并列 $\land$ 起来。$\forall$ 那边则倾向于用 $\rightarrow$: $\forall x, \text{plant}(x) \rightarrow \text{can\_fly}(x)$, 意思是"对所有 $x$, 如果 $x$ 是植物, 那么 $x$ 会飞", 那些"不是植物的 $x$"前提为假, 整个蕴含式自动为真——这种形式避免了对非植物做无意义的断言。

## 量词次序 (Order of Quantifiers)

新手最容易栽跟头的一节:同样是"对所有 ... 都存在 ..."和"存在 ... 对所有 ...",量词次序不同,意思天差地别。

### 杀病毒软件 (Anti-virus Program) 的例子

讲义上用同一组词" $\forall$ 防病毒软件 $\exists$ 病毒"造了两个含义截然不同的句子:

**句子 A: "防病毒软件杀所有计算机病毒" (For every computer virus, there is an anti-virus program that kills it.)**。量词形式是

$$
\forall \text{ virus } v, \exists \text{ antivirus } a, \text{kills}(a, v).
$$

注意 $\forall$ 在外, $\exists$ 在内。这个语义是"每个病毒都能被某个杀软干掉",至于哪个杀软干掉哪个病毒,$\forall$ 外面根本不在乎——MYDOOM 用 Defender, ILOVEYOU 用 Norton, BABLAS 用 ZoneAlarm, 每个病毒都有专属的杀软。这没问题,但代价是——你得买一堆杀软,而且每来一个新病毒还得买新的。

**句子 B: "存在一个杀软能干掉所有病毒" (There is an anti-virus program that kills all computer viruses.)**。量词形式是

$$
\exists \text{ antivirus } a, \forall \text{ virus } v, \text{kills}(a, v).
$$

注意 $\exists$ 在外, $\forall$ 在内。这个语义是"有一个杀软 $a$ 是万能的, 对所有病毒 $v$ 都能干掉"。一个就够, 但**很难做到**, 因为 $\forall v$ 要求 $a$ 对所有病毒都生效, $v$ 取遍整个病毒集, $a$ 没有任何挑选余地, 这是个非常强的承诺。

讲义最后特别强调"Order of quantifiers is very important!"——这是新手最常犯的错:把 $\forall \exists$ 和 $\exists \forall$ 混着用,觉得"反正都满足"。事实上这两条命题在任何非平凡论域上**强弱完全不同**。

### 二维数组 (Array) 的例子

讲义上还有一个更直观的对比。考虑一个 $6 \times 6$ 的表格 $A$ (想象一个 36 格的迷宫, 每格填 0 或 1):

**命题 1: $\forall \text{ column } y, \exists \text{ row } x: A_{x, y} \text{ has a "1"}$** (对每一列, 都存在某一行, 这一格是 1)。意思是"每一列里至少有一个 1", 但**每个列对应的行可以不同**——第二列用的是第 3 行, 第三列用的是第 5 行, 完全可以东一榔头西一棒槌。讲义上举的表格(每列里随便散落着若干 1)就满足这个命题。

**命题 2: $\exists \text{ row } x, \forall \text{ column } y: A_{x, y} \text{ has a "1"}$** (存在某一行, 对所有列, 这一行这一列那格都是 1)。意思是"有那么一行, 整行全是 1"。讲义上举的"全 1 表格"满足;但前面那个"每列至少一个 1"的表格**不满足**——它没有哪一行是全 1 的。

由此可得一个非常重要的逻辑不等式:

$$
\exists x \forall y, P(x, y) \;\Longrightarrow\; \forall y \exists x, P(x, y).
$$

证明思路: $\exists x \forall y, P(x, y)$ 说"存在一个 $x^*$, 对所有 $y$ 都满足",那对任意 $y$,我们都能让 $x = x^*$ 满足 $\exists x$, 所以 $\forall y \exists x, P(x, y)$ 自然成立。反方向**一般不成立**——只有当"那个 $x$"碰巧和 $y$ 无关时, $\forall y \exists x$ 才能升格为 $\exists x \forall y$。

讲义还提了一个附加事实:**两个连续的 $\forall$ 互换次序,语义不变;两个连续的 $\exists$ 互换次序,语义也不变**。这从展开成合取 / 析取就一目了然——合取和析取本身满足交换律和结合律。但 $\forall$ 和 $\exists$ **不可以**互相交换,原因如上。

## 谓词演算的有效性 (Predicate Calculus Validity)

讲义从这一节开始把命题逻辑的"推理有效性"推广到一阶逻辑。回忆命题逻辑里"有效性" (validity) 的定义:**一个论证有效, 当且仅当假设为真时结论一定为真**。在命题逻辑里, 这通常用"重言式" (tautology) 描述, 例如 $(A \to B) \lor (B \to A)$ 不管 $A, B$ 真假如何, 总为真。

到一阶逻辑里, 概念是一样的, 但多了一个维度: **不仅要考虑命题的真值组合, 还要考虑论域的选择**。讲义给的对比表很清晰:

| 逻辑 | "真" 的含义 |
| --- | --- |
| 命题逻辑 | 不管 $A, B$ 的真值如何,式子总为真 |
| 一阶逻辑 | 不管 $x, y, z$ 的论域如何, $P, Q$ 的具体定义如何,式子总为真 |

举两个例子对照:

- 命题逻辑的重言式 $(A \to B) \lor (B \to A)$:无论 $A, B$ 真假, 至少有一个蕴含成立,所以恒真。
- 一阶逻辑的对应例子 $\forall z, [Q(z) \land P(z)] \to [\forall x, Q(x) \land \forall y, P(y)]$:无论 $Q, P$ 是什么谓词, $z, x, y$ 处于什么论域, 这个式子都为真。直觉上,左边说"对所有 $z$, $Q(z) \land P(z)$", 那么 $Q$ 和 $P$ 各自对所有元素都成立, 自然就推出右边。

讲义随后会用具体的反例(第二十七页)和具体的证明(第二十八页)来分别验证**反例构造**与**正例证明**这两种"判断一条一阶规则是否有效"的手法。

## 含量化语句的论证 (Arguments with Quantified Statements)

把命题逻辑的推理规则——modus ponens (肯定前件)、 modus tollens (否定后件)——直接套到量化语句上, 就能得到**全称量词版的推理规则**。讲义列了四条:

### 全称实例化 (Universal Instantiation)

$$
\forall x, P(x) \;\therefore\; P(a).
$$

意思:既然命题对**所有** $x$ 成立, 那对任意具体的 $a$ 也成立。这是把"对所有"展开成"对一个具体值"。

### 全称 modus ponens (Universal Modus Ponens)

$$
\forall x, P(x) \to Q(x), \quad P(a) \;\therefore\; Q(a).
$$

先把全称量化展开成 $P(a) \to Q(a)$, 再和已知 $P(a)$ 一起, 用 modus ponens 得到 $Q(a)$。

### 全称 modus tollens (Universal Modus Tollens)

$$
\forall x, P(x) \to Q(x), \quad \lnot Q(a) \;\therefore\; \lnot P(a).
$$

同样先把全称展开, 再用 modus tollens。

### 全称推广 (Universal Generalization)

$$
A \to R(c) \;\therefore\; A \to \forall x, R(x), \quad \text{provided $c$ is independent of $A$}.
$$

这条最微妙:如果**对任意的** $c$ (只要 $c$ 与 $A$ 无关), 都能从 $A$ 推出 $R(c)$, 那就能从 $A$ 推出 $\forall x, R(x)$。直觉上, $c$ 是个"通用占位符"——它取遍所有可能, 所以等价于 $\forall$。

讲义举的例子: "for any number $c$, if $1 = 1$, then $2c$ is an even number"——这里的 $c$ 是个任意整数, 既然对所有 $c$ 都成立, 就可以推广成 "if $1 = 1$, then for all $x$, $2x$ is an even number"。注意**前提 $A$ (这里是 $1 = 1$) 不能依赖 $c$**, 否则推广会失效——如果 $A$ 自己就含 $c$, 推广后的 $\forall x$ 没法提取。

讲义还特别提醒: "Universal generalization is often difficult to prove", 很多命题 $\forall x$ 没法一步推广, 需要**数学归纳** (mathematical induction) 这种专门工具来"对所有 $n$ 证明"——这是后续章节要讲的方法。

### 一个反例: 为什么" $\forall (P \lor Q) \to \forall P \lor \forall Q$"不是有效规则

讲义给了一条**无效规则**的判定范例, 帮我们练"怎么用反例说明一条规则不是永真的"。

要证伪: $\forall z, [Q(z) \lor P(z)] \to [\forall x, Q(x) \lor \forall y, P(y)]$ 不是有效规则。

策略: 找一个**论域**和**谓词**, 让前提为真而结论为假。

构造: 令论域为整数, $Q(z) = \text{even}(z)$ (偶数), $P(z) = \text{odd}(z)$ (奇数)。

- 前提 $\forall z, Q(z) \lor P(z)$: 每个整数要么偶要么奇, 所以前提为**真**。
- 结论 $\forall x, Q(x) \lor \forall y, P(y)$: 不是所有整数都是偶数 ($\forall x, Q(x)$ 假), 也不是所有整数都是奇数 ($\forall y, P(y)$ 假), 所以结论为**假**。

前提真、结论假, 该规则**不成立**。这是经典的"析取不能从合取里提取"——每个 $z$ 都满足 $Q(z) \lor P(z)$, 但**对同一个 $z$ 来说, 究竟是 $Q$ 还是 $P$ 可能依赖于 $z$**, 不能用一个全局的"全偶"或"全奇"来概括。

### 一个证明: 为什么" $\forall z [Q(z) \land P(z)] \to \forall x Q(x) \land \forall y P(y)$"是有效规则

要证明: $\forall z \in D, [Q(z) \land P(z)] \to [\forall x \in D, Q(x) \land \forall y \in D, P(y)]$ 是一条有效规则。

证明: 假设前提 $\forall z, Q(z) \land P(z)$ 为真, 那么对论域 $D$ 里的任意 $z$, $Q(z) \land P(z)$ 都为真。取 $D$ 里的某个 $c$, 由全称实例化得 $Q(c) \land P(c)$, 因而 $Q(c)$ 为真。但 $c$ 是任取的 (可以是 $D$ 里任意元素), 所以由全称推广得 $\forall x, Q(x)$ 为真。同理 $\forall y, P(y)$ 为真。两者合取即 $\forall x, Q(x) \land \forall y, P(y)$, 也就是结论。QED。

要点是: 这里**合取** $\land$ 可以被拆成两个独立的 $\forall$, 因为合取是"两者同时为真", 所以**对所有 $z$ 都同时为 $Q$ 且为 $P$**, 必然蕴含"对所有 $x$ 都有 $Q$" 且 "对所有 $y$ 都有 $P$"。这一点和上例的"析取"形成对照——析取**不能**这样拆, 因为"每个 $z$ 都满足 $Q \lor P$" 不等价于"全都满足 $Q$ 或全都满足 $P$"。

## 小结 (Summary)

到这里, 整个离散数学的"逻辑"部分就告一段落。讲义做了一页总结, 列出本讲及前面所有逻辑章节的核心能力目标:

- 能把 (量化的) 数学陈述用逻辑公式表达;
- 能用简单的逻辑规则 (德摩根律、逆否等价等) 化简 / 变换公式;
- 对"论证是否有效"、"两个公式是否逻辑等价"这两类问题, 能流利地判定。

学完这一节, 我们就有足够的逻辑工具去做数学证明 (mathematical proof) 了——这正是后续章节的重点。

## 补充: 逻辑的应用与延伸 (Applications & Optional)

讲义最后两页是"应用与可选阅读", 性质比较松散, 但每条都值得在脑子里留个印象。

### 逻辑能做什么

讲义列了三个经典应用领域:

- **逻辑编程** (Logic Programming): 用逻辑公式直接表达"问题是什么", 让求解器自己去找满足公式的赋值。Prolog 是最典型的代表。
- **数据库查询** (Database Querying) 与**数据挖掘** (Data Mining): 关系数据库的 SQL 本质上就是一阶逻辑的一个受限子集 (没有 $\lnot$ 任意嵌套、没有递归)。
- **数字电路** (Digital Circuit): 组合逻辑电路用 $\land, \lor, \lnot$ 直接对应与门、或门、非门, 整个电路就是一个布尔公式。

这三条线提示我们: 一阶逻辑不仅是数学证明的脚手架, 它还能"直接落地"成可执行的程序、查询与硬件——这正是"理论计算机"和"实际计算机"的桥梁。

### 一个有趣的概率题: 两个孩子问题 (Two Children Problem)

讲义上有一条经典的"概率谜题", 和逻辑关系不大, 但作为思考题很有意思:

> 一个家庭有两个孩子, 其中一个是女孩, 问另一个也是女孩的概率是多少? (假设男女出生概率相等, 各 1/2)

直觉上, 很多人会答 1/2——"另一个要么是男要么是女, 各一半"。但答案是 1/3。

推理: 一个家庭有两个孩子, 等可能的样本空间是 $\{BB, BG, GB, GG\}$ 四种 (B = boy, G = girl), 各占 1/4。已知"其中一个是女孩"等价于排除 $BB$, 所以条件样本空间缩成 $\{BG, GB, GG\}$ 三种, 各占 1/3。"另一个也是女孩"只在 $GG$ 这一种里出现, 所以概率是 1/3 而不是 1/2。

这里的反直觉来自"至少一个是女孩"和"一个是女孩"的细微差别——"至少一个"是 $GG, BG, GB$ 三种; "指定某一个"则是 $GG, BG$ 两种 (假设已知是第一个孩子是女孩), 后者答案才是 1/2。题目表述是"其中一个" (at least one), 所以答案是 1/3。

### 哥德尔不完备定理 (Gödel's Incompleteness Theorem) — 可选阅读

讲义最后一节是"More About Logic (Optional)", 简要介绍了**哥德尔不完备定理** (Gödel's Incompleteness Theorem):

> 任何足够强的、一致的形式系统 (即不会推出矛盾), 都不可能同时完备 (即推出所有真命题)。

用讲义的原话: "Gödel proved that there is no perfect logical system." (没有"完美"的逻辑系统)。一个系统要么**不一致** (会推出矛盾, 不可用), 要么**不完备** (有些真命题推不出来, 不全能), 二者必居其一。

这个定理之所以重要, 是因为它从内部证明了数学公理化道路的**根本局限**——你没办法写下一组公理, 然后机械地推出"所有真命题"。哥德尔的证明思路对计算机科学也有深远影响: 它和**停机问题** (Halting Problem) 紧密相关 (讲义上提到见 Note 2.1), 一起揭示了"不是所有问题都有算法可解"——这是整个**可计算性理论** (computability theory) 的起点。
