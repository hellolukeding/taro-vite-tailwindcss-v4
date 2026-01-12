import { BottomNav } from '@/components/business/BottomNav'
import { Icon } from '@/components/common/Icon'
import { mockCategories, mockWorks } from '@/mock/square'
import { Search, Tabs } from "@taroify/core"
import { Image, ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState(0)


  const handleClick = (index: string) => {
    Taro.navigateTo({
      url: '/pages/prompt-detail/index?id=' + mockWorks[index].id,
    })
  }
  return (
    <View className='page'>
      {/* 黑色圆角头部 */}
      <View className='header'>
        {/* 顶部导航 */}


        {/* 搜索框
        <View className='search-box'>
          <Icon name='search' size={20} color='#6B7280' className='search-icon' />
          <Input
            className='search-field'
            placeholder='搜索提示词、风格、创作者...'
          />
        </View> */}

        <Search
          className='search-bar-black'
          shape='rounded'
          placeholder='请输入搜索关键词'
          clearable
        />
      </View>

      {/* 主内容区域 */}
      <ScrollView scrollY className='content'>
        <View className='w-full mb-2'>
          <Tabs >
            {mockCategories.map((category, index) => {
              return (
                <Tabs.TabPane title={category} key={category}></Tabs.TabPane>

              )
            })}
          </Tabs>
        </View>

        {/* 瀑布流作品列表 */}
        <View className='works'>
          {/* 左列 */}
          <View className='column'>
            {mockWorks.filter((_, i) => i % 2 === 0).map((work) => (
              <View key={work.id} className='work-card' onClick={() => {
                handleClick(work.id)
              }}
              >
                <Image src={work.imageUrl} className='work-img' mode='aspectFill' />
                {work.isVIP && <View className='vip-tag'>VIP</View>}
                <Text className='work-prompt text-lg'>{work.prompt}</Text>
                <View className='work-footer'>
                  <View className='work-author'>
                    <Image src={work.creator.avatar} className='author-avatar' mode='aspectFill' />
                    <Text className='author-name'>{work.creator.name}</Text>
                  </View>
                  <View className='work-likes'>
                    <Icon name='favorite' size={14} color='#F43F5E' />
                    <Text className='likes-num'>{work.likes}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* 右列 */}
          <View className='column'>
            {mockWorks.filter((_, i) => i % 2 === 1).map((work) => (
              <View key={work.id} className='work-card'>
                <Image src={work.imageUrl} className='work-img' mode='aspectFill' />
                {work.isVIP && <View className='vip-tag'>VIP</View>}
                <Text className='work-prompt'>{work.prompt}</Text>
                <View className='work-footer'>
                  <View className='work-author'>
                    <Image src={work.creator.avatar} className='author-avatar' mode='aspectFill' />
                    <Text className='author-name'>{work.creator.name}</Text>
                  </View>
                  <View className='work-likes'>
                    <Icon name='favorite' size={14} color='#F43F5E' />
                    <Text className='likes-num'>{work.likes}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>


      {/* 底部导航栏 */}
      <BottomNav />
    </View>
  )
}
