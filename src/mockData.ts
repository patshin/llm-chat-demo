export type RiskStatus = '正常' | '预警' | '超限';

export const generalEnterpriseGroups = [
  { name: '万科集团', limit: 650, limitUsage: 102.3 },
  { name: '龙湖集团', limit: 180, limitUsage: 92.1 },
  { name: '保利发展', limit: 150, limitUsage: 75.6 },
  { name: '招商蛇口', limit: 120, limitUsage: 68.4 },
  { name: '华润置地', limit: 95, limitUsage: 53.7 },
  { name: '绿城中国', limit: 75, limitUsage: 41.2 },
];

export const financialInstitutionGroups = [
  { name: '平安集团', limit: 420, limitUsage: 96.5 },
  { name: '中信集团', limit: 360, limitUsage: 82.4 },
  { name: '招商局集团', limit: 300, limitUsage: 78.6 },
  { name: '光大集团', limit: 220, limitUsage: 65.2 },
  { name: '国寿集团', limit: 180, limitUsage: 58.9 },
  { name: '华泰证券', limit: 120, limitUsage: 42.7 },
];

export const vankeTrendData = [
  { month: '2024-06', exposure: 420, concentration: 67.5, threshold: 80 },
  { month: '2024-07', exposure: 435, concentration: 68.1, threshold: 80 },
  { month: '2024-08', exposure: 460, concentration: 69.0, threshold: 80 },
  { month: '2024-09', exposure: 480, concentration: 71.2, threshold: 80 },
  { month: '2024-10', exposure: 510, concentration: 72.2, threshold: 80 },
  { month: '2024-11', exposure: 530, concentration: 72.8, threshold: 80 },
  { month: '2024-12', exposure: 550, concentration: 74.1, threshold: 80 },
  { month: '2025-01', exposure: 570, concentration: 75.3, threshold: 80 },
  { month: '2025-02', exposure: 600, concentration: 76.8, threshold: 80 },
  { month: '2025-03', exposure: 620, concentration: 77.6, threshold: 80 },
  { month: '2025-04', exposure: 640, concentration: 78.2, threshold: 80 },
  { month: '2025-05', exposure: 650, concentration: 78.6, threshold: 80 },
];

export const vankeMemberCompanyData = [
  { name: '银行', value: 260 },
  { name: '寿险', value: 155 },
  { name: '证券', value: 95 },
  { name: '资管', value: 70 },
  { name: '信托', value: 45 },
  { name: '基金', value: 25 },
];

export const vankeMemberCompanyComparisonData = [
  { name: '银行', previous: 210, current: 260 },
  { name: '寿险', previous: 130, current: 155 },
  { name: '证券', previous: 75, current: 95 },
  { name: '资管', previous: 50, current: 70 },
  { name: '信托', previous: 30, current: 45 },
  { name: '基金', previous: 15, current: 25 },
];

export const vankeMetrics = [
  { title: '已占用额度', value: '650', unit: '亿元', change: '较上月 +xx亿元' },
  { title: '限额占用比例', value: '78.6%', unit: '', change: '较上月 +3.2%' },
  { title: '统一信评', value: '2C', unit: '', change: '' },
  { title: '集中度限额占用预警', value: '预警', unit: '', change: '', badge: true },
];

export type NameListType = '黑名单' | '灰名单' | '白名单' | '白名单*';

export type NameListItem = {
  name: string;
  reason: string;
  date: string;
  reporter: string;
};

function expandNameListItems(seedItems: NameListItem[], targetCount: number): NameListItem[] {
  return Array.from({ length: targetCount }, (_, index) => {
    const seedItem = seedItems[index % seedItems.length];

    if (index < seedItems.length) {
      return seedItem;
    }

    return {
      ...seedItem,
      name: `${seedItem.name}（样本${String(index + 1).padStart(2, '0')}）`,
    };
  });
}

const blackListSeedItems: NameListItem[] = [
  {
    name: '万科物业服务有限公司',
    reason: '存在违约或重大负面舆情',
    date: '2024-12-29',
    reporter: '寿险',
  },
  {
    name: '深圳万科企业股份有限公司',
    reason: '债务逾期，司法执行记录增加',
    date: '2025-01-15',
    reporter: '银行',
  },
  {
    name: '万科地产官网开发有限公司',
    reason: '现金流恶化，触发内部风险规则',
    date: '2025-02-08',
    reporter: '证券',
  },
  {
    name: '万科城市建设有限公司',
    reason: '公开市场评级下调，债务风险上升',
    date: '2025-02-21',
    reporter: '银行',
  },
  {
    name: '万科商业管理有限公司',
    reason: '重大合同纠纷，涉诉金额较大',
    date: '2025-03-05',
    reporter: '信托',
  },
];

export const blackListItems = expandNameListItems(blackListSeedItems, 55);

