# 移动端 Demo 盘点与改版计划

## 原则

本计划只服务于后续移动端重新排版，不改变现有桌面 UI，不修改 mock 数据，不新增业务数字。移动端每个数字、日期、评级、名单记录和明细行都必须回到 `ai/mobile-redesign-inventory.json` 与 `ai/mobile-data-contract.json` 中列出的数据源。

当前桌面端主入口为 `src/main.tsx`，主要业务页面集中在 `src/App.tsx`，大部分 mock 数据集中在 `src/mockData.ts`。注意：交易对手持仓和单一大户部分舆情、穿透明细是 `src/App.tsx` 本地常量，不在 `src/mockData.ts` 中。

## 集团集中度分析

建议拆成 4 个移动端页面：

1. 集团集中度榜单页  
   保留一般企业集团、金融机构集团两个 tab，保留各集团名称、限额占用、限额占用率和派生状态。

2. 万科集中度概览页  
   保留已占用额度 650 亿元、限额占用比例 78.6%、统一信评 2C、集中度限额占用预警“预警”。

3. 万科趋势页  
   保留 `vankeTrendData` 的月份、已占用额度、限额占用比例、threshold 字段，以及桌面图中的 90% 阈值线展示。

4. 成员公司对比页  
   保留 `vankeMemberCompanyComparisonData` 的 previous/current 对比。

桌面图表转换建议：

- `HorizontalBarChart` 转为移动端横向条榜单。
- `ComboTrendChart` 转为横向滚动趋势图，或按月份拆成趋势卡。
- `VankeMemberComparisonChart` 转为每个成员公司的双条对比卡。

## 交易对手持仓分析

建议拆成 4 个移动端页面：

1. 持仓概览页  
   保留 286.35 亿元、8.21%、主要成员公司、主要资产类型和“可控范围”结论。

2. 趋势页  
   保留 `counterpartyTrendData` 的 6 个月数据，默认展示图表。

3. 维度分析页  
   保留成员公司、资产类型、成员公司 + 资产类型三种视角。成员公司维度当前固定保留，资产类型可开关。

4. 数据表页  
   保留趋势表和堆叠维度表，移动端可通过“查看表格”进入。

桌面图表转换建议：

- 趋势柱状图转为横向滚动小柱图。
- 成员公司和资产类型柱状图转为横向条。
- 堆叠柱状图转为横向堆叠条。
- 表格转为折叠表或 bottom sheet，不放在首屏。

## 黑灰白名单查询

建议拆成 3 个移动端页面：

1. 名单概览页  
   保留黑名单 55、灰名单 70、白名单* 30，以及总数 155 的口径。

2. 名单详情页  
   保留黑名单、灰名单、白名单* 三个折叠组及所有企业记录。

3. 法人命中结果页  
   保留 `entityHitResult` 的主体名称、名单类型、所属集团、入库原因、入库日期、上报公司和管控策略。

桌面图表转换建议：

- `NameListSummaryChart` 转为三张数量卡或短横条。
- `NameListAccordionTable` 转为折叠卡片列表。
- `EntityRiskDetailTable` 转为 key-value 信息卡，管控策略放入折叠区。

## 评级查询

建议拆成 4 个移动端页面：

1. 评级摘要页  
   保留主体名称、所属集团、行业、最高内部信评、最低内部信评、最新外部评级、评级展望和最近评级日期。

2. 内部评级页  
   保留 `internalAnnualRatingRecords` 的专业公司、有效评级、评级年报年份、生效日。

3. 外部评级页  
   保留 `externalRatingAgencies` 的机构、评级、披露日期、outlook 和历史评级。

4. 评级含义页或 bottom sheet  
   保留 `externalRatingMeaning` 的 title 和 content。

桌面图表转换建议：

- 当前桌面没有评级图表，不需要为移动端新增图表。
- 内部评级表转为成员公司评级卡片。
- 外部评级历史转为折叠列表或 bottom sheet。
- 桌面 popover 转为 bottom sheet。

## 预警出险查询

建议拆成 4 个移动端页面：

1. 预警出险概览页  
   保留整体持仓余额 520 亿元和当前风险结论。

2. 趋势页  
   保留 `warningInsuranceTrendData` 的近 6 个月 major、second、first、defaulted、total。

3. 成员公司分布页  
   保留 `warningInsuranceMemberDistribution` 的成员公司、分项风险金额、total 和占比派生逻辑。

4. 万科风险穿透页  
   保留 `vankeWarningInsuranceSummary` 和 `vankeRiskDrilldown` 的风险类型、成员公司、子公司明细。

桌面图表转换建议：

- `WarningStackedChart` 转为横向滚动堆叠条或月度风险卡。
- `WarningMemberBarChart` 保持横向堆叠条，适合移动端。
- 风险穿透表转为双层折叠列表。
- 子公司明细表转为 bottom sheet 或折叠表。

## 大户查询

建议拆成 4 个移动端页面：

1. 大户概览页  
   保留日期 2025-06-30、325 家、3286.75 亿元、128.63 亿元、512.34 亿元、126 家、1871.36 亿元、56.96%。

2. 趋势页  
   保留 `largeCustomerTrendData` 的 customerCount 和 totalExposure。

3. 大户客户明细页  
   保留 `largeCustomerTableData` 全部行，包含企业名称、企业性质、管理分类、持仓规模、较上月、较年初。

4. 筛选与排序页或 bottom sheet  
   保留集团名称搜索、企业性质、管理分类、日期，以及持仓规模、较上月、较年初排序。

桌面图表转换建议：

- `LargeCustomerTrendChart` 转为简化组合图或月度趋势卡。
- 宽表转为客户卡片列表。
- 筛选控件转为 bottom sheet。
- 当前筛选合计必须继续由筛选后的 rows 计算。

## 单一大户查询

建议拆成 6 个移动端页面：

1. 单一大户概览页  
   保留五个指标卡：285.53 亿元、137.01 亿元、217.82 亿元、黑名单 4 条/灰名单 6 条、7A/2025-06-20。

2. 持仓规模页  
   保留成员公司和资产类型两个维度，保留图表/表格切换。

3. 出险预警页  
   保留 `singleLargeCustomerWarningMetrics` 和 `singleLargeCustomerWarningCompanyDistribution`。

4. 评级页  
   当前桌面复用评级查询的数据源，移动端也应复用同一套数据，不新增单一大户评级数字。

5. 舆情页  
   保留桌面可见摘要 18 条、高风险 5 条、中风险 13 条，以及 `singleLargeCustomerSentimentFeed` 中已渲染的 6 条卡片和详情。

6. 黑灰名单页  
   当前桌面复用全局 `NameListDetails`，移动端也应复用全局名单数据，除非后续明确要求改接单一大户专属名单记录。

桌面图表转换建议：

- `CompanyExposureBars` 已适合移动端，可保留横向条形态。
- 持仓明细表转为折叠表，行详情转为 bottom sheet。
- `CurrentWarningSummaryChart` 转为风险金额卡片 + 进度条。
- `StackedRiskChart` 转为横向堆叠条。
- `SingleLargeWarningDrilldownTable` 转为双层折叠列表。
- 舆情详情抽屉转为全屏详情页或 bottom sheet。

## 不能做的事

- 不要为移动端新增业务数字。
- 不要把当前未渲染的数据源自动替换为已渲染数据源。
- 不要为了适配移动端修改 `src/mockData.ts`。
- 不要为了适配移动端改动现有桌面组件。
- 不要新增真实接口、登录、权限、路由体系或移动端页面实现。
