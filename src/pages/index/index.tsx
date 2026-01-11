import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'
import { WorkCard } from '@/components/business/WorkCard'
import { mockWorks, mockCategories } from '@/mock/square'
import { mockUser } from '@/mock/user'
import { useState } from 'react'
import './index.css'

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [searchText, setSearchText] = useState('')

  return (
    <View className='index-page'>
      {/* 黑色圆角头部 */}
      <View className='page-header'>
        {/* 顶部导航 */}
        <View className='header-nav'>
          {/* 位置选择器 */}
          <View className='location-selector'>
            <Text className='text-white text-sm font-medium'>北京</Text>
            <Icon name='expand_more' size={20} color='white' />
          </View>

          {/* 右侧图标 */}
          <View className='header-icons'>
            <View className='icon-btn'>
              <Icon name='notifications' size={20} color='white' />
            </View>
            <Image
              src={mockUser.avatar}
              className='avatar'
              mode='aspectFill'
            />
          </View>
        </View>

        {/* 搜索框 */}
        <View className='search-container'>
          <Icon
            name='search'
            size={20}
            color='#6B7280'
            className='search-icon'
          />
          <Input
            className='search-input'
            placeholder='搜索提示词、风格、创作者...'
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      {/* 主内容区域 */}
      <ScrollView scrollY className='page-content'>
        {/* 分类Pills */}
        <View className='category-section'>
          <ScrollView scrollX className='category-scroll'>
            {mockCategories.map((category, index) => (
              <View
                key={category}
                onClick={() => setSelectedCategory(index)}
                className={`category-pill ${selectedCategory === index ? 'active' : ''}`}
              >
                <Text className={`text-sm font-medium ${selectedCategory === index ? 'text-white' : 'text-gray-600'}`}>
                  {category}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 瀑布流作品列表 - 使用左右两列布局 */}
        <View className='works-section'>
          {/* 左列 */}
          <View className='work-column'>
            {mockWorks.filter((_, i) => i % 2 === 0).map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </View>
          {/* 右列 */}
          <View className='work-column'>
            {mockWorks.filter((_, i) => i % 2 === 1).map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <View className='bottom-nav-container'>
        <View className='nav-content'>
          {/* 广场 */}
          <View className='nav-item active'>
            <Icon name='grid_view' size={26} filled />
            <Text className='nav-text'>广场</Text>
          </View>

          {/* 创作 */}
          <View className='nav-item'>
            <View className='create-btn'>
              <Icon name='add_photo_alternate' size={24} />
            </View>
            <Text className='nav-text'>创作</Text>
          </View>

          {/* 消息 */}
          <View className='nav-item'>
            <Icon name='chat_bubble_outline' size={26} />
            <Text className='nav-text'>消息</Text>
          </View>

          {/* 我的 */}
          <View className='nav-item'>
            <View className='nav-item-wrapper'>
              <Icon name='person' size={26} filled />
              <View className='nav-dot' />
            </View>
            <Text className='nav-text-bold'>我的</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