const greyListSeedItems: NameListItem[] = [
  {
    name: '万科物业华东区域公司',
    reason: '行业风险抬升，需持续观察',
    date: '2025-01-08',
    reporter: '寿险',
  },
  {
    name: '万科南方区域公司',
    reason: '经营现金流波动较大',
    date: '2025-01-20',
    reporter: '银行',
  },
  {
    name: '万科华东区域公司',
    reason: '外部评级展望调整为负面',
    date: '2025-02-11',
    reporter: '证券',
  },
  {
    name: '万科城市运营有限公司',
    reason: '存在短期偿债压力',
    date: '2025-02-26',
    reporter: '资管',
  },
];

export const greyListItems = expandNameListItems(greyListSeedItems, 70);

const whiteListSeedItems: NameListItem[] = [
  {
    name: '万科物业管理（深圳）有限公司',
    reason: '经营稳健，授信履约记录良好',
    date: '2024-11-18',
    reporter: '银行',
  },
  {
    name: '万科基金管理有限公司',
    reason: '现金流稳定，风险评级较低',
    date: '2024-12-05',
    reporter: '寿险',
  },
  {
    name: '万科住宅开发有限公司',
    reason: '合作历史良好，无重大负面记录',
    date: '2025-01-12',
    reporter: '基金',
  },
];

export const whiteListItems = expandNameListItems(whiteListSeedItems, 30);

export const nameListStats = [
  { type: '黑名单' as NameListType, count: blackListItems.length },
  { type: '灰名单' as NameListType, count: greyListItems.length },
  { type: '白名单*' as NameListType, count: whiteListItems.length },
];

export const nameListMetrics = [
  { title: '名单库主体总数', value: String(blackListItems.length + greyListItems.length + whiteListItems.length), unit: '个', change: '较上月 +12 个', tone: 'orange' },
  { title: '黑名单主体', value: String(blackListItems.length), unit: '个', change: '较上月 +6 个', tone: 'black' },
  { title: '灰名单主体', value: String(greyListItems.length), unit: '个', change: '较上月 +4 个', tone: 'grey' },
  { title: '白名单*主体', value: String(whiteListItems.length), unit: '个', change: '较上月 +2 个', tone: 'white' },
];

export const entityHitResult = {
  name: '万科服务有限公司',
  listType: '黑名单' as NameListType,
  group: '万科企业集团',
  reason: '该客户存在违约或负面舆情',
  date: '2024-12-29',
  reporter: '寿险',
  suggestion: `分级固定展示：
黑名单：禁止主动新增业务，存量业务进入清收处置流程
灰名单：暂定主动新增业务，强化存量业务监控并择机退出
白名单*：暂停主动新增业务，强化存量业务监控并择机退出`,
};

export const ratingEntitySummary = {
  name: '深圳华侨城股份有限公司',
  group: '华侨城集团',
  subjectType: '上市公司 / 交易对手',
  industry: '综合旅游 / 房地产',
  updatedAt: '2025-11-24',
  highestInternalRating: '3B',
  lowestInternalRating: '3D',
  latestInternalRating: '3B',
  latestExternalAgency: '大公国际',
  latestExternalRating: 'AAA',
  latestExternalOutlook: '稳定',
  latestExternalDate: '2025-11-24',
  riskStatus: '关注',
};

export const internalRatingTrendData = [
  { date: '2024-01', rating: '2C', value: 4, note: '期初评级' },
  { date: '2024-04', rating: '2B', value: 3, note: '财务结构优化，盈利能力增强' },
  { date: '2024-07', rating: '3D', value: 8, note: '行业景气度下行，盈利承压' },
  { date: '2024-10', rating: '3C', value: 7, note: '经营基本稳定，财务指标边际改善' },
  { date: '2025-01', rating: '3D', value: 8, note: '现金流偏紧，短期偿债压力上升' },
  { date: '2025-05', rating: '3B', value: 6, note: '经营表现改善，现金流压力有所缓解' },
];

export const internalRatingHistory = [
  { date: '2025-05-20', rating: '3B', change: '较上期 ↑1档', note: '经营表现改善，现金流压力有所缓解' },
  { date: '2025-01-15', rating: '3D', change: '较上期 ↓1档', note: '现金流偏紧，短期偿债压力上升' },
  { date: '2024-10-18', rating: '3C', change: '较上期 ↑1档', note: '经营基本稳定，财务指标边际改善' },
  { date: '2024-07-12', rating: '3D', change: '较上期 ↓2档', note: '行业景气度下行，盈利承压' },
  { date: '2024-04-20', rating: '2B', change: '较上期 ↑1档', note: '财务结构优化，盈利能力增强' },
  { date: '2024-01-10', rating: '2C', change: '--', note: '期初评级' },
];

export const internalAnnualRatingRecords = [
  { company: '中国平安人寿保险股份有限公司', rating: '4B', reportYear: 2025, effectiveDate: '2025-11-24' },
  { company: '中国平安财产保险股份有限公司', rating: '4A', reportYear: 2025, effectiveDate: '2025-11-24' },
  { company: '平安银行股份有限公司', rating: '4A', reportYear: 2025, effectiveDate: '2025-11-24' },
  { company: '平安信托有限责任公司', rating: '4B', reportYear: 2024, effectiveDate: '2024-11-24' },
  { company: '平安证券股份有限公司', rating: '4A', reportYear: 2025, effectiveDate: '2025-11-24' },
  { company: '平安基金管理有限公司', rating: '3D', reportYear: 2025, effectiveDate: '2025-11-24' },
];

