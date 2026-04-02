import type {
  ReplicaAnalysisMode,
  ReplicaDailyReport
} from "@/lib/replica-workbench-data";

interface ReplicaAnalysisPanelProps {
  reports: ReplicaDailyReport[];
  selectedReportId: string;
  analysisMode: ReplicaAnalysisMode;
  reportWindow: 7 | 14;
  onSelectReport: (reportId: string) => void;
  onSelectMode: (mode: ReplicaAnalysisMode) => void;
  onSelectWindow: (window: 7 | 14) => void;
  onViewSupportContent: () => void;
}

export function ReplicaAnalysisPanel({
  reports,
  selectedReportId,
  analysisMode,
  reportWindow,
  onSelectReport,
  onSelectMode,
  onSelectWindow,
  onViewSupportContent
}: ReplicaAnalysisPanelProps) {
  const visibleReports = reports.slice(0, reportWindow);
  const activeReport = visibleReports.find((report) => report.id === selectedReportId) ?? visibleReports[0];

  return (
    <div className="replica-shell__analysis-shell">
      <div className="replica-shell__analysis-toolbar">
        <div className="replica-shell__analysis-dates">
          {visibleReports.map((report) => (
            <button
              key={report.id}
              className={`replica-shell__report-chip ${
                report.id === activeReport?.id ? "is-active" : ""
              }`}
              type="button"
              onClick={() => onSelectReport(report.id)}
            >
              <span className="replica-shell__report-date">{report.date}</span>
            </button>
          ))}
        </div>

        <div className="replica-shell__analysis-actions">
          <div className="replica-shell__mini-switch">
            <button
              className={analysisMode === "daily" ? "is-active" : ""}
              type="button"
              onClick={() => onSelectMode("daily")}
            >
              日报
            </button>
            <button
              className={analysisMode === "summary" ? "is-active" : ""}
              type="button"
              onClick={() => onSelectMode("summary")}
            >
              汇总
            </button>
          </div>

          <div className="replica-shell__mini-switch">
            <button
              className={reportWindow === 7 ? "is-active" : ""}
              type="button"
              onClick={() => onSelectWindow(7)}
            >
              最近 7 天
            </button>
            <button
              className={reportWindow === 14 ? "is-active" : ""}
              type="button"
              onClick={() => onSelectWindow(14)}
            >
              最近 14 天
            </button>
          </div>
        </div>
      </div>

      {analysisMode === "daily" && activeReport ? (
        <div className="replica-shell__analysis-grid">
          <section className="replica-shell__analysis-card">
            <h4>今日热点摘要</h4>
            <p>{activeReport.hotSummary}</p>
          </section>
          <section className="replica-shell__analysis-card">
            <h4>前一天用户关注焦点</h4>
            <p>{activeReport.focusSummary}</p>
          </section>
          <section className="replica-shell__analysis-card">
            <h4>爆款内容共性拆解</h4>
            <p>{activeReport.patternSummary}</p>
          </section>
          <section className="replica-shell__analysis-card">
            <h4>洞察建议</h4>
            <p>{activeReport.insightSummary}</p>
          </section>

          <section className="replica-shell__analysis-card replica-shell__analysis-card--full">
            <h4>选题建议</h4>
            <div className="replica-shell__topic-list">
              {activeReport.suggestions.map((suggestion) => (
                <article key={suggestion.id} className="replica-shell__topic-card">
                  <h5>{suggestion.title}</h5>
                  <p>{suggestion.intro}</p>
                  <dl>
                    <div>
                      <dt>为什么做这个选题</dt>
                      <dd>{suggestion.whyNow}</dd>
                    </div>
                    <div>
                      <dt>爆点在哪里</dt>
                      <dd>{suggestion.hook}</dd>
                    </div>
                    <div>
                      <dt>增长空间在哪里</dt>
                      <dd>{suggestion.growth}</dd>
                    </div>
                  </dl>
                  <button type="button" onClick={onViewSupportContent}>
                    查看支撑内容
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="replica-shell__summary-shell">
          <h4>最近 14 天选题方向汇总</h4>
          <div className="replica-shell__topic-list">
            {visibleReports.flatMap((report) =>
              report.suggestions.map((suggestion) => (
                <article key={suggestion.id} className="replica-shell__topic-card">
                  <div className="replica-shell__topic-meta">{report.date}</div>
                  <h5>{suggestion.title}</h5>
                  <p>{suggestion.intro}</p>
                  <button type="button" onClick={onViewSupportContent}>
                    查看支撑内容
                  </button>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReplicaAnalysisPanel;
