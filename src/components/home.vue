<template>
  <div v-if="!$common.isEmpty($store.state.sysConfig)">
    <!-- el过渡动画 -->
    <transition name="el-fade-in-linear">
      <!-- 导航栏 -->
      <div v-show="toolbar.visible || ($common.mobile() || mobile)"
           @mouseenter="hoverEnter = true"
           @mouseleave="hoverEnter = false"
           :class="[{ enter: toolbar.enter }, { hoverEnter: (hoverEnter || this.$route.path === '/favorite' || this.$route.path === '/travel') && !toolbar.enter }]"
           class="toolbar-content myBetween">
        <!-- 网站名称 -->
        <div class="toolbar-title" @click="$router.push({ path: '/' })">
          <div class="czpv-logo"></div>
        <!-- 显示logo 不显示文字
              <h2 class="site-title">
              {{ $store.state.webInfo.webName }}
        </h2> -->
        </div>

        <!-- 手机导航按钮 -->
        <div v-if="$common.mobile() || mobile"
             class="toolbar-mobile-menu"
             @click="toolbarDrawer = !toolbarDrawer"
             :class="{ enter: toolbar.enter }">
          <iconify-icon icon="mdi:menu"></iconify-icon>
        </div>

        <!-- 导航列表 -->
        <div v-else>
          <ul class="scroll-menu">
            <li @click="$router.push({path: '/'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('首页')">
              <div class="my-menu">
                🏡 <span>Home</span>
              </div>
            </li>

            <el-dropdown :hide-timeout="500" placement="bottom" v-if="$store.state.sysConfig['bar.menu.show'].includes('记录')">
              <li>
                <div class="my-menu">
                  📑 <span>Sorts</span>
                </div>
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(sort, index) in sortInfo" :key="index">
                  <div @click="$router.push({path: '/sort', query: {sortId: sort.id}})">
                    {{sort.sortName}}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 家 -->
            <li @click="$router.push({path: '/love'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('家')">
              <div class="my-menu">
                ❤️ <span>Love Story</span>
              </div>
            </li>

            <!-- 随笔 -->
            <li @click="$router.push({path: '/jotting'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('随笔')">
              <div class="my-menu">
                🏖️ <span>随笔</span>
              </div>
            </li>

            <!-- 旅拍 -->
            <li @click="$router.push({path: '/travel'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('旅拍')">
              <div class="my-menu">
                📸 <span>Photo</span>
              </div>
            </li>

            <!-- 百宝箱 -->
            <li @click="$router.push({path: '/favorite'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('百宝箱')">
              <div class="my-menu">
                🧰 <span>BOX</span>
              </div>
            </li>

            <!-- 留言 -->
            <li @click="$router.push({path: '/message'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('留言')">
              <div class="my-menu">
                📪 <span>message</span>
              </div>
            </li>

         <!--    聊天室
            <li @click="goIm()" v-if="$store.state.sysConfig['bar.menu.show'].includes('联系我')">
              <div class="my-menu">
                💬 <span>联系我</span>
              </div>
            </li> -->

            <!-- 后台 -->
            <li @click="goAdmin()" v-if="$store.state.sysConfig['bar.menu.show'].includes('后台')">
              <div class="my-menu">
                💻️ <span>后台</span>
              </div>
            </li>

            <!-- 个人中心 -->
            <li>
              <el-dropdown placement="bottom">
                <el-avatar class="user-avatar" :size="36"
                           style="margin-top: 12px"
                           :src="!$common.isEmpty($store.state.currentAdmin)?$store.state.currentAdmin.avatar:(!$common.isEmpty($store.state.currentUser)?$store.state.currentUser.avatar:$store.state.webInfo.avatar)">
                </el-avatar>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="$router.push({path: '/user'})"
                                    v-if="!$common.isEmpty($store.state.currentUser) || !$common.isEmpty($store.state.currentAdmin)">
                    <iconify-icon icon="mdi:account-circle" aria-hidden="true"></iconify-icon> <span>个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="$router.push({path: '/admin'})"
                    v-if="!$common.isEmpty($store.state.currentAdmin)">
                      <iconify-icon icon="mdi:cog" aria-hidden="true"></iconify-icon> <span style="color: #409EFF; font-weight: bold;">进入后台</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="logout()" v-if="!$common.isEmpty($store.state.currentUser) || !$common.isEmpty($store.state.currentAdmin)">
                    <iconify-icon icon="mdi:logout" aria-hidden="true"></iconify-icon> <span>退出</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="$router.push({path: '/user'})"
                                    v-if="$common.isEmpty($store.state.currentUser) && $common.isEmpty($store.state.currentAdmin)">
                    <iconify-icon icon="mdi:login" aria-hidden="true"></iconify-icon> <span>登陆</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <div id="main-container">
      <router-view></router-view>
    </div>

    <!-- 回到顶部按钮 -->
