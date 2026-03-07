<template>
  <div class="search-page">
    <!-- 顶部搜索栏 -->
    <div class="search-header">
      <div class="header-content">
        <!-- 返回按钮 -->
        <div class="back-button" @click="goBack" title="返回首页">
          <iconify-icon icon="icon-park-outline:back" />
        </div>

        <!-- 搜索框容器 -->
        <div class="search-input-group">
          <iconify-icon class="search-icon" icon="mdi:magnify" />
          <input
            v-model="articleSearch"
            @keyup.enter="executeSearch"
            @input="onSearchInput"
            type="text"
            class="search-input"
            placeholder="输入关键词搜索..."
            maxlength="128"
            ref="searchInput"
            autocomplete="off">
          <div class="clear-icon" v-if="articleSearch" @click="clearSearch">
            <iconify-icon icon="mdi:close" />
          </div>
        </div>

        <!-- 搜索按钮 -->
        <div class="search-button" @click="executeSearch">
          搜索
        </div>
      </div>

      <!-- 搜索选项 -->
      <div class="search-options">
        <div class="option-group">
          <span class="option-label">模式：</span>
          <span v-for="mode in searchModes"
                :key="mode.value"
                :class="['option-chip', {active: searchMode === mode.value}]"
                @click="searchMode = mode.value">
            {{ mode.label }}
          </span>
        </div>
        <div class="option-group">
          <span class="option-label">字段：</span>
          <span v-for="field in searchFields"
                :key="field.value"
                :class="['option-chip', {active: searchField === field.value}]"
                @click="searchField = field.value">
            {{ field.label }}
          </span>
        </div>
      </div>

      <!-- 搜索语法提示 -->
      <div class="search-tips">
        <span class="tip-icon">💡</span>
        <span class="tip-title">ES搜索语法：</span>
        <span class="tip-item" @click='appendSyntax("\"精确短语\"")'>短语</span>
        <span class="tip-item" @click="appendSyntax('A OR B')">OR</span>
        <span class="tip-item" @click="appendSyntax('-排除词')">-排除</span>
        <span class="tip-item" @click="appendSyntax('关键词~')">模糊~</span>
      </div>

      <!-- 搜索表达式预览 -->
      <div v-if="!$common.isEmpty(articleSearch)" class="expression-preview">
        <span class="preview-label">ES表达式：</span>
        <code class="preview-code">{{ searchExpression }}</code>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div class="search-results">
      <!-- 搜索为空提示 -->
      <div v-if="!hasSearched" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h2>开始搜索</h2>
        <p>输入关键词，发现更多有趣的内容</p>
        <!-- 快捷键提示 -->
        <div class="shortcut-hint">
          <span>💡 按 </span>
          <kbd>Ctrl+K</kbd> <span> 快速搜索 | 按 </span>
          <kbd>ESC</kbd> <span> 返回</span>
        </div>

        <!-- 搜索历史 -->
        <div v-if="!$common.isEmpty(recentSearches)" class="search-history-section">
          <div class="section-title">最近搜索</div>
          <div class="history-items">
            <div v-for="(item, index) in recentSearches"
                 :key="index"
                 class="history-item"
                 @click="searchFromHistory(item)">
              <span class="history-icon">⏱️</span>
              {{ item }}
            </div>
          </div>
        </div>

        <!-- 热搜词推荐 -->
        <div v-if="!$common.isEmpty(hotwords)" class="hotwords-section">
          <div class="section-title">热搜词</div>
          <div class="hotwords-items">
            <span v-for="(word, index) in hotwords"
                  :key="index"
                  class="hotword-tag"
                  @click="searchFromHistory(word)">
              <span class="rank-badge">{{ index + 1 }}</span>{{ word }}
            </span>
          </div>
        </div>
      </div>

      <!-- 搜索中加载动画 -->
      <div v-else-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>搜索中...</p>
      </div>

      <!-- 无结果提示 -->
      <div v-else-if="$common.isEmpty(articles)" class="empty-state">
        <div class="empty-icon">😕</div>
        <h2>未找到相关文章</h2>
        <p>试试换个关键词或使用ES语法</p>
        <div class="suggestion">
          <span>建议：</span>
          <span class="suggestion-item" @click="trySearch('Vue')">Vue</span>
          <span class="suggestion-item" @click="trySearch('JavaScript')">JavaScript</span>
          <span class="suggestion-item" @click="trySearch('前端')">前端</span>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-else-if="!$common.isEmpty(articles)" class="articles-wrapper">
        <div class="result-header">
          <span class="result-count">找到 <strong>{{ pagination.total }}</strong> 篇文章</span>
          <span class="result-query">关键词：<strong>{{ articleSearch }}</strong></span>
        </div>
        <articleList :articleList="articles" :searchContext="searchContext"></articleList>

        <!-- 分页加载 -->
        <div v-if="hasMore" class="load-more">
          <button class="load-more-btn" @click="loadMore" :disabled="loading">
            {{ loading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const articleList = () => import("./articleList");

export default {
  components: {
    articleList
  },
  data() {
    return {
      articleSearch: "",
      searchMode: "smart",
      searchField: "all",
      searchModes: [
        {label: "智能", value: "smart"},
        {label: "短语", value: "phrase"},
        {label: "前缀", value: "prefix"},
        {label: "模糊", value: "fuzzy"}
      ],
      searchFields: [
        {label: "全字段", value: "all"},
        {label: "标题", value: "title"},
        {label: "正文", value: "content"}
      ],
      articles: [],
      searchContext: null,
      pagination: {
        current: 1,
        size: 10,
        total: 0,
        searchKey: "",
        sortId: null,
        articleSearch: "",
        searchMode: "smart",
        searchField: "all"
      },
      hasSearched: false,
      loading: false,
      searchTimer: null,
      recentSearches: [],
      hotwords: []
    };
  },
  computed: {
    searchExpression() {
      return this.buildSearchExpression(this.articleSearch);
    },
    hasMore() {
      return this.articles.length < this.pagination.total;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus();
      }
    });

    // 从路由参数中读取搜索条件
    const query = this.$route.query;
    if (query.q) {
      this.articleSearch = query.q;
      if (query.mode) {
        this.searchMode = query.mode;
      }
      if (query.field) {
        this.searchField = query.field;
      }
      // 自动执行搜索
      this.$nextTick(() => {
        this.executeSearch();
      });
    }

    // 监听ESC键返回
    window.addEventListener('keydown', this.handleKeydown);
    // 监听全局Ctrl+K快捷键
    window.addEventListener('keydown', this.handleGlobalShortcut);

    // 加载搜索历史
    this.loadRecentSearches();
    // 加载热搜词
    this.loadHotwords();
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('keydown', this.handleGlobalShortcut);
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  },
  methods: {
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.goBack();
      }
    },
    handleGlobalShortcut(e) {
      // Ctrl+K 或 Cmd+K 打开搜索页面
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // 如果不在搜索页面，导航到搜索页面
        if (this.$route.path !== '/search') {
          this.$router.push('/search');
        }
        // 聚焦搜索框
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    clearSearch() {
      this.articleSearch = "";
      this.articles = [];
      this.hasSearched = false;
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      });
    },
    appendSyntax(snippet) {
      if (this.$common.isEmpty(this.articleSearch)) {
        this.articleSearch = snippet;
      } else {
        this.articleSearch = `${this.articleSearch.trim()} ${snippet}`;
      }
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      });
    },
    buildSearchExpression(keyword) {
      const raw = (keyword || "").trim();
      if (this.$common.isEmpty(raw)) {
        return "";
      }

      let expression = raw;
      if (this.searchMode === "phrase") {
        expression = `"${raw}"`;
      } else if (this.searchMode === "prefix") {
        expression = `${raw}*`;
      } else if (this.searchMode === "fuzzy") {
        expression = `${raw}~`;
      }

      if (this.searchField === "title") {
        return `articleTitle:${expression}`;
      }
      if (this.searchField === "content") {
        return `articleContent:${expression}`;
      }
      return expression;
    },
    onSearchInput() {
      // 实时搜索防抖 - 可选启用
      // 如需启用实时搜索，取消注释下面的代码
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        if (!this.$common.isEmpty(this.articleSearch) && this.hasSearched) {
          // 自动重新搜索（可选）
          // this.executeSearch();
        }
      }, 300);
    },
    async executeSearch() {
      const keyword = (this.articleSearch || "").trim();
      if (this.$common.isEmpty(keyword)) {
        this.$message.warning('请输入搜索关键词');
        return;
      }

      this.hasSearched = true;
      this.articles = [];
      this.pagination.current = 1;

      const searchPayload = {
        keyword: keyword,
        queryText: this.buildSearchExpression(keyword),
        mode: this.searchMode,
        field: this.searchField
      };

      this.searchContext = searchPayload;
      this.pagination = {
        current: 1,
        size: 10,
        total: 0,
        searchKey: "",
        sortId: null,
        articleSearch: searchPayload.queryText,
        searchMode: searchPayload.mode,
        searchField: searchPayload.field
      };

      // 保存搜索历史
      this.saveSearchHistory(keyword);
      await this.getArticles();
    },
    async getArticles() {
      this.loading = true;
      try {
        const response = await this.$http.post(
          this.$constant.baseURL + "/article/listArticle",
          this.pagination
        );

        if (!this.$common.isEmpty(response.data)) {
          this.articles = this.articles.concat(response.data.records);
          this.pagination.total = response.data.total;
        }
      } catch (error) {
        this.$message.error(error.message || '搜索失败');
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.pagination.current = this.pagination.current + 1;
      this.getArticles();
    },
    trySearch(keyword) {
      this.articleSearch = keyword;
      this.$nextTick(async () => {
        await this.executeSearch();
      });
    },
    // 从历史或热搜搜索
    searchFromHistory(keyword) {
      this.articleSearch = keyword;
      this.$nextTick(async () => {
        await this.executeSearch();
      });
    },
    // 保存搜索历史
    saveSearchHistory(keyword) {
      if (this.$common.isEmpty(keyword)) {
        return;
      }
      const key = 'poetize_search_history';
      let history = JSON.parse(localStorage.getItem(key) || '[]');

      // 移除重复项
      history = history.filter(item => item !== keyword);

      // 添加到最前面
      history.unshift(keyword);

      // 只保留最近10条
      if (history.length > 10) {
        history = history.slice(0, 10);
      }

      localStorage.setItem(key, JSON.stringify(history));
      this.recentSearches = history.slice(0, 5);
    },
    // 加载搜索历史
    loadRecentSearches() {
      const key = 'poetize_search_history';
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      this.recentSearches = history.slice(0, 5); // 显示最近5条
    },
    // 加载热搜词
    async loadHotwords() {
      try {
        // 模拟热搜词数据，实际可调用后端API
        // const response = await this.$http.get(
        //   this.$constant.baseURL + "/article/searchHotwords"
        // );
        // this.hotwords = response.data.words;

        // 临时使用静态热搜词
        this.hotwords = ['Vue.js', 'JavaScript', '前端开发', 'React', 'TypeScript', '算法', '设计模式'];
      } catch (error) {
        console.error('加载热搜词失败:', error);
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--background);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ========== 顶部搜索栏 ========== */
.search-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 15px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  color: var(--greyFont);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  color: var(--lightGreen);
  transform: translateX(-2px);
}

.search-input-group {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40px;
  padding: 0 16px;
  height: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.search-input-group:focus-within {
  border-color: var(--lightGreen);
  box-shadow: 0 4px 16px rgba(81, 196, 146, 0.2);
}

.search-icon {
  color: var(--lightGreen);
  margin-right: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--maxGreyFont);
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--greyFont);
}

