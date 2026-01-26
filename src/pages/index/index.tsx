import { studioApi } from '@/api/studio'
// 注意：原生 tabBar 已启用，不再需要自定义 BottomNav 组件
// import { BottomNav } from '@/components/business/BottomNav'
import { useAuth } from '@/hooks/useAuth'
import { BASE_PAGE_SIZE } from '@/utils/constants'
import { normalizeUrl } from '@/utils/url'
import { Search, Tabs } from "@taroify/core"
import { GoodJobOutlined } from '@taroify/icons'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import useRequest from 'ahooks/lib/useRequest'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './index.css'

export default function Index() {
  const { requireLogin } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [promptsList, setPromptsList] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // 使用 useRequest 获取分类列表
  const { data: categoriesData, loading } = useRequest(() => studioApi.getCategories(), {
    onSuccess: (result) => {
      console.log('[Index] getCategories success:', result);
      console.log('[Index] Type:', typeof result);
      console.log('[Index] Is array:', Array.isArray(result));
    }
  })

  // 获取提示词列表
  const { loading: promptsLoading, run: fetchPrompts } = useRequest(
    (page: number, tag?: string) => {
      const params = Object.fromEntries(
        Object.entries({
          page,
          page_size: BASE_PAGE_SIZE,
          tag,
          keyword: searchKeyword || undefined,
        }).filter(([_, value]) => value !== undefined)
      )
      return studioApi.getPrompts(params)
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        const [page] = params
        console.log('[Index] fetchPrompts onSuccess, result:', result)
        if (page === 1) {
          // 第一页，替换数据
          setPromptsList(result?.items ?? [])
        } else {
          // 加载更多，追加数据
          setPromptsList(prev => [...prev, ...(result?.items ?? [])])
        }
        setHasMore(result?.has_more ?? false)
      },
    }
  )

  // 搜索处理
  const handleSearch = useCallback(() => {
    if (!searchKeyword.trim()) {
      // 清空搜索，显示全部
      setCurrentTag(undefined)
      setCurrentPage(1)
      setPromptsList([])
      fetchPrompts(1, undefined)
      return
    }

    setIsSearching(true)
    setCurrentPage(1)
    setPromptsList([])
    fetchPrompts(1, currentTag)
  }, [searchKeyword, currentTag, fetchPrompts])

  // 搜索防抖
  useEffect(() => {
    if (searchKeyword.trim()) {
      // 延迟搜索，避免频繁请求
      const timer = setTimeout(() => {
        handleSearch()
      }, 500)

      return () => clearTimeout(timer)
    } else if (isSearching) {
      // 清空搜索关键词时，恢复列表
      setIsSearching(false)
      fetchPrompts(1, currentTag)
    }
  }, [searchKeyword, isSearching, currentTag, fetchPrompts, handleSearch])

  // 初始加载
  useRequest(() => studioApi.getPrompts({ page: 1, page_size: BASE_PAGE_SIZE }), {
    onSuccess: (result) => {
      console.log('[Index] Initial load onSuccess, result:', result)
      setPromptsList(result?.items ?? [])
      setHasMore(result?.has_more ?? false)
    },
  })

  // 组合分类数据，添加"全部"选项
  const categories = useMemo(() => {
    console.log('[Index] Computing categories, categoriesData:', categoriesData);
    if (!categoriesData) return ['全部']
    const result = ['全部', ...categoriesData]
    console.log('[Index] Final categories:', result);
    return result
  }, [categoriesData])

  // 处理分类切换
  const handleCategoryChange = (index: number) => {
    const category = categories[index]
    setSelectedCategory(index)

    const newTag = category === '全部' ? undefined : category
    setCurrentPage(1)
    setCurrentTag(newTag)
    setPromptsList([])

    // 重新加载第一页
    fetchPrompts(1, newTag)
  }

  // 下拉刷新
  const handleRefresh = () => {
    setCurrentPage(1)
    setPromptsList([])
    fetchPrompts(1, currentTag)
  }

  // 上拉加载更多
  const handleLoadMore = () => {
    if (!hasMore || promptsLoading) return
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchPrompts(nextPage, currentTag)
  }

  const handleClick = (workId: string) => {
    // 查看详情需要登录
    if (!requireLogin()) return

    Taro.navigateTo({
      url: '/packageDetail/pages/prompt-detail/index?id=' + workId,
    })
  }


  return (
    <View className='page'>
      {/* 黑色圆角头部 */}
      <View className='header rounded-b-4xl'>
        <View className='flex items-center justify-between'>
          <Image src='https://i.urusai.cc/EOn68.png' className='h-20 w-20' />

          <View className='text-white flex-1 flex flex-col ml-4 text-xl font-semibold'>
            <Text className='text-2xl mb-2'>Hi,</Text>
            <Text>准备好用文字&quot;画&quot;画了吗?</Text>
          </View>
        </View>
        <Search
          className='search-bar-black'
          shape='rounded'
          placeholder='请输入搜索关键词'
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.detail.value)}
          onSearch={handleSearch}
          onClear={() => {
            setSearchKeyword("")
            setIsSearching(false)
          }}
          clearable
        />
      </View>

      {/* 主内容区域 */}
      <ScrollView
        scrollY
        className='content'
        refresherEnabled
        refresherTriggered={promptsLoading && currentPage === 1}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleLoadMore}
        lowerThreshold={100}
      >
        <View className='w-full mb-2'>
          {loading ? (
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

        {/* 搜索状态提示 */}
        {isSearching && (
          <View className='px-4 py-2 bg-blue-50 flex items-center justify-between'>
            <Text className='text-sm text-gray-600'>
              搜索结果: &quot;{searchKeyword}&quot;
            </Text>
            <Text
              className='text-sm text-blue-500'
              onClick={() => {
                setSearchKeyword("")
                setIsSearching(false)
              }}
            >
              清空
            </Text>
          </View>
        )}

        {/* 瀑布流作品列表 */}
        <View className='works pb-20'>
          {/* 左列 */}
          <View className='column'>
            {promptsList.filter((_, i) => i % 2 === 0).map((work) => (
              <View key={work.id} className='work-card' onClick={() => {
                handleClick(work.id)
              }}
              >
                <Image src={normalizeUrl(work.cover_image)} className='work-img' mode='aspectFill' lazyLoad />
                <Text className='work-prompt text-lg'>{work.title}</Text>
                <View className='work-footer'>
                  <View className='work-author'>
                    {work.creator?.avatar_url && (
                      <Image
                        src={normalizeUrl(work.creator?.avatar_url)}
                        className='author-avatar'
                        mode='aspectFill'
                      />
                    )}
                    <Text className='author-name'>{work.creator?.nickname || work.model}</Text>
                  </View>
                  <View className='work-stats'>
                    <View className='work-likes text-lg flex items-center justify-center'>
                      <GoodJobOutlined size={16} />
                      <Text className='stats-num ml-2'>{work.likes_count || 0}</Text>
                    </View>
                    {work.views_count > 0 && (
                      <Text className='views-num text-lg'>{work.views_count}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* 右列 */}
          <View className='column'>
            {promptsList.filter((_, i) => i % 2 === 1).map((work) => (
              <View key={work.id} className='work-card' onClick={() => {
                handleClick(work.id)
              }}
              >
                <Image src={normalizeUrl(work.cover_image)} className='work-img' mode='aspectFill' lazyLoad />
                <Text className='work-prompt text-lg'>{work.title}</Text>
                <View className='work-footer'>
                  <View className='work-author text-lg'>
                    {work.creator?.avatar_url && (
                      <Image
                        src={normalizeUrl(work.creator?.avatar_url)}
                        className='author-avatar'
                        mode='aspectFill'
                      />
                    )}
                    <Text className='author-name'>{work.creator?.nickname || work.model}</Text>
                  </View>
                  <View className='work-stats'>
                    <View className='work-likes text-lg flex items-center justify-center'>
                      <GoodJobOutlined size={16} />
                      <Text className='stats-num ml-2'>{work.likes_count || 0}</Text>
                    </View>
                    {work.views_count > 0 && (
                      <Text className='views-num text-lg'>{work.views_count}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 加载更多提示 */}
        {promptsList.length > 0 && (
          <View className='flex justify-center p-4'>
            <Text className='text-gray-500 text-sm'>
              {promptsLoading && currentPage > 1 ? '加载中...' : hasMore ? '上拉加载更多' : '没有更多了'}
            </Text>
          </View>
        )}

        {/* 空状态 */}
        {!promptsLoading && promptsList.length === 0 && (
          <View className='flex flex-col items-center justify-center p-8'>
            <Text className='text-gray-400'>暂无数据</Text>
          </View>
        )}
      </ScrollView>

      {/* 原生 tabBar 已启用，移除自定义底部导航栏 */}
    </View>
  )
}
