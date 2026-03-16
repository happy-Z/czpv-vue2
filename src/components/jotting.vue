<template>
  <div>
    <!-- 头部区域 -->
    <div class="hero-section" style="position: relative">
      <!-- 背景图片 -->
      <el-image class="hero-image"
                style="position: absolute;width: 100%;height: 100%"
                v-once
                lazy
                :src="$store.state.webInfo.randomCover[Math.floor(Math.random() * $store.state.webInfo.randomCover.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <!-- 装饰元素 -->
      <div class="hero-decoration"></div>
      <!-- 内容 -->
      <div class="hero-content">
        <div class="hero-title">
          <h1>捕捉碎碎念</h1>
          <p>一个记录日常的小地方</p>
        </div>
        <button class="publish-btn"
                @click="weiYanDialogVisible = true"
                v-if="canAccess"
                title="发布新的随笔">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>发布</span>
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="jotting-wrapper">
        <!-- 随笔列表 -->
        <div class="jotting-list">
          <div class="empty-state" v-if="treeHoleList.length === 0 && pagination.current === 1">
            <div class="empty-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" stroke-width="1.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <p>暂时没有记录呢...</p>
          </div>

          <div class="jotting-item"
               v-for="(treeHole, index) in treeHoleList"
               :key="`${treeHole.id}-${index}`">

            <!-- 卡片头部 -->
            <div class="item-header">
              <div class="user-info">
                <el-avatar class="user-avatar"
                           shape="square"
                           :size="44"
                           :src="treeHole.avatar"></el-avatar>
                <div class="user-meta">
                  <div class="username-row">
                    <span class="username">{{ treeHole.username }}</span>
                    <span class="level-badge">{{ treeHole.createTimeLv }}</span>
                  </div>
                  <div class="time-info">{{ $common.formatDateYMD(treeHole.createTime) }} {{ $common.getDateDiff(treeHole.createTime) }}</div>
                </div>
              </div>
              <div class="item-actions" v-if="!$common.isEmpty($store.state.currentUser) && $store.state.currentUser.id === treeHole.userId">
                <button class="action-btn delete-btn"
                       @click="deleteTreeHole(treeHole.id)"
                       title="删除">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 卡片内容 -->
            <div class="item-content">
              <div class="content-text" v-html="treeHole.content"></div>
            </div>

            <!-- 卡片底部 -->
            <div class="item-footer">
              <button class="comment-btn"
                     @click="toggleCommentBox(treeHole.id)"
                     :class="{ 'is-active': openCommentBoxIds.includes(treeHole.id) }">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{{ treeHole.commentCount }}</span>
              </button>
            </div>

            <!-- 评论区 - 默认显示最多3条评论 -->
            <div class="comment-section">
              <!-- 评论列表 -->
              <div class="comments-list">
                <comment :type="'jotting'"
                        :source="treeHole.id"
                        :userId="treeHole.userId"
                        :maxCount="3"
                        :showCommentBox="false"
                        @change="changeTotal"></comment>
              </div>

              <!-- 提交评论框 - 点击comment-btn后展开 -->
              <div v-if="openCommentBoxIds.includes(treeHole.id)"
                   class="write-comment-section">
                <commentBox :disableGraffiti="false"
                           @submitComment="submitComment(treeHole.id, $event)"
                           placeholder="写点什么..."></commentBox>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-container">
          <button v-if="pagination.total !== treeHoleList.length"
                 @click="launch()"
                 class="load-more-btn">
            加载更多
          </button>
          <div v-else class="no-more">
            <span>ˇ 你已经看到底了 ˇ</span>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <myFooter :showFooter="showFooter"></myFooter>
    </div>

    <!-- 发布弹窗 -->
    <el-dialog class="jotting-dialog"
               title="分享一个小想法"
               :visible.sync="weiYanDialogVisible"
               width="45%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               :close-on-click-modal="false"
               center>
      <div class="dialog-content">
        <div class="privacy-selector">
          <span class="label">可见范围：</span>
          <el-radio-group v-model="isPublic" class="radio-group">
            <el-radio-button :label="true">所有人能看</el-radio-button>
            <el-radio-button :label="false">只有我知道</el-radio-button>
          </el-radio-group>
        </div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitWeiYan"
                    placeholder="写点什么吧...">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const myFooter = () => import( "./common/myFooter");
const commentBox = () => import( "./comment/commentBox");
const comment = () => import( "./comment/comment");

