import NaviBar from '@/components/NaviBar'
import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.css'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='w-screen h-screen '>
      <NaviBar />
    </View>

  )
}
