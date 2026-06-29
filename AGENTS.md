# AGENTS.md

## 项目定位

本项目是一个 **LLM 企业内部风险管理对话式机器人 demo**，当前核心场景为：

> 交易对手持仓分析

项目目标不是实现完整风控系统，而是快速交付一个可演示、可扩展、视觉统一的前端原型。所有回答、指标、图表和交互均可使用静态 mock 数据。

后续会持续增加新的手稿场景，因此代码需要优先保证：

- 视觉风格统一
- 组件可复用
- 交互简单清晰
- mock 数据易替换
- 不引入不必要复杂度

---

## 产品气质

整体应呈现为：

- 企业内部风控助手
- 对话式分析工具
- 轻量 BI + LLM 回答卡片
- 稳重、清晰、温暖，不做大屏科技风
- 像集团内部风险管理平台，而不是普通聊天机器人

避免：

- 深色科技蓝大屏
- 过度炫酷动效
- 复杂 3D 图表
- 花哨渐变背景
- 类消费级聊天 App 风格

---

## 视觉风格规范

### 色彩

优先使用以下色彩变量。建议集中放在 CSS variables 或 Tailwind theme 中。

```css
:root {
  --color-bg: #fff8f1;
  --color-bg-soft: #fffaf5;
  --color-card: #ffffff;

  --color-primary: #f97316;
  --color-primary-strong: #ff6a00;
  --color-primary-soft: #fff1e8;
  --color-primary-border: #fed7aa;

  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;

  --color-border: #e5e7eb;
  --color-border-soft: #f3f4f6;

  --color-success: #16a34a;
  --color-success-bg: #dcfce7;

  --color-warning: #f59e0b;
  --color-warning-bg: #fef3c7;

  --color-danger: #dc2626;
  --color-danger-bg: #fee2e2;

  --shadow-card: 0 8px 24px rgba(249, 115, 22, 0.08);
  --shadow-soft: 0 4px 16px rgba(31, 41, 55, 0.06);
}
```

### 使用原则

- 页面背景使用浅米白：`#FFF8F1`
- 主色橙色用于：
  - 当前选中的 tab
  - 主按钮
  - 重点数字
  - 柱状图主色
  - 风险提示中的重点词
- 白色卡片承载主要内容
- 边框尽量浅，不要使用深色描边
- 绿色只用于“可控”“正常”“通过”等正向状态
- 红色只用于严重风险，不要滥用

---

## 布局规范

### 页面结构

当前最小 demo 使用三段式布局：

1. 左侧 Sidebar
2. 中间 Chat + Analysis 主内容区
3. 可选右侧说明区暂不做，后续有需要再扩展

当前优先实现类似参考图中“右图左侧的大框框”效果，即：

- 左侧窄导航
- 中间大白色工作区
- 对话回答和图表分析在同一个主容器内

### 推荐尺寸

```css
.app {
  min-height: 100vh;
  background: var(--color-bg);
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.main-panel {
  max-width: 960px;
  margin: 0 auto;
}
```

移动端不是当前重点，但布局不要写死到完全不可缩放。

---

## 卡片规范

所有核心内容都使用卡片承载。

### Card

```css
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
}
```

### 卡片层级

- 一级容器：`border-radius: 18px`
- 内容卡片：`border-radius: 14px`
- 小指标卡：`border-radius: 12px`
- 按钮 / tag：`border-radius: 8px`

不要使用过重阴影。整体应轻、干净、有留白。

---

## 字体与排版

### 字体

优先使用系统字体：

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "PingFang SC",
  "Microsoft YaHei",
  "Helvetica Neue",
  Arial,
  sans-serif;
```

### 字号建议

- 页面标题：22-26px，600/700
- 模块标题：16-18px，600
- 正文：14px，400/500
- 辅助说明：12-13px
- 指标数字：22-28px，700
- 图表标签：12px

### 文案风格

AI 回答要像企业风控分析助手：

- 先给结论
- 再给关键数据
- 再给风险解释
- 最后给建议动作

避免长篇大论。demo 中每段回答控制在 2-4 行内。

---

## 当前场景：交易对手持仓分析

### 用户问题

```text
帮我看一下交易对手持仓风险情况
```

### AI 总结文案

```text
好的，以下是交易对手持仓风险分析结果：