export const externalRatingAgencies = [
  {
    agency: '大公国际',
    rating: 'AAA',
    date: '2025-11-24',
    outlook: '稳定',
    history: [
      { date: '2025-11-24', rating: 'AAA', outlook: '稳定' },
      { date: '2024-11-10', rating: 'AAA', outlook: '稳定' },
      { date: '2023-10-28', rating: 'AA+', outlook: '稳定' },
      { date: '2022-09-18', rating: 'AA+', outlook: '负面' },
      { date: '2021-08-30', rating: 'AA', outlook: '稳定' },
    ],
  },
  {
    agency: '联合资信',
    rating: 'AAA',
    date: '2025-08-15',
    outlook: '稳定',
    history: [
      { date: '2025-08-15', rating: 'AAA', outlook: '稳定' },
      { date: '2024-08-16', rating: 'AAA', outlook: '稳定' },
      { date: '2023-08-20', rating: 'AAA', outlook: '稳定' },
      { date: '2022-08-21', rating: 'AA+', outlook: '稳定' },
      { date: '2021-08-18', rating: 'AA+', outlook: '稳定' },
    ],
  },
  {
    agency: '中诚信国际',
    rating: 'AA+',
    date: '2024-11-10',
    outlook: '负面',
    history: [
      { date: '2024-11-10', rating: 'AA+', outlook: '负面' },
      { date: '2023-11-12', rating: 'AA+', outlook: '稳定' },
      { date: '2022-11-09', rating: 'AA', outlook: '稳定' },
      { date: '2021-11-15', rating: 'AA', outlook: '稳定' },
      { date: '2020-11-18', rating: 'AA', outlook: '稳定' },
    ],
  },
  {
    agency: '东方金诚',
    rating: 'AA+',
    date: '2024-05-22',
    outlook: '稳定',
    history: [
      { date: '2024-05-22', rating: 'AA+', outlook: '稳定' },
      { date: '2023-05-20', rating: 'AA+', outlook: '稳定' },
      { date: '2022-05-18', rating: 'AA', outlook: '稳定' },
      { date: '2021-05-25', rating: 'AA', outlook: '稳定' },
      { date: '2020-05-21', rating: 'AA', outlook: '稳定' },
    ],
  },
];

export const externalRatingMeaning = {
  title: '大公国际 AAA 评级的含义',
  content:
    'AAA：偿还债务的能力极强，基本不受不利经济环境的影响，违约风险极低。企业基本面极其稳健，盈利能力很强，现金流非常充裕，债务负担很轻，流动性状况极佳。以上为评级含义的简要说明，具体请以评级机构公开标准为准。',
};

export const warningInsuranceOverview = {
  totalSubjects: 86,
  totalExposure: 520,
  majorWarningSubjects: 12,
  secondLevelWarningSubjects: 18,
  firstLevelWarningSubjects: 30,
  defaultSubjects: 26,
};

export const warningInsuranceTrendData = [
  { month: '2025-01', major: 22, second: 42, first: 95, defaulted: 20, total: 179 },
  { month: '2025-02', major: 24, second: 45, first: 103, defaulted: 20, total: 192 },
  { month: '2025-03', major: 26, second: 48, first: 107, defaulted: 20, total: 201 },
  { month: '2025-04', major: 25, second: 47, first: 106, defaulted: 20, total: 198 },
  { month: '2025-05', major: 24, second: 46, first: 105, defaulted: 20, total: 195 },
  { month: '2025-06', major: 30, second: 50, first: 117.82, defaulted: 20, total: 217.82 },
];

export const warningInsuranceMemberDistribution = [
  { member: '银行', major: 45, second: 60, first: 70, defaulted: 35, total: 210 },
  { member: '寿险', major: 30, second: 40, first: 50, defaulted: 25, total: 145 },
  { member: '证券', major: 15, second: 20, first: 25, defaulted: 15, total: 75 },
  { member: '信托', major: 10, second: 18, first: 22, defaulted: 10, total: 60 },
  { member: '资管', major: 4, second: 6, first: 7, defaulted: 3, total: 20 },
  { member: '其他', major: 2, second: 3, first: 4, defaulted: 1, total: 10 },
];

export const vankeWarningInsuranceSummary = {
  groupName: '万科企业集团',
  exposure: 200,
  majorWarningAmount: 30,
  secondLevelWarningAmount: 50,
  firstLevelWarningAmount: 80,
  defaultAmount: 20,
};

