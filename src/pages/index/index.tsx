import { studioApi } from '@/api/studio'
import { CategoryTabs } from '@/components/business/CategoryTabs'
import { EmptyState } from '@/components/business/EmptyState'
import { SearchBar } from '@/components/business/SearchBar'
import { VirtualWaterfall } from '@/components/business/VirtualWaterfall'
import { useAuth } from '@/hooks/useAuth'
import { BASE_PAGE_SIZE } from '@/utils/constants'
import { FloatingBubble } from '@taroify/core'
import { ArrowUp, Shrink } from '@taroify/icons'
import { Image, Input, Text, View } from '@tarojs/components'
import Taro, { nextTick } from '@tarojs/taro'
import useRequest from 'ahooks/lib/useRequest'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [headerCollapsed, setHeaderCollapsed] = useState(false)
  const scrollViewRef = useRef<any>(null)

  // 全屏编辑状态
  const [isFullscreenEdit, setIsFullscreenEdit] = useState(false)
  const [fullscreenKeyword, setFullscreenKeyword] = useState("")
  const inputRef = useRef<any>(null)

  // 使用 useRequest 获取分类列表
  const { data: categoriesData, loading } = useRequest(() => studioApi.getCategories(), {
    onSuccess: (result) => {
      // console.log('[Index] getCategories success:', result);
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

  // 全屏编辑处理
  const handleOpenFullscreen = () => {
    setFullscreenKeyword(searchKeyword)
    setIsFullscreenEdit(true)
    // 锁定页面滚动
    nextTick(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    })
  }

  const handleCloseFullscreen = () => {
    setIsFullscreenEdit(false)
    setSearchKeyword(fullscreenKeyword)
    // 如果内容有变化，触发搜索
    if (fullscreenKeyword !== searchKeyword) {
      setTimeout(() => {
        handleSearch()
      }, 100)
    }
  }

  const handleFullscreenSearch = () => {
    setSearchKeyword(fullscreenKeyword)
    setIsFullscreenEdit(false)
    handleSearch()
  }

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

    if (!categoriesData) return ['全部']
    const result = ['全部', ...categoriesData]

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

  // 处理滚动事件
  const handleScroll = (e: any) => {
    const scrollTop = e.detail.scrollTop

    // 当滚动超过300px时显示悬浮按钮
    setShowScrollTop(scrollTop > 300)

    // 当滚动超过80px时，收缩header并隐藏搜索框
    if (scrollTop > 80) {
      setHeaderCollapsed(true)
    } else {
      setHeaderCollapsed(false)
    }
  }

  // 滚动到顶部
  const scrollToTop = () => {
    // 使用随机值确保每次参数都不同，触发 Taro 的视图更新
    setScrollTop(0 + Math.random())
  }


  return (
    <View className='page'>
      {/* 黑色圆角头部 */}
      <View
        className='rounded-b-4xl bg-black'
        style={{
          opacity: 1,
          paddingTop: '50px',
          paddingBottom: '16px',
          maxHeight: '500px',
          transform: 'translateY(0) scale(1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(headerCollapsed ? {
            opacity: 0,
            maxHeight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            transform: 'translateY(-20px) scale(0.95)',
            pointerEvents: 'none'
          } : {})
        }}
      >
        <View className='flex items-center justify-between px-6 pb-4'>
          <Image src='https://i.urusai.cc/EOn68.png' className='h-20 w-20' />

          <View className='text-white flex-1 flex flex-col ml-4 text-xl font-semibold'>
            <Text className='text-2xl mb-2'>Hi,</Text>
            <Text>准备好用文字&quot;画&quot;画了吗?</Text>
          </View>
        </View>
        <SearchBar
          value={searchKeyword}
          onOpenFullscreen={handleOpenFullscreen}
        />
      </View>

      {/* 全屏编辑模式 */}
      {isFullscreenEdit && (
        <View className='fullscreen-edit-modal' catchMove>
          <View className='fullscreen-edit-header'>
            <Text className='fullscreen-edit-title'>搜索提示词</Text>
            <View className='fullscreen-edit-actions'>
              <Text
                className='fullscreen-edit-action'
                onClick={handleFullscreenSearch}
              >
                搜索
              </Text>
              <View className='fullscreen-edit-divider' />
              <View onClick={handleCloseFullscreen} className='fullscreen-edit-close'>
                <Shrink size={20} />
              </View>
            </View>
          </View>
          <View className='fullscreen-edit-content px-4'>
            <Input
              ref={inputRef}
              className='fullscreen-edit-input'
              placeholder='请输入搜索关键词...'
              value={fullscreenKeyword}
              onInput={(e) => setFullscreenKeyword(e.detail.value)}
              focus
              adjustPosition
              confirmType='search'
              onConfirm={handleFullscreenSearch}
            />
            <View className='fullscreen-edit-tips'>
              <Text className='text-sm text-gray-500'>
                💡 提示：按回车键快速搜索，点击收缩图标退出
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 主内容区域 */}
      <View className='content'>
        {/* 分类标签栏 */}
        <View className='w-full mb-2'>
          <CategoryTabs
            categories={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            loading={loading}
          />
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
        <View className='flex-1 overflow-hidden'>
          <VirtualWaterfall
            items={promptsList}
            loading={promptsLoading}
            hasMore={hasMore}
            onItemClick={(work) => handleClick(work.id)}
            onRefresh={handleRefresh}
            onLoadMore={handleLoadMore}
            renderEmpty={() => (
              <EmptyState
                type={isSearching ? 'no-search-result' : 'no-data'}
              />
            )}
          />
        </View>
      </View>

      {/* 滚动到顶部悬浮按钮 */}

      <FloatingBubble
        axis="xy"
        magnetic="x"
        gap={60}
        style={{
          backgroundColor: '#3f4245',
          display: showScrollTop ? "flex" : "none",
          transition: "ease-in-out",
          alignItems: "center",
          justifyContent: "center"
        }}

        onClick={scrollToTop}
        icon={<ArrowUp color='#fff' size={20} className='font-semibold' />}
      />

    </View>
  )
}