<!--    <div href="#" class="cd-top" v-if="!$common.mobile()" @click="toTop()"></div>-->

    <div class="toolButton">
      <div id="toc-button" @click="clickTocButton()" v-if="hasToc">
        <iconify-icon icon="mdi:menu" aria-hidden="true"></iconify-icon>
      </div>

      <div class="backTop" v-if="toolButton" @click="toTop()">
        <!-- 回到顶部按钮 -->
        <span class="backTop-rocketWrap" aria-hidden="true">
          <iconify-icon icon="bi:rocket-fill" width="50" height="25" class="backTop-rocket"></iconify-icon>
        </span>
      </div>

      <el-popover placement="left"
                  :close-delay="500"
                  trigger="hover">
        <div slot="reference">
          <iconify-icon icon="mdi:cog" class="iconRotate" :style="{ color: isDark ? 'white' : '#000000' }" aria-hidden="true"></iconify-icon>
        </div>
        <div class="my-setting">
          <div>
            <!-- 太阳按钮 -->
            <iconify-icon v-if="isDark" icon="mdi:white-balance-sunny" class="iconRotate" @click="changeColor()"></iconify-icon>
            <!-- 月亮按钮 -->
            <iconify-icon v-else icon="mdi:moon" aria-hidden="true" @click="changeColor()"></iconify-icon>
          </div>
          <div>
            <i aria-hidden="true" @click="switchLang()"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path fill="currentColor" d="M14.022 7h1a1 1 0 0 1 1 1v1a1 1 0 0 0 2 0V8a3.003 3.003 0 0 0-3-3h-1a1 1 0 0 0 0 2m-4 9h-1a1 1 0 0 1-1-1v-1a1 1 0 0 0-2 0v1a3.003 3.003 0 0 0 3 3h1a1 1 0 0 0 0-2m11-1a1 1 0 0 0 0-2h-3v-.5a1 1 0 0 0-2 0v.5h-3a1 1 0 0 0 0 2h5.184a6.7 6.7 0 0 1-1.225 2.527a6.7 6.7 0 0 1-.63-.983a1 1 0 1 0-1.779.912a8.7 8.7 0 0 0 .96 1.468a6.6 6.6 0 0 1-2.426 1.099a1 1 0 0 0 .427 1.954a8.6 8.6 0 0 0 3.445-1.622a8.7 8.7 0 0 0 3.469 1.622a1 1 0 1 0 .43-1.954a6.7 6.7 0 0 1-2.446-1.09A8.74 8.74 0 0 0 20.244 15Zm-11.97-3.757a1 1 0 0 0 1.94-.486l-1.757-7.03a2.281 2.281 0 0 0-4.426 0l-1.757 7.03a1 1 0 0 0 1.94.486L5.552 9h2.94ZM6.052 7l.698-2.787a.291.291 0 0 1 .544 0L7.991 7Z"/></svg></i>
          </div>
        </div>
      </el-popover>
    </div>


    <!-- 图片预览 -->
    <div id="outerImg">
      <div id="innerImg" style="position:absolute">
        <img id="bigImg" src=""/>
      </div>
    </div>

