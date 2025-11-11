import { useLaunch } from '@tarojs/taro'
import { PropsWithChildren } from 'react'
// Taroify 全局样式 - 在 Vite 模式下 babel-plugin-import 可能不生效，使用全局引入
import "@taroify/core/index.scss"
import "@taroify/icons/index.scss"

import './app.css'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')

    // 注释掉外部字体加载，改用系统字体以避免网络加载问题
    // 动态加载文风字体 - 萌开文学霞玉体
    // 注意：字体链接必须是 HTTPS，且需要开启 CORS 支持
    // Taro.loadFontFace({
    //   family: 'wenfeng-mkwxy',
    //   source: 'url("https://app.windfonts.com/api/css?family=wenfeng-mkwxy:wght@regular")',
    //   global: true,
    //   success: (res) => {
    //     console.log('字体加载成功', res)
    //   },
    //   fail: (err) => {
    //     console.error('字体加载失败', err)
    //   }
    // })
  })

  // children 是将要会渲染的页面
  return children
}



export default App
