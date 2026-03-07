<template>
  <div>
    <div class="myAside-container">
      <!-- 网站信息 -->
      <div v-if="!$common.mobile()" class="card-content1 shadow-box background-opacity wow-card">
        <div class="card-content1-bg"></div>
        <div class="card-content1-inner">
          <el-avatar style="margin-top: 20px" class="user-avatar" :size="120" :src="!$common.isEmpty($store.state.currentAdmin)?$store.state.currentAdmin.avatar:(!$common.isEmpty($store.state.currentUser)?$store.state.currentUser.avatar:$store.state.webInfo.avatar)"></el-avatar>
          <div class="web-name">{{webInfo.webName}}</div>
          <div class="web-info">
            <div class="blog-info-box">
              <div class="blog-info-item">
                <div class="blog-info-label">🎒文章</div>
                <div class="blog-info-num">{{ $store.getters.articleTotal }}</div>
              </div>
            </div>
            <div class="blog-info-divider"></div>
            <div class="blog-info-box">
              <div class="blog-info-item">
                <div class="blog-info-label">📁分类</div>
                <div class="blog-info-num">{{ sortInfo.length }}</div>
              </div>
            </div>
            <div class="blog-info-divider"></div>
            <div class="blog-info-box">
              <div class="blog-info-item">
                <div class="blog-info-label">📺来访</div>
                <div class="blog-info-num">{{ webInfo.historyAllCount }}</div>
              </div>
            </div>
          </div>
          <a class="collection-btn" @click="showTip()">
            <iconify-icon icon="mdi:star-outline" style="margin-right: 2px"></iconify-icon>朋友圈
          </a>
        </div>
      </div>

      <!-- 搜索 -->
      <div class="search-card shadow-box background-opacity wow-card">
        <div class="search-header">
          <iconify-icon icon="mdi:magnify" style="margin-right: 8px;color: var(--lightGreen)"></iconify-icon>
          <span>搜索</span>
          <span class="search-badge">新</span>
        </div>
        <div class="search-hint">点击搜索或按Ctrl+K打开全屏搜索页面</div>
        <div class="search-box">
          <input class="ais-SearchBox-input" type="text"
                 ref="searchInput"
                 v-model="articleSearch"
                 @keyup.enter="selectArticle"
                 placeholder="搜索文章，支持ES语法"
                 maxlength="64">
          <button class="ais-SearchBox-submit" @click="selectArticle()" title="搜索">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"></circle>
              <path d="M16 16L20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            </svg>
          </button>
        </div>
        <div class="search-actions">
          <div class="search-chip-group">
            <span v-for="mode in searchModes"
                  :key="mode.value"
                  :class="['search-chip', {active: searchMode === mode.value}]"
                  @click="searchMode = mode.value">
              {{ mode.label }}
            </span>
          </div>
          <div class="search-chip-group">
            <span v-for="field in searchFields"
                  :key="field.value"
                  :class="['search-chip', {active: searchField === field.value}]"
                  @click="searchField = field.value">
              {{ field.label }}
            </span>
          </div>
        </div>
        <div class="search-helper">
          <span class="helper-title">语法</span>
          <span class="helper-item" @click='appendSyntax("\"精确短语\"")'>"短语"</span>
          <span class="helper-item" @click="appendSyntax('A OR B')">OR</span>
          <span class="helper-item" @click="appendSyntax('-排除词')">-排除</span>
          <span class="helper-item" @click="appendSyntax('关键词~')">模糊~</span>
        </div>
        <div v-if="!$common.isEmpty(articleSearch)" class="query-preview">
          <span class="preview-tag">ES</span>
          <span class="preview-text">{{ searchQueryPreview }}</span>
        </div>
      </div>

      <!-- 推荐文章 -->
      <div v-if="!$common.isEmpty(recommendArticles)"
           class="recommend-card shadow-box background-opacity wow-card">
        <div class="card-header">
          <span class="card-header-icon">🔥</span>
          <span class="card-header-title">推荐文章</span>
          <div class="header-line"></div>
        </div>
        <div class="articles-container">
          <div v-for="(article, index) in recommendArticles"
               :key="index"
               class="article-item wow-article"
               @click="$router.push({path: `/article/${article.id}`})">
            <div class="article-item-wrapper">
              <div class="aside-post-image">
                <el-image lazy class="my-el-image" :src="article.articleCover" fit="cover">
                  <div slot="error" class="image-slot">
                    <div class="error-aside-image">
                      {{article.username}}
                    </div>
                  </div>
                </el-image>
                <div class="hasVideo transformCenter" v-if="article.hasVideo">
                  <svg viewBox="0 0 1024 1024" width="30" height="30">
                    <path
                      d="M514 114.3c-219.9 0-398.9 178.9-398.9 398.9 0.1 219.9 179 398.8 398.9 398.8 219.9 0 398.8-178.9 398.8-398.8S733.9 114.3 514 114.3z m173 421.9L437.1 680.5c-17.7 10.2-39.8-2.6-39.8-23V368.9c0-20.4 22.1-33.2 39.8-23L687 490.2c17.7 10.2 17.7 35.8 0 46z"
                      fill="#0C0C0C"></path>
                  </svg>
                </div>
              </div>
              <div class="article-content">
                <div class="aside-post-title">
                  {{ article.articleTitle }}
                </div>
                <div class="aside-post-date">
                  <iconify-icon icon="mdi:calendar"></iconify-icon><span>{{ article.createTime }}</span>
                </div>
              </div>
            </div>
            <div class="article-item-overlay"></div>
          </div>
        </div>
      </div>

      <!-- 速览 -->
      <div v-if="!$common.mobile()" class="quick-view-container">
        <div class="quick-view-header">
          <span class="quick-view-title">分类速览</span>
          <div class="header-line"></div>
        </div>
        <div class="selectSort">
          <div v-for="(sort, index) in sortInfo"
               @click="selectSort(sort)"
               :key="index"
               :style="{background: $constant.sortColor[index % $constant.sortColor.length]}"
               class="sort-card wow-sort"
               style="position: relative;cursor: pointer;">
            <div class="sort-card-bg"></div>
            <div class="sort-card-content">
              <div class="sort-label">速览</div>
              <div class="sort-name">
                {{sort.sortName}}
              </div>
              <div class="sort-desc">
                {{sort.sortDescription}}
              </div>
            </div>
            <div class="sort-card-shine"></div>
          </div>
        </div>
      </div>

      <!-- 分类 -->
      <div class="shadow-box background-opacity wow"
           v-if="false"
           style="padding: 25px 25px 5px;border-radius: 10px;animation: hideToShow 1s ease-in-out">
        <div class="card-content2-title">
          <iconify-icon icon="mdi:folder-open" class="card-content2-icon"></iconify-icon>
          <span>分类</span>
        </div>
        <div v-for="(sort, index) in sortInfo"
             :key="index"
             class="post-sort"
             @click="$router.push({path: '/sort', query: {sortId: sort.id}})">
          <div>
            <span v-for="(s, i) in sort.sortName.split('')" :key="i">{{ s }}</span>
          </div>
        </div>
      </div>
     </div>
  <!--
      赞赏
      <div class="shadow-box-mini background-opacity wow admire-box"
           v-if="!$common.isEmpty(admires) && false">
        <div style="font-weight: bold;margin-bottom: 20px">🧨赞赏名单</div>
        <div>
          <vue-seamless-scroll :data="admires" style="height: 200px;overflow: hidden">
            <div v-for="(item, i) in admires"
                 style="display: flex;justify-content: space-between"
                 :key="i">
              <div style="display: flex">
                <el-avatar style="margin-bottom: 10px" :size="36" :src="item.avatar"></el-avatar>
                <div style="margin-left: 10px;height: 36px;line-height: 36px;overflow: hidden;max-width: 80px">
                  {{ item.username }}
                </div>
              </div>
              <div style="height: 36px;line-height: 36px">
                {{ item.admire }}元
              </div>
            </div>
          </vue-seamless-scroll>
        </div>
        <div class="admire-btn" @click="showAdmire()">
          赞赏
        </div>
      </div>


    微信
    <el-dialog title="赞赏"
               :visible.sync="showAdmireDialog"
               width="25%"
               :append-to-body="true"
               destroy-on-close
               center>
      <div>
        <div class="admire-image"></div>
        <div>
          <div class="admire-content">1. 感谢老铁送来的666</div>
          <div class="admire-content">2. 申请通过后会加博客交流群，不需要加群或者退群后会定期清理好友（强迫症福利）</div>
        </div>
      </div>
    </el-dialog>
   -->
  </div>
