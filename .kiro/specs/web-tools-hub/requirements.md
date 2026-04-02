# 需求文档

## 简介

Web Tools Hub 是一个基于 Next.js + next-intl 的多语言在线工具集合平台，参考 bejson.com 等主流工具站，提供全面的前端可实现的 Web 工具。平台采用静态导出（SSG），纯前端运行，无需后端服务。支持 10 种语言的国际化，具备良好的 SEO 和 GEO（地理本地化）能力。每个工具拥有独立路由、独立页面，公共导航栏与页脚统一管理，架构高度可扩展。

## 词汇表

- **Hub**：工具站主平台，负责路由分发、导航、页脚等公共能力
- **Tool**：单个独立工具页面，拥有唯一路径，功能自包含
- **Tool_Registry**：工具注册表，集中管理所有工具的元数据
- **Navbar**：顶部导航栏，全局统一
- **Footer**：底部页脚，全局统一
- **I18n_Manager**：国际化管理器，负责语言包加载与文本翻译
- **Router**：前端路由系统
- **Category**：工具分类，包括 text、json、encoding、color、network、math、converter、formatter、image、css、misc
- **Search_Engine**：站内搜索引擎
- **SEO_Manager**：搜索引擎优化管理器，负责生成 meta 标签、结构化数据、sitemap 等
- **GEO_Manager**：地理本地化管理器，负责 hreflang 标签、语言路由、地区适配等

---

## 第一部分：平台基础设施需求（需求 1-13）

### 需求 1：工具注册与元数据管理

**用户故事：** 作为开发者，我希望通过统一的注册表管理所有工具的元数据，以便新增工具时只需添加一条配置。

#### 验收标准

1. THE Tool_Registry SHALL 以 TypeScript 对象数组存储每个工具的元数据，包括：slug、name、description、category、icon、支持的语言列表、启用/禁用状态、推荐标记。
2. WHEN 开发者向 Tool_Registry 添加一条新工具配置时，THE Hub SHALL 自动在路由系统中注册该工具的路径。
3. THE Tool_Registry SHALL 支持工具的启用/禁用状态标记，WHEN 工具被标记为禁用时，THE Router SHALL 返回 404 页面。
4. IF Tool_Registry 中存在重复的工具 slug，THEN THE Hub SHALL 在构建阶段抛出错误并终止构建。

---

### 需求 2：独立工具路由

**用户故事：** 作为用户，我希望每个工具都有独立且语义化的 URL 路径，以便直接访问、收藏或分享。

#### 验收标准

1. THE Router SHALL 为每个工具分配唯一路径，格式为 `/{locale}/tools/{slug}`。
2. WHEN 用户访问工具路径时，THE Router SHALL 仅加载该工具对应的页面组件，公共 Navbar 和 Footer 保持不变。
3. WHEN 用户访问不存在的工具路径时，THE Router SHALL 展示统一的 404 错误页面。
4. THE Router SHALL 支持代码分割，WHEN 用户首次访问某工具页面时，THE Hub SHALL 仅加载该工具所需的 JavaScript 资源。

---

### 需求 3：公共导航栏

**用户故事：** 作为用户，我希望在所有页面顶部看到统一的导航栏，以便快速跳转到其他工具或返回首页。

#### 验收标准

1. THE Navbar SHALL 在所有页面顶部持续显示，包含：平台 Logo、工具分类导航菜单、站内搜索入口、语言切换控件。
2. WHILE 用户在移动设备（视口宽度 < 768px）上浏览时，THE Navbar SHALL 将分类导航菜单折叠为汉堡菜单。
3. WHEN 用户点击分类导航菜单项时，THE Navbar SHALL 跳转至对应分类的工具列表页面。
4. THE Navbar SHALL 高亮显示当前页面所属的导航菜单项。

---

### 需求 4：公共页脚

**用户故事：** 作为用户，我希望在所有页面底部看到统一的页脚，以便获取平台信息和相关链接。

#### 验收标准

1. THE Footer SHALL 在所有页面底部显示，包含：版权信息、隐私政策链接、使用条款链接、联系方式。
2. THE Footer SHALL 展示工具分类快捷链接列表，分类数据来源于 Tool_Registry。
3. WHILE 用户在移动设备上浏览时，THE Footer SHALL 将多列布局折叠为单列垂直排列。

---

### 需求 5：响应式布局

**用户故事：** 作为用户，我希望在手机、平板、电脑上都能获得良好的浏览体验。

#### 验收标准

1. THE Hub SHALL 采用响应式布局策略，支持桌面端（> 1024px）、平板（768px – 1024px）和移动端（< 768px）。
2. WHEN 用户在移动端访问时，THE Hub SHALL 确保所有交互元素的点击区域不小于 44×44px。
3. THE Hub SHALL 确保页面在所有断点下不出现水平滚动条。

---

### 需求 6：多语言国际化（i18n）与地理本地化（GEO）

**用户故事：** 作为来自不同地区的用户，我希望能以自己的语言使用工具站，并获得针对我所在地区优化的体验。

#### 验收标准

1. THE I18n_Manager SHALL 支持 10 种语言：en、zh-cn、zh-tw、ja、ko、es、fr、de、pt、ru。
2. THE I18n_Manager SHALL 将每种语言的翻译文本存储在独立的语言包文件中。
3. WHEN 用户通过语言切换控件选择语言时，THE I18n_Manager SHALL 切换所有界面文本为目标语言。
4. THE I18n_Manager SHALL 将用户的语言偏好持久化存储至 localStorage。
5. IF 当前语言包中缺少某条翻译文本，THEN THE I18n_Manager SHALL 回退显示英文原文。
6. THE GEO_Manager SHALL 为每个页面生成 hreflang 标签，标明所有支持语言的替代 URL。
7. THE GEO_Manager SHALL 根据语言自动设置 HTML lang 属性和文本方向（dir）。
8. THE SEO_Manager SHALL 为每个工具页面生成语言特定的 title 和 meta description。

---

### 需求 7：工具首页与分类展示

**用户故事：** 作为用户，我希望在首页看到所有工具的分类概览，以便快速发现和找到所需工具。

#### 验收标准

1. THE Hub SHALL 在首页按 Category 分组展示所有已启用的工具，每个工具以卡片形式展示图标、名称和简短描述。
2. WHEN 用户点击工具卡片时，THE Router SHALL 导航至该工具的独立页面。
3. THE Hub SHALL 在首页顶部展示推荐工具区域，推荐工具列表通过 Tool_Registry 中的 featured 字段配置。
4. WHEN Tool_Registry 中的工具数量超过 50 个时，THE Hub 首页 SHALL 支持按分类筛选。

---

### 需求 8：站内搜索

**用户故事：** 作为用户，我希望通过搜索快速找到所需工具。

#### 验收标准

1. THE Search_Engine SHALL 支持对工具名称、描述、分类进行全文模糊匹配搜索。
2. WHEN 用户在搜索框输入关键词时，THE Search_Engine SHALL 在用户停止输入 300ms 后展示实时搜索结果。
3. WHEN 搜索结果为空时，THE Search_Engine SHALL 展示"未找到相关工具"的提示信息。
4. THE Search_Engine SHALL 在客户端完成搜索，无需请求后端接口。

---

### 需求 9：工具页面框架

**用户故事：** 作为开发者，我希望有一个标准的工具页面模板，以便快速开发新工具并保持视觉一致性。

#### 验收标准

1. THE Hub SHALL 提供工具页面布局模板，包含：工具标题区、工具操作区、工具说明区。
2. THE Hub SHALL 提供可复用的 UI 组件库（Input、Textarea、Button、CopyButton、Select、Tabs、ColorPicker 等）。
3. WHEN 开发者创建新工具时，THE Hub SHALL 要求工具组件仅需实现核心逻辑，公共布局由框架自动注入。
4. THE SEO_Manager SHALL 为每个工具页面自动生成 title 和 meta description 标签。

---

### 需求 10：SEO 优化

**用户故事：** 作为平台运营者，我希望每个工具页面都能被搜索引擎良好索引，以获取自然流量。

#### 验收标准

1. THE SEO_Manager SHALL 为每个工具页面生成唯一的、包含关键词的 title 标签，格式为 `{工具名称} - {分类} | Web Tools Hub`。
2. THE SEO_Manager SHALL 为每个工具页面生成 meta description，内容为工具的多语言描述。
3. THE SEO_Manager SHALL 生成 JSON-LD 结构化数据（Schema.org WebApplication 类型），包含工具名称、描述、分类、URL。
4. THE Hub SHALL 生成 sitemap.xml，包含所有已启用工具在所有支持语言下的 URL。
5. THE Hub SHALL 生成 robots.txt，允许搜索引擎爬取所有工具页面。
6. THE SEO_Manager SHALL 为每个页面生成 canonical URL 标签，避免多语言页面的重复内容问题。
7. THE SEO_Manager SHALL 为每个页面生成 Open Graph 和 Twitter Card meta 标签，支持社交媒体分享预览。

---

### 需求 11：性能与可扩展性

**用户故事：** 作为平台运营者，我希望平台在工具数量增长时仍能保持良好性能。

#### 验收标准

1. THE Router SHALL 对所有工具页面实施懒加载，确保首页初始加载的 JavaScript bundle 大小不随工具数量线性增长。
2. THE Hub SHALL 支持静态站点生成（SSG），以保证首屏加载性能和 SEO 友好性。
3. THE Tool_Registry SHALL 设计为纯数据配置，确保在工具数量达到 1000 个时注册表的读取和解析时间不超过 50ms。
4. WHEN 新增工具时，THE Hub SHALL 确保开发者只需创建工具组件文件并在 Tool_Registry 添加配置即可完成接入。

---

### 需求 12：分类系统扩展

**用户故事：** 作为开发者，我希望分类系统能够灵活扩展，以容纳更多类型的工具。

#### 验收标准

1. THE Tool_Registry SHALL 支持以下分类：text（文字处理）、json（JSON 工具）、encoding（编码加密）、color（颜色工具）、network（网络工具）、math（数学工具）、converter（格式转换）、formatter（代码格式化）、image（图片处理）、css（前端/CSS 工具）、misc（其他工具）。
2. WHEN 新增分类时，THE Hub SHALL 仅需在 ToolCategory 类型定义和语言包中添加对应条目。
3. THE Hub SHALL 在首页和导航栏中自动展示所有已有工具的分类。

---

### 需求 13：无障碍访问

**用户故事：** 作为有视觉或运动障碍的用户，我希望能够无障碍地使用所有工具。

#### 验收标准

1. THE Hub SHALL 确保所有交互元素具有适当的 ARIA 标签和角色。
2. THE Hub SHALL 确保所有工具页面可通过键盘完全操作。
3. THE Hub SHALL 确保文本与背景的颜色对比度符合 WCAG 2.1 AA 级标准（对比度 ≥ 4.5:1）。
4. WHEN 工具操作产生结果或错误时，THE Hub SHALL 通过 aria-live 区域通知屏幕阅读器。

---

## 第二部分：JSON 工具需求（需求 14-25）

### 需求 14：JSON 格式化与校验（已实现）

**用户故事：** 作为开发者，我希望能格式化和校验 JSON 数据，以便快速排查数据格式问题。

#### 验收标准

1. WHEN 用户输入合法 JSON 文本并点击格式化按钮时，THE Tool SHALL 输出缩进美化后的 JSON。
2. WHEN 用户输入非法 JSON 文本时，THE Tool SHALL 展示明确的错误提示，包含错误位置信息。
3. THE Tool SHALL 支持自定义缩进空格数（2/4/Tab）。
4. THE Tool SHALL 提供一键复制格式化结果的功能。

---

### 需求 15：JSON 树形查看器/编辑器

**用户故事：** 作为开发者，我希望以树形结构可视化查看和编辑 JSON 数据，以便直观理解复杂嵌套结构。

#### 验收标准

1. WHEN 用户输入合法 JSON 时，THE Tool SHALL 将其渲染为可折叠/展开的树形视图。
2. THE Tool SHALL 在树形节点旁显示数据类型标签（string、number、boolean、null、array、object）。
3. WHEN 用户点击树形节点时，THE Tool SHALL 高亮该节点并显示其 JSON Path。
4. THE Tool SHALL 支持展开全部/折叠全部操作。
5. THE Tool SHALL 支持搜索树形节点中的键名或值。

---

### 需求 16：JSON 压缩与转义

**用户故事：** 作为开发者，我希望能压缩 JSON 或对 JSON 字符串进行转义/反转义，以便在不同场景中使用。

#### 验收标准

1. WHEN 用户输入格式化的 JSON 并点击压缩按钮时，THE Tool SHALL 输出去除所有空白的单行 JSON。
2. WHEN 用户点击转义按钮时，THE Tool SHALL 将 JSON 字符串中的特殊字符（引号、换行等）进行转义。
3. WHEN 用户点击反转义按钮时，THE Tool SHALL 将转义后的 JSON 字符串还原为原始 JSON。
4. FOR ALL 合法 JSON 输入，压缩后再格式化 SHALL 产生与原始格式化结果等价的 JSON（round-trip 属性）。

---

### 需求 17：JSON 排序

**用户故事：** 作为开发者，我希望能对 JSON 对象的键进行排序，以便比较和规范化 JSON 数据。

#### 验收标准

1. WHEN 用户输入 JSON 并选择排序方式时，THE Tool SHALL 递归地对所有嵌套对象的键进行排序。
2. THE Tool SHALL 支持升序（A-Z）和降序（Z-A）两种排序方式。
3. THE Tool SHALL 保持数组元素的原始顺序不变，仅对对象键排序。
4. FOR ALL 合法 JSON 输入，排序操作 SHALL 保持 JSON 的值不变（仅改变键的顺序）。

---

### 需求 18：JSON 与其他格式互转

**用户故事：** 作为开发者，我希望能在 JSON 与 XML、YAML、TOML、CSV 等格式之间互相转换。

#### 验收标准

1. THE Tool SHALL 支持以下格式互转：JSON ↔ XML、JSON ↔ YAML、JSON ↔ TOML、JSON ↔ CSV。
2. WHEN 用户选择源格式和目标格式并输入数据时，THE Tool SHALL 输出转换后的结果。
3. IF 输入数据格式不合法，THEN THE Tool SHALL 展示明确的错误提示。
4. FOR ALL 合法 JSON 输入，JSON → YAML → JSON 转换 SHALL 产生与原始 JSON 等价的结果（round-trip 属性）。
5. FOR ALL 合法 JSON 输入，JSON → XML → JSON 转换 SHALL 产生与原始 JSON 等价的结果（round-trip 属性）。
6. THE Tool SHALL 支持一键复制转换结果。

---

### 需求 19：JSON 转语言实体类

**用户故事：** 作为开发者，我希望能从 JSON 数据自动生成各编程语言的类型定义或实体类代码。

#### 验收标准

1. THE Tool SHALL 支持从 JSON 生成以下语言的类型定义：TypeScript、Java、Go、Python、C#、Swift、Kotlin、Dart、Rust、Ruby。
2. WHEN 用户输入 JSON 并选择目标语言时，THE Tool SHALL 生成对应语言的类型定义代码。
3. THE Tool SHALL 正确推断 JSON 值的类型（string、number、boolean、null、array、object）。
4. WHEN JSON 中包含嵌套对象时，THE Tool SHALL 生成嵌套的类型定义。
5. THE Tool SHALL 支持自定义根类型名称。
6. THE Tool SHALL 支持一键复制生成的代码。

---

### 需求 20：JSON Schema 生成器

**用户故事：** 作为开发者，我希望能从 JSON 数据自动生成 JSON Schema，以便用于数据校验。

#### 验收标准

1. WHEN 用户输入 JSON 数据时，THE Tool SHALL 自动推断并生成对应的 JSON Schema（Draft-07 格式）。
2. THE Tool SHALL 正确推断所有基本类型、数组类型和嵌套对象类型。
3. THE Tool SHALL 将所有顶层键标记为 required 字段。
4. THE Tool SHALL 支持一键复制生成的 Schema。

---

### 需求 21：JSON 与 GET 请求字符串互转

**用户故事：** 作为开发者，我希望能在 JSON 对象和 URL 查询字符串之间互相转换。

#### 验收标准

1. WHEN 用户输入 JSON 对象时，THE Tool SHALL 将其转换为 URL 编码的查询字符串。
2. WHEN 用户输入查询字符串时，THE Tool SHALL 将其解析为 JSON 对象。
3. FOR ALL 扁平 JSON 对象，JSON → 查询字符串 → JSON 转换 SHALL 产生与原始 JSON 等价的结果（round-trip 属性）。
4. THE Tool SHALL 正确处理特殊字符的 URL 编码。

---

### 需求 22：JWT 解码器

**用户故事：** 作为开发者，我希望能解码 JWT Token 查看其 Header 和 Payload 内容。

#### 验收标准

1. WHEN 用户输入 JWT Token 时，THE Tool SHALL 解码并分别展示 Header、Payload 和 Signature 三部分。
2. THE Tool SHALL 将 Header 和 Payload 以格式化 JSON 形式展示。
3. WHEN Payload 中包含 exp、iat、nbf 等时间戳字段时，THE Tool SHALL 同时展示人类可读的日期时间格式。
4. IF 输入的 Token 格式不合法，THEN THE Tool SHALL 展示明确的错误提示。
5. THE Tool SHALL 在纯前端完成解码，不将 Token 发送到任何服务器。

---

### 需求 23：JSON 随机生成器

**用户故事：** 作为开发者，我希望能快速生成随机 JSON 测试数据，以便用于开发和测试。

#### 验收标准

1. THE Tool SHALL 支持配置生成的 JSON 结构：字段数量、嵌套深度、数组长度。
2. THE Tool SHALL 支持生成以下数据类型：string、number、boolean、null、array、object。
3. WHEN 用户点击生成按钮时，THE Tool SHALL 输出符合配置的随机 JSON 数据。
4. THE Tool SHALL 支持基于 JSON Schema 生成符合 Schema 的随机数据。
5. THE Tool SHALL 生成的 JSON 数据始终为合法 JSON。

---

### 需求 24：Excel/CSV 转 JSON

**用户故事：** 作为数据分析师，我希望能将 Excel 或 CSV 数据快速转换为 JSON 格式。

#### 验收标准

1. WHEN 用户粘贴 CSV 文本时，THE Tool SHALL 将其解析为 JSON 数组。
2. THE Tool SHALL 使用 CSV 第一行作为 JSON 对象的键名。
3. THE Tool SHALL 支持自定义分隔符（逗号、制表符、分号）。
4. IF CSV 数据格式不规范（列数不一致），THEN THE Tool SHALL 展示警告信息并尽力解析。
5. THE Tool SHALL 支持一键复制转换结果。

---

### 需求 25：JSON 清理工具

**用户故事：** 作为开发者，我希望能清理 JSON 数据中的注释、尾逗号等非标准内容。

#### 验收标准

1. WHEN 用户输入包含注释（// 或 /* */）的 JSON 时，THE Tool SHALL 移除注释并输出合法 JSON。
2. THE Tool SHALL 移除尾逗号（trailing commas）。
3. THE Tool SHALL 支持将单引号替换为双引号。
4. IF 清理后的内容仍非合法 JSON，THEN THE Tool SHALL 展示错误提示。

---

## 第三部分：编码与加密工具需求（需求 26-42）

### 需求 26：Base64 编码解码

**用户故事：** 作为开发者，我希望能对文本进行 Base64 编码和解码。

#### 验收标准

1. WHEN 用户输入文本并点击编码按钮时，THE Tool SHALL 输出 Base64 编码结果。
2. WHEN 用户输入 Base64 字符串并点击解码按钮时，THE Tool SHALL 输出解码后的原始文本。
3. FOR ALL 合法 UTF-8 文本，编码后再解码 SHALL 产生与原始文本相同的结果（round-trip 属性）。
4. THE Tool SHALL 支持 URL-safe Base64 变体。
5. IF 输入的 Base64 字符串格式不合法，THEN THE Tool SHALL 展示错误提示。

---

### 需求 27：哈希计算器（MD5/SHA/CRC）

**用户故事：** 作为开发者，我希望能计算文本或文件的各种哈希值，以便校验数据完整性。

#### 验收标准

1. THE Tool SHALL 支持以下哈希算法：MD5、SHA-1、SHA-256、SHA-384、SHA-512、CRC-16、CRC-32、RIPEMD-160。
2. WHEN 用户输入文本时，THE Tool SHALL 实时计算并展示所有选中算法的哈希值。
3. THE Tool SHALL 支持文件哈希计算，用户可拖拽或选择文件进行计算。
4. THE Tool SHALL 展示哈希值的大写和小写两种格式。
5. FOR ALL 相同输入，THE Tool SHALL 始终产生相同的哈希值（幂等性）。

---

### 需求 28：对称加密解密（AES/DES/3DES/RC4/Rabbit）

**用户故事：** 作为开发者，我希望能使用对称加密算法对文本进行加密和解密。

#### 验收标准

1. THE Tool SHALL 支持以下对称加密算法：AES（128/192/256）、DES、3DES、RC4、Rabbit。
2. WHEN 用户输入明文、密钥并选择算法后点击加密按钮时，THE Tool SHALL 输出加密后的密文。
3. WHEN 用户输入密文、密钥并选择算法后点击解密按钮时，THE Tool SHALL 输出解密后的明文。
4. THE Tool SHALL 支持选择加密模式（ECB、CBC、CFB、OFB、CTR）和填充方式（PKCS7、ZeroPadding）。
5. FOR ALL 明文和密钥组合，加密后再解密 SHALL 产生与原始明文相同的结果（round-trip 属性）。
6. IF 解密失败（密钥错误或数据损坏），THEN THE Tool SHALL 展示明确的错误提示。
7. THE Tool SHALL 在纯前端完成所有加密解密操作，不将数据发送到任何服务器。

