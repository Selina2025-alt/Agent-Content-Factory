const categoryData = [
  { id: "claude", icon: "⚡", name: "Claude Code 选题监控", count: 342, keyword: "claude code" },
  { id: "vibe", icon: "🎵", name: "Vibe Coding 选题监控", count: 218, keyword: "vibe coding" },
  { id: "agent", icon: "🤖", name: "AI Agent 趋势追踪", count: 456, keyword: "ai agent" },
  { id: "indie", icon: "🚀", name: "独立开发者生态", count: 189, keyword: "独立开发" }
];

const platforms = [
  { id: "all", label: "全部平台", icon: "" },
  { id: "douyin", label: "抖音", icon: "🎵" },
  { id: "xiaohongshu", label: "小红书", icon: "📕" },
  { id: "weibo", label: "微博", icon: "🔥" },
  { id: "bilibili", label: "B站", icon: "📺" },
  { id: "twitter", label: "Twitter/X", icon: "✕" },
  { id: "wechat", label: "公众号", icon: "💬" },
  { id: "zhihu", label: "知乎", icon: "💡" }
];

const dates = [
  { id: "d25", hint: "昨天", day: "25", week: "周三", dots: ["#61a8ff", "#7cb6ff", "#61a8ff"] },
  { id: "d24", hint: "前天", day: "24", week: "周二", dots: ["#d5dae5"] },
  { id: "d23", hint: "3天前", day: "23", week: "周一", dots: ["#6bc4d4", "#87d6e2", "#6bc4d4"] },
  { id: "d22", hint: "4天前", day: "22", week: "周日", dots: ["#d5dae5"] },
  { id: "d21", hint: "5天前", day: "21", week: "周六", dots: ["#6cc4d4", "#6cc4d4", "#6cc4d4"] },
  { id: "d20", hint: "6天前", day: "20", week: "周五", dots: ["#72aefb", "#72aefb", "#72aefb"] },
  { id: "d19", hint: "2月18日", day: "19", week: "周四", dots: ["#71aefb", "#71aefb", "#71aefb"] },
  { id: "d18", hint: "2月17日", day: "18", week: "周三", dots: ["#6cc4d4", "#6cc4d4", "#6cc4d4"] },
  { id: "d17", hint: "2月16日", day: "17", week: "周二", dots: ["#71aefb", "#71aefb", "#71aefb"] },
  { id: "d16", hint: "2月15日", day: "16", week: "周一", dots: ["#71aefb", "#71aefb", "#71aefb"] }
];

