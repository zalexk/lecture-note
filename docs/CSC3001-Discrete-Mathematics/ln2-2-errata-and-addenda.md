---
course: CSC3001 离散数学
lecture: LN2.2 - First-order logic
title: LN2.2 勘误与补漏 —— 对照讲义（32 页）逐条核对
date: 2026-10-05
source: "D:\\University\\Year 2\\CSC3001\\LN2.2 - First-order logic.pdf"
tags: [CSC3001, Logic, First-order Logic, Quantifiers, Errata]
---

# LN2.2 勘误与补漏

核对对象：一份「量词 / 否定 / 多量词 / 带量词论证」的笔记稿。
核对依据：`LN2.2 - First-order logic.pdf` 全 32 页（逐页渲染为图片后读原文）。
标注约定：**[讲义]** = 讲义原文就是这样，笔记是忠实照抄；**[笔记]** = 笔记自己引入的偏差。

---

## 一、必须改的硬错误

### 1. 费马定理的公式里 $n$ 是自由变量（最严重的一处）

笔记写的两步：

$$
\forall a,b,c\in\mathbb{Z}^+.\ (n\in\mathbb{Z})\wedge(n>2)\ \to\ a^n+b^n\ne c^n
$$

$$
\forall a,b,c\in\mathbb{Z}^+.\ (n\le2)\vee(n\notin\mathbb{Z})\vee(a^n+b^n\ne c^n)
$$

**问题**：整条公式里 $n$ 从来没有被量词约束，是个**自由变量**——严格讲这根本不是命题，没有真值。**这不是笔记抄错，讲义 p7 的最终公式就是这么印的**（`∀a,b,c ∈ ℤ⁺, (n ≤ 2) ∨ (n ∉ ℤ) ∨ (aⁿ+bⁿ ≠ cⁿ)`），笔记只是忠实复现。

**正确写法**：

$$
\forall n\in\mathbb{Z},\ \forall a,b,c\in\mathbb{Z}^+.\ (n>2)\ \to\ a^n+b^n\ne c^n
$$

或等价地 $pnf$ 形式：

$$
\forall n\in\mathbb{Z},\ \forall a,b,c\in\mathbb{Z}^+.\ (n\le2)\vee\big(a^n+b^n\ne c^n\big)
$$

**顺带一个内部矛盾**：讲义 p7 的 "Domains" 那一行已经声明 $n\in\mathbb{Z}$，但公式里又出现 $n\notin\mathbb{Z}$ 这个析取项。二者不能同时有意思——要么把 $n\in\mathbb{Z}$ 写进量词（那 $n\notin\mathbb{Z}$ 恒假、是废项），要么承认它只是 $\neg[(n\in\mathbb{Z})\wedge(n>2)]$ 展开时的机械残留。**建议：直接把 $n\in\mathbb{Z}$ 放进全称量词，公式里只留 $n\le2$。**

### 2. `A technology is true` → `A tautology is true`

笔记在「命题逻辑：一个 ~~technology~~ 为真」这一行写的是 technology（技术）。讲义 p24 原表是：

> A **tautology** is true no matter what the truth values of $A$ and $B$ are.

`tautology`（重言式）被写成了 `technology`，纯粹是转写错误。

### 3. Universal modus tollens 第三个式子漏了 $\therefore$

笔记写的是：

$$
\forall x, P(x)\to Q(x),\quad \neg Q(a),\quad \neg P(a)
$$

最后一行前面缺推出符号。讲义 p25 是 $\therefore\neg P(a)$，而笔记里另外两条（universal instantiation、universal modus ponens）都带了 $\therefore$，只有这条掉了。属于体例不一致。

---

## 二、讲义本身的问题（笔记照抄，但建议按修正版记）

### 4. 一阶逻辑里的 "tautology" 其实该叫 valid formula

讲义 p24 的对照表两栏都用了 "tautology"：