---

### 需求 29：URL 编码解码

**用户故事：** 作为开发者，我希望能对 URL 进行编码和解码。

#### 验收标准

1. WHEN 用户输入文本并点击编码按钮时，THE Tool SHALL 输出 URL 编码（percent-encoding）结果。
2. WHEN 用户输入 URL 编码字符串并点击解码按钮时，THE Tool SHALL 输出解码后的原始文本。
3. THE Tool SHALL 支持 encodeURIComponent 和 encodeURI 两种编码模式。
4. FOR ALL 合法文本，编码后再解码 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 30：Unicode 与中文互转

**用户故事：** 作为开发者，我希望能在 Unicode 转义序列和中文字符之间互相转换。

#### 验收标准

1. WHEN 用户输入中文文本时，THE Tool SHALL 将其转换为 Unicode 转义序列（\uXXXX 格式）。
2. WHEN 用户输入 Unicode 转义序列时，THE Tool SHALL 将其转换为对应的字符。
3. FOR ALL 合法文本，中文 → Unicode → 中文转换 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 31：UUID/GUID 生成器

**用户故事：** 作为开发者，我希望能快速生成 UUID，以便用于唯一标识符。

#### 验收标准

1. THE Tool SHALL 支持生成 UUID v4（随机）。
2. THE Tool SHALL 支持批量生成，用户可指定生成数量（1-1000）。
3. THE Tool SHALL 支持选择输出格式：标准格式（带连字符）、无连字符、大写、小写。
4. WHEN 用户点击生成按钮时，THE Tool SHALL 立即生成指定数量的 UUID。
5. THE Tool SHALL 支持一键复制所有生成的 UUID。

---

### 需求 32：Escape 编码解码

**用户故事：** 作为开发者，我希望能对字符串进行 JavaScript escape/unescape 编码解码。

#### 验收标准

1. WHEN 用户输入文本并点击编码按钮时，THE Tool SHALL 输出 escape 编码结果。
2. WHEN 用户输入编码字符串并点击解码按钮时，THE Tool SHALL 输出解码后的原始文本。
3. FOR ALL 合法文本，编码后再解码 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 33：Base32/Base58/Base62 编码解码

**用户故事：** 作为开发者，我希望能使用多种 Base 编码方案对数据进行编码和解码。

#### 验收标准

1. THE Tool SHALL 支持 Base32、Base58（Bitcoin 字母表）、Base62 编码解码。
2. WHEN 用户选择编码方案并输入数据时，THE Tool SHALL 输出对应的编码结果。
3. FOR ALL 合法输入，编码后再解码 SHALL 产生与原始输入相同的结果（round-trip 属性）。

---

### 需求 34：Bcrypt 密码生成与验证

**用户故事：** 作为开发者，我希望能生成 Bcrypt 哈希密码并验证密码是否匹配。

#### 验收标准

1. WHEN 用户输入密码并选择 cost factor（4-12）时，THE Tool SHALL 生成 Bcrypt 哈希值。
2. WHEN 用户输入密码和 Bcrypt 哈希值时，THE Tool SHALL 验证密码是否与哈希匹配。
3. THE Tool SHALL 在纯前端完成所有计算。

---

### 需求 35：摩斯密码转换

**用户故事：** 作为用户，我希望能在文本和摩斯密码之间互相转换。

#### 验收标准

1. WHEN 用户输入英文文本时，THE Tool SHALL 将其转换为摩斯密码（点和划表示）。
2. WHEN 用户输入摩斯密码时，THE Tool SHALL 将其转换为英文文本。
3. THE Tool SHALL 支持播放摩斯密码的音频信号。
4. FOR ALL 合法英文字母和数字输入，文本 → 摩斯 → 文本转换 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 36：Gzip 压缩解压

**用户故事：** 作为开发者，我希望能在浏览器中对文本进行 Gzip 压缩和解压。

#### 验收标准

1. WHEN 用户输入文本并点击压缩按钮时，THE Tool SHALL 使用 Gzip 算法压缩并输出 Base64 编码的压缩结果。
2. WHEN 用户输入 Base64 编码的 Gzip 数据并点击解压按钮时，THE Tool SHALL 输出解压后的原始文本。
3. THE Tool SHALL 显示压缩前后的数据大小和压缩率。
4. FOR ALL 合法文本输入，压缩后再解压 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 37：htpasswd 生成器

**用户故事：** 作为运维人员，我希望能生成 htpasswd 格式的密码条目。

#### 验收标准

1. WHEN 用户输入用户名和密码时，THE Tool SHALL 生成 htpasswd 格式的条目。
2. THE Tool SHALL 支持多种哈希算法：bcrypt、MD5（APR1）、SHA-1。
3. THE Tool SHALL 支持一键复制生成的条目。

---

### 需求 38：随机密码生成器

**用户故事：** 作为用户，我希望能生成安全的随机密码。

#### 验收标准

1. THE Tool SHALL 支持配置密码长度（8-128 字符）。
2. THE Tool SHALL 支持选择包含的字符类型：大写字母、小写字母、数字、特殊符号。
3. THE Tool SHALL 显示密码强度指示器。
4. THE Tool SHALL 支持批量生成多个密码。
5. THE Tool SHALL 支持一键复制生成的密码。
6. THE Tool SHALL 使用 crypto.getRandomValues() 生成密码，确保密码的随机性。

---

### 需求 39：图片转 Base64

**用户故事：** 作为开发者，我希望能将图片转换为 Base64 编码字符串，以便嵌入到代码中。

#### 验收标准

1. WHEN 用户上传或拖拽图片文件时，THE Tool SHALL 将其转换为 Base64 编码字符串。
2. THE Tool SHALL 支持 JPG、PNG、GIF、WebP、SVG 格式。
3. THE Tool SHALL 同时生成可直接使用的 Data URI（含 MIME 类型前缀）。
4. THE Tool SHALL 显示原始文件大小和 Base64 编码后的大小。
5. THE Tool SHALL 支持一键复制 Base64 字符串或 Data URI。

---

### 需求 40：文件哈希计算器

**用户故事：** 作为开发者，我希望能计算文件的哈希值以校验文件完整性。

#### 验收标准

1. WHEN 用户上传或拖拽文件时，THE Tool SHALL 计算文件的 MD5、SHA-1、SHA-256 哈希值。
2. THE Tool SHALL 在浏览器端使用 Web Crypto API 或 WebAssembly 完成计算。
3. THE Tool SHALL 显示计算进度条（对于大文件）。
4. THE Tool SHALL 支持对比两个文件的哈希值是否一致。

---

### 需求 41：NATIVE/ASCII 互转

**用户故事：** 作为 Java 开发者，我希望能在 Native 字符和 ASCII 转义之间互相转换（用于 .properties 文件）。

#### 验收标准

1. WHEN 用户输入包含非 ASCII 字符的文本时，THE Tool SHALL 将其转换为 \uXXXX 格式的 ASCII 转义。
2. WHEN 用户输入包含 \uXXXX 转义的文本时，THE Tool SHALL 将其转换为 Native 字符。
3. FOR ALL 合法文本，Native → ASCII → Native 转换 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 42：RSA 密钥对生成与加密解密

**用户故事：** 作为开发者，我希望能生成 RSA 密钥对并进行加密解密操作。

#### 验收标准

1. THE Tool SHALL 支持生成 RSA 密钥对（1024/2048/4096 位）。
2. WHEN 用户输入明文和公钥时，THE Tool SHALL 使用 RSA 算法加密并输出密文。
3. WHEN 用户输入密文和私钥时，THE Tool SHALL 解密并输出明文。
4. THE Tool SHALL 使用 Web Crypto API 在纯前端完成所有操作。
5. FOR ALL 明文和密钥对组合，公钥加密后用私钥解密 SHALL 产生与原始明文相同的结果（round-trip 属性）。

---

## 第四部分：代码格式化工具需求（需求 43-50）

### 需求 43：JavaScript/HTML 格式化与压缩

**用户故事：** 作为前端开发者，我希望能格式化或压缩 JavaScript 和 HTML 代码。

#### 验收标准

1. WHEN 用户输入 JavaScript 代码并点击格式化按钮时，THE Tool SHALL 输出缩进美化后的代码。
2. WHEN 用户点击压缩按钮时，THE Tool SHALL 输出去除空白和注释的压缩代码。
3. THE Tool SHALL 支持自定义缩进（2空格/4空格/Tab）。
4. THE Tool SHALL 支持 HTML 代码的格式化和压缩。
5. THE Tool SHALL 支持一键复制结果。

---

### 需求 44：CSS 格式化与压缩

**用户故事：** 作为前端开发者，我希望能格式化或压缩 CSS 代码。

#### 验收标准

1. WHEN 用户输入 CSS 代码并点击格式化按钮时，THE Tool SHALL 输出缩进美化后的 CSS。
2. WHEN 用户点击压缩按钮时，THE Tool SHALL 输出去除空白和注释的压缩 CSS。
3. THE Tool SHALL 保持 CSS 属性的语义正确性。
4. THE Tool SHALL 支持一键复制结果。

---

### 需求 45：SQL 格式化与压缩

**用户故事：** 作为后端开发者，我希望能格式化 SQL 语句，以便提高可读性。

#### 验收标准

1. WHEN 用户输入 SQL 语句并点击格式化按钮时，THE Tool SHALL 输出关键词大写、缩进对齐的 SQL。
2. WHEN 用户点击压缩按钮时，THE Tool SHALL 输出单行压缩的 SQL。
3. THE Tool SHALL 支持常见 SQL 方言（MySQL、PostgreSQL、SQLite）。
4. THE Tool SHALL 支持一键复制结果。

---

### 需求 46：XML 格式化与压缩

**用户故事：** 作为开发者，我希望能格式化或压缩 XML 数据。

#### 验收标准

1. WHEN 用户输入 XML 数据并点击格式化按钮时，THE Tool SHALL 输出缩进美化后的 XML。
2. WHEN 用户点击压缩按钮时，THE Tool SHALL 输出去除空白的单行 XML。
3. IF 输入的 XML 格式不合法，THEN THE Tool SHALL 展示错误提示。
4. FOR ALL 合法 XML 输入，格式化后再压缩 SHALL 保持 XML 的语义等价性（round-trip 属性）。

---

### 需求 47：变量命名转换

**用户故事：** 作为开发者，我希望能在不同命名风格之间转换变量名。

#### 验收标准

1. THE Tool SHALL 支持以下命名风格互转：camelCase、PascalCase、snake_case、SCREAMING_SNAKE_CASE、kebab-case、dot.case。
2. WHEN 用户输入变量名并选择目标风格时，THE Tool SHALL 输出转换后的变量名。
3. THE Tool SHALL 支持批量转换（多行输入，每行一个变量名）。
4. THE Tool SHALL 自动检测输入的命名风格。

---

### 需求 48：Cookie 格式化

**用户故事：** 作为前端开发者，我希望能将 Cookie 字符串格式化为可读的键值对。

#### 验收标准

1. WHEN 用户输入 Cookie 字符串时，THE Tool SHALL 将其解析为格式化的键值对表格。
2. THE Tool SHALL 显示每个 Cookie 的名称、值、以及可选属性（Domain、Path、Expires 等）。
3. THE Tool SHALL 支持将格式化结果导出为 JSON 格式。

---

### 需求 49：HTTP Header 格式化

**用户故事：** 作为开发者，我希望能将 HTTP Header 字符串格式化为可读的键值对。

#### 验收标准

1. WHEN 用户输入 HTTP Header 文本时，THE Tool SHALL 将其解析为格式化的键值对表格。
2. THE Tool SHALL 支持解析标准 HTTP Header 格式（每行一个 Header，冒号分隔）。
3. THE Tool SHALL 支持将结果导出为 JSON 格式。

---

### 需求 50：URL 参数格式化

**用户故事：** 作为开发者，我希望能将 URL 中的查询参数格式化为可读的键值对。

#### 验收标准

1. WHEN 用户输入完整 URL 或查询字符串时，THE Tool SHALL 将参数解析为格式化的键值对表格。
2. THE Tool SHALL 自动对参数值进行 URL 解码。
3. THE Tool SHALL 支持编辑参数后重新生成 URL。
4. THE Tool SHALL 支持将结果导出为 JSON 格式。

---

## 第五部分：格式转换工具需求（需求 51-65）

### 需求 51：Unix 时间戳转换

**用户故事：** 作为开发者，我希望能在 Unix 时间戳和人类可读日期之间互相转换。

#### 验收标准

1. WHEN 用户输入 Unix 时间戳（秒或毫秒）时，THE Tool SHALL 将其转换为人类可读的日期时间格式。
2. WHEN 用户选择日期时间时，THE Tool SHALL 将其转换为 Unix 时间戳。
3. THE Tool SHALL 显示当前时间的 Unix 时间戳（实时更新）。
4. THE Tool SHALL 支持多种日期格式输出（ISO 8601、本地化格式等）。
5. THE Tool SHALL 支持时区选择。
6. FOR ALL 合法时间戳，时间戳 → 日期 → 时间戳转换 SHALL 产生与原始时间戳相同的结果（round-trip 属性）。

---

### 需求 52：进制转换

**用户故事：** 作为开发者，我希望能在不同进制之间转换数字。

#### 验收标准

1. THE Tool SHALL 支持二进制、八进制、十进制、十六进制之间的互相转换。
2. WHEN 用户输入数字并选择源进制和目标进制时，THE Tool SHALL 实时显示转换结果。
3. THE Tool SHALL 同时显示所有四种进制的结果。
4. THE Tool SHALL 支持大数（BigInt）转换。
5. IF 输入包含非法字符（不属于所选进制），THEN THE Tool SHALL 展示错误提示。

---

### 需求 53：十六进制与文本互转

**用户故事：** 作为开发者，我希望能在十六进制字符串和文本之间互相转换。

#### 验收标准

1. WHEN 用户输入文本时，THE Tool SHALL 将其转换为十六进制字符串。
2. WHEN 用户输入十六进制字符串时，THE Tool SHALL 将其转换为文本。
3. THE Tool SHALL 支持选择编码方式（UTF-8、ASCII）。
4. FOR ALL 合法文本，文本 → 十六进制 → 文本转换 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 54：大小写转换

**用户故事：** 作为用户，我希望能快速转换文本的大小写。

#### 验收标准

1. THE Tool SHALL 支持以下转换模式：全部大写、全部小写、首字母大写（Title Case）、句首大写（Sentence Case）、大小写互换。
2. WHEN 用户输入文本并选择转换模式时，THE Tool SHALL 实时显示转换结果。
3. THE Tool SHALL 支持一键复制结果。

---

### 需求 55：颜色格式转换（RGB/HEX/HSL/HSV/CMYK）

**用户故事：** 作为设计师或前端开发者，我希望能在不同颜色格式之间互相转换。

#### 验收标准

1. THE Tool SHALL 支持以下颜色格式互转：HEX、RGB、RGBA、HSL、HSLA、HSV、CMYK。
2. WHEN 用户输入任意格式的颜色值时，THE Tool SHALL 实时显示所有其他格式的等价值。
3. THE Tool SHALL 提供可视化颜色选择器（Color Picker）。
4. THE Tool SHALL 显示颜色预览色块。
5. THE Tool SHALL 支持一键复制任意格式的颜色值。
6. FOR ALL 合法颜色值，HEX → RGB → HEX 转换 SHALL 产生与原始值相同的结果（round-trip 属性）。

---

### 需求 56：二维码生成与解码

**用户故事：** 作为用户，我希望能生成和解码二维码。

#### 验收标准

1. WHEN 用户输入文本或 URL 时，THE Tool SHALL 生成对应的二维码图片。
2. THE Tool SHALL 支持自定义二维码大小、颜色、纠错级别（L/M/Q/H）。
3. THE Tool SHALL 支持下载生成的二维码图片（PNG/SVG 格式）。
4. WHEN 用户上传二维码图片时，THE Tool SHALL 解码并显示其中的文本内容。
5. FOR ALL 合法文本输入，生成二维码后再解码 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 57：数字转中文（人民币大写）

**用户故事：** 作为财务人员，我希望能将数字转换为中文大写金额。

#### 验收标准

1. WHEN 用户输入数字时，THE Tool SHALL 将其转换为中文大写金额格式（如：壹佰贰拾叁元肆角伍分）。
2. THE Tool SHALL 支持普通中文数字转换（一二三）和大写金额转换（壹贰叁）。
3. THE Tool SHALL 正确处理小数点、零的读法规则。
4. THE Tool SHALL 支持负数和大数（万、亿、兆）。

---

### 需求 58：文件大小换算

**用户故事：** 作为用户，我希望能在不同文件大小单位之间换算。

#### 验收标准

1. THE Tool SHALL 支持以下单位互转：B、KB、MB、GB、TB、PB。
2. THE Tool SHALL 同时支持二进制（1024）和十进制（1000）两种换算标准。
3. WHEN 用户输入数值和源单位时，THE Tool SHALL 实时显示所有单位的换算结果。

---

### 需求 59：HTML 转 Markdown

**用户故事：** 作为内容创作者，我希望能将 HTML 内容转换为 Markdown 格式。

#### 验收标准

1. WHEN 用户输入 HTML 内容时，THE Tool SHALL 将其转换为 Markdown 格式。
2. THE Tool SHALL 支持常见 HTML 元素的转换：标题、段落、列表、链接、图片、代码块、表格、粗体、斜体。
3. THE Tool SHALL 保持转换后 Markdown 的可读性和格式正确性。
4. THE Tool SHALL 支持一键复制转换结果。

---

### 需求 60：汉字转拼音

**用户故事：** 作为用户，我希望能将汉字转换为拼音，以便学习或处理中文文本。

#### 验收标准

1. WHEN 用户输入汉字时，THE Tool SHALL 将其转换为拼音。
2. THE Tool SHALL 支持带声调和不带声调两种输出模式。
3. THE Tool SHALL 支持多音字的常用读音。
4. THE Tool SHALL 支持选择拼音格式：带声调符号、数字声调、无声调。

---

### 需求 61：全角半角互转

**用户故事：** 作为用户，我希望能在全角字符和半角字符之间互相转换。

#### 验收标准

1. WHEN 用户输入包含全角字符的文本时，THE Tool SHALL 将其转换为半角字符。
2. WHEN 用户输入包含半角字符的文本时，THE Tool SHALL 将其转换为全角字符。
3. FOR ALL 合法文本，全角 → 半角 → 全角转换 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

### 需求 62：简繁体互转

**用户故事：** 作为中文用户，我希望能在简体中文和繁体中文之间互相转换。

#### 验收标准

1. WHEN 用户输入简体中文文本时，THE Tool SHALL 将其转换为繁体中文。
2. WHEN 用户输入繁体中文文本时，THE Tool SHALL 将其转换为简体中文。
3. THE Tool SHALL 在纯前端完成转换，使用内置的简繁对照表。

---

### 需求 63：单位换算器

**用户故事：** 作为用户，我希望能在各种度量单位之间进行换算。

#### 验收标准

1. THE Tool SHALL 支持以下类别的单位换算：长度、温度、重量/质量、体积/容积、面积、压力、角度、速度、功率、时间。
2. WHEN 用户输入数值、选择源单位和目标单位时，THE Tool SHALL 实时显示换算结果。
3. THE Tool SHALL 在每个类别中提供常用单位的快捷选择。
4. THE Tool SHALL 显示换算公式。

---

### 需求 64：px/em/rem 互转

**用户故事：** 作为前端开发者，我希望能在 px、em、rem 单位之间互相转换。

#### 验收标准

1. THE Tool SHALL 支持 px、em、rem、pt、% 之间的互相转换。
2. THE Tool SHALL 支持自定义基准字体大小（默认 16px）。
3. WHEN 用户输入数值和源单位时，THE Tool SHALL 实时显示所有单位的换算结果。

---

### 需求 65：图片格式转换

**用户故事：** 作为用户，我希望能在浏览器中转换图片格式。

#### 验收标准

1. THE Tool SHALL 支持以下格式互转：JPG、PNG、WebP、GIF、BMP。
2. WHEN 用户上传图片并选择目标格式时，THE Tool SHALL 在浏览器端完成格式转换。
3. THE Tool SHALL 支持调整输出质量（对于有损格式）。
4. THE Tool SHALL 显示转换前后的文件大小对比。
5. THE Tool SHALL 支持下载转换后的图片。
6. THE Tool SHALL 使用 Canvas API 在纯前端完成转换。

---

## 第六部分：文字处理工具需求（需求 66-80）

### 需求 66：字符统计（已实现）

**用户故事：** 作为用户，我希望能统计文本中的字符数、单词数和行数。

#### 验收标准

1. WHEN 用户输入文本时，THE Tool SHALL 实时统计并展示字符数、单词数、行数。
2. THE Tool SHALL 使用 Unicode 感知的字符计数方式。
3. THE Tool SHALL 统计结果随输入内容变化实时更新。

---

### 需求 67：文本逆序/翻转

**用户故事：** 作为用户，我希望能将文本逆序翻转。

#### 验收标准

1. WHEN 用户输入文本时，THE Tool SHALL 将字符顺序完全逆转。
2. THE Tool SHALL 支持按字符逆序和按行逆序两种模式。
3. THE Tool SHALL 正确处理 Unicode 字符（包括 emoji）。
4. FOR ALL 合法文本，逆序两次 SHALL 产生与原始文本相同的结果（幂等性的变体）。

---

### 需求 68：文本去重

**用户故事：** 作为用户，我希望能去除文本中的重复行。

