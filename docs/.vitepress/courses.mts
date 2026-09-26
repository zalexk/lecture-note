/**
 * 课程与笔记清单 —— 全站导航的唯一数据源。
 *
 * 新增一节课时：在下面 courses 数组里加一条记录，nav / sidebar / 首页会同步更新。
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
    code: 'ECO2021',
    name: 'Principles of Macroeconomics',
    dir: 'ECO2021-Principles-of-Macroeconomics',
    summary: '宏观经济学原理 —— 从 GDP 核算、通胀与物价水平，到劳动市场与失业。',
    notes: [
      {
        text: 'Ch6 工资与失业（Wages and Unemployment）',
        file: 'ch6-wages-and-unemployment',
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