| | 讲义措辞 | 严格说法 |
| --- | --- | --- |
| 命题逻辑 | A tautology is true no matter what the truth values of $A,B$ are | 就是这样，没问题 |
| 一阶逻辑 | A tautology is true no matter what the domain of $x,y,z$ is, or $P,Q$ are | 应叫 **有效式 (valid formula / logically valid)** |

一阶逻辑里 "tautology" 有专门含义（把量词公式当原子命题替换后得到的重言式），而「对任意论域、任意谓词解释都为真」是**有效性**。两者是包含关系：重言式 ⟹ 有效，反之不成立（例如 $\forall xP(x)\to P(a)$ 有效但不是重言式）。考试若要求术语精确，按 "valid" 写。

### 5. 哥德巴赫猜想写的是 "at least 6"，标准版是 "greater than 2"

讲义 p8 标题：*Every positive even number **at least 6** is a sum of two primes.*
标准哥德巴赫猜想：*every even integer **greater than 2***（即 $n\ge4$）。

差别只在 $n=4$ 这一个边界（$4=2+2$ 显然成立），所以两个版本实际等价、不影响后续形式化。但要知道讲义这一版比标准版**弱一点点**（它没断言 $4$ 的情形）。

另外，讲义与笔记都把 $p,q$ 的论域写成 $\mathbb{Z}$——因为 `prime(p)` 已经隐含 $p>1$，所以不出错，但写 $\mathbb{Z}^+$（或 $\mathbb{N}$）更干净。

---

## 三、漏掉的内容（讲义有、笔记没有）

按重要程度排：

### 6. 嵌套量词的否定 —— 本讲最常考，笔记完全没有

讲义 p20 "More Negations"：

$$
\neg(\exists P\,\forall V,\ \text{kill}(P,V))\ \equiv\ \forall P\,\neg(\forall V,\text{kill}(P,V))\ \equiv\ \forall P\,\exists V\,\neg\text{kill}(P,V)
$$

> For every program, there is some virus that it cannot kill.

**要点**：否定一个嵌套量词公式 = 从外到内**逐层翻转**（$\forall\leftrightarrow\exists$）并把 $\neg$ 推进到最里面。笔记只给了单量词的两条对偶律，没把这条推广写出来，也没配例子。而「写出某句话的否定」几乎是必考题型。

### 7. 二维数组例子（讲义 p16–18）—— 讲「次序重要」的唯一直观例子

- $\forall\,\text{column } y\ \exists\,\text{row } x:\ A[x,y]=1$ —— 每列至少一个 1（每列挑的行可以不同）。讲义那张散落 1 的表格满足它。
- $\exists\,\text{row } x\ \forall\,\text{column } y:\ A[x,y]=1$ —— 存在一整行全是 1。同一张表**不满足**。

配套的 Fact（讲义 p18）：

$$
\exists x\,\forall y\,P(x,y)\ \Longrightarrow\ \forall y\,\exists x\,P(x,y)
$$

讲义特别强调反向**不成立**。笔记里整段只剩一句 "Hence, order of quantifiers is important."，最直观的例子和这条蕴含关系都丢了。**建议补上：强弱关系是「$\exists\forall$ 强于 $\forall\exists$」，单向蕴含。**

### 8. 同型量词可交换（讲义 p19）

$\forall x\forall y$ 与 $\forall y\forall x$ 等价；$\exists x\exists y$ 与 $\exists y\exists x$ 等价；只有 $\forall/\exists$ **混搭时不能换**。讲义 p19 专门用一整页 Questions 问这件事，笔记没提。理由是把论域展开成合取/析取后，$\wedge$ 与 $\vee$ 各自满足交换律。

### 9. 有效性的两个判定范例（讲义 p27–28）

这是全讲唯一教「怎么判断一条带量词的规则是否有效」的地方，笔记只留了定义句，两个示范都没收：

