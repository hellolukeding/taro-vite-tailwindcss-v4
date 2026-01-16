import { useLaunch } from '@tarojs/taro'
import { PropsWithChildren } from 'react'
import { UserProvider, TaskPollingProvider } from '@/store'
// Taroify 全局样式 - 在 Vite 模式下 babel-plugin-import 可能不生效，使用全局引入
import "@taroify/core/index.scss"
import "@taroify/icons/index.scss"

import './app.css'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  return (
    <UserProvider>
      <TaskPollingProvider>
        { children }
      </TaskPollingProvider>
    </UserProvider>
  )
}

export default App
