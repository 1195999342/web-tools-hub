# 实施计划：Web Tools Hub 扩展

## 概述

将 Web Tools Hub 从 2 个工具扩展至 256+ 个工具，分为平台基础设施升级和四个批次的工具实现。采用 TypeScript + Next.js 15 + next-intl 技术栈，纯静态导出部署到 Cloudflare Pages。

## 任务

- [ ] 1. 平台基础设施升级
  - [x] 1.1 扩展分类系统与注册表类型
    - 在 `tools/registry.ts` 中扩展 `ToolCategory` 类型，新增 `converter`、`formatter`、`image`、`css` 四个分类
    - 在所有语言包 `messages/*.json` 的 `categories` 中添加新分类的翻译
    - 更新 `app/[locale]/page.tsx` 中的 `CATEGORIES` 数组，包含所有 11 个分类
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 1.2 属性测试：注册表条目结构完整性
    - **Property 1: 注册表条目结构完整性**
    - 在 `__tests__/registry.test.ts` 中使用 fast-check 验证所有 ToolMeta 条目的 slug、icon、category 非空，且 supportedLocales 中每种语言的 name/description 均为非空字符串
    - **Validates: Requirements 1.1, 11.3**

  - [ ]* 1.3 属性测试：启用/禁用过滤正确性
    - **Property 2: 启用/禁用过滤正确性**
    - 验证 `getEnabledTools` 返回结果仅包含 `enabled === true` 的工具且不遗漏
    - **Validates: Requirements 1.3**

  - [ ]* 1.4 属性测试：重复 slug 检测
    - **Property 3: 重复 slug 检测**
    - 验证 `validateRegistry` 在存在重复 slug 时抛出错误，唯一时不抛出
    - **Validates: Requirements 1.4**

  - [x] 1.5 实现工具组件动态加载机制
    - 将 `app/[locale]/tools/[slug]/page.tsx` 中的静态 import 改为 `next/dynamic` 懒加载
    - 实现 `getToolComponent(slug)` 函数，使用 `dynamic(() => import(...))` 按需加载工具组件
    - 添加 `ToolSkeleton` 加载占位组件
    - 确保 `generateStaticParams` 正确生成所有 locale × tool 的静态路径
    - _Requirements: 2.1, 2.4, 11.1_

  - [ ]* 1.6 属性测试：路由路径格式正确性
    - **Property 4: 路由路径格式正确性**
    - 验证所有已启用工具和所有 locale 生成的路径遵循 `/{locale}/tools/{slug}/` 格式
    - **Validates: Requirements 2.1, 271.2**

  - [x] 1.7 新增可复用 UI 组件库
    - 创建 `components/ui/Select.tsx`：下拉选择器，支持单选，44×44px 最小点击区域，aria 属性
    - 创建 `components/ui/Tabs.tsx`：标签页切换组件，支持键盘操作
    - 创建 `components/ui/ColorPicker.tsx`：颜色选择器组件
    - 创建 `components/ui/FileDropzone.tsx`：文件拖拽上传区域，支持 aria-label
    - 创建 `components/ui/Slider.tsx`：滑块控件
    - 创建 `components/ui/Toggle.tsx`：开关切换组件
    - 创建 `components/ui/CodeEditor.tsx`：基于 textarea 的代码编辑器，支持语法高亮
    - 创建 `components/ui/StatCard.tsx`：统计数据卡片
    - 创建 `components/ui/DiffViewer.tsx`：代码对比查看器
    - 所有组件使用 Tailwind CSS，支持 className 覆盖，满足无障碍要求
    - _Requirements: 9.2, 13.1, 13.2, 5.2_

  - [x] 1.8 实现 SEO 组件
    - 创建 `lib/seo.ts`：定义 `ToolSeoData`、`HreflangEntry`、`WebApplicationJsonLd`、`OpenGraphMeta`、`TwitterCardMeta` 类型和生成函数
    - 创建 `components/seo/ToolJsonLd.tsx`：为工具页面生成 JSON-LD 结构化数据（WebApplication 类型）
    - 创建 `components/seo/HreflangTags.tsx`：生成 hreflang 标签集
    - 创建 `components/seo/OpenGraphMeta.tsx`：生成 OG 和 Twitter Card meta 标签
    - 更新 `app/[locale]/tools/[slug]/page.tsx` 的 `generateMetadata` 函数，生成完整的 SEO title（格式：`{工具名称} - {分类} | Web Tools Hub`）、description、canonical URL
    - _Requirements: 10.1, 10.2, 10.3, 10.6, 10.7, 6.6, 6.8, 139.1, 139.3, 139.4_

  - [ ]* 1.9 属性测试：SEO 元数据完整性
    - **Property 7: SEO 元数据完整性**
    - 在 `__tests__/seo.test.ts` 中验证所有已启用工具和所有 locale 生成的 SEO 数据包含非空 title（格式正确）、description、canonical URL、10 种语言的 hreflang 标签
    - **Validates: Requirements 10.1, 10.6, 6.6, 138.2**

  - [ ]* 1.10 属性测试：JSON-LD 结构化数据完整性
    - **Property 8: JSON-LD 结构化数据完整性**
    - 验证所有已启用工具生成的 JSON-LD 包含 @type: 'WebApplication'、非空 name/description/url/applicationCategory、operatingSystem: 'Any'、offers.price: '0'
    - **Validates: Requirements 10.3, 139.1**

  - [x] 1.11 实现构建时脚本
    - 创建 `scripts/generate-sitemap.ts`：构建后生成 sitemap.xml，包含所有 locale × tool 的 URL 及 xhtml:link
    - 创建 `scripts/generate-headers.ts`：生成 CF Pages `_headers` 文件（静态资源缓存 + 安全头）
    - 创建 `scripts/generate-redirects.ts`：生成 `_redirects` 文件（根路径重定向到默认 locale）
    - 创建 `scripts/check-cf-limits.ts`：CI 检查文件数量 < 20000，单文件 < 25MB
    - 更新 `package.json` 的 `build:cf` 脚本，串联构建和后处理脚本
    - _Requirements: 10.4, 10.5, 138.4, 278.1_

  - [ ]* 1.12 属性测试：Sitemap 覆盖完整性
    - **Property 9: Sitemap 覆盖完整性**
    - 验证生成的 sitemap 包含所有已启用工具在所有 locale 下的 URL，且每个条目包含所有语言版本的 xhtml:link
    - **Validates: Requirements 10.4, 138.4, 278.1**

  - [ ]* 1.13 属性测试：翻译回退正确性
    - **Property 5: 翻译回退正确性**
    - 在 `__tests__/i18n.test.ts` 中验证翻译回退逻辑：优先当前 locale → 英文 → 键名本身
    - **Validates: Requirements 6.5**

  - [ ]* 1.14 属性测试：搜索引擎包含性
    - **Property 6: 搜索引擎包含性**
    - 在 `__tests__/search.test.ts` 中验证以工具精确名称搜索时结果必须包含该工具
    - **Validates: Requirements 8.1**