**(a) 反例证伪**：$\forall z\,[Q(z)\vee P(z)]\to[\forall x\,Q(x)\vee\forall y\,P(y)]$ **无效**。
构造：论域取整数，$Q(z)=$ even$(z)$，$P(z)=$ odd$(z)$。前提为真（每个整数非偶即奇），结论为假（并非所有整数都偶，也并非所有整数都奇）。

**(b) 正例证明**：$\forall z\in D\,[Q(z)\wedge P(z)]\to[\forall x\in D\,Q(x)\wedge\forall y\in D\,P(y)]$ **有效**。
证明链：假设前提真 → 任取 $c\in D$ → 全称实例化得 $Q(c)\wedge P(c)$ → 得 $Q(c)$ → 因 $c$ 任意，由**全称推广**得 $\forall x\,Q(x)$ → 同理 $\forall y\,P(y)$ → 合取即结论。QED

对照要点：$\wedge$ 可以从 $\forall$ 里拆出来（"对所有 $z$ 同时成立" ⟹ "分别对所有成立"），$\vee$ **不能**（"每个 $z$ 各自选一个" 推不出 "全体统一选同一个"）。这正是 $\exists\forall$ 强于 $\forall\exists$ 的同一个道理。

### 10. 素数的形式化定义（讲义 p9）

$$
\text{prime}(p)\ \equiv\ (p>1)\wedge(p\in\mathbb{Z})\wedge\forall a,b\in\mathbb{Z}^+,\ \big[(p\ne a\cdot b)\vee(a=1)\vee(a=p)\big]
$$

笔记没有这一步。价值在于演示「一个看似基本的谓词，理论上能完全展开成纯量词 + 算术」。

### 11. 练习题（讲义 p22–23）三道

1. There is a smallest positive integer. → $\exists s\in\mathbb{Z}^+\ \forall x\in\mathbb{Z}^+\ s\le x$
2. There is **no** smallest positive real number. → $\forall r\in\mathbb{R}^+\ \exists x\in\mathbb{R}^+\ x<r$（注意这句话本身就是否定式，直接写成 $\forall\exists$ 形式即可）
3. There are infinitely many prime numbers. → 讲义给了两种编码：
   - 拆成两半：$(\exists p\in\mathbb{Z},\text{prime}(p))\wedge(\forall p\in\mathbb{Z}^+,\neg\text{prime}(p)\vee(\exists q\in\mathbb{Z},\text{prime}(q)\wedge q>p))$
   - 用集合论：$\forall\ \text{finite }S\subseteq\mathbb{N},\ \exists p:\text{prime}(p)\wedge p\notin S$

第 3 题的结论句：「Formulating sentences using first-order logic is useful in logic programming and database queries.」这类「自然语言 → 一阶逻辑」的翻译正是作业和考试的主力题型。

### 12. 论域影响真值的具体对照表（讲义 p6）

$\forall x\,\exists y.\ x<y$ 的真值：整数 $\mathbb{Z}$ = T，正整数 $\mathbb{Z}^+$ = T，负整数 $\mathbb{Z}^-$ = **F**，负实数 $\mathbb{R}^-$ = T（$x=-0.5\Rightarrow y=-0.25$）。笔记只留了一句「取决于论域」，没有这张表。

### 13. 框架性内容（低优先）

- 讲义 p3：用命题逻辑写勾股定理 / 「有无穷多素数」的困难——本讲的开场动机。
- 讲义 p29 Summary：三条能力目标（用逻辑公式表达（量化）陈述 / 用简单逻辑规则化简（De Morgan、逆否等）/ 熟练判定论证有效性与逻辑等价）。
- 讲义 p30–32 Applications：逻辑编程（Prolog）、数据库查询与数据挖掘、数字电路；两个孩子问题（答案 $1/3$，反直觉来自「至少一个是女孩」vs「指定的那个是女孩」）；哥德尔不完备定理与停机问题（讲义指向 Note 2.1）。

---

## 四、术语与措辞（不算错，但值得改）