export const vankeRiskDrilldown = [
  {
    key: 'defaulted',
    label: '出险金额',
    amount: 20,
    ratio: '10.0%',
    members: [
      {
        name: '寿险',
        amount: 8,
        ratio: '40.0%',
        subsidiaries: [
          { name: '万科企业股份有限公司', amount: 5, ratio: '62.5%', reason: '债务展期，触发出险规则' },
          { name: '万科地产上海有限公司', amount: 3, ratio: '37.5%', reason: '还款安排调整' },
        ],
      },
      {
        name: '银行',
        amount: 7,
        ratio: '35.0%',
        subsidiaries: [
          { name: '万科服务有限公司', amount: 4, ratio: '57.1%', reason: '付款逾期' },
          { name: '万科地产华南有限公司', amount: 3, ratio: '42.9%', reason: '现金流缺口' },
        ],
      },
      {
        name: '信托',
        amount: 5,
        ratio: '25.0%',
        subsidiaries: [
          { name: '万科商业管理有限公司', amount: 5, ratio: '100.0%', reason: '信托计划展期' },
        ],
      },
    ],
  },
  {
    key: 'major',
    label: '重大预警金额',
    amount: 30,
    ratio: '15.0%',
    members: [
      {
        name: '银行',
        amount: 12,
        ratio: '40.0%',
        subsidiaries: [
          {
            name: '万科（重庆）企业有限公司',
            amount: 5,
            ratio: '41.7%',
            reason: '现金流压力上升',
            company: '万科（重庆）企业有限公司',
            projectName: '平安-万科重庆台等你不动产债券投资计划',
            warningStartTime: '2025-01-01',
            memberCompany: '寿险',
            businessType: '非标',
          },
          { name: '万科地产华南有限公司', amount: 4, ratio: '33.3%', reason: '销售回款下降' },
          { name: '万科物业发展有限公司', amount: 3, ratio: '25.0%', reason: '负面舆情增加' },
        ],
      },
      {
        name: '寿险',
        amount: 10,
        ratio: '33.3%',
        subsidiaries: [
          { name: '万科企业股份有限公司', amount: 6, ratio: '60.0%', reason: '评级展望承压' },
          { name: '万科地产上海有限公司', amount: 4, ratio: '40.0%', reason: '经营现金流波动' },
        ],
      },
      {
        name: '信托',
        amount: 8,
        ratio: '26.7%',
        subsidiaries: [
          { name: '万科地产北京有限公司', amount: 5, ratio: '62.5%', reason: '债务压力上升' },
          { name: '万科商业管理有限公司', amount: 3, ratio: '37.5%', reason: '资产处置进展缓慢' },
        ],
      },
    ],
  },
  {
    key: 'second',
    label: '二级预警金额',
    amount: 50,
    ratio: '25.0%',
    members: [
      {
        name: '银行',
        amount: 20,
        ratio: '40.0%',
        subsidiaries: [
          { name: '万科服务有限公司', amount: 8, ratio: '40.0%', reason: '偿债指标弱化' },
          { name: '万科地产华东有限公司', amount: 7, ratio: '35.0%', reason: '销售回款放缓' },
          { name: '万科物流发展有限公司', amount: 5, ratio: '25.0%', reason: '经营利润下降' },
        ],
      },
      {
        name: '寿险',
        amount: 15,
        ratio: '30.0%',
        subsidiaries: [
          { name: '万科企业股份有限公司', amount: 9, ratio: '60.0%', reason: '行业景气度下行' },
          { name: '万科地产深圳有限公司', amount: 6, ratio: '40.0%', reason: '现金流承压' },
        ],
      },
      {
        name: '证券',
        amount: 10,
        ratio: '20.0%',
        subsidiaries: [
          { name: '万科物业服务有限公司', amount: 6, ratio: '60.0%', reason: '负面舆情增加' },
          { name: '万科城市更新有限公司', amount: 4, ratio: '40.0%', reason: '项目回款延迟' },
        ],
      },
      {
        name: '资管',
        amount: 5,
        ratio: '10.0%',
        subsidiaries: [
          { name: '万科商业管理有限公司', amount: 5, ratio: '100.0%', reason: '资产估值波动' },
        ],
      },
    ],
  },
  {
    key: 'first',
    label: '一级预警金额',
    amount: 80,
    ratio: '40.0%',
    members: [
      {
        name: '银行',
        amount: 30,
        ratio: '37.5%',
        subsidiaries: [
          { name: '万科服务有限公司', amount: 12, ratio: '40.0%', reason: '经营现金流波动' },
          { name: '万科地产华南有限公司', amount: 10, ratio: '33.3%', reason: '行业风险上升' },
          { name: '万科物业发展有限公司', amount: 8, ratio: '26.7%', reason: '收入增长放缓' },
        ],
      },
      {
        name: '寿险',
        amount: 25,
        ratio: '31.3%',
        subsidiaries: [
          { name: '万科企业股份有限公司', amount: 15, ratio: '60.0%', reason: '财务指标边际弱化' },
          { name: '万科地产上海有限公司', amount: 10, ratio: '40.0%', reason: '偿债压力上升' },
        ],
      },
      {
        name: '证券',
        amount: 15,
        ratio: '18.8%',
        subsidiaries: [
          { name: '万科城市更新有限公司', amount: 9, ratio: '60.0%', reason: '项目周转放缓' },
          { name: '万科物流发展有限公司', amount: 6, ratio: '40.0%', reason: '市场波动影响' },
        ],
      },
      {
        name: '信托',
        amount: 10,
        ratio: '12.5%',
        subsidiaries: [
          { name: '万科地产北京有限公司', amount: 6, ratio: '60.0%', reason: '区域销售承压' },
          { name: '万科商业管理有限公司', amount: 4, ratio: '40.0%', reason: '租金回款放缓' },
        ],
      },
    ],
  },
];

