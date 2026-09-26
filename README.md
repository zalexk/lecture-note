# lecture-note

CUHK-Shenzhen 课程笔记的公开归档站点。基于 [VitePress](https://vitepress.dev/) 构建，通过 GitHub Pages 发布。

站点地址：<https://zalexk.github.io/lecture-note/>

> [!WARNING]
> **内容声明：本仓库的课程笔记均由 AI 辅助整理生成，未经逐字人工校订，可能存在事实错误、推导错误或术语误用。** 笔记中的「独立复算」「我补充」等标注同样不保证正确。请以课件、教材与课堂讲授原文为准，不要将本站内容作为学术依据或作业答案来源。

---

## 目录结构

```
lecture-note/
├── .github/workflows/deploy.yml    # push 到 main 后自动构建并发布
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts              # 站点配置（导航、搜索、主题）
│   │   ├── courses.mts             # 课程与笔记清单 —— 全站导航的唯一数据源
│   │   └── theme/                  # 主题自定义（如需）
│   ├── public/logo.svg             # 原样复制的静态资源
│   ├── index.md                    # 首页（AI 生成声明 + 课程卡片）
│   └── ECO2021-Principles-of-Macroeconomics/
│       ├── index.md                # 课程概览页
│       └── ch6-wages-and-unemployment.md
├── scripts/import-note.py          # 从本地笔记目录导入并注入 frontmatter
└── package.json
```

## 命名约定

| 对象 | 规则 | 例子 |
| --- | --- | --- |
| 课程目录 | `课程代码-课程英文名`，空格用连字符 | `ECO2021-Principles-of-Macroeconomics` |
| 笔记文件 | 全小写英文 slug，不含空格与中文 | `ch6-wages-and-unemployment.md` |

课程目录名会直接成为 URL 的一部分，改名等于改链接，尽量不要中途更名。

---

## 本地开发

需要 Node.js 18 以上。

```bash
npm install          # 首次
npm run docs:dev     # 启动开发服务器，默认 http://localhost:5173/lecture-note/
npm run docs:build   # 构建到 docs/.vitepress/dist
npm run docs:preview # 预览构建产物
```

## 新增一讲笔记

1. 把笔记放进对应课程目录，文件名用英文 slug：

   ```bash
   python scripts/import-note.py \
       "D:/University/Year 2/ECO2021/笔记_ECO2021_Ch6_Wages-and-Unemployment.md" \
       "docs/ECO2021-Principles-of-Macroeconomics" \
       "ch6-wages-and-unemployment" \
       "Ch6 工资与失业"
   ```

   脚本会复制文件、统一换行为 LF，并在缺少 YAML frontmatter 时补一个 `title`。

2. 在 `docs/.vitepress/courses.mts` 里，把这一讲加进对应课程的 `notes` 数组：

   ```ts
   notes: [
     { text: 'Ch6 工资与失业（Wages and Unemployment）', file: 'ch6-wages-and-unemployment' },
   ]
   ```

3. 本地 `npm run docs:dev` 确认渲染无误，然后 commit + push。

## 新增一门课程

1. 在 `docs/` 下新建 `课程代码-课程英文名` 目录，把笔记放进去。
2. 在 `docs/.vitepress/courses.mts` 的 `courses` 数组里追加一条记录（`code` / `name` / `dir` / `summary` / `notes`）—— 顶部导航与左侧边栏会据此自动生成。
3. 到 `docs/index.md` 的 `features` 里补一张课程卡片（首页卡片是手写的，不随 `courses.mts` 变化）。

---

## 部署

仓库已内置 `.github/workflows/deploy.yml`：推送到 `main` 分支即自动构建并发布。

**首次启用需要在 GitHub 上做一次设置：**

1. 打开 <https://github.com/zalexk/lecture-note/settings/pages>
2. 把 **Source** 设为 **GitHub Actions**（不是 "Deploy from a branch"）
3. 回到 <https://github.com/zalexk/lecture-note/actions>，等 `Deploy VitePress site to Pages` 跑完
4. 访问 <https://zalexk.github.io/lecture-note/>

若推送后 Actions 没有自动触发，可在 Actions 页面手动 `Run workflow`。

### 关于 `base`

`docs/.vitepress/config.mts` 里的 `base: '/lecture-note/'` 对应仓库名。如果将来仓库改名，或改用自定义域名（此时应设为 `'/'`），记得同步修改，否则站点的样式与资源会全部 404。

---

## 已内置的 Markdown 能力

- **数学公式** —— `$...$` 与 `$$...$$`，由 `markdown-it-mathjax3` 在构建时渲染
- **Mermaid 图表** —— ` ```mermaid ` 代码块，由 `vitepress-plugin-mermaid` 渲染
- **本地全文搜索** —— 无需外部服务
- **提示容器** —— `::: tip` / `::: warning` / `::: danger` / `::: info` / `::: details`

## 内容声明

本站笔记由 AI 辅助整理生成，**未经逐字人工校订**，可能存在：

- 事实错误、推导错误或术语误用；
- 从课件图表上人工读取的近似数值；
- 对课件口径的个人理解偏差。

笔记只反映整理者个人对课件的理解，不代表任课教师观点，也不构成官方教学材料。**请始终以课件与教材原文为准。**
