import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { courses, sidebar } from './courses.mts'

const repoUrl = 'https://github.com/zalexk/lecture-note'

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: 'Lecture Notes',
    description: 'CUHK-Shenzhen 课程笔记归档',
    base: '/lecture-note/',
    cleanUrls: true,
    lastUpdated: true,
    head: [['meta', { name: 'theme-color', content: '#3451b2' }]],

    markdown: {
      // 数学公式：需要同时安装 markdown-it-mathjax3
      math: true,
      // 文中的裸 HTML（如 <br/>）照常渲染
      html: true,
    },

    themeConfig: {
      logo: '/logo.svg',

      nav: [
        { text: '首页', link: '/' },
        { text: '课程总览', link: '/courses' },
        {
          text: '课程',
          items: courses.map((c) => ({
            text: `${c.code} ${c.name}`,
            link: `/${c.dir}/`,
          })),
        },
        { text: 'GitHub', link: repoUrl },
      ],

      sidebar,

      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索笔记',
              buttonAriaLabel: '搜索笔记',
            },
            modal: {
              noResultsText: '没有找到结果',
              resetButtonTitle: '清空查询',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
              },
            },
          },
        },
      },

      outline: { level: [2, 3], label: '本页目录' },
      docFooter: { prev: '上一节', next: '下一节' },
      lastUpdated: { text: '最后更新于' },
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '目录',
      darkModeSwitchLabel: '外观',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      externalLinkIcon: true,

      socialLinks: [{ icon: 'github', link: repoUrl }],

      footer: {
        message: '课程笔记归档 · 内容为个人学习整理，仅供参考',
        copyright: '仅供学习交流使用',
      },
    },

    // ---- vitepress-plugin-mermaid ----
    // 只保留需要的功能，避免引入额外依赖
    mermaid: {},
    mermaidPlugin: {
      class: 'mermaid',
    },
  })
)
