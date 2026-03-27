import { DateStrip, type DateStripItem } from "@/components/workbench/date-strip";
import type { DailyReport, MonitorCategory, ReportView, TopicIdea } from "@/lib/types";

interface ReportTabProps {
  activeCategory: MonitorCategory;
  report: DailyReport;
  reportView: ReportView;
  onReportViewChange: (view: ReportView) => void;
  selectedReportDate: string;
  onSelectReportDate: (date: string) => void;
  onOpenEvidence: (topic: TopicIdea) => void;
}

function buildDateItems(reports: DailyReport[]): DateStripItem[] {
  return [...reports]
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((item) => ({
      date: item.date,
      label: item.topics[0]?.title ?? "暂无选题",
      detail: `${item.topicCount} 个选题 · ${item.platformsInvolved} 个平台`
    }));
}

export function ReportTab({
  activeCategory,
  report,
  reportView,
  onReportViewChange,
  selectedReportDate,
  onSelectReportDate,
  onOpenEvidence
}: ReportTabProps) {
  const reportDates = buildDateItems(activeCategory.reports);

  return (
    <section className="workbench-shell__hero-card" aria-label={`${activeCategory.name} 报告`}>
      <div className="workbench-shell__panel-kicker">选题分析与报告</div>
      <h2>{`${activeCategory.name} 报告`}</h2>

      <DateStrip
        items={reportDates}
        selectedDate={selectedReportDate}
        onSelectDate={onSelectReportDate}
      />

      <div className="workbench-shell__header-meta" role="group" aria-label="报告视图切换">
        <button
          type="button"
          className={
            reportView === "daily"
              ? "workbench-shell__tab is-active"
              : "workbench-shell__tab"
          }
          aria-pressed={reportView === "daily"}
          onClick={() => onReportViewChange("daily")}
        >
          日报
        </button>
        <button
          type="button"
          className={
            reportView === "summary"
              ? "workbench-shell__tab is-active"
              : "workbench-shell__tab"
          }
          aria-pressed={reportView === "summary"}
          onClick={() => onReportViewChange("summary")}
        >
          汇总
        </button>
      </div>

      {reportView === "daily" ? (
        <div className="workbench-shell__insight-stack">
          <article className="workbench-shell__insight-card">
            <span>热度摘要</span>
            <strong>{report.hotSummary}</strong>
          </article>
          <article className="workbench-shell__insight-card">
            <span>关注摘要</span>
            <strong>{report.focusSummary}</strong>
          </article>
          <article className="workbench-shell__insight-card">
            <span>模式摘要</span>
            <strong>{report.patternSummary}</strong>
          </article>
          <article className="workbench-shell__insight-card">
            <span>洞察摘要</span>
            <strong>{report.insightSummary}</strong>
          </article>
        </div>
      ) : (
        <div className="workbench-shell__insight-stack">
          <article className="workbench-shell__insight-card">
            <span>汇总视图</span>
            <strong>
              {`${report.date} 共 ${report.topicCount} 个选题，覆盖 ${report.platformsInvolved} 个平台。`}
            </strong>
            <p>{report.hotSummary}</p>
          </article>
          <article className="workbench-shell__insight-card">
            <span>关键结论</span>
            <strong>{report.insightSummary}</strong>
          </article>
        </div>
      )}

      <div className="workbench-shell__action-deck">
        {report.topics.map((topic) => (
          <article key={topic.id} className="workbench-shell__workspace-card">
            <span>
              {topic.confidence} · {topic.evidenceCount} 条支撑内容
            </span>
            <strong>{topic.title}</strong>
            <p>{topic.brief}</p>
            <small>{topic.whyNow}</small>
            <button
              type="button"
              className="workbench-shell__tab"
              aria-label={`查看支撑内容：${topic.title}`}
              onClick={() => onOpenEvidence(topic)}
            >
              查看支撑内容
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReportTab;
