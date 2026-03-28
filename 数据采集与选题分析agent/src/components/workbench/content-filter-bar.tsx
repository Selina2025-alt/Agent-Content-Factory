import type { ContentPoolView, ContentRangeId, PlatformId } from "@/lib/types";

interface FilterItem<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface ContentFilterBarProps {
  platforms: Array<FilterItem<PlatformId>>;
  ranges: Array<FilterItem<ContentRangeId>>;
  poolViews: Array<FilterItem<ContentPoolView>>;
  selectedPlatformId: PlatformId;
  selectedRangeId: ContentRangeId;
  selectedPoolView: ContentPoolView;
  onSelectPlatformId: (platformId: PlatformId) => void;
  onSelectRangeId: (rangeId: ContentRangeId) => void;
  onSelectPoolView: (view: ContentPoolView) => void;
}

export function ContentFilterBar({
  platforms,
  ranges,
  poolViews,
  selectedPlatformId,
  selectedRangeId,
  selectedPoolView,
  onSelectPlatformId,
  onSelectRangeId,
  onSelectPoolView
}: ContentFilterBarProps) {
  return (
    <section className="workbench-shell__filter-stack">
      <div className="workbench-shell__filter-group" role="group" aria-label="平台筛选">
        {platforms.map((platform) => {
          const isSelected = platform.id === selectedPlatformId;

          return (
            <button
              key={platform.id}
              type="button"
              className={isSelected ? "workbench-shell__tab is-active" : "workbench-shell__tab"}
              aria-pressed={isSelected}
              onClick={() => onSelectPlatformId(platform.id)}
            >
              {platform.count != null ? `${platform.label} ${platform.count}` : platform.label}
            </button>
          );
        })}
      </div>

      <div className="workbench-shell__filter-row">
        <div className="workbench-shell__filter-group" role="group" aria-label="时间范围">
          {ranges.map((range) => {
            const isSelected = range.id === selectedRangeId;

            return (
              <button
                key={range.id}
                type="button"
                className={isSelected ? "workbench-shell__tab is-active" : "workbench-shell__tab"}
                aria-pressed={isSelected}
                onClick={() => onSelectRangeId(range.id)}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        <div className="workbench-shell__filter-group" role="group" aria-label="内容池筛选">
          {poolViews.map((view) => {
            const isSelected = view.id === selectedPoolView;

            return (
              <button
                key={view.id}
                type="button"
                className={isSelected ? "workbench-shell__tab is-active" : "workbench-shell__tab"}
                aria-pressed={isSelected}
                onClick={() => onSelectPoolView(view.id)}
              >
                {view.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ContentFilterBar;