- [ ] 2. 检查点 - 基础设施验证
  - 确保所有测试通过，ask the user if questions arise.
  - 运行 `npm run test` 验证所有属性测试和单元测试通过
  - 运行 `npm run build` 验证构建成功

- [ ] 3. P0 批次：核心工具实现（13 个新工具）
  - [x] 3.1 Base64 编码解码工具
    - 创建 `tools/base64/logic.ts`：实现 `encode(text: string): ToolResult<string>` 和 `decode(base64: string): ToolResult<string>`，支持标准和 URL-safe 变体
    - 创建 `tools/base64/index.tsx`：编码/解码双面板 UI，使用 Tabs 组件切换模式
    - 在 `tools/registry.ts` 中注册工具元数据（slug: 'base64', category: 'encoding'）
    - 在所有 `messages/*.json` 中添加翻译
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

  - [ ]* 3.2 属性测试：Base64 round-trip
    - **Property 11: 编码解码 round-trip（Base64）**
    - 在 `__tests__/tools/base64.test.ts` 中验证任意 UTF-8 文本编码后解码等于原始文本
    - **Validates: Requirements 26.3**

  - [x] 3.3 URL 编码解码工具
    - 创建 `tools/url-encoder/logic.ts`：实现 encodeURIComponent/encodeURI 两种模式的编码解码
    - 创建 `tools/url-encoder/index.tsx`：编码/解码 UI
    - 注册到 registry，添加翻译
    - _Requirements: 29.1, 29.2, 29.3, 29.4_

  - [ ]* 3.4 属性测试：URL 编码 round-trip
    - **Property 11: 编码解码 round-trip（URL）**
    - 验证任意文本 URL 编码后解码等于原始文本
    - **Validates: Requirements 29.4**

  - [x] 3.5 Unix 时间戳转换工具
    - 创建 `tools/timestamp/logic.ts`：实现时间戳与日期互转，支持秒/毫秒，支持时区选择
    - 创建 `tools/timestamp/index.tsx`：双向转换 UI，实时显示当前时间戳
    - 注册到 registry（category: 'converter'），添加翻译
    - _Requirements: 51.1, 51.2, 51.3, 51.4, 51.5, 51.6_

  - [x] 3.6 JSON 压缩与转义工具
    - 创建 `tools/json-minify/logic.ts`：实现 minify、escape、unescape 函数
    - 创建 `tools/json-minify/index.tsx`：压缩/转义/反转义三个操作按钮的 UI
    - 注册到 registry（category: 'json'），添加翻译
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 3.7 UUID/GUID 生成器
    - 创建 `tools/uuid-generator/logic.ts`：使用 `crypto.randomUUID()` 生成 UUID v4，支持批量生成、格式选项
    - 创建 `tools/uuid-generator/index.tsx`：生成配置 UI（数量、格式），结果列表
    - 注册到 registry（category: 'encoding'），添加翻译
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5_

  - [x] 3.8 哈希计算器（MD5/SHA/CRC）
    - 创建 `tools/hash-calculator/logic.ts`：使用 Web Crypto API 实现 SHA-1/256/384/512，使用第三方库实现 MD5/CRC-16/CRC-32
    - 创建 `tools/hash-calculator/index.tsx`：文本输入 + 算法选择 + 实时哈希结果展示（大写/小写）
    - 注册到 registry（category: 'encoding'），添加翻译
    - _Requirements: 27.1, 27.2, 27.4, 27.5_

  - [ ]* 3.9 属性测试：哈希幂等性
    - **Property 14: 哈希幂等性**
    - 在 `__tests__/tools/hash.test.ts` 中验证同一输入两次哈希结果完全相同
    - **Validates: Requirements 27.5**

  - [x] 3.10 颜色格式转换工具
    - 创建 `tools/color-converter/logic.ts`：实现 HEX/RGB/RGBA/HSL/HSLA/HSV/CMYK 互转
    - 创建 `tools/color-converter/index.tsx`：颜色输入 + 所有格式实时展示 + 颜色预览色块
    - 注册到 registry（category: 'color'），添加翻译
    - _Requirements: 55.1, 55.2, 55.4, 55.5, 55.6_

  - [x] 3.11 进制转换工具
    - 创建 `tools/radix-converter/logic.ts`：实现二/八/十/十六进制互转，支持 BigInt
    - 创建 `tools/radix-converter/index.tsx`：输入 + 源进制选择 + 四种进制结果同时展示
    - 注册到 registry（category: 'converter'），添加翻译
    - _Requirements: 52.1, 52.2, 52.3, 52.4, 52.5_

  - [x] 3.12 大小写转换工具
    - 创建 `tools/case-converter/logic.ts`：实现全大写、全小写、Title Case、Sentence Case、大小写互换
    - 创建 `tools/case-converter/index.tsx`：文本输入 + 模式选择 + 实时结果
    - 注册到 registry（category: 'converter'），添加翻译
    - _Requirements: 54.1, 54.2, 54.3_

  - [x] 3.13 随机密码生成器
    - 创建 `tools/password-generator/logic.ts`：使用 `crypto.getRandomValues()` 生成密码，支持长度/字符类型配置，密码强度评估
    - 创建 `tools/password-generator/index.tsx`：配置面板 + 密码展示 + 强度指示器 + 批量生成
    - 注册到 registry（category: 'encoding'），添加翻译
    - _Requirements: 38.1, 38.2, 38.3, 38.4, 38.5, 38.6_

  - [x] 3.14 JSON 排序工具
    - 创建 `tools/json-sort/logic.ts`：实现递归键排序（升序/降序），保持数组顺序不变
    - 创建 `tools/json-sort/index.tsx`：JSON 输入 + 排序方式选择 + 结果展示
    - 注册到 registry（category: 'json'），添加翻译
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [ ]* 3.15 属性测试：JSON 排序值保持不变
    - **Property 16: JSON 排序值保持不变**
    - 在 `__tests__/tools/json-sort.test.ts` 中验证排序后所有值的集合与排序前完全相同
    - **Validates: Requirements 17.4**

  - [x] 3.16 正则表达式测试器
    - 创建 `tools/regex-tester/logic.ts`：实现正则匹配、替换、捕获组提取
    - 创建 `tools/regex-tester/index.tsx`：正则输入 + 标志位选择 + 测试文本 + 高亮匹配 + 匹配详情 + 常用模板
    - 注册到 registry（category: 'misc'），添加翻译
    - _Requirements: 124.1, 124.2, 124.3, 124.4, 124.5, 124.6_

  - [x] 3.17 二维码生成与解码工具
    - 创建 `tools/qrcode/logic.ts`：使用第三方库（如 qrcode + jsQR）实现生成和解码
    - 创建 `tools/qrcode/index.tsx`：文本输入 + 配置（大小/颜色/纠错级别）+ 二维码预览 + 图片上传解码
    - 注册到 registry（category: 'converter'），添加翻译
    - _Requirements: 56.1, 56.2, 56.3, 56.4, 56.5_

  - [ ]* 3.18 属性测试：JSON 格式化 round-trip
    - **Property 10: JSON 格式化 round-trip**
    - 在 `__tests__/tools/json-formatter.test.ts` 中使用 fast-check 验证合法 JSON 格式化后再解析等于原始值
    - **Validates: Requirements 14.1, 16.4**

