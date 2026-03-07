import Vue from 'vue'
import VueRouter from 'vue-router'
// 建议：确保 404 组件路径正确
import NotFound from '@/components/404.vue';

// 1. 解决 Vue Router 3.1+ 重复点击路由报错的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}


Vue.use(VueRouter)


const routes = [
  // --- 前台路由区域 ---
  {
    path: '/',
    component: () => import(/* webpackChunkName: "layout" */ '../components/home'),
    children: [
      {
        path: "/",
        name: "index",
        meta: { title: '首页' },
        component: () => import(/* webpackChunkName: "front-core" */ '../components/index')
      },
      {
        path: "sort",
        name: "sort",
        meta: { title: '归档' },
        component: () => import(/* webpackChunkName: "front-core" */ '../components/sort')
      },
      {
        path: "article/:id",
        name: "article",
        meta: { title: '文章详情' },
        component: () => import(/* webpackChunkName: "front-content" */ '../components/article')
      },
      {
        path: "weiYan",
        name: "weiYan",
        meta: { title: '微言' },
        component: () => import(/* webpackChunkName: "front-extra" */ '../components/weiYan')
      },
      {
        path: "jotting",
        name: "jotting",
        meta: { title: '随笔' },
        component: () => import(/* webpackChunkName: "front-extra" */ '../components/jotting')
      },
      {
        path: "love",
        name: "love",
        meta: { title: 'Love' },
        component: () => import(/* webpackChunkName: "front-extra" */ '../components/love')
      },
      {
        path: "favorite",
        name: "favorite",
        meta: { title: '收藏' },
        component: () => import(/* webpackChunkName: "front-extra" */ '../components/favorite')
      },
      {
        path: "travel",
        name: "travel",
        meta: { title: '旅行' },
        component: () => import(/* webpackChunkName: "front-extra" */ '../components/travel')
      },
      {
        path: "message",
        name: "message",
        meta: { title: '留言板' },
        component: () => import(/* webpackChunkName: "front-extra" */ '../components/message')
      },
      {
        path: "user", // 注意：登录页通常不需要 auth，所以这里没加 requiresAuth
        name: "user",
        meta: { title: '用户/登录' },
        component: () => import(/* webpackChunkName: "front-core" */ '../components/user')
      },
      {
        path: "search",
        name: "search",
        meta: { title: ' ' },
        component: () => import(/* webpackChunkName: "front-core" */ '../components/search')
      }
    ]
  },

  // --- 后台管理路由区域 ---
  {
    path: '/admin',
    // 修正：重定向到完整的子路径
    redirect: '/admin/main',
    // 只有进入 admin 及其子路由才需要鉴权
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "admin-layout" */ '../components/admin/admin'),
    children: [
      // 修正：去掉 path 前面的 '/'，让 url 变成 /admin/main
      // 优化：使用 webpackChunkName 将所有 admin 组件打包在一起，减少请求碎片
      {
        path: 'main',
        name: 'main',
        meta: { title: '后台概览' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/main')
      },
      {
        path: 'webEdit',
        name: 'webEdit',
        meta: { title: '网站编辑' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/webEdit')
      },
      {
        path: 'userList',
        name: 'userList',
        meta: { title: '用户列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/userList')
      },
      {
        path: 'postList',
        name: 'postList',
        meta: { title: '文章列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/postList')
      },
      {
        path: 'postEdit',
        name: 'postEdit',
        meta: { title: '文章编辑' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/postEdit')
      },
      {
        path: 'sortList',
        name: 'sortList',
        meta: { title: '分类列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/sortList')
      },
      {
        path: 'configList',
        name: 'configList',
        meta: { title: '配置列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/configList')
      },
      {
        path: 'commentList',
        name: 'commentList',
        meta: { title: '评论列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/commentList')
      },
      {
        path: 'treeHoleList',
        name: 'treeHoleList',
        meta: { title: '树洞列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/treeHoleList')
      },
      {
        path: 'resourceList',
        name: 'resourceList',
        meta: { title: '资源列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/resourceList')
      },
      {
        path: 'loveList',
        name: 'loveList',
        meta: { title: 'Love列表' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/loveList')
      },
      {
        path: 'resourcePathList',
        name: 'resourcePathList',
        meta: { title: '资源路径' },
        component: () => import(/* webpackChunkName: "admin-group" */ '../components/admin/resourcePathList')
      }
    ]
  },

  // --- 404 路由 ---
  {
    path: '*',
    name: 'NotFound',
    meta: { title: '404 Not Found' },
    component: NotFound,
  }
]

const router = new VueRouter({
  mode: "history",
  routes: routes,
  // 2. 优化滚动行为：点击浏览器后退时回到上次位置，否则回到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.afterEach((to) => {
  // 延迟执行，确保页面标题 (document.title) 已经改变，统计到的数据更准确
  setTimeout(() => {
    if (window.trackPageView) {
      window.trackPageView(to.fullPath);
    }
  }, 500);
});
// 3. 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置网页标题
  if (to.meta.title) {
    // 你可以修改 'MyBlog' 为你网站的实际名称
    document.title = `${to.meta.title} - CPZ-V'Blog-Learning makes me happy`;
  } else {
    document.title = 'MyBlog';
  }

  const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin') || "null");
  const adminToken = localStorage.getItem('adminToken');
  const needsAdmin = to.matched.some(record => record.meta.requiresAuth);

  if (needsAdmin) {
    // 只有 Token 和 Admin 对象同时存在，才视为已登录
    if (adminToken && currentAdmin) {
      next();
    } else {
      alert("权限不足，请先以管理员身份登录");
      // 这里的 'user' 必须对应你路由配置中登录页的 name
      next({
        name: 'user',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});

export default router