| # | 笔记写法 | 建议 |
| --- | --- | --- |
| 14 | 「Predicates are propositions with variables」（谓词是带变量的命题） | 讲义原话，但不是好定义。**谓词本身不是命题**（没真值）；填值或量化之后才变成命题。更准：谓词是「含变量的陈述模板」，代人后才有真值。 |
| 15 | 量词次序表格「弱约束（**$\exists$ 在外层**受 $\forall$ 支配）」 | 反了。$\forall v\exists a$ 里 $\exists$ 在**内层**、被外层的 $\forall$ 支配。整句应写成「$\exists$ 在内层，被外层 $\forall$ 支配」；下一格的「$\forall$ 在内层被 $\exists$ 锁死」才是对的。两格措辞要对称。 |
| 16 | 两步法把「论域」和「前提条件」混在一起：`1. Find domain: ∀n∈ℤ⁺.[even(n)∧(n≥6)]` | 论域只有 $\mathbb{Z}^+$；$even(n)\wedge(n\ge6)$ 是**前提条件**（antecedent）。把条件塞进「domain」这一行，是新手写形式化时最容易出的错，也会直接导致第 1 条的 $n$ 自由变量问题。 |
| 17 | 哥德巴赫例子把整个 $\exists p,q(\dots)$ 结论标注为 "condition" | 讲义 p8 里的 "Conditions" 指的是 $p+q=n$。笔记的标签和讲义冲突，序列也自相矛盾（FLT 例里 "condition" = 结论，Goldbach 例里 "condition" = 也是结论）。建议统一成「前提 / 结论」两栏。 |
| 18 | 否定证明里用 `=` 连接 `¬∀xP(x) = ¬(P(1)∧P(2)∧P(3))` | 逻辑等价用 $\equiv$，数值相等才用 $=$。讲义 p11/p12 用的就是 $\equiv$。另外笔记那条证明链末尾 `≡ ∃x¬P(x) ≡ R.H.S.` 是同义反复，可删。 |
| 19 | 否定证明只给了 $\forall$ 那半边 | 讲义 p11、p12 各给一条展开证明（$\forall$ 用合取 + De Morgan，$\exists$ 用析取 + De Morgan，$\exists$ 那条还多一个中间步 $\neg(P(1)\vee P(2))\wedge\neg P(3)$）。补上 $\exists$ 那条才对称。 |
| 20 | Universal Generalization 照抄「provided $c$ is independent of $A$」 | 讲义原话，但太含糊。准确条件两条：**① $c$ 是任意 (arbitrary) 的**；**② $c$ 不能自由出现在任何前提里**。另外讲义这个形式 $A\to R(c)\ \therefore\ A\to\forall x R(x)$ 是「带前提的推广」变体，与教科书标准的 $R(c)\ \therefore\ \forall x R(x)$ 不完全一样，知道是一回事即可。 |
| 21 | 「$\forall$ 配 $\to$、$\exists$ 配 $\wedge$」这条规则只被隐性用到 | 笔记在「植物会飞」的例子里的确用对了（$\exists x(\text{plant}\wedge\text{can\_fly})$ 否定成 $\forall x(\text{plant}\to\neg\text{can\_fly})$），也解释了一句。但没把规则**显式总结**出来。这是必考题：**「All S are P」写 $\forall x(S(x)\to P(x))$，绝不能写 $\forall x(S(x)\wedge P(x))$；「Some S are P」写 $\exists x(S(x)\wedge P(x))$。** |

---

## 五、关键公式速查（改完的版本）