export default {
  components: {
    myFooter,
    commentBox,
    comment,
  },

  data() {
    return {
      treeHoleList: [],
      openCommentBoxIds: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0,
        userId: this.$constant.userId
      },
      weiYanDialogVisible: false,
      isPublic: true,
      showFooter: false
    }
  },

  computed: {
    canAccess() {
    const { currentUser, currentAdmin } = this.$store.state;
    const isNotEmpty = !this.$common.isEmpty; // 假设你有这个反向方法，或者用 !isEmpty

    // 1. 如果是管理员，直接允许
    if (!this.$common.isEmpty(currentAdmin)) return true;

    // 2. 如果是当前用户，且 ID 匹配，允许
    if (!this.$common.isEmpty(currentUser) && currentUser.id === this.$constant.userId) {
      return true;
    }

    return false;
  }
  },

  watch: {},

  created() {
    this.getWeiYan();
  },

  mounted() {

  },

  methods: {
    changeTotal(data) {
      // 根据 sourceId 找到对应的 treeHole 并更新 commentCount
      const treeHole = this.treeHoleList.find(t => t.id === data.sourceId);
      if (treeHole) {
        treeHole.commentCount = data.total;
      }
    },
    toggleCommentBox(treeHoleId) {
      // 切换提交框的展开/收起
      const index = this.openCommentBoxIds.indexOf(treeHoleId);
      if (index > -1) {
        this.openCommentBoxIds.splice(index, 1);
      } else {
        this.openCommentBoxIds.push(treeHoleId);
      }
    },
    submitComment(treeHoleId, content) {
      // 提交评论
      let comment = {
        commentContent: content,
        source: treeHoleId,
        type: 'jotting'
      };

      this.$http.post(this.$constant.baseURL + "/comment/saveComment", comment)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '评论成功!'
          });
          // 关闭提交框
          const index = this.openCommentBoxIds.indexOf(treeHoleId);
          if (index > -1) {
            this.openCommentBoxIds.splice(index, 1);
          }
          // 刷新当前jotting的评论数和列表
          const treeHole = this.treeHoleList.find(t => t.id === treeHoleId);
          if (treeHole) {
            treeHole.commentCount++;
            // 重新加载评论列表
            this.$root.$emit('refreshComments', treeHoleId);
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    launch() {
      if (this.pagination.total !== this.treeHoleList.length) {
        this.pagination.current = this.pagination.current + 1;
        this.getWeiYan();
      } else {
        this.$message({
          message: "~~到底啦~~",
          type: "warning"
        });
      }
    },
    handleClose() {
      this.weiYanDialogVisible = false;
    },
    submitWeiYan(content) {
      let weiYan = {
        content: content,
        isPublic: this.isPublic
      };

      this.$http.post(this.$constant.baseURL + "/weiYan/saveWeiYan", weiYan)
        .then((res) => {
          this.getWeiYan(true);
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
      this.handleClose();
    },
    deleteTreeHole(id) {
      if (this.$common.isEmpty(this.$store.state.currentUser)) {
        this.$message({
          message: "请先登录！",
          type: "error"
        });
        return;
      }

      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        this.$http.get(this.$constant.baseURL + "/weiYan/deleteWeiYan", {id: id})
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getWeiYan(true);
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消删除!'
        });
      });
    },
    getWeiYan(reset) {
      this.$http.post(this.$constant.baseURL + "/weiYan/listWeiYan", this.pagination)
        .then((res) => {
          this.showFooter = false;
          if (!this.$common.isEmpty(res.data)) {
            res.data.records.forEach(c => {
              c.content = c.content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
              c.content = c.content.replace(/\n/g, '<br/>');
              c.content = this.$common.faceReg(c.content);
              c.content = this.$common.pictureReg(c.content);
            });
            if (reset) {
              this.pagination.current = 1;
              this.treeHoleList = [];
            }
            this.treeHoleList = this.treeHoleList.concat(res.data.records);
            this.pagination.total = res.data.total;
          }
          this.$nextTick(() => {
            this.showFooter = true;
            this.$common.imgShow(".jotting-list .pictureReg");
          });
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    }
  }
}
</script>

<style scoped>

* {
  box-sizing: border-box;
}

/* ============ 头部区域 ============ */
.hero-section {
  position: relative;
  height: 480px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.hero-image {
  position: absolute !important;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1;
}

/* 噪点纹理 */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23000' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  z-index: 2;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  flex: 1;
  animation: slideInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-title h1 {
  font-size: 52px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.hero-title p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 300;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #d4632f 0%, #a84722 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 24px rgba(212, 99, 47, 0.3);
  animation: slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.publish-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212, 99, 47, 0.4);
}

.publish-btn:active {
  transform: translateY(0);
}

/* ============ 动画 ============ */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============ 内容区域 ============ */
.content-section {
  background: linear-gradient(135deg, #f5e6d3 0%, #ede6de 100%);
  background-attachment: fixed;
  position: relative;
  padding-bottom: 60px;
  min-height: 100vh;
}

/* 噪点背景 */
.content-section::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23noiseFilter2)' opacity='0.02'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

.jotting-wrapper {
  position: relative;
  z-index: 1;
  max-width: 760px;
  width: 85%;
  margin: 0 auto;
  padding: 60px 0;
}

