---
course: CSC3001 离散数学
lecture: LN1 - Propositional logic
title: 命题逻辑（Propositional Logic）— 命题、真值表、DNF/CNF、逻辑等价与有效论证
date: 2026-09-07
tags: [CSC3001, Logic, Propositional Logic, Truth Table, DNF, CNF, Logical Equivalence]
source: "D:\\University\\Year 2\\CSC3001\\LN1 - Propositional logic.pdf"
---

# 命题逻辑（Propositional Logic）— 命题、真值表、DNF/CNF、逻辑等价与有效论证

这一讲的主题是命题逻辑（Propositional Logic），也就是把"陈述句"和它们之间的连接方式变成一套严格的数学语言。它是离散数学、计算理论和软件验证的共同基础。学完之后我们应该能够：判断一个句子是不是命题、读懂真值表、把任意真值表化成一个只用 AND/OR/NOT 的公式、判断两个公式是否逻辑等价、理解蕴含（implication）的真正含义，并能判断一个论证是否有效。

## 为什么需要证明：Pythagorean 定理的两个故事

老师用勾股定理（$a^2 + b^2 = c^2$）作为开场。这条公式我们都很熟悉，但"Familiar?"不一定等于"Obvious"——熟悉不等于显然。要从"看起来对"上升到"严格成立"，必须给出一个数学证明（mathematical proof）。

一个"好的证明"会怎么做：取边长为 $a$、$b$、$c$ 的直角三角形，把四个这样的三角形拼在一个 $c \times c$ 的大正方形里，重新拼成两个 $a \times a$ 与 $b \times b$ 的小正方形。因为拼图前后总面积不变，所以 $c^2 = a^2 + b^2$。这种"剪切-重排"（cut-and-rearrange）的证明直观、漂亮。

但同样是"剪切-重排"思路，幻灯片里给出了一个"坏证明"（bad proof），把面积为 65 的图形剪开后拼成面积为 63 的图形。它的问题在于：拼合处的斜率 $2:5$ 与 $3:8$ 并不相等，所以严格来说图块之间是错位的，并不是真正的"无重叠、无缝隙"重排，于是面积守恒的论证不成立。

这个反例告诉我们：仅凭"看上去拼得上"是不够的。我们需要一个严格的证明系统，让学生不要在数学论证里被"看起来对"骗到。

## Euclid 的办法：公理 + 逻辑

幻灯片引用了欧几里得（Euclid）在公元前 300 年提出的标准做法：先列出 5 条公理（axiom），即"被默认为真"的命题（例如"任意两点可以画一条直线"、"可以以任意点和任意半径画一个圆"等），然后只用逻辑（logic）从公理推出新命题。这个思路是所有数学证明的基础，也是我们接下来要学的命题逻辑要形式化（formalize）的东西。

## 命题（Statement / Proposition）

定义很简单：命题（proposition）就是一个必须有明确真假值的陈述句。真值只有两个——真（True, T）或假（False, F）。

正例："$2 + 2 = 4$"（真）、"$3 \times 3 = 8$"（假）、"787009911 是素数"（要么真要么假）、"今天星期二"（要么对要么错）。

非例："$x + y > 0$"和"$x^2 + y^2 = z^2$"——它们对某些 $x, y$ 成立，对另一些 $x, y$ 不成立。也就是说，它们不是恒为真或恒为假的命题，要看 $x, y$ 取什么值。这种含有变量的句子不是命题（至少不是这一讲意义下的命题）。

记住这个区分后，下面所有讨论都默认"我说的是一个命题"，它的真值是确定的。

## 三个基本逻辑运算符

我们用逻辑运算符（logic operators）把旧命题拼成新命题。三个最基本的：

NOT（否定）记作 $\neg$。$\neg p$ 与 $p$ 相反：$p$ 为 T 时 $\neg p$ 为 F，$p$ 为 F 时 $\neg p$ 为 T。幻灯片给了一个小细节：$\neg p$ 等价于把 $p$ 上方画一条横线（$\overline{p}$），两者是同一种"取反"操作的两种写法。

AND（合取）记作 $\wedge$。$p \wedge q$ 在 $p$ 和 $q$ 都是 T 时为 T，其他情况都为 F。

OR（析取）记作 $\vee$。$p \vee q$ 在 $p$ 和 $q$ 至少有一个为 T 时为 T，只有两者都为 F 时才为 F。注意这是数学上的"或"，是"包含两者都为真"的"或"——和日常英语里"coffee or tea"那种排他含义不同。

这三个真值表（truth table）建议背下来，后面所有推导都依赖它们。

## 复合命题

