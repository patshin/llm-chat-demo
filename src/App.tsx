import { Fragment, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import {
  Bot,
  CalendarDays,
  ChevronDown,
  Download,
  Eraser,
  HelpCircle,
  MessageSquarePlus,
  Paperclip,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import {
  blackListItems,
  entityHitResult,
  externalRatingAgencies,
  externalRatingMeaning,
  financialInstitutionGroups,
  generalEnterpriseGroups,
  greyListItems,
  assetTypeHoldingDetails,
  holdingAssetTypeRows,
  holdingMemberCompanyRows,
  internalAnnualRatingRecords,
  internalRatingTrendData,
  keyManagementLargeCustomerTrendData,
  largeCustomerOverview,
  largeCustomerTableData,
  largeCustomerTrendData,
  nameListStats,
  NameListType,
  ratingEntitySummary,
  RiskStatus,
  singleLargeCustomerBlackListRecords,
  singleLargeCustomerAssetExposure,
  singleLargeCustomerCompanyExposure,
  singleLargeCustomerFundingSources,
  singleLargeCustomerGreyListRecords,
  memberCompanyHoldingDetails,
  singleLargeCustomerNameListSummary,
  singleLargeCustomerProfile,
  singleLargeCustomerWarningCompanyDistribution,
  singleLargeCustomerWarningEvents,
  singleLargeCustomerWarningMetrics,
  vankeMemberCompanyData,
  vankeMetrics,
  vankeRiskDrilldown,
  vankeTrendData,
  vankeWarningInsuranceSummary,
  warningInsuranceMemberDistribution,
  warningInsuranceOverview,
  warningInsuranceTrendData,
  whiteListItems,
} from './mockData';

type MainTab = 'overview' | 'details';
type SceneKey =
  | 'group'
  | 'counterparty'
  | 'namelist'
  | 'rating'
  | 'warning'
  | 'large'
  | 'singleLarge'
  | 'badAssets'
  | 'market'
  | 'liquidity';
type GroupTab = 'general' | 'financial';
type VankeTab = 'trend' | 'dimension';
type CounterpartyTab = 'trend' | 'dimension';
type LargeCustomerTab = 'trend' | 'dimension';
type SingleLargeCustomerTab = 'holding' | 'warning' | 'rating' | 'sentiment' | 'namelist';
type HoldingDimension = 'company' | 'asset';
type HoldingView = 'chart' | 'table';
type SingleWarningView = 'summary' | 'member';
type SingleWarningMode = 'chart' | 'table';
type SentimentRiskFilter = 'all' | 'high' | 'medium';
type RatingTab = 'internal' | 'external';
type WarningTab = 'trend' | 'dimension';
type TrendView = 'chart' | 'table';
type DimensionKey = 'member' | 'asset';

type NameListItem = {
  name: string;
  reason: string;
  date: string;
  reporter: string;
};

function App() {
  const [scene, setScene] = useState<SceneKey>('singleLarge');
  const stepTwoRef = useRef<HTMLElement>(null);
  const scrollToStepTwo = () => stepTwoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="app-shell">
      <Sidebar scene={scene} onSceneChange={setScene} />
      <main className="main-panel group-main">
        {scene === 'namelist' && (
          <>
            <BlacklistQueryView onAskEntity={scrollToStepTwo} />
            <EntityHitResultView refTarget={stepTwoRef} />
          </>
        )}
        {scene === 'group' && <GroupConcentrationScene />}
        {scene === 'counterparty' && <CounterpartyHoldingScene />}
        {scene === 'rating' && <RatingQueryView />}
        {scene === 'warning' && <WarningInsuranceQueryView />}
        {scene === 'large' && <LargeCustomerOverviewView />}
        {scene === 'singleLarge' && <SingleLargeCustomerView />}
        {['badAssets', 'market', 'liquidity'].includes(scene) && <LargeCustomerOverviewView />}
      </main>
    </div>
  );
}

function Sidebar({ scene, onSceneChange }: { scene: SceneKey; onSceneChange: (scene: SceneKey) => void }) {
  const menus: Array<{ key: SceneKey; label: string }> = [
    { key: 'group', label: '集团集中度分析' },
    { key: 'counterparty', label: '交易对手持仓分析' },
    { key: 'namelist', label: '黑灰白名单查询' },
    { key: 'rating', label: '评级查询' },
    { key: 'warning', label: '预警出险查询' },
    { key: 'singleLarge', label: '大户查询' },
    { key: 'badAssets', label: '整体大户情况' },
  ];
  const activeTitle = menus.find((menu) => menu.key === scene)?.label ?? '黑灰白名单查询';

  return (
    <aside className="sidebar">
      <div>
        <div className="brand risk-brand">
          <div className="brand-icon">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1>{activeTitle}</h1>
            <p>智能风控助手</p>
          </div>
        </div>
        <button className="new-chat">
          <MessageSquarePlus size={16} />
          新对话
        </button>
        <div className="section-label">今日对话</div>
        {menus.map((menu) => (
          <button
            className={`conversation menu-button ${menu.key === scene ? 'active' : ''}`}
            key={menu.key}
            onClick={() => onSceneChange(menu.key)}
          >
            <span>{menu.label}</span>
          </button>
        ))}
      </div>
      <button className="clear-chat">
        <Eraser size={15} />
        清空对话
      </button>
    </aside>
  );
}

function BlacklistQueryView({ onAskEntity }: { onAskEntity: () => void }) {
  const [tab, setTab] = useState<MainTab>('overview');

  return (
    <section className="scenario-card">
      <div className="step-title">
        <span>Step 1:</span>
        黑灰白名单整体情况
      </div>
      <div className="scenario-content-grid scenario-content-single">
        <div className="scenario-primary">
          <UserBubble>帮我看一下万科集团当前黑灰白名单情况</UserBubble>
          <AssistantMessage>
            <p className="assistant-text">
              当前名单库共收录主体 <strong>155 个</strong>，其中 <strong>黑名单 55 个</strong>、
              <strong>灰名单 70 个</strong>、<strong>白名单* 30 个</strong>。黑名单主体主要集中在地产、
              城投及部分高风险企业，建议重点关注 <strong>已命中黑名单</strong> 且仍存在
              <strong> 持仓敞口</strong> 的交易对手。
            </p>
          </AssistantMessage>

          <section className="analysis-card group-analysis-card">
            <div className="tabs">
              <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
                整体情况
              </button>
              <button className={tab === 'details' ? 'active' : ''} onClick={() => setTab('details')}>
                黑灰名单详情
              </button>
            </div>
            <div className="analysis-body">{tab === 'overview' ? <NameListOverview /> : <NameListDetails />}</div>
          </section>
        </div>
      </div>
    </section>
  );
}

const counterpartyTrendData = [
  { label: '2024-12', value: 210.32, mom: '-' },
  { label: '2025-01', value: 223.45, mom: '↑ 6.24%' },
  { label: '2025-02', value: 236.81, mom: '↑ 5.98%' },
  { label: '2025-03', value: 249.87, mom: '↑ 5.52%' },
  { label: '2025-04', value: 264.59, mom: '↑ 5.89%' },
  { label: '2025-05', value: 286.35, mom: '↑ 8.21%' },
];

const counterpartyMemberData = [
  { label: '银行', value: 100.12 },
  { label: '证券', value: 72.35 },
  { label: '信托', value: 48.26 },
  { label: '资管', value: 32.18 },
  { label: '基金', value: 21.66 },
  { label: '其他', value: 11.78 },
];

const counterpartyAssetData = [
  { label: '债券', value: 167.28 },
  { label: '股票', value: 68.74 },
  { label: '基金', value: 28.31 },
  { label: '非标', value: 14.22 },
  { label: '现金及其他', value: 7.8 },
];

const counterpartyStackedData = [
  { label: '银行', total: 100.12, values: [52.36, 28.21, 12.15, 5.4, 2] },
  { label: '证券', total: 72.35, values: [36.28, 20.14, 8.05, 4.7, 3.18] },
  { label: '信托', total: 48.26, values: [22.31, 12.36, 7.56, 3.11, 2.92] },
  { label: '资管', total: 32.18, values: [15.26, 7.85, 5.12, 2.15, 1.8] },
  { label: '基金', total: 21.66, values: [9.87, 6.12, 3.44, 1.49, 0.74] },
  { label: '其他', total: 11.78, values: [5.2, 3.1, 1.6, 1.4, 0.48] },
];

const stackLegend = [
  { label: '债券', color: '#ff6a00' },
  { label: '股票', color: '#3b82f6' },
  { label: '基金', color: '#22c55e' },
  { label: '非标', color: '#a855f7' },
  { label: '其他', color: '#9ca3af' },
];

function GroupConcentrationScene() {
  const stepTwoRef = useRef<HTMLElement>(null);
  const scrollToStepTwo = () => stepTwoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <GroupOverviewStep onAskVanke={scrollToStepTwo} />
      <VankeConcentrationStep refTarget={stepTwoRef} />
    </>
  );
}