<!-- 移动端 dock 栏 -->
    <div v-if="mobile && showDock" class="mobile-dock">
      <div class="dock-container">
        <div v-for="(item, index) in dockItems"
             :key="index"
             class="dock-item"
             @click="navigateToDock(item)">
          <div class="dock-icon">{{ item.icon }}</div>
          <div class="dock-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <el-drawer :visible.sync="toolbarDrawer"
               :show-close="false"
               size="65%"
               custom-class="toolbarDrawer"
               title="CZPV"
               direction="ltr">
      <div>
        <ul class="small-menu">
          <li @click="smallMenu({path: '/'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('首页')">
            <div>
              🏡 <span>首页</span>
            </div>
          </li>

          <li v-if="$store.state.sysConfig['bar.menu.show'].includes('记录')">
            <div>
              📒 <span>记录</span>
            </div>
            <div>
              <div v-for="(menu, index) in sortInfo"
                   :key="index"
                   class="sortMenu"
                   @click="smallMenu({path: '/sort', query: {sortId: menu.id}})">
                {{menu.sortName}}
              </div>
            </div>
          </li>

          <!-- 家 -->
          <li @click="smallMenu({path: '/love'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('家')">
            <div>
              ❤️ <span>LOVE</span>
            </div>
          </li>

          <!-- 随笔 -->
          <li @click="smallMenu({path: '/jotting'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('随笔')">
            <div>
              🏖️ <span>随笔</span>
            </div>
          </li>

          <!-- 旅拍 -->
          <li @click="smallMenu({path: '/travel'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('旅拍')">
            <div>
              📸 <span>旅拍</span>
            </div>
          </li>

          <!-- 百宝箱 -->
          <li @click="smallMenu({path: '/favorite'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('百宝箱')">
            <div>
              🧰 <span>BOX</span>
            </div>
          </li>

          <!-- 留言 -->
          <li @click="smallMenu({path: '/message'})" v-if="$store.state.sysConfig['bar.menu.show'].includes('留言')">
            <div>
              📪 <span>留言</span>
            </div>
          </li>

          <!-- 聊天室 -->
          <!-- <li @click="goIm()" v-if="$store.state.sysConfig['bar.menu.show'].includes('联系我')">
            <div>
              💬 <span>联系我</span>
            </div>
          </li> -->

          <!-- 后台 -->
          <li @click="goAdmin()" v-if="$store.state.sysConfig['bar.menu.show'].includes('后台')">
            <div>
              💻️ <span>后台</span>
            </div>
          </li>

          <template v-if="$common.isEmpty($store.state.currentUser) && $common.isEmpty($store.state.currentAdmin)">
            <li @click="smallMenu({path: '/user'})">
              <div>
                <iconify-icon icon="mdi:login" aria-hidden="true"></iconify-icon>
                <span>&nbsp;登录</span>
              </div>
            </li>
          </template>
          <template v-else>
            <li @click="smallMenu({path: '/user'})">
              <div>
                <iconify-icon icon="mdi:account-circle" aria-hidden="true"></iconify-icon>
                <span>&nbsp;个人中心</span>
              </div>
            </li>
            <li v-if="!$common.isEmpty($store.state.currentAdmin)"
              @click="smallMenu({path: '/admin'})">
            <div>
              <iconify-icon icon="mdi:cog" aria-hidden="true"></iconify-icon>
              <span style="color: #409EFF; font-weight: bold;">&nbsp;后台管理</span>
            </div>
            </li>
            <li @click="smallMenuLogout()">
              <div>
                <iconify-icon icon="mdi:logout" aria-hidden="true"></iconify-icon>
                <span>&nbsp;退出</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import { useEn, useZh } from '../main';

  export default {
    data() {
      return {
        toolButton: false,
        hoverEnter: false,
        mouseAnimation: false,
        isDark: false,
        scrollTop: 0,
        toolbarDrawer: false,
        mobile: false,
        sunsetTime: null,
        sunriseTime: null,
        currentLang: 'zh',
        showDock: true,
        dockItems: [
          { icon: '📚', label: '首页', path: '/', name: '首页' },
          { icon: '📑', label: '文章', path: '/sort', name: '记录' },
          { icon: '🧍', label: '个人中心', path: '/user', name: '个人中心' }
        ]
      }
    },
    mounted() {
      this.$notify.info({
        title: 'CZPV',
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: '<div><a style="text-decoration: underline;color: #ff416c" href="https://czpv.top">CZPV - 热爱并且分享着</a></div>',
        duration: 3000
      });

      // 从本地存储恢复语言设置
      const savedLang = localStorage.getItem('currentLang');
      if (savedLang) {
        this.currentLang = savedLang;
        if (savedLang === 'en') {
          useEn();
        } else {
          useZh();
        }
      }

      // 获取日出日落时间（自动初始化黑夜模式）
      this.fetchSunsetSunriseTime();

      if (this.mouseAnimation) {
        mousedown();
      }
      window.addEventListener("scroll", this.onScrollPage);
      if (this.isDaylight()) {
        this.isDark = true;
        let root = document.querySelector(":root");
        root.style.setProperty("--background", "#272727");
        root.style.setProperty("--fontColor", "white");
        root.style.setProperty("--borderColor", "#4F4F4F");
        root.style.setProperty("--borderHoverColor", "black");
        root.style.setProperty("--articleFontColor", "#E4E4E4");
        root.style.setProperty("--articleGreyFontColor", "#D4D4D4");
        root.style.setProperty("--commentContent", "#D4D4D4");
        root.style.setProperty("--favoriteBg", "#1e1e1e");
      }
    },
    destroyed() {
      window.removeEventListener("scroll", this.onScrollPage);
    },
    watch: {
      scrollTop(scrollTop, oldScrollTop) {
        //如果滑动距离超过屏幕高度三分之一视为进入页面，背景改为白色
        let enter = scrollTop > window.innerHeight / 2;
        const top = scrollTop - oldScrollTop < 0;
        let isShow = scrollTop - window.innerHeight > 30;
        this.toolButton = isShow;

        // 检测是否滚动到底部，隐藏 dock 栏
        if (this.mobile) {
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;
          const remainingHeight = scrollHeight - scrollTop - clientHeight;
          // 当剩余高度小于 100px 时，隐藏 dock 栏
          this.showDock = remainingHeight > 100;
        }
        if (isShow && !this.$common.mobile()) {
          if (window.innerHeight > 950) {
            $(".cd-top").css("top", "0");
          } else {
            $(".cd-top").css("top", window.innerHeight - 950 + "px");
          }
        } else if (!isShow && !this.$common.mobile()) {
          $(".cd-top").css("top", "-900px");
        }

        //导航栏显示与颜色
        let toolbarStatus = {
          enter: enter,
          visible: top,
        };
        this.$store.commit("changeToolbarStatus", toolbarStatus);
      },
    },
    created() {
      let toolbarStatus = {
        enter: false,
        visible: true,
      };
      this.$store.commit("changeToolbarStatus", toolbarStatus);
      this.getWebInfo();
      this.getSysConfig();
      this.getSortInfo();

      this.mobile = document.body.clientWidth < 1100;

      window.addEventListener('resize', () => {
        let docWidth = document.body.clientWidth;
        if (docWidth < 920) {
          this.mobile = true;
        } else {
          this.mobile = false;
        }
      });
    },
    computed: {
      toolbar() {
        return this.$store.state.toolbar;
      },
      sortInfo() {
        return this.$store.state.sortInfo;
      },
      hasToc() {
        return this.$route.name === 'article';
      }
    },
    methods: {
      smallMenu(data) {
        this.$router.push(data)
        this.toolbarDrawer = false;
      },
      onLogoError() {
      this.showLogo = false
      },
      smallMenuLogout() {
        this.logout();
        this.toolbarDrawer = false;
      },

      goIm() {
        if (this.$common.isEmpty(this.$store.state.currentUser)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
        } else {
          let userToken = this.$common.encrypt(localStorage.getItem("userToken"));
          window.open(this.$constant.imBaseURL + "?userToken=" + userToken + "&defaultStoreType=" + localStorage.getItem("defaultStoreType"));
        }
      },

      goAdmin() {
        window.open(this.$constant.webURL + "/admin");
      },

      logout() {
        this.$http.get(this.$constant.baseURL + "/user/logout")
          .then((res) => {
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
        this.$store.commit("loadCurrentUser", {});
        this.$store.commit("loadCurrentAdmin", {});
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminToken");
        this.$router.push({path: '/'});
      },
      getWebInfo() {
        this.$http.get(this.$constant.baseURL + "/webInfo/getWebInfo")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.$store.commit("loadWebInfo", res.data);
              localStorage.setItem("defaultStoreType", res.data.defaultStoreType);
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      getSysConfig() {
        this.$http.get(this.$constant.baseURL + "/sysConfig/listSysConfig")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.$store.commit("loadSysConfig", res.data);
              this.buildCssPicture();
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      buildCssPicture() {
        let root = document.querySelector(":root");
        let webStaticResourcePrefix = this.$store.state.sysConfig['webStaticResourcePrefix'];
        root.style.setProperty("--commentURL", "url(" + webStaticResourcePrefix + "assets/commentURL.png)");
        root.style.setProperty("--springBg", "url(" + webStaticResourcePrefix + "assets/springBg.png)");
        root.style.setProperty("--admireImage", "url(" + webStaticResourcePrefix + "assets/admireImage.jpg)");
        root.style.setProperty("--toTop", "url(" + webStaticResourcePrefix + "assets/toTop.png)");
        root.style.setProperty("--bannerWave1", "url(" + webStaticResourcePrefix + "assets/bannerWave1.png) repeat-x");
        root.style.setProperty("--bannerWave2", "url(" + webStaticResourcePrefix + "assets/bannerWave2.png) repeat-x");
        root.style.setProperty("--backgroundPicture", "url(" + webStaticResourcePrefix + "assets/backgroundPicture.jpg)");
        root.style.setProperty("--toolbar", "url(" + webStaticResourcePrefix + "assets/toolbar.jpg)");
        root.style.setProperty("--love", "url(" + webStaticResourcePrefix + "assets/love.jpg)");
        root.style.setProperty("--czpv", "url(" + webStaticResourcePrefix + "webAvatar/czpv11769588373307995.png)");
      },
      getSortInfo() {
        this.$http.get(this.$constant.baseURL + "/webInfo/getSortInfo")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.$store.commit("loadSortInfo", res.data);
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      changeColor() {
        this.isDark = !this.isDark;
        this.applyTheme();
      },
      applyTheme() {
        let root = document.querySelector(":root");

        if (this.isDark) {
          root.style.setProperty("--background", "#272727");
          root.style.setProperty("--fontColor", "white");
          root.style.setProperty("--borderColor", "#4F4F4F");
          root.style.setProperty("--borderHoverColor", "black");
          root.style.setProperty("--articleFontColor", "#E4E4E4");
          root.style.setProperty("--articleGreyFontColor", "#D4D4D4");
          root.style.setProperty("--commentContent", "#D4D4D4");
          root.style.setProperty("--favoriteBg", "#1e1e1e");
          root.style.setProperty("--descGradientColor", "rgba(30, 30, 30, 0.95)");
        } else {
          root.style.setProperty("--background", "white");
          root.style.setProperty("--fontColor", "black");
          root.style.setProperty("--borderColor", "rgba(0, 0, 0, 0.5)");
          root.style.setProperty("--borderHoverColor", "rgba(110, 110, 110, 0.4)");
          root.style.setProperty("--articleFontColor", "#1F1F1F");
          root.style.setProperty("--articleGreyFontColor", "#616161");
          root.style.setProperty("--commentContent", "#F7F9FE");
          root.style.setProperty("--favoriteBg", "#f7f9fe");
          root.style.setProperty("--descGradientColor", "rgba(255, 255, 255, 0.9)");
        }
      },
      toTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      },
      onScrollPage() {
        this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      },
      isDaylight() {
        let currDate = new Date();
        // 如果已获取到日落时间，则根据日落时间判断
        if (this.sunsetTime) {
          return currDate.getTime() > this.sunsetTime.getTime();
        }
        // 备用方案：根据小时判断（夜间：22点至次天7点）
        if (currDate.getHours() > 22 || currDate.getHours() < 7) {
          return true;
        } else {
          return false;
        }
      },
      // 获取当地日落和日出时间
      async fetchSunsetSunriseTime() {
        try {
          // 使用浏览器地理定位API获取用户位置
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                await this.getSunsetSunriseFromAPI(latitude, longitude);
              },
              (error) => {
                console.log('地理定位失败，使用默认时间判断', error);
              }
            );
          }
        } catch (error) {
          console.log('获取日落时间失败:', error);
        }
      },
      // 从API获取日出日落时间
      async getSunsetSunriseFromAPI(latitude, longitude) {
        try {
          // 使用 Open-Meteo API（免费，无需密钥）
          const today = new Date().toISOString().split('T')[0];
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto&date=${today}`
          );
          const data = await response.json();

          if (data.daily && data.daily.sunrise && data.daily.sunset) {
            const sunriseStr = data.daily.sunrise[0]; // 格式: "2024-01-23T07:15"
            const sunsetStr = data.daily.sunset[0];   // 格式: "2024-01-23T17:45"

            this.sunriseTime = new Date(sunriseStr);
            this.sunsetTime = new Date(sunsetStr);

            // 初始化主题
            this.initializeThemeByTime();

            console.log('获取日出日落时间成功', {
              sunrise: this.sunriseTime,
              sunset: this.sunsetTime
            });
          }
        } catch (error) {
          console.log('从API获取日落时间失败:', error);
        }
      },
      // 根据当前时间初始化主题
      initializeThemeByTime() {
        const now = new Date();
        // 如果当前时间在日落时间之后或日出时间之前，启用黑暗模式
        if (now.getTime() > this.sunsetTime.getTime() || now.getTime() < this.sunriseTime.getTime()) {
          this.isDark = true;
        } else {
          this.isDark = false;
        }
        this.applyTheme();
      },
      clickTocButton() {
        let display = $(".toc");
        if ("none" === display.css("display")) {
          display.css("display", "unset");
        } else {
          display.css("display", "none");
        }
      },
      switchLang() {
        // 切换语言状态
        if (this.currentLang === 'zh') {
          this.currentLang = 'en';
          useEn();
        } else {
          this.currentLang = 'zh';
          useZh();
        }
        // 保存语言设置到本地存储
        localStorage.setItem('currentLang', this.currentLang);
        // 显示切换提示
        this.$message({
          message: this.currentLang === 'en' ? 'Language switched to English' : '语言已切换为中文',
          type: 'success',
          duration: 1500
        });
      },
      navigateToDock(item) {
        this.$router.push({ path: item.path });
      }
    }
  }
</script>

<style scoped>
  .czpv-logo {
    display: flex;
    width: 200px;
    height: 50px;
    background-image: var(--czpv);
    background-size: contain;
    background-repeat: no-repeat;
  }
  .toolbar-content {
    width: 100%;
    height: 60px;
    color: var(--white);
    /* 固定位置，不随滚动条滚动 */
    position: fixed;
    z-index: 100;
    /* 禁止选中文字 */
    user-select: none;
    transition: all 0.3s ease-in-out;
  }

  .toolbar-content.enter {
    background: var(--toolbarBackground);
    color: var(--toolbarFont);
    box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
  }

  .toolbar-content.hoverEnter {
    background: var(--translucent);
    box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
  }

  .toolbar-title {
    margin-left: 30px;
    cursor: pointer;
  }

  .toolbar-mobile-menu {
    font-size: 30px;
    margin-right: 15px;
    cursor: pointer;
  }

  .scroll-menu {
    margin: 0 25px 0 0;
    display: flex;
    justify-content: flex-end;
    padding: 0;
  }

  .scroll-menu li {
    list-style: none;
    margin: 0 8px;
    font-size: 17px;
    height: 60px;
    line-height: 60px;
    position: relative;
    cursor: pointer;
  }

  .scroll-menu li:hover .my-menu span {
    color: var(--themeBackground);
  }

  .scroll-menu li:hover .my-menu i {
    color: var(--themeBackground);
    animation: scale 1.5s ease-in-out infinite;
  }

  .scroll-menu li .my-menu:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    height: 6px;
    background-color: var(--themeBackground);
    width: 100%;
    max-width: 0;
    transition: max-width 0.25s ease-in-out;
  }

  .scroll-menu li:hover .my-menu:after {
    max-width: 100%;
  }

  .sortMenu {
    margin-left: 44px;
    font-size: 17px;
    position: relative;
  }

  .sortMenu:after {
    top: 32px;
    width: 35px;
    left: 0;
    height: 2px;
    background: var(--themeBackground);
    content: "";
    border-radius: 1px;
    position: absolute;
  }

  .el-dropdown {
    font-size: unset;
    color: unset;
  }

  .el-popper[x-placement^=bottom] {
    margin-top: -8px;
  }

  .el-dropdown-menu {
    padding: 5px 0;
  }

  .el-dropdown-menu__item {
    font-size: unset;
  }

  .el-dropdown-menu__item:hover {
    background-color: var(--white);
    color: var(--themeBackground);
  }

  .toolButton {
    position: fixed;
    right: 3vh;
    bottom: 3vh;
    animation: slide-bottom 0.5s ease-in-out both;
    z-index: 100;
    cursor: pointer;
    font-size: 25px;
    width: 30px;
  }

  #toc-button {
    animation: slide-bottom 0.5s ease-in-out both;
    cursor: pointer;
    font-size: 23px;
    width: 30px;
    margin-bottom: 4px;
  }

  #toc-button:hover {
    color: var(--themeBackground);
  }

  .my-setting {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    cursor: pointer;
    font-size: 20px;
  }

  .my-setting i {
    padding: 5px;
  }

  .my-setting i:hover {
    color: var(--themeBackground);
  }

  .cd-top {
    background: var(--toTop) no-repeat center;
    position: fixed;
    right: 5vh;
    top: -900px;
    z-index: 99;
    width: 70px;
    height: 900px;
    background-size: contain;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
  }

  .backTop {
    transition: all 0.3s ease-in;
    position: relative;
    top: 0;
    left: -13px;
    margin-bottom: 2px;
  }

  .backTop-rocketWrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .backTop-rocketWrap::after {
    content: "";
    position: absolute;
    left: 35px;
    top: 100%;
    width: 5px;
    height: 15px;
    border-radius: 999px 40% 40% 999px;
    background: linear-gradient(90deg, rgba(255, 189, 89, 0) 0%, #F5DF4D 40%,#EF794F 100%);
    filter: blur(1px);
    transform: translate(70%, -50%) rotate(-12deg);
    transform-origin: right center;
    animation: rocket-flame 0.45s ease-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .backTop:hover {
    top: -10px;
  }

  .backTop-rocket {
    display: block;
    transform-origin: center center;
    position: relative;
    z-index: 1;
    animation: rocket-sprint 1.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
    will-change: transform;
    pointer-events: none;
  }

  @keyframes rocket-sprint {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(-18deg) scale(1);
    }
    20% {
      transform: translate3d(2px, -3px, 0) rotate(-14deg) scale(1.03);
    }
    45% {
      transform: translate3d(5px, -8px, 0) rotate(-9deg) scale(1.07);
    }
    65% {
      transform: translate3d(3px, -5px, 0) rotate(-12deg) scale(1.04);
    }
    80% {
      transform: translate3d(1px, -2px, 0) rotate(-16deg) scale(1.01);
    }
  }

  @keyframes rocket-flame {
    0%, 100% {
      opacity: 0.5;
      transform: translate(-68%, -50%) rotate(-12deg) scaleX(0.9) scaleY(0.85);
    }
    35% {
      opacity: 0.95;
      transform: translate(-68%, -50%) rotate(-12deg) scaleX(1.35) scaleY(1.1);
    }
    70% {
      opacity: 0.7;
      transform: translate(-68%, -50%) rotate(-12deg) scaleX(1.1) scaleY(0.95);
    }
  }

  #outerImg {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
    width: 100%;
    height: 100%;
    display: none;
  }

  @media screen and (max-width: 400px) {
    .toolButton {
      right: 0.5vh;
    }
  }

  /* 移动端 dock 栏样式 */
  .mobile-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    padding: 0;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(80px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(80px);
      opacity: 0;
    }
  }

  .dock-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 12px 16px 20px 16px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px 20px 0 0;
    width: 100%;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .dock-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 16px;
    transition: all 0.3s ease;
    flex: 1;
    max-width: 70px;
    user-select: none;
  }

  .dock-item:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.25);
  }

  .dock-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
  }

  .dock-icon {
    font-size: 24px;
    margin-bottom: 4px;
    transition: all 0.3s ease;
  }

  .dock-item:hover .dock-icon {
    font-size: 28px;
  }

  .dock-label {
    font-size: 12px;
    color: var(--fontColor);
    font-weight: 500;
    white-space: nowrap;
  }



</style>