把多个命题用运算符组合就得到复合命题（compound statement）。例子：设 $p =$ "天气热"，$q =$ "出太阳"。"天气又热又晒"就是 $p \wedge q$；"天气不热但有太阳"是 $\neg p \wedge q$；"既不热也不晒"是 $\neg p \wedge \neg q$。运算符的优先级和一般代数类似：$\neg$ 高于 $\wedge$ 高于 $\vee$，必要时加括号。三个或更多命题的合取/析取也很自然，例如 $\overline{p \wedge q} \vee r$ 就是合法的复合命题。

## 任意运算符都能用 AND/OR/NOT 构造

既然有了 AND、OR、NOT，就能定义更多运算。最常见的两个例子：

异或（exclusive-or, $\oplus$）的真值表是：$p \oplus q$ 在 $p, q$ 不同时为 T，相同时为 F。换句话说，"coffee or tea"这种日常的"二选一"就是异或。

多数函数（Majority）$M(p, q, r)$：当三个输入中至少两个为 T 时输出 T，否则输出 F。这是一个三输入的真值表，有 8 行。

问题来了：怎么系统地把任意一个真值表写成一个公式？幻灯片给了三种"想法"，其中 Idea 1 和 Idea 2 是一对非常通用的方法。

Idea 0：猜（guess and check）。对小型真值表有效，但容易遗漏或写错。

Idea 1：看真值行（look at the true rows）。对每一个输出为 T 的输入组合，把那一行的取值写成一个"只有这一行才能满足"的小合取（conjunction），再把这些合取用 OR 串起来。形式上，对每一行 $(p, q, r) = (v_1, v_2, v_3)$，如果该行输出为 T，就写出合取 $\bigwedge_{i=1}^{3} L_i$，其中 $L_i = p_i$（如果 $v_i = T$）或 $L_i = \neg p_i$（如果 $v_i = F$）。这样得到的公式叫析取范式（disjunctive normal form, DNF），它的特点是"按真值行取 or"。

Idea 2：看假值行（look at the false rows）。换一个角度：对每一个输出为 F 的行，把那一行写成一个"只有这一行才能满足"的小析取（disjunction），再否定这个析取，然后把所有这些否定的析取用 AND 串起来。形式上，每一行写 $\bigvee_{i=1}^{3} M_i$，其中 $M_i = \neg p_i$（如果 $v_i = T$）或 $M_i = p_i$（如果 $v_i = F$），然后取 $\neg$ 得到一个子句（clause），最后把所有子句 AND 起来。得到的公式叫合取范式（conjunctive normal form, CNF），特点是"按假值行取 and of negations"。

两个想法都成立：Idea 1 给出"用真值行造 OR-of-ANDs"；Idea 2 给出"用假值行造 AND-of-(NOT-ORs)"。幻灯片里那个 3 输入 8 行的真值表同时用两种方法化简，得到两个长相不同但真值表完全一样的公式，这是后面要讲的逻辑等价（logical equivalence）。

至此我们已经看到：任何有限输入的逻辑函数，都可以用 AND、OR、NOT 写出来。

## 逻辑等价与德摩根律

逻辑等价（logical equivalence）说的是：两个命题在所有输入下真值表都相同。记号是 $\equiv$。

最常用的一组等价规则就是德摩根律（De Morgan's Laws）：
- $\neg(p \wedge q) \equiv \neg p \vee \neg q$（"不是 p 且 q"等价于"非 p 或非 q"）
- $\neg(p \vee q) \equiv \neg p \wedge \neg q$（"不是 p 或 q"等价于"非 p 且非 q"）

口诀是：把 NOT 往里推一层，同时把 AND/OR 翻转。幻灯片给了一个例子："Tom 同时在足球队和篮球队"——否定它不是"Tom 既不在足球队也不在篮球队"（那意味着两件事都是 F），而是"Tom 不在足球队 或者 不在篮球队"（两件事至少有一件是 F）。后者正确地包含了"Tom 只在足球队而不在篮球队"等情况。

