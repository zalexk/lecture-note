---
title: Lecture 1 引言与预备知识（Introduction and Preliminary）
---

# STA2002 概率与统计 II · 第 1 讲笔记
## Introduction and Preliminary（引言与预备知识）

> 授课：Zhenxing Guo、Ka Wai Tsang（香港中文大学（深圳）数据科学学院，2026 年 9 月）
> 教材：Hogg, Tanis & Zimmerman (2015) *Probability and Statistical Inference*, 9th ed., Pearson
> 对应教材章节：Ch.1–5（本讲为 STA2001 复习），本课程主线为 Ch.6–9
> 材料构成：讲义 `Lecture1 - Introduction and Perliminary.pdf`（36 页）+ **本讲课堂板书**（4 张照片，内容已提炼并入 §3.7、§4.5、§5.8、§7.6、§8.6 及多处小节；板书相对讲义的增量见文末诚实备注）

---

## 0. 课程信息与规则（先把"游戏规则"记住）

| 项目 | 内容 |
| --- | --- |
| 授课教师 | 郭振兴 Zhenxing Guo（周一/三 10:30–11:50；道远楼 320a，周三 15:00–16:00）<br>曾家伟 Ka Wai Tsang（周二/四 15:30–16:50；道远楼 505b，周二 17:00–18:00） |
| 助教 TA | 郭垚辉（DY324-4，周一 19:00–20:00）、李金一（DY324-5，周四 14:00–15:00）、王子铭（知新 412-86，周一 15:00–16:00）、杨辰宇（RB311，周五 17:00–18:00） |
| 本科生教学助理 USTF | 盛潇霞、赵润楷 |
| 习题课 Tutorial | 第二周开始，即 **9 月 14 日那一周** |
| 教材 | Hogg / Tanis / Zimmerman，*Probability and Statistical Inference*（第 9 版，Pearson, 2015） |

**考核与纪律（这几条最容易踩坑，务必记住）**

- 作业必须**独立完成**，**不接受迟交，没有例外**；全部作业中**最低的一次成绩会被去掉（drop）**。
- 期中和期末都是**闭卷、闭笔记、无电子设备**。
- 允许携带**手写**的 A4 作弊纸（cheat sheet）：**期中 1 张，期末最多 2 张**，正反面都可以写。
- 补考（makeup exam）**只**在"可证明的、学生无法控制的突发情况"下考虑；必须**在考试日期之前**提交书面申请，并附齐所有证明材料。
- 学术不端（作弊、抄袭、与他人共享作业等）零容忍，可能导致**终止学籍**。

---

## 1. 引言：这门课在做什么

前两讲是**热身课（warm-up lectures）**，用来复习 STA2001 里的核心概念，为后面 STA2002 的高级统计内容打地基。

一句话概括这一讲的任务：**把"随机变量 — 分布 — 矩 — 三大抽样分布 — 极限定理"这条链条补齐**，后面所有推断方法都建立在这条链条上。

---

## 2. 概率 vs 统计（Probability vs Statistics）

这是整个学科的**分水岭**，理解它就理解了一半的统计学。

| | 已知什么 | 要求什么 | 思维方向 |
| --- | --- | --- | --- |
| 概率 Probability | 已知真实世界的**数学模型** | 推测**会发生什么** | 演绎（由因推果） |
| 统计 Statistics | 已知**观测到的数据** | 推测**哪个模型/过程解释了这些数据** | 归纳（由果推因） |

**对照例子（讲义上的经典问法）**

- 概率问题：一枚公平硬币掷 5 次，5 次都出现同一面的概率是多少？
  - 解：全正面或全反面，$\Pr = 2 \times (1/2)^5 = 1/16 = 0.0625$。
- 统计问题：你掷了 5 次，**全都是正面**，该不该下结论说"这枚硬币不公平"？
- 统计问题：掷 20 次看到 14 次正面，你对正面概率的估计是多少？—— $\hat\theta = 14/20 = 0.7$。
- 统计问题：如果掷 **1000** 次看到 700 次正面，估计值还是 0.7。**你对这两个 0.7 的信心一样吗？**
  - 不一样。样本量越大，同样的估计值越可信。这个"信心"会被后面量化成**置信区间（Confidence Interval）**和标准误。

> **核心直觉**：统计做的其实就是三件事——
> ① 把**统计量的实测值**与**概率模型的预测**做比较；
> ② 用统计量对概率模型做**推断**；
> ③ 评估这些推断**有多可信**。
> 对应的三大关键词：**假设检验（Hypothesis Testing）**、**参数估计（Parameter Estimation）**、**置信区间（Confidence Interval）**。这三样就是本课程 Ch.6–9 的主线。

---

## 3. 随机变量与分布函数

### 3.1 随机变量（Random Variable）

**定义**：随机变量 $X$ 是一个从样本空间 $\Omega$ 到实数集 $\mathbb{R}$ 的**函数**，$X: \Omega \to \mathbb{R}$。

- 说人话：掷硬币的结果"正面/反面"没法做算术，于是我们给它贴数字标签（正面=1，反面=0）。**随机变量就是把随机试验的每个可能结果映射成一个数字的工具**，映射完才能求平均、求方差。
- 两种常见类型：
  - **离散型（discrete）**：取值落在一个**可数集** $S_X$ 上（如掷骰子点数、人数、次数）。
  - **连续型（continuous）**：由**密度函数**描述（如身高、等待时间、测量误差）。

### 3.2 累积分布函数 CDF（Cumulative Distribution Function）

$$F_X(x) = \Pr(X \le x)$$

三条性质（**充要条件**，判判断题常考）：

1. **非降（non-decreasing）**：$x_1 < x_2 \Rightarrow F(x_1) \le F(x_2)$。
2. **右连续（right-continuous）**：因为定义里用的是 $\le$，所以 $x$ 从**右侧**逼近时概率收敛到 $F(x)$。
3. 两端极限：$\displaystyle\lim_{x\to-\infty}F_X(x)=0,\quad \lim_{x\to\infty}F_X(x)=1$。

**支撑集（support）$S_X$**：随机变量"真正可能取到"的那些值。

- 离散：$S_X = \{x : \Pr(X=x) > 0\}$
- 连续：$S_X = \{x : f_X(x) > 0\}$

### 3.3 离散情形：概率质量函数 PMF（Probability Mass Function）

$$p_X(k) = \Pr(X = k), \quad k \in S_X$$

性质：$0 \le p_X(k) \le 1$；$\displaystyle\sum_{k \in S_X} p_X(k) = 1$。

这里的 $p(k)$ **本身就是概率**（所以叫"质量"）。

### 3.4 连续情形：概率密度函数 PDF（Probability Density Function）

$$\Pr(a < X \le b) = \int_a^b f_X(x)\,dx, \qquad F_X(x) = \int_{-\infty}^{x} f_X(t)\,dt$$

当 $F_X$ 可导时，$f_X(x) = F_X'(x)$。

> **最容易错的一点**：PDF 的取值**不是概率**，它可以大于 1；只有**积分**才是概率。连续型随机变量取到任意一个具体点的概率恒为 0，即 $\Pr(X = c) = 0$。所以才有下面这个反直觉的结论：
> $$\Pr(a < X \le b) = \Pr(a \le X \le b) = \Pr(a < X < b) = \Pr(a \le X < b)$$
> 端点是否取等对连续型毫无影响（对离散型影响巨大！）。

### 3.5 期望（Expectation）

$$
E(X) = \begin{cases}
\displaystyle\sum_{k \in S_X} k\,p_X(k), & X \text{ 离散}\\[8pt]
\displaystyle\int_{-\infty}^{\infty} x\,f_X(x)\,dx, & X \text{ 连续}
\end{cases}
$$

**线性性（Linearity of Expectation）**：对常数 $a, b$，

$$E(a + bX) = a + bE(X), \qquad E\!\left(\sum_i b_i X_i\right) = \sum_i b_i E(X_i)$$

> **划重点**：线性性**不需要任何独立性假设**。哪怕 $X_1, X_2$ 高度相关（甚至是同一个变量），$E(X_1+X_2) = E(X_1)+E(X_2)$ 永远成立。这是期望最强大的性质，也是它比方差"好伺候"的原因。

### 3.6 方差（Variance）

$$\operatorname{Var}(X) = E\!\left[(X - EX)^2\right] = E[X^2] - (EX)^2$$

第二个等号是最常用的计算式：**平方的期望 减 期望的平方**（注意顺序别颠倒，否则会得到负数）。

**性质**：

- $\operatorname{Var}(a + bX) = b^2\operatorname{Var}(X)$
  - 直觉：$a$ 是平移，不改变"分散程度"；$b$ 是缩放，离散度按**平方**放大（因为方差本身是"平方量纲"）。标准差则是 $|b|$ 倍。
- 若 $X,Y$ 方差有限：
  $$\operatorname{Var}(X+Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X,Y)$$
  其中协方差（Covariance）$\operatorname{Cov}(X,Y) = E\big[(X-E(X))(Y-E(Y))\big]$。
- 若 $X,Y$ **独立**，则 $\operatorname{Cov}(X,Y)=0$，于是
  $$\operatorname{Var}\!\left(\sum_{i=1}^{n} X_i\right) = \sum_{i=1}^{n}\operatorname{Var}(X_i)$$

> **注意单向箭头**：独立 $\Rightarrow$ 协方差为 0；但**协方差为 0 不能推出独立**（它只说明"没有线性相关"，可能存在非线性关系）。唯一例外是多元正态：联合正态下不相关等价于独立。

### 3.7 关于"有限方差"这个条件（板书 §x̄ 一行专门讨论了它）

第 1 讲板书在写大数定律时，把前提条件完整地摊开写成了

$$\bar x = \frac1n\sum_{i=1}^n x_i, \qquad \boxed{x_1,\ldots,x_n \ \ i.i.d.\ \ \text{same }\mu,\ \textbf{same finite }\sigma^2}$$

其中"**same finite $\sigma^2$**"这四个字值得单独说清楚，因为它是后面 LLN 与 CLT 能否成立的关键闸门。

**什么叫"有限方差"**：就是方差这个积分算出来是一个**有限的数**，不是无穷大：

$$\operatorname{Var}(X) = E\big[(X-\mu)^2\big] = \int_{-\infty}^{\infty}(x-\mu)^2 f(x)\,dx < \infty$$

**为什么它不一定成立**：关键在 $x^2$ 这个权重。密度 $f(x)$ 在远处衰减得再快，也未必压得住 $x^2$ 的放大——一旦尾部衰减得不够快，$x^2f(x)$ 的积分就发散。