/* ============ 随笔列表 ============ */
.jotting-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  color: #888;
}

.jotting-item {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-left: 4px solid #d4632f;
  animation: fadeInUp 0.4s ease-out;
}

.jotting-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-left-color: #a84722;
}

/* 卡片头部 */
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
}

.user-avatar {
  border-radius: 6px;
}

.user-meta {
  flex: 1;
}

.username-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.level-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: linear-gradient(135deg, #f9d5a8 0%, #f5c996 100%);
  color: #7a5520;
  border-radius: 3px;
  font-weight: 600;
}

.time-info {
  font-size: 12px;
  color: #999;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.action-btn:hover {
  background: #f5f5f5;
}

.delete-btn {
  color: #d4632f;
}

.delete-btn:hover {
  color: #a84722;
  background: rgba(212, 99, 47, 0.1);
}

/* 卡片内容 */
.item-content {
  padding: 18px 20px;
  line-height: 1.8;
  color: #333;
  word-break: break-word;
}

.content-text {
  font-size: 15px;
  letter-spacing: 0.3px;
  font-weight: 400;
}

.content-text >>> img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin-top: 8px;
}

/* 卡片底部 */
.item-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
  background: #f9f9f9;
}

.comment-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  font-size: 13px;
  transition: all 0.2s ease;
}

.comment-btn:hover {
  border-color: #d4632f;
  color: #d4632f;
  background: rgba(212, 99, 47, 0.05);
}

.comment-btn.is-active {
  border-color: #d4632f;
  color: #fff;
  background: linear-gradient(135deg, #d4632f 0%, #a84722 100%);
}

/* 评论区域 */
.comment-section {
  padding: 0;
  background: transparent;
  border-top: none;
  animation: none;
  margin-top: -1px;
}

.comments-list {
  padding: 12px 20px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  animation: fadeInUp 0.3s ease-out;
}

.write-comment-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 8px 20px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.write-comment-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  font-size: 13px;
  transition: all 0.2s ease;
}

.write-comment-btn:hover {
  border-color: #d4632f;
  color: #d4632f;
  background: rgba(212, 99, 47, 0.05);
}

.write-comment-btn.is-active {
  border-color: #d4632f;
  color: #fff;
  background: linear-gradient(135deg, #d4632f 0%, #a84722 100%);
}

.write-comment-section {
  padding: 16px 20px;
  background: #f5f5f5;
  border-top: 1px solid #f0f0f0;
  animation: fadeInUp 0.3s ease-out;
}

/* ============ 分页 ============ */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  min-height: 60px;
}

.load-more-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #d4632f 0%, #a84722 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 20px rgba(212, 99, 47, 0.2);
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(212, 99, 47, 0.3);
}

.no-more {
  font-size: 14px;
  color: #aaa;
  user-select: none;
}

/* ============ 弹窗 ============ */
.jotting-dialog >>> .el-dialog {
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.jotting-dialog >>> .el-dialog__header {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.jotting-dialog >>> .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: -0.2px;
}

.jotting-dialog >>> .el-dialog__close {
  font-size: 20px;
  color: #d4d4d4;
  transition: all 0.2s ease;
}

.jotting-dialog >>> .el-dialog__close:hover {
  color: #d4632f;
}

.dialog-content {
  padding: 20px 0;
}

.privacy-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.privacy-selector .label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
}

.radio-group {
  flex: 1;
}

.jotting-dialog >>> .el-radio-button__inner {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 7px 15px;
}

.jotting-dialog >>> .el-radio-button__inner:hover {
  border-color: #d4632f;
  color: #d4632f;
}

.jotting-dialog >>> .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: linear-gradient(135deg, #d4632f 0%, #a84722 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(212, 99, 47, 0.2);
}

.jotting-dialog >>> .el-dialog__footer {
  border-top: 1px solid #f0f0f0;
  padding: 15px 24px;
  background: #fafafa;
}

/* ============ 响应式 ============ */
@media screen and (max-width: 900px) {
  .hero-content {
    padding: 50px 40px;
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .hero-title h1 {
    font-size: 40px;
  }

  .jotting-wrapper {
    width: 90%;
  }
}

@media screen and (max-width: 600px) {
  .hero-section {
    height: 380px;
  }

  .hero-content {
    padding: 40px 20px;
  }

  .hero-title h1 {
    font-size: 32px;
  }

  .hero-title p {
    font-size: 14px;
  }

  .publish-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .jotting-wrapper {
    width: 100%;
    padding: 30px 0;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .item-actions {
    align-self: flex-end;
  }

  .user-info {
    width: 100%;
  }

  .jotting-dialog >>> .el-dialog {
    width: 90% !important;
    margin-top: 20px !important;
  }

  .privacy-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .privacy-selector .label {
    margin-bottom: 8px;
  }
}

</style>
