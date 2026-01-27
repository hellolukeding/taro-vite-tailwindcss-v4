import { studioApi } from '@/api/studio'
import { BottomNav } from '@/components/business/BottomNav'
import { WorkCard } from '@/components/WorkCard'
import { BASE_PAGE_SIZE } from '@/utils/constants'
import { Search, Tabs } from "@taroify/core"
import { ScrollView, Text, View } from '@tarojs/components'
import Taro, { useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { VirtualWaterfall } from '@tarojs/components-advanced'
import useRequest from 'ahooks/lib/useRequest'
import { useMemo, useRef, useState } from 'react'
import './index.css'

// 获取系统信息计算列表高度
const systemInfo = Taro.getSystemInfoSync()
const windowHeight = systemInfo.windowHeight
const headerHeight = 120 // 头部高度
const tabsHeight = 50 // 标签高度
const listHeight = windowHeight - headerHeight - tabsHeight

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [promptsList, setPromptsList] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined)

  const waterfallRef = useRef<any>(null)

  // 使用 useRequest 获取分类列表
  const { data: categoriesData, loading: categoriesLoading } = useRequest(() => studioApi.getCategories())

  // 获取提示词列表
  const fetchPrompts = async (page: number, tag?: string) => {
    try {
      setLoading(true)
      const params = Object.fromEntries(
        Object.entries({
          page,
          page_size: BASE_PAGE_SIZE,
          tag,
        }).filter(([_, value]) => value !== undefined)
      )
      const result = await studioApi.getPrompts(params)
      console.log('[VirtualWaterfall] fetchPrompts result:', result)

      if (page === 1) {
        // 第一页，替换数据
        setPromptsList(result?.items ?? [])
      } else {
        // 加载更多，追加数据
        setPromptsList(prev => [...prev, ...(result?.items ?? [])])
      }
      setHasMore(result?.has_more ?? false)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useRequest(() => studioApi.getPrompts({ page: 1, page_size: BASE_PAGE_SIZE }), {
    onSuccess: (result) => {
      console.log('[VirtualWaterfall] Initial load result:', result)
      setPromptsList(result?.items ?? [])
      setHasMore(result?.has_more ?? false)
    },
  })

  // 组合分类数据，添加"全部"选项
  const categories = useMemo(() => {
    if (!categoriesData) return ['全部']
    return ['全部', ...categoriesData]
  }, [categoriesData])

  // 处理分类切换
  const handleCategoryChange = (index: number) => {
    const category = categories[index]
    setSelectedCategory(index)

    const newTag = category === '全部' ? undefined : category
    setCurrentTag(newTag)
    setPromptsList([])

    // 重新加载第一页
    fetchPrompts(1, newTag)
  }

  // 下拉刷新
  usePullDownRefresh(async () => {
    await fetchPrompts(1, currentTag)
    Taro.stopPullDownRefresh()
  })

  // 上拉加载更多
  useReachBottom(() => {
    if (!hasMore || loading) return
    const nextPage = Math.floor(promptsList.length / BASE_PAGE_SIZE) + 1
    fetchPrompts(nextPage, currentTag)
  })

  // 搜索功能
  const handleSearch = (value: string) => {
    // TODO: 实现搜索功能
    console.log('Search:', value)
  }

  return (
    <View className='page'>
      {/* 黑色圆角头部 */}
      <View className='header'>
        <Search
          className='search-bar-black'
          shape='rounded'
          placeholder='请输入搜索关键词'
          clearable
          onSearch={handleSearch}
        />
      </View>

      {/* 分类标签 */}
      <View className='tabs-container'>
        {categoriesLoading ? (
          <View className='flex justify-center p-4'>
            <Text>加载中...</Text>
          </View>
        ) : (
          <Tabs value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category: string) => {
              return (
                <Tabs.TabPane title={category} key={category}></Tabs.TabPane>
              )
            })}
          </Tabs>
        )}
      </View>

      {/* 虚拟瀑布流列表 */}
      <View className='waterfall-container'>
        {promptsList.length > 0 ? (
          <VirtualWaterfall
            ref={waterfallRef}
            height={listHeight}
            width='100%'
            column={2}
            columnWidth={0}
            item={WorkCard}
            itemData={promptsList}
            itemCount={promptsList.length}
            itemSize={(index: number) => {
              // 根据图片高度动态计算单项高度
              const work = promptsList[index]
              // 基础高度 200px + 标题和底部信息约 100px
              return 300 + Math.random() * 100
            }}
            unlimitedSize={true}
            overscanDistance={200}
            onScrollToLower={() => {
              if (!hasMore || loading) return
              const nextPage = Math.floor(promptsList.length / BASE_PAGE_SIZE) + 1
              fetchPrompts(nextPage, currentTag)
            }}
            lowerThreshold={100}
          />
        ) : (
          <View className='flex flex-col items-center justify-center p-8' style={{ height: listHeight }}>
            <Text className='text-gray-400'>
              {loading ? '加载中...' : '暂无数据'}
            </Text>
          </View>
        )}

        {/* 加载更多提示 */}
        {promptsList.length > 0 && (
          <View className='flex justify-center p-4'>
            <Text className='text-gray-500 text-sm'>
              {loading ? '加载中...' : hasMore ? '上拉加载更多' : '没有更多了'}
            </Text>
          </View>
        )}
      </View>

      {/* 底部导航栏 */}
      <BottomNav />
    </View>
  )
}