#### 验收标准

1. WHEN 用户输入多行文本时，THE Tool SHALL 去除重复行并输出结果。
2. THE Tool SHALL 支持大小写敏感和不敏感两种去重模式。
3. THE Tool SHALL 显示去重前后的行数对比。
4. THE Tool SHALL 保持首次出现的行的原始顺序。

---

### 需求 69：文本排序

**用户故事：** 作为用户，我希望能对文本行进行排序。

#### 验收标准

1. WHEN 用户输入多行文本时，THE Tool SHALL 按选定规则对行进行排序。
2. THE Tool SHALL 支持以下排序方式：字母升序、字母降序、数字升序、数字降序、按行长度排序、随机打乱。
3. THE Tool SHALL 支持大小写敏感和不敏感排序。
4. THE Tool SHALL 支持去除空行选项。

---

### 需求 70：去除空行/空白处理

**用户故事：** 作为用户，我希望能清理文本中的空行和多余空白。

#### 验收标准

1. THE Tool SHALL 支持以下清理操作：去除空行、去除首尾空白（trim）、合并连续空行为单个空行、去除所有换行（合并为一行）、多行换一行。
2. WHEN 用户选择清理操作并输入文本时，THE Tool SHALL 实时显示清理结果。
3. THE Tool SHALL 支持多个清理操作组合使用。

---

### 需求 71：文本查找替换

**用户故事：** 作为用户，我希望能在文本中查找和替换内容。

#### 验收标准

1. THE Tool SHALL 支持普通文本查找替换和正则表达式查找替换。
2. THE Tool SHALL 高亮显示所有匹配项。
3. THE Tool SHALL 显示匹配项数量。
4. THE Tool SHALL 支持大小写敏感/不敏感选项。
5. THE Tool SHALL 支持全部替换和逐个替换。

---

### 需求 72：序号添加/移除

**用户故事：** 作为用户，我希望能为文本行添加或移除序号。

#### 验收标准

1. WHEN 用户输入多行文本并点击添加序号时，THE Tool SHALL 为每行添加序号前缀。
2. THE Tool SHALL 支持自定义序号格式（1. / 1) / 01. / 第1行 等）。
3. THE Tool SHALL 支持自定义起始序号。
4. WHEN 用户点击移除序号时，THE Tool SHALL 移除每行开头的序号。

---

### 需求 73：字符串出现次数统计

**用户故事：** 作为用户，我希望能统计某个字符串在文本中出现的次数。

#### 验收标准

1. WHEN 用户输入文本和搜索字符串时，THE Tool SHALL 统计搜索字符串在文本中出现的次数。
2. THE Tool SHALL 支持大小写敏感和不敏感统计。
3. THE Tool SHALL 高亮显示所有匹配位置。
4. THE Tool SHALL 支持正则表达式搜索。

---

### 需求 74：ASCII 艺术字生成

**用户故事：** 作为用户，我希望能将文本转换为 ASCII 艺术字。

#### 验收标准

1. WHEN 用户输入文本时，THE Tool SHALL 将其转换为 ASCII 艺术字。
2. THE Tool SHALL 提供多种字体风格选择（至少 5 种）。
3. THE Tool SHALL 支持一键复制生成的 ASCII 艺术字。
4. THE Tool SHALL 实时预览效果。

---

### 需求 75：Markdown 编辑器

**用户故事：** 作为内容创作者，我希望能在线编辑和预览 Markdown 文档。

#### 验收标准

1. THE Tool SHALL 提供左右分栏的编辑器和预览区域。
2. THE Tool SHALL 实时渲染 Markdown 为 HTML 预览。
3. THE Tool SHALL 支持 GitHub Flavored Markdown（GFM）语法。
4. THE Tool SHALL 提供常用 Markdown 语法的工具栏按钮（标题、粗体、斜体、链接、图片、代码块、列表、表格）。
5. THE Tool SHALL 支持导出为 HTML。
6. THE Tool SHALL 支持一键复制渲染后的 HTML。

---

### 需求 76：数值列表求和

**用户故事：** 作为用户，我希望能快速对一列数字求和。

#### 验收标准

1. WHEN 用户输入多行数字（每行一个）时，THE Tool SHALL 计算总和、平均值、最大值、最小值。
2. THE Tool SHALL 自动忽略非数字行。
3. THE Tool SHALL 显示有效数字的个数。
4. THE Tool SHALL 支持小数和负数。

---

### 需求 77：文本随机打乱

**用户故事：** 作为用户，我希望能随机打乱文本行的顺序。

#### 验收标准

1. WHEN 用户输入多行文本并点击打乱按钮时，THE Tool SHALL 随机重排所有行的顺序。
2. THE Tool SHALL 每次点击产生不同的随机排列。
3. THE Tool SHALL 支持一键复制打乱后的结果。

---

### 需求 78：序列号生成器

**用户故事：** 作为用户，我希望能生成自定义格式的序列号。

#### 验收标准

1. THE Tool SHALL 支持配置序列号格式（前缀、后缀、位数、起始值、步长）。
2. THE Tool SHALL 支持批量生成指定数量的序列号。
3. THE Tool SHALL 支持数字序列和字母序列。
4. THE Tool SHALL 支持一键复制所有生成的序列号。

---

### 需求 79：文字竖排生成

**用户故事：** 作为用户，我希望能将横排文字转换为竖排显示。

#### 验收标准

1. WHEN 用户输入文本时，THE Tool SHALL 将其转换为竖排排列。
2. THE Tool SHALL 支持从右到左和从左到右两种竖排方向。
3. THE Tool SHALL 支持一键复制竖排结果。

---

### 需求 80：文字间隔生成

**用户故事：** 作为用户，我希望能在文字之间插入间隔字符。

#### 验收标准

1. WHEN 用户输入文本和间隔字符时，THE Tool SHALL 在每个字符之间插入指定的间隔字符。
2. THE Tool SHALL 支持自定义间隔字符（空格、点、星号等）。
3. THE Tool SHALL 实时预览效果。

---

## 第七部分：网络工具需求（需求 81-88）

### 需求 81：URL 地址解析

**用户故事：** 作为开发者，我希望能解析 URL 的各个组成部分。

#### 验收标准

1. WHEN 用户输入 URL 时，THE Tool SHALL 解析并展示：协议（protocol）、主机名（hostname）、端口（port）、路径（pathname）、查询参数（search）、哈希（hash）、用户名、密码。
2. THE Tool SHALL 以表格形式清晰展示各部分。
3. THE Tool SHALL 支持编辑各部分后重新组装 URL。
4. IF 输入的 URL 格式不合法，THEN THE Tool SHALL 展示错误提示。

---

### 需求 82：UserAgent 生成与分析

**用户故事：** 作为开发者，我希望能生成随机 UserAgent 字符串或分析已有的 UserAgent。

#### 验收标准

1. THE Tool SHALL 支持生成随机 UserAgent 字符串，可选择浏览器类型（Chrome、Firefox、Safari、Edge）和操作系统（Windows、macOS、Linux、Android、iOS）。
2. WHEN 用户输入 UserAgent 字符串时，THE Tool SHALL 解析并展示：浏览器名称和版本、操作系统名称和版本、设备类型（桌面/移动/平板）。
3. THE Tool SHALL 支持批量生成多个 UserAgent。
4. THE Tool SHALL 支持一键复制。

---

### 需求 83：IP 地址工具

**用户故事：** 作为网络工程师，我希望能进行 IP 地址相关的计算和转换。

#### 验收标准

1. THE Tool SHALL 支持 IPv4 地址与十进制数字之间的互相转换。
2. THE Tool SHALL 支持随机生成 IPv4 地址。
3. THE Tool SHALL 支持子网掩码计算（输入 IP 和 CIDR，输出网络地址、广播地址、可用主机范围、子网掩码）。
4. THE Tool SHALL 支持 IPv4 和 IPv6 格式的展示。

---

### 需求 84：MAC 地址生成器

**用户故事：** 作为网络工程师，我希望能生成随机 MAC 地址。

#### 验收标准

1. WHEN 用户点击生成按钮时，THE Tool SHALL 生成随机 MAC 地址。
2. THE Tool SHALL 支持多种格式：冒号分隔（AA:BB:CC:DD:EE:FF）、连字符分隔、无分隔。
3. THE Tool SHALL 支持批量生成。
4. THE Tool SHALL 支持大写和小写输出。

---

### 需求 85：robots.txt 生成器

**用户故事：** 作为网站管理员，我希望能快速生成 robots.txt 文件。

#### 验收标准

1. THE Tool SHALL 提供可视化界面配置 robots.txt 规则。
2. THE Tool SHALL 支持添加多个 User-agent 规则。
3. THE Tool SHALL 支持配置 Allow 和 Disallow 路径。
4. THE Tool SHALL 支持添加 Sitemap URL。
5. THE Tool SHALL 实时预览生成的 robots.txt 内容。
6. THE Tool SHALL 支持一键复制。

---

### 需求 86：浏览器信息检测

**用户故事：** 作为用户，我希望能查看当前浏览器的详细信息。

#### 验收标准

1. THE Tool SHALL 检测并展示：浏览器名称和版本、操作系统、屏幕分辨率、视口大小、设备像素比、语言设置、Cookie 状态、JavaScript 状态、WebGL 支持、触摸屏支持。
2. THE Tool SHALL 实时更新视口大小信息（当窗口调整时）。
3. THE Tool SHALL 以清晰的卡片式布局展示所有信息。

---

### 需求 87：curl 转代码

**用户故事：** 作为开发者，我希望能将 curl 命令转换为各编程语言的 HTTP 请求代码。

#### 验收标准

1. WHEN 用户输入 curl 命令时，THE Tool SHALL 将其转换为指定编程语言的 HTTP 请求代码。
2. THE Tool SHALL 支持以下目标语言：JavaScript（fetch）、Python（requests）、Go（net/http）、Java（HttpClient）、PHP（cURL）、Node.js（axios）。
3. THE Tool SHALL 正确解析 curl 的常用参数：-X（方法）、-H（Header）、-d（数据）、-u（认证）、--data-raw。
4. IF curl 命令格式不合法，THEN THE Tool SHALL 展示错误提示。
5. THE Tool SHALL 支持一键复制生成的代码。

---

### 需求 88：正则表达式代码生成

**用户故事：** 作为开发者，我希望能将正则表达式转换为各编程语言的代码片段。

#### 验收标准

1. WHEN 用户输入正则表达式时，THE Tool SHALL 生成各编程语言的正则使用代码。
2. THE Tool SHALL 支持以下语言：JavaScript、Python、Java、Go、PHP、Ruby、C#。
3. THE Tool SHALL 生成包含匹配、替换、提取等常用操作的代码示例。
4. THE Tool SHALL 支持一键复制生成的代码。

---

## 第八部分：前端/CSS 工具需求（需求 89-103）

### 需求 89：CSS 贝塞尔曲线编辑器

**用户故事：** 作为前端开发者，我希望能可视化编辑 CSS 贝塞尔曲线动画。

#### 验收标准

1. THE Tool SHALL 提供可视化的贝塞尔曲线编辑器，用户可拖拽控制点调整曲线。
2. THE Tool SHALL 实时预览动画效果。
3. THE Tool SHALL 提供常用预设曲线（ease、ease-in、ease-out、ease-in-out、linear）。
4. THE Tool SHALL 生成对应的 CSS cubic-bezier() 代码。
5. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 90：CSS 渐变生成器

**用户故事：** 作为前端开发者，我希望能可视化创建 CSS 渐变效果。

#### 验收标准

1. THE Tool SHALL 支持线性渐变（linear-gradient）和径向渐变（radial-gradient）。
2. THE Tool SHALL 提供可视化编辑器，支持添加/删除/拖拽颜色节点。
3. THE Tool SHALL 支持调整渐变角度/方向。
4. THE Tool SHALL 实时预览渐变效果。
5. THE Tool SHALL 生成对应的 CSS 代码（含浏览器前缀）。
6. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 91：渐变色集合

**用户故事：** 作为设计师，我希望能浏览和使用精选的渐变色方案。

#### 验收标准

1. THE Tool SHALL 展示至少 100 款精选渐变色方案。
2. THE Tool SHALL 以卡片网格形式展示每个渐变色的预览。
3. WHEN 用户点击渐变色卡片时，THE Tool SHALL 显示该渐变的 CSS 代码。
4. THE Tool SHALL 支持按颜色系（暖色、冷色、中性色）筛选。
5. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 92：配色工具

**用户故事：** 作为设计师，我希望能生成和谐的配色方案。

#### 验收标准

1. THE Tool SHALL 支持以下配色规则：互补色、类似色、三角色、分裂互补色、四角色。
2. WHEN 用户选择基础颜色时，THE Tool SHALL 根据选定规则自动生成配色方案。
3. THE Tool SHALL 以色块形式展示配色方案。
4. THE Tool SHALL 显示每个颜色的 HEX、RGB 值。
5. THE Tool SHALL 支持一键复制整个配色方案。

---

### 需求 93：中国传统色彩 / 日本传统色彩

**用户故事：** 作为设计师，我希望能浏览和使用中国/日本传统色彩。

#### 验收标准

1. THE Tool SHALL 展示中国传统色彩集合（至少 100 种），包含颜色名称、HEX 值、RGB 值。
2. THE Tool SHALL 展示日本传统色彩集合（至少 100 种），包含颜色名称、HEX 值、RGB 值。
3. THE Tool SHALL 以色卡形式展示，支持按色系分类浏览。
4. WHEN 用户点击色卡时，THE Tool SHALL 显示颜色详情并支持一键复制颜色值。
5. THE Tool SHALL 支持搜索颜色名称。

---

### 需求 94：CSS 圆角生成器

**用户故事：** 作为前端开发者，我希望能可视化编辑 CSS 圆角。

#### 验收标准

1. THE Tool SHALL 提供可视化编辑器，支持分别调整四个角的圆角值。
2. THE Tool SHALL 实时预览圆角效果。
3. THE Tool SHALL 支持联动模式（四角同步调整）和独立模式。
4. THE Tool SHALL 生成对应的 CSS border-radius 代码。
5. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 95：CSS Flex 布局可视化编辑器

**用户故事：** 作为前端开发者，我希望能可视化编辑 Flexbox 布局属性。

#### 验收标准

1. THE Tool SHALL 提供可视化的 Flex 容器编辑器，支持调整：flex-direction、justify-content、align-items、flex-wrap、gap。
2. THE Tool SHALL 支持添加/删除子元素，并调整子元素的 flex 属性（flex-grow、flex-shrink、flex-basis、order、align-self）。
3. THE Tool SHALL 实时预览布局效果。
4. THE Tool SHALL 生成对应的 CSS 代码。
5. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 96：毛玻璃效果 CSS 生成器

**用户故事：** 作为前端开发者，我希望能快速生成毛玻璃（Glassmorphism）效果的 CSS 代码。

#### 验收标准

1. THE Tool SHALL 提供可视化编辑器，支持调整：模糊度（blur）、透明度（opacity）、背景颜色、边框。
2. THE Tool SHALL 在示例背景图上实时预览毛玻璃效果。
3. THE Tool SHALL 生成对应的 CSS 代码（含 backdrop-filter）。
4. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 97：新拟态风格 CSS 生成器

**用户故事：** 作为前端开发者，我希望能快速生成新拟态（Neumorphism）风格的 CSS 代码。

#### 验收标准

1. THE Tool SHALL 提供可视化编辑器，支持调整：背景颜色、阴影距离、模糊度、阴影强度、形状（凸起/凹陷/平面）。
2. THE Tool SHALL 实时预览新拟态效果。
3. THE Tool SHALL 生成对应的 CSS 代码（含 box-shadow）。
4. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 98：SVG 压缩与编辑预览

**用户故事：** 作为前端开发者，我希望能压缩 SVG 代码并实时预览效果。

#### 验收标准

1. WHEN 用户输入 SVG 代码时，THE Tool SHALL 压缩 SVG（移除注释、多余空白、无用属性）。
2. THE Tool SHALL 显示压缩前后的文件大小对比和压缩率。
3. THE Tool SHALL 提供 SVG 代码编辑器和实时预览区域。
4. THE Tool SHALL 支持下载压缩后的 SVG 文件。
5. THE Tool SHALL 支持一键复制压缩后的 SVG 代码。

---

### 需求 99：CSS 动画效果生成器

**用户故事：** 作为前端开发者，我希望能快速生成常用的 CSS 动画效果代码。

#### 验收标准

1. THE Tool SHALL 提供常用 CSS 动画模板集合：淡入淡出、滑入滑出、弹跳、旋转、脉冲、摇晃等。
2. THE Tool SHALL 支持自定义动画参数：持续时间、延迟、迭代次数、方向。
3. THE Tool SHALL 实时预览动画效果。
4. THE Tool SHALL 生成对应的 CSS @keyframes 和 animation 代码。
5. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 100：霓虹灯/故障文字效果 CSS 生成器

**用户故事：** 作为前端开发者，我希望能生成霓虹灯和故障文字效果的 CSS 代码。

#### 验收标准

1. THE Tool SHALL 支持生成霓虹灯文字效果 CSS（基于 text-shadow）。
2. THE Tool SHALL 支持生成故障（Glitch）文字效果 CSS（基于 clip-path 和 animation）。
3. THE Tool SHALL 支持自定义文字内容、颜色、大小。
4. THE Tool SHALL 实时预览效果。
5. THE Tool SHALL 生成完整的 CSS 代码。
6. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 101：WEB 安全色

**用户故事：** 作为前端开发者，我希望能浏览和使用 Web 安全色。

#### 验收标准

1. THE Tool SHALL 展示完整的 216 种 Web 安全色。
2. THE Tool SHALL 以色块网格形式展示。
3. WHEN 用户点击色块时，THE Tool SHALL 显示该颜色的 HEX、RGB 值并支持一键复制。

---

### 需求 102：调色板

**用户故事：** 作为设计师，我希望能创建和管理自定义调色板。

#### 验收标准

1. THE Tool SHALL 提供颜色选择器，支持添加颜色到调色板。
2. THE Tool SHALL 支持从图片中提取主色调生成调色板。
3. THE Tool SHALL 支持拖拽排序调色板中的颜色。
4. THE Tool SHALL 支持导出调色板为 CSS 变量、SCSS 变量、JSON 格式。
5. THE Tool SHALL 支持一键复制整个调色板。

---

### 需求 103：图片取色器

**用户故事：** 作为设计师，我希望能从图片中精确取色。

#### 验收标准

1. WHEN 用户上传图片时，THE Tool SHALL 显示图片并支持鼠标悬停取色。
2. THE Tool SHALL 在鼠标位置显示放大镜和当前像素的颜色值。
3. THE Tool SHALL 显示取色结果的 HEX、RGB、HSL 值。
4. THE Tool SHALL 支持保存取色历史记录。
5. THE Tool SHALL 支持一键复制颜色值。

---

## 第九部分：图片处理工具需求（需求 104-115）

### 需求 104：图片裁剪

**用户故事：** 作为用户，我希望能在浏览器中裁剪图片。

#### 验收标准

1. WHEN 用户上传图片时，THE Tool SHALL 显示图片并提供可拖拽的裁剪框。
2. THE Tool SHALL 支持自由裁剪和固定比例裁剪（1:1、4:3、16:9、自定义比例）。
3. THE Tool SHALL 支持输入精确的裁剪尺寸（像素值）。
4. THE Tool SHALL 实时预览裁剪结果。
5. THE Tool SHALL 支持下载裁剪后的图片。
6. THE Tool SHALL 使用 Canvas API 在纯前端完成裁剪。

---

### 需求 105：九宫格切图

**用户故事：** 作为社交媒体用户，我希望能将图片切割为九宫格。

#### 验收标准

1. WHEN 用户上传图片时，THE Tool SHALL 将其切割为 3×3 的九宫格图片。
2. THE Tool SHALL 支持自定义网格数（2×2、3×3、4×4）。
3. THE Tool SHALL 预览切割效果并标注序号。
4. THE Tool SHALL 支持批量下载所有切割后的图片。

---

### 需求 106：图片缩放

**用户故事：** 作为用户，我希望能调整图片的尺寸。

#### 验收标准

1. WHEN 用户上传图片时，THE Tool SHALL 显示原始尺寸并支持输入目标尺寸。
2. THE Tool SHALL 支持按比例缩放（锁定宽高比）和自由缩放。
3. THE Tool SHALL 支持按百分比缩放。
4. THE Tool SHALL 预览缩放结果。
5. THE Tool SHALL 支持下载缩放后的图片。

---

### 需求 107：图片加水印

**用户故事：** 作为用户，我希望能为图片添加文字或图片水印。

#### 验收标准

1. THE Tool SHALL 支持添加文字水印，可自定义：文字内容、字体大小、颜色、透明度、位置、旋转角度。
2. THE Tool SHALL 支持平铺水印模式。
3. THE Tool SHALL 实时预览水印效果。
4. THE Tool SHALL 支持下载添加水印后的图片。
5. THE Tool SHALL 使用 Canvas API 在纯前端完成处理。

---

### 需求 108：图片旋转/翻转

**用户故事：** 作为用户，我希望能旋转或翻转图片。

#### 验收标准

1. THE Tool SHALL 支持顺时针/逆时针旋转 90°、180°、270° 和自定义角度。
2. THE Tool SHALL 支持水平翻转和垂直翻转。
3. THE Tool SHALL 实时预览旋转/翻转效果。
4. THE Tool SHALL 支持下载处理后的图片。

---

### 需求 109：GIF 转帧/帧提取

**用户故事：** 作为用户，我希望能将 GIF 动图拆分为单帧图片。

#### 验收标准

