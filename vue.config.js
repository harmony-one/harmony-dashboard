const isProduction = process.env.NODE_ENV === 'production'
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  productionSourceMap: isProduction ? false : true,
  chainWebpack(config) {
    if (!isProduction) return
    config.plugin('CompressionPlugin').use(CompressionPlugin)
  },
}