| 内容 | 正确写法 |
| --- | --- |
| 全称展开（有限/可数论域） | $\forall x\in A\,P(x)\ \equiv\ P(a_1)\wedge P(a_2)\wedge\cdots$ |
| 存在展开 | $\exists x\in A\,P(x)\ \equiv\ P(a_1)\vee P(a_2)\vee\cdots$ |
| 否定（单量词） | $\neg\forall xP(x)\equiv\exists x\neg P(x)$；$\neg\exists xP(x)\equiv\forall x\neg P(x)$ |
| 否定（嵌套） | $\neg\forall x\exists yP(x,y)\equiv\exists x\forall y\neg P(x,y)$（逐层翻转、$\neg$ 推到底） |
| 次序 | $\exists x\forall yP\Rightarrow\forall y\exists xP$（反向不成立）；$\forall\forall$、$\exists\exists$ 可交换 |
| $\wedge/\vee$ 分配 | $\forall x(P\wedge Q)\equiv\forall xP\wedge\forall xQ$；$\exists x(P\vee Q)\equiv\exists xP\vee\exists xQ$；**反方向 $\forall(P\vee Q)$、$\exists(P\wedge Q)$ 不成立** |
| 费马最后定理 | $\forall n\in\mathbb{Z},\forall a,b,c\in\mathbb{Z}^+.\ (n>2)\to a^n+b^n\ne c^n$ |
| 哥德巴赫猜想 | $\forall n\in\mathbb{Z}^+.\ \big[\text{even}(n)\wedge n>2\big]\to\exists p,q\in\mathbb{Z}^+.\ \text{prime}(p)\wedge\text{prime}(q)\wedge(p+q=n)$ |
| 素数 | $\text{prime}(p)\equiv(p>1)\wedge(p\in\mathbb{Z})\wedge\forall a,b\in\mathbb{Z}^+[(p\ne ab)\vee(a=1)\vee(a=p)]$ |
| 规律 | $\forall$ 配 $\to$，$\exists$ 配 $\wedge$ |

---

---

## 六、第二遍复核（逐页重验原 PDF，2026-10-05 夜）

复核方式：把 `LN2.2 - First-order logic.pdf` 重跑一遍——全文用 pymupdf 抽文字定位页码，公式密集的 p6 / p7 / p11 / p12 / p16–p20 / p25 另渲染 170 dpi 图片逐字读。**这套课件的公式是图片，抽文字只能抽出标题和标签，抽不出公式本体**，所以凡涉及公式的结论都必须看图才算数。

### 6.1 原勘误的核实结果：逐条成立

| 原条目 | 依据页 | 复核结论 |
| --- | --- | --- |
| 1 费马公式 $n$ 自由 | p7 | **成立**。图上原文就是 $\forall a,b,c\in\mathbb{Z}^+,(n\le2)\vee(n\notin\mathbb{Z})\vee(a^n+b^n\ne c^n)$，$n$ 无任何约束 |
| 2 technology → tautology | p24 | **成立**。原表 "A tautology is true no matter what the truth values of $A$ and $B$ are." |
| 3 UMT 漏 $\therefore$ | p25 | **成立**。讲义三条规则都带 $\therefore$，笔记漏的只有第三条 |
| 4 一阶逻辑该叫 valid formula | p24 | **成立**。两栏都写 "A tautology is…" |
| 5 Goldbach "at least 6" | p8 | **成立**。措辞逐字对上 |
| 6 嵌套量词否定 | p20 | **成立**。原文 $\neg(\exists P\,\forall V,\mathrm{kill}(P,V))\equiv\forall P\,\neg(\forall V,\mathrm{kill}(P,V))\equiv\forall P\,\exists V\,\neg\mathrm{kill}(P,V)$ |
| 7 数组例子 | p16–18 | **成立**。p16/p17 是同一张 9 个 1 的散落表：每列都有 1（满足 $\forall y\exists x$），但没有整行全 1（不满足 $\exists x\forall y$）；p18 换成第 3 行整行 6 个 1 才满足后者。Fact $\exists x\forall y\,P\Rightarrow\forall y\exists x\,P$ 在 p18 |
| 8 同型量词可交换 | p19 | **成立**。p19 两个 "Are these statements equivalent?" 用的正是 $A[x,y]$ 数组写法 |
| 9 有效性两范例 | p27–28 | **成立**。p27 even/odd 反例、p28「全称实例化 → 全称推广」证明链，逐句对得上 |
| 10 prime 形式化 | p9 | **成立**。$(p>1)\wedge p\in\mathbb{Z}\wedge\forall a,b\in\mathbb{Z}^+[(p\ne a\cdot b)\vee(a=1)\vee(a=p)]$ |
| 11 练习题 | p21–p22 | 内容成立，**页码需修正**（见 6.2 第 1 条） |
| 12 论域对照表 | p6 | **成立**。$\forall x\exists y.\,x<y$：$\mathbb{Z}$ T、$\mathbb{Z}^+$ T、$\mathbb{Z}^-$ F、$\mathbb{R}^-$ T，四值逐个对上 |
| 13 框架页 | p3 / p29 / p30–32 | **成立**。p3 勾股 + 无穷素数动机、p29 Summary 三目标、p31 两个孩子、p32 哥德尔 + "see Halting Problem in Note 2.1" |
| 14 谓词定义原话 | p4 | **成立**。讲义："Predicates are propositions (i.e. statements) with variables." |
| 18 该用 $\equiv$ | p11/p12 | **成立**。两条展开证明都用 $\equiv$，且各带一个中间步（p11：$\neg(P(1)\wedge P(2))\vee\neg P(3)$；p12：$\neg(P(1)\vee P(2))\wedge\neg P(3)$） |
| 20 UG 的 side condition | p26 | **成立**。原文 "providing c is independent of A" |

