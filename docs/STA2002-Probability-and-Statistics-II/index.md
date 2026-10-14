# STA2002 · Probability and Statistics II

概率与统计 II。

| 项目 | 内容 |
| --- | --- |
| 课程代码 | STA2002 |
| 课程名称 | Probability and Statistics II |
| 授课教师 | Zhenxing Guo、Ka Wai Tsang（SDS, CUHK-Shenzhen） |
| 主要教材 | Hogg, Tanis & Zimmerman, *Probability and Statistical Inference*（9th ed., Pearson, 2015） |

## 本课程笔记

| 讲次 | 主题 | 对应课件 |
| --- | --- | --- |
| [Lecture 1 引言与预备知识](/STA2002-Probability-and-Statistics-II/lecture1-introduction-and-preliminary) | Introduction and Preliminary | Lecture 1（36 页） |
| [Lecture 2 参数估计 I](/STA2002-Probability-and-Statistics-II/lecture2-parameter-estimation-i) | Parameter Estimation I | Lecture 2 |
| [Lecture 3 参数估计 II](/STA2002-Probability-and-Statistics-II/lecture3-parameter-estimation-ii) | Parameter Estimation II | Lecture 3（18 页） |
| [Lecture 4 置信区间 I](/STA2002-Probability-and-Statistics-II/lecture4-confidence-interval-i) | Confidence Interval I | Lecture 4（17 页） |
| [Lecture 5 置信区间 II](/STA2002-Probability-and-Statistics-II/lecture5-confidence-interval-ii) | Confidence Interval II | Lecture 5（31 页） |
| [Lecture 6 假设检验 I](/STA2002-Probability-and-Statistics-II/lecture6-hypothesis-testing-i) | Hypothesis Testing I | Lecture 6（28 页） |
| [Lecture 7 假设检验 II](/STA2002-Probability-and-Statistics-II/lecture7-hypothesis-testing-ii) | Hypothesis Testing II | Lecture 7（21 页） |
| [Lecture 8 假设检验 III](/STA2002-Probability-and-Statistics-II/lecture8-hypothesis-testing-iii) | Hypothesis Testing III | Lecture 8（17 页） |
| [Lecture 9 假设检验 IV](/STA2002-Probability-and-Statistics-II/lecture9-hypothesis-testing-iv) | Hypothesis Testing IV（功效函数与样本量） | Lecture 9（42 页） |

::: tip 这门课的主线
第 1 讲把「随机变量 — 分布 — 矩 — 三大抽样分布 — 极限定理」这条链条补齐，第 2–3 讲做**点估计**，第 4–5 讲做**区间估计**，第 6–9 讲做**假设检验**。

三件套（点估计 / 区间估计 / 假设检验）之间其实共用同一批工具：**枢轴量（pivot）**。第 4 讲把它显式化之后，第 6 讲的检验统计量基本就是「把枢轴量里的未知参数换成假设值」。所以第 4 讲是这门课的分水岭，前面读慢了不亏。

假设检验这四讲的分类维度是逐步展开的：第 6 讲按「$\sigma^2$ 已知 / 未知」分两个 case（单个均值），第 7 讲换成「两个样本的结构关系」（是否配对、方差是否相等），第 8 讲讲**比例**——那一讲整讲没有 $t$ 分布，因为 $H_0:p=p_0$ 把分母也定死成了已知常数。第 9 讲则从「拿到数据之后拒不拒」翻到**事前设计**：功效函数 $K(\mu)=\Pr(\text{拒绝};\mu)$ 是一条曲线，$\alpha$ 与 $1-\beta$ 只是它上面两个读数，而样本量 $n$ 是唯一能同时按住两类错误的旋钮。
:::

::: warning 阅读提示
各篇笔记正文按**讲义的页序**组织，节标题后标了课件页码（如 `（p.6-11）`），方便对回原课件。文末的「诚实备注」会逐条列出课件笔误、由我补充或复算的内容。
:::
