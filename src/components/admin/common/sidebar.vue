<template>
  <div class="sidebar">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapse()">
      <iconify-icon icon="mdi:menu"></iconify-icon>
      <span v-if="!isCollapse">折叠</span>
    </div>

    <!-- 菜单 -->
    <el-menu class="sidebar-el-menu"
             background-color="transparent"
             text-color="#606266"
             active-text-color="#fff"
             unique-opened
             :default-active="$router.currentRoute.path"
             router>
      <template v-for="item in items">
        <template v-if="isBoss || !item.isBoss">
          <!-- 有子菜单的项 -->
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index" class="menu-submenu">
              <template slot="title">
                <i :class="item.icon" class="menu-icon"></i>
                <span class="menu-title">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <!-- 三级菜单 -->
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index" class="menu-submenu-child">
                  <template slot="title">
                    {{ subItem.title }}
                  </template>
                  <el-menu-item v-for="threeItem in subItem.subs" :key="threeItem.index" :index="threeItem.index" class="menu-item-child">
                    {{ threeItem.title }}
                  </el-menu-item>
                </el-submenu>
                <!-- 二级菜单项 -->
                <el-menu-item v-else :index="subItem.index" :key="subItem.index" class="menu-item-child">
                  {{ subItem.title }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <!-- 无子菜单的项 -->
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index" class="menu-item">
              <i :class="item.icon" class="menu-icon"></i>
              <span class="menu-title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isCollapse: this.$common.mobile(),
        isBoss: this.$store.state.currentAdmin.isBoss,
        items: [{
          icon: "mdi:home",
          index: "main",
          title: "系统首页",
          isBoss: true
        }, {
          icon: "mdi:wrench",
          index: "webEdit",
          title: "网站设置",
          isBoss: true
        }, {
          icon: "mdi:account",
          index: "userList",
          title: "用户管理",
          isBoss: true
        }, {
          icon: "mdi:card",
          index: "postList",
          title: "文章管理",
          isBoss: false
        }, {
          icon: "mdi:notebook",
          index: "sortList",
          title: "分类管理",
          isBoss: true
        }, {
          icon: "mdi:notebook",
          index: "configList",
          title: "配置管理",
          isBoss: true
        }, {
          icon: "mdi:pencil",
          index: "commentList",
          title: "评论管理",
          isBoss: false
        }, {
          icon: "mdi:comment",
          index: "treeHoleList",
          title: "留言管理",
          isBoss: true
        }, {
          icon: "mdi:paperclip",
          index: "resourceList",
          title: "资源管理",
          isBoss: true
        }, {
          icon: "mdi:credit-card",
          index: "resourcePathList",
          title: "资源聚合",
          isBoss: true
        }, {
          icon: "mdi:heart",
          index: "loveList",
          title: "表白墙",
          isBoss: true
        }]
      }
    },

    computed: {},

    watch: {},

    created() {

    },

    mounted() {
      this.collapse();
    },

    methods: {
      collapse() {
        if (this.isCollapse) {
          $(".sidebar").css("width", "44px");
          $(".content-box").css("left", "44px");
        } else {
          $(".sidebar").css("width", "130px");
          $(".content-box").css("left", "130px");
        }
        this.isCollapse = !this.isCollapse;
      }
    }
  }
</script>

<style scoped>

/* ========== 侧边栏基础样式 ========== */
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  width: 130px;
  user-select: none;
  overflow-x: hidden;
  background: linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  transition: width 0.3s ease;
  box-sizing: border-box;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.6);
}

.sidebar > ul {
  height: 100%;
}

/* ========== 折叠按钮 ========== */
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 10px;
  height: 44px;
  cursor: pointer;
  color: #606266;
  font-size: 15px;
  font-weight: 500;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-bottom: 2px solid #e8ecf1;
  transition: all 0.3s ease;
  user-select: none;
}

.collapse-btn:hover {
  color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.collapse-btn i {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.collapse-btn:hover i {
  transform: scale(1.1);
}

/* ========== 菜单样式 ========== */
.sidebar-el-menu {
  padding: 12px 0;
  border: none !important;
  background: transparent !important;
}

/* 菜单项通用样式 */
.sidebar-el-menu .el-menu-item,
.sidebar-el-menu .el-submenu__title {
  padding: 0 12px !important;
  height: 44px;
  line-height: 44px;
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  color: #606266 !important;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  min-width: 0;
  width: calc(100% - 16px);
  box-sizing: border-box;
}

.sidebar-el-menu .el-menu-item::before,
.sidebar-el-menu .el-submenu__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 一级菜单项 */
.menu-item {
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.menu-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%) !important;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.12) !important;
  transform: translateX(2px);
}