### 6.2 原勘误需要改的两处

**(1) 练习题的页码写错了：是 p21–p22，不是 p22–p23。**

第 1、2 题（最小正整数 / 无最小正实数）在 **p21**；第 3 题（无穷多素数，两种编码）和那句 "Formulating sentences using first-order logic is useful in logic programming and database queries." 在 **p22**。p23 只是章节分隔页（Quantifiers / Negation / Multiple quantifiers / Arguments 四行目录）。

**(2) 「把条件塞进 Domains 行」这笔账不能全算在笔记头上——讲义自己就是这么写的。**

讲义三处都把「谓词 / 条件 / 论域」混在同一行 "Domains" 里：

| 页 | 讲义的 Domains 行 | 混进来的东西 |
| --- | --- | --- |
| p7 | $a\in\mathbb{Z}^+,b\in\mathbb{Z}^+,c\in\mathbb{Z}^+,n\in\mathbb{Z},n>2$ | $n>2$ 是条件，不是论域 |
| p8 | $\text{prime}(p),\text{prime}(q),\text{even}(n),n\ge6,n\in\mathbb{Z}^+$ | 前三个是谓词、$n\ge6$ 是条件，只有 $n\in\mathbb{Z}^+$ 是论域 |
| p9 | $p,a,b>1$，$p,a,b\in\mathbb{Z}$ | $>1$ 是条件 |

这条和第 1 条（$n$ 自由变量）是**同一个病根**，不是两件事：正因为讲义 p7 把 $n$ 的论域写成「$\in\mathbb{Z},n>2$」塞进 Domains 行，最后 "Add quantifiers" 时量词才只加了 $a,b,c$、把 $n$ 漏在外面。所以第 16 条的定性应从「[笔记] 新手易犯」改为「**[讲义] 的写法**，笔记忠实照抄，但它是 p7 那个 bug 的源头」。

### 6.3 原勘误漏掉的缺口（4 条，均为「讲义有、笔记没有」）