1. WHEN 用户上传 GIF 文件时，THE Tool SHALL 提取所有帧并以缩略图形式展示。
2. THE Tool SHALL 显示每帧的序号和延迟时间。
3. THE Tool SHALL 支持选择单帧或全部帧下载（PNG 格式）。
4. THE Tool SHALL 在纯前端完成 GIF 解析。

---

### 需求 110：占位图片生成

**用户故事：** 作为开发者，我希望能快速生成占位图片用于开发和设计。

#### 验收标准

1. THE Tool SHALL 支持自定义占位图片的宽度、高度、背景颜色、文字颜色、显示文字。
2. THE Tool SHALL 实时预览生成的占位图片。
3. THE Tool SHALL 支持下载占位图片（PNG/SVG 格式）。
4. THE Tool SHALL 生成可直接使用的 Data URI。

---

### 需求 111：图片压缩

**用户故事：** 作为用户，我希望能在浏览器中压缩图片以减小文件大小。

#### 验收标准

1. WHEN 用户上传图片时，THE Tool SHALL 在浏览器端压缩图片。
2. THE Tool SHALL 支持调整压缩质量（1-100）。
3. THE Tool SHALL 显示压缩前后的文件大小对比和压缩率。
4. THE Tool SHALL 支持批量压缩多张图片。
5. THE Tool SHALL 支持下载压缩后的图片。
6. THE Tool SHALL 使用 Canvas API 在纯前端完成压缩。

---

### 需求 112：ICO 图标生成

**用户故事：** 作为开发者，我希望能从图片生成 ICO 格式的网站图标。

#### 验收标准

1. WHEN 用户上传图片时，THE Tool SHALL 生成多种尺寸的 ICO 图标（16×16、32×32、48×48、64×64、128×128、256×256）。
2. THE Tool SHALL 支持选择需要包含的尺寸。
3. THE Tool SHALL 预览各尺寸的效果。
4. THE Tool SHALL 支持下载生成的 ICO 文件。

---

### 需求 113：照片 EXIF 信息查看

**用户故事：** 作为摄影爱好者，我希望能查看照片的 EXIF 元数据。

#### 验收标准

1. WHEN 用户上传照片时，THE Tool SHALL 解析并展示 EXIF 信息：相机型号、拍摄时间、光圈、快门速度、ISO、焦距、GPS 坐标等。
2. THE Tool SHALL 以表格形式清晰展示所有 EXIF 字段。
3. IF 照片不包含 EXIF 信息，THEN THE Tool SHALL 展示提示信息。
4. THE Tool SHALL 在纯前端完成 EXIF 解析，不上传照片到服务器。

---

### 需求 114：涂鸦绘画板

**用户故事：** 作为用户，我希望能在浏览器中进行简单的涂鸦绘画。

#### 验收标准

1. THE Tool SHALL 提供 Canvas 画布，支持自由绘画。
2. THE Tool SHALL 支持选择画笔颜色、粗细、类型（实线、虚线）。
3. THE Tool SHALL 支持橡皮擦功能。
4. THE Tool SHALL 支持撤销/重做操作。
5. THE Tool SHALL 支持清空画布。
6. THE Tool SHALL 支持下载绘画结果（PNG 格式）。

---

### 需求 115：灰度图/黑白图制作

**用户故事：** 作为用户，我希望能将彩色图片转换为灰度图或纯黑白图。

#### 验收标准

1. WHEN 用户上传彩色图片时，THE Tool SHALL 支持将其转换为灰度图。
2. THE Tool SHALL 支持将图片转换为纯黑白图（二值化），并支持调整阈值。
3. THE Tool SHALL 实时预览转换效果。
4. THE Tool SHALL 支持下载转换后的图片。
5. THE Tool SHALL 使用 Canvas API 在纯前端完成处理。

---

## 第十部分：数学工具需求（需求 116-123）

### 需求 116：随机数生成器

**用户故事：** 作为用户，我希望能生成指定范围内的随机数。

#### 验收标准

1. THE Tool SHALL 支持生成指定范围（最小值-最大值）内的随机整数。
2. THE Tool SHALL 支持生成随机浮点数，可指定小数位数。
3. THE Tool SHALL 支持批量生成多个随机数。
4. THE Tool SHALL 支持选择是否允许重复。
5. THE Tool SHALL 使用 crypto.getRandomValues() 确保随机性。

---

### 需求 117：进制运算器

**用户故事：** 作为开发者，我希望能在不同进制下进行算术运算。

#### 验收标准

1. THE Tool SHALL 支持二进制、八进制、十进制、十六进制的加减乘除运算。
2. WHEN 用户输入两个数字和运算符时，THE Tool SHALL 同时显示所有进制的运算结果。
3. THE Tool SHALL 支持位运算（AND、OR、XOR、NOT、左移、右移）。

---

### 需求 118：最大公约数/最小公倍数计算

**用户故事：** 作为用户，我希望能计算两个或多个数的最大公约数和最小公倍数。

#### 验收标准

1. WHEN 用户输入两个或多个正整数时，THE Tool SHALL 计算并显示最大公约数（GCD）和最小公倍数（LCM）。
2. THE Tool SHALL 显示计算过程（辗转相除法步骤）。
3. THE Tool SHALL 支持批量输入（逗号或空格分隔）。

---

### 需求 119：质数生成器

**用户故事：** 作为用户，我希望能生成指定范围内的质数。

#### 验收标准

1. WHEN 用户输入范围（起始值-结束值）时，THE Tool SHALL 生成该范围内的所有质数。
2. THE Tool SHALL 显示质数的个数。
3. THE Tool SHALL 支持判断单个数字是否为质数。
4. THE Tool SHALL 支持生成前 N 个质数。

---

### 需求 120：斐波那契数列生成

**用户故事：** 作为用户，我希望能生成斐波那契数列。

#### 验收标准

1. WHEN 用户输入数量 N 时，THE Tool SHALL 生成前 N 个斐波那契数。
2. THE Tool SHALL 支持大数计算（BigInt）。
3. THE Tool SHALL 支持判断某个数是否为斐波那契数。

---

### 需求 121：方差/标准差计算器

**用户故事：** 作为用户，我希望能计算一组数据的统计指标。

#### 验收标准

1. WHEN 用户输入一组数字时，THE Tool SHALL 计算并显示：平均值、中位数、众数、方差、标准差、极差。
2. THE Tool SHALL 支持多种输入方式：逗号分隔、空格分隔、每行一个。
3. THE Tool SHALL 显示计算公式和步骤。

---

### 需求 122：圆周率查询

**用户故事：** 作为用户，我希望能查询圆周率的指定位数。

#### 验收标准

1. THE Tool SHALL 支持显示圆周率的前 N 位小数（至少支持 10000 位）。
2. THE Tool SHALL 支持在圆周率中搜索指定数字序列。
3. THE Tool SHALL 支持一键复制指定位数的圆周率。

---

### 需求 123：最小二乘法回归计算器

**用户故事：** 作为数据分析师，我希望能对数据进行线性回归分析。

#### 验收标准

1. WHEN 用户输入一组 (x, y) 数据点时，THE Tool SHALL 计算最小二乘法线性回归方程 y = ax + b。
2. THE Tool SHALL 显示回归系数 a、b 和相关系数 R²。
3. THE Tool SHALL 以散点图形式可视化数据点和回归线。
4. THE Tool SHALL 支持多种输入方式：表格输入、CSV 粘贴。

---

## 第十一部分：其他实用工具需求（需求 124-137）

### 需求 124：正则表达式测试器

**用户故事：** 作为开发者，我希望能在线测试和调试正则表达式。

#### 验收标准

1. THE Tool SHALL 提供正则表达式输入框和测试文本输入框。
2. THE Tool SHALL 实时高亮显示所有匹配项。
3. THE Tool SHALL 显示每个匹配项的详细信息：匹配文本、起始位置、捕获组。
4. THE Tool SHALL 支持正则标志位选择：g（全局）、i（忽略大小写）、m（多行）、s（dotAll）。
5. THE Tool SHALL 提供常用正则表达式模板（邮箱、手机号、URL、IP 地址等）。
6. THE Tool SHALL 支持替换功能，显示替换后的结果。

---

### 需求 125：XPath 测试器

**用户故事：** 作为开发者，我希望能在线测试 XPath 表达式。

#### 验收标准

1. THE Tool SHALL 提供 XML 输入框和 XPath 表达式输入框。
2. WHEN 用户输入 XPath 表达式时，THE Tool SHALL 在 XML 中执行查询并高亮显示匹配的节点。
3. THE Tool SHALL 显示匹配结果的数量和内容。
4. IF XPath 表达式语法错误，THEN THE Tool SHALL 展示错误提示。

---

### 需求 126：条形码生成器

**用户故事：** 作为用户，我希望能生成各种格式的条形码。

#### 验收标准

1. THE Tool SHALL 支持以下条形码格式：Code 128、Code 39、EAN-13、EAN-8、UPC-A、ITF-14。
2. WHEN 用户输入数据并选择格式时，THE Tool SHALL 生成对应的条形码图片。
3. THE Tool SHALL 支持自定义条形码的宽度、高度、颜色。
4. THE Tool SHALL 支持下载条形码图片（PNG/SVG 格式）。

---

### 需求 127：Cron 表达式生成器与校验

**用户故事：** 作为运维人员，我希望能可视化生成和校验 Cron 表达式。

#### 验收标准

1. THE Tool SHALL 提供可视化界面，支持通过下拉菜单和复选框配置 Cron 表达式的各个字段（秒、分、时、日、月、周）。
2. THE Tool SHALL 实时生成对应的 Cron 表达式字符串。
3. WHEN 用户输入 Cron 表达式时，THE Tool SHALL 解析并显示人类可读的执行计划描述。
4. THE Tool SHALL 显示未来 N 次（默认 10 次）的执行时间。
5. IF Cron 表达式语法错误，THEN THE Tool SHALL 展示错误提示。

---

### 需求 128：代码对比/Diff 工具

**用户故事：** 作为开发者，我希望能对比两段代码或文本的差异。

#### 验收标准

1. THE Tool SHALL 提供左右两个输入区域，用户可分别输入两段文本。
2. THE Tool SHALL 以并排（side-by-side）和内联（inline）两种模式展示差异。
3. THE Tool SHALL 用颜色标注新增行（绿色）、删除行（红色）和修改行（黄色）。
4. THE Tool SHALL 显示差异统计（新增行数、删除行数、修改行数）。
5. THE Tool SHALL 支持忽略空白差异选项。

---

### 需求 129：在线秒表/计时器

**用户故事：** 作为用户，我希望能使用在线秒表和倒计时器。

#### 验收标准

1. THE Tool SHALL 提供秒表功能：开始、暂停、重置、记录分圈时间。
2. THE Tool SHALL 提供倒计时功能：用户可设置倒计时时长，到时发出提示音。
3. THE Tool SHALL 显示精确到毫秒的时间。
4. THE Tool SHALL 支持记录多个分圈时间并以列表展示。

---

### 需求 130：图表生成器

**用户故事：** 作为用户，我希望能快速生成各种统计图表。

#### 验收标准

1. THE Tool SHALL 支持以下图表类型：饼图、柱状图、折线图、散点图、雷达图。
2. THE Tool SHALL 提供数据输入表格，用户可输入标签和数值。
3. THE Tool SHALL 实时预览图表效果。
4. THE Tool SHALL 支持自定义图表颜色、标题、图例。
5. THE Tool SHALL 支持下载图表为 PNG/SVG 格式。

---

### 需求 131：CSV 转 HTML 表格

**用户故事：** 作为开发者，我希望能将 CSV 数据转换为 HTML 表格代码。

#### 验收标准

1. WHEN 用户输入 CSV 数据时，THE Tool SHALL 生成对应的 HTML 表格代码。
2. THE Tool SHALL 支持自定义分隔符。
3. THE Tool SHALL 支持选择是否将第一行作为表头（thead）。
4. THE Tool SHALL 实时预览渲染后的表格效果。
5. THE Tool SHALL 支持一键复制 HTML 代码。

---

### 需求 132：字符串拼接工具

**用户故事：** 作为开发者，我希望能将多行文本拼接为各编程语言的字符串代码。

#### 验收标准

1. WHEN 用户输入多行文本并选择目标语言时，THE Tool SHALL 生成该语言的字符串拼接代码。
2. THE Tool SHALL 支持以下语言：JavaScript、Python、Java、Go、PHP、C#、Ruby。
3. THE Tool SHALL 支持选择拼接方式：字符串连接、模板字符串、数组 join。
4. THE Tool SHALL 支持一键复制生成的代码。

---

### 需求 133：相反颜色取色器

**用户故事：** 作为设计师，我希望能快速获取某个颜色的互补色/相反色。

#### 验收标准

1. WHEN 用户输入颜色值（HEX/RGB）时，THE Tool SHALL 计算并显示其相反色（互补色）。
2. THE Tool SHALL 同时显示原色和相反色的预览色块。
3. THE Tool SHALL 显示相反色的 HEX、RGB、HSL 值。
4. THE Tool SHALL 支持一键复制相反色的颜色值。

---

### 需求 134：Lottie 动画预览

**用户故事：** 作为前端开发者，我希望能在线预览 Lottie 动画文件。

#### 验收标准

1. WHEN 用户上传或粘贴 Lottie JSON 文件时，THE Tool SHALL 渲染并播放动画。
2. THE Tool SHALL 支持播放控制：播放、暂停、停止、调整速度、逐帧查看。
3. THE Tool SHALL 显示动画信息：帧数、帧率、持续时间、尺寸。
4. THE Tool SHALL 支持调整动画背景颜色。

---

### 需求 135：FontAwesome 图标查询

**用户故事：** 作为前端开发者，我希望能搜索和浏览 FontAwesome 图标。

#### 验收标准

1. THE Tool SHALL 展示 FontAwesome Free 图标集合。
2. THE Tool SHALL 支持按名称搜索图标。
3. THE Tool SHALL 支持按分类筛选图标。
4. WHEN 用户点击图标时，THE Tool SHALL 显示图标名称、Unicode 编码、HTML 代码、CSS 类名。
5. THE Tool SHALL 支持一键复制图标的 HTML 代码或 CSS 类名。

---

### 需求 136：思维导图

**用户故事：** 作为用户，我希望能在线创建简单的思维导图。

#### 验收标准

1. THE Tool SHALL 提供可视化的思维导图编辑器。
2. THE Tool SHALL 支持添加/删除/编辑节点。
3. THE Tool SHALL 支持拖拽调整节点位置。
4. THE Tool SHALL 支持自定义节点颜色和样式。
5. THE Tool SHALL 支持导出为 PNG/SVG 图片。
6. THE Tool SHALL 支持导入/导出 JSON 格式的思维导图数据。

---

### 需求 137：文字生成图片

**用户故事：** 作为用户，我希望能将文字转换为图片。

#### 验收标准

1. THE Tool SHALL 支持输入文字并生成图片。
2. THE Tool SHALL 支持自定义：字体大小、字体颜色、背景颜色、内边距、文字对齐方式。
3. THE Tool SHALL 实时预览生成效果。
4. THE Tool SHALL 支持下载生成的图片（PNG 格式）。
5. THE Tool SHALL 使用 Canvas API 在纯前端完成生成。

---

## 第十二部分：实现优先级与分批计划

### 优先级说明

工具按实现难度、用户价值和 SEO 流量潜力分为四个批次：

### P0 批次（核心工具，立即实现）

高频使用、实现简单、SEO 流量大的基础工具：

| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 1 | JSON 格式化与校验 | json | 14（已实现） |
| 2 | 字符统计 | text | 66（已实现） |
| 3 | Base64 编码解码 | encoding | 26 |
| 4 | URL 编码解码 | encoding | 29 |
| 5 | Unix 时间戳转换 | converter | 51 |
| 6 | JSON 压缩与转义 | json | 16 |
| 7 | UUID/GUID 生成器 | encoding | 31 |
| 8 | 哈希计算器（MD5/SHA） | encoding | 27 |
| 9 | 颜色格式转换 | color | 55 |
| 10 | 进制转换 | converter | 52 |
| 11 | 大小写转换 | converter | 54 |
| 12 | 随机密码生成器 | encoding | 38 |
| 13 | JSON 排序 | json | 17 |
| 14 | 正则表达式测试器 | misc | 124 |
| 15 | 二维码生成与解码 | converter | 56 |

### P1 批次（高价值工具，第二阶段实现）

使用频率较高、实现中等难度的工具：

| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 16 | JSON 与其他格式互转 | json | 18 |
| 17 | JSON 转语言实体类 | json | 19 |
| 18 | JWT 解码器 | json | 22 |
| 19 | 变量命名转换 | formatter | 47 |
| 20 | 文本去重 | text | 68 |
| 21 | 文本排序 | text | 69 |
| 22 | 去除空行/空白处理 | text | 70 |
| 23 | JSON Schema 生成器 | json | 20 |
| 24 | 代码对比/Diff 工具 | misc | 128 |
| 25 | Markdown 编辑器 | text | 75 |
| 26 | JavaScript/HTML 格式化 | formatter | 43 |
| 27 | CSS 格式化与压缩 | formatter | 44 |
| 28 | SQL 格式化与压缩 | formatter | 45 |
| 29 | XML 格式化与压缩 | formatter | 46 |
| 30 | Unicode 与中文互转 | encoding | 30 |
| 31 | 对称加密解密 | encoding | 28 |
| 32 | Cron 表达式生成器 | misc | 127 |
| 33 | 单位换算器 | converter | 63 |
| 34 | 文件大小换算 | converter | 58 |
| 35 | 随机数生成器 | math | 116 |

### P2 批次（扩展工具，第三阶段实现）

特色工具和专业工具：

| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 36 | CSS 渐变生成器 | css | 90 |
| 37 | CSS 贝塞尔曲线编辑器 | css | 89 |
| 38 | CSS Flex 布局编辑器 | css | 95 |
| 39 | 毛玻璃效果生成器 | css | 96 |
| 40 | 新拟态风格生成器 | css | 97 |
| 41 | CSS 圆角生成器 | css | 94 |
| 42 | 渐变色集合 | css | 91 |
| 43 | 配色工具 | color | 92 |
| 44 | 中国/日本传统色彩 | color | 93 |
| 45 | 图片裁剪 | image | 104 |
| 46 | 图片压缩 | image | 111 |
| 47 | 图片格式转换 | image | 65 |
| 48 | 图片缩放 | image | 106 |
| 49 | 条形码生成器 | misc | 126 |
| 50 | 图表生成器 | misc | 130 |
| 51 | curl 转代码 | network | 87 |
| 52 | URL 地址解析 | network | 81 |
| 53 | 浏览器信息检测 | network | 86 |
| 54 | HTML 转 Markdown | converter | 59 |
| 55 | 汉字转拼音 | converter | 60 |
| 56 | 简繁体互转 | converter | 62 |
| 57 | 数字转中文 | converter | 57 |
| 58 | px/em/rem 互转 | css | 64 |
| 59 | 图片转 Base64 | encoding | 39 |
| 60 | CSV 转 JSON | json | 24 |

### P3 批次（长尾工具，第四阶段实现）

专业性较强或使用频率较低的工具：

| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 61 | JSON 树形查看器 | json | 15 |
| 62 | JSON 随机生成器 | json | 23 |
| 63 | JSON 清理工具 | json | 25 |
| 64 | JSON 与 GET 字符串互转 | json | 21 |
| 65 | Escape 编码解码 | encoding | 32 |
| 66 | Base32/Base58/Base62 | encoding | 33 |
| 67 | Bcrypt 密码生成验证 | encoding | 34 |
| 68 | 摩斯密码转换 | encoding | 35 |
| 69 | Gzip 压缩解压 | encoding | 36 |
| 70 | htpasswd 生成器 | encoding | 37 |
| 71 | 文件哈希计算器 | encoding | 40 |
| 72 | NATIVE/ASCII 互转 | encoding | 41 |
| 73 | RSA 密钥对生成 | encoding | 42 |
| 74 | Cookie 格式化 | formatter | 48 |
| 75 | HTTP Header 格式化 | formatter | 49 |
| 76 | URL 参数格式化 | formatter | 50 |
| 77 | 十六进制与文本互转 | converter | 53 |
| 78 | 全角半角互转 | converter | 61 |
| 79 | 文本逆序/翻转 | text | 67 |
| 80 | 文本查找替换 | text | 71 |
| 81 | 序号添加/移除 | text | 72 |
| 82 | 字符串出现次数统计 | text | 73 |
| 83 | ASCII 艺术字生成 | text | 74 |
| 84 | 数值列表求和 | text | 76 |
| 85 | 文本随机打乱 | text | 77 |
| 86 | 序列号生成器 | text | 78 |
| 87 | 文字竖排生成 | text | 79 |
| 88 | 文字间隔生成 | text | 80 |
| 89 | UserAgent 生成与分析 | network | 82 |
| 90 | IP 地址工具 | network | 83 |
| 91 | MAC 地址生成器 | network | 84 |
| 92 | robots.txt 生成器 | network | 85 |
| 93 | 正则表达式代码生成 | network | 88 |
| 94 | CSS 动画效果生成器 | css | 99 |
| 95 | 霓虹灯/故障文字效果 | css | 100 |
| 96 | WEB 安全色 | css | 101 |
| 97 | 调色板 | css | 102 |
| 98 | 图片取色器 | css | 103 |
| 99 | SVG 压缩与编辑预览 | css | 98 |
| 100 | 九宫格切图 | image | 105 |
| 101 | 图片加水印 | image | 107 |
| 102 | 图片旋转/翻转 | image | 108 |
| 103 | GIF 转帧 | image | 109 |
| 104 | 占位图片生成 | image | 110 |
| 105 | ICO 图标生成 | image | 112 |
| 106 | 照片 EXIF 信息查看 | image | 113 |
| 107 | 涂鸦绘画板 | image | 114 |
| 108 | 灰度图/黑白图制作 | image | 115 |
| 109 | 进制运算器 | math | 117 |
| 110 | 最大公约数/最小公倍数 | math | 118 |
| 111 | 质数生成器 | math | 119 |
| 112 | 斐波那契数列生成 | math | 120 |
| 113 | 方差/标准差计算器 | math | 121 |
| 114 | 圆周率查询 | math | 122 |
| 115 | 最小二乘法回归 | math | 123 |
| 116 | XPath 测试器 | misc | 125 |
| 117 | 在线秒表/计时器 | misc | 129 |
| 118 | CSV 转 HTML 表格 | misc | 131 |
| 119 | 字符串拼接工具 | misc | 132 |
| 120 | 相反颜色取色器 | misc | 133 |
| 121 | Lottie 动画预览 | misc | 134 |
| 122 | FontAwesome 图标查询 | misc | 135 |
| 123 | 思维导图 | misc | 136 |
| 124 | 文字生成图片 | misc | 137 |