</template>

<script>
  import vueSeamlessScroll from "vue-seamless-scroll";

  export default {
    components: {
      vueSeamlessScroll
    },
    data() {
      return {
        pagination: {
          current: 1,
          size: 5,
          recommendStatus: true
        },
        recommendArticles: [],
        admires: [],
        showAdmireDialog: false,
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
        ]
      }
    },
    computed: {
      webInfo() {
        return this.$store.state.webInfo;
      },
      sortInfo() {
        return this.$store.getters.navigationBar;
      },
      searchQueryPreview() {
        return this.buildSearchExpression(this.articleSearch);
      }
    },
    created() {
      this.getRecommendArticles();
    },
    methods: {
      selectSort(sort) {
        this.$emit("selectSort", sort);
      },
      selectArticle() {
        const keyword = (this.articleSearch || "").trim();
        if (this.$common.isEmpty(keyword)) {
          this.$router.push('/search');
          return;
        }

        // 跳转到搜索页面，搜索页面会处理搜索
        this.$router.push({
          path: '/search',
          query: {
            q: keyword,
            mode: this.searchMode,
            field: this.searchField
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
      showAdmire() {
        if (this.$common.isEmpty(this.$store.state.currentUser)|| !$common.isEmpty(this.$store.state.currentAdmin)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        this.showAdmireDialog = true;
      },
      getAdmire() {
        this.$http.get(this.$constant.baseURL + "/webInfo/getAdmire")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.admires = res.data;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      getRecommendArticles() {
        this.$http.post(this.$constant.baseURL + "/article/listArticle", this.pagination)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.recommendArticles = res.data.records;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      showTip() {
        this.$router.push({path: '/weiYan'});
      }
    }
  }
</script>

<style scoped>

  .myAside-container > div:not(:last-child) {
    margin-bottom: 30px;
  }

  /* ========== 动画 ========== */
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shine {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  .wow-card {
    animation: slideUp 0.6s ease-out forwards;
  }

  .wow-sort {
    animation: slideUp 0.6s ease-out forwards;
  }

  .wow-article {
    animation: slideUp 0.6s ease-out forwards;
  }

  /* ========== 网站信息卡片 ========== */
  .card-content1 {
    background: linear-gradient(-45deg, #e8d8b9, #eccec5, #a3e9eb, #bdbdf0, #eec1ea);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    padding: 30px 20px;
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(10px);
  }

  .card-content1-bg {
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle, rgba(255, 255, 255, 0.8) 2px, transparent 2px),
      radial-gradient(circle, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
      radial-gradient(circle, rgba(255, 255, 255, 0.6) 1.5px, transparent 1.5px);
    background-size:
      80px 80px,
      50px 50px,
      120px 120px;
    background-position:
      0 0,
      25px 25px,
      40px 40px;
    animation: moveBackground 20s linear infinite;
    z-index: 1;
  }

  .card-content1-inner {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .user-avatar {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    border: 3px solid rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }

  .user-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  .web-name {
    font-size: 32px;
    font-weight: 700;
    margin: 20px 0 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 1px;
  }

  .web-info {
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 20px 0;
    padding: 0 10px;
  }

  .blog-info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .blog-info-item {
    text-align: center;
  }

  .blog-info-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .blog-info-num {
    font-size: 24px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .blog-info-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.3);
    margin: 0 15px;
  }

  .collection-btn {
    position: relative;
    margin-top: 20px;
    margin-bottom: 15px;
    background: linear-gradient(135deg, var(--lightGreen), #2a9d6f);
    cursor: pointer;
    width: 70%;
    max-width: 200px;
    height: 42px;
    border-radius: 50px;
    text-align: center;
    line-height: 42px;
    color: white;
    font-weight: 600;
    overflow: hidden;
    z-index: 2;
    box-shadow: 0 4px 15px rgba(81, 196, 146, 0.4);
    transition: all 0.3s ease;
    border: none;
  }

  .collection-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(81, 196, 146, 0.6);
  }

  .collection-btn::before {
    background: linear-gradient(135deg, #764ba2, #667eea);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s cubic-bezier(0.45, 1.64, 0.47, 0.66);
    border-radius: 50px;
    z-index: -1;
  }

  .collection-btn:hover::before {
    transform: scaleX(1);
  }

  /* ========== 搜索卡片 ========== */
  .search-card {
    padding: 20px;
    border-radius: 16px;
    animation: slideUp 0.6s ease-out 0.1s forwards;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  .search-header {
    display: flex;
    align-items: center;
    color: var(--lightGreen);
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 15px;
    letter-spacing: 0.5px;
    position: relative;
  }

  .search-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-left: 8px;
    background: linear-gradient(135deg, #ff6b6b, #ff8787);
    color: white;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .search-hint {
    font-size: 12px;
    color: var(--greyFont);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: rgba(81, 196, 146, 0.06);
    border-radius: 6px;
    border-left: 3px solid var(--lightGreen);
  }

  .search-box {
    display: flex;
    gap: 2px;
  }

  .search-actions {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .search-chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .search-chip {
    font-size: 12px;
    color: var(--greyFont);
    padding: 2px 10px;
    border-radius: 999px;
    background: rgba(81, 196, 146, 0.08);
    border: 1px solid rgba(81, 196, 146, 0.25);
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }

  .search-chip:hover {
    color: var(--lightGreen);
    border-color: rgba(81, 196, 146, 0.5);
  }

  .search-chip.active {
    color: var(--white);
    background: var(--lightGreen);
    border-color: var(--lightGreen);
  }

  .search-helper {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .helper-title {
    font-size: 12px;
    color: var(--greyFont);
  }

  .helper-item {
    font-size: 12px;
    color: var(--lightGreen);
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 6px;
    background: rgba(81, 196, 146, 0.08);
    transition: all 0.2s ease;
  }

  .helper-item:hover {
    background: rgba(81, 196, 146, 0.18);
  }

  .query-preview {
    margin-top: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(81, 196, 146, 0.08);
    border: 1px dashed rgba(81, 196, 146, 0.4);
    font-size: 12px;
    word-break: break-all;
    color: var(--greyFont);
  }

  .preview-tag {
    color: var(--lightGreen);
    font-weight: 700;
    margin-right: 6px;
  }

  .preview-text {
    font-family: "Consolas", "Monaco", monospace;
  }

  .ais-SearchBox-input {
    padding: 0 16px;
    height: 42px;
    flex: 1;
    outline: 0;
    border: 2px solid var(--lightGreen);
    border-right: 0;
    border-radius: 50px 0 0 50px;
    color: var(--maxGreyFont);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
    font-size: 14px;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(81, 196, 146, 0.08);
    letter-spacing: 0.2px;
  }

  .ais-SearchBox-input::placeholder {
    color: rgba(139, 139, 139, 0.5);
  }

  .ais-SearchBox-input:focus {
    box-shadow: inset 0 2px 8px rgba(81, 196, 146, 0.15), 0 0 0 3px rgba(81, 196, 146, 0.08);
    border-color: #2a9d6f;
  }

  .ais-SearchBox-submit {
    height: 42px;
    width: 50px;
    border: 2px solid var(--lightGreen);
    border-left: 0;
    border-radius: 0 50px 50px 0;
    background: linear-gradient(135deg, var(--lightGreen) 0%, #2a9d6f 100%);
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    position: relative;
    overflow: hidden;
    font-size: 0;
    font-family: inherit;
  }

  .ais-SearchBox-submit::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  .ais-SearchBox-submit:hover::before {
    left: 100%;
  }

  .ais-SearchBox-submit:hover {
    background: linear-gradient(135deg, #2a9d6f 0%, #1f7854 100%);
    box-shadow: 0 6px 20px rgba(81, 196, 146, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .ais-SearchBox-submit:active {
    transform: translateY(1px);
    box-shadow: 0 3px 10px rgba(81, 196, 146, 0.15);
  }

  .search-icon {
    position: relative;
    z-index: 2;
    color: white;
    display: block;
    flex-shrink: 0;
    pointer-events: none;
  }

  /* ========== 推荐文章卡片 ========== */
  .recommend-card {
    padding: 10px;
    border-radius: 16px;
    animation: slideUp 0.6s ease-out 0.2s forwards;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }

  .card-header-icon {
    font-size: 24px;
    margin-right: 10px;
    animation: bounce 0.6s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .card-header-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--lightGreen);
    letter-spacing: 0.5px;
  }

  .header-line {
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, var(--lightGreen), transparent);
    margin-left: 12px;
  }

  .articles-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .article-item {
    position: relative;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .article-item:hover {
    transform: translateY(-2px);
  }

  .article-item:hover .article-item-overlay {
    opacity: 1;
  }

  .article-item-wrapper {
    display: flex;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  .aside-post-image {
    width: 45%;
    min-height: 100px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .article-item:hover .aside-post-image {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .my-el-image {
    width: 100%;
    height: 100%;
  }

  .error-aside-image {
    background: linear-gradient(135deg, var(--themeBackground), #667eea);
    color: var(--white);
    padding: 10px;
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .hasVideo {
    padding: 4px 12px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    backdrop-filter: blur(5px);
  }

  .article-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .aside-post-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--lightGreen);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.4;
  }

  .aside-post-date {
    margin-top: auto;
    color: var(--greyFont);
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .article-item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(81, 196, 146, 0.05);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* ========== 分类速览 ========== */
  .quick-view-container {
    animation: slideUp 0.6s ease-out 0.3s forwards;
  }

  .quick-view-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }

  .quick-view-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--lightGreen);
    letter-spacing: 0.5px;
  }

  .selectSort {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .sort-card {
    position: relative;
    padding: 20px;
    border-radius: 14px;
    color: var(--lightGreen);
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transform-origin: center;
  }

  .sort-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
    pointer-events: none;
    border-radius: 14px;
  }

  .sort-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  }

  .sort-card-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.05));
    border-radius: 14px;
  }

  .sort-card-content {
    position: relative;
    z-index: 2;
  }

  .sort-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
    margin-bottom: 8px;
  }

  .sort-name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .sort-desc {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    opacity: 0.9;
  }

  .sort-card-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shine 3s infinite;
  }

  @keyframes moveBackground {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }

  .post-sort {
    border-radius: 1rem;
    margin-bottom: 15px;
    line-height: 30px;
    transition: all 0.3s;
  }

  .post-sort:hover {
    background: var(--themeBackground);
    padding: 2px 15px;
    cursor: pointer;
    color: var(--white);
  }

  .admire-box {
    background: var(--springBg) center center / cover no-repeat;
    padding: 25px;
    border-radius: 10px;
    animation: hideToShow 1s ease-in-out;
  }

  .admire-btn {
    padding: 13px 15px;
    background: var(--maxLightRed);
    border-radius: 3rem;
    color: var(--white);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
    margin: 20px auto 0;
    transition: all 1s;
  }

  .admire-btn:hover {
    transform: scale(1.2);
  }

  .admire-image {
    margin: 0 auto 10px;
    border-radius: 10px;
    height: 150px;
    width: 150px;
    background: var(--admireImage) center center / cover no-repeat;
  }

  .admire-content {
    font-size: 12px;
    color: var(--maxGreyFont);
    line-height: 1.5;
    margin: 5px;
  }

  .hasVideo {
    padding: 2px 10px 0;
    background: var(--maxMaxWhiteMask);
    border-radius: 6px;
  }

</style>