幻灯片列出了 11 条基本逻辑规则，建议熟记：
1. 交换律（commutative）：$p \wedge q \equiv q \wedge p$，$p \vee q \equiv q \vee p$
2. 结合律（associative）：$(p \wedge q) \wedge r \equiv p \wedge (q \wedge r)$，$(p \vee q) \vee r \equiv p \vee (q \vee r)$
3. 分配律（distributive）：$p \wedge (q \vee r) \equiv (p \wedge q) \vee (p \wedge r)$，$p \vee (q \wedge r) \equiv (p \vee q) \wedge (p \vee r)$
4. 同一律（identity）：$p \wedge t \equiv p$，$p \vee c \equiv p$
5. 否定律（negation）：$p \vee \neg p \equiv t$，$p \wedge \neg p \equiv c$
6. 双重否定（double negative）：$\neg(\neg p) \equiv p$
7. 幂等律（idempotent）：$p \wedge p \equiv p$，$p \vee p \equiv p$
8. 普遍界（universal bound）：$p \vee t \equiv t$，$p \wedge c \equiv c$
9. 德摩根律：$\neg(p \wedge q) \equiv \neg p \vee \neg q$，$\neg(p \vee q) \equiv \neg p \wedge \neg q$
10. 吸收律（absorption）：$p \vee (p \wedge q) \equiv p$，$p \wedge (p \vee q) \equiv p$
11. $t$ 和 $c$ 的否定：$\neg t \equiv c$，$\neg c \equiv t$

其中 $t$ 是永真（tautology，即永远为 T），$c$ 是永假（contradiction，即永远为 F）。

一个化简的实例：$\neg(\neg p \wedge q) \wedge (p \vee q)$，先用德摩根把 NOT 推进去得到 $(\neg\neg p \vee \neg q) \wedge (p \vee q)$，再双重否定得 $(p \vee \neg q) \wedge (p \vee q)$，再用分配律得 $p \vee (\neg q \wedge q)$，而 $\neg q \wedge q$ 是永假 $c$，所以化简为 $p$。这个例子也展示了"德摩根律让我们能把 NOT 一直推到最里面"。

## 永真和永假

永真（tautology）是一个永远为 T 的命题，例如 $p \vee \neg p$。永假（contradiction）是一个永远为 F 的命题，例如 $p \wedge \neg p$。判断一个命题是不是永假看上去很简单（把真值表列出来），但当变量多、公式复杂时它就变成一个很难的问题——这就是著名的可满足性问题（satisfiability problem, SAT），是计算理论里最重要的判定问题之一。

## 条件语句：if p then q

条件语句（conditional statement）的形式是"如果 p，那么 q"，记作 $p \rightarrow q$，读作"p 蕴含 q"（p implies q）。其中 $p$ 叫假设（hypothesis），$q$ 叫结论（conclusion）。

真值表是理解的关键：$p \rightarrow q$ 只有在 $p$ 为 T 且 $q$ 为 F 时才为 F，其他三种情况都为 T。这与日常直觉很不一样——尤其要记住 $p$ 为 F 时整个命题恒为 T。幻灯片举了两个例子：

- "如果你 GPA 是 4.0，那么你会拿全额奖学金"。这条语句什么时候是"假"的？只有当你 GPA 真的是 4.0 但没拿到全额奖学金时，它才是"假"的。如果你的 GPA 本来就不到 4.0，承诺的前件没发生，谈不上"违反承诺"，因此原句不是假的。
- "如果今天挂黄色台风信号，那么停课"。同样地，只有挂信号且没停课才算"说错了"。

幻灯片用一条批注提醒："Convention: if we don't say anything wrong, then it is not false, and thus true."——这条约定是数学上"if...then..."的语义基础，平时读数学课本时几乎不会被强调，但它决定了整个真值表的形状。

## 蕴含可以化成 OR

直接用前面学过的 Idea 2（看假值行）就可以把 $p \rightarrow q$ 写出来：唯一使它为假的是 $(p, q) = (T, F)$ 这一行，对应的小析取是 $p \vee \neg q$，取反后变成 $\neg(p \vee \neg q)$，但和真值表对照后我们更喜欢另一种写法：

$$p \rightarrow q \equiv \neg p \vee q$$

意思是"如果 p，那么 q"等价于"要么 p 不成立，要么 q 成立"。这非常贴近自然语言："If you don't give me all your money, then I will fight you."等价于"You give me all your money or I will fight you (or both)."

## 否定条件语句

用上面这个等价，再加上德摩根：

$$\neg(p \rightarrow q) \equiv \neg(\neg p \vee q) \equiv p \wedge \neg q$$

也就是说，"如果 p 那么 q 的否定"是"p 成立而 q 不成立"。这和真值表"只有 (T, F) 那一行是 F"完全一致。直观上：要反驳一个承诺，你必须给出"前件为真、结论为假"的反例。

## 逆否命题

逆否命题（contrapositive）定义：$p \rightarrow q$ 的逆否命题是 $\neg q \rightarrow \neg p$。两者逻辑等价——这一点用上面的等价可以证明：

$$p \rightarrow q \equiv \neg p \vee q \equiv q \vee \neg p \equiv \neg(\neg q) \vee \neg p \equiv \neg q \rightarrow \neg p$$

