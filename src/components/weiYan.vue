<template>
  <div class="weiyan-wrapper">
    <!-- 两句诗 -->
    <div class="poem-section my-animation-slide-top">
      <twoPoem :isHitokoto="false"></twoPoem>
    </div>

    <div class="content-section">
      <div class="weiyan-container">
        <!-- 页面标题 -->
        <div class="page-header">
          <div class="header-content">

            <p class="page-desc">记录生活中的点点滴滴</p>
          </div>
        </div>

        <!-- 树洞列表 -->
        <div class="tree-hole-section">
          <treeHole :treeHoleList="treeHoleList"
                    :avatar="!$common.isEmpty($store.state.currentUser)?$store.state.currentUser.avatar:$store.state.webInfo.avatar"
                    @launch="launch"
                    @deleteTreeHole="deleteTreeHole">
          </treeHole>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <proPage :current="pagination.current"
                   :size="pagination.size"
                   :total="pagination.total"
                   :buttonSize="3"
                   :color="$constant.pageColor"
                   @toPage="toPage">
          </proPage>
        </div>
      </div>

      <!-- 页脚 -->
      <myFooter :showFooter="showFooter"></myFooter>
    </div>

    <!-- 微言发布对话框 -->
    <el-dialog :visible.sync="weiYanDialogVisible"
               width="50%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               :close-on-click-modal="false"
               class="weiyan-dialog"
               center>
      <span slot="title" class="dialog-title">
        <iconify-icon icon="mdi:pencil"></iconify-icon>
        <span>发布微言</span>
      </span>
      <div class="dialog-content">
        <div class="radio-group-section">
          <span class="radio-label">隐私设置</span>
          <el-radio-group v-model="isPublic" class="privacy-group">
            <el-radio-button :label="true">
              <iconify-icon icon="mdi:unfold-more-vertical"></iconify-icon>
              <span>公开</span>
            </el-radio-button>
            <el-radio-button :label="false">
              <iconify-icon icon="mdi:lock"></iconify-icon>
              <span>私密</span>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="comment-box-section">
          <commentBox :disableGraffiti="true"
                      @submitComment="submitWeiYan">
          </commentBox>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const twoPoem = () => import( "./common/twoPoem");
  const myFooter = () => import( "./common/myFooter");
  const treeHole = () => import( "./common/treeHole");
  const proPage = () => import( "./common/proPage");
  const commentBox = () => import( "./comment/commentBox");

  export default {
    components: {
      twoPoem,
      myFooter,
      treeHole,
      proPage,
      commentBox
    },

    data() {
      return {
        treeHoleList: [],
        pagination: {
          current: 1,
          size: 10,
          total: 0
        },
        weiYanDialogVisible: false,
        isPublic: true,
        showFooter: false
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getWeiYan();
    },

    mounted() {

    },

    methods: {
      toPage(page) {
        this.pagination.current = page;
        window.scrollTo({
          top: 240,
          behavior: "smooth"
        });
        this.getWeiYan();
      },
      launch() {
        if (this.$common.isEmpty(this.$store.state.currentUser) && this.$common.isEmpty(this.$store.state.currentAdmin)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        this.weiYanDialogVisible = true;
      },
      handleClose() {
        this.weiYanDialogVisible = false;
      },
      submitWeiYan(content) {
        // 二次登陆状态检查
        if (this.$common.isEmpty(this.$store.state.currentUser) && this.$common.isEmpty(this.$store.state.currentAdmin)) {
          this.$message({
            message: "登陆已过期，请重新登录！",
            type: "error"
          });
          this.handleClose();
          return;
        }

        // 检查 token 是否存在
        const userToken = localStorage.getItem("userToken");
        const adminToken = localStorage.getItem("adminToken");
        if (this.$common.isEmpty(userToken) && this.$common.isEmpty(adminToken)) {
          this.$message({
            message: "认证信息丢失，请重新登录！",
            type: "error"
          });
          this.handleClose();
          return;
        }

        let weiYan = {
          content: content,
          isPublic: this.isPublic
        };

        this.$http.post(this.$constant.baseURL + "/weiYan/saveWeiYan", weiYan)
          .then((res) => {
            this.$message({
              message: "发布成功！",
              type: "success"
            });
            this.getWeiYan();
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
        if (this.$common.isEmpty(this.$store.state.currentUser) && this.$common.isEmpty(this.$store.state.currentAdmin)) {
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
              this.pagination.current = 1;
              this.getWeiYan();
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
      getWeiYan() {
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
              this.treeHoleList = res.data.records;
              this.pagination.total = res.data.total;
            }
            this.$nextTick(() => {
              this.showFooter = true;
              this.$common.imgShow(".tree-hole-box .pictureReg");
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

/* ========== 全局样式 ========== */
.weiyan-wrapper {
  min-height: 100vh;
  width: 100%;
  background: var(--background);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.content-section {
  width: 100%;
  min-height: 100vh;
  background: transparent;
  animation: hideToShow 2.5s ease-out;
}

/* ========== 诗句部分 ========== */
.poem-section {
  animation: slideDown 0.8s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 页面头部 ========== */
.weiyan-container {
  width: 100%;
  max-width: 1000px;
  margin: 40px auto 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 0 auto;
  animation: fadeInScale 0.6s ease-out 0.2s backwards;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.header-content {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 15px;
  background: linear-gradient(135deg, var(--lightGreen) 0%, #667eea 50%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.title-icon {
  font-size: 48px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.page-desc {
  font-size: 16px;
  color: var(--greyFont);
  margin: 0;
  font-weight: 500;
  letter-spacing: 1px;
}

/* ========== 树洞列表区域 ========== */
.tree-hole-section {
  margin-bottom: 40px;
  animation: slideUp 0.6s ease-out 0.3s backwards;
}

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

/* ========== 分页区域 ========== */
.pagination-section {
  display: flex;
  justify-content: center;
  margin: 50px 0 40px;
  animation: slideUp 0.6s ease-out 0.4s backwards;
}

/* ========== 对话框样式 ========== */
.weiyan-dialog {
  animation: dialogSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.weiyan-dialog >>> .el-dialog {
  animation: dialogFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.weiyan-dialog >>> .el-overlay {
  animation: overlayFadeIn 0.4s ease-out !important;
}

@keyframes dialogSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 自定义对话框标题样式 */
.dialog-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--lightGreen);
  letter-spacing: 1px;
}

.dialog-title i {
  font-size: 24px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.dialog-content {
  padding: 20px 0;
}

/* 隐私设置部分 */
.radio-group-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(81, 196, 146, 0.05), rgba(102, 126, 234, 0.05));
  border-radius: 12px;
  border: 1px solid rgba(81, 196, 146, 0.1);
}

.radio-label {
  font-weight: 700;
  color: var(--lightGreen);
  font-size: 15px;
  min-width: 80px;
}

.privacy-group {
  flex: 1;
}

.privacy-group >>> .el-radio-button__inner {
  background: var(--white);
  border-color: var(--lightGreen);
  color: var(--lightGreen);
  font-weight: 600;
  padding: 8px 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.privacy-group >>> .el-radio-button__inner i {
  font-size: 16px;
}

.privacy-group >>> .el-radio-button.is-active .el-radio-button__inner {
  background: linear-gradient(135deg, var(--lightGreen), #2a9d6f);
  border-color: var(--lightGreen);
  color: white;
  box-shadow: 0 4px 12px rgba(81, 196, 146, 0.3);
}

.privacy-group >>> .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 20px 0 0 20px;
}

.privacy-group >>> .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 20px 20px 0;
}

/* 评论框部分 */
.comment-box-section {
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03));
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
    gap: 8px;
  }

  .title-icon {
    font-size: 32px;
  }

  .weiyan-container {
    margin: 20px auto 0;
  }

  .page-header {
    margin-bottom: 30px;
  }

  .weiyan-dialog >>> .el-dialog {
    width: 95% !important;
  }

  .radio-group-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .privacy-group {
    width: 100%;
  }
}

</style>



