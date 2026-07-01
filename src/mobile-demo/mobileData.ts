import {
  assetTypeHoldingDetails,
  blackListItems,
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
  singleLargeCustomerWarningCompanyDistribution,
  singleLargeCustomerWarningMetrics,
  vankeMemberCompanyComparisonData,
  vankeMetrics,
  vankeRiskDrilldown,
  vankeTrendData,
  vankeWarningInsuranceSummary,
  warningInsuranceMemberDistribution,
  warningInsuranceOverview,
  warningInsuranceTrendData,
  whiteListItems,
} from '../mockData';

export {
  assetTypeHoldingDetails,
  blackListItems,
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
  singleLargeCustomerWarningCompanyDistribution,
  singleLargeCustomerWarningMetrics,
  vankeMemberCompanyComparisonData,
  vankeMetrics,
  vankeRiskDrilldown,
  vankeTrendData,
  vankeWarningInsuranceSummary,
  warningInsuranceMemberDistribution,
  warningInsuranceOverview,
  warningInsuranceTrendData,
  whiteListItems,
};

// Mirrors the desktop-rendered Vanke concentration chart labels used by the mobile demo.
// The source mockData.ts is intentionally left unchanged.
export const vankeConcentrationTrendRows = [
  { month: '2025-05', exposure: 720, concentration: 81, threshold: 90 },
  { month: '2025-04', exposure: 705, concentration: 81, threshold: 90 },
  { month: '2025-03', exposure: 690, concentration: 80, threshold: 90 },
  { month: '2025-02', exposure: 675, concentration: 79, threshold: 90 },
  { month: '2025-01', exposure: 660, concentration: 77, threshold: 90 },
  { month: '2024-12', exposure: 640, concentration: 75, threshold: 90 },
  { month: '2024-11', exposure: 625, concentration: 74, threshold: 90 },
  { month: '2024-10', exposure: 610, concentration: 73, threshold: 90 },
  { month: '2024-09', exposure: 585, concentration: 72, threshold: 90 },
  { month: '2024-08', exposure: 560, concentration: 70, threshold: 90 },
  { month: '2024-07', exposure: 535, concentration: 69, threshold: 90 },
  { month: '2024-06', exposure: 520, concentration: 68, threshold: 90 },
];

// Values below mirror existing desktop-local constants in src/App.tsx.
export const counterpartyTrendData = [
  { label: '2024-12', value: 210.32, mom: '-' },
  { label: '2025-01', value: 223.45, mom: '↑ 6.24%' },
  { label: '2025-02', value: 236.81, mom: '↑ 5.98%' },
  { label: '2025-03', value: 249.87, mom: '↑ 5.52%' },
  { label: '2025-04', value: 264.59, mom: '↑ 5.89%' },
  { label: '2025-05', value: 286.35, mom: '↑ 8.21%' },
];

export const counterpartyMemberData = [
  { label: '银行', value: 100.12 },
  { label: '证券', value: 72.35 },
  { label: '信托', value: 48.26 },
  { label: '资管', value: 32.18 },
  { label: '基金', value: 21.66 },
  { label: '其他', value: 11.78 },
];

export const counterpartyAssetData = [
  { label: '债券', value: 167.28 },
  { label: '股票', value: 68.74 },
  { label: '基金', value: 28.31 },
  { label: '非标', value: 14.22 },
  { label: '现金及其他', value: 7.8 },
];

export const counterpartyStackedData = [
  { label: '银行', total: 100.12, values: [52.36, 28.21, 12.15, 5.4, 2] },
  { label: '证券', total: 72.35, values: [36.28, 20.14, 8.05, 4.7, 3.18] },
  { label: '信托', total: 48.26, values: [22.31, 12.36, 7.56, 3.11, 2.92] },
  { label: '资管', total: 32.18, values: [15.26, 7.85, 5.12, 2.15, 1.8] },
  { label: '基金', total: 21.66, values: [9.87, 6.12, 3.44, 1.49, 0.74] },
  { label: '其他', total: 11.78, values: [5.2, 3.1, 1.6, 1.4, 0.48] },
];

export const counterpartyStackLegend = ['债券', '股票', '基金', '非标', '其他'];

export const singleLargeMetrics = [
  { title: '总持仓规模', value: '285.53', unit: '亿元', change: '较上月 +12.80 亿元', subChange: '较年初 +4.70%' },
  { title: '最大专业公司敞口', value: '137.01', unit: '亿元', change: '银行, 占比 48.01%' },
  { title: '出险预警金额', value: '217.82', unit: '亿元', change: '' },
  { title: '黑灰名单', value: '黑名单 4 条', unit: '', change: '灰名单 6 条' },
  { title: '最新评级（内部）', value: '7A', unit: '', change: '2025-06-20' },
];

export const currentWarningSummaryRows = [
  { key: 'defaulted', label: '出险', valueKey: 'defaulted' },
  { key: 'major', label: '重大预警', valueKey: 'major' },
  { key: 'second', label: '二级预警', valueKey: 'second' },
  { key: 'first', label: '一级预警', valueKey: 'first' },
] as const;

export const singleLargeWarningDrilldown = [
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

export type SentimentRiskLevel = 'high' | 'medium';

export type SentimentFeedItem = {
  title: string;
  customer: string;
  date: string;
  level: SentimentRiskLevel;
  summary: string;
  body: string;
};

export const singleLargeCustomerSentimentFeed: Record<SentimentRiskLevel, SentimentFeedItem[]> = {
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
