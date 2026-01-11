import { Image, Text, View } from '@tarojs/components'
import React from 'react'
import { PromptItem } from './types'

interface PromptCardProps {
  item: PromptItem
  height: string
  onUse?: (item: PromptItem) => void
  onClick?: (item: PromptItem) => void
}

const PromptCard: React.FC<PromptCardProps> = ({ item, height, onUse, onClick }) => {
  return (
    <View
      className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 active:opacity-80'
      onClick={() => onClick?.(item)}
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
          <View
            className='px-2 py-1 bg-theme-primary rounded-full active:scale-95 transition-transform'
            onClick={(e) => {
              e.stopPropagation()
              onUse?.(item)
            }}
          >
            <Text className='text-white text-xs font-medium'>使用</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PromptCard