**精确的判断规则**（对尾部形如 $\Pr(X>x)\sim x^{-\alpha}$ 的 Pareto 型分布）：

| 条件 | 结论 |
| --- | --- |
| $\alpha > 1$ | 均值 $E[X]$ 存在（有限） |
| $\alpha > 2$ | 方差 $\operatorname{Var}(X)$ 存在（有限） |
| $\alpha > k$ | $k$ 阶矩 $E[X^k]$ 存在 |

也就是：**有限方差要求尾部衰减得比 $x^{-3}$ 更快**（因为密度尾部 $\sim x^{-(\alpha+1)}$，乘上 $x^2$ 后要收敛需 $\alpha+1-2>1$，即 $\alpha>2$）。

几个常见例子：

- **Cauchy 分布**：$\alpha=1$，均值本身就不存在（不是"等于 $\infty$"，而是积分不收敛），方差更不存在。
- **Pareto($\alpha=1.5$)**：均值有限，方差 $\infty$。
- **$t(r)$ 分布**：均值要 $r>1$，方差要 $r>2$，此时 $\operatorname{Var}=\dfrac{r}{r-2}$。所以 $t(2)$ 方差无穷，$t(3)$ 方差为 3 但四阶矩无穷。
- 正态、指数、Gamma、$\chi^2$、二项、泊松：尾部指数级或更快衰减，**所有阶矩都有限**，属于最"乖"的一类。

> **注意一个逻辑方向**：有限方差 $\Rightarrow$ 有限均值（由 Cauchy–Schwarz 可得 $E|X|\le\sqrt{E[X^2]}$）。所以讲义与板书写 "finite variance $\sigma^2$" 时，均值的存在性已经自动包含在内，不需要另外假设。

> **为什么这门课反复强调它**：因为 LLN 和 CLT **两条定理都以它为前提**，这不是凑字数的废话。LLN 的证明用 Chebyshev 不等式 $\Pr(|\bar X-\mu|>\varepsilon)\le\dfrac{\sigma^2}{n\varepsilon^2}$，右边要有意义，$\sigma^2$ 必须是有限数——方差无穷时"样本均值收敛到真实均值"可以直接不成立（例如 Cauchy 样本，$\bar X$ 的分布与单个 $X_1$ **完全相同**，平均一万次也不会更准）；CLT 的结论也会失效，尾部指数 $\alpha<2$ 时标准化后的和收敛到的是**稳定分布（stable distribution）**，形状不是钟形。实践上这意味着重尾数据（金融收益率、保险理赔额、城市人口）的**样本方差会一直"跳"、永远稳定不下来**，"均值 $\pm$ 2 倍标准差"这类描述也基本失效。

---

## 4. 离散分布（Discrete Distributions）

### 4.1 二项分布 Binomial($n, p$)

若 $X$ 的 PMF 为

$$\Pr(X = k) = \binom{n}{k}p^k(1-p)^{n-k}, \quad k = 0,1,\dots,n$$

则称 $X \sim \mathrm{Bin}(n, p)$，其中 $n \in \mathbb{N}$，$p \in (0,1)$。

$$E(X) = np, \qquad \operatorname{Var}(X) = np(1-p)$$

直觉：$n$ 次**独立**的伯努利试验（Bernoulli trial，每次成功概率 $p$）中"成功的总次数"。

### 4.2 泊松分布 Poisson($\lambda$)

$$\Pr(X = k) = \frac{\lambda^k}{k!}e^{-\lambda}, \quad k = 0,1,2,\dots$$

**矩母函数（MGF）**：$M_X(t) = E(e^{tX}) = \exp\!\big(\lambda(e^t - 1)\big),\; t \in \mathbb{R}$。

$$E(X) = \lambda, \qquad \operatorname{Var}(X) = \lambda$$

> **Poisson 的标志性特征**：**均值 = 方差**。如果你的计数数据里样本方差明显大于样本均值（over-dispersion 过度离散），说明 Poisson 假设可能不合适。这是后面建模时非常实用的一个诊断信号。

（讲义第 19 页的课堂提问"均值和方差是多少"，答案就是 $\lambda$ 与 $\lambda$；第 21 页给出用 MGF 的完整推导，见 4.4。）

### 4.3 矩母函数 MGF（Moment Generating Function）——本讲的方法论主角

**定义**：$M_X(t) = E\!\left(e^{tX}\right),\; t \in \mathbb{R}$。

- 连续型：$M_X(t) = \displaystyle\int_{-\infty}^{\infty} e^{tx}f_X(x)\,dx$
- 离散型：$M_X(t) = \displaystyle\sum_{x} e^{tx}p_X(x)$

**三条性质**：

1. $M_X(0) = E(e^0) = 1$（检验 MGF 算对了没有的最快办法）。
2. **若 $M_X(t)$ 在包含 0 的某个开区间内有限**（即存在 $h>0$ 使 $t\in(-h,h)$ 时有限），则 **$M_X$ 唯一决定 $X$ 的分布**。
3. 各阶矩就是它在 0 点的各阶导数（见下）。

**由 MGF 求矩**：若 $M_X$ 在 0 的邻域内存在且可导，则对 $k \ge 1$，

$$M_X^{(k)}(0) = \left.\frac{d^k}{dt^k}E\!\left(e^{tX}\right)\right|_{t=0} = E\!\left(X^k\right)$$

于是

$$E[X] = M_X'(0), \qquad \operatorname{Var}(X) = M_X''(0) - \big[M_X'(0)\big]^2$$

> **为什么叫"矩母函数"？** 因为它就是一台**生产矩（moment）的机器**。
> 看本质：$e^{tX}$ 的泰勒展开是 $\sum_{k\ge 0}\frac{(tX)^k}{k!}$，两边取期望得
> $$M_X(t) = \sum_{k\ge 0} \frac{E[X^k]}{k!}t^k$$
> 也就是说 **$E[X^k]$ 恰好是 $t^k$ 的系数乘以 $k!$**，所以求 $k$ 阶导再代 $t=0$ 就能把这一项"摘"出来。
>
> **为什么第 2 条这么重要？** 因为"唯一决定分布"给了我们一把万能钥匙：**想证明某个随机变量服从什么分布，只要算出它的 MGF，跟已知分布的 MGF 对上号就行了**。Gamma 的可加性（5.2 节）、Student 定理（第 8 节）都是这么证的。这也是为什么讲义里每个分布都特意列出 MGF。

### 4.4 用 MGF 求 Poisson 的矩（讲义第 21 页完整演示）

对 $X\sim\mathrm{Pois}(\lambda)$，$M_X(t) = \exp\!\big(\lambda(e^t-1)\big)$。逐次求导：

$$M_X'(t) = \lambda e^t M_X(t)$$
$$M_X''(t) = \lambda e^t M_X(t) + \lambda^2 e^{2t} M_X(t)$$

（第二式是乘积法则 + 链式法则：$(\lambda e^t M)' = \lambda e^t M + \lambda e^t\cdot \lambda e^t M$。）

令 $t = 0$，注意 $M_X(0)=1$、$e^0 = 1$：

$$M_X'(0) = \lambda, \qquad M_X''(0) = \lambda + \lambda^2$$

$$\Rightarrow\quad E(X) = \lambda,\qquad \operatorname{Var}(X) = (\lambda + \lambda^2) - \lambda^2 = \lambda$$

### 4.5 板书的离散分布族全景（讲义没有这一页）

讲堂板书用一整块板把"常见离散分布"排成了一张表，标题是 **Example distributions**，左上角先写了两个反复要用的通用公式：

$$E(X) = \text{（各分布不同）}, \qquad \boxed{\operatorname{Var}(X) = E(X^2) - \big[E(X)\big]^2}$$

也就是说整块板上的方差都统一用这个**计算式**（而不是定义式 $E[(X-EX)^2]$）来写。板书原文（已转成 LaTeX）：

$$
\text{(a) Discrete:}\quad
\begin{cases}
\mathrm{B}(\theta): & p_X(x) = \theta^x(1-\theta)^{1-x},\quad x\in\{0,1\},\ \theta\in(0,1) \\[4pt]
\mathrm{Bin}(n,\theta): & p_X(x) = \dbinom{n}{x}\theta^x(1-\theta)^{n-x},\quad x\in\{0,1,2,\ldots,n\} \\[4pt]
\mathrm{Geometric}(\theta): & p_X(x) = (1-\theta)^{x-1}\theta,\quad x = 1,2,\ldots \\[4pt]
\mathrm{NB}(\gamma,\theta): & p_X(x) = \dbinom{x-1}{\gamma-1}\theta^{\gamma}(1-\theta)^{x-\gamma},\quad x=\gamma,\gamma+1,\ldots \\[4pt]
\mathrm{Poisson}(\lambda): & p_X(x) = \dfrac{\lambda^x}{x!}e^{-\lambda},\quad x = 0,1,\ldots
\end{cases}
$$

板书在这组公式中间夹了一行**专门说明二项与伯努利的关系**：

$$\text{"If } x_1,\ldots,x_n \ \text{i.i.d.}\ \mathrm{B}(\theta) \ \Rightarrow\ \sum_{i=1}^n x_i \sim \mathrm{Bin}(n,\theta)\text{"}$$

逐条解读几个讲义没展开的点：

**（1）$\mathrm{B}(\theta)$ 就是 Bernoulli**，只是一次试验：取值只有 0 和 1，所以 $p_X(1)=\theta$、$p_X(0)=1-\theta$，写成 $\theta^x(1-\theta)^{1-x}$ 是把两个值压进一个公式。$E(X)=\theta$、$\operatorname{Var}(X)=\theta(1-\theta)$。

**（2）二项 = $n$ 个伯努利之和**。板书那一行"$\text{If }x_i\overset{iid}{\sim}\mathrm{B}(\theta)\Rightarrow\sum x_i\sim\mathrm{Bin}(n,\theta)$"不只是口号，它给了二项分布的均值和方差一个**不用算积分就能得到**的路子：

$$E\!\left(\sum_{i=1}^n X_i\right) = \sum_{i=1}^n E(X_i) = n\theta \quad\text{（期望的线性性，不需要独立）}$$
$$\operatorname{Var}\!\left(\sum_{i=1}^n X_i\right)\overset{\text{独立}}{=}\sum_{i=1}^n\operatorname{Var}(X_i) = n\theta(1-\theta)$$

这正好呼应了 §3.5 那句"期望的线性性不需要独立性"和 §3.6 那句"方差相加才需要独立"——板书把这条链子落到了具体分布上。