- [ ] 4. 检查点 - P0 批次验证
  - 确保所有测试通过，ask the user if questions arise.
  - 验证所有 P0 工具在 `npm run build` 下正确生成静态页面
  - 验证注册表中无重复 slug

- [ ] 5. P1 批次：高价值工具实现（25 个工具）
  - [ ] 5.1 JSON 工具组（4 个）
    - 实现 JSON 与其他格式互转（`tools/json-converter/`）：JSON ↔ XML/YAML/TOML/CSV，使用 Tabs 切换格式
    - 实现 JSON 转语言实体类（`tools/json-to-class/`）：支持 TypeScript/Java/Go/Python/C#/Swift/Kotlin/Dart/Rust/Ruby
    - 实现 JWT 解码器（`tools/jwt-decoder/`）：解码 Header/Payload/Signature，时间戳字段转可读日期
    - 实现 JSON Schema 生成器（`tools/json-schema/`）：从 JSON 推断 Draft-07 Schema
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加 10 种语言翻译
    - _Requirements: 18.1-18.6, 19.1-19.6, 22.1-22.5, 20.1-20.4_

  - [ ]* 5.2 属性测试：JSON-YAML round-trip
    - **Property 13: 格式互转 round-trip（JSON ↔ YAML）**
    - 验证 JSON → YAML → JSON 产生等价结果
    - **Validates: Requirements 18.4**

  - [ ]* 5.3 属性测试：JSON-XML round-trip
    - **Property 13: 格式互转 round-trip（JSON ↔ XML）**
    - 验证 JSON → XML → JSON 产生等价结果
    - **Validates: Requirements 18.5**

  - [ ] 5.4 编码加密工具组（4 个）
    - 实现 Unicode 与中文互转（`tools/unicode-converter/`）：\uXXXX 格式互转
    - 实现对称加密解密（`tools/symmetric-cipher/`）：AES/DES/3DES/RC4/Rabbit，支持模式和填充选择
    - 实现 HTML 转义/反转义（`tools/html-escape/`）：HTML 实体编码解码
    - 实现任意文件转 Base64（`tools/file-base64/`）：文件上传转 Base64 + Data URI，Base64 还原文件下载
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 30.1-30.3, 28.1-28.7, 148.1-148.4, 140.1-140.5_

  - [ ]* 5.5 属性测试：编码 round-trip 组
    - **Property 11: 编码解码 round-trip（Unicode、HTML 转义）**
    - 验证 Unicode 转义/反转义 round-trip
    - 验证 HTML 转义/反转义 round-trip
    - **Validates: Requirements 30.3, 148.3**

  - [ ]* 5.6 属性测试：加密解密 round-trip
    - **Property 12: 加密解密 round-trip**
    - 验证 AES 加密后解密等于原始明文
    - **Validates: Requirements 28.5**

  - [ ] 5.7 文字处理工具组（3 个）
    - 实现文本去重（`tools/text-dedup/`）：去除重复行，支持大小写敏感/不敏感，显示行数对比
    - 实现文本排序（`tools/text-sort/`）：字母/数字/长度/随机排序，支持去除空行
    - 实现去除空行/空白处理（`tools/text-trim/`）：去空行、trim、合并空行、合并为一行
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 68.1-68.4, 69.1-69.4, 70.1-70.3_

  - [ ] 5.8 代码格式化工具组（4 个）
    - 实现变量命名转换（`tools/naming-converter/`）：camelCase/PascalCase/snake_case/kebab-case 等互转
    - 实现 JavaScript/HTML 格式化（`tools/js-formatter/`）：格式化和压缩，自定义缩进
    - 实现 CSS 格式化与压缩（`tools/css-formatter/`）：格式化和压缩
    - 实现 SQL 格式化与压缩（`tools/sql-formatter/`）：关键词大写、缩进对齐，支持多种方言
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 47.1-47.4, 43.1-43.5, 44.1-44.4, 45.1-45.4_

  - [ ] 5.9 XML 格式化与压缩 + 转换工具组（3 个）
    - 实现 XML 格式化与压缩（`tools/xml-formatter/`）：格式化、压缩、错误提示
    - 实现 Properties 转 YAML（`tools/properties-yaml/`）：.properties ↔ YAML 互转
    - 实现 JSON 转 SQL（`tools/json-to-sql/`）：JSON 数组生成 INSERT 语句，支持多种 SQL 方言
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 46.1-46.4, 151.1-151.4, 152.1-152.5_

  - [ ]* 5.10 属性测试：XML 格式化/压缩语义等价
    - **Property 17: XML 格式化/压缩语义等价**
    - 验证合法 XML 格式化后再压缩保持语义等价
    - **Validates: Requirements 46.4**

  - [ ] 5.11 其他 P1 工具组（7 个）
    - 实现代码对比/Diff 工具（`tools/diff-viewer/`）：并排和内联模式，颜色标注差异
    - 实现 Markdown 编辑器（`tools/markdown-editor/`）：左右分栏编辑预览，GFM 支持
    - 实现 Cron 表达式生成器（`tools/cron-generator/`）：可视化配置 + 人类可读描述 + 未来执行时间
    - 实现单位换算器（`tools/unit-converter/`）：长度/温度/重量/体积/面积等 10 类单位
    - 实现文件大小换算（`tools/filesize-converter/`）：B/KB/MB/GB/TB/PB，二进制和十进制
    - 实现随机数生成器（`tools/random-number/`）：整数/浮点数，范围/批量/去重
    - 实现 PHP 序列化/反序列化（`tools/php-serialize/`）：PHP 序列化 ↔ JSON 互转
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 128.1-128.5, 75.1-75.6, 127.1-127.5, 63.1-63.4, 58.1-58.3, 116.1-116.5, 186.1-186.3_

