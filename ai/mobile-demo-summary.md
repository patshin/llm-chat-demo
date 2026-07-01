# Mobile Demo 最终报告

## 完成了什么

- 新增 `/mobile-demo` 移动端优先 demo，用于把当前桌面版企业内部风险管理对话式机器人 demo 重排到 390px 手机宽度。
- 保留桌面版原页面访问，不删除、不重构桌面业务页面。
- 建立移动端设计护栏、数据盘点、数据契约、改版计划和收尾 TODO。
- 生成移动端参考截图，便于后续逐模块验收和继续迭代。
- 已执行 `npm run build`，构建通过。

## 新增/修改了哪些文件

新增或已生成的 AI 文档：

- `ai/mobile-redesign-inventory.json`
- `ai/mobile-data-contract.json`
- `ai/mobile-redesign-plan.md`
- `ai/mobile-design-rules.md`
- `ai/mobile-demo-todo.md`
- `ai/mobile-demo-summary.md`

新增移动端 demo 文件：

- `src/mobile-demo/MobileDemoApp.tsx`
- `src/mobile-demo/mobileData.ts`
- `src/mobile-demo/components/MobileShell.tsx`
- `src/mobile-demo/components/MobileHeader.tsx`
- `src/mobile-demo/components/MobileSummaryCard.tsx`
- `src/mobile-demo/components/MobileMetricCard.tsx`
- `src/mobile-demo/components/MobileSegmentedTabs.tsx`
- `src/mobile-demo/components/MobileDataCard.tsx`
- `src/mobile-demo/components/MobileAccordion.tsx`
- `src/mobile-demo/components/MobileBottomSheet.tsx`
- `src/mobile-demo/components/MobileRiskBadge.tsx`
- `src/mobile-demo/components/MobileStickyInput.tsx`
- `src/mobile-demo/components/index.ts`
- `src/mobile-demo/mobileTokens.css`
- `src/mobile-demo/index.ts`

修改文件：

- `src/App.tsx`：增加 `/mobile-demo` 路由入口判断，桌面默认页面保持可访问。
- `src/mobile-demo/components/MobileSegmentedTabs.tsx`：补充 tab 状态标记，便于移动端验收。
- `src/mobile-demo/mobileTokens.css`：补充移动端样式令牌和组件基础样式。
- `src/mobile-demo/index.ts`：导出移动端 demo 入口。

生成截图：

- `screenshots/mobile-demo/00_home.png`
- `screenshots/mobile-demo/01_group_concentration.png`
- `screenshots/mobile-demo/02_counterparty_holding.png`
- `screenshots/mobile-demo/03_namelist.png`
- `screenshots/mobile-demo/04_rating.png`
- `screenshots/mobile-demo/05_warning.png`
- `screenshots/mobile-demo/06_large_customer.png`
- `screenshots/mobile-demo/07_single_large_holding.png`
- `screenshots/mobile-demo/08_single_large_warning.png`
- `screenshots/mobile-demo/09_single_large_rating.png`
- `screenshots/mobile-demo/10_single_large_sentiment.png`
- `screenshots/mobile-demo/11_single_large_namelist.png`

## 如何本地运行

```bash
npm install
npm run dev -- --host 127.0.0.1
```

如仅检查生产构建：

```bash
npm run build
```

## 如何访问 Mobile Demo

- 开发服务启动后访问：`http://127.0.0.1:5173/mobile-demo`
- Hash 路由也可访问：`http://127.0.0.1:5173/#/mobile-demo`
- 桌面版原页面：`http://127.0.0.1:5173/`

## 哪些模块已覆盖

- 集团集中度分析
- 交易对手持仓分析
- 黑灰白名单查询
- 评级查询
- 预警出险查询
- 大户查询-整体大户情况
- 单一大户查询

## 哪些交互已实现

- 移动端首页模块入口卡片列表。
- 模块页顶部返回。
- AI 摘要卡、核心指标卡、主分析区、明细折叠区。
- segmented tabs 切换趋势、维度、明细视图。
- accordion 展开明细。
- bottom sheet 查看更完整字段。
- sticky bottom AI 输入框展示。
- 单一大户查询保留并互斥展示 5 个 tab：持仓规模、出险预警、评级、舆情、黑灰名单。

## 数据一致性如何保证

- 移动端数据优先从 `src/mockData.ts` 的现有 mock 数据读取。
- 对仍写在桌面组件内、尚未集中导出的 mock 常量，在 `src/mobile-demo/mobileData.ts` 中按桌面值逐项镜像，不新增业务数字。
- `ai/mobile-data-contract.json` 作为金额、比例、日期、评级、数量等字段的核对契约。
- 移动端只做重排和字段隐藏，不修改 mock 原始值。
- 找不到来源的数据按规则显示“暂无数据”，不编造新值。

## 已知问题

- 未发现阻塞 build 的问题。
- 已完成 390px 宽度下的浏览器验收，但仍建议在真实手机或更多系统浏览器中做一次人工视觉复核。
- 部分桌面 mock 仍散落在 `src/App.tsx` 内，移动端当前按原值镜像；后续若重构数据层，建议先集中导出 mock 再复用。

## 我应该优先检查什么

- `/mobile-demo` 首页 7 个模块入口是否都符合业务预期。
- 单一大户查询 5 个 tab 是否内容互斥，尤其是舆情 tab 是否为高风险/中风险信息流。
- 集团集中度、交易对手持仓、预警出险等关键金额和比例是否与 `ai/mobile-data-contract.json` 一致。
- 移动端是否没有横向滚动、没有把桌面表格硬塞进手机。
- 桌面版原页面是否仍可正常打开和演示。
