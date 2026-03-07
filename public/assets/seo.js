
/**
 * SEO & 统计整合脚本
 * 功能：百度统计、Google Analytics、百度链接自动提交
 */

// 1. 配置区域 - 请替换为你自己的 ID
const SEO_CONFIG = {
  baiduId: '773e00dd4d751c476d3357d939cbe46d',
  googleId: 'G-Z7EEL8SW7F', // 如果不用 Google 可以删掉相关逻辑
  enabled: window.location.hostname !== 'localhost' // 开发环境不统计
};

// 2. 初始化百度统计脚本
if (SEO_CONFIG.enabled && SEO_CONFIG.baiduId) {
  window._hmt = window._hmt || [];
  (function() {
    const hm = document.createElement("script");
    hm.src = `https://hm.baidu.com/hm.js?${SEO_CONFIG.baiduId}`;
    hm.async = true;
    const s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
}

// 3. 初始化 Google Analytics (可选)
if (SEO_CONFIG.enabled && SEO_CONFIG.googleId) {
  (function() {
    const gtagScript = document.createElement('script');
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${SEO_CONFIG.googleId}`;
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', SEO_CONFIG.googleId);
  })();
}

// 4. 百度搜索资源平台 - 自动推送脚本 (SEO 关键)
// 作用：用户每访问一次页面，都会自动向百度提交当前 URL
(function() {
  if (!SEO_CONFIG.enabled) return;
  const bp = document.createElement('script');
  const curProtocol = window.location.protocol.split(':')[0];
  if (curProtocol === 'https') {
    bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
  } else {
    bp.src = 'http://push.zhanzhang.baidu.com/push.js';
  }
  const s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
})();

/**
 * 5. 导出供 Vue Router 调用的手动推送方法
 * 解决 SPA 页面切换不统计的问题
 */
window.trackPageView = function(path) {
  if (!SEO_CONFIG.enabled) return;

  // 百度统计推送
  if (window._hmt) {
    window._hmt.push(['_trackPageview', path]);
  }

  // Google 统计推送
  if (window.gtag) {
    window.gtag('config', SEO_CONFIG.googleId, { 'page_path': path });
  }
};