export const largeCustomerOverview = {
  date: '2025-06-30',
  totalCustomers: 325,
  totalExposure: 3286.75,
  momExposureChange: 128.63,
  ytdExposureChange: 512.34,
  keyManagementCustomers: 126,
  keyManagementExposure: 1871.36,
  keyManagementExposureRatio: '56.96%',
  defaultCustomers: 23,
};

export const largeCustomerTrendData = [
  { month: '2024-12', customerCount: 278, totalExposure: 2774.41 },
  { month: '2025-01', customerCount: 285, totalExposure: 2820.18 },
  { month: '2025-02', customerCount: 291, totalExposure: 2885.02 },
  { month: '2025-03', customerCount: 298, totalExposure: 2978.61 },
  { month: '2025-04', customerCount: 305, totalExposure: 3078.12 },
  { month: '2025-05', customerCount: 307, totalExposure: 3158.12 },
  { month: '2025-06', customerCount: 325, totalExposure: 3286.75 },
];

export const keyManagementLargeCustomerTrendData = [
  { month: '2024-12', customerCount: 102, totalExposure: 1450.2 },
  { month: '2025-01', customerCount: 108, totalExposure: 1512.35 },
  { month: '2025-02', customerCount: 112, totalExposure: 1580.74 },
  { month: '2025-03', customerCount: 117, totalExposure: 1655.81 },
  { month: '2025-04', customerCount: 121, totalExposure: 1720.45 },
  { month: '2025-05', customerCount: 123, totalExposure: 1810.6 },
  { month: '2025-06', customerCount: 126, totalExposure: 1871.36 },
];

export const largeCustomerTableData = [
  {
    name: '万科企业集团',
    ownership: '民企',
    managementCategory: '重点管理',
    exposure: 285.53,
    momChange: 12.8,
    ytdChange: 35.6,
  },
  {
    name: '华侨城集团有限公司',
    ownership: '央企',
    managementCategory: '常态管理',
    exposure: 210.2,
    momChange: 5.3,
    ytdChange: 18.4,
  },
  {
    name: '中国中铁股份有限公司',
    ownership: '央企',
    managementCategory: '重点管理',
    exposure: 198.75,
    momChange: 6.15,
    ytdChange: 20.95,
  },
  {
    name: '碧桂园控股有限公司',
    ownership: '民企',
    managementCategory: '出险',
    exposure: 175.8,
    momChange: -3.2,
    ytdChange: 6.2,
  },
  {
    name: '中国华能集团有限公司',
    ownership: '央企',
    managementCategory: '常态管理',
    exposure: 162.4,
    momChange: 4.1,
    ytdChange: 15.3,
  },
  {
    name: '龙湖集团控股有限公司',
    ownership: '民企',
    managementCategory: '重点管理',
    exposure: 148.62,
    momChange: -2.6,
    ytdChange: 4.9,
  },
  {
    name: '平安银行股份有限公司',
    ownership: '金融机构',
    managementCategory: '常态管理',
    exposure: 132.18,
    momChange: 1.8,
    ytdChange: 9.6,
  },
  {
    name: '华润置地有限公司',
    ownership: '央企',
    managementCategory: '重点管理',
    exposure: 120.44,
    momChange: 3.2,
    ytdChange: 11.85,
  },
  {
    name: '碧桂园地产集团有限公司',
    ownership: '民企',
    managementCategory: '重点管理',
    exposure: 96.8,
    momChange: -8.4,
    ytdChange: -22.15,
  },
  {
    name: '中国建筑股份有限公司',
    ownership: '央企',
    managementCategory: '重点管理',
    exposure: 88.35,
    momChange: 4.25,
    ytdChange: 16.8,
  },
  {
    name: '招商局集团有限公司',
    ownership: '央企',
    managementCategory: '重点管理',
    exposure: 76.92,
    momChange: 2.1,
    ytdChange: 9.45,
  },
  {
    name: '保利发展控股集团股份有限公司',
    ownership: '央企',
    managementCategory: '重点管理',
    exposure: 69.74,
    momChange: 1.85,
    ytdChange: 7.2,
  },
  {
    name: '绿地控股集团有限公司',
    ownership: '混合',
    managementCategory: '重点管理',
    exposure: 58.6,
    momChange: -3.75,
    ytdChange: -11.3,
  },
  {
    name: '远洋集团控股有限公司',
    ownership: '混合',
    managementCategory: '重点管理',
    exposure: 47.25,
    momChange: -6.2,
    ytdChange: -18.9,
  },
  {
    name: '金地集团股份有限公司',
    ownership: '民企',
    managementCategory: '重点管理',
    exposure: 42.18,
    momChange: 0.95,
    ytdChange: -4.6,
  },
  {
    name: '新城控股集团股份有限公司',
    ownership: '民企',
    managementCategory: '重点管理',
    exposure: 35.72,
    momChange: 1.3,
    ytdChange: 5.1,
  },
  {
    name: '中国铁建股份有限公司',
    ownership: '央企',
    managementCategory: '重点管理',
    exposure: 31.56,
    momChange: 2.8,
    ytdChange: 6.75,
  },
  {
    name: '中海企业发展集团有限公司',
    ownership: '央企',
    managementCategory: '重点管理',
    exposure: 27.44,
    momChange: 1.1,
    ytdChange: 3.95,
  },
];

