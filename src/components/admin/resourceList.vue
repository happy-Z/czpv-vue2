<template>
  <div class="resource-page">
    <div class="resource-panel">
      <div class="handle-box">
        <el-select clearable v-model="pagination.resourceType" placeholder="资源类型" class="handle-select mrb10">
          <el-option key="21" label="Video.Article" value="video/article"></el-option>
          <el-option key="22" label="公共资源" value="assets"></el-option>
          <el-option key="10" label="表情包" value="internetMeme"></el-option>
          <el-option key="1" label="用户头像" value="userAvatar"></el-option>
          <el-option key="2" label="文章封面" value="articleCover"></el-option>
          <el-option key="3" label="文章图片" value="articlePicture"></el-option>
          <el-option key="5" label="网站头像" value="webAvatar"></el-option>
          <el-option key="4" label="背景图片" value="webBackgroundImage"></el-option>
          <el-option key="6" label="随机头像" value="randomAvatar"></el-option>
          <el-option key="7" label="随机封面" value="randomCover"></el-option>
          <el-option key="8" label="涂鸦图片" value="graffiti"></el-option>
          <el-option key="9" label="评论图片" value="commentPicture"></el-option>
          <el-option key="11" label="聊天群头像" value="im/groupAvatar"></el-option>
          <el-option key="12" label="群聊消息图片" value="im/groupMessage"></el-option>
          <el-option key="13" label="朋友聊天图片" value="im/friendMessage"></el-option>
          <el-option key="14" label="音乐声音" value="funnyUrl"></el-option>
          <el-option key="15" label="音乐封面" value="funnyCover"></el-option>
          <el-option key="16" label="Love.Cover" value="love/bgCover"></el-option>
          <el-option key="17" label="Love.Man" value="love/manCover"></el-option>
          <el-option key="18" label="Love.Woman" value="love/womanCover"></el-option>
          <el-option key="19" label="收藏夹封面" value="favoritesCover"></el-option>
          <el-option key="20" label="旅拍图片" value="lovePhotoCover"></el-option>
        </el-select>
        <el-button type="primary" icon="mdi:magnify" class="action-btn search-btn" @click="search()">搜索</el-button>
        <el-button type="success" class="action-btn create-btn" @click="addResources()">新增资源</el-button>
      </div>

      <div class="table-wrap">
        <el-table :data="resources" border class="table" header-cell-class-name="table-header">
          <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
          <el-table-column prop="originalName" label="名称" min-width="180" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="userId" label="用户ID" width="100" align="center"></el-table-column>
          <el-table-column prop="type" label="资源类型" min-width="140" show-overflow-tooltip align="center"></el-table-column>

          <el-table-column prop="path" label="Path" min-width="360" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="path-text">{{ scope.row.path }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center" width="140">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions>
                {{ scope.row.status === false ? '禁用' : '启用' }}
              </el-tag>
              <el-switch @click.native="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="预览" width="92" align="center">
            <template slot-scope="scope">
              <template v-if="!$common.isEmpty(scope.row.mimeType) && scope.row.mimeType.includes('image')">
                <el-image
                  lazy
                  :preview-src-list="[scope.row.path]"
                  class="table-td-thumb"
                  :src="scope.row.path"
                  fit="cover"
                ></el-image>
              </template>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>

          <el-table-column label="大小(KB)" width="100" align="center">
            <template slot-scope="scope">
              {{ Math.round(scope.row.size / 1024) }}
            </template>
          </el-table-column>
          <el-table-column prop="mimeType" label="类型" min-width="130" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="storeType" label="存储平台" width="110" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="170" align="center"></el-table-column>

          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="mdi:delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :pager-count="5"
          :current-page="pagination.current"
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="文件"
      :visible.sync="resourceDialog"
      width="25%"
      :append-to-body="true"
      :close-on-click-modal="false"
      destroy-on-close
      center
    >
      <div>
        <div style="display: flex; margin-bottom: 10px">
          <div style="line-height: 40px">存储平台：</div>
          <el-select v-model="storeType" placeholder="存储平台" style="width: 120px">
            <el-option
              v-for="(item, i) in storeTypes.filter(s => s.isShow === 'true')"
              :key="i"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <uploadPicture
          ref="upload"
          :isAdmin="true"
          :prefix="pagination.resourceType"
          @addPicture="addFile"
          :storeType="storeType"
          :listType="'text'"
          :accept="'image/*, video/*, audio/*'"
          :maxSize="100"
          :maxNumber="10"
        ></uploadPicture>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const uploadPicture = () => import("../common/uploadPicture");

export default {
  components: {
    uploadPicture
  },
  data() {
    return {
      pagination: {
        current: 1,
        size: 10,
        total: 0,
        resourceType: ""
      },
      resources: [],
      resourceDialog: false,
      storeTypes: [
        { label: "服务器", value: "local", isShow: this.$store.state.sysConfig["local.enable"] },
        { label: "七牛云", value: "qiniu", isShow: this.$store.state.sysConfig["qiniu.enable"] },
        { label: "MinIO", value: "minio", isShow: this.$store.state.sysConfig["minio.enable"] }

      ],
      storeType: localStorage.getItem("defaultStoreType")
    };
  },

  computed: {},

  watch: {},

  created() {
    this.getResources();
  },

  mounted() {},

  methods: {
    handleDelete(item) {
      this.$confirm("确认删除资源？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
        center: true
      })
        .then(() => {
          this.$http
            .post(this.$constant.baseURL + "/resource/deleteResource", { path: item.path }, true, false)
            .then(() => {
              this.pagination.current = 1;
              this.getResources();
              this.$message({
                message: "删除成功",
                type: "success"
              });
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消删除"
          });
        });
    },

    addFile(url) {
      this.$message({
        message: "上传成功",
        type: "success"
      });

      this.$confirm("文件上传成功，是否继续上传？", "提示", {
        confirmButtonText: "继续上传",
        cancelButtonText: "完成",
        type: "success",
        center: true
      })
        .then(() => {
          // 继续上传，清空上传框并保持对话框打开
          this.$refs.upload.clearFiles();
        })
        .catch(() => {
          // 完成上传，关闭对话框并刷新列表
          this.resourceDialog = false;
          this.pagination.current = 1;
          this.getResources();
        });
    },

    addResources() {
      if (this.$common.isEmpty(this.pagination.resourceType)) {
        this.$message({
          message: "请选择资源类型",
          type: "error"
        });
        return;
      }
      this.resourceDialog = true;
    },

    search() {
      this.pagination.total = 0;
      this.pagination.current = 1;
      this.getResources();
    },

    getResources() {
      this.$http
        .post(this.$constant.baseURL + "/resource/listResource", this.pagination, true)
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.resources = res.data.records;
            this.pagination.total = res.data.total;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },

    changeStatus(item) {
      this.$http
        .get(
          this.$constant.baseURL + "/resource/changeResourceStatus",
          {
            id: item.id,
            flag: item.status
          },
          true
        )
        .then(() => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },

    handlePageChange(val) {
      this.pagination.current = val;
      this.getResources();
    }
  }
};
</script>

<style scoped>
.resource-page {
  padding: 12px;
  background: radial-gradient(circle at top right, #f6fbff 0%, #eef3ff 45%, #f7f8ff 100%);
  border-radius: 14px;
}

.resource-panel {
  padding: 18px;
  background: linear-gradient(145deg, #ffffff, #f6f9ff);
  border: 1px solid #e7ecf7;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(48, 76, 133, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.handle-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fbff, #edf5ff);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.handle-select {
  width: 200px;
}

.action-btn {
  border: none;
  box-shadow: 0 6px 14px rgba(41, 73, 129, 0.2);
}

.search-btn {
  background: linear-gradient(135deg, #3f7bff, #2a60da);
}

.create-btn {
  background: linear-gradient(135deg, #21b67a, #169863);
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
}

.table {
  width: 100%;
  min-width: 1300px;
  font-size: 14px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(46, 78, 136, 0.06);
}

.mrb10 {
  margin-right: 10px;
  margin-bottom: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 1px solid #dbe6f6;
  box-shadow: 0 4px 10px rgba(56, 85, 138, 0.16);
}

.path-text {
  color: #2c3e66;
  font-family: "Consolas", "Monaco", monospace;
}

.pagination {
  margin: 20px 0;
  text-align: right;
}

.el-switch {
  margin: 5px;
}

.table-header {
  background: linear-gradient(180deg, #f2f7ff, #e9f1ff);
  color: #2a4774;
  font-weight: 600;
}

@media (max-width: 768px) {
  .resource-page {
    padding: 6px;
  }

  .resource-panel {
    padding: 10px;
  }

  .handle-box {
    padding: 10px;
    gap: 8px;
  }

  .handle-select {
    width: 100%;
  }

  .action-btn {
    width: 100%;
    margin-left: 0 !important;
  }

  .table {
    min-width: 1100px;
    font-size: 13px;
  }

  .table-td-thumb {
    width: 40px;
    height: 40px;
  }

  .pagination {
    text-align: center;
  }
}
</style>


