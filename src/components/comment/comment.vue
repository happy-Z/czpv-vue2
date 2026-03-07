<template>
  <div>
    <!-- 评论框 -->
    <div v-if="showCommentBox" style="margin-bottom: 40px">
      <div class="comment-head">
        <iconify-icon icon="mdi:pencil" style="font-weight: bold;font-size: 22px;"></iconify-icon> 留言
      </div>
      <div>
        <!-- 文字评论 -->
        <div v-show="!isGraffiti">
          <commentBox @showGraffiti="isGraffiti = !isGraffiti"
                      @submitComment="submitComment">
          </commentBox>
        </div>
        <!-- 画笔 -->
<!--        <div v-show="isGraffiti">-->
<!--          <graffiti @showComment="isGraffiti = !isGraffiti"-->
<!--                    @addGraffitiComment="addGraffitiComment">-->
<!--          </graffiti>-->
<!--        </div>-->
      </div>
    </div>

    <!-- 评论内容 -->
    <div v-if="comments.length > 0">
      <!-- 评论数量 -->
      <div class="commentInfo-title">
        <span style="font-size: 1.15rem">Comments | </span>
        <span>{{ total }} 条留言</span>
      </div>

      <!-- 默认显示的评论（仅maxCount条）-->
      <div v-if="!isExpanded">
        <!-- 评论详情 -->
        <div id="comment-content" class="commentInfo-detail"
             v-for="(item, index) in comments.slice(0, maxCount)"
             :key="index">
          <!-- 头像 -->
          <el-avatar shape="square" class="commentInfo-avatar" :size="35" :src="item.avatar"></el-avatar>

          <div style="flex: 1;padding-left: 12px">
            <!-- 评论信息 -->
            <div style="display: flex;justify-content: space-between">
              <div>
                <span class="commentInfo-username">{{ item.username }}</span>
                <span class="commentInfo-master">{{ item.createTimeLv }}</span>
                <span class="commentInfo-other">{{ $common.formatDateYMD(item.createTime) }} {{ $common.getDateDiff(item.createTime) }}</span>
              </div>
              <div class="commentInfo-reply" @click="replyDialog(item, item)">
                <span v-if="item.childComments.total > 0">{{item.childComments.total}} </span><span>回复</span>
              </div>
            </div>
            <!-- 评论内容 -->
            <div class="commentInfo-content">
              <span v-html="item.commentContent"></span>
            </div>
            <!-- 回复模块 -->
            <div v-if="!$common.isEmpty(item.childComments) && !$common.isEmpty(item.childComments.records)">
              <div class="commentInfo-detail" v-for="(childItem, i) in item.childComments.records" :key="i">
                <!-- 头像 -->
                <el-avatar shape="square" class="commentInfo-avatar" :size="30" :src="childItem.avatar"></el-avatar>

                <div style="flex: 1;padding-left: 12px">
                  <!-- 评论信息 -->
                  <div style="display: flex;justify-content: space-between">
                    <div>
                      <span class="commentInfo-username-small">{{ childItem.username }}</span>
                      <span class="commentInfo-master">{{ childItem.createTimeLv }}</span>
                      <span class="commentInfo-other">{{ $common.formatDateYMD(childItem.createTime) }} {{ $common.getDateDiff(childItem.createTime) }}</span>
                    </div>
                    <div>
                      <span class="commentInfo-reply" @click="replyDialog(childItem, item)">回复</span>
                    </div>
                  </div>
                  <!-- 评论内容 -->
                  <div class="commentInfo-content">
                    <template v-if="childItem.parentCommentId !== item.id &&
                                    childItem.parentUserId !== childItem.userId">
                      <span style="color: var(--blue)">@{{ childItem.parentUsername }} </span>:
                    </template>
                    <span v-html="childItem.commentContent"></span>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <div class="pagination-wrap" v-if="item.childComments.records.length < item.childComments.total">
                <div class="pagination"
                     @click="toChildPage(item)">
                  展开
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 查看全部按钮 -->
        <div v-if="total > maxCount" class="expand-all-btn-wrapper">
          <button class="expand-all-btn" @click="isExpanded = true">
            <span>查看全部 ({{ total - maxCount }} 条)</span>
          </button>
        </div>
      </div>

      <!-- 展开显示所有评论 -->
      <div v-else>
        <!-- 评论详情 -->
        <div id="comment-content" class="commentInfo-detail"
             v-for="(item, index) in comments"
             :key="index">
          <!-- 头像 -->
          <el-avatar shape="square" class="commentInfo-avatar" :size="35" :src="item.avatar"></el-avatar>

          <div style="flex: 1;padding-left: 12px">
            <!-- 评论信息 -->
            <div style="display: flex;justify-content: space-between">
              <div>
                <span class="commentInfo-username">{{ item.username }}</span>
                <span class="commentInfo-master">{{ item.createTimeLv }}</span>
                <span class="commentInfo-other">{{ $common.formatDateYMD(item.createTime) }} {{ $common.getDateDiff(item.createTime) }}</span>
              </div>
              <div class="commentInfo-reply" @click="replyDialog(item, item)">
                <span v-if="item.childComments.total > 0">{{item.childComments.total}} </span><span>回复</span>
              </div>
            </div>
            <!-- 评论内容 -->
            <div class="commentInfo-content">
              <span v-html="item.commentContent"></span>
            </div>
            <!-- 回复模块 -->
            <div v-if="!$common.isEmpty(item.childComments) && !$common.isEmpty(item.childComments.records)">
              <div class="commentInfo-detail" v-for="(childItem, i) in item.childComments.records" :key="i">
                <!-- 头像 -->
                <el-avatar shape="square" class="commentInfo-avatar" :size="30" :src="childItem.avatar"></el-avatar>

                <div style="flex: 1;padding-left: 12px">
                  <!-- 评论信息 -->
                  <div style="display: flex;justify-content: space-between">
                    <div>
                      <span class="commentInfo-username-small">{{ childItem.username }}</span>
                      <span class="commentInfo-master">{{ childItem.createTimeLv }}</span>
                      <span class="commentInfo-other">{{ $common.formatDateYMD(childItem.createTime) }} {{ $common.getDateDiff(childItem.createTime) }}</span>
                    </div>
                    <div>
                      <span class="commentInfo-reply" @click="replyDialog(childItem, item)">回复</span>
                    </div>
                  </div>
                  <!-- 评论内容 -->
                  <div class="commentInfo-content">
                    <template v-if="childItem.parentCommentId !== item.id &&
                                    childItem.parentUserId !== childItem.userId">
                      <span style="color: var(--blue)">@{{ childItem.parentUsername }} </span>:
                    </template>
                    <span v-html="childItem.commentContent"></span>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <div class="pagination-wrap" v-if="item.childComments.records.length < item.childComments.total">
                <div class="pagination"
                     @click="toChildPage(item)">
                  展开
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <proPage :current="pagination.current"
                 :size="pagination.size"
                 :total="pagination.total"
                 :buttonSize="6"
                 :color="$constant.commentPageColor"
                 @toPage="toPage">
        </proPage>

        <!-- 收起按钮 -->
        <div class="collapse-btn-wrapper">
          <button class="collapse-btn" @click="isExpanded = false">
            <span>收起，只看前 {{ maxCount }} 条</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="myCenter" style="color: var(--greyFont)">
      <i>来发第一个留言啦~</i>
    </div>

    <el-dialog title="留言"
               :visible.sync="replyDialogVisible"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitReply">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // const graffiti = () => import( "./graffiti");
  const commentBox = () => import( "./commentBox");
  const proPage = () => import( "../common/proPage");

  export default {
    components: {
      // graffiti,
      commentBox,
      proPage
    },
    props: {
      source: {
        type: Number
      },
      type: {
        type: String
      },
      userId: {
        type: Number
      },
      maxCount: {
        type: Number,
        default: 10
      },
      showCommentBox: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isGraffiti: false,
        isExpanded: false,
        total: 0,
        replyDialogVisible: false,
        floorComment: {},
        replyComment: {},
        comments: [],
        pagination: {
          current: 1,
          size: this.maxCount,
          total: 0,
          source: this.source,
          commentType: this.type,
          floorCommentId: null
        }
      };
    },

    computed: {},

    created() {
      this.getComments(this.pagination);
      this.getTotal();
      // 监听从父组件（jotting）发来的刷新评论事件
      this.$root.$on('refreshComments', (sourceId) => {
        if (sourceId === this.source) {
          this.pagination.current = 1;
          this.isExpanded = false;
          this.getComments(this.pagination);
          this.getTotal();
        }
      });
    },
    beforeDestroy() {
      // 销毁时移除事件监听，防止内存泄漏
      this.$root.$off('refreshComments');
    },
    methods: {
      toPage(page) {
        this.pagination.current = page;
        window.scrollTo({
          top: document.getElementById('comment-content').offsetTop
        });
        this.getComments(this.pagination);
      },
      getTotal() {
        this.$http.get(this.$constant.baseURL + "/comment/getCommentCount", {source: this.source, type: this.type})
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.total = res.data;
              this.$emit("change", { total: this.total, sourceId: this.source });
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      toChildPage(floorComment) {
        floorComment.childComments.current += 1;
        let pagination = {
          current: floorComment.childComments.current,
          size: 5,
          total: 0,
          source: this.source,
          commentType: this.type,
          floorCommentId: floorComment.id
        }
        this.getComments(pagination, floorComment, true);
      },
      emoji(comments, flag) {
        comments.forEach(c => {
          c.commentContent = c.commentContent.replace(/\n/g, '<br/>');
          c.commentContent = this.$common.faceReg(c.commentContent);
          c.commentContent = this.$common.pictureReg(c.commentContent);
          if (flag) {
            if (!this.$common.isEmpty(c.childComments) && !this.$common.isEmpty(c.childComments.records)) {
              c.childComments.records.forEach(cc => {
                c.commentContent = c.commentContent.replace(/\n/g, '<br/>');
                cc.commentContent = this.$common.faceReg(cc.commentContent);
                cc.commentContent = this.$common.pictureReg(cc.commentContent);
              });
            }
          }
        });
      },
      getComments(pagination, floorComment = {}, isToPage = false) {
        this.$http.post(this.$constant.baseURL + "/comment/listComment", pagination)
          .then((res) => {
            if (!this.$common.isEmpty(res.data) && !this.$common.isEmpty(res.data.records)) {
              if (this.$common.isEmpty(floorComment)) {
                this.comments = res.data.records;
                pagination.total = res.data.total;
                this.emoji(this.comments, true);
              } else {
                if (isToPage === false) {
                  floorComment.childComments = res.data;
                } else {
                  floorComment.childComments.total = res.data.total;
                  floorComment.childComments.records = floorComment.childComments.records.concat(res.data.records);
                }
                this.emoji(floorComment.childComments.records, false);
              }
              this.$nextTick(() => {
                this.$common.imgShow("#comment-content .pictureReg");
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      addGraffitiComment(graffitiComment) {
        this.submitComment(graffitiComment);
      },
      submitComment(commentContent) {
        let comment = {
          source: this.source,
          type: this.type,
          commentContent: commentContent
        };

        this.$http.post(this.$constant.baseURL + "/comment/saveComment", comment)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.pagination = {
              current: 1,
              size: 10,
              total: 0,
              source: this.source,
              commentType: this.type,
              floorCommentId: null
            }
            this.getComments(this.pagination);
            this.getTotal();
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      submitReply(commentContent) {
        let comment = {
          source: this.source,
          type: this.type,
          floorCommentId: this.floorComment.id,
          commentContent: commentContent,
          parentCommentId: this.replyComment.id,
          parentUserId: this.replyComment.userId
        };

        let floorComment = this.floorComment;

        this.$http.post(this.$constant.baseURL + "/comment/saveComment", comment)
          .then((res) => {
            let pagination = {
              current: 1,
              size: 5,
              total: 0,
              source: this.source,
              commentType: this.type,
              floorCommentId: floorComment.id
            }
            this.getComments(pagination, floorComment);
            this.getTotal();
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
        this.handleClose();
      },
      replyDialog(comment, floorComment) {
        this.replyComment = comment;
        this.floorComment = floorComment;
        this.replyDialogVisible = true;
      },
      handleClose() {
        this.replyDialogVisible = false;
        this.floorComment = {};
        this.replyComment = {};
      }
    }
  }
</script>

<style scoped>

  .comment-head {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    user-select: none;
    color: var(--themeBackground);
  }

  .commentInfo-title {
    margin-bottom: 20px;
    color: var(--greyFont);
    user-select: none;
  }

  #comment-content {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .commentInfo-detail {
    display: flex;
  }

  .commentInfo-avatar {
    border-radius: 5px;
  }

  .commentInfo-username {
    color: var(--orangeRed);
    font-size: 16px;
    font-weight: 600;
    margin-right: 5px;
  }

  .commentInfo-username-small {
    color: var(--orangeRed);
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
  }

  .commentInfo-master {
    color: var(--green);
    border: 1px solid var(--green);
    border-radius: 0.2rem;
    font-size: 12px;
    padding: 2px 4px;
    margin-right: 5px;
  }

  .commentInfo-other {
    font-size: 12px;
    color: var(--greyFont);
    user-select: none;
  }

  .commentInfo-reply {
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    color: var(--white);
    background: var(--themeBackground);
    border-radius: 0.2rem;
    padding: 3px 6px;
  }

  .commentInfo-content {
    margin: 15px 0 25px;
    padding: 18px 20px;
    background: var(--commentContent);
    border-radius: 12px;
    color: var(--black);
    word-break: break-word;
    font-size: 13px;
    line-height: 1.6;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .expand-all-btn-wrapper {
    display: flex;
    justify-content: center;
    padding: 16px 0 8px 0;
    margin-top: 8px;
  }

  .expand-all-btn {
    padding: 8px 20px;
    background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
    border: 1px solid #d4d4d4;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .expand-all-btn:hover {
    background: linear-gradient(135deg, #e8e8e8 0%, #ddd 100%);
    border-color: #d4632f;
    color: #d4632f;
  }

  .collapse-btn-wrapper {
    display: flex;
    justify-content: center;
    padding: 16px 0 8px 0;
    margin-top: 16px;
  }

  .collapse-btn {
    padding: 8px 20px;
    background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
    border: 1px solid #d4d4d4;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background: linear-gradient(135deg, #e8e8e8 0%, #ddd 100%);
    border-color: #d4632f;
    color: #d4632f;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .pagination {
    padding: 6px 20px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    user-select: none;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
  }

  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }
</style>



