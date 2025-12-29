import { Image, ScrollView, Text, View } from '@tarojs/components'
import React from 'react'
import { PromptItem, PromptSquareProps } from './types'

const PromptSquare: React.FC<PromptSquareProps> = ({ data }) => {
  // 将数据分成两列
  const leftColumn = data.filter((_, index) => index % 2 === 0)
  const rightColumn = data.filter((_, index) => index % 2 === 1)

  // 渲染单个卡片
  const renderCard = (item: PromptItem) => {
    const height = item.id % 2 === 0
      ? `${120 + (item.id % 3) * 40}px`
      : `${160 + (item.id % 3) * 30}px`

    return (
      <View
        key={item.id}
        className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'
      >
        {/* 图片内容 */}
        <View className='w-full bg-gray-100 overflow-hidden' style={{ height }}>
          <Image
            src={item.image}
            className='w-full h-full'
            mode='aspectFill'
          />
        </View>

        {/* 内容区域 */}
        <View className='p-3'>
          {/* 标题 */}
          <Text className='font-semibold text-gray-800 text-sm mb-1 line-clamp-2'>
            {item.title}
          </Text>

          {/* 描述 */}
          <Text className='text-xs text-gray-500 mb-2 line-clamp-2'>
            {item.desc}
          </Text>

          {/* 头像和作者信息 */}
          <View className='flex items-center justify-between mb-2'>
            <View className='flex items-center'>
              <Image
                src={item.avatar}
                className='w-6 h-6 rounded-full mr-1'
                mode='aspectFill'
              />
              <Text className='text-xs text-gray-400'>用户{item.id}</Text>
            </View>
          </View>

          {/* 底部操作栏 */}
          <View className='flex items-center justify-between pt-2 border-t border-gray-50'>
            <View className='flex items-center space-x-2'>
              <View className='flex items-center text-gray-500 text-xs'>
                <Text>❤️</Text>
                <Text className='ml-1'>{item.likes}</Text>
              </View>
              <View className='flex items-center text-gray-500 text-xs'>
                <Text>💬</Text>
                <Text className='ml-1'>{item.comments}</Text>
              </View>
            </View>
            <View className='px-2 py-1 bg-theme-primary rounded-full'>
              <Text className='text-white text-xs font-medium'>使用</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-white pt-10'>
      {/* 顶部标题 */}
      <View className='bg-white px-4 py-4 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-800'>点皴</Text>
        {/* <Text className='text-sm text-gray-500 mt-1'>发现并使用优质提示词模板</Text> */}

      </View>

      {/* 瀑布流内容 */}
      <ScrollView
        className='flex-1'
        scrollY
        style={{ height: 'calc(100vh - 140px)' }}
      >
        <View className='p-3 flex flex-row gap-3'>
          {/* 左列 */}
          <View className='flex-1 flex flex-col gap-3'>
            {leftColumn.map(renderCard)}
          </View>

          {/* 右列 */}
          <View className='flex-1 flex flex-col gap-3'>
            {rightColumn.map(renderCard)}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default PromptSquare
