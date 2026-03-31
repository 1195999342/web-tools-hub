# 实现计划：Web Tools Hub

## 概述

基于 Next.js 14 App Router + TypeScript + Tailwind CSS 构建多语言工具聚合平台。采用 Tool_Registry 纯数据驱动架构，支持零配置扩展。实现两个示例工具（JSON 格式化、字符统计），集成 next-intl 国际化和 Fuse.js 客户端搜索，使用 Vitest + fast-check 进行属性测试。

## 任务

- [x] 1. 初始化 Next.js 项目并配置基础设施
  - 创建 Next.js 14 项目（App Router 模式）
  - 安装依赖：next-intl、fuse.js、vitest、fast-check、@testing-library/react
  - 配置 TypeScript（strict 模式）
  - 配置 Tailwind CSS（desktop-first 断点：tablet max-1024px、mobile max-768px）
  - 配置 Vitest 测试环境
  - 创建目录结构（app/、tools/、components/、lib/、messages/、__tests__/）
  - _需求：11.2_

- [x] 2. 实现 Tool_Registry 核心配置系统
  - [x] 2.1 创建 Tool_Registry 类型定义和数据结构
    - 在 `tools/registry.ts` 中定义 ToolMeta、ToolCategory、Locale 类型
    - 创建 TOOL_REGISTRY 数组，包含 json-formatter 和 word-counter 两个工具的完整元数据
    - 实现 getToolBySlug、getEnabledTools、getToolsByCategory 等查询函数
    - _需求：1.1、10.3_

  - [ ]* 2.2 编写属性测试：注册表条目完整性（Property 1）
    - **属性 1：注册表条目完整性**
    - **验证需求：1.1、6.6**

  - [ ]* 2.3 编写属性测试：重复 slug 检测（Property 4）
    - **属性 4：重复 slug 检测**
    - **验证需求：1.4**

  - [ ]* 2.4 编写属性测试：注册表纯数据性（Property 14）
    - **属性 14：注册表纯数据性**
    - **验证需求：11.3**

- [x] 3. 配置 next-intl 国际化系统
  - [x] 3.1 配置 next-intl 并创建语言包
    - 创建 `i18n.ts` 配置文件，定义 10 种语言和默认语言
    - 创建 `messages/` 目录下的 10 个语言包文件（en.json、zh-CN.json 等）
    - 在语言包中添加 common、navbar、footer、tools 命名空间的基础翻译
    - 配置 `app/[locale]/layout.tsx` 集成 next-intl
    - _需求：6.1、6.2、6.6_

  - [x] 3.2 实现语言检测和回退逻辑
    - 在 `lib/i18n.ts` 中实现语言检测函数（Accept-Language 解析）
    - 实现 middleware.ts 处理语言前缀路由和自动重定向
    - 实现翻译回退逻辑（缺失翻译时回退英文）
    - _需求：6.4、6.5_

  - [ ]* 3.3 编写属性测试：语言检测与偏好回退（Property 6）
    - **属性 6：语言检测与偏好回退**
    - **验证需求：6.4**

  - [ ]* 3.4 编写属性测试：缺失翻译回退英文（Property 7）
    - **属性 7：缺失翻译回退英文**
    - **验证需求：6.5**

- [x] 4. 实现动态路由和路由生成
  - [x] 4.1 创建工具页面动态路由
    - 创建 `app/[locale]/tools/[slug]/page.tsx` 动态路由
    - 实现 generateStaticParams 函数，从 Tool_Registry 生成所有启用工具的路由参数
    - 实现 generateMetadata 函数，根据工具元数据生成 SEO meta 标签
    - 处理工具不存在时返回 404
    - _需求：1.2、2.1、2.2、9.4_

  - [ ]* 4.2 编写属性测试：启用工具路由生成（Property 2）
    - **属性 2：启用工具路由生成**
    - **验证需求：1.2、11.2**

  - [ ]* 4.3 编写属性测试：禁用工具不生成路由（Property 3）
    - **属性 3：禁用工具不生成路由**
    - **验证需求：1.3**

  - [ ]* 4.4 编写属性测试：工具路径格式（Property 5）
    - **属性 5：工具路径格式**
    - **验证需求：2.1**

  - [ ]* 4.5 编写属性测试：SEO meta 标签生成（Property 11）
    - **属性 11：SEO meta 标签生成**
    - **验证需求：9.4**

- [x] 5. 实现公共布局组件
  - [x] 5.1 创建 Navbar 导航栏组件
    - 在 `components/layout/Navbar.tsx` 中实现导航栏
    - 包含 Logo、分类菜单、搜索入口、语言切换器
    - 实现移动端汉堡菜单（< 768px）
    - 实现当前页面高亮逻辑
    - _需求：3.1、3.2、3.3、3.4、3.5_

  - [ ]* 5.2 编写属性测试：导航高亮一致性（Property 15）
    - **属性 15：导航高亮一致性**
    - **验证需求：3.5**

  - [x] 5.3 创建 Footer 页脚组件
    - 在 `components/layout/Footer.tsx` 中实现页脚
    - 包含版权信息、链接、分类快捷链接
    - 实现移动端单列布局
    - _需求：4.1、4.2、4.3_

  - [x] 5.4 创建根布局和首页
    - 实现 `app/[locale]/layout.tsx`，集成 Navbar 和 Footer
    - 实现 `app/[locale]/page.tsx` 首页，展示工具分类和推荐工具
    - 实现 `app/not-found.tsx` 404 页面
    - _需求：7.1、7.2、7.3、2.3_

  - [ ]* 5.5 编写属性测试：首页内容过滤正确性（Property 8）
    - **属性 8：首页内容过滤正确性**
    - **验证需求：7.1、7.3**

