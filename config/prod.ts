import type { UserConfigExport } from "@tarojs/cli"

export default {
  mini: {
    // 小程序端生产环境优化
    // 优化主包
    optimizeMainPackage: {
      enable: true
    },

    // 小程序基础库版本（使用较新的基础库以获得更好的性能）
    // 支持 lazyCodeLoading 的最低版本：2.10.2
    // 建议使用：2.19.2 或更高
    minified: true, // 压缩代码

    // 移除 console.log（生产环境）
    debug: false,
  },
  h5: {
    // 确保产物为 es5
    legacy: true,
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain) {
    //   /**
    //    * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
    //    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
    //    */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    //   /**
    //    * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首页。
    //    * @docs https://github.com/chrisvfritz/prerender-spa-plugin
    //    */
    //   const path = require('path')
    //   const Prerender = require('prerender-spa-plugin')
    //   const staticDir = path.join(__dirname, '..', 'dist')
    //   chain
    //     .plugin('prerender')
    //     .use(new Prerender({
    //       staticDir,
    //       routes: [ '/pages/index/index' ],
    //       postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
    //     }))
    // }
  }
} satisfies UserConfigExport<'vite'>