当前交易对手持仓总规模为 286.35 亿元，较上月增长 8.21%。持仓主要集中在银行、证券等成员公司，其中银行持仓规模最高，占比 34.96%；从资产类型看，债券类资产占比较高，整体集中度处于可控范围，建议持续关注头部成员公司及资产类型集中度变化。
```

### 指标卡片

必须展示 5 个指标卡片：

1. 总持仓规模
   - 数值：286.35 亿元
   - 辅助：较上月 +8.21%

2. 最大交易对手占比
   - 数值：34.96%
   - 辅助：银行

3. Top5 占比
   - 数值：78.21%
   - 辅助：较上月 +2.15pct

4. 交易对手数量
   - 数值：128 家
   - 辅助：较上月 +6 家

5. 风险集中度评级
   - 数值：可控
   - 辅助：较上月 持平

### 指标卡片样式

- 白底
- 浅灰边框
- 数值橙色
- 辅助文字灰色
- “可控”使用浅绿色 badge

---

## 交互规范

当前 demo 只实现轻量前端交互，不接接口。

### 必做交互

1. 分析 Tab 切换
   - 趋势分析
   - 维度分析

2. 趋势分析中切换
   - 图表
   - 表格

3. 维度分析中筛选
   - 成员公司
   - 资产类型
   - 支持多选

### 暂不实现

- 点击柱子下钻
- 真实问答
- 接口请求
- 登录鉴权
- 权限控制
- 复杂 tooltip
- 数据刷新
- 多页面路由

---

## 趋势分析规范

### 默认状态

- 默认选中：趋势分析
- 默认展示：图表

### 图表标题

```text
交易对手持仓规模趋势（近6个月）
```

### 数据

| 时间 | 持仓规模（亿元） | 较上月环比 |
|---|---:|---:|
| 2024-12 | 210.32 | - |
| 2025-01 | 223.45 | ↑ 6.24% |
| 2025-02 | 236.81 | ↑ 5.98% |
| 2025-03 | 249.87 | ↑ 5.52% |
| 2025-04 | 264.59 | ↑ 5.89% |
| 2025-05 | 286.35 | ↑ 8.21% |

### 图表样式

- 使用柱状图
- 柱子使用橙色或橙色渐变
- 柱子顶部显示金额
- X 轴显示月份
- 单位：亿元
- 图表区域必须放在白色卡片中
- 右上角放“图表 / 表格”切换按钮

---

## 维度分析规范

### 筛选器

维度分析顶部展示：

```text
维度筛选：
[成员公司] [资产类型]
```

两个按钮支持多选。

默认只选中“成员公司”。

---

### 状态 A：只选成员公司

标题：

```text
按成员公司统计的持仓规模
```

数据：

| 成员公司 | 持仓规模（亿元） |
|---|---:|
| 银行 | 100.12 |
| 证券 | 72.35 |
| 信托 | 48.26 |
| 资管 | 32.18 |
| 基金 | 21.66 |
| 其他 | 11.78 |

图表：

- X 轴为成员公司
- Y 轴为持仓规模
- 柱子橙色
- 顶部显示数值

---

### 状态 B：只选资产类型

标题：

```text
按资产类型统计的持仓规模
```

数据：

| 资产类型 | 持仓规模（亿元） |
|---|---:|
| 债券 | 167.28 |
| 股票 | 68.74 |
| 基金 | 28.31 |
| 非标 | 14.22 |
| 现金及其他 | 7.80 |

图表：

- X 轴为资产类型
- Y 轴为持仓规模
- 柱子可使用蓝色或橙色
- 建议使用蓝色以区分资产类型视角

---

### 状态 C：成员公司 + 资产类型

标题：

```text
按成员公司和资产类型统计的持仓规模
```

X 轴仍为成员公司，每根柱子按资产类型分色堆叠。

数据：

| 成员公司 | 债券 | 股票 | 基金 | 非标 | 其他 | 合计 |
|---|---:|---:|---:|---:|---:|---:|
| 银行 | 52.36 | 28.21 | 12.15 | 3.40 | 3.99 | 100.12 |
| 证券 | 36.28 | 20.14 | 8.05 | 4.20 | 3.68 | 72.35 |
| 信托 | 22.31 | 12.36 | 7.56 | 2.19 | 3.84 | 48.26 |
| 资管 | 15.26 | 7.85 | 4.12 | 1.14 | 3.81 | 32.18 |
| 基金 | 9.87 | 6.12 | 3.15 | 1.43 | 1.09 | 21.66 |
| 其他 | 5.20 | 3.10 | 1.80 | 0.80 | 0.88 | 11.78 |

图表：

- 使用堆叠柱状图
- 顶部显示图例：债券、股票、基金、非标、其他
- 每根柱子顶部显示合计
- 不需要点击下钻
- tooltip 可做可不做

### 堆叠图颜色建议

```css
--asset-bond: #f97316;
--asset-stock: #3b82f6;
--asset-fund: #22c55e;
--asset-nonstandard: #a855f7;
--asset-other: #9ca3af;
```

---

## 表格规范

所有表格使用轻量风格：

- 白底
- 表头浅灰背景
- 边框浅灰
- 单元格 padding 适中
- 数字右对齐
- 重点数字橙色
- 正向变化可使用绿色
- 负向变化可使用红色

```css
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table th {
  background: #f9fafb;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.table th,
.table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border-soft);
}
```

---

## 推荐追问

分析区下方展示推荐追问按钮。

标题：

```text
你可能还想问：
```

按钮：

- 持仓集中度是否超过阈值？
- 前五大交易对手有哪些？
- 不同资产类型持仓占比如何？
- 查看明细数据

点击后可以：

- 不做任何动作
- 或把文字填入输入框

不要触发真实接口。

---

## 输入框规范

底部输入框结构：

- 左侧小按钮：深度思考
- 中间输入框 placeholder：
  ```text
  请输入您的问题，或选择推荐问题
  ```
- 右侧橙色圆形发送按钮

输入框只是展示，不需要真实问答能力。

---

## 组件规范

建议组件拆分如下：

```text
App
Sidebar
ChatPanel
UserMessage
AssistantMessage
AssistantSummary
MetricCard
AnalysisTabs
TrendAnalysis
DimensionAnalysis
ChartTableToggle
SimpleBarChart
SimpleStackedBarChart
DataTable
SuggestedQuestions
ChatInput
```

### 组件设计原则

- 组件只做一件事
- mock 数据集中存放，不要散落在 JSX 里
- 样式类名语义化
- 不要在组件里写大量 if-else，可以通过状态映射处理
- 暂不引入全局状态管理

---

## 数据组织建议

建议在 `src/mockData.ts` 中集中管理 mock 数据。

```ts
export const trendData = [
  { date: "2024-12", value: 210.32, mom: "-" },
  { date: "2025-01", value: 223.45, mom: "↑ 6.24%" },
  { date: "2025-02", value: 236.81, mom: "↑ 5.98%" },
  { date: "2025-03", value: 249.87, mom: "↑ 5.52%" },
  { date: "2025-04", value: 264.59, mom: "↑ 5.89%" },
  { date: "2025-05", value: 286.35, mom: "↑ 8.21%" },
];

