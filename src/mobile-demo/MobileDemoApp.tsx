import { useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Layers3,
  ListChecks,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Star,
  UserRoundCheck,
} from 'lucide-react';
import {
  MobileAccordion,
  MobileBottomSheet,
  MobileDataCard,
  MobileHeader,
  MobileMetricCard,
  MobileRiskBadge,
  MobileSegmentedTabs,
  MobileShell,
  MobileStickyInput,
  MobileSummaryCard,
  type MobileRiskBadgeLevel,
} from './components';
import {
  assetTypeHoldingDetails,
  blackListItems,
  counterpartyAssetData,
  counterpartyMemberData,
  counterpartyStackLegend,
  counterpartyStackedData,
  counterpartyTrendData,
  currentWarningSummaryRows,
  entityHitResult,
  externalRatingAgencies,
  externalRatingMeaning,
  financialInstitutionGroups,
  generalEnterpriseGroups,
  greyListItems,
  holdingAssetTypeRows,
  holdingMemberCompanyRows,
  internalAnnualRatingRecords,
  largeCustomerOverview,
  largeCustomerTableData,
  largeCustomerTrendData,
  memberCompanyHoldingDetails,
  nameListStats,
  ratingEntitySummary,
  singleLargeCustomerAssetExposure,
  singleLargeCustomerCompanyExposure,
  singleLargeCustomerSentimentFeed,
  singleLargeCustomerWarningCompanyDistribution,
  singleLargeCustomerWarningMetrics,
  vankeConcentrationTrendRows,
  singleLargeMetrics,
  singleLargeWarningDrilldown,
  vankeMemberCompanyComparisonData,
  vankeRiskDrilldown,
  vankeWarningInsuranceSummary,
  warningInsuranceMemberDistribution,
  warningInsuranceOverview,
  warningInsuranceTrendData,
  whiteListItems,
  type SentimentFeedItem,
  type SentimentRiskLevel,
} from './mobileData';

type ModuleKey =
  | 'group'
  | 'vankeConcentration'
  | 'counterparty'
  | 'namelistOverview'
  | 'namelistHit'
  | 'rating'
  | 'warningOverview'
  | 'warningVankeDrilldown'
  | 'large'
  | 'singleLarge';
type GroupRankingType = 'general' | 'financial';
type VankeConcentrationView = 'trend' | 'dimension';
type CounterpartyView = 'trend' | 'dimension';
type CounterpartyDimensionView = 'member' | 'asset' | 'stacked';
type RatingView = 'internal' | 'external';
type WarningOverviewView = 'trend' | 'dimension';
type LargeCustomerView = 'trend' | 'dimension';
type SingleLargeTab = 'holding' | 'warning' | 'rating' | 'sentiment' | 'namelist';
type SingleHoldingView = 'company' | 'asset';
type SingleWarningView = 'summary' | 'member' | 'drilldown';
type SheetState = { title: string; content: ReactNode } | null;

type Metric = {
  label: string;
  value?: string;
  unit?: string;
  assist?: string;
  badge?: string;
  badgeLevel?: MobileRiskBadgeLevel;
};

type BarDatum = {
  label: string;
  value: number;
  assist?: string;
};

const moduleCards: Array<{
  key: ModuleKey;
  title: string;
  subtitle?: string;
  summary: string;
  keyNumber: string;
  keyLabel: string;
  icon: ReactNode;
}> = [
  {
    key: 'group',
    title: '集团整体集中度分析',
    subtitle: '集团集中度分析 / 整体口径',
    summary: '按一般企业集团和金融机构集团展示整体集中度榜单。',
    keyNumber: '2',
    keyLabel: '榜单口径（类）',
    icon: <Layers3 size={18} />,
  },
  {
    key: 'vankeConcentration',
    title: '万科集中度情况',
    subtitle: '集团集中度分析 / 单一集团口径',
    summary: '万科集团 2025-05 已占用额度为 720 亿元，集中度为 81%。',
    keyNumber: '720',
    keyLabel: '2025-05 已占用额度（亿元）',
    icon: <BarChart3 size={18} />,
  },
  {
    key: 'counterparty',
    title: '交易对手持仓分析',
    summary: '当前交易对手持仓总规模为 286.35 亿元，较上月增长 8.21%。',
    keyNumber: '286.35',
    keyLabel: '总持仓规模（亿元）',
    icon: <BarChart3 size={18} />,
  },
  {
    key: 'namelistOverview',
    title: '黑灰白名单整体查询',
    summary: '集团名单库按黑名单、灰名单、白名单*展示整体统计与详情入口。',
    keyNumber: '155',
    keyLabel: '名单库主体总数（个）',
    icon: <ClipboardList size={18} />,
  },
  {
    key: 'namelistHit',
    title: '单一法人名单命中结果',
    summary: '万科服务有限公司当前命中黑名单，展示主体、入库原因和管控策略。',
    keyNumber: '黑名单',
    keyLabel: '命中名单类型',
    icon: <ShieldAlert size={18} />,
  },
  {
    key: 'rating',
    title: '评级查询',
    summary: '深圳华侨城股份有限公司最新内部信评为 3B，最新外部评级为大公国际 AAA。',
    keyNumber: '3B',
    keyLabel: '最新内部信评',
    icon: <Star size={18} />,
  },
  {
    key: 'warningOverview',
    title: '预警出险整体查询',
    summary: '当前预警出险涉及持仓余额 520 亿元，展示趋势和成员公司分布。',
    keyNumber: '520',
    keyLabel: '涉及持仓余额（亿元）',
    icon: <ShieldAlert size={18} />,
  },
  {
    key: 'warningVankeDrilldown',
    title: '万科风险金额穿透',
    summary: '万科企业集团风险金额合计 200 亿元，按风险类型穿透到成员公司和子公司。',
    keyNumber: '200',
    keyLabel: '风险金额合计（亿元）',
    icon: <ListChecks size={18} />,
  },
  {
    key: 'large',
    title: '大户查询-整体大户情况',
    summary: '集团大户客户共 325 家，整体持仓规模 3286.75 亿元。',
    keyNumber: '325',
    keyLabel: '大户客户数量（家）',
    icon: <UserRoundCheck size={18} />,
  },
  {
    key: 'singleLarge',
    title: '单一大户查询',
    summary: '万科企业集团当前为重点管理大户，整体持仓规模 285.53 亿元。',
    keyNumber: '285.53',
    keyLabel: '总持仓规模（亿元）',
    icon: <AlertTriangle size={18} />,
  },
];

function MobileDemoApp() {
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);

  if (!activeModule) {
    return <MobileHome onOpenModule={setActiveModule} />;
  }

  return <MobileModuleScreen moduleKey={activeModule} onBack={() => setActiveModule(null)} />;
}