**（3）几何分布 Geometric($\theta$)——板书用的是"试验次数"版本**：

$$p_X(x) = (1-\theta)^{x-1}\theta,\quad x=1,2,\ldots$$

含义：**一直做伯努利试验，直到首次成功为止，总共做了多少次**。前 $x-1$ 次全失败（概率 $(1-\theta)^{x-1}$），第 $x$ 次成功（概率 $\theta$）。

$$E(X) = \frac1\theta, \qquad \operatorname{Var}(X) = \frac{1-\theta}{\theta^2}$$

> **最容易搞混的地方**：几何分布有两种定义，取决于 $x$ 数的是"试验次数"还是"失败次数"。
> - **数试验次数**（板书写法，$x=1,2,\ldots$）：$E[X] = 1/\theta$。
> - **数失败次数**（$x=0,1,\ldots$，有些教材用这个）：$p_X(x)=(1-\theta)^x\theta$，$E[X]=(1-\theta)/\theta$，两者期望差 1。
> 考试看到几何分布先确认是哪一种，差 1 会直接算错。

几何分布还有一个**无记忆性（memorylessness）**：已经失败了很多次，接下来还要等多少次的期望**不变**——和指数分布是同族的连续/离散对照。它与讲义 §5.1 的指数分布正好构成"离散版 / 连续版"的一对。

**（4）负二项分布 NB($\gamma,\theta$)**：几何分布的自然推广。

$$p_X(x) = \binom{x-1}{\gamma-1}\theta^{\gamma}(1-\theta)^{x-\gamma},\quad x=\gamma,\gamma+1,\ldots$$

含义：**一直做试验，直到累计成功 $\gamma$ 次为止，总共做了多少次**。前 $x-1$ 次里必须恰好有 $\gamma-1$ 次成功（这就是 $\binom{x-1}{\gamma-1}$），第 $x$ 次必须是成功（$\theta$），前 $x-1$ 次里的失败是 $(1-\theta)^{x-\gamma}$。

$$E(X) = \frac{\gamma}{\theta}, \qquad \operatorname{Var}(X) = \frac{\gamma(1-\theta)}{\theta^2}$$

注意 $\gamma=1$ 时它退化成几何分布（验证：$\binom{x-1}{0}=1$，公式变成 $(1-\theta)^{x-1}\theta$ ✓）。用"$n$ 个独立几何之和"也能看出这一点：**NB($\gamma,\theta$) 就是 $\gamma$ 个独立 Geometric($\theta$) 之和**——和板书在连续侧写的"Gamma = $k$ 个独立指数之和"（讲义 §5.2）是**完全平行的结构**。这也让期望的线性性直接给出 $E(X)=\gamma/\theta$。

**（5）离散分布族的构造逻辑**（把板书这张表读成一条线索）：

```
Bernoulli(θ)             一次试验，成功/失败
   │  n 次独立求和
   ├──→ Binomial(n, θ)            共 n 次里成功几次
   │
   │  成功 γ 次就停
   └──→ Negative Binomial(γ, θ)   做到第 γ 次成功为止共做几次
             │  γ = 1
             └──→ Geometric(θ)     做到首次成功为止共做几次
```

这四个分布本质上是**同一个伯努利试验的四种"停止规则 / 计数方式"**：数固定次数里的成功数 → 二项；数凑够若干成功所需的总次数 → 负二项；凑够 $\gamma=1$ 次 → 几何。Poisson 则是在另一个维度上（稀有事件、连续时间内计数）独立发展出来的极限情形。

---

## 5. 连续分布（Continuous Distributions）

### 5.1 指数分布 Exponential($\theta$)

$$f(x) = \frac{1}{\theta}e^{-x/\theta}, \quad x > 0 \qquad (\theta > 0)$$

$$M(t) = \frac{1}{1-\theta t}, \quad t < \frac{1}{\theta}$$

> **符号警告**：本教材用的是**尺度参数（scale）** $\theta$，即 $E(X)=\theta$，所以 $\theta$ 越大表示平均等待越久。很多其他教材写 $f(x) = \lambda e^{-\lambda x}$，那里 $\lambda$ 是**速率（rate）**，$\lambda = 1/\theta$。看公式时先确认是哪种写法，否则均值会算反。

**求矩**（回答讲义第 22 页的课堂提问）：

$$M'(t) = \theta(1-\theta t)^{-2} \Rightarrow M'(0) = \theta$$
$$M''(t) = 2\theta^2(1-\theta t)^{-3} \Rightarrow M''(0) = 2\theta^2$$

$$\boxed{E(X) = \theta,\qquad \operatorname{Var}(X) = 2\theta^2 - \theta^2 = \theta^2}$$

直觉：标准差 = 均值 = $\theta$，这是"无记忆性（memoryless）"等待时间的典型特征——已经等了 10 分钟，再等多久的期望仍然是 $\theta$，过去的时间不影响未来。

### 5.2 Gamma 分布 Gamma($\alpha, \theta$)

$$f(x) = \frac{1}{\Gamma(\alpha)\theta^{\alpha}}x^{\alpha-1}e^{-x/\theta}, \quad x > 0 \qquad (\alpha>0 \text{ 形状},\ \theta>0 \text{ 尺度})$$

$$M(t) = \frac{1}{(1-\theta t)^{\alpha}}, \quad t < \frac{1}{\theta}$$

$$E(X) = \alpha\theta, \qquad \operatorname{Var}(X) = \alpha\theta^2$$

（快速验证：$M'(0) = \alpha\theta$；$M''(0) = \alpha(\alpha+1)\theta^2$；故 $\operatorname{Var} = \alpha(\alpha+1)\theta^2 - \alpha^2\theta^2 = \alpha\theta^2$。$\checkmark$）

**两条关键联系**：

1. **包含指数分布**：$X \sim \mathrm{Exp}(\theta) \iff X \sim \mathrm{Gamma}(1,\theta)$。
2. **可加性**：若 $X_1 \sim \mathrm{Gamma}(\alpha_1,\theta)$，$X_2\sim\mathrm{Gamma}(\alpha_2,\theta)$ 且独立，则
   $$X_1 + X_2 \sim \mathrm{Gamma}(\alpha_1+\alpha_2,\ \theta)$$
   （用 MGF 秒证：$M_{X_1+X_2}(t) = M_{X_1}M_{X_2} = (1-\theta t)^{-(\alpha_1+\alpha_2)}$，正好是 Gamma($\alpha_1+\alpha_2,\theta$) 的 MGF，再由"MGF 唯一决定分布"得证——这就是 4.3 节那把钥匙的用法。）
   **注意**：可加性要求**尺度参数 $\theta$ 相同**，形状参数可以不同。

> **直觉**：若"两个事件之间的间隔"服从 $\mathrm{Exp}(\theta)$，那么"等到第 $k$ 个事件发生"的总时间就是 $k$ 个这样的间隔之和 $\sim \mathrm{Gamma}(k,\theta)$。**Gamma 就是"多次等待的累加"**，这也是下面那道应用题的建模逻辑。

### 5.3 卡方分布 Chi-square $\chi^2(r)$

定义：自由度为 $r$（正整数）的卡方分布，就是 $\alpha = r/2,\ \theta = 2$ 的 Gamma 分布，即 $\chi^2(r) \equiv \mathrm{Gamma}(r/2,\ 2)$。

$$f(x) = \frac{1}{\Gamma(r/2)\,2^{r/2}}x^{r/2-1}e^{-x/2}, \quad x>0$$

$$M(t) = \frac{1}{(1-2t)^{r/2}}, \quad t < \frac12$$

$$E(X) = r, \qquad \operatorname{Var}(X) = 2r$$

（直接套 Gamma 公式：$E = \alpha\theta = (r/2)\cdot 2 = r$；$\operatorname{Var} = \alpha\theta^2 = (r/2)\cdot 4 = 2r$。$\checkmark$）

> **它从哪来？** 若 $Z_1,\dots,Z_r$ 独立且都服从 $N(0,1)$，则 $\sum_{i=1}^r Z_i^2 \sim \chi^2(r)$。**卡方 = 标准正态的平方和**。这一点在 5.4 节的定理 8 和第 8 节 Student 定理里会被反复用到。

### 5.4 正态分布 Normal $N(\mu,\sigma^2)$

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\!\left[-\frac{(x-\mu)^2}{2\sigma^2}\right], \quad -\infty < x < \infty$$

$$M(t) = e^{\mu t + \frac12\sigma^2 t^2}, \quad t \in \mathbb{R}$$

$$E(X) = \mu, \qquad \operatorname{Var}(X) = \sigma^2$$

$Z \sim N(0,1)$ 称为**标准正态（standard normal）**。

**两条定理（教材 Thm 3.3-1 / 3.3-2）**：

- **定理 7**：若 $X \sim N(\mu,\sigma^2)$，则 $Z = \dfrac{X-\mu}{\sigma} \sim N(0,1)$。（标准化）
- **定理 8**：若 $X \sim N(\mu,\sigma^2)$，则 $Z^2 = \dfrac{(X-\mu)^2}{\sigma^2} \sim \chi^2(1)$。（平方后变卡方，自由度 1）

> 定理 8 就是"卡方 = 正态平方"的**单个**版本。把它和 5.2 的 Gamma 可加性合起来（$\chi^2(1)+\dots+\chi^2(1) = \chi^2(r)$），就得到 5.3 的结论。这条链路串起来看，整个分布族是一张网，而不是一堆孤立的公式。

### 5.5 Student t 分布

$$T := \frac{Z}{\sqrt{U/r}}, \quad Z \sim N(0,1),\ U \sim \chi^2(r),\ Z \text{ 与 } U \text{ 独立} \ \Longrightarrow\ T \sim t(r)$$

> **为什么需要它？** 标准化需要 $\sigma$，但现实中 $\sigma$ **几乎总是未知的**，只能用样本标准差 $S$ 顶上。一旦用估计的 $S$ 代替真实的 $\sigma$，统计量就**不再是标准正态**了，而是 t 分布——它的**尾部更厚（heavier tails）**，临界值更大，置信区间更宽。多出来的那部分宽度，就是在为"$\sigma$ 是我猜的"这件事付保险费。$r$ 越大，t 越接近正态（$r\to\infty$ 时就是 $N(0,1)$）。

### 5.6 F 分布

$$F := \frac{U/r_1}{V/r_2}, \quad U\sim\chi^2(r_1),\ V\sim\chi^2(r_2),\ U,V \text{ 独立} \ \Longrightarrow\ F \sim F(r_1, r_2)$$

