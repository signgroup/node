module.exports = {
  publicPath: './',
  // 部署应用时的基本 URL
  // 输出文件目录 vue ui build 也可配置
  outputDir: 'dist',
  // 放置生成的静态资源（js、css、img、fonts）的相对路径
  assetsDir: './static',
  // html 的输出路径 默认index
  indexPath: 'index.html',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  productionSourceMap: false, // 关闭js map文件
  devServer: {
    port: 9901,
    hotOnly: true, // 热更新
    proxy: {
      '/api': {
        target: 'http://localhost:3005',
        changeOrigin: true,//如果需要跨域那么需要加上参数changeOrigin:true
        ws: true,
        pathRewrite: {
            '^/api': ''// 替换target中的请求地址
        }
    }
    },
  },

};