---

## 第十二部分补充：遗漏工具需求（需求 140-161）

### 需求 140：任意文件转 Base64 / Base64 还原文件

**用户故事：** 作为开发者，我希望能将任意文件转换为 Base64 编码，或将 Base64 还原为文件下载。

#### 验收标准

1. WHEN 用户上传或拖拽任意文件时，THE Tool SHALL 将其转换为 Base64 编码字符串。
2. THE Tool SHALL 同时生成 Data URI（含 MIME 类型前缀）。
3. THE Tool SHALL 显示原始文件大小和 Base64 编码后的大小。
4. WHEN 用户输入 Base64 字符串并指定文件名时，THE Tool SHALL 将其还原为文件并提供下载。
5. THE Tool SHALL 支持一键复制 Base64 字符串。

---

### 需求 141：在线字体查看器

**用户故事：** 作为前端开发者，我希望能在线预览字体文件效果，以便选择合适的字体。

#### 验收标准

1. WHEN 用户上传字体文件（TTF、OTF、WOFF、WOFF2）时，THE Tool SHALL 渲染并展示字体效果。
2. THE Tool SHALL 支持自定义预览文字内容。
3. THE Tool SHALL 支持调整字体大小、颜色、行高。
4. THE Tool SHALL 展示字体的字符集信息和字形列表。
5. THE Tool SHALL 在纯前端完成字体解析和渲染。

---

### 需求 142：键盘按键值查询（KeyCode/ASCII）

**用户故事：** 作为开发者，我希望能快速查看键盘按键对应的 KeyCode 和 ASCII 码。

#### 验收标准

1. WHEN 用户按下键盘按键时，THE Tool SHALL 实时显示该按键的 key、keyCode、code、which 值。
2. THE Tool SHALL 以可视化键盘布局展示按键位置。
3. THE Tool SHALL 同时显示 ASCII 码对照表供查阅。
4. THE Tool SHALL 支持一键复制按键信息。

---

### 需求 143：3D 卡片翻转效果 CSS 生成器

**用户故事：** 作为前端开发者，我希望能快速生成 3D 卡片翻转效果的 CSS 代码。

#### 验收标准

1. THE Tool SHALL 提供可视化编辑器，支持调整：翻转方向（水平/垂直）、翻转速度、透视距离、正反面内容。
2. THE Tool SHALL 实时预览 3D 翻转效果。
3. THE Tool SHALL 生成完整的 HTML + CSS 代码。
4. THE Tool SHALL 支持一键复制代码。

---

### 需求 144：液态变形效果 CSS 生成器

**用户故事：** 作为前端开发者，我希望能生成液态变形（Liquid/Blob）效果的 CSS 代码。

#### 验收标准

1. THE Tool SHALL 提供可视化编辑器，支持调整：形状复杂度、动画速度、颜色、大小。
2. THE Tool SHALL 实时预览液态变形动画效果。
3. THE Tool SHALL 生成对应的 CSS 代码（含 @keyframes 和 border-radius 动画）。
4. THE Tool SHALL 支持一键复制 CSS 代码。

---

### 需求 145：CSS Sprites 精灵图生成器

**用户故事：** 作为前端开发者，我希望能将多张小图片合并为一张精灵图并生成对应的 CSS 代码。

#### 验收标准

1. WHEN 用户上传多张图片时，THE Tool SHALL 将其合并为一张精灵图。
2. THE Tool SHALL 自动生成每个图片对应的 CSS background-position 代码。
3. THE Tool SHALL 支持选择排列方式（水平、垂直、紧凑）。
4. THE Tool SHALL 支持自定义间距。
5. THE Tool SHALL 支持下载合并后的精灵图和 CSS 代码。

---

### 需求 146：Scrypt 密码生成与验证

**用户故事：** 作为开发者，我希望能生成 Scrypt 哈希密码并验证密码是否匹配。

#### 验收标准

1. WHEN 用户输入密码并配置参数（N、r、p）时，THE Tool SHALL 生成 Scrypt 哈希值。
2. WHEN 用户输入密码和 Scrypt 哈希值时，THE Tool SHALL 验证密码是否匹配。
3. THE Tool SHALL 在纯前端完成所有计算。

---

### 需求 147：JavaScript Eval 加密解密

**用户故事：** 作为开发者，我希望能对 JavaScript 代码进行 eval 加密和解密。

#### 验收标准

1. WHEN 用户输入 JavaScript 代码并点击加密按钮时，THE Tool SHALL 输出 eval 加密后的代码。
2. WHEN 用户输入 eval 加密的代码并点击解密按钮时，THE Tool SHALL 还原为原始代码。
3. THE Tool SHALL 支持一键复制结果。

---

### 需求 148：HTML 转义/反转义

**用户故事：** 作为开发者，我希望能对 HTML 特殊字符进行转义和反转义。

#### 验收标准

1. WHEN 用户输入包含 HTML 特殊字符（<、>、&、"、'）的文本时，THE Tool SHALL 将其转义为 HTML 实体。
2. WHEN 用户输入包含 HTML 实体的文本时，THE Tool SHALL 将其反转义为原始字符。
3. FOR ALL 合法文本，转义后再反转义 SHALL 产生与原始文本相同的结果（round-trip 属性）。
4. THE Tool SHALL 支持一键复制结果。

---

### 需求 149：Meta Tag 生成器

**用户故事：** 作为站长，我希望能快速生成网页的 Meta 标签代码。

#### 验收标准

1. THE Tool SHALL 提供表单界面，支持配置：title、description、keywords、author、viewport、robots、Open Graph 标签、Twitter Card 标签。
2. THE Tool SHALL 实时生成对应的 HTML meta 标签代码。
3. THE Tool SHALL 提供 SEO 建议（如 title 长度、description 长度）。
4. THE Tool SHALL 支持一键复制生成的代码。

---

### 需求 150：去除 HTML 格式

**用户故事：** 作为用户，我希望能从 HTML 内容中提取纯文本。

#### 验收标准

1. WHEN 用户输入 HTML 内容时，THE Tool SHALL 去除所有 HTML 标签并输出纯文本。
2. THE Tool SHALL 保持文本的段落结构（将 `<p>`、`<br>` 等转换为换行）。
3. THE Tool SHALL 支持选择是否保留链接文本。
4. THE Tool SHALL 支持一键复制结果。

---

### 需求 151：Properties 转 YAML

**用户故事：** 作为 Java 开发者，我希望能在 .properties 格式和 YAML 格式之间互相转换。

#### 验收标准

1. WHEN 用户输入 .properties 格式文本时，THE Tool SHALL 将其转换为 YAML 格式。
2. WHEN 用户输入 YAML 格式文本时，THE Tool SHALL 将其转换为 .properties 格式。
3. THE Tool SHALL 正确处理嵌套键（如 `a.b.c=value` 转为 YAML 嵌套结构）。
4. THE Tool SHALL 支持一键复制转换结果。

---

### 需求 152：JSON 转 SQL

**用户故事：** 作为后端开发者，我希望能从 JSON 数据生成 SQL INSERT 语句。

#### 验收标准

1. WHEN 用户输入 JSON 数组时，THE Tool SHALL 生成对应的 SQL INSERT 语句。
2. THE Tool SHALL 支持自定义表名。
3. THE Tool SHALL 正确处理字符串转义和 NULL 值。
4. THE Tool SHALL 支持选择 SQL 方言（MySQL、PostgreSQL、SQLite）。
5. THE Tool SHALL 支持一键复制生成的 SQL。

---

### 需求 153：随机汉字生成器

**用户故事：** 作为开发者，我希望能生成随机汉字字符串用于测试。

#### 验收标准

1. THE Tool SHALL 支持生成指定数量的随机汉字。
2. THE Tool SHALL 支持选择汉字范围：常用汉字（3500字）、通用汉字（7000字）、全部 CJK 汉字。
3. THE Tool SHALL 支持生成随机中文句子和段落。
4. THE Tool SHALL 支持一键复制生成的文本。

---

### 需求 154：文本按列截取

**用户故事：** 作为用户，我希望能按列位置截取多行文本的指定部分。

#### 验收标准

1. WHEN 用户输入多行文本并指定起始列和结束列时，THE Tool SHALL 截取每行对应列范围的内容。
2. THE Tool SHALL 支持按字符位置和按分隔符两种截取模式。
3. THE Tool SHALL 实时预览截取结果。
4. THE Tool SHALL 支持一键复制结果。

---

### 需求 155：文本长度过滤

**用户故事：** 作为用户，我希望能按行长度过滤文本行。

#### 验收标准

1. WHEN 用户输入多行文本并设置长度条件时，THE Tool SHALL 过滤出符合条件的行。
2. THE Tool SHALL 支持以下过滤条件：长度等于、大于、小于、范围内。
3. THE Tool SHALL 显示过滤前后的行数对比。
4. THE Tool SHALL 支持一键复制过滤结果。

---

### 需求 156：Shield Badge 生成器

**用户故事：** 作为开源项目维护者，我希望能快速生成 GitHub 风格的 Shield Badge。

#### 验收标准

1. THE Tool SHALL 支持自定义 Badge 的标签文字、消息文字、颜色、样式（flat、flat-square、for-the-badge、plastic）。
2. THE Tool SHALL 实时预览 Badge 效果。
3. THE Tool SHALL 生成 Badge 的 URL、Markdown 代码、HTML 代码。
4. THE Tool SHALL 支持一键复制各种格式的代码。

---

### 需求 157：证件照背景颜色修改

**用户故事：** 作为用户，我希望能在浏览器中修改证件照的背景颜色。

#### 验收标准

1. WHEN 用户上传证件照时，THE Tool SHALL 自动识别背景区域。
2. THE Tool SHALL 支持选择目标背景颜色（白色、蓝色、红色、自定义颜色）。
3. THE Tool SHALL 实时预览修改效果。
4. THE Tool SHALL 支持下载修改后的证件照。
5. THE Tool SHALL 使用 Canvas API 在纯前端完成处理。

---

### 需求 158：网页设计常用色彩搭配表

**用户故事：** 作为设计师，我希望能浏览网页设计中常用的色彩搭配方案。

#### 验收标准

1. THE Tool SHALL 展示至少 50 组精选的网页设计色彩搭配方案。
2. THE Tool SHALL 以色块组合形式展示每组配色。
3. WHEN 用户点击配色方案时，THE Tool SHALL 显示每个颜色的 HEX、RGB 值。
4. THE Tool SHALL 支持按风格分类（商务、科技、清新、暗色等）筛选。
5. THE Tool SHALL 支持一键复制整组配色的 CSS 变量代码。

---

### 需求 159：XML 随机生成器

**用户故事：** 作为开发者，我希望能快速生成随机 XML 测试数据。

#### 验收标准

1. THE Tool SHALL 支持配置生成的 XML 结构：元素数量、嵌套深度、属性数量。
2. WHEN 用户点击生成按钮时，THE Tool SHALL 输出符合配置的随机 XML 数据。
3. THE Tool SHALL 生成的 XML 数据始终为合法 XML。
4. THE Tool SHALL 支持一键复制生成的 XML。

---

### 需求 160：CSV/TSV/YAML 随机生成器

**用户故事：** 作为开发者，我希望能快速生成随机 CSV、TSV、YAML 测试数据。

#### 验收标准

1. THE Tool SHALL 支持生成随机 CSV、TSV、YAML 格式的测试数据。
2. THE Tool SHALL 支持配置列数、行数、数据类型（字符串、数字、日期、布尔值）。
3. THE Tool SHALL 支持自定义列名。
4. THE Tool SHALL 支持一键复制或下载生成的数据。

---

### 需求 161：在线自动排版工具

**用户故事：** 作为内容编辑，我希望能自动排版中文文本，修正常见的排版问题。

#### 验收标准

1. THE Tool SHALL 支持以下自动排版规则：中英文之间添加空格、中文与数字之间添加空格、全角标点修正、连续空格合并、段落首行缩进。
2. THE Tool SHALL 支持选择启用/禁用各项排版规则。
3. THE Tool SHALL 实时预览排版效果。
4. THE Tool SHALL 支持一键复制排版后的文本。

---

## 第十二部分补充：优先级更新

以下新增工具的优先级分配：

**P1 批次新增：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 125 | HTML 转义/反转义 | encoding | 148 |
| 126 | 任意文件转 Base64 | encoding | 140 |
| 127 | Properties 转 YAML | converter | 151 |
| 128 | JSON 转 SQL | json | 152 |

**P2 批次新增：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 129 | Meta Tag 生成器 | network | 149 |
| 130 | 去除 HTML 格式 | text | 150 |
| 131 | 键盘按键值查询 | misc | 142 |
| 132 | Shield Badge 生成器 | misc | 156 |
| 133 | 在线自动排版工具 | text | 161 |
| 134 | 网页设计色彩搭配表 | color | 158 |

**P3 批次新增：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 135 | 在线字体查看器 | css | 141 |
| 136 | 3D 卡片翻转效果 CSS | css | 143 |
| 137 | 液态变形效果 CSS | css | 144 |
| 138 | CSS Sprites 精灵图 | css | 145 |
| 139 | Scrypt 密码生成验证 | encoding | 146 |
| 140 | JS Eval 加密解密 | encoding | 147 |
| 141 | 随机汉字生成器 | text | 153 |
| 142 | 文本按列截取 | text | 154 |
| 143 | 文本长度过滤 | text | 155 |
| 144 | 证件照背景修改 | image | 157 |
| 145 | XML 随机生成器 | json | 159 |
| 146 | CSV/TSV/YAML 随机生成 | json | 160 |

---

## 第十三部分：SEO 与 GEO 策略需求

### 需求 138：多语言 SEO 策略

**用户故事：** 作为平台运营者，我希望每个工具页面在各语言搜索引擎中都能获得良好排名。

#### 验收标准

1. THE SEO_Manager SHALL 为每个工具页面在每种支持语言下生成独立的 URL（如 `/en/tools/json-formatter`、`/zh-cn/tools/json-formatter`）。
2. THE SEO_Manager SHALL 在每个页面的 `<head>` 中生成完整的 hreflang 标签集，标明所有语言版本的替代 URL。
3. THE SEO_Manager SHALL 为每个语言版本生成语言特定的 title 和 meta description，使用该语言的自然关键词。
4. THE SEO_Manager SHALL 生成多语言 sitemap.xml，为每个 URL 包含所有语言版本的 xhtml:link 标签。
5. THE Hub SHALL 确保每个语言版本的页面内容（工具名称、描述、使用说明、按钮文字）完全使用对应语言，不混用其他语言。

### 需求 139：结构化数据与社交分享

**用户故事：** 作为平台运营者，我希望工具页面在搜索结果和社交媒体中有丰富的展示效果。

#### 验收标准

1. THE SEO_Manager SHALL 为每个工具页面生成 JSON-LD 结构化数据，类型为 WebApplication，包含：name、description、url、applicationCategory、operatingSystem（"Any"）、offers（Free）。
2. THE SEO_Manager SHALL 为首页生成 WebSite 类型的结构化数据，包含 SearchAction。
3. THE SEO_Manager SHALL 为每个页面生成 Open Graph meta 标签：og:title、og:description、og:type、og:url、og:locale。
4. THE SEO_Manager SHALL 为每个页面生成 Twitter Card meta 标签：twitter:card、twitter:title、twitter:description。
5. THE SEO_Manager SHALL 为分类页面生成 BreadcrumbList 结构化数据。

## 第十二部分补充B：bejson.com 全量补充需求（需求 162-220）

以下为 bejson.com 上所有剩余的、可在纯前端实现的工具，按分类逐一补充。

### 编码/加密类补充

#### 需求 162：网址十六进制加密

**用户故事：** 作为开发者，我希望能将 URL 转换为十六进制编码格式。

##### 验收标准

1. WHEN 用户输入 URL 时，THE Tool SHALL 将其转换为十六进制编码格式。
2. WHEN 用户输入十六进制编码的 URL 时，THE Tool SHALL 将其还原为原始 URL。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 163：UTF-8 编码/解码

**用户故事：** 作为开发者，我希望能查看文本的 UTF-8 编码字节序列。

##### 验收标准

1. WHEN 用户输入文本时，THE Tool SHALL 显示其 UTF-8 编码的字节序列（十六进制格式）。
2. WHEN 用户输入 UTF-8 字节序列时，THE Tool SHALL 将其解码为文本。
3. FOR ALL 合法 UTF-8 文本，编码后再解码 SHALL 产生与原始文本相同的结果（round-trip 属性）。

---

#### 需求 164：Email 地址加密/编码

**用户故事：** 作为站长，我希望能将邮箱地址编码以防止爬虫抓取。

##### 验收标准

1. WHEN 用户输入邮箱地址时，THE Tool SHALL 将其转换为 HTML 实体编码、JavaScript 编码等防爬格式。
2. THE Tool SHALL 支持多种编码方式：HTML 实体、JavaScript document.write、CSS content。
3. THE Tool SHALL 支持一键复制编码后的代码。

---

#### 需求 165：自签名证书生成器

**用户故事：** 作为开发者，我希望能在浏览器中生成自签名 SSL 证书用于本地开发。

##### 验收标准

1. THE Tool SHALL 支持配置证书信息：Common Name、Organization、有效期、密钥长度。
2. THE Tool SHALL 使用 Web Crypto API 在纯前端生成 RSA 密钥对和自签名证书。
3. THE Tool SHALL 支持下载生成的证书（PEM 格式）和私钥。
4. THE Tool SHALL 显示证书的详细信息。

---

#### 需求 166：JavaScript 加密混淆

**用户故事：** 作为前端开发者，我希望能对 JavaScript 代码进行简单的混淆处理。

##### 验收标准

1. WHEN 用户输入 JavaScript 代码时，THE Tool SHALL 对变量名进行混淆、移除注释、压缩空白。
2. THE Tool SHALL 支持选择混淆级别（低/中/高）。
3. THE Tool SHALL 在纯前端完成混淆处理。
4. THE Tool SHALL 支持一键复制混淆后的代码。

---


### 转换类补充

#### 需求 167：在线地图经纬度定位换算

**用户故事：** 作为开发者，我希望能在不同坐标系之间转换经纬度。

##### 验收标准

1. THE Tool SHALL 支持 WGS-84、GCJ-02、BD-09 三种坐标系之间的互相转换。
2. WHEN 用户输入经纬度坐标时，THE Tool SHALL 实时显示所有坐标系的转换结果。
3. THE Tool SHALL 支持度分秒（DMS）和十进制度（DD）格式互转。
4. THE Tool SHALL 支持一键复制转换结果。

---

#### 需求 168：经纬度转度分秒

**用户故事：** 作为用户，我希望能在经纬度的十进制格式和度分秒格式之间互相转换。

##### 验收标准

1. WHEN 用户输入十进制经纬度时，THE Tool SHALL 将其转换为度°分′秒″格式。
2. WHEN 用户输入度分秒格式时，THE Tool SHALL 将其转换为十进制格式。
3. FOR ALL 合法经纬度，十进制 → 度分秒 → 十进制转换 SHALL 产生与原始值近似相同的结果。

---

#### 需求 169：在线短地址互转

**用户故事：** 作为用户，我希望能生成短链接格式的 URL。

##### 验收标准

1. THE Tool SHALL 支持将长 URL 编码为短格式（使用 Base62 等算法在前端模拟）。
2. THE Tool SHALL 支持将编码后的短格式还原为原始 URL。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 170：Html 与 UBB 代码互转

**用户故事：** 作为论坛用户，我希望能在 HTML 和 UBB/BBCode 之间互相转换。

##### 验收标准

1. WHEN 用户输入 HTML 代码时，THE Tool SHALL 将其转换为 UBB/BBCode 格式。
2. WHEN 用户输入 UBB/BBCode 时，THE Tool SHALL 将其转换为 HTML。
3. THE Tool SHALL 支持常见 BBCode 标签：[b]、[i]、[u]、[url]、[img]、[color]、[size]、[quote]、[code]。
4. THE Tool SHALL 支持一键复制转换结果。

---

#### 需求 171：在线文档转 PDF

**用户故事：** 作为用户，我希望能将 HTML 内容转换为 PDF 文件下载。

##### 验收标准

1. WHEN 用户输入 HTML 内容或 Markdown 内容时，THE Tool SHALL 在浏览器端将其转换为 PDF。
2. THE Tool SHALL 支持自定义页面大小（A4、Letter 等）和边距。
3. THE Tool SHALL 支持下载生成的 PDF 文件。
4. THE Tool SHALL 使用纯前端 PDF 生成库完成转换。

