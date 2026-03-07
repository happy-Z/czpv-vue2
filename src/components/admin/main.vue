<template>
  <div class="admin-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <iconify-icon icon="mdi:eye"></iconify-icon>
      <span>统计信息总览</span>
    </div>

    <div class="dashboard-content">
      <!-- 关键指标卡片 -->
      <div class="metrics-grid">
        <!-- 总访问量卡片 -->
        <div class="metric-card metric-card-primary">
          <div class="metric-icon">
            <iconify-icon icon="mdi:chart-bar"></iconify-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ historyInfo.ip_history_count || 0 }}</div>
            <div class="metric-label">总访问量</div>
          </div>
        </div>

        <!-- 今日访问量卡片 -->
        <div class="metric-card metric-card-success">
          <div class="metric-icon">
            <iconify-icon icon="mdi:calendar"></iconify-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ historyInfo.ip_count_today || 0 }}</div>
            <div class="metric-label">今日访问IP</div>
          </div>
        </div>

        <!-- 昨日访问量卡片 -->
        <div class="metric-card metric-card-warning">
          <div class="metric-icon">
            <iconify-icon icon="mdi:ticket"></iconify-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ historyInfo.ip_count_yest || 0 }}</div>
            <div class="metric-label">昨日访问IP</div>
          </div>
        </div>
      </div>

      <!-- 总览部分 -->
      <div class="section-card">
        <div class="section-header">
          <iconify-icon icon="mdi:home"></iconify-icon>
          <h2>总览数据</h2>
        </div>
        <div class="section-body">
          <div class="data-grid">
            <!-- 省份访问TOP10 -->
            <div class="data-box">
              <div class="data-box-header">
                <iconify-icon icon="mdi:map-marker"></iconify-icon>
                <h3>省份访问 TOP 10</h3>
              </div>
              <div class="data-box-content">
                <el-table :data="historyInfo.ip_history_province" stripe>
                  <el-table-column
                    type="index"
                    align="center"
                    width="60"
                    label="#">
                  </el-table-column>
                  <el-table-column
                    key="nation-col"
                    prop="nation"
                    align="center"
                    label="国家"
                    width="140">
                    <template slot-scope="scope">
                      <div class="nation-cell">
                        <span class="nation-flag">{{ getNationFlag(scope.row.nation) }}</span>
                        <span>{{ scope.row.nation || "-" }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    key="province-col"
                    prop="province"
                    align="center"
                    label="省份">
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    align="center"
                    label="数量">
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- IP访问TOP10 -->
            <div class="data-box">
              <div class="data-box-header">
                <iconify-icon icon="mdi:connection"></iconify-icon>
                <h3>IP 访问 TOP 10</h3>
              </div>
              <div class="data-box-content">
                <el-table :data="historyInfo.ip_history_ip" stripe>
                  <el-table-column
                    type="index"
                    align="center"
                    width="60"
                    label="#">
                  </el-table-column>
                  <el-table-column
                    prop="ip"
                    align="center"
                    label="IP"
                    width="200">
                  </el-table-column>
                    <el-table-column
                      prop="num"
                      align="center"
                      label="数量">
                    </el-table-column>
                  </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 今日访问部分 -->
      <div class="section-card">
        <div class="section-header">
          <iconify-icon icon="mdi:white-balance-sunny"></iconify-icon>
          <h2>今日数据</h2>
        </div>
        <div class="section-body">
          <div class="data-grid">
            <!-- 今日访问省份 -->
            <div class="data-box">
              <div class="data-box-header">
                <iconify-icon icon="mdi:map"></iconify-icon>
                <h3>今日访问省份</h3>
              </div>
              <div class="data-box-content">
                <el-table :data="historyInfo.province_today" stripe>
                  <el-table-column
                    type="index"
                    align="center"
                    width="60"
                    label="#">
                  </el-table-column>
                  <el-table-column
                    prop="province"
                    align="center"
                    label="省份">
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    align="center"
                    label="数量">
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 今日访问用户 -->
            <div class="data-box">
              <div class="data-box-header">
                <iconify-icon icon="mdi:account"></iconify-icon>
                <h3>今日访问用户</h3>
              </div>
              <div class="data-box-content">
                <el-table :data="historyInfo.username_today" stripe>
                  <el-table-column
                    align="center"
                    label="头像"
                    width="100">
                    <template slot-scope="scope">
                      <el-avatar class="user-avatar" :size="40"
                                 :src="scope.row.avatar">
                      </el-avatar>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    align="center"
                    label="用户">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 昨日访问部分 -->
      <div class="section-card">
        <div class="section-header">
          <iconify-icon icon="mdi:moon"></iconify-icon>
          <h2>昨日数据</h2>
        </div>
        <div class="section-body">
          <div class="data-grid">
            <!-- 昨日访问用户 -->
            <div class="data-box">
              <div class="data-box-header">
                <iconify-icon icon="mdi:account"></iconify-icon>
                <h3>昨日访问用户</h3>
              </div>
              <div class="data-box-content">
                <el-table :data="historyInfo.username_yest" stripe>
                  <el-table-column
                    align="center"
                    label="头像"
                    width="100">
                    <template slot-scope="scope">
                      <el-avatar class="user-avatar" :size="40"
                                 :src="scope.row.avatar">
                      </el-avatar>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    align="center"
                    label="用户">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        historyInfo: {}
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getHistoryInfo();
    },

    mounted() {

    },

    methods: {
      getNationFlag(nation) {
        const nationMap = {
          "中国": "🇨🇳",
          "美国": "🇺🇸",
          "日本": "🇯🇵",
          "韩国": "🇰🇷",
          "英国": "🇬🇧",
          "法国": "🇫🇷",
          "德国": "🇩🇪",
          "俄罗斯": "🇷🇺",
          "加拿大": "🇨🇦",
          "澳大利亚": "🇦🇺"
        };

        return nationMap[nation] || "🌐";
      },

      getHistoryInfo() {
        this.$http.get(this.$constant.baseURL + "/webInfo/getHistoryInfo", {}, true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.historyInfo = res.data;
            }
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

.admin-dashboard {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* ========== 页面标题 ========== */
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
  color: var(--black);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header i {
  color: var(--maxLightRed);
  font-size: 32px;
}

/* ========== 仪表盘内容 ========== */
.dashboard-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* ========== 关键指标卡片 ========== */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 6px solid;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.1;
}

.metric-card-primary {
  border-left-color: #ff6b6b;
}

.metric-card-primary::before {
  background: #ff6b6b;
}

.metric-card-success {
  border-left-color: #51cf66;
}

.metric-card-success::before {
  background: #51cf66;
}

.metric-card-warning {
  border-left-color: #ffd93d;
}

.metric-card-warning::before {
  background: #ffd93d;
}

.metric-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
}

.metric-card-primary .metric-icon {
  color: var(--red);
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
}

.metric-card-success .metric-icon {
  color: var(--green);
  background: linear-gradient(135deg, rgba(81, 207, 102, 0.1) 0%, rgba(81, 207, 102, 0.05) 100%);
}

.metric-card-warning .metric-icon {
  color: var(--lightYellow);
  background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(255, 217, 61, 0.05) 100%);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--black);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.metric-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* ========== 部分卡片 ========== */