export const singleLargeCustomerProfile = {
  name: '万科企业集团',
  tag: '重点管理大户',
  creditCode: '9144030019222495XU',
  industry: '房地产业',
  ownership: '民营企业',
  foundedAt: '1984-05-30',
  totalExposure: 285.53,
  maxCompanyExposure: { company: '银行', amount: 137.01, ratio: '48.01%' },
  warningAmount: 217.82,
  warningRatio: '76.30%',
  blackListCount: 4,
  greyListCount: 6,
  latestInternalRating: '7A',
  latestInternalRatingDate: '2025-06-20',
};

export const singleLargeCustomerCompanyExposure = [
  { name: '方正证券', value: 0 },
  { name: '寿险', value: 35.8 },
  { name: '养老险', value: 1 },
  { name: '不动产', value: 70.69 },
  { name: '银行', value: 137.01 },
  { name: '资产管理', value: 41 },
  { name: '证券', value: 0.03 },
];

export const singleLargeCustomerAssetExposure = [
  { name: '非标', value: 118.5 },
  { name: '债券', value: 86.2 },
  { name: '股票', value: 42.8 },
  { name: '基金', value: 25.6 },
  { name: '其他', value: 12.43 },
];

export const holdingMemberCompanyRows = [
  { name: '银行', amount: 137.01, ratio: '47.98%' },
  { name: '不动产', amount: 70.69, ratio: '24.76%' },
  { name: '资产管理', amount: 41, ratio: '14.36%' },
  { name: '寿险', amount: 35.8, ratio: '12.54%' },
  { name: '养老险', amount: 1, ratio: '0.35%' },
  { name: '证券', amount: 0.03, ratio: '0.01%' },
  { name: '方正证券', amount: 0, ratio: '0.00%' },
];

export const holdingAssetTypeRows = [
  { name: '非标', amount: 118.5, ratio: '41.50%' },
  { name: '债券', amount: 86.2, ratio: '30.19%' },
  { name: '股票', amount: 42.8, ratio: '14.99%' },
  { name: '基金', amount: 25.6, ratio: '8.97%' },
  { name: '其他', amount: 12.43, ratio: '4.35%' },
];

export const memberCompanyHoldingDetails = {
  银行: [
    { legalEntity: '万科服务有限公司', memberCompany: '银行', assetType: '非标', productName: '万科流动资金贷款项目', startDate: '2024-01-15', endDate: '2026-01-15', amount: 38.2 },
    { legalEntity: '万科商业管理有限公司', memberCompany: '银行', assetType: '债券', productName: '22万科PPN001', startDate: '2022-11-30', endDate: '2025-11-30', amount: 15.28 },
    { legalEntity: '深圳万科企业股份有限公司', memberCompany: '银行', assetType: '非标', productName: '城市更新并购贷款', startDate: '2023-12-18', endDate: '2026-12-18', amount: 27.81 },
    { legalEntity: '万科住宅开发有限公司', memberCompany: '银行', assetType: '其他', productName: '保证金及其他余额', startDate: '2024-06-30', endDate: '2026-06-30', amount: 11.43 },
  ],
  不动产: [
    { legalEntity: '万科地产华南有限公司', memberCompany: '不动产', assetType: '非标', productName: '华南地产项目投资计划', startDate: '2023-09-20', endDate: '2026-09-20', amount: 32.49 },
    { legalEntity: '万科南方区域公司', memberCompany: '不动产', assetType: '股票', productName: '万科地产权益投资项目', startDate: '-', endDate: '-', amount: 24.37 },
    { legalEntity: '万科地产上海有限公司', memberCompany: '不动产', assetType: '非标', productName: '上海城市更新项目', startDate: '2024-03-12', endDate: '2027-03-12', amount: 13.83 },
  ],
  资产管理: [
    { legalEntity: '万科物业发展有限公司', memberCompany: '资产管理', assetType: '基金', productName: '平安资管地产债权基金', startDate: '2024-05-12', endDate: '2027-05-12', amount: 18.4 },
    { legalEntity: '万科华东区域公司', memberCompany: '资产管理', assetType: '债券', productName: '24万科债02', startDate: '2024-04-08', endDate: '2029-04-08', amount: 23.72 },
  ],
  寿险: [
    { legalEntity: '万科企业股份有限公司', memberCompany: '寿险', assetType: '债券', productName: '23万科MTN001', startDate: '2023-03-10', endDate: '2028-03-10', amount: 28.6 },
    { legalEntity: '万科基金管理有限公司', memberCompany: '寿险', assetType: '基金', productName: '万科稳健收益基金', startDate: '2024-02-01', endDate: '2027-02-01', amount: 7.2 },
  ],
  养老险: [
    { legalEntity: '万科城市运营有限公司', memberCompany: '养老险', assetType: '其他', productName: '现金管理及其他资产', startDate: '2025-01-01', endDate: '2025-12-31', amount: 1 },
  ],
  证券: [
    { legalEntity: '万科企业股份有限公司', memberCompany: '证券', assetType: '股票', productName: '万科A', startDate: '-', endDate: '-', amount: 0.03 },
  ],
  方正证券: [],
};