---

#### 需求 172：时间转换工具

**用户故事：** 作为用户，我希望能在不同时间格式和时区之间进行转换。

##### 验收标准

1. THE Tool SHALL 支持在以下格式之间互转：ISO 8601、RFC 2822、Unix 时间戳、相对时间（如"3天前"）。
2. THE Tool SHALL 支持时区转换，显示同一时刻在不同时区的时间。
3. THE Tool SHALL 支持计算两个日期之间的时间差。
4. THE Tool SHALL 显示当前时间的多种格式表示。

---

#### 需求 173：国际单位制转换

**用户故事：** 作为用户，我希望能在国际单位制（SI）和其他单位制之间进行转换。

##### 验收标准

1. THE Tool SHALL 支持以下类别：力、能量/功、电流、电压、电阻、频率、数据传输速率。
2. WHEN 用户输入数值和源单位时，THE Tool SHALL 实时显示目标单位的换算结果。
3. THE Tool SHALL 显示换算公式。

---

#### 需求 174：振动参数计算工具

**用户故事：** 作为工程师，我希望能计算振动速度、频率和位移之间的关系。

##### 验收标准

1. THE Tool SHALL 支持振动速度、振动频率、振动位移三者之间的互算。
2. WHEN 用户输入任意两个参数时，THE Tool SHALL 计算第三个参数。
3. THE Tool SHALL 显示计算公式。

---

#### 需求 175：IP 地址转 Int 数字

**用户故事：** 作为开发者，我希望能在 IPv4 地址和整数之间互相转换。

##### 验收标准

1. WHEN 用户输入 IPv4 地址时，THE Tool SHALL 将其转换为 32 位整数。
2. WHEN 用户输入整数时，THE Tool SHALL 将其转换为 IPv4 地址。
3. FOR ALL 合法 IPv4 地址，IP → Int → IP 转换 SHALL 产生与原始地址相同的结果（round-trip 属性）。

---

#### 需求 176：矩阵与 JSON 互转

**用户故事：** 作为数据分析师，我希望能在矩阵格式和 JSON 格式之间互相转换。

##### 验收标准

1. WHEN 用户输入矩阵数据（空格/逗号分隔的行列数据）时，THE Tool SHALL 将其转换为 JSON 二维数组。
2. WHEN 用户输入 JSON 二维数组时，THE Tool SHALL 将其转换为矩阵格式。
3. THE Tool SHALL 支持一键复制转换结果。

---

#### 需求 177：Cookie 字符串转 JavaScript 代码

**用户故事：** 作为开发者，我希望能将 Cookie 字符串转换为 JavaScript 设置 Cookie 的代码。

##### 验收标准

1. WHEN 用户输入 Cookie 字符串时，THE Tool SHALL 生成对应的 JavaScript document.cookie 设置代码。
2. THE Tool SHALL 正确解析每个 Cookie 的名称、值和属性。
3. THE Tool SHALL 支持一键复制生成的代码。

---


### 格式化类补充

#### 需求 178：Python 代码格式化

**用户故事：** 作为 Python 开发者，我希望能在线格式化 Python 代码。

##### 验收标准

1. WHEN 用户输入 Python 代码时，THE Tool SHALL 按 PEP 8 规范格式化代码。
2. THE Tool SHALL 支持自定义缩进（2空格/4空格/Tab）。
3. THE Tool SHALL 支持一键复制格式化后的代码。

---

#### 需求 179：Java 代码格式化

**用户故事：** 作为 Java 开发者，我希望能在线格式化 Java 代码。

##### 验收标准

1. WHEN 用户输入 Java 代码时，THE Tool SHALL 格式化缩进和代码风格。
2. THE Tool SHALL 支持自定义缩进和大括号风格。
3. THE Tool SHALL 支持一键复制格式化后的代码。

---

#### 需求 180：PHP 代码格式化

**用户故事：** 作为 PHP 开发者，我希望能在线格式化 PHP 代码。

##### 验收标准

1. WHEN 用户输入 PHP 代码时，THE Tool SHALL 格式化缩进和代码风格。
2. THE Tool SHALL 支持一键复制格式化后的代码。

---

#### 需求 181：C/C# 代码格式化

**用户故事：** 作为 C/C# 开发者，我希望能在线格式化代码。

##### 验收标准

1. THE Tool SHALL 支持 C 语言和 C# 代码的格式化。
2. THE Tool SHALL 支持自定义缩进风格。
3. THE Tool SHALL 支持一键复制格式化后的代码。

---

#### 需求 182：Ruby/Perl/VBScript 代码格式化

**用户故事：** 作为开发者，我希望能在线格式化 Ruby、Perl 或 VBScript 代码。

##### 验收标准

1. THE Tool SHALL 支持 Ruby、Perl、VBScript 代码的基本格式化（缩进对齐）。
2. THE Tool SHALL 支持一键复制格式化后的代码。

---

### 网络工具补充

#### 需求 183：在线 htaccess 转 nginx 配置

**用户故事：** 作为运维人员，我希望能将 Apache htaccess 规则转换为 Nginx 配置。

##### 验收标准

1. WHEN 用户输入 .htaccess 规则时，THE Tool SHALL 将其转换为等价的 Nginx 配置。
2. THE Tool SHALL 支持常见的重写规则、重定向规则转换。
3. IF 某些规则无法转换，THEN THE Tool SHALL 在输出中标注注释说明。
4. THE Tool SHALL 支持一键复制转换结果。

---

#### 需求 184：常用 UserAgent 列表

**用户故事：** 作为开发者，我希望能查阅常用浏览器和设备的 UserAgent 字符串。

##### 验收标准

1. THE Tool SHALL 展示常用浏览器（Chrome、Firefox、Safari、Edge）各版本的 UserAgent 字符串。
2. THE Tool SHALL 按浏览器类型和操作系统分类展示。
3. THE Tool SHALL 支持搜索和筛选。
4. THE Tool SHALL 支持一键复制 UserAgent 字符串。

---

#### 需求 185：子网掩码换算器

**用户故事：** 作为网络工程师，我希望能在 CIDR 表示法和子网掩码之间互相转换。

##### 验收标准

1. WHEN 用户输入 CIDR 前缀长度时，THE Tool SHALL 显示对应的子网掩码、通配符掩码、可用主机数。
2. WHEN 用户输入子网掩码时，THE Tool SHALL 显示对应的 CIDR 前缀长度。
3. THE Tool SHALL 以表格形式展示完整的 CIDR/子网掩码对照表。

---


### 转换类补充（续）

#### 需求 186：在线 PHP 序列化/反序列化

**用户故事：** 作为 PHP 开发者，我希望能在线查看和转换 PHP 序列化数据。

##### 验收标准

1. WHEN 用户输入 PHP 序列化字符串时，THE Tool SHALL 将其反序列化为可读的 JSON 格式。
2. WHEN 用户输入 JSON 数据时，THE Tool SHALL 将其转换为 PHP 序列化格式。
3. THE Tool SHALL 支持一键复制转换结果。

---

#### 需求 167b：PHPSESSION 数据转换

**用户故事：** 作为 PHP 开发者，我希望能解析和查看 PHP Session 数据。

##### 验收标准

1. WHEN 用户输入 PHP Session 序列化数据时，THE Tool SHALL 将其解析为可读的键值对格式。
2. THE Tool SHALL 支持将解析结果导出为 JSON。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 187：在线 UEditor 富文本转 Markdown

**用户故事：** 作为内容编辑，我希望能将富文本 HTML 内容转换为 Markdown 语法。

##### 验收标准

1. WHEN 用户输入富文本 HTML 内容时，THE Tool SHALL 将其转换为 Markdown 格式。
2. THE Tool SHALL 支持表格、图片、链接、列表等常见元素的转换。
3. THE Tool SHALL 支持一键复制转换结果。

---

#### 需求 188：JPG/PNG 图片转 SVG

**用户故事：** 作为设计师，我希望能将位图图片转换为 SVG 矢量格式。

##### 验收标准

1. WHEN 用户上传 JPG 或 PNG 图片时，THE Tool SHALL 使用图像追踪算法将其转换为 SVG。
2. THE Tool SHALL 支持调整追踪精度和颜色数量。
3. THE Tool SHALL 实时预览转换效果。
4. THE Tool SHALL 支持下载生成的 SVG 文件。
5. THE Tool SHALL 在纯前端完成转换。

---

#### 需求 189：视频转 MP3 音频

**用户故事：** 作为用户，我希望能从视频文件中提取音频。

##### 验收标准

1. WHEN 用户上传视频文件时，THE Tool SHALL 提取音频轨道并转换为 MP3 格式。
2. THE Tool SHALL 显示视频信息（时长、格式）。
3. THE Tool SHALL 支持下载提取的音频文件。
4. THE Tool SHALL 使用 WebAssembly（如 FFmpeg.wasm）在纯前端完成处理。

---

#### 需求 190：视频切片工具

**用户故事：** 作为用户，我希望能在浏览器中裁剪视频片段。

##### 验收标准

1. WHEN 用户上传视频文件时，THE Tool SHALL 显示视频预览和时间轴。
2. THE Tool SHALL 支持设置起始时间和结束时间来裁剪视频片段。
3. THE Tool SHALL 支持下载裁剪后的视频。
4. THE Tool SHALL 使用 WebAssembly 在纯前端完成处理。

---

#### 需求 191：视频画面裁剪工具

**用户故事：** 作为用户，我希望能裁剪视频的画面区域。

##### 验收标准

1. WHEN 用户上传视频文件时，THE Tool SHALL 显示视频帧并提供可拖拽的裁剪框。
2. THE Tool SHALL 支持自定义裁剪区域和输出分辨率。
3. THE Tool SHALL 支持下载裁剪后的视频。
4. THE Tool SHALL 使用 WebAssembly 在纯前端完成处理。

---

#### 需求 192：在线 PDF 压缩

**用户故事：** 作为用户，我希望能在浏览器中压缩 PDF 文件大小。

##### 验收标准

1. WHEN 用户上传 PDF 文件时，THE Tool SHALL 在浏览器端压缩 PDF。
2. THE Tool SHALL 显示压缩前后的文件大小对比。
3. THE Tool SHALL 支持下载压缩后的 PDF。
4. THE Tool SHALL 在纯前端完成处理。

---

#### 需求 193：在线 PDF 编辑器

**用户故事：** 作为用户，我希望能在浏览器中对 PDF 进行简单编辑。

##### 验收标准

1. WHEN 用户上传 PDF 文件时，THE Tool SHALL 渲染 PDF 页面。
2. THE Tool SHALL 支持在 PDF 上添加文字注释。
3. THE Tool SHALL 支持在 PDF 上添加图片。
4. THE Tool SHALL 支持下载编辑后的 PDF。

---

#### 需求 194：在线图片转 PDF

**用户故事：** 作为用户，我希望能将多张图片合并为一个 PDF 文件。

##### 验收标准

1. WHEN 用户上传多张图片时，THE Tool SHALL 将其合并为一个 PDF 文件。
2. THE Tool SHALL 支持拖拽排序图片顺序。
3. THE Tool SHALL 支持选择页面大小和方向。
4. THE Tool SHALL 支持下载生成的 PDF。

---

#### 需求 195：在线 PDF 转图片

**用户故事：** 作为用户，我希望能将 PDF 的每一页转换为图片。

##### 验收标准

1. WHEN 用户上传 PDF 文件时，THE Tool SHALL 将每一页渲染为图片。
2. THE Tool SHALL 支持选择输出格式（PNG/JPG）和分辨率。
3. THE Tool SHALL 支持批量下载所有页面的图片。

---


### 图片处理补充

#### 需求 196：在线 GIF 生成器

**用户故事：** 作为用户，我希望能从多张图片生成 GIF 动图。

##### 验收标准

1. WHEN 用户上传多张图片时，THE Tool SHALL 将其合成为 GIF 动图。
2. THE Tool SHALL 支持调整帧间隔时间和循环次数。
3. THE Tool SHALL 支持拖拽排序帧顺序。
4. THE Tool SHALL 实时预览 GIF 效果。
5. THE Tool SHALL 支持下载生成的 GIF。

---

#### 需求 197：图片切圆角

**用户故事：** 作为用户，我希望能为图片添加圆角效果。

##### 验收标准

1. WHEN 用户上传图片时，THE Tool SHALL 支持为图片添加圆角。
2. THE Tool SHALL 支持自定义圆角半径和各角独立设置。
3. THE Tool SHALL 实时预览圆角效果。
4. THE Tool SHALL 支持下载处理后的图片（PNG 格式，保留透明背景）。

---

#### 需求 198：手写签名提取工具

**用户故事：** 作为用户，我希望能从图片中提取手写签名并去除背景。

##### 验收标准

1. WHEN 用户上传包含手写签名的图片时，THE Tool SHALL 自动识别签名区域并去除背景。
2. THE Tool SHALL 支持调整提取阈值。
3. THE Tool SHALL 支持下载提取的签名图片（PNG 格式，透明背景）。
4. THE Tool SHALL 使用 Canvas API 在纯前端完成处理。

---

#### 需求 199：在线 TIFF 图片分割

**用户故事：** 作为用户，我希望能将多页 TIFF 文件分割为单页图片。

##### 验收标准

1. WHEN 用户上传多页 TIFF 文件时，THE Tool SHALL 将其分割为单页图片。
2. THE Tool SHALL 支持选择输出格式（PNG/JPG）。
3. THE Tool SHALL 支持批量下载所有分割后的图片。

---

#### 需求 200：三维数据可视化工具

**用户故事：** 作为数据分析师，我希望能在浏览器中创建三维数据可视化图表。

##### 验收标准

1. THE Tool SHALL 支持输入三维数据点（x, y, z）。
2. THE Tool SHALL 使用 WebGL/Three.js 渲染三维散点图、曲面图。
3. THE Tool SHALL 支持鼠标拖拽旋转和缩放视角。
4. THE Tool SHALL 支持下载渲染结果为图片。

---

### 文字处理补充

#### 需求 201：在线汉字书写/笔画工具

**用户故事：** 作为用户，我希望能查看汉字的笔画顺序和书写方式。

##### 验收标准

1. WHEN 用户输入汉字时，THE Tool SHALL 展示该汉字的笔画顺序动画。
2. THE Tool SHALL 显示笔画数和笔画名称。
3. THE Tool SHALL 支持逐笔播放和自动播放。

---

#### 需求 202：在线汉字笔画统计

**用户故事：** 作为用户，我希望能统计一段文本中每个汉字的笔画数。

##### 验收标准

1. WHEN 用户输入中文文本时，THE Tool SHALL 统计每个汉字的笔画数。
2. THE Tool SHALL 显示总笔画数、平均笔画数、最多/最少笔画的汉字。
3. THE Tool SHALL 以表格形式展示每个汉字及其笔画数。

---

#### 需求 203：在线文本中英文数字清除工具

**用户故事：** 作为用户，我希望能从文本中选择性地清除中文、英文或数字。

##### 验收标准

1. THE Tool SHALL 支持以下清除选项：仅保留中文、仅保留英文、仅保留数字、清除中文、清除英文、清除数字、清除标点符号。
2. THE Tool SHALL 支持多个选项组合使用。
3. THE Tool SHALL 实时预览清除结果。
4. THE Tool SHALL 支持一键复制结果。

---

#### 需求 204：在线彩色文字特效生成器

**用户故事：** 作为用户，我希望能生成彩色渐变文字效果。

##### 验收标准

1. WHEN 用户输入文字时，THE Tool SHALL 为每个字符应用不同颜色，形成彩虹/渐变效果。
2. THE Tool SHALL 支持自定义起始颜色和结束颜色。
3. THE Tool SHALL 生成对应的 HTML 代码。
4. THE Tool SHALL 支持一键复制 HTML 代码。

---


### 其他/站长工具补充

#### 需求 205：在线数据库设计工具

**用户故事：** 作为开发者，我希望能在线设计数据库 ER 图。

##### 验收标准

1. THE Tool SHALL 提供可视化的数据库表设计界面。
2. THE Tool SHALL 支持添加表、字段、主键、外键、索引。
3. THE Tool SHALL 支持拖拽调整表的位置和关系连线。
4. THE Tool SHALL 支持导出为 SQL DDL 语句和 JSON 格式。
5. THE Tool SHALL 支持导出 ER 图为 PNG/SVG。

---

#### 需求 206：在线网络拓扑图制作

**用户故事：** 作为网络工程师，我希望能在线绘制网络拓扑图。

##### 验收标准

1. THE Tool SHALL 提供常用网络设备图标（路由器、交换机、服务器、防火墙、PC 等）。
2. THE Tool SHALL 支持拖拽放置设备和绘制连接线。
3. THE Tool SHALL 支持为设备和连接添加标签。
4. THE Tool SHALL 支持导出为 PNG/SVG 图片。

---

#### 需求 207：格子纸/方格纸制作工具

**用户故事：** 作为用户，我希望能生成自定义的格子纸/方格纸用于打印。

##### 验收标准

1. THE Tool SHALL 支持生成方格纸、横线纸、点阵纸、等距纸。
2. THE Tool SHALL 支持自定义格子大小、线条颜色、线条粗细、页面大小。
3. THE Tool SHALL 实时预览效果。
4. THE Tool SHALL 支持下载为 PDF 或 PNG 格式。

---

#### 需求 208：在线迷宫生成器

**用户故事：** 作为用户，我希望能生成随机迷宫图片。

##### 验收标准

1. THE Tool SHALL 支持生成指定大小（行×列）的随机迷宫。
2. THE Tool SHALL 支持多种迷宫算法（递归回溯、Prim、Kruskal）。
3. THE Tool SHALL 实时预览迷宫效果。
4. THE Tool SHALL 支持显示/隐藏解题路径。
5. THE Tool SHALL 支持下载迷宫图片（PNG/SVG）。

---

#### 需求 209：会议发言倒计时器

**用户故事：** 作为会议主持人，我希望能使用全屏倒计时器控制发言时间。

##### 验收标准

1. THE Tool SHALL 支持设置倒计时时长。
2. THE Tool SHALL 支持全屏显示模式，大字体显示剩余时间。
3. THE Tool SHALL 在时间到达时发出提示音和视觉提示（颜色变化）。
4. THE Tool SHALL 支持暂停和重置。

---

#### 需求 210：随机点名工具

**用户故事：** 作为教师，我希望能使用随机点名工具进行课堂互动。

##### 验收标准

1. THE Tool SHALL 支持输入名单（每行一个名字）。
2. WHEN 用户点击开始按钮时，THE Tool SHALL 以动画效果随机滚动名字并最终停在一个名字上。
3. THE Tool SHALL 支持设置已点名的人不再重复。
4. THE Tool SHALL 支持全屏显示模式。

---

#### 需求 211：在线反应速度测试

**用户故事：** 作为用户，我希望能测试自己的反应速度。

##### 验收标准

1. THE Tool SHALL 在随机时间后显示视觉信号（颜色变化）。
2. WHEN 用户看到信号后点击时，THE Tool SHALL 记录并显示反应时间（毫秒）。
3. THE Tool SHALL 支持多次测试并显示平均反应时间。
4. THE Tool SHALL 显示反应速度等级评价。

---

#### 需求 212：色盲色弱测试

**用户故事：** 作为用户，我希望能进行简单的色盲色弱自测。

##### 验收标准

1. THE Tool SHALL 展示标准的石原氏色盲检测图（Ishihara 测试图）。
2. THE Tool SHALL 支持用户选择看到的数字/图案。
3. THE Tool SHALL 根据用户的回答给出初步的色觉评估结果。
4. THE Tool SHALL 声明此工具仅供参考，不能替代专业医学诊断。

---

#### 需求 213：文件格式在线识别

**用户故事：** 作为用户，我希望能通过文件头（Magic Bytes）识别文件的真实格式。

##### 验收标准

1. WHEN 用户上传文件时，THE Tool SHALL 读取文件头字节并识别文件的真实格式。
2. THE Tool SHALL 显示文件的 Magic Bytes（十六进制）、MIME 类型、文件扩展名。
3. THE Tool SHALL 在纯前端完成识别，不上传文件到服务器。

---

#### 需求 214：数字转多国货币大写

**用户故事：** 作为财务人员，我希望能将数字转换为多种货币的大写格式。

##### 验收标准

1. THE Tool SHALL 支持以下货币大写转换：人民币（壹贰叁）、美元、欧元、日元、英镑、韩元、卢布。
2. WHEN 用户输入数字并选择货币类型时，THE Tool SHALL 输出对应的大写金额。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 215：带宽计算器

**用户故事：** 作为运维人员，我希望能计算带宽、数据量和传输时间之间的关系。

##### 验收标准

1. THE Tool SHALL 支持输入任意两个参数（带宽、数据量、传输时间），自动计算第三个。
2. THE Tool SHALL 支持多种单位（bps、Kbps、Mbps、Gbps、B、KB、MB、GB）。
3. THE Tool SHALL 显示计算公式。

---

#### 需求 216：屏幕 PPI 计算器

**用户故事：** 作为设计师，我希望能计算屏幕的 PPI（每英寸像素数）。

##### 验收标准

1. WHEN 用户输入屏幕分辨率（宽×高像素）和屏幕尺寸（英寸）时，THE Tool SHALL 计算 PPI。
2. THE Tool SHALL 显示计算公式和结果。
3. THE Tool SHALL 提供常见设备的 PPI 参考值。

---

#### 需求 217：iPhone/iPad/Android UI 尺寸规范

**用户故事：** 作为移动端设计师，我希望能查阅各种移动设备的 UI 尺寸规范。

##### 验收标准

