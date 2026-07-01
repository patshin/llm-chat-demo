import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Filter,
  Layers3,
  ListChecks,
  MessageCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  UserRoundCheck,
} from 'lucide-react';
import {
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
  mobileVankeRiskProjectDetails,
  nameListStats,
  ratingEntitySummary,
  singleLargeCustomerSentimentFeed,
  singleLargeCustomerWarningCompanyDistribution,
  singleLargeCustomerWarningMetrics,
  vankeConcentrationTrendRows,
  singleLargeMetrics,
  singleLargeWarningDrilldown,
  vankeMemberCompanyComparisonData,
  vankeMetrics,
  vankeRiskDrilldown,
  vankeWarningInsuranceSummary,
  warningInsuranceMemberDistribution,
  warningInsuranceOverview,
  warningInsuranceTrendData,
  whiteListItems,
  type SentimentFeedItem,
  type SentimentRiskLevel,
  type MobileVankeRiskProjectDetail,
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
type LargeCustomerSortField = 'exposure' | 'momChange' | 'ytdChange';
type SortDirection = 'asc' | 'desc';
type SingleLargeTab = 'holding' | 'warning' | 'rating' | 'sentiment' | 'namelist';
type SingleHoldingView = 'company' | 'asset';
type SingleHoldingDisplayView = 'distribution' | 'details';
type SingleWarningView = 'summary' | 'member' | 'drilldown';
type SheetState = { title: string; content: ReactNode } | null;
type LargeCustomerFilters = {
  keyword: string;
  ownership: string;
  managementCategory: string;
  date: string;
};
type LargeCustomerSort = {
  field: LargeCustomerSortField;
  direction: SortDirection;
};
type LargeCustomerRow = (typeof largeCustomerTableData)[number];
type LargeCustomerTotal = {
  count: number;
  exposure: number;
  momChange: number;
  ytdChange: number;
};
type HoldingDistributionRow = (typeof holdingMemberCompanyRows)[number] | (typeof holdingAssetTypeRows)[number];
type NameListRecord = (typeof blackListItems)[number];
type NameListGroupId = 'black' | 'grey' | 'white';
type NameListGroupDefinition = {
  id: NameListGroupId;
  title: '黑名单' | '灰名单' | '白名单*';
  items: NameListRecord[];
  level: MobileRiskBadgeLevel;
};
type VankeRiskMember = (typeof vankeRiskDrilldown)[number]['members'][number];
type VankeRiskProjectSheet = {
  riskKey: string;
  riskLabel: string;
  memberName: string;
  amount: number;
  records: MobileVankeRiskProjectDetail[];
};

type Metric = {
  label: string;
  value?: string;
  unit?: string;
  assist?: string;
  assistInline?: boolean;
  badge?: string;
  badgeLevel?: MobileRiskBadgeLevel;
};

type BarDatum = {
  label: string;
  value: number;
  assist?: string;
};

const defaultLargeCustomerFilters: LargeCustomerFilters = {
  keyword: '',
  ownership: '全部',
  managementCategory: '重点管理',
  date: '2025-06-30',
};

const ownershipFilterOptions = ['全部', '央企', '地方国企', '民企', '外企', '外资', '混合', '金融机构'];
const managementCategoryOptions = ['全部', '重点管理', '常态管理', '出险'];
const largeCustomerSortOptions: Array<{ field: LargeCustomerSortField; label: string }> = [
  { field: 'exposure', label: '持仓规模' },
  { field: 'momChange', label: '较上月' },
  { field: 'ytdChange', label: '较年初' },
];
const mainLargeCustomerPreviewCount = 10;
const fullLargeCustomerPageSize = 20;
const nameListPreviewCount = 5;
const nameListSheetPageSize = 20;
const opinionPreviewCount = 5;
const opinionSheetPageSize = 20;
const nameListGroupDefinitions: NameListGroupDefinition[] = [
  { id: 'black', title: '黑名单', items: blackListItems, level: 'danger' },
  { id: 'grey', title: '灰名单', items: greyListItems, level: 'warning' },
  { id: 'white', title: '白名单*', items: whiteListItems, level: 'normal' },
];
const sentimentRiskLabels: Record<SentimentRiskLevel, string> = {
  high: '高风险',
  medium: '中风险',
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
    title: '交易对手持仓分析（万科）',
    summary: '当前万科持仓总规模为 286.35 亿元，较上月增长 8.21%。',
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
    summary: '集团大户客户共 325 家，整体持仓规模 3,286.75 亿元，较上月 +128.63 亿元。',
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
  const [showMoreRanking, setShowMoreRanking] = useState(false);
  const rankingData = rankingType === 'general' ? generalEnterpriseGroups : financialInstitutionGroups;
  const visibleRankingData = rankingData.slice(0, 5);
  const rankingRowsToRender = showMoreRanking ? rankingData : visibleRankingData;
  const canExpandRanking = rankingData.length > visibleRankingData.length;
  const summary =
    '截至 2025-05-31，一般企业集团 2 户超限：华夏幸福，已占用额度为 xxx 亿，较年初下降 xxx 亿，限额占用比例 xx%。金融机构集团 1 户超限：汇丰控股，已占用额度 xxx 亿，较年初下降 xxx 亿，限额占用比例 xx%；万科集团，已占用额度为 xxx 亿，较年初增加 xxx 亿，限额占用比例 xx%。';

  return (
    <>
      <MobileSummaryCard conclusion={summary} />
      <MobileDataCard title="集团前20大集中度限额管控情况">
        <MobileSegmentedTabs
          ariaLabel="集团类型"
          activeValue={rankingType}
          items={[
            { value: 'general', label: '一般企业' },
            { value: 'financial', label: '金融机构' },
          ]}
          onChange={(value) => {
            setRankingType(value);
            setShowMoreRanking(false);
          }}
        />
        <RankedLimitList data={rankingRowsToRender} />
        {canExpandRanking && (
          <button
            className={`mobile-demo-vanke-more-action ${showMoreRanking ? 'is-expanded' : ''}`.trim()}
            type="button"
            aria-expanded={showMoreRanking}
            onClick={() => setShowMoreRanking((current) => !current)}
          >
            {showMoreRanking ? '收起' : '查看更多'}
            <ChevronDown size={16} />
          </button>
        )}
      </MobileDataCard>
    </>
  );
}

function VankeConcentrationModule() {
  const [view, setView] = useState<VankeConcentrationView>('trend');
  const [showMoreTrend, setShowMoreTrend] = useState(false);
  const [showMoreDimension, setShowMoreDimension] = useState(false);
  const visibleTrendRows = vankeConcentrationTrendRows.slice(0, 6);
  const trendRowsToRender = showMoreTrend ? vankeConcentrationTrendRows : visibleTrendRows;
  const canExpandTrend = vankeConcentrationTrendRows.length > visibleTrendRows.length;
  const visibleDimensionRows = vankeMemberCompanyComparisonData.slice(0, 4);
  const dimensionRowsToRender = showMoreDimension ? vankeMemberCompanyComparisonData : visibleDimensionRows;
  const canExpandDimension = vankeMemberCompanyComparisonData.length > visibleDimensionRows.length;
  const metrics = vankeMetrics.map((item) => ({
    label: item.title,
    value: item.badge ? undefined : item.value,
    unit: item.badge ? undefined : item.unit,
    assist: item.change || undefined,
    badge: item.badge ? item.value : undefined,
    badgeLevel: item.badge ? 'warning' as const : undefined,
  }));

  return (
    <>
      <section className="mobile-demo-card mobile-demo-summary-card mobile-demo-vanke-summary-card">
        <div className="mobile-demo-card-inner">
          <p className="mobile-demo-eyebrow">AI 摘要</p>
          <p className="mobile-demo-summary-text">
            万科集团当前集中度限额为 <strong>800 亿元</strong>，已占用额度 <strong>650 亿元</strong>，
            限额占用率 <strong>78.6%</strong>，建议重点关注 <strong>银行、寿险</strong>
            等成员公司的敞口变化，本段由 AI 生成，描述下哪个成员公司占比大/哪个近期新增敞口最多。
          </p>
        </div>
      </section>
      <MetricGrid metrics={metrics} />
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
        <MobileDataCard title="近一年持仓规模与集中度趋势">
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
        <MobileDataCard title="万科集团在各成员公司的持仓分布">
          <VankeMemberComparisonList rows={dimensionRowsToRender} />
          {canExpandDimension && (
            <button
              className={`mobile-demo-vanke-more-action ${showMoreDimension ? 'is-expanded' : ''}`.trim()}
              type="button"
              aria-expanded={showMoreDimension}
              onClick={() => setShowMoreDimension((current) => !current)}
            >
              {showMoreDimension ? '收起' : '查看更多'}
              <ChevronDown size={16} />
            </button>
          )}
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
      <MobileSummaryCard conclusion="当前万科持仓总规模为 286.35 亿元，较上月增长 8.21%。持仓主要集中在平安银行、平安信托、平安证券等平安系成员公司，其中平安银行持仓规模最高；从三级资产类型看，持仓主要分布在债券、信贷、零售对公，其中债券类资产占比较高。整体集中度处于可控范围，建议持续关注平安系成员公司及三级资产配置变化。" />
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
        <MobileDataCard title="交易对手维度分析">
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
      <MobileSummaryCard conclusion={`当前万科集团名单客户共 ${total} 个，其中黑名单 ${blackCount} 个、灰名单 ${greyCount} 个、白名单* ${whiteCount} 个。黑名单客户主要集中在违约、负面舆情和经营承压场景；灰名单主要为观察类客户；白名单为当前可正常开展业务但仍需持续监控的客户。`} />
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
      <MobileDataCard title="名单详情入口" meta="每组默认预览前 5 条，完整名单进入弹层搜索和加载更多">
        <NameListDetailAccordions />
      </MobileDataCard>
    </>
  );
}

function NameListHitModule() {
  return (
    <>
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
      <MobileSummaryCard conclusion="深圳华侨城股份有限公司当前内部信评最高为 3B， 最低为 3D；最新外部评级结果为 AAA，评级机构为大公国际，整体外部评级处于较高水平。（可模版/由AI生成）内部统一信评低于外部评级表现， 建议关注集团内部口径下的信用风险变化。" />
      <MetricGrid
        metrics={[
          { label: '最高内部信评', value: ratingEntitySummary.highestInternalRating },
          { label: '最低内部信评', value: ratingEntitySummary.lowestInternalRating },
          {
            label: '最新外部评级',
            value: ratingEntitySummary.latestExternalRating,
            assist: ratingEntitySummary.latestExternalAgency,
            assistInline: true,
          },
          { label: '评级日期', value: ratingEntitySummary.updatedAt },
        ]}
      />
      <MobileSegmentedTabs
        className="mobile-demo-rating-tabs"
        ariaLabel="评级查询视图"
        activeValue={view}
        items={[
          { value: 'internal', label: '内部评级' },
          { value: 'external', label: '外部评级' },
        ]}
        onChange={setView}
      />
      {view === 'internal' && (
        <MobileDataCard title="各成员公司评级">
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
          { label: '出险金额', value: String(latestTrend?.defaulted ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
          { label: '重大预警金额', value: String(latestTrend?.major ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
          { label: '二级预警金额', value: String(latestTrend?.second ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
          { label: '一级预警金额', value: String(latestTrend?.first ?? '暂无数据'), unit: latestTrend ? '亿元' : undefined },
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
  const [projectSheet, setProjectSheet] = useState<VankeRiskProjectSheet | null>(null);

  return (
    <>
      <MobileSummaryCard conclusion={`${vankeWarningInsuranceSummary.groupName}当前风险金额合计 ${vankeWarningInsuranceSummary.exposure} 亿元，其中重大预警金额 ${vankeWarningInsuranceSummary.majorWarningAmount} 亿元、二级预警金额 ${vankeWarningInsuranceSummary.secondLevelWarningAmount} 亿元、一级预警金额 ${vankeWarningInsuranceSummary.firstLevelWarningAmount} 亿元、出险金额 ${vankeWarningInsuranceSummary.defaultAmount} 亿元。风险主要集中在寿险、银行和信托等成员公司，建议优先查看出险金额和重大预警金额明细。`} />
      <MetricGrid
        metrics={[
          { label: '重大预警金额', value: String(vankeWarningInsuranceSummary.majorWarningAmount), unit: '亿元' },
          { label: '二级预警金额', value: String(vankeWarningInsuranceSummary.secondLevelWarningAmount), unit: '亿元' },
          { label: '一级预警金额', value: String(vankeWarningInsuranceSummary.firstLevelWarningAmount), unit: '亿元' },
          { label: '出险金额', value: String(vankeWarningInsuranceSummary.defaultAmount), unit: '亿元' },
        ]}
      />
      <MobileDataCard title="风险类型穿透" meta="展开风险类型后，查看平安成员公司及项目明细">
        <VankeRiskDrilldownAccordion onOpenMember={setProjectSheet} />
      </MobileDataCard>
      <MobileBottomSheet
        open={Boolean(projectSheet)}
        title={projectSheet ? `${projectSheet.memberName} - ${formatVankeRiskSheetLabel(projectSheet.riskLabel)}明细` : '项目明细'}
        onClose={() => setProjectSheet(null)}
      >
        {projectSheet ? <VankeRiskProjectSheetContent sheet={projectSheet} /> : null}
      </MobileBottomSheet>
    </>
  );
}

function LargeCustomerModule() {
  const [view, setView] = useState<LargeCustomerView>('trend');
  const [filters, setFilters] = useState<LargeCustomerFilters>(defaultLargeCustomerFilters);
  const [draftFilters, setDraftFilters] = useState<LargeCustomerFilters>(defaultLargeCustomerFilters);
  const [sort, setSort] = useState<LargeCustomerSort>({ field: 'exposure', direction: 'desc' });
  const [draftSort, setDraftSort] = useState<LargeCustomerSort>({ field: 'exposure', direction: 'desc' });
  const [fullListOpen, setFullListOpen] = useState(false);
  const [fullListVisibleCount, setFullListVisibleCount] = useState(fullLargeCustomerPageSize);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const filteredLargeCustomers = useMemo(() => {
    return sortLargeCustomerRows(filterLargeCustomerRows(largeCustomerTableData, filters), sort);
  }, [filters, sort]);
  const mainPreviewLargeCustomers = useMemo(
    () => filteredLargeCustomers.slice(0, mainLargeCustomerPreviewCount),
    [filteredLargeCustomers],
  );
  const fullListLargeCustomers = useMemo(
    () => filteredLargeCustomers.slice(0, fullListVisibleCount),
    [filteredLargeCustomers, fullListVisibleCount],
  );
  const draftFilterPreviewCount = useMemo(
    () => filterLargeCustomerRows(largeCustomerTableData, draftFilters).length,
    [draftFilters],
  );
  const filteredLargeCustomerTotal = useMemo(
    () => calculateLargeCustomerTotal(filteredLargeCustomers),
    [filteredLargeCustomers],
  );
  const activeFilterCount = countLargeCustomerFilters(filters);
  const sortLabel = `${largeCustomerSortLabel(sort.field)} ${sort.direction === 'desc' ? '↓' : '↑'}`;
  const shouldShowFullListEntry = filteredLargeCustomers.length > mainLargeCustomerPreviewCount;
  const hasMoreFullListCustomers = fullListLargeCustomers.length < filteredLargeCustomers.length;
  const nextFullListCount = Math.min(fullLargeCustomerPageSize, filteredLargeCustomers.length - fullListLargeCustomers.length);
  useEffect(() => {
    setFullListVisibleCount(fullLargeCustomerPageSize);
  }, [filters, sort]);
  const openFilterSheet = () => {
    setDraftFilters(filters);
    setFilterOpen(true);
  };
  const openSortSheet = () => {
    setDraftSort(sort);
    setSortOpen(true);
  };
  const resetFilters = () => {
    setDraftFilters(defaultLargeCustomerFilters);
  };
  const applyFilters = () => {
    setFullListVisibleCount(fullLargeCustomerPageSize);
    setFilters(draftFilters);
    setFilterOpen(false);
  };
  const applySort = () => {
    setFullListVisibleCount(fullLargeCustomerPageSize);
    setSort(draftSort);
    setSortOpen(false);
  };
  const updateSearchKeyword = (keyword: string) => {
    setFullListVisibleCount(fullLargeCustomerPageSize);
    setFilters((currentFilters) => ({ ...currentFilters, keyword }));
  };
  const openFullCustomerList = () => {
    setFullListVisibleCount(fullLargeCustomerPageSize);
    setFullListOpen(true);
  };
  const loadMoreFullListCustomers = () => {
    setFullListVisibleCount((currentCount) => Math.min(currentCount + fullLargeCustomerPageSize, filteredLargeCustomers.length));
  };

  return (
    <>
      <MobileSummaryCard conclusion="截至 2025-06-30，集团大户客户共 325 家，整体持仓规模 3,286.75 亿元，较上月 +128.63 亿元，较年初增加 512.34 亿元。其中重点管理大户 126 家，持仓规模 1,871.36 亿元，占比 56.96%。建议持续关注高敞口且伴随预警、出险、黑灰名单或评级承压的大户客户" />
      <MetricGrid
        metrics={[
          { label: '大户客户', value: String(largeCustomerOverview.totalCustomers), unit: '家' },
          {
            label: '整体持仓规模',
            value: largeCustomerOverview.totalExposure.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            unit: '亿元',
            assist: `较上月 +${largeCustomerOverview.momExposureChange.toFixed(2)} 亿元`,
          },
          { label: '重点管理大户', value: String(largeCustomerOverview.keyManagementCustomers), unit: '家' },
          { label: '持仓规模占比', value: largeCustomerOverview.keyManagementExposureRatio },
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
        <MobileDataCard title="大户数量及持仓规模趋势（近半年）">
          <TrendRows
            rows={largeCustomerTrendData.slice(-6).reverse().map((item) => ({
              label: item.month,
              value: item.totalExposure,
              valueSuffix: '亿元',
              assist: `${item.customerCount} 家`,
            }))}
          />
        </MobileDataCard>
      )}
      {view === 'dimension' && (
        <MobileDataCard title="大户客户明细">
          <LargeCustomerFilterSummary
            filterCount={activeFilterCount}
            keyword={filters.keyword}
            sortLabel={sortLabel}
            onKeywordChange={updateSearchKeyword}
            onOpenFilter={openFilterSheet}
            onOpenSort={openSortSheet}
          />
          <LargeCustomerFilterTotalCard total={filteredLargeCustomerTotal} />
          <div className="mobile-demo-large-list-toolbar">
            <span>{formatLargeCustomerPreviewStatus(filteredLargeCustomers.length, mainPreviewLargeCustomers.length)}</span>
            <em>排序：{sortLabel}</em>
          </div>
          <LargeCustomerCards rows={mainPreviewLargeCustomers} />
          {shouldShowFullListEntry ? (
            <button className="mobile-demo-large-load-more" type="button" onClick={openFullCustomerList}>
              查看全部 {filteredLargeCustomers.length} 家
              <ChevronRight size={16} />
            </button>
          ) : (
            <button className="mobile-demo-large-load-more is-complete" type="button" disabled>
              {filteredLargeCustomers.length > 0 ? `已显示全部 ${filteredLargeCustomers.length} 家` : '暂无可展示客户'}
            </button>
          )}
        </MobileDataCard>
      )}
      <MobileBottomSheet open={fullListOpen} title="全部大户客户" onClose={() => setFullListOpen(false)}>
        <LargeCustomerFullListSheet
          filterCount={activeFilterCount}
          keyword={filters.keyword}
          sortLabel={sortLabel}
          totalCount={filteredLargeCustomers.length}
          visibleCount={fullListLargeCustomers.length}
          rows={fullListLargeCustomers}
          hasMore={hasMoreFullListCustomers}
          nextCount={nextFullListCount}
          onKeywordChange={updateSearchKeyword}
          onOpenFilter={openFilterSheet}
          onOpenSort={openSortSheet}
          onLoadMore={loadMoreFullListCustomers}
        />
      </MobileBottomSheet>
      <MobileBottomSheet open={filterOpen} title="筛选大户客户" onClose={() => setFilterOpen(false)}>
        <LargeCustomerFilterSheet
          draftFilters={draftFilters}
          previewCount={draftFilterPreviewCount}
          onDraftChange={setDraftFilters}
          onReset={resetFilters}
          onApply={applyFilters}
        />
      </MobileBottomSheet>
      <MobileBottomSheet open={sortOpen} title="排序方式" onClose={() => setSortOpen(false)}>
        <LargeCustomerSortSheet
          draftSort={draftSort}
          onDraftSortChange={setDraftSort}
          onCancel={() => setSortOpen(false)}
          onApply={applySort}
        />
      </MobileBottomSheet>
    </>
  );
}

function SingleLargeCustomerModule({ onOpenSheet }: { onOpenSheet: (sheet: SheetState) => void }) {
  const [tab, setTab] = useState<SingleLargeTab>('holding');
  const singleLargeMetricCards: Metric[] = [
    {
      label: singleLargeMetrics[0].title,
      value: singleLargeMetrics[0].value,
      unit: singleLargeMetrics[0].unit,
      assist: [singleLargeMetrics[0].change, singleLargeMetrics[0].subChange].filter(Boolean).join('\n'),
    },
    {
      label: singleLargeMetrics[1].title,
      value: singleLargeMetrics[1].value,
      unit: singleLargeMetrics[1].unit,
      assist: singleLargeMetrics[1].change,
    },
    {
      label: singleLargeMetrics[2].title,
      value: singleLargeMetrics[2].value,
      unit: singleLargeMetrics[2].unit,
      assist: `含出险金额 ${formatRiskNumber(singleLargeCustomerWarningMetrics.defaulted)}亿元`,
    },
    {
      label: '黑灰名单命中',
      value: singleLargeMetrics[3].value,
      unit: singleLargeMetrics[3].unit,
      assist: singleLargeMetrics[3].change,
    },
    {
      label: singleLargeMetrics[4].title,
      value: singleLargeMetrics[4].value,
      unit: singleLargeMetrics[4].unit,
      assist: singleLargeMetrics[4].change,
    },
  ];

  return (
    <>
      <MobileSummaryCard conclusion="万科企业集团当前为重点管理大户，整体持仓规模为 285.53 亿元，主要分布在银行、不动产和资产管理等专业公司；出险预警金额较高，评级存在一定承压迹象，并命中黑名单及灰名单记录。 建议持续关注持仓结构、预警出险变化、评级迁徙及负面舆情变化。" />
      <SingleLargeMetricGrid metrics={singleLargeMetricCards} />
      <MobileSegmentedTabs
        className="mobile-demo-main-tabs"
        ariaLabel="单一大户查询 tab"
        activeValue={tab}
        items={[
          { value: 'holding', label: '持仓' },
          { value: 'warning', label: '出险' },
          { value: 'rating', label: '评级' },
          { value: 'sentiment', label: '舆情' },
          { value: 'namelist', label: '黑灰名单' },
        ]}
        onChange={setTab}
      />
      {tab === 'holding' && <SingleHoldingPanel />}
      {tab === 'warning' && <SingleWarningPanel />}
      {tab === 'rating' && <SingleRatingPanel onOpenSheet={onOpenSheet} />}
      {tab === 'sentiment' && <SingleSentimentPanel />}
      {tab === 'namelist' && (
        <MobileDataCard title="黑灰名单详情" meta="每组默认预览前 5 条，完整名单进入弹层搜索和加载更多">
          <SingleLargeNameListAccordions />
        </MobileDataCard>
      )}
    </>
  );
}

function SingleHoldingPanel() {
  const [view, setView] = useState<SingleHoldingView>('company');
  const [displayView, setDisplayView] = useState<SingleHoldingDisplayView>('distribution');
  const [expandedName, setExpandedName] = useState<string | null>(null);
  const rows = view === 'company' ? holdingMemberCompanyRows : holdingAssetTypeRows;
  const distributionTitle = view === 'company' ? '成员公司持仓分布' : '资产类型持仓分布';
  const distributionMeta = displayView === 'distribution'
    ? '按持仓规模排序，展示金额与整体占比'
    : '点击条目查看分法人公司和产品明细';
  const changeView = (nextView: SingleHoldingView) => {
    setView(nextView);
    setExpandedName(null);
  };
  const changeDisplayView = (nextDisplayView: SingleHoldingDisplayView) => {
    setDisplayView(nextDisplayView);
    setExpandedName(null);
  };
  const toggleExpandedName = (name: string) => {
    setExpandedName((currentName) => (currentName === name ? null : name));
  };

  return (
    <MobileDataCard className="mobile-demo-holding-card" title="持仓规模总览">
      <HoldingOverviewSummary />
      <div className="mobile-demo-holding-controls">
        <div className="mobile-demo-holding-control-layer">
          <span className="mobile-demo-holding-control-label">分析维度</span>
          <MobileSegmentedTabs
            className="mobile-demo-holding-dimension-tabs"
            ariaLabel="持仓规模维度"
            activeValue={view}
            items={[
              { value: 'company', label: '成员公司' },
              { value: 'asset', label: '资产类型' },
            ]}
            onChange={changeView}
          />
        </div>
        <div className="mobile-demo-holding-control-layer">
          <span className="mobile-demo-holding-control-label">展示方式</span>
          <MobileSegmentedTabs
            className="mobile-demo-holding-display-tabs"
            ariaLabel="持仓展示方式"
            activeValue={displayView}
            items={[
              { value: 'distribution', label: '分布概览' },
              { value: 'details', label: '明细穿透' },
            ]}
            onChange={changeDisplayView}
          />
        </div>
      </div>
      <div className="mobile-demo-holding-analysis">
        <div className="mobile-demo-holding-analysis-head">
          <h3>{distributionTitle}</h3>
          <p>{distributionMeta}</p>
        </div>
        {displayView === 'distribution' ? (
          <HoldingDistributionList rows={rows} />
        ) : (
          <HoldingDetailAccordion
            rows={rows}
            dimension={view}
            expandedName={expandedName}
            onToggle={toggleExpandedName}
          />
        )}
      </div>
    </MobileDataCard>
  );
}

function HoldingOverviewSummary() {
  const totalMetric = singleLargeMetrics[0];
  const topCompany = holdingMemberCompanyRows[0];
  const topAsset = holdingAssetTypeRows[0];
  const overviewItems = [
    { label: '总持仓规模', value: totalMetric.value, suffix: totalMetric.unit },
    { label: '最大成员公司', value: topCompany.name, suffix: `${formatHoldingAmount(topCompany.amount)} 亿元` },
    { label: '最大资产类型', value: topAsset.name, suffix: `${formatHoldingAmount(topAsset.amount)} 亿元` },
  ];

  return (
    <div className="mobile-demo-holding-overview-grid" aria-label="持仓规模总览指标">
      {overviewItems.map((item) => (
        <div className="mobile-demo-holding-overview-item" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <em>{item.suffix}</em>
        </div>
      ))}
    </div>
  );
}

function HoldingDistributionList({ rows }: { rows: HoldingDistributionRow[] }) {
  return (
    <div className="mobile-demo-holding-distribution-list">
      {rows.map((item, index) => {
        const percent = parseHoldingRatio(item.ratio);
        const width = Math.min(100, Math.max(percent, item.amount > 0 ? 2 : 0));

        return (
          <article className="mobile-demo-holding-rank-row" key={item.name}>
            <div className="mobile-demo-holding-rank-main">
              <span className="mobile-demo-holding-rank-name">
                <i className={`mobile-demo-holding-rank-dot ${index < 3 ? 'is-top-three' : ''}`.trim()}>{index + 1}</i>
                <strong>{item.name}</strong>
              </span>
              <span className="mobile-demo-holding-amount">
                <strong>{formatHoldingAmount(item.amount)}</strong>
                <em>亿元</em>
              </span>
            </div>
            <span className="mobile-demo-holding-ratio-chip">占整体 {item.ratio}</span>
            <div className="mobile-demo-holding-progress" aria-hidden="true">
              <i style={{ width: `${width}%` }} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function HoldingDetailAccordion({
  rows,
  dimension,
  expandedName,
  onToggle,
}: {
  rows: HoldingDistributionRow[];
  dimension: SingleHoldingView;
  expandedName: string | null;
  onToggle: (name: string) => void;
}) {
  return (
    <div className="mobile-demo-holding-detail-accordion">
      {rows.map((item) => {
        const isOpen = expandedName === item.name;

        return (
          <section className={`mobile-demo-holding-detail-item ${isOpen ? 'is-open' : ''}`.trim()} key={item.name}>
            <button
              className="mobile-demo-holding-detail-toggle"
              type="button"
              aria-expanded={isOpen}
              onClick={() => onToggle(item.name)}
            >
              <span className="mobile-demo-holding-detail-left">
                <strong>{item.name}</strong>
                <em>占整体 {item.ratio}</em>
              </span>
              <span className="mobile-demo-holding-detail-right">
                <strong>{formatHoldingAmount(item.amount)}</strong>
                <em>亿元</em>
              </span>
              <ChevronDown className="mobile-demo-accordion-chevron" size={18} />
            </button>
            {isOpen ? (
              <div className="mobile-demo-holding-detail-body">
                <HoldingDetails dimension={dimension} name={item.name} />
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function SingleWarningPanel() {
  const [view, setView] = useState<SingleWarningView>('summary');

  return (
    <MobileDataCard title="单一大户出险预警" meta="出险、重大预警、二级预警按集团和成员公司口径展示">
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
  const isInternalView = view === 'internal';

  return (
    <MobileDataCard
      className="mobile-demo-single-rating-card"
      title={isInternalView ? '各成员公司评级' : '外部评级机构'}
      meta={isInternalView ? undefined : '外部评级按评级机构展示，可展开查看历史评级'}
      action={
        isInternalView ? null : (
          <button
            className="mobile-demo-text-action"
            type="button"
            onClick={() => onOpenSheet({ title: externalRatingMeaning.title, content: <p className="mobile-demo-sheet-copy">{externalRatingMeaning.content}</p> })}
          >
            评级含义
          </button>
        )
      }
    >
      <MobileSegmentedTabs
        className="mobile-demo-rating-tabs"
        ariaLabel="单一大户评级视图"
        activeValue={view}
        items={[
          { value: 'internal', label: '内部评级' },
          { value: 'external', label: '外部评级' },
        ]}
        onChange={setView}
      />
      {isInternalView ? <CompactInternalRatingCards /> : <ExternalRatingAccordions />}
    </MobileDataCard>
  );
}

function SingleSentimentPanel() {
  const [level, setLevel] = useState<SentimentRiskLevel>('high');
  const items = singleLargeCustomerSentimentFeed[level];

  return (
    <MobileDataCard title="舆情信息流" meta="默认展示最新前 5 条，完整舆情进入弹层搜索和加载更多">
      <MobileSegmentedTabs
        ariaLabel="舆情风险等级"
        activeValue={level}
        items={[
          { value: 'high', label: '高风险' },
          { value: 'medium', label: '中风险' },
        ]}
        onChange={setLevel}
      />
      <OpinionPreviewList riskType={level} items={items} itemsByRisk={singleLargeCustomerSentimentFeed} />
    </MobileDataCard>
  );
}

function OpinionPreviewList({
  riskType,
  items,
  itemsByRisk,
  previewCount = opinionPreviewCount,
  sheetPageSize = opinionSheetPageSize,
}: {
  riskType: SentimentRiskLevel;
  items: SentimentFeedItem[];
  itemsByRisk: Record<SentimentRiskLevel, SentimentFeedItem[]>;
  previewCount?: number;
  sheetPageSize?: number;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetRiskType, setSheetRiskType] = useState<SentimentRiskLevel>(riskType);
  const [searchValue, setSearchValue] = useState('');
  const [visibleCount, setVisibleCount] = useState(sheetPageSize);
  const previewItems = useMemo(() => sortOpinionItemsByDate(items).slice(0, previewCount), [items, previewCount]);
  const sheetItems = useMemo(() => sortOpinionItemsByDate(itemsByRisk[sheetRiskType]), [itemsByRisk, sheetRiskType]);
  const filteredItems = useMemo(() => filterOpinionItems(sheetItems, searchValue), [sheetItems, searchValue]);
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasPreviewOverflow = items.length > previewCount;
  const hasMore = visibleItems.length < filteredItems.length;
  const nextCount = Math.min(sheetPageSize, filteredItems.length - visibleItems.length);
  const riskLabel = sentimentRiskLabels[riskType];
  const sheetRiskLabel = sentimentRiskLabels[sheetRiskType];

  const openFullSheet = () => {
    setSheetRiskType(riskType);
    setSearchValue('');
    setVisibleCount(sheetPageSize);
    setSheetOpen(true);
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
    setVisibleCount(sheetPageSize);
  };

  const updateSheetRiskType = (nextRiskType: SentimentRiskLevel) => {
    setSheetRiskType(nextRiskType);
    setVisibleCount(sheetPageSize);
  };

  const loadMoreItems = () => {
    setVisibleCount((currentCount) => Math.min(currentCount + sheetPageSize, filteredItems.length));
  };

  return (
    <div className="mobile-demo-feed-list mobile-demo-opinion-preview-list">
      {previewItems.length ? (
        previewItems.map((item) => <OpinionFeedCard key={`${item.level}-${item.title}-${item.date}`} item={item} />)
      ) : (
        <p className="mobile-demo-empty">暂无舆情信息</p>
      )}
      {hasPreviewOverflow ? (
        <button className="mobile-demo-opinion-view-all" type="button" onClick={openFullSheet}>
          查看全部{riskLabel} {items.length} 条
          <ChevronRight size={16} />
        </button>
      ) : previewItems.length ? (
        <div className="mobile-demo-opinion-complete">已显示全部 {items.length} 条</div>
      ) : null}
      <MobileBottomSheet open={sheetOpen} title={`全部${sheetRiskLabel}舆情`} onClose={() => setSheetOpen(false)}>
        <OpinionFullSheet
          riskType={sheetRiskType}
          items={visibleItems}
          searchValue={searchValue}
          filteredCount={filteredItems.length}
          visibleCount={visibleItems.length}
          hasMore={hasMore}
          nextCount={nextCount}
          onRiskTypeChange={updateSheetRiskType}
          onSearchChange={updateSearchValue}
          onLoadMore={loadMoreItems}
        />
      </MobileBottomSheet>
    </div>
  );
}

function OpinionFullSheet({
  riskType,
  items,
  searchValue,
  filteredCount,
  visibleCount,
  hasMore,
  nextCount,
  onRiskTypeChange,
  onSearchChange,
  onLoadMore,
}: {
  riskType: SentimentRiskLevel;
  items: SentimentFeedItem[];
  searchValue: string;
  filteredCount: number;
  visibleCount: number;
  hasMore: boolean;
  nextCount: number;
  onRiskTypeChange: (riskType: SentimentRiskLevel) => void;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
}) {
  const riskLabel = sentimentRiskLabels[riskType];

  return (
    <section className="mobile-demo-opinion-full-sheet">
      <label className="mobile-demo-opinion-search">
        <Search size={17} />
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="搜索标题 / 摘要 / 日期"
        />
      </label>
      <MobileSegmentedTabs
        className="mobile-demo-opinion-sheet-tabs"
        ariaLabel="全量舆情风险等级"
        activeValue={riskType}
        items={[
          { value: 'high', label: '高风险' },
          { value: 'medium', label: '中风险' },
        ]}
        onChange={onRiskTypeChange}
      />
      <div className="mobile-demo-opinion-sheet-status">
        <strong>当前{riskLabel} {filteredCount} 条</strong>
        <span>{formatOpinionVisibleStatus(filteredCount, visibleCount)}</span>
      </div>
      {items.length ? (
        <>
          <div className="mobile-demo-opinion-sheet-list">
            {items.map((item) => <OpinionFeedCard key={`sheet-${item.level}-${item.title}-${item.date}`} item={item} />)}
          </div>
          {hasMore ? (
            <button className="mobile-demo-large-load-more" type="button" onClick={onLoadMore}>
              加载更多 {nextCount} 条
              <ChevronDown size={16} />
            </button>
          ) : (
            <button className="mobile-demo-large-load-more is-complete" type="button" disabled>
              已显示全部 {filteredCount} 条
            </button>
          )}
        </>
      ) : (
        <div className="mobile-demo-large-empty">
          <strong>暂无匹配舆情</strong>
          <span>请调整搜索关键词或风险类型</span>
        </div>
      )}
    </section>
  );
}

function OpinionFeedCard({ item }: { item: SentimentFeedItem }) {
  return (
    <article className="mobile-demo-feed-card mobile-demo-opinion-card">
      <span className={`mobile-demo-feed-level level-${item.level}`}>{sentimentRiskLabels[item.level]}</span>
      <strong>{item.title}</strong>
      <span className="mobile-demo-opinion-meta">{item.customer} / {item.date}</span>
      <em>{item.summary}</em>
    </article>
  );
}

function sortOpinionItemsByDate(items: SentimentFeedItem[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

function filterOpinionItems(items: SentimentFeedItem[], searchValue: string) {
  const keyword = searchValue.trim().toLowerCase();

  if (!keyword) {
    return items;
  }

  return items.filter((item) => (
    [item.title, item.summary, item.customer, item.date].some((value) => value.toLowerCase().includes(keyword))
  ));
}

function formatOpinionVisibleStatus(totalCount: number, visibleCount: number) {
  if (totalCount === 0) return '已显示 0 / 0';
  if (visibleCount >= totalCount) return `已显示全部 ${totalCount} 条`;
  return `已显示 1-${visibleCount} / ${totalCount}`;
}

function SingleLargeMetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="mobile-demo-single-metric-section" aria-label="单一大户核心指标">
      <div className="mobile-demo-single-metric-grid">
        {metrics.map((metric) => (
          <MobileMetricCard key={metric.label} {...metric} className="mobile-demo-single-metric" />
        ))}
      </div>
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

function RankedLimitList({
  data,
  startIndex = 1,
}: {
  data: Array<{ name: string; limit: number; limitUsage: number }>;
  startIndex?: number;
}) {
  return (
    <div className="mobile-demo-list-stack">
      {data.map((item, index) => (
        <div className="mobile-demo-rank-row" key={item.name}>
          <span className="mobile-demo-rank-index">{startIndex + index}</span>
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
              <strong className="mobile-demo-trend-row-value">
                {item.assist ? <em>{item.assist}</em> : null}
                <span>{item.value}{item.valueSuffix ? ` ${item.valueSuffix}` : ''}</span>
              </strong>
            </div>
            <div className="mobile-demo-progress-track">
              <i style={{ width: `${width}%` }} />
            </div>
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
  return nameListGroupDefinitions.find((group) => group.title.startsWith(typePrefix))?.items.length ?? 0;
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
  return <NameListPreviewGroups />;
}

function NameListAccordions() {
  return <NameListPreviewGroups />;
}

function SingleLargeNameListAccordions() {
  return <NameListPreviewGroups />;
}

function NameListPreviewGroups() {
  return (
    <div className="mobile-demo-single-namelist mobile-demo-namelist-preview-list">
      {nameListGroupDefinitions.map((group, index) => (
        <NameListPreviewSection
          key={group.id}
          groupId={group.id}
          title={group.title}
          items={group.items}
          level={group.level}
          defaultExpanded={index === 0}
        />
      ))}
    </div>
  );
}

function NameListPreviewSection({
  groupId,
  title,
  items,
  level,
  previewCount = nameListPreviewCount,
  sheetPageSize = nameListSheetPageSize,
  defaultExpanded = false,
}: {
  groupId: NameListGroupId;
  title: NameListGroupDefinition['title'];
  items: NameListRecord[];
  level: MobileRiskBadgeLevel;
  previewCount?: number;
  sheetPageSize?: number;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [visibleCount, setVisibleCount] = useState(sheetPageSize);
  const previewItems = items.slice(0, previewCount);
  const filteredItems = useMemo(() => filterNameListItems(items, searchValue), [items, searchValue]);
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleItems.length < filteredItems.length;
  const nextCount = Math.min(sheetPageSize, filteredItems.length - visibleItems.length);
  const hasPreviewOverflow = items.length > previewCount;
  const groupSummaryId = `namelist-${groupId}-summary`;
  const groupBodyId = `namelist-${groupId}-body`;

  const openFullSheet = () => {
    setSearchValue('');
    setVisibleCount(sheetPageSize);
    setSheetOpen(true);
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
    setVisibleCount(sheetPageSize);
  };

  const loadMoreItems = () => {
    setVisibleCount((currentCount) => Math.min(currentCount + sheetPageSize, filteredItems.length));
  };

  return (
    <section className={`mobile-demo-single-namelist-group mobile-demo-namelist-preview-section is-${groupId} is-${expanded ? 'open' : 'closed'}`.trim()}>
      <button
        className="mobile-demo-namelist-preview-head"
        id={groupSummaryId}
        type="button"
        aria-expanded={expanded}
        aria-controls={groupBodyId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>
          <strong>{title}</strong>
          <em>{items.length} 个</em>
        </span>
        <ChevronDown className="mobile-demo-accordion-chevron" size={18} />
      </button>
      {expanded ? (
        <div className="mobile-demo-single-namelist-body" id={groupBodyId} role="region" aria-labelledby={groupSummaryId}>
          {previewItems.length ? (
            previewItems.map((item) => <NameListItemCard key={`${title}-${item.name}-${item.date}`} item={item} level={level} />)
          ) : (
            <p className="mobile-demo-empty">暂无名单明细</p>
          )}
          {hasPreviewOverflow ? (
            <button className="mobile-demo-namelist-view-all" type="button" onClick={openFullSheet}>
              查看全部{title} {items.length} 条
              <ChevronRight size={16} />
            </button>
          ) : previewItems.length ? (
            <div className="mobile-demo-namelist-complete">已显示全部 {items.length} 条</div>
          ) : null}
        </div>
      ) : null}
      <MobileBottomSheet open={sheetOpen} title={`全部${title}`} onClose={() => setSheetOpen(false)}>
        <NameListFullSheet
          title={title}
          items={visibleItems}
          level={level}
          searchValue={searchValue}
          filteredCount={filteredItems.length}
          visibleCount={visibleItems.length}
          hasMore={hasMore}
          nextCount={nextCount}
          onSearchChange={updateSearchValue}
          onLoadMore={loadMoreItems}
        />
      </MobileBottomSheet>
    </section>
  );
}

function NameListFullSheet({
  title,
  items,
  level,
  searchValue,
  filteredCount,
  visibleCount,
  hasMore,
  nextCount,
  onSearchChange,
  onLoadMore,
}: {
  title: NameListGroupDefinition['title'];
  items: NameListRecord[];
  level: MobileRiskBadgeLevel;
  searchValue: string;
  filteredCount: number;
  visibleCount: number;
  hasMore: boolean;
  nextCount: number;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
}) {
  return (
    <section className="mobile-demo-namelist-full-sheet">
      <label className="mobile-demo-namelist-search">
        <Search size={17} />
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="搜索企业名称 / 入库原因"
        />
      </label>
      <div className="mobile-demo-namelist-sheet-status">
        <strong>{title} {filteredCount} 条</strong>
        <span>{formatNameListVisibleStatus(filteredCount, visibleCount)}</span>
      </div>
      {items.length ? (
        <>
          <div className="mobile-demo-namelist-sheet-list">
            {items.map((item) => <NameListItemCard key={`sheet-${title}-${item.name}-${item.date}`} item={item} level={level} />)}
          </div>
          {hasMore ? (
            <button className="mobile-demo-large-load-more" type="button" onClick={onLoadMore}>
              加载更多 {nextCount} 条
              <ChevronDown size={16} />
            </button>
          ) : (
            <button className="mobile-demo-large-load-more is-complete" type="button" disabled>
              已显示全部 {filteredCount} 条
            </button>
          )}
        </>
      ) : (
        <div className="mobile-demo-large-empty">
          <strong>暂无匹配名单</strong>
          <span>请调整搜索关键词</span>
        </div>
      )}
    </section>
  );
}

function NameListItemCard({ item, level }: { item: NameListRecord; level: MobileRiskBadgeLevel }) {
  return (
    <article className="mobile-demo-record-card mobile-demo-namelist-card">
      <div className="mobile-demo-row-head">
        <strong>{item.name}</strong>
        <MobileRiskBadge level={level}>{item.reporter}</MobileRiskBadge>
      </div>
      <KeyValueList
        rows={[
          ['企业名称', item.name],
          ['入库原因', item.reason],
          ['上报公司', item.reporter],
          ['入库日期', item.date],
        ]}
      />
    </article>
  );
}

function filterNameListItems(items: NameListRecord[], searchValue: string) {
  const keyword = searchValue.trim().toLowerCase();

  if (!keyword) {
    return items;
  }

  return items.filter((item) => [item.name, item.reason, item.reporter, item.date].some((value) => value.toLowerCase().includes(keyword)));
}

function formatNameListVisibleStatus(totalCount: number, visibleCount: number) {
  if (totalCount === 0) return '已显示 0 / 0';
  if (visibleCount >= totalCount) return `已显示全部 ${totalCount} 条`;
  return `已显示 1-${visibleCount} / ${totalCount}`;
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

function InternalRatingCards() {
  return <CompactInternalRatingCards />;
}

function CompactInternalRatingCards() {
  return (
    <div className="mobile-demo-rating-company-list">
      {internalAnnualRatingRecords.map((item) => (
        <RatingListCard
          key={item.company}
          title={item.company}
          fields={[
            { label: '有效评级', value: item.rating, emphasized: true },
            { label: '年报年份', value: String(item.reportYear) },
          ]}
        />
      ))}
    </div>
  );
}

function ExternalRatingAccordions() {
  const [openAgencies, setOpenAgencies] = useState<string[]>([]);
  const toggleAgency = (agency: string) => {
    setOpenAgencies((current) => (current.includes(agency) ? current.filter((item) => item !== agency) : [...current, agency]));
  };

  return (
    <div className="mobile-demo-rating-company-list">
      {externalRatingAgencies.map((agency) => {
        const isOpen = openAgencies.includes(agency.agency);

        return (
          <RatingListCard
            key={agency.agency}
            title={agency.agency}
            fields={[
              { label: '评级结果', value: agency.rating, emphasized: true },
              { label: '评级日期', value: agency.date },
            ]}
            action={
              <button
                className={`mobile-demo-rating-card-toggle ${isOpen ? 'is-open' : ''}`.trim()}
                type="button"
                aria-label={`${agency.agency}历史评级`}
                aria-expanded={isOpen}
                onClick={() => toggleAgency(agency.agency)}
              >
                <ChevronDown size={16} />
              </button>
            }
          >
            {isOpen ? (
              <div className="mobile-demo-rating-history-list">
                <div className="mobile-demo-rating-history-title">历史评级</div>
                {agency.history.map((item) => (
                  <div className="mobile-demo-rating-history-row" key={`${agency.agency}-${item.date}`}>
                    <span>{item.date}</span>
                    <strong>{item.rating}</strong>
                  </div>
                ))}
              </div>
            ) : null}
          </RatingListCard>
        );
      })}
    </div>
  );
}

function RatingListCard({
  title,
  fields,
  action,
  children,
}: {
  title: string;
  fields: Array<{ label: string; value: ReactNode; emphasized?: boolean }>;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className="mobile-demo-rating-company-card">
      <div className="mobile-demo-rating-card-head">
        <strong>{title}</strong>
        {action}
      </div>
      <div className="mobile-demo-rating-info-row">
        {fields.map((field) => (
          <span className="mobile-demo-rating-info-item" key={field.label}>
            <em>{field.label}</em>
            <b className={field.emphasized ? 'is-emphasized' : undefined}>{field.value}</b>
          </span>
        ))}
      </div>
      {children ? <div className="mobile-demo-rating-card-extra">{children}</div> : null}
    </article>
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

function VankeRiskDrilldownAccordion({ onOpenMember }: { onOpenMember: (sheet: VankeRiskProjectSheet) => void }) {
  return (
    <div className="mobile-demo-vanke-risk-accordion">
      {vankeRiskDrilldown.map((risk) => (
        <details className="mobile-demo-vanke-risk-item" key={risk.key} open={risk.key === 'defaulted'}>
          <summary>
            <span className={`mobile-demo-risk-dot risk-${risk.key}`} />
            <strong>{risk.label}</strong>
            <em>{risk.amount} 亿元 / {risk.ratio}</em>
            <ChevronDown className="mobile-demo-accordion-chevron" size={17} />
          </summary>
          <div className="mobile-demo-vanke-risk-body">
            {risk.members.map((member) => (
              <button
                className="mobile-demo-vanke-member-row"
                key={`${risk.key}-${member.name}`}
                type="button"
                onClick={() => {
                  onOpenMember({
                    riskKey: risk.key,
                    riskLabel: risk.label,
                    memberName: member.name,
                    amount: member.amount,
                    records: getVankeRiskProjectDetails(risk.key, risk.label, member),
                  });
                }}
              >
                <strong>{member.name}</strong>
                <span>{formatRiskNumber(member.amount)} 亿元</span>
                <em>{member.subsidiaries.length} 条</em>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function VankeRiskProjectSheetContent({ sheet }: { sheet: VankeRiskProjectSheet }) {
  return (
    <div className="mobile-demo-vanke-project-sheet">
      <p className="mobile-demo-vanke-project-sheet-subtitle">
        共 {sheet.records.length} 条，合计 {formatRiskNumber(sheet.amount)} 亿元
      </p>
      <div className="mobile-demo-vanke-project-list">
        {sheet.records.map((record) => (
          <article className="mobile-demo-vanke-project-card" key={`${sheet.riskKey}-${sheet.memberName}-${record.company}-${record.projectName}`}>
            <div className="mobile-demo-vanke-project-head">
              <strong>{record.company}</strong>
              <b>{formatRiskNumber(record.amount)} 亿元</b>
            </div>
            <p>{record.projectName}</p>
            <div className="mobile-demo-vanke-project-date">
              <span>预警发起时间</span>
              <strong>{record.warningStartDate}</strong>
            </div>
            <div className="mobile-demo-vanke-project-fields">
              <span>
                <em>成员公司</em>
                <strong>{record.memberCompany}</strong>
              </span>
              <span>
                <em>业务类型</em>
                <strong>{record.businessType}</strong>
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function getVankeRiskProjectDetails(riskKey: string, riskLabel: string, member: VankeRiskMember): MobileVankeRiskProjectDetail[] {
  const detailMap = mobileVankeRiskProjectDetails as Record<string, Record<string, MobileVankeRiskProjectDetail[]>>;
  const records = detailMap[riskKey]?.[member.name];

  if (records?.length) {
    return records;
  }

  const sheetRiskLabel = formatVankeRiskSheetLabel(riskLabel);

  return member.subsidiaries.map((item) => ({
    company: item.name,
    projectName: `${item.name}${sheetRiskLabel}跟踪项目`,
    warningStartDate: '2025-01-01',
    memberCompany: member.name,
    businessType: '非标',
    amount: item.amount,
  }));
}

function formatVankeRiskSheetLabel(label: string) {
  return label.replace('金额', '');
}

function LargeCustomerFilterSummary({
  filterCount,
  keyword,
  sortLabel,
  onKeywordChange,
  onOpenFilter,
  onOpenSort,
}: {
  filterCount: number;
  keyword: string;
  sortLabel: string;
  onKeywordChange: (keyword: string) => void;
  onOpenFilter: () => void;
  onOpenSort: () => void;
}) {
  return (
    <section className="mobile-demo-large-filter-summary" aria-label="当前筛选条件">
      <label className="mobile-demo-large-page-search">
        <Search size={17} />
        <input
          type="search"
          value={keyword}
          placeholder="搜索集团名称 / 客户名称"
          onChange={(event) => onKeywordChange(event.target.value)}
        />
      </label>
      <div className="mobile-demo-large-filter-actions">
        <button className="mobile-demo-large-tool-button" type="button" onClick={onOpenFilter}>
          <Filter size={15} />
          筛选条件 {filterCount}
        </button>
        <button className="mobile-demo-large-tool-button" type="button" onClick={onOpenSort}>
          <ArrowUpDown size={15} />
          排序：{sortLabel}
        </button>
      </div>
    </section>
  );
}

function LargeCustomerFullListSheet({
  filterCount,
  keyword,
  sortLabel,
  totalCount,
  visibleCount,
  rows,
  hasMore,
  nextCount,
  onKeywordChange,
  onOpenFilter,
  onOpenSort,
  onLoadMore,
}: {
  filterCount: number;
  keyword: string;
  sortLabel: string;
  totalCount: number;
  visibleCount: number;
  rows: LargeCustomerRow[];
  hasMore: boolean;
  nextCount: number;
  onKeywordChange: (keyword: string) => void;
  onOpenFilter: () => void;
  onOpenSort: () => void;
  onLoadMore: () => void;
}) {
  return (
    <section className="mobile-demo-large-full-list">
      <LargeCustomerFilterSummary
        filterCount={filterCount}
        keyword={keyword}
        sortLabel={sortLabel}
        onKeywordChange={onKeywordChange}
        onOpenFilter={onOpenFilter}
        onOpenSort={onOpenSort}
      />
      <div className="mobile-demo-large-full-status">
        <span>{formatLargeCustomerFullListStatus(totalCount, visibleCount)}</span>
      </div>
      <LargeCustomerCards rows={rows} />
      {hasMore ? (
        <button className="mobile-demo-large-load-more" type="button" onClick={onLoadMore}>
          加载更多 {nextCount} 家
          <ChevronDown size={16} />
        </button>
      ) : (
        <button className="mobile-demo-large-load-more is-complete" type="button" disabled>
          {totalCount > 0 ? `已显示全部 ${totalCount} 家` : '暂无可展示客户'}
        </button>
      )}
    </section>
  );
}

function LargeCustomerFilterTotalCard({ total }: { total: LargeCustomerTotal }) {
  return (
    <section className="mobile-demo-large-total-card" aria-label="当前筛选合计">
      <div className="mobile-demo-large-total-head">
        <strong>当前筛选合计</strong>
        <span>
          当前筛选 <b>{total.count}</b> 家
        </span>
      </div>
      <div className="mobile-demo-large-total-grid">
        <LargeCustomerTotalMetric label="持仓规模" value={`${formatLargeCustomerAmount(total.exposure)} 亿元`} variant="primary" />
        <LargeCustomerTotalMetric label="较上月" value={`${formatLargeCustomerChange(total.momChange)} 亿元`} signedValue={total.momChange} />
        <LargeCustomerTotalMetric label="较年初" value={`${formatLargeCustomerChange(total.ytdChange)} 亿元`} signedValue={total.ytdChange} />
      </div>
    </section>
  );
}

function LargeCustomerTotalMetric({
  label,
  value,
  signedValue,
  variant,
}: {
  label: string;
  value: string;
  signedValue?: number;
  variant?: 'primary';
}) {
  return (
    <span className={`mobile-demo-large-total-metric ${variant === 'primary' ? 'is-primary' : ''}`.trim()}>
      <em>{label}</em>
      <strong className={signedValue === undefined ? '' : largeCustomerChangeClass(signedValue)}>
        {value}
      </strong>
    </span>
  );
}

function LargeCustomerFilterSheet({
  draftFilters,
  previewCount,
  onDraftChange,
  onReset,
  onApply,
}: {
  draftFilters: LargeCustomerFilters;
  previewCount: number;
  onDraftChange: (filters: LargeCustomerFilters) => void;
  onReset: () => void;
  onApply: () => void;
}) {
  const updateDraft = (patch: Partial<LargeCustomerFilters>) => onDraftChange({ ...draftFilters, ...patch });
  const selectedSummary = describeLargeCustomerFilters(draftFilters);

  return (
    <div className="mobile-demo-large-sheet">
      <div className="mobile-demo-large-sheet-summary">
        <span>已选条件</span>
        <strong>{selectedSummary}</strong>
      </div>
      <LargeCustomerChipGroup
        title="管理分类"
        options={managementCategoryOptions}
        value={draftFilters.managementCategory}
        emphasized
        onChange={(managementCategory) => updateDraft({ managementCategory })}
      />
      <LargeCustomerChipGroup
        title="企业性质"
        options={ownershipFilterOptions}
        value={draftFilters.ownership}
        onChange={(ownership) => updateDraft({ ownership })}
      />
      <label className="mobile-demo-large-filter-field">
        <span>集团名称</span>
        <input
          className="mobile-demo-large-search-input"
          type="search"
          value={draftFilters.keyword}
          placeholder="搜索集团名称 / 客户名称"
          onChange={(event) => updateDraft({ keyword: event.target.value })}
        />
      </label>
      <label className="mobile-demo-large-filter-field">
        <span>日期</span>
        <em>最新日期 {draftFilters.date || defaultLargeCustomerFilters.date}</em>
        <input
          className="mobile-demo-large-date-input"
          type="date"
          value={draftFilters.date}
          onChange={(event) => updateDraft({ date: event.target.value || defaultLargeCustomerFilters.date })}
        />
      </label>
      <div className="mobile-demo-large-sheet-footer">
        <button className="mobile-demo-large-sheet-button is-secondary" type="button" onClick={onReset}>
          重置
        </button>
        <button className="mobile-demo-large-sheet-button is-primary" type="button" onClick={onApply}>
          {previewCount > 0 ? `查看 ${previewCount} 家` : '暂无匹配客户'}
        </button>
      </div>
    </div>
  );
}

function LargeCustomerChipGroup({
  title,
  options,
  value,
  emphasized = false,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  emphasized?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <section className="mobile-demo-large-chip-group">
      <h3>{title}</h3>
      <div>
        {options.map((option) => (
          <button
            className={`mobile-demo-large-option-chip ${option === value ? 'is-selected' : ''} ${emphasized ? 'is-emphasized' : ''}`.trim()}
            key={option}
            type="button"
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function LargeCustomerSortSheet({
  draftSort,
  onDraftSortChange,
  onCancel,
  onApply,
}: {
  draftSort: LargeCustomerSort;
  onDraftSortChange: (sort: LargeCustomerSort) => void;
  onCancel: () => void;
  onApply: () => void;
}) {
  return (
    <div className="mobile-demo-large-sort-sheet">
      <section className="mobile-demo-large-sort-section">
        <h3>排序字段</h3>
        <div className="mobile-demo-large-sort-chips">
          {largeCustomerSortOptions.map((option) => (
            <button
              className={draftSort.field === option.field ? 'is-selected' : ''}
              key={option.field}
              type="button"
              onClick={() => onDraftSortChange({ ...draftSort, field: option.field })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
      <section className="mobile-demo-large-sort-section">
        <h3>排序方向</h3>
        <div className="mobile-demo-large-sort-segment" role="group" aria-label="排序方向">
          {(['desc', 'asc'] as SortDirection[]).map((direction) => (
            <button
              className={draftSort.direction === direction ? 'is-selected' : ''}
              key={direction}
              type="button"
              onClick={() => onDraftSortChange({ ...draftSort, direction })}
            >
              {direction === 'desc' ? '降序' : '升序'}
            </button>
          ))}
        </div>
      </section>
      <p className="mobile-demo-large-sort-note">{largeCustomerSortDescription(draftSort)}</p>
      <div className="mobile-demo-large-sheet-footer">
        <button className="mobile-demo-large-sheet-button is-secondary" type="button" onClick={onCancel}>
          取消
        </button>
        <button className="mobile-demo-large-sheet-button is-primary" type="button" onClick={onApply}>
          应用排序
        </button>
      </div>
    </div>
  );
}

function LargeCustomerCards({ rows }: { rows: LargeCustomerRow[] }) {
  if (!rows.length) {
    return (
      <div className="mobile-demo-large-empty">
        <strong>暂无匹配客户</strong>
        <span>请调整筛选条件或搜索关键词</span>
      </div>
    );
  }

  return (
    <div className="mobile-demo-large-customer-list">
      {rows.map((item) => (
        <article className="mobile-demo-large-customer-card" key={item.name}>
          <div className="mobile-demo-large-customer-head">
            <div className="mobile-demo-large-customer-title">
              <strong>{item.name}</strong>
              <p className="mobile-demo-large-ownership">企业性质：{item.ownership}</p>
            </div>
            <div className="mobile-demo-large-customer-side">
              <MobileRiskBadge className="mobile-demo-large-category-badge" level={customerCategoryLevel(item.managementCategory)}>
                {item.managementCategory}
              </MobileRiskBadge>
            </div>
          </div>
          <div className="mobile-demo-large-customer-metrics">
            <LargeCustomerCardMetric label="持仓规模" value={`${formatLargeCustomerAmount(item.exposure)} 亿`} variant="primary" />
            <LargeCustomerCardMetric label="较上月" value={`${formatLargeCustomerChange(item.momChange)} 亿`} signedValue={item.momChange} />
            <LargeCustomerCardMetric label="较年初" value={`${formatLargeCustomerChange(item.ytdChange)} 亿`} signedValue={item.ytdChange} />
          </div>
        </article>
      ))}
    </div>
  );
}

function LargeCustomerCardMetric({
  label,
  value,
  signedValue,
  variant,
}: {
  label: string;
  value: string;
  signedValue?: number;
  variant?: 'primary';
}) {
  const toneClass = variant === 'primary' ? 'is-primary' : signedValue === undefined ? '' : largeCustomerChangeClass(signedValue);

  return (
    <span className={`mobile-demo-large-card-metric ${variant === 'primary' ? 'is-primary' : ''}`.trim()}>
      <em>{label}</em>
      <strong className={toneClass}>{value}</strong>
    </span>
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
    <div className="mobile-demo-holding-record-list">
      {details.map((item, index) => {
        const assetType = 'assetType' in item && typeof item.assetType === 'string' ? item.assetType : name;

        return (
          <article className="mobile-demo-holding-record-card" key={`${item.legalEntity}-${item.productName}-${index}`}>
            <strong className="mobile-demo-holding-record-entity">{item.legalEntity}</strong>
            <div className="mobile-demo-holding-record-metric">
              <span className={`mobile-demo-holding-asset-badge ${holdingAssetBadgeClass(assetType)}`.trim()}>{assetType}</span>
              <b>
                {formatHoldingAmount(item.amount)}
                <em>亿元</em>
              </b>
            </div>
            <p>{item.productName}</p>
            <span className="mobile-demo-holding-record-date">{item.startDate} → {item.endDate}</span>
          </article>
        );
      })}
    </div>
  );
}

function SingleWarningDrilldownAccordion() {
  return (
    <div className="mobile-demo-warning-drilldown">
      {singleLargeWarningDrilldown.map((risk, index) => {
        const riskAmount = singleLargeCustomerWarningMetrics[risk.key];

        return (
          <details className={`mobile-demo-warning-drilldown-card risk-${risk.key}`.trim()} key={risk.key} open={index === 0}>
            <summary>
              <span>
                <i className={`mobile-demo-risk-dot risk-${risk.key}`} />
                <strong>{risk.label}</strong>
              </span>
              <em>{formatRiskNumber(riskAmount)} 亿元</em>
              <ChevronDown className="mobile-demo-accordion-chevron" size={18} />
            </summary>
            <div className="mobile-demo-warning-drilldown-body">
              {risk.members.map((member) => (
                <section className="mobile-demo-warning-drilldown-member" key={`${risk.key}-${member.name}`}>
                  <div className="mobile-demo-row-head">
                    <strong>{member.name}</strong>
                    <span>{formatRiskNumber(member.amount)} 亿元</span>
                  </div>
                  <div className="mobile-demo-subsidiary-list">
                    {member.subsidiaries.map((item) => (
                      <div className="mobile-demo-subsidiary-row" key={`${member.name}-${item.name}`}>
                        <span>{item.name}</span>
                        <strong>{formatRiskNumber(item.amount)} 亿元</strong>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </details>
        );
      })}
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

function calculateLargeCustomerTotal(rows: LargeCustomerRow[]): LargeCustomerTotal {
  return rows.reduce(
    (total, item) => ({
      count: total.count + 1,
      exposure: total.exposure + item.exposure,
      momChange: total.momChange + item.momChange,
      ytdChange: total.ytdChange + item.ytdChange,
    }),
    { count: 0, exposure: 0, momChange: 0, ytdChange: 0 },
  );
}

function filterLargeCustomerRows(rows: LargeCustomerRow[], filters: LargeCustomerFilters) {
  const keyword = filters.keyword.trim();

  return rows
    .filter((item) => !keyword || item.name.includes(keyword))
    .filter((item) => filters.ownership === '全部' || item.ownership === filters.ownership)
    .filter((item) => filters.managementCategory === '全部' || item.managementCategory === filters.managementCategory);
}

function sortLargeCustomerRows(rows: LargeCustomerRow[], sort: LargeCustomerSort) {
  const direction = sort.direction === 'asc' ? 1 : -1;

  return [...rows].sort((a, b) => (a[sort.field] - b[sort.field]) * direction);
}

function countLargeCustomerFilters(filters: LargeCustomerFilters) {
  return [
    filters.managementCategory !== '全部',
    filters.ownership !== '全部',
    Boolean(filters.keyword.trim()),
    Boolean(filters.date),
  ].filter(Boolean).length;
}

function describeLargeCustomerFilters(filters: LargeCustomerFilters) {
  return [
    filters.managementCategory,
    filters.ownership === '全部' ? '全部企业性质' : filters.ownership,
    filters.keyword.trim() ? `集团：${filters.keyword.trim()}` : null,
    filters.date,
  ]
    .filter((item): item is string => Boolean(item))
    .join(' · ');
}

function largeCustomerSortLabel(field: LargeCustomerSortField) {
  return largeCustomerSortOptions.find((option) => option.field === field)?.label ?? '持仓规模';
}

function largeCustomerSortDescription(sort: LargeCustomerSort) {
  return `当前按「${largeCustomerSortLabel(sort.field)}」${sort.direction === 'desc' ? '从高到低' : '从低到高'}展示`;
}

function formatLargeCustomerPreviewStatus(totalCount: number, visibleCount: number) {
  if (totalCount === 0) return '当前筛选 0 家';
  if (totalCount <= mainLargeCustomerPreviewCount) return `当前筛选 ${totalCount} 家，已全部展示`;
  return `当前筛选 ${totalCount} 家，当前展示前 ${visibleCount} 家`;
}

function formatLargeCustomerFullListStatus(totalCount: number, visibleCount: number) {
  if (totalCount === 0) return '当前筛选 0 家';
  if (visibleCount >= totalCount) return `当前筛选 ${totalCount} 家，已显示全部 ${totalCount} 家`;
  return `当前筛选 ${totalCount} 家，已显示 1-${visibleCount} / ${totalCount}`;
}

function formatHoldingAmount(value: number) {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseHoldingRatio(ratio: string) {
  const parsedRatio = Number.parseFloat(ratio.replace('%', ''));
  return Number.isFinite(parsedRatio) ? parsedRatio : 0;
}

function holdingAssetBadgeClass(assetType: string) {
  if (assetType.includes('非标')) return 'is-nonstandard';
  if (assetType.includes('债券')) return 'is-bond';
  if (assetType.includes('股票')) return 'is-stock';
  if (assetType.includes('基金')) return 'is-fund';
  return 'is-other';
}

function formatLargeCustomerAmount(value: number) {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatLargeCustomerChange(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

function largeCustomerChangeClass(value: number) {
  if (value < 0) return 'is-negative';
  if (value > 0) return 'is-positive';
  return '';
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

export default MobileDemoApp;