- [ ] 6. 检查点 - P1 批次验证
  - 确保所有测试通过，ask the user if questions arise.
  - 验证所有 P0 + P1 工具构建成功
  - 运行 `scripts/check-cf-limits.ts` 确认文件数量在 CF Pages 限制内

- [ ] 7. P2 批次：扩展工具实现（50 个工具）
  - [ ] 7.1 CSS 工具组（7 个）
    - 实现 CSS 渐变生成器（`tools/css-gradient/`）：线性/径向渐变，可视化编辑器
    - 实现 CSS 贝塞尔曲线编辑器（`tools/css-bezier/`）：拖拽控制点，预设曲线，动画预览
    - 实现 CSS Flex 布局编辑器（`tools/css-flex/`）：可视化 Flex 属性编辑
    - 实现毛玻璃效果生成器（`tools/css-glassmorphism/`）：backdrop-filter 可视化编辑
    - 实现新拟态风格生成器（`tools/css-neumorphism/`）：box-shadow 可视化编辑
    - 实现 CSS 圆角生成器（`tools/css-border-radius/`）：四角独立/联动调整
    - 实现 px/em/rem 互转（`tools/px-converter/`）：自定义基准字体大小
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 90.1-90.6, 89.1-89.5, 95.1-95.5, 96.1-96.4, 97.1-97.4, 94.1-94.5, 64.1-64.3_

  - [ ] 7.2 颜色工具组（3 个）
    - 实现渐变色集合（`tools/gradient-collection/`）：100+ 精选渐变色方案，按色系筛选
    - 实现配色工具（`tools/color-palette/`）：互补色/类似色/三角色等配色规则
    - 实现中国/日本传统色彩（`tools/traditional-colors/`）：各 100+ 种传统色彩，色卡展示
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 91.1-91.5, 92.1-92.5, 93.1-93.5_

  - [ ] 7.3 图片处理工具组（4 个）
    - 实现图片裁剪（`tools/image-crop/`）：Canvas API，自由/固定比例裁剪
    - 实现图片压缩（`tools/image-compress/`）：Canvas API，质量调整，批量压缩
    - 实现图片格式转换（`tools/image-converter/`）：JPG/PNG/WebP/GIF/BMP 互转
    - 实现图片缩放（`tools/image-resize/`）：按比例/自由/百分比缩放
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 104.1-104.6, 111.1-111.6, 65.1-65.6, 106.1-106.5_

  - [ ] 7.4 网络工具组（5 个）
    - 实现 curl 转代码（`tools/curl-converter/`）：转 JS/Python/Go/Java/PHP/Node.js
    - 实现 URL 地址解析（`tools/url-parser/`）：解析 URL 各部分，支持编辑重组
    - 实现浏览器信息检测（`tools/browser-info/`）：检测浏览器/OS/屏幕/API 支持
    - 实现 Meta Tag 生成器（`tools/meta-generator/`）：表单配置生成 meta 标签
    - 实现 htaccess 转 nginx（`tools/htaccess-nginx/`）：Apache 规则转 Nginx 配置
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 87.1-87.5, 81.1-81.4, 86.1-86.3, 149.1-149.4, 183.1-183.4_

  - [ ] 7.5 转换工具组（10 个）
    - 实现 HTML 转 Markdown（`tools/html-to-markdown/`）：常见 HTML 元素转 Markdown
    - 实现汉字转拼音（`tools/pinyin/`）：带声调/不带声调/数字声调，多音字
    - 实现简繁体互转（`tools/simplified-traditional/`）：内置简繁对照表
    - 实现数字转中文（`tools/number-to-chinese/`）：普通中文数字 + 大写金额
    - 实现图片转 Base64（`tools/image-base64/`）：图片上传转 Base64 + Data URI
    - 实现 CSV 转 JSON（`tools/csv-to-json/`）：自定义分隔符，首行作键名
    - 实现时间转换工具（`tools/time-converter/`）：ISO 8601/RFC 2822/时区转换/时间差
    - 实现图片转 PDF（`tools/image-to-pdf/`）：多图合并 PDF，拖拽排序
    - 实现 PDF 转图片（`tools/pdf-to-image/`）：每页渲染为 PNG/JPG
    - 实现 JPG/PNG 转 SVG（`tools/image-to-svg/`）：图像追踪算法转矢量
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 59.1-59.4, 60.1-60.4, 62.1-62.3, 57.1-57.4, 39.1-39.5, 24.1-24.5, 172.1-172.4, 194.1-194.4, 195.1-195.3, 188.1-188.5_

  - [ ] 7.6 文字处理与格式化工具组（8 个）
    - 实现去除 HTML 格式（`tools/html-strip/`）：去除标签保留文本结构
    - 实现在线自动排版工具（`tools/auto-typeset/`）：中英文空格、标点修正
    - 实现文本中英文数字清除（`tools/text-filter/`）：选择性保留/清除中文/英文/数字
    - 实现 Python 代码格式化（`tools/python-formatter/`）：PEP 8 规范
    - 实现 Java 代码格式化（`tools/java-formatter/`）：缩进和大括号风格
    - 实现 PHP 代码格式化（`tools/php-formatter/`）：基本格式化
    - 实现子网掩码换算器（`tools/subnet-calculator/`）：CIDR ↔ 子网掩码互转
    - 实现网页设计色彩搭配表（`tools/color-schemes/`）：50+ 精选配色方案
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 150.1-150.4, 161.1-161.4, 203.1-203.4, 178.1-178.3, 179.1-179.3, 180.1-180.2, 185.1-185.3, 158.1-158.5_

  - [ ] 7.7 其他 P2 工具组（9 个）
    - 实现条形码生成器（`tools/barcode/`）：Code 128/39/EAN-13 等格式
    - 实现图表生成器（`tools/chart-generator/`）：饼图/柱状图/折线图/散点图/雷达图
    - 实现键盘按键值查询（`tools/keycode/`）：实时显示 key/keyCode/code
    - 实现 Shield Badge 生成器（`tools/shield-badge/`）：自定义标签/消息/颜色/样式
    - 实现 GIF 生成器（`tools/gif-maker/`）：多图合成 GIF，帧间隔/循环设置
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 126.1-126.4, 130.1-130.5, 142.1-142.4, 156.1-156.4, 196.1-196.5_