const articleTemplates = {
  claude: [
    {
      platform: "wechat",
      author: "夕小瑶科技说",
      title: "{keyword} + 开源工具的暴力工作流，下次直接躺赢",
      excerpt:
        "前两天有个朋友问我最近在忙什么。我说我翻了两本书，一本回忆录，一本园区录，542页。一本讲 OpenAI 和 DeepMind 的，350 页。加起来四十多万字中文。他说你翻了多久。我说第一本花费半天，第二本半小时。他沉默了大概五秒，然后说：“你是不是在测试我的智商。”",
      heat: 87,
      likes: 294,
      comments: 141,
      shares: 0,
      reads: "2.0万",
      date: "d25"
    },
    {
      platform: "wechat",
      author: "安恒信息",
      title: "恒脑安全智能体全面对标{keyword} Security，极速复现 3 个 0day",
      excerpt:
        "如果把自动化安全响应、漏洞挖掘与代码生成放在同一条链路里，{keyword} 的安全工作台会长成什么样？这篇样本把“发现、分析、修复、复盘”压成了一条极短路径，信息密度很高，适合直接抽成选题脚本。",
      heat: 84,
      likes: 162,
      comments: 74,
      shares: 3,
      reads: "1.7万",
      date: "d25"
    },
    {
      platform: "wechat",
      author: "机器之心",
      title: "{keyword} 的 IDE 时代：AI 编程不是补全，而是接管任务流",
      excerpt:
        "这条内容从 IDE 工作流切入，把提示词、上下文窗口、任务拆解和评估机制串成了一条完整链路。读完之后，用户会立刻联想到“团队如何真正使用 {keyword}”，非常适合继续做深。",
      heat: 81,
      likes: 121,
      comments: 46,
      shares: 2,
      reads: "1.3万",
      date: "d25"
    },
    {
      platform: "wechat",
      author: "少数派",
      title: "把 {keyword} 接进个人知识库之后，我的选题生产快了三倍",
      excerpt:
        "作者重点不是演示功能，而是展示流程变化：素材归档、角度整理、成文提纲如何自动衔接。这样的文章很容易被内容团队代入自己的生产链路，讨论度也会比较高。",
      heat: 79,
      likes: 96,
      comments: 22,
      shares: 1,
      reads: "9700",
      date: "d25"
    },
    {
      platform: "wechat",
      author: "硅星人",
      title: "{keyword} 之后，个人开发者终于能拥有自己的“虚拟实习生”了",
      excerpt:
        "文章用轻叙事的方式把复杂概念讲得非常直白，尤其适合转译成短视频脚本或更大众向的公众号二创内容。标题和正文之间的钩子都非常完整。",
      heat: 78,
      likes: 88,
      comments: 19,
      shares: 1,
      reads: "8600",
      date: "d25"
    },
    {
      platform: "wechat",
      author: "数字生命卡兹克",
      title: "{keyword} + MCP 到底怎么连？一篇讲清配置、模板和风险",
      excerpt:
        "这是典型的“配置清单型”内容，读者行动性很强。文中连续列出易错点、最佳实践和扩展工具，非常适合拆成多篇系列化选题。",
      heat: 76,
      likes: 79,
      comments: 16,
      shares: 0,
      reads: "7900",
      date: "d25"
    },
    {
      platform: "douyin",
      author: "阿杰做产品",
      title: "{keyword} 工作流 30 分钟上手，项目推进直接提速",
      excerpt: "短视频更强调结果展示，这条内容把前后对比做得很强，适合补充不同平台的表达差异。",
      heat: 90,
      likes: 901,
      comments: 204,
      shares: 36,
      reads: "3.6万",
      date: "d25"
    },
    {
      platform: "xiaohongshu",
      author: "阿梨效率研究所",
      title: "我用 {keyword} 重做了一次内容团队协作模板",
      excerpt: "偏方法论表达，适合用来提炼“内容运营如何真正落地 AI 协作”的角度。",
      heat: 85,
      likes: 512,
      comments: 99,
      shares: 28,
      reads: "2.3万",
      date: "d24"
    },
    {
      platform: "bilibili",
      author: "硬核开发笔记",
      title: "{keyword} 编码工作流全拆：从需求到提测到底节省了什么",
      excerpt: "更偏长视频和深度教程，适合做证据样本。",
      heat: 83,
      likes: 731,
      comments: 132,
      shares: 22,
      reads: "2.8万",
      date: "d23"
    }
  ],
  vibe: [
    {
      platform: "wechat",
      author: "数字游牧手册",
      title: "{keyword} 正在改写内容团队的脑暴方式",
      excerpt: "从工作方式变化切入，而不是从工具功能切入，这样的选题更适合内容团队直接借鉴。",
      heat: 86,
      likes: 188,
      comments: 52,
      shares: 2,
      reads: "1.9万",
      date: "d25"
    },
    {
      platform: "wechat",
      author: "极客公园",
      title: "一周体验 {keyword}：效率不是重点，表达欲才是",
      excerpt: "这条内容把“技术演示”转成了“创作表达”，很容易长成更大众的传播角度。",
      heat: 82,
      likes: 144,
      comments: 31,
      shares: 1,
      reads: "1.2万",
      date: "d24"
    },
    {
      platform: "twitter",
      author: "BuildWithAI",
      title: "{keyword} threads are replacing tutorial posts",
      excerpt: "海外表达更轻、更快，适合作为结构参考。",
      heat: 88,
      likes: 966,
      comments: 208,
      shares: 44,
      reads: "4.1万",
      date: "d23"
    }
  ],
  agent: [
    {
      platform: "wechat",
      author: "AI 产品研习社",
      title: "{keyword} 已经不只是聊天机器人，而是新一代协作入口",
      excerpt: "围绕角色、流程和上下文管理展开，适合做系统级趋势观察。",
      heat: 85,
      likes: 232,
      comments: 67,
      shares: 4,
      reads: "2.4万",
      date: "d25"
    },
    {
      platform: "zhihu",
      author: "深蓝研究所",
      title: "{keyword} 为什么会成为企业产品的新基建？",
      excerpt: "偏知识答主视角，适合作为长文本补充样本。",
      heat: 77,
      likes: 512,
      comments: 79,
      shares: 9,
      reads: "1.6万",
      date: "d20"
    }
  ],
  indie: [
    {
      platform: "wechat",
      author: "独立开发变现日记",
      title: "{keyword} 的内容打法，为什么比冷启动更重要",
      excerpt: "把增长、内容和产品运营揉在一起，适合内容运营直接拿来参考。",
      heat: 80,
      likes: 121,
      comments: 24,
      shares: 1,
      reads: "9800",
      date: "d25"
    },
    {
      platform: "xiaohongshu",
      author: "Rina 做产品",
      title: "独立开发者如何用 {keyword} 做内容杠杆",
      excerpt: "强调个人品牌、持续输出和复用机制，风格更轻。",
      heat: 82,
      likes: 602,
      comments: 115,
      shares: 30,
      reads: "2.2万",
      date: "d21"
    }
  ]
};