幻灯片里的例子："如果你开车，那么你不喝酒"的逆否命题是"如果你喝酒，那么你不开车"。

逆否命题在证明里非常好用：有时候直接证 $p \rightarrow q$ 比较难，但证 $\neg q \rightarrow \neg p$ 反而容易。幻灯片给的例子是"如果 $x^2$ 是偶数，那么 $x$ 是偶数"——直接证不好下手，但换成逆否"如果 $x$ 是奇数，那么 $x^2$ 是奇数"就简单很多（奇数 $\times$ 奇数 = 奇数）。

## "if"、"only if" 与"if and only if"

这三个自然语言短语在数学里有非常精确的对应：

- "$R$ if $S$" 表示"如果 $S$ 那么 $R$"，即 $S \rightarrow R$。这时我们也说 $S$ 是 $R$ 的充分条件（sufficient condition）——只要 $S$ 成立就足够让 $R$ 成立。
- "$R$ only if $S$" 表示"如果 $R$ 那么 $S$"，即 $R \rightarrow S$。这时我们说 $S$ 是 $R$ 的必要条件（necessary condition）——没有 $S$ 就不可能有 $R$。
- "$R$ if and only if $S$"（常缩写 iff）表示 $R$ 和 $S$ 互相蕴含，即 $R \rightarrow S$ 和 $S \rightarrow R$ 同时成立，也等价于说两者逻辑等价（$R \equiv S$）。

用真值表来定义：$P \leftrightarrow Q$（iff）在 $(P, Q) = (T, T)$ 和 $(F, F)$ 时为 T，在 $(T, F)$ 和 $(F, T)$ 时为 F。

注意自然语言里"if"和"only if"很容易混。例："You succeed if you work hard."（充分条件，工作努力就够）和"You succeed only if you work hard."（必要条件，不工作努力就不行），后者的强度更高。

幻灯片还给了一个"数学 vs 英语"的提醒：日常生活中"if you don't clean your room, then you can't watch a DVD"听起来像 $\neg C \rightarrow \neg D$，但家长说这话时往往同时意味着"如果你清理了房间，就可以看 DVD"，也就是 $C \rightarrow D$。所以自然语言里的"if"经常同时表达"if"和"only if"，而数学里要明确区分。

## 论证（Argument）

论证（argument）是一串命题，前面那些叫假设或前提（assumption / hypothesis），最后一个叫结论（conclusion）。论证有效（valid）当且仅当：所有假设都为 T 时，结论也必须为 T。注意"有效"只关心"前提真则结论必真"这件事，和前提或结论在现实世界是否为真无关——这叫"valid argument"和"true conclusion"是两件事。

幻灯片给的例子是 Euclid 的公理系统：5 条公理全部为 T 时，由它们推出的"Pythagorean 定理"在推理上必须为 T。

## Modus Ponens（肯定前件）

最经典的论证规则是 modus ponens（拉丁语，意为"肯定法"）：

$$p \rightarrow q, \quad p \quad \therefore \quad q$$

直觉：如果"如果 p 那么 q"为真，并且 p 也为真，那么 q 必须为真。例："如果挂台风就停课，今天挂台风了，所以停课。"

## Modus Tollens（否定后件）

另一个常用规则是 modus tollens（"否定法"）：

$$p \rightarrow q, \quad \neg q \quad \therefore \quad \neg p$$

直觉：如果"如果 p 那么 q"为真，但 q 没发生，那么 p 一定也没发生。例："如果挂台风就停课，今天没停课，所以没挂台风。"

## 几个看似合理、其实无效的论证

幻灯片列了几个"看起来对"但实际无效的论证，老师用真值表逐个拆穿，是这一讲最反直觉的部分。

第一种：环式蕴含不能直接得到所有命题为真。假设我们证出了 $P \rightarrow Q$、$Q \rightarrow R$、$R \rightarrow P$，有人想由此推出 $P \wedge Q \wedge R$。幻灯片用真值表枚举了所有 8 种 $(P, Q, R)$ 组合，发现 $P \rightarrow Q$、$Q \rightarrow R$、$R \rightarrow P$ 三个假设都为 T 的情况下，$P \wedge Q \wedge R$ 不一定为 T——只要取 $(P, Q, R) = (F, T, T)$：三个蕴含都为 T（$F \rightarrow T$ 为 T，$T \rightarrow T$ 为 T，$T \rightarrow F$ 为 T），但 $P \wedge Q \wedge R = F \wedge T \wedge T = F$。这是反例，所以那个论证无效。