export const assetTypeHoldingDetails = {
  非标: [
    { legalEntity: '万科服务有限公司', memberCompany: '银行', productName: '万科流动资金贷款项目', startDate: '2024-01-15', endDate: '2026-01-15', amount: 38.2 },
    { legalEntity: '万科地产华南有限公司', memberCompany: '不动产', productName: '华南地产项目投资计划', startDate: '2023-09-20', endDate: '2026-09-20', amount: 32.49 },
    { legalEntity: '深圳万科企业股份有限公司', memberCompany: '银行', productName: '城市更新并购贷款', startDate: '2023-12-18', endDate: '2026-12-18', amount: 27.81 },
    { legalEntity: '万科地产上海有限公司', memberCompany: '不动产', productName: '上海城市更新项目', startDate: '2024-03-12', endDate: '2027-03-12', amount: 13.83 },
    { legalEntity: '万科住宅开发有限公司', memberCompany: '银行', productName: '保证金及其他余额', startDate: '2024-06-30', endDate: '2026-06-30', amount: 6.17 },
  ],
  债券: [
    { legalEntity: '万科企业股份有限公司', memberCompany: '寿险', productName: '23万科MTN001', startDate: '2023-03-10', endDate: '2028-03-10', amount: 28.6 },
    { legalEntity: '万科华东区域公司', memberCompany: '资产管理', productName: '24万科债02', startDate: '2024-04-08', endDate: '2029-04-08', amount: 23.72 },
    { legalEntity: '万科商业管理有限公司', memberCompany: '银行', productName: '22万科PPN001', startDate: '2022-11-30', endDate: '2025-11-30', amount: 15.28 },
    { legalEntity: '万科企业股份有限公司', memberCompany: '寿险', productName: '21万科MTN002', startDate: '2021-07-20', endDate: '2026-07-20', amount: 18.6 },
  ],
  股票: [
    { legalEntity: '万科南方区域公司', memberCompany: '不动产', productName: '万科地产权益投资项目', startDate: '-', endDate: '-', amount: 24.37 },
    { legalEntity: '万科企业股份有限公司', memberCompany: '证券', productName: '万科A', startDate: '-', endDate: '-', amount: 0.03 },
    { legalEntity: '万科产业投资有限公司', memberCompany: '资产管理', productName: '万科项目股权投资', startDate: '-', endDate: '-', amount: 18.4 },
  ],
  基金: [
    { legalEntity: '万科物业发展有限公司', memberCompany: '资产管理', productName: '平安资管地产债权基金', startDate: '2024-05-12', endDate: '2027-05-12', amount: 18.4 },
    { legalEntity: '万科基金管理有限公司', memberCompany: '寿险', productName: '万科稳健收益基金', startDate: '2024-02-01', endDate: '2027-02-01', amount: 7.2 },
  ],
  其他: [
    { legalEntity: '万科城市运营有限公司', memberCompany: '养老险', productName: '现金管理及其他资产', startDate: '2025-01-01', endDate: '2025-12-31', amount: 1 },
    { legalEntity: '万科住宅开发有限公司', memberCompany: '银行', productName: '保证金及其他余额', startDate: '2024-06-30', endDate: '2026-06-30', amount: 11.43 },
  ],
};

export const singleLargeCustomerFundingSources = [
  { name: '保险资金', value: 120.56, ratio: '42.25%' },
  { name: '自有资金', value: 96.13, ratio: '33.68%' },
  { name: '银行资金', value: 35.7, ratio: '12.50%' },
  { name: '资管资金', value: 22.5, ratio: '7.88%' },
  { name: '其他资金', value: 10.64, ratio: '3.69%' },
];

export const singleLargeCustomerTopHoldings = [
  { index: 1, company: '平安银行', assetType: '信贷及非标', exposure: 82.36, ratio: '28.86%', momChange: 6.25 },
  { index: 2, company: '平安不动产投资', assetType: '非标', exposure: 60.25, ratio: '21.12%', momChange: 3.8 },
  { index: 3, company: '平安信托', assetType: '信托计划', exposure: 25.6, ratio: '8.96%', momChange: 1.2 },
  { index: 4, company: '平安资产管理', assetType: '资管计划', exposure: 18.4, ratio: '6.45%', momChange: -0.3 },
  { index: 5, company: '平安人寿', assetType: '债券投资', exposure: 15.2, ratio: '5.32%', momChange: 0.85 },
];

export const singleLargeCustomerWarningMetrics = {
  major: 30,
  second: 50,
  first: 117.82,
  defaulted: 20,
  total: 217.82,
};