用途：**比较两个方差**（两个卡方各自除以自由度再相除）。后面做方差分析（ANOVA）和回归的整体显著性检验时，检验统计量就是 F。

### 5.7 分布族关系一图流

```
Bernoulli(θ) ×n 次独立求和 → Binomial(n, θ)  --n 大-->  Normal(nθ, nθ(1-θ))   [CLT]
稀有事件的计数极限                          →  Poisson(λ)
Poisson 过程的间隔时间                      →  Exponential(θ) = Gamma(1, θ)
k 个指数间隔之和（可加性）                  →  Gamma(k, θ)
Gamma 的特例 (r/2, 2)                       →  χ²(r)
标准正态的平方和                            →  χ²(r)   [与上式同一对象]
标准正态 / √(卡方/自由度)                   →  t(r)
两个卡方/自由度 之比                        →  F(r₁, r₂)
```

### 5.8 板书的连续分布族全景与参数化（讲义没有这一页）

板书在 (a) Discrete 的右边并列写了 **(b) Continuous**，把连续分布排成另一张表，并且在 Exponential / Gamma 之间画了三处**参数对应标记**——这块是讲义完全没有的，也是本讲最容易混淆的地方，值得逐字读：

$$
\text{(b) Continuous:}\quad
\begin{cases}
N(\mu,\sigma^2): & f_X(x) = \dfrac{1}{\sqrt{2\pi}\,\sigma}\exp\!\left[-\dfrac{(x-\mu)^2}{2\sigma^2}\right] \\[10pt]
\mathrm{Exp}(\theta): & f_X(x) = \dfrac{1}{\theta}e^{-x/\theta},\quad \theta>0,\ x>0 \\[8pt]
\mathrm{Exp}(\lambda): & f_X(x) = \lambda e^{-\lambda x},\quad \lambda>0,\ x>0 \\[10pt]
\mathrm{Gamma}(\alpha,\beta): & f_X(x) = \dfrac{1}{\Gamma(\alpha)\beta^{\alpha}}x^{\alpha-1}e^{-x/\beta}
\end{cases}
$$

板书在 $\mathrm{Exp}(\theta)$ 与 $\mathrm{Exp}(\lambda)$ 之间画了一个**双向箭头**，两端分别标注：

$$\lambda = \frac1\theta \qquad\Longleftrightarrow\qquad \theta = \frac1\lambda$$

也就是：**这两种写法描述的是同一个分布，只是一个用尺度（scale）、一个用速率（rate）。** 这是本页最需要记住的一句话。

**（1）为什么同分布会有两套参数**——两种参数化的完整对照：

| | 尺度参数化（scale） | 速率参数化（rate） |
| --- | --- | --- |
| 密度 | $f(x) = \dfrac{1}{\theta}e^{-x/\theta}$ | $f(x) = \lambda e^{-\lambda x}$ |
| 参数含义 | $\theta$ = 平均等待时间 | $\lambda$ = 单位时间发生次数 |
| 均值 | $E(X) = \theta$ | $E(X) = 1/\lambda$ |
| 方差 | $\operatorname{Var}(X) = \theta^2$ | $\operatorname{Var}(X) = 1/\lambda^2$ |
| 本课程用 | ✅ 讲义 §5.1 用的就是这个 | 板书圈出、R 里 `dexp(x, rate=)` 用它 |

**判断口诀**：看指数上的系数。$e^{-x/\theta}$ 里 $x$ 被**除**（分母是 $\theta$）→ $\theta$ 是尺度，均值就是 $\theta$；$e^{-\lambda x}$ 里 $x$ 被**乘**（系数是 $\lambda$）→ $\lambda$ 是速率，均值是 $1/\lambda$。**看错这一处，均值会算成倒数，全题崩盘。**

> **为什么两个都要学**：R 的 `dexp(x, rate)` / `pexp(q, rate)` 默认参数名就叫 `rate`（即 $\lambda$），而本课程讲义、教材 Hogg 一直用 $\theta$。做作业时把讲义公式往 R 里搬，**必须自己换算**——例如讲义说 $\theta=2$，R 里要写 `rate = 1/2`。（在 `Lec2_Covid.pdf` 的等待时间例题里就会遇到这个换算。）

**（2）Gamma 的参数化：板书用的是 $(\alpha,\beta)$ 而不是 $(\alpha,\theta)$**

板书写的 Gamma 密度是

$$f_X(x) = \frac{1}{\Gamma(\alpha)\beta^{\alpha}}x^{\alpha-1}e^{-x/\beta}$$

而讲义 §5.2 用的是 $\theta$：

$$f_X(x) = \frac{1}{\Gamma(\alpha)\theta^{\alpha}}x^{\alpha-1}e^{-x/\theta}$$

**这两行完全一样，只是把 $\theta$ 换成了 $\beta$——即 $\beta = \theta$，都是尺度参数。** 板书在 Gamma 公式下方标了两个字 **"shape"**（指 $\alpha$）和 **"scale"**（指 $\beta$），这个标注很重要：它把"哪个是形状参数、哪个是尺度参数"钉死了。

> 这里有个**术语陷阱**：Gamma 分布在不同教材/软件里的参数名五花八门，常见的有三种：
> - $(\alpha, \theta)$：形状、尺度 —— **本课程讲义**；
> - $(\alpha, \beta)$：形状、尺度 —— **板书**（$\beta = \theta$）；
> - $(k, \lambda)$ 或 $(\alpha, \beta)$：形状、**速率** —— numpy `random.gamma(shape, scale)` 用 scale；R 的 `dgamma(x, shape, rate)` 默认 `rate`（可以显式传 `scale=`），SciPy `gamma(a, scale=)` 用 scale。
>
> **同一个希腊字母 $\beta$ 在板书里是尺度、在另一些教材里是速率**，这是最阴险的一处。判据同样是看指数上 $x$ 是被除还是被乘。

**（3）板书把 Exponential 画成了 Gamma 的特例**：板书的箭头结构是

$$\mathrm{Exp} \ \xrightarrow{\ \alpha=1\ }\ \mathrm{Gamma}(\alpha,\beta)$$

因为把 $\alpha=1$ 代入 Gamma 密度：

$$f(x) = \frac{1}{\Gamma(1)\beta^{1}}x^{1-1}e^{-x/\beta} = \frac{1}{\beta}e^{-x/\beta}$$

正好就是尺度参数为 $\beta$ 的指数分布（$\Gamma(1)=0!=1$）。这与讲义 §5.2 的"$\mathrm{Exp}(\theta)\iff\mathrm{Gamma}(1,\theta)$"是同一个结论，板书用箭头把它画得更直观了。

**（4）板书在 Gamma 那一行右侧还标了 $\chi^2(r)$**（板书 Gamma 公式右侧有 "$\chi^2(r)$" 的标记），指向的是讲义的结论：**卡方就是 Gamma 取 $\alpha=r/2$、$\beta=2$ 的特例**，即 $\chi^2(r)\equiv\mathrm{Gamma}(r/2,2)$。所以板书这张连续表实际上是一条**"套娃"链**：

$$N(\mu,\sigma^2) \ \longrightarrow\ \mathrm{Exp} \ \xrightarrow{\alpha=1}\ \mathrm{Gamma}(\alpha,\beta) \ \xrightarrow{\alpha=r/2,\ \beta=2}\ \chi^2(r)$$

**（5）板书连续部分最下面还写了两行 MGF 的具体算例**，这里一并给出（讲义只在 §5.4 给了正态的 MGF 结果）：

**正态分布的 MGF**（板书原文）：

$$M_X(t) = \exp\!\left(\mu t + \frac{\sigma^2t^2}{2}\right), \qquad t\in\mathbb{R}$$

（这与讲义 §5.4 的 $e^{\mu t+\frac12\sigma^2t^2}$ 是同一个式子，只是把 $\frac12\sigma^2t^2$ 写成了 $\frac{\sigma^2t^2}{2}$。）

**指数分布的 MGF 完整推导**（板书从定义一路算到结果）：

$$M_X(t) = E(e^{tX}) = \int_0^\infty e^{tx}\cdot\frac1\theta e^{-x/\theta}\,dx = \frac1\theta\int_0^\infty e^{-(1/\theta-t)x}\,dx = \frac{1/\theta}{1/\theta - t} = \frac{1}{1-\theta t}, \quad t<\frac1\theta$$

**这一步值得慢看**：被积函数是 $e^{-(1/\theta - t)x}$，只要 $1/\theta - t > 0$（即 $t < 1/\theta$）它就是一个收敛的指数积分，直接套 $\int_0^\infty e^{-ax}dx = 1/a$（这里 $a = 1/\theta-t$）就得到 $\frac{1/\theta}{1/\theta-t}$，分子分母同乘 $\theta$ 即得 $\frac{1}{1-\theta t}$。

> **这个 $t<1/\theta$ 的收敛条件不是装饰**：它正是 §4.3 那条"MGF 要在包含 0 的开区间内有限，才唯一决定分布"的具体体现。$t=1/\theta$ 处这个积分会发散，所以有效区间只能是 $(-\infty, 1/\theta)$。所有分布列 MGF 时后面跟的那个范围，说的都是这件事。

**Poisson 的 MGF 推导**（板书把求和号一步步化简）：

$$M_X(t) = \sum_{x=0}^{\infty}e^{tx}\cdot\frac{\lambda^x}{x!}e^{-\lambda} = e^{-\lambda}\sum_{x=0}^{\infty}\frac{(\lambda e^t)^x}{x!} = e^{-\lambda}\cdot e^{\lambda e^t} = e^{\lambda(e^t-1)},\qquad t\in\mathbb{R}$$

**中间那一步的技巧是通法**：把 $e^{tx}\lambda^x$ 合并成 $(\lambda e^t)^x$，然后**认出 $\sum_{x\ge0}\frac{a^x}{x!}=e^a$ 这条泰勒展开**（取 $a=\lambda e^t$），求和号就消失了。凡是用 MGF 处理离散分布，几乎都要靠"把求和式凑成某个已知泰勒级数"。和上面指数分布的"凑成指数积分"是同一思路——**MGF 的计算本质就是把定义式凑回已知级数/积分**。

**（6）板书还写下了 Poisson 的矩结果**：

$$\text{Poisson:}\quad E(X) = \lambda,\qquad \operatorname{Var}(X) = \lambda$$