| # | 页码 | 讲义有 | 笔记现状 |
| --- | --- | --- | --- |
| 22 | p5 | 全称量词三个例子：勾股定理；$\forall x\in\mathbb{Z}\,\forall y\in\mathbb{Z},\,x+y=y+x$（加法交换律）；$\forall x,\,x^2\ge x$（$\mathbb{Z}$ 真、$\mathbb{R}$ 假——讲义唯一一个"同式子换论域就翻面"的对照） | 只留了展开式 $\forall x\in\mathbb{Z}^+P(x):P(1)\wedge P(2)\wedge\cdots$，三个例子全无 |
| 23 | p6 | 存在量词例子 $\exists y\in\mathbb{Z}^+:y=y^2$（取 $y=1$） | 没有 |
| 24 | p26 | UG 的实例："for any number $c$, if $1=1$, then $2c$ is an even number" ⟹ "If $1=1$, then for all $x$, $2x$ is an even number"；以及 Remark："Universal generalization is often difficult to prove, we will introduce mathematical induction…" | 规则与那句 "if we could prove that $R(c)$ is true for an arbitrary $c$…" 收了，但**例子与 Remark 都没有** |
| 25 | p24 | 衔接语 "Generalizing the propositional logic,"；原文 "no matter what the domain of $x,y,z$ **is**, or $P,Q$ are" | 笔记掉了一个 `is`（词序也被改动） |

第 22、23 条值得补的理由与原第 12 条（论域对照表）同性质：它们都属于「真值依赖论域」这条主线的具体例证。

### 6.4 原勘误自身的一处口径不一

第五节速查表把哥德巴赫写成 $n>2$（标准版），但正文第 5 条讨论的是讲义版 $n\ge6$。两处应统一：照讲义抄就写 $n\ge6$；若按标准版写，就注明「与讲义略有出入」。

### 6.5 二遍复核后的总数

- **硬错误 3 条**（笔记层面：1、2、3）不变；其中第 1 条的**根因在讲义 p7**。
- **讲义自身问题**：原 2 条（4、5）成立，**再加 1 条** —— p7/p8/p9 的 "Domains" 行混装谓词与条件（原第 16 条升格为讲义问题）。
- **笔记缺口**：原 8 组 + 本遍新增 4 条 = **12 条**。
- 原勘误自身要改的：页码 1 处（练习题 p21–p22）、口径 1 处（速查表 $n>2$）。

---

## 附：诚实备注

- **覆盖度**：以上按讲义 32 页逐页核对。第一类的 3 条是笔记与你所给材料的**错误**；第二类 2 条是**讲义自身的疏漏**（笔记忠实照抄，改不改看你用途：应付考试照讲义写也行，但第 1 条建议按修正版，因为它是真错）；第三类是按讲义目录数的**缺口**，共 8 组。
- **一处需要你确认的**：第 1 条里 $n$ 的自由变量问题，讲义 p7 确实这么印。如果你手上的印刷版/老师板书后来改过，以课堂为准——但从 PDF 原文看，$n$ 没被约束。
- **对照**：已交付的重写版 `CSC3001-LN2.2-课堂笔记.md`（站点页 `ln2-2-first-order-logic`）里，费马定理与哥德巴赫两条**都已经用 $\forall n$ 正确绑定**，第三类的缺口（嵌套否定、数组例子、$\exists\forall\Rightarrow\forall\exists$、两道有效性判定、素数定义、练习题、论域对照表）也基本都收了。所以这份勘误主要是针对 **vault 原始笔记**与**讲义本身**，不是重写版。
- **未核验项**：笔记里没有原图/截图，所以「表格里 1 的分布是否真满足某条命题」这类只能按讲义 p16–18 的三张图判断，我按图上的 1 分布复算过一遍，与讲义结论一致（散落那张满足 $\forall y\exists x$、不满足 $\exists x\forall y$）。
- **第二遍复核（第六节，2026-10-05 夜）**：公式页 p6/p7/p11/p12/p16–p20/p25 改为 170 dpi 渲染后逐字读数，原勘误 17 条逐条成立（见 6.1）；但发现原勘误自身两处要改（练习题页码、第 16 条归属）、漏掉 4 条缺口（p5、p6、p26、p24）。**结论以第六节为准，前面小节如有冲突以 6.2/6.4 的更正为准。**