.sidebar-el-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.sidebar-el-menu .el-menu-item.is-active::before {
  opacity: 1;
}

/* 一级子菜单 */
.menu-submenu .el-submenu__title {
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.menu-submenu .el-submenu__title:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%) !important;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.12) !important;
  transform: translateX(2px);
}

.sidebar-el-menu .el-submenu.is-active > .el-submenu__title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.sidebar-el-menu .el-submenu.is-active > .el-submenu__title::before {
  opacity: 1;
}

/* 菜单图标 */
.menu-icon {
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.sidebar-el-menu .el-menu-item:hover .menu-icon,
.sidebar-el-menu .el-submenu__title:hover .menu-icon {
  color: #667eea;
  transform: scale(1.1);
}

.sidebar-el-menu .el-menu-item.is-active .menu-icon,
.sidebar-el-menu .el-submenu.is-active > .el-submenu__title .menu-icon {
  color: white;
}

/* 菜单标题 */
.menu-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 二级菜单 ========== */
.sidebar-el-menu .el-menu {
  background: transparent !important;
  border: none !important;
}

.menu-item-child {
  padding: 0 24px !important;
  color: #888 !important;
  font-size: 13px;
  background: transparent !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.menu-item-child:hover {
  color: #667eea !important;
  background: rgba(102, 126, 234, 0.05) !important;
  padding-left: 28px !important;
}

.sidebar-el-menu .el-menu-item.is-active.menu-item-child {
  color: #667eea !important;
  background: rgba(102, 126, 234, 0.1) !important;
  border-radius: 0 !important;
  padding-left: 28px !important;
}

/* ========== 三级菜单 ========== */
.menu-submenu-child .el-submenu__title {
  padding: 0 24px !important;
  color: #888 !important;
  font-size: 13px;
  background: transparent !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.menu-submenu-child .el-submenu__title:hover {
  color: #667eea !important;
  background: rgba(102, 126, 234, 0.05) !important;
}

.sidebar-el-menu .el-submenu.is-active.menu-submenu-child > .el-submenu__title {
  color: #667eea !important;
  background: rgba(102, 126, 234, 0.1) !important;
  border-radius: 0 !important;
}

/* ========== 展开/收起箭头 ========== */
.sidebar-el-menu .el-submenu__icon-arrow {
  transition: transform 0.3s ease;
  color: currentColor;
}

/* ========== 响应式设计 ========== */
@media screen and (max-width: 800px) {
  .sidebar {
    width: 44px;
  }

  .collapse-btn span {
    display: none;
  }

  .menu-title {
    display: none;
  }

  .menu-icon {
    margin: 0 !important;
  }

  .sidebar-el-menu .el-menu-item,
  .sidebar-el-menu .el-submenu__title {
    padding: 0 !important;
    justify-content: center;
    width: 44px;
    margin: 4px 0 !important;
    border-radius: 0 !important;
  }
}

/* ========== 折叠状态下的菜单修复 ========== */
.sidebar[style*="width: 44px"] .sidebar-el-menu .el-menu-item,
.sidebar[style*="width: 44px"] .sidebar-el-menu .el-submenu__title {
  width: 44px;
  padding: 0 !important;
  margin: 4px 0 !important;
  justify-content: center;
  border-radius: 0 !important;
}

.sidebar[style*="width: 44px"] .menu-title {
  display: none !important;
}

.sidebar[style*="width: 44px"] .menu-icon {
  margin: 0 !important;
}

.sidebar[style*="width: 44px"] .collapse-btn span {
  display: none !important;
}

/* 折叠时的二级菜单隐藏 */
.sidebar[style*="width: 44px"] .sidebar-el-menu .el-menu {
  display: none !important;
}

.sidebar[style*="width: 44px"] .el-submenu.is-opened .el-menu {
  display: block !important;
  position: absolute;
  left: 44px;
  top: 0;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 1000;
}

</style>