（推导见 §4.4，用 $M_X'(0)$ 与 $M_X''(0)$。）板书另外还标了 $M_X(0)=1$、$E(X^k)=\left.\dfrac{d^{(k)}M_X(t)}{dt^k}\right|_{t=0}$ 这两行通用性质，即 §4.3 的内容。

---

## 6. 应用例题：等待时间（讲义第 25 页）

**题目**：某商店每小时的顾客到达数服从均值 30 的 Poisson 过程。也就是说，任意两位顾客之间的等待时间（分钟）服从指数分布，参数 $\theta = \dfrac{1}{30/60} = 2$。问：店主要等**超过 5 分钟**才等到**前两位顾客**都到达的概率是多少？

**建模**：30 人/小时 = 0.5 人/分钟，所以平均间隔 = $1/0.5 = 2$ 分钟，即 $\theta = 2$（尺度参数）。

设 $X$ = 到第 2 位顾客到达为止的等待时间（分钟）。由 5.2 的直觉，$X$ 是 2 个独立的 $\mathrm{Exp}(2)$ 间隔之和，故

$$X \sim \mathrm{Gamma}(\alpha=2,\ \theta=2)$$

**计算**：代入 Gamma 的 PDF，注意 $\Gamma(2) = 1! = 1$：

$$\Pr(X>5) = \int_5^\infty \frac{x^{2-1}e^{-x/2}}{\Gamma(2)\,2^2}\,dx = \int_5^\infty \frac{x e^{-x/2}}{4}\,dx$$

先求不定积分（分部积分，或验证导数）：

$$\int x e^{-x/2}\,dx = -(2x+4)e^{-x/2} + C$$

代入上下限（$x\to\infty$ 时该项 $\to 0$）：

$$\Pr(X>5) = \frac{1}{4}\Big[0 - \big(-(2\cdot 5 + 4)e^{-5/2}\big)\Big] = \frac{14}{4}e^{-5/2} = \frac72 e^{-5/2} \approx 0.287$$

**解读**：大约 **28.7%** 的概率，两位顾客在 5 分钟内还没到齐。合理性检验：平均每位顾客间隔 2 分钟，两位就是 4 分钟；要等超过 5 分钟，只是比平均值多一点点，发生概率接近三成是完全合理的——这也体现了指数/Gamma 分布**右偏**的特点（均值右侧拖着长尾）。

---

## 7. 两大极限定理（Two Limit Theorems）

### 7.1 大数定律 LLN（Law of Large Numbers，教材 §5.8）

设 $X_1,X_2,\dots,X_n$ **独立同分布（i.i.d.）**，公共均值 $\mu$，有限方差 $\sigma^2$，$\bar X = \frac1n\sum_{i=1}^n X_i$。则对**任意** $\varepsilon > 0$，

$$\lim_{n\to\infty}\Pr\big(|\bar X - \mu| > \varepsilon\big) = 0$$

称 $\bar X$ **依概率收敛（converges in probability）**于 $\mu$。

> 人话：只要重复得足够多，平均值会越来越贴近真实期望值。
> **LLN 没说的事**：它只保证"$\bar X$ 落在 $\mu$ 附近"的概率趋于 1，**没有**告诉你偏离量有多大、误差服从什么分布。补上这个空缺的，就是下面的 CLT。

### 7.2 中心极限定理 CLT（Central Limit Theorem，教材 Thm 5.6-1）

同样条件下，$W = \dfrac{\bar X - \mu}{\sigma/\sqrt{n}} = \dfrac{\sum_{i=1}^n X_i - n\mu}{\sqrt{n}\,\sigma}$ 的分布，在 $n\to\infty$ 时趋于 $N(0,1)$。称 $W$ **依分布收敛（converges in distribution）**到标准正态。

> **LLN vs CLT，一句话分清**：
> - **LLN 管"收敛到哪儿"**：$\bar X \to \mu$（点估计的相合性 consistency）。
> - **CLT 管"误差多大、长什么样"**：误差尺度是 $\sigma/\sqrt{n}$，形状是正态。
>
> 标准误 $\sigma/\sqrt n$ 是统计学的灵魂数字：**要把精度提高 10 倍，样本量得扩大 100 倍**。
>
> 还要注意：CLT **不要求原始数据是正态的**——不管总体长什么样（只要方差有限），样本均值的分布都会趋向正态。这就是为什么正态分布在统计里无处不在。

### 7.3 CLT 用于二项分布（De Moivre–Laplace 近似）

设 $X_1,X_2,\dots$ i.i.d. $\sim \mathrm{Bernoulli}(\theta)$，$E(X_i)=\theta$，$\operatorname{Var}(X_i)=\theta(1-\theta)$。则 $Y_n = \sum_{i=1}^n X_i \sim \mathrm{Bin}(n,\theta)$（**二项 = n 个伯努利之和**，天然满足 CLT 的前提）。

标准化后当 $n\to\infty$：

$$\frac{Y_n - EY_n}{\sqrt{\operatorname{Var}(Y_n)}} = \frac{Y_n - n\theta}{\sqrt{n\theta(1-\theta)}} \xrightarrow{d} N(0,1)$$

因此任意 $y$：

$$\Pr(Y_n \le y) \approx \Phi\!\left(\frac{y - n\theta}{\sqrt{n\theta(1-\theta)}}\right)$$

其中 $\Phi$ 是 $N(0,1)$ 的 CDF。

> 实用经验规则（**讲义未给出，属于常用补充**）：当 $n\theta \ge 5$ 且 $n(1-\theta) \ge 5$ 时，正态近似质量较好；$\theta$ 越接近 0.5、$n$ 越大，近似越准。$\theta$ 极小且 $n$ 很大时，应改用 Poisson 近似。

### 7.4 半单位修正 / 连续性修正（Half-unit / Continuity Correction）

**为什么需要**：拿连续的正态去近似离散的二项/泊松时，离散分布在**单个整数** $k$ 上的概率，在连续世界里对应的是**宽度为 1 的区间** $[k-0.5,\, k+0.5]$。所以要把整数边界**向外扩半格**，近似才准。

设 $X$ 近似服从 $N(\mu,\sigma^2)$，$\Phi$ 为标准正态 CDF，则：

$$\Pr(X \le x) \approx \Phi\!\left(\frac{x + 0.5 - \mu}{\sigma}\right)$$
$$\Pr(X \ge x) \approx 1 - \Phi\!\left(\frac{x - 0.5 - \mu}{\sigma}\right)$$
$$\Pr(a \le X \le b) \approx \Phi\!\left(\frac{b + 0.5 - \mu}{\sigma}\right) - \Phi\!\left(\frac{a - 0.5 - \mu}{\sigma}\right)$$

> 记忆口诀：**下界减 0.5，上界加 0.5**——始终把区间"撑大"半格，把端点那个整数完整地包进来。

### 7.5 例题（讲义第 35 页）

**题目**：一枚偏置硬币，正面概率 $\theta = 0.6$，掷 $n = 1000$ 次。近似计算"正面数至少 550 且不超过 625"的概率。

设 $Y \sim \mathrm{Bin}(1000, 0.6)$。

$$E(Y) = 1000\times 0.6 = 600,\qquad \operatorname{Var}(Y) = 1000\times 0.6\times 0.4 = 240,\qquad \sigma = \sqrt{240}\approx 15.4919$$

**加连续性修正**（550 是下界 → 减 0.5；625 是上界 → 加 0.5）：

$$\Pr(550 \le Y \le 625) \;\to\; \Pr(549.5 \le Y \le 625.5)$$

标准化：

$$\frac{549.5 - 600}{\sqrt{240}} = \frac{-50.5}{15.4919} = -3.2598, \qquad \frac{625.5 - 600}{\sqrt{240}} = \frac{25.5}{15.4919} = 1.6460$$

$$\Pr(550 \le Y \le 625) \approx \Pr(-3.2598 \le Z \le 1.6460) = \Phi(1.6460) - \Phi(-3.2598) \approx 0.9501 - 0.0006 \approx 0.9496$$

**结论**：约 **94.96%**。合理性检验：期望 600 次正面，区间 [550, 625] 把均值包住了，且上界只比均值高约 1.65 个标准差、下界低了 3.26 个标准差，所以概率主要由下界一侧贡献——几乎全部质量都落在区间内，得到 95% 是合理的。

### 7.6 板书补充：LLN 与 CLT 的"现场演示"（讲义完全没有）

板书在下半块用**同一批掷骰子实验**把 LLN 和 CLT 一起演示了一遍。这块内容的价值在于：它让两条极限定理从"抽象记号"变成"看得见的图"。

**（1）实验设定：掷骰子（uniform）**

板书右侧画了一排骰子点数：

```
n = 1:   ▊▊▊▊▊▊          ← 只有 1 个点，完全看不出形状
n = 5:   ▊▊ ▊▊▊▊▊▊        ← 5 个数求平均，开始向中间靠
n = 10:  ▊▊ ▊▊▊▊          ← 更集中
n = 1000:    ⌒            ← 一个漂亮的钟形
```

板书左侧标注了三种情形：$n=1$（就是 $\bar x = x_1$，原样）、$n=5$（$\bar x = \dfrac{x_1+x_2+\cdots+x_5}{5}$）、以及 $n=10$、$n=1000$。板书画的箭头指向"**uniform**"，说明原始总体是均匀分布（骰子）。

**（2）这张图同时讲了两件事**

- **LLN 的部分**：随着 $n$ 增大，$\bar X$ 的分布**越来越往中间 $\mu=3.5$ 收缩**——分布的宽度（波动）在变小，最终塌缩到常数 $\mu$。这就是 $\bar X \xrightarrow{P}\mu$ 的可视化：**不是"某一个 $\bar x$ 更准了"，而是"$\bar X$ 这个随机变量的分布整体变窄了"。**
- **CLT 的部分**：注意 $n=1$ 时分布是"平的"（均匀，完全不像正态），但 $n$ 增大后**形状变成钟形**。这正好印证 §7.2 那句"CLT 不要求原始数据是正态的"——**原始总体是均匀分布，照样收敛到正态。**

**（3）板书在左侧写下的 LLN 正式表述**

$$\bar x = \frac1n\sum_{i=1}^n x_i, \qquad x_1,\ldots,x_n \ \ i.i.d.\ \ \text{same }\mu,\ \text{finite }\sigma^2$$

$$\bar X \xrightarrow[n\to\infty]{}\ \mu \qquad\Longleftrightarrow\qquad \forall\varepsilon>0:\ \lim_{n\to\infty}\Pr\big(|\bar X-\mu|>\varepsilon\big) = 0$$