第二种：肯定后件（affirming the consequent）。$p \rightarrow q$ 和 $q$ 不能推出 $p$。反例："如果你是鱼，那么你会喝水；你喝水了，所以你是鱼。"显然不对——人也会喝水。真值表显示 $p \rightarrow q$ 和 $q$ 都为 T 时，$p$ 可以是 T 也可以是 F（后者 $(F, T)$：$F \rightarrow T$ 为 T，且 $q = T$）。

第三种：否定前件（denying the antecedent）。$p \rightarrow q$ 和 $\neg p$ 不能推出 $\neg q$。反例："如果你是鱼，那么你会喝水；你不是鱼，所以你不喝水。"显然不对——其他动物也喝水。

记住一个判断口诀：要证明一个论证无效，只需要给出一个反例（counterexample）——也就是"所有假设都为 T、但结论为 F"的一组输入。

## 反证法（Proof by Contradiction）

另一种证明方法是反证法：假设"$\neg p$"为真（其中 $p$ 是想证的命题），然后推出矛盾（contradiction，例如推出某个 $c$ 为 T），说明假设错误，从而 $p$ 必须为 T。形式上：

$$\neg p \rightarrow c, \quad \therefore \quad p$$

幻灯片用真值表给了一个紧凑的说明：$c$ 是 contradiction，即 $c = F$ 永远成立；所以 $\neg p \rightarrow c$ 等价于 $\neg p \rightarrow F$；这一行当 $\neg p$ 为 T 且 $c$ 为 F 时为 F，因此要让整个蕴含为 T，必须有 $\neg p$ 为 F，即 $p$ 为 T。

## 经典小谜题：真话者与骗子

一个有趣的练习：村里有真话者（永远说真话）和骗子（永远说假话）。A 说"B 是真话者"；B 说"A 和我是相反类型"。判断 A 和 B 各是什么。

幻灯片给出推理过程：假设 A 是真话者，那 B 说的就是真话，即 A 和 B 是相反类型——这和 A 是真话者矛盾。所以 A 必须是骗子。骗子总说假话，所以 A 说"B 是真话者"是假的，即 B 不是真话者，那 B 也是骗子。和"A、B 都是骗子"互相印证，没有矛盾。这个小故事展示了"反证 + 一致性"在解逻辑谜题时的力量。

## 一页总结

幻灯片最后列了一张"有效论证形式"的速查表，建议记下来：modus ponens、modus tollens、generalization（由 $p$ 推出 $p \vee q$）、specialization（由 $p \wedge q$ 推出 $p$）、conjunction（由 $p$ 和 $q$ 推出 $p \wedge q$）、elimination（由 $p \vee q$ 和 $\neg p$ 推出 $q$）、transitivity（由 $p \rightarrow q$ 和 $q \rightarrow r$ 推出 $p \rightarrow r$）、proof by division into cases（由 $p \vee q$、$p \rightarrow r$、$q \rightarrow r$ 推出 $r$）、contradiction rule（由 $\neg p \rightarrow c$ 推出 $p$）。这些都是判断"是不是有效论证"时的标准武器。

## 课后两个思考题

幻灯片最后留了一个"自指"的小练习："下面这句话是假话"和"上面这句话是真话"。如果第一句为真，那它说"自己是假话"就矛盾；如果第一句为假，那"它是假话"就为真——也矛盾。这是一个无法判断真假的怪圈，叫"说谎者悖论"（liar paradox）。它不在命题逻辑的处理范围内（命题逻辑假设每个命题要么真要么假），但它是一个很好的提醒：并不是所有看似陈述句的句子都能纳入命题逻辑。

## 这一讲的关键 takeaway

- 命题是必须有确定真值的陈述句，运算符 NOT/AND/OR 是基础工具。
- 任意真值表都能用 AND/OR/NOT 写出来——Idea 1（按真值行取 or-of-ands）和 Idea 2（按假值行取 and-of-negated-ors）。
- 德摩根律允许把 NOT 一直推进公式内部，并配套 11 条规则用于化简。
- 条件语句 $p \rightarrow q$ 的真值表和"如果 p 那么 q"在自然语言里的直觉不完全一样——前件为 F 时整个蕴含自动为 T。把它写成 $\neg p \vee q$ 会让这点更明显。逆否命题 $\neg q \rightarrow \neg p$ 永远和原命题等价。
- 论证是否有效只看"假设为 T 时结论是否必为 T"，和现实真假无关。Modus ponens / modus tollens 是有效论证；肯定后件、否定前件、循环蕴含都无效。
- 判断无效只要一个反例；判断有效要遍历所有使假设为 T 的情况。