1. THE Tool SHALL 展示 iPhone、iPad、Android 主流设备的屏幕尺寸、分辨率、PPI、安全区域等信息。
2. THE Tool SHALL 以表格形式清晰展示。
3. THE Tool SHALL 支持按设备类型筛选。
4. THE Tool SHALL 支持搜索设备名称。

---

#### 需求 218：SQL 追加或去除双引号

**用户故事：** 作为数据库开发者，我希望能快速为 SQL 语句中的标识符添加或去除双引号。

##### 验收标准

1. WHEN 用户输入 SQL 语句时，THE Tool SHALL 为所有标识符添加双引号。
2. THE Tool SHALL 支持去除 SQL 中所有双引号的反向操作。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 219：在线根据首字母排序

**用户故事：** 作为用户，我希望能按中文拼音首字母对文本行进行排序。

##### 验收标准

1. WHEN 用户输入多行中文文本时，THE Tool SHALL 按拼音首字母对行进行排序。
2. THE Tool SHALL 支持升序和降序。
3. THE Tool SHALL 支持按首字母分组显示。
4. THE Tool SHALL 支持一键复制排序结果。

---

#### 需求 220：在线解压缩获取文件列表

**用户故事：** 作为用户，我希望能在浏览器中查看压缩文件的内容列表。

##### 验收标准

1. WHEN 用户上传 ZIP 文件时，THE Tool SHALL 在浏览器端解析并展示文件列表。
2. THE Tool SHALL 显示每个文件的名称、大小、修改时间。
3. THE Tool SHALL 支持预览文本文件的内容。
4. THE Tool SHALL 在纯前端完成解析，不上传文件到服务器。

---


### 数学工具补充

#### 需求 221：蒙特卡罗方法估算圆周率

**用户故事：** 作为用户，我希望能通过蒙特卡罗模拟可视化地估算圆周率。

##### 验收标准

1. THE Tool SHALL 以动画形式展示随机点落在圆内/圆外的过程。
2. THE Tool SHALL 实时显示当前估算的圆周率值和已投点数。
3. THE Tool SHALL 支持调整模拟速度和总点数。
4. THE Tool SHALL 显示估算值与真实值的误差。

---

#### 需求 222：自然常数 e 生成器

**用户故事：** 作为用户，我希望能查看自然常数 e 的指定位数。

##### 验收标准

1. THE Tool SHALL 支持显示自然常数 e 的前 N 位小数（至少支持 10000 位）。
2. THE Tool SHALL 支持在 e 的小数中搜索指定数字序列。
3. THE Tool SHALL 支持一键复制指定位数的 e。

---

### 颜色工具补充

#### 需求 223：48 色蜡笔/彩铅色彩

**用户故事：** 作为设计师或教育工作者，我希望能浏览标准蜡笔和彩铅的颜色集合。

##### 验收标准

1. THE Tool SHALL 展示 48 色标准蜡笔颜色集合，包含颜色名称和 HEX 值。
2. THE Tool SHALL 以色块形式展示。
3. WHEN 用户点击色块时，THE Tool SHALL 显示颜色详情并支持一键复制颜色值。

---

#### 需求 224：UI 颜色渐变 CSS 工具

**用户故事：** 作为前端开发者，我希望能快速生成两个颜色之间的渐变过渡色。

##### 验收标准

1. WHEN 用户选择起始颜色和结束颜色时，THE Tool SHALL 生成指定数量的中间过渡色。
2. THE Tool SHALL 以色块条形式展示渐变过渡效果。
3. THE Tool SHALL 显示每个过渡色的 HEX 值。
4. THE Tool SHALL 生成对应的 CSS 渐变代码。
5. THE Tool SHALL 支持一键复制。

---

### 前端工具补充

#### 需求 225：IOS/Android Logo 在线生成器

**用户故事：** 作为移动端开发者，我希望能从一张图片生成各种尺寸的 App 图标。

##### 验收标准

1. WHEN 用户上传一张图片时，THE Tool SHALL 自动生成 iOS 和 Android 所需的所有尺寸图标。
2. THE Tool SHALL 展示 iOS 图标尺寸列表（20pt、29pt、40pt、60pt、76pt、83.5pt 等各倍率）。
3. THE Tool SHALL 展示 Android 图标尺寸列表（mdpi、hdpi、xhdpi、xxhdpi、xxxhdpi）。
4. THE Tool SHALL 支持批量下载所有尺寸的图标。

---

#### 需求 226：弹出窗口生成器

**用户故事：** 作为前端开发者，我希望能快速生成 JavaScript 弹出窗口代码。

##### 验收标准

1. THE Tool SHALL 支持配置弹出窗口参数：URL、宽度、高度、位置、是否显示工具栏/地址栏/状态栏。
2. THE Tool SHALL 实时生成对应的 JavaScript window.open() 代码。
3. THE Tool SHALL 支持预览弹出窗口效果。
4. THE Tool SHALL 支持一键复制代码。

---

#### 需求 227：HTML5 兼容性测试

**用户故事：** 作为前端开发者，我希望能检测当前浏览器对 HTML5 特性的支持情况。

##### 验收标准

1. THE Tool SHALL 检测并展示当前浏览器对以下 HTML5 特性的支持情况：Canvas、WebGL、Web Workers、WebSocket、LocalStorage、SessionStorage、Geolocation、File API、Drag and Drop、SVG、Audio/Video 等。
2. THE Tool SHALL 以绿色/红色标识支持/不支持。
3. THE Tool SHALL 显示总体兼容性评分。

---

#### 需求 228：证件照尺寸标准

**用户故事：** 作为用户，我希望能查阅各种证件照的标准尺寸。

##### 验收标准

1. THE Tool SHALL 展示常见证件照尺寸标准：一寸、二寸、小一寸、小二寸、护照、签证、身份证等。
2. THE Tool SHALL 显示每种尺寸的像素值（不同 DPI 下）、毫米值、英寸值。
3. THE Tool SHALL 以表格形式清晰展示。

---

#### 需求 229：CRX 下载地址解析

**用户故事：** 作为开发者，我希望能从 Chrome 扩展 ID 生成 CRX 下载地址。

##### 验收标准

1. WHEN 用户输入 Chrome 扩展 ID 或 Chrome Web Store URL 时，THE Tool SHALL 生成 CRX 文件的直接下载地址。
2. THE Tool SHALL 支持一键复制下载地址。

---

## 第十二部分补充C：全量优先级汇总

### 完整优先级分配表

**P1 批次新增（第二阶段）：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 125 | HTML 转义/反转义 | encoding | 148 |
| 126 | 任意文件转 Base64 | encoding | 140 |
| 127 | Properties 转 YAML | converter | 151 |
| 128 | JSON 转 SQL | json | 152 |
| 129 | PHP 序列化/反序列化 | converter | 186 |

**P2 批次新增（第三阶段）：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 130 | Meta Tag 生成器 | network | 149 |
| 131 | 去除 HTML 格式 | text | 150 |
| 132 | 键盘按键值查询 | misc | 142 |
| 133 | Shield Badge 生成器 | misc | 156 |
| 134 | 在线自动排版工具 | text | 161 |
| 135 | 网页设计色彩搭配表 | color | 158 |
| 136 | Python 代码格式化 | formatter | 178 |
| 137 | Java 代码格式化 | formatter | 179 |
| 138 | PHP 代码格式化 | formatter | 180 |
| 139 | htaccess 转 nginx | network | 183 |
| 140 | 子网掩码换算器 | network | 185 |
| 141 | 时间转换工具 | converter | 172 |
| 142 | 文本中英文数字清除 | text | 203 |
| 143 | 图片转 PDF | converter | 194 |
| 144 | PDF 转图片 | converter | 195 |
| 145 | GIF 生成器 | image | 196 |
| 146 | JPG/PNG 转 SVG | converter | 188 |

**P3 批次新增（第四阶段）：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 147 | 在线字体查看器 | css | 141 |
| 148 | 3D 卡片翻转效果 CSS | css | 143 |
| 149 | 液态变形效果 CSS | css | 144 |
| 150 | CSS Sprites 精灵图 | css | 145 |
| 151 | Scrypt 密码生成验证 | encoding | 146 |
| 152 | JS Eval 加密解密 | encoding | 147 |
| 153 | 随机汉字生成器 | text | 153 |
| 154 | 文本按列截取 | text | 154 |
| 155 | 文本长度过滤 | text | 155 |
| 156 | 证件照背景修改 | image | 157 |
| 157 | XML 随机生成器 | json | 159 |
| 158 | CSV/TSV/YAML 随机生成 | json | 160 |
| 159 | 网址十六进制加密 | encoding | 162 |
| 160 | UTF-8 编码/解码 | encoding | 163 |
| 161 | Email 地址加密 | encoding | 164 |
| 162 | 自签名证书生成 | encoding | 165 |
| 163 | JS 加密混淆 | encoding | 166 |
| 164 | 地图经纬度换算 | converter | 167 |
| 165 | 经纬度转度分秒 | converter | 168 |
| 166 | 短地址互转 | converter | 169 |
| 167 | HTML/UBB 互转 | converter | 170 |
| 168 | 文档转 PDF | converter | 171 |
| 169 | 国际单位制转换 | converter | 173 |
| 170 | 振动参数计算 | math | 174 |
| 171 | IP 地址转 Int | converter | 175 |
| 172 | 矩阵与 JSON 互转 | converter | 176 |
| 173 | Cookie 转 JS 代码 | converter | 177 |
| 174 | C/C# 代码格式化 | formatter | 181 |
| 175 | Ruby/Perl/VBScript 格式化 | formatter | 182 |
| 176 | 常用 UserAgent 列表 | network | 184 |
| 177 | 富文本转 Markdown | converter | 187 |
| 178 | 视频转 MP3 | converter | 189 |
| 179 | 视频切片 | converter | 190 |
| 180 | 视频画面裁剪 | converter | 191 |
| 181 | PDF 压缩 | converter | 192 |
| 182 | PDF 编辑器 | converter | 193 |
| 183 | 图片切圆角 | image | 197 |
| 184 | 手写签名提取 | image | 198 |
| 185 | TIFF 图片分割 | image | 199 |
| 186 | 三维数据可视化 | misc | 200 |
| 187 | 汉字书写/笔画工具 | text | 201 |
| 188 | 汉字笔画统计 | text | 202 |
| 189 | 彩色文字特效生成 | text | 204 |
| 190 | 数据库设计工具 | misc | 205 |
| 191 | 网络拓扑图制作 | misc | 206 |
| 192 | 格子纸制作 | misc | 207 |
| 193 | 迷宫生成器 | misc | 208 |
| 194 | 会议倒计时器 | misc | 209 |
| 195 | 随机点名工具 | misc | 210 |
| 196 | 反应速度测试 | misc | 211 |
| 197 | 色盲色弱测试 | misc | 212 |
| 198 | 文件格式识别 | misc | 213 |
| 199 | 数字转多国货币大写 | converter | 214 |
| 200 | 带宽计算器 | math | 215 |
| 201 | 屏幕 PPI 计算器 | misc | 216 |
| 202 | 移动设备 UI 尺寸规范 | misc | 217 |
| 203 | SQL 双引号处理 | formatter | 218 |
| 204 | 拼音首字母排序 | text | 219 |
| 205 | ZIP 文件列表查看 | misc | 220 |
| 206 | 蒙特卡罗估算圆周率 | math | 221 |
| 207 | 自然常数 e 生成器 | math | 222 |
| 208 | 48 色蜡笔/彩铅色彩 | color | 223 |
| 209 | UI 颜色渐变 CSS | color | 224 |
| 210 | iOS/Android Logo 生成 | image | 225 |
| 211 | 弹出窗口生成器 | css | 226 |
| 212 | HTML5 兼容性测试 | misc | 227 |
| 213 | 证件照尺寸标准 | misc | 228 |
| 214 | CRX 下载地址解析 | misc | 229 |
| 215 | PHPSESSION 数据转换 | converter | 167b |

---

## 第十三部分：SEO 与 GEO 策略需求

### 需求 138：多语言 SEO 策略

**用户故事：** 作为平台运营者，我希望每个工具页面在各语言搜索引擎中都能获得良好排名。

#### 验收标准

1. THE SEO_Manager SHALL 为每个工具页面在每种支持语言下生成独立的 URL（如 `/en/tools/json-formatter`、`/zh-cn/tools/json-formatter`）。
2. THE SEO_Manager SHALL 在每个页面的 `<head>` 中生成完整的 hreflang 标签集，标明所有语言版本的替代 URL。
3. THE SEO_Manager SHALL 为每个语言版本生成语言特定的 title 和 meta description，使用该语言的自然关键词。
4. THE SEO_Manager SHALL 生成多语言 sitemap.xml，为每个 URL 包含所有语言版本的 xhtml:link 标签。
5. THE Hub SHALL 确保每个语言版本的页面内容（工具名称、描述、使用说明、按钮文字）完全使用对应语言，不混用其他语言。

### 需求 139：结构化数据与社交分享

**用户故事：** 作为平台运营者，我希望工具页面在搜索结果和社交媒体中有丰富的展示效果。

#### 验收标准

1. THE SEO_Manager SHALL 为每个工具页面生成 JSON-LD 结构化数据，类型为 WebApplication，包含：name、description、url、applicationCategory、operatingSystem（"Any"）、offers（Free）。
2. THE SEO_Manager SHALL 为首页生成 WebSite 类型的结构化数据，包含 SearchAction。
3. THE SEO_Manager SHALL 为每个页面生成 Open Graph meta 标签：og:title、og:description、og:type、og:url、og:locale。
4. THE SEO_Manager SHALL 为每个页面生成 Twitter Card meta 标签：twitter:card、twitter:title、twitter:description。
5. THE SEO_Manager SHALL 为分类页面生成 BreadcrumbList 结构化数据。


---

## 第十四部分：最终补充需求（需求 230-270）

以下为逐条对比 bejson.com 完整侧边栏后发现的所有剩余遗漏工具。

### JSON 工具补充

#### 需求 230：JSON 着色工具

**用户故事：** 作为开发者，我希望能为 JSON 数据添加语法高亮着色，以便嵌入到文档或网页中。

##### 验收标准

1. WHEN 用户输入 JSON 数据时，THE Tool SHALL 输出带语法高亮的 HTML 代码。
2. THE Tool SHALL 支持多种配色主题（亮色、暗色、Monokai 等）。
3. THE Tool SHALL 支持一键复制着色后的 HTML 代码。

---

#### 需求 231：JSON 在线编辑器

**用户故事：** 作为开发者，我希望能使用功能完整的在线 JSON 编辑器进行数据编辑。

##### 验收标准

1. THE Tool SHALL 提供代码编辑器模式，支持语法高亮、自动补全、代码折叠。
2. THE Tool SHALL 提供树形编辑模式，支持可视化编辑键值对。
3. THE Tool SHALL 支持在代码模式和树形模式之间切换。
4. THE Tool SHALL 实时校验 JSON 合法性并显示错误位置。

---

#### 需求 232：XML 在线编辑器

**用户故事：** 作为开发者，我希望能使用在线 XML 编辑器编辑和校验 XML 数据。

##### 验收标准

1. THE Tool SHALL 提供代码编辑器，支持 XML 语法高亮和代码折叠。
2. THE Tool SHALL 实时校验 XML 格式合法性。
3. THE Tool SHALL 支持 XML 格式化和压缩。
4. THE Tool SHALL 支持一键复制。

---

#### 需求 233：YAML 在线编辑器/校验器

**用户故事：** 作为开发者，我希望能在线编辑和校验 YAML 数据。

##### 验收标准

1. THE Tool SHALL 提供代码编辑器，支持 YAML 语法高亮。
2. THE Tool SHALL 实时校验 YAML 格式合法性并显示错误信息。
3. THE Tool SHALL 支持 YAML 与 JSON 之间的互转预览。
4. THE Tool SHALL 支持一键复制。

---

#### 需求 234：TOML 在线编辑器/校验器

**用户故事：** 作为开发者，我希望能在线编辑和校验 TOML 数据。

##### 验收标准

1. THE Tool SHALL 提供代码编辑器，支持 TOML 语法高亮。
2. THE Tool SHALL 实时校验 TOML 格式合法性并显示错误信息。
3. THE Tool SHALL 支持 TOML 与 JSON 之间的互转预览。
4. THE Tool SHALL 支持一键复制。

---


### 编码/加密补充

#### 需求 235：MD2/MD4 哈希计算

**用户故事：** 作为开发者，我希望能计算 MD2 和 MD4 哈希值。

##### 验收标准

1. WHEN 用户输入文本时，THE Tool SHALL 计算 MD2 和 MD4 哈希值。
2. THE Tool SHALL 支持大写和小写输出。
3. THE Tool SHALL 支持一键复制。

---

#### 需求 236：Shake/Keccak 哈希计算

**用户故事：** 作为开发者，我希望能计算 Shake 和 Keccak 系列哈希值。

##### 验收标准

1. THE Tool SHALL 支持 Shake-128、Shake-256、Keccak-224、Keccak-256、Keccak-384、Keccak-512 算法。
2. WHEN 用户输入文本并选择算法时，THE Tool SHALL 计算对应的哈希值。
3. THE Tool SHALL 支持一键复制。

---

#### 需求 237：迅雷/快车/旋风 URL 加解密

**用户故事：** 作为用户，我希望能解码迅雷、快车、旋风专用链接。

##### 验收标准

1. WHEN 用户输入迅雷链接（thunder://）时，THE Tool SHALL 解码为原始下载地址。
2. THE Tool SHALL 支持快车链接（flashget://）和旋风链接（qqdl://）的解码。
3. THE Tool SHALL 支持将普通 URL 编码为迅雷/快车/旋风链接。
4. THE Tool SHALL 支持一键复制结果。

---

#### 需求 238：种子转磁力链（torrent 转 magnet）

**用户故事：** 作为用户，我希望能从 torrent 文件提取磁力链接。

##### 验收标准

1. WHEN 用户上传 .torrent 文件时，THE Tool SHALL 解析并生成对应的磁力链接（magnet URI）。
2. THE Tool SHALL 显示 torrent 文件的基本信息（文件名、大小、文件列表）。
3. THE Tool SHALL 在纯前端完成解析。
4. THE Tool SHALL 支持一键复制磁力链接。

---

#### 需求 239：Type7 算法加密/解密

**用户故事：** 作为网络工程师，我希望能对 Cisco Type 7 密码进行加密和解密。

##### 验收标准

1. WHEN 用户输入明文密码时，THE Tool SHALL 使用 Type 7 算法加密。
2. WHEN 用户输入 Type 7 密文时，THE Tool SHALL 解密为明文。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 240：PostgreSQL/MySQL/MariaDB 密码生成

**用户故事：** 作为 DBA，我希望能生成各数据库格式的密码哈希。

##### 验收标准

1. THE Tool SHALL 支持生成 PostgreSQL（md5 格式）、MySQL（mysql_native_password 格式）、MariaDB 格式的密码哈希。
2. WHEN 用户输入密码和用户名时，THE Tool SHALL 生成对应格式的哈希值。
3. THE Tool SHALL 支持一键复制。

---

### 前端/转换补充

#### 需求 241：HTML 转 JS / JS 转 HTML

**用户故事：** 作为前端开发者，我希望能在 HTML 代码和 JavaScript 字符串之间互相转换。

##### 验收标准

1. WHEN 用户输入 HTML 代码时，THE Tool SHALL 将其转换为 JavaScript 字符串拼接代码（document.write 或模板字符串）。
2. WHEN 用户输入 JavaScript 字符串代码时，THE Tool SHALL 提取并还原为 HTML。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 242：前端开发快捷键速查表

**用户故事：** 作为前端开发者，我希望能快速查阅常用 IDE 和浏览器的快捷键。

##### 验收标准

1. THE Tool SHALL 展示 VS Code、Chrome DevTools、Sublime Text 等常用工具的快捷键列表。
2. THE Tool SHALL 支持按工具和功能分类筛选。
3. THE Tool SHALL 支持搜索快捷键。
4. THE Tool SHALL 同时展示 Windows 和 macOS 的快捷键。

---

#### 需求 243：常用 JS 库 CDN 查询

**用户故事：** 作为前端开发者，我希望能快速查找常用 JavaScript 库的 CDN 地址。

##### 验收标准

1. THE Tool SHALL 展示常用 JS 库（jQuery、React、Vue、Angular、Lodash 等）的 CDN 地址。
2. THE Tool SHALL 支持搜索库名。
3. THE Tool SHALL 支持选择 CDN 提供商（cdnjs、jsdelivr、unpkg）。
4. THE Tool SHALL 支持一键复制 `<script>` 标签代码。

---

#### 需求 244：在线 RunJS 编辑器

**用户故事：** 作为前端开发者，我希望能在线编写和运行 HTML/CSS/JavaScript 代码。

##### 验收标准

1. THE Tool SHALL 提供 HTML、CSS、JavaScript 三个编辑面板。
2. THE Tool SHALL 提供实时预览区域，自动渲染代码结果。
3. THE Tool SHALL 支持 Console 输出显示。
4. THE Tool SHALL 支持常用 CSS/JS 库的快速引入。

---

### 其他/生活工具补充

#### 需求 245：公历农历互转

**用户故事：** 作为用户，我希望能在公历（阳历）和农历（阴历）之间互相转换。

##### 验收标准

1. WHEN 用户输入公历日期时，THE Tool SHALL 显示对应的农历日期（含天干地支、生肖）。
2. WHEN 用户输入农历日期时，THE Tool SHALL 显示对应的公历日期。
3. THE Tool SHALL 显示节气信息。
4. THE Tool SHALL 在纯前端完成计算。

