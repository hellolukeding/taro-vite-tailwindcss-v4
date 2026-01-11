import { ScrollView, Text, View } from '@tarojs/components'
import React from 'react'
import PromptCard from './PromptCard'
import { PromptSquareProps } from './types'

const PromptSquare: React.FC<PromptSquareProps> = ({ data }) => {
  // 将数据分成两列
  const leftColumn = data.filter((_, index) => index % 2 === 0)
  const rightColumn = data.filter((_, index) => index % 2 === 1)

  // 处理卡片点击
  const handleCardClick = (item: any) => {
    console.log('Card clicked:', item)
    // TODO: 跳转到详情页
  }

  // 处理使用按钮
  const handleUsePrompt = (item: any) => {
    console.log('Use prompt:', item)
    // TODO: 跳转到生成页面
  }

  // 获取卡片高度
  const getCardHeight = (id: number) => {
    return id % 2 === 0
      ? `${120 + (id % 3) * 40}px`
      : `${160 + (id % 3) * 30}px`
  }

  return (
    <View className='flex-1 bg-white pt-10'>
      {/* 顶部标题 */}
      <View className='bg-white px-4 py-4 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-800'>点皴</Text>
        <Text className='text-sm text-gray-500 mt-1'>发现并使用优质提示词模板</Text>
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
            {leftColumn.map((item) => (
              <PromptCard
                key={item.id}
                item={item}
                height={getCardHeight(item.id)}
                onClick={handleCardClick}
                onUse={handleUsePrompt}
              />
            ))}
          </View>

          {/* 右列 */}
          <View className='flex-1 flex flex-col gap-3'>
            {rightColumn.map((item) => (
              <PromptCard
                key={item.id}
                item={item}
                height={getCardHeight(item.id)}
                onClick={handleCardClick}
                onUse={handleUsePrompt}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default PromptSquare