const state = {
  activeCategoryId: "claude",
  activePlatformId: "wechat",
  activeDateId: "d25",
  activeTab: "content",
  selectedCardId: "",
  keywordInput: "claude code",
  categoryKeywords: Object.fromEntries(categoryData.map((item) => [item.id, item.keyword])),
  showKeywordPanel: true,
  keywordFocused: false,
  updating: false
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeKeyword(value) {
  return value.trim().replace(/\s+/g, " ");
}

function getActiveCategory() {
  return categoryData.find((item) => item.id === state.activeCategoryId) || categoryData[0];
}

function titleCaseKeyword(keyword) {
  if (!keyword) {
    return "";
  }

  return keyword
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatTemplate(value, keyword) {
  return value.replaceAll("{keyword}", titleCaseKeyword(keyword));
}

function buildArticles() {
  const category = getActiveCategory();
  const keyword = state.categoryKeywords[category.id] || category.keyword;
  const source = articleTemplates[category.id] || [];
  const expanded = [];
  let index = 0;

  while (expanded.length < 18) {
    const template = source[index % source.length];
    index += 1;
    expanded.push({
      id: `${category.id}-${template.platform}-${index}`,
      platform: template.platform,
      platformLabel: (platforms.find((item) => item.id === template.platform) || {}).label || template.platform,
      author: template.author,
      title: formatTemplate(template.title, keyword),
      excerpt: formatTemplate(template.excerpt, keyword),
      heat: Math.max(68, template.heat - Math.floor(index / 4)),
      likes: template.likes + index,
      comments: template.comments + (index % 7),
      shares: template.shares + (index % 3),
      reads: template.reads,
      date: template.date,
      tag: keyword
    });
  }

  return expanded;
}

function getVisibleArticles() {
  return buildArticles().filter((item) => {
    const platformMatches = state.activePlatformId === "all" || item.platform === state.activePlatformId;
    return platformMatches && item.date === state.activeDateId;
  });
}

function renderSidebar() {
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand__logo">C</div>
        <div>
          <div class="brand__title">ContentPulse</div>
          <div class="brand__sub">内容监控台</div>
        </div>
      </div>

      <div class="sidebar__section">
        <span>监控分类</span>
        <button class="sidebar__plus" type="button" data-action="toggle-keyword-panel" aria-label="展开关键词输入">+</button>
      </div>

      <div class="category-list">
        ${categoryData
          .map((item) => `
            <button class="category-card ${item.id === state.activeCategoryId ? "category-card--active" : ""}" type="button" data-action="select-category" data-category-id="${item.id}">
              <div class="category-card__icon">${item.icon}</div>
              <div>
                <div class="category-card__title">${escapeHtml(item.name)}</div>
                <div class="category-card__meta">${item.count} 条内容</div>
              </div>
            </button>
          `)
          .join("")}
      </div>

      <div class="sidebar__footer">
        <div class="sidebar__footer-title">每日 08:00 自动运行</div>
        <div class="sidebar__footer-row">
          <div class="status-avatar">N</div>
          <div class="status-dot"></div>
          <div class="status-copy">
            <strong>运行正常</strong>
            <span>最近一次同步 08:03</span>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function renderTopbar() {
  const category = getActiveCategory();
  return `
    <div class="topbar">
      <div class="topbar__title">
        <span>${category.icon}</span>
        <span>${escapeHtml(category.name)}</span>
        <small>更新于今天</small>
      </div>

      <div class="tabs">
        ${[
          { id: "content", label: "内容" },
          { id: "analysis", label: "选题分析" },
          { id: "settings", label: "监控设置" }
        ]
          .map((tab) => `
            <button class="tab ${state.activeTab === tab.id ? "tab--active" : ""}" type="button" data-action="select-tab" data-tab-id="${tab.id}">
              ${tab.label}
            </button>
          `)
          .join("")}
      </div>
    </div>
  `;
}

function renderKeywordPanel() {
  return `
    <div class="keyword-shell ${state.showKeywordPanel ? "" : "keyword-shell--hidden"}">
      <div class="keyword-panel">
        <div class="keyword-card ${state.keywordFocused ? "keyword-card--focus" : ""}">
          <label for="keyword-input">选择关键词</label>
          <input id="keyword-input" autocomplete="off" spellcheck="false" value="${escapeHtml(state.keywordInput)}" placeholder="输入关键词" />
        </div>
        <div class="keyword-track">
          <span>当前内容区会根据输入关键词刷新，保持截图里的工作流手感</span>
          <span>⌄</span>
        </div>
      </div>
      <button class="update-button" type="button" data-action="update-keyword" ${state.updating ? "disabled" : ""}>
        ${state.updating ? "更新中..." : "⟳ 一键更新"}
      </button>
    </div>
  `;
}

function renderPlatforms() {
  return `
    <div class="platform-row">
      ${platforms
        .map((platform) => `
          <button class="pill ${platform.id === state.activePlatformId ? "pill--active" : ""} ${platform.id === "wechat" ? "pill--wechat" : ""}" type="button" data-action="select-platform" data-platform-id="${platform.id}">
            <span>${platform.icon}</span>
            <span>${platform.label}</span>
          </button>
        `)
        .join("")}
    </div>
  `;
}

function renderDates() {
  return `
    <div class="date-row">
      ${dates
        .map((item) => `
          <button class="date-card ${item.id === state.activeDateId ? "date-card--active" : ""}" type="button" data-action="select-date" data-date-id="${item.id}">
            <div class="date-card__hint">${item.hint}</div>
            <div class="date-card__day">${item.day}</div>
            <div class="date-card__week">${item.week}</div>
            <div class="date-card__dots">
              ${item.dots.map((color) => `<span style="background:${color}"></span>`).join("")}
            </div>
          </button>
        `)
        .join("")}
    </div>
  `;
}

function renderContentCards() {
  const category = getActiveCategory();
  const keyword = state.categoryKeywords[category.id] || category.keyword;
  const visibleArticles = getVisibleArticles();

  if (state.activeTab !== "content") {
    const panelTitle = state.activeTab === "analysis" ? "选题分析视图" : "监控设置视图";
    const panelCopy =
      state.activeTab === "analysis"
        ? "这一版先专注复刻截图里的“内容”页面，分析和设置仅保留切换状态。"
        : "这一版先把结构、点击和输入手感定住，设置页后续再接回完整前端。";

    return `
      <div class="content-shell">
        <div class="panel-empty">
          <strong>${panelTitle}</strong>
          <span>${panelCopy}</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="content-shell">
      <div class="content-shell__header">
        <h3>[${escapeHtml(keyword)}] 共 ${visibleArticles.length} 条内容</h3>
        <span>按热度排序，真实数据</span>
      </div>
      <div class="content-list">
        ${
          visibleArticles.length > 0
            ? visibleArticles
                .map(
                  (item) => `
                    <button class="content-card ${state.selectedCardId === item.id ? "content-card--active flash" : ""}" type="button" data-action="select-card" data-card-id="${item.id}">
                      <div class="heat-block">
                        <strong>${item.heat}</strong>
                        <span>热度</span>
                        <div class="heat-bar"></div>
                      </div>
                      <div>
                        <div class="article-meta">
                          <span class="badge badge--wechat">○ ${item.platformLabel}</span>
                          <span class="badge badge--author">⚡ ${escapeHtml(item.author)}</span>
                        </div>
                        <div class="content-card__title">${escapeHtml(item.title)}</div>
                        <p class="content-card__excerpt">${escapeHtml(item.excerpt)}</p>
                        <div class="content-card__footer">
                          <div class="metrics">
                            <span>♡ ${item.likes}</span>
                            <span>💬 ${item.comments}</span>
                            <span>↗ ${item.shares}</span>
                            <span>◉ ${item.reads}</span>
                          </div>
                          <div class="keyword-tag">${escapeHtml(item.tag)}</div>
                        </div>
                      </div>
                    </button>
                  `
                )
                .join("")
            : `
              <div class="panel-empty">
                <strong>当前筛选下暂无内容</strong>
                <span>试试切换平台、日期，或者在上方输入新的关键词后点击“一键更新”。</span>
              </div>
            `
        }
      </div>
    </div>
  `;
}

function renderWorkspace() {
  return `
    <main class="main">
      ${renderTopbar()}
      <section class="workspace">
        ${renderKeywordPanel()}
        <div class="filters">
          ${renderPlatforms()}
          ${renderDates()}
        </div>
        ${renderContentCards()}
      </section>
    </main>
  `;
}

function renderApp() {
  document.getElementById("app").innerHTML = `${renderSidebar()}${renderWorkspace()}`;
  bindEvents();
}

function focusKeywordInput() {
  window.setTimeout(() => {
    const input = document.getElementById("keyword-input");
    if (input) {
      input.focus();
      input.select();
    }
  }, 0);
}

function bindEvents() {
  document.querySelectorAll("[data-action='select-category']").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategoryId = button.dataset.categoryId;
      state.activePlatformId = "wechat";
      state.activeDateId = "d25";
      state.activeTab = "content";
      state.selectedCardId = "";
      state.keywordInput = state.categoryKeywords[state.activeCategoryId] || "";
      state.showKeywordPanel = true;
      renderApp();
    });
  });

  document.querySelectorAll("[data-action='select-platform']").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePlatformId = button.dataset.platformId;
      state.selectedCardId = "";
      renderApp();
    });
  });

  document.querySelectorAll("[data-action='select-date']").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeDateId = button.dataset.dateId;
      state.selectedCardId = "";
      renderApp();
    });
  });

  document.querySelectorAll("[data-action='select-card']").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCardId = button.dataset.cardId;
      renderApp();
    });
  });

  document.querySelectorAll("[data-action='select-tab']").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tabId;
      renderApp();
    });
  });

  const toggleButton = document.querySelector("[data-action='toggle-keyword-panel']");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      state.showKeywordPanel = !state.showKeywordPanel;
      renderApp();
      if (state.showKeywordPanel) {
        focusKeywordInput();
      }
    });
  }

  const input = document.getElementById("keyword-input");
  if (input) {
    input.addEventListener("input", (event) => {
      state.keywordInput = event.target.value;
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleUpdateKeyword();
      }
    });
  }

  const updateButton = document.querySelector("[data-action='update-keyword']");
  if (updateButton) {
    updateButton.addEventListener("click", handleUpdateKeyword);
  }
}

function handleUpdateKeyword() {
  const normalized = normalizeKeyword(state.keywordInput);
  if (!normalized || state.updating) {
    return;
  }

  state.updating = true;
  renderApp();

  window.setTimeout(() => {
    state.categoryKeywords[state.activeCategoryId] = normalized;
    state.keywordInput = normalized;
    state.updating = false;
    state.activePlatformId = "wechat";
    state.activeDateId = "d25";
    state.selectedCardId = "";
    renderApp();
  }, 650);
}

renderApp();
