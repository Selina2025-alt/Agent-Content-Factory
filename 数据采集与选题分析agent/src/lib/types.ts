export type TabId = "report" | "content" | "settings";
export type ReportView = "daily" | "summary";
export type PlatformId = "all" | "douyin" | "xiaohongshu" | "weibo" | "bilibili";
export type TimeOfDay = "上午" | "下午" | "晚上";

export interface ActionItem {
  id: string;
  type: "topic" | "signal" | "review";
  title: string;
  summary: string;
  priority: "P1" | "P2" | "P3";
  sourceLabel: string;
  evidenceLabel: string;
}

export interface InsightEvidence {
  id: string;
  contentIds: string[];
  sourcePlatformIds: PlatformId[];
  summary: string;
}

export interface TopicIdea {
  id: string;
  title: string;
  brief: string;
  whyNow: string;
  hook: string;
  growthSpace: string;
  sourcePlatforms: PlatformId[];
  evidenceCount: number;
  coreSamples: string[];
  burstWindow: string;
  streakDays: number;
  confidence: string;
  evidence: InsightEvidence[];
}

export interface DailyReport {
  date: string;
  hotSummary: string;
  focusSummary: string;
  patternSummary: string;
  insightSummary: string;
  platformsInvolved: number;
  topicCount: number;
  topics: TopicIdea[];
}

export interface ContentItem {
  id: string;
  date: string;
  timeOfDay: TimeOfDay;
  title: string;
  platformId: Exclude<PlatformId, "all">;
  author: string;
  publishedAt: string;
  heatScore: number;
  metrics: {
    likes: string;
    comments: string;
    saves: string;
  };
  matchedTargets: string[];
  aiSummary: string;
  linkedTopicIds: string[];
  includedInDailyReport: boolean;
  inTopicPool: boolean;
}

export interface PlatformSetting {
  id: Exclude<PlatformId, "all">;
  label: string;
  enabled: boolean;
  syncedAt: string;
  keywordCount: number;
  creatorCount: number;
  successRate: string;
  qualityRate: string;
  recommendation: string;
}

export interface KeywordTarget {
  id: string;
  label: string;
  platformLabels: string;
  hitCount: number;
  qualityRate: string;
  qualityHint: string;
  overlapHint: string;
}

export interface CreatorTarget {
  id: string;
  name: string;
  platformLabel: string;
  profile: string;
  updatedAt: string;
  hotContentStatus: string;
  weeklyActivity: string;
  hotSampleContribution: number;
  healthHint: string;
}

export interface ScheduleConfig {
  frequency: string;
  time: string;
  analysisScope: string;
  model: string;
}

export interface DecisionSignals {
  priorityDistribution: string[];
  anomalySignals: string[];
  risingTopics: string[];
  emergingKeywords: string[];
  reviewItems: string[];
}

export interface MonitorCategory {
  id: string;
  name: string;
  description: string;
  lastRunAt: string;
  todayCollectionCount: number;
  reportStatus: string;
  overview: {
    platformCount: number;
    keywordCount: number;
    creatorCount: number;
    updatedAt: string;
  };
  actionItems: ActionItem[];
  reports: DailyReport[];
  content: ContentItem[];
  settings: {
    platforms: PlatformSetting[];
    keywords: KeywordTarget[];
    creators: CreatorTarget[];
    schedule: ScheduleConfig;
  };
  decisionSignals: DecisionSignals;
}

export interface WorkbenchState {
  selectedCategoryId: string;
  activeTab: TabId;
  reportView: ReportView;
  selectedReportDate: string;
  selectedContentDate: string;
  selectedPlatformId: PlatformId;
  focusedTopicId: string | null;
  highlightedContentIds: string[];
}