.section-card {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header i {
  font-size: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.section-body {
  padding: 24px;
}

/* ========== 数据网格 ========== */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
}

@media screen and (max-width: 1200px) {
  .data-grid {
    grid-template-columns: 1fr;
  }
}

/* ========== 数据盒子 ========== */
.data-box {
  background: #fafbfc;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

.data-box:hover {
  border-color: #d0d8e0;
  background: #f5f8fc;
}

.data-box-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-bottom: 2px solid #e8ecf1;
}

.data-box-header i {
  font-size: 18px;
  color: #667eea;
}

.data-box-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--black);
}

.data-box-content {
  padding: 0;
}

/* ========== 表格样式美化 ========== */
.data-box-content >>> .el-table {
  background: transparent;
  border: none;
}

.data-box-content >>> .el-table::before {
  height: 0;
}

.data-box-content >>> .el-table .cell {
  line-height: 32px;
  font-size: 13px;
}

.data-box-content >>> .el-table .el-table__row {
  transition: background-color 0.2s ease;
}

.data-box-content >>> .el-table .el-table__row:hover > td {
  background-color: rgba(102, 126, 234, 0.05) !important;
}

.data-box-content >>> .el-table th {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-bottom: 2px solid #e8ecf1;
}

.data-box-content >>> .el-table td {
  border-bottom: 1px solid #f0f3f7;
}

.data-box-content >>> .el-table .el-table__row:last-child td {
  border-bottom: none;
}

.nation-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.nation-flag {
  font-size: 16px;
  line-height: 1;
}

.user-avatar {
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

/* ========== 响应式 ========== */
@media screen and (max-width: 800px) {
  .admin-dashboard {
    padding: 12px;
  }

  .page-header {
    font-size: 22px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .data-grid {
    grid-template-columns: 1fr;
  }

  .metric-card {
    flex-direction: column;
    text-align: center;
  }

  .section-header {
    padding: 16px;
  }

  .section-body {
    padding: 16px;
  }

  .data-box-header {
    padding: 12px 16px;
  }

  .data-box-content >>> .el-table .cell {
    line-height: 28px;
    font-size: 12px;
  }
}

</style>




