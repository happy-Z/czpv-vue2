import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale' //
import en from 'element-ui/lib/locale/lang/en' //
import zhCN from 'element-ui/lib/locale/lang/zh-CN' //
import mavonEditor from 'mavon-editor'



import http from './utils/request'
import common from './utils/common'
import constant from './utils/constant'
//引入js
//import './utils/live2d'
import './utils/title'
import './utils/fuckf12'
//引入css
import './assets/css/animation.css'
import './assets/css/index.css'
import './assets/css/tocbot.css'
import './assets/css/color.css'
import './assets/css/markdown-highlight.css'
// NOTE: Font Awesome CSS 已移除，项目现在统一使用 Iconify 图标库
// import './assets/css/font-awesome.min.css'
import 'mavon-editor/dist/css/index.css'

import {vueBaberrage} from 'vue-baberrage'

Vue.use(ElementUI)
Vue.use(vueBaberrage)
Vue.use(mavonEditor)

Vue.prototype.$http = http
Vue.prototype.$common = common
Vue.prototype.$constant = constant
Vue.config.productionTip = false

// 全局快捷键支持
const app = new Vue({
  router,
  store,
  render: h => h(App)
});

// Ctrl+K 全局快捷键 - 打开搜索页面
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    // 导航到搜索页面
    if (app.$route.path !== '/search') {
      app.$router.push('/search');
    }
    // 聚焦搜索框
    app.$nextTick(() => {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
      }
    });
  }
});

app.$mount('#app')

export function useEn() {
  locale.use(en)
}

export function useZh() {
  locale.use(zhCN)
}
