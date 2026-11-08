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
| [Ch7 时序逻辑设计](/ECE2050-Digital-Logic-and-Systems/chap7-sequential-logic-design) | Sequential Logic Design | Chapter 7（共 32 页） |
| [Ch8 移位寄存器](/ECE2050-Digital-Logic-and-Systems/chap8-shift-registers) | Shift Registers | Chapter 8（共 34 页） |
| [Ch9 有限状态机](/ECE2050-Digital-Logic-and-Systems/chap9-finite-state-machine) | Finite State Machine | Chapter 9（共 42 页） |

## 期中题型大全

把四套历届期中卷（2024、2025 春、2025 秋、2026）与 HW1–HW3 拆成 12 个课题、67 个题型。每个题型按「识别特征 → 原题 → 官方答案 → 解题步骤 → 答案复盘 → 易错点 → 变体」写，重点是复盘官方答案每一步依据的规则。

| 篇 | 主题 | 题型数 |
| --- | --- | --- |
| [00 总纲](/ECE2050-Digital-Logic-and-Systems/midterm-00-overview) | 使用说明、考试信息、按卷索引 | — |
| [01 数制与转换](/ECE2050-Digital-Logic-and-Systems/midterm-01-number-systems-and-conversion) | Number Systems and Conversion | 6 |
| [02 补码与有符号算术](/ECE2050-Digital-Logic-and-Systems/midterm-02-twos-complement-and-signed-arithmetic) | Two's Complement and Signed Arithmetic | 7 |
| [03 编码、校验与浮点](/ECE2050-Digital-Logic-and-Systems/midterm-03-codes-error-detection-and-floating-point) | Codes, Error Detection and Floating Point | 5 |
| [04 逻辑门与电特性](/ECE2050-Digital-Logic-and-Systems/midterm-04-logic-gates-and-electrical-characteristics) | Logic Gates and Electrical Characteristics | 5 |
| [05 布尔代数化简](/ECE2050-Digital-Logic-and-Systems/midterm-05-boolean-algebra-simplification) | Boolean Algebra Simplification | 4 |
| [06 标准形式与逻辑互转](/ECE2050-Digital-Logic-and-Systems/midterm-06-canonical-forms-and-logic-conversion) | Canonical Forms and Logic Conversion | 7 |
| [07 卡诺图与最小化](/ECE2050-Digital-Logic-and-Systems/midterm-07-karnaugh-maps-and-minimization) | Karnaugh Maps and Minimization | 8 |
| [08 通用门实现](/ECE2050-Digital-Logic-and-Systems/midterm-08-universal-gate-implementation) | Universal Gate Implementation | 5 |
| [09 加法器与运算电路](/ECE2050-Digital-Logic-and-Systems/midterm-09-adders-and-arithmetic-circuits) | Adders and Arithmetic Circuits | 6 |
| [10 多路选择器与译码器](/ECE2050-Digital-Logic-and-Systems/midterm-10-multiplexers-and-decoders) | Multiplexers and Decoders | 9 |
| [11 延迟、时序与毛刺](/ECE2050-Digital-Logic-and-Systems/midterm-11-delay-timing-and-glitches) | Delay, Timing and Glitches | 4 |
| [12 概念判断题](/ECE2050-Digital-Logic-and-Systems/midterm-12-concept-judgement) | Concept Judgement | 40 句 |
| [99 考前速查](/ECE2050-Digital-Logic-and-Systems/midterm-99-cheatsheet) | 一页速查 | — |

::: tip 阅读顺序建议
Chapter 1 是一张「全课程导览图」——它不教具体电路，只把后面十几章的地图先摊开。先读它建立全局视野，再按 Ch2（数制）→ Ch3（逻辑门）→ Ch4（化简）→ Ch5（门级实现）→ Ch6（标准构件）→ Ch7（时序元件）→ Ch8（移位寄存器）→ Ch9（状态机）往下走，之后各章才有落点。

Ch4 解决"给定功能怎么写出一条尽量短的布尔式"，Ch5 紧接着把这条式子真正变成门：AND-OR / AOI 两种两级结构、XOR 与奇偶校验、NAND/NOR 的通用性、以及读多级电路用的气泡推移（bubble pushing）。Ch6 再把方向掉过头来：不再从真值表出发自己化简，而是从已有型号的标准构件里挑、然后级联。三章连着读效果最好——Ch6 的译码器（p29–p31）、Mux（p40、p43–p44）与毛刺修复（p52–p53）全都直接用到 Ch4 的最小项、SOP 与 K-map，而 Ch6 那些"每个输入都带气泡"的多级门电路，读法正是 Ch5 的气泡推移。

Ch7–Ch9 是同一条链的三级台阶：Ch7 先造出能记住一位的元件（锁存器与触发器），并把 Ch6 末尾的传播延迟、污染延迟接成建立/保持时间约束；Ch8 把这些元件串成移位寄存器，第一次让"状态"按拍流动；Ch9 再把状态抽象成状态机，给出从文字需求到电路的一整套设计流程。**读 Ch9 的时序分析（p31–p40）之前务必先读 Ch6 的 $t_{pd}$ / $t_{cd}$ 与 Ch7 的触发器**——$T_c \ge t_{pcq}+t_{pd}+t_{setup}$ 这条式子里的每一项都来自前几章。
:::