export const companyData = [
  { name: "银行", value: 100.12 },
  { name: "证券", value: 72.35 },
  { name: "信托", value: 48.26 },
  { name: "资管", value: 32.18 },
  { name: "基金", value: 21.66 },
  { name: "其他", value: 11.78 },
];

export const assetTypeData = [
  { name: "债券", value: 167.28 },
  { name: "股票", value: 68.74 },
  { name: "基金", value: 28.31 },
  { name: "非标", value: 14.22 },
  { name: "现金及其他", value: 7.8 },
];

export const stackedData = [
  { company: "银行", bond: 52.36, stock: 28.21, fund: 12.15, nonstandard: 3.4, other: 3.99, total: 100.12 },
  { company: "证券", bond: 36.28, stock: 20.14, fund: 8.05, nonstandard: 4.2, other: 3.68, total: 72.35 },
  { company: "信托", bond: 22.31, stock: 12.36, fund: 7.56, nonstandard: 2.19, other: 3.84, total: 48.26 },
  { company: "资管", bond: 15.26, stock: 7.85, fund: 4.12, nonstandard: 1.14, other: 3.81, total: 32.18 },
  { company: "基金", bond: 9.87, stock: 6.12, fund: 3.15, nonstandard: 1.43, other: 1.09, total: 21.66 },
  { company: "其他", bond: 5.2, stock: 3.1, fund: 1.8, nonstandard: 0.8, other: 0.88, total: 11.78 },
];
```

---

## 图表实现要求

优先简单实现。

可选方案：

1. 使用 Recharts
2. 使用纯 CSS div 自绘柱状图
3. 使用 SVG 自绘柱状图

当前 demo 推荐：

- 普通柱状图可以用 CSS div 实现
- 堆叠柱状图可以用 CSS div 实现
- 若项目已经安装 Recharts，也可以使用 Recharts

不要为了图表引入复杂配置系统。

### 图表视觉要求

- 坐标轴简化
- 背景网格线浅灰
- 数值标签清晰
- 柱子不要太宽
- 柱间距适中
- 默认不要动画，或只保留轻微过渡

---

## 图标规范

可以使用 emoji、lucide-react 或简单 CSS 图标。优先少依赖。

建议图标含义：

- 机器人：AI 助手
- 用户：用户头像
- 趋势分析：柱状图 / 折线
- 维度分析：筛选 / 分层
- 表格：表格 icon
- 发送：箭头 icon
- 风险可控：绿色圆点 / badge

图标要小，不能喧宾夺主。

---

## 代码风格

- 使用 TypeScript
- 使用函数组件
- 状态命名清晰
- 不写无意义抽象
- 不提前实现后端协议
- 不提前引入复杂状态管理
- 不做过度封装

示例状态：

```ts
type ActiveTab = "trend" | "dimension";
type TrendView = "chart" | "table";
type Dimension = "company" | "asset";

