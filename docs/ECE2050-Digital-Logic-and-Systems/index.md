# ECE2050 · Digital Logic and Systems

数字逻辑与系统。

| 项目 | 内容 |
| --- | --- |
| 课程代码 | ECE2050 |
| 课程名称 | Digital Logic and Systems（数字逻辑与系统） |
| 授课教师 | Tinghuan Chen |
| 主要教材 | Harris & Harris, *Digital Design and Computer Architecture* (Elsevier, 2024) |

## 本课程笔记

| 章节 | 主题 | 对应课件 |
| --- | --- | --- |
| [Ch1 数字逻辑导论](/ECE2050-Digital-Logic-and-Systems/chap1-introduction) | Introduction | Chapter 1（共 44 页） |
| [Ch2 数制系统](/ECE2050-Digital-Logic-and-Systems/chap2-number-systems) | Number Systems | Chapter 2（共 73 页） |
| [Ch3 逻辑门](/ECE2050-Digital-Logic-and-Systems/chap3-logic-gates) | Logic Gates | Chapter 3（共 25 页） |
| [Ch4 布尔代数与逻辑化简](/ECE2050-Digital-Logic-and-Systems/chap4-boolean-algebra-and-logic-simplification) | Boolean Algebra and Logic Simplification | Chapter 4（共 63 页） |
| [Ch5 组合逻辑设计](/ECE2050-Digital-Logic-and-Systems/chap5-combinational-logic-design) | Combinational Logic Design | Chapter 5（共 33 页） |
| [Ch6 组合逻辑标准构件](/ECE2050-Digital-Logic-and-Systems/chap6-combinational-building-blocks) | Combinational Building Blocks | Chapter 6（共 56 页） |

::: tip 阅读顺序建议
Chapter 1 是一张「全课程导览图」——它不教具体电路，只把后面十几章的地图先摊开。先读它建立全局视野，再按 Ch2（数制）→ Ch3（逻辑门）→ Ch4（化简）→ Ch5（门级实现）→ Ch6（标准构件）往下走，之后各章才有落点。

Ch4 解决"给定功能怎么写出一条尽量短的布尔式"，Ch5 紧接着把这条式子真正变成门：AND-OR / AOI 两种两级结构、XOR 与奇偶校验、NAND/NOR 的通用性、以及读多级电路用的气泡推移（bubble pushing）。Ch6 再把方向掉过头来：不再从真值表出发自己化简，而是从已有型号的标准构件里挑、然后级联。三章连着读效果最好——Ch6 的译码器（p29–p31）、Mux（p40、p43–p44）与毛刺修复（p52–p53）全都直接用到 Ch4 的最小项、SOP 与 K-map，而 Ch6 那些"每个输入都带气泡"的多级门电路，读法正是 Ch5 的气泡推移。
:::
