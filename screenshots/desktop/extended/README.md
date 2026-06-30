# Extended Desktop Screenshot Notes

本目录用于补齐第一轮 17 张截图之外的可达界面状态，作为移动端改版的信息架构和交互参考。截图只代表桌面布局状态；业务数据以后续 `ai/mobile-data-contract.json` 为准。

## 新增截图范围

- `18_group_overview_general.png`: 集团集中度分析 - 一般企业集团榜单。
- `19_group_overview_financial.png`: 集团集中度分析 - 金融机构集团榜单。
- `20_group_vanke_trend_focus.png`: 集团集中度分析 - 万科趋势分析视口。
- `21_group_vanke_dimension_focus.png`: 集团集中度分析 - 万科维度分析视口。
- `22_counterparty_trend_table.png`: 交易对手持仓分析 - 趋势表格。
- `23_counterparty_dimension_member_chart.png`: 交易对手持仓分析 - 维度分析成员公司图表。
- `24_counterparty_dimension_stacked_chart.png`: 交易对手持仓分析 - 成员公司 + 资产类型堆叠图。
- `25_counterparty_dimension_table.png`: 交易对手持仓分析 - 维度分析表格。
- `26_namelist_detail_all_open.png`: 黑灰白名单查询 - 三类名单全部展开。
- `27_namelist_entity_hit_result_focus.png`: 黑灰白名单查询 - 单一法人命中结果视口。
- `28_rating_external.png`: 评级查询 - 外部评级。
- `29_rating_external_meaning_popover.png`: 评级查询 - 评级含义弹层。
- `30_rating_external_all_agencies_expanded.png`: 评级查询 - 外部评级机构全部展开。
- `31_warning_vanke_drilldown_default_focus.png`: 预警出险查询 - 万科风险穿透默认展开视口。
- `32_warning_vanke_drilldown_all_open.png`: 预警出险查询 - 万科风险穿透尽量全展开。
- `33_single_holding_asset_chart.png`: 单一大户查询 - 持仓规模资产类型图表。
- `34_single_holding_company_table_expanded.png`: 单一大户查询 - 成员公司持仓表格展开。
- `35_single_holding_asset_table_expanded.png`: 单一大户查询 - 资产类型持仓表格展开。
- `36_single_warning_member_chart.png`: 单一大户查询 - 出险预警成员公司视图。
- `37_single_warning_table_default.png`: 单一大户查询 - 出险预警表格默认展开。
- `38_single_warning_table_all_open.png`: 单一大户查询 - 出险预警表格尽量全展开。
- `39_single_rating_external.png`: 单一大户查询 - 评级外部评级。
- `40_single_rating_external_meaning_popover.png`: 单一大户查询 - 评级含义弹层。
- `41_single_sentiment_high_filter.png`: 单一大户查询 - 舆情高风险筛选。
- `42_single_sentiment_medium_filter.png`: 单一大户查询 - 舆情中风险筛选。
- `43_single_sentiment_medium_detail.png`: 单一大户查询 - 中风险舆情详情。
- `44_single_namelist_all_open.png`: 单一大户查询 - 黑灰名单全部展开。
- `45_large_customer_dimension_sorted_mom.png`: 大户查询 - 明细表按较上月排序。
- `46_large_customer_dimension_search_vanke.png`: 大户查询 - 集团名称搜索“万科”。

## 无法完整到达的状态

- 交易对手持仓分析没有“仅资产类型”的可达桌面状态：当前“成员公司”复选框固定且禁用，只能到达“成员公司”或“成员公司 + 资产类型”。因此 `24_counterparty_dimension_stacked_chart.png` 作为资产类型参与维度的参考，不能视作“仅资产类型”截图。

## 备注

- 部分“全展开”截图通过连续打开当前可见折叠项生成，目的是给移动端拆分层级和 bottom sheet 提供参考。
- 大户查询中的企业性质、管理分类和日期控件当前主要是展示型控件；本轮补了已实际生效的集团名称搜索和表格排序状态。