const [activeTab, setActiveTab] = useState<ActiveTab>("trend");
const [trendView, setTrendView] = useState<TrendView>("chart");
const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>(["company"]);
```

维度筛选规则：

- 默认选中 `company`
- 至少保留一个选中项
- 如果只选 `company`，显示成员公司柱状图
- 如果只选 `asset`，显示资产类型柱状图
- 如果同时选中，显示堆叠柱状图

---

## 未来扩展原则

后续会新增更多手稿场景，例如：

- 组合风险分析
- 产险不良率趋势
- 系统性风险分析
- 大户风险分析
- 金融市场分析
- 周期性风险监控

新增场景时，不要重写整体布局。优先复用：

- Sidebar
- ChatPanel
- AssistantMessage
- MetricCard
- AnalysisTabs
- ChartCard
- DataTable
- SuggestedQuestions
- ChatInput

每个新场景只新增：

- mock 数据
- 回答文案
- 场景专属图表
- 必要的小组件

---

## 最小交付验收标准

完成后至少满足：

1. 页面可以正常打开
2. 视觉风格接近浅米白 + 橙色企业风控助手
3. 左侧导航存在
4. 中间有用户提问和 AI 回答
5. 5 个指标卡片完整展示
6. 趋势分析 tab 可展示柱状图
7. 趋势分析可切换表格
8. 维度分析 tab 可展示成员公司柱状图
9. 维度筛选可切换资产类型柱状图
10. 成员公司 + 资产类型可展示堆叠柱状图
11. 推荐追问和底部输入框存在
12. 不需要任何真实接口

---

## 开发优先级

优先级从高到低：

1. 页面整体观感
2. 卡片和留白
3. tab / toggle / filter 的交互
4. 图表数据正确展示
5. 表格展示
6. 小图标和微交互

不要把时间花在：

- 后端接口
- 登录
- 复杂路由
- 复杂动画
- 完整权限系统
- 高精度图表库配置

---

## 一句话原则

> 这是一个给业务方看的 LLM 风控助手最小 demo。先把“看起来像真实产品、交互能跑、结构能扩展”做好。