.clear-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--greyFont);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 4px;
}

.clear-icon:hover {
  color: var(--lightGreen);
}

.search-button {
  padding: 8px 24px;
  background: linear-gradient(135deg, var(--lightGreen), #2a9d6f);
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(81, 196, 146, 0.3);
  flex-shrink: 0;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(81, 196, 146, 0.4);
}

.search-button:active {
  transform: translateY(0);
}

/* 搜索选项 */
.search-options {
  max-width: 1200px;
  margin: 12px auto 0;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--greyFont);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-chip {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(81, 196, 146, 0.3);
  border-radius: 20px;
  font-size: 12px;
  color: var(--maxGreyFont);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.option-chip:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(81, 196, 146, 0.6);
}

.option-chip.active {
  background: var(--lightGreen);
  color: white;
  border-color: var(--lightGreen);
}

/* 搜索提示 */
.search-tips {
  max-width: 1200px;
  margin: 10px auto 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--greyFont);
  flex-wrap: wrap;
}

.tip-icon {
  font-size: 14px;
}

.tip-title {
  font-weight: 600;
}

.tip-item {
  padding: 2px 8px;
  background: rgba(81, 196, 146, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tip-item:hover {
  background: rgba(81, 196, 146, 0.2);
  color: var(--lightGreen);
}

/* 表达式预览 */
.expression-preview {
  max-width: 1200px;
  margin: 10px auto 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.preview-label {
  font-weight: 600;
  color: var(--greyFont);
}

.preview-code {
  padding: 4px 8px;
  background: rgba(81, 196, 146, 0.08);
  border-radius: 4px;
  color: var(--lightGreen);
  font-family: 'Consolas', 'Monaco', monospace;
  word-break: break-all;
}

/* ========== 搜索结果区域 ========== */
.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--greyFont);
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--maxGreyFont);
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 14px;
  color: var(--greyFont);
}

