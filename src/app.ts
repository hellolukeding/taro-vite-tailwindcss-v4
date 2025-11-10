import { useLaunch } from '@tarojs/taro'
import { PropsWithChildren } from 'react'
// Taroify 全局样式 - 在 Vite 模式下 babel-plugin-import 可能不生效，使用全局引入
import "@taroify/core/index.scss"
import "@taroify/icons/index.scss"

import './app.css'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}



export default App