> **注意板书把 $x_i$（观测值，小写）与 $\bar X$（随机变量，大写）分开写**，这是一个值得学的记号习惯：小写表示"已经实现的数据"，大写表示"还没实现、仍有随机性的量"。LLN 说的是**大写 $\bar X$ 的概率行为**（一个关于随机变量的陈述），不是"这批数据的平均值等于 $\mu$"。这也是第 2 讲区分"估计量（estimator，随机变量）"与"估计值（estimate，一个数）"的起点。

**（4）板书右下角的 Student 定理框**（与学生定理那节互补）

板书单独框出了一个式子，把 Student 定理的"输入"和"输出"画在一起：

$$T = \frac{\dfrac{\bar X-\mu}{\sigma/\sqrt n}\ \sim N(0,1)}{\sqrt{\dfrac{(n-1)S^2}{\sigma^2}\Big/(n-1)}} \quad\Longrightarrow\quad t(n-1)$$

框内还写了 $\dfrac{(n-1)S^2}{\sigma^2}$ 这一项，对应 $\chi^2(n-1)$。**这个框等于把 §8.6 那两段小推导的结论直接摆在一起**：分子是标准正态，分母根号里是"卡方除以自由度"，一相除就是 $t$。板书用框把它圈起来，说明这是整节课的落点。

---

## 8. Student 定理（Student's Theorem）——本讲的收官定理

设 $X_1,\dots,X_n$ i.i.d. $\sim N(\mu, \sigma^2)$。定义

$$\bar X := \frac1n\sum_{i=1}^n X_i, \qquad S^2 := \frac{1}{n-1}\sum_{i=1}^n (X_i - \bar X)^2$$

则：

1. $\bar X \sim N\!\left(\mu,\ \dfrac{\sigma^2}{n}\right)$
2. **$\bar X$ 与 $S^2$ 相互独立**
3. $\dfrac{(n-1)S^2}{\sigma^2} \sim \chi^2(n-1)$
4. $T = \dfrac{\bar X - \mu}{S/\sqrt{n}} \sim t(n-1)$

**逐条解读**：

- **结论 1**：样本均值也是正态，但方差缩小到 $\sigma^2/n$，标准差 $\sigma/\sqrt n$。这就是"平均能降噪"的精确版本，也是 CLT 在正态情形下的**精确**结论（不需要 $n\to\infty$）。
- **结论 2**：这是**正态分布独有**的极强性质——"中心位置"（$\bar X$）和"离散程度"（$S^2$）在正态样本里携带的信息**完全独立**。直觉上很反常识（$S^2$ 明明是用 $\bar X$ 算出来的），但正是它让结论 4 成立。换成别的分布一般不再独立。
- **结论 3**：**为什么自由度是 $n-1$？** 因为 $n$ 个偏差 $(X_i - \bar X)$ 并不自由：它们满足一个约束 $\sum_{i=1}^n (X_i - \bar X) = 0$。知道其中任意 $n-1$ 个，最后一个就被自动确定。所以**真正能自由变动的只有 $n-1$ 个**。
  这也解释了 $S^2$ 的分母为什么是 $n-1$ 而不是 $n$：只有除以 $n-1$，才有 $E[S^2] = \sigma^2$（**无偏估计**）。若除以 $n$，会系统性低估方差。

- **结论 4（把前三条拼起来）**：
  - 由结论 1，$Z = \dfrac{\bar X - \mu}{\sigma/\sqrt n} \sim N(0,1)$；
  - 由结论 3，$U = \dfrac{(n-1)S^2}{\sigma^2} \sim \chi^2(n-1)$；
  - 由结论 2，$Z$ 与 $U$ **独立**；
  - 套用 t 分布的定义（5.5 节）：
    $$\frac{Z}{\sqrt{U/(n-1)}} = \frac{\dfrac{\bar X-\mu}{\sigma/\sqrt n}}{\sqrt{\dfrac{(n-1)S^2}{\sigma^2}\cdot\dfrac{1}{n-1}}} = \frac{\dfrac{\bar X-\mu}{\sigma/\sqrt n}}{S/\sigma} = \frac{\bar X - \mu}{S/\sqrt n} \sim t(n-1)$$
    $\sigma$ 在这个比值里**被完全约掉了**——这正是关键：$\sigma$ 未知也没关系。

> **Student 定理的意义**：它把"$ \sigma$ 已知时用 $Z$ 检验"升级成"$ \sigma$ 未知时用 $t$ 检验"，是后续**单样本/两样本 t 检验与 t 置信区间**的全部理论基础。$t(n-1)$ 比 $N(0,1)$ 尾部更厚 ⇒ 临界值更大 ⇒ 区间更宽，多出来的宽度就是"用 $S$ 估计 $\sigma$"付出的代价；$n$ 增大时 $t(n-1) \to N(0,1)$，代价逐渐消失。

### 8.6 板书补充：Student 定理的"构造逻辑"与 $\chi^2(1)$ 的来历

板书把 Student 定理的证明拆成了**两段独立的小推导**，比讲义"直接宣布结论 4"更清楚地交代了"$t$ 是怎么被造出来的"。这是讲义完全没有的内容。

**第一段：从 $X\sim N(\mu,\sigma^2)$ 造出 $N(0,1)$（= 讲义的定理 7，但板书用 MGF 证）**

板书先写下分布函数的等价变换：

$$\Pr\!\left\{\frac{X-\mu}{\sigma}\le y\right\} = \Pr\{X\le \sigma y+\mu\} = F_X(\sigma y+\mu)$$

然后改走 MGF 路线，设 $Z = \dfrac{X-\mu}{\sigma}$：

$$M_Z(t) = E\!\left(e^{tZ}\right) = E\!\left(e^{\frac{t}{\sigma}(X-\mu)}\right) = e^{-\frac{\mu t}{\sigma}}\cdot E\!\left(e^{\frac{t}{\sigma}X}\right) = e^{-\frac{\mu t}{\sigma}}\cdot M_X\!\left(\frac t\sigma\right)$$

代入正态的 MGF $M_X(s) = \exp\!\left(\mu s + \dfrac{\sigma^2s^2}{2}\right)$，取 $s = t/\sigma$：

$$M_Z(t) = \exp\!\left(-\frac{\mu t}{\sigma}\right)\cdot\exp\!\left(\mu\cdot\frac t\sigma + \frac{\sigma^2}{2}\cdot\frac{t^2}{\sigma^2}\right) = \exp\!\left(-\frac{\mu t}{\sigma} + \frac{\mu t}{\sigma} + \frac{t^2}{2}\right) = \exp\!\left(\frac{t^2}{2}\right)$$

$$\Rightarrow\quad Z\sim N(0,1) \qquad\blacksquare$$

> **这条推导把"标准化为什么有效"讲透了**：$-(\mu t/\sigma)$ 与 $+(\mu t/\sigma)$ 精确抵消，$\sigma^2$ 在 $\sigma^2/\sigma^2$ 里也被约掉，最后只剩 $\exp(t^2/2)$——**没有任何 $\mu,\sigma$ 残留**，所以不管原来的正态长什么样，标准化之后都变成同一个标准正态。这也再次演示了 §4.3 那把钥匙：**算出 MGF，跟已知分布对上号，证明就完了。**

**第二段：从 $Z\sim N(0,1)$ 造出 $\chi^2(1)$（= 讲义的定理 8，但板书真的把积分算了）**

板书写 $Y = Z^2$，用定义式直接积分求它的 MGF：

$$M_Y(t) = E\!\left(e^{tZ^2}\right) = \int_{-\infty}^{\infty}\frac{1}{\sqrt{2\pi}}e^{tz^2}\cdot e^{-\frac{z^2}{2}}\,dz = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}\exp\!\left[-\left(\frac{1}{2}-t\right)z^2\right]dz$$

合并指数：$tz^2 - \dfrac{z^2}{2} = -\left(\dfrac12-t\right)z^2$。把 $\left(\dfrac12-t\right)$ 记作 $a$（在 $t<\frac12$ 时 $a>0$），用高斯积分 $\displaystyle\int_{-\infty}^{\infty}e^{-az^2}dz = \sqrt{\frac{\pi}{a}}$：

$$M_Y(t) = \frac{1}{\sqrt{2\pi}}\cdot\sqrt{\frac{\pi}{\frac12-t}} = \frac{1}{\sqrt{2}\sqrt{\frac12-t}} = \frac{1}{\sqrt{1-2t}}$$

$$\Rightarrow\quad M_Y(t) = (1-2t)^{-1/2} \quad\Longleftrightarrow\quad \chi^2(1) \qquad\blacksquare$$

> **这一步的关键是"认出来"**：$(1-2t)^{-1/2}$ 正是 $\chi^2(r)$ 的 MGF $(1-2t)^{-r/2}$ 在 $r=1$ 时的样子。所以 $Z^2\sim\chi^2(1)$。板书在末尾特意用箭头标出 $\Longleftrightarrow\ \chi^2(1)$，就是这个意思。
>
> **顺带解决了一个疑问**：为什么 $z^2$ 的积分能用上 $\int e^{-az^2}dz=\sqrt{\pi/a}$？因为把 $tz^2$ 和 $-z^2/2$ 合并之后，$z^2$ 的**系数还是负的**（只要 $t<1/2$），形状仍是一个高斯积分。**$t<1/2$ 这个范围不是随便写的**——它保证系数为正、积分收敛，和 §4.3"要有包含 0 的开区间"完全对应（$t=1/2$ 是这条边界）。

**把两段拼起来就是 Student 定理结论 4 的构造过程**（这也正是板书右侧 Student 定理框里那个式子的来历）：

$$T = \frac{\overbrace{\dfrac{\bar X-\mu}{\sigma/\sqrt n}}^{\text{第一段：}\sim N(0,1)}}{\sqrt{\underbrace{\dfrac{(n-1)S^2}{\sigma^2}\Big/(n-1)}_{\text{第二段：}\sim\chi^2(n-1)}}} \sim t(n-1)$$

板书把分子标为 $N(0,1)$，把分母根号里那块标为卡方，最后写上 $\Rightarrow t(n-1)$。

### 8.7 板书补充：条件分布与全期望/全方差公式（$X, Y$ 一块）

板书左侧有一整块以 $(X,Y)$ 开头的联合分布内容，**讲义里完全没有**。这块内容看起来像是"插播"，但它其实是 Student 定理结论 2（$\bar X$ 与 $S^2$ 独立）的**理论工具**，也是下一阶段（Ch.6 及之后）反复要用的基础设施，所以放在这一节。