---

#### 需求 246：十二生肖查询

**用户故事：** 作为用户，我希望能根据出生年份查询对应的生肖。

##### 验收标准

1. WHEN 用户输入出生年份时，THE Tool SHALL 显示对应的生肖和天干地支年份。
2. THE Tool SHALL 展示完整的十二生肖对照表。

---

#### 需求 247：身份证号码提取生日/校验

**用户故事：** 作为用户，我希望能从身份证号码中提取信息或校验号码合法性。

##### 验收标准

1. WHEN 用户输入身份证号码时，THE Tool SHALL 提取并显示：出生日期、性别、地区。
2. THE Tool SHALL 校验身份证号码的校验位是否正确。
3. THE Tool SHALL 支持批量校验多个身份证号码。
4. THE Tool SHALL 声明此工具仅用于格式校验，不涉及真实身份信息查询。

---

#### 需求 248：血型遗传计算器

**用户故事：** 作为用户，我希望能根据父母血型推算孩子可能的血型。

##### 验收标准

1. WHEN 用户选择父亲和母亲的血型时，THE Tool SHALL 显示孩子可能的血型及概率。
2. THE Tool SHALL 支持反向推算：根据孩子血型推算父母可能的血型。
3. THE Tool SHALL 显示血型遗传原理说明。

---

#### 需求 249：BMI/BMR 健康指数计算器

**用户故事：** 作为用户，我希望能计算 BMI（体质指数）和 BMR（基础代谢率）。

##### 验收标准

1. WHEN 用户输入身高、体重时，THE Tool SHALL 计算 BMI 值并显示健康等级。
2. WHEN 用户输入身高、体重、年龄、性别时，THE Tool SHALL 计算 BMR（基础代谢率）。
3. THE Tool SHALL 以可视化图表展示 BMI 所在区间。

---

#### 需求 250：汽车油耗计算器

**用户故事：** 作为车主，我希望能计算汽车的百公里油耗。

##### 验收标准

1. WHEN 用户输入行驶里程和加油量时，THE Tool SHALL 计算百公里油耗。
2. THE Tool SHALL 支持计算油费（输入油价）。
3. THE Tool SHALL 支持多次加油记录的平均油耗计算。

---

#### 需求 251：电动车充电费用计算器

**用户故事：** 作为电动车车主，我希望能计算充电费用。

##### 验收标准

1. WHEN 用户输入电池容量、当前电量、目标电量、电价时，THE Tool SHALL 计算充电费用和充电时间。
2. THE Tool SHALL 支持不同充电模式（快充/慢充）的计算。

---

#### 需求 252：硬盘整数分区计算器

**用户故事：** 作为用户，我希望能计算硬盘整数分区的精确大小。

##### 验收标准

1. WHEN 用户输入期望的分区大小（GB）时，THE Tool SHALL 计算在 Windows 中显示为整数 GB 所需的实际 MB 数。
2. THE Tool SHALL 显示计算公式和说明。

---

#### 需求 253：十二时辰时间转换器

**用户故事：** 作为用户，我希望能在现代24小时制和中国传统十二时辰之间互相转换。

##### 验收标准

1. WHEN 用户输入现代时间时，THE Tool SHALL 显示对应的十二时辰名称。
2. THE Tool SHALL 展示完整的十二时辰对照表。
3. THE Tool SHALL 显示每个时辰的含义和养生建议。

---

#### 需求 254：支票日期大写转换

**用户故事：** 作为财务人员，我希望能将日期转换为支票上使用的中文大写格式。

##### 验收标准

1. WHEN 用户选择日期时，THE Tool SHALL 将其转换为中文大写日期格式（如：贰零贰陆年肆月零贰日）。
2. THE Tool SHALL 支持一键复制结果。

---


### 后端/转换工具补充

#### 需求 255：SQL 生成 Java 代码

**用户故事：** 作为 Java 开发者，我希望能从 SQL 建表语句生成 Java 实体类。

##### 验收标准

1. WHEN 用户输入 SQL CREATE TABLE 语句时，THE Tool SHALL 生成对应的 Java 实体类代码。
2. THE Tool SHALL 正确映射 SQL 数据类型到 Java 类型。
3. THE Tool SHALL 支持生成 getter/setter 方法。
4. THE Tool SHALL 支持一键复制生成的代码。

---

#### 需求 256：MySQL/Oracle 转 Java 实体类

**用户故事：** 作为 Java 开发者，我希望能从数据库建表语句生成 Java 实体类。

##### 验收标准

1. THE Tool SHALL 支持 MySQL 和 Oracle 的 CREATE TABLE 语句解析。
2. THE Tool SHALL 生成对应的 Java 实体类，包含字段、类型映射、注释。
3. THE Tool SHALL 支持 Lombok 注解选项。
4. THE Tool SHALL 支持一键复制。

---

#### 需求 257：SQL 转 C# 实体类

**用户故事：** 作为 C# 开发者，我希望能从 SQL 建表语句生成 C# 实体类。

##### 验收标准

1. WHEN 用户输入 SQL CREATE TABLE 语句时，THE Tool SHALL 生成对应的 C# 类代码。
2. THE Tool SHALL 正确映射 SQL 数据类型到 C# 类型。
3. THE Tool SHALL 支持一键复制。

---

#### 需求 258：数据库 INSERT/UPDATE 语句字段视图

**用户故事：** 作为数据库开发者，我希望能将 SQL INSERT/UPDATE 语句格式化为可读的字段视图。

##### 验收标准

1. WHEN 用户输入 SQL INSERT 或 UPDATE 语句时，THE Tool SHALL 将字段和值以表格形式展示。
2. THE Tool SHALL 支持编辑字段值后重新生成 SQL 语句。
3. THE Tool SHALL 支持一键复制。

---

### 站长工具补充

#### 需求 259：HTML/JS/CSS 在线代码过滤工具

**用户故事：** 作为站长，我希望能从 HTML 中过滤/提取特定类型的代码。

##### 验收标准

1. WHEN 用户输入 HTML 内容时，THE Tool SHALL 支持提取其中的 JavaScript 代码、CSS 代码或纯文本。
2. THE Tool SHALL 支持选择过滤模式：仅保留 HTML、仅保留 JS、仅保留 CSS、去除所有脚本。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 260：在线 Robots 检测

**用户故事：** 作为站长，我希望能检测 robots.txt 文件是否正确配置。

##### 验收标准

1. WHEN 用户输入 robots.txt 内容和测试 URL 时，THE Tool SHALL 判断该 URL 是否被允许爬取。
2. THE Tool SHALL 支持选择 User-agent 进行测试。
3. THE Tool SHALL 高亮显示匹配的规则行。

---

### 数学工具补充

#### 需求 261：在线二进制加减乘除计算

**用户故事：** 作为开发者，我希望能直接在二进制下进行算术运算。

##### 验收标准

1. WHEN 用户输入两个二进制数和运算符时，THE Tool SHALL 计算结果并以二进制显示。
2. THE Tool SHALL 同时显示十进制和十六进制的运算结果。
3. THE Tool SHALL 支持八进制和十六进制的独立计算模式。

---

#### 需求 262：小数随机生成工具

**用户故事：** 作为开发者，我希望能生成指定精度的随机小数。

##### 验收标准

1. THE Tool SHALL 支持指定小数位数（1-20 位）。
2. THE Tool SHALL 支持指定范围（最小值-最大值）。
3. THE Tool SHALL 支持批量生成。
4. THE Tool SHALL 支持一键复制。

---

### 其他补充

#### 需求 263：在线 JSON 与 Postman 互转

**用户故事：** 作为 API 开发者，我希望能在 JSON 请求数据和 Postman Collection 格式之间互相转换。

##### 验收标准

1. WHEN 用户输入 JSON 请求数据时，THE Tool SHALL 生成 Postman Collection 格式。
2. WHEN 用户输入 Postman Collection JSON 时，THE Tool SHALL 提取请求信息。
3. THE Tool SHALL 支持一键复制结果。

---

#### 需求 264：在线 SQL 转 Form 表单

**用户故事：** 作为开发者，我希望能从 SQL 建表语句生成 HTML 表单。

##### 验收标准

1. WHEN 用户输入 SQL CREATE TABLE 语句时，THE Tool SHALL 生成对应的 HTML 表单代码。
2. THE Tool SHALL 根据字段类型自动选择表单控件（text、number、date、select 等）。
3. THE Tool SHALL 支持一键复制生成的 HTML。

---

#### 需求 265：在线 SQL 转 JSON

**用户故事：** 作为开发者，我希望能将 SQL 查询结果格式转换为 JSON。

##### 验收标准

1. WHEN 用户输入 SQL INSERT 语句时，THE Tool SHALL 将其转换为 JSON 数组。
2. THE Tool SHALL 正确解析字段名和值。
3. THE Tool SHALL 支持一键复制。

---

#### 需求 266：在线 URL 和 Postman 互转

**用户故事：** 作为 API 开发者，我希望能将 URL（含查询参数）转换为 Postman 请求格式。

##### 验收标准

1. WHEN 用户输入完整 URL 时，THE Tool SHALL 生成 Postman 请求 JSON。
2. THE Tool SHALL 解析 URL 中的查询参数、路径参数。
3. THE Tool SHALL 支持一键复制。

---

#### 需求 267：在线 Emoji 符号大全

**用户故事：** 作为用户，我希望能浏览和搜索 Emoji 表情符号。

##### 验收标准

1. THE Tool SHALL 展示完整的 Emoji 符号集合，按分类（表情、手势、动物、食物、活动、旅行、物品、符号等）组织。
2. THE Tool SHALL 支持搜索 Emoji（按名称或关键词）。
3. WHEN 用户点击 Emoji 时，THE Tool SHALL 显示其 Unicode 编码、HTML 实体、名称。
4. THE Tool SHALL 支持一键复制 Emoji。

---

#### 需求 268：特殊符号大全

**用户故事：** 作为用户，我希望能浏览和复制各种特殊符号。

##### 验收标准

1. THE Tool SHALL 展示常用特殊符号集合：箭头、数学符号、货币符号、音乐符号、星号、勾叉、方块、线条等。
2. THE Tool SHALL 按分类组织展示。
3. WHEN 用户点击符号时，THE Tool SHALL 支持一键复制。
4. THE Tool SHALL 显示每个符号的 Unicode 编码和 HTML 实体。

---

#### 需求 269：在线 SQL 转 Yii 模型

**用户故事：** 作为 Yii 框架开发者，我希望能从 SQL 建表语句生成 Yii Model 代码。

##### 验收标准

1. WHEN 用户输入 SQL CREATE TABLE 语句时，THE Tool SHALL 生成 Yii2 ActiveRecord 模型代码。
2. THE Tool SHALL 生成 rules()、attributeLabels() 等方法。
3. THE Tool SHALL 支持一键复制。

---

#### 需求 270：在线 curl 命令转代码（全语言）

**用户故事：** 作为开发者，我希望能将 curl 命令转换为更多编程语言的代码。

##### 验收标准

1. THE Tool SHALL 在需求 87 的基础上额外支持：C#（HttpClient）、Ruby（Net::HTTP）、Rust（reqwest）、Swift（URLSession）、Dart（http）。
2. THE Tool SHALL 支持一键切换目标语言。
3. THE Tool SHALL 支持一键复制。

---

## 第十四部分补充：最终优先级汇总

**P2 批次最终新增：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 216 | JSON 在线编辑器 | json | 231 |
| 217 | YAML 在线编辑器 | json | 233 |
| 218 | TOML 在线编辑器 | json | 234 |
| 219 | RunJS 在线编辑器 | css | 244 |
| 220 | SQL 生成 Java 代码 | converter | 255 |
| 221 | Emoji 符号大全 | misc | 267 |
| 222 | 特殊符号大全 | misc | 268 |

**P3 批次最终新增：**
| 序号 | 工具 | 分类 | 需求编号 |
|------|------|------|----------|
| 223 | JSON 着色 | json | 230 |
| 224 | XML 在线编辑器 | json | 232 |
| 225 | MD2/MD4 哈希 | encoding | 235 |
| 226 | Shake/Keccak 哈希 | encoding | 236 |
| 227 | 迅雷/快车 URL 解密 | encoding | 237 |
| 228 | 种子转磁力链 | encoding | 238 |
| 229 | Type7 加密解密 | encoding | 239 |
| 230 | 数据库密码生成 | encoding | 240 |
| 231 | HTML 转 JS 互转 | converter | 241 |
| 232 | 前端快捷键速查 | misc | 242 |
| 233 | JS 库 CDN 查询 | misc | 243 |
| 234 | 公历农历互转 | misc | 245 |
| 235 | 十二生肖查询 | misc | 246 |
| 236 | 身份证号校验 | misc | 247 |
| 237 | 血型遗传计算 | misc | 248 |
| 238 | BMI/BMR 计算器 | misc | 249 |
| 239 | 汽车油耗计算器 | misc | 250 |
| 240 | 电动车充电计算 | misc | 251 |
| 241 | 硬盘分区计算器 | misc | 252 |
| 242 | 十二时辰转换 | misc | 253 |
| 243 | 支票日期大写 | misc | 254 |
| 244 | MySQL/Oracle 转 Java | converter | 256 |
| 245 | SQL 转 C# 实体类 | converter | 257 |
| 246 | SQL INSERT 字段视图 | formatter | 258 |
| 247 | HTML/JS/CSS 过滤 | misc | 259 |
| 248 | Robots 检测 | network | 260 |
| 249 | 二进制算术运算 | math | 261 |
| 250 | 小数随机生成 | math | 262 |
| 251 | JSON/Postman 互转 | converter | 263 |
| 252 | SQL 转 Form 表单 | converter | 264 |
| 253 | SQL 转 JSON | converter | 265 |
| 254 | URL/Postman 互转 | converter | 266 |
| 255 | SQL 转 Yii 模型 | converter | 269 |
| 256 | curl 转全语言代码 | network | 270 |

---

## 最终统计

- 总需求数：270 条
- 平台基础设施需求：13 条（需求 1-13）
- 工具需求：255 条（需求 14-270）
- SEO/GEO 策略需求：2 条（需求 138-139）
- 独立工具总数：约 **256 个**
- 分批计划：P0（15个）→ P1（25个）→ P2（50个）→ P3（166个）


---

## 第十五部分：Cloudflare Pages 部署适配需求

### 需求 271：Cloudflare Pages 静态导出兼容

**用户故事：** 作为平台运营者，我希望项目能顺利部署到 Cloudflare Pages 上，确保所有功能正常运行。

#### 验收标准

1. THE Hub SHALL 使用 Next.js `output: 'export'` 模式生成纯静态文件，确保不依赖 Node.js 服务端运行时。
2. THE Hub SHALL 确保所有工具页面在构建时通过 `generateStaticParams` 预生成所有 locale × tool 的组合路径。
3. THE Hub SHALL 确保不使用以下 Next.js 服务端特性：API Routes、Server Actions、middleware（Cloudflare Pages 静态模式不支持）、`revalidate`/ISR、`headers()`/`cookies()` 等服务端函数。
4. THE Hub SHALL 确保 `trailingSlash: true` 配置保持启用，以兼容 Cloudflare Pages 的静态文件路由规则。
5. THE Hub SHALL 确保构建产物输出到 `out/` 目录，Cloudflare Pages 构建配置指向该目录。

---

### 需求 272：Cloudflare Pages 文件大小与数量限制

**用户故事：** 作为平台运营者，我希望构建产物不超过 Cloudflare Pages 的限制。

#### 验收标准

1. THE Hub SHALL 确保单个静态文件大小不超过 25MB（Cloudflare Pages 单文件限制）。
2. THE Hub SHALL 确保总文件数不超过 20,000 个（Cloudflare Pages 免费版限制）。
3. WHEN 工具数量 × 语言数量导致页面总数接近限制时，THE Hub SHALL 通过合并或懒加载策略控制文件数量。
4. THE Hub SHALL 监控构建产物的文件数量和总大小，在 CI 中添加检查。

---

### 需求 273：Cloudflare Pages 自定义 Headers 与缓存

**用户故事：** 作为平台运营者，我希望通过 Cloudflare Pages 的 `_headers` 文件配置合理的缓存策略和安全头。

#### 验收标准

1. THE Hub SHALL 在 `public/` 目录中生成 `_headers` 文件，配置以下 HTTP 头：
   - 静态资源（JS/CSS/图片）：`Cache-Control: public, max-age=31536000, immutable`
   - HTML 页面：`Cache-Control: public, max-age=0, must-revalidate`
   - 安全头：`X-Content-Type-Options: nosniff`、`X-Frame-Options: DENY`、`Referrer-Policy: strict-origin-when-cross-origin`
2. THE Hub SHALL 确保 Next.js 静态导出的 hashed 文件名（`_next/static/`）能被长期缓存。

---

### 需求 274：Cloudflare Pages 自定义重定向

**用户故事：** 作为平台运营者，我希望通过 `_redirects` 文件配置语言重定向和旧路径兼容。

#### 验收标准

1. THE Hub SHALL 在 `public/` 目录中生成 `_redirects` 文件。
2. THE Hub SHALL 配置根路径 `/` 重定向到默认语言路径 `/en/`（302 临时重定向）。
3. THE Hub SHALL 确保 `_redirects` 文件中的规则数量不超过 2,000 条（Cloudflare Pages 限制）。
4. IF 用户访问不带 locale 前缀的工具路径（如 `/tools/json-formatter`），THEN THE Hub SHALL 重定向到默认语言路径（`/en/tools/json-formatter/`）。

---

### 需求 275：Cloudflare Pages 构建优化

**用户故事：** 作为平台运营者，我希望构建过程在 Cloudflare Pages 的构建环境中能顺利完成。

#### 验收标准

1. THE Hub SHALL 确保构建时间不超过 20 分钟（Cloudflare Pages 构建超时限制）。
2. THE Hub SHALL 确保构建内存使用不超过 Cloudflare Pages 的限制（约 8GB）。
3. WHEN 工具数量增长导致构建时间过长时，THE Hub SHALL 考虑将工具组件拆分为独立 chunk，减少构建时的内存占用。
4. THE Hub SHALL 在 `package.json` 中配置 `build:cf` 脚本用于 Cloudflare Pages 构建。

---

### 需求 276：Cloudflare Pages SPA 回退与 404 处理

**用户故事：** 作为用户，我希望在访问不存在的页面时看到友好的 404 页面。

#### 验收标准

1. THE Hub SHALL 在构建时生成 `404.html` 页面，Cloudflare Pages 会自动将其用作 404 回退页面。
2. THE Hub SHALL 确保 404 页面包含导航栏和返回首页链接。
3. THE Hub SHALL 确保 404 页面支持多语言（根据 URL 中的 locale 前缀显示对应语言）。

---

### 需求 277：Cloudflare Pages 大文件处理策略

**用户故事：** 作为用户，我希望涉及大文件处理的工具（视频、PDF 等）能在 Cloudflare Pages 的纯静态环境中正常工作。

#### 验收标准

1. THE Hub SHALL 确保所有文件处理工具（图片压缩、视频处理、PDF 处理等）完全在浏览器端使用 Web API 完成，不依赖服务端上传。
2. THE Hub SHALL 对需要 WebAssembly 的工具（如 FFmpeg.wasm）采用按需加载策略，WASM 文件从 CDN 加载而非打包到构建产物中。
3. THE Hub SHALL 确保 WebAssembly 文件的 MIME 类型通过 `_headers` 文件正确配置为 `application/wasm`。
4. IF 工具需要加载大型数据文件（如汉字拼音库、圆周率数据），THEN THE Hub SHALL 将这些数据文件托管到 Cloudflare R2 或外部 CDN，而非打包到构建产物中。

---

### 需求 278：Cloudflare Pages sitemap 与 SEO 适配

**用户故事：** 作为平台运营者，我希望 sitemap.xml 和 robots.txt 在 Cloudflare Pages 上能被正确访问。

#### 验收标准

1. THE Hub SHALL 在构建时生成 `sitemap.xml` 并输出到 `out/` 目录根路径。
2. THE Hub SHALL 在构建时生成 `robots.txt` 并输出到 `out/` 目录根路径，包含 sitemap 地址。
3. THE Hub SHALL 确保 sitemap.xml 中的 URL 使用生产环境的完整域名（通过环境变量配置）。
4. THE Hub SHALL 确保 Cloudflare Pages 的自定义域名正确配置后，所有 SEO 相关的 URL 指向自定义域名而非 `*.pages.dev` 域名。

---

### 需求 279：Cloudflare Pages 环境变量与多环境支持

**用户故事：** 作为开发者，我希望能通过环境变量区分开发、预览和生产环境。

#### 验收标准

1. THE Hub SHALL 支持通过 `NEXT_PUBLIC_SITE_URL` 环境变量配置站点 URL，用于 sitemap、canonical URL、Open Graph 等。
2. THE Hub SHALL 支持通过 `NEXT_PUBLIC_GA_ID` 等环境变量配置分析工具（可选）。
3. THE Hub SHALL 确保所有环境变量以 `NEXT_PUBLIC_` 前缀命名，以便在静态导出时被内联到客户端代码中。

---

### 需求 280：Cloudflare Pages Web Analytics 集成

**用户故事：** 作为平台运营者，我希望能使用 Cloudflare Web Analytics 追踪网站访问数据。

#### 验收标准

1. THE Hub SHALL 支持可选集成 Cloudflare Web Analytics（通过环境变量控制是否启用）。
2. WHEN 启用时，THE Hub SHALL 在页面中注入 Cloudflare Web Analytics 的 beacon 脚本。
3. THE Hub SHALL 确保 Analytics 脚本不影响页面加载性能（异步加载）。
