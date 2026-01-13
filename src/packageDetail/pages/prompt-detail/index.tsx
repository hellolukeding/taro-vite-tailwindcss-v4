import CommonWarp from '@/components/CommonWarp'
import { CommentInputBar } from '@/components/business/CommentInputBar'
import { CommentItem } from '@/components/business/CommentItem'
import { ParameterGrid } from '@/components/business/ParameterGrid'
import { PromptDetailHero } from '@/components/business/PromptDetailHero'
import { PromptSection } from '@/components/business/PromptSection'
import { SocialActionBar } from '@/components/business/SocialActionBar'
import { mockPromptDetail } from '@/mock/promptDetail'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface PromptDetailProps {
  id?: string
}

const PromptDetail: React.FC<PromptDetailProps> = () => {
  const data = mockPromptDetail

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleFullscreen = () => {
    Taro.previewImage({
      urls: [data.imageUrl],
      current: data.imageUrl,
    })
  }

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
    })
  }

  return (
    <CommonWarp title='详情' withHeader>
      <View className='w-full h-full bg-gray-50 flex flex-col'>


        <ScrollView scrollY className='flex-1 pb-24'>
          {/* Hero Image */}
          <PromptDetailHero imageUrl={data.imageUrl} onFullscreen={handleFullscreen} />

          {/* Main Content */}
          <View className='px-4 py-5 flex flex-col gap-8'>
            {/* Prompt Section */}
            <PromptSection prompt={data.prompt} params={data.params} />

            {/* Social Actions */}
            <SocialActionBar
              likes={data.likes}
              bookmarks={data.bookmarks}
              onShare={handleShare}
            />

            {/* Divider */}
            <View className='h-px bg-gray-200 w-full' />

            {/* Parameters */}
            <ParameterGrid
              model={data.model}
              ratio={data.ratio}
              steps={data.steps}
              seed={data.seed}
              sampler={data.sampler}
            />

            {/* Divider */}
            <View className='h-px bg-gray-200 w-full' />

            {/* Comments Section */}
            <View className='flex flex-col gap-5'>
              {/* Header */}
              <View className='flex items-center justify-between'>
                <View className='flex items-center gap-2'>
                  <View className='w-1 h-5 bg-blue-600 rounded-full' />
                  <Text className='text-lg font-bold text-gray-900'>
                    评论区{' '}
                    <Text className='text-sm font-normal text-gray-500'>({data.comments.length})</Text>
                  </Text>
                </View>
                <Text className='text-xs text-blue-600 font-medium'>按热度</Text>
              </View>

              {/* Comment List */}
              <View className='flex flex-col gap-6'>
                {data.comments.map((comment) => (
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
            </View>
          </View>
        </ScrollView>

        {/* Bottom Input Bar */}
        <CommentInputBar />
      </View>
    </CommonWarp>
  )
}

export default PromptDetail
