const fs = require('fs');
const path = require('path');

/**
 * 配置区域
 */
const BASE_URL = 'https://czpv.top'; // 你的网站域名
const API_URL = 'https://czpv.top/article/listArticle';
//本地版本
const OUTPUT_PATH = path.join(__dirname, 'public', 'sitemap.xml');

// 静态路由列表
const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/sort', changefreq: 'weekly', priority: 0.8 },
  { url: '/weiYan', changefreq: 'weekly', priority: 0.7 },
  { url: '/jotting', changefreq: 'weekly', priority: 0.7 },
  { url: '/travel', changefreq: 'monthly', priority: 0.6 },
  { url: '/message', changefreq: 'weekly', priority: 0.6 },
  { url: '/favorite', changefreq: 'monthly', priority: 0.5 },
  { url: '/user', changefreq: 'monthly', priority: 0.3 },
];

/**
 * 从接口获取所有文章数据
 */
async function fetchArticles() {
  console.log('正在从后端接口获取文章列表...');

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
      "Referer": "https://czpv.top/"
    },
    // 将 size 设置为 999 确保获取所有文章
    body: JSON.stringify({
      current: 1,
      size: 999,
      total: 0,
      searchKey: "",
      sortId: null,
      articleSearch: ""
    })
  });

  const resData = await response.json();

  // 根据常见的后端结构 (MyBatis-Plus 等)，数据通常在 data.records 中
  // 如果你的结构不同，请根据控制台打印的结果调整此处
  if (resData.code === 200 || resData.data) {
    return resData.data.records || [];
  } else {
    throw new Error('接口返回数据异常: ' + JSON.stringify(resData));
  }
}

/**
 * 生成 XML 字符串
 */
function buildXml(routes) {
  const urlTags = routes.map(route => `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
    <changefreq>${route.changefreq || 'monthly'}</changefreq>
    <priority>${route.priority || 0.5}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;
}

/**
 * 主执行函数
 */
async function main() {
  try {
    // 1. 获取动态文章
    const articles = await fetchArticles();
    console.log(`成功获取到 ${articles.length} 篇文章`);

    const dynamicRoutes = articles.map(article => ({
      url: `/article/${article.id}`,
      // 假设接口返回了 updateTime 字段，如果没有则删掉这一行
      lastmod: article.updateTime ? article.updateTime.split(' ')[0] : null,
      changefreq: 'monthly',
      priority: 0.8
    }));

    // 2. 合并路由
    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    // 3. 写入文件
    const xmlContent = buildXml(allRoutes);

    // 确保 public 目录存在
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_PATH, xmlContent, 'utf8');
    fs.chmodSync(OUTPUT_PATH, '644');
    console.log('✅ Sitemap 生成成功！文件路径: ' + OUTPUT_PATH);

  } catch (err) {
    console.error('❌ 生成失败:', err.message);
  }
}

main();