function MobileHome({ onOpenModule }: { onOpenModule: (moduleKey: ModuleKey) => void }) {
  return (
    <MobileShell
      header={<MobileHeader title="智能风控助手 Mobile Demo" subtitle="桌面版数据重排，不新增业务数字" showBack={false} />}
      stickyInput={<MobileStickyInput disabled placeholder="请输入您的问题，或选择模块查看" />}
      ariaLabel="智能风控助手 Mobile Demo 首页"
    >
      <MobileSummaryCard conclusion="基于当前桌面版企业内部风险管理 demo，按移动端 390px 宽度重排展示。" />
      <section className="mobile-demo-module-list" aria-label="模块入口">
        {moduleCards.map((item) => (
          <button
            className="mobile-demo-module-card"
            key={item.key}
            type="button"
            data-testid={`mobile-module-${item.key}`}
            onClick={() => onOpenModule(item.key)}
          >
            <span className="mobile-demo-module-icon">{item.icon}</span>
            <span className="mobile-demo-module-copy">
              <strong>{item.title}</strong>
              <em>{item.summary}</em>
            </span>
            <span className="mobile-demo-module-number">
              <strong>{item.keyNumber}</strong>
              <em>{item.keyLabel}</em>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </section>
    </MobileShell>
  );
}

function MobileModuleScreen({ moduleKey, onBack }: { moduleKey: ModuleKey; onBack: () => void }) {
  const moduleInfo = moduleCards.find((item) => item.key === moduleKey);
  const [sheet, setSheet] = useState<SheetState>(null);

  return (
    <MobileShell
      header={<MobileHeader title={moduleInfo?.title ?? '暂无数据'} subtitle={moduleInfo?.subtitle ?? '移动端重排版'} onBack={onBack} />}
      stickyInput={<MobileStickyInput disabled placeholder="继续追问当前风险情况" />}
      ariaLabel={`${moduleInfo?.title ?? '移动端模块'}页面`}
    >
      {moduleKey === 'group' && <GroupModule />}
      {moduleKey === 'vankeConcentration' && <VankeConcentrationModule />}
      {moduleKey === 'counterparty' && <CounterpartyModule />}
      {moduleKey === 'namelistOverview' && <NameListOverviewModule />}
      {moduleKey === 'namelistHit' && <NameListHitModule />}
      {moduleKey === 'rating' && <RatingModule onOpenSheet={setSheet} />}
      {moduleKey === 'warningOverview' && <WarningOverviewModule />}
      {moduleKey === 'warningVankeDrilldown' && <WarningVankeDrilldownModule />}
      {moduleKey === 'large' && <LargeCustomerModule />}
      {moduleKey === 'singleLarge' && <SingleLargeCustomerModule onOpenSheet={setSheet} />}
      <MobileBottomSheet open={Boolean(sheet)} title={sheet?.title ?? '详情'} onClose={() => setSheet(null)}>
        {sheet?.content}
      </MobileBottomSheet>
    </MobileShell>
  );
}

function GroupModule() {
  const [rankingType, setRankingType] = useState<GroupRankingType>('general');
  const rankingData = rankingType === 'general' ? generalEnterpriseGroups : financialInstitutionGroups;

  return (
    <>
      <MobileSummaryCard conclusion="当前页面保留集团整体集中度榜单口径，按一般企业集团和金融机构集团分开展示；单一集团明细已拆分到“万科集中度情况”。" />
      <MobileDataCard title="集团限额占用榜单" meta="保留桌面一般企业集团 / 金融机构集团两个视角">
        <MobileSegmentedTabs
          ariaLabel="集团类型"
          activeValue={rankingType}
          items={[
            { value: 'general', label: '一般企业' },
            { value: 'financial', label: '金融机构' },
          ]}
          onChange={setRankingType}
        />
        <RankedLimitList data={rankingData} />
      </MobileDataCard>
    </>
  );
}

function VankeConcentrationModule() {
  const [view, setView] = useState<VankeConcentrationView>('trend');
  const [showMoreTrend, setShowMoreTrend] = useState(false);
  const visibleTrendRows = vankeConcentrationTrendRows.slice(0, 6);
  const trendRowsToRender = showMoreTrend ? vankeConcentrationTrendRows : visibleTrendRows;
  const canExpandTrend = vankeConcentrationTrendRows.length > visibleTrendRows.length;

  return (
    <>
      <section className="mobile-demo-card mobile-demo-summary-card mobile-demo-vanke-summary-card">
        <div className="mobile-demo-card-inner">
          <p className="mobile-demo-eyebrow">AI 摘要</p>
          <p className="mobile-demo-summary-text">
            万科集团当前限额占用率处于正常区间但持续上行，
            <strong>2025-05</strong> 已占用额度为 <strong>720 亿元</strong>，集中度为 <strong>81%</strong>，
            低于 <strong>90%</strong> 阈值。较 <strong>2024-06</strong> 的 <strong>520 亿元</strong>、
            <strong>68%</strong> 明显上升，建议持续关注后续额度占用变化。
          </p>
        </div>
      </section>
      <MobileSegmentedTabs
        ariaLabel="万科集中度情况视图"
        activeValue={view}
        items={[
          { value: 'trend', label: '趋势分析' },
          { value: 'dimension', label: '维度分析' },
        ]}
        onChange={setView}
      />
      {view === 'trend' && (
        <MobileDataCard title="近一年持仓规模与集中度趋势" meta="默认展示近 6 个月，查看更多展示剩余月份">
          <VankeCompactTrendList rows={trendRowsToRender} highlightMonth={vankeConcentrationTrendRows[0]?.month} />
          {canExpandTrend && (
            <button
              className={`mobile-demo-vanke-more-action ${showMoreTrend ? 'is-expanded' : ''}`.trim()}
              type="button"
              aria-expanded={showMoreTrend}
              onClick={() => setShowMoreTrend((current) => !current)}
            >
              {showMoreTrend ? '收起' : '查看更多'}
              <ChevronDown size={16} />
            </button>
          )}
        </MobileDataCard>
      )}
      {view === 'dimension' && (
        <MobileDataCard title="成员公司额度对比" meta="2025-05 与 2024-12 对比">
          <VankeMemberComparisonList rows={vankeMemberCompanyComparisonData} />
        </MobileDataCard>
      )}
    </>
  );
}

function CounterpartyModule() {
  const [view, setView] = useState<CounterpartyView>('trend');
  const [dimension, setDimension] = useState<CounterpartyDimensionView>('member');

  return (
    <>
      <MobileSummaryCard conclusion="当前交易对手持仓总规模为 286.35 亿元，较上月增长 8.21%，整体集中度处于可控范围。" />
      <MetricGrid
        metrics={[
          { label: '总持仓规模', value: '286.35', unit: '亿元', assist: '2025-05' },
          { label: '较上月环比', value: '8.21%', assist: '较上月' },
        ]}
      />
      <MobileSegmentedTabs
        ariaLabel="交易对手持仓视图"
        activeValue={view}
        items={[
          { value: 'trend', label: '趋势分析' },
          { value: 'dimension', label: '维度分析' },
        ]}
        onChange={setView}
      />
      {view === 'trend' && (
        <MobileDataCard title="交易对手持仓规模趋势" meta="近 6 个月，单位：亿元">
          <TrendRows rows={[...counterpartyTrendData].reverse().map((item) => ({ label: item.label, value: item.value, valueSuffix: '亿元' }))} />
        </MobileDataCard>
      )}
      {view === 'dimension' && (
        <MobileDataCard title="交易对手维度分析" meta="不直接缩小桌面表格，明细用卡片承接">
          <MobileSegmentedTabs
            ariaLabel="交易对手维度"
            activeValue={dimension}
            items={[
              { value: 'member', label: '成员公司' },
              { value: 'asset', label: '资产类型' },
              { value: 'stacked', label: '成员+资产' },
            ]}
            onChange={setDimension}
          />
          {dimension === 'member' && <HorizontalBarList data={counterpartyMemberData} unit="亿元" />}
          {dimension === 'asset' && <HorizontalBarList data={counterpartyAssetData} unit="亿元" />}
          {dimension === 'stacked' && <CounterpartyStackedList />}
        </MobileDataCard>
      )}
    </>
  );
}

function NameListOverviewModule() {
  const blackCount = getNameListCount('黑名单');
  const greyCount = getNameListCount('灰名单');
  const whiteCount = getNameListCount('白名单');
  const total = nameListStats.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <MobileSummaryCard conclusion={`当前集团名单客户共 ${total} 个，其中黑名单 ${blackCount} 个、灰名单 ${greyCount} 个、白名单* ${whiteCount} 个。黑名单客户主要集中在违约、负面舆情和经营承压场景；灰名单主要为观察类客户；白名单为当前可正常开展业务但仍需持续监控的客户。`} />
      <MetricGrid
        metrics={[
          { label: '名单客户总量', value: String(total), unit: '个' },
          { label: '黑名单', value: String(blackCount), unit: '个' },
          { label: '灰名单', value: String(greyCount), unit: '个' },
          { label: '白名单*', value: String(whiteCount), unit: '个' },
        ]}
      />
      <MobileDataCard title="名单结构" meta="按当前名单库数量计算">
        <NameListStructureList total={total} />
      </MobileDataCard>
      <MobileDataCard title="名单详情入口" meta="展开后查看企业名称、入库原因、上报公司、入库日期">
        <NameListDetailAccordions />
      </MobileDataCard>
    </>
  );
}

function NameListHitModule() {
  return (
    <>
      <MobileSummaryCard conclusion={`${entityHitResult.name}当前命中${entityHitResult.listType}，所属集团为${entityHitResult.group}，入库原因为${entityHitResult.reason}，入库日期为 ${entityHitResult.date}，上报公司为${entityHitResult.reporter}。建议按黑名单策略执行管控，并持续跟踪后续处置进展。`} />
      <MobileDataCard
        title={entityHitResult.name}
        meta="主体命中结果"
        action={<MobileRiskBadge level="danger">{entityHitResult.listType}</MobileRiskBadge>}
      >
        <KeyValueList
          rows={[
            ['主体名称', entityHitResult.name],
            ['名单类型', entityHitResult.listType],
            ['所属集团', entityHitResult.group],
            ['入库原因', entityHitResult.reason],
            ['入库日期', entityHitResult.date],
            ['上报公司', entityHitResult.reporter],
          ]}
        />
      </MobileDataCard>
      <MobileDataCard title="管控策略" meta="按名单类型固定展示">
        <ControlStrategyList />
      </MobileDataCard>
    </>
  );
}

function RatingModule({ onOpenSheet }: { onOpenSheet: (sheet: SheetState) => void }) {
  const [view, setView] = useState<RatingView>('internal');

  return (
    <>
      <MobileSummaryCard conclusion="深圳华侨城股份有限公司当前内部信评最高为 3B，最低为 3D；最新外部评级为大公国际 AAA。" />
      <MetricGrid
        metrics={[
          { label: '最高内部信评', value: ratingEntitySummary.highestInternalRating, assist: '集团内口径' },
          { label: '最低内部信评', value: ratingEntitySummary.lowestInternalRating, assist: '集团内口径' },
          { label: '最新外部评级', value: ratingEntitySummary.latestExternalRating, assist: ratingEntitySummary.latestExternalAgency },
          { label: '评级日期', value: ratingEntitySummary.updatedAt, assist: '最新披露' },
        ]}
      />
      <MobileSegmentedTabs
        ariaLabel="评级查询视图"
        activeValue={view}
        items={[
          { value: 'internal', label: '内部评级' },
          { value: 'external', label: '外部评级' },
        ]}
        onChange={setView}
      />
      {view === 'internal' && (
        <MobileDataCard title="平安集团各专业公司最新评级值">
          <CompactInternalRatingCards />
        </MobileDataCard>
      )}
      {view === 'external' && (
        <MobileDataCard
          title="外部评级机构"
          action={
            <button
              className="mobile-demo-text-action"
              type="button"
              onClick={() =>
                onOpenSheet({
                  title: externalRatingMeaning.title,
                  content: <p className="mobile-demo-sheet-copy">{externalRatingMeaning.content}</p>,
                })
              }
            >
              评级含义
            </button>
          }
        >
          <ExternalRatingAccordions />
        </MobileDataCard>
      )}
    </>
  );
}

function WarningOverviewModule() {
  const [view, setView] = useState<WarningOverviewView>('trend');
  const latestTrend = warningInsuranceTrendData[warningInsuranceTrendData.length - 1];

  return (
    <>
      <MobileSummaryCard conclusion={`当前预警出险涉及持仓余额 ${warningInsuranceOverview.totalExposure} 亿元，较上月保持平稳。资金主要集中在少数高风险敞口，建议重点关注总规模变化和后续处置进展，持续控制预警出险资金占比。`} />
      <MetricGrid
        metrics={[
          { label: '持仓余额', value: String(warningInsuranceOverview.totalExposure), unit: '亿元' },
          { label: '重大预警金额', value: String(latestTrend?.major ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
          { label: '二级预警金额', value: String(latestTrend?.second ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
          { label: '一级预警金额', value: String(latestTrend?.first ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
          { label: '出险金额', value: String(latestTrend?.defaulted ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
        ]}
      />
      <MobileSegmentedTabs
        ariaLabel="预警出险整体分析视图"
        activeValue={view}
        items={[
          { value: 'trend', label: '趋势分析' },
          { value: 'dimension', label: '维度分析' },
        ]}
        onChange={setView}
      />
      {view === 'trend' && (
        <MobileDataCard title="趋势分析" meta="近 6 个月，单位：亿元" action={<WarningRiskLegend />}>
          <WarningTrendCompactChart rows={[...warningInsuranceTrendData].reverse().map((item) => ({ label: item.month, ...item }))} />
        </MobileDataCard>
      )}
      {view === 'dimension' && (
        <MobileDataCard title="维度分析" meta="成员公司风险分布，单位：亿元">
          <WarningDimensionRiskList
            rows={warningInsuranceMemberDistribution.map((item) => ({ label: item.member, ...item }))}
            overallTotal={warningInsuranceOverview.totalExposure}
          />
        </MobileDataCard>
      )}
    </>
  );
}

function WarningVankeDrilldownModule() {
  return (
    <>
      <MobileSummaryCard conclusion={`${vankeWarningInsuranceSummary.groupName}当前风险金额合计 ${vankeWarningInsuranceSummary.exposure} 亿元，其中重大预警金额 ${vankeWarningInsuranceSummary.majorWarningAmount} 亿元、二级预警金额 ${vankeWarningInsuranceSummary.secondLevelWarningAmount} 亿元、一级预警金额 ${vankeWarningInsuranceSummary.firstLevelWarningAmount} 亿元、出险金额 ${vankeWarningInsuranceSummary.defaultAmount} 亿元。风险主要集中在寿险、银行和信托等成员公司，建议优先查看出险金额和重大预警金额明细。`} />
      <MetricGrid
        metrics={[
          { label: '风险金额合计', value: String(vankeWarningInsuranceSummary.exposure), unit: '亿元' },
          { label: '重大预警金额', value: String(vankeWarningInsuranceSummary.majorWarningAmount), unit: '亿元' },
          { label: '二级预警金额', value: String(vankeWarningInsuranceSummary.secondLevelWarningAmount), unit: '亿元' },
          { label: '一级预警金额', value: String(vankeWarningInsuranceSummary.firstLevelWarningAmount), unit: '亿元' },
          { label: '出险金额', value: String(vankeWarningInsuranceSummary.defaultAmount), unit: '亿元' },
        ]}
      />
      <MobileDataCard title="风险类型穿透" meta="展开风险类型后继续展开成员公司">
        <VankeRiskDrilldownAccordion />
      </MobileDataCard>
    </>
  );
}

function LargeCustomerModule() {
  const [view, setView] = useState<LargeCustomerView>('trend');

  return (
    <>
      <MobileSummaryCard conclusion="截至 2025-06-30，集团大户客户共 325 家，整体持仓规模 3286.75 亿元。" />
      <MetricScroller
        metrics={[
          { label: '大户客户', value: String(largeCustomerOverview.totalCustomers), unit: '家' },
          { label: '整体持仓规模', value: String(largeCustomerOverview.totalExposure), unit: '亿元' },
          { label: '较上月增加', value: String(largeCustomerOverview.momExposureChange), unit: '亿元' },
          { label: '重点管理大户', value: String(largeCustomerOverview.keyManagementCustomers), unit: '家' },
        ]}
      />
      <MobileSegmentedTabs
        ariaLabel="整体大户情况视图"
        activeValue={view}
        items={[
          { value: 'trend', label: '趋势分析' },
          { value: 'dimension', label: '维度分析' },
        ]}
        onChange={setView}
      />
      {view === 'trend' && (
        <MobileDataCard title="大户数量及持仓规模趋势" meta="月份、客户数、持仓规模均来自 largeCustomerTrendData">
          <TrendRows
            rows={largeCustomerTrendData.map((item) => ({
              label: item.month,
              value: item.totalExposure,
              valueSuffix: '亿元',
              assist: `${item.customerCount} 家`,
            }))}
          />
        </MobileDataCard>
      )}
      {view === 'dimension' && (
        <MobileDataCard title="大户客户明细" meta="卡片化展示桌面表格字段">
          <LargeCustomerCards />
        </MobileDataCard>
      )}
    </>
  );
}

function SingleLargeCustomerModule({ onOpenSheet }: { onOpenSheet: (sheet: SheetState) => void }) {
  const [tab, setTab] = useState<SingleLargeTab>('holding');

  return (
    <>
      <MobileSummaryCard conclusion="万科企业集团当前为重点管理大户，整体持仓规模为 285.53 亿元，并命中黑名单及灰名单记录。" />
      <MetricScroller
        metrics={singleLargeMetrics.slice(0, 4).map((item) => ({
          label: item.title,
          value: item.value,
          unit: item.unit,
          assist: [item.change, item.subChange].filter(Boolean).join(' / '),
        }))}
      />
      <MobileSegmentedTabs
        ariaLabel="单一大户查询 tab"
        activeValue={tab}
        items={[
          { value: 'holding', label: '持仓规模' },
          { value: 'warning', label: '出险预警' },
          { value: 'rating', label: '评级' },
          { value: 'sentiment', label: '舆情' },
          { value: 'namelist', label: '黑灰名单' },
        ]}
        onChange={setTab}
      />
      {tab === 'holding' && <SingleHoldingPanel />}
      {tab === 'warning' && <SingleWarningPanel />}
      {tab === 'rating' && <SingleRatingPanel onOpenSheet={onOpenSheet} />}
      {tab === 'sentiment' && <SingleSentimentPanel onOpenSheet={onOpenSheet} />}
      {tab === 'namelist' && (
        <MobileDataCard title="黑灰名单详情" meta="当前桌面单一大户 tab 复用全局 NameListDetails 数据">
          <NameListAccordions />
        </MobileDataCard>
      )}
    </>
  );
}

function SingleHoldingPanel() {
  const [view, setView] = useState<SingleHoldingView>('company');
  const rows = view === 'company' ? holdingMemberCompanyRows : holdingAssetTypeRows;

  return (
    <MobileDataCard title={view === 'company' ? '成员公司分布' : '资产类型分布'} meta="单位：亿元；明细通过折叠查看">
      <MobileSegmentedTabs
        ariaLabel="持仓规模维度"
        activeValue={view}
        items={[
          { value: 'company', label: '成员公司' },
          { value: 'asset', label: '资产类型' },
        ]}
        onChange={setView}
      />
      <HorizontalBarList
        data={(view === 'company' ? singleLargeCustomerCompanyExposure : singleLargeCustomerAssetExposure).map((item) => ({
          label: item.name,
          value: item.value,
        }))}
        unit="亿元"
      />
      <MobileAccordion
        items={rows.map((item) => ({
          id: item.name,
          title: `${item.name} ${item.amount} 亿元 / ${item.ratio}`,
          children: <HoldingDetails dimension={view} name={item.name} />,
        }))}
      />
    </MobileDataCard>
  );
}

function SingleWarningPanel() {
  const [view, setView] = useState<SingleWarningView>('summary');

  return (
    <MobileDataCard title="单一大户出险预警" meta="五类数据互斥展示在当前 tab 内">
      <MobileSegmentedTabs
        ariaLabel="单一大户预警视图"
        activeValue={view}
        items={[
          { value: 'summary', label: '汇总' },
          { value: 'member', label: '成员公司' },
          { value: 'drilldown', label: '穿透' },
        ]}
        onChange={setView}
      />
      {view === 'summary' && (
        <>
          <MetricMiniGrid
            metrics={currentWarningSummaryRows.map((item) => ({
              label: item.label,
              value: String(singleLargeCustomerWarningMetrics[item.valueKey]),
              unit: '亿元',
            }))}
          />
          <RiskAmountRows rows={[{ label: '万科企业集团', ...singleLargeCustomerWarningMetrics }]} />
        </>
      )}
      {view === 'member' && (
        <RiskAmountRows rows={singleLargeCustomerWarningCompanyDistribution.map((item) => ({ label: item.company, ...item }))} />
      )}
      {view === 'drilldown' && <SingleWarningDrilldownAccordion />}
    </MobileDataCard>
  );
}

function SingleRatingPanel({ onOpenSheet }: { onOpenSheet: (sheet: SheetState) => void }) {
  const [view, setView] = useState<RatingView>('internal');

  return (
    <MobileDataCard
      title="评级"
      meta="桌面单一大户评级 tab 复用评级查询数据"
      action={
        view === 'external' ? (
          <button
            className="mobile-demo-text-action"
            type="button"
            onClick={() => onOpenSheet({ title: externalRatingMeaning.title, content: <p className="mobile-demo-sheet-copy">{externalRatingMeaning.content}</p> })}
          >
            评级含义
          </button>
        ) : null
      }
    >
      <MobileSegmentedTabs
        ariaLabel="单一大户评级视图"
        activeValue={view}
        items={[
          { value: 'internal', label: '内部评级' },
          { value: 'external', label: '外部评级' },
        ]}
        onChange={setView}
      />
      {view === 'internal' ? <InternalRatingCards /> : <ExternalRatingAccordions />}
    </MobileDataCard>
  );
}

function SingleSentimentPanel({ onOpenSheet }: { onOpenSheet: (sheet: SheetState) => void }) {
  const [level, setLevel] = useState<SentimentRiskLevel>('high');
  const items = singleLargeCustomerSentimentFeed[level];

  return (
    <MobileDataCard title="舆情信息流" meta="仅展示高风险 / 中风险信息流，不恢复正负中性趋势图">
      <MetricMiniGrid
        metrics={[
          { label: '近一个月舆情', value: '18', unit: '条' },
          { label: '高风险舆情', value: '5', unit: '条' },
          { label: '中风险舆情', value: '13', unit: '条' },
        ]}
      />
      <MobileSegmentedTabs
        ariaLabel="舆情风险等级"
        activeValue={level}
        items={[
          { value: 'high', label: '高风险' },
          { value: 'medium', label: '中风险' },
        ]}
        onChange={setLevel}
      />
      <div className="mobile-demo-feed-list">
        {items.map((item) => (
          <button
            className="mobile-demo-feed-card"
            key={item.title}
            type="button"
            onClick={() =>
              onOpenSheet({
                title: '舆情详情',
                content: <SentimentDetail item={item} />,
              })
            }
          >
            <span className={`mobile-demo-feed-level level-${item.level}`}>{item.level === 'high' ? '高风险' : '中风险'}</span>
            <strong>{item.title}</strong>
            <span>{item.customer} / {item.date}</span>
            <em>{item.summary}</em>
          </button>
        ))}
      </div>
    </MobileDataCard>
  );
}

function MetricScroller({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="mobile-demo-metric-row" aria-label="核心指标">
      {metrics.slice(0, 4).map((metric) => (
        <MobileMetricCard key={metric.label} {...metric} />
      ))}
    </section>
  );
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="mobile-demo-metric-grid" aria-label="核心指标">
      {metrics.map((metric) => (
        <MobileMetricCard key={metric.label} {...metric} className="mobile-demo-compact-metric" />
      ))}
    </section>
  );
}

function MetricMiniGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mobile-demo-mini-metrics">
      {metrics.slice(0, 4).map((metric) => (
        <MobileMetricCard key={metric.label} {...metric} className="mobile-demo-mini-metric" />
      ))}
    </div>
  );
}

function RankedLimitList({ data }: { data: Array<{ name: string; limit: number; limitUsage: number }> }) {
  return (
    <div className="mobile-demo-list-stack">
      {data.map((item, index) => (
        <div className="mobile-demo-rank-row" key={item.name}>
          <span className="mobile-demo-rank-index">{index + 1}</span>
          <div>
            <strong>{item.name}</strong>
            <em>限额占用 {item.limit} 亿元</em>
          </div>
          <MobileRiskBadge level={limitBadgeLevel(item.limitUsage)}>{`${item.limitUsage}%`}</MobileRiskBadge>
        </div>
      ))}
    </div>
  );
}

function VankeCompactTrendList({
  rows,
  highlightMonth,
}: {
  rows: typeof vankeConcentrationTrendRows;
  highlightMonth?: string;
}) {
  return (
    <div className="mobile-demo-vanke-trend-list">
      {rows.map((item) => {
        const width = Math.min((item.concentration / item.threshold) * 100, 100);

        return (
          <article className={`mobile-demo-vanke-trend-row ${item.month === highlightMonth ? 'is-current' : ''}`.trim()} key={item.month}>
            <div className="mobile-demo-vanke-trend-head">
              <strong>{item.month}</strong>
              <strong>{item.exposure} 亿元</strong>
            </div>
            <div className="mobile-demo-vanke-progress-line">
              <i>
                <b style={{ width: `${width}%` }} />
              </i>
              <em>{item.concentration}%</em>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function VankeMemberComparisonList({ rows }: { rows: typeof vankeMemberCompanyComparisonData }) {
  const max = 260;

  return (
    <div className="mobile-demo-vanke-comparison-list">
      {rows.map((item) => {
        const change = item.current - item.previous;
        const previousWidth = Math.max((item.previous / max) * 100, item.previous ? 3 : 0);
        const currentWidth = Math.max((item.current / max) * 100, item.current ? 3 : 0);

        return (
          <article className="mobile-demo-vanke-compare-card" key={item.name}>
            <div className="mobile-demo-vanke-compare-head">
              <strong>{item.name}</strong>
              <span>变化：+{change} 亿元</span>
            </div>
            <div className="mobile-demo-vanke-compare-bar is-previous">
              <span>2024-12</span>
              <strong>{item.previous} 亿元</strong>
              <i><b style={{ width: `${previousWidth}%` }} /></i>
            </div>
            <div className="mobile-demo-vanke-compare-bar is-current">
              <span>2025-05</span>
              <strong>{item.current} 亿元</strong>
              <i><b style={{ width: `${currentWidth}%` }} /></i>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function TrendRows({ rows }: { rows: Array<{ label: string; value: string | number; valueSuffix?: string; assist?: string }> }) {
  const max = Math.max(...rows.map((item) => Number(item.value) || 0), 1);

  return (
    <div className="mobile-demo-trend-rows">
      {rows.map((item) => {
        const width = Math.max(((Number(item.value) || 0) / max) * 100, Number(item.value) ? 3 : 0);

        return (
          <div className="mobile-demo-trend-row" key={item.label}>
            <div className="mobile-demo-row-head">
              <span>{item.label}</span>
              <strong>{item.value}{item.valueSuffix ? ` ${item.valueSuffix}` : ''}</strong>
            </div>
            <div className="mobile-demo-progress-track">
              <i style={{ width: `${width}%` }} />
            </div>
            {item.assist ? <p>{item.assist}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function HorizontalBarList({ data, unit }: { data: Array<BarDatum>; unit?: string }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="mobile-demo-bar-list">
      {data.map((item) => (
        <div className="mobile-demo-bar-row" key={item.label}>
          <div className="mobile-demo-row-head">
            <span>{item.label}</span>
            <strong>{item.value}{unit ? ` ${unit}` : ''}</strong>
          </div>
          <div className="mobile-demo-progress-track">
            <i style={{ width: `${Math.max((item.value / max) * 100, item.value ? 3 : 0)}%` }} />
          </div>
          {item.assist ? <p>{item.assist}</p> : null}
        </div>
      ))}
    </div>
  );
}

function ComparisonBars({ rows }: { rows: Array<{ label: string; previous: number; current: number }> }) {
  const max = Math.max(...rows.flatMap((item) => [item.previous, item.current]), 1);

  return (
    <div className="mobile-demo-comparison-list">
      {rows.map((item) => (
        <div className="mobile-demo-comparison-row" key={item.label}>
          <strong>{item.label}</strong>
          <div>
            <span>2024-12 {item.previous} 亿元</span>
            <i><b style={{ width: `${Math.max((item.previous / max) * 100, item.previous ? 3 : 0)}%` }} /></i>
          </div>
          <div>
            <span>2025-05 {item.current} 亿元</span>
            <i><b style={{ width: `${Math.max((item.current / max) * 100, item.current ? 3 : 0)}%` }} /></i>
          </div>
        </div>
      ))}
    </div>
  );
}

function CounterpartyStackedList() {
  return (
    <div className="mobile-demo-list-stack">
      {counterpartyStackedData.map((item) => (
        <section className="mobile-demo-stacked-card" key={item.label}>
          <div className="mobile-demo-row-head">
            <strong>{item.label}</strong>
            <span>{item.total} 亿元</span>
          </div>
          <div className="mobile-demo-stack-values">
            {item.values.map((value, index) => (
              <span key={`${item.label}-${counterpartyStackLegend[index]}`}>
                {counterpartyStackLegend[index]} {value}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function getNameListCount(typePrefix: '黑名单' | '灰名单' | '白名单') {
  return nameListStats.find((item) => item.type.startsWith(typePrefix))?.count ?? 0;
}

function formatShare(value: number, total: number) {
  if (!total) return '暂无数据';
  return `${((value / total) * 100).toFixed(1)}%`;
}

const nameListStructureDescriptions: Record<string, string> = {
  黑名单: '禁止主动新增业务，存量业务进入清收处置流程',
  灰名单: '暂定主动新增业务，强化存量业务监控并择机退出',
  白名单: '可正常开展业务，持续跟踪风险变化',
};

function NameListStructureList({ total }: { total: number }) {
  const max = Math.max(...nameListStats.map((item) => item.count), 1);

  return (
    <div className="mobile-demo-structure-list">
      {nameListStats.map((item) => {
        const displayType = item.type.replace('*', '');
        const width = Math.max((item.count / max) * 100, item.count ? 3 : 0);

        return (
          <article className={`mobile-demo-structure-card is-${nameListTone(displayType)}`} key={item.type}>
            <div className="mobile-demo-structure-head">
              <strong>{item.type}</strong>
              <span>{item.count} 个 / {formatShare(item.count, total)}</span>
            </div>
            <div className="mobile-demo-progress-track">
              <i style={{ width: `${width}%` }} />
            </div>
            <p>{nameListStructureDescriptions[displayType] ?? '暂无数据'}</p>
          </article>
        );
      })}
    </div>
  );
}

function NameListDetailAccordions() {
  const groups = [
    { id: 'black-detail', title: '黑名单详情', records: blackListItems, level: 'danger' as const },
    { id: 'grey-detail', title: '灰名单详情', records: greyListItems, level: 'warning' as const },
    { id: 'white-detail', title: '白名单详情', records: whiteListItems, level: 'normal' as const },
  ];

  return (
    <MobileAccordion
      items={groups.map((group) => ({
        id: group.id,
        title: group.title,
        children: (
          <div className="mobile-demo-record-list">
            {group.records.map((record) => (
              <article className="mobile-demo-record-card mobile-demo-compact-record" key={`${record.name}-${record.date}`}>
                <div className="mobile-demo-row-head">
                  <strong>{record.name}</strong>
                  <MobileRiskBadge level={group.level}>{record.reporter}</MobileRiskBadge>
                </div>
                <KeyValueList
                  rows={[
                    ['企业名称', record.name],
                    ['入库原因', record.reason],
                    ['上报公司', record.reporter],
                    ['入库日期', record.date],
                  ]}
                />
              </article>
            ))}
          </div>
        ),
      }))}
    />
  );
}

function ControlStrategyList() {
  const rows: Array<{ label: string; content: string; level: MobileRiskBadgeLevel }> = [
    { label: '黑名单', content: '禁止主动新增业务，存量业务进入清收处置流程', level: 'danger' },
    { label: '灰名单', content: '暂定主动新增业务，强化存量业务监控并择机退出', level: 'warning' },
    { label: '白名单', content: '可正常开展业务，持续监控名单状态变化', level: 'normal' },
  ];

  return (
    <div className="mobile-demo-strategy-list">
      {rows.map((row) => (
        <article className="mobile-demo-strategy-row" key={row.label}>
          <MobileRiskBadge level={row.level}>{row.label}</MobileRiskBadge>
          <p>{row.content}</p>
        </article>
      ))}
    </div>
  );
}

function NameListAccordions() {
  const groups = [
    { id: 'black', title: '黑名单 55 个', records: blackListItems, level: 'danger' as const },
    { id: 'grey', title: '灰名单 70 个', records: greyListItems, level: 'warning' as const },
    { id: 'white', title: '白名单* 30 个', records: whiteListItems, level: 'normal' as const },
  ];

  return (
    <MobileAccordion
      items={groups.map((group) => ({
        id: group.id,
        title: group.title,
        children: (
          <div className="mobile-demo-record-list">
            {group.records.map((record) => (
              <article className="mobile-demo-record-card" key={`${record.name}-${record.date}`}>
                <div className="mobile-demo-row-head">
                  <strong>{record.name}</strong>
                  <MobileRiskBadge level={group.level}>{record.reporter}</MobileRiskBadge>
                </div>
                <p>{record.reason}</p>
                <span>{record.date}</span>
              </article>
            ))}
          </div>
        ),
      }))}
    />
  );
}

function InternalRatingCards() {
  return (
    <div className="mobile-demo-record-list">
      {internalAnnualRatingRecords.map((item) => (
        <article className="mobile-demo-record-card" key={item.company}>
          <strong>{item.company}</strong>
          <KeyValueList
            rows={[
              ['有效评级', item.rating],
              ['评级年报年份', String(item.reportYear)],
            ]}
          />
        </article>
      ))}
    </div>
  );
}

function CompactInternalRatingCards() {
  return (
    <div className="mobile-demo-rating-company-list">
      {internalAnnualRatingRecords.map((item) => (
        <article className="mobile-demo-rating-company-card" key={item.company}>
          <strong>{item.company}</strong>
          <div>
            <span>
              有效评级
              <b>{item.rating}</b>
            </span>
            <span>
              评级年报年份
              <b>{item.reportYear}</b>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

function ExternalRatingAccordions() {
  return (
    <MobileAccordion
      items={externalRatingAgencies.map((agency) => ({
        id: agency.agency,
        title: `${agency.agency} ${agency.rating} / ${agency.date}`,
        children: (
          <div className="mobile-demo-record-list">
            {agency.history.map((item) => (
              <article className="mobile-demo-history-row" key={`${agency.agency}-${item.date}`}>
                <span>{item.date}</span>
                <strong>{item.rating}</strong>
              </article>
            ))}
          </div>
        ),
      }))}
    />
  );
}

const riskOrder = [
  { key: 'defaulted', label: '出险' },
  { key: 'first', label: '一级预警' },
  { key: 'second', label: '二级预警' },
  { key: 'major', label: '重大预警' },
] as const;

const riskStructureOrder = [
  { key: 'defaulted', label: '出险' },
  { key: 'major', label: '重大预警' },
  { key: 'second', label: '二级预警' },
  { key: 'first', label: '一级预警' },
] as const;

type RiskStructureRow = {
  label: string;
  major: number;
  second: number;
  first: number;
  defaulted: number;
  total: number;
};

function RiskStructureRows({ rows }: { rows: RiskStructureRow[] }) {
  return (
    <div className="mobile-demo-risk-structure-list">
      {rows.map((row) => (
        <section className="mobile-demo-risk-structure-card" key={row.label}>
          <div className="mobile-demo-row-head">
            <strong>{row.label}</strong>
            <span>{row.total} 亿元</span>
          </div>
          <RiskStackBar row={row} />
          <div className="mobile-demo-risk-breakdown">
            {riskStructureOrder.map((risk) => (
              <span className={`risk-${risk.key}`} key={`${row.label}-${risk.key}`}>
                {risk.label} {formatShare(row[risk.key], row.total)}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function RiskStackBar({ row }: { row: RiskStructureRow }) {
  return (
    <div className="mobile-demo-risk-stack-bar" aria-label={`${row.label}风险结构`}>
      {riskStructureOrder.map((risk) => {
        const width = row.total ? (row[risk.key] / row.total) * 100 : 0;

        return (
          <i
            className={`risk-${risk.key}`}
            key={`${row.label}-bar-${risk.key}`}
            style={{ width: `${Math.max(width, row[risk.key] ? 3 : 0)}%` }}
            title={`${risk.label} ${row[risk.key]} 亿元`}
          />
        );
      })}
    </div>
  );
}

function WarningRiskLegend() {
  return (
    <div className="mobile-demo-warning-risk-legend" aria-label="风险类型图例">
      {riskStructureOrder.map((risk) => (
        <span key={`warning-legend-${risk.key}`}>
          <i className={`risk-${risk.key}`} />
          {risk.label}
        </span>
      ))}
    </div>
  );
}

function WarningTrendCompactChart({ rows }: { rows: RiskStructureRow[] }) {
  const maxTotal = Math.max(...rows.map((row) => row.total), 0);

  return (
    <div className="mobile-demo-warning-trend-chart">
      {rows.map((row) => (
        <section className="mobile-demo-warning-trend-row" key={row.label}>
          <span className="mobile-demo-warning-trend-month">{row.label}</span>
          <WarningRiskStackBar row={row} scale={maxTotal ? (row.total / maxTotal) * 100 : 0} />
          <strong className="mobile-demo-warning-trend-total">{formatRiskNumber(row.total)} 亿元</strong>
        </section>
      ))}
    </div>
  );
}

function WarningDimensionRiskList({ rows, overallTotal }: { rows: RiskStructureRow[]; overallTotal: number }) {
  return (
    <div className="mobile-demo-warning-dimension-list">
      {rows.map((row) => (
        <section className="mobile-demo-warning-dimension-card" key={row.label}>
          <div className="mobile-demo-row-head">
            <strong>{row.label}</strong>
            <span className="mobile-demo-warning-member-total">
              <strong>{formatRiskNumber(row.total)} 亿元</strong>
              <em>· {formatShare(row.total, overallTotal)}</em>
            </span>
          </div>
          <WarningRiskStackBar row={row} />
          <div className="mobile-demo-warning-amount-grid">
            {riskStructureOrder.map((risk) => (
              <span className={`risk-${risk.key}`} key={`${row.label}-${risk.key}`}>
                {risk.label} <strong>{formatRiskNumber(row[risk.key])} 亿</strong>
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function WarningRiskStackBar({ row, scale = 100 }: { row: RiskStructureRow; scale?: number }) {
  const scaleWidth = row.total ? Math.max(scale, 12) : 0;

  return (
    <div className="mobile-demo-warning-stack-track" aria-label={`${row.label}风险结构`}>
      <div className="mobile-demo-warning-stack-fill" style={{ width: `${scaleWidth}%` }}>
        {riskStructureOrder.map((risk) => {
          const width = row.total ? (row[risk.key] / row.total) * 100 : 0;

          return (
            <i
              className={`risk-${risk.key}`}
              key={`${row.label}-warning-bar-${risk.key}`}
              style={{ width: `${Math.max(width, row[risk.key] ? 3 : 0)}%` }}
              title={`${risk.label} ${formatRiskNumber(row[risk.key])} 亿元`}
            />
          );
        })}
      </div>
    </div>
  );
}

function formatRiskNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function RiskAmountRows({ rows }: { rows: Array<{ label: string; major: number; second: number; first: number; defaulted: number; total: number }> }) {
  return (
    <div className="mobile-demo-risk-list">
      {rows.map((row) => (
        <section className="mobile-demo-risk-row" key={row.label}>
          <div className="mobile-demo-row-head">
            <strong>{row.label}</strong>
            <span>{row.total} 亿元</span>
          </div>
          <div className="mobile-demo-risk-pills">
            {riskOrder.map((risk) => (
              <span className={`risk-${risk.key}`} key={`${row.label}-${risk.key}`}>
                {risk.label} {row[risk.key]}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function VankeRiskDrilldownAccordion() {
  return (
    <div className="mobile-demo-vanke-risk-accordion">
      {vankeRiskDrilldown.map((risk, riskIndex) => (
        <details className="mobile-demo-vanke-risk-item" key={risk.key} open={risk.key === 'defaulted'}>
          <summary>
            <span className={`mobile-demo-risk-dot risk-${risk.key}`} />
            <strong>{risk.label}</strong>
            <em>{risk.amount} 亿元 / {risk.ratio}</em>
          </summary>
          <div className="mobile-demo-vanke-risk-body">
            {risk.members.map((member, memberIndex) => (
              <details
                className="mobile-demo-member-risk-item"
                key={`${risk.key}-${member.name}`}
                open={riskIndex === 0 && memberIndex === 0}
              >
                <summary>
                  <span>{member.name}</span>
                  <strong>{member.amount} 亿元</strong>
                </summary>
                <div className="mobile-demo-subsidiary-list">
                  {member.subsidiaries.map((item) => (
                    <div className="mobile-demo-subsidiary-row" key={`${member.name}-${item.name}`}>
                      <span>{item.name}</span>
                      <strong>{item.amount} 亿元</strong>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function LargeCustomerCards() {
  return (
    <div className="mobile-demo-record-list">
      {largeCustomerTableData.map((item) => (
        <article className="mobile-demo-record-card" key={item.name}>
          <div className="mobile-demo-row-head">
            <strong>{item.name}</strong>
            <MobileRiskBadge level={customerCategoryLevel(item.managementCategory)}>{item.managementCategory}</MobileRiskBadge>
          </div>
          <KeyValueList
            rows={[
              ['企业性质', item.ownership],
              ['持仓规模', `${item.exposure} 亿元`],
              ['较上月', signedAmount(item.momChange)],
              ['较年初', signedAmount(item.ytdChange)],
            ]}
          />
        </article>
      ))}
    </div>
  );
}

function HoldingDetails({ dimension, name }: { dimension: SingleHoldingView; name: string }) {
  const details =
    dimension === 'company'
      ? memberCompanyHoldingDetails[name as keyof typeof memberCompanyHoldingDetails] ?? []
      : assetTypeHoldingDetails[name as keyof typeof assetTypeHoldingDetails] ?? [];

  if (!details.length) {
    return <p className="mobile-demo-empty">暂无数据</p>;
  }

  return (
    <div className="mobile-demo-record-list">
      {details.map((item) => (
        <article className="mobile-demo-record-card" key={`${item.legalEntity}-${item.productName}`}>
          <strong>{item.legalEntity}</strong>
          <KeyValueList
            rows={[
              ['专业公司', item.memberCompany],
              ['资产类型', 'assetType' in item && typeof item.assetType === 'string' ? item.assetType : name],
              ['证券/产品名称', item.productName],
              ['起息日', item.startDate],
              ['到期日', item.endDate],
              ['持仓规模', `${item.amount} 亿元`],
            ]}
          />
        </article>
      ))}
    </div>
  );
}

function SingleWarningDrilldownAccordion() {
  return (
    <MobileAccordion
      items={singleLargeWarningDrilldown.map((risk) => ({
        id: risk.key,
        title: `${risk.label} ${risk.amount} 亿元`,
        children: (
          <div className="mobile-demo-record-list">
            {risk.members.map((member) => (
              <article className="mobile-demo-record-card" key={`${risk.key}-${member.name}`}>
                <div className="mobile-demo-row-head">
                  <strong>{member.name}</strong>
                  <span>{member.amount} 亿元</span>
                </div>
                {member.subsidiaries.map((item) => (
                  <p key={`${member.name}-${item.name}`}>{item.name}：{item.amount} 亿元</p>
                ))}
              </article>
            ))}
          </div>
        ),
      }))}
    />
  );
}

function SentimentDetail({ item }: { item: SentimentFeedItem }) {
  return (
    <div className="mobile-demo-sheet-copy">
      <MobileRiskBadge level={item.level === 'high' ? 'danger' : 'warning'}>{item.level === 'high' ? '高风险' : '中风险'}</MobileRiskBadge>
      <KeyValueList rows={[['客户名称', item.customer], ['更新日期', item.date]]} />
      <p>{item.body}</p>
    </div>
  );
}

function KeyValueList({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="mobile-demo-kv-list">
      {rows.map(([label, value]) => (
        <div key={`${label}-${value}`}>
          <dt>{label}</dt>
          <dd>{value || '暂无数据'}</dd>
        </div>
      ))}
    </dl>
  );
}

function metricFromDesktop(title: string, value: string, unit: string, change: string, badgeLevel?: MobileRiskBadgeLevel): Metric {
  return {
    label: title,
    value: badgeLevel ? undefined : value,
    unit,
    assist: change,
    badge: badgeLevel ? value : undefined,
    badgeLevel,
  };
}

function limitBadgeLevel(limitUsage: number): MobileRiskBadgeLevel {
  if (limitUsage > 100) return 'danger';
  if (limitUsage > 90) return 'warning';
  return 'normal';
}

function customerCategoryLevel(category: string): MobileRiskBadgeLevel {
  if (category === '出险') return 'danger';
  if (category === '重点管理') return 'warning';
  return 'neutral';
}

function nameListTone(type: string) {
  if (type === '黑名单') return 'black';
  if (type === '灰名单') return 'grey';
  return 'white';
}

function signedAmount(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)} 亿元`;
}

export default MobileDemoApp;