export const singleLargeCustomerWarningTrend = [
  { month: '2024-12', major: 20, second: 40, first: 90, defaulted: 15, total: 165 },
  { month: '2025-01', major: 22, second: 42, first: 95, defaulted: 20, total: 179 },
  { month: '2025-02', major: 24, second: 45, first: 103, defaulted: 20, total: 192 },
  { month: '2025-03', major: 26, second: 48, first: 107, defaulted: 20, total: 201 },
  { month: '2025-04', major: 25, second: 47, first: 106, defaulted: 20, total: 198 },
  { month: '2025-05', major: 24, second: 46, first: 105, defaulted: 20, total: 195 },
  { month: '2025-06', major: 30, second: 50, first: 117.82, defaulted: 20, total: 217.82 },
];

export const singleLargeCustomerWarningCompanyDistribution = [
  { company: '银行', major: 12, second: 20, first: 70, defaulted: 35, total: 137 },
  { company: '不动产', major: 8, second: 12, first: 38, defaulted: 12.69, total: 70.69 },
  { company: '资产管理', major: 4, second: 8, first: 20, defaulted: 9, total: 41 },
  { company: '寿险', major: 3, second: 6, first: 15, defaulted: 11.8, total: 35.8 },
  { company: '信托', major: 2, second: 3, first: 5, defaulted: 0, total: 10 },
  { company: '证券', major: 1, second: 1, first: 2, defaulted: 0, total: 4 },
];

export const singleLargeCustomerWarningEvents = [
  { type: '出险', company: '银行', amount: 8.5, reason: '债务展期，触发出险规则', date: '2025-06-18', status: '处置中' },
  { type: '一级预警', company: '不动产', amount: 25.3, reason: '销售回款放缓，现金流承压', date: '2025-06-10', status: '跟踪中' },
  { type: '二级预警', company: '资产管理', amount: 12, reason: '净值波动，流动性压力', date: '2025-05-28', status: '关注中' },
];

export const singleLargeCustomerRatingSummary = {
  latestInternalRating: '7A',
  latestInternalDate: '2025-06-20',
  internalRange: '3B ~ 4A',
  externalLatestRating: 'AA',
  externalAgency: '联合资信',
  riskStatus: '承压',
};

export const singleLargeCustomerRatingTrend = [
  { month: '2025-01', rating: '3B', value: 1 },
  { month: '2025-02', rating: '3C', value: 2 },
  { month: '2025-03', rating: '3D', value: 3 },
  { month: '2025-04', rating: '3D', value: 3 },
  { month: '2025-05', rating: '4A', value: 4 },
  { month: '2025-06', rating: '7A', value: 5 },
];

export const singleLargeCustomerExternalRatings = [
  { agency: '联合资信', rating: 'AA', outlook: '负面', date: '2025-06-20' },
  { agency: '中诚信国际', rating: 'AA-', outlook: '负面', date: '2025-05-18' },
  { agency: '大公国际', rating: 'AA', outlook: '稳定', date: '2025-03-28' },
];

export const singleLargeCustomerSentimentSummary = {
  total: 128,
  negative: 36,
  negativeRatio: '28.13%',
  neutral: 72,
  neutralRatio: '56.25%',
  positive: 20,
  positiveRatio: '15.62%',
};

export const singleLargeCustomerSentimentTrend = [
  { month: '2025-01', negative: 8, neutral: 10, positive: 3 },
  { month: '2025-02', negative: 6, neutral: 12, positive: 4 },
  { month: '2025-03', negative: 5, neutral: 14, positive: 4 },
  { month: '2025-04', negative: 7, neutral: 16, positive: 5 },
  { month: '2025-05', negative: 5, neutral: 12, positive: 3 },
  { month: '2025-06', negative: 5, neutral: 8, positive: 1 },
];

export const singleLargeCustomerMajorSentiments = [
  { date: '2025-06-18', title: '万科推进债务展期安排', type: '负面', tag: '金融舆情' },
  { date: '2025-05-05', title: '万科部分项目销售回款放缓', type: '负面', tag: '经营舆情' },
  { date: '2025-03-28', title: '万科项目交付压力增加', type: '负面', tag: '房地产舆情' },
];

export const singleLargeCustomerNameListSummary = {
  black: 4,
  grey: 6,
  latestDate: '2025-06-12',
  status: '关注',
};

export const singleLargeCustomerBlackListRecords = [
  { date: '2025-06-12', entity: '万科服务有限公司', reason: '现金流压力变化，偿债能力弱化', reporter: '平安银行' },
  { date: '2025-05-06', entity: '万科地产华南有限公司', reason: '负面舆情增加', reporter: '平安信托' },
  { date: '2025-03-30', entity: '万科物业发展有限公司', reason: '回款周期拉长', reporter: '平安资产管理' },
  { date: '2024-12-12', entity: '万科商业管理有限公司', reason: '债务压力上升', reporter: '平安银行' },
];

export const singleLargeCustomerGreyListRecords = [
  { date: '2025-06-15', entity: '万科物流发展有限公司', reason: '舆情负面增加', reporter: '平安寿险' },
  { date: '2025-05-12', entity: '万科城市更新有限公司', reason: '项目回款承压', reporter: '平安银行' },
  { date: '2025-04-28', entity: '万科物业服务有限公司', reason: '项目合作不及预期', reporter: '平安信托' },
];
