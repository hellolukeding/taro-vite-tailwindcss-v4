import CommonHeader from '@/components/CommonHeader'
import CommonWarp from '@/components/CommonWarp'
import { CommentInputBar } from '@/components/business/CommentInputBar'
import { CommentItem } from '@/components/business/CommentItem'
import { ParameterGrid } from '@/components/business/ParameterGrid'
import { PromptDetailHero } from '@/components/business/PromptDetailHero'
import { PromptSection } from '@/components/business/PromptSection'
import { SocialActionBar } from '@/components/business/SocialActionBar'
import { mockPromptDetail } from '@/mock/promptDetail'
import { ScrollView, Text, View } from '@tarojs/components'
import { Button } from '@taroify/core'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface PromptDetailProps {
  id?: string
}

interface PromptDetailState {
  loading: boolean
  error: string | null
  data: any | null
  liking: boolean
  bookmarking: boolean
}

const PromptDetail: React.FC<PromptDetailProps> = () => {
  const { requireLoginRedirect } = useAuth()
  const [state, setState] = useState<PromptDetailState>({
    loading: false,
    error: null,
    data: mockPromptDetail,
    liking: false,
    bookmarking: false,
  })

  useEffect(() => {
    // 页面加载时检查登录,未登录直接跳转
    requireLoginRedirect()
  }, [])

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleFullscreen = () => {
    Taro.previewImage({
      urls: [state.data.imageUrl],
      current: state.data.imageUrl,
    })
  }

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
    })
  }

  // 加载状态
  if (state.loading) {
    return (
      <CommonWarp title='' withHeader={false}>
        <CommonHeader title='详情' withBack onBack={handleBack}>
          <View className='w-full h-full bg-white'>
            {/* 骨架屏 */}
            <View className='w-full aspect-4/5 bg-gray-200 animate-pulse rounded-b-4xl' />
            <View className='px-4 py-6 space-y-6'>
              <View className='h-32 bg-gray-200 rounded-2xl animate-pulse' />
              <View className='h-24 bg-gray-200 rounded-2xl animate-pulse' />
              <View className='h-24 bg-gray-200 rounded-2xl animate-pulse' />
            </View>
          </View>
        </CommonHeader>
      </CommonWarp>
    )
  }

  // 错误状态
  if (state.error) {
    return (
      <CommonWarp title='' withHeader={false}>
        <CommonHeader title='详情' withBack onBack={handleBack}>
          <View className='w-full h-full bg-white flex items-center justify-center'>
            <View className='text-center px-4'>
              <Text className='text-6xl mb-4'>⚠️</Text>
              <Text className='text-gray-900 text-lg font-semibold mb-2'>加载失败</Text>
              <Text className='text-gray-500 text-sm mb-6'>{state.error}</Text>
              <Button color='black' shape='round' onClick={() => setState(prev => ({ ...prev, error: null, loading: true }))}>
                重新加载
              </Button>
            </View>
          </View>
        </CommonHeader>
      </CommonWarp>
    )
  }

  return (
    <CommonWarp title='' withHeader={false}>
      <CommonHeader title='详情' withBack onBack={handleBack}>
        <View className='w-full h-full bg-white flex flex-col'>
          <ScrollView scrollY className='flex-1 pb-24'>
            {/* Hero Image */}
            <PromptDetailHero imageUrl={state.data.imageUrl} onFullscreen={handleFullscreen} />

            {/* Main Content */}
            <View className='px-4 py-6 flex flex-col space-y-6'>
              {/* Prompt Section */}
              <PromptSection prompt={state.data.prompt} params={state.data.params} />

              {/* Social Actions */}
              <SocialActionBar
                likes={state.data.likes}
                bookmarks={state.data.bookmarks}
                liked={state.data.liked}
                bookmarked={state.data.bookmarked}
                onShare={handleShare}
              />

              {/* Divider */}
              <View className='h-px bg-gray-200 w-full' />

              {/* Parameters */}
              <ParameterGrid
                model={state.data.model}
                ratio={state.data.ratio}
                steps={state.data.steps}
                seed={state.data.seed}
                sampler={state.data.sampler}
              />

              {/* Divider */}
              <View className='h-px bg-gray-200 w-full' />

              {/* Comments Section */}
              <View className='flex flex-col space-y-5'>
                {/* Header */}
                <View className='flex items-center justify-between'>
                  <View className='flex items-center gap-2'>
                    <View className='w-1.5 h-6 bg-black rounded-full' />
                    <Text className='text-lg font-bold text-gray-900'>
                      评论区{' '}
                      <Text className='text-sm font-normal text-gray-500'>({state.data.comments.length})</Text>
                    </Text>
                  </View>
                  <Text className='text-xs text-gray-500 font-medium'>按热度</Text>
                </View>

                {/* Comment List */}
                {state.data.comments.length === 0 ? (
                  <View className='flex flex-col items-center justify-center py-20'>
                    <Text className='text-6xl mb-4'>💬</Text>
                    <Text className='text-gray-900 text-lg font-semibold mb-2'>暂无评论</Text>
                    <Text className='text-gray-500 text-sm'>快来发表第一条评论吧</Text>
                  </View>
                ) : (
                  <View className='flex flex-col space-y-6'>
                    {state.data.comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        avatar={comment.avatar}
                        username={comment.username}
                        time={comment.time}
                        content={comment.content}
                        likes={comment.likes}
                      />
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Input Bar */}
          <CommentInputBar />
        </View>
      </CommonHeader>
    </CommonWarp>
  )
}

export default PromptDetail
