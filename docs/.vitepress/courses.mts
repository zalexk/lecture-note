/**
 * 课程与笔记清单 —— 全站导航的唯一数据源。
 *
 * 新增一节课时：在下面 courses 数组里加一条记录 —— 顶部导航与左侧边栏会据此自动生成；
 *              首页的课程卡片是手写的，需要另外到 docs/index.md 的 features 里补一条。
 * 新增一讲笔记时：把 md 文件放进 docs/<dir>/，再往该课程的 notes 里加一行即可。
 *
 * 约定：
 *   dir   —— docs 下的文件夹名，格式 `课程代码-课名`（连字符代替空格）
 *   file  —— 该文件夹内不带 .md 后缀的文件名
 *   text  —— 侧边栏显示名，建议写"章节号 + 中文主题（English Topic）"
 */

export interface NoteEntry {
  /** 侧边栏显示名 */
  text: string
  /** 不含 .md 后缀的文件名 */
  file: string
}

export interface CourseEntry {
  /** 课程代码，如 ECO2021 */
  code: string
  /** 课程英文全名 */
  name: string
  /** docs 下的目录名 */
  dir: string
  /** 一句话简介，显示在课程列表页 */
  summary: string
  /** 该课程已有的笔记 */
  notes: NoteEntry[]
}

export const courses: CourseEntry[] = [
  {
    code: 'CSC3001',
    name: 'Discrete Mathematics',
    dir: 'CSC3001-Discrete-Mathematics',
    summary: '离散数学 —— 命题逻辑与一阶逻辑、集合、证明方法，以及数学归纳法、良序原理与不变量法。',
    notes: [
      {
        text: 'LN0 绪论（Introduction）',
        file: 'ln0-introduction',
      },
      {
        text: 'LN1 命题逻辑（Propositional Logic）',
        file: 'ln1-propositional-logic',
      },
      {
        text: 'LN2.1 集合（Sets）',
        file: 'ln2-1-sets',
      },
      {
        text: 'LN2.2 一阶逻辑（First-Order Logic）',
        file: 'ln2-2-first-order-logic',
      },
      {
        text: 'LN3 证明方法（Methods of Proofs）',
        file: 'ln3-methods-of-proofs',
      },
      {
        text: 'LN4.1 数学归纳法 I（Mathematical Induction I）',
        file: 'ln4-1-mathematical-induction-i',
      },
      {
        text: 'LN4.2 数学归纳法 II（Mathematical Induction II）',
        file: 'ln4-2-mathematical-induction-ii',
      },
    ],
  },
  {
    code: 'CSC3100',
    name: 'Data Structures',
    dir: 'CSC3100-Data-Structures',
    summary: '数据结构 —— 渐进记号、递归与分治的复杂度分析，以及经典排序与查找算法的设计与证明。',
    notes: [
      {
        text: 'Lecture 6 分治与递归的复杂度（Complexity of Divide-and-Conquer and Recursion）',
        file: 'lecture6-divide-and-conquer-and-recursion',
      },
    ],
  },
  {
    code: 'ECE2050',
    name: 'Digital Logic and Systems',
    dir: 'ECE2050-Digital-Logic-and-Systems',
    summary: '数字逻辑与系统 —— 数制与编码、逻辑门与噪声容限，以及组合逻辑与时序逻辑的基本构件。',
    notes: [
      {
        text: 'Ch1 数字逻辑导论（Introduction）',
        file: 'chap1-introduction',
      },
      {
        text: 'Ch2 数制系统（Number Systems）',
        file: 'chap2-number-systems',
      },
      {
        text: 'Ch3 逻辑门（Logic Gates）',
        file: 'chap3-logic-gates',
      },
    ],
  },
  {
    code: 'ECO2021',
    name: 'Principles of Macroeconomics',
    dir: 'ECO2021-Principles-of-Macroeconomics',
    summary: '宏观经济学原理 —— 从 GDP 核算、通胀与物价水平，到劳动市场与失业。',
    notes: [
      {
        text: 'Ch5 通货膨胀与价格水平（Inflation and the Price Level）',
        file: 'ch5-inflation-and-the-price-level',
      },
      {
        text: 'Ch6 工资与失业（Wages and Unemployment）',
        file: 'ch6-wages-and-unemployment',
      },
    ],
  },
  {
    code: 'STA2002',
    name: 'Probability and Statistics II',
    dir: 'STA2002-Probability-and-Statistics-II',
    summary: '概率与统计 II —— 参数估计、置信区间与假设检验：从枢轴量出发的三件套推断链条。',
    notes: [
      {
        text: 'Lecture 1 引言与预备知识（Introduction and Preliminary）',
        file: 'lecture1-introduction-and-preliminary',
      },
      {
        text: 'Lecture 2 参数估计 I（Parameter Estimation I）',
        file: 'lecture2-parameter-estimation-i',
      },
      {
        text: 'Lecture 3 参数估计 II（Parameter Estimation II）',
        file: 'lecture3-parameter-estimation-ii',
      },
      {
        text: 'Lecture 4 置信区间 I（Confidence Interval I）',
        file: 'lecture4-confidence-interval-i',
      },
      {
        text: 'Lecture 5 置信区间 II（Confidence Interval II）',
        file: 'lecture5-confidence-interval-ii',
      },
      {
        text: 'Lecture 6 假设检验 I（Hypothesis Testing I）',
        file: 'lecture6-hypothesis-testing-i',
      },
    ],
  },
]

/** 由 dir 拼出站点内的路径前缀（带首尾斜杠） */
export const courseBase = (c: CourseEntry) => `/${c.dir}/`

/** 某节课的侧边栏配置 */
export const courseSidebar = (c: CourseEntry) => [
  {
    text: `${c.code} ${c.name}`,
    items: [
      { text: '课程概览', link: `${courseBase(c)}` },
      ...c.notes.map((n) => ({
        text: n.text,
        link: `${courseBase(c)}${n.file}`,
      })),
    ],
  },
]

/** 全站 sidebar：按目录前缀匹配 */
export const sidebar = Object.fromEntries(
  courses.map((c) => [courseBase(c), courseSidebar(c)])
)