**（1）联合分布与边际分布**

| | 离散 | 连续 |
| --- | --- | --- |
| 联合 | $p(x,y) = \Pr(X=x, Y=y)$ | $f(x,y)$（联合密度） |
| 边际 | $p_X(x) = \sum_y p(x,y)$ | $f_X(x) = \int f(x,y)\,dy$ |

**（2）条件分布——板书的核心内容**

$$p_{X\mid Y}(x\mid y) = \Pr(X=x\mid Y=y) = \frac{\Pr(X=x, Y=y)}{\Pr(Y=y)} = \frac{p(x,y)}{p_Y(y)}$$
$$f_{X\mid Y}(x\mid y) = \frac{f(x,y)}{f_Y(y)} = \frac{f(x,y)}{\displaystyle\int f(x,y)\,dx}$$

**这就是条件分布的统一定义**：把联合分布"切一刀"固定在 $Y=y$ 上，再**除以 $Y=y$ 这个切片的总质量（边际）**，得到归一化后的分布。

**（3）条件期望与条件方差**

$$E(X\mid Y=y) = \begin{cases}\displaystyle\sum_x x\,p_{X\mid Y}(x\mid y), & \text{离散}\\[8pt] \displaystyle\int x\,f_{X\mid Y}(x\mid y)\,dx, & \text{连续}\end{cases}$$

$$\operatorname{Var}(X\mid Y=y) = E(X^2\mid Y=y) - \big[E(X\mid Y=y)\big]^2$$

注意：**条件期望 $E(X\mid Y=y)$ 是一个关于 $y$ 的函数**（$y$ 定了它就定了），而 $E(X\mid Y)$ 是一个**随机变量**（因为 $Y$ 是随机变量）。区分这两者是理解全期望公式的前提。

**（4）全期望公式（Law of Total Expectation）**

$$E X = E\big\{E(X\mid Y)\big\} =
\begin{cases}
\displaystyle\sum_y E(X\mid Y=y)\,p_Y(y), & \text{离散}\\[8pt]
\displaystyle\int_y E(X\mid Y=y)\,f_Y(y)\,dy, & \text{连续}
\end{cases}$$

**怎么读这个式子**：$E(X\mid Y)$ 是随机变量，对它再取一次期望——也就是按 $Y$ 的分布对"条件均值"做加权平均。**直觉是"分两步算平均"**：先把总体按 $Y$ 分成若干组，算出每组的平均；再用每组的比重把这些组平均加权起来，结果就是总的平均。

> **一个极实用的推论**：如果题目里 $Y$ 分组后每组的均值好算，就分两步做。这是解决"分层 / 混合"型题目（"先随机选一个盒子，再从盒子里抽球"）的标准武器。

**（5）全方差公式（Law of Total Variance）**

$$\operatorname{Var}(X) = E\big[\operatorname{Var}(X\mid Y)\big] + \operatorname{Var}\big[E(X\mid Y)\big]$$

**这是本块板最有价值的公式**，拆成两项看：

$$\operatorname{Var}(X) = \underbrace{E\big[\operatorname{Var}(X\mid Y)\big]}_{\text{组内方差（within）}} + \underbrace{\operatorname{Var}\big[E(X\mid Y)\big]}_{\text{组间方差（between）}}$$

**直觉**：总体波动来自两个源头——① 每组**内部**各自的波动（组内方差的期望），② 各组**均值之间**的差异（组均值的方差）。两者相加才是总方差。

> 记忆方式：$E[\operatorname{Var}]$ 与 $\operatorname{Var}[E]$ 这一对"期望套方差 / 方差套期望"。**"组内"用期望收，"组间"用方差收**。

**（6）独立性——板书把几种等价刻画并列写出**

$$X \perp Y \iff p(x,y) = p_X(x)\,p_Y(y)\ \text{（离散）} \iff f(x,y) = f_X(x)f_Y(y)\ \text{（连续）}$$

板书另写了一行 "$f(x,y) = g(x)h(y)$ for some $g(x),h(y)$"，即**联合密度能分解成一个只含 $x$ 的函数乘一个只含 $y$ 的函数**，这是独立性的实用判据（等价于 $f(x,y)=f_X(x)f_Y(y)$，因为归一化后 $g,h$ 必然正比于边际密度）。

**MGF 判据**：板书紧接着写了

$$M_{(X,Y)}(t_1,t_2) = M_X(t_1)\,M_Y(t_2) \iff E\big(e^{t_1X+t_2Y}\big) = E\big(e^{t_1X}\big)E\big(e^{t_2Y}\big)$$

即**联合 MGF 等于两个边际 MGF 之积 ⟺ 独立**。左边是**二维** MGF（$M_{(X,Y)}(t_1,t_2) = E\big[e^{t_1X+t_2Y}\big]$），右边是两个一维 MGF 相乘。这是 §4.3 那把钥匙的二维版本。

**（7）相关系数 $\rho$**

$$\rho = \frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y} = \frac{E(XY) - E(X)E(Y)}{\sqrt{\operatorname{Var}(X)}\sqrt{\operatorname{Var}(Y)}}$$

板书把分子写成 $E(XY)-E(X)E(Y)$，就是协方差的简算形式（与 §3.6 的 $\operatorname{Var}(X)=E[X^2]-(EX)^2$ 是同一套逻辑）。$\rho$ 是标准化后的协方差，取值 $[-1,1]$，消除量纲影响。

> 重申 §3.6 那条：$\rho=0$（不相关）$\;\not\Rightarrow\;$ 独立。板书把 $\perp$ 与 $\rho$ 分开写，正是为了区分这两件事。

---

## 9. 一页纸速查表

| 分布 | PMF / PDF | 均值 | 方差 | MGF |
| --- | --- | --- | --- | --- |
| $\mathrm{B}(\theta)$（Bernoulli） | $\theta^x(1-\theta)^{1-x},\ x\in\{0,1\}$ | $\theta$ | $\theta(1-\theta)$ | $1-\theta+\theta e^t$ |
| $\mathrm{Bin}(n,p)$ | $\binom{n}{k}p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ | $(1-p+pe^t)^n$ |
| $\mathrm{Geom}(\theta)$（试验次数） | $(1-\theta)^{x-1}\theta,\ x=1,2,\ldots$ | $\dfrac1\theta$ | $\dfrac{1-\theta}{\theta^2}$ | $\dfrac{\theta e^t}{1-(1-\theta)e^t}$ |
| $\mathrm{NB}(\gamma,\theta)$ | $\binom{x-1}{\gamma-1}\theta^{\gamma}(1-\theta)^{x-\gamma}$ | $\dfrac{\gamma}{\theta}$ | $\dfrac{\gamma(1-\theta)}{\theta^2}$ | $\left(\dfrac{\theta e^t}{1-(1-\theta)e^t}\right)^{\gamma}$ |
| $\mathrm{Pois}(\lambda)$ | $\dfrac{\lambda^k}{k!}e^{-\lambda}$ | $\lambda$ | $\lambda$ | $\exp[\lambda(e^t-1)]$ |
| $\mathrm{Exp}(\theta)$（尺度） | $\dfrac{1}{\theta}e^{-x/\theta},\ x>0$ | $\theta$ | $\theta^2$ | $(1-\theta t)^{-1},\ t<1/\theta$ |
| $\mathrm{Exp}(\lambda)$（速率） | $\lambda e^{-\lambda x},\ x>0$ | $\dfrac1\lambda$ | $\dfrac{1}{\lambda^2}$ | $\left(1-\dfrac t\lambda\right)^{-1},\ t<\lambda$ |
| $\mathrm{Gamma}(\alpha,\theta)$ | $\dfrac{x^{\alpha-1}e^{-x/\theta}}{\Gamma(\alpha)\theta^\alpha},\ x>0$ | $\alpha\theta$ | $\alpha\theta^2$ | $(1-\theta t)^{-\alpha},\ t<1/\theta$ |
| $\chi^2(r)$ | $\dfrac{x^{r/2-1}e^{-x/2}}{\Gamma(r/2)2^{r/2}},\ x>0$ | $r$ | $2r$ | $(1-2t)^{-r/2},\ t<1/2$ |
| $N(\mu,\sigma^2)$ | $\dfrac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | $\mu$ | $\sigma^2$ | $\exp(\mu t + \tfrac12\sigma^2t^2)$ |
| $t(r)$ | （由 $Z/\sqrt{U/r}$ 定义） | $0$（$r>1$） | $\dfrac{r}{r-2}$（$r>2$） | 不存在 |
| $F(r_1,r_2)$ | （由 $\frac{U/r_1}{V/r_2}$ 定义） | $\dfrac{r_2}{r_2-2}$（$r_2>2$） | 见教材 | 不存在 |

> **参数化速记**：$\mathrm{Exp}$ 有两套写法，**看指数上 $x$ 是被除还是被乘**——$e^{-x/\theta}$ → $\theta$ 是尺度、均值 $\theta$；$e^{-\lambda x}$ → $\lambda$ 是速率、均值 $1/\lambda$，且 $\lambda=1/\theta$。Gamma 的 $\beta$ 与 $\theta$ 都是**尺度**（板书用 $\beta$、讲义用 $\theta$），但部分教材把 $\beta$ 当速率，务必按指数判断。

> 注：表中 $t$ 与 $F$ 的均值/方差、几何与负二项的 MGF，属常见补充结论，考试请以讲义与教师要求为准。

**关键常数与符号**：$\Gamma(n) = (n-1)!$（正整数）；$\Gamma(1/2)=\sqrt{\pi}$；$\Phi$ = 标准正态 CDF。

---

## 10. 本讲五条核心直觉（考前回顾用）

1. **概率是"模型 → 数据"，统计是"数据 → 模型"**。统计的全部工作 = 比较 + 推断 + 评估信心（假设检验 / 参数估计 / 置信区间）。
2. **MGF 是把"求矩"变成"求导"的机器，并且唯一决定分布**。凡是"证明某变量服从某分布"的题（Gamma 可加性、$\bar X$ 的正态性、Student 定理），第一反应就是算 MGF。而算 MGF 的具体手法，**要么把求和凑成已知泰勒级数（Poisson），要么把积分凑成高斯/指数积分（Exp、$\chi^2$）**。
3. **三大抽样分布 $\chi^2$、$t$、$F$ 全部由正态样本构造出来，Student 定理是它们的总源头**。卡方来自"正态的平方"，t 来自"正态 ÷ 卡方"，F 来自"卡方 ÷ 卡方"。板书给出了前两步的完整推导（§8.6）。
4. **分布之间的"两套参数化"是最大的失分点**。$\mathrm{Exp}$ 的尺度/速率（$\lambda=1/\theta$）、Gamma 的 $\beta$ 到底是尺度还是速率、几何分布的 $x$ 数的是试验次数还是失败次数——**这三个地方看错，答案会直接错掉或差 1**。判断原则：一切看公式的指数和系数。
5. **LLN 说"收敛到哪"，CLT 说"误差长什么样"，两者都以 finite variance 为前提**。板书的掷骰子演示（$n=1,5,10,1000$）把"分布整体变窄（LLN）"和"形状变钟形（CLT）"这两件事画在同一张图上，是最好记的一幅图。