- [x] 6. 实现搜索引擎
  - [x] 6.1 创建 Search_Engine 封装
    - 在 `lib/search.ts` 中封装 Fuse.js
    - 实现 createSearchEngine 工厂函数，支持按语言构建索引
    - 实现 search 和 rebuild 方法
    - 配置 Fuse.js 选项（keys、threshold、includeScore）
    - _需求：8.1、8.4、8.5_

  - [x] 6.2 集成搜索到 Navbar
    - 在 Navbar 中添加搜索输入框和结果下拉面板
    - 实现防抖逻辑（300ms）
    - 实现搜索结果展示和点击跳转
    - 实现无结果提示
    - _需求：8.2、8.3_

  - [ ]* 6.3 编写属性测试：搜索结果相关性（Property 9）
    - **属性 9：搜索结果相关性**
    - **验证需求：8.1**

  - [ ]* 6.4 编写属性测试：搜索索引与注册表同步（Property 10）
    - **属性 10：搜索索引与注册表同步**
    - **验证需求：8.5**

- [x] 7. 创建可复用 UI 组件库
  - 在 `components/ui/` 中创建以下组件：
    - Button.tsx（支持不同尺寸和变体）
    - Input.tsx（文本输入框）
    - Textarea.tsx（多行文本输入）
    - CopyButton.tsx（一键复制功能）
    - ToolLayout.tsx（工具页面标准模板）
  - 确保所有组件支持 Tailwind 样式定制
  - 确保所有交互元素在移动端点击区域 ≥ 44×44px
  - _需求：9.1、9.2、5.2_

- [x] 8. 实现 JSON 格式化工具
  - [x] 8.1 创建 JSON 格式化工具组件
    - 在 `tools/json-formatter/index.tsx` 中实现工具组件
    - 实现输入区（Textarea）和输出区（代码块）
    - 实现格式化逻辑（JSON.parse + JSON.stringify 缩进）
    - 实现错误处理和错误提示展示
    - 集成 CopyButton 到输出区
    - _需求：10.1_

  - [ ]* 8.2 编写属性测试：JSON 格式化 round-trip（Property 12）
    - **属性 12：JSON 格式化 round-trip**
    - **验证需求：10.1**

  - [ ]* 8.3 编写单元测试：JSON 格式化边缘情况
    - 测试空字符串输入
    - 测试非法 JSON 输入
    - 测试嵌套深层对象
    - _需求：10.1_

- [x] 9. 实现字符统计工具
  - [x] 9.1 创建字符统计工具组件
    - 在 `tools/word-counter/index.tsx` 中实现工具组件
    - 实现输入区（Textarea）和统计结果展示区
    - 实现实时统计逻辑（字符数、单词数、行数）
    - 使用 Unicode-aware 字符计数（[...text].length）
    - _需求：10.2_

  - [ ]* 9.2 编写属性测试：字符统计正确性（Property 13）
    - **属性 13：字符统计正确性**
    - **验证需求：10.2**

  - [ ]* 9.3 编写单元测试：字符统计边缘情况
    - 测试空字符串
    - 测试纯空白字符
    - 测试多语言字符（CJK、emoji）
    - _需求：10.2_

- [x] 10. 实现响应式布局和样式
  - 配置 Tailwind desktop-first 断点（tablet、mobile）
  - 为 Navbar 实现移动端汉堡菜单和抽屉式展开
  - 为 Footer 实现移动端单列布局
  - 为工具页面实现响应式容器宽度
  - 确保所有页面无水平滚动条
  - _需求：5.1、5.3、3.3、4.3_

- [x] 11. 实现 Error Boundary 分层隔离
  - 创建 GlobalErrorBoundary 组件包裹整个应用
  - 创建 ToolErrorBoundary 组件包裹每个工具页面
  - 实现工具级错误提示 UI，不影响 Navbar/Footer
  - 在根布局中集成 Error Boundary
  - _需求：设计文档错误处理章节_

- [x] 12. 检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 13. 完善语言包和国际化覆盖
  - 为 10 种语言补全所有翻译文本（common、navbar、footer、tools）
  - 为两个示例工具添加完整的多语言名称和描述到 Tool_Registry
  - 实现语言切换器组件（下拉菜单或弹窗）
  - 实现语言偏好持久化（localStorage）
  - _需求：6.1、6.3、6.6、10.3_

- [x] 14. 实现分类页面和首页高级功能
  - 创建 `app/[locale]/category/[category]/page.tsx` 分类页面
  - 实现首页推荐工具区域（featured=true 的工具）
  - 实现首页按分类分组展示工具卡片
  - 实现工具卡片组件（图标、名称、描述、点击跳转）
  - _需求：7.1、7.2、7.3、7.4_

- [x] 15. 集成和优化
  - [x] 15.1 实现代码分割和懒加载
    - 配置 Next.js 动态导入工具组件
    - 验证首页 bundle 大小不随工具数量增长
    - _需求：2.4、11.1_

  - [x] 15.2 实现 SEO 优化
    - 为所有页面生成 sitemap.xml
    - 验证每个工具页面的 meta 标签正确生成
    - 配置 robots.txt
    - _需求：9.4、11.2_

  - [x] 15.3 实现触摸设备手势支持
    - 为移动端抽屉菜单添加滑动关闭手势
    - 测试触摸设备交互体验
    - _需求：5.4_

- [x] 16. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

## 注意事项

- 标记 `*` 的任务为可选任务，可跳过以加快 MVP 交付
- 每个任务都引用了具体需求编号以保证可追溯性
- 检查点任务确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边缘情况
- 所有代码示例使用 TypeScript
- 使用 Tailwind CSS desktop-first 策略（max-width 媒体查询）
