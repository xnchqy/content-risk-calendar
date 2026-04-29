# 内容风控日历 - 项目规范

## 1. 项目概述

**产品名：** 内容风控日历
**定位：** 帮助内容生产人员和审核人员提升风控意识、增加内容安全认知的工具
**用户：** 图文内容生产者、内容审核人员
**核心价值：** 提前预知风险节点，展示每个节点的内容安全要点

## 2. 技术栈

- **框架：** Astro 5（静态生成 + 按需 hydration）
- **样式：** Tailwind CSS
- **内容管理：** Astro Content Collections，Markdown 文件存储风控事件
- **管理端：** 独立 admin 页面，密码保护，在线编辑
- **构建：** `npm run dev` 本地预览，`npm run build` 打包部署

## 3. 目录结构

```
/
├── CLAUDE.md
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   └── favicon.svg
└── src/
    ├── content/
    │   ├── config.ts          # 内容集合定义
    │   └── events/           # 风控事件 Markdown 文件
    │       └── YYYY-MM.md     # 按月组织
    ├── components/
    │   ├── Header.astro
    │   ├── RiskCard.astro
    │   ├── Calendar.astro
    │   └── Admin/
    │       ├── Login.astro
    │       └── Editor.astro
    ├── layouts/
    │   └── Layout.astro
    ├── pages/
    │   ├── index.astro        # 首页/日历视图
    │   ├── events/
    │   │   └── [slug].astro   # 事件详情页
    │   └── admin/
    │       ├── index.astro   # 管理入口
    │       └── editor.astro  # 编辑器
    └── styles/
        └── global.css
```

## 4. 风控事件内容结构

每个 Markdown 文件 frontmatter 字段：

```yaml
title: string        # 事件标题，如"元旦-跨年夜"
date: string         # 日期，YYYY-MM-DD
tags: string[]       # 标签，如["节假日","高风险"]
summary: string      # 简短摘要，一句话说明风险点
background: string   # 事件背景，为什么这个时间节点有风险
riskPoints: string[] # 风险要点，内容生产/审核需关注什么
guidance: string     # 处置指引，如何应对
deepStrategy: string # 进阶策略（可选）
```

## 5. 角色视图

### 生产者视角
- 避雷清单：今天开始接下来 N 天有哪些风险节点要回避
- 每个节点：风险点 + 如何正确处理

### 审核者视角
- 按风险等级排序：所有事件按风险高低排列
- 深度策略：遇到时的专业处置方法

### 领导视角
- 全局日历：按时间线展示全年风险节点分布
- 统计指标：本周/本月风险事件数量、高风险事件占比

## 6. 内容管理

- **数据来源：** Excel 文档，手动上传风控事件
- **维护流程：** Excel → 转换脚本 → Markdown 文件 → 提交到内容目录
- **工具：** 提供 `scripts/import-excel.js`，将 Excel 数据转换为 Markdown
- **管理密码：** 环境变量 `ADMIN_PASSWORD`，默认 `admin123`

## 7. 部署

- 构建命令：`npm run build`
- 输出目录：`dist/`
- 部署方式：打包后的静态文件部署到内网服务器

## 8. 设计原则

- 体验优先：清晰、易读、无学习成本
- 不让用户思考：风险信息一目了然
- 渐进式展示：先给结论，再展开详情
- 移动端友好：内网访问可能在手机上