/* 快捷键提示 */
.shortcut-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  font-size: 12px;
  color: var(--greyFont);
}

.shortcut-hint kbd {
  padding: 4px 8px;
  background: rgba(81, 196, 146, 0.1);
  border: 1px solid rgba(81, 196, 146, 0.3);
  border-radius: 4px;
  font-family: monospace;
  font-size: 11px;
  color: var(--lightGreen);
  font-weight: 600;
}

/* 搜索历史区域 */
.search-history-section,
.hotwords-section {
  margin-top: 40px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--greyFont);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 历史项 */
.history-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 10px 16px;
  background: rgba(81, 196, 146, 0.05);
  border: 1px solid rgba(81, 196, 146, 0.2);
  border-radius: 8px;
  color: var(--maxGreyFont);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.history-item:hover {
  background: rgba(81, 196, 146, 0.12);
  border-color: rgba(81, 196, 146, 0.4);
  transform: translateX(4px);
}

.history-icon {
  font-size: 12px;
}

/* 热搜词项 */
.hotwords-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hotword-tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(81, 196, 146, 0.1), rgba(81, 196, 146, 0.05));
  border: 1px solid rgba(81, 196, 146, 0.3);
  border-radius: 20px;
  color: var(--maxGreyFont);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
}

.hotword-tag:hover {
  background: linear-gradient(135deg, rgba(81, 196, 146, 0.2), rgba(81, 196, 146, 0.1));
  border-color: rgba(81, 196, 146, 0.5);
  color: var(--lightGreen);
  transform: scale(1.05);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, var(--lightGreen), #2a9d6f);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
}

