<template>
  <div class="my-header">
    <!-- 左侧Logo区域 -->
    <div class="header-left">
      <div class="logo">
        <iconify-icon icon="mdi:cog""></iconify-icon>
        <span>后台管理</span>
      </div>
    </div>

    <!-- 右侧功能区 -->
    <div class="header-right">
      <!-- 返回首页按钮 -->
      <div class="nav-item admin-index" @click="$router.push({path: '/'})" title="返回首页">
        <iconify-icon icon="mdi:home""></iconify-icon>
        <span>首页</span>
      </div>

      <!-- 用户信息区 -->
      <div class="header-user-con">
        <el-dropdown placement="bottom" trigger="click">
          <div class="user-info">
            <el-avatar class="user-avatar" :size="40"
                       :src="$store.state.currentAdmin.avatar">
            </el-avatar>
            <span class="user-name">{{ $store.state.currentAdmin.username }}</span>
            <iconify-icon icon="mdi:chevron-down""></iconify-icon>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },

    computed: {},

    watch: {},

    created() {

    },

    mounted() {

    },

    methods: {
      logout() {
        this.$http.get(this.$constant.baseURL + "/user/logout", {}, true)
          .then((res) => {
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
        this.$store.commit("loadCurrentAdmin", {});
        localStorage.removeItem("adminToken");
        this.$router.push({path: '/'});
      }
    }
  }
</script>

<style scoped>

/* ========== 页头基础样式 ========== */
.my-header {
  position: relative;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 50%, #e8ecf1 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* ========== Logo区域 ========== */
.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  user-select: none;
}

.logo:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: scale(1.05);
}

.logo i {
  font-size: 28px;
  color: #667eea;
  transition: all 0.3s ease;
}

.logo:hover i {
  color: #764ba2;
  transform: rotate(10deg);
}

/* ========== 右侧功能区 ========== */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ========== 导航项通用样式 ========== */
.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;
}

.nav-item:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
  transform: translateY(-2px);
}

.nav-icon {
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.nav-item:hover .nav-icon {
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  transform: scale(1.1);
}

/* ========== 返回首页按钮 ========== */
.admin-index {
  position: relative;
  overflow: hidden;
}

.admin-index::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.admin-index:hover::before {
  left: 100%;
}

/* ========== 用户信息区 ========== */
.header-user-con {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.user-info:hover {
  background: rgba(102, 126, 234, 0.08);
}

.user-avatar {
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid white;
  transition: all 0.3s ease;
}

.user-info:hover .user-avatar {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.user-name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.user-info:hover .user-name {
  color: #667eea;
}

.user-info i {
  font-size: 12px;
  color: #999;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.user-info:hover i {
  color: #667eea;
  transform: rotate(180deg);
}

/* ========== 下拉菜单样式 ========== */
.header-user-con >>> .el-dropdown-menu {
  border-radius: 8px;
  border: 1px solid #e8ecf1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
}

.header-user-con >>> .el-dropdown-menu__item {
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.header-user-con >>> .el-dropdown-menu__item:hover {
  background: rgba(102, 126, 234, 0.08) !important;
  color: #667eea;
}

/* ========== 响应式设计 ========== */
@media screen and (max-width: 1200px) {
  .my-header {
    padding: 0 12px;
  }

  .logo {
    font-size: 18px;
    padding: 6px 12px;
  }

  .logo i {
    font-size: 24px;
  }

  .nav-item {
    padding: 0 8px;
    font-size: 13px;
  }

  .user-name {
    max-width: 60px;
  }
}

@media screen and (max-width: 800px) {
  .my-header {
    padding: 0 8px;
  }

  .logo {
    font-size: 16px;
    padding: 4px 8px;
  }

  .logo span {
    display: none;
  }

  .admin-index span {
    display: none;
  }

  .user-name {
    display: none;
  }

  .nav-item {
    padding: 0 6px;
    gap: 0;
  }

  .user-info {
    padding: 4px 6px;
    gap: 6px;
  }

  .user-avatar {
    width: 36px !important;
    height: 36px !important;
  }
}

</style>



