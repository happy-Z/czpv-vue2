# czpv-ui

一个基于 Vue 2 和 Element UI 的个人博客前端项目，包含博客展示、搜索、留言、归档以及后台管理等功能页面。

## 技术栈

- Vue 2
- Vue Router
- Vuex
- Element UI
- Axios
- mavon-editor

## 功能概览

- 博客首页与文章详情
- 分类归档、收藏、随笔、旅行、留言等内容页
- 站内搜索
- 后台管理页面
- Markdown 编辑支持

## 开发环境

建议使用以下环境：

- Node.js 16 或更高版本
- npm 8 或更高版本

> 项目脚本已内置 `NODE_OPTIONS=--openssl-legacy-provider`，用于兼容部分旧版构建依赖。

## 安装依赖

```bash
npm install
```

## 本地开发

```bash
npm run serve
```

默认开发端口见 [vue.config.js] ，当前配置为 `80`。

## 生产构建

```bash
npm run build
```

构建产物默认输出到 `dist/` 目录。

## 项目结构

```text
.
├─ public/          静态资源
├─ src/
│  ├─ assets/       样式与图片资源
│  ├─ components/   页面与组件
│  ├─ router/       路由配置
│  ├─ store/        状态管理
│  └─ utils/        请求、常量与通用工具
├─ vue.config.js    Vue CLI 配置
└─ package.json     项目依赖与脚本
```

## 接口说明

前端接口地址配置位于 [src/utils/constant.js](https://github.com/happy-Z/czpv-vue2/blob/master/src/utils/constant.js)，构建前建议根据你的部署环境修改 `baseURL`、`webURL` 等配置。

## 开源说明

- 本仓库目前为前端项目。
- 若需完整运行，通常还需要对应的后端服务与接口支持。


## License

本项目采用仓库内的 [LICENSE](https://github.com/happy-Z/czpv-vue2/blob/master/LICENSE) 许可证。