.suggestion {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  margin-bottom: 30px;
}

.suggestion {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.suggestion-item {
  padding: 6px 14px;
  background: rgba(81, 196, 146, 0.1);
  border-radius: 20px;
  color: var(--lightGreen);
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(81, 196, 146, 0.2);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(81, 196, 146, 0.2);
  border-top-color: var(--lightGreen);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: var(--greyFont);
  font-size: 14px;
}

/* 文章列表包装 */
.articles-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--lightGray);
  flex-wrap: wrap;
  gap: 15px;
}

.result-count,
.result-query {
  font-size: 14px;
  color: var(--greyFont);
}

.result-count strong,
.result-query strong {
  color: var(--lightGreen);
  font-weight: 700;
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed var(--lightGray);
}

.load-more-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--lightGreen), #2a9d6f);
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(81, 196, 146, 0.3);
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(81, 196, 146, 0.4);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .header-content {
    padding: 0 15px 12px;
    gap: 8px;
  }

  .search-input-group {
    height: 36px;
    padding: 0 12px;
  }

  .search-button {
    padding: 6px 16px;
    font-size: 13px;
  }

  .search-options {
    padding: 0 15px;
    gap: 12px;
  }

  .search-tips {
    padding: 0 15px;
  }

  .expression-preview {
    padding: 0 15px;
  }

  .search-results {
    padding: 20px 15px;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media screen and (max-width: 480px) {
  .header-content {
    flex-wrap: wrap;
  }

  .search-input-group {
    order: 2;
    width: calc(100% - 50px);
    margin-left: 0;
  }

  .search-button {
    order: 3;
    width: 100%;
    margin-top: 8px;
  }

  .back-button {
    order: 1;
    margin-right: auto;
  }

  .search-options {
    flex-direction: column;
    gap: 8px;
  }

  .option-group {
    width: 100%;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-state h2 {
    font-size: 18px;
  }
}
</style>

