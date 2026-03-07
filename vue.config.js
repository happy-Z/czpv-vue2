const CompressionPlugin = require('compression-webpack-plugin')
const JavaScriptObfuscator = require('webpack-obfuscator')

module.exports = {
  publicPath: '/',
  devServer: { port: 80, open: false },
  lintOnSave: false,
  productionSourceMap: false,



  configureWebpack: config => {
    const plugins = [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/, // 增加 svg
        threshold: 10240,
        minRatio: 0.8
      })
    ]
    if (process.env.NODE_ENV === 'production') {
      plugins.push(
        new JavaScriptObfuscator({
          compact: true,
          identifierNamesGenerator: 'hexadecimal',
          stringArray: true,
          stringArrayThreshold: 0.75,
          // 【优化 2】更平衡的混淆配置
          stringArrayEncoding: ['base64'], // 替代 deadCodeInjection，安全且更快
          deadCodeInjection: false,
          controlFlowFlattening: false, // 除非非常核心的算法，否则不建议开启，会极大地拖慢运行速度
        }, [
          'node_modules/**',
          'js/chunk-vendors**',
          'js/app**',
          'js/!(admin-)*.js',
          'js/seo.js'
        ])
      )

      // 【优化 3】Terser 细化配置
      if (config.optimization && config.optimization.minimizer) {
        config.optimization.minimizer[0].options.terserOptions.compress = {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
          // 增加：移除无用代码
          unused: true,
          dead_code: true
        }
      }
    }
    config.plugins = [...config.plugins, ...plugins]
  },

  chainWebpack: config => {
    // 【优化 4】资源预加载策略
    // 移除 prefetch，防止首屏加载时偷偷下载所有后续页面 JS 导致带宽抢占
    config.plugins.delete('prefetch')

    // 允许 iconify-icon 网页组件
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          isCustomElement: tag => tag.includes('-')
        }
        return options
      })

    if (process.env.NODE_ENV === 'production') {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
           vendors: {

            name: 'chunk-vendors',

            test: /[\\/]node_modules[\\/]/,

            priority: 10,

            chunks: 'initial'

          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            reuseExistingChunk: true
          }
        }
      })
    }
  }
}