---

## 11. 中英术语对照

| 中文 | 英文 |
| --- | --- |
| 随机变量 | random variable |
| 样本空间 | sample space |
| 累积分布函数 | cumulative distribution function (CDF) |
| 概率质量函数 | probability mass function (PMF) |
| 概率密度函数 | probability density function (PDF) |
| 支撑集 | support |
| 期望 / 方差 / 协方差 | expectation / variance / covariance |
| 矩母函数 | moment generating function (MGF) |
| 得分函数 | score function |
| 伯努利 / 二项 / 几何 / 负二项 / 泊松 | Bernoulli / Binomial / Geometric / Negative Binomial / Poisson |
| 指数 / 伽马 / 卡方 / 正态 / t / F 分布 | Exponential / Gamma / Chi-square / Normal / Student t / F distribution |
| 尺度参数 / 形状参数 / 速率参数 | scale / shape / rate parameter |
| 无记忆性 | memoryless property |
| 联合分布 / 边际分布 / 条件分布 | joint / marginal / conditional distribution |
| 全期望公式 / 全方差公式 | law of total expectation / law of total variance |
| 组内方差 / 组间方差 | within-group / between-group variance |
| 相关系数 | correlation coefficient |
| 独立（记号 $\perp$） | independent |
| 大数定律 | Law of Large Numbers (LLN) |
| 中心极限定理 | Central Limit Theorem (CLT) |
| 依概率收敛 / 依分布收敛 | convergence in probability / in distribution |
| 独立同分布 | independent and identically distributed (i.i.d.) |
| 连续性修正 | continuity (half-unit) correction |
| 自由度 | degree of freedom |
| 假设检验 / 参数估计 / 置信区间 | hypothesis testing / parameter estimation / confidence interval |

---

## 12. 板书原图（4 张）

板书照片已归档在与讲义同一目录下：

| 文件 | 覆盖内容 | 对应章节 |
| --- | --- | --- |
| `img/STA2002-Lec1-板书01-离散与连续分布族.jpg` | (a) Discrete 全表 + (b) Continuous 全表 + Poisson/指数 MGF 推导 | §4.5、§5.8 |
| `img/STA2002-Lec1-板书02-分布族与MGF完整.jpg` | 同上的完整视角，含 $N(\mu,\sigma^2)$ MGF、$M_X(0)=1$、$E(X^k)$ | §4.3、§5.8 |
| `img/STA2002-Lec1-板书03-联合分布与条件期望.jpg` | $(X,Y)$ 联合/条件/全期望全方差 + 标准化 MGF 证明 + $Z^2\to\chi^2(1)$ | §8.6、§8.7 |
| `img/STA2002-Lec1-板书04-Student定理与CLT演示.jpg` | $(X,Y)$ 块 + LLN 掷骰子演示（$n=1,5,10,1000$）+ Student 定理框 | §7.6、§8.6 |

> 按既有约定，正文已把板书内容**全部提炼为文字与公式**，不依赖图片即可独立阅读；原图仅作核对之用。

---

## 附：本笔记相对讲义的补充与说明（诚实备注）

### 材料来源

本笔记由两部分材料合成：

1. 讲义 `Lecture1 - Introduction and Perliminary.pdf`（36 页 Slides）；
2. **本讲课堂板书**（4 张黑板照片，内容已提炼并入 §3.7、§4.5、§5.8、§7.6、§8.6、§8.7 及第 9–10 节，未收录板书原图）。

**本讲的材料只有讲义与板书**，因此笔记**不包含任何超出这两份材料的内容**。板书内容我按原样转写为 LaTeX；因黑板照片存在透视与模糊，个别符号（如 $\mathrm{NB}(\gamma,\theta)$ 中的 $\gamma$、Gamma 参数写作 $\beta$）系依上下文辨认，含混之处已在对应位置说明，不作臆测。

### 课堂板书相对讲义的增量（已提炼进正文的位置）

| 板书内容 | 性质 | 笔记小节 |
| --- | --- | --- |
| 通用式 $\operatorname{Var}(X)=E(X^2)-[E(X)]^2$ + "finite $\sigma^2$" 条件的讨论 | 把 LLN 前提摊开写 | 3.7 |
| **完整离散分布族**：Bernoulli、二项、几何、负二项、Poisson + "i.i.d. B($\theta$) 求和 → Bin(n,$\theta$)" | **讲义只列了二项与泊松**，几何与负二项完全来自板书 | 4.5 |
| **完整连续分布族**：$N$、$\mathrm{Exp}(\theta)$、$\mathrm{Exp}(\lambda)$、$\mathrm{Gamma}(\alpha,\beta)$ + 尺度/速率双向换算 | **讲义未把两套参数化并列对照**；这是本讲最易错处 | 5.8 |
| **Poisson 与指数分布 MGF 的逐步推导**（凑泰勒级数 / 凑高斯积分） | 讲义只给结果，板书给了过程 | 5.8 |
| **LLN + CLT 的掷骰子可视化演示**（$n=1,5,10,1000$） | **讲义无此图**；把两条定理画在同一实验里 | 7.6 |
| 板书把 $x_i$（数据）与 $\bar X$（随机变量）分开书写 | 记号习惯；与第 2 讲"估计量 vs 估计值"接轨 | 7.6 |
| **Student 定理的两段构造推导**（标准化用 MGF 证 → $Z^2$ 积分得 $\chi^2(1)$） | 讲义直接宣布结论，板书给了证明骨架 | 8.6 |
| **条件分布、条件期望/方差、全期望公式、全方差公式、独立性等价刻画、相关系数 $\rho$** | **讲义完全没有这一整块**（$(X,Y)$ 那块板书） | 8.7 |

> **课堂推进顺序**：从四张照片的前后状态可推，课堂顺序大致为 **(a) 分布族与 MGF（第 1、2 张）→ (b) 联合分布与条件期望（第 3 张左侧）→ (c) Student 定理与 LLN/CLT 演示（第 3 张右侧、第 4 张）**。第 4 张里 $(X,Y)$ 那一块仍在、同时出现了掷骰子演示，说明联合分布与极限定理是在同一节课衔接讲授的。

### 以下内容属于"讲义未给出、我补充"的部分，考试请以讲义与教师要求为准

- **几何分布"试验次数"版本与"失败次数"版本的对照**（§4.5）：板书写的是试验次数版本（$E[X]=1/\theta$），我补充了另一种定义的差别（$E[X]=(1-\theta)/\theta$，相差 1），因为这是最常见的失分点。
- **负二项分布的均值/方差、MGF，以及"$\mathrm{NB}(\gamma,\theta)$ = $\gamma$ 个独立 Geometric 之和"**（§4.5）：板书只给了 PMF，未给矩。我用"独立几何之和 + 期望线性性"补出了均值，与"Gamma = $k$ 个独立指数之和"作平行对照。
- **几何/负二项的 MGF**（第 9 节速查表）：板书与讲义均未给，为常用补充。
- **Bernoulli 的 MGF $1-\theta+\theta e^t$**、**$\mathrm{Exp}(\lambda)$ 速率版本的均值方差**（第 9 节速查表）：$1/\lambda$ 与 $1/\lambda^2$ 由 $\lambda=1/\theta$ 换算而来。
- **§3.7 关于"有限方差"的完整讨论**（Pareto 尾指数门槛 $\alpha>2$、Cauchy 反例、$t(r)$ 的矩存在条件、Chebyshev 不等式与稳定分布）：板书只写了 "same finite $\sigma^2$" 五个词，未展开。这部分是我补充的，用来回答"为什么这个条件必须单独列出"。
- **§7.6 关于 LLN 与 CLT 在同一张骰子图上分别对应什么**（"分布整体变窄" vs "形状变钟形"）：板书画了图但没写文字说明，这段解读是我的。
- **§8.6 对板书两段推导的逐步补全**（$M_Z(t)$ 的 $\mu t/\sigma$ 抵消、$\chi^2(1)$ 高斯积分的 $a=1/2-t$ 代换、$t<1/2$ 与 MGF 存在区间的对应）：板书写了式子，我把每一步的理由补上了。
- **§8.7 全方差公式的"组内/组间"分解解读**、**"分两步算平均"的实用推论**、**相关性 $\rho=0 \not\Rightarrow$ 独立的重申**：板书只给了公式，未给解释。
- **§5.8 关于"$\beta$ 在部分教材里是速率"的警告**：板书用 $\beta$ 表尺度（与讲义 $\theta$ 一致），但另一些教材（如 numpy/SciPy 的部分文档）用 $\beta$ 表速率，我做了补充提醒。
- **7.3 节的"$np\ge5$"近似经验规则**、**第 9 节速查表中 $t$ 与 $F$ 的均值/方差**：均为讲义未给出的常见结论。

### 已独立复算的内容

- 讲义上的两个数值：等待时间例题 $\Pr(X>5)=\frac72e^{-5/2}\approx 0.287$；硬币题 $\Phi(1.6460)-\Phi(-3.2598)\approx 0.9496$。均与讲义一致。
- 板书推导的两个 MGF：指数分布 $\dfrac{1}{1-\theta t}$、Poisson $e^{\lambda(e^t-1)}$；以及 $-Z^2$ 的 MGF $(1-2t)^{-1/2}$（即 $\chi^2(1)$）。均已逐步验算。
- 新增分布的矩：几何 $E=1/\theta$、$\operatorname{Var}=(1-\theta)/\theta^2$；负二项 $E=\gamma/\theta$、$\operatorname{Var}=\gamma(1-\theta)/\theta^2$；$\mathrm{Exp}(\lambda)$ 的 $1/\lambda$ 与 $1/\lambda^2$。
- 若需图形化验证（如重尾分布下样本方差的"跳跃"、骰子实验的 CLT 收敛），可另跑 Python 模拟确认。