function GroupOverviewStep({ onAskVanke }: { onAskVanke: () => void }) {
  const [tab, setTab] = useState<GroupTab>('general');
  const data = tab === 'general' ? generalEnterpriseGroups : financialInstitutionGroups;
  const title = tab === 'general' ? '一般企业集团集中度额度占用情况' : '金融机构集团集中度额度占用情况';

  return (
    <section className="scenario-card">
      <div className="step-title">
        <span>场景 1:</span>
        集团整体集中度分析
      </div>
      <div className="scenario-content-grid scenario-content-single">
        <div className="scenario-primary">
          <UserBubble>帮我看一下集团集中度风险情况</UserBubble>
          <AssistantMessage>
            <p className="assistant-text">
              截至 <strong>2025-05-31</strong>，当前查询到 <strong>2 户</strong> 超限集团，<strong>1 户</strong> 预警集团。
              当日新增超限 <strong>1 户</strong>，新增预警 <strong>0 户</strong>。建议持续关注超限集团的规模变化及后续风险迁移情况。
            </p>
          </AssistantMessage>
          <section className="analysis-card group-analysis-card">
            <div className="tabs pill-tabs">
              <button className={tab === 'general' ? 'active' : ''} onClick={() => setTab('general')}>
                一般企业集团
              </button>
              <button className={tab === 'financial' ? 'active' : ''} onClick={() => setTab('financial')}>
                金融机构集团
              </button>
            </div>
            <div className="analysis-body">
              <div className="analysis-heading">
                <div>
                  <h2>{title}</h2>
                </div>
                <span className="unit-label">单位：亿元</span>
              </div>
              <HorizontalBarChart data={data} />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function VankeConcentrationStep({ refTarget }: { refTarget: RefObject<HTMLElement | null> }) {
  const [tab, setTab] = useState<VankeTab>('trend');

  return (
    <section className="scenario-card" ref={refTarget}>
      <div className="step-title">
        <span>场景 2:</span>
        单一交易对手集中度分析 - 万科集团
      </div>
      <div className="scenario-content-grid scenario-content-single">
        <div className="scenario-primary">
          <UserBubble>万科集团集中度具体怎么样？</UserBubble>
          <AssistantMessage>
            <p className="assistant-text">
              <strong>万科集团</strong> 当前集中度限额为 <strong>800 亿元</strong>，已占用额度
              <strong> 650 亿元</strong>，限额占用率 <strong>78.6%</strong>，建议重点关注 <strong>银行</strong>、
              <strong>寿险</strong> 等成员公司的敞口变化。
            </p>
            <MetricGrid metrics={vankeMetrics} />
          </AssistantMessage>
          <section className="analysis-card group-analysis-card">
            <div className="tabs">
              <button className={tab === 'trend' ? 'active' : ''} onClick={() => setTab('trend')}>
                趋势分析
              </button>
              <button className={tab === 'dimension' ? 'active' : ''} onClick={() => setTab('dimension')}>
                维度分析
              </button>
            </div>
            <div className="analysis-body">
              {tab === 'trend' ? (
                <ComboTrendChart />
              ) : (
                <>
                  <div className="analysis-heading">
                    <h2>万科集团在各成员公司的持仓分布（当前）</h2>
                    <span className="unit-label">单位：亿元</span>
                  </div>
                  <VerticalBarChart data={vankeMemberCompanyData.map((item) => ({ label: item.name, value: item.value }))} max={290} />
                </>
              )}
            </div>
          </section>
        </div>
      </div>
      <ChatInput />
      <div className="disclaimer">内容由大模型生成，仅供参考</div>
    </section>
  );
}

function CounterpartyHoldingScene() {
  const [tab, setTab] = useState<CounterpartyTab>('trend');

  return (
    <section className="scenario-card">
      <div className="step-title">
        <span>场景</span>
        交易对手持仓分析
      </div>
      <div className="scenario-content-grid counterparty-single-column">
        <div className="scenario-primary">
          <UserBubble>帮我看一下万科的持仓情况</UserBubble>
          <AssistantMessage>
            <p className="assistant-title">好的，以下是万科持仓分析结果：</p>
            <p className="assistant-text">
              当前交易对手持仓总规模为 <strong>286.35 亿元</strong>，较上月增长 <strong>8.21%</strong>。
              持仓主要集中在 <strong>平安银行、平安信托、平安证券</strong> 等平安系成员公司，其中平安银行持仓规模最高；
              从三级资产类型看，持仓主要分布在 <strong>债券、信贷、零售对公</strong>，其中债券类资产占比较高。
              整体集中度处于 <strong>可控范围</strong>，建议持续关注平安系成员公司及三级资产配置变化。
            </p>
          </AssistantMessage>
          <section className="analysis-card group-analysis-card">
            <div className="tabs">
              <button className={tab === 'trend' ? 'active' : ''} onClick={() => setTab('trend')}>
                趋势分析
              </button>
              <button className={tab === 'dimension' ? 'active' : ''} onClick={() => setTab('dimension')}>
                维度分析
              </button>
            </div>
            <div className="analysis-body">{tab === 'trend' ? <CounterpartyTrendAnalysis /> : <CounterpartyDimensionAnalysis />}</div>
          </section>
          <ChatInput />
        </div>
      </div>
    </section>
  );
}

const largeCustomerMetrics = [
  { title: '总持仓规模', value: '285.53', unit: '亿元', change: '较上月 +12.80 亿元', subChange: '较年初 +4.70%' },
  { title: '最大专业公司散口', value: '137.01', unit: '亿元', change: '银行, 占比 48.01%' },
  { title: '出险预警金额', value: '217.82', unit: '亿元', change: '' },
  { title: '黑灰名单客户（户）', value: '87382', unit: '', change: '较上月末 +130 户' },
  { title: '最新评级（内部）', value: '7A', unit: '', change: '2025-06-20' },
];

function LargeCustomerOverviewView() {
  const [tab, setTab] = useState<LargeCustomerTab>('trend');

  return (
    <section className="scenario-card large-customer-page">
      <div className="step-title">大户查询</div>
      <div className="scenario-content-grid large-customer-grid scenario-content-single">
        <div className="scenario-primary">
          <UserBubble>帮我看一下集团整体大户情况</UserBubble>
          <AssistantMessage>
            <p className="answer-copy large-answer">
              截至 <strong>{largeCustomerOverview.date}</strong>，集团大户客户共
              <strong> 325 家</strong>，整体持仓规模 <strong>3,286.75 亿元</strong>，较上月增加
              <strong> 128.63 亿元</strong>，较年初增加 <strong>512.34 亿元</strong>。其中
              <strong>重点管理大户 126 家</strong>，持仓规模 <strong>1,871.36 亿元</strong>，占比
              <strong> 56.96%</strong>。建议持续关注高敞口且伴随预警、出险、黑灰名单或评级承压的大户客户。
            </p>
            <div className="metric-grid large-metric-grid">
              {largeCustomerMetrics.map((metric) => (
                <LargeCustomerMetricCard key={metric.title} {...metric} />
              ))}
            </div>
          </AssistantMessage>
          <section className="analysis-card group-analysis-card large-analysis-card">
            <div className="tabs">
              <button className={tab === 'trend' ? 'active' : ''} onClick={() => setTab('trend')}>
                趋势分析
              </button>
              <button className={tab === 'dimension' ? 'active' : ''} onClick={() => setTab('dimension')}>
                维度分析
              </button>
            </div>
            <div className="analysis-body">
              {tab === 'trend' ? <LargeCustomerTrendPanel /> : <LargeCustomerDimensionPanel />}
            </div>
          </section>
        </div>
      </div>
      <ChatInput />
      <div className="disclaimer">内容由大模型生成，仅供参考</div>
    </section>
  );
}

function LargeCustomerMetricCard({
  title,
  value,
  unit,
  change,
  subChange,
}: {
  title: string;
  value: string;
  unit: string;
  change: string;
  subChange?: string;
}) {
  return (
    <div className="metric-card large-metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value-row">
        <span className="metric-value">{value}</span>
        <span className="metric-unit">{unit}</span>
      </div>
      <div className="metric-change">
        <div>{change}</div>
        {subChange && <div>{subChange}</div>}
      </div>
    </div>
  );
}

function LargeCustomerTrendPanel() {
  const data = largeCustomerTrendData;

  return (
    <div className="large-panel">
      <div className="analysis-heading large-chart-heading">
        <div>
          <h2>大户数量及持仓规模趋势</h2>
          <span>柱子为大户数量，折线为大户总持仓规模</span>
        </div>
      </div>
      <LargeCustomerTrendChart data={data} />
    </div>
  );
}

function LargeCustomerDimensionPanel() {
  return (
    <div className="large-panel">
      <LargeCustomerFilterBar mode="dimension" />
      <div className="analysis-heading large-table-heading">
        <div>
          <h2>大户客户明细</h2>
          <span>默认管理分类：重点管理</span>
        </div>
      </div>
      <LargeCustomerTable />
    </div>
  );
}

function LargeCustomerFilterBar({
  mode,
  keyOnly,
  onKeyOnlyChange,
}: {
  mode: 'trend' | 'dimension';
  keyOnly?: boolean;
  onKeyOnlyChange?: (checked: boolean) => void;
}) {
  return (
    <div className="large-filter-card">
      <FilterSelect label="集团名称" defaultValue="全部" options={mode === 'trend' ? ['全部', '万科企业集团', '华侨城集团', '龙湖集团'] : ['全部', '万科企业集团', '华侨城集团', '龙湖集团', '中国中铁股份有限公司', '碧桂园控股有限公司']} />
      <FilterSelect label="企业性质" defaultValue="全部" options={['全部', '地方国企', '外企', '外资', '央企', '民企', '混合', '金融机构']} />
      <FilterSelect label="管理分类" defaultValue={mode === 'dimension' ? '重点管理' : '全部'} options={['全部', '重点管理', '常态管理', '出险']} />
      <div className="filter-field date-field">
        <label>日期</label>
        <button type="button">
          <span>{mode === 'trend' ? '2024-12-01  ~  2025-06-30' : '2025-06-30'}</span>
          <CalendarDays size={15} />
        </button>
      </div>
      {mode === 'trend' && (
        <label className="key-only-check">
          <input
            type="checkbox"
            checked={Boolean(keyOnly)}
            onChange={(event) => onKeyOnlyChange?.(event.target.checked)}
          />
          仅看重点管理
        </label>
      )}
      <div className="filter-actions">
        <button className="primary-filter-btn">
          <Search size={14} />
          查询
        </button>
        <button className="plain-filter-btn">
          <RotateCcw size={14} />
          重置
        </button>
        {mode === 'dimension' && (
          <button className="plain-filter-btn">
            <Download size={14} />
            导出
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, defaultValue, options, wide }: { label: string; defaultValue: string; options: string[]; wide?: boolean }) {
  return (
    <div className={`filter-field ${wide ? 'wide' : ''}`}>
      <label>{label}</label>
      <select defaultValue={defaultValue} aria-label={label}>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function LargeCustomerTrendChart({
  data,
}: {
  data: Array<{ month: string; customerCount: number; totalExposure: number }>;
}) {
  const width = 920;
  const height = 330;
  const padding = { top: 40, right: 74, bottom: 52, left: 58 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const countMax = Math.ceil(Math.max(...data.map((item) => item.customerCount)) / 80) * 80;
  const exposureMax = Math.ceil(Math.max(...data.map((item) => item.totalExposure)) / 800) * 800;
  const step = plotWidth / data.length;
  const barWidth = 24;
  const baselineY = padding.top + plotHeight;
  const points = data.map((item, index) => ({
    ...item,
    x: padding.left + step * index + step / 2,
    y: padding.top + (1 - item.totalExposure / exposureMax) * plotHeight,
  }));
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <div className="large-trend-chart">
      <div className="large-chart-legend">
        <span><i className="legend-bar" />大户数量（家）</span>
        <span><i className="legend-line" />大户总持仓规模（亿元）</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="大户数量及持仓规模趋势">
        <defs>
          <linearGradient id="largeCustomerBar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff8a3d" />
            <stop offset="100%" stopColor="#ffb36c" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((tick) => {
          const y = padding.top + (plotHeight / 4) * tick;
          const countLabel = Math.round(countMax - (countMax / 4) * tick);
          const exposureLabel = Math.round(exposureMax - (exposureMax / 4) * tick).toLocaleString('zh-CN');
          return (
            <g key={tick}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="grid-line" />
              <text x={padding.left - 18} y={y + 4} textAnchor="end" className="svg-axis">{countLabel}</text>
              <text x={width - padding.right - 6} y={y + 4} textAnchor="end" className="svg-axis">{exposureLabel}</text>
            </g>
          );
        })}
        <line x1={padding.left} x2={width - padding.right} y1={baselineY} y2={baselineY} className="grid-line" />
        <text x={padding.left - 34} y={padding.top - 16} className="svg-axis">大户数量（家）</text>
        <text x={width - padding.right - 8} y={padding.top - 16} textAnchor="end" className="svg-axis">持仓规模（亿元）</text>
        {data.map((item, index) => {
          const x = padding.left + step * index + step / 2 - barWidth / 2;
          const barHeight = (item.customerCount / countMax) * plotHeight;
          const y = padding.top + plotHeight - barHeight;
          return (
            <g key={item.month}>
              <rect className="large-count-bar" x={x} y={y} width={barWidth} height={barHeight} rx="5" />
              <text x={x + barWidth / 2} y={y + 20} textAnchor="middle" className="svg-label bar-count">{item.customerCount}</text>
              <text x={x + barWidth / 2} y={baselineY + 26} textAnchor="middle" className="svg-axis">{item.month}</text>
            </g>
          );
        })}
        <path d={linePath} className="large-exposure-line" />
        {points.map((point) => (
          <g key={`${point.month}-point`}>
            <circle cx={point.x} cy={point.y} r="4.5" className="large-line-dot" />
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor={point.x > width - padding.right - 16 ? 'end' : point.x < padding.left + 16 ? 'start' : 'middle'}
              className="svg-label"
            >
              {point.totalExposure.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function LargeCustomerTable() {
  const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
  const rows = [...largeCustomerTableData].sort((a, b) => b.exposure - a.exposure);

  return (
    <div className="large-table-card">
      <div className="table-scroll-area">
        <table className="data-table large-customer-table">
          <thead>
            <tr>
              <th>企业名称</th>
              <th>企业性质</th>
              <th>管理分类</th>
              <th>持仓规模（亿元）</th>
              <th>较上月（亿元）</th>
              <th>较年初（亿元）</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.ownership}</td>
                <td>{item.managementCategory}</td>
                <td className="num-cell">{item.exposure.toFixed(2)}</td>
                <td className={`num-cell ${item.momChange >= 0 ? 'up' : 'down'}`}>{formatChange(item.momChange)}</td>
                <td className={`num-cell ${item.ytdChange >= 0 ? 'up' : 'down'}`}>{formatChange(item.ytdChange)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const singleLargeMetrics = [
  { title: '总持仓规模', value: '285.53', unit: '亿元', change: '较上月 +12.80 亿元', subChange: '较年初 +4.70%' },
  { title: '最大专业公司敞口', value: '137.01', unit: '亿元', change: '银行, 占比 48.01%' },
  { title: '出险预警金额', value: '217.82', unit: '亿元', change: '' },
  { title: '黑灰名单', value: '黑名单 4 条', unit: '', change: '灰名单 6 条' },
  { title: '最新评级（内部）', value: '7A', unit: '', change: '2025-06-20' },
];

function SingleLargeCustomerView() {
  const [tab, setTab] = useState<SingleLargeCustomerTab>('holding');
  const tabs: Array<{ key: SingleLargeCustomerTab; label: string }> = [
    { key: 'holding', label: '持仓规模' },
    { key: 'warning', label: '出险预警' },
    { key: 'rating', label: '评级' },
    { key: 'sentiment', label: '舆情' },
    { key: 'namelist', label: '黑灰名单' },
  ];

  return (
    <section className="scenario-card single-large-page">
      <div className="step-title">单一大户查询</div>
      <div className="scenario-content-grid large-customer-grid scenario-content-single">
        <div className="scenario-primary">
          <UserBubble>万科企业集团大户情况怎么样？</UserBubble>
          <AssistantMessage>
            <p className="answer-copy large-answer">
              <strong>万科企业集团</strong>当前为<strong>重点管理大户</strong>，整体持仓规模为
              <strong> 285.53 亿元</strong>，主要分布在<strong>银行</strong>、<strong>不动产</strong>
              和<strong>资产管理</strong>等专业公司；<strong>出险预警金额较高</strong>，
              <strong>评级存在一定承压迹象</strong>，并命中<strong>黑名单</strong>及<strong>灰名单</strong>记录。
              建议持续关注持仓结构、预警出险变化、评级迁徙及负面舆情变化。
            </p>
          </AssistantMessage>
          <div className="metric-grid single-metric-grid">
            {singleLargeMetrics.map((metric) => (
              <LargeCustomerMetricCard key={metric.title} {...metric} />
            ))}
          </div>
          <section className="analysis-card group-analysis-card large-analysis-card single-tab-card">
            <div className="tabs single-tabs">
              {tabs.map((item) => (
                <button key={item.key} className={tab === item.key ? 'active' : ''} onClick={() => setTab(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="analysis-body">
              {tab === 'holding' && <HoldingScaleTab />}
              {tab === 'warning' && <WarningInsuranceTab />}
              {tab === 'rating' && <SingleRatingTab />}
              {tab === 'sentiment' && <SentimentTab />}
              {tab === 'namelist' && <NameListTab />}
            </div>
          </section>
        </div>
      </div>
      <ChatInput />
      <div className="disclaimer">内容由大模型生成，仅供参考</div>
    </section>
  );
}

function HoldingScaleTab() {
  const [dimension, setDimension] = useState<HoldingDimension>('company');
  const [view, setView] = useState<HoldingView>('chart');
  const [expandedMemberRow, setExpandedMemberRow] = useState<string | null>(null);
  const [expandedAssetRow, setExpandedAssetRow] = useState<string | null>(null);
  const distributionData = dimension === 'company' ? singleLargeCustomerCompanyExposure : singleLargeCustomerAssetExposure;
  const distributionTitle = dimension === 'company' ? '成员公司分布（按持仓规模）' : '资产类型分布（按持仓规模）';
  const distributionTableTitle = dimension === 'company' ? '成员公司分布明细' : '资产类型分布明细';
  const dimensionLabel = dimension === 'company' ? '成员公司' : '资产类型';
  const distributionRows = dimension === 'company' ? holdingMemberCompanyRows : holdingAssetTypeRows;
  const expandedRow = dimension === 'company' ? expandedMemberRow : expandedAssetRow;
  const toggleExpandedRow = (name: string) => {
    if (dimension === 'company') {
      setExpandedMemberRow((current) => (current === name ? null : name));
      return;
    }
    setExpandedAssetRow((current) => (current === name ? null : name));
  };

  return (
    <div className="single-tab-panel">
      <p className="sub-summary">
        <strong>万科企业集团</strong>持仓规模 <strong>285.53 亿元</strong>，主要集中在<strong>银行 137.01 亿元</strong>，
        占比 <strong>48.01%</strong>；<strong>不动产 70.69 亿元</strong>，占比 <strong>24.76%</strong>。
        从资产类型看，<strong>非标</strong>和<strong>债券</strong>类资产占比较高，建议持续关注到期分布及敞口变化。
      </p>
      <div className="single-chart-card">
        <div className="holding-toolbar">
          <div className="dimension-switch">
            <span>分析维度：</span>
            <button className={dimension === 'company' ? 'active' : ''} type="button" onClick={() => setDimension('company')}>
              成员公司
            </button>
            <button className={dimension === 'asset' ? 'active' : ''} type="button" onClick={() => setDimension('asset')}>
              资产类型
            </button>
          </div>
          <div className="view-switch">
            <button className={view === 'chart' ? 'active' : ''} type="button" onClick={() => setView('chart')}>
              图表
            </button>
            <button className={view === 'table' ? 'active' : ''} type="button" onClick={() => setView('table')}>
              表格
            </button>
          </div>
        </div>
        <div className="analysis-heading">
          <div>
            <h2>{view === 'chart' ? distributionTitle : distributionTableTitle}</h2>
            <span>单位：亿元</span>
          </div>
        </div>
        {view === 'chart' ? (
          <CompanyExposureBars data={distributionData} highlight={dimension === 'company' ? '银行' : '非标'} tone={dimension === 'asset' ? 'blue' : 'orange'} />
        ) : (
          <HoldingDistributionTable
            dimension={dimension}
            label={dimensionLabel}
            rows={distributionRows}
            expandedRow={expandedRow}
            onToggleRow={toggleExpandedRow}
          />
        )}
      </div>
    </div>
  );
}

function HoldingDistributionTable({
  dimension,
  label,
  rows,
  expandedRow,
  onToggleRow,
}: {
  dimension: HoldingDimension;
  label: string;
  rows: Array<{ name: string; amount: number; ratio: string }>;
  expandedRow: string | null;
  onToggleRow: (name: string) => void;
}) {
  const total = rows.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="table-wrap holding-distribution-wrap">
      <table className="data-table holding-distribution-table">
        <thead>
          <tr>
            <th>{label}</th>
            <th>持仓规模（亿元）</th>
            <th>占比</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const isExpanded = expandedRow === item.name;

            return (
              <Fragment key={item.name}>
              <tr key={item.name}>
                <td>{item.name}</td>
                <td className="num-cell">{item.amount.toFixed(2)}</td>
                <td className="num-cell">{item.ratio}</td>
                <td className="action-cell">
                  <button
                    className={`expand-row-btn ${isExpanded ? 'active' : ''}`}
                    type="button"
                    aria-label={`${isExpanded ? '收起' : '展开'}${item.name}持仓明细`}
                    onClick={() => onToggleRow(item.name)}
                  >
                    <ChevronDown size={16} />
                  </button>
                </td>
              </tr>
              {isExpanded && (
                <tr className="expanded-detail-row" key={`${item.name}-detail`}>
                  <td colSpan={4}>
                    <HoldingInlineDetails dimension={dimension} name={item.name} />
                  </td>
                </tr>
              )}
              </Fragment>
            );
          })}
          <tr className="total-row">
            <td>合计</td>
            <td className="num-cell">{total.toFixed(2)}</td>
            <td className="num-cell">100.00%</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function HoldingInlineDetails({ dimension, name }: { dimension: HoldingDimension; name: string }) {
  const details =
    dimension === 'company'
      ? (memberCompanyHoldingDetails[name as keyof typeof memberCompanyHoldingDetails] ?? [])
      : (assetTypeHoldingDetails[name as keyof typeof assetTypeHoldingDetails] ?? []);
  const isMemberDimension = dimension === 'company';

  return (
    <div className="inline-holding-detail">
      <h3>{name} - 持仓明细</h3>
      {details.length ? (
        <div className="inline-detail-scroll">
          <table className={`inline-detail-table ${isMemberDimension ? 'member-detail-table' : 'asset-detail-table'}`}>
            <thead>
              <tr>
                <th>分法人公司</th>
                <th>专业公司</th>
                {isMemberDimension && <th>资产类型</th>}
                <th>证券/产品名称</th>
                <th>起息日</th>
                <th>到期日</th>
                <th>持仓规模（亿元）</th>
              </tr>
            </thead>
            <tbody>
              {details.map((row) => {
                const assetType = 'assetType' in row && typeof row.assetType === 'string' ? row.assetType : '';

                return (
                  <tr key={`${row.legalEntity}-${row.productName}`}>
                    <td>{row.legalEntity}</td>
                    <td>{row.memberCompany}</td>
                    {isMemberDimension && (
                      <td>{assetType ? <span className={`asset-type-tag asset-${assetType}`}>{assetType}</span> : '-'}</td>
                    )}
                    <td>{row.productName}</td>
                    <td>{row.startDate}</td>
                    <td>{row.endDate}</td>
                    <td className="num-cell">{row.amount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-inline-detail">暂无明细数据</div>
      )}
      </div>
  );
}

function WarningInsuranceTab() {
  const warningMetrics = [
    { title: '重大预警金额', value: singleLargeCustomerWarningMetrics.major.toFixed(2), unit: '亿元', change: '' },
    { title: '二级预警金额', value: singleLargeCustomerWarningMetrics.second.toFixed(2), unit: '亿元', change: '' },
    { title: '一级预警金额', value: singleLargeCustomerWarningMetrics.first.toFixed(2), unit: '亿元', change: '' },
    { title: '出险金额', value: singleLargeCustomerWarningMetrics.defaulted.toFixed(2), unit: '亿元', change: '' },
  ];

  return (
    <div className="single-tab-panel">
      <p className="sub-summary">
        <strong>万科企业集团</strong>出险预警金额合计 <strong>217.82 亿元</strong>，其中重大预警金额
        <strong> 30.00 亿元</strong>、二级预警金额 <strong>50.00 亿元</strong>、一级预警金额
        <strong> 117.82 亿元</strong>、出险金额 <strong>20.00 亿元</strong>。风险主要集中在银行、不动产和资产管理等专业公司。
      </p>
      <div className="mini-metric-grid">
        {warningMetrics.map((metric) => (
          <LargeCustomerMetricCard key={metric.title} {...metric} />
        ))}
      </div>
      <SingleLargeWarningAnalysisCard />
    </div>
  );
}

function SingleRatingTab() {
  const [tab, setTab] = useState<RatingTab>('internal');
  const [meaningOpen, setMeaningOpen] = useState(false);

  return (
    <div className="single-tab-panel single-rating-query-panel">
      <p className="sub-summary">
        <strong>深圳华侨城股份有限公司</strong>当前<strong>内部信评</strong>最高为 <strong>3B</strong>，
        最低为 <strong>3D</strong>；最新<strong>外部评级</strong>为 <strong>大公国际 AAA</strong>，
        整体外部评级处于较高水平。外部评级整体较稳定，但内部统一信评低于外部评级表现，
        建议关注集团内部口径下的信用风险变化。
      </p>
      <div className="analysis-card rating-analysis single-rating-analysis">
        <div className="tabs">
          <button className={tab === 'internal' ? 'active' : ''} onClick={() => setTab('internal')}>
            内部评级
          </button>
          <button className={tab === 'external' ? 'active' : ''} onClick={() => setTab('external')}>
            外部评级
          </button>
        </div>
        {tab === 'internal' ? <InternalRatingPanel /> : <ExternalRatingPanel onShowMeaning={() => setMeaningOpen(true)} />}
      </div>
      {meaningOpen && <RatingMeaningPopover onClose={() => setMeaningOpen(false)} />}
    </div>
  );
}

function SentimentTab() {
  const [riskFilter, setRiskFilter] = useState<SentimentRiskFilter>('all');
  const [activeItem, setActiveItem] = useState<SentimentFeedItem | null>(singleLargeCustomerSentimentFeed.high[0]);
  const showHigh = riskFilter === 'all' || riskFilter === 'high';
  const showMedium = riskFilter === 'all' || riskFilter === 'medium';

  return (
    <div className="single-tab-panel">
      <div className="sentiment-workspace">
        <div className="sentiment-feed-area">
          <div className="sentiment-summary-card">
            <div className="sentiment-summary-icon">≡</div>
            <p>
              近一个月，万科企业集团相关舆情共 <strong>18 条</strong>，其中高风险舆情 <strong>5 条</strong>、
              中风险舆情 <strong>13 条</strong>。高风险舆情主要集中在债务展期、融资压力和项目交付风险；
              中风险舆情主要涉及销售回款放缓、区域项目经营波动等。建议优先关注高风险舆情的持续发酵情况。
            </p>
          </div>
          <div className="sentiment-filter-row">
            <div className="sentiment-filter-group">
              <span>风险等级：</span>
              {[
                { key: 'all', label: '全部' },
                { key: 'high', label: '高风险' },
                { key: 'medium', label: '中风险' },
              ].map((item) => (
                <button
                  className={riskFilter === item.key ? 'active' : ''}
                  key={item.key}
                  onClick={() => setRiskFilter(item.key as SentimentRiskFilter)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="sentiment-date-range">
              <CalendarDays size={15} />
              近一个月
              <ChevronDown size={15} />
            </div>
          </div>
          {showHigh && (
            <SentimentFeedSection
              title="高风险舆情"
              count={5}
              level="high"
              items={singleLargeCustomerSentimentFeed.high}
              onOpen={setActiveItem}
            />
          )}
          {showMedium && (
            <SentimentFeedSection
              title="中风险舆情"
              count={13}
              level="medium"
              items={singleLargeCustomerSentimentFeed.medium}
              onOpen={setActiveItem}
            />
          )}
        </div>
        {activeItem && <SentimentDetailDrawer item={activeItem} onClose={() => setActiveItem(null)} />}
      </div>
    </div>
  );
}

type SentimentFeedItem = {
  title: string;
  customer: string;
  date: string;
  level: 'high' | 'medium';
  summary: string;
  body: string;
};

const singleLargeCustomerSentimentFeed: Record<'high' | 'medium', SentimentFeedItem[]> = {
  high: [
    {
      title: '万科推进债务展期安排，部分融资工具兑付压力上升',
      customer: '万科企业集团',
      date: '2025-06-18',
      level: 'high',
      summary: '市场消息显示，万科相关债务展期安排仍在推进，部分融资工具存在再融资压力，需关注后续兑付进展。',
      body: '近期市场消息显示，万科相关债务展期安排仍在推进，部分融资工具存在再融资压力。结合当前持仓规模、预警出险情况及评级变化，该舆情可能进一步影响集团内部风险判断。建议持续跟踪后续兑付安排、融资工具展期进展及相关主体公告。',
    },
    {
      title: '万科部分项目交付压力增加，引发市场关注',
      customer: '万科企业集团',
      date: '2025-06-15',
      level: 'high',
      summary: '部分区域项目交付节奏受到关注，可能影响客户经营稳定性和市场信心。',
      body: '近期部分区域项目交付压力增加，市场对相关项目后续进度存在关注。该事件可能对企业现金流、销售节奏和外部评级产生一定影响，建议跟踪重点项目交付进展。',
    },
    {
      title: '万科融资环境持续承压，再融资成本上升',
      customer: '万科企业集团',
      date: '2025-06-10',
      level: 'high',
      summary: '外部融资环境偏紧，企业再融资成本存在上行压力。',
      body: '受行业环境和市场风险偏好影响，万科融资环境持续承压。若再融资能力继续弱化，可能影响存量债务滚续和后续兑付安排。',
    },
  ],
  medium: [
    {
      title: '万科部分区域销售回款放缓，项目去化压力增加',
      customer: '万科企业集团',
      date: '2025-06-12',
      level: 'medium',
      summary: '部分区域项目销售回款节奏放缓，对短期现金流形成一定压力。',
      body: '近期部分区域项目销售回款节奏放缓，项目去化压力有所增加。该类舆情暂未形成重大风险事件，但可能影响现金流稳定性，需要持续观察。',
    },
    {
      title: '房地产行业政策边际调整，万科相关项目受市场关注',
      customer: '万科企业集团',
      date: '2025-06-06',
      level: 'medium',
      summary: '地产行业政策变化带来市场预期波动，部分项目经营表现仍需观察。',
      body: '房地产行业政策持续调整，市场预期仍在修复过程中。万科作为重点房企，其项目销售、融资和交付情况受到市场关注。',
    },
    {
      title: '万科部分城市项目销售折扣力度加大',
      customer: '万科企业集团',
      date: '2025-05-28',
      level: 'medium',
      summary: '部分城市项目加大促销力度，可能对利润率形成一定压力。',
      body: '近期部分城市项目销售折扣力度加大，可能对项目毛利率和后续现金回款形成一定影响。建议结合区域销售数据持续观察。',
    },
  ],
};

function SentimentFeedSection({
  title,
  count,
  level,
  items,
  onOpen,
}: {
  title: string;
  count: number;
  level: 'high' | 'medium';
  items: SentimentFeedItem[];
  onOpen: (item: SentimentFeedItem) => void;
}) {
  return (
    <section className={`sentiment-section sentiment-${level}`}>
      <h2>
        {title} <strong>{count}</strong> 条
      </h2>
      <div className="sentiment-feed-list">
        {items.map((item) => (
          <button className="sentiment-feed-card" key={item.title} onClick={() => onOpen(item)}>
            <div className="sentiment-card-level">
              <RiskLevelTag level={item.level} />
            </div>
            <div className="sentiment-card-body">
              <h3>{item.title}</h3>
              <div className="sentiment-meta-row">
                <span>{item.customer}</span>
                <span>{item.date}</span>
              </div>
              <p>{item.summary}</p>
            </div>
            <span className="sentiment-detail-link">查看详情</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SentimentDetailDrawer({ item, onClose }: { item: SentimentFeedItem; onClose: () => void }) {
  return (
    <aside className="sentiment-detail-drawer">
      <div className="sentiment-drawer-header">
        <h2>舆情详情</h2>
        <button onClick={onClose} aria-label="关闭舆情详情">
          <X size={20} />
        </button>
      </div>
      <RiskLevelTag level={item.level} />
      <h3>{item.title}</h3>
      <dl className="sentiment-detail-meta">
        <div>
          <dt>客户名称：</dt>
          <dd>{item.customer}</dd>
        </div>
        <div>
          <dt>风险等级：</dt>
          <dd><RiskLevelTag level={item.level} /></dd>
        </div>
        <div>
          <dt>更新日期：</dt>
          <dd>{item.date}</dd>
        </div>
        <div>
          <dt>来源：</dt>
          <dd>公开舆情 / 新闻监测</dd>
        </div>
      </dl>
      <section className="sentiment-detail-section">
        <h4>正文</h4>
        <p>{item.body}</p>
      </section>
      <button className="sentiment-close-btn" onClick={onClose}>关闭</button>
    </aside>
  );
}

function RiskLevelTag({ level }: { level: 'high' | 'medium' }) {
  return <span className={`sentiment-risk-tag tag-${level}`}>{level === 'high' ? '高风险' : '中风险'}</span>;
}

function NameListTab() {
  return (
    <div className="single-tab-panel single-name-list-details">
      <NameListDetails />
    </div>
  );
}

function SingleLargeWarningAnalysisCard() {
  const [view, setView] = useState<SingleWarningView>('summary');
  const [mode, setMode] = useState<SingleWarningMode>('chart');
  const isSummary = view === 'summary';
  const title = mode === 'table' ? '万科企业集团风险金额穿透' : isSummary ? '当前出险预警金额汇总' : '预警出险专业公司分布';

  return (
    <div className="single-chart-card single-warning-analysis-card">
      <div className="single-warning-toolbar">
        <div className="single-warning-title-block">
          <h2>{title}</h2>
          <span>{mode === 'table' ? '按风险类型、成员公司及子公司逐层展开' : '单位：亿元'}</span>
        </div>
        {mode === 'chart' && (
          <div className="view-switch single-warning-view-switch" aria-label="出险预警视图切换">
            <button className={view === 'summary' ? 'active' : ''} onClick={() => setView('summary')}>
              汇总视图
            </button>
            <button className={view === 'member' ? 'active' : ''} onClick={() => setView('member')}>
              成员公司视图
            </button>
          </div>
        )}
        <div className="view-switch single-warning-mode-switch" aria-label="展示形式切换">
          <button className={mode === 'chart' ? 'active' : ''} onClick={() => setMode('chart')}>
            图表
          </button>
          <button className={mode === 'table' ? 'active' : ''} onClick={() => setMode('table')}>
            表格
          </button>
        </div>
      </div>
      {mode === 'table' ? (
        <SingleLargeWarningDrilldownTable />
      ) : isSummary ? (
        <CurrentWarningSummaryChart />
      ) : (
        <StackedRiskChart data={singleLargeCustomerWarningCompanyDistribution.map((item) => ({ label: item.company, ...item }))} max={150} />
      )}
    </div>
  );
}

const currentWarningSummaryRows = [
  { key: 'defaulted', label: '出险', valueKey: 'defaulted', color: '#8b5cf6' },
  { key: 'major', label: '重大预警', valueKey: 'major', color: '#f04438' },
  { key: 'second', label: '二级预警', valueKey: 'second', color: '#ff6a00' },
  { key: 'first', label: '一级预警', valueKey: 'first', color: '#f59e0b' },
] as const;

function CurrentWarningSummaryChart() {
  const total = singleLargeCustomerWarningMetrics.total;

  return (
    <div className="current-warning-summary">
      {currentWarningSummaryRows.map((item) => {
        const value = singleLargeCustomerWarningMetrics[item.valueKey];
        const ratio = total ? (value / total) * 100 : 0;

        return (
          <div className={`current-warning-row warning-${item.key}`} key={item.key}>
            <div className="warning-type-cell">
              <span className="warning-type-icon" style={{ '--risk-color': item.color } as CSSProperties} />
              <strong>{item.label}</strong>
            </div>
            <div className="warning-progress-track">
              <span
                style={{
                  width: `${ratio}%`,
                  '--risk-color': item.color,
                } as CSSProperties}
              />
            </div>
            <div className="warning-amount-cell">
              <strong>{value.toFixed(2)}</strong>
              <span>亿元</span>
            </div>
            <div className="warning-ratio-cell">{ratio.toFixed(2)}%</div>
          </div>
        );
      })}
    </div>
  );
}

const singleLargeWarningDrilldown = [
  {
    key: 'defaulted',
    label: '出险金额',
    badge: '出险',
    amount: 20,
    members: [
      { name: '寿险', amount: 8, subsidiaries: [{ name: '万科企业股份有限公司', amount: 5 }, { name: '万科地产上海有限公司', amount: 3 }] },
      { name: '银行', amount: 7, subsidiaries: [{ name: '万科服务有限公司', amount: 4 }, { name: '万科地产华南有限公司', amount: 3 }] },
      { name: '信托', amount: 5, subsidiaries: [{ name: '万科商业管理有限公司', amount: 5 }] },
    ],
  },
  {
    key: 'major',
    label: '重大预警金额',
    badge: '重大预警',
    amount: 30,
    members: [
      { name: '银行', amount: 12, subsidiaries: [{ name: '万科服务有限公司', amount: 5 }, { name: '万科地产华南有限公司', amount: 4 }, { name: '万科物业发展有限公司', amount: 3 }] },
      { name: '寿险', amount: 10, subsidiaries: [{ name: '万科企业股份有限公司', amount: 6 }, { name: '万科地产上海有限公司', amount: 4 }] },
      { name: '信托', amount: 8, subsidiaries: [{ name: '万科地产北京有限公司', amount: 5 }, { name: '万科商业管理有限公司', amount: 3 }] },
    ],
  },
  {
    key: 'second',
    label: '二级预警金额',
    badge: '二级预警',
    amount: 50,
    members: [
      { name: '银行', amount: 20, subsidiaries: [{ name: '万科服务有限公司', amount: 8 }, { name: '万科地产华东有限公司', amount: 7 }, { name: '万科物流发展有限公司', amount: 5 }] },
      { name: '寿险', amount: 15, subsidiaries: [{ name: '万科企业股份有限公司', amount: 9 }, { name: '万科地产深圳有限公司', amount: 6 }] },
      { name: '证券', amount: 10, subsidiaries: [{ name: '万科物业服务有限公司', amount: 6 }, { name: '万科城市更新有限公司', amount: 4 }] },
      { name: '资管', amount: 5, subsidiaries: [{ name: '万科商业管理有限公司', amount: 5 }] },
    ],
  },
  {
    key: 'first',
    label: '一级预警金额',
    badge: '一级预警',
    amount: 80,
    members: [
      { name: '银行', amount: 30, subsidiaries: [{ name: '万科服务有限公司', amount: 12 }, { name: '万科地产华南有限公司', amount: 10 }, { name: '万科物业发展有限公司', amount: 8 }] },
      { name: '寿险', amount: 25, subsidiaries: [{ name: '万科企业股份有限公司', amount: 15 }, { name: '万科地产上海有限公司', amount: 10 }] },
      { name: '证券', amount: 15, subsidiaries: [{ name: '万科城市更新有限公司', amount: 9 }, { name: '万科物流发展有限公司', amount: 6 }] },
      { name: '信托', amount: 10, subsidiaries: [{ name: '万科地产北京有限公司', amount: 6 }, { name: '万科商业管理有限公司', amount: 4 }] },
    ],
  },
] as const;

function SingleLargeWarningDrilldownTable() {
  const [openRiskKeys, setOpenRiskKeys] = useState<string[]>(['defaulted']);
  const [openMemberKeys, setOpenMemberKeys] = useState<string[]>(['defaulted-寿险']);
  const overview = [
    { label: '持仓金额', amount: 200 },
    { label: '重大预警金额', amount: 30 },
    { label: '二级预警金额', amount: 50 },
    { label: '一级预警金额', amount: 80 },
    { label: '出险金额', amount: 20 },
  ];
  const toggleRisk = (key: string) => {
    setOpenRiskKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };
  const toggleMember = (key: string) => {
    setOpenMemberKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  return (
    <div className="risk-drilldown single-warning-drilldown">
      <div className="drilldown-overview">
        {overview.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.amount}</strong>
            <em>亿元</em>
          </div>
        ))}
      </div>
      <div className="risk-accordion-stack">
        {singleLargeWarningDrilldown.map((risk) => {
          const riskOpen = openRiskKeys.includes(risk.key);
          return (
            <div className={`risk-type-block risk-${risk.key} ${riskOpen ? 'open' : ''}`} key={risk.key}>
              <button className="risk-type-header" onClick={() => toggleRisk(risk.key)}>
                <span>
                  <RiskTypeBadge label={risk.badge} />
                  {risk.label} <strong>{risk.amount} 亿元</strong>
                </span>
                <ChevronDown size={18} />
              </button>
              {riskOpen && (
                <div className="member-breakdown single-member-breakdown">
                  <div className="member-head">
                    <span>平安成员公司</span>
                    <span>金额（亿元）</span>
                    <span>操作</span>
                  </div>
                  {risk.members.map((member) => {
                    const memberKey = `${risk.key}-${member.name}`;
                    const memberOpen = openMemberKeys.includes(memberKey);
                    return (
                      <div className="member-row-group" key={memberKey}>
                        <div className="member-row">
                          <span>{member.name}</span>
                          <span>{member.amount}</span>
                          <button className={`row-expand ${memberOpen ? 'open' : ''}`} onClick={() => toggleMember(memberKey)}>
                            <ChevronDown size={17} />
                          </button>
                        </div>
                        {memberOpen && <SingleSubsidiaryBreakdownTable risk={risk.label} member={member.name} subsidiaries={member.subsidiaries} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SingleSubsidiaryBreakdownTable({
  risk,
  member,
  subsidiaries,
}: {
  risk: string;
  member: string;
  subsidiaries: ReadonlyArray<{ name: string; amount: number }>;
}) {
  return (
    <div className="subsidiary-table-wrap">
      <div className="subsidiary-title">
        {member} - 子公司明细（{risk}）
      </div>
      <table className="data-table subsidiary-table">
        <thead>
          <tr>
            <th>万科子公司</th>
            <th>金额（亿元）</th>
          </tr>
        </thead>
        <tbody>
          {subsidiaries.map((item) => (
            <tr key={`${member}-${item.name}`}>
              <td>{item.name}</td>
              <td className="num-cell">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompanyExposureBars({
  data,
  highlight,
  tone = 'orange',
}: {
  data: Array<{ name: string; value: number }>;
  highlight?: string;
  tone?: 'orange' | 'blue';
}) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="company-exposure-bars">
      {sortedData.map((item) => {
        const ratio = total ? (item.value / total) * 100 : 0;
        const width = item.value ? Math.max(ratio, 1.8) : 0;

        return (
          <div className={`company-exposure-row ${item.name === highlight ? 'highlight' : ''} tone-${tone}`} key={item.name}>
            <div className="company-exposure-name">{item.name}</div>
            <div className="company-exposure-track">
              <span style={{ width: `${width}%` }} />
            </div>
            <div className="company-exposure-value">
              <strong>{item.value.toFixed(2)}</strong>
              <em>{ratio.toFixed(2)}%</em>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FundingSourceColumnChart() {
  const max = Math.max(...singleLargeCustomerFundingSources.map((item) => item.value));

  return (
    <div className="funding-column-chart">
      <div className="funding-column-bars">
      {singleLargeCustomerFundingSources.map((item) => (
        <div className="funding-column-item" key={item.name}>
          <div className="funding-column-track" style={{ '--bar-height': `${Math.max((item.value / max) * 100, item.value ? 4 : 0)}%` } as CSSProperties}>
            <div className="funding-column-value">{item.value.toFixed(2)}</div>
            <div className="funding-column-bar" />
          </div>
          <div className="funding-column-label">
            <strong>{item.name}</strong>
            <em>{item.ratio}</em>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

const riskStackLegend = [
  { key: 'major', label: '重大预警', color: '#f04438' },
  { key: 'second', label: '二级预警', color: '#f59e0b' },
  { key: 'first', label: '一级预警', color: '#ff8a3d' },
  { key: 'defaulted', label: '出险', color: '#8b5cf6' },
] as const;

function StackedRiskChart({
  data,
  max,
  showTrendLine = false,
}: {
  data: Array<{ label: string; major: number; second: number; first: number; defaulted: number; total: number }>;
  max: number;
  showTrendLine?: boolean;
}) {
  const trendPoints = data.map((item, index) => {
      const x = ((index + 0.5) / data.length) * 100;
      const y = 100 - (item.total / max) * 100;
      return { x, y, label: item.total.toFixed(item.total % 1 === 0 ? 0 : 2), key: item.label };
    });
  const trendPolyline = trendPoints.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div>
      <div className="legend compact-legend">
        {riskStackLegend.map((item) => (
          <span key={item.key}>
            <i style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
        {showTrendLine && (
          <span>
            <i className="risk-line-legend" />
            总额趋势
          </span>
        )}
      </div>
      <div className={`risk-stack-chart ${showTrendLine ? 'with-line' : ''}`}>
        {showTrendLine && (
          <svg className="risk-trend-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={trendPolyline} />
          </svg>
        )}
        {showTrendLine && (
          <div className="risk-trend-points" aria-hidden="true">
            {trendPoints.map((point) => (
              <span
                className="chart-trend-point"
                key={point.key}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <em>{point.label}</em>
              </span>
            ))}
          </div>
        )}
        <div className="risk-stack-bars" style={{ '--risk-bar-count': data.length } as CSSProperties}>
          {data.map((item) => {
            const barHeight = Math.max((item.total / max) * 100, item.total ? 4 : 0);
            const barStyle = { '--bar-height': `${barHeight}%` } as CSSProperties;

            return (
              <div className="risk-stack-item" key={item.label}>
                <div className="risk-stack-track" style={barStyle}>
                  <div className="risk-stack-total">{item.total.toFixed(item.total % 1 === 0 ? 0 : 2)}</div>
                  <div className="risk-stack-bar">
                    {riskStackLegend.map((legend) => (
                      <span
                        key={legend.key}
                        style={{
                          height: `${item.total ? (item[legend.key] / item.total) * 100 : 0}%`,
                          backgroundColor: legend.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="risk-stack-label">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SingleDataTable({
  title,
  headers,
  rows,
  numeric = [],
  actionColumn,
}: {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
  numeric?: number[];
  actionColumn?: number;
}) {
  return (
    <div className="single-table-card">
      <div className="analysis-heading compact">
        <h2>{title}</h2>
      </div>
      <div className="table-wrap">
        <table className={`data-table single-data-table ${title === '大户客户明细' ? 'wide-single-table' : ''}`}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${title}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${title}-${rowIndex}-${cellIndex}`}
                    className={`${numeric.includes(cellIndex) ? 'num-cell' : ''} ${typeof cell === 'string' && cell.startsWith('+') ? 'up' : ''} ${typeof cell === 'string' && cell.startsWith('-') ? 'down' : ''}`}
                  >
                    {actionColumn === cellIndex ? (
                      <button className="table-action-btn">{cell}</button>
                    ) : title === '大户客户明细' && cellIndex === 2 && typeof cell === 'string' ? (
                      <span className="industry-cell">
                        {cell.split('及').map((part, index) =>
                          index === 0 ? (
                            <span key={`${title}-${rowIndex}-${cellIndex}-part-${index}`}>
                              {part}及
                              <wbr />
                            </span>
                          ) : (
                            <span key={`${title}-${rowIndex}-${cellIndex}-part-${index}`}>{part}</span>
                          ),
                        )}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatSigned(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

function MetricGrid({
  metrics,
}: {
  metrics: Array<{ title: string; value: string; unit: string; change: string; badge?: boolean }>;
}) {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  unit,
  change,
  badge,
}: {
  title: string;
  value: string;
  unit: string;
  change: string;
  badge?: boolean;
}) {
  return (
    <div className="metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value-row">
        {badge ? <RiskStatusBadge status={value as RiskStatus} large /> : <span className="metric-value">{value}</span>}
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      <div className="metric-change">{change}</div>
    </div>
  );
}

function RiskStatusBadge({ status, large }: { status: RiskStatus; large?: boolean }) {
  return <span className={`risk-badge status-${status} ${large ? 'large' : ''}`}>{status}</span>;
}

function HorizontalBarChart({
  data,
}: {
  data: Array<{ name: string; exposure: number; concentration: number; status: RiskStatus }>;
}) {
  const max = Math.max(...data.map((item) => item.exposure));

  return (
    <div className="horizontal-chart">
      <div className="horizontal-chart-legend" aria-label="集中度状态图例">
        <span className="legend-pill status-超限">超限</span>
        <span className="legend-pill status-预警">预警</span>
        <span className="legend-pill status-正常">正常</span>
      </div>
      {data.map((item) => (
        <div className="horizontal-row" key={item.name}>
          <div className="h-label">{item.name}</div>
          <div className="h-track">
            <div className={`h-bar status-${item.status}`} style={{ width: `${(item.exposure / max) * 100}%` }} />
          </div>
          <div className="h-value">{item.exposure}</div>
          <div className="h-concentration">集中度 {item.concentration.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  );
}

function CounterpartyTrendAnalysis() {
  const [view, setView] = useState<TrendView>('chart');

  return (
    <>
      <div className="analysis-heading">
        <div>
          <h2>交易对手持仓规模趋势（近6个月）</h2>
          <span>单位：亿元</span>
        </div>
        <div className="toggle-group">
          <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>
            图表
          </button>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>
            表格
          </button>
        </div>
      </div>
      {view === 'chart' ? <VerticalBarChart data={counterpartyTrendData} max={320} /> : <CounterpartyDataTable />}
    </>
  );
}

function CounterpartyDimensionAnalysis() {
  const [selected, setSelected] = useState<DimensionKey[]>(['member']);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const mode = selected.includes('member') && selected.includes('asset') ? 'stacked' : selected.includes('asset') ? 'asset' : 'member';
  const title =
    mode === 'stacked'
      ? '按成员公司和资产类型统计的持仓规模'
      : mode === 'asset'
        ? '按资产类型统计的持仓规模'
        : '按成员公司统计的持仓规模';
  const toggle = (key: DimensionKey) => {
    setSelected((current) => {
      if (key === 'member') return current.includes('member') ? current : [...current, key];
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      return next.length ? next : [key];
    });
  };

  return (
    <>
      <div className="analysis-heading compact dimension-heading-row">
        <div>
          <h2>{title}</h2>
          <span>单位：亿元</span>
        </div>
        <div className="dimension-actions">
          {view === 'chart' && (
            <div className={`dimension-dropdown ${open ? 'open' : ''}`}>
              <button className="dimension-dropdown-trigger" type="button" onClick={() => setOpen((value) => !value)}>
                <span>维度筛选</span>
                <span className="dimension-trigger-label">
                  {selected.includes('member') && selected.includes('asset') ? '成员公司 + 资产类型' : selected.includes('asset') ? '资产类型' : '成员公司'}
                </span>
                <ChevronDown size={14} />
              </button>
              {open && (
                <div className="dimension-dropdown-panel">
                  <label className={`dimension-option ${selected.includes('member') ? 'fixed' : ''}`}>
                    <input type="checkbox" checked disabled readOnly />
                    <span>成员公司</span>
                  </label>
                  <label className="dimension-option">
                    <input type="checkbox" checked={selected.includes('asset')} onChange={() => toggle('asset')} />
                    <span>资产类型</span>
                  </label>
                </div>
              )}
            </div>
          )}
          <div className="toggle-group dimension-view-toggle">
            <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>
              图表
            </button>
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>
              表格
            </button>
          </div>
        </div>
      </div>
      {view === 'table' ? (
        <CounterpartyDimensionTable />
      ) : mode === 'stacked' ? (
        <SimpleStackedBarChart />
      ) : (
        <VerticalBarChart data={mode === 'asset' ? counterpartyAssetData : counterpartyMemberData} max={mode === 'asset' ? 190 : 120} color={mode === 'asset' ? 'blue' : 'orange'} />
      )}
    </>
  );
}

function VerticalBarChart({ data, max, color = 'orange' }: { data: Array<{ label: string; value: number }>; max: number; color?: 'orange' | 'blue' }) {
  return (
    <div className="bar-chart member-chart">
      <div className="grid-lines" />
      <div className="bars">
        {data.map((item) => {
          const barHeight = Math.max((item.value / max) * 100, item.value ? 4 : 0);
          const barStyle = { '--bar-height': `${barHeight}%` } as CSSProperties;

          return (
            <div className="bar-item" key={item.label} style={barStyle}>
              <div className="bar-track">
                <div className="bar-value">{item.value.toFixed(2)}</div>
                <div className={`bar ${color}`} />
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimpleStackedBarChart() {
  const max = 112;

  return (
    <>
      <div className="legend">
        {stackLegend.map((item) => (
          <span key={item.label}>
            <i style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="bar-chart stacked-chart">
        <div className="grid-lines" />
        <div className="bars">
          {counterpartyStackedData.map((item) => (
            <div className="bar-item" key={item.label} style={{ '--bar-height': `${(item.total / max) * 100}%` } as CSSProperties}>
              <div className="bar-value">{item.total.toFixed(2)}</div>
              <div className="stacked-bar" style={{ height: `${(item.total / max) * 100}%` }}>
                {item.values.map((value, index) => (
                  <span key={`${item.label}-${stackLegend[index].label}`} style={{ height: `${(value / item.total) * 100}%`, backgroundColor: stackLegend[index].color }} />
                ))}
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CounterpartyDimensionTable() {
  const rows = counterpartyStackedData;

  return (
    <div className="table-wrap">
      <table className="data-table dimension-table">
        <thead>
          <tr>
            <th>成员公司</th>
            <th>债券</th>
            <th>股票</th>
            <th>基金</th>
            <th>非标</th>
            <th>其他</th>
            <th>合计</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.label}>
              <td>{item.label}</td>
              {item.values.map((value, index) => (
                <td className="num-cell" key={`${item.label}-${stackLegend[index].label}`}>
                  {value.toFixed(2)}
                </td>
              ))}
              <td className="num-cell total-cell">{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CounterpartyDataTable() {
  const rows = [...counterpartyTrendData].reverse();

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>时间</th>
          <th>持仓规模（亿元）</th>
          <th>较上月环比</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => (
          <tr key={item.label}>
            <td>{item.label}</td>
            <td>{item.value.toFixed(2)}</td>
            <td className={item.mom === '-' ? '' : 'up'}>{item.mom}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ComboTrendChart() {
  const width = 880;
  const height = 300;
  const padding = { top: 34, right: 54, bottom: 44, left: 48 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxExposure = 700;
  const minExposure = 400;
  const minPct = 60;
  const maxPct = 90;
  const step = innerWidth / vankeTrendData.length;
  const barWidth = 18;
  const point = (index: number, pct: number) => ({
    x: padding.left + step * index + step / 2,
    y: padding.top + ((maxPct - pct) / (maxPct - minPct)) * innerHeight,
  });
  const linePath = vankeTrendData
    .map((item, index) => {
      const p = point(index, item.concentration);
      return `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
    })
    .join(' ');
  const thresholdY = point(0, 90).y;

  return (
    <div>
      <div className="analysis-heading">
        <h2>近一年持仓规模与集中度趋势</h2>
      </div>
      <div className="combo-legend">
        <span><i className="legend-bar" />已占用额度（亿元）</span>
        <span><i className="legend-line" />集中度（%）</span>
        <span><i className="legend-dash" />阈值（90%）</span>
      </div>
      <div className="combo-chart">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="近一年持仓规模与集中度趋势">
          {[0, 1, 2, 3, 4].map((tick) => {
            const y = padding.top + (innerHeight / 4) * tick;
            return <line key={tick} x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="grid-line" />;
          })}
          {[0, 1, 2, 3, 4].map((tick) => {
            const y = padding.top + (innerHeight / 4) * tick;
            const pctLabel = maxPct - (maxPct - minPct) * (tick / 4);
            return (
              <text key={`pct-${tick}`} x={padding.left - 10} y={y + 4} textAnchor="end" className="svg-axis">
                {pctLabel.toFixed(0)}%
              </text>
            );
          })}
          {[0, 1, 2, 3, 4].map((tick) => {
            const y = padding.top + (innerHeight / 4) * tick;
            const exposureLabel = maxExposure - (maxExposure - minExposure) * (tick / 4);
            return (
              <text key={`exposure-${tick}`} x={width - padding.right + 10} y={y + 4} textAnchor="start" className="svg-axis">
                {Math.round(exposureLabel)}
              </text>
            );
          })}
          <line x1={padding.left} x2={width - padding.right} y1={thresholdY} y2={thresholdY} className="threshold-line" />
          {vankeTrendData.map((item, index) => {
            const x = padding.left + step * index + step / 2 - barWidth / 2;
            const barHeight = (item.exposure / maxExposure) * innerHeight;
            const y = padding.top + innerHeight - barHeight;
            return (
              <g key={item.month}>
                <rect className="combo-bar" x={x} y={y} width={barWidth} height={barHeight} rx="4" />
              <text x={x + barWidth / 2} y={padding.top + innerHeight + 26} textAnchor="middle" className="svg-axis">
                  {item.month}
                </text>
              </g>
            );
          })}
          <path d={linePath} className="concentration-line" />
          {vankeTrendData.map((item, index) => {
            const p = point(index, item.concentration);
            return <circle key={item.month} cx={p.x} cy={p.y} r="4" className="line-dot" />;
          })}
          <text x={padding.left + 6} y={thresholdY - 8} textAnchor="start" className="svg-axis">
            90%
          </text>
        </svg>
      </div>
    </div>
  );
}

function NameListOverview() {
  return (
    <div className="name-overview">
      <p className="sub-summary">
        名单整体分布显示，灰名单主体数量最多，为 <strong>70 个</strong>；黑名单主体 <strong>55 个</strong>，
        主要来自高风险行业和出现负面风险信号的交易对手；白名单*主体 <strong>30 个</strong>，
        可作为低风险参考对象。
      </p>
      <div className="overview-grid">
        <div>
          <div className="analysis-heading">
            <div>
              <h2>黑灰白名单*主体数量分布</h2>
            </div>
            <span className="unit-label">单位：个</span>
          </div>
          <NameListSummaryChart />
        </div>
      </div>
    </div>
  );
}

function NameListDetails() {
  const [openTypes, setOpenTypes] = useState<NameListType[]>(['黑名单']);
  const groups: Array<{ type: NameListType; count: number; items: NameListItem[] }> = [
    { type: '黑名单', count: 55, items: blackListItems },
    { type: '灰名单', count: 70, items: greyListItems },
    { type: '白名单*', count: 30, items: whiteListItems },
  ];

  const toggle = (type: NameListType) => {
    setOpenTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
  };

  return (
    <div>
      <p className="sub-summary">
        以下为当前万科集团各法人公司黑灰白名单明细汇总。黑名单主体共 <strong>55 个</strong>，主要因违约、重大负面舆情、
        司法执行等原因入库；灰名单主体共 <strong>70 个</strong>，主要为观察类或待进一步核验主体；
        白名单*主体共 <strong>30 个</strong>，可作为低风险参考对象。
      </p>
      <div className="accordion-stack">
        {groups.map((group) => (
          <NameListAccordionTable
            key={group.type}
            group={group}
            isOpen={openTypes.includes(group.type)}
            onToggle={() => toggle(group.type)}
          />
        ))}
      </div>
    </div>
  );
}

function EntityHitResultView({ refTarget }: { refTarget: RefObject<HTMLElement | null> }) {
  return (
    <section className="scenario-card" ref={refTarget}>
      <div className="step-title">
        <span>场景 2:</span>
        单一法人公司查询结果
      </div>
      <div className="scenario-content-grid">
        <div className="scenario-primary">
          <UserBubble>判断下万科服务有限公司是否在黑灰名单中</UserBubble>
          <AssistantMessage>
            <EntityRiskDetailTable />
          </AssistantMessage>
        </div>
      </div>
      <ChatInput />
      <div className="disclaimer">内容由大模型生成，仅供参考</div>
    </section>
  );
}

function RatingQueryView() {
  const [tab, setTab] = useState<RatingTab>('internal');
  const [meaningOpen, setMeaningOpen] = useState(false);

  return (
    <section className="scenario-card rating-page">
      <div className="step-title">评级查询</div>
      <div className="scenario-content-grid rating-layout">
        <div className="scenario-primary">
          <UserBubble>帮我查一下深圳华侨城股份有限公司的评级情况</UserBubble>
          <AssistantMessage>
            <p className="answer-copy">
              <strong>深圳华侨城股份有限公司</strong>当前<strong>内部信评</strong>最高为 <strong>3B</strong>，
              最低为 <strong>3D</strong>；最新<strong>外部评级</strong>为
              <strong> 大公国际 AAA</strong>，整体外部评级处于较高水平。外部评级整体较稳定，但内部统一信评低于外部评级表现，
              建议关注集团内部口径下的信用风险变化。
            </p>
          </AssistantMessage>
          <RatingSummaryCard />
          <div className="analysis-card rating-analysis">
            <div className="tabs">
              <button className={tab === 'internal' ? 'active' : ''} onClick={() => setTab('internal')}>
                内部评级
              </button>
              <button className={tab === 'external' ? 'active' : ''} onClick={() => setTab('external')}>
                外部评级
              </button>
            </div>
            {tab === 'internal' ? <InternalRatingPanel /> : <ExternalRatingPanel onShowMeaning={() => setMeaningOpen(true)} />}
          </div>
        </div>
        <div className="rating-side">
          <div className="rating-note-card" aria-label="页面备注">
            非重点关注客户展示“最高内部信评”及“最低内部信评”，重点关注客户展示“集团统一信评”
          </div>
        </div>
      </div>
      <ChatInput />
      <div className="disclaimer">内容由大模型生成，仅供参考</div>
      {meaningOpen && <RatingMeaningPopover onClose={() => setMeaningOpen(false)} />}
    </section>
  );
}

function RatingSummaryCard() {
  return (
    <div className="rating-summary-card">
      <div className="rating-subject">
        <div className="rating-subject-icon">楼</div>
        <div>
          <div className="rating-subject-title">
            <h2>{ratingEntitySummary.name}</h2>
            <span className="attention-tag">重点关注</span>
          </div>
          <dl>
            <div>
              <dt>所属集团</dt>
              <dd>{ratingEntitySummary.group}</dd>
            </div>
            <div>
              <dt>主体类型</dt>
              <dd>{ratingEntitySummary.subjectType}</dd>
            </div>
            <div>
              <dt>行业</dt>
              <dd>{ratingEntitySummary.industry}</dd>
            </div>
            <div>
              <dt>更新时间</dt>
              <dd>{ratingEntitySummary.updatedAt}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="rating-summary">
        <h3>评级摘要</h3>
        <div className="rating-summary-grid">
          <div>
            <span>最高内部信评</span>
            <strong>{ratingEntitySummary.highestInternalRating}</strong>
          </div>
          <div>
            <span>最低内部信评</span>
            <strong>{ratingEntitySummary.lowestInternalRating}</strong>
          </div>
          <div>
            <span>最新外部评级</span>
            <strong>{ratingEntitySummary.latestExternalAgency} {ratingEntitySummary.latestExternalRating}</strong>
            <em>评级展望：{ratingEntitySummary.latestExternalOutlook}</em>
            <em>最近评级日期：{ratingEntitySummary.latestExternalDate}</em>
          </div>
        </div>
      </div>
    </div>
  );
}

function InternalRatingPanel() {
  return (
    <div className="rating-panel">
      <InternalRatingTrendChart />
      <InternalRatingHistoryTable />
    </div>
  );
}

function InternalRatingTrendChart() {
  const labels = ['1A', '2A', '2B', '2C', '3A', '3B', '3C', '3D', '4A'];
  const width = 720;
  const height = 250;
  const padding = { top: 24, right: 32, bottom: 38, left: 46 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const points = internalRatingTrendData.map((item, index) => {
    const x = padding.left + (plotWidth / (internalRatingTrendData.length - 1)) * index;
    const y = padding.top + ((item.value - 1) / (labels.length - 1)) * plotHeight;
    return { ...item, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="rating-line-card">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="内部统一信评迁徙趋势">
        {labels.map((label, index) => {
          const y = padding.top + (plotHeight / (labels.length - 1)) * index;
          return (
            <g key={label}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e5e7eb" />
              <text x={16} y={y + 4} className="axis-text">{label}</text>
            </g>
          );
        })}
        <polyline points={line} fill="none" stroke="#ff5a00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={point.date}>
            <circle className={index === points.length - 1 ? 'latest-rating-point' : ''} cx={point.x} cy={point.y} r="5" />
            <text x={point.x - 9} y={point.y - 12} className="rating-point-label">{point.rating}</text>
            <text x={point.x - 22} y={height - 12} className="axis-text">{point.date}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function InternalRatingHistoryTable() {
  const sortedRecords = [...internalAnnualRatingRecords].sort((a, b) => b.reportYear - a.reportYear);

  return (
    <div className="table-wrap rating-history">
      <h3>各成员公司评级</h3>
      <table className="data-table annual-rating-table">
        <thead>
          <tr>
            <th>专业公司</th>
            <th>有效评级</th>
            <th>评级年报年份</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((item) => (
            <tr key={`${item.company}-${item.reportYear}`}>
              <td>{item.company}</td>
              <td className="annual-rating-value">{item.rating}</td>
              <td>{item.reportYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExternalRatingPanel({ onShowMeaning }: { onShowMeaning: () => void }) {
  const [openAgencies, setOpenAgencies] = useState<string[]>(['大公国际']);
  const toggle = (agency: string) => {
    setOpenAgencies((current) => (current.includes(agency) ? current.filter((item) => item !== agency) : [...current, agency]));
  };

  return (
    <div className="rating-panel">
      <div className="external-rating-table">
        <div className="external-head">
          <span>评级机构</span>
          <span>评级结果</span>
          <span>披露日期</span>
        </div>
        {externalRatingAgencies.map((agency) => (
          <div className="external-row-group" key={agency.agency}>
            <div className="external-row">
              <span>{agency.agency}</span>
              <span className="external-rating-cell">
                <span className="rating-badge external">{agency.rating}</span>
                <button className="help-icon" onClick={onShowMeaning} aria-label={`${agency.agency} ${agency.rating}评级含义`}>
                  <HelpCircle size={15} />
                </button>
              </span>
              <span>{agency.date}</span>
              <button className={`row-expand ${openAgencies.includes(agency.agency) ? 'open' : ''}`} onClick={() => toggle(agency.agency)}>
                <ChevronDown size={18} />
              </button>
            </div>
            {openAgencies.includes(agency.agency) && (
              <div className="external-history">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>披露日期</th>
                      <th>评级结果</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agency.history.map((item) => (
                      <tr key={`${agency.agency}-${item.date}`}>
                        <td>{item.date}</td>
                        <td><span className="rating-badge external">{item.rating}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RatingMeaningPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="rating-popover" role="dialog" aria-modal="false">
      <button className="popover-close" onClick={onClose} aria-label="关闭评级含义">
        <X size={16} />
      </button>
      <h3>{externalRatingMeaning.title}</h3>
      <p>
        AAA：偿还债务的能力极强，基本不受不利经济环境的影响，违约风险极低。
      </p>
      <strong>具体含义：</strong>
      <ul>
        <li>企业基本面极其稳健；</li>
        <li>盈利能力很强，现金流非常充裕；</li>
        <li>债务负担很轻，流动性状况极佳；</li>
        <li>违约可能性极低。</li>
      </ul>
      <p>以上为评级含义的简要说明，具体请以评级机构公开标准为准。</p>
    </div>
  );
}

function WarningInsuranceQueryView() {
  const [tab, setTab] = useState<WarningTab>('trend');
  const stepTwoRef = useRef<HTMLElement>(null);
  const scrollToStepTwo = () => stepTwoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <section className="scenario-card warning-page">
        <div className="step-title">预警出险查询</div>
        <div className="scenario-content-grid scenario-content-single">
          <div className="scenario-primary">
            <UserBubble>帮我看一下预警出险整体情况</UserBubble>
            <AssistantMessage>
              <p className="answer-copy">
                当前预警出险涉及持仓余额 <strong>520 亿元</strong>，较上月保持平稳。
                其中资金主要集中在少数高风险敞口，建议重点关注总规模变化及后续处置进展，
                持续控制预警出险资金占比。
              </p>
            </AssistantMessage>
            <div className="analysis-card warning-analysis">
              <div className="tabs">
                <button className={tab === 'trend' ? 'active' : ''} onClick={() => setTab('trend')}>
                  趋势分析
                </button>
                <button className={tab === 'dimension' ? 'active' : ''} onClick={() => setTab('dimension')}>
                  维度分析
                </button>
              </div>
              {tab === 'trend' ? <WarningTrendPanel /> : <WarningDimensionPanel />}
            </div>
          </div>
        </div>
      </section>
      <VankeWarningResultStep refTarget={stepTwoRef} />
    </>
  );
}

function WarningTrendPanel() {
  return (
    <div className="warning-panel">
      <div className="analysis-heading">
        <div>
          <h2>近6个月预警出险金额趋势</h2>
          <span>单位：亿元</span>
        </div>
      </div>
      <WarningStackedChart data={warningInsuranceTrendData} labelKey="month" max={140} showTrendLine />
    </div>
  );
}

function WarningDimensionPanel() {
  return (
    <div className="warning-panel">
      <div className="analysis-heading">
        <div>
          <h2>按平安成员公司分布</h2>
          <span>单位：亿元</span>
        </div>
      </div>
      <WarningStackedChart data={warningInsuranceMemberDistribution} labelKey="member" max={230} />
    </div>
  );
}

function WarningStackedChart({
  data,
  labelKey,
  max,
  showTrendLine = false,
}: {
  data: Array<Record<string, string | number>>;
  labelKey: 'month' | 'member';
  max: number;
  showTrendLine?: boolean;
}) {
  const segments = [
    { key: 'major', label: '重大预警', color: '#ef4444' },
    { key: 'second', label: '二级预警', color: '#f97316' },
    { key: 'first', label: '一级预警', color: '#fbbf24' },
    { key: 'defaulted', label: '出险', color: '#6b7280' },
  ];
  const trendPoints = data.map((item, index) => {
    const total = Number(item.total);
    const x = ((index + 0.5) / data.length) * 100;
    const y = 100 - (total / max) * 100;
    return { x, y, label: String(item.total), key: String(item[labelKey]) };
  });
  const trendPolyline = trendPoints.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className={`warning-chart-card ${showTrendLine ? 'with-line' : ''}`}>
      <div className="warning-legend">
        {segments.map((segment) => (
          <span key={segment.key}>
            <i style={{ background: segment.color }} />
            {segment.label}
          </span>
        ))}
        {showTrendLine && (
          <span>
            <i className="risk-line-legend" />
            总额趋势
          </span>
        )}
      </div>
      <div className="warning-stacked-bars">
        {showTrendLine && (
          <svg className="warning-trend-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={trendPolyline} />
          </svg>
        )}
        {showTrendLine && (
          <div className="warning-trend-points" aria-hidden="true">
            {trendPoints.map((point) => (
              <span
                className="chart-trend-point"
                key={point.key}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <em>{point.label}</em>
              </span>
            ))}
          </div>
        )}
        {data.map((item) => {
          const total = Number(item.total);
          const barHeight = Math.max((total / max) * 100, total ? 4 : 0);
          const barStyle = { '--bar-height': `${barHeight}%` } as CSSProperties;

          return (
            <div className="warning-bar-item" key={String(item[labelKey])}>
              <div className="warning-bar-track" style={barStyle}>
                <div className="warning-total">{item.total}</div>
                <div className="warning-stack">
                  {segments.map((segment) => (
                    <div
                      key={segment.key}
                      style={{
                        height: `${(Number(item[segment.key]) / total) * 100}%`,
                        background: segment.color,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="warning-axis-label">{item[labelKey]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VankeWarningResultStep({ refTarget }: { refTarget: RefObject<HTMLElement | null> }) {
  return (
    <section className="scenario-card warning-page" ref={refTarget}>
      <div className="step-title">
        <span>场景 2:</span>
        万科企业集团预警出险查询结果
      </div>
      <div className="scenario-content-grid scenario-content-single">
        <div className="scenario-primary">
          <UserBubble>万科企业集团预警出险情况怎么样？</UserBubble>
          <AssistantMessage>
            <p className="answer-copy">
              <strong>万科企业集团</strong>当前存在多类预警及出险记录，集团总体持仓余额为 <strong>200 亿元</strong>，
              其中<strong>重大预警金额 30 亿元</strong>、<strong>二级预警金额 50 亿元</strong>、
              <strong>一级预警金额 80 亿元</strong>、<strong>出险金额 20 亿元</strong>。风险主要集中在
              <strong>银行、寿险和信托</strong>，建议限制新增交易并跟踪处置进展。
            </p>
          </AssistantMessage>
          <RiskDrilldownPanel />
        </div>
      </div>
      <ChatInput />
      <div className="disclaimer">内容由大模型生成，仅供参考</div>
    </section>
  );
}

function RiskDrilldownPanel() {
  const [openRiskKeys, setOpenRiskKeys] = useState<string[]>(['major']);
  const [openMemberKeys, setOpenMemberKeys] = useState<string[]>(['major-银行']);
  const overview = [
    { label: '持仓余额', amount: vankeWarningInsuranceSummary.exposure, ratio: '' },
    { label: '重大预警金额', amount: vankeWarningInsuranceSummary.majorWarningAmount, ratio: '' },
    { label: '二级预警金额', amount: vankeWarningInsuranceSummary.secondLevelWarningAmount, ratio: '' },
    { label: '一级预警金额', amount: vankeWarningInsuranceSummary.firstLevelWarningAmount, ratio: '' },
    { label: '出险金额', amount: vankeWarningInsuranceSummary.defaultAmount, ratio: '' },
  ];
  const toggleRisk = (key: string) => {
    setOpenRiskKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };
  const toggleMember = (key: string) => {
    setOpenMemberKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  return (
    <div className="risk-drilldown">
      <h2>万科企业集团风险金额穿透</h2>
      <div className="drilldown-overview">
        {overview.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.amount}</strong>
            <em>亿元</em>
            {item.ratio && <small>{item.ratio}</small>}
          </div>
        ))}
      </div>
      <div className="risk-accordion-stack">
        {vankeRiskDrilldown.map((risk) => {
          const riskOpen = openRiskKeys.includes(risk.key);
          return (
            <div className={`risk-type-block risk-${risk.key} ${riskOpen ? 'open' : ''}`} key={risk.key}>
              <button className="risk-type-header" onClick={() => toggleRisk(risk.key)}>
                <span>
                  <RiskTypeBadge label={risk.label} />
                  {risk.label} <strong>{risk.amount} 亿元</strong>
                </span>
                <ChevronDown size={18} />
              </button>
              {riskOpen && (
                <div className="member-breakdown">
                <div className="member-head">
                    <span>平安成员公司</span>
                    <span>金额（亿元）</span>
                    <span>操作</span>
                  </div>
                  {risk.members.map((member) => {
                    const memberKey = `${risk.key}-${member.name}`;
                    const memberOpen = openMemberKeys.includes(memberKey);
                    return (
                      <div className="member-row-group" key={memberKey}>
                        <div className="member-row">
                          <span>{member.name}</span>
                          <span>{member.amount}</span>
                          <button className={`row-expand ${memberOpen ? 'open' : ''}`} onClick={() => toggleMember(memberKey)}>
                            <ChevronDown size={17} />
                          </button>
                        </div>
                        {memberOpen && <SubsidiaryBreakdownTable risk={risk.label} member={member.name} subsidiaries={member.subsidiaries} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RiskTypeBadge({ label }: { label: string }) {
  return <span className={`risk-type-badge badge-${label.replace('金额', '')}`}>{label.replace('金额', '')}</span>;
}

function SubsidiaryBreakdownTable({
  risk,
  member,
  subsidiaries,
}: {
  risk: string;
  member: string;
  subsidiaries: Array<{ name: string; amount: number; ratio: string }>;
}) {
  return (
    <div className="subsidiary-table-wrap">
      <div className="subsidiary-title">
        {member} - 子公司明细（{risk}）
      </div>
      <table className="data-table subsidiary-table">
        <thead>
          <tr>
            <th>万科子公司</th>
            <th>金额（亿元）</th>
          </tr>
        </thead>
        <tbody>
          {subsidiaries.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="user-row">
      <div className="user-bubble">{children}</div>
      <div className="avatar user-avatar">
        <User size={22} />
      </div>
    </div>
  );
}

function AssistantMessage({ children }: { children: ReactNode }) {
  return (
    <section className="assistant-wrap">
      <div className="avatar bot-avatar">
        <Bot size={24} />
      </div>
      <div className="assistant-card">{children}</div>
    </section>
  );
}

function NameListSummaryChart() {
  const max = 80;

  return (
    <div className="name-chart-card">
      <div className="name-bars">
        {nameListStats.map((item) => {
          const barHeight = Math.max((item.count / max) * 100, item.count ? 4 : 0);
          const barStyle = { '--bar-height': `${barHeight}%` } as CSSProperties;

          return (
            <div className="name-bar-item" key={item.type}>
              <div className="name-bar-track" style={barStyle}>
                <div className="bar-value">{item.count}</div>
                <div className={`name-bar list-${item.type}`} />
              </div>
              <div className="bar-label">{item.type}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NameListAccordionTable({
  group,
  isOpen,
  onToggle,
}: {
  group: { type: NameListType; count: number; items: NameListItem[] };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`list-accordion ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={onToggle}>
        <span>
          <NameListTypeTag type={group.type} />
          {group.type} {group.count} 个
        </span>
        <ChevronDown size={18} />
      </button>
      {isOpen && (
        <div className="table-wrap">
          <table className="name-list-table">
            <thead>
              <tr>
                <th>企业名称</th>
                <th>入库原因</th>
                <th>入库日期</th>
                <th>上报公司</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.reason}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className="reporter-tag">{item.reporter}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EntityRiskDetailTable() {
  const rows = [
    ['主体名称', entityHitResult.name],
    ['名单类型', entityHitResult.listType],
    ['所属集团', entityHitResult.group],
    ['入库原因', entityHitResult.reason],
    ['入库日期', entityHitResult.date],
    ['上报公司', entityHitResult.reporter],
    ['风险建议', entityHitResult.suggestion],
  ];

  return (
    <table className="entity-detail-table">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th>{label}</th>
            <td>{label === '名单类型' ? <NameListTypeTag type={value as NameListType} /> : value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NameListTypeTag({ type }: { type: NameListType }) {
  return <span className={`name-type-tag tag-${type}`}>{type}</span>;
}

function ChatInput() {
  const [value, setValue] = useState('');

  return (
    <div className="chat-input group-input">
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="请输入您的问题，或选择推荐问题" />
      <div className="input-actions">
        <button className="think-btn">
          <Sparkles size={15} />
          深度思考
        </button>
        <button className="clip-btn" aria-label="添加附件">
          <Paperclip size={17} />
        </button>
        <button className="send-btn" aria-label="发送">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default App;