- [ ] 8. 检查点 - P2 批次验证
  - 确保所有测试通过，ask the user if questions arise.
  - 验证所有 P0 + P1 + P2 工具构建成功
  - 运行 CF Pages 限制检查脚本

- [ ] 9. P3 批次：长尾工具实现（166 个工具）
  - [ ] 9.1 JSON 工具组（6 个）
    - 实现 JSON 树形查看器（`tools/json-tree/`）、JSON 随机生成器（`tools/json-random/`）、JSON 清理工具（`tools/json-cleaner/`）、JSON 与 GET 字符串互转（`tools/json-querystring/`）、JSON 着色工具（`tools/json-highlight/`）、JSON 在线编辑器（`tools/json-editor/`）
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 15.1-15.5, 23.1-23.5, 25.1-25.4, 21.1-21.4, 230.1-230.3, 231.1-231.4_

  - [ ]* 9.2 属性测试：JSON-查询字符串 round-trip
    - **Property 13: 格式互转 round-trip（JSON ↔ 查询字符串）**
    - 验证扁平 JSON 对象 → 查询字符串 → JSON 产生等价结果
    - **Validates: Requirements 21.3**

  - [ ] 9.3 编码加密工具组（15 个）
    - 实现 Escape 编码解码、Base32/Base58/Base62、Bcrypt 密码生成验证、摩斯密码转换、Gzip 压缩解压、htpasswd 生成器、文件哈希计算器、NATIVE/ASCII 互转、RSA 密钥对生成、网址十六进制加密、UTF-8 编码/解码、Email 地址加密、自签名证书生成、JS 加密混淆、Scrypt 密码生成验证
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 32, 33, 34, 35, 36, 37, 40, 41, 42, 162, 163, 164, 165, 166, 146_

  - [ ]* 9.4 属性测试：编码 round-trip 批量
    - **Property 11: 编码解码 round-trip（Escape、Base32/58/62、Gzip、NATIVE/ASCII、UTF-8）**
    - 验证各编码方案的 round-trip 正确性
    - **Validates: Requirements 32.3, 33.3, 36.4, 41.3, 163.3**

  - [ ]* 9.5 属性测试：摩斯密码 round-trip
    - **Property 13: 格式互转 round-trip（文本 ↔ 摩斯密码）**
    - 验证英文字母和数字的文本 → 摩斯 → 文本 round-trip
    - **Validates: Requirements 35.4**

  - [ ]* 9.6 属性测试：RSA 加密解密 round-trip
    - **Property 12: 加密解密 round-trip（RSA）**
    - 验证 RSA 公钥加密后私钥解密等于原始明文
    - **Validates: Requirements 42.5**

  - [ ] 9.7 代码格式化工具组（6 个）
    - 实现 Cookie 格式化、HTTP Header 格式化、URL 参数格式化、C/C# 代码格式化、Ruby/Perl/VBScript 格式化、SQL 双引号处理
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 48, 49, 50, 181, 182, 218_

  - [ ] 9.8 转换工具组（25 个）
    - 实现十六进制与文本互转、全角半角互转、地图经纬度换算、经纬度转度分秒、短地址互转、HTML/UBB 互转、文档转 PDF、国际单位制转换、IP 地址转 Int、矩阵与 JSON 互转、Cookie 转 JS 代码、富文本转 Markdown、视频转 MP3、视频切片、视频画面裁剪、PDF 压缩、PDF 编辑器、PHP 序列化数据转换、数字转多国货币大写、JS Eval 加密解密、迅雷/快车 URL 加解密、种子转磁力链、HTML 转 JS 互转、公历农历互转、PHPSESSION 数据转换
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 53, 61, 167, 168, 169, 170, 171, 173, 175, 176, 177, 187, 189, 190, 191, 192, 193, 186b, 214, 147, 237, 238, 241, 245, 167b_

  - [ ]* 9.9 属性测试：转换 round-trip 批量
    - **Property 13: 格式互转 round-trip（十六进制↔文本、全角↔半角、IP↔Int）**
    - 验证文本 → 十六进制 → 文本、全角 → 半角 → 全角、IP → Int → IP 的 round-trip
    - **Validates: Requirements 53.4, 61.3, 175.3**

  - [ ]* 9.10 属性测试：颜色 round-trip
    - **Property 13: 格式互转 round-trip（HEX ↔ RGB）**
    - 验证 HEX → RGB → HEX 产生相同结果
    - **Validates: Requirements 55.6**

  - [ ] 9.11 文字处理工具组（16 个）
    - 实现文本逆序/翻转、文本查找替换、序号添加/移除、字符串出现次数统计、ASCII 艺术字生成、数值列表求和、文本随机打乱、序列号生成器、文字竖排生成、文字间隔生成、随机汉字生成器、文本按列截取、文本长度过滤、汉字书写/笔画工具、汉字笔画统计、彩色文字特效生成
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 67, 71, 72, 73, 74, 76, 77, 78, 79, 80, 153, 154, 155, 201, 202, 204_

  - [ ]* 9.12 属性测试：文本逆序 involution
    - **Property 15: 文本逆序 involution**
    - 验证任意文本（含 Unicode 和 emoji）逆序两次等于原始文本
    - **Validates: Requirements 67.4**

  - [ ] 9.13 网络工具组（7 个）
    - 实现 UserAgent 生成与分析、IP 地址工具、MAC 地址生成器、robots.txt 生成器、正则表达式代码生成、常用 UserAgent 列表、在线 Robots 检测
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 82, 83, 84, 85, 88, 184, 260_

  - [ ] 9.14 CSS/前端工具组（12 个）
    - 实现 CSS 动画效果生成器、霓虹灯/故障文字效果、WEB 安全色、调色板、图片取色器、SVG 压缩与编辑预览、在线字体查看器、3D 卡片翻转效果 CSS、液态变形效果 CSS、CSS Sprites 精灵图、弹出窗口生成器、UI 颜色渐变 CSS
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 99, 100, 101, 102, 103, 98, 141, 143, 144, 145, 226, 224_

  - [ ] 9.15 图片处理工具组（11 个）
    - 实现九宫格切图、图片加水印、图片旋转/翻转、GIF 转帧、占位图片生成、ICO 图标生成、照片 EXIF 信息查看、涂鸦绘画板、灰度图/黑白图制作、图片切圆角、手写签名提取、TIFF 图片分割、证件照背景修改、iOS/Android Logo 生成
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 105, 107, 108, 109, 110, 112, 113, 114, 115, 197, 198, 199, 157, 225_

  - [ ] 9.16 数学工具组（10 个）
    - 实现进制运算器、最大公约数/最小公倍数、质数生成器、斐波那契数列生成、方差/标准差计算器、圆周率查询、最小二乘法回归、振动参数计算、蒙特卡罗估算圆周率、自然常数 e 生成器、带宽计算器、二进制运算、小数随机生成
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 117, 118, 119, 120, 121, 122, 123, 174, 221, 222, 215, 261, 262_

  - [ ] 9.17 颜色工具组（2 个）
    - 实现 48 色蜡笔/彩铅色彩（`tools/crayon-colors/`）、相反颜色取色器（`tools/inverse-color/`）
    - 每个工具：创建 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 223, 133_

  - [ ] 9.18 其他/杂项工具组（30+ 个）
    - 实现 XPath 测试器、在线秒表/计时器、CSV 转 HTML 表格、字符串拼接工具、Lottie 动画预览、FontAwesome 图标查询、思维导图、文字生成图片、三维数据可视化、数据库设计工具、网络拓扑图制作、格子纸制作、迷宫生成器、会议倒计时器、随机点名工具、反应速度测试、色盲色弱测试、文件格式识别、屏幕 PPI 计算器、移动设备 UI 尺寸规范、HTML5 兼容性测试、证件照尺寸标准、CRX 下载地址解析、在线 Emoji 符号大全、特殊符号大全、拼音首字母排序、ZIP 文件列表查看
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 125, 129, 131, 132, 134, 135, 136, 137, 200, 205, 206, 207, 208, 209, 210, 211, 212, 213, 216, 217, 227, 228, 229, 267, 268, 219, 220_

  - [ ] 9.19 SQL/后端工具组（10 个）
    - 实现 SQL 生成 Java 代码、MySQL/Oracle 转 Java 实体类、SQL 转 C# 实体类、INSERT/UPDATE 字段视图、HTML/JS/CSS 代码过滤、JSON 与 Postman 互转、SQL 转 Form 表单、SQL 转 JSON、URL 和 Postman 互转、SQL 转 Yii 模型
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 255, 256, 257, 258, 259, 263, 264, 265, 266, 269_

  - [ ] 9.20 数据编辑器工具组（4 个）
    - 实现 XML 在线编辑器、YAML 在线编辑器/校验器、TOML 在线编辑器/校验器、在线 RunJS 编辑器
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 232, 233, 234, 244_

  - [ ] 9.21 哈希补充工具组（3 个）
    - 实现 MD2/MD4 哈希计算、Shake/Keccak 哈希计算、PostgreSQL/MySQL/MariaDB 密码生成
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 235, 236, 240_

  - [ ] 9.22 生活工具组（8 个）
    - 实现十二生肖查询、身份证号码校验、血型遗传计算器、BMI/BMR 计算器、汽车油耗计算器、电动车充电费用计算器、硬盘整数分区计算器、十二时辰时间转换器、支票日期大写转换、前端快捷键速查表、常用 JS 库 CDN 查询、curl 转代码全语言版
    - 每个工具：创建 `tools/{slug}/` 目录，实现 logic.ts + index.tsx，注册到 registry，添加翻译
    - _Requirements: 246, 247, 248, 249, 250, 251, 252, 253, 254, 242, 243, 270_

- [ ] 10. 最终检查点 - 全量验证
  - 确保所有测试通过，ask the user if questions arise.
  - 运行 `npm run build` 验证全量构建成功
  - 运行 `scripts/check-cf-limits.ts` 确认文件数量 < 20000
  - 验证 sitemap.xml 包含所有工具的所有语言版本 URL
  - 验证所有注册表条目无重复 slug

## 备注

- 标记 `*` 的任务为可选测试任务，可跳过以加速 MVP
- 每个任务引用了具体的需求编号以确保可追溯性
- 检查点确保增量验证，及时发现问题
- 属性测试验证通用正确性属性，单元测试验证具体边界情况
- P3 批次工具按分类批量组织，每个子任务内的工具遵循统一开发模式：创建目录 → logic.ts → index.tsx → registry 注册 → 翻译 → 测试
